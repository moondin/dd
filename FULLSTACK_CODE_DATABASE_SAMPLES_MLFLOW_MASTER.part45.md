---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 45
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 45 of 991)

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

---[FILE: grids.css]---
Location: mlflow-master/docs/api_reference/theme/mlflow/static/css/grids.css

```text

.grid-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: white;
    font-size: 1rem;
    color: darkslategray;
    box-shadow: rgba(3, 8, 20, 0.1) 0px 0.5rem 1rem, rgba(2, 8, 20, 0.1) 0.1px 0.25rem 0.275rem;
    height: 100%;
    width: 100%;
    border-radius: 10px;
    transition: all 500ms;
    overflow: hidden;
    padding: .5rem;
    margin: 2rem;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
 }
  
.grid-card:hover {
    box-shadow: rgba(2, 8, 20, 0.1) 0px 0.35em 1.175em, rgba(2, 8, 20, 0.08) 0px 0.175em 0.5em;
    transform: translateY(-3px) scale(1.1);
 }

 .new-content-grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    margin-right: 5rem;
    padding-bottom: 4rem;
 }

 .grid-card .content-container {
    display: flex;
    flex-direction: column;
    align-items: center; 
    width: 100%; 
    margin-top: 1rem;
}

 .grid-card .header {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    position: relative;
    line-height: 1.5rem;
    height: 6rem;
    overflow: hidden;
}

.grid-card .header:after {
    content: '';
    display: block;
    margin: 1rem auto 1rem;
    width: calc(100% - 8rem);
    border-bottom: 1px solid #000;
}

.grid-card .card-image {
    max-width: 80%; 
    max-height: 6rem; 
    display: block;
    margin: 0 auto; 
    padding-bottom: 2rem;
}

.grid-card .body {
    font-size: 0.9rem;
    margin-bottom: 1rem;
    width:calc(100% - 4rem);
}

.grid-card .body a {
    color: hsl(208, 98%, 43%);
}

.grid-card .doc, 
.grid-card .tag {
    position: absolute;
    bottom: 1rem;
    font-size: 0.75rem;
}

.grid-card .doc {
    left: 1rem;
}

.grid-card .tag {
    right: 1rem;
}

.grid-card .doc a, 
.grid-card .tag a {
    text-decoration: none;
    font-weight: bold;
    border: 2px solid lightskyblue;
    color: darkslategray;
    border-radius: 12px;
    padding: 2px 8px;
    transition: all 0.3s;
}

.grid-card .doc a:hover, 
.grid-card .tag a:hover {
    background: black;
    text-shadow: none;
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-box-decoration-break: clone;
    background-clip: text;
    border-color: darkblue;
}
```

--------------------------------------------------------------------------------

---[FILE: mobile.css]---
Location: mlflow-master/docs/api_reference/theme/mlflow/static/css/mobile.css

```text
/*
 * Custom CSSs for optimizing mobile view
 *
 * *** PLEASE DO NOT OVERUSE *** as having two different styles reduces maintainability.
 */


/* Mobile styling */
@media only screen and (max-width: 768px) {
    /*
    * Fix table overflow issue on mobile. Sphinx apply no word wrapping by default,
    * resulted in showing very wide 1-line cells on mobile.
    * To apply those CSSs to your table, add `:class wrap-table` to your table
    */
    .wy-table-responsive .wrap-table td {
        max-width: 300px;
        white-space: normal;
    }

    /*
    * Handle layout for the tab contents in the tracking page
    */
    .tracking-responsive-tab-panel {
        flex-direction: column;
     }

    .tracking-responsive-tab-panel img {
        width: 100%;
        margin: 10px auto;
    }

    .tracking-responsive-tab-panel div {
        width: 100%;
        padding: 0 10px;
    }

    .tracking-responsive-tab-panel video {
        max-width: 100%;
        padding: 0 10px;
        height: auto;
    }

    /*
    * Make the tab headers stand in one horizontal row (and reduce padding)
    */
    .tracking-responsive-tabs .sphinx-tabs > div[aria-label="Tabbed content"][role="tablist"] {
        display: flex;
    }

    .tracking-responsive-tabs .sphinx-tabs-tab {
        padding: 0.75rem 0;
    }
}

/* Desktop styling corresponding to above styles*/
@media only screen and (min-width: 768px) {
    .tracking-responsive-tab-panel img {
        width: 30%;
        margin: auto 20px;
    }

    .tracking-responsive-tab-panel div {
        width: 70%;
        padding: 0 20px;
    }

    .tracking-responsive-tab-panel video {
        max-width: 90%;
        padding: 0 10px;
        height: auto;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: simple-cards.css]---
Location: mlflow-master/docs/api_reference/theme/mlflow/static/css/simple-cards.css

```text
.simple-grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    margin-right: 5rem;
    padding-bottom: 4rem;
 }

.simple-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: white;
    font-size: 1rem;
    color: darkslategray;
    height: 100%;
    width: 100%;
    border-radius: 10px;
    transition: all 500ms;
    overflow: hidden;
    padding: .5rem;
    margin: 2rem;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    box-shadow: rgba(2, 8, 20, 0.3) 0.4rem 0.8rem 1.6rem, rgba(2, 8, 20, 0.1) 0rem 0.4rem 3px;
    cursor: pointer;
}

.simple-card:hover {
    box-shadow: rgba(2, 8, 20, 0.25) 0.5rem 2.5rem 5rem, rgba(2, 8, 20, 0.35) 0rem 1.5rem 1.65rem;
}

.simple-card:hover .header {
    color: steelblue;
}

 .simple-card .header {
    text-align: left; 
    font-size: 1.5rem;
    font-weight: 600;
    margin: 2rem;
    margin-top: 3rem;
    position: relative;
    height: calc(5rem + 1.2em); 
    display: flex;
    overflow: hidden; 
}

.simple-card .header-with-image {
    text-align: left; 
    font-size: 1.5rem;
    font-weight: 600;
    margin: 1rem 2rem;
    position: relative;
    height: calc(5rem + 1.2em);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.simple-card a {
    display: block;
    height: 100%;
    text-decoration: none;
    color: inherit;
    position: relative;
}

.simple-card a:hover {
    text-decoration: none;
}

.simple-card p {
    color: darkslategrey;
    font-size: 1rem;
    margin: 1rem 2rem; 
    text-align: left; 
}
```

--------------------------------------------------------------------------------

---[FILE: tabs.css]---
Location: mlflow-master/docs/api_reference/theme/mlflow/static/css/tabs.css

```text
/*!
 * tabs.css from Sphinx Tabs: https://github.com/executablebooks/sphinx-tabs/blob/eac2a227ca0d375bad3706cf1cf170d760510a22/sphinx_tabs/static/tabs.css
 * MIT License (https://github.com/djungelorm/sphinx-tabs/blob/master/LICENSE)
 *
 * Sphinx Tabs is an extension for Sphinx which adds tabbed views for content in Sphinx documentation.
 */

.sphinx-tabs {
margin-bottom: 1rem;
}

[role="tablist"] {
border-bottom: 1px solid #a0b3bf;
}

.sphinx-tabs-tab {
position: relative;
font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
color: #1D5C87;
line-height: 24px;
margin: 0;
font-size: 16px;
font-weight: 400;
background-color: rgba(255, 255, 255, 0);
border-radius: 5px 5px 0 0;
border: 0;
padding: 1rem 1.5rem;
margin-bottom: 0;
}

.sphinx-tabs-tab[aria-selected="true"] {
font-weight: 700;
border: 1px solid #a0b3bf;
border-bottom: 1px solid white;
margin: -1px;
background-color: white;
}

.sphinx-tabs-tab:focus {
z-index: 1;
outline-offset: 1px;
}

.sphinx-tabs-panel {
position: relative;
padding: 1rem;
border: 1px solid #a0b3bf;
margin: 0px -1px -1px -1px;
border-radius: 0 0 5px 5px;
border-top: 0;
background: white;
}

.sphinx-tabs-panel.code-tab {
padding: 0.4rem;
}

.sphinx-tab img {
    margin-bottom: 24 px;
}

/* Dark theme preference styling */

@media (prefers-color-scheme: dark) {
body[data-theme="auto"] .sphinx-tabs-panel {
    color: white;
    background-color: rgb(50, 50, 50);
}

body[data-theme="auto"] .sphinx-tabs-tab {
    color: white;
    background-color: rgba(255, 255, 255, 0.05);
}

body[data-theme="auto"] .sphinx-tabs-tab[aria-selected="true"] {
    border-bottom: 1px solid rgb(50, 50, 50);
    background-color: rgb(50, 50, 50);
}
}

/* Explicit dark theme styling */

body[data-theme="dark"] .sphinx-tabs-panel {
color: white;
background-color: rgb(50, 50, 50);
}

body[data-theme="dark"] .sphinx-tabs-tab {
color: white;
background-color: rgba(255, 255, 255, 0.05);
}

body[data-theme="dark"] .sphinx-tabs-tab[aria-selected="true"] {
border-bottom: 2px solid rgb(50, 50, 50);
background-color: rgb(50, 50, 50);
}

/*
 * Main Landing page Tab display panes
 */

 .main-container {
    margin: 1rem;
    text-align: left;
    min-height: 500px;
}

.main-container h3 {
    margin-bottom: 30px;
}

.sub-container-two-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

@media (max-width: 600px) {
    .sub-container-two-columns {
        display: flex;
        flex-direction: column;
    }
}

.text-box {
    display: flex;
    flex-direction: column;
    justify-content: center; 
}

.text-box h4 {
    margin-bottom: 30px;
}

.text-box p {
    padding-left: 20px;
}

.image-box img {
    width: 100%;
    height: auto;
    max-height: 400px;
    object-fit: scale-down;
}

.icon-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
    gap: 20px;
    margin-top: 40px;
}


.icon-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 10px;
    box-sizing: border-box;
    height: 100%;
    justify-content: center;
    margin-right: 30px;
}

.icon-box img {
    cursor: pointer;
    max-width: 100%;
    max-height: 100px;
    height: auto;
    margin-bottom: 20px;
}

.icon-box p {
    margin-top: auto;
    font-size: 16px;
    font-weight: 300;
    color: #666;
}

/*
 * Additional Custom CSS
 */

 /* Handling mobile view for the tab widget in the tracking page */
 .tracking-responsive-tab-container {
    display: flex;
 }

.tracking-responsive-tab-container h4 {
    margin-bottom: 20px;
}
```

--------------------------------------------------------------------------------

````

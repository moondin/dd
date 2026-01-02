---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 830
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 830 of 851)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - ImageMagick-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/ImageMagick-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: color-modes.js]---
Location: ImageMagick-main/www/assets/color-modes.js

```javascript
/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2023 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

(() => {
  const getStoredTheme = () => localStorage.getItem('theme')
  const setStoredTheme = theme => localStorage.setItem('theme', theme)

  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme()
    if (storedTheme) {
      return storedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const setTheme = theme => {
    if (theme === 'auto') {
      document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme)
    }
  }

  setTheme(getPreferredTheme())

  const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher = document.querySelector('#bd-theme')

    if (!themeSwitcher) {
      return
    }

    const themeSwitcherText = document.querySelector('#bd-theme-text')
    const activeThemeIcon = document.querySelector('.theme-icon-active use')
    const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
    const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href')

    document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
      element.classList.remove('active')
      element.setAttribute('aria-pressed', 'false')
    })

    btnToActive.classList.add('active')
    btnToActive.setAttribute('aria-pressed', 'true')
    activeThemeIcon.setAttribute('href', svgOfActiveBtn)
    const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
    themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)

    if (focus) {
      themeSwitcher.focus()
    }
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const storedTheme = getStoredTheme()
    if (storedTheme !== 'light' && storedTheme !== 'dark') {
      setTheme(getPreferredTheme())
    }
  })

  window.addEventListener('DOMContentLoaded', () => {
    showActiveTheme(getPreferredTheme())

    document.querySelectorAll('[data-bs-theme-value]')
      .forEach(toggle => {
        toggle.addEventListener('click', () => {
          const theme = toggle.getAttribute('data-bs-theme-value')
          setStoredTheme(theme)
          setTheme(theme)
          showActiveTheme(theme, true)
        })
      })
  })
})()
```

--------------------------------------------------------------------------------

---[FILE: color-converter.html]---
Location: ImageMagick-main/www/contrib/color-converter.html

```text
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="generator" content="HTML Tidy for Linux (vers 25 March 2009), see www.w3.org" />
<title></title>
</head>
<body>
</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: color-swatch.html]---
Location: ImageMagick-main/www/contrib/color-swatch.html

```text
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="generator" content="HTML Tidy for Linux (vers 25 March 2009), see www.w3.org" />
<title></title>
</head>
<body>
</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: Blob.html]---
Location: ImageMagick-main/www/Magick++/Blob.html

```text
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Magick++ API: Working with Blobs</title>
    <link rel="stylesheet" href="magick.css" type="text/css" />
</head>
<body>
    <div class="doc-section">
        <h1 align="center">Magick::Blob</h1>
        <p>Blob provides the means to contain any opaque data. It is named after the term "Binary Large OBject" commonly used to describe unstructured data (such as encoded images) which is stored in a database. While the function of Blob is very simple (store a pointer and size associated with allocated data), the Blob class provides some very useful capabilities. In particular, it is fully reference counted just like the Image class.</p>
        <p>The Blob class supports value assignment while preserving any outstanding earlier versions of the object. Since assignment is via a pointer internally, Blob is efficient enough to be stored directly in an STL container or any other data structure which requires assignment. In particular, by storing a Blob in an <a href="http://www.sgi.com/tech/stl/AssociativeContainer.html">associative container</a> (such as STL's '<a href="http://www.sgi.com/tech/stl/Map.html"><i>map</i></a>') it is possible to create simple indexed in-memory "database" of Blobs.</p>
        <p>Magick++ currently uses Blob to contain encoded images (e.g. JPEG) as well as ICC and IPTC profiles. Since Blob is a general-purpose class, it may be used for other purposes as well.</p>
        <p style="margin-bottom: 0cm">The methods Blob provides are shown in the following table:</p>
        <br />
        <p align="center" style="margin-bottom: 0cm"><b>Blob Methods</b></p>
        <table width="100%" border="1" cellpadding="2" cellspacing="2">
            <tr>
                <td>
                    <p align="center"><b>Method</b></p>
                </td>
                <td>
                    <p align="center"><b>Return Type</b></p>
                </td>
                <td>
                    <p align="center"><b>Signature(s)</b></p>
                </td>
                <td>
                    <p align="center"><b>Description</b></p>
                </td>
            </tr>
            <tr>
                <td rowspan="3">
                    <p><a name="Blob"></a><font size="2">Blob</font></p>
                </td>
                <td rowspan="3" bgcolor="#666666"></td>
                <td>
                    <p><font size="2">void</font></p>
                </td>
                <td>
                    <p><font size="2">Default constructor</font></p>
                </td>
            </tr>
            <tr>
                <td>
                    <p><font size="2">const void* data_, const size_t length_</font></p>
                </td>
                <td>
                    <p><font size="2">Construct object with data, making a copy of the supplied data</font></p>
                </td>
            </tr>
            <tr>
                <td>
                    <p><font size="2">const Blob&amp; blob_</font></p>
                </td>
                <td>
                    <p><font size="2">Copy constructor (reference counted)</font></p>
                </td>
            </tr>
            <tr>
                <td>
                    <p><a name="operator="></a><font size="2">operator=</font></p>
                </td>
                <td>
                    <p><font size="2">Blob</font></p>
                </td>
                <td>
                    <p><font size="2">const Blob&amp; blob_</font></p>
                </td>
                <td>
                    <p><font size="2">Assignment operator (reference counted)</font></p>
                </td>
            </tr>
            <tr>
                <td rowspan="2">
                    <p><a name="base64"></a><font size="2">base64</font></p>
                </td>
                <td>
                    <p><font size="2">void</font></p>
                </td>
                <td>
                    <p><font size="2">const std::string base64_</font></p>
                </td>
                <td>
                    <p><font size="2">Update object contents from Base64-encoded string representation.</font></p>
                </td>
            </tr>
            <tr>
                <td>
                    <p><font size="2">std::string</font></p>
                </td>
                <td>
                    <p><font size="2">void</font></p>
                </td>
                <td>
                    <p><font size="2">Return Base64-encoded string representation.</font></p>
                </td>
            </tr>
            <tr>
                <td>
                    <p><a name="data"></a><font size="2">data</font></p>
                </td>
                <td>
                    <p><font size="2">const void*</font></p>
                </td>
                <td>
                    <p><font size="2">void</font></p>
                </td>
                <td>
                    <p><font size="2">Obtain pointer to data. The user should never try to modify or free this data since the Blob class manages its own data. The user must be finished with the data before allowing the Blob to be destroyed since the pointer is invalid once the Blob is destroyed.</font></p>
                </td>
            </tr>
            <tr>
                <td>
                    <p><a name="length"></a><font size="2">length</font></p>
                </td>
                <td>
                    <p><font size="2">size_t</font></p>
                </td>
                <td>
                    <p><font size="2">void</font></p>
                </td>
                <td>
                    <p><font size="2">Obtain data length.</font></p>
                </td>
            </tr>
            <tr>
                <td>
                    <p><a name="update"></a><font size="2">update</font></p>
                </td>
                <td>
                    <p><font size="2">void</font></p>
                </td>
                <td>
                    <p><font size="2">const void* data_, const size_t length_</font></p>
                </td>
                <td>
                    <p><font size="2">Update object contents, making a copy of the supplied data. Any existing data in the object is deallocated.</font></p>
                </td>
            </tr>
            <tr>
                <td>
                    <p><a name="updateNoCopy"></a><font size="2">updateNoCopy</font></p>
                </td>
                <td>
                    <p><font size="2">void</font></p>
                </td>
                <td>
                    <p><font size="2">void* data_, const size_t length_, const Allocator allocator_=NewAllocator</font></p>
                </td>
                <td>
                    <p><font size="2">Update object contents, using supplied pointer directly (no copy) Any existing data in the object is deallocated. The user must ensure that the pointer supplied is not deleted or otherwise modified after it has been supplied to this method. The optional allocator_ parameter allows the user to specify if the C (MallocAllocator) or C++ (NewAllocator) memory allocation system was used to allocate the memory. The default is to use the C++ memory allocator.</font></p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: Cache.fig]---
Location: ImageMagick-main/www/Magick++/Cache.fig

```text
#FIG 3.2
Landscape
Center
Inches
Letter 
100.00
Single
0
1200 2
1 3 0 3 4 4 0 0 20 0.000 1 0.0000 2715 3030 31 31 2715 3030 2745 3037
2 1 0 1 0 7 0 0 -1 0.000 0 0 -1 1 0 2
	1 1 1.00 60.00 120.00
	 1200 3300 1200 2100
2 1 0 1 0 7 0 0 -1 0.000 0 0 -1 1 0 2
	1 1 1.00 60.00 120.00
	 2925 1875 1500 1875
2 1 0 1 0 7 0 0 -1 0.000 0 0 -1 1 0 2
	1 1 1.00 60.00 120.00
	 3825 1875 4800 1875
2 1 0 1 0 7 0 0 -1 0.000 0 0 -1 1 0 2
	1 1 1.00 60.00 120.00
	 1200 3600 1200 4800
2 2 0 1 0 6 9 0 30 0.000 0 0 -1 0 0 5
	 2325 2700 4125 2700 4125 3825 2325 3825 2325 2700
2 2 0 1 0 2 10 0 30 0.000 0 0 7 0 0 5
	 1500 2100 4800 2100 4800 4800 1500 4800 1500 2100
2 2 0 1 7 7 11 0 20 0.000 0 0 -1 0 0 5
	 900 1500 5100 1500 5100 5100 900 5100 900 1500
4 1 0 0 0 16 12 0.0000 4 180 810 3375 1950 columns()\001
4 2 0 0 0 16 12 0.0000 4 180 510 1500 3525 rows()\001
4 0 0 0 0 16 12 0.0000 4 165 255 1575 2325 0,0\001
4 1 0 0 0 16 12 0.0000 4 180 795 3375 2625 columns_\001
4 1 0 0 0 16 12 0.0000 4 135 225 2325 2625 x,y\001
4 2 0 0 0 16 12 0.0000 4 135 495 2250 3300 rows_\001
4 0 0 0 0 16 12 0.0000 4 135 405 2730 3232 Pixel\001
```

--------------------------------------------------------------------------------

---[FILE: Cache.svg]---
Location: ImageMagick-main/www/Magick++/Cache.svg

```text
<?xml version="1.0" encoding="ISO-8859-1" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20000303 Stylable//EN"
"http://www.w3.org/TR/2000/03/WD-SVG-20000303/DTD/svg-20000303-stylable.dtd">
<svg width="8in" height="8in" viewBox="0 0 1 1" preserveAspectRatio="none">
<title>SVG drawing</title>
<desc>This was produced by version 4.1 of GNU libplot, a free library for exporting 2-D vector graphics.</desc>
<rect x="0" y="0" width="1" height="1" style="stroke:none;fill:white;"/>
<g transform="translate(-0.03125,1.1875) scale(1,-1) scale(0.0017361) " xml:space="preserve" style="stroke:black;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10.433;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;fill:none;fill-rule:even-odd;fill-opacity:1;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size-adjust:none;letter-spacing:normal;word-spacing:normal;text-anchor:start;">
<polygon points="0.99976,1.0002 253,1.0002 253,217 0.99976,217 " style="stroke:white;stroke-width:0;fill:white;"/>
<polygon points="0.99976,1.0002 253,1.0002 253,217 0.99976,217 " style="stroke:white;stroke-width:0.45;"/>
<polygon points="37,19 235,19 235,181 37,181 " style="stroke:#7fff7f;stroke-width:0;fill:#7fff7f;"/>
<polygon points="37,19 235,19 235,181 37,181 " style="stroke-width:0.45;"/>
<polygon points="86.5,77.5 194.5,77.5 194.5,145 86.5,145 " style="stroke:#ffff7f;stroke-width:0;fill:#ffff7f;"/>
<polygon points="86.5,77.5 194.5,77.5 194.5,145 86.5,145 " style="stroke-width:0.45;"/>
<line x1="19" y1="109" x2="19" y2="181" style="stroke-width:0.45;"/>
<polygon points="17.2,172.18 19,179.38 20.8,172.18 19,172.18 " style="stroke-width:0;fill:black;"/>
<polygon points="17.2,172.18 19,179.38 20.8,172.18 19,172.18 " style="stroke-width:0.45;"/>
<line x1="122.5" y1="194.5" x2="37" y2="194.5" style="stroke-width:0.45;"/>
<polygon points="45.82,192.7 38.62,194.5 45.82,196.3 45.82,194.5 " style="stroke-width:0;fill:black;"/>
<polygon points="45.82,192.7 38.62,194.5 45.82,196.3 45.82,194.5 " style="stroke-width:0.45;"/>
<line x1="176.5" y1="194.5" x2="235" y2="194.5" style="stroke-width:0.45;"/>
<polygon points="226.18,196.3 233.38,194.5 226.18,192.7 226.18,194.5 " style="stroke-width:0;fill:black;"/>
<polygon points="226.18,196.3 233.38,194.5 226.18,192.7 226.18,194.5 " style="stroke-width:0.45;"/>
<line x1="19" y1="91" x2="19" y2="19" style="stroke-width:0.45;"/>
<polygon points="20.8,27.82 19,20.62 17.2,27.82 19,27.82 " style="stroke-width:0;fill:black;"/>
<polygon points="20.8,27.82 19,20.62 17.2,27.82 19,27.82 " style="stroke-width:0.45;"/>
<path d="M111.76,125.2 L111.76,125.1 L111.75,125.01 L111.74,124.92 L111.72,124.83 L111.7,124.74 L111.68,124.65 L111.65,124.56 L111.61,124.48 L111.58,124.39 L111.54,124.31 L111.49,124.24 L111.44,124.16 L111.39,124.09 L111.34,124.02 L111.28,123.95 L111.22,123.88 L111.15,123.82 L111.08,123.76 L111.01,123.71 L110.94,123.66 L110.86,123.61 L110.79,123.56 L110.71,123.52 L110.62,123.49 L110.54,123.45 L110.45,123.42 L110.36,123.4 L110.27,123.38 L110.18,123.36 L110.09,123.35 L110,123.34 L109.9,123.34 C108.87,123.34,108.04,124.17,108.04,125.2 C108.04,126.23,108.87,127.06,109.9,127.06 C110.93,127.06,111.76,126.23,111.76,125.2 Z " style="stroke:red;stroke-width:0;fill:red;"/>
<path d="M111.76,125.2 L111.76,125.1 L111.75,125.01 L111.74,124.92 L111.72,124.83 L111.7,124.74 L111.68,124.65 L111.65,124.56 L111.61,124.48 L111.58,124.39 L111.54,124.31 L111.49,124.24 L111.44,124.16 L111.39,124.09 L111.34,124.02 L111.28,123.95 L111.22,123.88 L111.15,123.82 L111.08,123.76 L111.01,123.71 L110.94,123.66 L110.86,123.61 L110.79,123.56 L110.71,123.52 L110.62,123.49 L110.54,123.45 L110.45,123.42 L110.36,123.4 L110.27,123.38 L110.18,123.36 L110.09,123.35 L110,123.34 L109.9,123.34 C108.87,123.34,108.04,124.17,108.04,125.2 C108.04,126.23,108.87,127.06,109.9,127.06 C110.93,127.06,111.76,126.23,111.76,125.2 Z " style="stroke:red;stroke-width:1.8;"/>
<text transform="translate(125.8,190) scale(1,-1) " style="font-family:'Helvetica',sans-serif;font-size:10.8;stroke:none;fill:black;">columns()</text>
<text transform="translate(7.0093,95.5) scale(1,-1) " style="font-family:'Helvetica',sans-serif;font-size:10.8;stroke:none;fill:black;">rows()</text>
<text transform="translate(41.5,167.5) scale(1,-1) " style="font-family:'Helvetica',sans-serif;font-size:10.8;stroke:none;fill:black;">0,0</text>
<text transform="translate(126.39,149.5) scale(1,-1) " style="font-family:'Helvetica',sans-serif;font-size:10.8;stroke:none;fill:black;">columns_</text>
<text transform="translate(79.599,149.5) scale(1,-1) " style="font-family:'Helvetica',sans-serif;font-size:10.8;stroke:none;fill:black;">x,y</text>
<text transform="translate(53.197,109) scale(1,-1) " style="font-family:'Helvetica',sans-serif;font-size:10.8;stroke:none;fill:black;">rows_</text>
<text transform="translate(110.8,113.08) scale(1,-1) " style="font-family:'Helvetica',sans-serif;font-size:10.8;stroke:none;fill:black;">Pixel</text>
</g>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: ChangeLog.html]---
Location: ImageMagick-main/www/Magick++/ChangeLog.html

```text
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="generator" content="HTML Tidy for Linux (vers 25 March 2009), see www.w3.org" />
<title></title>
</head>
<body>
</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: CoderInfo.html]---
Location: ImageMagick-main/www/Magick++/CoderInfo.html

```text
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>Magick++ API: Access Raw Image Pixels</title>
  <link rel="stylesheet" href="magick.css" type="text/css" />
</head>

<body>
  <div class="doc-section">
    <h3 align="center">Magick::CoderInfo</h3>
    <p>The <i>CoderInfo</i> class provides the means to provide information regarding ImageMagick support for an image format (designated by a magick string). It may be used to provide support for a specific named format (provided as an argument to the constructor), or as an element of a container when format support is queried using the <a href="STL.html#coderInfoList">coderInfoList()</a> templated function.</p>
    <p>The following code fragment illustrates how CoderInfo may be used.</p>
    <pre class="code">
CoderInfo info("GIF"); 
cout &lt; info->name() &lt;&lt; ": (" &lt;&lt; info->description() &lt;&lt; ") : "; 
cout &lt;&lt; "Readable = "; 
if ( info->isReadable() ) 
  cout &lt;&lt; "true"; 
else 
  cout &lt;&lt; "false"; 
cout &lt;&lt; ", "; 
cout &lt;&lt; "Writable = "; 
if ( info->isWritable() ) 
  cout &lt;&lt; "true"; 
else 
  cout &lt;&lt; "false"; 
cout &lt;&lt; ", "; 
cout &lt;&lt; "Multiframe = "; 
if ( info->isMultiframe() ) 
  cout &lt;&lt; "true"; 
else 
  cout &lt;&lt; "false"; 
cout &lt;&lt; endl;
</pre>
    <p style="margin-bottom: 0cm">The methods available in the <i>CoderInfo</i> class are shown in the following table:</p>
    <br />
    <ul>
      <p align="center" style="margin-bottom: 0cm"><b>CoderInfo Methods</b></p>
      <table width="100%" border="1" cellpadding="2" cellspacing="2">
        <tr>
          <td>
            <p align="center"><b>Method</b></p>
          </td>
          <td>
            <p align="center"><b>Returns</b></p>
          </td>
          <td>
            <p align="center"><b>Signature</b></p>
          </td>
          <td>
            <p align="center"><b>Description</b></p>
          </td>
        </tr>
        <tr>
          <td rowspan="3">
            <p align="center"><a name="CoderInfo"></a>
              <font size="2">CoderInfo</font>
            </p>
          </td>
          <td rowspan="3" bgcolor="#999999"></td>
          <td>
            <p>
              <font size="2">void</font>
            </p>
          </td>
          <td>
            <p>
              <font size="2">Default constructor</font>
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <p>
              <font size="2">const CoderInfo &coder_</font>
            </p>
          </td>
          <td>
            <p>
              <font size="2">Copy constructor</font>
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <p>
              <font size="2">const std::string &name_</font>
            </p>
          </td>
          <td>
            <p>
              <font size="2">Construct with coder name</font>
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <p align="center"><a name="name"></a>
              <font size="2">name</font>
            </p>
          </td>
          <td>
            <p>
              <font size="2">std::string</font>
            </p>
          </td>
          <td>
            <p>
              <font size="2">void</font>
            </p>
          </td>
          <td>
            <p>
              <font size="2">Format name (e.g. "GIF").</font>
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <p align="center"><a name="description"></a>
              <font size="2">description</font>
            </p>
          </td>
          <td>
            <p>
              <font size="2">std::string</font>
            </p>
          </td>
          <td>
            <p>
              <font size="2">void</font>
            </p>
          </td>
          <td>
            <p>
              <font size="2">Format description (e.g. "CompuServe graphics interchange format").</font>
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <p align="center"><a name="isReadable"></a>
              <font size="2">isReadable</font>
            </p>
          </td>
          <td>
            <p>
              <font size="2">bool</font>
            </p>
          </td>
          <td>
            <p>
              <font size="2">void</font>
            </p>
          </td>
          <td>
            <p>
              <font size="2">Format is readable.</font>
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <p align="center"><a name="isWritable"></a>
              <font size="2">isWritable</font>
            </p>
          </td>
          <td>
            <p>
              <font size="2">bool</font>
            </p>
          </td>
          <td>
            <p>
              <font size="2">void</font>
            </p>
          </td>
          <td>
            <p>
              <font size="2">Format is writeable.</font>
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <p align="center"><a name="isMultiFrame"></a>
              <font size="2">isMultiFrame</font>
            </p>
          </td>
          <td>
            <p>
              <font size="2">bool</font>
            </p>
          </td>
          <td>
            <p>
              <font size="2">void</font>
            </p>
          </td>
          <td>
            <p>
              <font size="2">Format supports multiple frames.</font>
            </p>
          </td>
        </tr>
      </table>
    </ul>
  </div>
</body>

</html>
```

--------------------------------------------------------------------------------

---[FILE: Color.html]---
Location: ImageMagick-main/www/Magick++/Color.html

```text
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Magick++ API: Working with Color</title>
<link rel="stylesheet" href="magick.css" type="text/css" />
</head>
<body>
<div class="doc-section">
<h1 align="center">Magick::Color</h1>
<p><a href="Color.html#Color">Color</a> is the base color class in Magick++. It is a simple container class for the pixel red, green, blue, and alpha values scaled to fit ImageMagick's Quantum size. Normally users will instantiate a class derived from Color which supports the color model that fits the needs of the application. The Color class may be constructed directly from an SVG-style color string.</p>
<h4>Quantum</h4>

The base type used to represent color samples in ImageMagick is the Quantum type. Pixels are represented by a structure of Quantum values. For example, an RGB pixel contains red, green, and blue quantums, while an RGBA pixel contains red, green, blue, and opacity quantums. The maximum value that a Quantum can attain is specified by a constant value represented by the MaxRGB define, which is itself determined by the number of bits in a Quantum. The QuantumDepth build option determines the number of bits in a Quantum.

<h4>Quantum</h4>

Quantum is the internal representation of a pixel in ImageMagick. ImageMagick may be compiled to support 32, 64, or 128 bit pixels of type Quantum. This is controlled by the value of the QuantumDepth define. The default is 32 bit pixels (QuantumDepth=8), which provides the best performance and the least resource consumption. If additional color precision or range is desired, then ImageMagick may be compiled with QuantumDepth=16 or QuantumDepth=32. The following table shows the relationship between QuantumDepth, the type of Quantum, and the overall Quantum size.
<p align="center" style="margin-bottom: 0cm"><b>Effect Of QuantumDepth Values</b></p>
<center>
<table width="361" border="1" cellpadding="2" cellspacing="3">
<col width="102" />
<col width="121" />
<col width="111" />
<tr>
<td width="102">
<p align="center"><b>QuantumDepth</b></p></td>
<td width="121">
<p align="center"><b>Quantum Typedef</b></p></td>
<td width="111">
<p align="center"><b>Quantum Size</b></p></td></tr>
<tr>
<td width="102">
<p align="center">8</p></td>
<td width="121">
<p align="center">unsigned char</p></td>
<td width="111">
<p align="center">32 bits</p></td></tr>
<tr>
<td width="102">
<p align="center">16</p></td>
<td width="121">
<p align="center">unsigned short</p></td>
<td width="111">
<p align="center">64 bits</p></td></tr>
<tr>
<td width="102">
<p align="center">32</p></td>
<td width="121">
<p align="center">unsigned int</p></td>
<td width="111">
<p align="center">128 bits</p></td></tr>
</table></center>
<h3><a name="Color"></a>Color Class</h3>
<p>The Color base class is not intended to be used directly. Normally a user will construct a derived class or inherit from this class. Color arguments are must be scaled to fit the Quantum size. The Color class contains a pointer to a Quantum, which may be allocated by the Color class, or may refer to an existing pixel in an image.</p>
<p>An alternate way to construct the class is via an SVG-compatible color specification string (e.g. Color("red") or Color ("#FF0000")). Since the class may be constructed from a string, convenient strings may be passed in place of an explicit Color object in methods which accept a reference to Color. Color may also be converted to a std::string for convenience in user interfaces, and for saving settings to a text file.</p>
<div class="viewport">
class Color 
{ 
  public: 
    Color ( Quantum red_, 
     Quantum green_, 
     Quantum blue_ ); 
    Color ( Quantum red_, 
     Quantum green_, 
     Quantum blue_, 
     Quantum alpha_ ); 
    Color ( const std::string &amp;svgColor_ ); 
    Color ( const char * svgColor_ ); 
    Color ( void ); 
    virtual        ~Color ( void ); 
    Color ( const Color &amp; color_ );

    // Red color (range 0 to MaxRGB) 
    void           redQuantum ( Quantum red_ ); 
    Quantum        redQuantum ( void ) const;

    // Green color (range 0 to MaxRGB) 
    void           greenQuantum ( Quantum green_ ); 
    Quantum        greenQuantum ( void ) const;

    // Blue color (range 0 to MaxRGB) 
    void           blueQuantum ( Quantum blue_ ); 
    Quantum        blueQuantum ( void ) const;

    // Alpha level (range OpaqueOpacity=0 to TransparentOpacity=MaxRGB) 
    void           alphaQuantum ( Quantum alpha_ ); 
    Quantum        alphaQuantum ( void ) const;

    // Scaled (to 1.0) version of alpha for use in sub-classes 
    // (range opaque=0 to transparent=1.0) 
    void           alpha ( double alpha_ ); 
    double         alpha ( void ) const; 
  
    // Does object contain valid color? 
    void           isValid ( bool valid_ ); 
    bool           isValid ( void ) const; 
  
    // Set color via SVG color specification string 
    const Color&amp; operator= ( const std::string &amp; svgColor_ ); 
    const Color&amp; operator= ( const char * svgColor_ );

    // Assignment operator 
    Color&amp; operator= ( const Color&amp; color_ ); 
  
    // Return SVG color specification string 
    /* virtual */ operator std::string() const;

    // Return ImageMagick Quantum 
    operator Quantum() const;

    // Construct color via ImageMagick Quantum 
    Color ( const Quantum &amp;color_ );

    // Set color via ImageMagick Quantum 
    const Color&amp; operator= ( Quantum &amp;color_ ); 
};
</div>
<p align="center" style="margin-bottom: 0cm"><b>Color Derived Classes</b></p>
<table width="90%" border="1" cellpadding="2" cellspacing="3">
<col width="29*" />
<col width="227*" />
<tr>
<td width="12%">
<p><a href="Color.html#ColorRGB">ColorRGB</a></p></td>
<td width="88%">
<p>Representation of RGB color with red, green, and blue specified as ratios (0 to 1)</p></td></tr>
<tr>
<td width="12%">
<p><a href="Color.html#ColorGray">ColorGray</a></p></td>
<td width="88%">
<p>Representation of <span lang="en-US">grayscale</span> sRGB color (equal parts red, green, and blue) specified as a ratio (0 to 1)</p></td></tr>
<tr>
<td width="12%">
<p><a href="Color.html#ColorMono">ColorMono</a></p></td>
<td width="88%">
<p>Representation of a black/white color (true/false)</p></td></tr>
<tr>
<td width="12%">
<p><a href="Color.html#ColorYUV">ColorYUV</a></p></td>
<td width="88%">
<p>Representation of a color in the YUV <span lang="en-US">colorspace</span></p></td></tr></table>
<h3><a name="ColorRGB"></a>ColorRGB</h3>
<p>Representation of an sRGB color. All color arguments have a valid range of 0.0 - 1.0.</p>
<pre class="code">
class ColorRGB : public Color 
{ 
  public: 
    ColorRGB ( double red_, double green_, double blue_ ); 
    ColorRGB ( void ); 
    ColorRGB ( const Color &amp; color_ ); 
    /* virtual */  ~ColorRGB ( void ); 
  
    void           red ( double red_ ); 
    double         red ( void ) const; 
  
    void           green ( double green_ ); 
    double         green ( void ) const; 
  
    void           blue ( double blue_ ); 
    double         blue ( void ) const;

    // Assignment operator from base class 
    ColorRGB&amp; operator= ( const Color&amp; color_ ); 
}; 
</pre>
<h3><a name="ColorGray"></a>ColorGray</h3>
<p>Representation of a grayscale color (in linear colorspace). <span lang="en-US">Grayscale</span> is simply RGB with equal parts of red, green, and blue. All double arguments have a valid range of 0.0 - 1.0.</p>
<pre class="code">
class ColorGray : public Color 
{ 
  public: 
    ColorGray ( double shade_ ); 
    ColorGray ( void ); 
    ColorGray ( const Color &amp; color_ ); 
    /* virtual */ ~ColorGray ();

    void           shade ( double shade_ ); 
    double         shade ( void ) const;

    // Assignment operator from base class 
    ColorGray&amp; operator= ( const Color&amp; color_ ); 
}; 
</pre>
<h3><a name="ColorMono"></a>ColorMono</h3>
<p>Representation of a black/white pixel (in RGB colorspace). Color arguments are constrained to 'false' (black pixel) and 'true' (white pixel).</p>
<pre class="code">
class ColorMono : public Color 
{ 
  public: 
    ColorMono ( bool mono_ ); 
    ColorMono ( void ); 
    ColorMono ( const Color &amp; color_ ); 
    /* virtual */ ~ColorMono (); 
  
    void           mono ( bool mono_ ); 
    bool           mono ( void ) const;

    // Assignment operator from base class 
    ColorMono&amp; operator= ( const Color&amp; color_ ); 
}; 
</pre>
<h3><a name="ColorHSL"></a>ColorHSL</h3>
<p>Representation of a color in Hue/Saturation/Luminosity (HSL) colorspace.</p>
<pre class="code">
class ColorHSL : public Color 
{ 
  public: 
    ColorHSL ( double hue_, double saturation_, double luminosity_ ); 
    ColorHSL ( void ); 
    ColorHSL ( const Color &amp; color_ ); 
    /* virtual */  ~ColorHSL ( ); 
  
    void           hue ( double hue_ ); 
    double         hue ( void ) const; 
  
    void           saturation ( double saturation_ ); 
    double         saturation ( void ) const; 
  
    void           luminosity ( double luminosity_ ); 
    double         luminosity ( void ) const;

    // Assignment operator from base class 
    ColorHSL&amp; operator= ( const Color&amp; color_ ); 
}; 
</pre>
<h3><a name="ColorYUV"></a>ColorYUV</h3>
<p>Representation of a color in YUV colorspace (used to encode color for television transmission).</p>
<p>Argument ranges:</p>
<dl>
<dd> Y: 0.0 through 1.0</dd>
<dd> U: -0.5 through 0.5</dd>
<dd> V: -0.5 through 0.5</dd>
</dl>
<pre class="code">
class ColorYUV : public Color 
{ 
  public: 
    ColorYUV ( double y_, double u_, double v_ ); 
    ColorYUV ( void ); 
    ColorYUV ( const Color &amp; color_ ); 
    /* virtual */ ~ColorYUV ( void ); 
  
    void           u ( double u_ ); 
    double         u ( void ) const; 
  
    void           v ( double v_ ); 
    double         v ( void ) const; 
  
    void           y ( double y_ ); 
    double         y ( void ) const;

    // Assignment operator from base class 
    ColorYUV&amp; operator= ( const Color&amp; color_ ); 
}; 
</pre>
</div>
</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: COPYING]---
Location: ImageMagick-main/www/Magick++/COPYING

```text

Copyright 1999, 2000, 2001 Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
                                                                          
Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files ("Magick++"), to deal in Magick++ without restriction,
including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of
Magick++, and to permit persons to whom the Magick++ is furnished
to do so, subject to the following conditions:
                                                                          
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of Magick++.
                                                                          
The software is provided "as is", without warranty of any kind,
express or implied, including but not limited to the warranties of
merchantability, fitness for a particular purpose and
noninfringement. In no event shall Bob Friesenhahn be liable for
any claim, damages or other liability, whether in an action of
contract, tort or otherwise, arising from, out of or in connection
with Magick++ or the use or other dealings in Magick++.
```

--------------------------------------------------------------------------------

````

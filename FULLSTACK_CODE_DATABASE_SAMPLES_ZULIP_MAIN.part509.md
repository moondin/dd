---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 509
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 509 of 1290)

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

---[FILE: loader-white.svg]---
Location: zulip-main/static/images/loading/loader-white.svg

```text
<svg width="30px"  height="30px"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="background: none;"><g transform="rotate(0 50 50)">
  <rect x="47" y="15" rx="9.4" ry="3" width="6" height="20" fill="#ffffff">
    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(30 50 50)">
  <rect x="47" y="15" rx="9.4" ry="3" width="6" height="20" fill="#ffffff">
    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(60 50 50)">
  <rect x="47" y="15" rx="9.4" ry="3" width="6" height="20" fill="#ffffff">
    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(90 50 50)">
  <rect x="47" y="15" rx="9.4" ry="3" width="6" height="20" fill="#ffffff">
    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(120 50 50)">
  <rect x="47" y="15" rx="9.4" ry="3" width="6" height="20" fill="#ffffff">
    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(150 50 50)">
  <rect x="47" y="15" rx="9.4" ry="3" width="6" height="20" fill="#ffffff">
    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(180 50 50)">
  <rect x="47" y="15" rx="9.4" ry="3" width="6" height="20" fill="#ffffff">
    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(210 50 50)">
  <rect x="47" y="15" rx="9.4" ry="3" width="6" height="20" fill="#ffffff">
    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(240 50 50)">
  <rect x="47" y="15" rx="9.4" ry="3" width="6" height="20" fill="#ffffff">
    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(270 50 50)">
  <rect x="47" y="15" rx="9.4" ry="3" width="6" height="20" fill="#ffffff">
    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(300 50 50)">
  <rect x="47" y="15" rx="9.4" ry="3" width="6" height="20" fill="#ffffff">
    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(330 50 50)">
  <rect x="47" y="15" rx="9.4" ry="3" width="6" height="20" fill="#ffffff">
    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
  </rect>
</g></svg>
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: zulip-main/static/images/logo/README.md

```text
Generally, we prefer to use SVG assets when possible.

However, many websites where you might want to use a Zulip logo do not
support SVG files. If you need a Zulip logo asset in a different
format (e.g., a 512px height PNG), you can generate that from one of
the `.svg` files in this directory.

On Linux, you can generate a PNG of a given height using the following:

```
rsvg-convert -h 512 static/images/logo/zulip-org-logo.svg -o /tmp/zulip-org-logo-512.png
```
```

--------------------------------------------------------------------------------

---[FILE: zulip-icon-bimi.svg]---
Location: zulip-main/static/images/logo/zulip-icon-bimi.svg

```text
<svg xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny-ps" viewBox="0 0 773.12 773.12"><title>Zulip</title><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#50adff"/><stop offset="1" stop-color="#7877fc"/></linearGradient><path d="M0 0h773.12v773.12H0z" fill="url(#a)"/><path d="M566.66 527.25c0 33.03-24.23 60.05-53.84 60.05H260.29c-29.61 0-53.84-27.02-53.84-60.05 0-20.22 9.09-38.2 22.93-49.09l134.37-120c2.5-2.14 5.74 1.31 3.94 4.19l-49.29 98.69c-1.38 2.76.41 6.16 3.25 6.16h191.18c29.61 0 53.83 27.03 53.83 60.05zm0-281.39c0 20.22-9.09 38.2-22.93 49.09l-134.37 120c-2.5 2.14-5.74-1.31-3.94-4.19l49.29-98.69c1.38-2.76-.41-6.16-3.25-6.16H260.29c-29.61 0-53.84-27.02-53.84-60.05s24.23-60.05 53.84-60.05h252.54c29.61 0 53.83 27.02 53.83 60.05z" fill="#fff"/></svg>
```

--------------------------------------------------------------------------------

---[FILE: zulip-icon-circle.svg]---
Location: zulip-main/static/images/logo/zulip-icon-circle.svg

```text
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 773.12 773.12"><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#50adff"/><stop offset="1" stop-color="#7877fc"/></linearGradient><circle cx="386.56" cy="386.56" r="386.56" fill="url(#a)"/><path d="M566.66 527.25c0 33.03-24.23 60.05-53.84 60.05H260.29c-29.61 0-53.84-27.02-53.84-60.05 0-20.22 9.09-38.2 22.93-49.09l134.37-120c2.5-2.14 5.74 1.31 3.94 4.19l-49.29 98.69c-1.38 2.76.41 6.16 3.25 6.16h191.18c29.61 0 53.83 27.03 53.83 60.05zm0-281.39c0 20.22-9.09 38.2-22.93 49.09l-134.37 120c-2.5 2.14-5.74-1.31-3.94-4.19l49.29-98.69c1.38-2.76-.41-6.16-3.25-6.16H260.29c-29.61 0-53.84-27.02-53.84-60.05s24.23-60.05 53.84-60.05h252.54c29.61 0 53.83 27.02 53.83 60.05z" fill="#fff"/></svg>
```

--------------------------------------------------------------------------------

---[FILE: zulip-icon-square.svg]---
Location: zulip-main/static/images/logo/zulip-icon-square.svg

```text
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 773.12 773.12"><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#50adff"/><stop offset="1" stop-color="#7877fc"/></linearGradient><path d="M0 0h773.12v773.12H0z" fill="url(#a)"/><path d="M566.66 527.25c0 33.03-24.23 60.05-53.84 60.05H260.29c-29.61 0-53.84-27.02-53.84-60.05 0-20.22 9.09-38.2 22.93-49.09l134.37-120c2.5-2.14 5.74 1.31 3.94 4.19l-49.29 98.69c-1.38 2.76.41 6.16 3.25 6.16h191.18c29.61 0 53.83 27.03 53.83 60.05zm0-281.39c0 20.22-9.09 38.2-22.93 49.09l-134.37 120c-2.5 2.14-5.74-1.31-3.94-4.19l49.29-98.69c1.38-2.76-.41-6.16-3.25-6.16H260.29c-29.61 0-53.84-27.02-53.84-60.05s24.23-60.05 53.84-60.05h252.54c29.61 0 53.83 27.02 53.83 60.05z" fill="#fff"/></svg>
```

--------------------------------------------------------------------------------

---[FILE: zulip-org-logo.svg]---
Location: zulip-main/static/images/logo/zulip-org-logo.svg

```text
<svg xmlns="http://www.w3.org/2000/svg" viewBox="68.96 55.62 1742.12 450.43"><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#50adff"/><stop offset="1" stop-color="#7877fc"/></linearGradient><linearGradient id="b" x1="0" y1="-1" x2="0" y2="2"><stop offset="0" stop-color="#50adff"/><stop offset="1" stop-color="#7877fc"/></linearGradient><path fill="url(#a)" d="M473.09 122.97c0 22.69-10.19 42.85-25.72 55.08L296.61 312.69c-2.8 2.4-6.44-1.47-4.42-4.7l55.3-110.72c1.55-3.1-.46-6.91-3.64-6.91H129.36c-33.22 0-60.4-30.32-60.4-67.37 0-37.06 27.18-67.37 60.4-67.37h283.33c33.22-.02 60.4 30.3 60.4 67.35zM129.36 506.05h283.33c33.22 0 60.4-30.32 60.4-67.37 0-37.06-27.18-67.37-60.4-67.37H198.2c-3.18 0-5.19-3.81-3.64-6.91l55.3-110.72c2.02-3.23-1.62-7.1-4.42-4.7L94.68 383.6c-15.53 12.22-25.72 32.39-25.72 55.08 0 37.05 27.18 67.37 60.4 67.37z"/><path d="m651.86 381.9 124.78-179.6v-1.56H663.52v-48.98h190.09v34.21L731.55 363.24v1.56h124.01v48.98h-203.7V381.9zm338.98-230.14V302.6c0 45.09 17.1 68.03 47.43 68.03 31.1 0 48.2-21.77 48.2-68.03V151.76h59.09V298.7c0 80.86-40.82 119.34-109.24 119.34-66.09 0-104.96-36.54-104.96-120.12V151.76h59.48zm244.91 0h59.48v212.25h104.18v49.76h-163.66V151.76zm297 0v262.01h-59.48V151.76h59.48zm90.18 3.5c18.27-3.11 43.93-5.44 80.08-5.44 36.54 0 62.59 7 80.08 20.99 16.72 13.22 27.99 34.99 27.99 60.64 0 25.66-8.55 47.43-24.1 62.2-20.21 19.05-50.15 27.6-85.13 27.6-7.77 0-14.77-.39-20.21-1.17v93.69h-58.7V155.26zm58.7 118.96c5.05 1.17 11.27 1.55 19.83 1.55 31.49 0 50.92-15.94 50.92-42.76 0-24.1-16.72-38.49-46.26-38.49-12.05 0-20.21 1.17-24.49 2.33v77.37z" fill="url(#b)"/></svg>
```

--------------------------------------------------------------------------------

---[FILE: app-store-badge.svg]---
Location: zulip-main/static/images/store-badges/app-store-badge.svg

```text
<svg id="livetype" xmlns="http://www.w3.org/2000/svg" width="119.66407" height="40" viewBox="0 0 119.66407 40">
  <title>Download_on_the_App_Store_Badge_US-UK_RGB_blk_4SVG_092917</title>
  <g>
    <g>
      <g>
        <path d="M110.13477,0H9.53468c-.3667,0-.729,0-1.09473.002-.30615.002-.60986.00781-.91895.0127A13.21476,13.21476,0,0,0,5.5171.19141a6.66509,6.66509,0,0,0-1.90088.627A6.43779,6.43779,0,0,0,1.99757,1.99707,6.25844,6.25844,0,0,0,.81935,3.61816a6.60119,6.60119,0,0,0-.625,1.90332,12.993,12.993,0,0,0-.1792,2.002C.00587,7.83008.00489,8.1377,0,8.44434V31.5586c.00489.3105.00587.6113.01515.9219a12.99232,12.99232,0,0,0,.1792,2.0019,6.58756,6.58756,0,0,0,.625,1.9043A6.20778,6.20778,0,0,0,1.99757,38.001a6.27445,6.27445,0,0,0,1.61865,1.1787,6.70082,6.70082,0,0,0,1.90088.6308,13.45514,13.45514,0,0,0,2.0039.1768c.30909.0068.6128.0107.91895.0107C8.80567,40,9.168,40,9.53468,40H110.13477c.3594,0,.7246,0,1.084-.002.3047,0,.6172-.0039.9219-.0107a13.279,13.279,0,0,0,2-.1768,6.80432,6.80432,0,0,0,1.9082-.6308,6.27742,6.27742,0,0,0,1.6172-1.1787,6.39482,6.39482,0,0,0,1.1816-1.6143,6.60413,6.60413,0,0,0,.6191-1.9043,13.50643,13.50643,0,0,0,.1856-2.0019c.0039-.3106.0039-.6114.0039-.9219.0078-.3633.0078-.7246.0078-1.0938V9.53613c0-.36621,0-.72949-.0078-1.09179,0-.30664,0-.61426-.0039-.9209a13.5071,13.5071,0,0,0-.1856-2.002,6.6177,6.6177,0,0,0-.6191-1.90332,6.46619,6.46619,0,0,0-2.7988-2.7998,6.76754,6.76754,0,0,0-1.9082-.627,13.04394,13.04394,0,0,0-2-.17676c-.3047-.00488-.6172-.01074-.9219-.01269-.3594-.002-.7246-.002-1.084-.002Z" style="fill: #a6a6a6"/>
        <path d="M8.44483,39.125c-.30468,0-.602-.0039-.90429-.0107a12.68714,12.68714,0,0,1-1.86914-.1631,5.88381,5.88381,0,0,1-1.65674-.5479,5.40573,5.40573,0,0,1-1.397-1.0166,5.32082,5.32082,0,0,1-1.02051-1.3965,5.72186,5.72186,0,0,1-.543-1.6572,12.41351,12.41351,0,0,1-.1665-1.875c-.00634-.2109-.01464-.9131-.01464-.9131V8.44434S.88185,7.75293.8877,7.5498a12.37039,12.37039,0,0,1,.16553-1.87207,5.7555,5.7555,0,0,1,.54346-1.6621A5.37349,5.37349,0,0,1,2.61183,2.61768,5.56543,5.56543,0,0,1,4.01417,1.59521a5.82309,5.82309,0,0,1,1.65332-.54394A12.58589,12.58589,0,0,1,7.543.88721L8.44532.875H111.21387l.9131.0127a12.38493,12.38493,0,0,1,1.8584.16259,5.93833,5.93833,0,0,1,1.6709.54785,5.59374,5.59374,0,0,1,2.415,2.41993,5.76267,5.76267,0,0,1,.5352,1.64892,12.995,12.995,0,0,1,.1738,1.88721c.0029.2832.0029.5874.0029.89014.0079.375.0079.73193.0079,1.09179V30.4648c0,.3633,0,.7178-.0079,1.0752,0,.3252,0,.6231-.0039.9297a12.73126,12.73126,0,0,1-.1709,1.8535,5.739,5.739,0,0,1-.54,1.67,5.48029,5.48029,0,0,1-1.0156,1.3857,5.4129,5.4129,0,0,1-1.3994,1.0225,5.86168,5.86168,0,0,1-1.668.5498,12.54218,12.54218,0,0,1-1.8692.1631c-.2929.0068-.5996.0107-.8974.0107l-1.084.002Z"/>
      </g>
      <g id="_Group_" data-name="&lt;Group&gt;">
        <g id="_Group_2" data-name="&lt;Group&gt;">
          <g id="_Group_3" data-name="&lt;Group&gt;">
            <path id="_Path_" data-name="&lt;Path&gt;" d="M24.76888,20.30068a4.94881,4.94881,0,0,1,2.35656-4.15206,5.06566,5.06566,0,0,0-3.99116-2.15768c-1.67924-.17626-3.30719,1.00483-4.1629,1.00483-.87227,0-2.18977-.98733-3.6085-.95814a5.31529,5.31529,0,0,0-4.47292,2.72787c-1.934,3.34842-.49141,8.26947,1.3612,10.97608.9269,1.32535,2.01018,2.8058,3.42763,2.7533,1.38706-.05753,1.9051-.88448,3.5794-.88448,1.65876,0,2.14479.88448,3.591.8511,1.48838-.02416,2.42613-1.33124,3.32051-2.66914a10.962,10.962,0,0,0,1.51842-3.09251A4.78205,4.78205,0,0,1,24.76888,20.30068Z" style="fill: #fff"/>
            <path id="_Path_2" data-name="&lt;Path&gt;" d="M22.03725,12.21089a4.87248,4.87248,0,0,0,1.11452-3.49062,4.95746,4.95746,0,0,0-3.20758,1.65961,4.63634,4.63634,0,0,0-1.14371,3.36139A4.09905,4.09905,0,0,0,22.03725,12.21089Z" style="fill: #fff"/>
          </g>
        </g>
        <g>
          <path d="M42.30227,27.13965h-4.7334l-1.13672,3.35645H34.42727l4.4834-12.418h2.083l4.4834,12.418H43.438ZM38.0591,25.59082h3.752l-1.84961-5.44727h-.05176Z" style="fill: #fff"/>
          <path d="M55.15969,25.96973c0,2.81348-1.50586,4.62109-3.77832,4.62109a3.0693,3.0693,0,0,1-2.84863-1.584h-.043v4.48438h-1.8584V21.44238H48.4302v1.50586h.03418a3.21162,3.21162,0,0,1,2.88281-1.60059C53.645,21.34766,55.15969,23.16406,55.15969,25.96973Zm-1.91016,0c0-1.833-.94727-3.03809-2.39258-3.03809-1.41992,0-2.375,1.23047-2.375,3.03809,0,1.82422.95508,3.0459,2.375,3.0459C52.30227,29.01563,53.24953,27.81934,53.24953,25.96973Z" style="fill: #fff"/>
          <path d="M65.12453,25.96973c0,2.81348-1.50586,4.62109-3.77832,4.62109a3.0693,3.0693,0,0,1-2.84863-1.584h-.043v4.48438h-1.8584V21.44238H58.395v1.50586h.03418A3.21162,3.21162,0,0,1,61.312,21.34766C63.60988,21.34766,65.12453,23.16406,65.12453,25.96973Zm-1.91016,0c0-1.833-.94727-3.03809-2.39258-3.03809-1.41992,0-2.375,1.23047-2.375,3.03809,0,1.82422.95508,3.0459,2.375,3.0459C62.26711,29.01563,63.21438,27.81934,63.21438,25.96973Z" style="fill: #fff"/>
          <path d="M71.71047,27.03613c.1377,1.23145,1.334,2.04,2.96875,2.04,1.56641,0,2.69336-.80859,2.69336-1.91895,0-.96387-.67969-1.541-2.28906-1.93652l-1.60937-.3877c-2.28027-.55078-3.33887-1.61719-3.33887-3.34766,0-2.14258,1.86719-3.61426,4.51855-3.61426,2.624,0,4.42285,1.47168,4.4834,3.61426h-1.876c-.1123-1.23926-1.13672-1.9873-2.63379-1.9873s-2.52148.75684-2.52148,1.8584c0,.87793.6543,1.39453,2.25488,1.79l1.36816.33594c2.54785.60254,3.60645,1.626,3.60645,3.44238,0,2.32324-1.85059,3.77832-4.79395,3.77832-2.75391,0-4.61328-1.4209-4.7334-3.667Z" style="fill: #fff"/>
          <path d="M83.34621,19.2998v2.14258h1.72168v1.47168H83.34621v4.99121c0,.77539.34473,1.13672,1.10156,1.13672a5.80752,5.80752,0,0,0,.61133-.043v1.46289a5.10351,5.10351,0,0,1-1.03223.08594c-1.833,0-2.54785-.68848-2.54785-2.44434V22.91406H80.16262V21.44238H81.479V19.2998Z" style="fill: #fff"/>
          <path d="M86.065,25.96973c0-2.84863,1.67773-4.63867,4.29395-4.63867,2.625,0,4.29492,1.79,4.29492,4.63867,0,2.85645-1.66113,4.63867-4.29492,4.63867C87.72609,30.6084,86.065,28.82617,86.065,25.96973Zm6.69531,0c0-1.9541-.89551-3.10742-2.40137-3.10742s-2.40039,1.16211-2.40039,3.10742c0,1.96191.89453,3.10645,2.40039,3.10645S92.76027,27.93164,92.76027,25.96973Z" style="fill: #fff"/>
          <path d="M96.18606,21.44238h1.77246v1.541h.043a2.1594,2.1594,0,0,1,2.17773-1.63574,2.86616,2.86616,0,0,1,.63672.06934v1.73828a2.59794,2.59794,0,0,0-.835-.1123,1.87264,1.87264,0,0,0-1.93652,2.083v5.37012h-1.8584Z" style="fill: #fff"/>
          <path d="M109.3843,27.83691c-.25,1.64355-1.85059,2.77148-3.89844,2.77148-2.63379,0-4.26855-1.76465-4.26855-4.5957,0-2.83984,1.64355-4.68164,4.19043-4.68164,2.50488,0,4.08008,1.7207,4.08008,4.46582v.63672h-6.39453v.1123a2.358,2.358,0,0,0,2.43555,2.56445,2.04834,2.04834,0,0,0,2.09082-1.27344Zm-6.28223-2.70215h4.52637a2.1773,2.1773,0,0,0-2.2207-2.29785A2.292,2.292,0,0,0,103.10207,25.13477Z" style="fill: #fff"/>
        </g>
      </g>
    </g>
    <g id="_Group_4" data-name="&lt;Group&gt;">
      <g>
        <path d="M37.82619,8.731a2.63964,2.63964,0,0,1,2.80762,2.96484c0,1.90625-1.03027,3.002-2.80762,3.002H35.67092V8.731Zm-1.22852,5.123h1.125a1.87588,1.87588,0,0,0,1.96777-2.146,1.881,1.881,0,0,0-1.96777-2.13379h-1.125Z" style="fill: #fff"/>
        <path d="M41.68068,12.44434a2.13323,2.13323,0,1,1,4.24707,0,2.13358,2.13358,0,1,1-4.24707,0Zm3.333,0c0-.97607-.43848-1.54687-1.208-1.54687-.77246,0-1.207.5708-1.207,1.54688,0,.98389.43457,1.55029,1.207,1.55029C44.57522,13.99463,45.01369,13.42432,45.01369,12.44434Z" style="fill: #fff"/>
        <path d="M51.57326,14.69775h-.92187l-.93066-3.31641h-.07031l-.92676,3.31641h-.91309l-1.24121-4.50293h.90137l.80664,3.436h.06641l.92578-3.436h.85254l.92578,3.436h.07031l.80273-3.436h.88867Z" style="fill: #fff"/>
        <path d="M53.85354,10.19482H54.709v.71533h.06641a1.348,1.348,0,0,1,1.34375-.80225,1.46456,1.46456,0,0,1,1.55859,1.6748v2.915h-.88867V12.00586c0-.72363-.31445-1.0835-.97168-1.0835a1.03294,1.03294,0,0,0-1.0752,1.14111v2.63428h-.88867Z" style="fill: #fff"/>
        <path d="M59.09377,8.437h.88867v6.26074h-.88867Z" style="fill: #fff"/>
        <path d="M61.21779,12.44434a2.13346,2.13346,0,1,1,4.24756,0,2.1338,2.1338,0,1,1-4.24756,0Zm3.333,0c0-.97607-.43848-1.54687-1.208-1.54687-.77246,0-1.207.5708-1.207,1.54688,0,.98389.43457,1.55029,1.207,1.55029C64.11232,13.99463,64.5508,13.42432,64.5508,12.44434Z" style="fill: #fff"/>
        <path d="M66.4009,13.42432c0-.81055.60352-1.27783,1.6748-1.34424l1.21973-.07031v-.38867c0-.47559-.31445-.74414-.92187-.74414-.49609,0-.83984.18213-.93848.50049h-.86035c.09082-.77344.81836-1.26953,1.83984-1.26953,1.12891,0,1.76563.562,1.76563,1.51318v3.07666h-.85547v-.63281h-.07031a1.515,1.515,0,0,1-1.35254.707A1.36026,1.36026,0,0,1,66.4009,13.42432Zm2.89453-.38477v-.37646l-1.09961.07031c-.62012.0415-.90137.25244-.90137.64941,0,.40527.35156.64111.835.64111A1.0615,1.0615,0,0,0,69.29543,13.03955Z" style="fill: #fff"/>
        <path d="M71.34816,12.44434c0-1.42285.73145-2.32422,1.86914-2.32422a1.484,1.484,0,0,1,1.38086.79h.06641V8.437h.88867v6.26074h-.85156v-.71143h-.07031a1.56284,1.56284,0,0,1-1.41406.78564C72.0718,14.772,71.34816,13.87061,71.34816,12.44434Zm.918,0c0,.95508.4502,1.52979,1.20313,1.52979.749,0,1.21191-.583,1.21191-1.52588,0-.93848-.46777-1.52979-1.21191-1.52979C72.72121,10.91846,72.26613,11.49707,72.26613,12.44434Z" style="fill: #fff"/>
        <path d="M79.23,12.44434a2.13323,2.13323,0,1,1,4.24707,0,2.13358,2.13358,0,1,1-4.24707,0Zm3.333,0c0-.97607-.43848-1.54687-1.208-1.54687-.77246,0-1.207.5708-1.207,1.54688,0,.98389.43457,1.55029,1.207,1.55029C82.12453,13.99463,82.563,13.42432,82.563,12.44434Z" style="fill: #fff"/>
        <path d="M84.66945,10.19482h.85547v.71533h.06641a1.348,1.348,0,0,1,1.34375-.80225,1.46456,1.46456,0,0,1,1.55859,1.6748v2.915H87.605V12.00586c0-.72363-.31445-1.0835-.97168-1.0835a1.03294,1.03294,0,0,0-1.0752,1.14111v2.63428h-.88867Z" style="fill: #fff"/>
        <path d="M93.51516,9.07373v1.1416h.97559v.74854h-.97559V13.2793c0,.47168.19434.67822.63672.67822a2.96657,2.96657,0,0,0,.33887-.02051v.74023a2.9155,2.9155,0,0,1-.4834.04541c-.98828,0-1.38184-.34766-1.38184-1.21582v-2.543h-.71484v-.74854h.71484V9.07373Z" style="fill: #fff"/>
        <path d="M95.70461,8.437h.88086v2.48145h.07031a1.3856,1.3856,0,0,1,1.373-.80664,1.48339,1.48339,0,0,1,1.55078,1.67871v2.90723H98.69v-2.688c0-.71924-.335-1.0835-.96289-1.0835a1.05194,1.05194,0,0,0-1.13379,1.1416v2.62988h-.88867Z" style="fill: #fff"/>
        <path d="M104.76125,13.48193a1.828,1.828,0,0,1-1.95117,1.30273A2.04531,2.04531,0,0,1,100.73,12.46045a2.07685,2.07685,0,0,1,2.07617-2.35254c1.25293,0,2.00879.856,2.00879,2.27V12.688h-3.17969v.0498a1.1902,1.1902,0,0,0,1.19922,1.29,1.07934,1.07934,0,0,0,1.07129-.5459Zm-3.126-1.45117h2.27441a1.08647,1.08647,0,0,0-1.1084-1.1665A1.15162,1.15162,0,0,0,101.63527,12.03076Z" style="fill: #fff"/>
      </g>
    </g>
  </g>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: zulip-main/templates/.gitignore

```text
/graph.svg
```

--------------------------------------------------------------------------------

---[FILE: 404.html]---
Location: zulip-main/templates/404.html

```text
{% extends "zerver/portico_error_pages/portico_error_page.html" %}

{% block title %}
<title>{{ _("Error") }} | Zulip</title>
{% endblock %}

{% block error_page_content %}
<img src="{{ static('images/errors/400art.svg') }}" alt=""/>
<div class="errorbox">
    <div class="errorcontent">
        <h1 class="lead">{{ _("Page not found (404)") }}</h1>
        <p>
            {% trans %}
            If this error is unexpected, you can
            <a href="mailto:{{ support_email }}">contact support</a>.
            {% endtrans %}
        </p>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: 4xx.html]---
Location: zulip-main/templates/4xx.html

```text
{% extends "zerver/portico_error_pages/portico_error_page.html" %}

{% block title %}
<title>{{ _("Error") }} | Zulip</title>
{% endblock %}

{% block error_page_content %}
<div class="errorbox">
    <div class="errorcontent">
        {% if csrf_failure %}
        <h1 class="lead">{{ _("Access forbidden (403)") }}</h1>
        <p>
            {% trans %}
            Your request could not be completed because your
            browser did not send the credentials required to authenticate
            your access. To resolve this issue:
            {% endtrans %}
        </p>

        <ol>
            <li>
                {% trans %}
                Make sure that your browser allows cookies for this site.
                {% endtrans %}
            </li>
            <li>
                {% trans %}
                Check for any browser privacy settings or extensions
                that block Referer headers, and disable them for
                this site.
                {% endtrans %}
            </li>
        </ol>
        {% elif status_code == 405 %}
        <h1 class="lead">{{ _("Method not allowed (405)") }}</h1>
        <p>
            {% trans %}
            If this error is unexpected, you can
            <a href="mailto:{{ support_email }}">contact support</a>.
            {% endtrans %}
        </p>
        {% endif %}
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: 500.html]---
Location: zulip-main/templates/500.html

```text
{% extends "zerver/portico_error_pages/portico_error_page.html" %}

{% block title %}
<title>{{ _("Internal server error") }} | Zulip</title>
{% endblock %}

{% block customhead %}
{{ super() }}
<meta http-equiv="refresh" content="60;URL='/'" />
{% endblock %}

{% block error_page_content %}
<img src="{{ static('images/errors/500art.svg') }}" alt=""/>
<div class="errorbox">
    <div class="errorcontent">
        <h1 class="lead">{{ _("Internal server error") }}</h1>
        {% if corporate_enabled %}
            <!-- Keep in sync with web/html/5xx-cloud.html -->
            <p>
                {% trans %}
                Something went wrong. Sorry about that! We're aware of
                the problem and are working to fix it.
                Zulip will load automatically once it is working again.
                {% endtrans %}
            </p>
            <p>
                {% trans status_url="https://status.zulip.com/" %}
                Please check <a href="{{status_url}}">Zulip Cloud status</a> for
                more information, and <a href="mailto:{{support_email}}">contact
                Zulip support</a> with any questions.
                {% endtrans %}
            </p>
        {% else %}
            <!-- Keep in sync with web/html/5xx.html -->
            <p>
                {% trans %}
                Something went wrong. Sorry about that!
                Zulip will load automatically once it is working again.
                {% endtrans %}
            </p>
            <p>
                {% trans %}
                <a href="mailto:{{support_email}}">Contact this server's administrators</a> for support.
                {% endtrans %}
            </p>
            <p>
                {% trans troubleshooting_url="https://zulip.readthedocs.io/en/latest/production/troubleshooting.html" %}
                If you administer this server, you may want to check out the
                <a href="{{troubleshooting_url}}">Zulip server troubleshooting guide</a>.
                {% endtrans %}
            </p>
        {% endif %}
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: stats.html]---
Location: zulip-main/templates/analytics/stats.html

```text
{% extends "zerver/base.html" %}
{% set entrypoint = "stats" %}

{% block title %}
<title>
    {% trans %}
    Analytics for {{ target_name }} | Zulip
    {% endtrans %}
</title>
{% endblock %}

{% block content %}
<div class="app portico-page stats-page">

    <div class="page-content">
        {% if not analytics_ready %}
        <div class="alert alert-info">
            {{ _("Analytics are fully available 24 hours after organization creation.") }}
        </div>
        {% endif %}
        <div id="id_stats_errors" class="alert alert-error"></div>
        <div class="center-charts">
            <h1 class="analytics-page-header">{% trans %}Zulip analytics for {{ target_name }}{% endtrans %}</h1>
            <div class="summary-stats">
                <h1>{{ _("Organization summary") }}</h1>
                <ul>
                    <li>{{ _("Number of users") }}: <span id="id_total_users"></span></li>
                    <li>{{ _("Users active during the last 15 days") }}: <span id="id_active_fifteen_day_users"></span></li>
                    <li>{{ _("Number of guests") }}: <span id="id_guest_users_count"></span></li>
                    <li>{{ _("Total number of messages") }}: <span id="id_total_messages_sent"></span></li>
                    <li>{{ _("Number of messages in the last 30 days") }}: <span id="id_thirty_days_messages_sent"></span></li>
                    <li>{{ _("File storage in use") }}: <span id="id_storage_space_used"></span></li>
                </ul>
            </div>
            <div class="flex-container">
                <div class="chart-container">
                    <h1>{{ _("Active users") }}</h1>
                    <div class="button-container">
                        <div class="buttons">
                            <button class="button" type="button" id="1day_actives_button">{{ _("Daily actives") }}</button>
                            <button class="button" type="button" id="15day_actives_button">{{ _("15 day actives") }}</button>
                            <button class="button" type="button" id="all_time_actives_button">{{ _("Total users") }}</button>
                        </div>
                    </div>
                    <div id="id_number_of_users">
                        <div class="spinner"></div>
                    </div>
                    <div id="users_hover_info" class="number-stat">
                        <span id="users_hover_date"></span>
                        <b id="users_hover_humans">{{ _("Users") }}: </b>
                        <span id="users_hover_1day_value"></span>
                        <span id="users_hover_15day_value"></span>
                        <span id="users_hover_all_time_value"></span>
                    </div>
                </div>
                <div class="chart-container pie-chart">
                    <div id="pie_messages_sent_by_type">
                        <h1>{{ _("Messages sent by recipient type") }}</h1>
                        <div class="button-container">
                            <div class="buttons">
                                <button class="button" type="button" data-user="user">{{ _("Me") }}</button>
                                <button class="button selected" type="button" data-user="everyone">{{ _("Everyone") }}</button>
                            </div>
                        </div>
                        <div id="id_messages_sent_by_message_type">
                            <div class="spinner"></div>
                        </div>
                        <div id="pie_messages_sent_by_type_total" class="number-stat"></div>
                        <div class="buttons">
                            <button class="button" type="button" data-time="week">{{ _("Last week") }}</button>
                            <button class="button selected" type="button" data-time="month">{{ _("Last month") }}</button>
                            <button class="button" type="button" data-time="year">{{ _("Last year") }}</button>
                            <button class="button" type="button" data-time="cumulative">{{ _("All time") }}</button>
                        </div>
                    </div>
                </div>
                <div class="chart-container">
                    <h1>{{ _("Messages sent over time") }}</h1>
                    <div class="button-container">
                        <div class="buttons">
                            <button class="button" type="button" id='daily_button'>{{ _("Daily") }} </button>
                            <button class="button" type="button" id='weekly_button'>{{ _("Weekly") }} </button>
                            <button class="button" type="button" id='cumulative_button'>{{ _("Cumulative") }} </button>
                        </div>
                    </div>
                    <div id="id_messages_sent_over_time">
                        <div class="spinner"></div>
                    </div>
                    <div id="hoverinfo">
                        <span id="hover_date"></span>
                        <b id="hover_me">{{ _("Me") }}:</b>
                        <span id="hover_me_value"></span>
                        <b id="hover_human">{{ _("Humans") }}:</b>
                        <span id="hover_human_value"></span>
                        <b id="hover_bot">{{ _("Bots") }}:</b>
                        <span id="hover_bot_value"></span>
                    </div>
                </div>
                <div class="chart-container">
                    <h1>{{ _("Messages read over time") }}</h1>
                    <div class="button-container">
                        <div class="buttons">
                            <button class="button" type="button" id='read_daily_button'>{{ _("Daily") }} </button>
                            <button class="button" type="button" id='read_weekly_button'>{{ _("Weekly") }} </button>
                            <button class="button" type="button" id='read_cumulative_button'>{{ _("Cumulative") }} </button>
                        </div>
                    </div>
                    <div id="id_messages_read_over_time">
                        <div class="spinner"></div>
                    </div>
                    <div id="read_hover_info">
                        <span id="read_hover_date"></span>
                        <b id="read_hover_me">{{ _("Me") }}:</b>
                        <span id="read_hover_me_value"></span>
                        <b id="read_hover_everyone">{{ _("Everyone") }}:</b>
                        <span id="read_hover_everyone_value"></span>
                    </div>
                </div>
                <div class="chart-container pie-chart">
                    <div id="pie_messages_sent_by_client">
                        <h1>{{ _("Messages sent by client") }}</h1>
                        <div class="button-container">
                            <div class="buttons">
                                <button class="button" type="button" data-user="user">{{ _("Me") }}</button>
                                <button class="button selected" type="button" data-user="everyone">{{ _("Everyone") }}</button>
                            </div>
                        </div>
                        <div id="id_messages_sent_by_client">
                            <div class="spinner"></div>
                        </div>
                        <div class="buttons">
                            <button class="button" type="button" data-time="week">{{ _("Last week") }}</button>
                            <button class="button selected" type="button" data-time="month">{{ _("Last month") }}</button>
                            <button class="button" type="button" data-time="year">{{ _("Last year") }}</button>
                            <button class="button" type="button" data-time="cumulative">{{ _("All time") }}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="last-update">
            {{ _("Last update") }}: <span id="id_last_full_update"></span>
            <span class="last_update_tooltip" data-tippy-content="{% trans %}A full update of all the graphs happens once a day. The “messages sent over time” graph is updated once an hour.{% endtrans %}">
                <span class="fa fa-info-circle" id="id_last_update_question_sign"></span>
            </span>
        </div>
    </div>

</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: confirm_email_change.html]---
Location: zulip-main/templates/confirmation/confirm_email_change.html

```text
{% extends "zerver/portico.html" %}

{% block title %}
<title>{{ _("Email changed") }} | Zulip</title>
{% endblock %}

{% block portico_content %}

<div class="app confirm-email-change-page flex full-page">
    <div class="inline-block new-style">
        <div class="lead">
            <h1 class="get-started">{{ _('Email changed!') }}</h1>
        </div>

        <div class="app-main white-box">
            {% trans %}
            This confirms that the email address for your Zulip account has changed
            from {{ old_email_html_tag }} to {{ new_email_html_tag }}
            {% endtrans %}
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: confirm_preregistrationuser.html]---
Location: zulip-main/templates/confirmation/confirm_preregistrationuser.html

```text
{% extends "zerver/base.html" %}
{% set entrypoint = "redirect-to-post" %}

{% block title %}
<title>{{ _("Confirming your email address") }} | Zulip</title>
{% endblock %}

{% block content %}

{#
This template is referenced by the confirmation code and does not have the
requisite context to make a useful signup form. Therefore, we immediately
post to another view which executes in our code to produce the desired form.
#}

<form id="register" class="redirect-to-post-form"  action="{{ registration_url }}" method="post">
    {{ csrf_input }}
    <input type="hidden" value="{{ key }}" name="key"/>
    <input type="hidden" value="1" name="from_confirmation"/>
    <input type="hidden" value="{% if full_name %}{{ full_name }}{% endif %}" name="full_name"/>
</form>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: link_does_not_exist.html]---
Location: zulip-main/templates/confirmation/link_does_not_exist.html

```text
{% extends "zerver/portico_error_pages/portico_error_page.html" %}

{% block title %}
<title>{{ _("Confirmation link does not exist") }} | Zulip</title>
{% endblock %}

{% block error_page_content %}
<img src="{{ static('images/errors/400art.svg') }}" alt=""/>
<div class="errorbox">
    <div class="errorcontent">
        <h1 class="lead">{{ _("Whoops. We couldn't find your confirmation link in the system.") }}</h1>
        <p>
            {% trans %}
            Anyway, shoot us a line at {{ support_email_html_tag }} and we'll get this resolved shortly.
            {% endtrans %}
        </p>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: link_expired.html]---
Location: zulip-main/templates/confirmation/link_expired.html

```text
{% extends "zerver/portico_error_pages/portico_error_page.html" %}

{% block title %}
<title>{{ _("Confirmation link expired or deactivated") }} | Zulip</title>
{% endblock %}

{% block error_page_content %}
<img class="hourglass-img" src="{{ static('images/errors/timeout_hourglass.png') }}" alt=""/>
<div class="errorbox">
    <div class="errorcontent">
        <h1 class="lead">{{ _("Whoops. The confirmation link has expired or been deactivated.") }}</h1>
        <p>{{ _("Please contact your organization administrator for a new link.") }}</p>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: link_malformed.html]---
Location: zulip-main/templates/confirmation/link_malformed.html

```text
{% extends "zerver/portico_error_pages/portico_error_page.html" %}

{% block title %}
<title>{{ _("Confirmation link malformed") }} | Zulip</title>
{% endblock %}

{% block error_page_content %}
<img src="{{ static('images/errors/500art.svg') }}" alt=""/>
<div class="errorbox">
    <div class="errorcontent">
        <h1 class="lead">{{ _("Whoops. The confirmation link is malformed.") }}</h1>
        <p>{{ _("Make sure you copied the link correctly in to your browser. If you're still encountering this page, it's probably our fault. We're sorry.") }}</p>
        <p>
            {% trans %}
            Anyway, shoot us a line at {{ support_email_html_tag }} and we'll get this resolved shortly.
            {% endtrans %}
        </p>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: redirect_to_post.html]---
Location: zulip-main/templates/confirmation/redirect_to_post.html

```text
{% extends "zerver/base.html" %}
{% set entrypoint = "redirect-to-post" %}

{% block title %}
<title>{{ _("Confirming your email address") }} | Zulip</title>
{% endblock %}

{% block content %}

{#
The purpose of this is to be an intermediate page, served upon GET requests
to confirmation links. We simply serve a form which combined with some automatically
executed JavaScript code will immediately POST the confirmation key to the intended
endpoint.

This allows us to avoid triggering the action which is being confirmed via a mere
GET request.

This largely duplicates functionality and code with confirm_preregistrationuser.html.
We should find a way to to unify these.
#}

<form id="redirect-to-post-form" class="redirect-to-post-form"  action="{{ target_url }}" method="post">
    {{ csrf_input }}
    <input type="hidden" value="{{ key }}" name="key"/>
</form>

{% endblock %}
```

--------------------------------------------------------------------------------

````

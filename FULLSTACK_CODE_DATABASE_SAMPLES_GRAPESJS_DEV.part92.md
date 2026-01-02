---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 92
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 92 of 97)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - grapesjs-dev
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/grapesjs-dev
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: ParserHtml.ts]---
Location: grapesjs-dev/packages/core/test/specs/parser/model/ParserHtml.ts

```typescript
import ParserHtml from '../../../../src/parser/model/ParserHtml';
import ParserCss from '../../../../src/parser/model/ParserCss';
import DomComponents from '../../../../src/dom_components';
import Editor from '../../../../src/editor/model/Editor';
import { CSS_BG_OBJ, CSS_BG_STR } from './ParserCss';

describe('ParserHtml', () => {
  let obj: ReturnType<typeof ParserHtml>;
  let em: Editor;

  beforeEach(() => {
    em = new Editor({});
    const dom = new DomComponents(em);
    obj = ParserHtml(em, {
      textTags: ['br', 'b', 'i', 'u'],
      textTypes: ['text', 'textnode', 'comment'],
      returnArray: true,
    });
    obj.compTypes = dom.componentTypes;
  });

  afterEach(() => {
    em.destroy();
  });

  test('Extend parser input', () => {
    const str = '<div></div>';
    const result = { tagName: 'div' };
    em.on(em.Parser.events.htmlBefore, (opts) => {
      opts.input += str;
    });
    expect(obj.parse(str).html).toEqual([result, result]);
  });

  test('Simple div node', () => {
    const str = '<div></div>';
    const result = [{ tagName: 'div' }];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('Simple article node', () => {
    const str = '<article></article>';
    const result = [{ tagName: 'article' }];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('Node with attributes', () => {
    const str = '<div id="test1" class="test2 test3" data-one="test4" strange="test5"></div>';
    const result = [
      {
        tagName: 'div',
        classes: ['test2', 'test3'],
        attributes: {
          'data-one': 'test4',
          id: 'test1',
          strange: 'test5',
        },
      },
    ];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('Parse style string to object', () => {
    const str = 'color:black; width:100px; test:value;';
    const result = {
      color: 'black',
      width: '100px',
      test: 'value',
    };
    expect(obj.parseStyle(str)).toEqual(result);
  });

  test('Parse style string with values containing colon to object', () => {
    const str = 'background-image:url("https://some-website.ex"); test:value;';
    const result = {
      'background-image': 'url("https://some-website.ex")',
      test: 'value',
    };
    expect(obj.parseStyle(str)).toEqual(result);
  });

  test('Parse style with multiple values of the same key', () => {
    expect(obj.parseStyle(CSS_BG_STR)).toEqual(CSS_BG_OBJ);
  });

  test('Parse style with comments', () => {
    expect(obj.parseStyle('/* color #ffffff; */ width: 100px; /* height: 10px; */')).toEqual({
      width: '100px',
    });
  });

  test('Parse style with broken comments', () => {
    expect(obj.parseStyle('/* color #ffffff; */ height: 50px; /* width: 10px; ')).toEqual({
      height: '50px',
    });
  });

  test('Parse class string to array', () => {
    const str = 'test1 test2    test3 test-4';
    const result = ['test1', 'test2', 'test3', 'test-4'];
    expect(obj.parseClass(str)).toEqual(result);
  });

  test('Parse class string to array with special classes', () => {
    const str = 'test1 test2    test3 test-4 gjs-test';
    const result = ['test1', 'test2', 'test3', 'test-4', 'gjs-test'];
    expect(obj.parseClass(str)).toEqual(result);
  });

  test('Style attribute is isolated', () => {
    const str = '<div id="test1" style="color:black; width:100px; test:value;"></div>';
    const result = [
      {
        tagName: 'div',
        attributes: { id: 'test1' },
        style: {
          color: 'black',
          width: '100px',
          test: 'value',
        },
      },
    ];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('Class attribute is isolated', () => {
    const str = '<div id="test1" class="test2 test3 test4"></div>';
    const result = [
      {
        tagName: 'div',
        attributes: { id: 'test1' },
        classes: ['test2', 'test3', 'test4'],
      },
    ];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('Parse images nodes', () => {
    const str = '<img id="test1" src="./index.html"/>';
    const result = [
      {
        tagName: 'img',
        type: 'image',
        attributes: {
          id: 'test1',
          src: './index.html',
        },
      },
    ];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('Parse text nodes', () => {
    const str = '<div id="test1">test2 </div>';
    const result = [
      {
        tagName: 'div',
        attributes: { id: 'test1' },
        type: 'text',
        components: { type: 'textnode', content: 'test2 ' },
      },
    ];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('Parse text with few text tags', () => {
    const str = '<div id="test1"><br/> test2 <br/> a b <b>b</b> <i>i</i> <u>u</u> test </div>';
    const result = [
      {
        tagName: 'div',
        attributes: { id: 'test1' },
        type: 'text',
        components: [
          { tagName: 'br' },
          {
            content: ' test2 ',
            type: 'textnode',
            tagName: '',
          },
          { tagName: 'br' },
          {
            content: ' a b ',
            type: 'textnode',
            tagName: '',
          },
          {
            components: { type: 'textnode', content: 'b' },
            type: 'text',
            tagName: 'b',
          },
          {
            content: ' ',
            type: 'textnode',
            tagName: '',
          },
          {
            components: { type: 'textnode', content: 'i' },
            tagName: 'i',
            type: 'text',
          },
          {
            content: ' ',
            type: 'textnode',
            tagName: '',
          },
          {
            components: { type: 'textnode', content: 'u' },
            tagName: 'u',
            type: 'text',
          },
          {
            content: ' test ',
            type: 'textnode',
            tagName: '',
          },
        ],
      },
    ];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('Parse text with few text tags and nested node', () => {
    const str = '<div id="test1">a b <b>b</b> <i>i</i>c <div>ABC</div> <i>i</i> <u>u</u> test </div>';
    const result = [
      {
        tagName: 'div',
        attributes: { id: 'test1' },
        type: 'text',
        components: [
          {
            content: 'a b ',
            type: 'textnode',
            tagName: '',
          },
          {
            components: { type: 'textnode', content: 'b' },
            tagName: 'b',
            type: 'text',
          },
          {
            content: ' ',
            type: 'textnode',
            tagName: '',
          },
          {
            components: { type: 'textnode', content: 'i' },
            tagName: 'i',
            type: 'text',
          },
          {
            content: 'c ',
            type: 'textnode',
            tagName: '',
          },
          {
            tagName: 'div',
            type: 'text',
            components: { type: 'textnode', content: 'ABC' },
          },
          {
            content: ' ',
            type: 'textnode',
            tagName: '',
          },
          {
            components: { type: 'textnode', content: 'i' },
            tagName: 'i',
            type: 'text',
          },
          {
            content: ' ',
            type: 'textnode',
            tagName: '',
          },
          {
            components: { type: 'textnode', content: 'u' },
            tagName: 'u',
            type: 'text',
          },
          {
            content: ' test ',
            type: 'textnode',
            tagName: '',
          },
        ],
      },
    ];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('Parse text with few text tags and comment', () => {
    const str = '<div id="test1">Some text <br/><!-- comment --><b>Bold</b></div>';
    const result = [
      {
        tagName: 'div',
        attributes: { id: 'test1' },
        type: 'text',
        components: [
          {
            content: 'Some text ',
            type: 'textnode',
            tagName: '',
          },
          { tagName: 'br' },
          {
            content: ' comment ',
            type: 'comment',
            tagName: '',
          },
          {
            components: { type: 'textnode', content: 'Bold' },
            type: 'text',
            tagName: 'b',
          },
        ],
      },
    ];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('Parse nested nodes', () => {
    const str =
      '<article id="test1">   <div></div> <footer id="test2"></footer>  Text mid <div id="last"></div></article>';
    const result = [
      {
        tagName: 'article',
        attributes: { id: 'test1' },
        components: [
          {
            tagName: 'div',
          },
          {
            content: ' ',
            type: 'textnode',
            tagName: '',
          },
          {
            tagName: 'footer',
            attributes: { id: 'test2' },
          },
          {
            tagName: '',
            type: 'textnode',
            content: '  Text mid ',
          },
          {
            tagName: 'div',
            attributes: { id: 'last' },
          },
        ],
      },
    ];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('Parse nested text nodes', () => {
    const str = '<div>content1 <div>nested</div> content2</div>';
    const result = [
      {
        tagName: 'div',
        type: 'text',
        components: [
          {
            tagName: '',
            type: 'textnode',
            content: 'content1 ',
          },
          {
            tagName: 'div',
            type: 'text',
            components: { type: 'textnode', content: 'nested' },
          },
          {
            tagName: '',
            type: 'textnode',
            content: ' content2',
          },
        ],
      },
    ];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('Parse nested span text nodes', () => {
    const str = '<div>content1 <div><span>nested</span></div> content2</div>';
    const result = [
      {
        tagName: 'div',
        components: [
          {
            tagName: '',
            type: 'textnode',
            content: 'content1 ',
          },
          {
            tagName: 'div',
            components: [
              {
                tagName: 'span',
                type: 'text',
                components: { type: 'textnode', content: 'nested' },
              },
            ],
          },
          {
            tagName: '',
            type: 'textnode',
            content: ' content2',
          },
        ],
      },
    ];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('Parse multiple nodes', () => {
    const str = '<div></div><div></div>';
    const result = [{ tagName: 'div' }, { tagName: 'div' }];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('Remove script tags', () => {
    const str = '<div><script>const test;</script></div><div></div><script>const test2;</script>';
    const result = [{ tagName: 'div' }, { tagName: 'div' }];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('Isolate styles', () => {
    const str = '<div><style>.a{color: red}</style></div><div></div><style>.b{color: blue}</style>';
    const resHtml = [{ tagName: 'div' }, { tagName: 'div' }];
    const resCss = [
      {
        selectors: ['a'],
        style: { color: 'red' },
      },
      {
        selectors: ['b'],
        style: { color: 'blue' },
      },
    ];
    const res = obj.parse(str, ParserCss());
    expect(res.html).toEqual(resHtml);
    expect(res.css).toEqual(resCss);
  });

  test('Respect multiple font-faces contained in styles in html', () => {
    const str = `
      <style>
      @font-face {
        font-family: "Open Sans";
        src:url(https://fonts.gstatic.com/s/droidsans/v8/SlGVmQWMvZQIdix7AFxXkHNSbRYXags.woff2)
      }
      @font-face {
        font-family: 'Glyphicons Halflings';
        src:url(https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/fonts/glyphicons-halflings-regular.eot)
      }
      </style>
      <div>a div</div>
    `;

    const expected = [
      {
        selectors: [],
        selectorsAdd: '',
        style: {
          'font-family': '"Open Sans"',
          src: 'url(https://fonts.gstatic.com/s/droidsans/v8/SlGVmQWMvZQIdix7AFxXkHNSbRYXags.woff2)',
        },
        singleAtRule: true,
        atRuleType: 'font-face',
      },
      {
        selectors: [],
        selectorsAdd: '',
        style: {
          'font-family': "'Glyphicons Halflings'",
          src: 'url(https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/fonts/glyphicons-halflings-regular.eot)',
        },
        singleAtRule: true,
        atRuleType: 'font-face',
      },
    ];

    const res = obj.parse(str, ParserCss());
    expect(res.css).toEqual(expected);
  });

  test('Parse nested div with text and spaces', () => {
    const str = '<div> <p>TestText</p> </div>';
    const result = [
      {
        tagName: 'div',
        type: 'text',
        components: [
          {
            tagName: '',
            type: 'textnode',
            content: ' ',
          },
          {
            tagName: 'p',
            components: { type: 'textnode', content: 'TestText' },
            type: 'text',
          },
          {
            tagName: '',
            type: 'textnode',
            content: ' ',
          },
        ],
      },
    ];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('Cleanup useless empty whitespaces', () => {
    const str = `<div>
      <p>TestText</p>
    </div>`;
    const result = [
      {
        tagName: 'div',
        components: [
          {
            tagName: 'p',
            components: { type: 'textnode', content: 'TestText' },
            type: 'text',
          },
        ],
      },
    ];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('Keep meaningful whitespaces', () => {
    const str = `<div>
      <p>A</p> <p>B</p>   <p>C</p>&nbsp;<p>D</p>
    </div>`;
    const result = [
      {
        tagName: 'div',
        type: 'text',
        components: [
          {
            tagName: 'p',
            components: { type: 'textnode', content: 'A' },
            type: 'text',
          },
          { type: 'textnode', content: ' ', tagName: '' },
          {
            tagName: 'p',
            components: { type: 'textnode', content: 'B' },
            type: 'text',
          },
          { type: 'textnode', content: '   ', tagName: '' },
          {
            tagName: 'p',
            components: { type: 'textnode', content: 'C' },
            type: 'text',
          },
          { type: 'textnode', content: ' ', tagName: '' },
          {
            tagName: 'p',
            components: { type: 'textnode', content: 'D' },
            type: 'text',
          },
        ],
      },
    ];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('Parse node with model attributes to fetch', () => {
    const str =
      '<div id="test1" data-test="test-value" data-gjs-draggable=".myselector" data-gjs-stuff="test">test2 </div>';
    const result = [
      {
        tagName: 'div',
        draggable: '.myselector',
        stuff: 'test',
        attributes: {
          id: 'test1',
          'data-test': 'test-value',
        },
        type: 'text',
        components: { type: 'textnode', content: 'test2 ' },
      },
    ];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('Parse model attributes with true and false', () => {
    const str = '<div id="test1" data-test="test-value" data-gjs-draggable="true" data-gjs-stuff="false">test2 </div>';
    const result = [
      {
        tagName: 'div',
        draggable: true,
        stuff: false,
        attributes: {
          id: 'test1',
          'data-test': 'test-value',
        },
        type: 'text',
        components: { type: 'textnode', content: 'test2 ' },
      },
    ];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('Parse attributes with object inside', () => {
    const str = '<div data-gjs-test=\'{ "prop1": "value1", "prop2": 10, "prop3": true}\'>test2 </div>';
    const result = [
      {
        tagName: 'div',
        type: 'text',
        test: {
          prop1: 'value1',
          prop2: 10,
          prop3: true,
        },
        components: { type: 'textnode', content: 'test2 ' },
      },
    ];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('Parse attributes with arrays inside', () => {
    const str = '<div data-gjs-test=\'["value1", "value2"]\'>test2 </div>';
    const result = [
      {
        tagName: 'div',
        type: 'text',
        test: ['value1', 'value2'],
        components: { type: 'textnode', content: 'test2 ' },
      },
    ];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('SVG is properly parsed', () => {
    const str = `<div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <linearGradient x1="0%" y1="0%"/>
        <path d="M13 12h7v1.5h-7m0-4h7V11h-7m0 3.5h7V16h-7m8-12H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 15h-9V6h9"></path>
      </svg>
    </div>`;
    const result = [
      {
        tagName: 'div',
        components: [
          {
            type: 'svg',
            tagName: 'svg',
            attributes: {
              xmlns: 'http://www.w3.org/2000/svg',
              viewBox: '0 0 24 24',
            },
            components: [
              {
                tagName: 'linearGradient',
                attributes: { x1: '0%', y1: '0%' },
                type: 'svg-in',
              },
              {
                tagName: 'path',
                attributes: {
                  d: 'M13 12h7v1.5h-7m0-4h7V11h-7m0 3.5h7V16h-7m8-12H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 15h-9V6h9',
                },
                type: 'svg-in',
              },
            ],
          },
        ],
      },
    ];
    expect(obj.parse(str).html).toEqual(result);
  });

  test('<template> with content is properly parsed', () => {
    const str = `<template class="test">
      <tr>
        <td>Cell</td>
      </tr>
    </template>`;
    const result = [
      {
        tagName: 'template',
        classes: ['test'],
        components: [
          {
            type: 'row',
            tagName: 'tr',
            components: [
              {
                type: 'cell',
                tagName: 'td',
                components: { type: 'textnode', content: 'Cell' },
              },
            ],
          },
        ],
      },
    ];
    expect(obj.parse(str).html).toEqual(result);
  });

  describe('Options', () => {
    test('Remove unsafe attributes', () => {
      const str = '<img src="path/img" data-test="1" class="test" onload="unsafe"/>';
      const result = {
        type: 'image',
        tagName: 'img',
        classes: ['test'],
        attributes: {
          src: 'path/img',
          'data-test': '1',
        },
      };
      expect(obj.parse(str).html).toEqual([result]);
      expect(obj.parse(str, null, { allowUnsafeAttr: true }).html).toEqual([
        {
          ...result,
          attributes: {
            ...result.attributes,
            onload: 'unsafe',
          },
        },
      ]);
    });

    test('Remove unsafe attribute values', () => {
      const str = '<iframe src="javascript:alert(1)"></iframe>';
      const result = {
        type: 'iframe',
        tagName: 'iframe',
      };
      expect(obj.parse(str).html).toEqual([result]);
      expect(obj.parse(str, null, { allowUnsafeAttrValue: true }).html).toEqual([
        {
          ...result,
          attributes: {
            src: 'javascript:alert(1)',
          },
        },
      ]);
    });

    test('Custom preParser option', () => {
      const str = '<iframe src="javascript:alert(1)"></iframe>';
      const result = {
        type: 'iframe',
        tagName: 'iframe',
        attributes: {
          src: 'test:alert(1)',
        },
      };
      const preParser = (str: string) => str.replace('javascript:', 'test:');
      expect(obj.parse(str, null, { preParser }).html).toEqual([result]);
    });

    test('parsing as document', () => {
      const str = `
        <!DOCTYPE html>
        <html class="cls-html" lang="en" data-gjs-htmlp="true">
          <head class="cls-head" data-gjs-headp="true">
            <meta charset="utf-8">
            <title>Test</title>
            <link rel="stylesheet" href="/noop.css">
            <!-- comment -->
            <script src="/noop.js"></script>
            <style>.test { color: red }</style>
          </head>
          <body class="cls-body" data-gjs-bodyp="true">
            <h1>H1</h1>
          </body>
        </html>
      `;

      expect(obj.parse(str, null, { asDocument: true })).toEqual({
        doctype: '<!DOCTYPE html>',
        root: { classes: ['cls-html'], attributes: { lang: 'en' }, htmlp: true },
        head: {
          type: 'head',
          tagName: 'head',
          headp: true,
          classes: ['cls-head'],
          components: [
            { tagName: 'meta', attributes: { charset: 'utf-8' } },
            {
              tagName: 'title',
              type: 'text',
              components: { type: 'textnode', content: 'Test' },
            },
            {
              tagName: 'link',
              attributes: { rel: 'stylesheet', href: '/noop.css' },
            },
            {
              type: 'comment',
              tagName: '',
              content: ' comment ',
            },
            {
              tagName: 'style',
              type: 'text',
              components: { type: 'textnode', content: '.test { color: red }' },
            },
          ],
        },
        html: {
          tagName: 'body',
          bodyp: true,
          classes: ['cls-body'],
          components: [
            {
              tagName: 'h1',
              type: 'text',
              components: { type: 'textnode', content: 'H1' },
            },
          ],
        },
      });
    });
  });

  describe('with convertDataGjsAttributesHyphens OFF (default)', () => {
    beforeEach(() => {
      em = new Editor({});
      em.Components.addType('test-cmp', {
        isComponent: (el) => el.tagName === 'a',
        model: {
          defaults: {
            type: 'default',
            testAttr: 'value',
            otherAttr: 'value',
          },
        },
      });

      obj = ParserHtml(em, {
        textTags: ['br', 'b', 'i', 'u'],
        textTypes: ['text', 'textnode', 'comment'],
        returnArray: true,
        optionsHtml: { convertDataGjsAttributesHyphens: false },
      });

      obj.compTypes = em.Components.componentTypes;
    });

    test('keeps original attribute names', () => {
      const str = '<a data-gjs-type="test-cmp" data-gjs-test-attr="value1" data-gjs-other-attr="value2"></a>';
      const result = [
        {
          tagName: 'a',
          type: 'test-cmp',
          'test-attr': 'value1',
          'other-attr': 'value2',
        },
      ];
      expect(obj.parse(str).html).toEqual(result);
    });

    test('does not convert data-gjs-data-resolver', () => {
      const str = '<div data-gjs-type="data-variable" data-gjs-data-resolver="test"></div>';
      const result = [
        {
          type: 'data-variable',
          tagName: 'div',
          'data-resolver': 'test',
        },
      ];
      expect(obj.parse(str).html).toEqual(result);
    });
  });

  describe('with convertDataGjsAttributesHyphens ON', () => {
    beforeEach(() => {
      em = new Editor({});
      em.Components.addType('test-cmp', {
        isComponent: (el) => el.tagName === 'a',
        model: {
          defaults: {
            testAttr: 'value',
            otherAttr: 'value',
            nullAttr: null,
            undefinedAttr: undefined,
            'hyphen-attr': 'value',
            duplicatedAttr: 'value',
            'duplicated-attr': 'value',
          },
        },
      });

      obj = ParserHtml(em, {
        returnArray: true,
        optionsHtml: { convertDataGjsAttributesHyphens: true },
      });
      obj.compTypes = em.Components.componentTypes;
    });

    test('converts hyphenated to camelCase', () => {
      const str = '<a data-gjs-type="test-cmp" data-gjs-test-attr="value1" data-gjs-other-attr="value2"></a>';
      const result = [
        {
          tagName: 'a',
          type: 'test-cmp',
          testAttr: 'value1',
          otherAttr: 'value2',
        },
      ];

      expect(obj.parse(str).html).toEqual(result);
    });

    test('handles null/undefined values', () => {
      const str = '<a data-gjs-type="test-cmp" data-gjs-null-attr="value" data-gjs-undefined-attr="some value"></a>';
      const result = [
        {
          tagName: 'a',
          type: 'test-cmp',
          nullAttr: 'value',
          undefinedAttr: 'some value',
        },
      ];

      expect(obj.parse(str).html).toEqual(result);
    });

    test('converts data-gjs-data-resolver to dataResolver', () => {
      const str = `
          <div
            data-gjs-type="data-variable"
            data-gjs-data-resolver='{"type":"data-variable","path":"some path","collectionId":"someCollectionId"}'
          ></div>
        `;
      const result = [
        {
          tagName: 'div',
          type: 'data-variable',
          dataResolver: {
            type: 'data-variable',
            path: 'some path',
            collectionId: 'someCollectionId',
          },
        },
      ];
      expect(obj.parse(str).html).toEqual(result);
    });

    test('handles defaults with original hyphenated', () => {
      const str = '<a data-gjs-type="test-cmp" data-gjs-hyphen-attr="value1"></a>';
      const result = [
        {
          tagName: 'a',
          type: 'test-cmp',
          'hyphen-attr': 'value1',
        },
      ];
      expect(obj.parse(str).html).toEqual(result);
    });

    test('handles defaults not containing camelCase or hyphenated', () => {
      const str = '<a data-gjs-type="test-cmp" data-gjs-new-attr="value1"></a>';
      const result = [
        {
          tagName: 'a',
          type: 'test-cmp',
          'new-attr': 'value1',
        },
      ];
      expect(obj.parse(str).html).toEqual(result);
    });

    test('handles defaults with hyphenated and camelCase', () => {
      const str = '<a data-gjs-type="test-cmp" data-gjs-duplicated-attr="value1"></a>';
      const result = [
        {
          tagName: 'a',
          type: 'test-cmp',
          'duplicated-attr': 'value1',
        },
      ];
      expect(obj.parse(str).html).toEqual(result);
    });
  });

  describe('with keepEmptyTextNodes ON', () => {
    beforeEach(() => {
      obj = ParserHtml(em, {
        returnArray: true,
        optionsHtml: { keepEmptyTextNodes: true },
      });
      obj.compTypes = em.Components.componentTypes;
    });

    test('Keep empty whitespaces', () => {
      const str = `<div>
        <p>TestText</p>
      </div>`;
      const result = [
        {
          tagName: 'div',
          components: [
            {
              tagName: '',
              type: 'textnode',
              content: '\n        ',
            },
            {
              tagName: 'p',
              components: { type: 'textnode', content: 'TestText' },
              type: 'text',
            },
            {
              tagName: '',
              type: 'textnode',
              content: '\n      ',
            },
          ],
        },
      ];
      expect(obj.parse(str).html).toEqual(result);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: grapesjs-dev/packages/core/test/specs/plugin_manager/index.js

```javascript
import PluginManager from 'plugin_manager';

describe('PluginManager', () => {
  describe('Main', () => {
    var obj;
    var val;
    var testPlugin = (e) => {
      val = e;
    };

    beforeEach(() => {
      obj = new PluginManager();
    });

    afterEach(() => {
      obj = null;
    });

    test('Object exists', () => {
      expect(obj).toBeTruthy();
    });

    test('No plugins inside', () => {
      expect(obj.getAll()).toEqual({});
    });

    test('Add new plugin', () => {
      obj.add('test', testPlugin);
      expect(obj.get('test')).toBeTruthy();
    });

    test('Added plugin is working', () => {
      obj.add('test', testPlugin);
      var plugin = obj.get('test');
      plugin('tval');
      expect(val).toEqual('tval');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/test/specs/selector_manager/index.ts

```typescript
import SelectorManager from '../../../src/selector_manager';
import Selector from '../../../src/selector_manager/model/Selector';
import EditorModel from '../../../src/editor/model/Editor';

describe('SelectorManager', () => {
  describe('Main', () => {
    let obj: SelectorManager;
    let em: EditorModel;

    beforeEach(() => {
      em = new EditorModel({});
      obj = new SelectorManager(em);
    });

    afterEach(() => {
      em.destroy();
    });

    test('Object exists', () => {
      expect(obj).toBeTruthy();
    });

    test('No selectors inside', () => {
      expect(obj.getAll().length).toEqual(0);
    });

    test('Able to add default selectors', () => {
      em = new EditorModel({ selectorManager: { selectors: ['test1', 'test2', 'test3'] } });
      const cm = new SelectorManager(em);
      expect(cm.getAll().length).toEqual(3);
    });

    test('Add new selector', () => {
      obj.add('test');
      expect(obj.getAll().length).toEqual(1);
    });

    test('Default new selector is a class type', () => {
      const added = obj.add('test') as Selector;
      expect(obj.get('test')!.get('type')).toEqual(obj.Selector.TYPE_CLASS);
      expect(added.getFullName()).toBe('.test');
    });

    test('Add a selector as an id', () => {
      const name = 'test';
      var sel = obj.add(`#${name}`) as Selector;
      expect(sel.get('name')).toEqual(name);
      expect(sel.get('label')).toEqual(name);
      expect(obj.get(`#${name}`)!.get('type')).toEqual(obj.Selector.TYPE_ID);
      expect(sel.getFullName()).toBe('#test');
    });

    test('Check name property', () => {
      var name = 'test';
      var sel = obj.add(name) as Selector;
      expect(sel.get('name')).toEqual(name);
      expect(sel.get('label')).toEqual(name);
    });

    test('Check name property by adding as class', () => {
      var name = 'test';
      var sel = obj.add(`.${name}`) as Selector;
      expect(sel.get('name')).toEqual(name);
      expect(sel.get('label')).toEqual(name);
    });

    test('Add 2 selectors', () => {
      obj.add('test');
      obj.add('test2');
      expect(obj.getAll().length).toEqual(2);
    });

    test('Adding 2 selectors with the same name is not possible', () => {
      const add1 = obj.add('test');
      const add2 = obj.add('test');
      expect(obj.getAll().length).toEqual(1);
      expect(add1).toBe(add2);
    });

    test('Add multiple selectors', () => {
      const cls = ['.test1', 'test1', '.test2', '.test2', '#test3', 'test3', 'test3', '#test3'];
      const result = obj.add(cls as any) as Selector[];
      expect(Array.isArray(result)).toEqual(true);
      const concat = obj
        .getAll()
        .map((item) => item.getFullName())
        .join('');
      expect(concat).toEqual('.test1.test2#test3.test3');
      expect(obj.getAll().length).toEqual(4);
      expect(obj.getAll().at(0).getFullName()).toEqual('.test1');
      expect(obj.getAll().at(1).getFullName()).toEqual('.test2');
      expect(obj.getAll().at(2).getFullName()).toEqual('#test3');
      expect(obj.getAll().at(3).getFullName()).toEqual('.test3');

      expect(obj.get(cls).length).toEqual(4);
      expect(
        obj
          .get(cls)
          .map((item) => item.getFullName())
          .join(''),
      ).toEqual(concat);
    });

    test('Get selector', () => {
      var name = 'test';
      var sel = obj.add(name);
      expect(obj.get(name)).toEqual(sel);
    });

    test('Get empty class', () => {
      expect(obj.get('test')).toEqual(undefined);
    });

    test('Get id selector', () => {
      const name = 'my-id';
      const type = Selector.TYPE_ID;
      const added = obj.add({ name, type });
      expect(obj.get(name)).toEqual(undefined);
      expect(obj.get(name, type)).toBe(added);
    });

    test('Add selectors as string identifiers', () => {
      const cls = '.my-class';
      const id = '#my-id';
      const addedCls = obj.add(cls);
      const addedId = obj.add(id);
      expect(addedCls.toString()).toBe(cls);
      expect(addedId.toString()).toBe(id);
    });

    test('Get selectors as string identifiers', () => {
      const cls = '.my-class';
      const id = '#my-id';
      const addedCls = obj.add(cls);
      const addedId = obj.add(id);
      expect(obj.get(cls)).toBe(addedCls);
      expect(obj.get(id)).toBe(addedId);
    });

    test('Remove selectors as string identifiers', () => {
      const cls = '.my-class';
      const id = '#my-id';
      const addedCls = obj.add(cls);
      const addedId = obj.add(id);
      expect(obj.getAll().length).toBe(2);
      expect(obj.remove(cls)).toBe(addedCls);
      expect(obj.remove(id)).toBe(addedId);
      expect(obj.getAll().length).toBe(0);
    });

    test('Remove selector as instance', () => {
      const addedCls = obj.add('.my-class') as Selector;
      expect(obj.getAll().length).toBe(1);
      expect(obj.remove(addedCls)).toBe(addedCls);
      expect(obj.getAll().length).toBe(0);
    });

    test('addClass single class string', () => {
      const result = obj.addClass('class1');
      expect(result.length).toEqual(1);
      expect(result[0] instanceof Selector).toEqual(true);
      expect(result[0].get('name')).toEqual('class1');
    });

    test('addClass multiple class string', () => {
      const result = obj.addClass('class1 class2');
      expect(result.length).toEqual(2);
      expect(obj.getAll().length).toEqual(2);
    });

    test('addClass single class array', () => {
      const result = obj.addClass(['class1']);
      expect(result.length).toEqual(1);
    });

    test('addClass multiple class array', () => {
      const result = obj.addClass(['class1', 'class2']);
      expect(result.length).toEqual(2);
    });

    test('addClass Avoid same name classes', () => {
      obj.addClass('class1');
      const result = obj.addClass('class1');
      expect(obj.getAll().length).toEqual(1);
      expect(result.length).toEqual(1);
    });

    describe('Events', () => {
      test('Add triggers proper events', () => {
        const itemTest = 'sel';
        const eventAdd = jest.fn();
        const eventAll = jest.fn();
        em.on(obj.events.add, eventAdd);
        em.on(obj.events.all, eventAll);
        const added = obj.add(itemTest);
        expect(eventAdd).toBeCalledTimes(1);
        expect(eventAdd).toBeCalledWith(added, expect.anything());
        expect(eventAll).toBeCalled();
      });

      test('Remove triggers proper events', () => {
        const itemTest = 'sel';
        const eventBfRm = jest.fn();
        const eventRm = jest.fn();
        const eventAll = jest.fn();
        obj.add(itemTest);
        em.on(obj.events.removeBefore, eventBfRm);
        em.on(obj.events.remove, eventRm);
        em.on(obj.events.all, eventAll);
        const removed = obj.remove(itemTest);
        expect(obj.getAll().length).toBe(0);
        expect(eventBfRm).toBeCalledTimes(1);
        expect(eventRm).toBeCalledTimes(1);
        expect(eventRm).toBeCalledWith(removed, expect.anything());
        expect(eventAll).toBeCalled();
      });

      test('Update triggers proper events', () => {
        const itemTest = 'sel';
        const eventUp = jest.fn();
        const eventAll = jest.fn();
        const added = obj.add(itemTest) as Selector;
        const newProps = { label: 'Heading 2' };
        em.on(obj.events.update, eventUp);
        em.on(obj.events.all, eventAll);
        added.set(newProps);
        expect(eventUp).toBeCalledTimes(1);
        expect(eventUp).toBeCalledWith(added, newProps, expect.anything());
        expect(eventAll).toBeCalled();
      });
    });
  });
});
```

--------------------------------------------------------------------------------

````

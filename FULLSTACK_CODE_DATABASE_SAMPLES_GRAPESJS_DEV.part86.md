---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 86
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 86 of 97)

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

---[FILE: Component.ts]---
Location: grapesjs-dev/packages/core/test/specs/dom_components/model/Component.ts

```typescript
import Backbone from 'backbone';
import Component from '../../../../src/dom_components/model/Component';
import ComponentImage from '../../../../src/dom_components/model/ComponentImage';
import ComponentText from '../../../../src/dom_components/model/ComponentText';
import ComponentTextNode from '../../../../src/dom_components/model/ComponentTextNode';
import ComponentLink from '../../../../src/dom_components/model/ComponentLink';
import ComponentMap from '../../../../src/dom_components/model/ComponentMap';
import ComponentVideo from '../../../../src/dom_components/model/ComponentVideo';
import Components from '../../../../src/dom_components/model/Components';
import Selector from '../../../../src/selector_manager/model/Selector';
import Editor from '../../../../src/editor/model/Editor';
import { CSS_BG_OBJ, CSS_BG_STR } from '../../parser/model/ParserCss';
const $ = Backbone.$;

let obj: Component;
let dcomp: Editor['Components'];
let compOpts: any;
let em: Editor;

describe('Component', () => {
  beforeEach(() => {
    // FIXME: avoidInlineStyle is deprecated and when running in dev or prod, `avoidInlineStyle` is set to true
    // The following tests ran with `avoidInlineStyle` to false (this is why I add the parameter here)
    em = new Editor({ avoidDefaults: true, avoidInlineStyle: true });
    dcomp = em.Components;
    em.Pages.onLoad();
    compOpts = {
      em,
      componentTypes: dcomp.componentTypes,
      domc: dcomp,
    };
    obj = new Component({}, compOpts);
  });

  afterEach(() => {
    em.destroyAll();
  });

  test('Has no children', () => {
    expect(obj.components().length).toEqual(0);
  });

  test('Clones correctly', () => {
    const sAttr = obj.attributes;
    const cloned = obj.clone();
    const eAttr = cloned.attributes;
    expect(sAttr.length).toEqual(eAttr.length);
  });

  test('Clones correctly with traits', () => {
    obj.traits.at(0).set('value', 'testTitle');
    var cloned = obj.clone();
    cloned.set('stylable', false);
    cloned.traits.at(0).set('value', 'testTitle2');
    expect(obj.traits.at(0).get('value')).toEqual('testTitle');
    expect(obj.get('stylable')).toEqual(true);
  });

  test('Sets attributes correctly from traits', () => {
    obj.set('traits', [
      {
        label: 'Title',
        name: 'title',
        value: 'The title',
      },
      {
        label: 'Context',
        value: 'primary',
      },
    ] as any);
    expect(obj.get('attributes')).toEqual({ title: 'The title' });
  });

  test('Has expected name', () => {
    expect(obj.getName()).toEqual('Div');
  });

  test('Has expected name 2', () => {
    obj.cid = 'c999';
    obj.set('type', 'testType');
    expect(obj.getName()).toEqual('TestType');
  });

  test('Component toHTML', () => {
    expect(obj.toHTML()).toEqual('<div></div>');
  });

  test('Component toHTML with attributes', () => {
    obj = new Component(
      {
        tagName: 'article',
        attributes: {
          'data-test1': 'value1',
          'data-test2': 'value2',
        },
      },
      compOpts,
    );
    expect(obj.toHTML()).toEqual('<article data-test1="value1" data-test2="value2"></article>');
  });

  test('Component toHTML with value-less attribute', () => {
    obj = new Component(
      {
        tagName: 'div',
        attributes: {
          'data-is-a-test': '',
        },
      },
      compOpts,
    );
    expect(obj.toHTML()).toEqual('<div data-is-a-test=""></div>');
  });

  test('Component toHTML with classes', () => {
    obj = new Component(
      {
        tagName: 'article',
      },
      compOpts,
    );
    ['class1', 'class2'].forEach((item) => {
      obj.classes.add({ name: item });
    });
    expect(obj.toHTML()).toEqual('<article class="class1 class2"></article>');
  });

  test('Component toHTML with children', () => {
    obj = new Component({ tagName: 'article' }, compOpts);
    obj.components().add({ tagName: 'span' });
    expect(obj.toHTML()).toEqual('<article><span></span></article>');
  });

  test('Component toHTML with more children', () => {
    obj = new Component({ tagName: 'article' }, compOpts);
    obj.components().add([{ tagName: 'span' }, { tagName: 'div' }]);
    expect(obj.toHTML()).toEqual('<article><span></span><div></div></article>');
  });

  test('Component toHTML with no closing tag', () => {
    obj = new Component({ void: true }, compOpts);
    expect(obj.toHTML()).toEqual('<div/>');
  });

  test('Component toHTML with quotes in attribute', () => {
    obj = new Component({}, compOpts);
    let attrs = obj.get('attributes')!;
    attrs['data-test'] = '"value"';
    obj.set('attributes', attrs);
    expect(obj.toHTML()).toEqual('<div data-test="&quot;value&quot;"></div>');
  });

  test('Component toHTML and withProps', () => {
    obj = new Component({}, compOpts);
    obj.set({
      bool: true,
      removable: false,
      string: 'st\'ri"ng&<>',
      array: [1, 'string', true],
      object: { a: 1, b: 'string', c: true },
      null: null,
      undef: undefined,
      empty: '',
      zero: 0,
      _private: 'value',
    });
    let resStr = "st'ri&quot;ng&amp;&lt;&gt;";
    let resArr = '[1,&quot;string&quot;,true]';
    let resObj = '{&quot;a&quot;:1,&quot;b&quot;:&quot;string&quot;,&quot;c&quot;:true}';
    let res = `<div data-gjs-removable="false" data-gjs-bool="true" data-gjs-string="${resStr}" data-gjs-array="${resArr}" data-gjs-object="${resObj}" data-gjs-empty="" data-gjs-zero="0"></div>`;
    expect(obj.toHTML({ withProps: true })).toEqual(res);
    resStr = 'st&apos;ri"ng&amp;&lt;&gt;';
    resArr = '[1,"string",true]';
    resObj = '{"a":1,"b":"string","c":true}';
    res = `<div data-gjs-removable="false" data-gjs-bool="true" data-gjs-string='${resStr}' data-gjs-array='${resArr}' data-gjs-object='${resObj}' data-gjs-empty="" data-gjs-zero="0"></div>`;
    expect(obj.toHTML({ withProps: true, altQuoteAttr: true })).toEqual(res);
  });

  test('Manage correctly boolean attributes', () => {
    obj = new Component({}, compOpts);
    obj.set('attributes', {
      'data-test': 'value',
      checked: false,
      required: true,
      avoid: true,
    });
    expect(obj.toHTML()).toEqual('<div data-test="value" required avoid></div>');
  });

  test('Component parse empty div', () => {
    const el = document.createElement('div');
    const res = Component.isComponent(el);
    expect(res).toEqual({ tagName: 'div' });
  });

  test('Component parse span', () => {
    const el = document.createElement('span');
    const res = Component.isComponent(el);
    expect(res).toEqual({ tagName: 'span' });
  });

  test('setClass single class string', () => {
    obj.setClass('class1');
    const result = obj.classes.models;
    expect(result.length).toEqual(1);
    expect(result[0] instanceof Selector).toEqual(true);
    expect(result[0].get('name')).toEqual('class1');
  });

  test('setClass multiple class string', () => {
    obj.setClass('class1 class2');
    const result = obj.classes.models;
    expect(result.length).toEqual(2);
  });

  test('setClass single class array', () => {
    obj.setClass(['class1']);
    const result = obj.classes.models;
    expect(result.length).toEqual(1);
  });

  test('setClass multiple class array', () => {
    obj.setClass(['class1', 'class2']);
    const result = obj.classes.models;
    expect(result.length).toEqual(2);
  });

  test('addClass multiple array', () => {
    obj.addClass(['class1', 'class2']);
    const result = obj.classes.models;
    expect(result.length).toEqual(2);
  });

  test('addClass avoid same name classes', () => {
    obj.addClass(['class1', 'class2']);
    obj.addClass(['class1', 'class3']);
    const result = obj.classes.models;
    expect(result.length).toEqual(3);
  });

  test('removeClass by string', () => {
    obj.addClass(['class1', 'class2']);
    obj.removeClass('class2');
    const result = obj.classes.models;
    expect(result.length).toEqual(1);
  });

  test('removeClass by string with multiple classes', () => {
    obj.addClass(['class1', 'class2']);
    obj.removeClass('class2 class1');
    const result = obj.classes.models;
    expect(result.length).toEqual(0);
  });

  test('removeClass by array', () => {
    obj.addClass(['class1', 'class2']);
    obj.removeClass(['class1', 'class2']);
    const result = obj.classes.models;
    expect(result.length).toEqual(0);
  });

  test('removeClass do nothing with undefined classes', () => {
    obj.addClass(['class1', 'class2']);
    obj.removeClass(['class3']);
    const result = obj.classes.models;
    expect(result.length).toEqual(2);
  });

  test('removeClass actually removes classes from attributes', () => {
    obj.addClass('class1');
    obj.removeClass('class1');
    const result = obj.getAttributes();
    expect(result.class).toEqual(undefined);
  });

  test('findFirstType returns first component of specified type', () => {
    const image1 = new ComponentImage({}, compOpts);
    const text = new ComponentText({}, compOpts);
    const image2 = new ComponentImage({}, compOpts);

    obj.append([image1, text, image2]);

    const result = obj.findFirstType('image');
    expect(result).toBe(image1);
    expect(result instanceof ComponentImage).toBe(true);
  });

  test('findFirstType returns undefined for non-existent type', () => {
    const text = new ComponentText({}, compOpts);

    obj.append(text);

    const result = obj.findFirstType('image');
    expect(result).toBeUndefined();
  });

  test('findFirstType returns undefined for empty component', () => {
    const result = obj.findFirstType('div');
    expect(result).toBeUndefined();
  });

  test('setAttributes', () => {
    obj.setAttributes({
      id: 'test',
      'data-test': 'value',
      class: 'class1 class2',
      style: 'color: white; background: #fff',
    });
    // Style is not in attributes because it has not been set as inline
    expect(obj.getAttributes()).toEqual({
      id: 'test',
      class: 'class1 class2',
      'data-test': 'value',
    });
    expect(obj.classes.length).toEqual(2);
    expect(obj.getStyle()).toEqual({
      color: 'white',
      background: '#fff',
    });
  });

  test('set style with multiple values of the same key', () => {
    obj.setAttributes({ style: CSS_BG_STR });
    expect(obj.getStyle()).toEqual(CSS_BG_OBJ);
  });

  test('set style on id and inline style', () => {
    obj.setStyle({ color: 'red' }); // Should be set on id
    obj.setStyle({ display: 'flex' }, { inline: true }); // Should be set as inline

    expect(obj.getStyle()).toEqual({
      color: 'red',
    });
    expect(obj.getStyle({ inline: true })).toEqual({
      display: 'flex',
    });
  });

  test('get proper style from style with multiple values of the same key', () => {
    obj.setAttributes({ style: CSS_BG_STR }, { inline: true });
    expect(obj.getAttributes()).toEqual({
      style: CSS_BG_STR.split('\n').join(''),
    });
  });

  test('setAttributes overwrites correctly', () => {
    obj.setAttributes({ id: 'test', 'data-test': 'value', a: 'b', b: 'c' });
    obj.setAttributes({ id: 'test2', 'data-test': 'value2' });
    expect(obj.getAttributes()).toEqual({ id: 'test2', 'data-test': 'value2' });
  });

  test('append() returns always an array', () => {
    let result = obj.append('<span>text1</span>');
    expect(result.length).toEqual(1);
    result = obj.append('<span>text1</span><div>text2</div>');
    expect(result.length).toEqual(2);
  });

  test('append() new components as string', () => {
    obj.append('<span>text1</span><div>text2</div>');
    const comps = obj.components();
    expect(comps.length).toEqual(2);
    expect(comps.models[0].get('tagName')).toEqual('span');
    expect(comps.models[1].get('tagName')).toEqual('div');
  });

  test('append() new components as Objects', () => {
    obj.append([{}, {}]);
    const comps = obj.components();
    expect(comps.length).toEqual(2);
    const result = obj.append({});
    expect(comps.length).toEqual(3);
    expect(result[0].em).toEqual(em);
  });

  test('components() set new collection', () => {
    obj.append([{}, {}]);
    obj.components('<span>test</div>');
    const result = obj.components();
    expect(result.length).toEqual(1);
    expect(result.models[0].get('tagName')).toEqual('span');

    expect(result.em).toEqual(em);
  });

  test('Propagate properties to children', () => {
    obj.append({ propagate: 'removable' });
    const result = obj.components();
    const newObj = result.models[0];
    expect(newObj.get('removable')).toEqual(true);
    newObj.set('removable', false);
    newObj.append({ draggable: false });
    const child = newObj.components().models[0];
    expect(child.get('removable')).toEqual(false);
    expect(child.get('propagate')).toEqual(['removable']);
  });

  // This will try to avoid, eventually, issues with circular structures
  test('Can stringify object after edits', () => {
    const added = dcomp.addComponent(`
      <div>
        <div>Comp 1</div>
        <div>Comp 2</div>
        <div>Comp 3</div>
      </div>
    `) as Component;
    const comp1 = added.components().at(0);
    comp1.remove();
    added.append(comp1);
    expect(JSON.stringify(added)).toBeTruthy();
  });

  test('Guarantee the uniqueness of components ids', () => {
    const idName = 'test';
    const added = dcomp.addComponent(`
      <div>Comp 1</div>
      <div id="${idName}" style="color: red">Comp 2</div>
      <div>Comp 3</div>
      <style>
        #test {
          color: red;
        }
      </style>
    `) as Component[];
    const comp1 = added[0];
    const comp2 = added[1];
    const comp1Id = comp1.getId();
    const comp2Sel = comp2._getStyleSelector()!;
    expect(comp2Sel.get('name')).toEqual(idName);
    const idNameNew = `${idName}2`;
    comp2.setId(idNameNew);
    // Check if the style selector has changed its name
    expect(comp2Sel.get('name')).toEqual(idNameNew);
    comp1.setId(idNameNew);
    // The id shouldn't change
    expect(comp1.getId()).toEqual(comp1Id);
  });

  test('Ensure duplicated component clones also the rules', () => {
    const idName = 'test';
    const cmp = dcomp.addComponent(`
      <div>
        <div id="${idName}">Comp 1</div>
      </div>
      <style>
        #test { color: red; }
        @media (max-width: 992px) {
          #test { color: blue; }
        }
      </style>
    `) as Component;
    expect(em.getCss()).toBe('#test{color:red;}@media (max-width: 992px){#test{color:blue;}}');
    cmp.components().resetFromString(`
      <div id="${idName}">Comp 1</div>
      <div id="${idName}">Comp 2</div>
    `);
    const newId = cmp.components().at(1).getId();
    expect(em.getCss()).toBe(
      `#test{color:red;}#${newId}{color:red;}@media (max-width: 992px){#test{color:blue;}#${newId}{color:blue;}}`,
    );
  });

  test('Ensure duplicated component clones the rules also cross components', () => {
    const idName = 'test';
    const cmp = dcomp.addComponent(`
      <div>
        <div id="${idName}">Comp 1</div>
      </div>
      <style>
        #test { color: red; }
        @media (max-width: 992px) {
          #test { color: blue; }
        }
      </style>
    `) as Component;
    const cmp2 = dcomp.addComponent(`<div>Text</div>`) as Component;
    cmp2.components().resetFromString(`<div id="${idName}">Comp 2</div>`);
    const newId = cmp2.components().at(0).getId();
    expect(em.getHtml()).toBe(
      `<body><div><div id="test">Comp 1</div></div><div><div id="test-2">Comp 2</div></div></body>`,
    );
    expect(em.getCss()).toBe(
      `#test{color:red;}#${newId}{color:red;}@media (max-width: 992px){#test{color:blue;}#${newId}{color:blue;}}`,
    );
  });

  test('Ability to stop/change propagation chain', () => {
    obj.append({
      removable: false,
      draggable: false,
      propagate: ['removable', 'draggable'],
    });
    const result = obj.components();
    const newObj = result.models[0];
    newObj.components(`
      <div id="comp01">
        <div id="comp11">comp1</div>
        <div id="comp12" data-gjs-stop="1" data-gjs-removable="true" data-gjs-draggable="true" data-gjs-propagate='["stop"]'>
          <div id="comp21">comp21</div>
          <div id="comp22">comp22</div>
        </div>
        <div id="comp13">
          <div id="comp31">comp31</div>
          <div id="comp32">comp32</div>
        </div>
      </div>
      <div id="comp02">TEST</div>`);
    const notInhereted = (model: Component) => {
      expect(model.get('stop')).toEqual('1');
      expect(model.get('removable')).toEqual(true);
      expect(model.get('draggable')).toEqual(true);
      expect(model.get('propagate')).toEqual(['stop']);
      model.components().each((model) => inhereted(model));
    };
    const inhereted = (model: Component) => {
      if (model.get('stop')) {
        notInhereted(model);
      } else {
        expect(model.get('removable')).toEqual(false);
        expect(model.get('draggable')).toEqual(false);
        expect(model.get('propagate')).toEqual(['removable', 'draggable']);
        model.components().each((model) => inhereted(model));
      }
    };
    newObj.components().each((model) => inhereted(model));
  });

  test('setStyle parses styles correctly', () => {
    const styles = 'padding: 12px;height:auto;';
    const expectedObj = {
      padding: '12px',
      height: 'auto',
    };

    const c = new Component({}, compOpts);

    expect(c.setStyle(styles as any)).toEqual(expectedObj);
  });

  test('setStyle should be called successfully when invoked internally', () => {
    const ExtendedComponent = Component.extend({
      init() {
        const styles = 'padding: 12px;height:auto;';
        this.setStyle(styles);
      },
    });

    expect(() => new ExtendedComponent({}, compOpts)).not.toThrowError();
  });
});

describe('Image Component', () => {
  beforeEach(() => {
    em = new Editor({ avoidDefaults: true });
    compOpts = { em };
    obj = new ComponentImage({}, compOpts);
  });

  afterEach(() => {
    em.destroyAll();
  });

  test('Has src property', () => {
    expect(obj.has('src')).toEqual(true);
  });

  test('Not droppable', () => {
    expect(obj.get('droppable')).toEqual(0);
  });

  test('ComponentImage toHTML', () => {
    obj = new ComponentImage({ src: '' }, compOpts);
    expect(obj.toHTML()).toEqual('<img/>');
  });

  test('Component toHTML with attributes', () => {
    obj = new ComponentImage(
      {
        attributes: { alt: 'AltTest' },
        src: 'testPath',
      },
      compOpts,
    );
    expect(obj.toHTML()).toEqual('<img alt="AltTest" src="testPath"/>');
  });

  test('Refuse not img element', () => {
    var el = document.createElement('div');
    expect(ComponentImage.isComponent(el)).toEqual(false);
  });

  test('Component parse img element', () => {
    var el = document.createElement('img');
    expect(ComponentImage.isComponent(el)).toEqual(true);
  });

  test('Component parse img element with src', () => {
    var el = document.createElement('img');
    el.src = 'http://localhost/';
    expect(ComponentImage.isComponent(el)).toEqual(true);
  });
});

describe('Text Component', () => {
  beforeEach(() => {
    em = new Editor({ avoidDefaults: true });
    compOpts = { em };
    obj = new ComponentText({}, compOpts);
  });

  afterEach(() => {
    em.destroyAll();
  });

  test('Has content property', () => {
    expect(obj.has('content')).toEqual(true);
  });

  test('Not droppable', () => {
    expect(obj.get('droppable')).toEqual(false);
  });

  test('Component toHTML with attributes', () => {
    obj = new ComponentText(
      {
        attributes: { 'data-test': 'value' },
        content: 'test content',
      },
      compOpts,
    );
    expect(obj.toHTML()).toEqual('<div data-test="value">test content</div>');
  });
});

describe('Text Node Component', () => {
  beforeEach(() => {
    em = new Editor({ avoidDefaults: true });
    compOpts = { em };
    obj = new ComponentTextNode({}, compOpts);
  });

  afterEach(() => {
    em.destroyAll();
  });

  test('Has content property', () => {
    expect(obj.has('content')).toEqual(true);
  });

  test('Not droppable', () => {
    expect(obj.get('droppable')).toEqual(false);
  });

  test('Not editable', () => {
    expect(obj.get('editable')).toEqual(true);
  });

  test('Component toHTML with attributes', () => {
    obj = new ComponentTextNode(
      {
        attributes: { 'data-test': 'value' },
        content: 'test content &<>"\'',
      },
      compOpts,
    );
    expect(obj.toHTML()).toEqual('test content &amp;&lt;&gt;"\'');
  });
});

describe('Link Component', () => {
  const aEl = document.createElement('a');

  test('Component parse link element', () => {
    obj = ComponentLink.isComponent(aEl);
    expect(obj).toEqual({ type: 'link' });
  });

  test('Component parse link element with text content', () => {
    aEl.innerHTML = 'some text here ';
    obj = ComponentLink.isComponent(aEl);
    expect(obj).toEqual({ type: 'link' });
  });

  test('Component parse link element with not only text content', () => {
    aEl.innerHTML = '<div>Some</div> text <div>here </div>';
    obj = ComponentLink.isComponent(aEl);
    expect(obj).toEqual({ type: 'link' });
  });

  test('Component parse link element with only not text content', () => {
    aEl.innerHTML = `<div>Some</div>
    <div>text</div>
    <div>here </div>`;
    obj = ComponentLink.isComponent(aEl);
    expect(obj).toEqual({ type: 'link', editable: false });
  });

  test('Link element with only an image inside is not editable', () => {
    aEl.innerHTML = '<img src="##"/>';
    obj = ComponentLink.isComponent(aEl);
    expect(obj).toEqual({ type: 'link', editable: false });
  });
});

describe('Map Component', () => {
  test('Component parse map iframe', () => {
    var src = 'https://maps.google.com/maps?&q=London,UK&z=11&t=q&output=embed';
    var el = $('<iframe src="' + src + '"></iframe>');
    const res = ComponentMap.isComponent(el.get(0) as HTMLIFrameElement);
    expect(res).toEqual({ type: 'map', src });
  });

  test('Component parse not map iframe', () => {
    var el = $('<iframe src="https://www.youtube.com/watch?v=jNQXAC9IVRw"></iframe>');
    const res = ComponentMap.isComponent(el.get(0) as HTMLIFrameElement);
    expect(res).toEqual(undefined);
  });
});

describe('Video Component', () => {
  test('Component parse video', () => {
    var src = 'http://localhost/';
    var el = $<HTMLVideoElement>('<video src="' + src + '"></video>');
    obj = ComponentVideo.isComponent(el.get(0) as HTMLVideoElement);
    expect(obj).toEqual({ type: 'video', src });
  });

  test('Component parse youtube video iframe', () => {
    var src = 'http://www.youtube.com/embed/jNQXAC9IVRw?';
    var el = $('<iframe src="' + src + '"></video>');
    obj = ComponentVideo.isComponent(el.get(0) as HTMLVideoElement);
    expect(obj).toEqual({ type: 'video', provider: 'yt', src });
  });

  test('Component parse vimeo video iframe', () => {
    var src = 'http://player.vimeo.com/video/2?';
    var el = $('<iframe src="' + src + '"></video>');
    obj = ComponentVideo.isComponent(el.get(0) as HTMLVideoElement);
    expect(obj).toEqual({ type: 'video', provider: 'vi', src });
  });
});

describe('Components', () => {
  beforeEach(() => {
    em = new Editor({});
    dcomp = em.Components;
    em.Pages.onLoad();
    compOpts = {
      em,
      componentTypes: dcomp.componentTypes,
    };
  });

  test('Creates component correctly', () => {
    var c = new Components([], compOpts);
    var m = c.add({});
    expect(m instanceof Component).toEqual(true);
    expect(m.em).toEqual(em);
  });

  test('Creates image component correctly', () => {
    var c = new Components([], compOpts);
    var m = c.add({ type: 'image' });
    expect(m instanceof ComponentImage).toEqual(true);
    expect(m.em).toEqual(em);
  });

  test('Creates text component correctly', () => {
    var c = new Components([], compOpts);
    var m = c.add({ type: 'text' });
    expect(m instanceof ComponentText).toEqual(true);
    expect(m.em).toEqual(em);
  });

  test('Avoid conflicting components with the same ID', () => {
    const em = new Editor({});
    dcomp = em.Components;
    em.Pages.onLoad();
    const id = 'myid';
    const idB = 'myid2';
    const block = `
      <div id="${id}">
        <div id="${idB}"></div>
      </div>
      <style>
        #${id} {
          color: red;
        }
        #${id}:hover {
          color: blue;
        }
        #${idB} {
          color: yellow;
        }
      </style>
    `;
    const added = dcomp.addComponent(block) as Component;
    const addComps = added.components();
    // Let's check if everything is working as expected
    // 2 test components + 1 wrapper + 1 head + 1 docEl
    expect(Object.keys(dcomp.componentsById).length).toBe(5);
    expect(added.getId()).toBe(id);
    expect(addComps.at(0).getId()).toBe(idB);
    const cc = em.get('CssComposer');
    const rules = cc.getAll();
    expect(rules.length).toBe(3);
    expect(rules.at(0).selectorsToString()).toBe(`#${id}`);
    expect(rules.at(1).selectorsToString()).toBe(`#${id}:hover`);
    expect(rules.at(2).selectorsToString()).toBe(`#${idB}`);
    // Now let's add the same block
    const added2 = dcomp.addComponent(block) as Component;
    const addComps2 = added2.components();
    const id2 = added2.getId();
    const newId = `${id}-2`;
    const newIdB = `${idB}-2`;
    expect(id2).toBe(newId);
    expect(addComps2.at(0).getId()).toBe(newIdB);
    expect(rules.length).toBe(6);
    expect(rules.at(3).selectorsToString()).toBe(`#${newId}`);
    expect(rules.at(4).selectorsToString()).toBe(`#${newId}:hover`);
    expect(rules.at(5).selectorsToString()).toBe(`#${newIdB}`);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ComponentImage.ts]---
Location: grapesjs-dev/packages/core/test/specs/dom_components/model/ComponentImage.ts

```typescript
import Component from '../../../../src/dom_components/model/Component';
import ComponentImage from '../../../../src/dom_components/model/ComponentImage';
import Editor from '../../../../src/editor/model/Editor';
import { buildBase64UrlFromSvg } from '../../../../src/utils/mixins';

describe('ComponentImage', () => {
  let componentImage: ComponentImage;
  let dcomp: Editor['Components'];
  let compOpts: any;
  let em: Editor;

  beforeEach(() => {
    em = new Editor({ avoidDefaults: true });
    dcomp = em.Components;
    em.Pages.onLoad();
    compOpts = {
      em,
      componentTypes: dcomp.componentTypes,
      domc: dcomp,
    };
    componentImage = new ComponentImage({}, compOpts);
  });

  describe('.initialize', () => {
    test('when a base 64 default image is provided, it uses the default image', () => {
      let imageUrl = buildBase64UrlFromSvg(ComponentImage.prototype.defaults.src);
      let componentImage = new ComponentImage({ attributes: { src: imageUrl } }, { ...compOpts });
      expect(componentImage.get('src')).toEqual(ComponentImage.prototype.defaults.src);
      expect(componentImage.isDefaultSrc()).toBeTruthy();
    });

    test('when a image url is provided, it uses the image url', () => {
      let imageUrl = 'https://mock.com/image.png';
      let componentImage = new ComponentImage({ attributes: { src: imageUrl } }, { ...compOpts });
      expect(componentImage.get('src')).toEqual(imageUrl);
      expect(componentImage.isDefaultSrc()).toBeFalsy();
    });
  });

  test('`src` property is defined after initializing', () => {
    expect(componentImage.get('src')).toBeDefined();
  });

  describe('.getAttrToHTML', () => {
    let getSrcResultSpy: ReturnType<typeof jest.spyOn>;
    const fakeAttributes = {};

    beforeEach(() => {
      jest.spyOn(Component.prototype, 'getAttrToHTML').mockReturnValue(fakeAttributes);
      getSrcResultSpy = jest.spyOn(componentImage, 'getSrcResult');
    });

    test('it should fill the `src` property with the result of `getSrcResult` if defined', () => {
      let attributes = componentImage.getAttrToHTML();
      expect(getSrcResultSpy).toHaveBeenCalled();
      expect(attributes).toEqual(fakeAttributes);

      let fakeSrcResult = 'fakeSrcResult';
      getSrcResultSpy.mockReturnValue(fakeSrcResult);
      attributes = componentImage.getAttrToHTML();
      expect(getSrcResultSpy).toHaveBeenCalledTimes(2);
      expect(attributes).toEqual({ src: fakeSrcResult });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ComponentTypes.ts]---
Location: grapesjs-dev/packages/core/test/specs/dom_components/model/ComponentTypes.ts

```typescript
import Editor from '../../../../src/editor';

describe('Component Types', () => {
  let editor: Editor;
  let wrapper: NonNullable<ReturnType<Editor['getWrapper']>>;

  const expectedType = (input: string, type: string, opts: any = {}) => {
    const cmp = wrapper.append(input)[0];
    expect(wrapper.components().length).toBe(opts.total || 1);
    !opts.skipHtml && expect(cmp.toHTML()).toBe(input);
    const res = opts.getType ? wrapper.findType(type)[0] : cmp;
    expect(res.is(type)).toBe(true);
  };

  beforeAll(() => {
    editor = new Editor({ allowScripts: true } as any);
    editor.Pages.onLoad();
    wrapper = editor.getWrapper()!;
  });

  afterAll(() => {
    editor.destroy();
  });

  afterEach(() => {
    wrapper.components().reset();
    editor = new Editor({ allowScripts: true } as any);
    editor.getModel().Pages.onLoad();
    wrapper = editor.getWrapper()!;
  });

  test('<img> is correctly recognized', () => {
    expectedType('<img src="img.png" attr-test="value"/>', 'image');
  });

  test('<label> is correctly recognized', () => {
    expectedType('<label attr-test="value">Hello</label>', 'label');
  });

  test('<a> is correctly recognized', () => {
    expectedType('<a href="/link">link</a>', 'link');
  });

  test('<table> is correctly recognized', () => {
    expectedType('<table></table>', 'table', { skipHtml: 1 });
  });

  test('<thead> is correctly recognized', () => {
    expectedType('<table><thead> </thead></table>', 'thead', { getType: 1 });
  });

  test('<tbody> is correctly recognized', () => {
    expectedType('<table><tbody> </tbody></table>', 'tbody', { getType: 1 });
  });

  test('<tr> is correctly recognized', () => {
    expectedType('<table><tbody><tr> </tr></tbody></table>', 'row', {
      getType: 1,
    });
  });

  test('<video> is correctly recognized', () => {
    expectedType('<video></video>', 'video', { skipHtml: 1 });
  });

  test('<td> & <th> are correctly recognized', () => {
    expectedType('<table><tbody><tr><td></td></tr></tbody></table>', 'cell', {
      getType: 1,
    });
    expectedType('<table><tbody><tr><th></th></tr></tbody></table>', 'cell', {
      total: 2,
      getType: 1,
    });
  });

  test('<tfoot> is correctly recognized', () => {
    expectedType('<table><tfoot> </tfoot></table>', 'tfoot', { getType: 1 });
  });

  test('<script> is correctly recognized', () => {
    // const scr = 'console.log("Inline script");'; // issues with jsdom parser
    const scr = '';
    expectedType(`<script attr-test="value">${scr}</script>`, 'script');
  });

  test('<iframe> is correctly recognized', () => {
    expectedType('<iframe frameborder="0" src="/somewhere" attr-test="value"></iframe>', 'iframe');
  });

  test('<svg> is correctly recognized', () => {
    const cmp = wrapper.append(`<svg viewBox="0 0 24 24" height="30px">
            <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z"></path></svg>
        `)[0];
    expect(wrapper.components().length).toBe(1);
    expect(cmp.is('svg')).toBe(true);
    expect(cmp.components().at(0).is('svg-in')).toBe(true);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ComponentWrapper.ts]---
Location: grapesjs-dev/packages/core/test/specs/dom_components/model/ComponentWrapper.ts

```typescript
import { DataRecord, DataSourceManager } from '../../../../src';
import { DataCollectionStateType } from '../../../../src/data_sources/model/data_collection/types';
import { DataVariableProps, DataVariableType } from '../../../../src/data_sources/model/DataVariable';
import { DataCollectionKeys, DataComponentTypes } from '../../../../src/data_sources/types';
import Component from '../../../../src/dom_components/model/Component';
import ComponentHead from '../../../../src/dom_components/model/ComponentHead';
import ComponentWrapper from '../../../../src/dom_components/model/ComponentWrapper';
import Editor from '../../../../src/editor';
import EditorModel from '../../../../src/editor/model/Editor';
import { setupTestEditor } from '../../../common';

describe('ComponentWrapper', () => {
  const keyRootData = DataCollectionKeys.rootData;
  let em: Editor;

  beforeEach(() => {
    em = new Editor({ avoidDefaults: true });
    em.Pages.onLoad();
  });

  describe('.clone', () => {
    test('clones the component and returns a new instance for head and document element', () => {
      const originalComponent = em.Pages.getSelected()?.getMainComponent();
      const clonedComponent = originalComponent?.clone();
      em.Pages.add(
        {
          id: 'PAGE_ID',
          clonedComponent,
        },
        {
          select: true,
        },
      );
      const newPageComponent = em.Pages.get('PAGE_ID')?.getMainComponent();

      expect(clonedComponent?.head).toBeInstanceOf(ComponentHead);
      expect(clonedComponent?.head.cid).not.toEqual(originalComponent?.head.cid);

      expect(clonedComponent?.docEl).toBeInstanceOf(Component);
      expect(clonedComponent?.docEl.cid).not.toEqual(originalComponent?.docEl.cid);
      expect(newPageComponent?.head.cid).not.toEqual(originalComponent?.head.cid);
    });
  });

  describe('ComponentWrapper with DataResolver', () => {
    let em: EditorModel;
    let dsm: DataSourceManager;
    let wrapper: ComponentWrapper;
    let firstRecord: DataRecord;

    const contentDataSourceId = 'contentDataSource';
    const blogDataSourceId = 'blogs';
    const firstBlog = { id: 'blog1', title: 'How to Test Components' };
    const blogsData = [
      firstBlog,
      { id: 'blog2', title: 'Refactoring for Clarity' },
      { id: 'blog3', title: 'Async Patterns in TS' },
    ];

    const productsById = {
      product1: { title: 'Laptop' },
      product2: { title: 'Smartphone' },
    };

    beforeEach(() => {
      ({ em, dsm } = setupTestEditor({ withCanvas: true }));
      wrapper = em.getWrapper() as ComponentWrapper;

      dsm.add({
        id: contentDataSourceId,
        records: [
          {
            id: 'blogs',
            data: blogsData,
          },
          {
            id: 'productsById',
            data: productsById,
          },
        ],
      });

      dsm.add({
        id: blogDataSourceId,
        records: blogsData,
      });

      firstRecord = em.DataSources.get(contentDataSourceId).getRecord('blogs')!;
    });

    afterEach(() => {
      em.destroy();
    });

    const createDataResolver = (path: string): DataVariableProps => ({
      type: DataVariableType,
      path,
    });

    const appendChildWithTitle = (path: string = 'title') =>
      wrapper.append({
        type: 'default',
        title: {
          type: DataComponentTypes.variable,
          variableType: DataCollectionStateType.currentItem,
          collectionId: keyRootData,
          path,
        },
        components: {
          tagName: 'span',
          type: DataComponentTypes.variable,
          dataResolver: { collectionId: keyRootData, variableType: DataCollectionStateType.currentItem, path },
        },
      })[0];

    test('children reflect resolved value from dataResolver', () => {
      wrapper.setDataResolver(createDataResolver('contentDataSource.blogs.data'));
      wrapper.setResolverCurrentItem(0);
      const child = appendChildWithTitle();

      expect(child.get('title')).toBe(blogsData[0].title);

      firstRecord.set('data', [{ id: 'blog1', title: 'New Blog Title' }]);
      expect(child.get('title')).toBe('New Blog Title');
    });

    test('children update collectionStateMap on wrapper.setDataResolver', () => {
      const child = appendChildWithTitle();
      wrapper.setDataResolver(createDataResolver('contentDataSource.blogs.data'));
      wrapper.setResolverCurrentItem(0);

      expect(child.get('title')).toBe(blogsData[0].title);

      firstRecord.set('data', [{ id: 'blog1', title: 'Updated Title' }]);
      expect(child.get('title')).toBe('Updated Title');
    });

    test('wrapper should handle objects as collection state', () => {
      wrapper.setDataResolver(createDataResolver('contentDataSource.productsById.data'));
      wrapper.setResolverCurrentItem('product2');
      const child = appendChildWithTitle('title');

      expect(child.get('title')).toBe(productsById.product2.title);
    });

    test('wrapper should handle default data source records', () => {
      wrapper.setDataResolver(createDataResolver(blogDataSourceId));

      const child = appendChildWithTitle('title');
      expect(child.get('title')).toBe(blogsData[0].title);
      expect(child.getInnerHTML()).toBe(`<span>${blogsData[0].title}</span>`);

      const eventUpdate = jest.fn();
      em.on(em.events.updateBefore, eventUpdate);

      wrapper.setResolverCurrentItem(1);
      expect(child.get('title')).toBe(blogsData[1].title);
      expect(child.getInnerHTML()).toBe(`<span>${blogsData[1].title}</span>`);

      wrapper.setResolverCurrentItem(blogsData[2].id);
      expect(child.get('title')).toBe(blogsData[2].title);
      expect(child.getInnerHTML()).toBe(`<span>${blogsData[2].title}</span>`);

      // No update events are expected
      expect(eventUpdate).toHaveBeenCalledTimes(0);
    });
  });
});
```

--------------------------------------------------------------------------------

````

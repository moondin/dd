---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 76
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 76 of 97)

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

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/test/specs/css_composer/index.ts

```typescript
import CssComposer from '../../../src/css_composer';
import Editor from '../../../src/editor/model/Editor';
import utils from '../../test_utils.js';

describe('Css Composer', () => {
  describe('Main', () => {
    let obj: CssComposer;
    let em: Editor;
    let config: any;
    let storagMock = utils.storageMock();
    let editorModel = {
      getCss() {
        return 'testCss';
      },
      getCacheLoad() {
        return storagMock.load();
      },
    };

    const setSmConfig = () => {
      config.stm = storagMock;
      config.stm.getConfig = () => ({
        storeCss: 1,
        storeStyles: 1,
      });
    };
    const setEm = () => {
      config.em = editorModel;
    };

    const getCSS = (obj: CssComposer) =>
      obj
        .getAll()
        .map((r) => r.toCSS())
        .join('');

    beforeEach(() => {
      em = new Editor({});
      config = { em };
      obj = new CssComposer(em);
    });

    afterEach(() => {
      em.destroy();
    });

    test('Object exists', () => {
      expect(CssComposer).toBeTruthy();
    });

    test('storageKey returns array', () => {
      expect(obj.storageKey).toEqual('styles');
    });

    test('Store data', () => {
      setSmConfig();
      setEm();
      expect(JSON.parse(JSON.stringify(obj.store()))).toEqual({ styles: [] });
    });

    test('Rules are empty', () => {
      expect(obj.getAll().length).toEqual(0);
    });

    test('Create new rule with correct selectors', () => {
      var sel = new obj.Selectors();
      var s1 = sel.add({ name: 'test1' });
      var rule = obj.add(sel.models);
      expect(rule.getSelectors().at(0)).toEqual(s1);
    });

    test('Create new rule correctly', () => {
      var sel = new obj.Selectors();
      var s1 = sel.add({ name: 'test1' });
      var rule = obj.add(sel.models, 'state1', 'width1');
      expect(rule.get('state')).toEqual('state1');
      expect(rule.get('mediaText')).toEqual('width1');
    });

    test('Add rule to collection', () => {
      var sel = new obj.Selectors([{ name: 'test1' }]);
      var rule = obj.add(sel.models);
      expect(obj.getAll().length).toEqual(1);
      expect(obj.getAll().at(0).getSelectors().at(0).get('name')).toEqual('test1');
    });

    test('Returns correct rule with the same selector', () => {
      var sel = new obj.Selectors([{ name: 'test1' }]);
      var rule1 = obj.add(sel.models);
      var rule2 = obj.get(sel.models);
      expect(rule1).toEqual(rule2);
    });

    test('Returns correct rule with the same selectors', () => {
      var sel1 = new obj.Selectors([{ name: 'test1' }]);
      var rule1 = obj.add(sel1.models);

      var sel2 = new obj.Selectors([{ name: 'test21' }, { name: 'test22' }]);
      var rule2 = obj.add(sel2.models);

      var rule3 = obj.get(sel2.models);
      expect(rule3).toEqual(rule2);
    });

    test('Do not create multiple rules with the same name selectors', () => {
      var sel1 = new obj.Selectors([{ name: 'test21' }, { name: 'test22' }]);
      var rule1 = obj.add(sel1.models);

      var sel2 = new obj.Selectors([{ name: 'test22' }, { name: 'test21' }]);
      var rule2 = obj.add(sel2.models);
      expect(rule2).toEqual(rule1);
    });

    test("Don't duplicate rules", () => {
      var sel = new obj.Selectors([]);
      var s1 = sel.add({ name: 'test1' });
      var s2 = sel.add({ name: 'test2' });
      var s3 = sel.add({ name: 'test3' });

      var rule1 = obj.add([s1, s3]);
      var rule2 = obj.add([s3, s1]);

      expect(rule2).toEqual(rule1);
    });

    test('Returns correct rule with the same mixed selectors', () => {
      var sel = new obj.Selectors([]);
      var s1 = sel.add({ name: 'test1' });
      var s2 = sel.add({ name: 'test2' });
      var s3 = sel.add({ name: 'test3' });
      var rule1 = obj.add([s1, s3]);
      var rule2 = obj.get([s3, s1]);
      expect(rule2).toEqual(rule1);
    });

    test('Returns correct rule with the same selectors and state', () => {
      var sel = new obj.Selectors([]);
      var s1 = sel.add({ name: 'test1' });
      var s2 = sel.add({ name: 'test2' });
      var s3 = sel.add({ name: 'test3' });
      var rule1 = obj.add([s1, s3], 'hover');
      var rule2 = obj.get([s3, s1], 'hover');
      expect(rule2).toEqual(rule1);
    });

    test('Returns correct rule with the same selectors, state and width', () => {
      var sel = new obj.Selectors([]);
      var s1 = sel.add({ name: 'test1' });
      var rule1 = obj.add([s1], 'hover', '1');
      var rule2 = obj.get([s1], 'hover', '1');
      expect(rule2).toEqual(rule1);
    });

    test('Renders correctly', () => {
      expect(obj.render()).toBeTruthy();
    });

    test('Create a rule with id selector by using setIdRule()', () => {
      const name = 'test';
      obj.setIdRule(name, { color: 'red' });
      expect(obj.getAll().length).toEqual(1);
      const rule = obj.getIdRule(name)!;
      expect(rule.selectorsToString()).toEqual(`#${name}`);
      expect(rule.styleToString()).toEqual('color:red;');
      expect(rule.styleToString({ important: true })).toEqual('color:red !important;');
      expect(rule.styleToString({ important: ['color'] })).toEqual('color:red !important;');
    });

    test('Create a rule with id selector and state by using setIdRule()', () => {
      const name = 'test';
      const state = 'hover';
      obj.setIdRule(name, { color: 'red' }, { state });
      expect(obj.getAll().length).toEqual(1);
      const rule = obj.getIdRule(name, { state })!;
      expect(rule.selectorsToString()).toEqual(`#${name}:${state}`);
    });

    test('Create a rule with class selector by using setClassRule()', () => {
      const name = 'test';
      obj.setClassRule(name, { color: 'red' });
      expect(obj.getAll().length).toEqual(1);
      const rule = obj.getClassRule(name)!;
      expect(rule.selectorsToString()).toEqual(`.${name}`);
      expect(rule.styleToString()).toEqual('color:red;');
    });

    test('Create a rule with class selector and state by using setClassRule()', () => {
      const name = 'test';
      const state = 'hover';
      obj.setClassRule(name, { color: 'red' }, { state });
      expect(obj.getAll().length).toEqual(1);
      const rule = obj.getClassRule(name, { state })!;
      expect(rule.selectorsToString()).toEqual(`.${name}:${state}`);
    });

    test('Get the right rule, containg similar selector names', () => {
      const all = obj.getAll();
      const name = 'rule-test';
      const selClass = `.${name}`;
      const selId = `#${name}`;
      const decl = '{colore:red;}';
      all.add(`${selClass}${decl} ${selId}${decl}`);
      expect(all.length).toBe(2);
      const ruleClass = all.at(0);
      const ruleId = all.at(1);
      // Pre-check
      expect(ruleClass.selectorsToString()).toBe(selClass);
      expect(ruleId.selectorsToString()).toBe(selId);
      expect(ruleClass.toCSS()).toBe(`${selClass}${decl}`);
      expect(ruleId.toCSS()).toBe(`${selId}${decl}`);
      // Check the get with the right rule
      expect(obj.get(ruleClass.getSelectors())).toBe(ruleClass);
      expect(obj.get(ruleId.getSelectors())).toBe(ruleId);
    });

    describe('setRule/getRule', () => {
      test('Create a simple class-based rule', () => {
        const selector = '.test';
        obj.setRule(selector, { color: 'red' });
        expect(obj.getAll().length).toEqual(1);
        const rule = obj.getRule(selector)!;
        expect(rule.selectorsToString()).toEqual(selector);
        expect(rule.styleToString()).toEqual('color:red;');
      });

      test('Avoid creating multiple rules with the same selector', () => {
        const selector = '.test';
        obj.setRule(selector, { color: 'red', background: 'red' });
        obj.setRule(selector, { color: 'blue' });
        expect(obj.getAll().length).toEqual(1);
        const rule = obj.getRule(selector)!;
        expect(rule.selectorsToString()).toEqual(selector);
        expect(rule.styleToString()).toEqual('color:blue;');
      });

      test('Update rule with addStyles option', () => {
        const selector = '.test';
        obj.setRule(selector, { color: 'red', background: 'red' });
        obj.setRule(selector, { color: 'blue' }, { addStyles: true });
        const rule = obj.getRule(selector)!;
        expect(rule.styleToString()).toEqual('color:blue;background:red;');
      });

      test('Create a class-based rule', () => {
        const selector = '.test.test2';
        obj.setRule(selector, { color: 'red' });
        expect(obj.getAll().length).toEqual(1);
        const rule = obj.getRule(selector)!;
        expect(rule.selectorsToString()).toEqual(selector);
        expect(rule.styleToString()).toEqual('color:red;');
      });

      test('Create a class-based rule with a state', () => {
        const selector = '.test.test2:hover';
        obj.setRule(selector, { color: 'red' });
        expect(obj.getAll().length).toEqual(1);
        const rule = obj.getRule(selector)!;
        expect(rule.selectorsToString()).toEqual(selector);
        expect(rule.styleToString()).toEqual('color:red;');
      });

      test('Create a rule with class-based and mixed selectors', () => {
        const selector = '.test.test2:hover, #test .selector';
        obj.setRule(selector, { color: 'red' });
        expect(obj.getAll().length).toEqual(1);
        const rule = obj.getRule(selector)!;
        expect(rule.selectorsToString()).toEqual(selector);
        expect(rule.styleToString()).toEqual('color:red;');
      });

      test('Create a rule with only mixed selectors', () => {
        const selector = '#test1 .class1, .class2 > #id2';
        obj.setRule(selector, { color: 'red' });
        expect(obj.getAll().length).toEqual(1);
        const rule = obj.getRule(selector)!;
        expect(rule.getSelectors().length).toEqual(0);
        expect(rule.selectorsToString()).toEqual(selector);
        expect(rule.styleToString()).toEqual('color:red;');
      });

      test('Create a rule with atRule', () => {
        const toTest = [
          {
            selector: '.class1:hover',
            style: { color: 'blue' },
            opts: {
              atRuleType: 'media',
              atRuleParams: 'screen and (min-width: 480px)',
            },
          },
          {
            selector: '.class1:hover',
            style: { color: 'red' },
            opts: {
              atRuleType: 'media',
              atRuleParams: 'screen and (min-width: 480px)',
            },
          },
        ];
        toTest.forEach((test) => {
          const { selector, style, opts } = test;
          obj.setRule(selector, style, opts);
          expect(obj.getAll().length).toEqual(1);
          const rule = obj.getRule(selector, opts)!;
          expect(rule.getAtRule()).toEqual(`@${opts.atRuleType} ${opts.atRuleParams}`);
          expect(rule.selectorsToString()).toEqual(selector);
          expect(rule.getStyle()).toEqual(style);
        });
      });

      test('Create different rules', () => {
        const toTest = [
          { selector: '.class1:hover', style: { color: '#111' } },
          { selector: '.class1.class2', style: { color: '#222' } },
          { selector: '.class1, .class2 .class3', style: { color: 'red' } },
          { selector: '.class1, .class2 .class4', style: { color: 'green' } },
          { selector: '.class4, .class1 .class2', style: { color: 'blue' } },
          {
            selector: '.class4, .class1 .class2',
            style: { color: 'blue' },
            opt: { atRuleType: 'media', atRuleParams: '(min-width: 480px)' },
          },
        ];
        toTest.forEach((test) => {
          const { selector, style, opt } = test;
          obj.setRule(selector, style, opt);
          const rule = obj.getRule(selector, opt)!;
          const atRule = `${opt?.atRuleType || ''} ${opt?.atRuleParams || ''}`.trim();
          expect(rule.getAtRule()).toEqual(atRule ? `@${atRule}` : '');
          expect(rule.selectorsToString()).toEqual(selector);
          expect(rule.getStyle()).toEqual(style);
        });
        expect(obj.getAll().length).toEqual(toTest.length);
      });
    });

    describe('getRules', () => {
      test('Get rule by class selectors', () => {
        obj.addCollection(`
          .aaa.bbb {
            display:flex;
            padding: 10px 0;
            background:green;
          }
        `);
        const [result] = obj.getRules('.aaa.bbb');
        expect(result.selectorsToString()).toBe('.aaa.bbb');
        // TODO The order of classes should not matter
        // const [result2] = obj.getRules('.bbb.aaa');
        // expect(result2.selectorsToString()).toBe('.aaa.bbb');
      });
    });

    describe('Collections', () => {
      test('Add a single rule as CSS string', () => {
        const cssRule = '.test-rule{color:red;}';
        obj.addCollection(cssRule);
        expect(obj.getAll().length).toEqual(1);
        expect(getCSS(obj)).toEqual(cssRule);
      });

      test('Add multiple rules as CSS string', () => {
        const cssRules = [
          '.test-rule{color:red;}',
          '.test-rule:hover{color:blue;}',
          '@media (max-width: 992px){.test-rule{color:darkred;}}',
          '@media (max-width: 992px){.test-rule:hover{color:darkblue;}}',
        ];
        const cssString = cssRules.join('');
        obj.addCollection(cssString);
        expect(obj.getAll().length).toEqual(cssRules.length);
        expect(getCSS(obj)).toEqual(cssString);
      });

      test('Able to return the rule inserted as string', () => {
        const cssRule = `
        .test-rule1 {color:red;}
        .test-rule2:hover {
          color: blue;
        }
        @media (max-width: 992px) {
          .test-rule3 {
            color: darkred;
          }
          .test-rule4:hover {
            color: darkblue;
          }
        }
        `;
        const result = obj.addCollection(cssRule);
        const [rule1, rule2, rule3, rule4] = result;
        expect(result.length).toEqual(4);
        expect(obj.getAll().length).toEqual(4);

        expect(obj.get('.test-rule1')).toBe(rule1);
        expect(obj.get('.test-rule1', 'hover')).toBe(null);
        expect(obj.get('.test-rule2', 'hover')).toBe(rule2);
        expect(rule3.get('mediaText')).toBe('(max-width: 992px)');
        expect(obj.get('.test-rule3', undefined, '(max-width: 992px)')).toBe(rule3);
        expect(obj.get('.test-rule4', 'hover', '(max-width: 992px)')).toBe(rule4);
      });

      test('Add rules with @font-face', () => {
        const cssRules = ['@font-face{font-family:"Font1";}', '@font-face{font-family:"Font2";}'];
        const cssRule = cssRules.join('');
        const result = obj.addCollection(cssRule);
        expect(result.length).toEqual(2);
        expect(obj.getAll().length).toEqual(2);

        result.forEach((rule) => {
          expect(rule.getSelectors().length).toBe(0);
          expect(rule.get('selectorsAdd')).toBeFalsy();
          expect(rule.get('mediaText')).toBeFalsy();
          expect(rule.get('atRuleType')).toBe('font-face');
          expect(rule.get('singleAtRule')).toBe(true);
        });

        expect(getCSS(obj)).toEqual(cssRule.trim());
      });

      test('Add rules with @keyframes at rule', () => {
        const cssRule = `
        @keyframes keyname {
          from { width: 0% }
          40%, 50% { width: 50% }
          to { width: 100% }
        }
        `;
        const result = obj.addCollection(cssRule);
        const [rule1, rule2, rule3] = result;
        expect(result.length).toEqual(3);
        expect(obj.getAll().length).toEqual(3);

        result.forEach((rule) => {
          expect(rule.get('mediaText')).toBe('keyname');
          expect(rule.get('atRuleType')).toBe('keyframes');
        });

        expect(rule1.getSelectorsString()).toBe('from');
        expect(rule1.getStyle()).toEqual({ width: '0%' });

        expect(rule2.getSelectorsString()).toBe('40%, 50%');
        expect(rule2.getStyle()).toEqual({ width: '50%' });

        expect(rule3.getSelectorsString()).toBe('to');
        expect(rule3.getStyle()).toEqual({ width: '100%' });
      });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CssComposer.ts]---
Location: grapesjs-dev/packages/core/test/specs/css_composer/e2e/CssComposer.ts

```typescript
import grapesjs, { Editor } from '../../../../src';
import { CssRuleJSON } from '../../../../src/css_composer/model/CssRule';
import { createEl } from '../../../../src/utils/dom';

describe('E2E tests', () => {
  let fixtures: Element;
  let fixture: Element;
  let cssc: Editor['Css'];
  let clsm: Editor['Selectors'];
  let domc: Editor['Components'];
  let rulesSet: CssRuleJSON[];
  let rulesSet2: CssRuleJSON[];

  beforeAll(() => {
    document.body.innerHTML = '<div id="fixtures"></div>';
    fixtures = document.body.firstElementChild!;
  });

  beforeEach((done) => {
    const gjs = grapesjs.init({
      stylePrefix: '',
      storageManager: { autoload: false, type: 'none' },
      container: 'csscomposer-fixture',
    });
    cssc = gjs.CssComposer;
    clsm = gjs.SelectorManager;
    domc = gjs.DomComponents;
    fixture = createEl('div', { class: 'csscomposer-fixture' });
    fixtures.appendChild(fixture);
    rulesSet = [
      { selectors: [{ name: 'test1' }, { name: 'test2' }] },
      { selectors: [{ name: 'test2' }, { name: 'test3' }] },
      { selectors: [{ name: 'test3' }] },
    ];
    rulesSet2 = [
      {
        selectors: [{ name: 'test1' }, { name: 'test2' }],
        state: ':active',
      },
      { selectors: [{ name: 'test2' }, { name: 'test3' }] },
      { selectors: [{ name: 'test3' }], mediaText: '(max-width: 900px)' },
    ];
    done();
  });

  afterAll(() => {
    fixture.remove();
  });

  test('Rules are correctly imported from default property', () => {
    const gj = grapesjs.init({
      stylePrefix: '',
      storageManager: { autoload: false, type: 'none' },
      cssComposer: { rules: rulesSet as any },
      container: 'csscomposer-fixture',
    });
    const cssc = gj.editor.get('CssComposer');
    expect(cssc.getAll().length).toEqual(rulesSet.length);
    const cls = gj.editor.get('SelectorManager').getAll();
    expect(cls.length).toEqual(3);
  });

  test('New rule adds correctly the class inside selector manager', () => {
    const rules = cssc.getAll();
    rules.add({ selectors: [{ name: 'test1', private: true }] });
    const rule = clsm.getAll().at(0);
    expect(rule.get('name')).toEqual('test1');
    expect(rule.get('private')).toEqual(true);
  });

  test('New rules are correctly imported inside selector manager', () => {
    const rules = cssc.getAll();
    rulesSet.forEach((item) => {
      rules.add(item);
    });
    const cls = clsm.getAll();
    expect(cls.length).toEqual(3);
    expect(cls.at(0).get('name')).toEqual('test1');
    expect(cls.at(1).get('name')).toEqual('test2');
    expect(cls.at(2).get('name')).toEqual('test3');
  });

  test('Add rules from the new component added as a string with style tag', () => {
    const comps = domc.getComponents();
    const rules = cssc.getAll();
    comps.add('<div>Test</div><style>.test{color: red} .test2{color: blue}</style>');
    expect(comps.length).toEqual(1);
    expect(rules.length).toEqual(2);
  });

  test('Add raw rule objects with addCollection', () => {
    cssc.addCollection(rulesSet);
    expect(cssc.getAll().length).toEqual(3);
    expect(clsm.getAll().length).toEqual(3);
  });

  test('Add raw rule objects twice with addCollection do not duplucate rules', () => {
    const rulesSet2Copy = JSON.parse(JSON.stringify(rulesSet2));
    const coll1 = cssc.addCollection(rulesSet2);
    const coll2 = cssc.addCollection(rulesSet2Copy);
    expect(cssc.getAll().length).toEqual(3);
    expect(clsm.getAll().length).toEqual(3);
    expect(coll1).toEqual(coll2);
  });

  test('Extend css rule style, if requested', () => {
    const style1 = { color: 'red', width: '10px' };
    const style2 = { height: '20px', width: '20px' };
    const rule1 = {
      selectors: ['test1'],
      style: style1,
    };
    const rule2 = {
      selectors: ['test1'],
      style: style2,
    };
    let ruleOut = cssc.addCollection([rule1])[0];
    // ruleOut is a Model
    ruleOut = JSON.parse(JSON.stringify(ruleOut));
    const ruleResult: CssRuleJSON = {
      selectors: ['test1'],
      style: {
        color: 'red',
        width: '10px',
      },
    };
    expect(ruleOut).toEqual(ruleResult);
    ruleOut = cssc.addCollection([rule2], { extend: 1 })[0];
    ruleOut = JSON.parse(JSON.stringify(ruleOut));
    ruleResult.style = {
      color: 'red',
      height: '20px',
      width: '20px',
    };
    expect(ruleOut).toEqual(ruleResult);
  });

  test('Do not extend with different selectorsAdd', () => {
    const style1 = { color: 'red', width: '10px' };
    const style2 = { height: '20px', width: '20px' };
    const rule1 = {
      selectors: [],
      selectorsAdd: '*',
      style: style1,
    };
    const rule2 = {
      selectors: [],
      selectorsAdd: 'p',
      style: style2,
    };
    let rule1Out = cssc.addCollection([rule1], { extend: 1 })[0];
    let rule2Out = cssc.addCollection([rule2], { extend: 1 })[0];
    rule1Out = JSON.parse(JSON.stringify(rule1Out));
    rule2Out = JSON.parse(JSON.stringify(rule2Out));
    const rule1Result = {
      selectors: [],
      selectorsAdd: '*',
      style: {
        color: 'red',
        width: '10px',
      },
    };
    const rule2Result = {
      selectors: [],
      selectorsAdd: 'p',
      style: {
        height: '20px',
        width: '20px',
      },
    };
    expect(rule1Out).toEqual(rule1Result);
    expect(rule2Out).toEqual(rule2Result);
  });

  test('Add raw rule objects with width via addCollection', () => {
    const coll1 = cssc.addCollection(rulesSet2);
    expect(coll1[2].get('mediaText')).toEqual(rulesSet2[2].mediaText);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CssModels.ts]---
Location: grapesjs-dev/packages/core/test/specs/css_composer/model/CssModels.ts

```typescript
import CssRule from '../../../../src/css_composer/model/CssRule';
import CssRules from '../../../../src/css_composer/model/CssRules';
import Selectors from '../../../../src/selector_manager/model/Selectors';
import Selector from '../../../../src/selector_manager/model/Selector';

describe('CssRule', () => {
  let obj: CssRule;

  beforeEach(() => {
    obj = new CssRule({} as any);
  });

  test('Has selectors property', () => {
    expect(obj.has('selectors')).toEqual(true);
  });

  test('Has style property', () => {
    expect(obj.has('style')).toEqual(true);
  });

  test('Has state property', () => {
    expect(obj.has('state')).toEqual(true);
  });

  test('No default selectors', () => {
    expect(obj.getSelectors().length).toEqual(0);
  });

  test('Compare returns true with the same selectors', () => {
    var s1 = obj.getSelectors().add({ name: 'test1' });
    var s2 = obj.getSelectors().add({ name: 'test2' });
    expect(obj.compare([s1, s2])).toEqual(true);
  });

  test('Compare with different state', () => {
    var s1 = obj.getSelectors().add({ name: 'test1' });
    var s2 = obj.getSelectors().add({ name: 'test2' });
    obj.set('state', 'hover');
    expect(obj.compare([s1, s2])).toEqual(false);
    expect(obj.compare([s1, s2], 'hover')).toEqual(true);
  });

  test('Compare with different mediaText', () => {
    var s1 = obj.getSelectors().add({ name: 'test1' });
    var s2 = obj.getSelectors().add({ name: 'test2' });
    obj.set('state', 'hover');
    obj.set('mediaText', '1000');
    obj.set('atRuleType', 'media');
    expect(obj.compare([s1, s2])).toEqual(false);
    expect(obj.compare([s1, s2], 'hover')).toEqual(false);
    expect(obj.compare([s2, s1], 'hover', '1000')).toEqual(true);
  });

  test('toCSS returns empty if there is no style', () => {
    var s1 = obj.getSelectors().add({ name: 'test1' });
    expect(obj.toCSS()).toEqual('');
  });

  test('toCSS returns empty if there is no selectors', () => {
    obj.setStyle({ color: 'red' });
    expect(obj.toCSS()).toEqual('');
  });

  test('toCSS returns simple CSS', () => {
    obj.getSelectors().add({ name: 'test1' });
    obj.setStyle({ color: 'red' });
    expect(obj.toCSS()).toEqual('.test1{color:red;}');
  });

  test('toCSS wraps correctly inside media rule', () => {
    const media = '(max-width: 768px)';
    obj.set('atRuleType', 'media');
    obj.set('mediaText', media);
    obj.getSelectors().add({ name: 'test1' });
    obj.setStyle({ color: 'red' });
    expect(obj.toCSS()).toEqual(`@media ${media}{.test1{color:red;}}`);
  });

  test('toCSS with a generic at-rule', () => {
    obj.set('atRuleType', 'supports');
    obj.getSelectors().add({ name: 'test1' });
    obj.setStyle({ 'font-family': 'Open Sans' });
    expect(obj.toCSS()).toEqual('@supports{.test1{font-family:Open Sans;}}');
  });

  test('toCSS with a generic single at-rule', () => {
    obj.set('atRuleType', 'font-face');
    obj.set('singleAtRule', true);
    obj.setStyle({ 'font-family': 'Sans' });
    expect(obj.toCSS()).toEqual('@font-face{font-family:Sans;}');
  });

  test('toCSS with a generic at-rule and condition', () => {
    obj.set('atRuleType', 'font-face');
    obj.set('mediaText', 'some-condition');
    obj.getSelectors().add({ name: 'test1' });
    obj.setStyle({ 'font-family': 'Open Sans' });
    expect(obj.toCSS()).toEqual('@font-face some-condition{.test1{font-family:Open Sans;}}');
  });
});

describe('CssRules', () => {
  test('Creates collection item correctly', () => {
    var c = new CssRules([], {});
    var m = c.add({});
    expect(m instanceof CssRule).toEqual(true);
  });
});

describe('Selectors', () => {
  test('Creates collection item correctly', () => {
    var c = new Selectors();
    var m = c.add({});
    expect(m instanceof Selector).toEqual(true);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CssRulesView.ts]---
Location: grapesjs-dev/packages/core/test/specs/css_composer/view/CssRulesView.ts

```typescript
import CssRulesView from '../../../../src/css_composer/view/CssRulesView';
import CssRules from '../../../../src/css_composer/model/CssRules';
import EditorModel from '../../../../src/editor/model/Editor';
import { EditorConfig } from '../../../../src/editor/config/config';

describe('CssRulesView', () => {
  let obj: CssRulesView;
  const prefix = 'rules';
  const devices = [
    {
      name: 'Desktop',
      width: '',
      widthMedia: '',
    },
    {
      name: 'Tablet',
      width: '768px',
      widthMedia: '992px',
    },
    {
      name: 'Mobile portrait',
      width: '320px',
      widthMedia: '480px',
    },
  ];
  const mobileFirstDevices = [
    {
      name: 'Mobile portrait',
      width: '',
      widthMedia: '',
    },
    {
      name: 'Tablet',
      width: '768px',
      widthMedia: '992px',
    },
    {
      name: 'Desktop',
      width: '1024px',
      widthMedia: '1280px',
    },
  ];

  function buildEditor(editorOptions: EditorConfig) {
    const col = new CssRules([], {});
    const obj = new CssRulesView({
      collection: col,
      config: {
        em: new EditorModel(editorOptions),
      },
    });
    document.body.innerHTML = '<div id="fixtures"></div>';
    document.body.querySelector('#fixtures')!.appendChild(obj.render().el);

    return obj;
  }

  beforeEach(() => {
    obj = buildEditor({
      deviceManager: {
        devices,
      },
    });
  });

  afterEach(() => {
    obj.collection.reset();
  });

  test('Object exists', () => {
    expect(CssRulesView).toBeTruthy();
  });

  test('Collection is empty. Styles structure bootstraped', () => {
    expect(obj.$el.html()).toBeTruthy();
    const foundStylesContainers = obj.$el.find('div');
    expect(foundStylesContainers.length).toEqual(devices.length);

    const sortedDevicesWidthMedia = devices
      .map((dvc) => dvc.widthMedia)
      .sort((left, right) => {
        return (
          (Number(right?.replace('px', '')) || Number.MAX_VALUE) - (Number(left?.replace('px', '')) || Number.MAX_VALUE)
        );
      })
      .map((widthMedia) => parseFloat(widthMedia));

    foundStylesContainers.each((idx, $styleC) => {
      const width = sortedDevicesWidthMedia[idx];
      expect($styleC.id).toEqual(`${prefix}${width ? `-${width}` : ''}`);
    });
  });

  test('Collection is empty. Styles structure with mobile first bootstraped', () => {
    obj = buildEditor({
      mediaCondition: 'min-width',
      deviceManager: {
        devices: mobileFirstDevices,
      },
    });

    expect(obj.$el.html()).toBeTruthy();
    const foundStylesContainers = obj.$el.find('div');
    expect(foundStylesContainers.length).toEqual(mobileFirstDevices.length);

    const sortedDevicesWidthMedia = mobileFirstDevices
      .map((dvc) => dvc.widthMedia)
      .sort((left, right) => {
        const a = Number(left?.replace('px', '')) || Number.MIN_VALUE;
        const b = Number(right?.replace('px', '')) || Number.MIN_VALUE;
        return a - b;
      })
      .map((widthMedia) => parseFloat(widthMedia));

    foundStylesContainers.each((idx, $styleC) => {
      const width = sortedDevicesWidthMedia[idx];
      expect($styleC.id).toEqual(`${prefix}${width ? `-${width}` : ''}`);
    });
  });

  test('Add new rule', () => {
    const spy = jest.spyOn(obj, 'addToCollection');
    obj.collection.add({});
    expect(spy).toBeCalledTimes(1);
  });

  test('Add correctly rules with different media queries', () => {
    const rules = [
      {
        selectorsAdd: '#testid',
      },
      {
        selectorsAdd: '#testid2',
        mediaText: '(max-width: 1000px)',
      },
      {
        selectorsAdd: '#testid3',
        mediaText: '(min-width: 900px)',
      },
      {
        selectorsAdd: '#testid4',
        mediaText: 'screen and (max-width: 900px) and (min-width: 600px)',
      },
    ];
    obj.collection.add(rules);
    const stylesCont = obj.el.querySelector(`#${obj.className}`)!;
    expect(stylesCont.children.length).toEqual(rules.length);
  });

  test('Render new rule', () => {
    obj.collection.add({});
    expect(obj.$el.find(`#${prefix}`).html()).toBeTruthy();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CssRuleView.ts]---
Location: grapesjs-dev/packages/core/test/specs/css_composer/view/CssRuleView.ts

```typescript
import CssRuleView from '../../../../src/css_composer/view/CssRuleView';
import CssRule from '../../../../src/css_composer/model/CssRule';

describe('CssRuleView', () => {
  let obj: CssRuleView;
  let fixtures: HTMLElement;

  beforeEach(() => {
    const model = new CssRule({} as any, {});
    obj = new CssRuleView({ model });
    document.body.innerHTML = '<div id="fixtures"></div>';
    fixtures = document.body.querySelector('#fixtures')!;
    fixtures.appendChild(obj.render().el);
  });

  afterEach(() => {
    obj.model.destroy();
  });

  test('Object exists', () => {
    expect(CssRuleView).toBeTruthy();
  });

  test('Empty style inside', () => {
    expect(fixtures.innerHTML).toEqual('<style></style>');
  });

  test('On update of style always empty as there is no selectors', () => {
    obj.model.set('style', { prop: 'value' });
    expect(fixtures.innerHTML).toEqual('<style></style>');
  });

  describe('CssRuleView with selectors', () => {
    let objReg: CssRuleView;

    beforeEach(() => {
      const selectors = [{ name: 'test1' }, { name: 'test2' }] as any;
      const model = new CssRule({ selectors });
      objReg = new CssRuleView({ model });
      objReg.render();
      document.body.innerHTML = '<div id="fixtures"></div>';
      fixtures = document.body.querySelector('#fixtures')!;
      fixtures.appendChild(objReg.el);
    });

    afterEach(() => {
      objReg.model.destroy();
    });

    test('Empty with no style', () => {
      expect(objReg.$el.html()).toEqual('');
    });

    test('Not empty on update of style', () => {
      objReg.model.set('style', { prop: 'value' });
      expect(objReg.$el.html()).toEqual('.test1.test2{prop:value;}');
    });

    test('State correctly rendered', () => {
      objReg.model.set('style', { prop: 'value' });
      objReg.model.set('state', 'hover');
      expect(objReg.$el.html()).toEqual('.test1.test2:hover{prop:value;}');
    });

    test('State render changes on update', () => {
      objReg.model.set('style', { prop: 'value' });
      objReg.model.set('state', 'hover');
      objReg.model.set('state', '');
      expect(objReg.$el.html()).toEqual('.test1.test2{prop:value;}');
    });

    test('Render media queries', () => {
      objReg.model.set('style', { prop: 'value' });
      objReg.model.set('mediaText', '(max-width: 999px)');
      expect(objReg.$el.html()).toEqual('@media (max-width: 999px){.test1.test2{prop:value;}}');
    });

    test('Empty on clear', () => {
      objReg.model.set('style', { prop: 'value' });
      objReg.model.set('style', {});
      expect(objReg.$el.html()).toEqual('');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/index.ts
Signals: TypeORM

```typescript
import DataSourceManager from '../../../src/data_sources';
import { DataSourceProps } from '../../../src/data_sources/types';
import EditorModel from '../../../src/editor/model/Editor';
import { setupTestEditor } from '../../common';

describe('DataSourceManager', () => {
  let em: EditorModel;
  let dsm: DataSourceManager;
  type Record = { id: string; name: string; metadata?: any };
  const dsTest: DataSourceProps<Record> = {
    id: 'ds1',
    records: [
      { id: 'id1', name: 'Name1' },
      { id: 'id2', name: 'Name2' },
      { id: 'id3', name: 'Name3' },
    ],
  };

  const addDataSource = () => dsm.add(dsTest);

  beforeEach(() => {
    ({ em, dsm } = setupTestEditor());
  });

  afterEach(() => {
    em.destroy();
  });

  test('DataSourceManager exists', () => {
    expect(dsm).toBeTruthy();
  });

  test('add DataSource with records', () => {
    const eventAdd = jest.fn();
    em.on(dsm.events.add, eventAdd);
    const ds = addDataSource();
    expect(dsm.getAll().length).toBe(1);
    expect(eventAdd).toHaveBeenCalledTimes(1);
    expect(ds.getRecords().length).toBe(3);
  });

  test('get added DataSource', () => {
    const ds = addDataSource();
    expect(dsm.get(dsTest.id)).toBe(ds);
  });

  test('remove DataSource', () => {
    const event = jest.fn();
    em.on(dsm.events.remove, event);
    const ds = addDataSource();
    dsm.remove('ds1');
    expect(dsm.getAll().length).toBe(0);
    expect(event).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledWith(ds, expect.any(Object));
  });

  describe('getValue', () => {
    test('get value from records', () => {
      const ds = addDataSource();
      const testPath = ds.getRecord('id2')?.getPath('name') || '';
      expect(dsm.getValue(testPath)).toBe('Name2');
      expect(dsm.getValue(`ds1.id1.name`)).toBe('Name1');
      expect(dsm.getValue(`ds1[id1]name`)).toBe('Name1');
      expect(dsm.getValue(`ds1.non-existing.name`)).toBeUndefined();
      expect(dsm.getValue(`ds1.non-existing.name`, 'Default name')).toBe('Default name');
      expect(dsm.getValue(`ds1.id1.nonExisting`)).toBeUndefined();
      expect(dsm.getValue('non-existing-ds.id1.name')).toBeUndefined();
    });

    test('with nested values', () => {
      const ds = addDataSource();
      const address = { city: 'CityName' };
      const roles = ['admin', 'user'];
      ds.addRecord({
        id: 'id4',
        name: 'Name4',
        metadata: { address, roles },
      });

      expect(dsm.getValue(`ds1.id4.metadata.address`)).toEqual(address);
      expect(dsm.getValue(`ds1.id4.metadata.address.city`)).toEqual(address.city);
      expect(dsm.getValue(`ds1.id4.metadata.roles`)).toEqual(roles);
      expect(dsm.getValue(`ds1.id4.metadata.roles[1]`)).toEqual(roles[1]);
    });
  });

  describe('setValue', () => {
    test('set value in existing record', () => {
      addDataSource();
      expect(dsm.setValue('ds1.id1.name', 'Name1 Up')).toBe(true);
      expect(dsm.getValue('ds1.id1.name')).toBe('Name1 Up');

      expect(dsm.setValue('ds1.id1.newField', 'new field value')).toBe(true);
      expect(dsm.getValue('ds1.id1.newField')).toBe('new field value');
      expect(dsm.setValue('non-existing-ds.id1.name', 'New Name')).toBe(false);
      expect(dsm.setValue('non-existing-ds.none.name', 'New Name')).toBe(false);

      expect(dsm.setValue('invalid-path', 'New Name')).toBe(false);
    });

    test('set nested values', () => {
      const ds = addDataSource();
      const address = { city: 'CityName' };
      const roles = ['admin', 'user', 'member'];
      const newObj = { newValue: '1' };
      ds.addRecord({
        id: 'id4',
        name: 'Name4',
        metadata: { address, roles },
      });

      // Check object updates
      expect(dsm.setValue('ds1.id4.metadata.address.city', 'NewCity')).toBe(true);
      expect(dsm.getValue('ds1.id4.metadata.address.city')).toBe('NewCity');
      expect(dsm.setValue('ds1.id4.metadata.newObj', newObj)).toBe(true);
      expect(dsm.getValue('ds1.id4.metadata.newObj')).toEqual(newObj);

      // Check array updates
      expect(dsm.setValue('ds1.id4.metadata.roles[1]', 'editor')).toBe(true);
      expect(dsm.getValue('ds1.id4.metadata')).toEqual({
        newObj: { newValue: '1' },
        address: { city: 'NewCity' },
        roles: ['admin', 'editor', 'member'],
      });

      // Set entirely new nested object
      const newAddress = { city: 'AnotherCity', country: 'SomeCountry' };
      expect(dsm.setValue('ds1.id4.metadata.address', newAddress)).toBe(true);
      expect(dsm.getValue('ds1.id4.metadata.address')).toEqual(newAddress);

      const newRoles = ['editor', 'viewer'];
      expect(dsm.setValue('ds1.id4.metadata.roles', newRoles)).toBe(true);
      expect(dsm.getValue('ds1.id4.metadata.roles')).toEqual(newRoles);

      expect(dsm.getValue('ds1.id4.metadata')).toEqual({
        newObj: { newValue: '1' },
        address: { city: 'AnotherCity', country: 'SomeCountry' },
        roles: ['editor', 'viewer'],
      });

      // Set completely new nested structure
      const newMetadata = { tags: ['tag1', 'tag2'], settings: { theme: 'dark' } };
      expect(dsm.setValue('ds1.id4.metadata', newMetadata)).toBe(true);
      expect(dsm.getValue('ds1.id4.metadata')).toEqual(newMetadata);
      expect(dsm.getValue('ds1.id4.metadata.settings.theme')).toBe('dark');

      expect(dsm.getValue('ds1.id4.metadata')).toEqual({
        tags: ['tag1', 'tag2'],
        settings: { theme: 'dark' },
      });
    });
  });
});
```

--------------------------------------------------------------------------------

````

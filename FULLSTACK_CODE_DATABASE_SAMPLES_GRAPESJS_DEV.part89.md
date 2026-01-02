---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 89
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 89 of 97)

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
Location: grapesjs-dev/packages/core/test/specs/grapesjs/index.ts

```typescript
import grapesjs, { Component, Editor, usePlugin } from '../../../src';
import ComponentWrapper from '../../../src/dom_components/model/ComponentWrapper';
import { EditorConfig } from '../../../src/editor/config/config';
import type { Plugin } from '../../../src/plugin_manager';
import { StorageManagerConfig } from '../../../src/storage_manager/config/config';
import { fixJsDom, fixJsDomIframe, waitEditorEvent } from '../../common';

type TestPlugin = Plugin<{ cVal: string }>;

describe('GrapesJS', () => {
  describe('Main', () => {
    let fixture: HTMLElement;
    let editorName = '';
    let htmlString = '';
    let config: Partial<EditorConfig>;
    let cssString = '';
    let documentEl = '';

    let storage: any;
    let storageId = 'testStorage';
    let storageMock = {
      async store(data: any) {
        storage = data;
      },
      load() {
        return storage;
      },
    };

    const initTestEditor = (config: Partial<EditorConfig>) => {
      const editor = grapesjs.init({
        ...config,
        plugins: [fixJsDom, ...(config.plugins || [])],
      });
      fixJsDomIframe(editor.getModel().shallow);

      return editor;
    };

    beforeAll(() => {
      editorName = 'editor-fixture';
    });

    beforeEach(() => {
      storage = {};
      const initHtml = '<div class="test1"></div><div class="test2"></div>';
      htmlString = `<body>${initHtml}</body>`;
      cssString = '.test2{color:red}.test3{color:blue}';
      documentEl = '<style>' + cssString + '</style>' + initHtml;
      config = {
        container: '#' + editorName,
        storageManager: {
          autoload: false,
          autosave: false,
          type: '',
        },
      };
      document.body.innerHTML = `<div id="fixtures"><div id="${editorName}"></div></div>`;
      fixture = document.body.querySelector(`#${editorName}`)!;
    });

    afterEach(() => {
      var plugins = grapesjs.plugins.getAll();
      for (let id in plugins) {
        if (plugins.hasOwnProperty(id)) {
          delete plugins[id];
        }
      }
    });

    test('Main object should be loaded', () => {
      expect(grapesjs).toBeTruthy();
    });

    test('Init new editor', () => {
      var editor = grapesjs.init(config);
      expect(editor).toBeTruthy();
    });

    test('Init new editor with node for container', () => {
      const editor = grapesjs.init({
        container: document.createElement('div'),
        storageManager: {
          autoload: false,
          type: 'none',
        },
      });
      expect(editor).toBeTruthy();
    });

    test('New editor is empty', () => {
      const editor = grapesjs.init(config);
      const html = editor.getHtml();
      //const css = editor.getCss();
      const protCss = editor.getConfig().protectedCss;
      expect(html).toBe('<body></body>');
      //expect((css ? css : '')).toEqual(protCss);
      expect(editor.getComponents().length).toEqual(0);
      expect(editor.getStyle().length).toEqual(0);
    });

    test('Editor canvas baseCSS can be overwritten', (done) => {
      config.components = htmlString;
      config.baseCss = '#wrapper { background-color: #eee; }';
      config.protectedCss = '';
      const editor = initTestEditor({
        ...config,
        components: htmlString,
        baseCss: '#wrapper { background-color: #eee; }',
        protectedCss: '',
      });
      editor.onReady(() => {
        const body = editor.Canvas.getBody();
        expect(body.outerHTML).toContain(config.baseCss);
        expect(body.outerHTML.replace(/\s+/g, ' ')).not.toContain('body { margin: 0;');
        done();
      });
    });

    test('Editor canvas baseCSS defaults to sensible values if not defined', (done) => {
      config.components = htmlString;
      config.protectedCss = '';
      const editor = initTestEditor(config);
      editor.onReady(() => {
        const htmlEl = editor.Canvas.getDocument().documentElement;
        expect(htmlEl.outerHTML.replace(/\s+/g, ' ')).toContain('body { background-color: #fff');
        done();
      });
    });

    test('Init editor with html', () => {
      config.components = htmlString;
      var editor = grapesjs.init(config);
      var comps = editor.DomComponents.getComponents();
      expect(comps.length).toEqual(2);
      expect(comps.at(0).get('classes')?.at(0).get('name')).toEqual('test1');
    });

    test('Init editor with css', () => {
      config.style = cssString;
      var editor = grapesjs.init(config);
      var rules = editor.CssComposer.getAll();
      expect(rules.length).toEqual(2);
      expect(rules.at(0).get('selectors')?.at(0)?.get('name')).toEqual('test2');
    });

    test('Init editor from element', () => {
      config.fromElement = true;
      config.storageManager = false;
      fixture.innerHTML = documentEl;
      const editor = grapesjs.init(config);
      const html = editor.getHtml();
      const css = editor.getCss();
      const protCss = editor.getConfig().protectedCss;
      expect(html).toEqual(htmlString);
      expect(editor.getComponents().length).toEqual(2);
      // .test3 is discarded in CSS
      expect(css).toEqual(`${protCss}.test2{color:red;}`);
      // but it's still there
      expect(editor.getStyle().length).toEqual(2);
    });

    test('Init editor from element with multiple font-face at-rules', () => {
      config.fromElement = true;
      config.storageManager = false;
      fixture.innerHTML =
        `
      <style>
        @font-face {
          font-family: 'A';
          src: url('http://a.link') format('woff2');
        }
        @font-face {
          font-family: 'B';
          src: url('http://b.link') format('woff2');
        }
      </style>` + htmlString;
      const editor = grapesjs.init(config);
      const css = editor.getCss()!;
      const styles = editor.getStyle();
      expect(styles.length).toEqual(2);
      expect((css.match(/@font-face/g) || []).length).toEqual(2);
    });

    test('Set components as HTML', () => {
      var editor = grapesjs.init(config);
      editor.setComponents(htmlString);
      expect(editor.getComponents().length).toEqual(2);
    });

    test('Set components as array of objects', () => {
      var editor = grapesjs.init(config);
      editor.setComponents([{}, {}, {}]);
      expect(editor.getComponents().length).toEqual(3);
    });

    test('Set style as CSS', () => {
      var editor = grapesjs.init(config);
      editor.setStyle(cssString);
      editor.setStyle(cssString);
      var styles = editor.getStyle();
      expect(styles.length).toEqual(2);
      expect(styles.at(1).get('selectors')?.at(0)?.get('name')).toEqual('test3');
    });

    test('Set style as as array of objects', () => {
      var editor = grapesjs.init(config);
      editor.setStyle([{ selectors: ['test4'] }, { selectors: ['test5'] }]);
      var styles = editor.getStyle();
      expect(styles.length).toEqual(2);
      expect(styles.at(1).get('selectors')?.at(0)?.get('name')).toEqual('test5');
    });

    test('Execute custom command', () => {
      var editor = grapesjs.init(config);
      let testValue = '';
      editor.setComponents(htmlString);
      editor.Commands.add('test-command', {
        run(ed, caller, opts) {
          testValue = ed.getHtml() + opts.val;
        },
      });
      editor.runCommand('test-command', { val: 5 });
      expect(testValue).toEqual(htmlString + '5');
    });

    test('Stop custom command', () => {
      var editor = grapesjs.init(config);
      let testValue = '';
      editor.setComponents(htmlString);
      editor.Commands.add('test-command', {
        stop(ed, caller, opts) {
          testValue = ed.getHtml() + opts.val;
        },
      });
      editor.stopCommand('test-command', { val: 5, force: 1 });
      expect(testValue).toEqual(htmlString + '5');
    });

    test('Trigger custom command events', () => {
      const id = 'test-command';
      const editor = grapesjs.init(config);
      const result: Record<string, any> = {};
      const events = editor.Commands.events;
      editor.on(`${events.run}:${id}`, () => {
        expect(editor.Commands.isActive(id)).toBe(true);
        result.run = 1;
      });
      editor.on(`${events.runBeforeCommand}${id}`, () => (result.runBefore = 1));
      editor.on(`${events.stop}:${id}`, () => {
        expect(editor.Commands.isActive(id)).toBe(false);
        result.stop = 1;
      });
      editor.on(`${events.stopBeforeCommand}${id}`, () => (result.stopBefore = 1));
      editor.on(`${events.abort}${id}`, () => (result.abort = 1));
      editor.Commands.add(id, {
        run() {},
        stop() {},
      });
      editor.runCommand(id);
      editor.stopCommand(id);
      editor.on(`${events.runBeforeCommand}${id}`, ({ options }) => (options.abort = 1));
      editor.runCommand(id);
      expect(result).toEqual({
        run: 1,
        runBefore: 1,
        stop: 1,
        stopBefore: 1,
        abort: 1,
      });
    });

    test('Set default devices', () => {
      config.deviceManager = {};
      config.deviceManager.devices = [
        { name: '1', width: '2' },
        { name: '3', width: '4' },
      ];
      var editor = grapesjs.init(config);
      expect(editor.DeviceManager.getAll().length).toEqual(2);
    });

    test('There is no active device', () => {
      var editor = grapesjs.init(config);
      expect(editor.getDevice()).toBe('desktop');
    });

    test('Active another device', () => {
      var editor = grapesjs.init(config);
      editor.setDevice('Tablet');
      expect(editor.getDevice()).toEqual('Tablet');
    });

    test('Keep unused css classes/selectors option for getCSS method', () => {
      config.fromElement = true;
      config.storageManager = false;
      fixture.innerHTML = documentEl;
      const editor = grapesjs.init(config);
      const css = editor.getCss({ keepUnusedStyles: true });
      const protCss = editor.getConfig().protectedCss;
      expect(editor.getStyle().length).toEqual(2);
      expect(css).toEqual(`${protCss}.test2{color:red;}.test3{color:blue;}`);
    });

    test('Keep unused css classes/selectors option for media rules', () => {
      cssString =
        '.test2{color:red}.test3{color:blue} @media only screen and (max-width: 620px) { .notused { color: red; } } ';
      documentEl = '<style>' + cssString + '</style>' + htmlString;
      config.fromElement = true;
      config.storageManager = false;
      fixture.innerHTML = documentEl;
      const editor = grapesjs.init(config);
      const css = editor.getCss({ keepUnusedStyles: true });
      const protCss = editor.getConfig().protectedCss;
      expect(editor.getStyle().length).toEqual(3);
      expect(css).toEqual(
        `${protCss}.test2{color:red;}.test3{color:blue;}@media only screen and (max-width: 620px){.notused{color:red;}}`,
      );
    });

    test('Keep unused css classes/selectors option for init method', () => {
      config.fromElement = true;
      config.storageManager = false;
      fixture.innerHTML = documentEl;
      const editor = grapesjs.init({ ...config, keepUnusedStyles: true });
      const css = editor.getCss();
      const protCss = editor.getConfig().protectedCss;
      expect(editor.getStyle().length).toEqual(2);
      expect(css).toEqual(`${protCss}.test2{color:red;}.test3{color:blue;}`);
    });

    describe('Plugins', () => {
      test('Adds new storage as plugin and store data there', async () => {
        (config.storageManager as StorageManagerConfig).type = storageId;
        config.plugins = [(e) => e.StorageManager.add(storageId, storageMock)];
        const editor = initTestEditor(config);
        editor.setComponents(htmlString);
        const projectData = editor.getProjectData();
        await editor.store();
        const data = await editor.load();
        expect(data).toEqual(projectData);
      });

      test('Adds a new storage and fetch correctly data from it', async () => {
        fixture.innerHTML = documentEl;
        const styleResult = { color: 'white', display: 'block' };
        const styles = [
          {
            selectors: [{ name: 'sclass1' }],
            style: { color: 'green' },
          },
          {
            selectors: [{ name: 'test2' }],
            style: styleResult,
          },
          {
            selectors: [{ name: 'test3' }],
            style: { color: 'black', display: 'block' },
          },
        ];
        storage = {
          styles,
          pages: [{}],
        };
        config.fromElement = true;
        config.plugins = [(e) => e.StorageManager.add(storageId, storageMock)];
        const configStorage = config.storageManager as StorageManagerConfig;
        configStorage.type = storageId;
        configStorage.autoload = true;
        const editor = initTestEditor(config);
        await waitEditorEvent(editor, 'load');
        const { Css } = editor;
        expect(Css.getAll().length).toEqual(styles.length);
        expect(Css.getClassRule('test2')!.getStyle()).toEqual(styleResult);
      });

      test('Execute plugins with custom options', () => {
        const pluginName = storageId + '-plugin-opts';
        grapesjs.plugins.add(pluginName, (edt, opts) => {
          var opts = opts || {};
          edt.getModel().set('customValue', opts.cVal || '');
        });
        config.plugins = [pluginName];
        config.pluginsOpts = {};
        config.pluginsOpts[pluginName] = { cVal: 'TEST' };
        const editor = grapesjs.init(config);
        expect(editor.getModel().get('customValue')).toEqual('TEST');
      });

      test('Execute inline plugins with custom options', () => {
        const inlinePlugin: Plugin<any> = (edt, opts) => {
          var opts = opts || {};
          edt.getModel().set('customValue', opts.cVal || '');
        };
        config.plugins = [inlinePlugin];
        config.pluginsOpts = {};
        config.pluginsOpts[inlinePlugin.toString()] = { cVal: 'TEST' };
        var editor = grapesjs.init(config);
        expect(editor.getModel().get('customValue')).toEqual('TEST');
      });

      test('Execute inline plugins without any options', () => {
        const inlinePlugin: Plugin = (edt) => {
          edt.getModel().set('customValue', 'TEST');
        };
        config.plugins = [inlinePlugin];
        config.pluginsOpts = {};
        var editor = grapesjs.init(config);
        expect(editor.getModel().get('customValue')).toEqual('TEST');
      });

      test('Use plugins defined on window, with custom options', () => {
        const plg: Plugin<any> = (edt, opts) => {
          var opts = opts || {};
          edt.getModel().set('customValue', opts.cVal || '');
        };
        (window as any).globalPlugin = plg;
        config.plugins = ['globalPlugin'];
        config.pluginsOpts = {};
        config.pluginsOpts['globalPlugin'] = { cVal: 'TEST' };
        var editor = grapesjs.init(config);
        expect(editor.getModel().get('customValue')).toEqual('TEST');
      });

      // Problems with iframe loading
      test('Init new editor with custom plugin overrides default commands', () => {
        var editor,
          pluginName = 'test-plugin-opts';

        grapesjs.plugins.add(pluginName, (edt, opts) => {
          let cmdm = edt.Commands;
          // Overwrite export template
          cmdm.add('export-template', { test: 1 });
        });
        config.plugins = [pluginName];

        editor = grapesjs.init(config);
        expect(editor.Commands.get('export-template')!.test).toEqual(1);
      });

      describe('usePlugin', () => {
        test('Execute named plugin from PluginManager', () => {
          let varToTest = '';
          const optionValue = 'TEST-PM';
          const pluginName = 'testplugin';
          grapesjs.plugins.add(pluginName, (edt, opts = {}) => {
            varToTest = opts.cVal || '';
          });
          grapesjs.init({
            ...config,
            plugins: [usePlugin(pluginName, { cVal: optionValue })],
          });
          expect(varToTest).toEqual(optionValue);
        });

        test('Execute inline plugin', () => {
          let varToTest = '';
          const optionValue = 'TEST-inline';
          const inlinePlugin: TestPlugin = (edt, opts) => {
            varToTest = opts.cVal;
          };
          grapesjs.init({
            ...config,
            plugins: [usePlugin(inlinePlugin, { cVal: optionValue })],
          });
          expect(varToTest).toEqual(optionValue);
        });

        test('Execute global plugin', () => {
          let varToTest = '';
          const optionValue = 'TEST-global';
          const pluginName = 'globalPlugin';
          const plg: Plugin<any> = (edt, opts) => {
            varToTest = opts.cVal;
          };
          (window as any)[pluginName] = plg;
          grapesjs.init({
            ...config,
            plugins: [usePlugin(pluginName, { cVal: optionValue })],
          });
          expect(varToTest).toEqual(optionValue);
        });
      });
    });

    describe('Component selection', () => {
      let editor: Editor;
      let wrapper: ComponentWrapper;
      let el1: Component;
      let el2: Component;
      let el3: Component;

      beforeEach((done) => {
        editor = grapesjs.init({
          container: `#${editorName}`,
          storageManager: false,
          plugins: [fixJsDom],
          components: `<div>
            <div id="el1"></div>
            <div id="el2"></div>
            <div id="el3"></div>
          </div>`,
        });
        fixJsDomIframe(editor.getModel().shallow);
        wrapper = editor.DomComponents.getWrapper()!;
        editor.onReady(() => {
          el1 = wrapper.find('#el1')[0];
          el2 = wrapper.find('#el2')[0];
          el3 = wrapper.find('#el3')[0];
          done();
        });
      });

      test('Select a single component', () => {
        expect(editor.getSelected()).toBeFalsy();
        expect(editor.getSelectedAll().length).toBe(0);
        // Select via component
        editor.select(el1);
        expect(editor.getSelected()).toBe(el1);
        expect(editor.getSelectedAll().length).toBe(1);
        editor.select(el2);
        expect(editor.getSelected()).toBe(el2);
        expect(editor.getSelectedAll().length).toBe(1);
        // Deselect via empty array
        editor.select([]);
        expect(editor.getSelected()).toBeFalsy();
        expect(editor.getSelectedAll().length).toBe(0);
      });

      test('Deselect component', () => {
        editor.select(el1);
        expect(editor.getSelected()).toBe(el1);
        expect(editor.getSelectedAll().length).toBe(1);
        // Deselect with undefined
        editor.select();
        expect(editor.getSelected()).toBe(undefined);
        expect(editor.getSelectedAll().length).toBe(0);
      });

      test('Select multiple components', () => {
        // Select at first el1 and el3
        editor.select([el1, el3]);
        expect(editor.getSelected()).toBe(el3);
        expect(editor.getSelectedAll().length).toBe(2);
        // Add el2
        editor.selectAdd(el2);
        expect(editor.getSelected()).toBe(el2);
        expect(editor.getSelectedAll().length).toBe(3);
        // Remove el1
        editor.selectRemove(el1);
        expect(editor.getSelected()).toBe(el2);
        expect(editor.getSelectedAll().length).toBe(2);
        // Add el1 via toggle
        editor.selectToggle(el1);
        expect(editor.getSelected()).toBe(el1);
        expect(editor.getSelectedAll().length).toBe(3);
        // Leave selected only el3
        editor.selectRemove([el1, el2]);
        expect(editor.getSelected()).toBe(el3);
        expect(editor.getSelectedAll().length).toBe(1);
        // Toggle all
        editor.selectToggle([el1, el2, el3]);
        expect(editor.getSelected()).toBe(el2);
        expect(editor.getSelectedAll().length).toBe(2);
        // Add multiple
        editor.selectAdd([el2, el3]);
        expect(editor.getSelected()).toBe(el3);
        expect(editor.getSelectedAll().length).toBe(3);
      });

      test('Selection events', () => {
        const toSpy = {
          selected() {},
          deselected() {},
          toggled() {},
        };
        const selected = jest.spyOn(toSpy, 'selected');
        const deselected = jest.spyOn(toSpy, 'deselected');
        const toggled = jest.spyOn(toSpy, 'toggled');
        editor.on('component:selected', selected as any);
        editor.on('component:deselected', deselected as any);
        editor.on('component:toggled', toggled as any);

        editor.select(el1); // selected=1
        editor.selectAdd(el1); // selected=1
        editor.selectAdd([el2, el3]); // selected=3
        editor.selectToggle([el1, el3]); // deselected=2
        editor.selectRemove(el2); // deselected=3
        editor.select(el1); // selected=4

        expect(selected).toHaveBeenCalledTimes(4);
        expect(deselected).toHaveBeenCalledTimes(3);
        expect(toggled).toHaveBeenCalledTimes(7);
      });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/test/specs/i18n/index.ts

```typescript
import I18n from '../../../src/i18n';
import Editor from '../../../src/editor';
import { I18nConfig } from '../../../src/i18n/config';

describe('I18n', () => {
  describe('Main', () => {
    let obj: I18n;
    let editor = new Editor();
    let em = editor.getModel();

    const newModuleWithConfig = (i18n: I18nConfig) => {
      const editor = new Editor({ i18n });
      const em = editor.getModel();
      return new I18n(em);
    };

    beforeEach(() => {
      obj = new I18n(em);
    });

    test('Object exists', () => {
      expect(obj).toBeTruthy();
    });

    test('getConfig method', () => {
      expect(obj.getConfig()).toBeTruthy();
    });

    test('Default local', () => {
      expect(obj.getLocale()).toBeTruthy();
    });

    test('Init with config', () => {
      const locale = 'it';
      const localeFallback = 'it';
      const msg = 'Hello!!!';
      obj = newModuleWithConfig({
        locale,
        localeFallback,
        detectLocale: false,
        messages: {
          en: { msg },
        },
      });
      expect(obj.getLocale()).toBe(locale);
      expect(obj.getConfig().localeFallback).toBe(localeFallback);
      expect(obj.getLocale()).toBe(locale);
    });

    test('English always imported', () => {
      obj = newModuleWithConfig({
        messages: { it: {} },
      });
      expect(Object.keys(obj.getMessages())).toEqual(['en', 'it']);
    });

    test('setLocale and getLocale methods', () => {
      const localeBefore = obj.getLocale();
      const localeNew = `${localeBefore}2`;
      obj.setLocale(localeNew);
      expect(obj.getLocale()).toBe(localeNew);
    });

    test('Default messages', () => {
      expect(obj.getMessages()).toBeTruthy();
    });

    test('setMessages method', () => {
      const set1 = { en: { msg1: 'Msg 1' } };
      obj.setMessages(set1);
      expect(obj.getMessages()).toEqual(set1);
      const set2 = { en: { msg2: 'Msg 2' } };
      obj.setMessages(set2);
      expect(obj.getMessages()).toEqual(set2);
    });

    test('addMessages method', () => {
      const set1 = { en: { msg1: 'Msg 1', msg2: 'Msg 2' } };
      obj.setMessages(set1);
      const set2 = {
        en: { msg2: 'Msg 2 up', msg3: 'Msg 3' },
        it: { msg1: 'Msg 1' },
      };
      obj.addMessages(set2);
      expect(obj.getMessages()).toEqual({
        en: { msg1: 'Msg 1', msg2: 'Msg 2 up', msg3: 'Msg 3' },
        it: { msg1: 'Msg 1' },
      });
    });

    test('addMessages with deep extend possibility', () => {
      obj.setMessages({
        en: {
          msg1: 'Msg 1',
          msg2: 'Msg 2',
          msg3: {
            msg31: 'Msg 31',
            msg32: { msg321: 'Msg 321' },
          },
        },
      });
      obj.addMessages({
        en: {
          msg2: { msg21: 'Msg 21' },
          msg3: {
            msg32: { msg322: 'Msg 322' },
            msg33: 'Msg 33',
          },
          msg4: 'Msg 4',
        },
      });
      expect(obj.getMessages()).toEqual({
        en: {
          msg1: 'Msg 1',
          msg2: { msg21: 'Msg 21' },
          msg3: {
            msg31: 'Msg 31',
            msg32: {
              msg321: 'Msg 321',
              msg322: 'Msg 322',
            },
            msg33: 'Msg 33',
          },
          msg4: 'Msg 4',
        },
      });
    });

    test('Translate method with global locale', () => {
      const msg1 = 'Msg 1';
      obj.setLocale('en');
      obj.setMessages({
        en: { msg1 },
        it: { msg1: `${msg1} it` },
      });
      expect(obj.t('msg2')).toBe(undefined);
      expect(obj.t('msg1')).toBe(msg1);
    });

    test('Translate method with object structure', () => {
      const msg1 = 'Msg level 1';
      const msg2 = 'Msg level 2';
      obj.setLocale('en');
      obj.setMessages({
        en: {
          key1: {
            msg1,
            key2: {
              msg2,
            },
          },
        },
      });
      expect(obj.t('key1.msg1')).toBe(msg1);
      expect(obj.t('key1.key2.msg2')).toBe(msg2);
      expect(obj.t('key1.key2.msg3')).toBe(undefined);
      expect(obj.t('key1.key3.msg2')).toBe(undefined);
    });

    test('Translate method with custom locale', () => {
      const msg1 = 'Msg 1';
      const msg1Alt = `${msg1} it`;
      obj.setLocale('en');
      obj.setMessages({
        en: { msg1 },
        it: { msg1: msg1Alt },
      });
      expect(obj.t('msg1', { l: 'it' })).toBe(msg1Alt);
    });

    test('Translate method with fallback locale', () => {
      const msg1 = 'Msg en';
      obj.setLocale('it');
      obj.setMessages({
        en: { msg1 },
        it: {},
      });
      expect(obj.t('msg1')).toBe(msg1);
    });

    test('Translate method with a param', () => {
      const msg1 = 'Msg 1 {test}';
      const msg1Alt = `${msg1} it`;
      obj.setLocale('en');
      obj.setMessages({
        en: { msg1 },
        it: { msg1: msg1Alt },
      });
      expect(obj.t('msg1', { params: { test: 'Hello' } })).toBe('Msg 1 Hello');
      expect(obj.t('msg1', { l: 'it', params: { test: 'Hello' } })).toBe('Msg 1 Hello it');
    });

    test('i18n events', () => {
      const handlerAdd = jest.fn();
      const handlerUpdate = jest.fn();
      const handlerLocale = jest.fn();
      em.on('i18n:add', handlerAdd);
      em.on('i18n:update', handlerUpdate);
      em.on('i18n:locale', handlerLocale);
      obj.addMessages({ en: { msg1: 'Msg 1', msg2: 'Msg 2' } });
      obj.setLocale('it');
      expect(handlerAdd).toBeCalledTimes(1);
      expect(handlerUpdate).toBeCalledTimes(1);
      expect(handlerLocale).toBeCalledTimes(1);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: checkbox-not-working.ts]---
Location: grapesjs-dev/packages/core/test/specs/issue_replications/checkbox-not-working.ts

```typescript
import Editor from '../../../src/editor/model/Editor';
import ComponentWrapper from '../../../src/dom_components/model/ComponentWrapper';

// https://github.com/GrapesJS/grapesjs/pull/6095
describe('Checkbox Behaviour', () => {
  let em: Editor;
  let fixtures: HTMLElement;
  let cmpRoot: ComponentWrapper;

  beforeEach(() => {
    em = new Editor({
      mediaCondition: 'max-width',
      avoidInlineStyle: true,
    });
    document.body.innerHTML = '<div id="fixtures"></div>';
    const { Pages, Components } = em;
    Pages.onLoad();
    cmpRoot = Components.getWrapper()!;
    const View = Components.getType('wrapper')!.view;
    const wrapperEl = new View({
      model: cmpRoot,
      config: { ...cmpRoot.config, em },
    });
    wrapperEl.render();
    fixtures = document.body.querySelector('#fixtures')!;
    fixtures.appendChild(wrapperEl.el);
  });

  afterEach(() => {
    em.destroy();
  });

  test('init checkbox to true then change value and assert changes', () => {
    const cmp = cmpRoot.append({
      type: 'checkbox',
      tagName: 'input',
      attributes: { type: 'checkbox', name: 'my-checkbox' },
      traits: [
        {
          type: 'checkbox',
          label: 'Checked',
          name: 'checked',
          value: 'true',
          valueTrue: 'true',
          valueFalse: 'false',
        },
      ],
    })[0];

    const input = cmp.getEl() as HTMLInputElement;
    expect(cmp.getAttributes().checked).toBe('true');
    expect(input?.checked).toBe(true);
    expect(input?.getAttribute('checked')).toBe('true');

    cmp.getTrait('checked').setValue(false);

    expect(input?.getAttribute('checked')).toBe('false');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: grapesjs-dev/packages/core/test/specs/keymaps/index.js

```javascript
import Editor from 'editor';

describe('Keymaps', () => {
  describe('Main', () => {
    let em;
    let obj;
    let editor;

    beforeEach(() => {
      editor = new Editor({ keymaps: { defaults: [] } });
      em = editor.getModel();
      em.loadOnStart();
      obj = editor.Keymaps;
    });

    test('Object exists', () => {
      expect(obj).toBeTruthy();
    });

    test('No keymaps inside', () => {
      var coll = obj.getAll();
      expect(coll).toEqual({});
    });

    test('Add new keymap', () => {
      const id = 'test';
      const keys = 'ctrl+a';
      const handler = () => {};
      const model = obj.add(id, 'ctrl+a', handler);
      expect(obj.get(id)).toEqual({ id, keys, handler });
    });

    test('Add keymap event triggers', () => {
      let called = 0;
      em.on('keymap:add', () => (called = 1));
      const model = obj.add('tes', 'ctrl+a');
      expect(called).toEqual(1);
    });

    test('Remove keymap', () => {
      const id = 'test';
      const keys = 'ctrl+a';
      const handler = () => {};
      const model = obj.add(id, keys, handler);
      const removed = obj.remove(id);
      expect(obj.get(id)).toEqual(undefined);
      expect(obj.getAll()).toEqual({});
      expect(removed).toEqual({ id, keys, handler });
    });

    test('Remove keymap event triggers', () => {
      let called = 0;
      em.on('keymap:remove', () => (called = 1));
      const model = obj.add('tes', 'ctrl+a');
      const removed = obj.remove('tes');
      expect(called).toEqual(1);
    });

    describe('Given the edit is not on edit mode', () => {
      beforeEach(() => {
        em.setEditing(0);
      });

      it('Should run the handler', () => {
        const handler = {
          run: jest.fn(),
          callRun: jest.fn(),
        };
        obj.add('test', 'ctrl+a', handler);
        const keyboardEvent = new KeyboardEvent('keydown', {
          keyCode: 65,
          which: 65,
          ctrlKey: true,
        });
        document.dispatchEvent(keyboardEvent);

        expect(handler.callRun).toBeCalled();
      });
    });

    describe('Given the edit is on edit mode', () => {
      beforeEach(() => {
        em.setEditing(1);
      });

      it('Should not run the handler', () => {
        const handler = {
          run: jest.fn(),
          callRun: jest.fn(),
        };
        obj.add('test', 'ctrl+a', handler);
        const keyboardEvent = new KeyboardEvent('keydown', {
          keyCode: 65,
          which: 65,
          ctrlKey: true,
        });
        document.dispatchEvent(keyboardEvent);

        expect(handler.callRun).toBeCalledTimes(0);
      });

      it('Should run the handler if checked as force', () => {
        const handler = {
          run: jest.fn(),
          callRun: jest.fn(),
        };
        obj.add('test', 'ctrl+a', handler, { force: true });
        const keyboardEvent = new KeyboardEvent('keydown', {
          keyCode: 65,
          which: 65,
          ctrlKey: true,
        });
        document.dispatchEvent(keyboardEvent);

        expect(handler.callRun).toBeCalled();
      });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: grapesjs-dev/packages/core/test/specs/modal/index.js

```javascript
import Modal from 'modal_dialog';
import Editor from 'editor';

describe('Modal dialog', () => {
  describe('Main', () => {
    var em;
    var obj;

    beforeEach(() => {
      em = new Editor({});
      obj = new Modal(em);
    });

    afterEach(() => {
      obj = null;
    });

    test('Object exists', () => {
      expect(obj).toBeTruthy();
    });

    test('Is close by default', () => {
      expect(obj.isOpen()).toEqual(false);
    });

    test('Title is empty', () => {
      expect(obj.getTitle()).toEqual('');
    });

    test('Content is empty', () => {
      expect(obj.getContent()).toEqual('');
    });

    test('Set title', () => {
      obj.setTitle('Test');
      expect(obj.getTitle()).toEqual('Test');
    });

    test('Set content', () => {
      obj.setContent('Test');
      expect(obj.getContent()).toEqual('Test');
    });

    test('Set HTML content', () => {
      obj.setContent('<h1>Test</h1>');
      expect(obj.getContent()).toEqual('<h1>Test</h1>');
    });

    test('Open modal', () => {
      obj.open();
      expect(obj.isOpen()).toEqual(true);
    });

    test('Close modal', () => {
      obj.open();
      obj.close();
      expect(obj.isOpen()).toEqual(false);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ModalView.js]---
Location: grapesjs-dev/packages/core/test/specs/modal/view/ModalView.js

```javascript
import ModalView from 'modal_dialog/view/ModalView';
import Modal from 'modal_dialog/model/Modal';
import Editor from 'editor';

describe('ModalView', () => {
  var model;
  var view;
  var em;

  beforeEach(() => {
    em = new Editor({});
    model = new Modal(em);
    view = new ModalView({
      model,
    });
    document.body.innerHTML = '<div id="fixtures"></div>';
    document.body.querySelector('#fixtures').appendChild(view.render().el);
  });

  afterEach(() => {
    view = null;
    model = null;
  });

  test('The content is not empty', () => {
    expect(view.el.innerHTML).toBeTruthy();
  });

  test('Get content', () => {
    expect(view.getContent()).toBeTruthy();
  });

  test('Update content', () => {
    model.set('content', 'test');
    expect(view.getContent().get(0).innerHTML).toEqual('test');
  });

  test('Get title', () => {
    expect(view.getTitle()).toBeTruthy();
  });

  test('Update title', () => {
    model.set('title', 'test');
    expect(view.getTitle().innerHTML).toEqual('test');
  });

  test('Close by default', () => {
    view.updateOpen();
    expect(view.el.style.display).toEqual('none');
  });

  test('Open dialog', () => {
    model.set('open', 1);
    expect(view.el.style.display).toEqual('');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ItemView.ts]---
Location: grapesjs-dev/packages/core/test/specs/navigator/view/ItemView.ts

```typescript
import defConfig from '../../../../src/navigator/config/config';
import EditorModel from '../../../../src/editor/model/Editor';
import ItemView from '../../../../src/navigator/view/ItemView';

describe('ItemView', () => {
  let itemView: ItemView;

  const isVisible = (itemView: ItemView) => {
    return itemView.module.isVisible(itemView.model);
  };

  beforeEach(() => {
    const em = new EditorModel();
    const defCmp = em.get('DomComponents').getType('default').model;

    itemView = new ItemView({
      model: new defCmp({}, { em }),
      module: em.get('LayerManager'),
      config: { ...defConfig(), em },
    } as any);
  });

  describe('.isVisible', () => {
    it("should return `false` if the model's `style` object has a `display` property set to `none`, `true` otherwise", () => {
      expect(isVisible(itemView)).toEqual(true);
      itemView.model.addStyle({ display: '' });
      expect(isVisible(itemView)).toEqual(true);
      itemView.model.addStyle({ display: 'none' });
      expect(isVisible(itemView)).toEqual(false);
      itemView.model.addStyle({ display: 'block' });
      expect(isVisible(itemView)).toEqual(true);
    });
  });
});
```

--------------------------------------------------------------------------------

````

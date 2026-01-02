---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 55
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 55 of 97)

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

---[FILE: BrowserParserCss.ts]---
Location: grapesjs-dev/packages/core/src/parser/model/BrowserParserCss.ts

```typescript
import { keys } from 'underscore';
import { CssRuleJSON } from '../../css_composer/model/CssRule';
import { ObjectStrings } from '../../common';

/** @see https://developer.mozilla.org/en-US/docs/Web/API/CSSRule/type */
const CSS_RULE_TYPES = {
  STYLE_RULE: 1,
  CHARSET_RULE: 2,
  IMPORT_RULE: 3,
  MEDIA_RULE: 4,
  FONT_FACE_RULE: 5,
  PAGE_RULE: 6,
  KEYFRAMES_RULE: 7,
  KEYFRAME_RULE: 8,
  NAMESPACE_RULE: 10,
  COUNTER_STYLE_RULE: 11,
  SUPPORTS_RULE: 12,
  DOCUMENT_RULE: 13,
  FONT_FEATURE_VALUES_RULE: 14,
  VIEWPORT_RULE: 15,
  REGION_STYLE_RULE: 16,
};

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule  */
const AT_RULE_NAMES: ObjectStrings = {
  [CSS_RULE_TYPES.MEDIA_RULE]: 'media',
  [CSS_RULE_TYPES.FONT_FACE_RULE]: 'font-face',
  [CSS_RULE_TYPES.PAGE_RULE]: 'page',
  [CSS_RULE_TYPES.KEYFRAMES_RULE]: 'keyframes',
  [CSS_RULE_TYPES.COUNTER_STYLE_RULE]: 'counter-style',
  [CSS_RULE_TYPES.SUPPORTS_RULE]: 'supports',
  [CSS_RULE_TYPES.DOCUMENT_RULE]: 'document',
  [CSS_RULE_TYPES.FONT_FEATURE_VALUES_RULE]: 'font-feature-values',
  [CSS_RULE_TYPES.VIEWPORT_RULE]: 'viewport',
};

const AT_RULE_KEYS = keys(AT_RULE_NAMES);

const SINGLE_AT_RULE_TYPES = [
  CSS_RULE_TYPES.FONT_FACE_RULE,
  CSS_RULE_TYPES.PAGE_RULE,
  CSS_RULE_TYPES.COUNTER_STYLE_RULE,
  CSS_RULE_TYPES.VIEWPORT_RULE,
];

const NESTABLE_AT_RULE_NAMES = AT_RULE_KEYS.filter((i) => SINGLE_AT_RULE_TYPES.indexOf(Number(i)) < 0)
  .map((i) => AT_RULE_NAMES[i])
  .concat(['container', 'layer']);

const SINGLE_AT_RULE_NAMES = SINGLE_AT_RULE_TYPES.map((n) => AT_RULE_NAMES[n]);

/**
 * Parse selector string to array.
 * Only classe based are valid as CSS rules inside editor, not valid
 * selectors will be dropped as additional
 * It's ok with the last part of the string as state (:hover, :active)
 * @param  {string} str Selectors string
 * @return {Object}
 * @example
 * var res = parseSelector('.test1, .test1.test2, .test2 .test3');
 * console.log(res);
 * // { result: [['test1'], ['test1', 'test2']], add: ['.test2 .test3'] }
 */
export const parseSelector = (str = '') => {
  const add: string[] = [];
  const result: string[][] = [];
  const sels = str.split(',');

  for (var i = 0, len = sels.length; i < len; i++) {
    var sel = sels[i].trim();

    // Will accept only concatenated classes and last
    // class might be with state (eg. :hover), nothing else.
    // Can also accept SINGLE ID selectors, eg. `#myid`, `#myid:hover`
    // Composed are not valid: `#myid.some-class`, `#myid.some-class:hover`
    if (/^(\.{1}[\w\-]+)+(:{1,2}[\w\-()]+)?$/gi.test(sel) || /^(#{1}[\w\-]+){1}(:{1,2}[\w\-()]+)?$/gi.test(sel)) {
      var cls = sel.split('.').filter(Boolean);
      result.push(cls);
    } else {
      add.push(sel);
    }
  }

  return {
    result,
    add,
  };
};

/**
 * Parse style declarations of the node.
 * @param {CSSRule} node
 * @return {Object}
 */
export const parseStyle = (node: CSSStyleRule) => {
  const stl = node.style;
  const style: Record<string, string> = {};

  for (var i = 0, len = stl.length; i < len; i++) {
    const propName = stl[i];
    const propValue = stl.getPropertyValue(propName);
    const important = stl.getPropertyPriority(propName);
    style[propName] = `${propValue}${important ? ` !${important}` : ''}`;
  }

  return style;
};

/**
 * Get the condition when possible
 * @param  {CSSRule} node
 * @return {string}
 */
export const parseCondition = (node: CSSRule): string => {
  // @ts-ignore
  const condition = node.conditionText || (node.media && node.media.mediaText) || node.name || node.selectorText || '';
  return condition.trim();
};

/**
 * Create node for the editor
 * @param  {Array<String>} selectors Array containing strings of classes
 * @param {Object} style Key-value object of style declarations
 * @return {Object}
 */
export const createNode = (selectors: string[], style = {}, opts = {}): CssRuleJSON => {
  const node: Partial<CssRuleJSON> = {};
  const selLen = selectors.length;
  const lastClass = selectors[selLen - 1];
  const stateArr = lastClass ? lastClass.split(/:(.+)/) : [];
  const state = stateArr[1];
  // @ts-ignore
  const { atRule, selectorsAdd, mediaText } = opts;
  const singleAtRule = SINGLE_AT_RULE_NAMES.indexOf(atRule) >= 0;
  singleAtRule && (node.singleAtRule = true);
  atRule && (node.atRuleType = atRule);
  selectorsAdd && (node.selectorsAdd = selectorsAdd);
  mediaText && (node.mediaText = mediaText);

  // Isolate the state from selectors
  if (state) {
    selectors[selLen - 1] = stateArr[0];
    node.state = state;
    stateArr.splice(stateArr.length - 1, 1);
  }

  node.selectors = selectors;
  node.style = style;

  return node as CssRuleJSON;
};

export const getNestableAtRule = (node: CSSRule) => {
  const { cssText = '' } = node;
  return NESTABLE_AT_RULE_NAMES.find((name) => cssText.indexOf(`@${name}`) === 0);
};

/**
 * Fetch data from node
 * @param  {StyleSheet|CSSRule} el
 * @return {Array<Object>}
 */
export const parseNode = (el: CSSStyleSheet | CSSRule) => {
  let result: CssRuleJSON[] = [];
  const nodes = (el as CSSStyleSheet).cssRules || [];

  for (let i = 0, len = nodes.length; i < len; i++) {
    const node = nodes[i];
    const { type } = node;
    let singleAtRule = false;
    let atRuleType = '';
    let condition = '';
    const sels = (node as CSSStyleRule).selectorText || (node as CSSKeyframeRule).keyText || '';
    const isSingleAtRule = SINGLE_AT_RULE_TYPES.indexOf(type) >= 0;

    // Check if the node is an at-rule
    if (isSingleAtRule) {
      singleAtRule = true;
      atRuleType = AT_RULE_NAMES[type];
      condition = parseCondition(node);
    } else if (AT_RULE_KEYS.indexOf(`${type}`) >= 0 || (!type && getNestableAtRule(node))) {
      const subRules = parseNode(node);
      const subAtRuleType = AT_RULE_NAMES[type] || getNestableAtRule(node);
      condition = parseCondition(node);

      for (let s = 0, lens = subRules.length; s < lens; s++) {
        const subRule = subRules[s];
        condition && (subRule.mediaText = condition);
        subRule.atRuleType = subAtRuleType;
      }
      result = result.concat(subRules);
    }

    if (!sels && !isSingleAtRule) continue;

    const style = parseStyle(node as CSSStyleRule);
    const selsParsed = parseSelector(sels);
    const selsAdd = selsParsed.add;
    const selsArr: string[][] = selsParsed.result;

    let lastRule;
    // For each group of selectors
    for (let k = 0, len3 = selsArr.length; k < len3; k++) {
      const model = createNode(selsArr[k], style, {
        atRule: AT_RULE_NAMES[type],
      });
      result.push(model);
      lastRule = model;
    }

    // Need to push somewhere not class-based selectors, if some rule was
    // created will push them there, otherwise will create a new rule
    if (selsAdd.length) {
      var selsAddStr = selsAdd.join(', ');
      if (lastRule) {
        lastRule.selectorsAdd = selsAddStr;
      } else {
        const model: CssRuleJSON = {
          selectors: [],
          selectorsAdd: selsAddStr,
          style,
        };
        singleAtRule && (model.singleAtRule = singleAtRule);
        atRuleType && (model.atRuleType = atRuleType);
        condition && (model.mediaText = condition);
        result.push(model);
      }
    }
  }

  return result;
};

/**
 * Parse CSS string and return the array of objects
 * @param  {String} str CSS string
 * @return {Array<Object>} Array of objects for the definition of CSSRules
 */
export default (str: string) => {
  const el = document.createElement('style');
  el.innerHTML = str;

  // There is no .sheet before adding it to the <head>
  document.head.appendChild(el);
  const sheet = el.sheet;
  document.head.removeChild(el);

  return sheet ? parseNode(sheet) : [];
};
```

--------------------------------------------------------------------------------

---[FILE: BrowserParserHtml.ts]---
Location: grapesjs-dev/packages/core/src/parser/model/BrowserParserHtml.ts

```typescript
import { each } from 'underscore';
import { HTMLParserOptions } from '../config/config';

const htmlType = 'text/html';
const defaultType = htmlType; // 'application/xml';

export default (str: string, config: HTMLParserOptions = {}) => {
  const parser = new DOMParser();
  const mimeType = config.htmlType || defaultType;
  const toHTML = mimeType === htmlType;
  const strF = toHTML ? str : `<div>${str}</div>`;
  const doc = parser.parseFromString(strF, mimeType);
  let res: HTMLElement;

  if (toHTML) {
    if (config.asDocument) return doc;

    // Replicate the old parser in order to avoid breaking changes
    const { head, body } = doc;
    // Move all scripts at the bottom of the page
    const scripts = head.querySelectorAll('script');
    each(scripts, (node) => body.appendChild(node));
    // Move inside body all head children
    const hEls: Element[] = [];
    each(head.children, (n) => hEls.push(n));
    each(hEls, (node, i) => body.insertBefore(node, body.children[i]));
    res = body;
  } else {
    res = doc.firstChild as HTMLElement;
  }

  return res;
};

/**
 * POC, custom html parser specs
 * Parse an HTML string to an array of nodes
 * example
 * parse(`<div class="mycls" data-test>Hello</div><span>World <b>example</b></span>`)
 * // result
 * [
 *  {
 *      tagName: 'div',
 *      attributes: { class: 'mycls', 'data-test': '' },
 *      childNodes: ['Hello'],
 *  },{
 *      tagName: 'span',
 *      childNodes: [
 *          'World ',
 *          {
 *              tagName: 'b',
 *              childNodes: ['example'],
 *          }
 *       ],
 *  }
 * ]
 *

export const parseNodes = nodes => {
  const result = [];

  for (let i = 0; i < nodes.length; i++) {
    result.push(parseNode(nodes[i]));
  }

  return result;
};

export const parseAttributes = attrs => {
  const result = {};

  for (let j = 0; j < attrs.length; j++) {
    const attr = attrs[j];
    const nodeName = attr.nodeName;
    const nodeValue = attr.nodeValue;
    result[nodeName] = nodeValue;
  }

  return result;
};

export const parseNode = el => {
  // Return the string of the textnode element
  if (el.nodeType === 3) {
    return el.nodeValue;
  }

  const tagName = node.tagName ? node.tagName.toLowerCase() : '';
  const attrs = el.attributes || [];
  const nodes = el.childNodes || [];

  return {
    ...(tagName && { tagName }),
    ...(attrs.length && {
      attributes: parseAttributes(attrs)
    }),
    ...(nodes.length && {
      childNodes: parseNodes(nodes)
    })
  };
};

export default (str, config = {}) => {
  const result = [];
  const el = document.createElement('div');
  el.innerHTML = str;
  const nodes = el.childNodes;
  const len = nodes.length;

  for (let i = 0; i < len; i++) {
    result.push(parseNode(nodes[i]));
  }

  return result;
};
 */
```

--------------------------------------------------------------------------------

---[FILE: ParserCss.ts]---
Location: grapesjs-dev/packages/core/src/parser/model/ParserCss.ts

```typescript
import { isString } from 'underscore';
import { CssRuleJSON } from '../../css_composer/model/CssRule';
import EditorModel from '../../editor/model/Editor';
import { ParsedCssRule, ParserConfig } from '../config/config';
import BrowserCssParser, { parseSelector, createNode } from './BrowserParserCss';
import { ParserEvents } from '../types';

const ParserCss = (em?: EditorModel, config: ParserConfig = {}) => ({
  /**
   * Parse CSS string to a desired model object
   * @param  {String} str CSS string
   * @return {Array<Object>}
   */
  parse(str: string, opts: { throwOnError?: boolean } = {}) {
    let output: CssRuleJSON[] = [];
    const { parserCss } = config;
    const editor = em?.Editor;
    let nodes: CssRuleJSON[] | ParsedCssRule[] = [];
    let error: unknown;
    const Parser = em?.Parser;
    const inputOptions = { input: str };
    Parser?.__emitEvent(ParserEvents.cssBefore, inputOptions);
    const { input } = inputOptions;

    try {
      nodes = parserCss ? parserCss(input, editor!) : BrowserCssParser(input);
    } catch (err) {
      error = err;
      if (opts.throwOnError) throw err;
    }

    nodes.forEach((node) => (output = output.concat(this.checkNode(node))));
    Parser?.__emitEvent(ParserEvents.css, { input, output, nodes, error });

    return output;
  },

  /**
   * Check the returned node from a custom parser and transforms it to
   * a valid object for the CSS composer
   * @return {[type]}
   */
  checkNode(node: CssRuleJSON | ParsedCssRule): CssRuleJSON[] {
    const { selectors, style } = node;
    let result = [node] as CssRuleJSON[];

    if (isString(selectors)) {
      const nodes: CssRuleJSON[] = [];
      const parsedNode = node as ParsedCssRule;
      const selsParsed = parseSelector(selectors);
      const classSets = selsParsed.result;
      const selectorsAdd = selsParsed.add.join(', ');
      const opts = { atRule: parsedNode.atRule, mediaText: parsedNode.params };

      if (classSets.length) {
        classSets.forEach((classSet) => {
          nodes.push(createNode(classSet, style, opts));
        });
      } else {
        nodes.push(createNode([], style, opts));
      }

      if (selectorsAdd) {
        const lastNode = nodes[nodes.length - 1];
        lastNode.selectorsAdd = selectorsAdd;
      }

      result = nodes;
    }

    return result;
  },
});

export default ParserCss;
```

--------------------------------------------------------------------------------

---[FILE: ParserHtml.ts]---
Location: grapesjs-dev/packages/core/src/parser/model/ParserHtml.ts

```typescript
import { each, isArray, isFunction, isUndefined, result } from 'underscore';
import { ObjectAny, ObjectStrings } from '../../common';
import { ComponentDefinitionDefined, ComponentStackItem } from '../../dom_components/model/types';
import EditorModel from '../../editor/model/Editor';
import { HTMLParseResult, HTMLParserOptions, ParseNodeOptions, ParserConfig } from '../config/config';
import BrowserParserHtml from './BrowserParserHtml';
import { doctypeToString, processDataGjsAttributeHyphen } from '../../utils/dom';
import { isDef } from '../../utils/mixins';
import { ParserEvents } from '../types';

const modelAttrStart = 'data-gjs-';

const ParserHtml = (em?: EditorModel, config: ParserConfig & { returnArray?: boolean } = {}) => {
  return {
    compTypes: [] as ComponentStackItem[],

    modelAttrStart,

    getPropAttribute(attrName: string, attrValue?: string) {
      const name = attrName.replace(this.modelAttrStart, '');
      const valueLen = attrValue?.length || 0;
      const firstChar = attrValue?.substring(0, 1);
      const lastChar = attrValue?.substring(valueLen - 1);
      let value: any = attrValue === 'true' ? true : attrValue === 'false' ? false : attrValue;

      // Try to parse JSON where it's possible
      // I can get false positive here (eg. a selector '[data-attr]')
      // so put it under try/catch and let fail silently
      try {
        value =
          (firstChar == '{' && lastChar == '}') || (firstChar == '[' && lastChar == ']') ? JSON.parse(value) : value;
      } catch (e) {}

      return {
        name,
        value,
      };
    },

    /**
     * Extract component props from an attribute object
     * @param {Object} attr
     * @returns {Object} An object containing props and attributes without them
     */
    splitPropsFromAttr(attr: ObjectAny = {}) {
      const props: ObjectAny = {};
      const attrs: ObjectStrings = {};

      each(attr, (value, key) => {
        if (key.indexOf(this.modelAttrStart) === 0) {
          const propsResult = this.getPropAttribute(key, value);
          props[propsResult.name] = propsResult.value;
        } else {
          attrs[key] = value;
        }
      });

      return {
        props,
        attrs,
      };
    },

    /**
     * Parse style string to object
     * @param {string} str
     * @return {Object}
     * @example
     * var stl = ParserHtml.parseStyle('color:black; width:100px; test:value;');
     * console.log(stl);
     * // {color: 'black', width: '100px', test: 'value'}
     */
    parseStyle(str: string) {
      const result: Record<string, string | string[]> = {};

      while (str.indexOf('/*') >= 0) {
        const start = str.indexOf('/*');
        const end = str.indexOf('*/');
        const endIndex = end > -1 ? end + 2 : undefined;
        str = str.replace(str.slice(start, endIndex), '');
      }

      const decls = str.split(';');

      for (let i = 0, len = decls.length; i < len; i++) {
        const decl = decls[i].trim();
        if (!decl) continue;
        const prop = decl.split(':');
        const key = prop[0].trim();
        const value = prop.slice(1).join(':').trim();

        // Support multiple values for the same key
        if (result[key]) {
          if (!isArray(result[key])) {
            result[key] = [result[key] as string];
          }

          (result[key] as string[]).push(value);
        } else {
          result[key] = value;
        }
      }

      return result;
    },

    /**
     * Parse class string to array
     * @param {string} str
     * @return {Array<string>}
     * @example
     * var res = ParserHtml.parseClass('test1 test2 test3');
     * console.log(res);
     * // ['test1', 'test2', 'test3']
     */
    parseClass(str: string) {
      const result = [];
      const cls = str.split(' ');

      for (let i = 0, len = cls.length; i < len; i++) {
        const cl = cls[i].trim();
        if (!cl) continue;
        result.push(cl);
      }

      return result;
    },

    parseNodeAttr(node: HTMLElement, modelResult?: ComponentDefinitionDefined) {
      const model = modelResult || {};
      const attrs = node.attributes || [];
      const attrsLen = attrs.length;
      const convertHyphens = !!config?.optionsHtml?.convertDataGjsAttributesHyphens;
      const defaults =
        (convertHyphens && !!model.type && result(em?.Components.getType(model.type)?.model.prototype, 'defaults')) ||
        {};

      for (let i = 0; i < attrsLen; i++) {
        let nodeName = attrs[i].nodeName;
        let nodeValue: string | boolean = attrs[i].nodeValue!;

        if (nodeName == 'style') {
          model.style = this.parseStyle(nodeValue);
        } else if (nodeName == 'class') {
          model.classes = this.parseClass(nodeValue);
        } else if (nodeName == 'contenteditable') {
          continue;
        } else if (nodeName.indexOf(this.modelAttrStart) === 0) {
          const propsResult = this.getPropAttribute(nodeName, nodeValue);
          let resolvedName = propsResult.name;
          if (convertHyphens && !(resolvedName in defaults)) {
            const transformed = processDataGjsAttributeHyphen(resolvedName);
            resolvedName = transformed in defaults ? transformed : resolvedName;
          }

          model[resolvedName] = propsResult.value;
        } else {
          // @ts-ignore Check for attributes from props (eg. required, disabled)
          if (nodeValue === '' && node[nodeName] === true) {
            nodeValue = true;
          }

          if (!model.attributes) {
            model.attributes = {};
          }

          model.attributes[nodeName] = nodeValue;
        }
      }

      return model;
    },

    detectNode(node: HTMLElement, opts: ParseNodeOptions = {}) {
      const { compTypes } = this;
      let result: ComponentDefinitionDefined = {};

      if (compTypes) {
        const type = node.getAttribute?.(`${this.modelAttrStart}type`);

        // If the type is already defined, use it
        if (type) {
          result = { type };
        } else {
          // Find the component type
          for (let i = 0; i < compTypes.length; i++) {
            const compType = compTypes[i];
            let obj = compType.model.isComponent(node, opts);

            if (obj) {
              if (typeof obj !== 'object') {
                obj = { type: compType.id };
              }
              result = obj;
              break;
            }
          }
        }
      }

      return result;
    },

    parseNode(node: HTMLElement, opts: ParseNodeOptions = {}) {
      const nodes = (node as HTMLTemplateElement).content?.childNodes || node.childNodes;
      const nodesLen = nodes.length;
      let model = this.detectNode(node, opts);

      if (!model.tagName) {
        const tag = node.tagName || '';
        const ns = node.namespaceURI || '';
        model.tagName = tag && ns === 'http://www.w3.org/1999/xhtml' ? tag.toLowerCase() : tag;
      }

      model = this.parseNodeAttr(node, model);

      // Check for custom void elements (valid in XML)
      if (!nodesLen && `${node.outerHTML}`.slice(-2) === '/>') {
        model.void = true;
      }

      // Check for nested elements but avoid it if already provided
      if (nodesLen && !model.components && !opts.skipChildren) {
        // Avoid infinite nested text nodes
        const firstChild = nodes[0];

        // If there is only one child and it's a TEXTNODE
        // just make it content of the current node
        if (nodesLen === 1 && firstChild.nodeType === 3) {
          !model.type && (model.type = 'text');
          model.components = {
            type: 'textnode',
            content: firstChild.nodeValue,
          };
        } else {
          model.components = this.parseNodes(node, {
            ...opts,
            inSvg: opts.inSvg || model.type === 'svg',
          });
        }
      }

      // If all children are texts and there is any textnode inside, the parent should
      // be text too otherwise it won't be possible to edit texnodes.
      const comps = model.components;
      if (!model.type && comps?.length) {
        const { textTypes = [], textTags = [] } = config;
        let allTxt = true;
        let foundTextNode = false;

        for (let i = 0; i < comps.length; i++) {
          const comp = comps[i];
          const cType = comp.type;

          if (!textTypes.includes(cType) && !textTags.includes(comp.tagName)) {
            allTxt = false;
            break;
          }

          if (cType === 'textnode') {
            foundTextNode = true;
          }
        }

        if (allTxt && foundTextNode) {
          model.type = 'text';
        }
      }

      return model;
    },

    /**
     * Get data from the node element
     * @param  {HTMLElement} el DOM element to traverse
     * @return {Array<Object>}
     */
    parseNodes(el: HTMLElement, opts: ParseNodeOptions = {}) {
      const result: ComponentDefinitionDefined[] = [];
      const nodes = (el as HTMLTemplateElement).content?.childNodes || el.childNodes;
      const nodesLen = nodes.length;

      for (let i = 0; i < nodesLen; i++) {
        const node = nodes[i] as HTMLElement;
        const nodePrev = result[result.length - 1];
        const model = this.parseNode(node, opts);

        // Check if it's a text node and if it could be moved to the prevous one
        if (model.type === 'textnode') {
          if (nodePrev?.type === 'textnode') {
            nodePrev.content += model.content;
            continue;
          }

          // Try to keep meaningful whitespaces when possible (#5984)
          // Ref: https://github.com/GrapesJS/grapesjs/pull/5719#discussion_r1518531999
          if (!opts.keepEmptyTextNodes) {
            const content = node.nodeValue || '';
            const isFirstOrLast = i === 0 || i === nodesLen - 1;
            const hasNewLive = content.includes('\n');
            if (content != ' ' && !content.trim() && (isFirstOrLast || hasNewLive)) {
              continue;
            }
          }
        }

        // If the tagName is empty and it's not a textnode, skip it
        if (!model.tagName && isUndefined(model.content)) {
          continue;
        }

        result.push(model);
      }

      return result;
    },

    /**
     * Parse HTML string to a desired model object
     * @param  {string} str HTML string
     * @param  {ParserCss} parserCss In case there is style tags inside HTML
     * @return {Object}
     */
    parse(str: string, parserCss?: any, opts: HTMLParserOptions = {}) {
      const conf = em?.get('Config') || {};
      const Parser = em?.Parser;
      const res: HTMLParseResult = { html: [] };
      const preOptions = {
        ...config.optionsHtml,
        // @ts-ignore Support previous `configParser.htmlType` option
        htmlType: config.optionsHtml?.htmlType || config.htmlType,
        ...opts,
      };
      const options = {
        ...preOptions,
        asDocument: this.__checkAsDocument(str, preOptions),
      };
      const cf = { ...config, ...options };
      const { preParser, asDocument } = options;
      const inputOptions = { input: isFunction(preParser) ? preParser(str, { editor: em?.getEditor()! }) : str };
      Parser?.__emitEvent(ParserEvents.htmlBefore, inputOptions);
      const { input } = inputOptions;
      const parseRes = isFunction(cf.parserHtml) ? cf.parserHtml(input, options) : BrowserParserHtml(input, options);
      let root = parseRes as HTMLElement;
      const docEl = parseRes as Document;

      if (asDocument) {
        root = docEl.documentElement;
        res.doctype = doctypeToString(docEl.doctype);
      }

      const scripts = root.querySelectorAll('script');
      let i = scripts.length;

      // Support previous `configMain.allowScripts` option
      const allowScripts = !isUndefined(conf.allowScripts) ? conf.allowScripts : options.allowScripts;

      // Remove script tags
      if (!allowScripts) {
        while (i--) scripts[i].parentNode?.removeChild(scripts[i]);
      }

      // Remove unsafe attributes
      if (!options.allowUnsafeAttr || !options.allowUnsafeAttrValue) {
        this.__sanitizeNode(root, options);
      }

      // Detach style tags and parse them
      if (parserCss) {
        const styles = root.querySelectorAll('style');
        let j = styles.length;
        let styleStr = '';

        while (j--) {
          styleStr = styles[j].innerHTML + styleStr;
          styles[j].parentNode?.removeChild(styles[j]);
        }

        if (styleStr) res.css = parserCss.parse(styleStr);
      }

      Parser?.__emitEvent(ParserEvents.htmlRoot, { input, root });
      let resHtml: HTMLParseResult['html'] = [];

      if (asDocument) {
        res.head = this.parseNode(docEl.head, cf);
        res.root = this.parseNodeAttr(root);
        resHtml = this.parseNode(docEl.body, cf);
      } else {
        const result = this.parseNodes(root, cf);
        // I have to keep it otherwise it breaks the DomComponents.addComponent (returns always array)
        resHtml = result.length === 1 && !cf.returnArray ? result[0] : result;
      }

      res.html = resHtml;
      Parser?.__emitEvent(ParserEvents.html, { input, output: res, options });

      return res;
    },

    __sanitizeNode(node: HTMLElement, opts: HTMLParserOptions) {
      const attrs = node.attributes || [];
      const nodes = node.childNodes || [];
      const toRemove: string[] = [];
      each(attrs, (attr) => {
        const name = attr.nodeName || '';
        const value = attr.nodeValue || '';
        !opts.allowUnsafeAttr && name.startsWith('on') && toRemove.push(name);
        !opts.allowUnsafeAttrValue && value.startsWith('javascript:') && toRemove.push(name);
      });
      toRemove.map((name) => node.removeAttribute(name));
      each(nodes, (node) => this.__sanitizeNode(node as HTMLElement, opts));
    },

    __checkAsDocument(str: string, opts: HTMLParserOptions) {
      if (isDef(opts.asDocument)) {
        return opts.asDocument;
      } else if (isFunction(opts.detectDocument)) {
        return !!opts.detectDocument(str);
      } else if (opts.detectDocument) {
        return str.toLowerCase().trim().startsWith('<!doctype');
      }
    },
  };
};

export default ParserHtml;
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/src/plugin_manager/index.ts

```typescript
import { isString } from 'underscore';
import Editor from '../editor';
import { getGlobal } from '../utils/mixins';

type PluginOptions = Record<string, any>;

export type Plugin<T extends PluginOptions = {}> = (editor: Editor, config: T) => void;

const getPluginById = (pluginId: string, plugins: PluginManager) => {
  let result = plugins.get(pluginId);

  // Try to search in global context
  if (!result) {
    const wplg = (getGlobal() as any)[pluginId];
    result = wplg?.default || wplg;
  }

  return result;
};

export const getPlugin = (plugin: string | Plugin<any>, plugins: PluginManager) => {
  return isString(plugin)
    ? getPluginById(plugin, plugins)
    : (plugin as unknown as { default: Plugin<any> })?.default || plugin;
};

export const logPluginWarn = (editor: Editor, plugin: string) => {
  editor.getModel().logWarning(`Plugin ${plugin} not found`, {
    context: 'plugins',
    plugin,
  });
};

export default class PluginManager {
  plugins: Record<string, Plugin> = {};

  /**
   * Add new plugin. Plugins could not be overwritten
   * @param {string} id Plugin ID
   * @param {Function} plugin Function which contains all plugin logic
   * @return {Function} The plugin function
   * @deprecated Don't use named plugins, create plugins as simple functions. More about [Plugins](https://grapesjs.com/docs/modules/Plugins.html)
   * @example
   * PluginManager.add('some-plugin', function(editor) {
   *   editor.Commands.add('new-command', {
   *     run:  function(editor, senderBtn){
   *       console.log('Executed new-command');
   *     }
   *   })
   * });
   */
  add<T extends PluginOptions>(id: string, plugin: Plugin<T>) {
    const plg = this.get(id);

    if (plg) {
      return plg;
    }

    // @ts-ignore
    this.plugins[id] = plugin;

    return plugin;
  }

  /**
   * Returns plugin by ID
   * @param  {string} id Plugin ID
   * @return {Function|undefined} Plugin
   * @example
   * var plugin = PluginManager.get('some-plugin');
   * plugin(editor);
   */
  get<T extends PluginOptions>(id: string): Plugin<T> | undefined {
    return this.plugins[id];
  }

  /**
   * Returns object with all plugins
   */
  getAll() {
    return this.plugins;
  }
}
```

--------------------------------------------------------------------------------

````

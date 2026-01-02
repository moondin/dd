---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 44
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 44 of 97)

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

---[FILE: SymbolUtils.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/SymbolUtils.ts

```typescript
import { isArray, isString, keys } from 'underscore';
import Component, { keySymbol, keySymbolOvrd, keySymbols } from './Component';
import { SymbolToUpOptions } from './types';
import { isEmptyObj } from '../../utils/mixins';
import Components from './Components';
import { keyCollectionDefinition } from '../../data_sources/model/data_collection/constants';

export const isSymbolMain = (cmp: Component) => isArray(cmp.get(keySymbols));

export const isSymbolInstance = (cmp: Component) => !!cmp.get(keySymbol);

export const isSymbol = (cmp: Component) => !!(isSymbolMain(cmp) || isSymbolInstance(cmp));

export const isSymbolRoot = (symbol: Component) => {
  const parent = symbol.parent();
  return isSymbol(symbol) && (!parent || !isSymbol(parent));
};

export const isSymbolNested = (symbol: Component) => {
  if (!isSymbol(symbol)) return false;
  const symbTopSelf = getSymbolTop(isSymbolMain(symbol) ? symbol : getSymbolMain(symbol)!);
  const symbTop = getSymbolTop(symbol);
  const symbTopMain = isSymbolMain(symbTop) ? symbTop : getSymbolMain(symbTop);
  return symbTopMain !== symbTopSelf;
};

export const initSymbol = (symbol: Component) => {
  if (symbol.__symbReady) return;
  symbol.on('change', symbol.__upSymbProps);
  symbol.__symbReady = true;
};

export const getSymbolMain = (symbol: Component): Component | undefined => {
  let result = symbol.get(keySymbol);

  if (result && isString(result)) {
    const ref = symbol.__getAllById()[result];
    if (ref) {
      result = ref;
      symbol.set(keySymbol, ref);
    } else {
      result = 0;
    }
  }

  return result || undefined;
};

export const getSymbolInstances = (symbol?: Component): Component[] | undefined => {
  let symbs = symbol?.get(keySymbols);

  if (symbs && isArray(symbs)) {
    symbs.forEach((symb, idx) => {
      if (symb && isString(symb)) {
        symbs[idx] = symbol!.__getAllById()[symb];
      }
    });
    symbs = symbs.filter((symb) => symb && !isString(symb));
  }

  return symbs || undefined;
};

export const isSymbolOverride = (symbol?: Component, prop = '') => {
  const ovrd = symbol?.get(keySymbolOvrd);
  const [prp] = prop.split(':');
  const props = prop !== prp ? [prop, prp] : [prop];
  return ovrd === true || (isArray(ovrd) && props.some((p) => ovrd.indexOf(p) >= 0));
};

export const getSymbolsToUpdate = (symb: Component, opts: SymbolToUpOptions = {}) => {
  let result: Component[] = [];
  const { changed } = opts;

  if (
    opts.fromInstance ||
    opts.noPropagate ||
    opts.fromUndo ||
    // Avoid updating others if the current component has override
    (changed && isSymbolOverride(symb, changed))
  ) {
    return result;
  }

  const symbols = getSymbolInstances(symb) || [];
  const symbol = getSymbolMain(symb);
  const all = symbol ? [symbol, ...(getSymbolInstances(symbol) || [])] : symbols;
  result = all
    .filter((s) => s !== symb)
    // Avoid updating those with override
    .filter((s) => !(changed && isSymbolOverride(s, changed)));

  return result;
};

export const getSymbolTop = (symbol: Component, opts?: any) => {
  let result = symbol;
  let parent = symbol.parent(opts);

  // while (parent && (isSymbolMain(parent) || getSymbol(parent))) {
  while (parent && isSymbol(parent)) {
    result = parent;
    parent = parent.parent(opts);
  }

  return result;
};

export const detachSymbolInstance = (symbol: Component, opts: { skipRefs?: boolean } = {}) => {
  const symbolMain = getSymbolMain(symbol);
  const symbs = symbolMain && getSymbolInstances(symbolMain);
  !opts.skipRefs &&
    symbs &&
    symbolMain.set(
      keySymbols,
      symbs.filter((s) => s !== symbol),
    );
  symbol.set(keySymbol, 0);
  symbol.components().forEach((s) => detachSymbolInstance(s, opts));
};

export const logSymbol = (symb: Component, type: string, toUp: Component[], opts: any = {}) => {
  const symbol = getSymbolMain(symb);
  const symbols = getSymbolInstances(symb);

  if (!symbol && !symbols) {
    return;
  }

  symb.em.log(type, { model: symb, toUp, context: 'symbols', opts });
};

export const updateSymbolProps = (symbol: Component, opts: SymbolToUpOptions = {}): void => {
  const changedAttributes = symbol.changedAttributes();
  if (!changedAttributes) return;

  let resolvedProps = symbol.dataResolverWatchers.getProps(changedAttributes);
  cleanChangedProperties(resolvedProps);

  if (!isEmptyObj(resolvedProps)) {
    const toUpdate = getSymbolsToUpdate(symbol, opts);

    // Filter properties to propagate
    resolvedProps = filterPropertiesForPropagation(resolvedProps, symbol);

    logSymbol(symbol, 'props', toUpdate, { opts, changed: resolvedProps });

    // Update child symbols
    toUpdate.forEach((child) => {
      const propsToUpdate = filterPropertiesForPropagation(resolvedProps, child);
      child.set(propsToUpdate, { fromInstance: symbol, ...opts });
    });
  }
};

const cleanChangedProperties = (changed: Record<string, any>): void => {
  const keysToDelete = ['status', 'open', keySymbols, keySymbol, keySymbolOvrd];
  keysToDelete.forEach((key) => delete changed[key]);

  delete changed.attributes?.id;
  isEmptyObj(changed.attributes ?? {}) && delete changed.attributes;
};

const filterPropertiesForPropagation = (props: Record<string, any>, component: Component) => {
  const filteredProps = { ...props };
  keys(props).forEach((prop) => {
    if (!shouldPropagateProperty(props, prop, component)) {
      delete filteredProps[prop];
    }
  });

  return filteredProps;
};

const hasCollectionId = (obj: Record<string, any> | undefined): boolean => {
  if (!obj) return false;
  return Object.values(obj).some((val: any) => Boolean(val?.collectionId));
};

const isCollectionVariableDefinition = (props: Record<string, any>, prop: string): boolean => {
  switch (prop) {
    case 'attributes':
    case 'style':
      return hasCollectionId(props[prop]);
    default:
      return Boolean(props[prop]?.collectionId);
  }
};

const shouldPropagateProperty = (props: Record<string, any>, prop: string, component: Component): boolean => {
  const isCollectionVar = isCollectionVariableDefinition(props, prop);

  return !isSymbolOverride(component, prop) || isCollectionVar;
};

export const updateSymbolCls = (symbol: Component, opts: any = {}) => {
  const toUp = getSymbolsToUpdate(symbol, opts);
  logSymbol(symbol, 'classes', toUp, { opts });
  toUp.forEach((child) => {
    // @ts-ignore This will propagate the change up to __upSymbProps
    child.set('classes', symbol.get('classes'), { fromInstance: symbol });
  });
  symbol.__changesUp(opts);
};

export const updateSymbolComps = (symbol: Component, m: Component, c: Components, o: any) => {
  const optUp = o || c || {};
  const { fromInstance, fromUndo } = optUp;
  const toUpOpts = { fromInstance, fromUndo };
  const isTemp = m.opt.temporary;

  // Reset
  if (!o) {
    const coll = m as unknown as Components;
    const toUp = getSymbolsToUpdate(symbol, {
      ...toUpOpts,
      changed: 'components:reset',
    });
    const cmps = coll.models;
    const newSymbols = new Set<Component>();
    logSymbol(symbol, 'reset', toUp, { components: cmps });

    toUp.forEach((rel) => {
      const relCmps = rel.components();
      const toReset = cmps.map((cmp, i) => {
        if (symbol.get(keyCollectionDefinition)) {
          return cmp.clone({ symbol: isSymbol(cmp) });
        }
        // This particular case here is to handle reset from `resetFromString`
        // where we can receive an array of regulat components or already
        // existing symbols (updated already before reset)
        if (!isSymbol(cmp) || newSymbols.has(cmp)) {
          newSymbols.add(cmp);
          return cmp.clone({ symbol: true });
        }
        return relCmps.at(i);
      });

      relCmps.reset(toReset, { fromInstance: symbol, ...c } as any);
    });
    // Add
  } else if (o.add) {
    let addedInstances: Component[] = [];
    const isMainSymb = !!getSymbolInstances(symbol);
    const toUp = getSymbolsToUpdate(symbol, {
      ...toUpOpts,
      changed: 'components:add',
    });
    if (toUp.length) {
      const addSymb = getSymbolMain(m);
      addedInstances = (addSymb ? getSymbolInstances(addSymb) : getSymbolInstances(m)) || [];
      addedInstances = [...addedInstances];
      addedInstances.push(addSymb ? addSymb : m);
    }
    !isTemp &&
      logSymbol(symbol, 'add', toUp, {
        opts: o,
        addedInstances: addedInstances.map((c) => c.cid),
        added: m.cid,
      });
    // Here, before appending a new symbol, I have to ensure there are no previously
    // created symbols (eg. used mainly when drag components around)
    toUp.forEach((symb) => {
      const symbTop = getSymbolTop(symb);
      const symbPrev = addedInstances.filter((addedInst) => {
        const addedTop = getSymbolTop(addedInst, { prev: 1 });
        return symbTop && addedTop && addedTop === symbTop;
      })[0];
      const toAppend = symbPrev || m.clone({ symbol: true, symbolInv: isMainSymb });
      symb.append(toAppend, { fromInstance: symbol, ...o });
    });
    // Remove
  } else {
    // Remove instance reference from the symbol
    const symb = getSymbolMain(m);
    symb &&
      !o.temporary &&
      symb.set(
        keySymbols,
        getSymbolInstances(symb)!.filter((i) => i !== m),
      );

    // Propagate remove only if the component is an inner symbol
    if (!isSymbolRoot(m) && !o.skipRefsUp) {
      const changed = 'components:remove';
      const { index } = o;
      const parent = m.parent();
      const opts = { fromInstance: m, ...o };
      const isSymbNested = isSymbolRoot(m);
      let toUpFn = (symb: Component) => {
        const symbPrnt = symb.parent();
        symbPrnt && !isSymbolOverride(symbPrnt, changed) && symb.remove(opts);
      };
      // Check if the parent allows the removing
      let toUp = !isSymbolOverride(parent, changed) ? getSymbolsToUpdate(m, toUpOpts) : [];

      if (isSymbNested) {
        toUp = parent! && getSymbolsToUpdate(parent, { ...toUpOpts, changed })!;
        toUpFn = (symb) => {
          const toRemove = symb.components().at(index);
          toRemove && toRemove.remove({ fromInstance: parent, ...opts });
        };
      }

      !isTemp &&
        logSymbol(symbol, 'remove', toUp, {
          opts: o,
          removed: m.cid,
          isSymbNested,
        });
      toUp.forEach(toUpFn);
    }
  }

  symbol.__changesUp(optUp);
};
```

--------------------------------------------------------------------------------

---[FILE: Toolbar.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/Toolbar.ts

```typescript
import { Collection } from '../../common';
import ToolbarButton from './ToolbarButton';

export default class Toolbar extends Collection<ToolbarButton> {}

Toolbar.prototype.model = ToolbarButton;
```

--------------------------------------------------------------------------------

---[FILE: ToolbarButton.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ToolbarButton.ts

```typescript
import { CommandFunction } from '../../commands/view/CommandAbstract';
import { Model, ObjectAny } from '../../common';

export interface ToolbarButtonProps {
  /**
   * Command name.
   */
  command: CommandFunction | string;

  /**
   * Button label.
   */
  label?: string;

  id?: string;
  attributes?: ObjectAny;
  events?: ObjectAny;
}

export default class ToolbarButton extends Model<ToolbarButtonProps> {
  defaults() {
    return {
      command: '',
      attributes: {},
    };
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/types.ts

```typescript
import { DataWatchersOptions } from './ModelResolverWatcher';
import Frame from '../../canvas/model/Frame';
import { AddOptions, Nullable, OptionAsDocument } from '../../common';
import EditorModel from '../../editor/model/Editor';
import Selectors from '../../selector_manager/model/Selectors';
import { TraitProperties } from '../../trait_manager/types';
import Traits from '../../trait_manager/model/Traits';
import { ResizerOptions } from '../../utils/Resizer';
import { DomComponentsConfig } from '../config/config';
import ComponentView from '../view/ComponentView';
import Component from './Component';
import Components from './Components';
import { ToolbarButtonProps } from './ToolbarButton';
import { ParseNodeOptions } from '../../parser/config/config';

export type DragMode = 'translate' | 'absolute' | '';

export type DraggableDroppableFn = (source: Component, target: Component, index?: number) => boolean | void;

export interface AddComponentsOption extends AddOptions, OptionAsDocument {}

export interface UpdateComponentsOptions extends AddComponentsOption {
  skipViewUpdate?: boolean;
}

export interface ResetComponentsOptions extends UpdateComponentsOptions {
  previousModels?: Component[];
  keepIds?: string[];
  skipDomReset?: boolean;
}

interface ComponentWithCheck<C extends Component> {
  new (props: any, opt: ComponentOptions): C;
  isComponent(node: HTMLElement, opts?: ParseNodeOptions): ComponentDefinitionDefined | undefined | boolean;
}

export interface ComponentStackItem<C extends Component = Component, CV extends ComponentView<C> = ComponentView<C>> {
  id: string;
  model: ComponentWithCheck<C>;
  view: new (opt: any) => CV;
}

/**
 * Delegate commands to other components.
 */
export interface ComponentDelegateProps {
  /**
   * Delegate remove command to another component.
   * @example
   * delegate: {
   *  remove: (cmp) => cmp.closestType('other-type'),
   * }
   */
  remove?: (cmp: Component) => Component | Nullable;
  /**
   * Delegate move command to another component.
   * @example
   * delegate: {
   *  move: (cmp) => cmp.closestType('other-type'),
   * }
   */
  move?: (cmp: Component) => Component | Nullable;
  /**
   * Delegate copy command to another component.
   * @example
   * delegate: {
   *  copy: (cmp) => cmp.closestType('other-type'),
   * }
   */
  copy?: (cmp: Component) => Component | Nullable;
  /**
   * Delegate select command to another component.
   * @example
   * delegate: {
   *  select: (cmp) => cmp.findType('other-type')[0],
   * }
   */
  select?: (cmp: Component) => Component | Nullable;
  /**
   * Delegate another component as a layer in the LayerManager.
   * @example
   * delegate: {
   *  layer: (cmp) => cmp.findType('other-type')[0],
   * }
   */
  layer?: (cmp: Component) => Component | Nullable;
}

export interface ComponentProperties {
  /**
   * Component type, eg. `text`, `image`, `video`, etc.
   * @default ''
   */
  type?: string;
  /**
   * HTML tag of the component, eg. `span`. Default: `div`
   * @default 'div'
   */
  tagName?: string;
  /**
   * Key-value object of the component's attributes, eg. `{ title: 'Hello' }` Default: `{}`
   * @default {}
   */
  attributes?: Record<string, any>;
  /**
   * Name of the component. Will be used, for example, in Layers and badges
   * @default ''
   */
  name?: string;
  /**
   * When `true` the component is removable from the canvas, default: `true`
   * @default true
   */
  removable?: boolean;
  /**
       * Indicates if it's possible to drag the component inside others.
       You can also specify a query string to indentify elements,
       eg. `'.some-class[title=Hello], [data-gjs-type=column]'` means you can drag the component only inside elements
       containing `some-class` class and `Hello` title, and `column` components. In the case of a function, target and destination components are passed as arguments, return a Boolean to indicate if the drag is possible. Default: `true`
       * @default true
       */
  draggable?: boolean | string | DraggableDroppableFn;
  /**
       * Indicates if it's possible to drop other components inside. You can use
      a query string as with `draggable`. In the case of a function, target and destination components are passed as arguments, return a Boolean to indicate if the drop is possible. Default: `true`
       * @default true
       */
  droppable?: boolean | string | DraggableDroppableFn;
  /**
   * Set to false if you don't want to see the badge (with the name) over the component. Default: `true`
   * @default true
   */
  badgable?: boolean;
  /**
       * True if it's possible to style the component.
      You can also indicate an array of CSS properties which is possible to style, eg. `['color', 'width']`, all other properties
      will be hidden from the style manager. Default: `true`
       * @default true
       */
  stylable?: boolean | String[];
  ///**
  // * Indicate an array of style properties to show up which has been marked as `toRequire`. Default: `[]`
  // * @default []
  // */
  //`stylable-require`?: String[];
  /**
   * Indicate an array of style properties which should be hidden from the style manager. Default: `[]`
   * @default []
   */
  unstylable?: String[];
  /**
   * It can be highlighted with 'dotted' borders if true. Default: `true`
   * @default true
   */
  highlightable?: boolean;
  /**
   * True if it's possible to clone the component. Default: `true`
   * @default true
   */
  copyable?: boolean;
  /**
   * Indicates if it's possible to resize the component. It's also possible to pass an object as [options for the Resizer](https://github.com/GrapesJS/grapesjs/blob/master/src/utils/Resizer.ts). Default: `false`
   */
  resizable?: boolean | ResizerOptions;
  /**
   * Allow to edit the content of the component (used on Text components). Default: `false`
   */
  editable?: boolean;
  /**
   * Set to `false` if you need to hide the component inside Layers. Default: `true`
   * @default true
   */
  layerable?: boolean;
  /**
   * Allow component to be selected when clicked. Default: `true`
   * @default true
   */
  selectable?: boolean;
  /**
   * Shows a highlight outline when hovering on the element if `true`. Default: `true`
   * @default true
   */
  hoverable?: boolean;
  /**
   * Disable the selection of the component and its children in the canvas.
   * @default false
   */
  locked?: boolean;
  /**
   * This property is used by the HTML exporter as void elements don't have closing tags, eg. `<br/>`, `<hr/>`, etc. Default: `false`
   */
  void?: boolean;
  /**
   * Component default style, eg. `{ width: '100px', height: '100px', 'background-color': 'red' }`
   * @default {}
   */
  style?: string | Record<string, any>;
  /**
   * Component related styles, eg. `.my-component-class { color: red }`
   * @default ''
   */
  styles?: string;
  /**
   * Content of the component (not escaped) which will be appended before children rendering. Default: `''`
   * @default ''
   */
  content?: string;
  /**
   * Component's icon, this string will be inserted before the name (in Layers and badge), eg. it can be an HTML string '<i class="fa fa-square-o"></i>'. Default: `''`
   * @default ''
   */
  icon?: string;
  /**
   * Component's javascript. More about it [here](/modules/Components-js.html). Default: `''`
   * @default ''
   */
  script?: string | ((...params: any[]) => any);
  ///**
  // * You can specify javascript available only in export functions (eg. when you get the HTML).
  //If this property is defined it will overwrite the `script` one (in export functions). Default: `''`
  // * @default ''
  // */
  //script-export?: string | ((...params: any[]) => any);
  /**
   * Component's traits. More about it [here](/modules/Traits.html). Default: `['id', 'title']`
   * @default ''
   */
  traits?: Traits;
  /**
       * Indicates an array of properties which will be inhereted by all NEW appended children.
       For example if you create a component likes this: `{ removable: false, draggable: false, propagate: ['removable', 'draggable'] }`
       and append some new component inside, the new added component will get the exact same properties indicated in the `propagate` array (and the `propagate` property itself). Default: `[]`
       * @default []
       */
  propagate?: (keyof ComponentProperties)[];

  /**
   * Set an array of items to show up inside the toolbar when the component is selected (move, clone, delete).
   * Eg. `toolbar: [ { attributes: {class: 'fa fa-arrows'}, command: 'tlb-move' }, ... ]`.
   * By default, when `toolbar` property is falsy the editor will add automatically commands `core:component-exit` (select parent component, added if there is one), `tlb-move` (added if `draggable`) , `tlb-clone` (added if `copyable`), `tlb-delete` (added if `removable`).
   */
  toolbar?: ToolbarButtonProps[];

  /**
   * Delegate commands to other components.
   */
  delegate?: ComponentDelegateProps;

  ///**
  // * Children components. Default: `null`
  // */
  components?: Components;

  classes?: Selectors;
  dmode?: DragMode;
  'script-props'?: string[];
  [key: string]: any;
}

export interface SymbolToUpOptions extends DataWatchersOptions {
  changed?: string;
  fromInstance?: boolean;
  noPropagate?: boolean;
  fromUndo?: boolean;
}

export interface ComponentDefinition extends Omit<ComponentProperties, 'components' | 'traits'> {
  /**
   * Children components.
   */
  components?: string | ComponentDefinition | (string | ComponentDefinition)[];
  traits?: (Partial<TraitProperties> | string)[];
  attributes?: Record<string, any>;
  [key: string]: unknown;
}

export interface ComponentDefinitionDefined extends Omit<ComponentProperties, 'components' | 'traits'> {
  /**
   * Children components.
   */
  components?: ComponentDefinitionDefined[] | ComponentDefinitionDefined;
  traits?: (Partial<TraitProperties> | string)[];
  [key: string]: any;
}

export interface ComponentModelProperties extends ComponentProperties {
  [key: string]: any;
}

export type ComponentAddType = Component | ComponentDefinition | ComponentDefinitionDefined | string;

export type ComponentAdd = ComponentAddType | ComponentAddType[];

export interface ToHTMLOptions extends OptionAsDocument {
  /**
   * Custom tagName.
   */
  tag?: string;

  /**
   * Include component properties as `data-gjs-*` attributes. This allows you to have re-importable HTML.
   */
  withProps?: boolean;

  /**
   * In case the attribute value contains a `"` char, instead of escaping it (`attr="value &quot;"`), the attribute will be quoted using single quotes (`attr='value "'`).
   */
  altQuoteAttr?: boolean;

  /**
   * Keep inline style set intentionally by users with `setStyle({}, { inline: true })`
   */
  keepInlineStyle?: boolean;

  /**
   * You can pass an object of custom attributes to replace with the current ones
   * or you can even pass a function to generate attributes dynamically.
   */
  attributes?: Record<string, any> | ((component: Component, attr: Record<string, any>) => Record<string, any>);
}

export interface ComponentOptions {
  em: EditorModel;
  config: DomComponentsConfig;
  frame?: Frame;
  temporary?: boolean;
  avoidChildren?: boolean;
  forCloning?: boolean;
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentCommentView.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/view/ComponentCommentView.ts

```typescript
import ComponentTextNodeView from './ComponentTextNodeView';

export default class ComponentCommentView extends ComponentTextNodeView {
  _createElement() {
    return document.createComment(this.model.content) as Text;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentFrameView.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/view/ComponentFrameView.ts

```typescript
import ComponentView from './ComponentView';
import { createEl, find, attrUp } from '../../utils/dom';
import ComponentFrame from '../model/ComponentFrame';

export default class ComponentFrameView extends ComponentView<ComponentFrame> {
  tagName() {
    return 'div';
  }

  initialize(props: any) {
    super.initialize(props);
    this.listenTo(this.model, 'change:attributes:src', this.updateSrc);
  }

  updateSrc() {
    const frame = find(this.el, 'iframe')[0] as HTMLElement;
    frame && attrUp(frame, { src: this.__getSrc() });
  }

  render() {
    super.render();
    const frame = createEl('iframe', {
      class: `${this.ppfx}no-pointer`,
      style: 'width: 100%; height: 100%; border: none',
      src: this.__getSrc(),
    });
    this.el.appendChild(frame);
    return this;
  }

  __getSrc() {
    return this.model.getAttributes().src || '';
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentImageView.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/view/ComponentImageView.ts

```typescript
import { isString } from 'underscore';
import { ObjectAny } from '../../common';
import ComponentImage from '../model/ComponentImage';
import ComponentView from './ComponentView';

export default class ComponentImageView<TComp extends ComponentImage = ComponentImage> extends ComponentView<TComp> {
  classEmpty!: string;
  el!: HTMLImageElement;

  tagName() {
    return 'img';
  }

  events(): ObjectAny {
    return {
      dblclick: 'onActive',
      click: 'initResize',
      error: 'onError',
      load: 'onLoad',
      dragstart: 'noDrag',
    };
  }

  initialize(props: any) {
    super.initialize(props);
    this.listenTo(this.model, 'change:src', this.updateSrc);
    this.classEmpty = `${this.ppfx}plh-image`;
    this.fetchFile();
  }

  /**
   * Fetch file if exists
   */
  fetchFile() {
    if (this.modelOpt.temporary) return;
    const { model, em } = this;
    const file = model.get('file');

    if (file && em) {
      const fu = em.Assets.FileUploader();
      fu?.uploadFile(
        {
          dataTransfer: { files: [file] },
        } as unknown as DragEvent,
        (res) => {
          const obj = res && res.data && res.data[0];
          const src = obj && (isString(obj) ? obj : obj.src);
          src && model.set({ src });
        },
        {
          componentView: this,
          file,
        },
      );
      model.set('file', '');
    }
  }

  /**
   * Update src attribute
   * @private
   * */
  updateSrc() {
    const { model } = this;
    model.addAttributes({ src: model.getSrcResult() });
    this.updateClasses();
  }

  updateClasses() {
    super.updateClasses();
    const { el, classEmpty, model } = this;
    const srcExists = model.getSrcResult() && !model.isDefaultSrc();
    const method = srcExists ? 'remove' : 'add';
    el.classList[method](classEmpty);
  }

  /**
   * Open dialog for image changing
   * @param  {Object}  e  Event
   * @private
   * */
  onActive(ev: Event) {
    ev?.stopPropagation();
    const { em, model } = this;
    const am = em?.Assets;

    if (am && model.get('editable')) {
      am.open({
        select(asset, complete) {
          model.set({ src: asset.getSrc() });
          complete && am.close();
        },
        target: model,
        types: ['image'],
        accept: 'image/*',
      });
    }
  }

  onError() {
    const { model, el } = this;
    const fallback = model.getSrcResult({ fallback: true });
    if (fallback) {
      // Remove srcset to prevent error loop on src update #6332
      if (el.srcset) el.srcset = '';
      el.src = fallback;
    }
  }

  onLoad() {
    // Used to update component tools box (eg. toolbar, resizer) once the image is loaded
    this.em.Canvas.refresh({ all: true });
  }

  noDrag(ev: Event) {
    ev.preventDefault();
    return false;
  }

  render() {
    this.renderAttributes();
    if (this.modelOpt.temporary) return this;
    this.updateSrc();
    const { $el, model } = this;
    const cls = $el.attr('class') || '';
    !model.get('src') && $el.attr('class', `${cls} ${this.classEmpty}`.trim());
    this.postRender();

    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentLabelView.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/view/ComponentLabelView.ts

```typescript
import ComponentLabel from '../model/ComponentLabel';
import ComponentLinkView from './ComponentLinkView';

export default class ComponentLabelView extends ComponentLinkView<ComponentLabel> {}
```

--------------------------------------------------------------------------------

---[FILE: ComponentLinkView.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/view/ComponentLinkView.ts

```typescript
import ComponentLink from '../model/ComponentLink';
import ComponentTextView from './ComponentTextView';

export default class ComponentLinkView<TComp extends ComponentLink = ComponentLink> extends ComponentTextView<TComp> {
  render() {
    super.render();
    // I need capturing instead of bubbling as bubbled clicks from other
    // children will execute the link event
    this.el.addEventListener('click', this.prevDef, true);

    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentMapView.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/view/ComponentMapView.ts

```typescript
import ComponentImageView from './ComponentImageView';

export default class ComponentMapView extends ComponentImageView {
  iframe?: HTMLIFrameElement;

  tagName() {
    return 'div';
  }

  events() {
    return {};
  }

  initialize(props: any) {
    super.initialize(props);
    this.classEmpty = this.ppfx + 'plh-map';
  }

  /**
   * Update the map on the canvas
   * @private
   */
  updateSrc() {
    this.getIframe().src = this.model.get('src');
  }

  getIframe() {
    if (!this.iframe) {
      const ifrm = document.createElement('iframe');
      ifrm.src = this.model.get('src');
      ifrm.frameBorder = '0';
      ifrm.style.height = '100%';
      ifrm.style.width = '100%';
      ifrm.className = this.ppfx + 'no-pointer';
      this.iframe = ifrm;
    }
    return this.iframe;
  }

  render() {
    super.render();
    this.updateClasses();
    this.el.appendChild(this.getIframe());
    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentScriptView.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/view/ComponentScriptView.ts

```typescript
import ComponentScript from '../model/ComponentScript';
import ComponentView from './ComponentView';

export default class ComponentScriptView extends ComponentView<ComponentScript> {
  tagName() {
    return 'script';
  }

  events() {
    return {};
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentSvgView.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/view/ComponentSvgView.ts

```typescript
import ComponentSvg from '../model/ComponentSvg';
import ComponentView from './ComponentView';

export default class ComponentSvgView extends ComponentView<ComponentSvg> {
  _createElement(tagName: string) {
    return document.createElementNS('http://www.w3.org/2000/svg', tagName);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentsView.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/view/ComponentsView.ts

```typescript
import { isUndefined } from 'underscore';
import FrameView from '../../canvas/view/FrameView';
import { View } from '../../common';
import EditorModel from '../../editor/model/Editor';
import { removeEl } from '../../utils/dom';
import { DomComponentsConfig } from '../config/config';
import Component from '../model/Component';
import Components from '../model/Components';
import { ResetComponentsOptions } from '../model/types';
import { ComponentsEvents } from '../types';
import ComponentView from './ComponentView';

export default class ComponentsView extends View {
  opts!: any;
  config!: DomComponentsConfig & { frameView?: FrameView };
  em!: EditorModel;
  parentEl?: HTMLElement;
  compView = ComponentView;

  initialize(o: any) {
    this.opts = o || {};
    this.config = o.config || {};
    // @ts-ignore
    this.em = this.config.em;
    const coll = this.collection;
    this.listenTo(coll, 'add', this.addTo);
    this.listenTo(coll, 'reset', this.resetChildren);
    this.listenTo(coll, 'remove', this.removeChildren);
  }

  removeChildren(removed: Component, coll: any, opts = {}) {
    removed.views.forEach((view) => {
      if (!view) return;
      const { childrenView, scriptContainer } = view;
      childrenView && childrenView.stopListening();
      removeEl(scriptContainer);
      view.remove.apply(view);
    });

    const inner = removed.components();
    inner.forEach((it) => this.removeChildren(it, coll, opts));
  }

  /**
   * Add to collection
   * @param {Model} model
   * @param {Collection} coll
   * @param {Object} opts
   * @private
   * */
  addTo(model: Component) {
    this.addToCollection(model, null, this.collection.indexOf(model));
  }

  /**
   * Add new object to collection
   * @param  {Object}  Model
   * @param  {Object}   Fragment collection
   * @param  {Integer}  Index of append
   *
   * @return   {Object}   Object rendered
   * @private
   * */
  addToCollection(model: Component, fragment?: DocumentFragment | null, index?: number) {
    const { config, opts, em } = this;
    const { frameView } = config;
    const sameFrameView = frameView?.model && model.getView(frameView.model);
    const dt = opts.componentTypes || em?.Components.getTypes();
    const type = model.get('type') || 'default';
    let viewObject = this.compView;

    for (let it = 0; it < dt.length; it++) {
      if (dt[it].id == type) {
        viewObject = dt[it].view;
        break;
      }
    }
    const view =
      sameFrameView ||
      new viewObject({
        model,
        // @ts-ignore
        config,
        componentTypes: dt,
      });
    let rendered;

    try {
      // Avoid breaking on DOM rendering (eg. invalid attribute name)
      rendered = view.render().el;
    } catch (error) {
      rendered = document.createTextNode('');
      em.logError(error as any);
    }

    if (fragment) {
      fragment.appendChild(rendered);
    } else {
      const parent = this.parentEl!;
      const children = parent.childNodes;

      if (!isUndefined(index)) {
        const lastIndex = children.length == index;

        // If the added model is the last of collection
        // need to change the logic of append
        if (lastIndex) {
          index--;
        }

        // In case the added is new in the collection index will be -1
        if (lastIndex || !children.length) {
          parent.appendChild(rendered);
        } else {
          parent.insertBefore(rendered, children[index]);
        }
      } else {
        parent.appendChild(rendered);
      }
    }

    if (!model.opt.temporary) {
      em?.trigger(ComponentsEvents.mount, model);
    }

    return rendered;
  }

  resetChildren(models: Components, opts: ResetComponentsOptions = {}) {
    if (opts.skipViewUpdate) return;

    const { previousModels } = opts;
    if (!opts.skipDomReset) {
      this.parentEl!.innerHTML = '';
    }
    previousModels?.forEach((md) => this.removeChildren(md, this.collection));
    models.each((model) => this.addToCollection(model));
  }

  render(parent?: HTMLElement) {
    const el = this.el;
    const frag = document.createDocumentFragment();
    this.parentEl = parent || this.el;
    this.collection.each((model) => this.addToCollection(model, frag));
    el.innerHTML = '';
    el.appendChild(frag);
    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentTableBodyView.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/view/ComponentTableBodyView.ts

```typescript
import ComponentTableBody from '../model/ComponentTableBody';
import ComponentView from './ComponentView';

export default class ComponentTableBodyView extends ComponentView<ComponentTableBody> {}
```

--------------------------------------------------------------------------------

---[FILE: ComponentTableCellView.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/view/ComponentTableCellView.ts

```typescript
import ComponentTableCell from '../model/ComponentTableCell';
import ComponentView from './ComponentView';

export default class ComponentTableCellView extends ComponentView<ComponentTableCell> {}
```

--------------------------------------------------------------------------------

---[FILE: ComponentTableFootView.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/view/ComponentTableFootView.ts

```typescript
import ComponentTableFoot from '../model/ComponentTableFoot';
import ComponentView from './ComponentView';

export default class ComponentTableFootView extends ComponentView<ComponentTableFoot> {}
```

--------------------------------------------------------------------------------

---[FILE: ComponentTableHeadView.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/view/ComponentTableHeadView.ts

```typescript
import ComponentTableHead from '../model/ComponentTableHead';
import ComponentView from './ComponentView';

export default class ComponentTableHeadView extends ComponentView<ComponentTableHead> {}
```

--------------------------------------------------------------------------------

---[FILE: ComponentTableRowView.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/view/ComponentTableRowView.ts

```typescript
import ComponentTableRow from '../model/ComponentTableRow';
import ComponentView from './ComponentView';

export default class ComponentTableRowView extends ComponentView<ComponentTableRow> {}
```

--------------------------------------------------------------------------------

---[FILE: ComponentTableView.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/view/ComponentTableView.ts

```typescript
import ComponentTable from '../model/ComponentTable';
import ComponentView from './ComponentView';

export default class ComponentTableView extends ComponentView<ComponentTable> {
  events() {
    return {};
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentTextNodeView.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/view/ComponentTextNodeView.ts

```typescript
import ComponentTextNode from '../model/ComponentTextNode';
import ComponentView from './ComponentView';

export default class ComponentTextNodeView<
  TComp extends ComponentTextNode = ComponentTextNode,
> extends ComponentView<TComp> {
  // Clear methods used on Nodes with attributes
  _setAttributes() {}
  renderAttributes() {}
  updateStatus() {}
  updateClasses() {}
  setAttribute() {}
  updateAttributes() {}
  initClasses() {}
  initComponents() {}
  delegateEvents() {
    return this;
  }

  _createElement() {
    return document.createTextNode('');
  }

  render() {
    const { model, el } = this;
    if (model.opt.temporary) return this;
    el.textContent = model.content;
    return this;
  }
}
```

--------------------------------------------------------------------------------

````

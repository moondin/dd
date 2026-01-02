---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 37
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 37 of 97)

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

---[FILE: AnyTypeOperator.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/conditional_variables/operators/AnyTypeOperator.ts
Signals: TypeORM

```typescript
import DataVariable from '../../DataVariable';
import { SimpleOperator } from './BaseOperator';

export enum AnyTypeOperation {
  equals = 'equals',
  isTruthy = 'isTruthy',
  isFalsy = 'isFalsy',
  isDefined = 'isDefined',
  isNull = 'isNull',
  isUndefined = 'isUndefined',
  isArray = 'isArray',
  isObject = 'isObject',
  isString = 'isString',
  isNumber = 'isNumber',
  isBoolean = 'isBoolean',
  isDefaultValue = 'isDefaultValue', // For Datasource variables
}

export class AnyTypeOperator extends SimpleOperator<AnyTypeOperation> {
  protected operationsEnum = AnyTypeOperation;

  evaluate(left: any, right: any): boolean {
    switch (this.operationString) {
      case 'equals':
        return left === right;
      case 'isTruthy':
        return !!left;
      case 'isFalsy':
        return !left;
      case 'isDefined':
        return left !== undefined && left !== null;
      case 'isNull':
        return left === null;
      case 'isUndefined':
        return left === undefined;
      case 'isArray':
        return Array.isArray(left);
      case 'isObject':
        return typeof left === 'object' && left !== null;
      case 'isString':
        return typeof left === 'string';
      case 'isNumber':
        return typeof left === 'number';
      case 'isBoolean':
        return typeof left === 'boolean';
      case 'isDefaultValue':
        return left instanceof DataVariable && left.get('defaultValue') === right;
      default:
        this.em?.logWarning(`Unsupported generic operation: ${this.operationString}`);
        return false;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: BaseOperator.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/conditional_variables/operators/BaseOperator.ts

```typescript
import EditorModel from '../../../../editor/model/Editor';
import { enumToArray } from '../../../utils';
import { DataConditionSimpleOperation } from '../types';

export abstract class SimpleOperator<OperationType extends DataConditionSimpleOperation> {
  protected em: EditorModel;
  protected operationString: OperationType;
  protected abstract operationsEnum: Record<string, OperationType>;

  constructor(operationString: any, opts: { em: EditorModel }) {
    this.operationString = operationString;
    this.em = opts.em;
  }

  abstract evaluate(left: any, right: any): boolean;

  getOperations(): DataConditionSimpleOperation[] {
    return enumToArray(this.operationsEnum);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: BooleanOperator.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/conditional_variables/operators/BooleanOperator.ts

```typescript
import { SimpleOperator } from './BaseOperator';

export enum BooleanOperation {
  and = 'and',
  or = 'or',
  xor = 'xor',
}

export class BooleanOperator extends SimpleOperator<BooleanOperation> {
  protected operationsEnum = BooleanOperation;

  evaluate(statements: boolean[]): boolean {
    if (!statements?.length) return false;

    switch (this.operationString) {
      case BooleanOperation.and:
        return statements.every(Boolean);
      case BooleanOperation.or:
        return statements.some(Boolean);
      case BooleanOperation.xor:
        return statements.filter(Boolean).length === 1;
      default:
        this.em.logWarning(`Unsupported boolean operation: ${this.operationString}`);
        return false;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: NumberOperator.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/conditional_variables/operators/NumberOperator.ts

```typescript
import { SimpleOperator } from './BaseOperator';

export enum NumberOperation {
  greaterThan = '>',
  lessThan = '<',
  greaterThanOrEqual = '>=',
  lessThanOrEqual = '<=',
  equals = '=',
  notEquals = '!=',
}

export class NumberOperator extends SimpleOperator<NumberOperation> {
  protected operationsEnum = NumberOperation;

  evaluate(left: number, right: number): boolean {
    if (typeof left !== 'number') return false;

    switch (this.operationString) {
      case NumberOperation.greaterThan:
        return left > right;
      case NumberOperation.lessThan:
        return left < right;
      case NumberOperation.greaterThanOrEqual:
        return left >= right;
      case NumberOperation.lessThanOrEqual:
        return left <= right;
      case NumberOperation.equals:
        return left === right;
      case NumberOperation.notEquals:
        return left !== right;
      default:
        this.em.logWarning(`Unsupported number operation: ${this.operationString}`);
        return false;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: StringOperator.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/conditional_variables/operators/StringOperator.ts

```typescript
import { SimpleOperator } from './BaseOperator';

export enum StringOperation {
  contains = 'contains',
  startsWith = 'startsWith',
  endsWith = 'endsWith',
  matchesRegex = 'matchesRegex',
  equalsIgnoreCase = 'equalsIgnoreCase',
  trimEquals = 'trimEquals',
}

export class StringOperator extends SimpleOperator<StringOperation> {
  protected operationsEnum = StringOperation;

  evaluate(left: string, right: string) {
    if (typeof left !== 'string') return false;

    switch (this.operationString) {
      case StringOperation.contains:
        return left.includes(right);
      case StringOperation.startsWith:
        return left.startsWith(right);
      case StringOperation.endsWith:
        return left.endsWith(right);
      case StringOperation.matchesRegex:
        if (!right) this.em.logWarning('Regex pattern must be provided.');
        return new RegExp(right ?? '').test(left);
      case StringOperation.equalsIgnoreCase:
        return left.toLowerCase() === right.toLowerCase();
      case StringOperation.trimEquals:
        return left.trim() === right.trim();
      default:
        this.em.logWarning(`Unsupported string operation: ${this.operationString}`);
        return false;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentDataCollection.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/data_collection/ComponentDataCollection.ts
Signals: TypeORM

```typescript
import { isArray } from 'underscore';
import { ObjectAny } from '../../../common';
import Component, { keySymbol } from '../../../dom_components/model/Component';
import { keyDataValues, updateFromWatcher } from '../../../dom_components/model/ModelDataResolverWatchers';
import { detachSymbolInstance, getSymbolInstances } from '../../../dom_components/model/SymbolUtils';
import { ComponentAddType, ComponentDefinitionDefined, ComponentOptions } from '../../../dom_components/model/types';
import EditorModel from '../../../editor/model/Editor';
import { toLowerCase } from '../../../utils/mixins';
import { DataComponentTypes } from '../../types';
import ComponentWithCollectionsState, { DataVariableMap } from '../ComponentWithCollectionsState';
import DataResolverListener from '../DataResolverListener';
import { DataVariableProps } from '../DataVariable';
import { keyCollectionDefinition } from './constants';
import {
  ComponentDataCollectionProps,
  DataCollectionDataSource,
  DataCollectionProps,
  DataCollectionStateMap,
} from './types';

const AvoidStoreOptions = { avoidStore: true, partial: true };

export default class ComponentDataCollection extends ComponentWithCollectionsState<DataCollectionProps> {
  dataSourceWatcher?: DataResolverListener;

  get defaults(): ComponentDefinitionDefined {
    return {
      // @ts-ignore
      ...super.defaults,
      droppable: false,
      dataResolver: {},
      type: DataComponentTypes.collection,
      components: [
        {
          type: DataComponentTypes.collectionItem,
        },
      ],
    };
  }

  constructor(props: ComponentDataCollectionProps, opt: ComponentOptions) {
    if (opt.forCloning) {
      return super(props as any, opt) as unknown as ComponentDataCollection;
    }

    const newProps = { ...props, droppable: false } as any;
    const cmp: ComponentDataCollection = super(newProps, opt) as unknown as ComponentDataCollection;
    this.rebuildChildrenFromCollection = this.rebuildChildrenFromCollection.bind(this);
    this.listenToPropsChange();
    this.rebuildChildrenFromCollection();

    return cmp;
  }

  getItemsCount() {
    const items = this.getDataSourceItems();
    const itemsCount = getLength(items);

    const startIndex = Math.max(0, this.getConfigStartIndex() ?? 0);
    const configEndIndex = this.getConfigEndIndex() ?? Number.MAX_VALUE;
    const endIndex = Math.min(itemsCount - 1, configEndIndex);

    const count = endIndex - startIndex + 1;
    return Math.max(0, count);
  }

  getConfigStartIndex() {
    return this.dataResolver.startIndex;
  }

  getConfigEndIndex() {
    return this.dataResolver.endIndex;
  }

  getDataSource(): DataCollectionDataSource {
    return this.dataResolver?.dataSource;
  }

  getCollectionId(): string {
    return this.dataResolver?.collectionId;
  }

  getCollectionItemComponents() {
    return this.firstChild.components();
  }

  setCollectionId(collectionId: string) {
    this.updateCollectionConfig({ collectionId });
  }

  setStartIndex(startIndex: number): void {
    if (startIndex < 0) {
      this.em.logError('Start index should be greater than or equal to 0');
      return;
    }

    this.updateCollectionConfig({ startIndex });
  }

  setEndIndex(endIndex: number): void {
    this.updateCollectionConfig({ endIndex });
  }

  setDataSource(dataSource: DataCollectionDataSource) {
    this.set(keyCollectionDefinition, {
      ...this.dataResolver,
      dataSource,
    });
  }

  setCollectionItemComponents(content: ComponentAddType) {
    this.firstChild.components(content);
  }

  onCollectionsStateMapUpdate(collectionsStateMap: DataCollectionStateMap) {
    super.onCollectionsStateMapUpdate(collectionsStateMap);

    const items = this.getDataSourceItems();
    const { startIndex } = this.resolveCollectionConfig(items);
    const cmps = this.components();
    cmps.forEach((cmp, index) => {
      const key = this.getItemKey(items, startIndex + index);
      const collectionsStateMap = this.getCollectionsStateMapForItem(items, key);
      cmp.onCollectionsStateMapUpdate(collectionsStateMap);
    });
  }

  protected stopSyncComponentCollectionState() {
    this.stopListening(this.components(), 'add remove reset', this.syncOnComponentChange);
    this.onCollectionsStateMapUpdate({});
  }

  protected setCollectionStateMapAndPropagate(cmp: Component, collectionsStateMap: DataCollectionStateMap) {
    cmp.setSymbolOverride(['locked', 'layerable', keyDataValues]);
    cmp.syncComponentsCollectionState();
    cmp.onCollectionsStateMapUpdate(collectionsStateMap);
  }

  protected onDataSourceChange() {
    this.rebuildChildrenFromCollection();
  }

  protected listenToPropsChange() {
    this.on(`change:${keyCollectionDefinition}`, () => {
      this.rebuildChildrenFromCollection();
      this.listenToDataSource();
    });

    this.listenToDataSource();
  }

  protected get dataSourceProps(): DataVariableProps | undefined {
    return this.dataResolver.dataSource;
  }

  protected get dataResolver(): DataCollectionProps {
    return this.get(keyCollectionDefinition) || {};
  }

  private get firstChild() {
    return this.components().at(0);
  }

  private updateCollectionConfig(updates: Partial<DataCollectionProps>): void {
    this.set(keyCollectionDefinition, {
      ...this.dataResolver,
      ...updates,
    });
  }

  private rebuildChildrenFromCollection() {
    const items = this.getDataSourceItems();
    const { totalItems } = this.resolveCollectionConfig(items);

    if (totalItems === this.components().length) {
      this.onCollectionsStateMapUpdate(this.collectionsStateMap);
      return;
    }

    const collectionItems = this.getCollectionItems(items as any);
    this.components().reset(collectionItems, updateFromWatcher as any);
  }

  private getCollectionItems(items?: any[]) {
    const firstChild = this.ensureFirstChild();
    const displayStyle = firstChild.getStyle()['display'];
    const isDisplayNoneOrMissing = !displayStyle || displayStyle === 'none';
    const resolvedDisplay = isDisplayNoneOrMissing ? '' : displayStyle;

    // TODO: Move to component view
    firstChild.addStyle({ display: 'none' }, AvoidStoreOptions);
    const components: Component[] = [firstChild];

    const result = validateCollectionDef(this.dataResolver, this.em);
    if (!result) {
      return components;
    }

    const collectionId = this.collectionId;
    const dataItems = items ?? this.getDataSourceItems();
    const { startIndex, endIndex } = this.resolveCollectionConfig(dataItems);

    const isDuplicatedId = this.hasDuplicateCollectionId();
    if (isDuplicatedId) {
      this.em.logError(
        `The collection ID "${collectionId}" already exists in the parent collection state. Overriding it is not allowed.`,
      );
      return components;
    }

    for (let index = startIndex; index <= endIndex; index++) {
      const isFirstItem = index === startIndex;
      const key = this.getItemKey(dataItems, index);
      const collectionsStateMap = this.getCollectionsStateMapForItem(dataItems, key);

      if (isFirstItem) {
        getSymbolInstances(firstChild)?.forEach((cmp) => detachSymbolInstance(cmp));
        this.setCollectionStateMapAndPropagate(firstChild, collectionsStateMap);
        // TODO: Move to component view
        firstChild.addStyle({ display: resolvedDisplay }, AvoidStoreOptions);
        continue;
      }

      const instance = firstChild.clone({ symbol: true, symbolInv: true });
      instance.set({ locked: true, layerable: false }, AvoidStoreOptions);
      this.setCollectionStateMapAndPropagate(instance, collectionsStateMap);
      components.push(instance);
    }

    return components;
  }

  private getCollectionsStateMapForItem(items: DataVariableProps[] | DataVariableMap, key: number | string) {
    const { startIndex, endIndex, totalItems } = this.resolveCollectionConfig(items);
    const collectionId = this.collectionId;
    let item: DataVariableProps = (items as any)[key];
    const parentCollectionStateMap = this.collectionsStateMap;

    const numericKey = typeof key === 'string' ? Object.keys(items).indexOf(key) : key;
    const offset = numericKey - startIndex;
    const remainingItems = totalItems - (1 + offset);
    const collectionState = {
      collectionId,
      currentIndex: numericKey,
      currentItem: item,
      currentKey: key,
      startIndex,
      endIndex,
      totalItems,
      remainingItems,
    };

    const collectionsStateMap: DataCollectionStateMap = {
      ...parentCollectionStateMap,
      [collectionId]: collectionState,
    };

    return collectionsStateMap;
  }

  private hasDuplicateCollectionId() {
    const collectionId = this.collectionId;
    const parentCollectionStateMap = this.collectionsStateMap;

    return !!parentCollectionStateMap[collectionId];
  }

  private resolveCollectionConfig(items: DataVariableProps[] | DataVariableMap) {
    const isArray = Array.isArray(items);
    const actualItemCount = isArray ? items.length : Object.keys(items).length;

    const startIndex = this.getConfigStartIndex() ?? 0;
    const configEndIndex = this.getConfigEndIndex() ?? Number.MAX_VALUE;
    const endIndex = Math.min(actualItemCount - 1, configEndIndex);

    let totalItems = 0;
    if (actualItemCount > 0) {
      totalItems = Math.max(0, endIndex - startIndex + 1);
    }

    return { startIndex, endIndex, totalItems, isArray };
  }

  private ensureFirstChild() {
    const dataConditionItemModel = this.em.Components.getType(DataComponentTypes.collectionItem)!.model;
    return this.firstChild || new dataConditionItemModel({ type: DataComponentTypes.collectionItem }, this.opt);
  }

  private get collectionId() {
    return this.dataResolverProps?.collectionId ?? '';
  }

  static isComponent(el: HTMLElement) {
    return toLowerCase(el.tagName) === DataComponentTypes.collection;
  }

  toJSON(opts?: ObjectAny) {
    const json = super.toJSON.call(this, opts) as ComponentDataCollectionProps;
    delete json.droppable;
    delete json[keySymbol];

    const firstChild = this.firstChild as any;
    return { ...json, components: [firstChild] };
  }
}

function getLength(items: DataVariableProps[] | object) {
  return isArray(items) ? items.length : Object.keys(items).length;
}

function logErrorIfMissing(property: any, propertyPath: string, em: EditorModel) {
  if (!property) {
    em.logError(`The "${propertyPath}" property is required in the collection definition.`);
    return false;
  }
  return true;
}

function validateCollectionDef(dataResolver: DataCollectionProps, em: EditorModel) {
  const validations = [
    { property: dataResolver?.collectionId, propertyPath: 'dataResolver.collectionId' },
    { property: dataResolver?.dataSource, propertyPath: 'dataResolver.dataSource' },
  ];

  for (const { propertyPath } of validations) {
    if (!logErrorIfMissing(dataResolver, propertyPath, em)) {
      return [];
    }
  }

  const startIndex = dataResolver?.startIndex;

  if (startIndex !== undefined && (startIndex < 0 || !Number.isInteger(startIndex))) {
    em.logError(`Invalid startIndex: ${startIndex}. It must be a non-negative integer.`);
  }

  return true;
}
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/data_collection/constants.ts

```typescript
export const keyCollectionDefinition = 'dataResolver';
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/data_collection/types.ts
Signals: TypeORM

```typescript
import { ObjectAny } from '../../../common';
import { ComponentDefinition } from '../../../dom_components/model/types';
import { DataComponentTypes } from '../../types';
import { DataVariableProps } from '../DataVariable';
import { keyCollectionDefinition } from './constants';

export type DataCollectionDataSource = DataVariableProps;

export enum DataCollectionStateType {
  currentIndex = 'currentIndex',
  startIndex = 'startIndex',
  prevItem = 'prevItem',
  currentItem = 'currentItem',
  nextItem = 'nextItem',
  currentKey = 'currentKey',
  endIndex = 'endIndex',
  collectionId = 'collectionId',
  totalItems = 'totalItems',
  remainingItems = 'remainingItems',
}

export interface DataCollectionState {
  [DataCollectionStateType.currentIndex]: number;
  [DataCollectionStateType.startIndex]: number;
  [DataCollectionStateType.prevItem]?: DataVariableProps;
  [DataCollectionStateType.currentItem]: DataVariableProps;
  [DataCollectionStateType.nextItem]?: DataVariableProps;
  [DataCollectionStateType.currentKey]: string | number;
  [DataCollectionStateType.endIndex]: number;
  [DataCollectionStateType.collectionId]: string;
  [DataCollectionStateType.totalItems]: number;
  [DataCollectionStateType.remainingItems]: number;
}

export type RootDataType = Array<ObjectAny> | ObjectAny;

export interface DataCollectionStateMap {
  [key: string]: DataCollectionState | RootDataType | undefined;
  rootData?: RootDataType;
}

export interface ComponentDataCollectionProps extends ComponentDefinition {
  type: `${DataComponentTypes.collection}`;
  [keyCollectionDefinition]: DataCollectionProps;
}

export interface DataCollectionProps {
  collectionId: string;
  startIndex?: number;
  endIndex?: number;
  dataSource: DataCollectionDataSource;
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentDataCollectionView.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/view/ComponentDataCollectionView.ts

```typescript
import ComponentView from '../../dom_components/view/ComponentView';
import ComponentDataCollection from '../model/data_collection/ComponentDataCollection';

export default class ComponentDataCollectionView extends ComponentView<ComponentDataCollection> {}
```

--------------------------------------------------------------------------------

---[FILE: ComponentDataConditionView.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/view/ComponentDataConditionView.ts

```typescript
import ComponentView from '../../dom_components/view/ComponentView';
import ComponentDataCondition from '../model/conditional_variables/ComponentDataCondition';
import DataResolverListener from '../model/DataResolverListener';

export default class ComponentDataConditionView extends ComponentView<ComponentDataCondition> {
  dataResolverListener!: DataResolverListener;

  initialize(opt = {}) {
    super.initialize(opt);

    this.postRender = this.postRender.bind(this);
    this.listenTo(this.model.components(), 'reset', this.postRender);
    this.dataResolverListener = new DataResolverListener({
      em: this.em,
      resolver: this.model.dataResolver,
      onUpdate: this.postRender,
    });
  }

  renderDataResolver() {
    const componentTrue = this.model.getIfTrueContent();
    const componentFalse = this.model.getIfFalseContent();

    const elTrue = componentTrue?.getEl();
    const elFalse = componentFalse?.getEl();

    const isTrue = this.model.isTrue();
    if (elTrue) {
      elTrue.style.display = isTrue ? '' : 'none';
    }
    if (elFalse) {
      elFalse.style.display = isTrue ? 'none' : '';
    }
  }

  postRender() {
    this.renderDataResolver();
    super.postRender();
  }

  remove() {
    this.stopListening(this.model.components(), 'reset', this.postRender);
    this.dataResolverListener.destroy();
    return super.remove();
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentDataVariableView.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/view/ComponentDataVariableView.ts

```typescript
import ComponentView from '../../dom_components/view/ComponentView';
import ComponentDataVariable from '../model/ComponentDataVariable';
import DataResolverListener from '../model/DataResolverListener';

export default class ComponentDataVariableView extends ComponentView<ComponentDataVariable> {
  dataResolverListener!: DataResolverListener;

  initialize(opt = {}) {
    super.initialize(opt);
    this.dataResolverListener = new DataResolverListener({
      em: this.em,
      resolver: this.model.dataResolver,
      onUpdate: () => this.postRender(),
    });
  }

  remove() {
    this.dataResolverListener.destroy();
    return super.remove();
  }

  postRender() {
    const model = this.model;
    const dataResolver = model.getDataResolver();
    const asPlainText = !!dataResolver.asPlainText;

    if (asPlainText) {
      this.el.textContent = model.getDataValue();
    } else {
      this.el.innerHTML = model.getDataValue();
    }

    super.postRender();
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/src/device_manager/index.ts

```typescript
/**
 * You can customize the initial state of the module from the editor initialization, by passing the following [Configuration Object](https://github.com/GrapesJS/grapesjs/blob/master/src/device_manager/config/config.ts)
 * ```js
 * const editor = grapesjs.init({
 *  deviceManager: {
 *    // options
 *  }
 * })
 * ```
 *
 * Once the editor is instantiated you can use its API. Before using these methods you should get the module from the instance
 *
 * ```js
 * const deviceManager = editor.Devices;
 * ```
 * {REPLACE_EVENTS}
 *
 * ## Methods
 * * [add](#add)
 * * [get](#get)
 * * [getDevices](#getdevices)
 * * [remove](#remove)
 * * [select](#select)
 * * [getSelected](#getselected)
 *
 * [Device]: device.html
 *
 * @module Devices
 */
import { isString } from 'underscore';
import { ItemManagerModule } from '../abstract/Module';
import EditorModel from '../editor/model/Editor';
import defConfig, { DeviceManagerConfig } from './config/config';
import Device, { DeviceProperties } from './model/Device';
import Devices from './model/Devices';
import DevicesView from './view/DevicesView';
import DeviceEvents from './types';

export default class DeviceManager extends ItemManagerModule<
  DeviceManagerConfig & { appendTo?: HTMLElement | string },
  Devices
> {
  devices: Devices;
  events!: typeof DeviceEvents;
  view?: DevicesView;

  Device = Device;

  Devices = Devices;

  storageKey = '';

  constructor(em: EditorModel) {
    super(em, 'DeviceManager', new Devices(), DeviceEvents, defConfig());
    this.devices = this.all;
    this.config.devices?.forEach((device) => this.add(device, { silent: true }));
    this.select(this.config.default || this.devices.at(0));
    em.on('change:device', this._onSelect, this);
    return this;
  }

  _onSelect(m: EditorModel, deviceId: string, opts: Record<string, any>) {
    const { em, events } = this;
    const prevId = m.previous('device');
    const newDevice = this.get(deviceId);
    const ev = events.select;
    em.trigger(ev, newDevice, this.get(prevId));
    this.__catchAllEvent(ev, newDevice, opts);
  }

  /**
   * Add new device
   * @param {Object} props Device properties
   * @returns {[Device]} Added device
   * @example
   * const device1 = deviceManager.add({
   *  // Without an explicit ID, the `name` will be taken. In case of missing `name`, a random ID will be created.
   *  id: 'tablet',
   *  name: 'Tablet',
   *  width: '900px', // This width will be applied on the canvas frame and for the CSS media
   * });
   * const device2 = deviceManager.add({
   *  id: 'tablet2',
   *  name: 'Tablet 2',
   *  width: '800px', // This width will be applied on the canvas frame
   *  widthMedia: '810px', // This width that will be used for the CSS media
   *  height: '600px', // Height will be applied on the canvas frame
   * });
   */
  add(props: DeviceProperties, options: Record<string, any> = {}) {
    let result;
    let opts = options;

    // Support old API
    if (isString(props)) {
      const width = options;
      opts = arguments[2] || {};
      result = {
        ...opts,
        id: props,
        name: opts.name || props,
        width,
      };
    } else {
      result = props;
    }

    if (!result.id) {
      result.id = result.name || this._createId();
    }

    return this.devices.add(result, opts);
  }

  /**
   * Return device by ID
   * @param  {String} id ID of the device
   * @returns {[Device]|null}
   * @example
   * const device = deviceManager.get('Tablet');
   * console.log(JSON.stringify(device));
   * // {name: 'Tablet', width: '900px'}
   */
  get(id: string): Device | undefined {
    // Support old API
    const byName = this.getAll().filter((d) => d.get('name') === id)[0];
    return byName || this.devices.get(id) || null;
  }

  /**
   * Remove device
   * @param {String|[Device]} device Device or device id
   * @returns {[Device]} Removed device
   * @example
   * const removed = deviceManager.remove('device-id');
   * // or by passing the Device
   * const device = deviceManager.get('device-id');
   * deviceManager.remove(device);
   */
  remove(device: string | Device, opts = {}) {
    return this.__remove(device, opts);
  }

  /**
   * Return all devices
   * @returns {Array<[Device]>}
   * @example
   * const devices = deviceManager.getDevices();
   * console.log(JSON.stringify(devices));
   * // [{name: 'Desktop', width: ''}, ...]
   */
  getDevices() {
    return this.devices.models;
  }

  /**
   * Change the selected device. This will update the frame in the canvas
   * @param {String|[Device]} device Device or device id
   * @example
   * deviceManager.select('some-id');
   * // or by passing the page
   * const device = deviceManager.get('some-id');
   * deviceManager.select(device);
   */
  select(device: string | Device, opts = {}) {
    const md = isString(device) ? this.get(device) : device;
    md && this.em.set('device', md.get('id'), opts);
    return this;
  }

  /**
   * Get the selected device
   * @returns {[Device]}
   * @example
   * const selected = deviceManager.getSelected();
   */
  getSelected() {
    return this.get(this.em.get('device'));
  }

  getAll() {
    return this.devices;
  }

  render() {
    const { em } = this;
    this.view?.remove();
    this.view = new DevicesView({
      collection: this.devices,
      config: { em, ...this.config },
    });
    return this.view.render().el;
  }

  destroy() {
    this.__destroy();
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: grapesjs-dev/packages/core/src/device_manager/types.ts

```typescript
/**{START_EVENTS}*/
export enum DeviceEvents {
  /**
   * @event `device:add` New device added to the collection. The `Device` is passed as an argument.
   * @example
   * editor.on('device:add', (device) => { ... });
   */
  add = 'device:add',
  addBefore = 'device:add:before',

  /**
   * @event `device:remove` Device removed from the collection. The `Device` is passed as an argument.
   * @example
   * editor.on('device:remove', (device) => { ... });
   */
  remove = 'device:remove',
  removeBefore = 'device:remove:before',

  /**
   * @event `device:select` A new device is selected. The `Device` is passed as an argument.
   * @example
   * editor.on('device:select', (device) => { ... });
   */
  select = 'device:select',
  selectBefore = 'device:select:before',

  /**
   * @event `device:update` Device updated. The `Device` and the object containing changes are passed as arguments.
   * @example
   * editor.on('device:update', (device) => { ... });
   */
  update = 'device:update',

  /**
   * @event `device` Catch-all event for all the events mentioned above.
   * @example
   * editor.on('device', ({ event, model, ... }) => { ... });
   */
  all = 'device',
}
/**{END_EVENTS}*/

// This is necessary to prevent the TS documentation generator from breaking.
export default DeviceEvents;
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: grapesjs-dev/packages/core/src/device_manager/config/config.ts

```typescript
import { DeviceProperties } from '../model/Device';

export interface DeviceManagerConfig {
  /**
   * The device `id` to select on start, if not indicated, the first available from `devices` will be used.
   * @default ''
   */
  default?: string;
  /**
   * Default devices.
   * @example
   * devices: [{
   *  id: 'desktop',
   *  name: 'Desktop',
   *  width: '',
   * }, {
   *  id: 'tablet',
   *  name: 'Tablet',
   *  width: '770px',
   *  widthMedia: '992px',
   * },
   * ...
   * ]
   */
  devices?: DeviceProperties[];
}

const config: () => DeviceManagerConfig = () => ({
  default: '',
  devices: [
    {
      id: 'desktop',
      name: 'Desktop',
      width: '',
    },
    {
      id: 'tablet',
      name: 'Tablet',
      width: '770px',
      widthMedia: '992px',
    },
    {
      id: 'mobileLandscape',
      name: 'Mobile landscape',
      width: '568px',
      widthMedia: '768px',
    },
    {
      id: 'mobilePortrait',
      name: 'Mobile portrait',
      width: '320px',
      widthMedia: '480px',
    },
  ],
});

export default config;
```

--------------------------------------------------------------------------------

---[FILE: Device.ts]---
Location: grapesjs-dev/packages/core/src/device_manager/model/Device.ts

```typescript
import { Model } from '../../common';

/** @private */
export interface DeviceProperties {
  id?: string;
  /**
   * Device name.
   * @example 'Mobile'
   */
  name: string;
  /**
   * Width to set for the editor iframe.
   * @example '900px'
   */
  width: string | null;
  /**
   * Height to set for the editor iframe.
   * @example '600px'
   */
  height?: string;
  /**
   * Min height to set for the editor iframe.
   * @example '600px'
   */
  minHeight?: string;
  /**
   * The width which will be used in media queries, if empty the `width` will be used.
   * @example '900px'
   */
  widthMedia?: string | null;
  /**
   * Setup the order of media queries
   * @example 1
   */
  priority?: number | null;
}

/**
 * @typedef Device
 * @property {String} [name=''] Device type, eg. `Mobile`
 * @property {String} [width] Width to set for the editor iframe, eg. '900px'
 * @property {String} [height=''] Height to set for the editor iframe, eg. '600px'
 * @property {String} [widthMedia=''] The width which will be used in media queries, If empty the width will be used
 * @property {Number} [priority=null] Setup the order of media queries
 */
export default class Device extends Model<DeviceProperties> {
  defaults() {
    return {
      name: '',
      width: null,
      height: '',
      widthMedia: null,
      priority: null,
    };
  }

  initialize() {
    this.get('widthMedia') === null && this.set('widthMedia', this.get('width'));
    this.get('width') === null && this.set('width', this.get('widthMedia'));
    !this.get('priority') && this.set('priority', parseFloat(this.get('widthMedia')!) || 0);
    const toCheck: (keyof DeviceProperties)[] = ['width', 'height', 'widthMedia'];
    toCheck.forEach((prop) => this.checkUnit(prop));
  }

  checkUnit(prop: keyof DeviceProperties) {
    const pr = (this.get(prop) || '') as string;
    const noUnit = (parseFloat(pr) || 0).toString() === pr.toString();
    noUnit && this.set(prop, `${pr}px`);
  }

  getName() {
    return this.get('name') || this.get('id');
  }

  getWidthMedia() {
    return this.get('widthMedia') || '';
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Devices.ts]---
Location: grapesjs-dev/packages/core/src/device_manager/model/Devices.ts

```typescript
import { Collection } from '../../common';
import Device from './Device';

export default class Devices extends Collection<Device> {}

Devices.prototype.model = Device;
```

--------------------------------------------------------------------------------

---[FILE: DevicesView.ts]---
Location: grapesjs-dev/packages/core/src/device_manager/view/DevicesView.ts

```typescript
import { View } from '../../common';
import EditorModel from '../../editor/model/Editor';
import html from '../../utils/html';
import Devices from '../model/Devices';

export interface DevicesViewConfig {
  em: EditorModel;
  pStylePrefix?: string;
}

export default class DevicesView extends View {
  em: EditorModel;
  config: DevicesViewConfig;
  ppfx: string;
  devicesEl?: JQuery<HTMLElement>;

  template({ ppfx, label }: { ppfx: string; label: string }) {
    return html`
      <div class="${ppfx}device-label">${label}</div>
      <div class="${ppfx}field ${ppfx}select">
        <span id="${ppfx}input-holder">
          <select class="${ppfx}devices"></select>
        </span>
        <div class="${ppfx}sel-arrow">
          <div class="${ppfx}d-s-arrow"></div>
        </div>
      </div>
      <button style="display:none" class="${ppfx}add-trasp" data-add-trasp>+</button>
    `;
  }

  events() {
    return {
      change: 'updateDevice',
      'click [data-add-trasp]': 'startAdd',
    };
  }

  constructor(o: { config: DevicesViewConfig; collection: Devices }) {
    super(o);
    this.config = o.config || {};
    this.em = this.config.em;
    this.ppfx = this.config.pStylePrefix || '';
    this.listenTo(this.em, 'change:device', this.updateSelect);
  }

  /**
   * Start adding new device
   * @return {[type]} [description]
   * @private
   */
  startAdd() {}

  /**
   * Update device of the editor
   * @private
   */
  updateDevice() {
    const { em } = this;

    if (em) {
      const devEl = this.devicesEl;
      em.set('device', devEl ? devEl.val() : '');
    }
  }

  /**
   * Update select value on device update
   * @private
   */
  updateSelect() {
    const { em, devicesEl } = this;

    if (em && em.getDeviceModel && devicesEl) {
      const device = em.getDeviceModel();
      devicesEl.val(device ? device.get('id')! : '');
    }
  }

  /**
   * Return devices options
   * @return {string} String of options
   * @private
   */
  getOptions() {
    const { collection, em } = this;
    let result = '';

    collection.forEach((device) => {
      const { name, id } = device.attributes;
      const label = (em && em.t && em.t(`deviceManager.devices.${id}`)) || name;
      result += `<option value="${id || name}">${label}</option>`;
    });

    return result;
  }

  render() {
    const { em, ppfx, $el, el } = this;
    const label = em && em.t && em.t('deviceManager.device');
    $el.html(this.template({ ppfx, label }));
    this.devicesEl = $el.find(`.${ppfx}devices`);
    this.devicesEl.append(this.getOptions());
    this.devicesEl.val(em.get('device'));
    el.className = `${ppfx}devices-c`;
    return this;
  }
}
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 35
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 35 of 97)

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

---[FILE: CssRuleView.ts]---
Location: grapesjs-dev/packages/core/src/css_composer/view/CssRuleView.ts

```typescript
import FrameView from '../../canvas/view/FrameView';
import { View } from '../../common';
import EditorModel from '../../editor/model/Editor';
import CssRule from '../model/CssRule';
import { CssEvents } from '../types';

export default class CssRuleView extends View<CssRule> {
  config: any;

  constructor(o: any = {}) {
    super(o);
    this.config = o.config || {};
    const { model } = this;
    this.listenTo(model, 'change', this.render);
    this.listenTo(model, 'destroy remove', this.remove);
    this.listenTo(model.get('selectors'), 'change', this.render);
    model.setView(this);
  }

  get frameView(): FrameView {
    return this.config.frameView;
  }

  get em(): EditorModel {
    return this.model.em!;
  }

  remove() {
    super.remove();
    this.model.removeView(this);
    return this;
  }

  updateStyles() {
    this.render();
  }

  /** @ts-ignore */
  tagName() {
    return 'style';
  }

  render() {
    const { model, el, em } = this;
    const important = model.get('important');
    const css = model.toCSS({ important });
    const mountProps = { rule: model, ruleView: this, css };
    em?.trigger(CssEvents.mountBefore, mountProps);
    el.innerHTML = mountProps.css;
    em?.trigger(CssEvents.mount, mountProps);
    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/index.ts
Signals: TypeORM

```typescript
/**
 * This module manages data sources within the editor.
 * Once the editor is instantiated, you can use the following API to manage data sources:
 *
 * ```js
 * const editor = grapesjs.init({ ... });
 * const dsm = editor.DataSources;
 * ```
 *
 * {REPLACE_EVENTS}
 *
 * ## Methods
 * * [add](#add) - Add a new data source.
 * * [get](#get) - Retrieve a data source by its ID.
 * * [getAll](#getall) - Retrieve all data sources.
 * * [remove](#remove) - Remove a data source by its ID.
 * * [clear](#clear) - Remove all data sources.
 *
 * [DataSource]: datasource.html
 *
 * @module DataSources
 */

import { Events } from 'backbone';
import { isEmpty } from 'underscore';
import { ItemManagerModule, ModuleConfig } from '../abstract/Module';
import { AddOptions, collectionEvents, ObjectAny, RemoveOptions } from '../common';
import EditorModel from '../editor/model/Editor';
import { get, set, stringToPath } from '../utils/mixins';
import defConfig, { DataSourcesConfig } from './config/config';
import { AnyTypeOperation } from './model/conditional_variables/operators/AnyTypeOperator';
import { BooleanOperation } from './model/conditional_variables/operators/BooleanOperator';
import { NumberOperation } from './model/conditional_variables/operators/NumberOperator';
import { StringOperation } from './model/conditional_variables/operators/StringOperator';
import { DataCollectionStateType } from './model/data_collection/types';
import DataRecord from './model/DataRecord';
import DataSource from './model/DataSource';
import DataSources from './model/DataSources';
import {
  DataCollectionKeys,
  DataComponentTypes,
  DataFieldPrimitiveType,
  DataRecordProps,
  DataSourceProps,
  DataSourcesEvents,
} from './types';

export default class DataSourceManager extends ItemManagerModule<DataSourcesConfig & ModuleConfig, DataSources> {
  storageKey = 'dataSources';
  events = DataSourcesEvents;
  dataComponentTypes = DataComponentTypes;
  dataCollectionKeys = DataCollectionKeys;
  dataCollectionStateTypes = DataCollectionStateType;
  dataFieldPrimitiveType = DataFieldPrimitiveType;
  dataOperationTypes = {
    any: AnyTypeOperation,
    boolean: BooleanOperation,
    number: NumberOperation,
    string: StringOperation,
  };
  destroy(): void {}

  constructor(em: EditorModel) {
    super(em, 'DataSources', new DataSources([], em), DataSourcesEvents, defConfig());
    Object.assign(this, Events); // Mixin Backbone.Events
  }

  /**
   * Add new data source.
   * @param {Object} props Data source properties.
   * @returns {[DataSource]} Added data source.
   * @example
   * const ds = dsm.add({
   *  id: 'my_data_source_id',
   *  records: [
   *    { id: 'id1', name: 'value1' },
   *    { id: 'id2', name: 'value2' }
   *  ]
   * });
   */
  add<DRProps extends DataRecordProps>(props: DataSourceProps<DRProps>, opts: AddOptions = {}): DataSource<DRProps> {
    const { all } = this;
    props.id = props.id || this._createId();

    return all.add(props, opts) as DataSource<DRProps>;
  }

  /**
   * Get data source.
   * @param {String} id Data source id.
   * @returns {[DataSource]} Data source.
   * @example
   * const ds = dsm.get('my_data_source_id');
   */
  get(id: string) {
    return this.all.get(id);
  }

  /**
   * Return all data sources.
   * @returns {Array<[DataSource]>}
   * @example
   * const ds = dsm.getAll();
   */
  getAll() {
    return [...this.all.models];
  }

  /**
   * Get value from data sources by path.
   * @param {String} path Path to value.
   * @param {any} defValue Default value if the path is not found.
   * @returns {any}
   * const value = dsm.getValue('ds_id.record_id.propName', 'defaultValue');
   */
  getValue(path: string | string[], defValue?: any, opts?: { context?: Record<string, any> }) {
    return get(opts?.context || this.getContext(), path, defValue);
  }

  /**
   * Set value in data sources by path.
   * @param {String} path Path to value in format 'dataSourceId.recordId.propName'
   * @param {any} value Value to set
   * @returns {Boolean} Returns true if the value was set successfully
   * @example
   * dsm.setValue('ds_id.record_id.propName', 'new value');
   */
  setValue(path: string, value: any) {
    const [ds, record, propPath] = this.fromPath(path);

    if (record && (propPath || propPath === '')) {
      let attrs = { ...record.attributes };
      if (set(attrs, propPath || '', value)) {
        record.set(attrs);
        return true;
      }
    }

    return false;
  }

  getContext() {
    return this.all.reduce((acc, ds) => {
      acc[ds.id] = ds.records.reduce((accR, dr, i) => {
        const dataRecord = dr;

        const attributes = { ...dataRecord.attributes };
        delete attributes.__p;
        accR[dataRecord.id || i] = attributes;

        return accR;
      }, {} as ObjectAny);
      return acc;
    }, {} as ObjectAny);
  }

  /**
   * Remove data source.
   * @param {String|[DataSource]} id Id of the data source.
   * @returns {[DataSource]} Removed data source.
   * @example
   * const removed = dsm.remove('DS_ID');
   */
  remove(id: string | DataSource, opts?: RemoveOptions) {
    return this.__remove(id, opts);
  }

  /**
   * Retrieve a data source, data record, and optional property path based on a string path.
   * This method parses a string path to identify and retrieve the corresponding data source
   * and data record. If a property path is included in the input, it will also be returned.
   * The method is useful for accessing nested data within data sources.
   *
   * @param {String} path - The string path in the format 'dataSourceId.recordId.property'.
   * @returns {[DataSource?, DataRecord?, String?]} - An array containing the data source,
   * data record, and optional property path.
   * @example
   * const [dataSource, dataRecord, propPath] = dsm.fromPath('my_data_source_id.record_id.myProp');
   * // e.g., [DataSource, DataRecord, 'myProp']
   */
  fromPath(path: string) {
    const result: [DataSource?, DataRecord?, string?] = [];
    const [dsId, drId, ...resPath] = stringToPath(path || '');
    const dataSource = this.get(dsId);
    const dataRecord = dataSource?.records.get(drId);
    dataSource && result.push(dataSource);

    if (dataRecord) {
      result.push(dataRecord);
      resPath.length && result.push(resPath.join('.'));
    }

    return result;
  }

  /**
   * Store data sources to a JSON object.
   * @returns {Array} Stored data sources.
   */
  store() {
    const data: DataSourceProps[] = [];
    this.all.forEach((dataSource) => {
      const { skipFromStorage, transformers, records, schema, ...rest } = dataSource.attributes;

      if (!skipFromStorage) {
        data.push({
          ...rest,
          id: rest.id!,
          schema: !isEmpty(schema) ? schema : undefined,
          records: !rest.provider ? records : undefined,
        });
      }
    });

    return { [this.storageKey]: data };
  }

  /**
   * Load data sources from a JSON object.
   * @param {Object} data The data object containing data sources.
   * @returns {Object} Loaded data sources.
   */
  load(data: any) {
    const { config, all, events, em } = this;
    const result = this.loadProjectData(data);

    if (config.autoloadProviders) {
      const dsWithProviders = all.filter((ds) => ds.hasProvider);

      if (!!dsWithProviders.length) {
        const loadProviders = async () => {
          em.trigger(events.providerLoadAllBefore);
          const providersToLoad = dsWithProviders.map((ds) => ds.loadProvider());
          await Promise.all(providersToLoad);
          em.trigger(events.providerLoadAll);
        };
        loadProviders();
      }
    }

    return result;
  }

  postLoad() {
    const { em, all } = this;
    em.listenTo(all, collectionEvents, (dataSource, c, o) => {
      const options = o || c;
      em.changesUp(options, { dataSource, options });
    });
    this.em.UndoManager.add(all);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/types.ts
Signals: TypeORM

```typescript
import { AddOptions, Collection, Model, ObjectAny, RemoveOptions, SetOptions } from '../common';
import DataRecord from './model/DataRecord';
import DataRecords from './model/DataRecords';
import DataSource from './model/DataSource';
import DataVariable, { DataVariableProps } from './model/DataVariable';
import { DataCondition, DataConditionProps } from './model/conditional_variables/DataCondition';

export type DataResolver = DataVariable | DataCondition;
export type DataResolverProps = DataVariableProps | DataConditionProps;
export type ResolverFromProps<T extends DataResolverProps> = T extends DataVariableProps
  ? DataVariable
  : T extends DataConditionProps
    ? DataCondition
    : never;

export enum DataComponentTypes {
  variable = 'data-variable',
  condition = 'data-condition',
  conditionTrue = 'data-condition-true-content',
  conditionFalse = 'data-condition-false-content',
  collection = 'data-collection',
  collectionItem = 'data-collection-item',
}

export enum DataCollectionKeys {
  rootData = '__rootData',
}

export interface DataRecordProps extends ObjectAny {
  /**
   * Record id.
   */
  id: string;

  /**
   * Specifies if the record is mutable. Defaults to `true`.
   */
  mutable?: boolean;

  [key: string]: any;
}

export interface DataSourceListener {
  obj: Model | Collection;
  event: string;
}

interface BaseDataSource {
  /**
   * DataSource id.
   */
  id: string;

  /**
   * DataSource validation and transformation factories.
   */
  transformers?: DataSourceTransformers;

  /**
   * If true will store the data source in the GrapesJS project.json file.
   */
  skipFromStorage?: boolean;

  [key: string]: unknown;
}

export enum DataFieldPrimitiveType {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  date = 'date',
  json = 'json',
  relation = 'relation',
}

export interface DataFieldSchemaBase<T = unknown> {
  default?: T;
  description?: string;
  label?: string;
  [key: string]: unknown;
  // order?: number;
  // primary?: boolean;
  // required?: boolean;
  // unique?: boolean;
  // validate?: (value: T, record: Record<string, any>) => boolean;
}

export interface DataFieldSchemaString extends DataFieldSchemaBase<string> {
  type: `${DataFieldPrimitiveType.string}`;
  enum?: string[];
}

export interface DataFieldSchemaNumber extends DataFieldSchemaBase<number> {
  type: `${DataFieldPrimitiveType.number}`;
}

export interface DataFieldSchemaBoolean extends DataFieldSchemaBase<boolean> {
  type: `${DataFieldPrimitiveType.boolean}`;
}

export interface DataFieldSchemaDate extends DataFieldSchemaBase<Date> {
  type: `${DataFieldPrimitiveType.date}`;
}

export interface DataFieldSchemaJSON extends DataFieldSchemaBase<any> {
  type: `${DataFieldPrimitiveType.json}`;
}

export interface DataFieldSchemaRelation extends DataFieldSchemaBase {
  type: `${DataFieldPrimitiveType.relation}`;
  /**
   * The target data source ID
   */
  target: string;
  /**
   * The target field in the data source
   */
  targetField?: string;
  /**
   * If true, the relation is one-to-many
   */
  isMany?: boolean;
}

export type DataFieldSchemas =
  | DataFieldSchemaString
  | DataFieldSchemaNumber
  | DataFieldSchemaBoolean
  | DataFieldSchemaDate
  | DataFieldSchemaJSON
  | DataFieldSchemaRelation;

export type DataSourceSchema<DR extends DataRecordProps = DataRecordProps> = {
  [K in keyof DR]?: DataFieldSchemas;
};

export interface DataSourceProviderMethodProps {
  url: string;
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit;
}

export interface DataSourceProviderDefinitionProps {
  get: string | DataSourceProviderMethodProps;
}

export interface DataSourceProviderResult {
  records?: DataRecordProps[];
  schema?: DataSourceSchema;
}

export type DataSourceProviderProp = string | DataSourceProviderDefinitionProps;

export interface DataSourceType<DR extends DataRecordProps> extends BaseDataSource {
  records: DataRecords<DR>;
  schema: DataSourceSchema<DR>;
  provider?: DataSourceProviderProp;
}
export interface DataSourceProps<DR extends DataRecordProps = DataRecordProps> extends BaseDataSource {
  records?: DataRecords<DR> | DataRecord<DR>[] | DR[];
  schema?: DataSourceSchema<DR>;
  provider?: DataSourceProviderProp;
}
export type RecordPropsType<T> = T extends DataRecord<infer U> ? U : never;
export interface DataSourceTransformers {
  onRecordSetValue?: (args: { id: string | number; key: string; value: any }) => any;
}

type DotSeparatedKeys<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}` | `${K}.${DotSeparatedKeys<T[K]>}`
          : `${K}`
        : never;
    }[keyof T]
  : never;

export type DeepPartialDot<T> = {
  [P in DotSeparatedKeys<T>]?: P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? Rest extends DotSeparatedKeys<T[K]>
        ? DeepPartialDot<T[K]>[Rest]
        : never
      : never
    : P extends keyof T
      ? T[P]
      : never;
};

export type DataSourceEvent = `${DataSourcesEvents}`;

/**{START_EVENTS}*/
export enum DataSourcesEvents {
  /**
   * @event `data:add` Added new data source.
   * @example
   * editor.on('data:add', (dataSource) => { ... });
   */
  add = 'data:add',
  addBefore = 'data:add:before',

  /**
   * @event `data:remove` Data source removed.
   * @example
   * editor.on('data:remove', (dataSource) => { ... });
   */
  remove = 'data:remove',
  removeBefore = 'data:remove:before',

  /**
   * @event `data:update` Data source updated.
   * @example
   * editor.on('data:update', (dataSource, changes) => { ... });
   */
  update = 'data:update',

  /**
   * @event `data:path` Data record path update.
   * @example
   * editor.on('data:path:SOURCE_ID.RECORD_ID.PROP_NAME', ({ dataSource, dataRecord, path }) => { ... });
   * editor.on('data:path', ({ dataSource, dataRecord, path }) => {
   *  console.log('Path update in any data source')
   * });
   */
  path = 'data:path',

  /**
   * @event `data:pathSource` Data record path update per source.
   * @example
   * editor.on('data:pathSource:SOURCE_ID', ({ dataSource, dataRecord, path }) => { ... });
   */
  pathSource = 'data:pathSource:',

  /**
   * @event `data:provider:load` Data source provider load.
   * @example
   * editor.on('data:provider:load', ({ dataSource, result }) => { ... });
   */
  providerLoad = 'data:provider:load',
  providerLoadBefore = 'data:provider:load:before',
  providerLoadError = 'data:provider:load:error',

  /**
   * @event `data:provider:loadAll` Load of all data source providers (eg. on project load).
   * @example
   * editor.on('data:provider:loadAll', () => { ... });
   */
  providerLoadAll = 'data:provider:loadAll',
  providerLoadAllBefore = 'data:provider:loadAll:before',

  /**
   * @event `data` Catch-all event for all the events mentioned above.
   * @example
   * editor.on('data', ({ event, model, ... }) => { ... });
   */
  all = 'data',
}
/**{END_EVENTS}*/

export interface DataSourcesEventCallback {
  [DataSourcesEvents.add]: [DataSource, AddOptions];
  [DataSourcesEvents.remove]: [DataSource, RemoveOptions];
  [DataSourcesEvents.update]: [DataSource, AddOptions];
  [DataSourcesEvents.path]: [{ dataSource: DataSource; dataRecord: DataRecord; path: string; options: SetOptions }];
  [DataSourcesEvents.pathSource]: [
    { dataSource: DataSource; dataRecord: DataRecord; path: string; options: SetOptions },
  ];
  [DataSourcesEvents.providerLoad]: [{ dataSource: DataSource; result: DataSourceProviderResult }];
  [DataSourcesEvents.providerLoadBefore]: [{ dataSource: DataSource }];
  [DataSourcesEvents.providerLoadError]: [{ dataSource: DataSource; error: Error }];
  [DataSourcesEvents.providerLoadAll]: [];
  [DataSourcesEvents.providerLoadAllBefore]: [];
  [DataSourcesEvents.all]: [{ event: DataSourceEvent; model?: Model; options: ObjectAny }];
}

// need this to avoid the TS documentation generator to break
export default DataSourcesEvents;
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/utils.ts

```typescript
import EditorModel from '../editor/model/Editor';
import { DataComponentTypes, DataResolver, DataResolverProps, ResolverFromProps } from './types';
import { DataCollectionStateMap } from './model/data_collection/types';
import { DataConditionType, DataCondition } from './model/conditional_variables/DataCondition';
import DataVariable, { DataVariableProps, DataVariableType } from './model/DataVariable';
import { ComponentDefinition, ComponentOptions } from '../dom_components/model/types';
import { serialize } from '../utils/mixins';
import { getSymbolMain } from '../dom_components/model/SymbolUtils';
import Component from '../dom_components/model/Component';

export const DEF_DATA_FIELD_ID = 'id';

export function isDataResolverProps(value: any): value is DataResolverProps {
  return typeof value === 'object' && [DataVariableType, DataConditionType].includes(value?.type);
}

export function isDataResolver(value: any): value is DataResolver {
  return value instanceof DataVariable || value instanceof DataCondition;
}

export function isDataVariable(variable: any): variable is DataVariableProps {
  return variable?.type === DataVariableType;
}

export function isDataCondition(variable: any) {
  return variable?.type === DataConditionType;
}

export function valueOrResolve(variable: any, opts: { em: EditorModel; collectionsStateMap: DataCollectionStateMap }) {
  if (!isDataResolverProps(variable)) return variable;
  if (isDataVariable(variable)) DataVariable.resolveDataResolver(variable, opts);

  return getDataResolverInstanceValue(variable, opts);
}

export function getDataResolverInstance(
  resolverProps: DataResolverProps,
  options: { em: EditorModel; collectionsStateMap: DataCollectionStateMap },
): ResolverFromProps<typeof resolverProps> | undefined {
  const { type } = resolverProps;
  let resolver: DataResolver;

  switch (type) {
    case DataVariableType:
      resolver = new DataVariable(resolverProps, options);
      break;
    case DataConditionType: {
      resolver = new DataCondition(resolverProps, options);
      break;
    }
    default:
      options.em?.logWarning(`Unsupported resolver type: ${type}`);
      return;
  }

  return resolver;
}

export function getDataResolverInstanceValue(
  resolverProps: DataResolverProps,
  options: {
    em: EditorModel;
    collectionsStateMap: DataCollectionStateMap;
  },
) {
  const resolver = getDataResolverInstance(resolverProps, options);

  return resolver?.getDataValue();
}

export const ensureComponentInstance = (
  cmp: Component | ComponentDefinition | undefined,
  opt: ComponentOptions,
): Component => {
  if (cmp instanceof Component) return cmp;

  const componentType = (cmp?.type as string) ?? 'default';
  const defaultModel = opt.em.Components.getType('default');
  const type = opt.em.Components.getType(componentType) ?? defaultModel;
  const Model = type.model;

  return new Model(serialize(cmp ?? {}), opt);
};

export const isComponentDataOutputType = (type: string | undefined) => {
  return (
    !!type &&
    [DataComponentTypes.collectionItem, DataComponentTypes.conditionTrue, DataComponentTypes.conditionFalse].includes(
      type as DataComponentTypes,
    )
  );
};

export function enumToArray(enumObj: any) {
  return Object.keys(enumObj)
    .filter((key) => isNaN(Number(key)))
    .map((key) => enumObj[key]);
}

function shouldSyncCollectionSymbol(component: Component): boolean {
  const componentCollectionMap = component.collectionsStateMap;
  if (!componentCollectionMap) return false;

  const parentCollectionIds = Object.keys(componentCollectionMap);
  if (!parentCollectionIds.length) return false;

  const mainSymbolComponent = getSymbolMain(component);

  if (!mainSymbolComponent || mainSymbolComponent === component) return false;

  const mainSymbolCollectionMap = mainSymbolComponent.collectionsStateMap;
  const mainSymbolParentIds = Object.keys(mainSymbolCollectionMap);

  const isSubsetOfOriginalCollections = mainSymbolParentIds.every((id) => parentCollectionIds.includes(id));

  return isSubsetOfOriginalCollections;
}

function getIdFromCollectionSymbol(component: Component): string {
  const mainSymbolComponent = getSymbolMain(component);
  return mainSymbolComponent ? mainSymbolComponent.getId() : '';
}

export function checkAndGetSyncableCollectionItemId(component: Component) {
  const shouldSync = shouldSyncCollectionSymbol(component);
  const itemId = shouldSync ? getIdFromCollectionSymbol(component) : null;
  return { shouldSync, itemId };
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/config/config.ts

```typescript
export interface DataSourcesConfig {
  /**
   * If true, data source providers will be autoloaded on project load.
   * @default false
   */
  autoloadProviders?: boolean;
}

const config: () => DataSourcesConfig = () => ({
  autoloadProviders: false,
});

export default config;
```

--------------------------------------------------------------------------------

---[FILE: ComponentDataVariable.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/ComponentDataVariable.ts

```typescript
import { ComponentOptions, ComponentProperties } from '../../dom_components/model/types';
import { toLowerCase } from '../../utils/mixins';
import DataVariable, { DataVariableProps, DataVariableType } from './DataVariable';
import { ComponentWithDataResolver } from './ComponentWithDataResolver';
import { DataResolver } from '../types';
import { DataCollectionStateMap } from './data_collection/types';

export interface ComponentDataVariableProps extends ComponentProperties {
  type?: typeof DataVariableType;
  dataResolver?: DataVariableProps;
}

export default class ComponentDataVariable extends ComponentWithDataResolver<DataVariableProps> {
  get defaults() {
    return {
      // @ts-ignore
      ...super.defaults,
      type: DataVariableType,
      dataResolver: {},
      droppable: false,
    };
  }

  getPath() {
    return this.dataResolver.get('path');
  }

  getCollectionId() {
    return this.dataResolver.get('collectionId');
  }

  getVariableType() {
    return this.dataResolver.get('variableType');
  }

  getDefaultValue() {
    return this.dataResolver.get('defaultValue');
  }

  getDataValue() {
    return this.dataResolver.getDataValue();
  }

  resolvesFromCollection() {
    return this.dataResolver.resolvesFromCollection();
  }

  getInnerHTML() {
    return this.getDataValue();
  }

  setPath(newPath: string) {
    this.dataResolver.set('path', newPath);
  }

  setDefaultValue(newValue: string) {
    this.dataResolver.set('defaultValue', newValue);
  }

  /**
   * Sets the data source path and resets related properties.
   * This will set collectionId and variableType to undefined as it's typically
   * used when changing to a completely different data source.
   * @param newPath The new path to set as the data source
   */
  resetDataSourcePath(newPath: string) {
    this.set('dataResolver', {
      path: newPath,
      collectionId: undefined,
      variableType: undefined,
    });
  }

  protected createResolverInstance(
    props: DataVariableProps,
    options: ComponentOptions & { collectionsStateMap: DataCollectionStateMap },
  ): DataResolver {
    return new DataVariable(props, options);
  }

  static isComponent(el: HTMLElement) {
    return toLowerCase(el.tagName) === DataVariableType;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentWithCollectionsState.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/ComponentWithCollectionsState.ts
Signals: TypeORM

```typescript
import { DataCollectionStateMap } from '../../data_sources/model/data_collection/types';
import DataResolverListener from '../../data_sources/model/DataResolverListener';
import DataVariable, { DataVariableProps, DataVariableType } from '../../data_sources/model/DataVariable';
import Components from '../../dom_components/model/Components';
import Component from '../../dom_components/model/Component';
import { ObjectAny } from '../../common';
import DataSource from './DataSource';
import { isArray } from 'underscore';

export type DataVariableMap = Record<string, DataVariableProps>;

export type DataSourceRecords = DataVariableProps[] | DataVariableMap;

export default class ComponentWithCollectionsState<DataResolverType> extends Component {
  collectionsStateMap: DataCollectionStateMap = {};
  dataSourceWatcher?: DataResolverListener;

  constructor(props: any, opt: any) {
    super(props, opt);
    this.listenToPropsChange();
  }

  onCollectionsStateMapUpdate(collectionsStateMap: DataCollectionStateMap) {
    this.collectionsStateMap = collectionsStateMap;
    this.dataResolverWatchers?.onCollectionsStateMapUpdate?.();

    this.components().forEach((cmp) => {
      cmp.onCollectionsStateMapUpdate?.(collectionsStateMap);
    });
  }

  syncOnComponentChange(model: Component, collection: Components, opts: any) {
    const prev = this.collectionsStateMap;
    this.collectionsStateMap = {};
    super.syncOnComponentChange(model, collection, opts);
    this.collectionsStateMap = prev;
    this.onCollectionsStateMapUpdate(prev);
  }

  setDataResolver(dataResolver: DataResolverType | undefined) {
    return this.set('dataResolver', dataResolver);
  }

  getDataResolver() {
    return this.dataResolverProps;
  }

  get dataResolverProps(): DataResolverType | undefined {
    return this.get('dataResolver');
  }

  protected listenToDataSource() {
    const path = this.dataResolverPath;
    if (!path) return;

    const { em, collectionsStateMap } = this;
    this.dataSourceWatcher?.destroy();
    this.dataSourceWatcher = new DataResolverListener({
      em,
      resolver: new DataVariable({ type: DataVariableType, path }, { em, collectionsStateMap }),
      onUpdate: () => this.onDataSourceChange(),
    });
  }

  protected listenToPropsChange() {
    this.on(`change:dataResolver`, () => {
      this.listenToDataSource();
    });

    this.listenToDataSource();
  }

  protected get dataSourceProps(): DataVariableProps | undefined {
    return this.get('dataResolver');
  }

  protected get dataResolverPath(): string | undefined {
    return this.dataSourceProps?.path;
  }

  protected onDataSourceChange() {
    this.onCollectionsStateMapUpdate(this.collectionsStateMap);
  }

  getDataSourceItems(): DataSourceRecords {
    const { dataSourceProps } = this;
    if (!dataSourceProps) return [];

    const items = this.listDataSourceItems(dataSourceProps);
    if (items && isArray(items)) {
      return items;
    }

    const clone = { ...items };
    return clone;
  }

  protected listDataSourceItems(dataSource: DataSource | DataVariableProps): DataSourceRecords {
    const path = dataSource instanceof DataSource ? dataSource.get('id')! : dataSource.path;
    if (!path) return [];
    let value = this.em.DataSources.getValue(path, []);

    const isDatasourceId = path.split('.').length === 1;
    if (isDatasourceId) {
      value = Object.entries(value).map(([_, value]) => value);
    }

    return value;
  }

  protected getItemKey(items: DataVariableProps[] | { [x: string]: DataVariableProps }, index: number) {
    return isArray(items) ? index : Object.keys(items)[index];
  }

  private removePropsListeners() {
    this.off(`change:dataResolver`);
    this.dataSourceWatcher?.destroy();
    this.dataSourceWatcher = undefined;
  }

  destroy(options?: ObjectAny): false | JQueryXHR {
    this.removePropsListeners();
    return super.destroy(options);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentWithDataResolver.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/ComponentWithDataResolver.ts

```typescript
import { ModelDestroyOptions } from 'backbone';
import { ObjectAny } from '../../common';
import Component from '../../dom_components/model/Component';
import { DataResolver, DataResolverProps, ResolverFromProps } from '../types';
import { ComponentOptions, ComponentProperties } from '../../dom_components/model/types';
import { DataCollectionStateMap } from './data_collection/types';

interface ComponentWithDataResolverProps<T extends DataResolverProps> extends ComponentProperties {
  type: T['type'];
  dataResolver: T;
}

export abstract class ComponentWithDataResolver<T extends DataResolverProps> extends Component {
  dataResolver: ResolverFromProps<T>;

  constructor(props: ComponentWithDataResolverProps<T>, opt: ComponentOptions) {
    super(props, opt);

    this.dataResolver = this.initializeDataResolver(props, opt);
    this.listenToPropsChange();
  }

  private initializeDataResolver(
    props: ComponentWithDataResolverProps<T>,
    opt: ComponentOptions,
  ): ResolverFromProps<T> {
    const resolverProps = props.dataResolver ?? {
      type: props.type,
    };

    const resolver = this.createResolverInstance(resolverProps, {
      ...opt,
      collectionsStateMap: this.collectionsStateMap,
    });

    return resolver as ResolverFromProps<T>;
  }

  protected abstract createResolverInstance(
    props: T,
    options: ComponentOptions & { collectionsStateMap: DataCollectionStateMap },
  ): DataResolver;

  getDataResolver(): T {
    return this.get('dataResolver');
  }

  setDataResolver(props: T) {
    return this.set('dataResolver', props);
  }

  onCollectionsStateMapUpdate(collectionsStateMap: DataCollectionStateMap): void {
    this.dataResolver.updateCollectionsStateMap(collectionsStateMap);
    super.onCollectionsStateMapUpdate(collectionsStateMap);
  }

  protected listenToPropsChange() {
    this.on('change:dataResolver', () => {
      // @ts-ignore
      this.dataResolver.set(this.get('dataResolver'));
    });
  }

  protected removePropsListeners() {
    this.stopListening(this.dataResolver);
    this.off('change:dataResolver');
    this.off(`change:${this.collectionsStateMap}`);
  }

  destroy(options?: ModelDestroyOptions | undefined): false | JQueryXHR {
    this.removePropsListeners();
    return super.destroy(options);
  }

  toJSON(opts?: ObjectAny): any {
    const json = super.toJSON(opts);
    const dataResolver = this.dataResolver.toJSON();
    delete dataResolver.type;

    return {
      ...json,
      dataResolver,
    };
  }
}
```

--------------------------------------------------------------------------------

---[FILE: DataRecord.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/DataRecord.ts
Signals: TypeORM

```typescript
/**
 * The `DataRecord` class represents a single record within a data source.
 * It extends the base `Model` class and provides additional methods and properties specific to data records.
 * Each `DataRecord` is associated with a `DataSource` and can trigger events when its properties change.
 *
 * ### DataRecord API
 *
 * * [getPath](#getpath)
 * * [getPaths](#getpaths)
 * * [set](#set)
 *
 * ### Example of Usage
 *
 * ```js
 * const record = new DataRecord({ id: 'record1', name: 'value1' }, { collection: dataRecords });
 * const path = record.getPath(); // e.g., 'SOURCE_ID.record1'
 * record.set('name', 'newValue');
 * ```
 *
 * @module DataRecord
 * @param {DataRecordProps} props - Properties to initialize the data record.
 * @param {Object} opts - Options for initializing the data record.
 * @extends {Model<DataRecordProps>}
 */

import { keys } from 'underscore';
import { Model, SetOptions } from '../../common';
import { DataRecordProps, DataSourcesEvents, DeepPartialDot } from '../types';
import DataRecords from './DataRecords';
import DataSource from './DataSource';
import EditorModel from '../../editor/model/Editor';
import { _StringKey } from 'backbone';

export default class DataRecord<T extends DataRecordProps = DataRecordProps> extends Model<T> {
  public mutable: boolean;

  constructor(props: T, opts = {}) {
    super(props, opts);
    this.mutable = props.mutable ?? true;
    this.on('change', this.handleChange);
  }

  get cl() {
    return this.collection as unknown as DataRecords;
  }

  get dataSource(): DataSource {
    return this.cl.dataSource;
  }

  get em(): EditorModel {
    return this.dataSource.em;
  }

  get index(): number {
    return this.cl.indexOf(this);
  }

  /**
   * Handles changes to the record's attributes.
   * This method triggers a change event for each property that has been altered.
   *
   * @private
   * @name handleChange
   */
  handleChange(m: DataRecord, opts: SetOptions) {
    const changed = this.changedAttributes();
    keys(changed).forEach((prop) => this.triggerChange(prop, opts));
  }

  /**
   * Get the path of the record.
   * The path is a string that represents the location of the record within the data source.
   * Optionally, include a property name to create a more specific path.
   *
   * @param {String} [prop] - Optional property name to include in the path.
   * @param {Object} [opts] - Options for path generation.
   * @param {Boolean} [opts.useIndex] - Whether to use the index of the record in the path.
   * @returns {String} - The path of the record.
   * @name getPath
   * @example
   * const pathRecord = record.getPath();
   * // e.g., 'SOURCE_ID.record1'
   * const pathRecord2 = record.getPath('myProp');
   * // e.g., 'SOURCE_ID.record1.myProp'
   */
  getPath(prop?: string, opts: { useIndex?: boolean } = {}) {
    const { dataSource, id, index } = this;
    const dsId = dataSource.id;
    const suffix = prop ? `.${prop}` : '';
    return `${dsId}.${opts.useIndex ? index : id}${suffix}`;
  }

  /**
   * Get both ID-based and index-based paths of the record.
   * Returns an array containing the paths using both ID and index.
   *
   * @param {String} [prop] - Optional property name to include in the paths.
   * @returns {Array<String>} - An array of paths.
   * @name getPaths
   * @example
   * const paths = record.getPaths();
   * // e.g., ['SOURCE_ID.record1', 'SOURCE_ID.0']
   */
  getPaths(prop?: string) {
    return [this.getPath(prop), this.getPath(prop, { useIndex: true })];
  }

  /**
   * Trigger a change event for the record.
   * Optionally, include a property name to trigger a change event for a specific property.
   *
   * @param {String} [prop] - Optional property name to trigger a change event for a specific property.
   * @name triggerChange
   */
  triggerChange(prop?: string, options: SetOptions = {}) {
    const { dataSource, em } = this;
    const paths = this.getPaths(prop);
    const data = { dataSource, dataRecord: this, path: paths[0], options };
    em.trigger(DataSourcesEvents.path, data);
    em.trigger(`${DataSourcesEvents.pathSource}:${dataSource.id}`, data);
    paths.forEach((path) => em.trigger(`${DataSourcesEvents.path}:${path}`, { ...data, path }));
  }

  /**
   * Set a property on the record, optionally using transformers.
   * If transformers are defined for the record, they will be applied to the value before setting it.
   *
   * @param {String|Object} attributeName - The name of the attribute to set, or an object of key-value pairs.
   * @param {any} [value] - The value to set for the attribute.
   * @param {Object} [options] - Options to apply when setting the attribute.
   * @param {Boolean} [options.avoidTransformers] - If true, transformers will not be applied.
   * @returns {DataRecord} - The instance of the DataRecord.
   * @name set
   * @example
   * record.set('name', 'newValue');
   * // Sets 'name' property to 'newValue'
   */
  set<A extends _StringKey<T>>(
    attributeName: DeepPartialDot<T> | A,
    value?: SetOptions | T[A] | undefined,
    options?: SetOptions | undefined,
  ): this;
  set(attributeName: unknown, value?: unknown, options?: SetOptions): DataRecord {
    if (!this.isNew() && this.attributes.mutable === false) {
      throw new Error('Cannot modify immutable record');
    }

    const onRecordSetValue = this.dataSource?.transformers?.onRecordSetValue;

    const applySet = (key: string, val: unknown, opts: SetOptions = {}) => {
      const newValue =
        opts?.avoidTransformers || !onRecordSetValue
          ? val
          : onRecordSetValue({
              id: this.id,
              key,
              value: val,
            });
      super.set(key, newValue, opts);
      // This ensures to trigger the change event with partial updates
      super.set({ __p: opts.partial ? true : undefined } as any, opts);
    };

    if (typeof attributeName === 'object' && attributeName !== null) {
      const attributes = attributeName as Partial<T>;
      for (const [key, val] of Object.entries(attributes)) {
        applySet(key, val, value as SetOptions);
      }
    } else {
      applySet(attributeName as string, value, options);
    }

    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: DataRecords.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/DataRecords.ts
Signals: TypeORM

```typescript
import { Collection } from '../../common';
import { DataRecordProps } from '../types';
import DataRecord from './DataRecord';
import DataSource from './DataSource';

export default class DataRecords<T extends DataRecordProps = DataRecordProps> extends Collection<DataRecord<T>> {
  dataSource: DataSource;

  constructor(models: DataRecord[] | DataRecordProps[], options: { dataSource: DataSource }) {
    super(models, options);
    this.dataSource = options.dataSource;
  }
}

DataRecords.prototype.model = DataRecord;
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 36
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 36 of 97)

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

---[FILE: DataResolverListener.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/DataResolverListener.ts

```typescript
import { DataSourcesEvents, DataSourceListener } from '../types';
import { stringToPath } from '../../utils/mixins';
import { Model } from '../../common';
import EditorModel from '../../editor/model/Editor';
import DataVariable, { DataVariableType } from './DataVariable';
import { DataResolver } from '../types';
import {
  DataCondition,
  DataConditionOutputChangedEvent,
  DataConditionType,
} from './conditional_variables/DataCondition';

export interface DataResolverListenerProps {
  em: EditorModel;
  resolver: DataResolver;
  onUpdate: (value: any) => void;
}

interface ListenerWithCallback extends DataSourceListener {
  callback: (opts?: any) => void;
}

export default class DataResolverListener {
  private listeners: ListenerWithCallback[] = [];
  private em: EditorModel;
  private onUpdate: (value: any) => void;
  private model = new Model();
  resolver: DataResolver;

  constructor(props: DataResolverListenerProps) {
    this.em = props.em;
    this.resolver = props.resolver;
    this.onUpdate = props.onUpdate;
    this.listenToResolver();
  }

  private onChange = () => {
    const value = this.resolver.getDataValue();
    this.onUpdate(value);
  };

  private createListener(
    obj: any,
    event: string,
    callback: (opts?: any) => void = this.onChange,
  ): ListenerWithCallback {
    return { obj, event, callback };
  }

  listenToResolver() {
    const { resolver, model } = this;
    this.removeListeners();
    let listeners: ListenerWithCallback[] = [];
    const type = resolver.attributes.type;

    switch (type) {
      case DataVariableType:
        listeners = this.listenToDataVariable(resolver as DataVariable);
        break;
      case DataConditionType:
        listeners = this.listenToConditionalVariable(resolver as DataCondition);
        break;
    }

    listeners.forEach((ls) => model.listenTo(ls.obj, ls.event, ls.callback));
    this.listeners = listeners;
  }

  private listenToConditionalVariable(dataVariable: DataCondition): ListenerWithCallback[] {
    return [
      {
        obj: dataVariable,
        event: DataConditionOutputChangedEvent,
        callback: this.onChange,
      },
    ];
  }

  private listenToDataVariable(dataVariable: DataVariable): ListenerWithCallback[] {
    const { em } = this;
    const dataListeners: ListenerWithCallback[] = [];
    const onChangeAndRewatch = () => {
      this.listenToResolver();
      this.onChange();
    };
    dataListeners.push(this.createListener(dataVariable, 'change', onChangeAndRewatch));

    const path = dataVariable.getResolverPath();
    if (!path) return dataListeners;

    const normPath = stringToPath(path || '').join('.');
    const [ds, dr] = em.DataSources.fromPath(path!);

    if (ds) {
      dataListeners.push(this.createListener(ds.records, 'add remove reset', onChangeAndRewatch));
    }

    if (dr) {
      dataListeners.push(this.createListener(dr, 'change'));
    }

    dataListeners.push(
      this.createListener(em.DataSources.all, 'add remove reset', onChangeAndRewatch),
      this.createListener(em, `${DataSourcesEvents.path}:${normPath}`),
      this.createListener(em, DataSourcesEvents.path, ({ path: eventPath }: { path: string }) => {
        if (
          // Skip same path as it's already handled be the listener above
          eventPath !== path &&
          eventPath.startsWith(path)
        ) {
          this.onChange();
        }
      }),
    );

    return dataListeners;
  }

  private removeListeners() {
    this.listeners.forEach((ls) => this.model.stopListening(ls.obj, ls.event, ls.callback));
    this.listeners = [];
  }

  destroy() {
    this.removeListeners();
  }
}
```

--------------------------------------------------------------------------------

---[FILE: DataSource.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/DataSource.ts
Signals: TypeORM

```typescript
/**
 * The `DataSource` class represents a data source within the editor.
 * It manages a collection of data records and provides methods to interact with them.
 * The `DataSource` can be extended with transformers to modify records during add, read, and delete operations.
 *
 * ### DataSource API
 *
 * * [addRecord](#addrecord)
 * * [getRecord](#getrecord)
 * * [getRecords](#getrecords)
 * * [removeRecord](#removerecord)
 *
 * ### Example of Usage
 *
 * ```js
 * const dataSource = new DataSource({
 *   records: [
 *     { id: 'id1', name: 'value1' },
 *     { id: 'id2', name: 'value2' }
 *   ],
 * }, { em: editor });
 *
 * dataSource.addRecord({ id: 'id3', name: 'value3' });
 * ```
 *
 * @module DataSource
 * @param {DataSourceProps} props - Properties to initialize the data source.
 * @param {DataSourceOptions} opts - Options to initialize the data source.
 * @extends {Model<DataSourceProps>}
 */

import { isString } from 'underscore';
import {
  AddOptions,
  collectionEvents,
  CombinedModelConstructorOptions,
  Model,
  RemoveOptions,
  SetOptions,
} from '../../common';
import EditorModel from '../../editor/model/Editor';
import {
  DataFieldPrimitiveType,
  DataFieldSchemaRelation,
  DataRecordProps,
  DataSourceProps,
  DataSourceProviderResult,
  DataSourceTransformers,
  DataSourceType,
} from '../types';
import { DEF_DATA_FIELD_ID } from '../utils';
import DataRecord from './DataRecord';
import DataRecords from './DataRecords';
import DataSources from './DataSources';

interface DataSourceOptions extends CombinedModelConstructorOptions<{ em: EditorModel }, DataSource> {}
export default class DataSource<DRProps extends DataRecordProps = DataRecordProps> extends Model<
  DataSourceType<DRProps>
> {
  transformers: DataSourceTransformers;

  /**
   * Returns the default properties for the data source.
   * These include an empty array of records and an empty object of transformers.
   *
   * @returns {Object} The default attributes for the data source.
   * @name defaults
   */
  defaults() {
    return {
      records: [],
      transformers: {},
    } as unknown as DataSourceType<DRProps>;
  }

  /**
   * Initializes a new instance of the `DataSource` class.
   * It sets up the transformers and initializes the collection of records.
   * If the `records` property is not an instance of `DataRecords`, it will be converted into one.
   *
   * @param {DataSourceProps<DRProps>} props - Properties to initialize the data source.
   * @param {DataSourceOptions} opts - Options to initialize the data source.
   * @name constructor
   */
  constructor(props: DataSourceProps<DRProps>, opts: DataSourceOptions) {
    super(
      {
        schema: {},
        ...props,
        records: [],
      } as unknown as DataSourceType<DRProps>,
      opts,
    );
    const { records, transformers } = props;
    this.transformers = transformers || ({} as DataSourceTransformers);

    if (!(records instanceof DataRecords)) {
      this.set({ records: new DataRecords(records!, { dataSource: this }) } as Partial<DataSourceType<DRProps>>);
    }

    this.listenTo(this.records, 'add', this.onAdd);
    this.listenTo(this.records, collectionEvents, this.handleChanges);
  }

  /**
   * Retrieves the collection of records associated with this data source.
   *
   * @returns {DataRecords<DRProps>} The collection of data records.
   * @name records
   */
  get records() {
    return this.attributes.records as NonNullable<DataRecords<DRProps>>;
  }

  /**
   * Retrieves the collection of records associated with this data source.
   *
   * @returns {DataRecords<DRProps>} The collection of data records.
   * @name records
   */
  get schema() {
    return this.attributes.schema!;
  }

  /**
   * Retrieves the editor model associated with this data source.
   *
   * @returns {EditorModel} The editor model.
   * @name em
   */
  get em() {
    return (this.collection as unknown as DataSources).em;
  }

  /**
   * Indicates if the data source has a provider for records.
   */
  get hasProvider() {
    return !!this.attributes.provider;
  }

  /**
   * Handles the `add` event for records in the data source.
   * This method triggers a change event on the newly added record.
   *
   * @param {DataRecord<DRProps>} dr - The data record that was added.
   * @private
   * @name onAdd
   */
  onAdd(dr: DataRecord<DRProps>) {
    dr.triggerChange();
  }

  /**
   * Adds a new record to the data source.
   *
   * @param {DRProps} record - The properties of the record to add.
   * @param {AddOptions} [opts] - Options to apply when adding the record.
   * @returns {DataRecord} The added data record.
   * @name addRecord
   */
  addRecord(record: DRProps, opts?: AddOptions) {
    return this.records.add(record, opts);
  }

  /**
   * Retrieves a record from the data source by its ID.
   *
   * @param {string | number} id - The ID of the record to retrieve.
   * @returns {DataRecord<DRProps> | undefined} The data record, or `undefined` if no record is found with the given ID.
   * @name getRecord
   */
  getRecord(id: string | number): DataRecord | undefined {
    return this.records.get(id);
  }

  /**
   * Retrieves all records from the data source.
   * Each record is processed with the `getRecord` method to apply any read transformers.
   *
   * @returns {Array<DataRecord<DRProps> | undefined>} An array of data records.
   * @name getRecords
   */
  getRecords() {
    return [...this.records.models].map((record) => this.getRecord(record.id)!);
  }

  /**
   * Retrieves all records from the data source with resolved relations based on the schema.
   */
  getResolvedRecords() {
    const schemaEntries = Object.entries(this.schema);
    const records = this.getRecords().map((record) => {
      const result = { ...record.attributes };

      if (schemaEntries.length === 0) return result;

      schemaEntries.forEach(([fieldName, schema]) => {
        const fieldSchema = schema as DataFieldSchemaRelation;
        if (fieldSchema?.type === DataFieldPrimitiveType.relation && fieldSchema.target) {
          const relationValue = result[fieldName];

          if (relationValue) {
            const targetDs = this.em.DataSources.get(fieldSchema.target);
            if (targetDs) {
              const targetRecords = targetDs.records;
              const targetField = fieldSchema.targetField || DEF_DATA_FIELD_ID;

              if (fieldSchema.isMany) {
                const relationValues = Array.isArray(relationValue) ? relationValue : [relationValue];
                const relatedRecords = targetRecords.filter((r) => relationValues.includes(r.attributes[targetField]));
                result[fieldName] = relatedRecords.map((r) => ({ ...r.attributes }));
              } else {
                const relatedRecord = targetDs.records.find((r) => r.attributes[targetField] === relationValue);

                if (relatedRecord) {
                  result[fieldName] = { ...relatedRecord.attributes };
                }
              }
            }
          }
        }
      });

      return result;
    });

    return records;
  }

  async loadProvider() {
    const { attributes, em } = this;
    const { provider } = attributes;

    if (!provider) return;

    if (isString(provider)) {
      // TODO: implement providers as plugins (later)
      return;
    }

    const providerGet = isString(provider.get) ? { url: provider.get } : provider.get;
    const { url, method, headers, body } = providerGet;

    const fetchProvider = async () => {
      const dataSource = this;

      try {
        em.trigger(em.DataSources.events.providerLoadBefore, { dataSource });

        const response = await fetch(url, { method, headers, body });
        if (!response.ok) throw new Error(await response.text());
        const result: DataSourceProviderResult = await response.json();

        if (result?.records) this.setRecords(result.records as any);
        if (result?.schema) this.upSchema(result.schema);

        em.trigger(em.DataSources.events.providerLoad, { result, dataSource });
      } catch (error: any) {
        em.logError(error.message);
        em.trigger(em.DataSources.events.providerLoadError, { dataSource, error });
      }
    };

    await fetchProvider();
  }

  /**
   * Removes a record from the data source by its ID.
   *
   * @param {string | number} id - The ID of the record to remove.
   * @param {RemoveOptions} [opts] - Options to apply when removing the record.
   * @returns {DataRecord<DRProps> | undefined} The removed data record, or `undefined` if no record is found with the given ID.
   * @name removeRecord
   */
  removeRecord(id: string | number, opts?: RemoveOptions) {
    const record = this.getRecord(id);
    if (record?.mutable === false && !opts?.dangerously) {
      throw new Error('Cannot remove immutable record');
    }

    return this.records.remove(id, opts);
  }

  /**
   * Replaces the existing records in the data source with a new set of records.
   *
   * @param {Array<DRProps>} records - An array of data record properties to set.
   * @returns {Array<DataRecord>} An array of the added data records.
   * @name setRecords
   */
  setRecords(records: DRProps[]) {
    this.records.reset([], { silent: true });

    records.forEach((record) => {
      this.records.add(record);
    });
  }

  /**
   * Update the schema.
   * @example
   * dataSource.upSchema({ name: { type: 'string' } });
   */
  upSchema(schema: Partial<typeof this.schema>, opts?: SetOptions) {
    this.set('schema', { ...this.schema, ...schema }, opts);
  }

  /**
   * Get schema field definition.
   * @example
   * const fieldSchema = dataSource.getSchemaField('name');
   * fieldSchema.type; // 'string'
   */
  getSchemaField(fieldKey: keyof DRProps) {
    return this.schema[fieldKey];
  }

  private handleChanges(dataRecord: any, c: any, o: any) {
    const options = o || c;
    this.em.changesUp(options, { dataRecord, options });
  }
}
```

--------------------------------------------------------------------------------

---[FILE: DataSources.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/DataSources.ts
Signals: TypeORM

```typescript
import { Collection } from '../../common';
import EditorModel from '../../editor/model/Editor';
import { DataRecordProps, DataSourceProps } from '../types';
import DataSource from './DataSource';

export default class DataSources extends Collection<DataSource> {
  em: EditorModel;

  constructor(models: DataSource[] | DataSourceProps<DataRecordProps>[], em: EditorModel) {
    super(models, em);
    this.em = em;

    // @ts-ignore We need to inject `em` for pages created on reset from the Storage load
    this.model = (props: DataSourceProps, opts = {}) => {
      return new DataSource(props, { ...opts, em });
    };
  }
}
```

--------------------------------------------------------------------------------

---[FILE: DataVariable.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/DataVariable.ts

```typescript
import { Model } from '../../common';
import EditorModel from '../../editor/model/Editor';
import { DataComponentTypes } from '../types';
import { isDataVariable } from '../utils';
import { DataCollectionState, DataCollectionStateMap, DataCollectionStateType } from './data_collection/types';

export const DataVariableType = DataComponentTypes.variable as const;

export interface DataVariableProps {
  type?: typeof DataVariableType;
  path?: string;
  defaultValue?: string;
  collectionId?: string;
  variableType?: DataCollectionStateType;
  asPlainText?: boolean;
}

interface DataVariableOptions {
  em: EditorModel;
  collectionsStateMap: DataCollectionStateMap;
}

export default class DataVariable extends Model<DataVariableProps> {
  private em: EditorModel;
  private collectionsStateMap: DataCollectionStateMap;

  defaults(): DataVariableProps {
    return {
      type: DataVariableType,
      defaultValue: '',
      path: '',
      collectionId: undefined,
      variableType: undefined,
      asPlainText: undefined,
    };
  }

  constructor(props: DataVariableProps, options: DataVariableOptions) {
    super(props, options);
    this.em = options.em;
    this.collectionsStateMap = options.collectionsStateMap;
  }

  get path(): string {
    return this.get('path') ?? '';
  }

  get defaultValue(): string {
    return this.get('defaultValue') ?? '';
  }

  get collectionId(): string | undefined {
    return this.get('collectionId');
  }

  get variableType(): DataCollectionStateType | undefined {
    return this.get('variableType');
  }

  resolvesFromCollection(): boolean {
    return !!this.collectionId;
  }

  updateCollectionsStateMap(collectionsStateMap: DataCollectionStateMap): void {
    this.collectionsStateMap = collectionsStateMap;
    this.trigger('change');
  }

  getResolverPath(): string | false {
    if (this.resolvesFromCollection()) {
      const value = this.resolveCollectionVariable();
      return isDataVariable(value) ? (value.path ?? '') : false;
    }
    return this.path;
  }

  toJSON(options?: any): DataVariableProps & { type: typeof DataVariableType } {
    const defaults = this.defaults();
    const json = super.toJSON(options);
    const filteredJson = Object.fromEntries(
      Object.entries(json).filter(([key, value]) => value !== defaults[key as keyof DataVariableProps]),
    ) as Partial<DataVariableProps>;
    return { ...filteredJson, type: DataVariableType };
  }

  getDataValue() {
    const opts = {
      em: this.em,
      collectionsStateMap: this.collectionsStateMap,
    };

    return DataVariable.resolveDataResolver(
      {
        path: this.path,
        defaultValue: this.defaultValue,
        collectionId: this.collectionId,
        variableType: this.variableType,
      },
      opts,
    );
  }

  static resolveDataSourceVariable(
    props: {
      path?: string;
      defaultValue?: string;
    },
    opts: {
      em: EditorModel;
    },
  ) {
    return opts.em.DataSources.getValue(props.path ?? '', props.defaultValue ?? '');
  }

  static resolveDataResolver(
    props: {
      path?: string;
      defaultValue?: string;
      collectionId?: string;
      variableType?: DataCollectionStateType;
    },
    opts: DataVariableOptions,
  ) {
    if (props.collectionId) {
      const value = DataVariable.resolveCollectionVariable(props, opts);
      if (!isDataVariable(value)) return value;
      return DataVariable.resolveDataSourceVariable(
        { path: value.path ?? '', defaultValue: props.defaultValue ?? '' },
        { em: opts.em },
      );
    }
    return DataVariable.resolveDataSourceVariable(
      { path: props.path ?? '', defaultValue: props.defaultValue ?? '' },
      { em: opts.em },
    );
  }

  private resolveCollectionVariable() {
    const { em, collectionsStateMap } = this;
    return DataVariable.resolveCollectionVariable(this.attributes, { em, collectionsStateMap });
  }

  static resolveCollectionVariable(
    params: {
      collectionId?: string;
      variableType?: DataCollectionStateType;
      path?: string;
      defaultValue?: string;
    },
    ctx: DataVariableOptions,
  ) {
    const { collectionId = '', variableType, path, defaultValue = '' } = params;
    const { collectionsStateMap, em } = ctx;
    const collectionItemState = collectionsStateMap?.[collectionId] as DataCollectionState | undefined;

    if (!collectionItemState || !variableType) return defaultValue;

    return em.DataSources.getValue(`${variableType}${path ? `.${path}` : ''}`, defaultValue, {
      context: collectionItemState,
    });
  }
}
```

--------------------------------------------------------------------------------

---[FILE: TraitDataVariable.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/TraitDataVariable.ts

```typescript
import DataVariable, { DataVariableProps } from './DataVariable';
import Trait from '../../trait_manager/model/Trait';
import { TraitProperties } from '../../trait_manager/types';

export interface TraitDataVariableProps extends Omit<TraitProperties, 'type'>, DataVariableProps {}

export default class TraitDataVariable extends DataVariable {
  trait?: Trait;

  constructor(props: TraitDataVariableProps, options: any) {
    super(props, options);
    this.trait = options.trait;
  }

  onDataSourceChange() {
    const newValue = this.getDataValue();
    this.trait?.setTargetValue(newValue);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentDataCondition.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/conditional_variables/ComponentDataCondition.ts

```typescript
import Component from '../../../dom_components/model/Component';
import {
  ComponentAddType,
  ComponentDefinitionDefined,
  ComponentOptions,
  ComponentProperties,
  ToHTMLOptions,
} from '../../../dom_components/model/types';
import { toLowerCase } from '../../../utils/mixins';
import { DataComponentTypes, DataResolver } from '../../types';
import { ComponentWithDataResolver } from '../ComponentWithDataResolver';
import { DataCollectionStateMap } from '../data_collection/types';
import { DataCondition, DataConditionProps, DataConditionType } from './DataCondition';
import { ConditionProps } from './DataConditionEvaluator';
import { StringOperation } from './operators/StringOperator';

export interface ComponentDataConditionProps extends ComponentProperties {
  type: DataComponentTypes.condition;
  dataResolver: DataConditionProps;
}

export default class ComponentDataCondition extends ComponentWithDataResolver<DataConditionProps> {
  get defaults(): ComponentDefinitionDefined {
    return {
      // @ts-ignore
      ...super.defaults,
      droppable: false,
      type: DataComponentTypes.condition,
      dataResolver: {
        condition: {
          left: '',
          operator: StringOperation.equalsIgnoreCase,
          right: '',
        },
      },
      components: [
        {
          type: DataComponentTypes.conditionTrue,
        },
        {
          type: DataComponentTypes.conditionFalse,
        },
      ],
    };
  }

  isTrue() {
    return this.dataResolver.isTrue();
  }

  getCondition() {
    return this.dataResolver.getCondition();
  }

  getIfTrueContent(): Component | undefined {
    return this.components().at(0);
  }

  getIfFalseContent(): Component | undefined {
    return this.components().at(1);
  }

  getOutputContent(): Component | undefined {
    return this.isTrue() ? this.getIfTrueContent() : this.getIfFalseContent();
  }

  setCondition(newCondition: ConditionProps) {
    this.dataResolver.setCondition(newCondition);
  }

  setIfTrueComponents(content: ComponentAddType) {
    this.setComponentsAtIndex(0, content);
  }

  setIfFalseComponents(content: ComponentAddType) {
    this.setComponentsAtIndex(1, content);
  }

  getInnerHTML(opts?: ToHTMLOptions): string {
    return this.getOutputContent()?.getInnerHTML(opts) ?? '';
  }

  protected createResolverInstance(
    props: DataConditionProps,
    options: ComponentOptions & { collectionsStateMap: DataCollectionStateMap },
  ): DataResolver {
    return new DataCondition(props, options);
  }

  private setComponentsAtIndex(index: number, newContent: ComponentAddType) {
    const component = this.components().at(index);
    component?.components(newContent);
  }

  static isComponent(el: HTMLElement) {
    return toLowerCase(el.tagName) === DataConditionType;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentDataOutput.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/conditional_variables/ComponentDataOutput.ts

```typescript
import Component from '../../../dom_components/model/Component';
import { ComponentDefinitionDefined } from '../../../dom_components/model/types';
import { toLowerCase } from '../../../utils/mixins';
import { isComponentDataOutputType } from '../../utils';

export default class ComponentDataOutput extends Component {
  get defaults(): ComponentDefinitionDefined {
    return {
      // @ts-ignore
      ...super.defaults,
      removable: false,
      draggable: false,
    };
  }

  static isComponent(el: HTMLElement) {
    return isComponentDataOutputType(toLowerCase(el.tagName));
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ConditionalOutputBase.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/conditional_variables/ConditionalOutputBase.ts

```typescript
import Component from '../../../dom_components/model/Component';
import { ComponentDefinitionDefined, ToHTMLOptions } from '../../../dom_components/model/types';
import { toLowerCase } from '../../../utils/mixins';
import { isComponentDataOutputType } from '../../utils';

export default class ConditionalOutputBase extends Component {
  get defaults(): ComponentDefinitionDefined {
    return {
      // @ts-ignore
      ...super.defaults,
      removable: false,
      draggable: false,
    };
  }

  static isComponent(el: HTMLElement) {
    return isComponentDataOutputType(toLowerCase(el.tagName));
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ConditionStatement.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/conditional_variables/ConditionStatement.ts

```typescript
import { SimpleOperator } from './operators/BaseOperator';
import { DataConditionSimpleOperation } from './types';

export class ConditionStatement {
  constructor(
    private leftValue: any,
    private operator: SimpleOperator<DataConditionSimpleOperation>,
    private rightValue: any,
  ) {}

  evaluate(): boolean {
    return this.operator.evaluate(this.leftValue, this.rightValue);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: DataCondition.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/conditional_variables/DataCondition.ts

```typescript
import { Model } from '../../../common';
import EditorModel from '../../../editor/model/Editor';
import { isDataVariable, valueOrResolve } from '../../utils';
import { DataCollectionStateMap } from '../data_collection/types';
import DataResolverListener from '../DataResolverListener';
import DataVariable, { DataVariableProps } from '../DataVariable';
import { ConditionProps, DataConditionEvaluator } from './DataConditionEvaluator';
import { BooleanOperation } from './operators/BooleanOperator';
import { StringOperation } from './operators/StringOperator';
import { DataConditionSimpleOperation } from './types';

export const DataConditionType = 'data-condition' as const;
export const DataConditionEvaluationChangedEvent = 'data-condition-evaluation-changed';
export const DataConditionOutputChangedEvent = 'data-condition-output-changed';

export interface ExpressionProps {
  left?: any;
  operator?: DataConditionSimpleOperation;
  right?: any;
}

export interface LogicGroupProps {
  logicalOperator: BooleanOperation;
  statements: ConditionProps[];
}

export interface DataConditionProps {
  type?: typeof DataConditionType;
  condition: ConditionProps;
  ifTrue?: any;
  ifFalse?: any;
}

type DataConditionOptions = {
  em: EditorModel;
  onValueChange?: () => void;
  collectionsStateMap?: DataCollectionStateMap;
};

export class DataCondition extends Model<DataConditionProps> {
  private em: EditorModel;
  private collectionsStateMap: DataCollectionStateMap = {};
  private resolverListeners: DataResolverListener[] = [];
  private _previousEvaluationResult: boolean | null = null;
  private _conditionEvaluator: DataConditionEvaluator;

  defaults() {
    return {
      type: DataConditionType,
      condition: {
        left: '',
        operator: StringOperation.equalsIgnoreCase,
        right: '',
      },
      ifTrue: {},
      ifFalse: {},
    };
  }

  constructor(props: DataConditionProps, opts: DataConditionOptions) {
    super(props, opts);
    this.em = opts.em;
    this.collectionsStateMap = opts.collectionsStateMap ?? {};

    const { condition = {} } = props;
    const instance = new DataConditionEvaluator({ condition }, { em: this.em });
    this._conditionEvaluator = instance;
    this.listenToDataVariables();
    this.listenToPropsChange();
  }

  getCondition(): ConditionProps {
    return this._conditionEvaluator.get('condition')!;
  }

  getIfTrue() {
    return this.get('ifTrue');
  }

  getIfFalse() {
    return this.get('ifFalse');
  }

  getOperations() {
    return this._conditionEvaluator.getOperations();
  }

  setCondition(condition: ConditionProps) {
    this.set('condition', condition);
    this._conditionEvaluator.set('condition', condition);
    this.trigger(DataConditionOutputChangedEvent, this.getDataValue());
  }

  setIfTrue(newIfTrue: any) {
    this.set('ifTrue', newIfTrue);
  }

  setIfFalse(newIfFalse: any) {
    this.set('ifFalse', newIfFalse);
  }

  isTrue(): boolean {
    return this._conditionEvaluator.evaluate();
  }

  getDataValue(skipResolve: boolean = false): any {
    const { em, collectionsStateMap } = this;
    const options = { em, collectionsStateMap };
    const ifTrue = this.getIfTrue();
    const ifFalse = this.getIfFalse();

    const isConditionTrue = this.isTrue();
    if (skipResolve) {
      return isConditionTrue ? ifTrue : ifFalse;
    }

    return isConditionTrue ? valueOrResolve(ifTrue, options) : valueOrResolve(ifFalse, options);
  }

  resolvesFromCollection() {
    return false;
  }

  updateCollectionsStateMap(collectionsStateMap: DataCollectionStateMap) {
    this.collectionsStateMap = collectionsStateMap;
    this._conditionEvaluator.updateCollectionStateMap(collectionsStateMap);
    this.listenToDataVariables();
    this.emitConditionEvaluationChange();
  }

  private listenToPropsChange() {
    this.on('change:condition', this.handleConditionChange.bind(this));
    this.on('change:condition change:ifTrue change:ifFalse', () => {
      this.listenToDataVariables();
    });
  }

  private handleConditionChange() {
    this.setCondition(this.get('condition')!);
  }

  private listenToDataVariables() {
    this.cleanupListeners();
    this.setupConditionDataVariableListeners();
    this.setupOutputDataVariableListeners();
  }

  private setupConditionDataVariableListeners() {
    this._conditionEvaluator.getDependentDataVariables().forEach((variable) => {
      this.addListener(variable, () => {
        this.emitConditionEvaluationChange();
      });
    });
  }

  private setupOutputDataVariableListeners() {
    const isConditionTrue = this.isTrue();
    this.setupOutputVariableListener(this.getIfTrue(), isConditionTrue);
    this.setupOutputVariableListener(this.getIfFalse(), !isConditionTrue);
  }

  private setupOutputVariableListener(outputVariable: any, isConditionTrue: boolean) {
    if (isDataVariable(outputVariable)) {
      this.addListener(outputVariable, () => {
        if (isConditionTrue) {
          this.trigger(DataConditionOutputChangedEvent, outputVariable);
        }
      });
    }
  }

  private addListener(variable: DataVariableProps, onUpdate: () => void) {
    const listener = new DataResolverListener({
      em: this.em,
      resolver: new DataVariable(variable, { em: this.em, collectionsStateMap: this.collectionsStateMap }),
      onUpdate,
    });

    this.resolverListeners.push(listener);
  }

  private emitConditionEvaluationChange() {
    const currentEvaluationResult = this.isTrue();
    if (this._previousEvaluationResult !== currentEvaluationResult) {
      this._previousEvaluationResult = currentEvaluationResult;
      this.trigger(DataConditionEvaluationChangedEvent, currentEvaluationResult);
      this.emitOutputValueChange();
    }
  }

  private emitOutputValueChange() {
    const currentOutputValue = this.getDataValue();
    this.trigger(DataConditionOutputChangedEvent, currentOutputValue);
  }

  private cleanupListeners() {
    this.resolverListeners.forEach((listener) => listener.destroy());
    this.resolverListeners = [];
  }

  toJSON(): DataConditionProps {
    const ifTrue = this.getIfTrue();
    const ifFalse = this.getIfFalse();

    return {
      type: DataConditionType,
      condition: this._conditionEvaluator.toJSON(),
      ifTrue,
      ifFalse,
    };
  }
}
```

--------------------------------------------------------------------------------

---[FILE: DataConditionEvaluator.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/conditional_variables/DataConditionEvaluator.ts

```typescript
import { DataVariableProps } from '../DataVariable';
import EditorModel from '../../../editor/model/Editor';
import { valueOrResolve, isDataVariable, getDataResolverInstanceValue } from '../../utils';
import { ExpressionProps, LogicGroupProps } from './DataCondition';
import { LogicalGroupEvaluator } from './LogicalGroupEvaluator';
import { SimpleOperator } from './operators/BaseOperator';
import { AnyTypeOperation, AnyTypeOperator } from './operators/AnyTypeOperator';
import { BooleanOperator } from './operators/BooleanOperator';
import { NumberOperator, NumberOperation } from './operators/NumberOperator';
import { StringOperator, StringOperation } from './operators/StringOperator';
import { Model } from '../../../common';
import { DataConditionSimpleOperation } from './types';
import { isBoolean } from 'underscore';
import { DataCollectionStateMap } from '../data_collection/types';

export type ConditionProps = ExpressionProps | LogicGroupProps | boolean;

interface DataConditionEvaluatorProps {
  condition: ConditionProps;
}

interface DataConditionEvaluatorOptions {
  em: EditorModel;
  collectionsStateMap?: DataCollectionStateMap;
}

export class DataConditionEvaluator extends Model<DataConditionEvaluatorProps> {
  private em: EditorModel;
  private collectionsStateMap: DataCollectionStateMap = {};

  constructor(props: DataConditionEvaluatorProps, opts: DataConditionEvaluatorOptions) {
    super(props);
    this.em = opts.em;
    this.collectionsStateMap = opts.collectionsStateMap ?? {};
  }

  evaluate(): boolean {
    const condition = this.get('condition');
    if (!condition || isBoolean(condition)) return !!condition;

    const resolvedOperator = this.getOperator();
    if (!resolvedOperator) return false;
    return resolvedOperator.evaluate(this.getResolvedLeftValue(), this.getResolvedRightValue());
  }

  getDependentDataVariables(): DataVariableProps[] {
    const condition = this.get('condition');
    if (!condition) return [];

    return this.extractDataVariables(condition);
  }

  getOperations() {
    const operator = this.getOperator();
    if (!operator || operator instanceof LogicalGroupEvaluator) return [];

    return operator.getOperations();
  }

  updateCollectionStateMap(collectionsStateMap: DataCollectionStateMap) {
    this.collectionsStateMap = collectionsStateMap;
  }

  private getOperator() {
    const opts = { em: this.em, collectionsStateMap: this.collectionsStateMap };
    const condition = this.get('condition');
    if (!condition || isBoolean(condition)) return;
    let resolvedOperator: SimpleOperator<DataConditionSimpleOperation> | LogicalGroupEvaluator | undefined;

    if (this.isLogicGroup(condition)) {
      const { logicalOperator, statements } = condition;
      const operator = new BooleanOperator(logicalOperator, opts);
      resolvedOperator = new LogicalGroupEvaluator(operator, statements, opts);
    }

    if (this.isExpression(condition)) {
      const { left, operator } = condition;
      const evaluatedLeft = valueOrResolve(left, opts);

      resolvedOperator = this.resolveOperator(evaluatedLeft, operator);
    }

    return resolvedOperator;
  }

  /**
   * Factory method for creating operators based on the data type.
   */
  private resolveOperator(
    left: any,
    operator: string | undefined,
  ): SimpleOperator<DataConditionSimpleOperation> | undefined {
    const em = this.em;

    if (this.isOperatorInEnum(operator, AnyTypeOperation)) {
      return new AnyTypeOperator(operator as AnyTypeOperation, { em });
    } else if (typeof left === 'number') {
      return new NumberOperator(operator as NumberOperation, { em });
    } else if (typeof left === 'string') {
      return new StringOperator(operator as StringOperation, { em });
    }

    return;
  }

  private extractDataVariables(condition: ConditionProps): DataVariableProps[] {
    const variables: DataVariableProps[] = [];

    if (this.isExpression(condition)) {
      if (isDataVariable(condition.left)) variables.push(condition.left);
      if (isDataVariable(condition.right)) variables.push(condition.right);
    } else if (this.isLogicGroup(condition)) {
      condition.statements.forEach((stmt) => variables.push(...this.extractDataVariables(stmt)));
    }

    return variables;
  }

  private isLogicGroup(condition: any): condition is LogicGroupProps {
    return condition && typeof condition.logicalOperator !== 'undefined' && Array.isArray(condition.statements);
  }

  private isExpression(condition: any): condition is ExpressionProps {
    return condition && typeof condition.left !== 'undefined' && typeof condition.operator === 'string';
  }

  private isOperatorInEnum(operator: string | undefined, enumObject: any): boolean {
    return Object.values(enumObject).includes(operator);
  }

  private resolveExpressionSide(property: 'left' | 'right'): any {
    const condition = this.get('condition');
    const { em, collectionsStateMap } = this;

    if (!condition || typeof condition === 'boolean') {
      return condition;
    }

    if (condition && typeof condition === 'object' && property in condition) {
      const value = (condition as ExpressionProps)[property];
      return valueOrResolve(value, { em, collectionsStateMap });
    }

    return undefined;
  }

  private getResolvedLeftValue(): any {
    return this.resolveExpressionSide('left');
  }

  private getResolvedRightValue(): any {
    return this.resolveExpressionSide('right');
  }

  toJSON(options?: any) {
    const condition = this.get('condition');
    if (typeof condition === 'object') {
      const json = JSON.parse(JSON.stringify(condition));
      return json;
    }

    return condition;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: LogicalGroupEvaluator.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/conditional_variables/LogicalGroupEvaluator.ts

```typescript
import EditorModel from '../../../editor/model/Editor';
import { DataCollectionStateMap } from '../data_collection/types';
import { DataConditionEvaluator, ConditionProps } from './DataConditionEvaluator';
import { BooleanOperator } from './operators/BooleanOperator';

export class LogicalGroupEvaluator {
  constructor(
    private operator: BooleanOperator,
    private statements: ConditionProps[],
    private opts: { em: EditorModel; collectionsStateMap: DataCollectionStateMap },
  ) {}

  evaluate(): boolean {
    const results = this.statements.map((statement) => {
      const condition = new DataConditionEvaluator({ condition: statement }, this.opts);
      return condition.evaluate();
    });

    return this.operator.evaluate(results);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: grapesjs-dev/packages/core/src/data_sources/model/conditional_variables/types.ts

```typescript
import { AnyTypeOperation } from './operators/AnyTypeOperator';
import { BooleanOperation } from './operators/BooleanOperator';
import { NumberOperation } from './operators/NumberOperator';
import { StringOperation } from './operators/StringOperator';

export type DataConditionSimpleOperation = AnyTypeOperation | StringOperation | NumberOperation | BooleanOperation;
export type DataConditionCompositeOperation = DataConditionSimpleOperation;
```

--------------------------------------------------------------------------------

````

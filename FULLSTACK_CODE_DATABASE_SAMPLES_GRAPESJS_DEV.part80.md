---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 80
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 80 of 97)

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

---[FILE: ConditionalTraits.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/model/conditional_variables/ConditionalTraits.ts

```typescript
import { DataSourceManager, Editor } from '../../../../../src';
import { DataConditionType } from '../../../../../src/data_sources/model/conditional_variables/DataCondition';
import { NumberOperation } from '../../../../../src/data_sources/model/conditional_variables/operators/NumberOperator';
import ComponentWrapper from '../../../../../src/dom_components/model/ComponentWrapper';
import EditorModel from '../../../../../src/editor/model/Editor';
import { setupTestEditor } from '../../../../common';

describe('conditional traits', () => {
  let editor: Editor;
  let em: EditorModel;
  let dsm: DataSourceManager;
  let cmpRoot: ComponentWrapper;

  beforeEach(() => {
    ({ editor, em, dsm, cmpRoot } = setupTestEditor());
  });

  afterEach(() => {
    em.destroy();
  });
  test('set component attribute to trait value if component has no value for the attribute', () => {
    const inputDataSource = {
      id: 'test-input',
      records: [{ id: 'id1', value: 'test-value' }],
    };
    dsm.add(inputDataSource);

    const cmp = cmpRoot.append({
      tagName: 'input',
      traits: [
        'name',
        {
          type: 'text',
          label: 'Value',
          name: 'value',
          value: {
            type: DataConditionType,
            condition: {
              left: 0,
              operator: NumberOperation.greaterThan,
              right: -1,
            },
            ifTrue: 'test-value',
          },
        },
      ],
    })[0];

    const input = cmp.getEl();
    expect(input?.getAttribute('value')).toBe('test-value');
    expect(cmp?.getAttributes().value).toBe('test-value');
  });

  test('set component prop to trait value if component has no value for the prop', () => {
    const inputDataSource = {
      id: 'test-input',
      records: [{ id: 'id1', value: 'test-value' }],
    };
    dsm.add(inputDataSource);

    const cmp = cmpRoot.append({
      tagName: 'input',
      traits: [
        'name',
        {
          type: 'text',
          label: 'Value',
          name: 'value',
          changeProp: true,
          value: {
            type: DataConditionType,
            condition: {
              left: 0,
              operator: NumberOperation.greaterThan,
              right: -1,
            },
            ifTrue: 'test-value',
          },
        },
      ],
    })[0];

    expect(cmp?.get('value')).toBe('test-value');
  });

  test('should keep component prop if component already has a value for the prop', () => {
    const inputDataSource = {
      id: 'test-input',
      records: [{ id: 'id1', value: 'test-value' }],
    };
    dsm.add(inputDataSource);

    const cmp = cmpRoot.append({
      tagName: 'input',
      attributes: {
        value: 'existing-value',
      },
      traits: [
        'name',
        {
          type: 'text',
          label: 'Value',
          name: 'value',
          changeProp: true,
          value: {
            type: DataConditionType,
            condition: {
              left: 0,
              operator: NumberOperation.greaterThan,
              right: -1,
            },
            ifTrue: 'existing-value',
          },
        },
      ],
    })[0];

    const input = cmp.getEl();
    expect(input?.getAttribute('value')).toBe('existing-value');
    expect(cmp?.getAttributes().value).toBe('existing-value');
  });

  test('should keep component prop if component already has a value for the prop', () => {
    const inputDataSource = {
      id: 'test-input',
      records: [{ id: 'id1', value: 'test-value' }],
    };
    dsm.add(inputDataSource);

    const cmp = cmpRoot.append({
      tagName: 'input',
      value: 'existing-value',
      traits: [
        'name',
        {
          type: 'text',
          label: 'Value',
          name: 'value',
          changeProp: true,
          value: {
            type: DataConditionType,
            condition: {
              left: 0,
              operator: NumberOperation.greaterThan,
              right: -1,
            },
            ifTrue: 'existing-value',
          },
        },
      ],
    })[0];
  });

  it('should handle objects as traits (other than dynamic values)', () => {
    const traitValue = {
      type: 'UNKNOWN_TYPE',
      condition: "This's not a condition",
      value: 'random value',
    };

    const component = cmpRoot.append({
      tagName: 'h1',
      type: 'text',
      traits: [
        {
          type: 'text',
          name: 'title',
          value: traitValue,
        },
      ],
    })[0];
    expect(component.getTrait('title').get('value')).toEqual(traitValue);
    expect(component.getAttributes().title).toEqual(traitValue);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: DataCondition.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/model/conditional_variables/DataCondition.ts
Signals: TypeORM

```typescript
import { DataSourceManager } from '../../../../../src';
import {
  DataCondition,
  ExpressionProps,
  LogicGroupProps,
} from '../../../../../src/data_sources/model/conditional_variables/DataCondition';
import { AnyTypeOperation } from '../../../../../src/data_sources/model/conditional_variables/operators/AnyTypeOperator';
import { BooleanOperation } from '../../../../../src/data_sources/model/conditional_variables/operators/BooleanOperator';
import { NumberOperation } from '../../../../../src/data_sources/model/conditional_variables/operators/NumberOperator';
import { StringOperation } from '../../../../../src/data_sources/model/conditional_variables/operators/StringOperator';
import { DataVariableType } from '../../../../../src/data_sources/model/DataVariable';
import Editor from '../../../../../src/editor/model/Editor';
import EditorModel from '../../../../../src/editor/model/Editor';

describe('DataCondition', () => {
  let em: EditorModel;
  let dsm: DataSourceManager;
  const dataSource = {
    id: 'USER_STATUS_SOURCE',
    records: [
      { id: 'USER_1', age: 25, status: 'active' },
      { id: 'USER_2', age: 12, status: 'inactive' },
    ],
  };

  beforeEach(() => {
    em = new Editor();
    dsm = em.DataSources;
    dsm.add(dataSource);
  });

  afterEach(() => {
    em.destroy();
  });

  describe('Basic Functionality Tests', () => {
    test('should evaluate a simple boolean condition', () => {
      const condition = true;
      const dataCondition = new DataCondition({ condition, ifTrue: 'Yes', ifFalse: 'No' }, { em });

      expect(dataCondition.getDataValue()).toBe('Yes');
    });

    test('should return ifFalse when condition evaluates to false', () => {
      const condition = false;
      const dataCondition = new DataCondition({ condition, ifTrue: 'Yes', ifFalse: 'No' }, { em });

      expect(dataCondition.getDataValue()).toBe('No');
    });

    test('should return raw ifTrue value when skipDynamicValueResolution is true and condition is true', () => {
      const condition = true;
      const ifTrue = { type: DataVariableType, path: 'USER_STATUS_SOURCE.USER_1.status' };
      const ifFalse = 'No';

      const dataCondition = new DataCondition({ condition, ifTrue, ifFalse }, { em });
      expect(dataCondition.getDataValue(true)).toEqual(ifTrue);
    });

    test('should return raw ifFalse value when skipDynamicValueResolution is true and condition is false', () => {
      const condition = false;
      const ifTrue = 'Yes';
      const ifFalse = { type: DataVariableType, path: 'USER_STATUS_SOURCE.USER_1.status' };

      const dataCondition = new DataCondition({ condition, ifTrue, ifFalse }, { em });
      expect(dataCondition.getDataValue(true)).toEqual(ifFalse);
    });
  });

  describe('Operator Tests', () => {
    test('should evaluate using GenericOperation operators', () => {
      const condition: ExpressionProps = { left: 5, operator: AnyTypeOperation.equals, right: 5 };
      const dataCondition = new DataCondition({ condition, ifTrue: 'Equal', ifFalse: 'Not Equal' }, { em });

      expect(dataCondition.getDataValue()).toBe('Equal');
    });

    test('equals (false)', () => {
      const condition: ExpressionProps = {
        left: 'hello',
        operator: AnyTypeOperation.equals,
        right: 'world',
      };
      const dataCondition = new DataCondition({ condition, ifTrue: 'true', ifFalse: 'false' }, { em });
      expect(dataCondition.isTrue()).toBe(false);
    });

    test('should evaluate using StringOperation operators', () => {
      const condition: ExpressionProps = { left: 'apple', operator: StringOperation.contains, right: 'app' };
      const dataCondition = new DataCondition({ condition, ifTrue: 'Contains', ifFalse: "Doesn't contain" }, { em });

      expect(dataCondition.getDataValue()).toBe('Contains');
    });

    test('should evaluate using NumberOperation operators', () => {
      const condition: ExpressionProps = { left: 10, operator: NumberOperation.lessThan, right: 15 };
      const dataCondition = new DataCondition({ condition, ifTrue: 'Valid', ifFalse: 'Invalid' }, { em });

      expect(dataCondition.getDataValue()).toBe('Valid');
    });

    test('should evaluate using LogicalOperation operators', () => {
      const logicGroup: LogicGroupProps = {
        logicalOperator: BooleanOperation.and,
        statements: [
          { left: true, operator: AnyTypeOperation.equals, right: true },
          { left: 5, operator: NumberOperation.greaterThan, right: 3 },
        ],
      };

      const dataCondition = new DataCondition({ condition: logicGroup, ifTrue: 'Pass', ifFalse: 'Fail' }, { em });
      expect(dataCondition.getDataValue()).toBe('Pass');
    });
  });

  describe('Edge Case Tests', () => {
    test('should evaluate complex nested conditions', () => {
      const nestedLogicGroup: LogicGroupProps = {
        logicalOperator: BooleanOperation.or,
        statements: [
          {
            logicalOperator: BooleanOperation.and,
            statements: [
              { left: 1, operator: NumberOperation.lessThan, right: 5 },
              { left: 'test', operator: AnyTypeOperation.equals, right: 'test' },
            ],
          },
          { left: 10, operator: NumberOperation.greaterThan, right: 100 },
        ],
      };

      const dataCondition = new DataCondition(
        { condition: nestedLogicGroup, ifTrue: 'Nested Pass', ifFalse: 'Nested Fail' },
        { em },
      );
      expect(dataCondition.getDataValue()).toBe('Nested Pass');
    });
  });

  describe('LogicalGroup Tests', () => {
    test('should correctly handle AND logical operator', () => {
      const logicGroup: LogicGroupProps = {
        logicalOperator: BooleanOperation.and,
        statements: [
          { left: true, operator: AnyTypeOperation.equals, right: true },
          { left: 5, operator: NumberOperation.greaterThan, right: 3 },
        ],
      };

      const dataCondition = new DataCondition(
        { condition: logicGroup, ifTrue: 'All true', ifFalse: 'One or more false' },
        { em },
      );
      expect(dataCondition.getDataValue()).toBe('All true');
    });

    test('should correctly handle OR logical operator', () => {
      const logicGroup: LogicGroupProps = {
        logicalOperator: BooleanOperation.or,
        statements: [
          { left: true, operator: AnyTypeOperation.equals, right: false },
          { left: 5, operator: NumberOperation.greaterThan, right: 3 },
        ],
      };

      const dataCondition = new DataCondition(
        { condition: logicGroup, ifTrue: 'At least one true', ifFalse: 'All false' },
        { em },
      );
      expect(dataCondition.getDataValue()).toBe('At least one true');
    });

    test('should correctly handle XOR logical operator', () => {
      const logicGroup: LogicGroupProps = {
        logicalOperator: BooleanOperation.xor,
        statements: [
          { left: true, operator: AnyTypeOperation.equals, right: true },
          { left: 5, operator: NumberOperation.lessThan, right: 3 },
          { left: false, operator: AnyTypeOperation.equals, right: true },
        ],
      };

      const dataCondition = new DataCondition(
        { condition: logicGroup, ifTrue: 'Exactly one true', ifFalse: 'Multiple true or all false' },
        { em },
      );
      expect(dataCondition.getDataValue()).toBe('Exactly one true');
    });

    test('should handle nested logical groups', () => {
      const logicGroup: LogicGroupProps = {
        logicalOperator: BooleanOperation.and,
        statements: [
          { left: true, operator: AnyTypeOperation.equals, right: true },
          {
            logicalOperator: BooleanOperation.or,
            statements: [
              { left: 5, operator: NumberOperation.greaterThan, right: 3 },
              { left: false, operator: AnyTypeOperation.equals, right: true },
            ],
          },
        ],
      };

      const dataCondition = new DataCondition(
        { condition: logicGroup, ifTrue: 'All true', ifFalse: 'One or more false' },
        { em },
      );
      expect(dataCondition.getDataValue()).toBe('All true');
    });

    test('should handle groups with false conditions', () => {
      const logicGroup: LogicGroupProps = {
        logicalOperator: BooleanOperation.and,
        statements: [
          { left: true, operator: AnyTypeOperation.equals, right: true },
          { left: false, operator: AnyTypeOperation.equals, right: true },
          { left: 5, operator: NumberOperation.greaterThan, right: 3 },
        ],
      };

      const dataCondition = new DataCondition(
        { condition: logicGroup, ifTrue: 'All true', ifFalse: 'One or more false' },
        { em },
      );
      expect(dataCondition.getDataValue()).toBe('One or more false');
    });
  });

  describe('Conditions with dataVariables', () => {
    test('should return "Yes" when dataVariable matches expected value', () => {
      const condition: ExpressionProps = {
        left: { type: DataVariableType, path: 'USER_STATUS_SOURCE.USER_1.status' },
        operator: AnyTypeOperation.equals,
        right: 'active',
      };

      const dataCondition = new DataCondition({ condition, ifTrue: 'Yes', ifFalse: 'No' }, { em });
      expect(dataCondition.getDataValue()).toBe('Yes');
    });

    test('should return "No" when dataVariable does not match expected value', () => {
      const condition: ExpressionProps = {
        left: { type: DataVariableType, path: 'USER_STATUS_SOURCE.USER_1.status' },
        operator: AnyTypeOperation.equals,
        right: 'inactive',
      };

      const dataCondition = new DataCondition({ condition, ifTrue: 'Yes', ifFalse: 'No' }, { em });
      expect(dataCondition.getDataValue()).toBe('No');
    });

    // TODO: unskip after adding UndefinedOperator
    test.skip('should handle missing data variable gracefully', () => {
      const condition: ExpressionProps = {
        left: { type: DataVariableType, path: 'USER_STATUS_SOURCE.not_a_user.status' },
        operator: AnyTypeOperation.isDefined,
        right: undefined,
      };

      const dataCondition = new DataCondition({ condition, ifTrue: 'Found', ifFalse: 'Not Found' }, { em });
      expect(dataCondition.getDataValue()).toBe('Not Found');
    });

    test('should correctly compare numeric values from dataVariables', () => {
      const condition: ExpressionProps = {
        left: { type: DataVariableType, path: 'USER_STATUS_SOURCE.USER_1.age' },
        operator: NumberOperation.greaterThan,
        right: 24,
      };
      const dataCondition = new DataCondition({ condition, ifTrue: 'Valid', ifFalse: 'Invalid' }, { em });
      expect(dataCondition.getDataValue()).toBe('Valid');
    });

    test('should evaluate logical operators with multiple data sources', () => {
      const dataSource2 = {
        id: 'SECOND_DATASOURCE_ID',
        records: [{ id: 'RECORD_2', status: 'active', age: 22 }],
      };
      dsm.add(dataSource2);

      const logicGroup: LogicGroupProps = {
        logicalOperator: BooleanOperation.and,
        statements: [
          {
            left: { type: DataVariableType, path: 'USER_STATUS_SOURCE.USER_1.status' },
            operator: AnyTypeOperation.equals,
            right: 'active',
          },
          {
            left: { type: DataVariableType, path: 'SECOND_DATASOURCE_ID.RECORD_2.age' },
            operator: NumberOperation.greaterThan,
            right: 18,
          },
        ],
      };

      const dataCondition = new DataCondition(
        { condition: logicGroup, ifTrue: 'All conditions met', ifFalse: 'Some conditions failed' },
        { em },
      );
      expect(dataCondition.getDataValue()).toBe('All conditions met');
    });

    test('should handle nested logical conditions with data variables', () => {
      const logicGroup: LogicGroupProps = {
        logicalOperator: BooleanOperation.or,
        statements: [
          {
            logicalOperator: BooleanOperation.and,
            statements: [
              {
                left: { type: DataVariableType, path: 'USER_STATUS_SOURCE.USER_2.status' },
                operator: AnyTypeOperation.equals,
                right: 'inactive',
              },
              {
                left: { type: DataVariableType, path: 'USER_STATUS_SOURCE.USER_2.age' },
                operator: NumberOperation.lessThan,
                right: 14,
              },
            ],
          },
          {
            left: { type: DataVariableType, path: 'USER_STATUS_SOURCE.USER_1.status' },
            operator: AnyTypeOperation.equals,
            right: 'inactive',
          },
        ],
      };

      const dataCondition = new DataCondition(
        { condition: logicGroup, ifTrue: 'Condition met', ifFalse: 'Condition failed' },
        { em },
      );
      expect(dataCondition.getDataValue()).toBe('Condition met');
    });

    test('should handle data variables as an ifTrue return value', () => {
      const dataCondition = new DataCondition(
        {
          condition: true,
          ifTrue: { type: DataVariableType, path: 'USER_STATUS_SOURCE.USER_1.status' },
          ifFalse: 'No',
        },
        { em },
      );
      expect(dataCondition.getDataValue()).toBe('active');
    });

    test('should handle data variables as an ifFalse return value', () => {
      const dataCondition = new DataCondition(
        {
          condition: false,
          ifTrue: 'Yes',
          ifFalse: { type: DataVariableType, path: 'USER_STATUS_SOURCE.USER_1.status' },
        },
        { em },
      );

      expect(dataCondition.getDataValue()).toBe('active');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: AnyTypeOperator.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/model/conditional_variables/operators/AnyTypeOperator.ts

```typescript
import {
  AnyTypeOperator,
  AnyTypeOperation,
} from '../../../../../../src/data_sources/model/conditional_variables/operators/AnyTypeOperator';
import Editor from '../../../../../../src/editor/model/Editor';
import EditorModel from '../../../../../../src/editor/model/Editor';

describe('GenericOperator', () => {
  let em: EditorModel;

  beforeEach(() => {
    em = new Editor();
  });

  afterEach(() => {
    em.destroy();
  });

  describe('Operator: equals', () => {
    test('should return true when values are equal', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.equals, { em });
      expect(operator.evaluate(5, 5)).toBe(true);
    });

    test('should return false when values are not equal', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.equals, { em });
      expect(operator.evaluate(5, 10)).toBe(false);
    });
  });

  describe('Operator: isTruthy', () => {
    test('should return true for truthy value', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isTruthy, { em });
      expect(operator.evaluate('non-empty', null)).toBe(true);
    });

    test('should return false for falsy value', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isTruthy, { em });
      expect(operator.evaluate('', null)).toBe(false);
    });
  });

  describe('Operator: isFalsy', () => {
    test('should return true for falsy value', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isFalsy, { em });
      expect(operator.evaluate(0, null)).toBe(true);
    });

    test('should return false for truthy value', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isFalsy, { em });
      expect(operator.evaluate(1, null)).toBe(false);
    });
  });

  describe('Operator: isDefined', () => {
    test('should return true for defined value', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isDefined, { em });
      expect(operator.evaluate(10, null)).toBe(true);
    });

    test('should return false for undefined value', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isDefined, { em });
      expect(operator.evaluate(undefined, null)).toBe(false);
    });
  });

  describe('Operator: isNull', () => {
    test('should return true for null value', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isNull, { em });
      expect(operator.evaluate(null, null)).toBe(true);
    });

    test('should return false for non-null value', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isNull, { em });
      expect(operator.evaluate(0, null)).toBe(false);
    });
  });

  describe('Operator: isUndefined', () => {
    test('should return true for undefined value', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isUndefined, { em });
      expect(operator.evaluate(undefined, null)).toBe(true);
    });

    test('should return false for defined value', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isUndefined, { em });
      expect(operator.evaluate(0, null)).toBe(false);
    });
  });

  describe('Operator: isArray', () => {
    test('should return true for array', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isArray, { em });
      expect(operator.evaluate([1, 2, 3], null)).toBe(true);
    });

    test('should return false for non-array', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isArray, { em });
      expect(operator.evaluate('not an array', null)).toBe(false);
    });
  });

  describe('Operator: isObject', () => {
    test('should return true for object', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isObject, { em });
      expect(operator.evaluate({ key: 'value' }, null)).toBe(true);
    });

    test('should return false for non-object', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isObject, { em });
      expect(operator.evaluate(42, null)).toBe(false);
    });
  });

  describe('Operator: isString', () => {
    test('should return true for string', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isString, { em });
      expect(operator.evaluate('Hello', null)).toBe(true);
    });

    test('should return false for non-string', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isString, { em });
      expect(operator.evaluate(42, null)).toBe(false);
    });
  });

  describe('Operator: isNumber', () => {
    test('should return true for number', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isNumber, { em });
      expect(operator.evaluate(42, null)).toBe(true);
    });

    test('should return false for non-number', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isNumber, { em });
      expect(operator.evaluate('not a number', null)).toBe(false);
    });
  });

  describe('Operator: isBoolean', () => {
    test('should return true for boolean', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isBoolean, { em });
      expect(operator.evaluate(true, null)).toBe(true);
    });

    test('should return false for non-boolean', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isBoolean, { em });
      expect(operator.evaluate(1, null)).toBe(false);
    });
  });

  describe('Edge Case Tests', () => {
    test('should handle null as input gracefully', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isNull, { em });
      expect(operator.evaluate(null, null)).toBe(true);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: BooleanOperator.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/model/conditional_variables/operators/BooleanOperator.ts

```typescript
import {
  BooleanOperator,
  BooleanOperation,
} from '../../../../../../src/data_sources/model/conditional_variables/operators/BooleanOperator';
import Editor from '../../../../../../src/editor/model/Editor';
import EditorModel from '../../../../../../src/editor/model/Editor';

describe('LogicalOperator', () => {
  let em: EditorModel;

  beforeEach(() => {
    em = new Editor();
  });

  afterEach(() => {
    em.destroy();
  });

  describe('Operator: and', () => {
    test('should return true when all statements are true', () => {
      const operator = new BooleanOperator(BooleanOperation.and, { em });
      expect(operator.evaluate([true, true, true])).toBe(true);
    });

    test('should return false when at least one statement is false', () => {
      const operator = new BooleanOperator(BooleanOperation.and, { em });
      expect(operator.evaluate([true, false, true])).toBe(false);
    });
  });

  describe('Operator: or', () => {
    test('should return true when at least one statement is true', () => {
      const operator = new BooleanOperator(BooleanOperation.or, { em });
      expect(operator.evaluate([false, true, false])).toBe(true);
    });

    test('should return false when all statements are false', () => {
      const operator = new BooleanOperator(BooleanOperation.or, { em });
      expect(operator.evaluate([false, false, false])).toBe(false);
    });
  });

  describe('Operator: xor', () => {
    test('should return true when exactly one statement is true', () => {
      const operator = new BooleanOperator(BooleanOperation.xor, { em });
      expect(operator.evaluate([true, false, false])).toBe(true);
    });

    test('should return false when more than one statement is true', () => {
      const operator = new BooleanOperator(BooleanOperation.xor, { em });
      expect(operator.evaluate([true, true, false])).toBe(false);
    });

    test('should return false when no statement is true', () => {
      const operator = new BooleanOperator(BooleanOperation.xor, { em });
      expect(operator.evaluate([false, false, false])).toBe(false);
    });
  });

  describe('Edge Case Tests', () => {
    test('should return false for xor with all false inputs', () => {
      const operator = new BooleanOperator(BooleanOperation.xor, { em });
      expect(operator.evaluate([false, false])).toBe(false);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: NumberOperator.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/model/conditional_variables/operators/NumberOperator.ts

```typescript
import {
  NumberOperator,
  NumberOperation,
} from '../../../../../../src/data_sources/model/conditional_variables/operators/NumberOperator';
import Editor from '../../../../../../src/editor/model/Editor';
import EditorModel from '../../../../../../src/editor/model/Editor';

describe('NumberOperator', () => {
  let em: EditorModel;

  beforeEach(() => {
    em = new Editor();
  });

  afterEach(() => {
    em.destroy();
  });

  describe('Operator: greaterThan', () => {
    test('should return true when left is greater than right', () => {
      const operator = new NumberOperator(NumberOperation.greaterThan, { em });
      expect(operator.evaluate(5, 3)).toBe(true);
    });

    test('should return false when left is not greater than right', () => {
      const operator = new NumberOperator(NumberOperation.greaterThan, { em });
      expect(operator.evaluate(2, 3)).toBe(false);
    });
  });

  describe('Operator: lessThan', () => {
    test('should return true when left is less than right', () => {
      const operator = new NumberOperator(NumberOperation.lessThan, { em });
      expect(operator.evaluate(2, 3)).toBe(true);
    });

    test('should return false when left is not less than right', () => {
      const operator = new NumberOperator(NumberOperation.lessThan, { em });
      expect(operator.evaluate(5, 3)).toBe(false);
    });
  });

  describe('Operator: greaterThanOrEqual', () => {
    test('should return true when left is greater than or equal to right', () => {
      const operator = new NumberOperator(NumberOperation.greaterThanOrEqual, { em });
      expect(operator.evaluate(3, 3)).toBe(true);
    });

    test('should return false when left is not greater than or equal to right', () => {
      const operator = new NumberOperator(NumberOperation.greaterThanOrEqual, { em });
      expect(operator.evaluate(2, 3)).toBe(false);
    });
  });

  describe('Operator: lessThanOrEqual', () => {
    test('should return true when left is less than or equal to right', () => {
      const operator = new NumberOperator(NumberOperation.lessThanOrEqual, { em });
      expect(operator.evaluate(3, 3)).toBe(true);
    });

    test('should return false when left is not less than or equal to right', () => {
      const operator = new NumberOperator(NumberOperation.lessThanOrEqual, { em });
      expect(operator.evaluate(5, 3)).toBe(false);
    });
  });

  describe('Operator: equals', () => {
    test('should return true when numbers are equal', () => {
      const operator = new NumberOperator(NumberOperation.equals, { em });
      expect(operator.evaluate(4, 4)).toBe(true);
    });

    test('should return false when numbers are not equal', () => {
      const operator = new NumberOperator(NumberOperation.equals, { em });
      expect(operator.evaluate(4, 5)).toBe(false);
    });
  });

  describe('Operator: notEquals', () => {
    test('should return true when numbers are not equal', () => {
      const operator = new NumberOperator(NumberOperation.notEquals, { em });
      expect(operator.evaluate(4, 5)).toBe(true);
    });

    test('should return false when numbers are equal', () => {
      const operator = new NumberOperator(NumberOperation.notEquals, { em });
      expect(operator.evaluate(4, 4)).toBe(false);
    });
  });

  describe('Edge Case Tests', () => {
    test('should handle boundary values correctly', () => {
      const operator = new NumberOperator(NumberOperation.lessThan, { em });
      expect(operator.evaluate(Number.MIN_VALUE, 1)).toBe(true);
    });

    test('should return false for NaN comparisons', () => {
      const operator = new NumberOperator(NumberOperation.equals, { em });
      expect(operator.evaluate(NaN, NaN)).toBe(false);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: StringOperator.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/model/conditional_variables/operators/StringOperator.ts

```typescript
import {
  StringOperator,
  StringOperation,
} from '../../../../../../src/data_sources/model/conditional_variables/operators/StringOperator';
import Editor from '../../../../../../src/editor/model/Editor';
import EditorModel from '../../../../../../src/editor/model/Editor';

describe('StringOperator', () => {
  let em: EditorModel;

  beforeEach(() => {
    em = new Editor();
  });

  afterEach(() => {
    em.destroy();
  });

  describe('Operator: contains', () => {
    test('should return true when left contains right', () => {
      const operator = new StringOperator(StringOperation.contains, { em });
      expect(operator.evaluate('hello world', 'world')).toBe(true);
    });

    test('should return false when left does not contain right', () => {
      const operator = new StringOperator(StringOperation.contains, { em });
      expect(operator.evaluate('hello world', 'moon')).toBe(false);
    });
  });

  describe('Operator: startsWith', () => {
    test('should return true when left starts with right', () => {
      const operator = new StringOperator(StringOperation.startsWith, { em });
      expect(operator.evaluate('hello world', 'hello')).toBe(true);
    });

    test('should return false when left does not start with right', () => {
      const operator = new StringOperator(StringOperation.startsWith, { em });
      expect(operator.evaluate('hello world', 'world')).toBe(false);
    });
  });

  describe('Operator: endsWith', () => {
    test('should return true when left ends with right', () => {
      const operator = new StringOperator(StringOperation.endsWith, { em });
      expect(operator.evaluate('hello world', 'world')).toBe(true);
    });

    test('should return false when left does not end with right', () => {
      const operator = new StringOperator(StringOperation.endsWith, { em });
      expect(operator.evaluate('hello world', 'hello')).toBe(false);
    });
  });

  describe('Operator: matchesRegex', () => {
    test('should return true when left matches the regex right', () => {
      const operator = new StringOperator(StringOperation.matchesRegex, { em });
      expect(operator.evaluate('hello world', '^hello')).toBe(true);
    });

    test('should return false when left does not match the regex right', () => {
      const operator = new StringOperator(StringOperation.matchesRegex, { em });
      expect(operator.evaluate('hello world', '^world')).toBe(false);
    });
  });

  describe('Operator: equalsIgnoreCase', () => {
    test('should return true when left equals right ignoring case', () => {
      const operator = new StringOperator(StringOperation.equalsIgnoreCase, { em });
      expect(operator.evaluate('Hello World', 'hello world')).toBe(true);
    });

    test('should return false when left does not equal right ignoring case', () => {
      const operator = new StringOperator(StringOperation.equalsIgnoreCase, { em });
      expect(operator.evaluate('Hello World', 'hello there')).toBe(false);
    });

    test('should handle empty strings correctly', () => {
      const operator = new StringOperator(StringOperation.equalsIgnoreCase, { em });
      expect(operator.evaluate('', '')).toBe(true);
      expect(operator.evaluate('Hello', '')).toBe(false);
      expect(operator.evaluate('', 'Hello')).toBe(false);
    });
  });

  describe('Operator: trimEquals', () => {
    test('should return true when left equals right after trimming', () => {
      const operator = new StringOperator(StringOperation.trimEquals, { em });
      expect(operator.evaluate('  Hello World  ', 'Hello World')).toBe(true);
    });

    test('should return false when left does not equal right after trimming', () => {
      const operator = new StringOperator(StringOperation.trimEquals, { em });
      expect(operator.evaluate('  Hello World  ', 'Hello there')).toBe(false);
    });

    test('should handle cases with only whitespace', () => {
      const operator = new StringOperator(StringOperation.trimEquals, { em });
      expect(operator.evaluate('   ', '')).toBe(true); // Both should trim to empty
      expect(operator.evaluate('   ', 'non-empty')).toBe(false);
    });
  });

  describe('Edge Case Tests', () => {
    test('should return false for contains with empty right string', () => {
      const operator = new StringOperator(StringOperation.contains, { em });
      expect(operator.evaluate('hello world', '')).toBe(true); // Empty string is included in any string
    });

    test('should return true for startsWith with empty right string', () => {
      const operator = new StringOperator(StringOperation.startsWith, { em });
      expect(operator.evaluate('hello world', '')).toBe(true); // Any string starts with an empty string
    });

    test('should return true for endsWith with empty right string', () => {
      const operator = new StringOperator(StringOperation.endsWith, { em });
      expect(operator.evaluate('hello world', '')).toBe(true); // Any string ends with an empty string
    });

    test('should throw error for invalid regex', () => {
      const operator = new StringOperator(StringOperation.matchesRegex, { em });
      expect(() => operator.evaluate('hello world', '[')).toThrow();
    });
  });
});
```

--------------------------------------------------------------------------------

````

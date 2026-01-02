---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 529
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 529 of 991)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - mlflow-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/mlflow-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: RunsChartsSectionHeader.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/sections/RunsChartsSectionHeader.tsx
Signals: React

```typescript
import {
  Button,
  DangerModal,
  DragIcon,
  DropdownMenu,
  Input,
  Modal,
  OverflowIcon,
  PencilIcon,
  useDesignSystemTheme,
} from '@databricks/design-system';
import type { ChartSectionConfig } from '../../../../types';
import { RunsChartsAddChartMenu } from '../RunsChartsAddChartMenu';
import type { RunsChartType } from '../../runs-charts.types';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDragAndDropElement } from '@mlflow/mlflow/src/common/hooks/useDragAndDropElement';
import { CheckIcon } from '@databricks/design-system';
import { METRIC_CHART_SECTION_HEADER_SIZE } from '../../../MetricChartsAccordion';
import cx from 'classnames';

export interface RunsChartsSectionHeaderProps {
  index: number;
  section: ChartSectionConfig;
  sectionChartsLength: number;
  addNewChartCard: (metricSectionId: string) => (type: RunsChartType) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddSection: (sectionId: string, above: boolean) => void;
  editSection: number;
  onSetEditSection: React.Dispatch<React.SetStateAction<number>>;
  onSetSectionName: (sectionId: string, name: string) => void;
  onSectionReorder: (sourceSectionId: string, targetSectionId: string) => void;
  isExpanded: boolean;
  supportedChartTypes?: RunsChartType[] | undefined;
  /**
   * Set to "true" to hide various controls (e.g. edit, add, delete) in the section header.
   */
  hideExtraControls: boolean;
}

export const RunsChartsSectionHeader = ({
  index,
  section,
  sectionChartsLength,
  addNewChartCard,
  onDeleteSection,
  onAddSection,
  editSection,
  onSetEditSection,
  onSetSectionName,
  onSectionReorder,
  isExpanded,
  hideExtraControls,
  supportedChartTypes,
}: RunsChartsSectionHeaderProps) => {
  const { theme } = useDesignSystemTheme();
  // Change name locally for better performance
  const [tmpSectionName, setTmpSectionName] = useState(section.name);
  // State to check if element is being dragged
  const [isDraggingHandle, setIsDraggingHandle] = useState(false);

  // Ref and state to measure the width of the section name
  const sectionNameRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const [sectionNameWidth, setSectionNameWidth] = useState(0.0);

  // Delete section modal
  const [isDeleteSectionModalOpen, setIsDeleteSectionModalOpen] = useState(false);

  const stopPropagation = (e: any) => {
    e.stopPropagation();
  };

  const deleteModalConfirm = () => {
    onDeleteSection(section.uuid);
  };

  const deleteModalCancel = () => {
    setIsDeleteSectionModalOpen(false);
  };

  const deleteSection = () => {
    setIsDeleteSectionModalOpen(true);
  };

  const addSectionAbove = () => {
    onAddSection(section.uuid, true);
  };

  const addSectionBelow = () => {
    onAddSection(section.uuid, false);
  };

  const onEdit = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onSetEditSection(index);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTmpSectionName(e.target.value);
  };

  const onSubmit = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!tmpSectionName.trim()) {
      e.preventDefault();
      return;
    }
    onSetEditSection(-1);
    onSetSectionName(section.uuid, tmpSectionName);
  };

  const onEsc = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onSetEditSection(-1);
      setTmpSectionName(section.name);
    }
  };

  const onBlur = (e: React.FocusEvent) => {
    if (e.relatedTarget === confirmButtonRef.current) {
      return;
    }
    onSetEditSection(-1);
    onSetSectionName(section.uuid, tmpSectionName);
  };

  useEffect(() => {
    if (!sectionNameRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      setSectionNameWidth(entry.contentRect.width);
    });

    resizeObserver.observe(sectionNameRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // For explicitness:
  const EDITABLE_LABEL_PADDING_WIDTH = 6;
  const EDITABLE_LABEL_BORDER_WIDTH = 1;
  const EDITABLE_LABEL_OFFSET = EDITABLE_LABEL_PADDING_WIDTH + EDITABLE_LABEL_BORDER_WIDTH;

  const isCurrentlyEdited = editSection === index;
  const [isCurrentlyHovered, setIsCurrentlyHovered] = useState(false);

  const { dragHandleRef, dragPreviewRef, dropTargetRef, isOver, isDragging } = useDragAndDropElement({
    dragGroupKey: 'sections',
    dragKey: section.uuid,
    onDrop: onSectionReorder,
  });

  return (
    <>
      <div
        role="figure"
        css={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: `${theme.spacing.xs}px 0px`,
          height: `${METRIC_CHART_SECTION_HEADER_SIZE}px`,
          '.section-element-visibility-on-hover': {
            visibility: isCurrentlyHovered ? 'visible' : 'hidden',
            opacity: isCurrentlyHovered ? 1 : 0,
          },
          '.section-element-visibility-on-hover-and-not-drag': {
            visibility: isCurrentlyHovered ? 'visible' : 'hidden',
            opacity: isCurrentlyHovered ? (isDraggingHandle ? 0 : 1) : 0,
          },
          '.section-element-hidden-on-edit': { display: isCurrentlyEdited ? 'none' : 'inherit' },
        }}
        onMouseMove={() => setIsCurrentlyHovered(true)}
        onMouseLeave={() => setIsCurrentlyHovered(false)}
        ref={(element) => {
          // Use this element for both drag preview and drop target
          dropTargetRef?.(element);
          dragPreviewRef?.(element);
        }}
        data-testid="experiment-view-compare-runs-section-header"
      >
        {isOver && (
          // Visual overlay for target drop element
          <div
            css={{
              position: 'absolute',
              inset: 0,
              backgroundColor: theme.isDarkMode ? theme.colors.blue800 : theme.colors.blue100,
              border: `2px dashed ${theme.colors.blue400}`,
              opacity: 0.75,
            }}
          />
        )}
        <div
          style={{
            maxWidth: '40%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            ref={sectionNameRef}
            style={{
              position: !isCurrentlyEdited ? 'relative' : 'absolute',
              visibility: !isCurrentlyEdited ? 'visible' : 'hidden',
              textOverflow: isCurrentlyEdited ? undefined : 'ellipsis',
              maxWidth: '100%',
              overflow: 'clip',
              paddingLeft: EDITABLE_LABEL_OFFSET,
              whiteSpace: 'pre',
            }}
          >
            {tmpSectionName}
          </div>
          {editSection === index && (
            <Input
              componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_sections_runschartssectionheader.tsx_220"
              autoFocus
              onClick={stopPropagation}
              onMouseDown={stopPropagation}
              onMouseUp={stopPropagation}
              onDoubleClick={stopPropagation}
              onChange={onChange}
              value={tmpSectionName}
              css={{
                color: theme.colors.textPrimary,
                fontWeight: 600,
                padding: `1px ${EDITABLE_LABEL_PADDING_WIDTH}px 1px ${EDITABLE_LABEL_PADDING_WIDTH}px`,
                background: theme.colors.backgroundSecondary,
                minWidth: '50px',
                width: sectionNameWidth + 2 * EDITABLE_LABEL_OFFSET,
                position: 'relative',
                lineHeight: theme.typography.lineHeightBase,
                maxWidth: '100%',
              }}
              onKeyDown={onEsc}
              onPressEnter={onSubmit}
              dangerouslyAppendEmotionCSS={{ '&&': { minHeight: '20px !important' } }}
              onBlur={onBlur}
            />
          )}
          <div
            css={{
              padding: theme.spacing.xs,
              position: 'relative',
            }}
            style={{
              visibility: !isCurrentlyEdited ? 'visible' : 'hidden',
              display: isCurrentlyEdited ? 'none' : 'inherit',
            }}
          >
            {`(${sectionChartsLength})`}
          </div>
          {!hideExtraControls && (
            <div className="section-element-visibility-on-hover-and-not-drag section-element-hidden-on-edit">
              <Button
                componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-compare_sections_runscomparesectionheader.tsx_246"
                onClick={onEdit}
                aria-label="Icon label"
                icon={<PencilIcon />}
              />
            </div>
          )}
        </div>
        {editSection === index && !hideExtraControls && (
          <div style={{ padding: `0 ${theme.spacing.xs}px` }}>
            <Button
              componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-compare_sections_runscomparesectionheader.tsx_251"
              onClick={onSubmit}
              icon={<CheckIcon />}
              ref={confirmButtonRef}
            />
          </div>
        )}
        {!hideExtraControls && (
          <div
            className="section-element-visibility-on-hover section-element-hidden-on-edit"
            css={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', cursor: 'grab' }}
          >
            <DragIcon
              rotate={90}
              style={{ color: theme.colors.textSecondary }}
              ref={dragHandleRef}
              onMouseDown={() => setIsDraggingHandle(true)}
              onMouseLeave={() => {
                setIsDraggingHandle(false);
              }}
              data-testid="experiment-view-compare-runs-section-header-drag-handle"
            />
          </div>
        )}
        {!hideExtraControls && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '0',
              transform: 'translate(0, -50%)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              onClick={stopPropagation}
              onMouseDown={stopPropagation}
              onMouseUp={stopPropagation}
              onDoubleClick={stopPropagation}
              className="section-element-visibility-on-hover-and-not-drag section-element-hidden-on-edit"
            >
              <DropdownMenu.Root modal={false}>
                <DropdownMenu.Trigger asChild>
                  <Button
                    componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-compare_sections_runscomparesectionheader.tsx_288"
                    icon={<OverflowIcon />}
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item
                    componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_sections_runschartssectionheader.tsx_321"
                    onClick={addSectionAbove}
                  >
                    <FormattedMessage
                      defaultMessage="Add section above"
                      description="Experiment page > compare runs > chart section > add section above label"
                    />
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_sections_runschartssectionheader.tsx_327"
                    onClick={addSectionBelow}
                  >
                    <FormattedMessage
                      defaultMessage="Add section below"
                      description="Experiment page > compare runs > chart section > add section below label"
                    />
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_sections_runschartssectionheader.tsx_333"
                    onClick={deleteSection}
                  >
                    <FormattedMessage
                      defaultMessage="Delete section"
                      description="Experiment page > compare runs > chart section > delete section label"
                    />
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
              <DangerModal
                componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_sections_runschartssectionheader.tsx_351"
                visible={isDeleteSectionModalOpen}
                onOk={deleteModalConfirm}
                onCancel={deleteModalCancel}
                title="Delete section"
              >
                <FormattedMessage
                  defaultMessage="Deleting the section will permanently remove it and the charts it contains. This cannot be undone."
                  description="Experiment page > compare runs > chart section > delete section warning message"
                />
              </DangerModal>
            </div>

            <div
              onClick={stopPropagation}
              onMouseDown={stopPropagation}
              onMouseUp={stopPropagation}
              onDoubleClick={stopPropagation}
              className={cx(
                {
                  'section-element-visibility-on-hover-and-not-drag': !isExpanded,
                },
                'section-element-hidden-on-edit',
              )}
              css={{
                alignSelf: 'flex-end',
                marginLeft: theme.spacing.xs,
              }}
            >
              <RunsChartsAddChartMenu
                onAddChart={addNewChartCard(section.uuid)}
                supportedChartTypes={supportedChartTypes}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: useChartExpressionParser.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/hooks/useChartExpressionParser.test.tsx

```typescript
/* eslint-disable no-template-curly-in-string */
// Disabled because of the following lint error: Unexpected template string expression

import { describe, it, expect } from '@jest/globals';
import { renderHook } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { useChartExpressionParser, parseVariablesAndReplaceWithIndex } from './useChartExpressionParser';

describe('parseVariablesAndReplaceWithIndex', () => {
  it('should handle variables in expression', () => {
    expect(parseVariablesAndReplaceWithIndex('${abcde12345} + 4')).toEqual({
      variables: ['abcde12345'],
      expression: '${0} + 4',
    });
    // Handles duplicates
    expect(parseVariablesAndReplaceWithIndex('${abcde12345} + 4 - -((${abcde12345}))')).toEqual({
      variables: ['abcde12345'],
      expression: '${0} + 4 - -((${0}))',
    });
    // Handles spacing
    expect(parseVariablesAndReplaceWithIndex('2 * -${a test 1234/this can be pretty log\t\n}')).toEqual({
      variables: ['a test 1234/this can be pretty log\t\n'],
      expression: '2 * -${0}',
    });

    // Many variables
    expect(
      parseVariablesAndReplaceWithIndex('${a} + ${b} * ${c} - ${d} / ${e} + ${f} + ${g} + ${h} + ${i} + ${k} + ${a}'),
    ).toEqual({
      variables: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k'],
      expression: '${0} + ${1} * ${2} - ${3} / ${4} + ${5} + ${6} + ${7} + ${8} + ${9} + ${0}',
    });

    // All special characters
    expect(
      parseVariablesAndReplaceWithIndex(
        '${This string may only contain alphanumerics, underscores (_), dashes (-), periods (.), spaces ( ), and slashes (/).}',
      ),
    ).toEqual({
      variables: [
        'This string may only contain alphanumerics, underscores (_), dashes (-), periods (.), spaces ( ), and slashes (/).',
      ],
      expression: '${0}',
    });

    expect(parseVariablesAndReplaceWithIndex('${}')).toEqual({ expression: '${}', variables: [] });
  });
});

describe('useChartExpressionParser', () => {
  const { result } = renderHook(() => useChartExpressionParser());
  const { compileExpression, evaluateExpression } = result.current;

  it('should handle variables in compilation', () => {
    expect(compileExpression('${x}+2', ['x'])).toEqual({ rpn: ['x', 2, '+'], variables: ['x'], expression: '${x}+2' });
    expect(compileExpression('1+${x}', ['x'])).toEqual({ rpn: [1, 'x', '+'], variables: ['x'], expression: '1+${x}' });
    expect(compileExpression('${x}-2', ['x'])).toEqual({ rpn: ['x', 2, '-'], variables: ['x'], expression: '${x}-2' });
  });

  it('should handle multiple variables in compilation', () => {
    expect(compileExpression('${x}+${y}', ['x', 'y'])).toEqual({
      rpn: ['x', 'y', '+'],
      variables: ['x', 'y'],
      expression: '${x}+${y}',
    });
    expect(compileExpression('${x}-${y}', ['x', 'y'])).toEqual({
      rpn: ['x', 'y', '-'],
      variables: ['x', 'y'],
      expression: '${x}-${y}',
    });
    expect(compileExpression('${x}*${y}', ['x', 'y'])).toEqual({
      rpn: ['x', 'y', '*'],
      variables: ['x', 'y'],
      expression: '${x}*${y}',
    });
    expect(compileExpression('${x}/${y}', ['x', 'y'])).toEqual({
      rpn: ['x', 'y', '/'],
      variables: ['x', 'y'],
      expression: '${x}/${y}',
    });
    expect(compileExpression('${x}^${y}', ['x', 'y'])).toEqual({
      rpn: ['x', 'y', '^'],
      variables: ['x', 'y'],
      expression: '${x}^${y}',
    });
  });

  it('should handle multiple variables in complex functions', () => {
    expect(compileExpression('${x}+${y}*${z}', ['x', 'y', 'z'])).toEqual({
      rpn: ['x', 'y', 'z', '*', '+'],
      variables: ['x', 'y', 'z'],
      expression: '${x}+${y}*${z}',
    });
    expect(compileExpression('${x}*${y}+${z}', ['x', 'y', 'z'])).toEqual({
      rpn: ['x', 'y', '*', 'z', '+'],
      variables: ['x', 'y', 'z'],
      expression: '${x}*${y}+${z}',
    });
    expect(compileExpression('${x}+${y}^${z}', ['x', 'y', 'z'])).toEqual({
      rpn: ['x', 'y', 'z', '^', '+'],
      variables: ['x', 'y', 'z'],
      expression: '${x}+${y}^${z}',
    });
    expect(compileExpression('${x}^${y}+${z}', ['x', 'y', 'z'])).toEqual({
      rpn: ['x', 'y', '^', 'z', '+'],
      variables: ['x', 'y', 'z'],
      expression: '${x}^${y}+${z}',
    });
    expect(compileExpression('${x}*${y}^${z}', ['x', 'y', 'z'])).toEqual({
      rpn: ['x', 'y', 'z', '^', '*'],
      variables: ['x', 'y', 'z'],
      expression: '${x}*${y}^${z}',
    });
    expect(compileExpression('${x}^${y}*${z}', ['x', 'y', 'z'])).toEqual({
      rpn: ['x', 'y', '^', 'z', '*'],
      variables: ['x', 'y', 'z'],
      expression: '${x}^${y}*${z}',
    });

    // With Parenthesis
    expect(compileExpression('(${x}+${y})*${z}', ['x', 'y', 'z'])).toEqual({
      rpn: ['x', 'y', '+', 'z', '*'],
      variables: ['x', 'y', 'z'],
      expression: '(${x}+${y})*${z}',
    });
    expect(compileExpression('${x}+(${y}*${z})', ['x', 'y', 'z'])).toEqual({
      rpn: ['x', 'y', 'z', '*', '+'],
      variables: ['x', 'y', 'z'],
      expression: '${x}+(${y}*${z})',
    });
    expect(compileExpression('(${x}+${y})*${z}', ['x', 'y', 'z'])).toEqual({
      rpn: ['x', 'y', '+', 'z', '*'],
      variables: ['x', 'y', 'z'],
      expression: '(${x}+${y})*${z}',
    });

    // With negative variable values
    expect(compileExpression('${x}+-${y}', ['x', 'y'])).toEqual({
      rpn: ['x', 'y', '_', '+'],
      variables: ['x', 'y'],
      expression: '${x}+-${y}',
    });
    expect(compileExpression('${x}--${y}', ['x', 'y'])).toEqual({
      rpn: ['x', 'y', '_', '-'],
      variables: ['x', 'y'],
      expression: '${x}--${y}',
    });

    // With floating point values and negative variables
    expect(
      compileExpression('${abcde#12349!o++++----////*^} + ${text} * 0.2', ['abcde#12349!o++++----////*^', 'text']),
    ).toEqual({
      rpn: ['abcde#12349!o++++----////*^', 'text', 0.2, '*', '+'],
      variables: ['abcde#12349!o++++----////*^', 'text'],
      expression: '${abcde#12349!o++++----////*^} + ${text} * 0.2',
    });
  });

  it('should handle invalid expressions', () => {
    // Invalid variables
    expect(compileExpression('${x}+${y}', ['x'])).toEqual(undefined);
    expect(compileExpression('${x}+${y}', ['y'])).toEqual(undefined);

    // Invalid evaluation
    expect(compileExpression('*', [])).toEqual(undefined);
    expect(compileExpression('-', [])).toEqual(undefined);
    expect(compileExpression('/', [])).toEqual(undefined);
    expect(compileExpression('^', [])).toEqual(undefined);
    expect(compileExpression('+', [])).toEqual(undefined);
    expect(compileExpression('(', [])).toEqual(undefined);
    expect(compileExpression(')', [])).toEqual(undefined);
    expect(compileExpression('${', [])).toEqual(undefined);
    expect(compileExpression('${}', [])).toEqual(undefined);
    expect(compileExpression('${}+2', [])).toEqual(undefined);
    expect(compileExpression('*1', [])).toEqual(undefined);
    expect(compileExpression('1*', [])).toEqual(undefined);
    expect(compileExpression('1+', [])).toEqual(undefined);
    expect(compileExpression('1+', [])).toEqual(undefined);
    expect(compileExpression('1-', [])).toEqual(undefined);
    expect(compileExpression('1/', [])).toEqual(undefined);
    expect(compileExpression('/1', [])).toEqual(undefined);
    expect(compileExpression('1^', [])).toEqual(undefined);
    expect(compileExpression('^1', [])).toEqual(undefined);
    expect(compileExpression('1(', [])).toEqual(undefined);
    expect(compileExpression(')1', [])).toEqual(undefined);
    expect(compileExpression('1)', [])).toEqual(undefined);

    // Invalid evaluation with parenthesis
    expect(compileExpression('(', [])).toEqual(undefined);
    expect(compileExpression(')', [])).toEqual(undefined);
    expect(compileExpression('()', [])).toEqual(undefined);
    expect(compileExpression('1+(', [])).toEqual(undefined);
    expect(compileExpression('1+)', [])).toEqual(undefined);
    expect(compileExpression('1+(1', [])).toEqual(undefined);
    expect(compileExpression('1+1)', [])).toEqual(undefined);
    expect(compileExpression('123 - (', [])).toEqual(undefined);
    expect(compileExpression('123 - ()', [])).toEqual(undefined);
    expect(compileExpression('123 - (-)', [])).toEqual(undefined);
  });

  const parseExpression = (expr: string) => {
    return evaluateExpression(compileExpression(expr, []), {});
  };

  it('should parse simple expressions', () => {
    expect(parseExpression('1+2')).toBe(3);
    expect(parseExpression('1-2')).toBe(-1);
    expect(parseExpression('1*2')).toBe(2);
    expect(parseExpression('1/2')).toBe(0.5);
    expect(parseExpression('1^2')).toBe(1);
  });

  it('should parse complex expressions', () => {
    expect(parseExpression('1+2*3')).toBe(7);
    expect(parseExpression('1*2+3')).toBe(5);
    expect(parseExpression('1+2^3')).toBe(9);
    expect(parseExpression('1^2+3')).toBe(4);
    expect(parseExpression('1*2^3')).toBe(8);
    expect(parseExpression('1^2*3')).toBe(3);
  });

  it('should handle parenthesis', () => {
    expect(parseExpression('(1+2)*3')).toBe(9);
    expect(parseExpression('1*(2+3)')).toBe(5);
    expect(parseExpression('(1+2)^3')).toBe(27);
    expect(parseExpression('1^(2+3)')).toBe(1);
    expect(parseExpression('1*(2^3)')).toBe(8);
    expect(parseExpression('1^(2*3)')).toBe(1);
  });

  it('should handle nested parenthesis', () => {
    expect(parseExpression('(1+(2*3))')).toBe(7);
    expect(parseExpression('((1+2)*3)')).toBe(9);
    expect(parseExpression('(1+(2^3))')).toBe(9);
    expect(parseExpression('(1^(2+3))')).toBe(1);
    expect(parseExpression('(1*(2^3))')).toBe(8);
    expect(parseExpression('(1^(2*3))')).toBe(1);
  });

  it('should handle complex nested parenthesis', () => {
    expect(parseExpression('((1+2)*3+(4/2))^2')).toBe(121);
    expect(parseExpression('((1+2)^3+(4/2))^2')).toBe(841);
    expect(parseExpression('((1+2)^(3+(4/2)))^2')).toBe(59049);
  });

  it('should handle whitespace', () => {
    expect(parseExpression(' 1 + 2 ')).toBe(3);
    expect(parseExpression('1 + 2 ')).toBe(3);
    expect(parseExpression(' 1 + 2')).toBe(3);
  });

  it('should handle invalid expressions (2)', () => {
    expect(parseExpression('1+')).toBe(undefined);
    expect(parseExpression('1+2+')).toBe(undefined);
    expect(parseExpression('1+2+3+')).toBe(undefined);
    expect(parseExpression('1+2+3+4+')).toBe(undefined);
    expect(parseExpression('1.1.1 + 2')).toBe(undefined);
    expect(parseExpression('1 + 2.2.2')).toBe(undefined);
    expect(parseExpression('1***2')).toBe(undefined);
    // Tests for unsupported operations or syntax
    expect(parseExpression('hello + 2')).toBe(undefined);
    expect(parseExpression('3 + world')).toBe(undefined);
    expect(parseExpression('1 + (2')).toBe(undefined);
    expect(parseExpression('1 + 2)')).toBe(undefined);
    expect(parseExpression('((1+2)')).toBe(undefined);
    expect(parseExpression('(1+2))')).toBe(undefined);

    // Tests for empty input and spaces only
    expect(parseExpression('')).toBe(undefined);
    expect(parseExpression('   ')).toBe(undefined);

    // Test for numbers combined with alphabets without operators
    expect(parseExpression('1a2')).toBe(undefined);
    expect(parseExpression('2b + 3')).toBe(undefined);

    // Test for invalid use of function names or similar characters
    expect(parseExpression('sin(30)')).toBe(undefined);
    expect(parseExpression('Math.max(10, 20)')).toBe(undefined);

    // Tests for incorrect use of parentheses and operators
    expect(parseExpression('1 + (2 * 3')).toBe(undefined);
    expect(parseExpression('(1 + 2 * 3))')).toBe(undefined);
    expect(parseExpression(')1 + 2(')).toBe(undefined);
    expect(parseExpression('1 + (2 + 3)) * 4')).toBe(undefined);

    // Tests for invalid operator combinations
    expect(parseExpression('1 + * 2')).toBe(undefined);
    expect(parseExpression('/ 2 + 3')).toBe(undefined);
    expect(parseExpression('1 **/ 2')).toBe(undefined);
    expect(parseExpression('1 $$ 2')).toBe(undefined);

    // Tests involving alphanumeric combinations
    expect(parseExpression('abc123 + 3')).toBe(undefined);
    expect(parseExpression('123xyz * 3')).toBe(undefined);
    expect(parseExpression('1_2 + 3')).toBe(undefined);

    // Tests with unexpected special characters
    expect(parseExpression('1 + 2 # 3')).toBe(undefined);
    expect(parseExpression('1 % 2')).toBe(undefined);
    expect(parseExpression('1 + 2@3')).toBe(undefined);
    expect(parseExpression('1 + !2')).toBe(undefined);

    // Test with leading and multiple operators
    expect(parseExpression('1 ** -+ 2')).toBe(undefined);

    // Tests for complex malformed expressions
    expect(parseExpression('(3 + 5)(2 + 2)')).toBe(undefined);
    expect(parseExpression('1 + {2*3}')).toBe(undefined);
  });

  it('should handle invalid parenthesis expressions', () => {
    expect(parseExpression('1+(2*3')).toBe(undefined);
    expect(parseExpression('(1+(2*3')).toBe(undefined);
    expect(parseExpression('((1+(2*3)')).toBe(undefined);
    expect(parseExpression('((1+(2*3))')).toBe(undefined);
    expect(parseExpression('()')).toBe(undefined);
    expect(parseExpression('(1+*)')).toBe(undefined);
  });

  it('should handle infinite and negative infinity', () => {
    expect(parseExpression('1/0')).toBe(Infinity);
    expect(parseExpression('1/((4 + 5)^0 - 1)')).toBe(Infinity);
    expect(parseExpression('-1/((4 + 5)^0 - 1)')).toBe(-Infinity);
    expect(parseExpression('1/-0')).toBe(-Infinity);
  });

  it('should handle negative numbers', () => {
    expect(parseExpression('-1+2')).toBe(1);
    expect(parseExpression('1+-2')).toBe(-1);
    expect(parseExpression('1+(-2)')).toBe(-1);
    expect(parseExpression('1-(-2)')).toBe(3);
    expect(parseExpression('1 + -2')).toBe(-1);
    expect(parseExpression('1--2')).toBe(3);
    expect(parseExpression('1---2')).toBe(-1);
    expect(parseExpression('1+--2')).toBe(3);
    expect(parseExpression('1+-(-2+-1)')).toBe(4);
    expect(parseExpression('1 + 2 * -3 / (4 - -5)')).toBeCloseTo(0.3333333);
    expect(parseExpression('-1 * (2 + 3) / 4')).toBe(-1.25);
    expect(parseExpression('(-1 + 2) * -3 / 4')).toBe(-0.75);
    expect(parseExpression('1 + -2 * 3 / (4 - -5)')).toBeCloseTo(0.3333333);
    expect(parseExpression('(-1 + 2) * (3 - 4 / 5)')).toBe(2.2);
    expect(parseExpression('1 + (2 + 3 * -4) / 5')).toBe(-1);
    expect(parseExpression('(-1 + 2 * 3) / (4 - -5)')).toBeCloseTo(0.555555);
    expect(parseExpression('-(2) + 3')).toBe(1);
    expect(parseExpression('5 * -3 + 2')).toBe(-13);
  });

  it('should handle positive numbers', () => {
    expect(parseExpression('1 ++2')).toBe(3);
  });

  it('should handle floating point numbers', () => {
    expect(parseExpression('1.1+2.2')).toBeCloseTo(3.3);
    expect(parseExpression('1.1-2.2')).toBeCloseTo(-1.1);
    expect(parseExpression('1.1*2.2')).toBeCloseTo(2.42);
    expect(parseExpression('1.1/2.2')).toBeCloseTo(0.5);
    expect(parseExpression('1.1^2.2')).toBeCloseTo(1.233);
  });

  it('should handle negative floating point numbers', () => {
    expect(parseExpression('-1.1+2.2')).toBeCloseTo(1.1);
    expect(parseExpression('1.1+-2.2')).toBeCloseTo(-1.1);
    expect(parseExpression('1.1+(-2.2)')).toBeCloseTo(-1.1);
    expect(parseExpression('1.1-(-2.2)')).toBeCloseTo(3.3);
  });
});
```

--------------------------------------------------------------------------------

````

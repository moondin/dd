---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 95
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 95 of 97)

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

---[FILE: PropertyFactory.ts]---
Location: grapesjs-dev/packages/core/test/specs/style_manager/model/PropertyFactory.ts

```typescript
import PropertyFactory from '../../../../src/style_manager/model/PropertyFactory';

describe('PropertyFactory', () => {
  let obj: PropertyFactory;

  beforeEach(() => {
    obj = new PropertyFactory();
  });

  test('Object exists', () => {
    expect(obj).toBeTruthy();
  });

  test('Build single prop', () => {
    expect(obj.build('float')).toEqual([
      {
        property: 'float',
        type: 'radio',
        default: 'none',
        options: [{ id: 'none' }, { id: 'left' }, { id: 'right' }],
      },
    ]);
  });

  test('Build display', () => {
    expect(obj.build('display')).toEqual([
      {
        property: 'display',
        type: 'select',
        default: 'block',
        options: [{ id: 'block' }, { id: 'inline' }, { id: 'inline-block' }, { id: 'flex' }, { id: 'none' }],
      },
    ]);
  });

  test('Build flex-direction', () => {
    expect(obj.build('flex-direction')).toEqual([
      {
        property: 'flex-direction',
        type: 'select',
        default: 'row',
        options: [{ id: 'row' }, { id: 'row-reverse' }, { id: 'column' }, { id: 'column-reverse' }],
        requires: { display: ['flex'] },
      },
    ]);
  });

  test('Build flex-wrap', () => {
    expect(obj.build('flex-wrap')).toEqual([
      {
        property: 'flex-wrap',
        type: 'select',
        default: 'nowrap',
        options: [{ id: 'nowrap' }, { id: 'wrap' }, { id: 'wrap-reverse' }],
        requires: { display: ['flex'] },
      },
    ]);
  });

  test('Build justify-content', () => {
    expect(obj.build('justify-content')).toEqual([
      {
        property: 'justify-content',
        type: 'select',
        default: 'flex-start',
        options: [
          { id: 'flex-start' },
          { id: 'flex-end' },
          { id: 'center' },
          { id: 'space-between' },
          { id: 'space-around' },
          { id: 'space-evenly' },
        ],
        requires: { display: ['flex'] },
      },
    ]);
  });

  test('Build align-items', () => {
    expect(obj.build('align-items')).toEqual([
      {
        property: 'align-items',
        type: 'select',
        default: 'stretch',
        options: [{ id: 'flex-start' }, { id: 'flex-end' }, { id: 'center' }, { id: 'baseline' }, { id: 'stretch' }],
        requires: { display: ['flex'] },
      },
    ]);
  });

  test('Build align-content', () => {
    expect(obj.build('align-content')).toEqual([
      {
        property: 'align-content',
        type: 'select',
        default: 'stretch',
        options: [
          { id: 'flex-start' },
          { id: 'flex-end' },
          { id: 'center' },
          { id: 'space-between' },
          { id: 'space-around' },
          { id: 'stretch' },
        ],
        requires: { display: ['flex'] },
      },
    ]);
  });

  test('Build align-self', () => {
    expect(obj.build('align-self')).toEqual([
      {
        property: 'align-self',
        type: 'select',
        default: 'auto',
        options: [
          { id: 'auto' },
          { id: 'flex-start' },
          { id: 'flex-end' },
          { id: 'center' },
          { id: 'baseline' },
          { id: 'stretch' },
        ],
        requiresParent: { display: ['flex'] },
      },
    ]);
  });

  test('Build position', () => {
    expect(obj.build('position')).toEqual([
      {
        property: 'position',
        type: 'radio',
        default: 'static',
        options: [{ id: 'static' }, { id: 'relative' }, { id: 'absolute' }, { id: 'fixed' }],
      },
    ]);
  });

  test('Build left, right', () => {
    const res = {
      type: 'number',
      units: obj.unitsSize,
      default: 'auto',
      property: 'right',
      fixedValues: ['initial', 'inherit', 'auto'],
    };
    expect(obj.build('right')).toEqual([res]);
    res.property = 'left';
    expect(obj.build('left')).toEqual([res]);
  });

  test('Build top, bottom', () => {
    const res = {
      type: 'number',
      units: obj.unitsSize,
      default: 'auto',
      property: 'top',
      fixedValues: ['initial', 'inherit', 'auto'],
    };
    expect(obj.build('top')).toEqual([res]);
    res.property = 'bottom';
    expect(obj.build('bottom')).toEqual([res]);
  });

  test('Build width family', () => {
    const res = {
      type: 'number',
      units: obj.unitsSize,
      default: 'auto',
      property: 'width',
      fixedValues: ['initial', 'inherit', 'auto'],
      min: 0,
    };
    expect(obj.build('width')).toEqual([res]);
    res.property = 'min-width';
    expect(obj.build('min-width')).toEqual([res]);
    res.property = 'max-width';
    expect(obj.build('max-width')).toEqual([res]);
  });

  test('Build flex-basis', () => {
    const res = {
      type: 'number',
      units: obj.unitsSize,
      default: 'auto',
      fixedValues: ['initial', 'inherit', 'auto'],
      requiresParent: { display: ['flex'] },
      min: 0,
      property: 'flex-basis',
    };
    expect(obj.build('flex-basis')).toEqual([res]);
  });

  test('Build height family', () => {
    const res = {
      type: 'number',
      units: obj.unitsSize,
      default: 'auto',
      fixedValues: ['initial', 'inherit', 'auto'],
      min: 0,
      property: 'height',
    };
    expect(obj.build('height')).toEqual([res]);
    res.property = 'min-height';
    expect(obj.build('min-height')).toEqual([res]);
    res.property = 'max-height';
    expect(obj.build('max-height')).toEqual([res]);
  });

  test('Build margin', () => {
    const res = {
      property: 'margin',
      type: 'composite',
      properties: [
        {
          fixedValues: ['initial', 'inherit', 'auto'],
          property: 'margin-top',
          id: 'margin-top-sub',
          type: 'number',
          units: obj.unitsSize,
          default: '0',
        },
        {
          fixedValues: ['initial', 'inherit', 'auto'],
          property: 'margin-right',
          id: 'margin-right-sub',
          type: 'number',
          units: obj.unitsSize,
          default: '0',
        },
        {
          fixedValues: ['initial', 'inherit', 'auto'],
          property: 'margin-bottom',
          id: 'margin-bottom-sub',
          type: 'number',
          units: obj.unitsSize,
          default: '0',
        },
        {
          fixedValues: ['initial', 'inherit', 'auto'],
          property: 'margin-left',
          id: 'margin-left-sub',
          type: 'number',
          units: obj.unitsSize,
          default: '0',
        },
      ],
    };
    expect(obj.build('margin')).toEqual([res]);
  });

  test('Build padding', () => {
    const res = {
      property: 'padding',
      type: 'composite',
      properties: [
        {
          property: 'padding-top',
          id: 'padding-top-sub',
          fixedValues: ['initial', 'inherit', 'auto'],
          type: 'number',
          units: obj.unitsSize,
          default: '0',
          min: 0,
        },
        {
          property: 'padding-right',
          id: 'padding-right-sub',
          fixedValues: ['initial', 'inherit', 'auto'],
          type: 'number',
          units: obj.unitsSize,
          default: '0',
          min: 0,
        },
        {
          property: 'padding-bottom',
          id: 'padding-bottom-sub',
          fixedValues: ['initial', 'inherit', 'auto'],
          type: 'number',
          units: obj.unitsSize,
          default: '0',
          min: 0,
        },
        {
          property: 'padding-left',
          id: 'padding-left-sub',
          fixedValues: ['initial', 'inherit', 'auto'],
          type: 'number',
          units: obj.unitsSize,
          default: '0',
          min: 0,
        },
      ],
    };
    expect(obj.build('padding')).toEqual([res]);
  });

  test('Build font-family', () => {
    var ss = ', sans-serif';
    var ms = ', monospace';
    const res = {
      property: 'font-family',
      type: 'select',
      default: 'Arial, Helvetica' + ss,
      options: [
        { label: 'Arial', id: 'Arial, Helvetica' + ss },
        { label: 'Arial Black', id: 'Arial Black, Gadget' + ss },
        { label: 'Brush Script MT', id: 'Brush Script MT' + ss },
        { label: 'Comic Sans MS', id: 'Comic Sans MS, cursive' + ss },
        { label: 'Courier New', id: 'Courier New, Courier' + ms },
        { label: 'Georgia', id: 'Georgia, serif' },
        { label: 'Helvetica', id: 'Helvetica' + ss },
        { label: 'Impact', id: 'Impact, Charcoal' + ss },
        {
          label: 'Lucida Sans Unicode',
          id: 'Lucida Sans Unicode, Lucida Grande' + ss,
        },
        { label: 'Tahoma', id: 'Tahoma, Geneva' + ss },
        { label: 'Times New Roman', id: 'Times New Roman, Times, serif' },
        { label: 'Trebuchet MS', id: 'Trebuchet MS, Helvetica' + ss },
        { label: 'Verdana', id: 'Verdana, Geneva' + ss },
      ],
    };
    expect(obj.build('font-family')).toEqual([res]);
  });

  test('Build font-size', () => {
    const res = {
      type: 'number',
      units: obj.unitsSize,
      default: 'medium',
      min: 0,
      property: 'font-size',
      fixedValues: [
        'medium',
        'xx-small',
        'x-small',
        'small',
        'large',
        'x-large',
        'xx-large',
        'smaller',
        'larger',
        'length',
        'initial',
        'inherit',
      ],
    };
    expect(obj.build('font-size')).toEqual([res]);
  });

  test('Build letter-spacing', () => {
    const res = {
      type: 'number',
      units: obj.unitsSize,
      default: 'normal',
      property: 'letter-spacing',
      fixedValues: ['normal', 'initial', 'inherit'],
    };
    expect(obj.build('letter-spacing')).toEqual([res]);
  });

  test('Build font-weight', () => {
    const res = {
      type: 'select',
      default: '400',
      property: 'font-weight',
      options: [
        { id: '100', label: 'Thin' },
        { id: '200', label: 'Extra-Light' },
        { id: '300', label: 'Light' },
        { id: '400', label: 'Normal' },
        { id: '500', label: 'Medium' },
        { id: '600', label: 'Semi-Bold' },
        { id: '700', label: 'Bold' },
        { id: '800', label: 'Extra-Bold' },
        { id: '900', label: 'Ultra-Bold' },
      ],
    };
    expect(obj.build('font-weight')).toEqual([res]);
  });

  test('Build color', () => {
    const res = {
      property: 'color',
      type: 'color',
      default: 'black',
      full: true,
    };
    expect(obj.build('color')).toEqual([res]);
  });

  test('Build line-height', () => {
    const res = {
      type: 'number',
      units: obj.unitsSize,
      default: 'normal',
      property: 'line-height',
      fixedValues: ['normal', 'initial', 'inherit'],
    };
    expect(obj.build('line-height')).toEqual([res]);
  });

  test('Build text-align', () => {
    const res = {
      type: 'radio',
      default: 'left',
      property: 'text-align',
      options: [{ id: 'left' }, { id: 'center' }, { id: 'right' }, { id: 'justify' }],
    };
    expect(obj.build('text-align')).toEqual([res]);
  });

  test('Build text-shadow', () => {
    const res = {
      type: 'stack',
      preview: true,
      default: 'none',
      property: 'text-shadow',
      properties: [
        {
          property: 'text-shadow-h',
          type: 'number',
          units: obj.unitsSizeNoPerc,
          default: '0',
        },
        {
          property: 'text-shadow-v',
          type: 'number',
          units: obj.unitsSizeNoPerc,
          default: '0',
        },
        {
          property: 'text-shadow-blur',
          type: 'number',
          units: obj.unitsSizeNoPerc,
          default: '0',
          min: 0,
        },
        {
          property: 'text-shadow-color',
          full: true,
          type: 'color',
          default: 'black',
        },
      ],
    };
    const result = obj.build('text-shadow');
    // @ts-ignore
    delete result[0].layerLabel;
    expect(result).toEqual([res]);
  });

  test('Build border-radius-c', () => {
    const res = {
      type: 'number',
      units: obj.unitsSize,
      property: 'border-radius',
      default: '0',
      min: 0,
    };
    expect(obj.build('border-radius-c')).toEqual([res]);
  });

  test('Build border-radius', () => {
    const res = {
      property: 'border-radius',
      type: 'composite',
      properties: [
        {
          property: 'border-top-left-radius',
          id: 'border-top-left-radius-sub',
          type: 'number',
          units: obj.unitsSize,
          default: '0',
          min: 0,
        },
        {
          property: 'border-top-right-radius',
          id: 'border-top-right-radius-sub',
          type: 'number',
          units: obj.unitsSize,
          min: 0,
          default: '0',
        },
        {
          property: 'border-bottom-left-radius',
          id: 'border-bottom-left-radius-sub',
          type: 'number',
          units: obj.unitsSize,
          min: 0,
          default: '0',
        },
        {
          property: 'border-bottom-right-radius',
          id: 'border-bottom-right-radius-sub',
          type: 'number',
          units: obj.unitsSize,
          min: 0,
          default: '0',
        },
      ],
    };
    expect(obj.build('border-radius')).toEqual([res]);
  });

  test('Build background-color', () => {
    const res = {
      type: 'color',
      default: 'none',
      full: true,
      property: 'background-color',
    };
    expect(obj.build('background-color')).toEqual([res]);
  });

  test('Build border', () => {
    const res = {
      property: 'border',
      type: 'composite',
      properties: [
        {
          property: 'border-width',
          id: 'border-width-sub',
          type: 'number',
          units: obj.unitsSizeNoPerc,
          default: '0',
          min: 0,
        },
        {
          property: 'border-style',
          id: 'border-style-sub',
          type: 'select',
          default: 'solid',
          options: [
            { id: 'none' },
            { id: 'solid' },
            { id: 'dotted' },
            { id: 'dashed' },
            { id: 'double' },
            { id: 'groove' },
            { id: 'ridge' },
            { id: 'inset' },
            { id: 'outset' },
          ],
        },
        {
          property: 'border-color',
          id: 'border-color-sub',
          full: true,
          type: 'color',
          default: 'black',
        },
      ],
    };
    expect(obj.build('border')).toEqual([res]);
  });

  test('Build box-shadow', () => {
    const res = {
      property: 'box-shadow',
      type: 'stack',
      preview: true,
      properties: [
        {
          property: 'box-shadow-h',
          type: 'number',
          units: obj.unitsSizeNoPerc,
          default: '0',
        },
        {
          property: 'box-shadow-v',
          type: 'number',
          units: obj.unitsSizeNoPerc,
          default: '0',
        },
        {
          property: 'box-shadow-blur',
          type: 'number',
          units: obj.unitsSizeNoPerc,
          default: '5px',
          min: 0,
        },
        {
          property: 'box-shadow-spread',
          type: 'number',
          units: obj.unitsSizeNoPerc,
          default: '0',
        },
        {
          property: 'box-shadow-color',
          type: 'color',
          default: 'black',
          full: true,
        },
        {
          property: 'box-shadow-type',
          type: 'select',
          default: '',
          options: [
            { id: '', label: 'Outside' },
            { id: 'inset', label: 'Inside' },
          ],
        },
      ],
    };
    const result = obj.build('box-shadow');
    // @ts-ignore
    delete result[0].layerLabel;
    expect(result).toEqual([res]);
  });

  test('Build background', () => {
    const res = {
      property: 'background',
      type: 'stack',
      preview: true,
      detached: true,
      properties: [
        {
          property: 'background-image',
          id: 'background-image-sub',
          default: 'none',
          type: 'file',
          functionName: 'url',
          full: true,
        },
        {
          property: 'background-repeat',
          id: 'background-repeat-sub',
          type: 'select',
          default: 'repeat',
          options: [{ id: 'repeat' }, { id: 'repeat-x' }, { id: 'repeat-y' }, { id: 'no-repeat' }],
        },
        {
          property: 'background-position',
          id: 'background-position-sub',
          type: 'select',
          default: 'left top',
          options: [
            { id: 'left top' },
            { id: 'left center' },
            { id: 'left bottom' },
            { id: 'right top' },
            { id: 'right center' },
            { id: 'right bottom' },
            { id: 'center top' },
            { id: 'center center' },
            { id: 'center bottom' },
          ],
        },
        {
          property: 'background-attachment',
          id: 'background-attachment-sub',
          type: 'select',
          default: 'scroll',
          options: [{ id: 'scroll' }, { id: 'fixed' }, { id: 'local' }],
        },
        {
          property: 'background-size',
          id: 'background-size-sub',
          type: 'select',
          default: 'auto',
          options: [{ id: 'auto' }, { id: 'cover' }, { id: 'contain' }],
        },
      ],
    };
    const result = obj.build('background');
    // @ts-ignore
    delete result[0].layerLabel;
    expect(result).toEqual([res]);
  });

  test('Build transition', () => {
    const res = {
      property: 'transition',
      type: 'stack',
      properties: [
        {
          property: 'transition-property',
          id: 'transition-property-sub',
          type: 'select',
          default: 'width',
          options: [
            { id: 'all' },
            { id: 'width' },
            { id: 'height' },
            { id: 'background-color' },
            { id: 'transform' },
            { id: 'box-shadow' },
            { id: 'opacity' },
          ],
        },
        {
          property: 'transition-duration',
          id: 'transition-duration-sub',
          type: 'number',
          units: obj.unitsTime,
          default: '2s',
          min: 0,
        },
        {
          property: 'transition-timing-function',
          id: 'transition-timing-function-sub',
          type: 'select',
          default: 'ease',
          options: [{ id: 'linear' }, { id: 'ease' }, { id: 'ease-in' }, { id: 'ease-out' }, { id: 'ease-in-out' }],
        },
      ],
    };
    expect(obj.build('transition')).toEqual([res]);
  });

  test('Build perspective', () => {
    const res = {
      property: 'perspective',
      type: 'number',
      units: obj.unitsSize,
      default: '0',
      min: 0,
    };
    expect(obj.build('perspective')).toEqual([res]);
  });

  test('Build transform', () => {
    expect(obj.build('transform')[0].type).toEqual('stack');
  });

  test('Build cursor', () => {
    const res = {
      type: 'select',
      property: 'cursor',
      default: 'auto',
      options: [
        { id: 'auto' },
        { id: 'pointer' },
        { id: 'copy' },
        { id: 'crosshair' },
        { id: 'grab' },
        { id: 'grabbing' },
        { id: 'help' },
        { id: 'move' },
        { id: 'text' },
      ],
    };
    expect(obj.build('cursor')).toEqual([res]);
  });

  test('Build overflow', () => {
    const res = {
      type: 'select',
      property: 'overflow',
      default: 'visible',
      options: [{ id: 'visible' }, { id: 'hidden' }, { id: 'scroll' }, { id: 'auto' }],
    };
    expect(obj.build('overflow')).toEqual([res]);
  });

  test('Build overflow-x', () => {
    const res = {
      type: 'select',
      property: 'overflow-x',
      default: 'visible',
      options: [{ id: 'visible' }, { id: 'hidden' }, { id: 'scroll' }, { id: 'auto' }],
    };
    expect(obj.build('overflow-x')).toEqual([res]);
  });

  test('Build overflow-y', () => {
    const res = {
      type: 'select',
      property: 'overflow-y',
      default: 'visible',
      options: [{ id: 'visible' }, { id: 'hidden' }, { id: 'scroll' }, { id: 'auto' }],
    };
    expect(obj.build('overflow-y')).toEqual([res]);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: Sectors.ts]---
Location: grapesjs-dev/packages/core/test/specs/style_manager/model/Sectors.ts

```typescript
import Editor from '../../../../src/editor/model/Editor';
import Sector from '../../../../src/style_manager/model/Sector';

describe('Sectors', () => {
  describe('Sector visibility', () => {
    let em: Editor;
    let sm: Editor['Styles'];
    let domc: Editor['Components'];
    let s1: Sector;
    let s2: Sector;

    beforeEach(() => {
      em = new Editor({
        mediaCondition: 'max-width',
        avoidInlineStyle: true,
        styleManager: {
          sectors: [
            {
              id: 'sector-1',
              name: 'First sector',
              properties: ['width', 'min-width', 'height', 'min-height'],
            },
            {
              id: 'sector-2',
              name: 'Second sector',
              properties: ['color', 'font-size'],
            },
          ],
        },
      });
      domc = em.Components;
      sm = em.Styles;
      em.Pages.onLoad();
      sm.onLoad();
      s1 = sm.getSector('sector-1');
      s2 = sm.getSector('sector-2');
    });

    afterEach(() => {
      em.destroy();
    });

    test('All sectors should exist', () => {
      [s1, s2].forEach((sector) => expect(sector).toBeTruthy());
    });

    test('All sectors and properties are visible by default', () => {
      [s1, s2].forEach((sector) => {
        expect(sector.isVisible()).toBe(true);
        sector.getProperties().forEach((prop) => {
          expect(prop.isVisible()).toBe(true);
        });
      });
    });

    test('Sectors are properly enabled with stylable component', () => {
      const stylable = ['width', 'height'];
      const cmp = domc.addComponent({ stylable });
      em.setSelected(cmp);
      sm.__upSel();

      expect(s1.isVisible()).toBe(true);
      expect(s2.isVisible()).toBe(false);
      s1.getProperties().forEach((prop) => {
        const isVisible = stylable.indexOf(prop.getName()) >= 0;
        expect(prop.isVisible()).toBe(isVisible);
      });
      s2.getProperties().forEach((prop) => {
        expect(prop.isVisible()).toBe(false);
      });
    });

    test('Sectors are properly enabled with unstylable component', () => {
      const unstylable = ['color'];
      const cmp = domc.addComponent({ unstylable });
      em.setSelected(cmp);
      sm.__upSel();

      expect(s1.isVisible()).toBe(true);
      expect(s2.isVisible()).toBe(true);
      s1.getProperties().forEach((prop) => {
        expect(prop.isVisible()).toBe(true);
      });
      s2.getProperties().forEach((prop) => {
        const isVisible = unstylable.indexOf(prop.getName()) < 0;
        expect(prop.isVisible()).toBe(isVisible);
      });
    });

    test('Property with isVisible', () => {
      const cmp = domc.addComponent({ tagName: 'span' });
      em.setSelected(cmp);

      s2.getProperty('color')?.set({
        isVisible: ({ component }) => component?.tagName !== 'span',
      });

      sm.__upSel();

      [s1, s2].forEach((sector) => expect(sector.isVisible()).toBe(true));

      s2.getProperties().forEach((prop) => {
        const isVisible = prop.getName() !== 'color';
        expect(prop.isVisible()).toBe(isVisible);
      });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: PropertyColorView.ts]---
Location: grapesjs-dev/packages/core/test/specs/style_manager/view/PropertyColorView.ts

```typescript
import PropertyColorView from '../../../../src/style_manager/view/PropertyColorView';
import Property from '../../../../src/style_manager/model/Property';
import Component from '../../../../src/dom_components/model/Component';
import Editor from '../../../../src/editor/model/Editor';

describe('PropertyColorView', () => {
  let em: Editor;
  let dcomp: Editor['Components'];
  let compOpts: any;
  let component: Component;
  var fixtures: HTMLElement;
  let target: Component;
  let model: Property;
  let view: PropertyColorView;
  let propName = 'testprop';
  let propValue = '#fff';

  beforeAll(() => {
    ($.fn as any).spectrum = function () {
      return this;
    };
  });

  beforeEach(() => {
    em = new Editor();
    dcomp = em.Components;
    compOpts = { em, componentTypes: dcomp.componentTypes };
    target = new Component({}, compOpts);
    component = new Component({}, compOpts);
    model = new Property(
      {
        type: 'color',
        property: propName,
      },
      { em },
    );
    view = new PropertyColorView({ model });
    document.body.innerHTML = '<div id="fixtures"></div>';
    fixtures = document.body.firstChild as HTMLElement;
    view.render();
    fixtures.appendChild(view.el);
  });

  afterEach(() => {
    em.destroy();
  });

  test('Rendered correctly', () => {
    var prop = view.el;
    expect(fixtures.querySelector('.property')).toBeTruthy();
    expect(prop.querySelector('.label')).toBeTruthy();
    expect(prop.querySelector('.field')).toBeTruthy();
  });

  test('Inputs rendered', () => {
    var prop = view.el;
    expect(prop.querySelector('input[type=text]')).toBeTruthy();
  });

  test('Inputs should exist', () => {
    expect(view.inputInst).toBeTruthy();
  });

  test('Input value is empty', () => {
    expect(view.model.get('value')).toBeFalsy();
    expect(view.getInputEl().value).toBeFalsy();
  });

  test('Update model on setValue', () => {
    view.setValue(propValue);
    expect(view.getInputEl().value).toEqual(propValue);
  });

  test('Update model on input change', () => {
    view.getInputEl().value = propValue;
    view.inputValueChanged({
      target: { value: propValue },
      stopPropagation() {},
    });
    expect(view.model.get('value')).toEqual(propValue);
  });

  test('Update input on value change', (done) => {
    view.model.set('value', propValue);
    setTimeout(() => {
      expect(view.getInputEl().value).toEqual(propValue);
      done();
    }, 15);
  });

  describe('Init property', () => {
    beforeEach(() => {
      em = new Editor();
      component = new Component({}, { em, config: em.Components.config });
      model = new Property({
        type: 'color',
        property: propName,
        defaults: propValue,
      });
      view = new PropertyColorView({
        model,
      });
      fixtures.innerHTML = '';
      view.render();
      fixtures.appendChild(view.el);
    });

    test('Value as default', () => {
      expect(view.model.getValue()).toEqual(propValue);
    });

    test('Input value is the default', () => {
      expect(view.getInputEl().value).toEqual(propValue);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: PropertyCompositeView.ts]---
Location: grapesjs-dev/packages/core/test/specs/style_manager/view/PropertyCompositeView.ts

```typescript
import PropertyCompositeView from '../../../../src/style_manager/view/PropertyCompositeView';
import PropertyComposite from '../../../../src/style_manager/model/PropertyComposite';
import Component from '../../../../src/dom_components/model/Component';
import Editor from '../../../../src/editor/model/Editor';

describe('PropertyCompositeView', () => {
  let em: Editor;
  let dcomp: Editor['Components'];
  let compOpts: any;
  var component: Component;
  var fixtures: HTMLElement;
  var target: Component;
  var model: PropertyComposite;
  var view: PropertyCompositeView;
  var propName = 'testprop';
  var properties = [
    {
      property: 'subprop1',
    },
    {
      type: 'integer',
      property: 'subprop2',
      defaults: '0',
      units: ['%', 'px'],
    },
    {
      type: 'select',
      property: 'subprop3',
      defaults: 'val2',
      list: [{ value: 'val1' }, { value: 'val2' }, { value: 'val3' }],
    },
  ];

  beforeEach(() => {
    em = new Editor();
    dcomp = em.Components;
    compOpts = { em, componentTypes: dcomp.componentTypes };
    target = new Component({}, compOpts);
    component = new Component({}, compOpts);
    model = new PropertyComposite(
      {
        type: 'composite',
        property: propName,
        properties,
      },
      { em },
    );
    view = new PropertyCompositeView({ model });
    document.body.innerHTML = '<div id="fixtures"></div>';
    fixtures = document.body.firstChild as HTMLElement;
    view.render();
    fixtures.appendChild(view.el);
  });

  afterEach(() => {
    em.destroy();
  });

  test('Rendered correctly', () => {
    var prop = view.el;
    expect(fixtures.querySelector('.property')).toBeTruthy();
    expect(prop.querySelector('.label')).toBeTruthy();
    expect(prop.querySelector('.field')).toBeTruthy();
  });

  test('Properties rendered', () => {
    var prop = view.el;
    expect(prop.querySelector('.properties')).toBeTruthy();
  });

  test('Properties rendered correctly', () => {
    var children = view.el.querySelector('.properties')!.children;
    expect(children.length).toEqual(properties.length);
  });

  test('Props should exist', () => {
    expect(view.props).toBeTruthy();
  });

  test('Input value is empty', () => {
    expect(model.getFullValue()).toEqual('0 val2');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: PropertyIntegerView.ts]---
Location: grapesjs-dev/packages/core/test/specs/style_manager/view/PropertyIntegerView.ts

```typescript
import PropertyNumberView from '../../../../src/style_manager/view/PropertyNumberView';
import PropertyNumber from '../../../../src/style_manager/model/PropertyNumber';
import Component from '../../../../src/dom_components/model/Component';
import Editor from '../../../../src/editor/model/Editor';

describe('PropertyNumberView', () => {
  let em: Editor;
  let dcomp: Editor['Components'];
  let compOpts: any;
  let component: Component;
  let fixtures: HTMLElement;
  let target: Component;
  let model: PropertyNumber;
  let view: PropertyNumberView;
  let propName = 'testprop';
  let intValue = '55';
  let unitValue = 'px';
  let units = ['px', '%', 'em'];
  let minValue = -15;
  let maxValue = 75;
  let unitsElSel = '.field-units select';

  beforeEach(() => {
    em = new Editor();
    dcomp = em.Components;
    compOpts = { em, componentTypes: dcomp.componentTypes };
    target = new Component({}, compOpts);
    component = new Component({}, compOpts);
    model = new PropertyNumber(
      {
        units,
        property: propName,
      },
      { em },
    );
    view = new PropertyNumberView({ model });
    document.body.innerHTML = '<div id="fixtures"></div>';
    fixtures = document.body.firstChild as HTMLElement;
    view.render();
    fixtures.appendChild(view.el);
  });

  afterEach(() => {
    em.destroy();
  });

  test('Rendered correctly', () => {
    var prop = view.el;
    expect(fixtures.querySelector('.property')).toBeTruthy();
    expect(prop.querySelector('.label')).toBeTruthy();
    expect(prop.querySelector('.field')).toBeTruthy();
  });

  test('Inputs rendered', () => {
    var prop = view.el;
    expect(prop.querySelector('input[type=text]')).toBeTruthy();
    expect(prop.querySelector(unitsElSel)).toBeTruthy();
  });

  test('Units rendered', () => {
    var select = view.el.querySelector(unitsElSel)!;
    expect(select.children.length).toEqual(units.length + 1); // (+ hidden option)
  });

  test('Units rendered correctly', () => {
    var children = view.el.querySelector(unitsElSel)!.children;
    expect(children[1].textContent).toEqual(units[0]);
    expect(children[2].textContent).toEqual(units[1]);
    expect(children[3].textContent).toEqual(units[2]);
  });

  test('Inputs should exist', () => {
    expect(view.input).toBeTruthy();
  });

  test('Input value is empty', () => {
    expect(view.model.get('value')).toBeFalsy();
  });

  test('Update model on setValue', () => {
    view.inputInst.setValue(intValue + unitValue);
    expect(model.get('value')).toEqual(parseFloat(intValue));
    expect(model.get('unit')).toEqual(unitValue);
    expect(view.getInputEl().value).toEqual(intValue);
  });

  test('Update model on input change', () => {
    view.inputInst.inputEl.val(123).trigger('change');
    expect(view.model.get('value')).toEqual(123);
  });

  test('Update model on unit change', () => {
    view.inputInst.unitEl.value = units[1];
    view.inputInst.handleUnitChange({ stopPropagation() {} });
    expect(model.get('unit')).toEqual(units[1]);
  });

  test('Update input on value change', () => {
    view.model.set('value', intValue);
    expect(view.getInputEl().value).toEqual(intValue);
  });

  describe('Init property', () => {
    beforeEach(() => {
      component = new Component({}, compOpts);
      model = new PropertyNumber(
        {
          units,
          property: propName,
          defaults: intValue,
          min: minValue,
          max: maxValue,
          unit: units[1],
        },
        { em },
      );
      view = new PropertyNumberView({
        model,
      });
      fixtures.innerHTML = '';
      view.render();
      fixtures.appendChild(view.el);
    });

    test('Value as default', () => {
      expect(model.getValue()).toEqual(intValue);
      expect(model.getUnit()).toEqual(units[1]);
    });

    test('Input value is as default', () => {
      expect(view.getInputEl().value).toEqual('');
      expect(view.getInputEl().placeholder).toEqual(intValue);
      expect(view.inputInst.unitEl.value).toEqual(units[1]);
    });

    test('Input follows min', () => {
      view.inputInst.inputEl.val(minValue - 50).trigger('change');
      expect(view.model.get('value')).toEqual(minValue);
      expect(view.getInputEl().value).toEqual(minValue + '');
    });

    test('Input follows max', () => {
      view.inputInst.inputEl.val(maxValue + 50).trigger('change');
      expect(view.model.get('value')).toEqual(maxValue);
      expect(view.getInputEl().value).toEqual(maxValue + '');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: PropertyRadioView.ts]---
Location: grapesjs-dev/packages/core/test/specs/style_manager/view/PropertyRadioView.ts

```typescript
import PropertyRadioView from '../../../../src/style_manager/view/PropertyRadioView';
import Property from '../../../../src/style_manager/model/PropertySelect';
import Component from '../../../../src/dom_components/model/Component';
import Editor from '../../../../src/editor/model/Editor';

describe('PropertyRadioView', () => {
  let em: Editor;
  let dcomp: Editor['Components'];
  let compOpts: any;
  let component: Component;
  let fixtures: HTMLElement;
  let target: Component;
  let model: Property;
  let view: PropertyRadioView;
  const propName = 'testprop';
  const propValue = 'test1value';
  const defValue = 'test2value';
  const options = [
    { id: 'test1value', title: 'testtitle' },
    { id: 'test2', value: 'test2value' },
  ];

  // Have some issue with getCheckedEl() and jsdom
  // this view.getInputEl().querySelector('input:checked') return null
  // but view.getInputEl().querySelectorAll('input:checked')[0] works
  const getCheckedEl = (view: PropertyRadioView) =>
    view.getInputEl().querySelectorAll('input:checked')[0] as HTMLElement;

  beforeEach(() => {
    em = new Editor({});
    dcomp = em.Components;
    compOpts = { em, componentTypes: dcomp.componentTypes };
    target = new Component({}, compOpts);
    component = new Component({}, compOpts);
    model = new Property(
      {
        type: 'radio',
        list: options,
        property: propName,
      },
      { em },
    );
    view = new PropertyRadioView({ model });
    document.body.innerHTML = '<div id="fixtures"></div>';
    fixtures = document.body.firstChild as HTMLElement;
    view.render();
    fixtures.appendChild(view.el);
  });

  afterEach(() => {
    em.destroy();
  });

  test('Rendered correctly', () => {
    const prop = view.el;
    expect(fixtures.querySelector('.property')).toBeTruthy();
    expect(prop.querySelector('.label')).toBeTruthy();
    expect(prop.querySelector('.field')).toBeTruthy();
  });

  test('Radio rendered', () => {
    const prop = view.el;
    expect(prop.querySelector('input[type=radio]')).toBeTruthy();
  });

  test('Options rendered', () => {
    const input = view.el.querySelector('.field')!.firstChild as HTMLElement;
    expect(input.children.length).toEqual(options.length);
  });

  test('Options rendered correctly', () => {
    const input = view.el.querySelector('.field')!.firstChild as HTMLElement;
    const children = input.children;
    expect(children[0].querySelector('label')!.textContent).toEqual('test1value');
    expect(children[1].querySelector('label')!.textContent).toEqual('test2');
    expect(children[0].querySelector('input')!.value).toEqual(options[0].id);
    expect(children[1].querySelector('input')!.value).toEqual(options[1].id);
    expect(children[0].querySelector('label')!.getAttribute('title')).toEqual(options[0].title);
    expect(children[1].querySelector('label')!.getAttribute('title')).toEqual(null);
  });

  test('Input should exist', () => {
    expect(view.input).toBeTruthy();
  });

  test('Input value is empty', () => {
    expect(view.model.get('value')).toBeFalsy();
  });

  test('Update model on input change', () => {
    view.setValue(propValue);
    view.inputValueChanged({
      target: { value: propValue },
      stopPropagation() {},
    });
    expect(view.model.get('value')).toEqual(propValue);
  });

  test('Update input on value change', (done) => {
    view.model.set('value', propValue);
    setTimeout(() => {
      expect((getCheckedEl(view) as any).value).toEqual(propValue);
      done();
    }, 15);
  });

  describe('Init property', () => {
    beforeEach(() => {
      component = new Component({}, compOpts);
      model = new Property({
        type: 'select',
        list: options,
        defaults: defValue,
        property: propName,
      });
      view = new PropertyRadioView({
        model,
      });
      fixtures.innerHTML = '';
      view.render();
      fixtures.appendChild(view.el);
    });

    test('Value as default', () => {
      expect(view.model.getValue()).toEqual(defValue);
    });

    test('Input value is as default', () => {
      expect(view.model.getDefaultValue()).toEqual(defValue);
    });
  });
});
```

--------------------------------------------------------------------------------

````

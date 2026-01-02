---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 30
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 30 of 97)

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
Location: grapesjs-dev/packages/core/src/commands/index.ts

```typescript
/**
 * You can customize the initial state of the module from the editor initialization, by passing the following [Configuration Object](https://github.com/GrapesJS/grapesjs/blob/master/src/commands/config/config.ts)
 * ```js
 * const editor = grapesjs.init({
 *  commands: {
 *    // options
 *  }
 * })
 * ```
 *
 * Once the editor is instantiated you can use its API and listen to its events. Before using these methods, you should get the module from the instance.
 *
 * ```js
 * // Listen to events
 * editor.on('run', () => { ... });
 *
 * // Use the API
 * const commands = editor.Commands;
 * commands.add(...);
 * ```
 *
 * {REPLACE_EVENTS}
 *
 * ## Methods
 * * [add](#add)
 * * [get](#get)
 * * [getAll](#getall)
 * * [extend](#extend)
 * * [has](#has)
 * * [run](#run)
 * * [stop](#stop)
 * * [isActive](#isactive)
 * * [getActive](#getactive)
 *
 * @module Commands
 */

import { isFunction, includes } from 'underscore';
import CommandAbstract, { Command, CommandOptions, CommandObject, CommandFunction } from './view/CommandAbstract';
import defConfig, { CommandsConfig } from './config/config';
import { Module } from '../abstract';
import Component, { eventDrag } from '../dom_components/model/Component';
import type Editor from '../editor/model/Editor';
import type { ObjectAny } from '../common';
import CommandsEvents from './types';

export type CommandEvent = 'run' | 'stop' | `run:${string}` | `stop:${string}` | `abort:${string}`;

const commandsDef = [
  ['preview', 'Preview', 'preview'],
  ['resize', 'Resize', 'resize'],
  ['fullscreen', 'Fullscreen', 'fullscreen'],
  ['copy', 'CopyComponent'],
  ['paste', 'PasteComponent'],
  ['canvas-move', 'CanvasMove'],
  ['canvas-clear', 'CanvasClear'],
  ['open-code', 'ExportTemplate', 'export-template'],
  ['open-layers', 'OpenLayers', 'open-layers'],
  ['open-styles', 'OpenStyleManager', 'open-sm'],
  ['open-traits', 'OpenTraitManager', 'open-tm'],
  ['open-blocks', 'OpenBlocks', 'open-blocks'],
  ['open-assets', 'OpenAssets', 'open-assets'],
  ['component-select', 'SelectComponent', 'select-comp'],
  ['component-outline', 'SwitchVisibility', 'sw-visibility'],
  ['component-offset', 'ShowOffset', 'show-offset'],
  ['component-move', 'MoveComponent', 'move-comp'],
  ['component-next', 'ComponentNext'],
  ['component-prev', 'ComponentPrev'],
  ['component-enter', 'ComponentEnter'],
  ['component-exit', 'ComponentExit', 'select-parent'],
  ['component-delete', 'ComponentDelete'],
  ['component-style-clear', 'ComponentStyleClear'],
  ['component-drag', 'ComponentDrag'],
];

const defComOptions = { preserveSelected: 1 };

export const getOnComponentDragStart = (em: Editor) => (data: any) => em.trigger(`${eventDrag}:start`, data);

export const getOnComponentDrag = (em: Editor) => (data: any) => em.trigger(eventDrag, data);

export const getOnComponentDragEnd =
  (em: Editor, targets: Component[], opts: { altMode?: boolean } = {}) =>
  (a: any, b: any, data: any) => {
    setTimeout(() => {
      targets.forEach((trg) => trg.set('status', trg.get('selectable') ? 'selected' : ''));
      em.setSelected(targets);
      targets[0].emitUpdate();
    });
    em.trigger(`${eventDrag}:end`, data);

    // Defer selectComponent in order to prevent canvas "freeze" #2692
    setTimeout(() => em.runDefault(defComOptions));

    // Dirty patch to prevent parent selection on drop
    (opts.altMode || data.cancelled) && em.set('_cmpDrag', 1);
  };

export default class CommandsModule extends Module<CommandsConfig & { pStylePrefix?: string }> {
  CommandAbstract = CommandAbstract;
  defaultCommands: Record<string, Command> = {};
  commands: Record<string, CommandObject> = {};
  active: Record<string, any> = {};
  events = CommandsEvents;

  /**
   * @private
   */
  constructor(em: Editor) {
    super(em, 'Commands', defConfig());
    const { config } = this;
    const ppfx = config.pStylePrefix;
    const { defaultCommands } = this;

    if (ppfx) {
      config.stylePrefix = ppfx + config.stylePrefix;
    }

    // Load commands passed via configuration
    Object.keys(config.defaults!).forEach((k) => {
      const obj = config.defaults![k];
      if (obj.id) this.add(obj.id, obj);
    });

    defaultCommands['tlb-delete'] = {
      run(ed) {
        return ed.runCommand('core:component-delete');
      },
    };

    defaultCommands['tlb-clone'] = {
      run(ed) {
        ed.runCommand('core:copy');
        ed.runCommand('core:paste', { action: 'clone-component' });
      },
    };

    defaultCommands['tlb-move'] = {
      run(ed, s, opts = {}) {
        let dragger;
        const em = ed.getModel();
        const { event } = opts;
        const trg = opts.target as Component | undefined;
        const trgs = Array.isArray(trg) ? trg : trg ? [trg] : [...ed.getSelectedAll()];
        const targets = trgs.map((trg) => trg.delegate?.move?.(trg) || trg).filter(Boolean);
        const target = targets[targets.length - 1] as Component | undefined;
        const nativeDrag = event?.type === 'dragstart';
        const modes = ['absolute', 'translate'];

        if (!target?.get('draggable')) {
          return em.logWarning('The element is not draggable');
        }

        const mode = opts.mode || target.get('dmode') || em.get('dmode');
        const hideTlb = () => em.stopDefault(defComOptions);
        const altMode = includes(modes, mode);
        targets.forEach((trg) => trg.trigger('disable', { fromMove: true }));

        // Without setTimeout the ghost image disappears
        nativeDrag ? setTimeout(hideTlb, 0) : hideTlb();

        const onStart = getOnComponentDragStart(em);
        const onDrag = getOnComponentDrag(em);
        const onEnd = getOnComponentDragEnd(em, targets, { altMode });

        if (altMode) {
          // TODO move grabbing func in editor/canvas from the Sorter
          dragger = ed.runCommand('core:component-drag', {
            guidesInfo: 1,
            mode,
            target,
            onStart,
            onDrag,
            onEnd,
            event,
          });
        } else {
          if (nativeDrag) {
            event?.dataTransfer?.setDragImage(target.view?.el, 0, 0);
            //sel.set('status', 'freezed');
          }

          const cmdMove = ed.Commands.get('move-comp')!;
          cmdMove.onStart = onStart;
          cmdMove.onDrag = onDrag;
          cmdMove.onEndMoveFromModel = onEnd;
          // @ts-ignore
          cmdMove.initSorterFromModels(targets);
        }

        targets.filter((sel) => sel.get('selectable')).forEach((sel) => sel.set('status', 'freezed-selected'));
      },
    };

    // Core commands
    defaultCommands['core:undo'] = (e) => e.UndoManager.undo();
    defaultCommands['core:redo'] = (e) => e.UndoManager.redo();
    commandsDef.forEach((item) => {
      const oldCmd = item[2];
      const cmd = require(`./view/${item[1]}`).default;
      const cmdName = `core:${item[0]}`;
      defaultCommands[cmdName] = cmd;
      if (oldCmd) {
        defaultCommands[oldCmd] = cmd;
        // Propogate old commands (can be removed once we stop to call old commands)
        ['run', 'stop'].forEach((name) => {
          em.on(`${name}:${oldCmd}`, (...args) => em.trigger(`${name}:${cmdName}`, ...args));
        });
      }
    });

    // @ts-ignore TODO check where it's used
    config.model = em.Canvas;

    for (const id in defaultCommands) {
      this.add(id, defaultCommands[id]);
    }

    return this;
  }

  /**
   * Add new command to the collection
   * @param	{string} id Command's ID
   * @param	{Object|Function} command Object representing your command,
   *  By passing just a function it's intended as a stateless command
   *  (just like passing an object with only `run` method).
   * @return {this}
   * @example
   * commands.add('myCommand', {
   * 	run(editor, sender) {
   * 		alert('Hello world!');
   * 	},
   * 	stop(editor, sender) {
   * 	},
   * });
   * // As a function
   * commands.add('myCommand2', editor => { ... });
   * */
  add<T extends ObjectAny = {}>(id: string, command: CommandFunction | CommandObject<any, T>) {
    let result: CommandObject = isFunction(command) ? { run: command } : command;

    if (!result.stop) {
      result.noStop = true;
    }

    delete result.initialize;

    result.id = id;
    this.commands[id] = CommandAbstract.extend(result);

    return this;
  }

  /**
   * Get command by ID
   * @param	{string}	id Command's ID
   * @return {Object} Object representing the command
   * @example
   * var myCommand = commands.get('myCommand');
   * myCommand.run();
   * */
  get(id: string): CommandObject | undefined {
    let command: any = this.commands[id];

    if (isFunction(command)) {
      command = new command(this.config);
      this.commands[id] = command;
    } else if (!command) {
      this.em.logWarning(`'${id}' command not found`);
    }

    return command;
  }

  /**
   * Extend the command. The command to extend should be defined as an object
   * @param	{string}	id Command's ID
   * @param {Object} Object with the new command functions
   * @returns {this}
   * @example
   * commands.extend('old-command', {
   *  someInnerFunction() {
   *  // ...
   *  }
   * });
   * */
  extend(id: string, cmd: CommandObject = {}) {
    const command = this.get(id);

    if (command) {
      const cmdObj = {
        ...command.constructor.prototype,
        ...cmd,
      };
      this.add(id, cmdObj);
      // Extend also old name commands if exist
      const oldCmd = commandsDef.filter((cmd) => `core:${cmd[0]}` === id && cmd[2])[0];
      oldCmd && this.add(oldCmd[2], cmdObj);
    }

    return this;
  }

  /**
   * Check if command exists
   * @param	{string}	id Command's ID
   * @return {Boolean}
   * */
  has(id: string) {
    return !!this.commands[id];
  }

  /**
   * Get an object containing all the commands
   * @return {Object}
   */
  getAll() {
    return this.commands;
  }

  /**
   * Execute the command
   * @param {String} id Command ID
   * @param {Object} [options={}] Options
   * @return {*} The return is defined by the command
   * @example
   * commands.run('myCommand', { someOption: 1 });
   */
  run(id: string, options: CommandOptions = {}) {
    return this.runCommand(this.get(id), options);
  }

  /**
   * Stop the command
   * @param {String} id Command ID
   * @param {Object} [options={}] Options
   * @return {*} The return is defined by the command
   * @example
   * commands.stop('myCommand', { someOption: 1 });
   */
  stop(id: string, options: CommandOptions = {}) {
    return this.stopCommand(this.get(id), options);
  }

  /**
   * Check if the command is active. You activate commands with `run`
   * and disable them with `stop`. If the command was created without `stop`
   * method it can't be registered as active
   * @param  {String}  id Command id
   * @return {Boolean}
   * @example
   * const cId = 'some-command';
   * commands.run(cId);
   * commands.isActive(cId);
   * // -> true
   * commands.stop(cId);
   * commands.isActive(cId);
   * // -> false
   */
  isActive(id: string) {
    return this.getActive().hasOwnProperty(id);
  }

  /**
   * Get all active commands
   * @return {Object}
   * @example
   * console.log(commands.getActive());
   * // -> { someCommand: itsLastReturn, anotherOne: ... };
   */
  getActive() {
    return this.active;
  }

  /**
   * Run command via its object
   * @param  {Object} command
   * @param {Object} options
   * @return {*} Result of the command
   * @private
   */
  runCommand(command?: CommandObject, options: CommandOptions = {}) {
    let result;

    if (command?.run) {
      const { em, config } = this;
      const id = command.id as string;
      const editor = em.Editor;

      if (!this.isActive(id) || options.force || !config.strict) {
        const defaultOptionsRunFn = config.defaultOptions?.[id]?.run;
        isFunction(defaultOptionsRunFn) && (options = defaultOptionsRunFn(options));
        result = editor && (command as any).callRun(editor, options);
      }
    }

    return result;
  }

  /**
   * Stop the command
   * @param  {Object} command
   * @param {Object} options
   * @return {*} Result of the command
   * @private
   */
  stopCommand(command?: CommandObject, options: CommandOptions = {}) {
    let result;

    if (command?.run) {
      const { em, config } = this;
      const id = command.id as string;
      const editor = em.Editor;

      if (this.isActive(id) || options.force || !config.strict) {
        const defaultOptionsStopFn = config.defaultOptions?.[id]?.stop;
        isFunction(defaultOptionsStopFn) && (options = defaultOptionsStopFn(options));
        result = (command as any).callStop(editor, options);
      }
    }

    return result;
  }

  /**
   * Create anonymous Command instance
   * @param {Object} command Command object
   * @return {Command}
   * @private
   * */
  create(command: CommandObject) {
    if (!command.stop) command.noStop = true;
    const cmd = CommandAbstract.extend(command);
    return new cmd(this.config);
  }

  __onRun(id: string, clb: () => void) {
    const { em, events } = this;
    em.on(`${events.runCommand}${id}`, clb);
  }

  __onStop(id: string, clb: () => void) {
    const { em, events } = this;
    em.on(`${events.stopCommand}${id}`, clb);
  }

  destroy() {
    this.defaultCommands = {};
    this.commands = {};
    this.active = {};
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: grapesjs-dev/packages/core/src/commands/types.ts

```typescript
/**{START_EVENTS}*/
export enum CommandsEvents {
  /**
   * @event `command:run` Triggered on run of any command.
   * @example
   * editor.on('command:run', ({ id, result, options }) => {
   *  console.log('Command id', id, 'command result', result);
   * });
   */
  run = 'command:run',

  /**
   * @event `command:run:COMMAND-ID` Triggered on run of a specific command.
   * @example
   * editor.on('command:run:my-command', ({ result, options }) => { ... });
   */
  runCommand = 'command:run:',

  /**
   * @event `command:run:before:COMMAND-ID` Triggered before the command is called.
   * @example
   * editor.on('command:run:before:my-command', ({ options }) => { ... });
   */
  runBeforeCommand = 'command:run:before:',

  /**
   * @event `command:abort:COMMAND-ID` Triggered when the command execution is aborted.
   * @example
   * editor.on('command:abort:my-command', ({ options }) => { ... });
   *
   * // The command could be aborted during the before event
   * editor.on('command:run:before:my-command', ({ options }) => {
   *  if (someCondition) {
   *    options.abort = true;
   *  }
   * });
   */
  abort = 'command:abort:',

  /**
   * @event `command:stop` Triggered on stop of any command.
   * @example
   * editor.on('command:stop', ({ id, result, options }) => {
   *  console.log('Command id', id, 'command result', result);
   * });
   */
  stop = 'command:stop',

  /**
   * @event `command:stop:COMMAND-ID` Triggered on stop of a specific command.
   * @example
   * editor.on('command:run:my-command', ({ result, options }) => { ... });
   */
  stopCommand = 'command:stop:',

  /**
   * @event `command:stop:before:COMMAND-ID` Triggered before the command is called to stop.
   * @example
   * editor.on('command:stop:before:my-command', ({ options }) => { ... });
   */
  stopBeforeCommand = 'command:stop:before:',

  /**
   * @event `command:call` Triggered on run or stop of a command.
   * @example
   * editor.on('command:call', ({ id, result, options, type }) => {
   *  console.log('Command id', id, 'command result', result, 'call type', type);
   * });
   */
  call = 'command:call',

  /**
   * @event `command:call:COMMAND-ID` Triggered on run or stop of a specific command.
   * @example
   * editor.on('command:call:my-command', ({ result, options, type }) => { ... });
   */
  callCommand = 'command:call:',
}
/**{END_EVENTS}*/

// need this to avoid the TS documentation generator to break
export default CommandsEvents;
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: grapesjs-dev/packages/core/src/commands/config/config.ts

```typescript
import type { CommandObject, CommandOptions } from '../view/CommandAbstract';

interface CommandConfigDefaultOptions {
  run?: (options: CommandOptions) => CommandOptions;
  stop?: (options: CommandOptions) => CommandOptions;
}

export interface CommandsConfig {
  /**
   * Style prefix
   * @default 'com-'
   */
  stylePrefix?: string;

  /**
   * Default commands
   * @default {}
   */
  defaults?: Record<string, CommandObject>;

  /**
   * If true, stateful commands (with `run` and `stop` methods) can't be executed multiple times.
   * If the command is already active, running it again will not execute the `run` method.
   * @default true
   */
  strict?: boolean;

  /**
   * Default options for commands
   * These options will be merged with the options passed when the command is run.
   * This allows you to define common behavior for commands in one place.
   * @default {}
   * @example
   * defaultOptions: {
   *  'core:component-drag': {
   *    run: (options: Record<string, unknown>) => ({
   *      ...options,
   *      skipGuidesRender: true,
   *      addStyle({ component, styles, partial }) {
   *        component.addStyle(styles, { partial });
   *      },
   *     }),
   *    stop: (options: Record<string, unknown>) => ({
   *      ...options,
   * *     skipGuidesRender: true,
   *      addStyle({ component, styles, partial }) {
   *        component.addStyle(styles, { partial });
   *      },
   *    }),
   *  }
   * }
   */
  defaultOptions?: Record<string, CommandConfigDefaultOptions>;
}

const config: () => CommandsConfig = () => ({
  stylePrefix: 'com-',
  defaults: {},
  strict: true,
  defaultOptions: {},
});

export default config;
```

--------------------------------------------------------------------------------

---[FILE: CanvasClear.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/CanvasClear.ts

```typescript
import { CommandObject } from './CommandAbstract';

export default {
  run(ed) {
    ed.Components.clear();
    ed.Css.clear();
  },
} as CommandObject;
```

--------------------------------------------------------------------------------

---[FILE: CanvasMove.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/CanvasMove.ts

```typescript
import { bindAll } from 'underscore';
import Dragger from '../../utils/Dragger';
import { getKeyChar, off, on } from '../../utils/dom';
import { CommandObject } from './CommandAbstract';

export default {
  run(ed) {
    bindAll(this, 'onKeyUp', 'enableDragger', 'disableDragger');
    this.editor = ed;
    this.canvasModel = this.canvas.getCanvasView().model;
    this.toggleMove(1);
  },
  stop(ed) {
    this.toggleMove();
    this.disableDragger();
  },

  onKeyUp(ev: KeyboardEvent) {
    if (getKeyChar(ev) === ' ') {
      this.editor.stopCommand(this.id);
    }
  },

  enableDragger(ev: Event) {
    this.toggleDragger(1, ev);
  },

  disableDragger(ev: Event) {
    this.toggleDragger(0, ev);
  },

  toggleDragger(enable: boolean, ev: Event) {
    const { canvasModel, em } = this;
    let { dragger } = this;
    const methodCls = enable ? 'add' : 'remove';
    this.getCanvas().classList[methodCls](`${this.ppfx}is__grabbing`);

    if (!dragger) {
      dragger = new Dragger({
        getPosition() {
          return {
            x: canvasModel.get('x'),
            y: canvasModel.get('y'),
          };
        },
        setPosition({ x, y }) {
          canvasModel.set({ x, y });
        },
        onStart(ev, dragger) {
          em.trigger('canvas:move:start', dragger);
        },
        onDrag(ev, dragger) {
          em.trigger('canvas:move', dragger);
        },
        onEnd(ev, dragger) {
          em.trigger('canvas:move:end', dragger);
        },
      });
      this.dragger = dragger;
    }

    enable ? dragger.start(ev) : dragger.stop();
  },

  toggleMove(enable: boolean) {
    const { ppfx } = this;
    const methodCls = enable ? 'add' : 'remove';
    const methodEv = enable ? 'on' : 'off';
    const methodsEv = { on, off };
    const canvas = this.getCanvas();
    const classes = [`${ppfx}is__grab`];
    !enable && classes.push(`${ppfx}is__grabbing`);
    classes.forEach((cls) => canvas.classList[methodCls](cls));
    methodsEv[methodEv](document, 'keyup', this.onKeyUp);
    methodsEv[methodEv](canvas, 'mousedown', this.enableDragger);
    methodsEv[methodEv](document, 'mouseup', this.disableDragger);
  },
} as CommandObject<
  any,
  {
    [key: string]: any;
  }
>;
```

--------------------------------------------------------------------------------

---[FILE: CommandAbstract.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/CommandAbstract.ts

```typescript
import CanvasModule from '../../canvas';
import { Model, ObjectAny } from '../../common';
import Editor from '../../editor';
import EditorModel from '../../editor/model/Editor';
import CommandsEvents from '../types';

interface ICommand<O extends ObjectAny = any> {
  run?: CommandAbstract<O>['run'];
  stop?: CommandAbstract<O>['stop'];
  id?: string;
  [key: string]: unknown;
}

export type CommandFunction<O extends ObjectAny = any> = CommandAbstract<O>['run'];

export type Command = CommandObject | CommandFunction;

export type CommandOptions = Record<string, any>;

export type CommandObject<O extends ObjectAny = any, T extends ObjectAny = {}> = ICommand<O> &
  T &
  ThisType<T & CommandAbstract<O>>;

export function defineCommand<O extends ObjectAny = any, T extends ObjectAny = {}>(def: CommandObject<O, T>) {
  return def;
}

export default class CommandAbstract<O extends ObjectAny = any> extends Model {
  config: any;
  em: EditorModel;
  pfx: string;
  ppfx: string;
  hoverClass: string;
  badgeClass: string;
  plhClass: string;
  freezClass: string;
  canvas: CanvasModule;
  noStop?: boolean;

  constructor(o: any) {
    super(0);
    this.config = o || {};
    this.em = this.config.em || {};
    const pfx = this.config.stylePrefix;
    this.pfx = pfx;
    this.ppfx = this.config.pStylePrefix;
    this.hoverClass = `${pfx}hover`;
    this.badgeClass = `${pfx}badge`;
    this.plhClass = `${pfx}placeholder`;
    this.freezClass = `${this.ppfx}freezed`;
    this.canvas = this.em.Canvas;
    this.init(this.config);
  }

  /**
   * On frame scroll callback
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  onFrameScroll(e: any) {}

  /**
   * Returns canval element
   * @return {HTMLElement}
   */
  getCanvas() {
    return this.canvas.getElement();
  }

  /**
   * Get canvas body element
   * @return {HTMLElement}
   */
  getCanvasBody() {
    return this.canvas.getBody();
  }

  /**
   * Get canvas wrapper element
   * @return {HTMLElement}
   */
  getCanvasTools() {
    return this.canvas.getToolsEl();
  }

  /**
   * Get the offset of the element
   * @param  {HTMLElement} el
   * @return {Object}
   */
  offset(el: HTMLElement) {
    var rect = el.getBoundingClientRect();
    return {
      top: rect.top + el.ownerDocument.body.scrollTop,
      left: rect.left + el.ownerDocument.body.scrollLeft,
    };
  }

  /**
   * Callback triggered after initialize
   * @param  {Object}  o   Options
   * @private
   * */
  init(o: any) {}

  /**
   * Method that run command
   * @param  {Object}  editor Editor instance
   * @param  {Object}  [options={}] Options
   * @private
   * */
  callRun(editor: Editor, options: any = {}) {
    const { id } = this;
    editor.trigger(`${CommandsEvents.runBeforeCommand}${id}`, { options });

    if (options.abort) {
      editor.trigger(`${CommandsEvents.abort}${id}`, { options });
      return;
    }

    const sender = options.sender || editor;
    const result = this.run(editor, sender, options);
    const data = { id, result, options };
    const dataCall = { ...data, type: 'run' };

    if (!this.noStop) {
      editor.Commands.active[id] = result;
    }

    editor.trigger(`${CommandsEvents.runCommand}${id}`, data);
    editor.trigger(`${CommandsEvents.callCommand}${id}`, dataCall);
    editor.trigger(CommandsEvents.run, data);
    editor.trigger(CommandsEvents.call, dataCall);

    return result;
  }

  /**
   * Method that run command
   * @param  {Object}  editor Editor instance
   * @param  {Object}  [options={}] Options
   * @private
   * */
  callStop(editor: Editor, options: any = {}) {
    const { id } = this;
    const sender = options.sender || editor;
    editor.trigger(`${CommandsEvents.stopBeforeCommand}${id}`, { options });
    const result = this.stop(editor, sender, options);
    const data = { id, result, options };
    const dataCall = { ...data, type: 'stop' };
    delete editor.Commands.active[id];
    editor.trigger(`${CommandsEvents.stopCommand}${id}`, data);
    editor.trigger(`${CommandsEvents.callCommand}${id}`, dataCall);
    editor.trigger(CommandsEvents.stop, data);
    editor.trigger(CommandsEvents.call, dataCall);
    return result;
  }

  /**
   * Stop current command
   */
  stopCommand(opts?: any) {
    this.em.Commands.stop(this.id as string, opts);
  }

  /**
   * Method that run command
   * @param  {Object}  em     Editor model
   * @param  {Object}  sender  Button sender
   * @private
   * */
  run(em: Editor, sender: any, options: O) {}

  /**
   * Method that stop command
   * @param  {Object}  em Editor model
   * @param  {Object}  sender  Button sender
   * @private
   * */
  stop(em: Editor, sender: any, options: O) {}
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentDelete.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/ComponentDelete.ts

```typescript
import { isArray } from 'underscore';
import Component from '../../dom_components/model/Component';
import { CommandObject } from './CommandAbstract';

const command: CommandObject<{ component?: Component }> = {
  run(ed, s, opts = {}) {
    const removed: Component[] = [];
    let components = opts.component || ed.getSelectedAll();
    components = isArray(components) ? [...components] : [components];

    components.filter(Boolean).forEach((component) => {
      if (!component.get('removable')) {
        return this.em.logWarning('The element is not removable', {
          component,
        });
      }

      removed.push(component);
      const cmp = component.delegate?.remove?.(component) || component;
      cmp.remove();
    });

    ed.selectRemove(removed);

    return removed;
  },
};

export default command;
```

--------------------------------------------------------------------------------

````

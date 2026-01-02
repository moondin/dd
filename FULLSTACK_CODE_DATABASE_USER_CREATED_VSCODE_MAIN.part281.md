---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 281
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 281 of 552)

````text
================================================================================
FULLSTACK USER CREATED CODE DATABASE (VERBATIM) - vscode-main
================================================================================
Generated: December 18, 2025
Source: user_created_projects/vscode-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: src/vs/platform/quickinput/browser/helpQuickAccess.ts]---
Location: vscode-main/src/vs/platform/quickinput/browser/helpQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../nls.js';
import { Registry } from '../../registry/common/platform.js';
import { DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';
import { Extensions, IQuickAccessProvider, IQuickAccessProviderDescriptor, IQuickAccessRegistry } from '../common/quickAccess.js';
import { IQuickInputService, IQuickPick, IQuickPickItem } from '../common/quickInput.js';

interface IHelpQuickAccessPickItem extends IQuickPickItem {
	readonly prefix: string;
}

export class HelpQuickAccessProvider implements IQuickAccessProvider {

	static PREFIX = '?';

	private readonly registry = Registry.as<IQuickAccessRegistry>(Extensions.Quickaccess);

	constructor(
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IKeybindingService private readonly keybindingService: IKeybindingService
	) { }

	provide(picker: IQuickPick<IHelpQuickAccessPickItem, { useSeparators: true }>): IDisposable {
		const disposables = new DisposableStore();

		// Open a picker with the selected value if picked
		disposables.add(picker.onDidAccept(() => {
			const [item] = picker.selectedItems;
			if (item) {
				this.quickInputService.quickAccess.show(item.prefix, { preserveValue: true });
			}
		}));

		// Also open a picker when we detect the user typed the exact
		// name of a provider (e.g. `?term` for terminals)
		disposables.add(picker.onDidChangeValue(value => {
			const providerDescriptor = this.registry.getQuickAccessProvider(value.substr(HelpQuickAccessProvider.PREFIX.length));
			if (providerDescriptor && providerDescriptor.prefix && providerDescriptor.prefix !== HelpQuickAccessProvider.PREFIX) {
				this.quickInputService.quickAccess.show(providerDescriptor.prefix, { preserveValue: true });
			}
		}));

		// Fill in all providers
		picker.items = this.getQuickAccessProviders().filter(p => p.prefix !== HelpQuickAccessProvider.PREFIX);

		return disposables;
	}

	getQuickAccessProviders(): IHelpQuickAccessPickItem[] {
		const providers: IHelpQuickAccessPickItem[] = this.registry
			.getQuickAccessProviders()
			.sort((providerA, providerB) => providerA.prefix.localeCompare(providerB.prefix))
			.flatMap(provider => this.createPicks(provider));

		return providers;
	}

	private createPicks(provider: IQuickAccessProviderDescriptor): IHelpQuickAccessPickItem[] {
		return provider.helpEntries.map(helpEntry => {
			const prefix = helpEntry.prefix || provider.prefix;
			const label = prefix || '\u2026' /* ... */;

			return {
				prefix,
				label,
				keybinding: helpEntry.commandId ? this.keybindingService.lookupKeybinding(helpEntry.commandId) : undefined,
				ariaLabel: localize('helpPickAriaLabel', "{0}, {1}", label, helpEntry.description),
				description: helpEntry.description
			};
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/browser/pickerQuickAccess.ts]---
Location: vscode-main/src/vs/platform/quickinput/browser/pickerQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../base/common/cancellation.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable } from '../../../base/common/lifecycle.js';
import { IKeyMods, IQuickPickDidAcceptEvent, IQuickPickSeparator, IQuickPick, IQuickPickItem, IQuickInputButton } from '../common/quickInput.js';
import { IQuickAccessProvider, IQuickAccessProviderRunOptions } from '../common/quickAccess.js';
import { isFunction } from '../../../base/common/types.js';

export enum TriggerAction {

	/**
	 * Do nothing after the button was clicked.
	 */
	NO_ACTION,

	/**
	 * Close the picker.
	 */
	CLOSE_PICKER,

	/**
	 * Update the results of the picker.
	 */
	REFRESH_PICKER,

	/**
	 * Remove the item from the picker.
	 */
	REMOVE_ITEM
}

export interface IPickerQuickAccessItem extends IQuickPickItem {

	/**
	* A method that will be executed when the pick item is accepted from
	* the picker. The picker will close automatically before running this.
	*
	* @param keyMods the state of modifier keys when the item was accepted.
	* @param event the underlying event that caused the accept to trigger.
	*/
	accept?(keyMods: IKeyMods, event: IQuickPickDidAcceptEvent): void;

	/**
	 * A method that will be executed when a button of the pick item was
	 * clicked on.
	 *
	 * @param buttonIndex index of the button of the item that
	 * was clicked.
	 *
	 * @param the state of modifier keys when the button was triggered.
	 *
	 * @returns a value that indicates what should happen after the trigger
	 * which can be a `Promise` for long running operations.
	 */
	trigger?(buttonIndex: number, keyMods: IKeyMods): TriggerAction | Promise<TriggerAction>;
}

export interface IPickerQuickAccessSeparator extends IQuickPickSeparator {
	/**
	 * A method that will be executed when a button of the pick item was
	 * clicked on.
	 *
	 * @param buttonIndex index of the button of the item that
	 * was clicked.
	 *
	 * @param the state of modifier keys when the button was triggered.
	 *
	 * @returns a value that indicates what should happen after the trigger
	 * which can be a `Promise` for long running operations.
	 */
	trigger?(buttonIndex: number, keyMods: IKeyMods): TriggerAction | Promise<TriggerAction>;
}

export interface IPickerQuickAccessProviderOptions<T extends IPickerQuickAccessItem> {

	/**
	 * Enables support for opening picks in the background via gesture.
	 */
	readonly canAcceptInBackground?: boolean;

	/**
	 * Enables to show a pick entry when no results are returned from a search.
	 */
	readonly noResultsPick?: T | ((filter: string) => T);

	/** Whether to skip trimming the pick filter string */
	readonly shouldSkipTrimPickFilter?: boolean;
}

export type Pick<T> = T | IQuickPickSeparator;
export type PicksWithActive<T> = { items: readonly Pick<T>[]; active?: T };
export type Picks<T> = readonly Pick<T>[] | PicksWithActive<T>;
export type FastAndSlowPicks<T> = {

	/**
	 * Picks that will show instantly or after a short delay
	 * based on the `mergeDelay` property to reduce flicker.
	 */
	readonly picks: Picks<T>;

	/**
	 * Picks that will show after they have been resolved.
	 */
	readonly additionalPicks: Promise<Picks<T>>;

	/**
	 * A delay in milliseconds to wait before showing the
	 * `picks` to give a chance to merge with `additionalPicks`
	 * for reduced flicker.
	 */
	readonly mergeDelay?: number;
};

function isPicksWithActive<T>(obj: unknown): obj is PicksWithActive<T> {
	const candidate = obj as PicksWithActive<T>;

	return Array.isArray(candidate.items);
}

function isFastAndSlowPicks<T>(obj: unknown): obj is FastAndSlowPicks<T> {
	const candidate = obj as FastAndSlowPicks<T>;

	return !!candidate.picks && candidate.additionalPicks instanceof Promise;
}

export abstract class PickerQuickAccessProvider<T extends IPickerQuickAccessItem> extends Disposable implements IQuickAccessProvider {

	constructor(private prefix: string, protected options?: IPickerQuickAccessProviderOptions<T>) {
		super();
	}

	provide(picker: IQuickPick<T, { useSeparators: true }>, token: CancellationToken, runOptions?: IQuickAccessProviderRunOptions): IDisposable {
		const disposables = new DisposableStore();

		// Apply options if any
		picker.canAcceptInBackground = !!this.options?.canAcceptInBackground;

		// Disable filtering & sorting, we control the results
		picker.matchOnLabel = picker.matchOnDescription = picker.matchOnDetail = picker.sortByLabel = false;

		// Set initial picks and update on type
		let picksCts: CancellationTokenSource | undefined = undefined;
		const picksDisposable = disposables.add(new MutableDisposable());
		const updatePickerItems = async () => {
			// Cancel any previous ask for picks and busy
			picksCts?.dispose(true);
			picker.busy = false;

			// Setting the .value will call dispose() on the previous value, so we need to do this AFTER cancelling with dispose(true).
			const picksDisposables = picksDisposable.value = new DisposableStore();

			// Create new cancellation source for this run
			picksCts = picksDisposables.add(new CancellationTokenSource(token));

			// Collect picks and support both long running and short or combined
			const picksToken = picksCts.token;
			let picksFilter = picker.value.substring(this.prefix.length);

			if (!this.options?.shouldSkipTrimPickFilter) {
				picksFilter = picksFilter.trim();
			}

			const providedPicks = this._getPicks(picksFilter, picksDisposables, picksToken, runOptions);

			const applyPicks = (picks: Picks<T>, skipEmpty?: boolean): boolean => {
				let items: readonly Pick<T>[];
				let activeItem: T | undefined = undefined;

				if (isPicksWithActive(picks)) {
					items = picks.items;
					activeItem = picks.active;
				} else {
					items = picks;
				}

				if (items.length === 0) {
					if (skipEmpty) {
						return false;
					}

					// We show the no results pick if we have no input to prevent completely empty pickers #172613
					if ((picksFilter.length > 0 || picker.hideInput) && this.options?.noResultsPick) {
						if (isFunction(this.options.noResultsPick)) {
							items = [this.options.noResultsPick(picksFilter)];
						} else {
							items = [this.options.noResultsPick];
						}
					}
				}

				picker.items = items;
				if (activeItem) {
					picker.activeItems = [activeItem];
				}

				return true;
			};

			const applyFastAndSlowPicks = async (fastAndSlowPicks: FastAndSlowPicks<T>): Promise<void> => {
				let fastPicksApplied = false;
				let slowPicksApplied = false;

				await Promise.all([

					// Fast Picks: if `mergeDelay` is configured, in order to reduce
					// amount of flicker, we race against the slow picks over some delay
					// and then set the fast picks.
					// If the slow picks are faster, we reduce the flicker by only
					// setting the items once.

					(async () => {
						if (typeof fastAndSlowPicks.mergeDelay === 'number') {
							await timeout(fastAndSlowPicks.mergeDelay);
							if (picksToken.isCancellationRequested) {
								return;
							}
						}

						if (!slowPicksApplied) {
							fastPicksApplied = applyPicks(fastAndSlowPicks.picks, true /* skip over empty to reduce flicker */);
						}
					})(),

					// Slow Picks: we await the slow picks and then set them at
					// once together with the fast picks, but only if we actually
					// have additional results.

					(async () => {
						picker.busy = true;
						try {
							const awaitedAdditionalPicks = await fastAndSlowPicks.additionalPicks;
							if (picksToken.isCancellationRequested) {
								return;
							}

							let picks: readonly Pick<T>[];
							let activePick: Pick<T> | undefined = undefined;
							if (isPicksWithActive(fastAndSlowPicks.picks)) {
								picks = fastAndSlowPicks.picks.items;
								activePick = fastAndSlowPicks.picks.active;
							} else {
								picks = fastAndSlowPicks.picks;
							}

							let additionalPicks: readonly Pick<T>[];
							let additionalActivePick: Pick<T> | undefined = undefined;
							if (isPicksWithActive(awaitedAdditionalPicks)) {
								additionalPicks = awaitedAdditionalPicks.items;
								additionalActivePick = awaitedAdditionalPicks.active;
							} else {
								additionalPicks = awaitedAdditionalPicks;
							}

							if (additionalPicks.length > 0 || !fastPicksApplied) {
								// If we do not have any activePick or additionalActivePick
								// we try to preserve the currently active pick from the
								// fast results. This fixes an issue where the user might
								// have made a pick active before the additional results
								// kick in.
								// See https://github.com/microsoft/vscode/issues/102480
								let fallbackActivePick: Pick<T> | undefined = undefined;
								if (!activePick && !additionalActivePick) {
									const fallbackActivePickCandidate = picker.activeItems[0];
									if (fallbackActivePickCandidate && picks.indexOf(fallbackActivePickCandidate) !== -1) {
										fallbackActivePick = fallbackActivePickCandidate;
									}
								}

								applyPicks({
									items: [...picks, ...additionalPicks],
									active: activePick || additionalActivePick || fallbackActivePick
								});
							}
						} finally {
							if (!picksToken.isCancellationRequested) {
								picker.busy = false;
							}

							slowPicksApplied = true;
						}
					})()
				]);
			};

			// No Picks
			if (providedPicks === null) {
				// Ignore
			}

			// Fast and Slow Picks
			else if (isFastAndSlowPicks(providedPicks)) {
				await applyFastAndSlowPicks(providedPicks);
			}

			// Fast Picks
			else if (!(providedPicks instanceof Promise)) {
				applyPicks(providedPicks);
			}

			// Slow Picks
			else {
				picker.busy = true;
				try {
					const awaitedPicks = await providedPicks;
					if (picksToken.isCancellationRequested) {
						return;
					}

					if (isFastAndSlowPicks(awaitedPicks)) {
						await applyFastAndSlowPicks(awaitedPicks);
					} else {
						applyPicks(awaitedPicks);
					}
				} finally {
					if (!picksToken.isCancellationRequested) {
						picker.busy = false;
					}
				}
			}
		};
		disposables.add(picker.onDidChangeValue(() => updatePickerItems()));
		updatePickerItems();

		// Accept the pick on accept and hide picker
		disposables.add(picker.onDidAccept(event => {
			if (runOptions?.handleAccept) {
				if (!event.inBackground) {
					picker.hide(); // hide picker unless we accept in background
				}
				runOptions.handleAccept?.(picker.activeItems[0], event.inBackground);
				return;
			}

			const [item] = picker.selectedItems;
			if (typeof item?.accept === 'function') {
				if (!event.inBackground) {
					picker.hide(); // hide picker unless we accept in background
				}

				item.accept(picker.keyMods, event);
			}
		}));

		const buttonTrigger = async (button: IQuickInputButton, item: T | IPickerQuickAccessSeparator) => {
			if (typeof item.trigger !== 'function') {
				return;
			}

			const buttonIndex = item.buttons?.indexOf(button) ?? -1;
			if (buttonIndex >= 0) {
				const result = item.trigger(buttonIndex, picker.keyMods);
				const action = (typeof result === 'number') ? result : await result;

				if (token.isCancellationRequested) {
					return;
				}

				switch (action) {
					case TriggerAction.NO_ACTION:
						break;
					case TriggerAction.CLOSE_PICKER:
						picker.hide();
						break;
					case TriggerAction.REFRESH_PICKER:
						updatePickerItems();
						break;
					case TriggerAction.REMOVE_ITEM: {
						const index = picker.items.indexOf(item);
						if (index !== -1) {
							const items = picker.items.slice();
							const removed = items.splice(index, 1);
							const activeItems = picker.activeItems.filter(activeItem => activeItem !== removed[0]);
							const keepScrollPositionBefore = picker.keepScrollPosition;
							picker.keepScrollPosition = true;
							picker.items = items;
							if (activeItems) {
								picker.activeItems = activeItems;
							}
							picker.keepScrollPosition = keepScrollPositionBefore;
						}
						break;
					}
				}
			}
		};

		// Trigger the pick with button index if button triggered
		disposables.add(picker.onDidTriggerItemButton(({ button, item }) => buttonTrigger(button, item)));
		disposables.add(picker.onDidTriggerSeparatorButton(({ button, separator }) => buttonTrigger(button, separator)));

		return disposables;
	}

	/**
	 * Returns an array of picks and separators as needed. If the picks are resolved
	 * long running, the provided cancellation token should be used to cancel the
	 * operation when the token signals this.
	 *
	 * The implementor is responsible for filtering and sorting the picks given the
	 * provided `filter`.
	 *
	 * @param filter a filter to apply to the picks.
	 * @param disposables can be used to register disposables that should be cleaned
	 * up when the picker closes.
	 * @param token for long running tasks, implementors need to check on cancellation
	 * through this token.
	 * @returns the picks either directly, as promise or combined fast and slow results.
	 * Pickers can return `null` to signal that no change in picks is needed.
	 */
	protected abstract _getPicks(filter: string, disposables: DisposableStore, token: CancellationToken, runOptions?: IQuickAccessProviderRunOptions): Picks<T> | Promise<Picks<T> | FastAndSlowPicks<T>> | FastAndSlowPicks<T> | null;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/browser/quickAccess.ts]---
Location: vscode-main/src/vs/platform/quickinput/browser/quickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DeferredPromise } from '../../../base/common/async.js';
import { CancellationTokenSource } from '../../../base/common/cancellation.js';
import { Event } from '../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable, isDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { IInstantiationService } from '../../instantiation/common/instantiation.js';
import { DefaultQuickAccessFilterValue, Extensions, IQuickAccessController, IQuickAccessOptions, IQuickAccessProvider, IQuickAccessProviderDescriptor, IQuickAccessRegistry } from '../common/quickAccess.js';
import { IQuickInputService, IQuickPick, IQuickPickItem, ItemActivation } from '../common/quickInput.js';
import { Registry } from '../../registry/common/platform.js';

export class QuickAccessController extends Disposable implements IQuickAccessController {

	private readonly registry = Registry.as<IQuickAccessRegistry>(Extensions.Quickaccess);
	private readonly mapProviderToDescriptor = new Map<IQuickAccessProviderDescriptor, IQuickAccessProvider>();

	private readonly lastAcceptedPickerValues = new Map<IQuickAccessProviderDescriptor, string>();

	private visibleQuickAccess: {
		readonly picker: IQuickPick<IQuickPickItem, { useSeparators: true }>;
		readonly descriptor: IQuickAccessProviderDescriptor | undefined;
		readonly value: string;
	} | undefined = undefined;

	constructor(
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();
		this._register(toDisposable(() => {
			for (const provider of this.mapProviderToDescriptor.values()) {
				if (isDisposable(provider)) {
					provider.dispose();
				}
			}

			this.visibleQuickAccess?.picker.dispose();
		}));
	}

	pick(value = '', options?: IQuickAccessOptions): Promise<IQuickPickItem[] | undefined> {
		return this.doShowOrPick(value, true, options);
	}

	show(value = '', options?: IQuickAccessOptions): void {
		this.doShowOrPick(value, false, options);
	}

	private doShowOrPick(value: string, pick: true, options?: IQuickAccessOptions): Promise<IQuickPickItem[] | undefined>;
	private doShowOrPick(value: string, pick: false, options?: IQuickAccessOptions): void;
	private doShowOrPick(value: string, pick: boolean, options?: IQuickAccessOptions): Promise<IQuickPickItem[] | undefined> | void {

		// Find provider for the value to show
		const [provider, descriptor] = this.getOrInstantiateProvider(value, options?.enabledProviderPrefixes);

		// Return early if quick access is already showing on that same prefix
		const visibleQuickAccess = this.visibleQuickAccess;
		const visibleDescriptor = visibleQuickAccess?.descriptor;
		if (visibleQuickAccess && descriptor && visibleDescriptor === descriptor) {

			// Apply value only if it is more specific than the prefix
			// from the provider and we are not instructed to preserve
			if (value !== descriptor.prefix && !options?.preserveValue) {
				visibleQuickAccess.picker.value = value;
			}

			// Always adjust selection
			this.adjustValueSelection(visibleQuickAccess.picker, descriptor, options);

			return;
		}

		// Rewrite the filter value based on certain rules unless disabled
		if (descriptor && !options?.preserveValue) {
			let newValue: string | undefined = undefined;

			// If we have a visible provider with a value, take it's filter value but
			// rewrite to new provider prefix in case they differ
			if (visibleQuickAccess && visibleDescriptor && visibleDescriptor !== descriptor) {
				const newValueCandidateWithoutPrefix = visibleQuickAccess.value.substr(visibleDescriptor.prefix.length);
				if (newValueCandidateWithoutPrefix) {
					newValue = `${descriptor.prefix}${newValueCandidateWithoutPrefix}`;
				}
			}

			// Otherwise, take a default value as instructed
			if (!newValue) {
				const defaultFilterValue = provider?.defaultFilterValue;
				if (defaultFilterValue === DefaultQuickAccessFilterValue.LAST) {
					newValue = this.lastAcceptedPickerValues.get(descriptor);
				} else if (typeof defaultFilterValue === 'string') {
					newValue = `${descriptor.prefix}${defaultFilterValue}`;
				}
			}

			if (typeof newValue === 'string') {
				value = newValue;
			}
		}

		// Store the existing selection if there was one.
		const visibleSelection = visibleQuickAccess?.picker?.valueSelection;
		const visibleValue = visibleQuickAccess?.picker?.value;

		// Create a picker for the provider to use with the initial value
		// and adjust the filtering to exclude the prefix from filtering
		const disposables = new DisposableStore();
		const picker = disposables.add(this.quickInputService.createQuickPick({ useSeparators: true }));
		picker.value = value;
		this.adjustValueSelection(picker, descriptor, options);
		picker.placeholder = options?.placeholder ?? descriptor?.placeholder;
		picker.quickNavigate = options?.quickNavigateConfiguration;
		picker.hideInput = !!picker.quickNavigate && !visibleQuickAccess; // only hide input if there was no picker opened already
		if (typeof options?.itemActivation === 'number' || options?.quickNavigateConfiguration) {
			picker.itemActivation = options?.itemActivation ?? ItemActivation.SECOND /* quick nav is always second */;
		}
		picker.contextKey = descriptor?.contextKey;
		picker.filterValue = (value: string) => value.substring(descriptor ? descriptor.prefix.length : 0);

		// Pick mode: setup a promise that can be resolved
		// with the selected items and prevent execution
		let pickPromise: DeferredPromise<IQuickPickItem[]> | undefined = undefined;
		if (pick) {
			pickPromise = new DeferredPromise<IQuickPickItem[]>();
			disposables.add(Event.once(picker.onWillAccept)(e => {
				e.veto();
				picker.hide();
			}));
		}

		// Register listeners
		disposables.add(this.registerPickerListeners(picker, provider, descriptor, value, options));

		// Ask provider to fill the picker as needed if we have one
		// and pass over a cancellation token that will indicate when
		// the picker is hiding without a pick being made.
		const cts = disposables.add(new CancellationTokenSource());
		if (provider) {
			disposables.add(provider.provide(picker, cts.token, options?.providerOptions));
		}

		// Finally, trigger disposal and cancellation when the picker
		// hides depending on items selected or not.
		Event.once(picker.onDidHide)(() => {
			if (picker.selectedItems.length === 0) {
				cts.cancel();
			}

			// Start to dispose once picker hides
			disposables.dispose();

			// Resolve pick promise with selected items
			pickPromise?.complete(picker.selectedItems.slice(0));
		});

		// Finally, show the picker. This is important because a provider
		// may not call this and then our disposables would leak that rely
		// on the onDidHide event.
		picker.show();

		// If the previous picker had a selection and the value is unchanged, we should set that in the new picker.
		if (visibleSelection && visibleValue === value) {
			picker.valueSelection = visibleSelection;
		}

		// Pick mode: return with promise
		if (pick) {
			return pickPromise?.p;
		}
	}

	private adjustValueSelection(picker: IQuickPick<IQuickPickItem, { useSeparators: true }>, descriptor?: IQuickAccessProviderDescriptor, options?: IQuickAccessOptions): void {
		let valueSelection: [number, number];

		// Preserve: just always put the cursor at the end
		if (options?.preserveValue) {
			valueSelection = [picker.value.length, picker.value.length];
		}

		// Otherwise: select the value up until the prefix
		else {
			valueSelection = [descriptor?.prefix.length ?? 0, picker.value.length];
		}

		picker.valueSelection = valueSelection;
	}

	private registerPickerListeners(
		picker: IQuickPick<IQuickPickItem, { useSeparators: true }>,
		provider: IQuickAccessProvider | undefined,
		descriptor: IQuickAccessProviderDescriptor | undefined,
		value: string,
		options?: IQuickAccessOptions
	): IDisposable {
		const disposables = new DisposableStore();

		// Remember as last visible picker and clean up once picker get's disposed
		const visibleQuickAccess = this.visibleQuickAccess = { picker, descriptor, value };
		disposables.add(toDisposable(() => {
			if (visibleQuickAccess === this.visibleQuickAccess) {
				this.visibleQuickAccess = undefined;
			}
		}));

		// Whenever the value changes, check if the provider has
		// changed and if so - re-create the picker from the beginning
		disposables.add(picker.onDidChangeValue(value => {
			const [providerForValue] = this.getOrInstantiateProvider(value, options?.enabledProviderPrefixes);
			if (providerForValue !== provider) {
				this.show(value, {
					enabledProviderPrefixes: options?.enabledProviderPrefixes,
					// do not rewrite value from user typing!
					preserveValue: true,
					// persist the value of the providerOptions from the original showing
					providerOptions: options?.providerOptions
				});
			} else {
				visibleQuickAccess.value = value; // remember the value in our visible one
			}
		}));

		// Remember picker input for future use when accepting
		if (descriptor) {
			disposables.add(picker.onDidAccept(() => {
				this.lastAcceptedPickerValues.set(descriptor, picker.value);
			}));
		}

		return disposables;
	}

	private getOrInstantiateProvider(value: string, enabledProviderPrefixes?: string[]): [IQuickAccessProvider | undefined, IQuickAccessProviderDescriptor | undefined] {
		const providerDescriptor = this.registry.getQuickAccessProvider(value);
		if (!providerDescriptor || enabledProviderPrefixes && !enabledProviderPrefixes?.includes(providerDescriptor.prefix)) {
			return [undefined, undefined];
		}

		let provider = this.mapProviderToDescriptor.get(providerDescriptor);
		if (!provider) {
			provider = this.instantiationService.createInstance(providerDescriptor.ctor);
			this.mapProviderToDescriptor.set(providerDescriptor, provider);
		}

		return [provider, providerDescriptor];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/browser/quickInput.ts]---
Location: vscode-main/src/vs/platform/quickinput/browser/quickInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../base/browser/keyboardEvent.js';
import { ActionBar } from '../../../base/browser/ui/actionbar/actionbar.js';
import { Button, IButtonStyles } from '../../../base/browser/ui/button/button.js';
import { CountBadge, ICountBadgeStyles } from '../../../base/browser/ui/countBadge/countBadge.js';
import { IHoverDelegate, IHoverDelegateOptions } from '../../../base/browser/ui/hover/hoverDelegate.js';
import { IInputBoxStyles } from '../../../base/browser/ui/inputbox/inputBox.js';
import { IKeybindingLabelStyles } from '../../../base/browser/ui/keybindingLabel/keybindingLabel.js';
import { IListStyles } from '../../../base/browser/ui/list/listWidget.js';
import { IProgressBarStyles, ProgressBar } from '../../../base/browser/ui/progressbar/progressbar.js';
import { IToggleStyles, Toggle, TriStateCheckbox } from '../../../base/browser/ui/toggle/toggle.js';
import { equals } from '../../../base/common/arrays.js';
import { TimeoutTimer } from '../../../base/common/async.js';
import { Codicon } from '../../../base/common/codicons.js';
import { Emitter, Event, EventBufferer } from '../../../base/common/event.js';
import { KeyCode } from '../../../base/common/keyCodes.js';
import { Disposable, DisposableStore } from '../../../base/common/lifecycle.js';
import { isIOS } from '../../../base/common/platform.js';
import Severity from '../../../base/common/severity.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import './media/quickInput.css';
import { localize } from '../../../nls.js';
import { IInputBox, IKeyMods, IQuickInput, IQuickInputButton, IQuickInputHideEvent, IQuickInputToggle, IQuickNavigateConfiguration, IQuickPick, IQuickPickDidAcceptEvent, IQuickPickItem, IQuickPickItemButtonEvent, IQuickPickSeparator, IQuickPickSeparatorButtonEvent, IQuickPickWillAcceptEvent, IQuickWidget, ItemActivation, NO_KEY_MODS, QuickInputButtonLocation, QuickInputHideReason, QuickInputType, QuickPickFocus } from '../common/quickInput.js';
import { QuickInputBox } from './quickInputBox.js';
import { quickInputButtonToAction, renderQuickInputDescription } from './quickInputUtils.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IHoverService, WorkbenchHoverDelegate } from '../../hover/browser/hover.js';
import { QuickInputList } from './quickInputList.js';
import type { IHoverOptions } from '../../../base/browser/ui/hover/hover.js';
import { ContextKeyExpr, RawContextKey } from '../../contextkey/common/contextkey.js';
import { QuickInputTreeController } from './tree/quickInputTreeController.js';
import { observableValue } from '../../../base/common/observable.js';

export const inQuickInputContextKeyValue = 'inQuickInput';
export const InQuickInputContextKey = new RawContextKey<boolean>(inQuickInputContextKeyValue, false, localize('inQuickInput', "Whether keyboard focus is inside the quick input control"));
export const inQuickInputContext = ContextKeyExpr.has(inQuickInputContextKeyValue);

export const quickInputAlignmentContextKeyValue = 'quickInputAlignment';
export const QuickInputAlignmentContextKey = new RawContextKey<'top' | 'center' | undefined>(quickInputAlignmentContextKeyValue, 'top', localize('quickInputAlignment', "The alignment of the quick input"));

export const quickInputTypeContextKeyValue = 'quickInputType';
export const QuickInputTypeContextKey = new RawContextKey<QuickInputType>(quickInputTypeContextKeyValue, undefined, localize('quickInputType', "The type of the currently visible quick input"));

export const endOfQuickInputBoxContextKeyValue = 'cursorAtEndOfQuickInputBox';
export const EndOfQuickInputBoxContextKey = new RawContextKey<boolean>(endOfQuickInputBoxContextKeyValue, false, localize('cursorAtEndOfQuickInputBox', "Whether the cursor in the quick input is at the end of the input box"));
export const endOfQuickInputBoxContext = ContextKeyExpr.has(endOfQuickInputBoxContextKeyValue);

export interface IQuickInputOptions {
	idPrefix: string;
	container: HTMLElement;
	ignoreFocusOut(): boolean;
	backKeybindingLabel(): string | undefined;
	setContextKey(id?: string): void;
	linkOpenerDelegate(content: string): void;
	returnFocus(): void;
	/**
	 * @todo With IHover in vs/editor, can we depend on the service directly
	 * instead of passing it through a hover delegate?
	 */
	hoverDelegate: IHoverDelegate;
	styles: IQuickInputStyles;
}

export interface IQuickInputStyles {
	readonly widget: IQuickInputWidgetStyles;
	readonly inputBox: IInputBoxStyles;
	readonly toggle: IToggleStyles;
	readonly countBadge: ICountBadgeStyles;
	readonly button: IButtonStyles;
	readonly progressBar: IProgressBarStyles;
	readonly keybindingLabel: IKeybindingLabelStyles;
	readonly list: IListStyles;
	readonly pickerGroup: { pickerGroupBorder: string | undefined; pickerGroupForeground: string | undefined };
}

export interface IQuickInputWidgetStyles {
	readonly quickInputBackground: string | undefined;
	readonly quickInputForeground: string | undefined;
	readonly quickInputTitleBackground: string | undefined;
	readonly widgetBorder: string | undefined;
	readonly widgetShadow: string | undefined;
}

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export const backButton = {
	iconClass: ThemeIcon.asClassName(Codicon.quickInputBack),
	tooltip: localize('quickInput.back', "Back"),
	handle: -1 // TODO
};

export interface QuickInputUI {
	container: HTMLElement;
	styleSheet: HTMLStyleElement;
	leftActionBar: ActionBar;
	titleBar: HTMLElement;
	title: HTMLElement;
	description1: HTMLElement;
	description2: HTMLElement;
	widget: HTMLElement;
	rightActionBar: ActionBar;
	inlineActionBar: ActionBar;
	checkAll: TriStateCheckbox;
	inputContainer: HTMLElement;
	filterContainer: HTMLElement;
	inputBox: QuickInputBox;
	visibleCountContainer: HTMLElement;
	visibleCount: CountBadge;
	countContainer: HTMLElement;
	count: CountBadge;
	okContainer: HTMLElement;
	ok: Button;
	message: HTMLElement;
	customButtonContainer: HTMLElement;
	customButton: Button;
	progressBar: ProgressBar;
	list: QuickInputList;
	tree: QuickInputTreeController;
	readonly onDidAccept: Event<void>;
	readonly onDidCustom: Event<void>;
	readonly onDidTriggerButton: Event<IQuickInputButton>;
	ignoreFocusOut: boolean;
	keyMods: Writeable<IKeyMods>;
	show(controller: QuickInput): void;
	setVisibilities(visibilities: Visibilities): void;
	setEnabled(enabled: boolean): void;
	setContextKey(contextKey?: string): void;
	linkOpenerDelegate(content: string): void;
	hide(): void;
}

export type Visibilities = {
	title?: boolean;
	description?: boolean;
	checkAll?: boolean;
	inputBox?: boolean;
	checkBox?: boolean;
	visibleCount?: boolean;
	count?: boolean;
	message?: boolean;
	list?: boolean;
	tree?: boolean;
	ok?: boolean;
	customButton?: boolean;
	progressBar?: boolean;
};

export abstract class QuickInput extends Disposable implements IQuickInput {
	protected static readonly noPromptMessage = localize('inputModeEntry', "Press 'Enter' to confirm your input or 'Escape' to cancel");

	protected _visible = observableValue('visible', false);
	private _title: string | undefined;
	private _description: string | undefined;
	private _widget: HTMLElement | undefined;
	private _widgetUpdated = false;
	private _steps: number | undefined;
	private _totalSteps: number | undefined;
	private _enabled = true;
	private _contextKey: string | undefined;
	private _busy = false;
	private _ignoreFocusOut = false;
	private _leftButtons: IQuickInputButton[] = [];
	private _rightButtons: IQuickInputButton[] = [];
	private _inlineButtons: IQuickInputButton[] = [];
	private _inputButtons: IQuickInputButton[] = [];
	private buttonsUpdated = false;
	private _toggles: IQuickInputToggle[] = [];
	private togglesUpdated = false;
	protected noValidationMessage: string | undefined = QuickInput.noPromptMessage;
	private _validationMessage: string | undefined;
	private _lastValidationMessage: string | undefined;
	private _severity: Severity = Severity.Ignore;
	private _lastSeverity: Severity | undefined;
	private readonly onDidTriggerButtonEmitter = this._register(new Emitter<IQuickInputButton>());
	private readonly onDidHideEmitter = this._register(new Emitter<IQuickInputHideEvent>());
	private readonly onWillHideEmitter = this._register(new Emitter<IQuickInputHideEvent>());
	private readonly onDisposeEmitter = this._register(new Emitter<void>());

	protected readonly visibleDisposables = this._register(new DisposableStore());

	private busyDelay: TimeoutTimer | undefined;

	abstract type: QuickInputType;

	constructor(
		protected ui: QuickInputUI
	) {
		super();
	}

	protected get visible(): boolean {
		return this._visible.get();
	}

	get title() {
		return this._title;
	}

	set title(title: string | undefined) {
		this._title = title;
		this.update();
	}

	get description() {
		return this._description;
	}

	set description(description: string | undefined) {
		this._description = description;
		this.update();
	}

	get widget() {
		return this._widget;
	}

	set widget(widget: unknown | undefined) {
		if (!(dom.isHTMLElement(widget))) {
			return;
		}
		if (this._widget !== widget) {
			this._widget = widget;
			this._widgetUpdated = true;
			this.update();
		}
	}

	get step() {
		return this._steps;
	}

	set step(step: number | undefined) {
		this._steps = step;
		this.update();
	}

	get totalSteps() {
		return this._totalSteps;
	}

	set totalSteps(totalSteps: number | undefined) {
		this._totalSteps = totalSteps;
		this.update();
	}

	get enabled() {
		return this._enabled;
	}

	set enabled(enabled: boolean) {
		this._enabled = enabled;
		this.update();
	}

	get contextKey() {
		return this._contextKey;
	}

	set contextKey(contextKey: string | undefined) {
		this._contextKey = contextKey;
		this.update();
	}

	get busy() {
		return this._busy;
	}

	set busy(busy: boolean) {
		this._busy = busy;
		this.update();
	}

	get ignoreFocusOut() {
		return this._ignoreFocusOut;
	}

	set ignoreFocusOut(ignoreFocusOut: boolean) {
		const shouldUpdate = this._ignoreFocusOut !== ignoreFocusOut && !isIOS;
		this._ignoreFocusOut = ignoreFocusOut && !isIOS;
		if (shouldUpdate) {
			this.update();
		}
	}

	protected get titleButtons() {
		return this._leftButtons.length
			? [...this._leftButtons, this._rightButtons]
			: this._rightButtons;
	}

	get buttons() {
		return [
			...this._leftButtons,
			...this._rightButtons,
			...this._inlineButtons,
			...this._inputButtons
		];
	}

	set buttons(buttons: IQuickInputButton[]) {
		const leftButtons: IQuickInputButton[] = [];
		const rightButtons: IQuickInputButton[] = [];
		const inlineButtons: IQuickInputButton[] = [];
		const inputButtons: IQuickInputButton[] = [];

		for (const button of buttons) {
			if (button === backButton) {
				leftButtons.push(button);
			} else {
				switch (button.location) {
					case QuickInputButtonLocation.Inline:
						inlineButtons.push(button);
						break;
					case QuickInputButtonLocation.Input:
						inputButtons.push(button);
						break;
					default:
						rightButtons.push(button);
						break;
				}
			}
		}

		this._leftButtons = leftButtons;
		this._rightButtons = rightButtons;
		this._inlineButtons = inlineButtons;
		this._inputButtons = inputButtons;
		this.buttonsUpdated = true;
		this.update();
	}

	get toggles() {
		return this._toggles;
	}

	set toggles(toggles: IQuickInputToggle[]) {
		this._toggles = toggles ?? [];
		this.togglesUpdated = true;
		this.update();
	}

	get validationMessage() {
		return this._validationMessage;
	}

	set validationMessage(validationMessage: string | undefined) {
		this._validationMessage = validationMessage;
		this.update();
	}

	get severity() {
		return this._severity;
	}

	set severity(severity: Severity) {
		this._severity = severity;
		this.update();
	}

	readonly onDidTriggerButton = this.onDidTriggerButtonEmitter.event;

	show(): void {
		if (this.visible) {
			return;
		}
		this.visibleDisposables.add(
			this.ui.onDidTriggerButton(button => {
				if (this.buttons.indexOf(button) !== -1) {
					this.onDidTriggerButtonEmitter.fire(button);
				}
			}),
		);
		this.ui.show(this);

		// update properties in the controller that get reset in the ui.show() call
		this._visible.set(true, undefined);
		// This ensures the message/prompt gets rendered
		this._lastValidationMessage = undefined;
		// This ensures the input box has the right severity applied
		this._lastSeverity = undefined;
		if (this.buttons.length) {
			// if there are buttons, the ui.show() clears them out of the UI so we should
			// rerender them.
			this.buttonsUpdated = true;
		}
		if (this.toggles.length) {
			// if there are toggles, the ui.show() clears them out of the UI so we should
			// rerender them.
			this.togglesUpdated = true;
		}

		this.update();
	}

	hide(): void {
		if (!this.visible) {
			return;
		}
		this.ui.hide();
	}

	didHide(reason = QuickInputHideReason.Other): void {
		this._visible.set(false, undefined);
		this.visibleDisposables.clear();
		this.onDidHideEmitter.fire({ reason });
	}

	readonly onDidHide = this.onDidHideEmitter.event;

	willHide(reason = QuickInputHideReason.Other): void {
		this.onWillHideEmitter.fire({ reason });
	}
	readonly onWillHide = this.onWillHideEmitter.event;

	protected update() {
		if (!this.visible) {
			return;
		}
		const title = this.getTitle();
		if (title && this.ui.title.textContent !== title) {
			this.ui.title.textContent = title;
		} else if (!title && this.ui.title.innerHTML !== '&nbsp;') {
			this.ui.title.innerText = '\u00a0';
		}
		const description = this.getDescription();
		if (this.ui.description1.textContent !== description) {
			this.ui.description1.textContent = description;
		}
		if (this.ui.description2.textContent !== description) {
			this.ui.description2.textContent = description;
		}
		if (this._widgetUpdated) {
			this._widgetUpdated = false;
			if (this._widget) {
				dom.reset(this.ui.widget, this._widget);
			} else {
				dom.reset(this.ui.widget);
			}
		}
		if (this.busy && !this.busyDelay) {
			this.busyDelay = new TimeoutTimer();
			this.busyDelay.setIfNotSet(() => {
				if (this.visible) {
					this.ui.progressBar.infinite();
					this.ui.progressBar.getContainer().removeAttribute('aria-hidden');
				}
			}, 800);
		}
		if (!this.busy && this.busyDelay) {
			this.ui.progressBar.stop();
			this.ui.progressBar.getContainer().setAttribute('aria-hidden', 'true');
			this.busyDelay.cancel();
			this.busyDelay = undefined;
		}
		if (this.buttonsUpdated) {
			this.buttonsUpdated = false;
			this.ui.leftActionBar.clear();
			const leftButtons = this._leftButtons
				.map((button, index) => quickInputButtonToAction(
					button,
					`id-${index}`,
					async () => this.onDidTriggerButtonEmitter.fire(button)
				));
			this.ui.leftActionBar.push(leftButtons, { icon: true, label: false });
			this.ui.rightActionBar.clear();
			const rightButtons = this._rightButtons
				.map((button, index) => quickInputButtonToAction(
					button,
					`id-${index}`,
					async () => this.onDidTriggerButtonEmitter.fire(button)
				));
			this.ui.rightActionBar.push(rightButtons, { icon: true, label: false });
			this.ui.inlineActionBar.clear();
			const inlineButtons = this._inlineButtons
				.map((button, index) => quickInputButtonToAction(
					button,
					`id-${index}`,
					async () => this.onDidTriggerButtonEmitter.fire(button)
				));
			this.ui.inlineActionBar.push(inlineButtons, { icon: true, label: false });
			this.ui.inputBox.actions = this._inputButtons
				.map((button, index) => quickInputButtonToAction(
					button,
					`id-${index}`,
					async () => this.onDidTriggerButtonEmitter.fire(button)
				));
		}
		if (this.togglesUpdated) {
			this.togglesUpdated = false;
			// HACK: Filter out toggles here that are not concrete Toggle objects. This is to workaround
			// a layering issue as quick input's interface is in common but Toggle is in browser and
			// it requires a HTMLElement on its interface
			const concreteToggles = this.toggles?.filter(opts => opts instanceof Toggle) ?? [];
			this.ui.inputBox.toggles = concreteToggles;
			// Adjust count badge position based on number of toggles (each toggle is ~22px wide)
			const toggleOffset = concreteToggles.length * 22;
			this.ui.countContainer.style.right = toggleOffset > 0 ? `${4 + toggleOffset}px` : '4px';
		}
		this.ui.ignoreFocusOut = this.ignoreFocusOut;
		this.ui.setEnabled(this.enabled);
		this.ui.setContextKey(this.contextKey);

		const validationMessage = this.validationMessage || this.noValidationMessage;
		if (this._lastValidationMessage !== validationMessage) {
			this._lastValidationMessage = validationMessage;
			dom.reset(this.ui.message);
			if (validationMessage) {
				renderQuickInputDescription(validationMessage, this.ui.message, {
					callback: (content) => {
						this.ui.linkOpenerDelegate(content);
					},
					disposables: this.visibleDisposables,
				});
			}
		}
		if (this._lastSeverity !== this.severity) {
			this._lastSeverity = this.severity;
			this.showMessageDecoration(this.severity);
		}
	}

	private getTitle() {
		if (this.title && this.step) {
			return `${this.title} (${this.getSteps()})`;
		}
		if (this.title) {
			return this.title;
		}
		if (this.step) {
			return this.getSteps();
		}
		return '';
	}

	private getDescription() {
		return this.description || '';
	}

	private getSteps() {
		if (this.step && this.totalSteps) {
			return localize('quickInput.steps', "{0}/{1}", this.step, this.totalSteps);
		}
		if (this.step) {
			return String(this.step);
		}
		return '';
	}

	protected showMessageDecoration(severity: Severity) {
		this.ui.inputBox.showDecoration(severity);
		if (severity !== Severity.Ignore) {
			const styles = this.ui.inputBox.stylesForType(severity);
			this.ui.message.style.color = styles.foreground ? `${styles.foreground}` : '';
			this.ui.message.style.backgroundColor = styles.background ? `${styles.background}` : '';
			this.ui.message.style.border = styles.border ? `1px solid ${styles.border}` : '';
			this.ui.message.style.marginBottom = '-2px';
		} else {
			this.ui.message.style.color = '';
			this.ui.message.style.backgroundColor = '';
			this.ui.message.style.border = '';
			this.ui.message.style.marginBottom = '';
		}
	}

	readonly onDispose = this.onDisposeEmitter.event;

	override dispose(): void {
		this.hide();
		this.onDisposeEmitter.fire();

		super.dispose();
	}
}

export class QuickPick<T extends IQuickPickItem, O extends { useSeparators: boolean } = { useSeparators: false }> extends QuickInput implements IQuickPick<T, O> {

	private static readonly DEFAULT_ARIA_LABEL = localize('quickInputBox.ariaLabel', "Type to narrow down results.");

	private _value = '';
	private _ariaLabel: string | undefined;
	private _placeholder: string | undefined;
	private readonly onDidChangeValueEmitter = this._register(new Emitter<string>());
	private readonly onWillAcceptEmitter = this._register(new Emitter<IQuickPickWillAcceptEvent>());
	private readonly onDidAcceptEmitter = this._register(new Emitter<IQuickPickDidAcceptEvent>());
	private readonly onDidCustomEmitter = this._register(new Emitter<void>());
	private _items: O extends { useSeparators: true } ? Array<T | IQuickPickSeparator> : Array<T> = [];
	private itemsUpdated = false;
	private _canSelectMany = false;
	private _canAcceptInBackground = false;
	private _matchOnDescription = false;
	private _matchOnDetail = false;
	private _matchOnLabel = true;
	private _matchOnLabelMode: 'fuzzy' | 'contiguous' = 'fuzzy';
	private _sortByLabel = true;
	private _keepScrollPosition = false;
	private _itemActivation = ItemActivation.FIRST;
	private _activeItems: T[] = [];
	private activeItemsUpdated = false;
	private activeItemsToConfirm: T[] | null = [];
	private readonly onDidChangeActiveEmitter = this._register(new Emitter<T[]>());
	private _selectedItems: T[] = [];
	private selectedItemsUpdated = false;
	private selectedItemsToConfirm: T[] | null = [];
	private readonly onDidChangeSelectionEmitter = this._register(new Emitter<T[]>());
	private readonly onDidTriggerItemButtonEmitter = this._register(new Emitter<IQuickPickItemButtonEvent<T>>());
	private readonly onDidTriggerSeparatorButtonEmitter = this._register(new Emitter<IQuickPickSeparatorButtonEvent>());
	private _valueSelection: Readonly<[number, number]> | undefined;
	private valueSelectionUpdated = true;
	private _ok: boolean | 'default' = 'default';
	private _okLabel: string | undefined;
	private _customButton = false;
	private _customButtonLabel: string | undefined;
	private _customButtonHover: string | undefined;
	private _customButtonSecondary = false;
	private _quickNavigate: IQuickNavigateConfiguration | undefined;
	private _hideInput: boolean | undefined;
	private _hideCountBadge: boolean | undefined;
	private _hideCheckAll: boolean | undefined;
	private _focusEventBufferer = new EventBufferer();

	readonly type = QuickInputType.QuickPick;

	constructor(ui: QuickInputUI) {
		super(ui);
		this.noValidationMessage = undefined;
	}

	get quickNavigate() {
		return this._quickNavigate;
	}

	set quickNavigate(quickNavigate: IQuickNavigateConfiguration | undefined) {
		this._quickNavigate = quickNavigate;
		this.update();
	}

	get value() {
		return this._value;
	}

	set value(value: string) {
		this.doSetValue(value);
	}

	private doSetValue(value: string, skipUpdate?: boolean): void {
		if (this._value !== value) {
			this._value = value;
			if (!skipUpdate) {
				this.update();
			}
			if (this.visible) {
				const didFilter = this.ui.list.filter(this.filterValue(this._value));
				if (didFilter) {
					this.trySelectFirst();
				}
			}
			this.onDidChangeValueEmitter.fire(this._value);
		}
	}

	filterValue = (value: string) => value;

	set ariaLabel(ariaLabel: string | undefined) {
		this._ariaLabel = ariaLabel;
		this.update();
	}

	get ariaLabel() {
		return this._ariaLabel;
	}

	get placeholder() {
		return this._placeholder;
	}

	set placeholder(placeholder: string | undefined) {
		this._placeholder = placeholder;
		this.update();
	}

	get prompt() {
		return this.noValidationMessage;
	}

	set prompt(prompt: string | undefined) {
		this.noValidationMessage = prompt;
		this.update();
	}

	onDidChangeValue = this.onDidChangeValueEmitter.event;

	onWillAccept = this.onWillAcceptEmitter.event;
	onDidAccept = this.onDidAcceptEmitter.event;

	onDidCustom = this.onDidCustomEmitter.event;

	get items() {
		return this._items;
	}

	get scrollTop() {
		return this.ui.list.scrollTop;
	}

	private set scrollTop(scrollTop: number) {
		this.ui.list.scrollTop = scrollTop;
	}

	set items(items: O extends { useSeparators: true } ? Array<T | IQuickPickSeparator> : Array<T>) {
		this._items = items;
		this.itemsUpdated = true;
		this.update();
	}

	get canSelectMany() {
		return this._canSelectMany;
	}

	set canSelectMany(canSelectMany: boolean) {
		this._canSelectMany = canSelectMany;
		this.update();
	}

	get canAcceptInBackground() {
		return this._canAcceptInBackground;
	}

	set canAcceptInBackground(canAcceptInBackground: boolean) {
		this._canAcceptInBackground = canAcceptInBackground;
	}

	get matchOnDescription() {
		return this._matchOnDescription;
	}

	set matchOnDescription(matchOnDescription: boolean) {
		this._matchOnDescription = matchOnDescription;
		this.update();
	}

	get matchOnDetail() {
		return this._matchOnDetail;
	}

	set matchOnDetail(matchOnDetail: boolean) {
		this._matchOnDetail = matchOnDetail;
		this.update();
	}

	get matchOnLabel() {
		return this._matchOnLabel;
	}

	set matchOnLabel(matchOnLabel: boolean) {
		this._matchOnLabel = matchOnLabel;
		this.update();
	}

	get matchOnLabelMode() {
		return this._matchOnLabelMode;
	}

	set matchOnLabelMode(matchOnLabelMode: 'fuzzy' | 'contiguous') {
		this._matchOnLabelMode = matchOnLabelMode;
		this.update();
	}

	get sortByLabel() {
		return this._sortByLabel;
	}

	set sortByLabel(sortByLabel: boolean) {
		this._sortByLabel = sortByLabel;
		this.update();
	}

	get keepScrollPosition() {
		return this._keepScrollPosition;
	}

	set keepScrollPosition(keepScrollPosition: boolean) {
		this._keepScrollPosition = keepScrollPosition;
	}

	get itemActivation() {
		return this._itemActivation;
	}

	set itemActivation(itemActivation: ItemActivation) {
		this._itemActivation = itemActivation;
	}

	get activeItems() {
		return this._activeItems;
	}

	set activeItems(activeItems: T[]) {
		this._activeItems = activeItems;
		this.activeItemsUpdated = true;
		this.update();
	}

	onDidChangeActive = this.onDidChangeActiveEmitter.event;

	get selectedItems() {
		return this._selectedItems;
	}

	set selectedItems(selectedItems: T[]) {
		this._selectedItems = selectedItems;
		this.selectedItemsUpdated = true;
		this.update();
	}

	get keyMods() {
		if (this._quickNavigate) {
			// Disable keyMods when quick navigate is enabled
			// because in this model the interaction is purely
			// keyboard driven and Ctrl/Alt are typically
			// pressed and hold during this interaction.
			return NO_KEY_MODS;
		}
		return this.ui.keyMods;
	}

	get valueSelection() {
		const selection = this.ui.inputBox.getSelection();
		if (!selection) {
			return undefined;
		}
		return [selection.start, selection.end];
	}

	set valueSelection(valueSelection: Readonly<[number, number]> | undefined) {
		this._valueSelection = valueSelection;
		this.valueSelectionUpdated = true;
		this.update();
	}

	get customButton() {
		return this._customButton;
	}

	set customButton(showCustomButton: boolean) {
		this._customButton = showCustomButton;
		this.update();
	}

	get customLabel() {
		return this._customButtonLabel;
	}

	set customLabel(label: string | undefined) {
		this._customButtonLabel = label;
		this.update();
	}

	get customHover() {
		return this._customButtonHover;
	}

	set customHover(hover: string | undefined) {
		this._customButtonHover = hover;
		this.update();
	}

	get customButtonSecondary() {
		return this._customButtonSecondary;
	}

	set customButtonSecondary(secondary: boolean | undefined) {
		this._customButtonSecondary = secondary ?? false;
		this.update();
	}

	get ok() {
		return this._ok;
	}

	set ok(showOkButton: boolean | 'default') {
		this._ok = showOkButton;
		this.update();
	}

	get okLabel() {
		return this._okLabel ?? localize('ok', "OK");
	}

	set okLabel(okLabel: string | undefined) {
		this._okLabel = okLabel;
		this.update();
	}

	inputHasFocus(): boolean {
		return this.visible ? this.ui.inputBox.hasFocus() : false;
	}

	focusOnInput() {
		this.ui.inputBox.setFocus();
	}

	get hideInput() {
		return !!this._hideInput;
	}

	set hideInput(hideInput: boolean) {
		this._hideInput = hideInput;
		this.update();
	}

	get hideCountBadge() {
		return !!this._hideCountBadge;
	}

	set hideCountBadge(hideCountBadge: boolean) {
		this._hideCountBadge = hideCountBadge;
		this.update();
	}

	get hideCheckAll() {
		return !!this._hideCheckAll;
	}

	set hideCheckAll(hideCheckAll: boolean) {
		this._hideCheckAll = hideCheckAll;
		this.update();
	}

	onDidChangeSelection = this.onDidChangeSelectionEmitter.event;

	onDidTriggerItemButton = this.onDidTriggerItemButtonEmitter.event;

	onDidTriggerSeparatorButton = this.onDidTriggerSeparatorButtonEmitter.event;

	private trySelectFirst() {
		if (!this.canSelectMany) {
			this.ui.list.focus(QuickPickFocus.First);
		}
	}

	override show() {
		if (!this.visible) {
			this.visibleDisposables.add(
				this.ui.inputBox.onDidChange(value => {
					this.doSetValue(value, true /* skip update since this originates from the UI */);
				}));
			this.visibleDisposables.add(this.ui.onDidAccept(() => {
				if (this.canSelectMany) {
					// if there are no checked elements, it means that an onDidChangeSelection never fired to overwrite
					// `_selectedItems`. In that case, we should emit one with an empty array to ensure that
					// `.selectedItems` is up to date.
					if (!this.ui.list.getCheckedElements().length) {
						this._selectedItems = [];
						this.onDidChangeSelectionEmitter.fire(this.selectedItems);
					}
				} else if (this.activeItems[0]) {
					// For single-select, we set `selectedItems` to the item that was accepted.
					this._selectedItems = [this.activeItems[0]];
					this.onDidChangeSelectionEmitter.fire(this.selectedItems);
				}
				this.handleAccept(false);
			}));
			this.visibleDisposables.add(this.ui.onDidCustom(() => {
				this.onDidCustomEmitter.fire();
			}));
			this.visibleDisposables.add(this._focusEventBufferer.wrapEvent(
				this.ui.list.onDidChangeFocus,
				// Only fire the last event
				(_, e) => e
			)(focusedItems => {
				if (this.activeItemsUpdated) {
					return; // Expect another event.
				}
				if (this.activeItemsToConfirm !== this._activeItems && equals(focusedItems, this._activeItems, (a, b) => a === b)) {
					return;
				}
				this._activeItems = focusedItems as T[];
				this.onDidChangeActiveEmitter.fire(focusedItems as T[]);
			}));
			this.visibleDisposables.add(this.ui.list.onDidChangeSelection(({ items: selectedItems, event }) => {
				if (this.canSelectMany && !selectedItems.some(i => i.pickable === false)) {
					if (selectedItems.length) {
						this.ui.list.setSelectedElements([]);
					}
					return;
				}
				if (this.selectedItemsToConfirm !== this._selectedItems && equals(selectedItems, this._selectedItems, (a, b) => a === b)) {
					return;
				}
				this._selectedItems = selectedItems as T[];
				this.onDidChangeSelectionEmitter.fire(selectedItems as T[]);
				if (selectedItems.length) {
					this.handleAccept(dom.isMouseEvent(event) && event.button === 1 /* mouse middle click */);
				}
			}));
			this.visibleDisposables.add(this.ui.list.onChangedCheckedElements(checkedItems => {
				if (!this.canSelectMany || !this.visible) {
					return;
				}
				if (this.selectedItemsToConfirm !== this._selectedItems && equals(checkedItems, this._selectedItems, (a, b) => a === b)) {
					return;
				}
				this._selectedItems = checkedItems as T[];
				this.onDidChangeSelectionEmitter.fire(checkedItems as T[]);
			}));
			this.visibleDisposables.add(this.ui.list.onButtonTriggered(event => this.onDidTriggerItemButtonEmitter.fire(event as IQuickPickItemButtonEvent<T>)));
			this.visibleDisposables.add(this.ui.list.onSeparatorButtonTriggered(event => this.onDidTriggerSeparatorButtonEmitter.fire(event)));
			this.visibleDisposables.add(this.registerQuickNavigation());
			this.valueSelectionUpdated = true;
		}
		super.show(); // TODO: Why have show() bubble up while update() trickles down?
	}

	private handleAccept(inBackground: boolean): void {

		// Figure out veto via `onWillAccept` event
		let veto = false;
		this.onWillAcceptEmitter.fire({ veto: () => veto = true });

		// Continue with `onDidAccept` if no veto
		if (!veto) {
			this.onDidAcceptEmitter.fire({ inBackground });
		}
	}

	private registerQuickNavigation() {
		return dom.addDisposableListener(this.ui.container, dom.EventType.KEY_UP, e => {
			if (this.canSelectMany || !this._quickNavigate) {
				return;
			}

			const keyboardEvent: StandardKeyboardEvent = new StandardKeyboardEvent(e);
			const keyCode = keyboardEvent.keyCode;

			// Select element when keys are pressed that signal it
			const quickNavKeys = this._quickNavigate.keybindings;
			const wasTriggerKeyPressed = quickNavKeys.some(k => {
				const chords = k.getChords();
				if (chords.length > 1) {
					return false;
				}

				if (chords[0].shiftKey && keyCode === KeyCode.Shift) {
					if (keyboardEvent.ctrlKey || keyboardEvent.altKey || keyboardEvent.metaKey) {
						return false; // this is an optimistic check for the shift key being used to navigate back in quick input
					}

					return true;
				}

				if (chords[0].altKey && keyCode === KeyCode.Alt) {
					return true;
				}

				if (chords[0].ctrlKey && keyCode === KeyCode.Ctrl) {
					return true;
				}

				if (chords[0].metaKey && keyCode === KeyCode.Meta) {
					return true;
				}

				return false;
			});

			if (wasTriggerKeyPressed) {
				if (this.activeItems[0]) {
					this._selectedItems = [this.activeItems[0]];
					this.onDidChangeSelectionEmitter.fire(this.selectedItems);
					this.handleAccept(false);
				}
				// Unset quick navigate after press. It is only valid once
				// and should not result in any behaviour change afterwards
				// if the picker remains open because there was no active item
				this._quickNavigate = undefined;
			}
		});
	}

	protected override update() {
		if (!this.visible) {
			return;
		}
		// store the scrollTop before it is reset
		const scrollTopBefore = this.keepScrollPosition ? this.scrollTop : 0;
		const hasDescription = !!this.description;
		const visibilities: Visibilities = {
			title: !!this.title || !!this.step || !!this.titleButtons.length,
			description: hasDescription,
			checkAll: this.canSelectMany && !this._hideCheckAll,
			checkBox: this.canSelectMany,
			inputBox: !this._hideInput,
			progressBar: !this._hideInput || hasDescription,
			visibleCount: true,
			count: this.canSelectMany && !this._hideCountBadge,
			ok: this.ok === 'default' ? this.canSelectMany : this.ok,
			list: true,
			message: !!this.validationMessage || !!this.prompt,
			customButton: this.customButton
		};
		this.ui.setVisibilities(visibilities);
		super.update();
		if (this.ui.inputBox.value !== this.value) {
			this.ui.inputBox.value = this.value;
		}
		if (this.valueSelectionUpdated) {
			this.valueSelectionUpdated = false;
			this.ui.inputBox.select(this._valueSelection && { start: this._valueSelection[0], end: this._valueSelection[1] });
		}
		if (this.ui.inputBox.placeholder !== (this.placeholder || '')) {
			this.ui.inputBox.placeholder = (this.placeholder || '');
		}

		let ariaLabel = this.ariaLabel;
		// Only set aria label to the input box placeholder if we actually have an input box.
		if (!ariaLabel && visibilities.inputBox) {
			ariaLabel = this.placeholder;
			// If we have a title, include it in the aria label.
			if (this.title) {
				ariaLabel = ariaLabel
					? `${ariaLabel} - ${this.title}`
					: this.title;
			}
			if (!ariaLabel) {
				ariaLabel = QuickPick.DEFAULT_ARIA_LABEL;
			}
		}
		if (this.ui.list.ariaLabel !== ariaLabel) {
			this.ui.list.ariaLabel = ariaLabel ?? null;
		}
		if (this.ui.inputBox.ariaLabel !== ariaLabel) {
			this.ui.inputBox.ariaLabel = ariaLabel ?? 'input';
		}
		this.ui.list.matchOnDescription = this.matchOnDescription;
		this.ui.list.matchOnDetail = this.matchOnDetail;
		this.ui.list.matchOnLabel = this.matchOnLabel;
		this.ui.list.matchOnLabelMode = this.matchOnLabelMode;
		this.ui.list.sortByLabel = this.sortByLabel;
		if (this.itemsUpdated) {
			this.itemsUpdated = false;
			this._focusEventBufferer.bufferEvents(() => {
				this.ui.list.setElements(this.items);
				// We want focus to exist in the list if there are items so that space can be used to toggle
				this.ui.list.shouldLoop = !this.canSelectMany;
				this.ui.list.filter(this.filterValue(this.ui.inputBox.value));
				switch (this._itemActivation) {
					case ItemActivation.NONE:
						this._itemActivation = ItemActivation.FIRST; // only valid once, then unset
						break;
					case ItemActivation.SECOND:
						this.ui.list.focus(QuickPickFocus.Second);
						this._itemActivation = ItemActivation.FIRST; // only valid once, then unset
						break;
					case ItemActivation.LAST:
						this.ui.list.focus(QuickPickFocus.Last);
						this._itemActivation = ItemActivation.FIRST; // only valid once, then unset
						break;
					default:
						this.trySelectFirst();
						break;
				}
			});
		}
		if (this.ui.container.classList.contains('show-checkboxes') !== !!this.canSelectMany) {
			if (this.canSelectMany) {
				this.ui.list.clearFocus();
			} else {
				this.trySelectFirst();
			}
		}
		if (this.activeItemsUpdated) {
			this.activeItemsUpdated = false;
			this.activeItemsToConfirm = this._activeItems;
			this.ui.list.setFocusedElements(this.activeItems);
			if (this.activeItemsToConfirm === this._activeItems) {
				this.activeItemsToConfirm = null;
			}
		}
		if (this.selectedItemsUpdated) {
			this.selectedItemsUpdated = false;
			this.selectedItemsToConfirm = this._selectedItems;
			if (this.canSelectMany) {
				this.ui.list.setCheckedElements(this.selectedItems);
			} else {
				this.ui.list.setSelectedElements(this.selectedItems);
			}
			if (this.selectedItemsToConfirm === this._selectedItems) {
				this.selectedItemsToConfirm = null;
			}
		}
		this.ui.ok.label = this.okLabel || '';
		this.ui.customButton.label = this.customLabel || '';
		this.ui.customButton.element.title = this.customHover || '';
		this.ui.customButton.secondary = this.customButtonSecondary || false;
		if (!visibilities.inputBox) {
			// we need to move focus into the tree to detect keybindings
			// properly when the input box is not visible (quick nav)
			this.ui.list.domFocus();

			// Focus the first element in the list if multiselect is enabled
			if (this.canSelectMany) {
				this.ui.list.focus(QuickPickFocus.First);
			}
		}

		// Set the scroll position to what it was before updating the items
		if (this.keepScrollPosition) {
			this.scrollTop = scrollTopBefore;
		}
	}

	focus(focus: QuickPickFocus): void {
		this.ui.list.focus(focus);
		// To allow things like space to check/uncheck items
		if (this.canSelectMany) {
			this.ui.list.domFocus();
		}
	}

	accept(inBackground?: boolean | undefined): void {
		if (inBackground && !this._canAcceptInBackground) {
			return; // needs to be enabled
		}

		if (this.activeItems[0] && !this._canSelectMany) {
			this._selectedItems = [this.activeItems[0]];
			this.onDidChangeSelectionEmitter.fire(this.selectedItems);
		}
		this.handleAccept(inBackground ?? false);
	}
}

export class InputBox extends QuickInput implements IInputBox {
	private _value = '';
	private _valueSelection: Readonly<[number, number]> | undefined;
	private valueSelectionUpdated = true;
	private _placeholder: string | undefined;
	private _ariaLabel: string | undefined;
	private _password = false;
	private _prompt: string | undefined;
	private readonly onDidValueChangeEmitter = this._register(new Emitter<string>());
	private readonly onDidAcceptEmitter = this._register(new Emitter<void>());

	readonly type = QuickInputType.InputBox;

	get value() {
		return this._value;
	}

	set value(value: string) {
		this._value = value || '';
		this.update();
	}

	get valueSelection() {
		const selection = this.ui.inputBox.getSelection();
		if (!selection) {
			return undefined;
		}
		return [selection.start, selection.end];
	}

	set valueSelection(valueSelection: Readonly<[number, number]> | undefined) {
		this._valueSelection = valueSelection;
		this.valueSelectionUpdated = true;
		this.update();
	}

	get placeholder() {
		return this._placeholder;
	}

	set placeholder(placeholder: string | undefined) {
		this._placeholder = placeholder;
		this.update();
	}

	get ariaLabel() {
		return this._ariaLabel;
	}

	set ariaLabel(ariaLabel: string | undefined) {
		this._ariaLabel = ariaLabel;
		this.update();
	}

	get password() {
		return this._password;
	}

	set password(password: boolean) {
		this._password = password;
		this.update();
	}

	get prompt() {
		return this._prompt;
	}

	set prompt(prompt: string | undefined) {
		this._prompt = prompt;
		this.noValidationMessage = prompt
			? localize('inputModeEntryDescription', "{0} (Press 'Enter' to confirm or 'Escape' to cancel)", prompt)
			: QuickInput.noPromptMessage;
		this.update();
	}

	readonly onDidChangeValue = this.onDidValueChangeEmitter.event;

	readonly onDidAccept = this.onDidAcceptEmitter.event;

	override show() {
		if (!this.visible) {
			this.visibleDisposables.add(
				this.ui.inputBox.onDidChange(value => {
					if (value === this.value) {
						return;
					}
					this._value = value;
					this.onDidValueChangeEmitter.fire(value);
				}));
			this.visibleDisposables.add(this.ui.onDidAccept(() => this.onDidAcceptEmitter.fire()));
			this.valueSelectionUpdated = true;
		}
		super.show();
	}

	accept(): void {
		this.onDidAcceptEmitter.fire();
	}

	protected override update() {
		if (!this.visible) {
			return;
		}

		this.ui.container.classList.remove('hidden-input');
		const visibilities: Visibilities = {
			title: !!this.title || !!this.step || !!this.titleButtons.length,
			description: !!this.description || !!this.step,
			inputBox: true,
			message: true,
			progressBar: true
		};

		this.ui.setVisibilities(visibilities);
		super.update();
		if (this.ui.inputBox.value !== this.value) {
			this.ui.inputBox.value = this.value;
		}
		if (this.valueSelectionUpdated) {
			this.valueSelectionUpdated = false;
			this.ui.inputBox.select(this._valueSelection && { start: this._valueSelection[0], end: this._valueSelection[1] });
		}
		if (this.ui.inputBox.placeholder !== (this.placeholder || '')) {
			this.ui.inputBox.placeholder = (this.placeholder || '');
		}
		if (this.ui.inputBox.password !== this.password) {
			this.ui.inputBox.password = this.password;
		}
		let ariaLabel = this.ariaLabel;
		// Only set aria label to the input box placeholder if we actually have an input box.
		if (!ariaLabel && visibilities.inputBox) {
			ariaLabel = this.placeholder
				? this.title
					? `${this.placeholder} - ${this.title}`
					: this.placeholder
				: this.title
					? this.title
					: 'input';
		}
		if (this.ui.inputBox.ariaLabel !== ariaLabel) {
			this.ui.inputBox.ariaLabel = ariaLabel || 'input';
		}
	}
}

export class QuickWidget extends QuickInput implements IQuickWidget {
	readonly type = QuickInputType.QuickWidget;

	protected override update() {
		if (!this.visible) {
			return;
		}

		const visibilities: Visibilities = {
			title: !!this.title || !!this.step || !!this.titleButtons.length,
			description: !!this.description || !!this.step
		};

		this.ui.setVisibilities(visibilities);
		super.update();
	}
}

export class QuickInputHoverDelegate extends WorkbenchHoverDelegate {

	constructor(
		@IConfigurationService configurationService: IConfigurationService,
		@IHoverService hoverService: IHoverService
	) {
		super('mouse', undefined, (options) => this.getOverrideOptions(options), configurationService, hoverService);
	}

	private getOverrideOptions(options: IHoverDelegateOptions): Partial<IHoverOptions> {
		// Only show the hover hint if the content is of a decent size
		const showHoverHint = (
			dom.isHTMLElement(options.content)
				? options.content.textContent ?? ''
				: typeof options.content === 'string'
					? options.content
					: options.content.value
		).includes('\n');

		return {
			persistence: {
				hideOnKeyDown: false,
			},
			appearance: {
				showHoverHint,
				skipFadeInAnimation: true,
			},
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/browser/quickInputActions.ts]---
Location: vscode-main/src/vs/platform/quickinput/browser/quickInputActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../base/common/keyCodes.js';
import { isMacintosh } from '../../../base/common/platform.js';
import { PartialExcept } from '../../../base/common/types.js';
import { localize } from '../../../nls.js';
import { ICommandHandler } from '../../commands/common/commands.js';
import { ContextKeyExpr } from '../../contextkey/common/contextkey.js';
import { InputFocusedContext } from '../../contextkey/common/contextkeys.js';
import { ICommandAndKeybindingRule, KeybindingWeight, KeybindingsRegistry } from '../../keybinding/common/keybindingsRegistry.js';
import { endOfQuickInputBoxContext, inQuickInputContext, quickInputTypeContextKeyValue } from './quickInput.js';
import { IInputBox, IQuickInputService, IQuickPick, IQuickTree, QuickInputType, QuickPickFocus } from '../common/quickInput.js';

function registerQuickInputCommandAndKeybindingRule(rule: PartialExcept<ICommandAndKeybindingRule, 'id' | 'handler'>, options: { withAltMod?: boolean; withCtrlMod?: boolean; withCmdMod?: boolean } = {}) {
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		weight: KeybindingWeight.WorkbenchContrib,
		when: inQuickInputContext,
		metadata: { description: localize('quickInput', "Used while in the context of any kind of quick input. If you change one keybinding for this command, you should change all of the other keybindings (modifier variants) of this command as well.") },
		...rule,
		secondary: getSecondary(rule.primary!, rule.secondary ?? [], options)
	});
}

function registerQuickPickCommandAndKeybindingRule(rule: PartialExcept<ICommandAndKeybindingRule, 'id' | 'handler'>, options: { withAltMod?: boolean; withCtrlMod?: boolean; withCmdMod?: boolean } = {}) {
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		weight: KeybindingWeight.WorkbenchContrib,
		when: ContextKeyExpr.and(
			ContextKeyExpr.or(
				// Only things that use Tree widgets
				ContextKeyExpr.equals(quickInputTypeContextKeyValue, QuickInputType.QuickPick),
				ContextKeyExpr.equals(quickInputTypeContextKeyValue, QuickInputType.QuickTree),
			),
			inQuickInputContext
		),
		metadata: { description: localize('quickPick', "Used while in the context of the quick pick. If you change one keybinding for this command, you should change all of the other keybindings (modifier variants) of this command as well.") },
		...rule,
		secondary: getSecondary(rule.primary!, rule.secondary ?? [], options)
	});
}

const ctrlKeyMod = isMacintosh ? KeyMod.WinCtrl : KeyMod.CtrlCmd;

// This function will generate all the combinations of keybindings for the given primary keybinding
function getSecondary(primary: number, secondary: number[], options: { withAltMod?: boolean; withCtrlMod?: boolean; withCmdMod?: boolean } = {}): number[] {
	if (options.withAltMod) {
		secondary.push(KeyMod.Alt + primary);
	}
	if (options.withCtrlMod) {
		secondary.push(ctrlKeyMod + primary);
		if (options.withAltMod) {
			secondary.push(KeyMod.Alt + ctrlKeyMod + primary);
		}
	}

	if (options.withCmdMod && isMacintosh) {
		secondary.push(KeyMod.CtrlCmd + primary);
		if (options.withCtrlMod) {
			secondary.push(KeyMod.CtrlCmd + KeyMod.WinCtrl + primary);
		}
		if (options.withAltMod) {
			secondary.push(KeyMod.CtrlCmd + KeyMod.Alt + primary);
			if (options.withCtrlMod) {
				secondary.push(KeyMod.CtrlCmd + KeyMod.Alt + KeyMod.WinCtrl + primary);
			}
		}
	}

	return secondary;
}

//#region Navigation

function focusHandler(focus: QuickPickFocus, focusOnQuickNatigate?: QuickPickFocus): ICommandHandler {
	return accessor => {
		// Assuming this is a quick pick due to above when clause
		const currentQuickPick = accessor.get(IQuickInputService).currentQuickInput as IQuickPick<any> | IQuickTree<any> | undefined;
		if (!currentQuickPick) {
			return;
		}
		if (focusOnQuickNatigate && (currentQuickPick as IQuickPick<any>).quickNavigate) {
			return currentQuickPick.focus(focusOnQuickNatigate);
		}
		return currentQuickPick.focus(focus);
	};
}

registerQuickPickCommandAndKeybindingRule(
	{ id: 'quickInput.pageNext', primary: KeyCode.PageDown, handler: focusHandler(QuickPickFocus.NextPage) },
	{ withAltMod: true, withCtrlMod: true, withCmdMod: true }
);
registerQuickPickCommandAndKeybindingRule(
	{ id: 'quickInput.pagePrevious', primary: KeyCode.PageUp, handler: focusHandler(QuickPickFocus.PreviousPage) },
	{ withAltMod: true, withCtrlMod: true, withCmdMod: true }
);
registerQuickPickCommandAndKeybindingRule(
	{ id: 'quickInput.first', primary: ctrlKeyMod + KeyCode.Home, handler: focusHandler(QuickPickFocus.First) },
	{ withAltMod: true, withCmdMod: true }
);
registerQuickPickCommandAndKeybindingRule(
	{ id: 'quickInput.last', primary: ctrlKeyMod + KeyCode.End, handler: focusHandler(QuickPickFocus.Last) },
	{ withAltMod: true, withCmdMod: true }
);
registerQuickPickCommandAndKeybindingRule(
	{ id: 'quickInput.next', primary: KeyCode.DownArrow, handler: focusHandler(QuickPickFocus.Next) },
	{ withCtrlMod: true }
);
registerQuickPickCommandAndKeybindingRule(
	{ id: 'quickInput.previous', primary: KeyCode.UpArrow, handler: focusHandler(QuickPickFocus.Previous) },
	{ withCtrlMod: true }
);

// The next & previous separator commands are interesting because if we are in quick access mode, we are already holding a modifier key down.
// In this case, we want that modifier key+up/down to navigate to the next/previous item, not the next/previous separator.
// To handle this, we have a separate command for navigating to the next/previous separator when we are not in quick access mode.
// If, however, we are in quick access mode, and you hold down an additional modifier key, we will navigate to the next/previous separator.

const nextSeparatorFallbackDesc = localize('quickInput.nextSeparatorWithQuickAccessFallback', "If we're in quick access mode, this will navigate to the next item. If we are not in quick access mode, this will navigate to the next separator.");
const prevSeparatorFallbackDesc = localize('quickInput.previousSeparatorWithQuickAccessFallback', "If we're in quick access mode, this will navigate to the previous item. If we are not in quick access mode, this will navigate to the previous separator.");
if (isMacintosh) {
	registerQuickPickCommandAndKeybindingRule(
		{
			id: 'quickInput.nextSeparatorWithQuickAccessFallback',
			primary: KeyMod.CtrlCmd + KeyCode.DownArrow,
			handler: focusHandler(QuickPickFocus.NextSeparator, QuickPickFocus.Next),
			metadata: { description: nextSeparatorFallbackDesc }
		},
	);
	registerQuickPickCommandAndKeybindingRule(
		{
			id: 'quickInput.nextSeparator',
			primary: KeyMod.CtrlCmd + KeyMod.Alt + KeyCode.DownArrow,
			// Since macOS has the cmd key as the primary modifier, we need to add this additional
			// keybinding to capture cmd+ctrl+upArrow
			secondary: [KeyMod.CtrlCmd + KeyMod.WinCtrl + KeyCode.DownArrow],
			handler: focusHandler(QuickPickFocus.NextSeparator)
		},
		{ withCtrlMod: true }
	);

	registerQuickPickCommandAndKeybindingRule(
		{
			id: 'quickInput.previousSeparatorWithQuickAccessFallback',
			primary: KeyMod.CtrlCmd + KeyCode.UpArrow,
			handler: focusHandler(QuickPickFocus.PreviousSeparator, QuickPickFocus.Previous),
			metadata: { description: prevSeparatorFallbackDesc }
		},
	);
	registerQuickPickCommandAndKeybindingRule(
		{
			id: 'quickInput.previousSeparator',
			primary: KeyMod.CtrlCmd + KeyMod.Alt + KeyCode.UpArrow,
			// Since macOS has the cmd key as the primary modifier, we need to add this additional
			// keybinding to capture cmd+ctrl+upArrow
			secondary: [KeyMod.CtrlCmd + KeyMod.WinCtrl + KeyCode.UpArrow],
			handler: focusHandler(QuickPickFocus.PreviousSeparator)
		},
		{ withCtrlMod: true }
	);
} else {
	registerQuickPickCommandAndKeybindingRule(
		{
			id: 'quickInput.nextSeparatorWithQuickAccessFallback',
			primary: KeyMod.Alt + KeyCode.DownArrow,
			handler: focusHandler(QuickPickFocus.NextSeparator, QuickPickFocus.Next),
			metadata: { description: nextSeparatorFallbackDesc }
		},
	);
	registerQuickPickCommandAndKeybindingRule(
		{
			id: 'quickInput.nextSeparator',
			primary: KeyMod.CtrlCmd + KeyMod.Alt + KeyCode.DownArrow,
			handler: focusHandler(QuickPickFocus.NextSeparator)
		},
	);

	registerQuickPickCommandAndKeybindingRule(
		{
			id: 'quickInput.previousSeparatorWithQuickAccessFallback',
			primary: KeyMod.Alt + KeyCode.UpArrow,
			handler: focusHandler(QuickPickFocus.PreviousSeparator, QuickPickFocus.Previous),
			metadata: { description: prevSeparatorFallbackDesc }
		},
	);
	registerQuickPickCommandAndKeybindingRule(
		{
			id: 'quickInput.previousSeparator',
			primary: KeyMod.CtrlCmd + KeyMod.Alt + KeyCode.UpArrow,
			handler: focusHandler(QuickPickFocus.PreviousSeparator)
		},
	);
}

//#endregion

//#region Accept

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'quickInput.accept',
	primary: KeyCode.Enter,
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(
		// All other kinds of Quick things handle Accept, except Widget. In other words, Accepting is a detail on the things
		// that extend IQuickInput
		ContextKeyExpr.notEquals(quickInputTypeContextKeyValue, QuickInputType.QuickWidget),
		inQuickInputContext,
		ContextKeyExpr.not('isComposing')
	),
	metadata: { description: localize('nonQuickWidget', "Used while in the context of some quick input. If you change one keybinding for this command, you should change all of the other keybindings (modifier variants) of this command as well.") },
	handler: (accessor) => {
		const currentQuickPick = accessor.get(IQuickInputService).currentQuickInput as IQuickPick<any> | IQuickTree<any> | IInputBox;
		currentQuickPick?.accept();
	},
	secondary: getSecondary(KeyCode.Enter, [], { withAltMod: true, withCtrlMod: true, withCmdMod: true })
});

registerQuickPickCommandAndKeybindingRule(
	{
		id: 'quickInput.acceptInBackground',
		// If we are in the quick pick but the input box is not focused or our cursor is at the end of the input box
		when: ContextKeyExpr.and(
			inQuickInputContext,
			ContextKeyExpr.equals(quickInputTypeContextKeyValue, QuickInputType.QuickPick),
			ContextKeyExpr.or(InputFocusedContext.negate(), endOfQuickInputBoxContext)
		),
		primary: KeyCode.RightArrow,
		// Need a little extra weight to ensure this keybinding is preferred over the default cmd+alt+right arrow keybinding
		// https://github.com/microsoft/vscode/blob/1451e4fbbbf074a4355cc537c35b547b80ce1c52/src/vs/workbench/browser/parts/editor/editorActions.ts#L1178-L1195
		weight: KeybindingWeight.WorkbenchContrib + 50,
		handler: (accessor) => {
			const currentQuickPick = accessor.get(IQuickInputService).currentQuickInput as IQuickPick<any>;
			currentQuickPick?.accept(true);
		},
	},
	{ withAltMod: true, withCtrlMod: true, withCmdMod: true }
);

//#endregion

//#region Hide

registerQuickInputCommandAndKeybindingRule(
	{
		id: 'quickInput.hide',
		primary: KeyCode.Escape,
		handler: (accessor) => {
			const currentQuickPick = accessor.get(IQuickInputService).currentQuickInput;
			currentQuickPick?.hide();
		}
	},
	{ withAltMod: true, withCtrlMod: true, withCmdMod: true }
);

//#endregion

//#region Toggle Hover

registerQuickPickCommandAndKeybindingRule(
	{
		id: 'quickInput.toggleHover',
		primary: ctrlKeyMod | KeyCode.Space,
		handler: accessor => {
			const quickInputService = accessor.get(IQuickInputService);
			quickInputService.toggleHover();
		}
	}
);

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/browser/quickInputBox.ts]---
Location: vscode-main/src/vs/platform/quickinput/browser/quickInputBox.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../base/browser/dom.js';
import { FindInput } from '../../../base/browser/ui/findinput/findInput.js';
import { IInputBoxStyles, IRange, MessageType } from '../../../base/browser/ui/inputbox/inputBox.js';
import { createToggleActionViewItemProvider, IToggleStyles, Toggle } from '../../../base/browser/ui/toggle/toggle.js';
import { IAction } from '../../../base/common/actions.js';
import { IActionViewItemProvider } from '../../../base/browser/ui/actionbar/actionbar.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import Severity from '../../../base/common/severity.js';
import './media/quickInput.css';

const $ = dom.$;

export class QuickInputBox extends Disposable {

	private container: HTMLElement;
	private findInput: FindInput;

	constructor(
		private parent: HTMLElement,
		inputBoxStyles: IInputBoxStyles,
		toggleStyles: IToggleStyles
	) {
		super();
		this.container = dom.append(this.parent, $('.quick-input-box'));
		this.findInput = this._register(new FindInput(
			this.container,
			undefined,
			{
				label: '',
				inputBoxStyles,
				toggleStyles,
				actionViewItemProvider: createToggleActionViewItemProvider(toggleStyles)
			}));
		const input = this.findInput.inputBox.inputElement;
		input.role = 'textbox';
		input.ariaHasPopup = 'menu';
		input.ariaAutoComplete = 'list';
	}

	get onKeyDown() {
		return this.findInput.onKeyDown;
	}

	get onMouseDown() {
		return this.findInput.onMouseDown;
	}

	onDidChange = (handler: (event: string) => void): IDisposable => {
		return this.findInput.onDidChange(handler);
	};

	get value() {
		return this.findInput.getValue();
	}

	set value(value: string) {
		this.findInput.setValue(value);
	}

	select(range: IRange | null = null): void {
		this.findInput.inputBox.select(range);
	}

	getSelection(): IRange | null {
		return this.findInput.inputBox.getSelection();
	}

	isSelectionAtEnd(): boolean {
		return this.findInput.inputBox.isSelectionAtEnd();
	}

	setPlaceholder(placeholder: string): void {
		this.findInput.inputBox.setPlaceHolder(placeholder);
	}

	get placeholder() {
		return this.findInput.inputBox.inputElement.getAttribute('placeholder') || '';
	}

	set placeholder(placeholder: string) {
		this.findInput.inputBox.setPlaceHolder(placeholder);
	}

	get password() {
		return this.findInput.inputBox.inputElement.type === 'password';
	}

	set password(password: boolean) {
		this.findInput.inputBox.inputElement.type = password ? 'password' : 'text';
	}

	set enabled(enabled: boolean) {
		// We can't disable the input box because it is still used for
		// navigating the list. Instead, we disable the list and the OK
		// so that nothing can be selected.
		// TODO: should this be what we do for all find inputs? Or maybe some _other_ API
		// on findInput to change it to readonly?
		this.findInput.inputBox.inputElement.toggleAttribute('readonly', !enabled);
		// TODO: styles of the quick pick need to be moved to the CSS instead of being in line
		// so things like this can be done in CSS
		// this.findInput.inputBox.inputElement.classList.toggle('disabled', !enabled);
	}

	set toggles(toggles: Toggle[] | undefined) {
		this.findInput.setAdditionalToggles(toggles);
	}

	set actions(actions: ReadonlyArray<IAction> | undefined) {
		this.setActions(actions);
	}

	setActions(actions: ReadonlyArray<IAction> | undefined, actionViewItemProvider?: IActionViewItemProvider): void {
		this.findInput.setActions(actions, actionViewItemProvider);
	}

	get ariaLabel(): string {
		return this.findInput.inputBox.inputElement.getAttribute('aria-label') || '';
	}

	set ariaLabel(ariaLabel: string) {
		this.findInput.inputBox.inputElement.setAttribute('aria-label', ariaLabel);
	}

	hasFocus(): boolean {
		return this.findInput.inputBox.hasFocus();
	}

	setAttribute(name: string, value: string): void {
		this.findInput.inputBox.inputElement.setAttribute(name, value);
	}

	removeAttribute(name: string): void {
		this.findInput.inputBox.inputElement.removeAttribute(name);
	}

	showDecoration(decoration: Severity): void {
		if (decoration === Severity.Ignore) {
			this.findInput.clearMessage();
		} else {
			this.findInput.showMessage({ type: decoration === Severity.Info ? MessageType.INFO : decoration === Severity.Warning ? MessageType.WARNING : MessageType.ERROR, content: '' });
		}
	}

	stylesForType(decoration: Severity) {
		return this.findInput.inputBox.stylesForType(decoration === Severity.Info ? MessageType.INFO : decoration === Severity.Warning ? MessageType.WARNING : MessageType.ERROR);
	}

	setFocus(): void {
		this.findInput.focus();
	}

	layout(): void {
		this.findInput.inputBox.layout();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/browser/quickInputController.ts]---
Location: vscode-main/src/vs/platform/quickinput/browser/quickInputController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../base/browser/dom.js';
import * as domStylesheetsJs from '../../../base/browser/domStylesheets.js';
import { ActionBar } from '../../../base/browser/ui/actionbar/actionbar.js';
import { ActionViewItem } from '../../../base/browser/ui/actionbar/actionViewItems.js';
import { Button } from '../../../base/browser/ui/button/button.js';
import { CountBadge } from '../../../base/browser/ui/countBadge/countBadge.js';
import { ProgressBar } from '../../../base/browser/ui/progressbar/progressbar.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, DisposableStore, dispose } from '../../../base/common/lifecycle.js';
import Severity from '../../../base/common/severity.js';
import { isString } from '../../../base/common/types.js';
import { isModifierKey } from '../../../base/common/keyCodes.js';
import { localize } from '../../../nls.js';
import { IInputBox, IInputOptions, IKeyMods, IPickOptions, IQuickInput, IQuickInputButton, IQuickNavigateConfiguration, IQuickPick, IQuickPickItem, IQuickWidget, QuickInputHideReason, QuickPickInput, QuickPickFocus, QuickInputType, IQuickTree, IQuickTreeItem } from '../common/quickInput.js';
import { QuickInputBox } from './quickInputBox.js';
import { QuickInputUI, Writeable, IQuickInputStyles, IQuickInputOptions, QuickPick, backButton, InputBox, Visibilities, QuickWidget, InQuickInputContextKey, QuickInputTypeContextKey, EndOfQuickInputBoxContextKey, QuickInputAlignmentContextKey } from './quickInput.js';
import { ILayoutService } from '../../layout/browser/layoutService.js';
import { mainWindow } from '../../../base/browser/window.js';
import { IInstantiationService } from '../../instantiation/common/instantiation.js';
import { QuickInputList } from './quickInputList.js';
import { IContextKey, IContextKeyService } from '../../contextkey/common/contextkey.js';
import './quickInputActions.js';
import { autorun, observableValue } from '../../../base/common/observable.js';
import { StandardMouseEvent } from '../../../base/browser/mouseEvent.js';
import { IStorageService, StorageScope, StorageTarget } from '../../storage/common/storage.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { Platform, platform, setTimeout0 } from '../../../base/common/platform.js';
import { getWindowControlsStyle, WindowControlsStyle } from '../../window/common/window.js';
import { getZoomFactor } from '../../../base/browser/browser.js';
import { TriStateCheckbox, createToggleActionViewItemProvider } from '../../../base/browser/ui/toggle/toggle.js';
import { defaultCheckboxStyles } from '../../theme/browser/defaultStyles.js';
import { QuickInputTreeController } from './tree/quickInputTreeController.js';
import { QuickTree } from './tree/quickTree.js';

const $ = dom.$;

const VIEWSTATE_STORAGE_KEY = 'workbench.quickInput.viewState';

type QuickInputViewState = {
	readonly top?: number;
	readonly left?: number;
};

export class QuickInputController extends Disposable {
	private static readonly MAX_WIDTH = 600; // Max total width of quick input widget

	private idPrefix: string;
	private ui: QuickInputUI | undefined;
	private dimension?: dom.IDimension;
	private titleBarOffset?: number;
	private enabled = true;
	private readonly onDidAcceptEmitter = this._register(new Emitter<void>());
	private readonly onDidCustomEmitter = this._register(new Emitter<void>());
	private readonly onDidTriggerButtonEmitter = this._register(new Emitter<IQuickInputButton>());
	private keyMods: Writeable<IKeyMods> = { ctrlCmd: false, alt: false };

	private controller: IQuickInput | null = null;
	get currentQuickInput() { return this.controller ?? undefined; }

	private _container: HTMLElement;
	get container() { return this._container; }

	private styles: IQuickInputStyles;

	private onShowEmitter = this._register(new Emitter<void>());
	readonly onShow = this.onShowEmitter.event;

	private onHideEmitter = this._register(new Emitter<void>());
	readonly onHide = this.onHideEmitter.event;

	private previousFocusElement?: HTMLElement;

	private viewState: QuickInputViewState | undefined;
	private dndController: QuickInputDragAndDropController | undefined;

	private readonly inQuickInputContext: IContextKey<boolean>;
	private readonly quickInputTypeContext: IContextKey<QuickInputType>;
	private readonly endOfQuickInputBoxContext: IContextKey<boolean>;

	constructor(
		private options: IQuickInputOptions,
		@ILayoutService private readonly layoutService: ILayoutService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IStorageService private readonly storageService: IStorageService
	) {
		super();

		this.inQuickInputContext = InQuickInputContextKey.bindTo(contextKeyService);
		this.quickInputTypeContext = QuickInputTypeContextKey.bindTo(contextKeyService);
		this.endOfQuickInputBoxContext = EndOfQuickInputBoxContextKey.bindTo(contextKeyService);

		this.idPrefix = options.idPrefix;
		this._container = options.container;
		this.styles = options.styles;
		this._register(Event.runAndSubscribe(dom.onDidRegisterWindow, ({ window, disposables }) => this.registerKeyModsListeners(window, disposables), { window: mainWindow, disposables: this._store }));
		this._register(dom.onWillUnregisterWindow(window => {
			if (this.ui && dom.getWindow(this.ui.container) === window) {
				// The window this quick input is contained in is about to
				// close, so we have to make sure to reparent it back to an
				// existing parent to not loose functionality.
				// (https://github.com/microsoft/vscode/issues/195870)
				this.reparentUI(this.layoutService.mainContainer);
				this.layout(this.layoutService.mainContainerDimension, this.layoutService.mainContainerOffset.quickPickTop);
			}
		}));
		this.viewState = this.loadViewState();
	}

	private registerKeyModsListeners(window: Window, disposables: DisposableStore): void {
		const listener = (e: KeyboardEvent | MouseEvent) => {
			this.keyMods.ctrlCmd = e.ctrlKey || e.metaKey;
			this.keyMods.alt = e.altKey;
		};

		for (const event of [dom.EventType.KEY_DOWN, dom.EventType.KEY_UP, dom.EventType.MOUSE_DOWN]) {
			disposables.add(dom.addDisposableListener(window, event, listener, true));
		}
	}

	private getUI(showInActiveContainer?: boolean): QuickInputUI {
		if (this.ui) {
			// In order to support aux windows, re-parent the controller
			// if the original event is from a different document
			if (showInActiveContainer) {
				if (dom.getWindow(this._container) !== dom.getWindow(this.layoutService.activeContainer)) {
					this.reparentUI(this.layoutService.activeContainer);
					this.layout(this.layoutService.activeContainerDimension, this.layoutService.activeContainerOffset.quickPickTop);
				}
			}

			return this.ui;
		}

		const container = dom.append(this._container, $('.quick-input-widget.show-file-icons'));
		container.tabIndex = -1;
		container.style.display = 'none';

		const styleSheet = domStylesheetsJs.createStyleSheet(container);

		const titleBar = dom.append(container, $('.quick-input-titlebar'));

		const leftActionBar = this._register(new ActionBar(titleBar, {
			hoverDelegate: this.options.hoverDelegate,
			actionViewItemProvider: createToggleActionViewItemProvider(this.styles.toggle)
		}));
		leftActionBar.domNode.classList.add('quick-input-left-action-bar');

		const title = dom.append(titleBar, $('.quick-input-title'));

		const rightActionBar = this._register(new ActionBar(titleBar, {
			hoverDelegate: this.options.hoverDelegate,
			actionViewItemProvider: createToggleActionViewItemProvider(this.styles.toggle)
		}));
		rightActionBar.domNode.classList.add('quick-input-right-action-bar');

		const headerContainer = dom.append(container, $('.quick-input-header'));

		const checkAll = this._register(new TriStateCheckbox(localize('quickInput.checkAll', "Toggle all checkboxes"), false, { ...defaultCheckboxStyles, size: 15 }));
		dom.append(headerContainer, checkAll.domNode);
		this._register(checkAll.onChange(() => {
			const checked = checkAll.checked;
			list.setAllVisibleChecked(checked === true);
		}));
		this._register(dom.addDisposableListener(checkAll.domNode, dom.EventType.CLICK, e => {
			if (e.x || e.y) { // Avoid 'click' triggered by 'space'...
				inputBox.setFocus();
			}
		}));

		const description2 = dom.append(headerContainer, $('.quick-input-description'));
		const inputContainer = dom.append(headerContainer, $('.quick-input-and-message'));
		const filterContainer = dom.append(inputContainer, $('.quick-input-filter'));

		const inputBox = this._register(new QuickInputBox(filterContainer, this.styles.inputBox, this.styles.toggle));
		inputBox.setAttribute('aria-describedby', `${this.idPrefix}message`);

		const visibleCountContainer = dom.append(filterContainer, $('.quick-input-visible-count'));
		visibleCountContainer.setAttribute('aria-live', 'polite');
		visibleCountContainer.setAttribute('aria-atomic', 'true');
		const visibleCount = this._register(new CountBadge(visibleCountContainer, { countFormat: localize({ key: 'quickInput.visibleCount', comment: ['This tells the user how many items are shown in a list of items to select from. The items can be anything. Currently not visible, but read by screen readers.'] }, "{0} Results") }, this.styles.countBadge));

		const countContainer = dom.append(filterContainer, $('.quick-input-count'));
		countContainer.setAttribute('aria-live', 'polite');
		const count = this._register(new CountBadge(countContainer, { countFormat: localize({ key: 'quickInput.countSelected', comment: ['This tells the user how many items are selected in a list of items to select from. The items can be anything.'] }, "{0} Selected") }, this.styles.countBadge));

		const inlineActionBar = this._register(new ActionBar(headerContainer, {
			hoverDelegate: this.options.hoverDelegate,
			actionViewItemProvider: createToggleActionViewItemProvider(this.styles.toggle)
		}));
		inlineActionBar.domNode.classList.add('quick-input-inline-action-bar');

		const okContainer = dom.append(headerContainer, $('.quick-input-action'));
		const ok = this._register(new Button(okContainer, this.styles.button));
		ok.label = localize('ok', "OK");
		this._register(ok.onDidClick(e => {
			this.onDidAcceptEmitter.fire();
		}));

		const customButtonContainer = dom.append(headerContainer, $('.quick-input-action'));
		const customButton = this._register(new Button(customButtonContainer, { ...this.styles.button, supportIcons: true }));
		customButton.label = localize('custom', "Custom");
		this._register(customButton.onDidClick(e => {
			this.onDidCustomEmitter.fire();
		}));

		const message = dom.append(inputContainer, $(`#${this.idPrefix}message.quick-input-message`));

		const progressBar = this._register(new ProgressBar(container, this.styles.progressBar));
		progressBar.getContainer().classList.add('quick-input-progress');

		const widget = dom.append(container, $('.quick-input-html-widget'));
		widget.tabIndex = -1;

		const description1 = dom.append(container, $('.quick-input-description'));

		// List
		const listId = this.idPrefix + 'list';
		const list = this._register(this.instantiationService.createInstance(QuickInputList, container, this.options.hoverDelegate, this.options.linkOpenerDelegate, listId, this.styles));
		inputBox.setAttribute('aria-controls', listId);
		this._register(list.onDidChangeFocus(() => {
			if (inputBox.hasFocus()) {
				const activeDescendant = list.getActiveDescendant();
				if (activeDescendant) {
					inputBox.setAttribute('aria-activedescendant', activeDescendant);
				} else {
					inputBox.removeAttribute('aria-activedescendant');
				}
			}
		}));
		this._register(list.onChangedAllVisibleChecked(checked => {
			// TODO: Support tri-state checkbox when we remove the .indent property that is faking tree structure.
			checkAll.checked = checked;
		}));
		this._register(list.onChangedVisibleCount(c => {
			visibleCount.setCount(c);
		}));
		this._register(list.onChangedCheckedCount(c => {
			// TODO@TylerLeonhardt: Without this setTimeout, the screen reader will not read out
			// the final count of checked items correctly. Investigate a better way
			// to do this. ref https://github.com/microsoft/vscode/issues/258617
			setTimeout0(() => count.setCount(c));
		}));
		this._register(list.onLeave(() => {
			// Defer to avoid the input field reacting to the triggering key.
			// TODO@TylerLeonhardt https://github.com/microsoft/vscode/issues/203675
			setTimeout(() => {
				if (!this.controller) {
					return;
				}
				inputBox.setFocus();
				if (this.controller instanceof QuickPick && this.controller.canSelectMany) {
					list.clearFocus();
				}
			}, 0);
		}));

		// Tree
		const tree = this._register(this.instantiationService.createInstance(
			QuickInputTreeController,
			container,
			this.options.hoverDelegate,
			this.styles
		));
		this._register(tree.tree.onDidChangeFocus(() => {
			if (inputBox.hasFocus()) {
				const activeDescendant = tree.getActiveDescendant();
				if (activeDescendant) {
					inputBox.setAttribute('aria-activedescendant', activeDescendant);
				} else {
					inputBox.removeAttribute('aria-activedescendant');
				}
			}
		}));
		this._register(tree.onLeave(() => {
			// Defer to avoid the input field reacting to the triggering key.
			// TODO@TylerLeonhardt https://github.com/microsoft/vscode/issues/203675
			setTimeout(() => {
				if (!this.controller) {
					return;
				}
				inputBox.setFocus();
				tree.tree.setFocus([]);
			}, 0);
		}));
		// Wire up tree's accept event to the UI's accept emitter for non-pickable items
		this._register(tree.onDidAccept(() => {
			this.onDidAcceptEmitter.fire();
		}));
		this._register(tree.tree.onDidChangeContentHeight(() => this.updateLayout()));

		const focusTracker = dom.trackFocus(container);
		this._register(focusTracker);
		this._register(dom.addDisposableListener(container, dom.EventType.FOCUS, e => {
			const ui = this.getUI();
			if (dom.isAncestor(e.relatedTarget as HTMLElement, ui.inputContainer)) {
				const value = ui.inputBox.isSelectionAtEnd();
				if (this.endOfQuickInputBoxContext.get() !== value) {
					this.endOfQuickInputBoxContext.set(value);
				}
			}
			// Ignore focus events within container
			if (dom.isAncestor(e.relatedTarget as HTMLElement, ui.container)) {
				return;
			}
			this.inQuickInputContext.set(true);
			this.previousFocusElement = dom.isHTMLElement(e.relatedTarget) ? e.relatedTarget : undefined;
		}, true));
		this._register(focusTracker.onDidBlur(() => {
			if (!this.getUI().ignoreFocusOut && !this.options.ignoreFocusOut()) {
				this.hide(QuickInputHideReason.Blur);
			}
			this.inQuickInputContext.set(false);
			this.endOfQuickInputBoxContext.set(false);
			this.previousFocusElement = undefined;
		}));
		this._register(inputBox.onKeyDown(e => {
			const value = this.getUI().inputBox.isSelectionAtEnd();
			if (this.endOfQuickInputBoxContext.get() !== value) {
				this.endOfQuickInputBoxContext.set(value);
			}
			// Allow screen readers to read what's in the input
			// Note: this works for arrow keys and selection changes,
			// but not for deletions since that often triggers a
			// change in the list.
			// Don't remove aria-activedescendant when only modifier keys are pressed
			// to prevent screen reader re-announcements when users press Ctrl to silence speech.
			// See: https://github.com/microsoft/vscode/issues/271032
			if (!isModifierKey(e.keyCode)) {
				inputBox.removeAttribute('aria-activedescendant');
			}
		}));
		this._register(dom.addDisposableListener(container, dom.EventType.FOCUS, (e: FocusEvent) => {
			inputBox.setFocus();
		}));

		// Drag and Drop support
		this.dndController = this._register(this.instantiationService.createInstance(
			QuickInputDragAndDropController,
			this._container,
			container,
			[
				{
					node: titleBar,
					includeChildren: true,
					excludeNodes: [leftActionBar.domNode, rightActionBar.domNode]
				},
				{
					node: headerContainer,
					includeChildren: false
				}
			],
			this.viewState
		));

		// DnD update layout
		this._register(autorun(reader => {
			const dndViewState = this.dndController?.dndViewState.read(reader);
			if (!dndViewState) {
				return;
			}

			if (dndViewState.top !== undefined && dndViewState.left !== undefined) {
				this.viewState = {
					...this.viewState,
					top: dndViewState.top,
					left: dndViewState.left
				};
			} else {
				// Reset position/size
				this.viewState = undefined;
			}

			this.updateLayout();

			// Save position
			if (dndViewState.done) {
				this.saveViewState(this.viewState);
			}
		}));

		this.ui = {
			container,
			styleSheet,
			leftActionBar,
			titleBar,
			title,
			description1,
			description2,
			widget,
			rightActionBar,
			inlineActionBar,
			checkAll,
			inputContainer,
			filterContainer,
			inputBox,
			visibleCountContainer,
			visibleCount,
			countContainer,
			count,
			okContainer,
			ok,
			message,
			customButtonContainer,
			customButton,
			list,
			tree,
			progressBar,
			onDidAccept: this.onDidAcceptEmitter.event,
			onDidCustom: this.onDidCustomEmitter.event,
			onDidTriggerButton: this.onDidTriggerButtonEmitter.event,
			ignoreFocusOut: false,
			keyMods: this.keyMods,
			show: controller => this.show(controller),
			hide: () => this.hide(),
			setVisibilities: visibilities => this.setVisibilities(visibilities),
			setEnabled: enabled => this.setEnabled(enabled),
			setContextKey: contextKey => this.options.setContextKey(contextKey),
			linkOpenerDelegate: content => this.options.linkOpenerDelegate(content)
		};
		this.updateStyles();
		return this.ui;
	}

	private reparentUI(container: HTMLElement): void {
		if (this.ui) {
			this._container = container;
			dom.append(this._container, this.ui.container);
			this.dndController?.reparentUI(this._container);
		}
	}

	pick<T extends IQuickPickItem, O extends IPickOptions<T>>(picks: Promise<QuickPickInput<T>[]> | QuickPickInput<T>[], options: IPickOptions<T> = {}, token: CancellationToken = CancellationToken.None): Promise<(O extends { canPickMany: true } ? T[] : T) | undefined> {
		type R = (O extends { canPickMany: true } ? T[] : T) | undefined;
		return new Promise<R>((doResolve, reject) => {
			let resolve = (result: R) => {
				resolve = doResolve;
				options.onKeyMods?.(input.keyMods);
				doResolve(result);
			};
			if (token.isCancellationRequested) {
				resolve(undefined);
				return;
			}
			const input = this.createQuickPick<T>({ useSeparators: true });
			let activeItem: T | undefined;
			const disposables = [
				input,
				input.onDidAccept(() => {
					if (input.canSelectMany) {
						resolve(<R>input.selectedItems.slice());
						input.hide();
					} else {
						const result = input.activeItems[0];
						if (result) {
							resolve(<R>result);
							input.hide();
						}
					}
				}),
				input.onDidChangeActive(items => {
					const focused = items[0];
					if (focused && options.onDidFocus) {
						options.onDidFocus(focused);
					}
				}),
				input.onDidChangeSelection(items => {
					if (!input.canSelectMany) {
						const result = items[0];
						if (result) {
							resolve(<R>result);
							input.hide();
						}
					}
				}),
				input.onDidTriggerItemButton(event => options.onDidTriggerItemButton && options.onDidTriggerItemButton({
					...event,
					removeItem: () => {
						const index = input.items.indexOf(event.item);
						if (index !== -1) {
							const items = input.items.slice();
							const removed = items.splice(index, 1);
							const activeItems = input.activeItems.filter(activeItem => activeItem !== removed[0]);
							const keepScrollPositionBefore = input.keepScrollPosition;
							input.keepScrollPosition = true;
							input.items = items;
							if (activeItems) {
								input.activeItems = activeItems;
							}
							input.keepScrollPosition = keepScrollPositionBefore;
						}
					}
				})),
				input.onDidTriggerSeparatorButton(event => options.onDidTriggerSeparatorButton?.(event)),
				input.onDidChangeValue(value => {
					if (activeItem && !value && (input.activeItems.length !== 1 || input.activeItems[0] !== activeItem)) {
						input.activeItems = [activeItem];
					}
				}),
				token.onCancellationRequested(() => {
					input.hide();
				}),
				input.onDidHide(() => {
					dispose(disposables);
					resolve(undefined);
				}),
			];
			input.title = options.title;
			if (options.value) {
				input.value = options.value;
			}
			input.canSelectMany = !!options.canPickMany;
			input.placeholder = options.placeHolder;
			input.prompt = options.prompt;
			input.ignoreFocusOut = !!options.ignoreFocusLost;
			input.matchOnDescription = !!options.matchOnDescription;
			input.matchOnDetail = !!options.matchOnDetail;
			if (options.sortByLabel !== undefined) {
				input.sortByLabel = options.sortByLabel;
			}
			input.matchOnLabel = (options.matchOnLabel === undefined) || options.matchOnLabel; // default to true
			input.quickNavigate = options.quickNavigate;
			input.hideInput = !!options.hideInput;
			input.contextKey = options.contextKey;
			input.busy = true;
			Promise.all([picks, options.activeItem])
				.then(([items, _activeItem]) => {
					activeItem = _activeItem;
					input.busy = false;
					input.items = items;
					if (input.canSelectMany) {
						input.selectedItems = items.filter(item => item.type !== 'separator' && item.picked) as T[];
					}
					if (activeItem) {
						input.activeItems = [activeItem];
					}
				});
			input.show();
			Promise.resolve(picks).then(undefined, err => {
				reject(err);
				input.hide();
			});
		});
	}

	private setValidationOnInput(input: IInputBox, validationResult: string | {
		content: string;
		severity: Severity;
	} | null | undefined) {
		if (validationResult && isString(validationResult)) {
			input.severity = Severity.Error;
			input.validationMessage = validationResult;
		} else if (validationResult && !isString(validationResult)) {
			input.severity = validationResult.severity;
			input.validationMessage = validationResult.content;
		} else {
			input.severity = Severity.Ignore;
			input.validationMessage = undefined;
		}
	}

	input(options: IInputOptions = {}, token: CancellationToken = CancellationToken.None): Promise<string | undefined> {
		return new Promise<string | undefined>((resolve) => {
			if (token.isCancellationRequested) {
				resolve(undefined);
				return;
			}
			const input = this.createInputBox();
			const validateInput = options.validateInput || (() => Promise.resolve(undefined));
			const onDidValueChange = Event.debounce(input.onDidChangeValue, (last, cur) => cur, 100);
			let validationValue = options.value || '';
			let validation = Promise.resolve(validateInput(validationValue));
			const disposables = [
				input,
				onDidValueChange(value => {
					if (value !== validationValue) {
						validation = Promise.resolve(validateInput(value));
						validationValue = value;
					}
					validation.then(result => {
						if (value === validationValue) {
							this.setValidationOnInput(input, result);
						}
					});
				}),
				input.onDidAccept(() => {
					const value = input.value;
					if (value !== validationValue) {
						validation = Promise.resolve(validateInput(value));
						validationValue = value;
					}
					validation.then(result => {
						if (!result || (!isString(result) && result.severity !== Severity.Error)) {
							resolve(value);
							input.hide();
						} else if (value === validationValue) {
							this.setValidationOnInput(input, result);
						}
					});
				}),
				token.onCancellationRequested(() => {
					input.hide();
				}),
				input.onDidHide(() => {
					dispose(disposables);
					resolve(undefined);
				}),
			];

			input.title = options.title;
			input.value = options.value || '';
			input.valueSelection = options.valueSelection;
			input.prompt = options.prompt;
			input.placeholder = options.placeHolder;
			input.password = !!options.password;
			input.ignoreFocusOut = !!options.ignoreFocusLost;
			input.show();
		});
	}

	backButton = backButton;

	createQuickPick<T extends IQuickPickItem>(options: { useSeparators: true }): IQuickPick<T, { useSeparators: true }>;
	createQuickPick<T extends IQuickPickItem>(options?: { useSeparators: boolean }): IQuickPick<T, { useSeparators: false }>;
	createQuickPick<T extends IQuickPickItem>(options: { useSeparators: boolean } = { useSeparators: false }): IQuickPick<T, { useSeparators: boolean }> {
		const ui = this.getUI(true);
		return new QuickPick<T, typeof options>(ui);
	}

	createInputBox(): IInputBox {
		const ui = this.getUI(true);
		return new InputBox(ui);
	}

	setAlignment(alignment: 'top' | 'center' | { top: number; left: number }): void {
		this.dndController?.setAlignment(alignment);
	}

	createQuickWidget(): IQuickWidget {
		const ui = this.getUI(true);
		return new QuickWidget(ui);
	}

	createQuickTree<T extends IQuickTreeItem>(): IQuickTree<T> {
		const ui = this.getUI(true);
		return new QuickTree<T>(ui);
	}

	private show(controller: IQuickInput) {
		const ui = this.getUI(true);
		this.onShowEmitter.fire();
		const oldController = this.controller;
		this.controller = controller;
		oldController?.didHide();

		this.setEnabled(true);
		ui.leftActionBar.clear();
		ui.title.textContent = '';
		ui.description1.textContent = '';
		ui.description2.textContent = '';
		dom.reset(ui.widget);
		ui.rightActionBar.clear();
		ui.inlineActionBar.clear();
		ui.checkAll.checked = false;
		// ui.inputBox.value = ''; Avoid triggering an event.
		ui.inputBox.placeholder = '';
		ui.inputBox.password = false;
		ui.inputBox.showDecoration(Severity.Ignore);
		ui.visibleCount.setCount(0);
		ui.count.setCount(0);
		dom.reset(ui.message);
		ui.progressBar.stop();
		ui.progressBar.getContainer().setAttribute('aria-hidden', 'true');
		ui.list.setElements([]);
		ui.list.matchOnDescription = false;
		ui.list.matchOnDetail = false;
		ui.list.matchOnLabel = true;
		ui.list.sortByLabel = true;
		ui.tree.updateFilterOptions({
			matchOnDescription: false,
			matchOnLabel: true
		});
		ui.tree.sortByLabel = true;
		ui.ignoreFocusOut = false;
		ui.inputBox.toggles = undefined;
		ui.inputBox.actions = undefined;

		const backKeybindingLabel = this.options.backKeybindingLabel();
		backButton.tooltip = backKeybindingLabel ? localize('quickInput.backWithKeybinding', "Back ({0})", backKeybindingLabel) : localize('quickInput.back', "Back");

		ui.container.style.display = '';
		this.updateLayout();
		this.dndController?.layoutContainer();
		ui.inputBox.setFocus();
		this.quickInputTypeContext.set(controller.type);
	}

	isVisible(): boolean {
		return !!this.ui && this.ui.container.style.display !== 'none';
	}

	private setVisibilities(visibilities: Visibilities) {
		const ui = this.getUI();
		ui.title.style.display = visibilities.title ? '' : 'none';
		ui.description1.style.display = visibilities.description && (visibilities.inputBox || visibilities.checkAll) ? '' : 'none';
		ui.description2.style.display = visibilities.description && !(visibilities.inputBox || visibilities.checkAll) ? '' : 'none';
		ui.checkAll.domNode.style.display = visibilities.checkAll ? '' : 'none';
		ui.inputContainer.style.display = visibilities.inputBox ? '' : 'none';
		ui.filterContainer.style.display = visibilities.inputBox ? '' : 'none';
		ui.visibleCountContainer.style.display = visibilities.visibleCount ? '' : 'none';
		ui.countContainer.style.display = visibilities.count ? '' : 'none';
		ui.okContainer.style.display = visibilities.ok ? '' : 'none';
		ui.customButtonContainer.style.display = visibilities.customButton ? '' : 'none';
		ui.message.style.display = visibilities.message ? '' : 'none';
		ui.progressBar.getContainer().style.display = visibilities.progressBar ? '' : 'none';
		ui.list.displayed = !!visibilities.list;
		ui.tree.displayed = !!visibilities.tree;
		ui.container.classList.toggle('show-checkboxes', !!visibilities.checkBox);
		ui.container.classList.toggle('hidden-input', !visibilities.inputBox && !visibilities.description);
		this.updateLayout(); // TODO
	}

	private setEnabled(enabled: boolean) {
		if (enabled !== this.enabled) {
			this.enabled = enabled;
			const ui = this.getUI();
			for (const item of ui.leftActionBar.viewItems) {
				(item as ActionViewItem).action.enabled = enabled;
			}
			for (const item of ui.rightActionBar.viewItems) {
				(item as ActionViewItem).action.enabled = enabled;
			}
			if (enabled) {
				ui.checkAll.enable();
			} else {
				ui.checkAll.disable();
			}
			ui.inputBox.enabled = enabled;
			ui.ok.enabled = enabled;
			ui.list.enabled = enabled;
		}
	}

	hide(reason?: QuickInputHideReason) {
		const controller = this.controller;
		if (!controller) {
			return;
		}
		controller.willHide(reason);

		const container = this.ui?.container;
		const focusChanged = container && !dom.isAncestorOfActiveElement(container);
		this.controller = null;
		this.onHideEmitter.fire();
		if (container) {
			container.style.display = 'none';
		}
		if (!focusChanged) {
			let currentElement = this.previousFocusElement;
			while (currentElement && !currentElement.offsetParent) {
				currentElement = currentElement.parentElement ?? undefined;
			}
			if (currentElement?.offsetParent) {
				currentElement.focus();
				this.previousFocusElement = undefined;
			} else {
				this.options.returnFocus();
			}
		}
		controller.didHide(reason);
	}

	focus() {
		if (this.isVisible()) {
			const ui = this.getUI();
			if (ui.inputBox.enabled) {
				ui.inputBox.setFocus();
			} else {
				ui.list.domFocus();
			}
		}
	}

	toggle() {
		if (this.isVisible() && this.controller instanceof QuickPick && this.controller.canSelectMany) {
			this.getUI().list.toggleCheckbox();
		}
	}

	toggleHover() {
		if (this.isVisible() && this.controller instanceof QuickPick) {
			this.getUI().list.toggleHover();
		}
	}

	navigate(next: boolean, quickNavigate?: IQuickNavigateConfiguration) {
		if (this.isVisible() && this.getUI().list.displayed) {
			this.getUI().list.focus(next ? QuickPickFocus.Next : QuickPickFocus.Previous);
			if (quickNavigate && this.controller instanceof QuickPick) {
				this.controller.quickNavigate = quickNavigate;
			}
		}
	}

	async accept(keyMods: IKeyMods = { alt: false, ctrlCmd: false }) {
		// When accepting the item programmatically, it is important that
		// we update `keyMods` either from the provided set or unset it
		// because the accept did not happen from mouse or keyboard
		// interaction on the list itself
		this.keyMods.alt = keyMods.alt;
		this.keyMods.ctrlCmd = keyMods.ctrlCmd;

		this.onDidAcceptEmitter.fire();
	}

	async back() {
		this.onDidTriggerButtonEmitter.fire(this.backButton);
	}

	async cancel(reason?: QuickInputHideReason) {
		this.hide(reason);
	}

	layout(dimension: dom.IDimension, titleBarOffset: number): void {
		this.dimension = dimension;
		this.titleBarOffset = titleBarOffset;
		this.updateLayout();
	}

	private updateLayout() {
		if (this.ui && this.isVisible()) {
			const style = this.ui.container.style;
			const width = Math.min(this.dimension!.width * 0.62 /* golden cut */, QuickInputController.MAX_WIDTH);
			style.width = width + 'px';

			// Position
			style.top = `${this.viewState?.top ? Math.round(this.dimension!.height * this.viewState.top) : this.titleBarOffset}px`;
			style.left = `${Math.round((this.dimension!.width * (this.viewState?.left ?? 0.5 /* center */)) - (width / 2))}px`;

			this.ui.inputBox.layout();
			this.ui.list.layout(this.dimension && this.dimension.height * 0.4);
			this.ui.tree.layout(this.dimension && this.dimension.height * 0.4);
		}
	}

	applyStyles(styles: IQuickInputStyles) {
		this.styles = styles;
		this.updateStyles();
	}

	private updateStyles() {
		if (this.ui) {
			const {
				quickInputTitleBackground, quickInputBackground, quickInputForeground, widgetBorder, widgetShadow,
			} = this.styles.widget;
			this.ui.titleBar.style.backgroundColor = quickInputTitleBackground ?? '';
			this.ui.container.style.backgroundColor = quickInputBackground ?? '';
			this.ui.container.style.color = quickInputForeground ?? '';
			this.ui.container.style.border = widgetBorder ? `1px solid ${widgetBorder}` : '';
			this.ui.container.style.boxShadow = widgetShadow ? `0 0 8px 2px ${widgetShadow}` : '';
			this.ui.list.style(this.styles.list);
			this.ui.tree.tree.style(this.styles.list);

			const content: string[] = [];
			if (this.styles.pickerGroup.pickerGroupBorder) {
				content.push(`.quick-input-list .quick-input-list-entry { border-top-color:  ${this.styles.pickerGroup.pickerGroupBorder}; }`);
			}
			if (this.styles.pickerGroup.pickerGroupForeground) {
				content.push(`.quick-input-list .quick-input-list-separator { color:  ${this.styles.pickerGroup.pickerGroupForeground}; }`);
			}
			if (this.styles.pickerGroup.pickerGroupForeground) {
				content.push(`.quick-input-list .quick-input-list-separator-as-item { color: var(--vscode-descriptionForeground); }`);
			}

			if (this.styles.keybindingLabel.keybindingLabelBackground ||
				this.styles.keybindingLabel.keybindingLabelBorder ||
				this.styles.keybindingLabel.keybindingLabelBottomBorder ||
				this.styles.keybindingLabel.keybindingLabelShadow ||
				this.styles.keybindingLabel.keybindingLabelForeground) {
				content.push('.quick-input-list .monaco-keybinding > .monaco-keybinding-key {');
				if (this.styles.keybindingLabel.keybindingLabelBackground) {
					content.push(`background-color: ${this.styles.keybindingLabel.keybindingLabelBackground};`);
				}
				if (this.styles.keybindingLabel.keybindingLabelBorder) {
					// Order matters here. `border-color` must come before `border-bottom-color`.
					content.push(`border-color: ${this.styles.keybindingLabel.keybindingLabelBorder};`);
				}
				if (this.styles.keybindingLabel.keybindingLabelBottomBorder) {
					content.push(`border-bottom-color: ${this.styles.keybindingLabel.keybindingLabelBottomBorder};`);
				}
				if (this.styles.keybindingLabel.keybindingLabelShadow) {
					content.push(`box-shadow: inset 0 -1px 0 ${this.styles.keybindingLabel.keybindingLabelShadow};`);
				}
				if (this.styles.keybindingLabel.keybindingLabelForeground) {
					content.push(`color: ${this.styles.keybindingLabel.keybindingLabelForeground};`);
				}
				content.push('}');
			}

			const newStyles = content.join('\n');
			if (newStyles !== this.ui.styleSheet.textContent) {
				this.ui.styleSheet.textContent = newStyles;
			}
		}
	}

	private loadViewState(): QuickInputViewState | undefined {
		try {
			const data = JSON.parse(this.storageService.get(VIEWSTATE_STORAGE_KEY, StorageScope.APPLICATION, '{}'));
			if (data.top !== undefined || data.left !== undefined) {
				return data;
			}
		} catch { }

		return undefined;
	}

	private saveViewState(viewState: QuickInputViewState | undefined): void {
		const isMainWindow = this.layoutService.activeContainer === this.layoutService.mainContainer;
		if (!isMainWindow) {
			return;
		}

		if (viewState !== undefined) {
			this.storageService.store(VIEWSTATE_STORAGE_KEY, JSON.stringify(viewState), StorageScope.APPLICATION, StorageTarget.MACHINE);
		} else {
			this.storageService.remove(VIEWSTATE_STORAGE_KEY, StorageScope.APPLICATION);
		}
	}
}

export interface IQuickInputControllerHost extends ILayoutService { }

class QuickInputDragAndDropController extends Disposable {
	readonly dndViewState = observableValue<{ top?: number; left?: number; done: boolean } | undefined>(this, undefined);

	private readonly _snapThreshold = 20;
	private readonly _snapLineHorizontalRatio = 0.25;

	private readonly _controlsOnLeft: boolean;
	private readonly _controlsOnRight: boolean;

	private _quickInputAlignmentContext: IContextKey<'center' | 'top' | undefined>;

	constructor(
		private _container: HTMLElement,
		private readonly _quickInputContainer: HTMLElement,
		private _quickInputDragAreas: { node: HTMLElement; includeChildren: boolean; excludeNodes?: HTMLElement[] }[],
		initialViewState: QuickInputViewState | undefined,
		@ILayoutService private readonly _layoutService: ILayoutService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		super();
		this._quickInputAlignmentContext = QuickInputAlignmentContextKey.bindTo(contextKeyService);
		const customWindowControls = getWindowControlsStyle(this.configurationService) === WindowControlsStyle.CUSTOM;

		// Do not allow the widget to overflow or underflow window controls.
		// Use CSS calculations to avoid having to force layout with `.clientWidth`
		this._controlsOnLeft = customWindowControls && platform === Platform.Mac;
		this._controlsOnRight = customWindowControls && (platform === Platform.Windows || platform === Platform.Linux);
		this._registerLayoutListener();
		this.registerMouseListeners();
		this.dndViewState.set({ ...initialViewState, done: true }, undefined);
	}

	reparentUI(container: HTMLElement): void {
		this._container = container;
	}

	layoutContainer(dimension = this._layoutService.activeContainerDimension): void {
		const state = this.dndViewState.get();
		const dragAreaRect = this._quickInputContainer.getBoundingClientRect();
		if (state?.top && state?.left) {
			const a = Math.round(state.left * 1e2) / 1e2;
			const b = dimension.width;
			const c = dragAreaRect.width;
			const d = a * b - c / 2;
			this._layout(state.top * dimension.height, d);
		}
	}

	setAlignment(alignment: 'top' | 'center' | { top: number; left: number }, done = true): void {
		if (alignment === 'top') {
			this.dndViewState.set({
				top: this._getTopSnapValue() / this._container.clientHeight,
				left: (this._getCenterXSnapValue() + (this._quickInputContainer.clientWidth / 2)) / this._container.clientWidth,
				done
			}, undefined);
			this._quickInputAlignmentContext.set('top');
		} else if (alignment === 'center') {
			this.dndViewState.set({
				top: this._getCenterYSnapValue() / this._container.clientHeight,
				left: (this._getCenterXSnapValue() + (this._quickInputContainer.clientWidth / 2)) / this._container.clientWidth,
				done
			}, undefined);
			this._quickInputAlignmentContext.set('center');
		} else {
			this.dndViewState.set({ top: alignment.top, left: alignment.left, done }, undefined);
			this._quickInputAlignmentContext.set(undefined);
		}
	}

	private _registerLayoutListener() {
		this._register(Event.filter(this._layoutService.onDidLayoutContainer, e => e.container === this._container)((e) => this.layoutContainer(e.dimension)));
	}

	private registerMouseListeners(): void {
		const dragArea = this._quickInputContainer;

		// Double click
		this._register(dom.addDisposableGenericMouseUpListener(dragArea, (event: MouseEvent) => {
			const originEvent = new StandardMouseEvent(dom.getWindow(dragArea), event);
			if (originEvent.detail !== 2) {
				return;
			}

			// Ignore event if the target is not the drag area
			const area = this._quickInputDragAreas.find(({ node, includeChildren }) => includeChildren ? dom.isAncestor(originEvent.target, node) : originEvent.target === node);
			if (!area || area.excludeNodes?.some(node => dom.isAncestor(originEvent.target, node))) {
				return;
			}

			this.dndViewState.set({ top: undefined, left: undefined, done: true }, undefined);
		}));

		// Mouse down
		this._register(dom.addDisposableGenericMouseDownListener(dragArea, (e: MouseEvent) => {
			const activeWindow = dom.getWindow(this._layoutService.activeContainer);
			const originEvent = new StandardMouseEvent(activeWindow, e);

			// Ignore event if the target is not the drag area
			const area = this._quickInputDragAreas.find(({ node, includeChildren }) => includeChildren ? dom.isAncestor(originEvent.target, node) : originEvent.target === node);
			if (!area || area.excludeNodes?.some(node => dom.isAncestor(originEvent.target, node))) {
				return;
			}

			// Mouse position offset relative to dragArea
			const dragAreaRect = this._quickInputContainer.getBoundingClientRect();
			const dragOffsetX = originEvent.browserEvent.clientX - dragAreaRect.left;
			const dragOffsetY = originEvent.browserEvent.clientY - dragAreaRect.top;

			let isMovingQuickInput = false;
			const mouseMoveListener = dom.addDisposableGenericMouseMoveListener(activeWindow, (e: MouseEvent) => {
				const mouseMoveEvent = new StandardMouseEvent(activeWindow, e);
				mouseMoveEvent.preventDefault();

				if (!isMovingQuickInput) {
					isMovingQuickInput = true;
				}

				this._layout(e.clientY - dragOffsetY, e.clientX - dragOffsetX);
			});
			const mouseUpListener = dom.addDisposableGenericMouseUpListener(activeWindow, (e: MouseEvent) => {
				if (isMovingQuickInput) {
					// Save position
					const state = this.dndViewState.get();
					this.dndViewState.set({ top: state?.top, left: state?.left, done: true }, undefined);
				}

				// Dispose listeners
				mouseMoveListener.dispose();
				mouseUpListener.dispose();
			});
		}));
	}

	private _layout(topCoordinate: number, leftCoordinate: number) {
		const snapCoordinateYTop = this._getTopSnapValue();
		const snapCoordinateY = this._getCenterYSnapValue();
		const snapCoordinateX = this._getCenterXSnapValue();
		// Make sure the quick input is not moved outside the container
		topCoordinate = Math.max(0, Math.min(topCoordinate, this._container.clientHeight - this._quickInputContainer.clientHeight));

		if (topCoordinate < this._layoutService.activeContainerOffset.top) {
			if (this._controlsOnLeft) {
				leftCoordinate = Math.max(leftCoordinate, 80 / getZoomFactor(dom.getActiveWindow()));
			} else if (this._controlsOnRight) {
				leftCoordinate = Math.min(leftCoordinate, this._container.clientWidth - this._quickInputContainer.clientWidth - (140 / getZoomFactor(dom.getActiveWindow())));
			}
		}

		const snappingToTop = Math.abs(topCoordinate - snapCoordinateYTop) < this._snapThreshold;
		topCoordinate = snappingToTop ? snapCoordinateYTop : topCoordinate;
		const snappingToCenter = Math.abs(topCoordinate - snapCoordinateY) < this._snapThreshold;
		topCoordinate = snappingToCenter ? snapCoordinateY : topCoordinate;
		const top = topCoordinate / this._container.clientHeight;

		// Make sure the quick input is not moved outside the container
		leftCoordinate = Math.max(0, Math.min(leftCoordinate, this._container.clientWidth - this._quickInputContainer.clientWidth));
		const snappingToCenterX = Math.abs(leftCoordinate - snapCoordinateX) < this._snapThreshold;
		leftCoordinate = snappingToCenterX ? snapCoordinateX : leftCoordinate;

		const b = this._container.clientWidth;
		const c = this._quickInputContainer.clientWidth;
		const d = leftCoordinate;
		const left = (d + c / 2) / b;

		this.dndViewState.set({ top, left, done: false }, undefined);
		if (snappingToCenterX) {
			if (snappingToTop) {
				this._quickInputAlignmentContext.set('top');
				return;
			} else if (snappingToCenter) {
				this._quickInputAlignmentContext.set('center');
				return;
			}
		}
		this._quickInputAlignmentContext.set(undefined);
	}

	private _getTopSnapValue() {
		return this._layoutService.activeContainerOffset.quickPickTop;
	}

	private _getCenterYSnapValue() {
		return Math.round(this._container.clientHeight * this._snapLineHorizontalRatio);
	}

	private _getCenterXSnapValue() {
		return Math.round(this._container.clientWidth / 2) - Math.round(this._quickInputContainer.clientWidth / 2);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/browser/quickInputList.ts]---
Location: vscode-main/src/vs/platform/quickinput/browser/quickInputList.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as cssJs from '../../../base/browser/cssValue.js';
import * as dom from '../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../base/browser/keyboardEvent.js';
import { ActionBar } from '../../../base/browser/ui/actionbar/actionbar.js';
import { AriaRole } from '../../../base/browser/ui/aria/aria.js';
import type { IHoverWidget, IManagedHoverTooltipMarkdownString } from '../../../base/browser/ui/hover/hover.js';
import { IHoverDelegate } from '../../../base/browser/ui/hover/hoverDelegate.js';
import { HoverPosition } from '../../../base/browser/ui/hover/hoverWidget.js';
import { IIconLabelValueOptions, IconLabel } from '../../../base/browser/ui/iconLabel/iconLabel.js';
import { KeybindingLabel } from '../../../base/browser/ui/keybindingLabel/keybindingLabel.js';
import { IListVirtualDelegate } from '../../../base/browser/ui/list/list.js';
import { IListAccessibilityProvider, IListStyles } from '../../../base/browser/ui/list/listWidget.js';
import { Checkbox, createToggleActionViewItemProvider, IToggleStyles } from '../../../base/browser/ui/toggle/toggle.js';
import { RenderIndentGuides } from '../../../base/browser/ui/tree/abstractTree.js';
import { IObjectTreeElement, ITreeNode, ITreeRenderer, TreeVisibility } from '../../../base/browser/ui/tree/tree.js';
import { equals } from '../../../base/common/arrays.js';
import { ThrottledDelayer } from '../../../base/common/async.js';
import { compareAnything } from '../../../base/common/comparers.js';
import { memoize } from '../../../base/common/decorators.js';
import { isCancellationError } from '../../../base/common/errors.js';
import { Emitter, Event, EventBufferer, IValueWithChangeEvent } from '../../../base/common/event.js';
import { IMatch } from '../../../base/common/filters.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';
import { IParsedLabelWithIcons, getCodiconAriaLabel, matchesFuzzyIconAware, parseLabelWithIcons } from '../../../base/common/iconLabels.js';
import { KeyCode } from '../../../base/common/keyCodes.js';
import { Lazy } from '../../../base/common/lazy.js';
import { Disposable, DisposableStore, MutableDisposable } from '../../../base/common/lifecycle.js';
import { observableValue, observableValueOpts, transaction } from '../../../base/common/observable.js';
import { OS } from '../../../base/common/platform.js';
import { escape, ltrim } from '../../../base/common/strings.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { IAccessibilityService } from '../../accessibility/common/accessibility.js';
import { IInstantiationService } from '../../instantiation/common/instantiation.js';
import { WorkbenchObjectTree } from '../../list/browser/listService.js';
import { defaultCheckboxStyles } from '../../theme/browser/defaultStyles.js';
import { isDark } from '../../theme/common/theme.js';
import { IThemeService } from '../../theme/common/themeService.js';
import { IQuickPickItem, IQuickPickItemButtonEvent, IQuickPickSeparator, IQuickPickSeparatorButtonEvent, QuickPickFocus, QuickPickItem } from '../common/quickInput.js';
import { IQuickInputStyles } from './quickInput.js';
import { quickInputButtonToAction } from './quickInputUtils.js';

const $ = dom.$;

interface IQuickInputItemLazyParts {
	readonly saneLabel: string;
	readonly saneSortLabel: string;
	readonly saneAriaLabel: string;
}

interface IQuickPickElement extends IQuickInputItemLazyParts {
	readonly hasCheckbox: boolean;
	readonly index: number;
	readonly item?: IQuickPickItem;
	readonly saneDescription?: string;
	readonly saneDetail?: string;
	readonly saneTooltip?: string | IMarkdownString | HTMLElement;
	hidden: boolean;
	element?: HTMLElement;
	labelHighlights?: IMatch[];
	descriptionHighlights?: IMatch[];
	detailHighlights?: IMatch[];
	separator?: IQuickPickSeparator;
}

interface IQuickInputItemTemplateData {
	entry: HTMLDivElement;
	checkbox: MutableDisposable<Checkbox>;
	icon: HTMLDivElement;
	outerLabel: HTMLElement;
	label: IconLabel;
	keybinding: KeybindingLabel;
	detail: IconLabel;
	separator: HTMLDivElement;
	actionBar: ActionBar;
	element: IQuickPickElement;
	toDisposeElement: DisposableStore;
	toDisposeTemplate: DisposableStore;
}

class BaseQuickPickItemElement implements IQuickPickElement {
	private readonly _init: Lazy<IQuickInputItemLazyParts>;

	constructor(
		readonly index: number,
		readonly hasCheckbox: boolean,
		mainItem: QuickPickItem
	) {
		this._init = new Lazy(() => {
			const saneLabel = mainItem.label ?? '';
			const saneSortLabel = parseLabelWithIcons(saneLabel).text.trim();

			const saneAriaLabel = mainItem.ariaLabel || [saneLabel, this.saneDescription, this.saneDetail]
				.map(s => getCodiconAriaLabel(s))
				.filter(s => !!s)
				.join(', ');

			return {
				saneLabel,
				saneSortLabel,
				saneAriaLabel
			};
		});
		this._saneDescription = mainItem.description;
		this._saneTooltip = mainItem.tooltip;
	}

	// #region Lazy Getters

	get saneLabel() {
		return this._init.value.saneLabel;
	}
	get saneSortLabel() {
		return this._init.value.saneSortLabel;
	}
	get saneAriaLabel() {
		return this._init.value.saneAriaLabel;
	}

	// #endregion

	// #region Getters and Setters

	private _element?: HTMLElement;
	get element() {
		return this._element;
	}
	set element(value: HTMLElement | undefined) {
		this._element = value;
	}

	private _hidden = false;
	get hidden() {
		return this._hidden;
	}
	set hidden(value: boolean) {
		this._hidden = value;
	}

	private _saneDescription?: string;
	get saneDescription() {
		return this._saneDescription;
	}
	set saneDescription(value: string | undefined) {
		this._saneDescription = value;
	}

	protected _saneDetail?: string;
	get saneDetail() {
		return this._saneDetail;
	}
	set saneDetail(value: string | undefined) {
		this._saneDetail = value;
	}

	private _saneTooltip?: string | IMarkdownString | HTMLElement;
	get saneTooltip() {
		return this._saneTooltip;
	}
	set saneTooltip(value: string | IMarkdownString | HTMLElement | undefined) {
		this._saneTooltip = value;
	}

	protected _labelHighlights?: IMatch[];
	get labelHighlights() {
		return this._labelHighlights;
	}
	set labelHighlights(value: IMatch[] | undefined) {
		this._labelHighlights = value;
	}

	protected _descriptionHighlights?: IMatch[];
	get descriptionHighlights() {
		return this._descriptionHighlights;
	}
	set descriptionHighlights(value: IMatch[] | undefined) {
		this._descriptionHighlights = value;
	}

	protected _detailHighlights?: IMatch[];
	get detailHighlights() {
		return this._detailHighlights;
	}
	set detailHighlights(value: IMatch[] | undefined) {
		this._detailHighlights = value;
	}
}

class QuickPickItemElement extends BaseQuickPickItemElement {
	readonly onChecked: Event<boolean>;

	constructor(
		index: number,
		readonly childIndex: number,
		hasCheckbox: boolean,
		readonly fireButtonTriggered: (event: IQuickPickItemButtonEvent<IQuickPickItem>) => void,
		private _onChecked: Emitter<{ element: IQuickPickElement; checked: boolean }>,
		readonly item: IQuickPickItem,
		private _separator: IQuickPickSeparator | undefined,
	) {
		super(index, hasCheckbox, item);

		this.onChecked = hasCheckbox
			? Event.map(Event.filter<{ element: IQuickPickElement; checked: boolean }>(this._onChecked.event, e => e.element === this), e => e.checked)
			: Event.None;

		this._saneDetail = item.detail;
		this._labelHighlights = item.highlights?.label;
		this._descriptionHighlights = item.highlights?.description;
		this._detailHighlights = item.highlights?.detail;
	}

	get separator() {
		return this._separator;
	}
	set separator(value: IQuickPickSeparator | undefined) {
		this._separator = value;
	}

	private _checked = false;
	get checked() {
		return this._checked;
	}
	set checked(value: boolean) {
		if (value !== this._checked) {
			this._checked = value;
			this._onChecked.fire({ element: this, checked: value });
		}
	}

	get checkboxDisabled() {
		return !!this.item.disabled;
	}
}

enum QuickPickSeparatorFocusReason {
	/**
	 * No item is hovered or active
	 */
	NONE = 0,
	/**
	 * Some item within this section is hovered
	 */
	MOUSE_HOVER = 1,
	/**
	 * Some item within this section is active
	 */
	ACTIVE_ITEM = 2
}

class QuickPickSeparatorElement extends BaseQuickPickItemElement {
	children = new Array<QuickPickItemElement>();
	/**
	 * If this item is >0, it means that there is some item in the list that is either:
	 * * hovered over
	 * * active
	 */
	focusInsideSeparator = QuickPickSeparatorFocusReason.NONE;

	constructor(
		index: number,
		readonly fireSeparatorButtonTriggered: (event: IQuickPickSeparatorButtonEvent) => void,
		readonly separator: IQuickPickSeparator,
	) {
		super(index, false, separator);
	}
}

class QuickInputItemDelegate implements IListVirtualDelegate<IQuickPickElement> {
	getHeight(element: IQuickPickElement): number {

		if (element instanceof QuickPickSeparatorElement) {
			return 30;
		}
		return element.saneDetail ? 44 : 22;
	}

	getTemplateId(element: IQuickPickElement): string {
		if (element instanceof QuickPickItemElement) {
			return QuickPickItemElementRenderer.ID;
		} else {
			return QuickPickSeparatorElementRenderer.ID;
		}
	}
}

class QuickInputAccessibilityProvider implements IListAccessibilityProvider<IQuickPickElement> {

	getWidgetAriaLabel(): string {
		return localize('quickInput', "Quick Input");
	}

	getAriaLabel(element: IQuickPickElement): string | null {
		return element.separator?.label
			? `${element.saneAriaLabel}, ${element.separator.label}`
			: element.saneAriaLabel;
	}

	getWidgetRole(): AriaRole {
		return 'listbox';
	}

	getRole(element: IQuickPickElement) {
		return element.hasCheckbox ? 'checkbox' : 'option';
	}

	isChecked(element: IQuickPickElement): IValueWithChangeEvent<boolean> | undefined {
		if (!element.hasCheckbox || !(element instanceof QuickPickItemElement)) {
			return undefined;
		}

		return {
			get value() { return element.checked; },
			onDidChange: e => element.onChecked(() => e()),
		};
	}
}

abstract class BaseQuickInputListRenderer<T extends IQuickPickElement> implements ITreeRenderer<T, void, IQuickInputItemTemplateData> {
	abstract templateId: string;

	constructor(
		private readonly hoverDelegate: IHoverDelegate | undefined,
		private readonly toggleStyles: IToggleStyles
	) { }

	// TODO: only do the common stuff here and have a subclass handle their specific stuff
	renderTemplate(container: HTMLElement): IQuickInputItemTemplateData {
		const data: IQuickInputItemTemplateData = Object.create(null);
		data.toDisposeElement = new DisposableStore();
		data.toDisposeTemplate = new DisposableStore();
		data.entry = dom.append(container, $('.quick-input-list-entry'));

		// Checkbox
		const label = dom.append(data.entry, $('label.quick-input-list-label'));
		data.outerLabel = label;
		data.checkbox = data.toDisposeTemplate.add(new MutableDisposable());
		data.toDisposeTemplate.add(dom.addStandardDisposableListener(label, dom.EventType.CLICK, e => {
			// `label` elements with role=checkboxes don't automatically toggle them like normal <checkbox> elements
			if (data.checkbox.value && !e.defaultPrevented && data.checkbox.value.enabled) {
				const checked = !data.checkbox.value.checked;
				data.checkbox.value.checked = checked;
				(data.element as QuickPickItemElement).checked = checked;
			}
		}));

		// Rows
		const rows = dom.append(label, $('.quick-input-list-rows'));
		const row1 = dom.append(rows, $('.quick-input-list-row'));
		const row2 = dom.append(rows, $('.quick-input-list-row'));

		// Label
		data.label = new IconLabel(row1, { supportHighlights: true, supportDescriptionHighlights: true, supportIcons: true, hoverDelegate: this.hoverDelegate });
		data.toDisposeTemplate.add(data.label);
		data.icon = dom.prepend(data.label.element, $('.quick-input-list-icon'));

		// Keybinding
		const keybindingContainer = dom.append(row1, $('.quick-input-list-entry-keybinding'));
		data.keybinding = new KeybindingLabel(keybindingContainer, OS);
		data.toDisposeTemplate.add(data.keybinding);

		// Detail
		const detailContainer = dom.append(row2, $('.quick-input-list-label-meta'));
		data.detail = new IconLabel(detailContainer, { supportHighlights: true, supportIcons: true, hoverDelegate: this.hoverDelegate });
		data.toDisposeTemplate.add(data.detail);

		// Separator
		data.separator = dom.append(data.entry, $('.quick-input-list-separator'));

		// Actions
		data.actionBar = new ActionBar(data.entry, {
			...(this.hoverDelegate ? { hoverDelegate: this.hoverDelegate } : undefined),
			actionViewItemProvider: createToggleActionViewItemProvider(this.toggleStyles)
		});
		data.actionBar.domNode.classList.add('quick-input-list-entry-action-bar');
		data.toDisposeTemplate.add(data.actionBar);

		return data;
	}

	disposeTemplate(data: IQuickInputItemTemplateData): void {
		data.toDisposeElement.dispose();
		data.toDisposeTemplate.dispose();
	}

	disposeElement(_element: ITreeNode<IQuickPickElement, void>, _index: number, data: IQuickInputItemTemplateData): void {
		data.toDisposeElement.clear();
		data.actionBar.clear();
	}

	// TODO: only do the common stuff here and have a subclass handle their specific stuff
	abstract renderElement(node: ITreeNode<IQuickPickElement, void>, index: number, data: IQuickInputItemTemplateData): void;
}

class QuickPickItemElementRenderer extends BaseQuickInputListRenderer<QuickPickItemElement> {
	static readonly ID = 'quickpickitem';

	// Follow what we do in the separator renderer
	private readonly _itemsWithSeparatorsFrequency = new Map<QuickPickItemElement, number>();

	constructor(
		hoverDelegate: IHoverDelegate | undefined,
		toggleStyles: IToggleStyles,
		@IThemeService private readonly themeService: IThemeService,
	) {
		super(hoverDelegate, toggleStyles);
	}

	get templateId() {
		return QuickPickItemElementRenderer.ID;
	}

	private ensureCheckbox(element: QuickPickItemElement, data: IQuickInputItemTemplateData) {
		if (!element.hasCheckbox) {
			data.checkbox.value?.domNode.remove();
			data.checkbox.clear();
			return;
		}

		let checkbox = data.checkbox.value;
		if (!checkbox) {
			checkbox = new Checkbox(element.saneLabel, element.checked, { ...defaultCheckboxStyles, size: 15 });
			data.checkbox.value = checkbox;
			data.outerLabel.prepend(checkbox.domNode);
			// Remove checkbox from tab order since tree items are navigable with arrow keys
			// This prevents the issue where pressing Space toggles both the tabbed checkbox and the focused item
			checkbox.domNode.tabIndex = -1;
		} else {
			checkbox.setTitle(element.saneLabel);
		}

		if (element.checkboxDisabled) {
			checkbox.disable();
		} else {
			checkbox.enable();
		}

		checkbox.checked = element.checked;
		data.toDisposeElement.add(element.onChecked(checked => checkbox.checked = checked));
		data.toDisposeElement.add(checkbox.onChange(() => element.checked = checkbox.checked));
	}

	renderElement(node: ITreeNode<QuickPickItemElement, void>, index: number, data: IQuickInputItemTemplateData): void {
		const element = node.element;
		data.element = element;
		element.element = data.entry ?? undefined;
		const mainItem: IQuickPickItem = element.item;

		element.element.classList.toggle('not-pickable', element.item.pickable === false);

		this.ensureCheckbox(element, data);

		const { labelHighlights, descriptionHighlights, detailHighlights } = element;

		// Icon
		if (mainItem.iconPath) {
			const icon = isDark(this.themeService.getColorTheme().type) ? mainItem.iconPath.dark : (mainItem.iconPath.light ?? mainItem.iconPath.dark);
			const iconUrl = URI.revive(icon);
			data.icon.className = 'quick-input-list-icon';
			data.icon.style.backgroundImage = cssJs.asCSSUrl(iconUrl);
		} else {
			data.icon.style.backgroundImage = '';
			data.icon.className = mainItem.iconClass ? `quick-input-list-icon ${mainItem.iconClass}` : '';
		}

		// Label
		let descriptionTitle: IManagedHoverTooltipMarkdownString | undefined;
		// if we have a tooltip, that will be the hover,
		// with the saneDescription as fallback if it
		// is defined
		if (!element.saneTooltip && element.saneDescription) {
			descriptionTitle = {
				markdown: {
					value: escape(element.saneDescription),
					supportThemeIcons: true
				},
				markdownNotSupportedFallback: element.saneDescription
			};
		}
		const options: IIconLabelValueOptions = {
			matches: labelHighlights || [],
			// If we have a tooltip, we want that to be shown and not any other hover
			descriptionTitle,
			descriptionMatches: descriptionHighlights || [],
			labelEscapeNewLines: true
		};
		options.extraClasses = mainItem.iconClasses;
		options.italic = mainItem.italic;
		options.strikethrough = mainItem.strikethrough;
		data.entry.classList.remove('quick-input-list-separator-as-item');
		data.label.setLabel(element.saneLabel, element.saneDescription, options);

		// Keybinding
		data.keybinding.set(mainItem.keybinding);

		// Detail
		if (element.saneDetail) {
			let title: IManagedHoverTooltipMarkdownString | undefined;
			// If we have a tooltip, we want that to be shown and not any other hover
			if (!element.saneTooltip) {
				title = {
					markdown: {
						value: escape(element.saneDetail),
						supportThemeIcons: true
					},
					markdownNotSupportedFallback: element.saneDetail
				};
			}
			data.detail.element.style.display = '';
			data.detail.setLabel(element.saneDetail, undefined, {
				matches: detailHighlights,
				title,
				labelEscapeNewLines: true
			});
		} else {
			data.detail.element.style.display = 'none';
		}

		// Separator
		if (element.separator?.label) {
			data.separator.textContent = element.separator.label;
			data.separator.style.display = '';
			this.addItemWithSeparator(element);
		} else {
			data.separator.style.display = 'none';
		}
		data.entry.classList.toggle('quick-input-list-separator-border', !!element.separator && element.childIndex !== 0);

		// Actions
		const buttons = mainItem.buttons;
		if (buttons && buttons.length) {
			data.actionBar.push(buttons.map((button, index) => quickInputButtonToAction(
				button,
				`id-${index}`,
				() => element.fireButtonTriggered({ button, item: element.item })
			)), { icon: true, label: false });
			data.entry.classList.add('has-actions');
		} else {
			data.entry.classList.remove('has-actions');
		}
	}

	override disposeElement(element: ITreeNode<QuickPickItemElement, void>, _index: number, data: IQuickInputItemTemplateData): void {
		this.removeItemWithSeparator(element.element);
		super.disposeElement(element, _index, data);
	}

	isItemWithSeparatorVisible(item: QuickPickItemElement): boolean {
		return this._itemsWithSeparatorsFrequency.has(item);
	}

	private addItemWithSeparator(item: QuickPickItemElement): void {
		this._itemsWithSeparatorsFrequency.set(item, (this._itemsWithSeparatorsFrequency.get(item) || 0) + 1);
	}

	private removeItemWithSeparator(item: QuickPickItemElement): void {
		const frequency = this._itemsWithSeparatorsFrequency.get(item) || 0;
		if (frequency > 1) {
			this._itemsWithSeparatorsFrequency.set(item, frequency - 1);
		} else {
			this._itemsWithSeparatorsFrequency.delete(item);
		}
	}
}

class QuickPickSeparatorElementRenderer extends BaseQuickInputListRenderer<QuickPickSeparatorElement> {
	static readonly ID = 'quickpickseparator';

	// This is a frequency map because sticky scroll re-uses the same renderer to render a second
	// instance of the same separator.
	private readonly _visibleSeparatorsFrequency = new Map<QuickPickSeparatorElement, number>();

	get templateId() {
		return QuickPickSeparatorElementRenderer.ID;
	}

	get visibleSeparators(): QuickPickSeparatorElement[] {
		return [...this._visibleSeparatorsFrequency.keys()];
	}

	isSeparatorVisible(separator: QuickPickSeparatorElement): boolean {
		return this._visibleSeparatorsFrequency.has(separator);
	}

	override renderElement(node: ITreeNode<QuickPickSeparatorElement, void>, index: number, data: IQuickInputItemTemplateData): void {
		const element = node.element;
		data.element = element;
		element.element = data.entry ?? undefined;
		element.element.classList.toggle('focus-inside', !!element.focusInsideSeparator);
		const mainItem: IQuickPickSeparator = element.separator;

		const { labelHighlights, descriptionHighlights } = element;

		// Icon
		data.icon.style.backgroundImage = '';
		data.icon.className = '';

		// Label
		let descriptionTitle: IManagedHoverTooltipMarkdownString | undefined;
		// if we have a tooltip, that will be the hover,
		// with the saneDescription as fallback if it
		// is defined
		if (!element.saneTooltip && element.saneDescription) {
			descriptionTitle = {
				markdown: {
					value: escape(element.saneDescription),
					supportThemeIcons: true
				},
				markdownNotSupportedFallback: element.saneDescription
			};
		}
		const options: IIconLabelValueOptions = {
			matches: labelHighlights || [],
			// If we have a tooltip, we want that to be shown and not any other hover
			descriptionTitle,
			descriptionMatches: descriptionHighlights || [],
			labelEscapeNewLines: true
		};
		data.entry.classList.add('quick-input-list-separator-as-item');
		data.label.setLabel(element.saneLabel, element.saneDescription, options);

		// Separator
		data.separator.style.display = 'none';
		data.entry.classList.add('quick-input-list-separator-border');

		// Actions
		const buttons = mainItem.buttons;
		if (buttons && buttons.length) {
			data.actionBar.push(buttons.map((button, index) => quickInputButtonToAction(
				button,
				`id-${index}`,
				() => element.fireSeparatorButtonTriggered({ button, separator: element.separator })
			)), { icon: true, label: false });
			data.entry.classList.add('has-actions');
		} else {
			data.entry.classList.remove('has-actions');
		}

		this.addSeparator(element);
	}

	override disposeElement(element: ITreeNode<QuickPickSeparatorElement, void>, _index: number, data: IQuickInputItemTemplateData): void {
		this.removeSeparator(element.element);
		if (!this.isSeparatorVisible(element.element)) {
			element.element.element?.classList.remove('focus-inside');
		}
		super.disposeElement(element, _index, data);
	}

	private addSeparator(separator: QuickPickSeparatorElement): void {
		this._visibleSeparatorsFrequency.set(separator, (this._visibleSeparatorsFrequency.get(separator) || 0) + 1);
	}

	private removeSeparator(separator: QuickPickSeparatorElement): void {
		const frequency = this._visibleSeparatorsFrequency.get(separator) || 0;
		if (frequency > 1) {
			this._visibleSeparatorsFrequency.set(separator, frequency - 1);
		} else {
			this._visibleSeparatorsFrequency.delete(separator);
		}
	}
}

export class QuickInputList extends Disposable {

	//#region QuickInputList Events

	private readonly _onKeyDown = new Emitter<StandardKeyboardEvent>();
	/**
	 * Event that is fired when the tree receives a keydown.
	*/
	readonly onKeyDown: Event<StandardKeyboardEvent> = this._onKeyDown.event;

	private readonly _onLeave = new Emitter<void>();
	/**
	 * Event that is fired when the tree would no longer have focus.
	*/
	readonly onLeave: Event<void> = this._onLeave.event;

	private readonly _visibleCountObservable = observableValue('VisibleCount', 0);
	readonly onChangedVisibleCount: Event<number> = Event.fromObservable(this._visibleCountObservable, this._store);

	private readonly _allVisibleCheckedObservable = observableValue('AllVisibleChecked', false);
	readonly onChangedAllVisibleChecked: Event<boolean> = Event.fromObservable(this._allVisibleCheckedObservable, this._store);

	private readonly _checkedCountObservable = observableValue('CheckedCount', 0);
	readonly onChangedCheckedCount: Event<number> = Event.fromObservable(this._checkedCountObservable, this._store);

	private readonly _checkedElementsObservable = observableValueOpts({ equalsFn: equals }, new Array<IQuickPickItem>());
	readonly onChangedCheckedElements: Event<IQuickPickItem[]> = Event.fromObservable(this._checkedElementsObservable, this._store);

	private readonly _onButtonTriggered = new Emitter<IQuickPickItemButtonEvent<IQuickPickItem>>();
	onButtonTriggered = this._onButtonTriggered.event;

	private readonly _onSeparatorButtonTriggered = new Emitter<IQuickPickSeparatorButtonEvent>();
	onSeparatorButtonTriggered = this._onSeparatorButtonTriggered.event;

	private readonly _elementChecked = new Emitter<{ element: IQuickPickElement; checked: boolean }>();
	private readonly _elementCheckedEventBufferer = new EventBufferer();

	//#endregion

	private _hasCheckboxes = false;

	private readonly _container: HTMLElement;
	private readonly _tree: WorkbenchObjectTree<IQuickPickElement, void>;
	private readonly _separatorRenderer: QuickPickSeparatorElementRenderer;
	private readonly _itemRenderer: QuickPickItemElementRenderer;
	private _inputElements = new Array<QuickPickItem>();
	private _elementTree = new Array<IQuickPickElement>();
	private _itemElements = new Array<QuickPickItemElement>();
	// Elements that apply to the current set of elements
	private readonly _elementDisposable = this._register(new DisposableStore());
	private _lastHover: IHoverWidget | undefined;
	private _lastQueryString: string | undefined;

	constructor(
		private parent: HTMLElement,
		private hoverDelegate: IHoverDelegate,
		private linkOpenerDelegate: (content: string) => void,
		id: string,
		private styles: IQuickInputStyles,
		@IInstantiationService instantiationService: IInstantiationService,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService
	) {
		super();
		this._container = dom.append(this.parent, $('.quick-input-list'));
		this._separatorRenderer = new QuickPickSeparatorElementRenderer(hoverDelegate, this.styles.toggle);
		this._itemRenderer = instantiationService.createInstance(QuickPickItemElementRenderer, hoverDelegate, this.styles.toggle);
		this._tree = this._register(instantiationService.createInstance(
			WorkbenchObjectTree<IQuickPickElement, void>,
			'QuickInput',
			this._container,
			new QuickInputItemDelegate(),
			[this._itemRenderer, this._separatorRenderer],
			{
				filter: {
					filter(element) {
						return element.hidden
							? TreeVisibility.Hidden
							: element instanceof QuickPickSeparatorElement
								? TreeVisibility.Recurse
								: TreeVisibility.Visible;
					},
				},
				sorter: {
					compare: (element, otherElement) => {
						if (!this.sortByLabel || !this._lastQueryString) {
							return 0;
						}
						const normalizedSearchValue = this._lastQueryString.toLowerCase();
						return compareEntries(element, otherElement, normalizedSearchValue);
					},
				},
				accessibilityProvider: new QuickInputAccessibilityProvider(),
				setRowLineHeight: false,
				multipleSelectionSupport: false,
				hideTwistiesOfChildlessElements: true,
				renderIndentGuides: RenderIndentGuides.None,
				findWidgetEnabled: false,
				indent: 0,
				horizontalScrolling: false,
				allowNonCollapsibleParents: true,
				alwaysConsumeMouseWheel: true
			}
		));
		this._tree.getHTMLElement().id = id;
		this._registerListeners();
	}

	//#region public getters/setters

	@memoize
	get onDidChangeFocus() {
		return Event.map(
			this._tree.onDidChangeFocus,
			e => e.elements.filter((e): e is QuickPickItemElement => e instanceof QuickPickItemElement).map(e => e.item),
			this._store
		);
	}

	@memoize
	get onDidChangeSelection() {
		return Event.map(
			this._tree.onDidChangeSelection,
			e => ({
				items: e.elements.filter((e): e is QuickPickItemElement => e instanceof QuickPickItemElement).map(e => e.item),
				event: e.browserEvent
			}),
			this._store
		);
	}

	get displayed() {
		return this._container.style.display !== 'none';
	}

	set displayed(value: boolean) {
		this._container.style.display = value ? '' : 'none';
	}

	get scrollTop() {
		return this._tree.scrollTop;
	}

	set scrollTop(scrollTop: number) {
		this._tree.scrollTop = scrollTop;
	}

	get ariaLabel() {
		return this._tree.ariaLabel;
	}

	set ariaLabel(label: string | null) {
		this._tree.ariaLabel = label ?? '';
	}

	set enabled(value: boolean) {
		this._tree.getHTMLElement().style.pointerEvents = value ? '' : 'none';
	}

	private _matchOnDescription = false;
	get matchOnDescription() {
		return this._matchOnDescription;
	}
	set matchOnDescription(value: boolean) {
		this._matchOnDescription = value;
	}

	private _matchOnDetail = false;
	get matchOnDetail() {
		return this._matchOnDetail;
	}
	set matchOnDetail(value: boolean) {
		this._matchOnDetail = value;
	}

	private _matchOnLabel = true;
	get matchOnLabel() {
		return this._matchOnLabel;
	}
	set matchOnLabel(value: boolean) {
		this._matchOnLabel = value;
	}

	private _matchOnLabelMode: 'fuzzy' | 'contiguous' = 'fuzzy';
	get matchOnLabelMode() {
		return this._matchOnLabelMode;
	}
	set matchOnLabelMode(value: 'fuzzy' | 'contiguous') {
		this._matchOnLabelMode = value;
	}

	private _matchOnMeta = true;
	get matchOnMeta() {
		return this._matchOnMeta;
	}
	set matchOnMeta(value: boolean) {
		this._matchOnMeta = value;
	}

	private _sortByLabel = true;
	get sortByLabel() {
		return this._sortByLabel;
	}
	set sortByLabel(value: boolean) {
		this._sortByLabel = value;
	}

	private _shouldLoop = true;
	get shouldLoop() {
		return this._shouldLoop;
	}
	set shouldLoop(value: boolean) {
		this._shouldLoop = value;
	}

	//#endregion

	//#region register listeners

	private _registerListeners() {
		this._registerOnKeyDown();
		this._registerOnContainerClick();
		this._registerOnMouseMiddleClick();
		this._registerOnTreeModelChanged();
		this._registerOnElementChecked();
		this._registerOnContextMenu();
		this._registerHoverListeners();
		this._registerSelectionChangeListener();
		this._registerSeparatorActionShowingListeners();
	}

	private _registerOnKeyDown() {
		// TODO: Should this be added at a higher level?
		this._register(this._tree.onKeyDown(e => {
			const event = new StandardKeyboardEvent(e);
			switch (event.keyCode) {
				case KeyCode.Space:
					this.toggleCheckbox();
					break;
			}

			this._onKeyDown.fire(event);
		}));
	}

	private _registerOnContainerClick() {
		this._register(dom.addDisposableListener(this._container, dom.EventType.CLICK, e => {
			if (e.x || e.y) { // Avoid 'click' triggered by 'space' on checkbox.
				this._onLeave.fire();
			}
		}));
	}

	private _registerOnMouseMiddleClick() {
		this._register(dom.addDisposableListener(this._container, dom.EventType.AUXCLICK, e => {
			if (e.button === 1) {
				this._onLeave.fire();
			}
		}));
	}

	private _registerOnTreeModelChanged() {
		this._register(this._tree.onDidChangeModel(() => {
			const visibleCount = this._itemElements.filter(e => !e.hidden).length;
			this._visibleCountObservable.set(visibleCount, undefined);
			if (this._hasCheckboxes) {
				this._updateCheckedObservables();
			}
		}));
	}

	private _registerOnElementChecked() {
		// Only fire the last event when buffered
		this._register(this._elementCheckedEventBufferer.wrapEvent(this._elementChecked.event, (_, e) => e)(_ => this._updateCheckedObservables()));
	}

	private _registerOnContextMenu() {
		this._register(this._tree.onContextMenu(e => {
			if (e.element) {
				e.browserEvent.preventDefault();

				// we want to treat a context menu event as
				// a gesture to open the item at the index
				// since we do not have any context menu
				// this enables for example macOS to Ctrl-
				// click on an item to open it.
				this._tree.setSelection([e.element]);
			}
		}));
	}

	private _registerHoverListeners() {
		const delayer = this._register(new ThrottledDelayer(typeof this.hoverDelegate.delay === 'function' ? this.hoverDelegate.delay() : this.hoverDelegate.delay));
		this._register(this._tree.onMouseOver(async e => {
			// If we hover over an anchor element, we don't want to show the hover because
			// the anchor may have a tooltip that we want to show instead.
			if (dom.isHTMLAnchorElement(e.browserEvent.target)) {
				delayer.cancel();
				return;
			}
			if (
				// anchors are an exception as called out above so we skip them here
				!(dom.isHTMLAnchorElement(e.browserEvent.relatedTarget)) &&
				// check if the mouse is still over the same element
				dom.isAncestor(e.browserEvent.relatedTarget as Node, e.element?.element as Node)
			) {
				return;
			}
			try {
				await delayer.trigger(async () => {
					if (e.element instanceof QuickPickItemElement) {
						this.showHover(e.element);
					}
				});
			} catch (e) {
				// Ignore cancellation errors due to mouse out
				if (!isCancellationError(e)) {
					throw e;
				}
			}
		}));
		this._register(this._tree.onMouseOut(e => {
			// onMouseOut triggers every time a new element has been moused over
			// even if it's on the same list item. We only want one event, so we
			// check if the mouse is still over the same element.
			if (dom.isAncestor(e.browserEvent.relatedTarget as Node, e.element?.element as Node)) {
				return;
			}
			delayer.cancel();
		}));
	}

	/**
	 * Register's focus change and mouse events so that we can track when items inside of a
	 * separator's section are focused or hovered so that we can display the separator's actions
	 */
	private _registerSeparatorActionShowingListeners() {
		this._register(this._tree.onDidChangeFocus(e => {
			const parent = e.elements[0]
				? this._tree.getParentElement(e.elements[0]) as QuickPickSeparatorElement
				// treat null as focus lost and when we have no separators
				: null;
			for (const separator of this._separatorRenderer.visibleSeparators) {
				const value = separator === parent;
				// get bitness of ACTIVE_ITEM and check if it changed
				const currentActive = !!(separator.focusInsideSeparator & QuickPickSeparatorFocusReason.ACTIVE_ITEM);
				if (currentActive !== value) {
					if (value) {
						separator.focusInsideSeparator |= QuickPickSeparatorFocusReason.ACTIVE_ITEM;
					} else {
						separator.focusInsideSeparator &= ~QuickPickSeparatorFocusReason.ACTIVE_ITEM;
					}

					this._tree.rerender(separator);
				}
			}
		}));
		this._register(this._tree.onMouseOver(e => {
			const parent = e.element
				? this._tree.getParentElement(e.element) as QuickPickSeparatorElement
				: null;
			for (const separator of this._separatorRenderer.visibleSeparators) {
				if (separator !== parent) {
					continue;
				}
				const currentMouse = !!(separator.focusInsideSeparator & QuickPickSeparatorFocusReason.MOUSE_HOVER);
				if (!currentMouse) {
					separator.focusInsideSeparator |= QuickPickSeparatorFocusReason.MOUSE_HOVER;
					this._tree.rerender(separator);
				}
			}
		}));
		this._register(this._tree.onMouseOut(e => {
			const parent = e.element
				? this._tree.getParentElement(e.element) as QuickPickSeparatorElement
				: null;
			for (const separator of this._separatorRenderer.visibleSeparators) {
				if (separator !== parent) {
					continue;
				}
				const currentMouse = !!(separator.focusInsideSeparator & QuickPickSeparatorFocusReason.MOUSE_HOVER);
				if (currentMouse) {
					separator.focusInsideSeparator &= ~QuickPickSeparatorFocusReason.MOUSE_HOVER;
					this._tree.rerender(separator);
				}
			}
		}));
	}

	private _registerSelectionChangeListener() {
		// When the user selects a separator, the separator will move to the top and focus will be
		// set to the first element after the separator.
		this._register(this._tree.onDidChangeSelection(e => {
			const elementsWithoutSeparators = e.elements.filter((e): e is QuickPickItemElement => e instanceof QuickPickItemElement);
			if (elementsWithoutSeparators.length !== e.elements.length) {
				if (e.elements.length === 1 && e.elements[0] instanceof QuickPickSeparatorElement) {
					this._tree.setFocus([e.elements[0].children[0]]);
					this._tree.reveal(e.elements[0], 0);
				}
				this._tree.setSelection(elementsWithoutSeparators);
			}
		}));
	}

	//#endregion

	//#region public methods

	setAllVisibleChecked(checked: boolean) {
		this._elementCheckedEventBufferer.bufferEvents(() => {
			this._itemElements.forEach(element => {
				if (!element.hidden && !element.checkboxDisabled && element.item.pickable !== false) {
					// Would fire an event if we didn't beffer the events
					element.checked = checked;
				}
			});
		});
	}

	setElements(inputElements: QuickPickItem[]): void {
		this._elementDisposable.clear();
		this._lastQueryString = undefined;
		this._inputElements = inputElements;
		this._hasCheckboxes = this.parent.classList.contains('show-checkboxes');
		let currentSeparatorElement: QuickPickSeparatorElement | undefined;
		this._itemElements = new Array<QuickPickItemElement>();
		this._elementTree = inputElements.reduce((result, item, index) => {
			let element: IQuickPickElement;
			if (item.type === 'separator') {
				if (!item.buttons) {
					// This separator will be rendered as a part of the list item
					return result;
				}
				currentSeparatorElement = new QuickPickSeparatorElement(
					index,
					e => this._onSeparatorButtonTriggered.fire(e),
					item
				);
				element = currentSeparatorElement;
			} else {
				const previous = index > 0 ? inputElements[index - 1] : undefined;
				let separator: IQuickPickSeparator | undefined;
				if (previous && previous.type === 'separator' && !previous.buttons) {
					separator = previous;
				}
				const qpi = new QuickPickItemElement(
					index,
					currentSeparatorElement?.children
						? currentSeparatorElement.children.length
						: index,
					this._hasCheckboxes && item.pickable !== false,
					e => this._onButtonTriggered.fire(e),
					this._elementChecked,
					item,
					separator,
				);
				this._itemElements.push(qpi);

				if (currentSeparatorElement) {
					currentSeparatorElement.children.push(qpi);
					return result;
				}
				element = qpi;
			}

			result.push(element);
			return result;
		}, new Array<IQuickPickElement>());

		this._setElementsToTree(this._elementTree);

		// Accessibility hack, unfortunately on next tick
		// https://github.com/microsoft/vscode/issues/211976
		if (this.accessibilityService.isScreenReaderOptimized()) {
			setTimeout(() => {
				// eslint-disable-next-line no-restricted-syntax
				const focusedElement = this._tree.getHTMLElement().querySelector(`.monaco-list-row.focused`);
				const parent = focusedElement?.parentNode;
				if (focusedElement && parent) {
					const nextSibling = focusedElement.nextSibling;
					focusedElement.remove();
					parent.insertBefore(focusedElement, nextSibling);
				}
			}, 0);
		}
	}

	setFocusedElements(items: IQuickPickItem[]) {
		const elements = items.map(item => this._itemElements.find(e => e.item === item))
			.filter((e): e is QuickPickItemElement => !!e)
			.filter(e => !e.hidden);
		this._tree.setFocus(elements);
		if (items.length > 0) {
			const focused = this._tree.getFocus()[0];
			if (focused) {
				this._tree.reveal(focused);
			}
		}
	}

	getActiveDescendant() {
		return this._tree.getHTMLElement().getAttribute('aria-activedescendant');
	}

	setSelectedElements(items: IQuickPickItem[]) {
		const elements = items.map(item => this._itemElements.find(e => e.item === item))
			.filter((e): e is QuickPickItemElement => !!e);
		this._tree.setSelection(elements);
	}

	getCheckedElements() {
		return this._itemElements.filter(e => e.checked)
			.map(e => e.item);
	}

	setCheckedElements(items: IQuickPickItem[]) {
		this._elementCheckedEventBufferer.bufferEvents(() => {
			const checked = new Set();
			for (const item of items) {
				checked.add(item);
			}
			for (const element of this._itemElements) {
				// Would fire an event if we didn't beffer the events
				element.checked = checked.has(element.item);
			}
		});
	}

	focus(what: QuickPickFocus): void {
		if (!this._itemElements.length) {
			return;
		}

		if (what === QuickPickFocus.Second && this._itemElements.length < 2) {
			what = QuickPickFocus.First;
		}

		switch (what) {
			case QuickPickFocus.First:
				this._tree.scrollTop = 0;
				this._tree.focusFirst(undefined, (e) => e.element instanceof QuickPickItemElement);
				break;
			case QuickPickFocus.Second: {
				this._tree.scrollTop = 0;
				let isSecondItem = false;
				this._tree.focusFirst(undefined, (e) => {
					if (!(e.element instanceof QuickPickItemElement)) {
						return false;
					}
					if (isSecondItem) {
						return true;
					}
					isSecondItem = !isSecondItem;
					return false;
				});
				break;
			}
			case QuickPickFocus.Last:
				this._tree.scrollTop = this._tree.scrollHeight;
				this._tree.focusLast(undefined, (e) => e.element instanceof QuickPickItemElement);
				break;
			case QuickPickFocus.Next: {
				const prevFocus = this._tree.getFocus();
				this._tree.focusNext(undefined, this._shouldLoop, undefined, (e) => {
					if (!(e.element instanceof QuickPickItemElement)) {
						return false;
					}
					this._tree.reveal(e.element);
					return true;
				});
				const currentFocus = this._tree.getFocus();
				if (prevFocus.length && prevFocus[0] === currentFocus[0]) {
					this._onLeave.fire();
				}
				break;
			}
			case QuickPickFocus.Previous: {
				const prevFocus = this._tree.getFocus();
				this._tree.focusPrevious(undefined, this._shouldLoop, undefined, (e) => {
					if (!(e.element instanceof QuickPickItemElement)) {
						return false;
					}
					const parent = this._tree.getParentElement(e.element);
					if (parent === null || (parent as QuickPickSeparatorElement).children[0] !== e.element) {
						this._tree.reveal(e.element);
					} else {
						// Only if we are the first child of a separator do we reveal the separator
						this._tree.reveal(parent);
					}
					return true;
				});
				const currentFocus = this._tree.getFocus();
				if (prevFocus.length && prevFocus[0] === currentFocus[0]) {
					this._onLeave.fire();
				}
				break;
			}
			case QuickPickFocus.NextPage:
				this._tree.focusNextPage(undefined, (e) => {
					if (!(e.element instanceof QuickPickItemElement)) {
						return false;
					}
					this._tree.reveal(e.element);
					return true;
				});
				break;
			case QuickPickFocus.PreviousPage:
				this._tree.focusPreviousPage(undefined, (e) => {
					if (!(e.element instanceof QuickPickItemElement)) {
						return false;
					}
					const parent = this._tree.getParentElement(e.element);
					if (parent === null || (parent as QuickPickSeparatorElement).children[0] !== e.element) {
						this._tree.reveal(e.element);
					} else {
						this._tree.reveal(parent);
					}
					return true;
				});
				break;
			case QuickPickFocus.NextSeparator: {
				let foundSeparatorAsItem = false;
				const before = this._tree.getFocus()[0];
				this._tree.focusNext(undefined, true, undefined, (e) => {
					if (foundSeparatorAsItem) {
						// This should be the index right after the separator so it
						// is the item we want to focus.
						return true;
					}

					if (e.element instanceof QuickPickSeparatorElement) {
						foundSeparatorAsItem = true;
						// If the separator is visible, then we should just reveal its first child so it's not as jarring.
						if (this._separatorRenderer.isSeparatorVisible(e.element)) {
							this._tree.reveal(e.element.children[0]);
						} else {
							// If the separator is not visible, then we should
							// push it up to the top of the list.
							this._tree.reveal(e.element, 0);
						}
					} else if (e.element instanceof QuickPickItemElement) {
						if (e.element.separator) {
							if (this._itemRenderer.isItemWithSeparatorVisible(e.element)) {
								this._tree.reveal(e.element);
							} else {
								this._tree.reveal(e.element, 0);
							}
							return true;
						} else if (e.element === this._elementTree[0]) {
							// We should stop at the first item in the list if it's a regular item.
							this._tree.reveal(e.element, 0);
							return true;
						}
					}
					return false;
				});
				const after = this._tree.getFocus()[0];
				if (before === after) {
					// If we didn't move, then we should just move to the end
					// of the list.
					this._tree.scrollTop = this._tree.scrollHeight;
					this._tree.focusLast(undefined, (e) => e.element instanceof QuickPickItemElement);
				}
				break;
			}
			case QuickPickFocus.PreviousSeparator: {
				let focusElement: IQuickPickElement | undefined;
				// If we are already sitting on an inline separator, then we
				// have already found the _current_ separator and need to
				// move to the previous one.
				let foundSeparator = !!this._tree.getFocus()[0]?.separator;
				this._tree.focusPrevious(undefined, true, undefined, (e) => {
					if (e.element instanceof QuickPickSeparatorElement) {
						if (foundSeparator) {
							if (!focusElement) {
								if (this._separatorRenderer.isSeparatorVisible(e.element)) {
									this._tree.reveal(e.element);
								} else {
									this._tree.reveal(e.element, 0);
								}
								focusElement = e.element.children[0];
							}
						} else {
							foundSeparator = true;
						}
					} else if (e.element instanceof QuickPickItemElement) {
						if (!focusElement) {
							if (e.element.separator) {
								if (this._itemRenderer.isItemWithSeparatorVisible(e.element)) {
									this._tree.reveal(e.element);
								} else {
									this._tree.reveal(e.element, 0);
								}

								focusElement = e.element;
							} else if (e.element === this._elementTree[0]) {
								// We should stop at the first item in the list if it's a regular item.
								this._tree.reveal(e.element, 0);
								return true;
							}
						}
					}
					return false;
				});
				if (focusElement) {
					this._tree.setFocus([focusElement]);
				}
				break;
			}
		}
	}

	clearFocus() {
		this._tree.setFocus([]);
	}

	domFocus() {
		this._tree.domFocus();
	}

	layout(maxHeight?: number): void {
		this._tree.getHTMLElement().style.maxHeight = maxHeight ? `${
			// Make sure height aligns with list item heights
			Math.floor(maxHeight / 44) * 44
			// Add some extra height so that it's clear there's more to scroll
			+ 6
			}px` : '';
		this._tree.layout();
	}

	filter(query: string): boolean {
		this._lastQueryString = query;
		if (!(this._sortByLabel || this._matchOnLabel || this._matchOnDescription || this._matchOnDetail)) {
			this._tree.layout();
			return false;
		}

		const queryWithWhitespace = query;
		query = query.trim();

		// Reset filtering
		if (!query || !(this.matchOnLabel || this.matchOnDescription || this.matchOnDetail)) {
			this._itemElements.forEach(element => {
				element.labelHighlights = undefined;
				element.descriptionHighlights = undefined;
				element.detailHighlights = undefined;
				element.hidden = false;
				const previous = element.index && this._inputElements[element.index - 1];
				if (element.item) {
					element.separator = previous && previous.type === 'separator' && !previous.buttons ? previous : undefined;
				}
			});
		}

		// Filter by value (since we support icons in labels, use $(..) aware fuzzy matching)
		else {
			let currentSeparator: IQuickPickSeparator | undefined;
			this._itemElements.forEach(element => {
				let labelHighlights: IMatch[] | undefined;
				if (this.matchOnLabelMode === 'fuzzy') {
					labelHighlights = this.matchOnLabel ? matchesFuzzyIconAware(query, parseLabelWithIcons(element.saneLabel)) ?? undefined : undefined;
				} else {
					labelHighlights = this.matchOnLabel ? matchesContiguousIconAware(queryWithWhitespace, parseLabelWithIcons(element.saneLabel)) ?? undefined : undefined;
				}
				const descriptionHighlights = this.matchOnDescription ? matchesFuzzyIconAware(query, parseLabelWithIcons(element.saneDescription || '')) ?? undefined : undefined;
				const detailHighlights = this.matchOnDetail ? matchesFuzzyIconAware(query, parseLabelWithIcons(element.saneDetail || '')) ?? undefined : undefined;

				if (labelHighlights || descriptionHighlights || detailHighlights) {
					element.labelHighlights = labelHighlights;
					element.descriptionHighlights = descriptionHighlights;
					element.detailHighlights = detailHighlights;
					element.hidden = false;
				} else {
					element.labelHighlights = undefined;
					element.descriptionHighlights = undefined;
					element.detailHighlights = undefined;
					element.hidden = element.item ? !element.item.alwaysShow : true;
				}

				// Ensure separators are filtered out first before deciding if we need to bring them back
				if (element.item) {
					element.separator = undefined;
				} else if (element.separator) {
					element.hidden = true;
				}

				// we can show the separator unless the list gets sorted by match
				if (!this.sortByLabel) {
					const previous = element.index && this._inputElements[element.index - 1] || undefined;
					if (previous?.type === 'separator' && !previous.buttons) {
						currentSeparator = previous;
					}
					if (currentSeparator && !element.hidden) {
						element.separator = currentSeparator;
						currentSeparator = undefined;
					}
				}
			});
		}

		this._setElementsToTree(this._sortByLabel && query
			// We don't render any separators if we're sorting so just render the elements
			? this._itemElements
			// Render the full tree
			: this._elementTree
		);
		this._tree.layout();
		return true;
	}

	toggleCheckbox() {
		this._elementCheckedEventBufferer.bufferEvents(() => {
			const elements = this._tree.getFocus().filter((e): e is QuickPickItemElement => e instanceof QuickPickItemElement);
			const allChecked = this._allVisibleChecked(elements);
			for (const element of elements) {
				if (!element.checkboxDisabled) {
					// Would fire an event if we didn't have the flag set
					element.checked = !allChecked;
				}
			}
		});
	}

	style(styles: IListStyles) {
		this._tree.style(styles);
	}

	toggleHover() {
		const focused: IQuickPickElement | null = this._tree.getFocus()[0];
		if (!focused?.saneTooltip || !(focused instanceof QuickPickItemElement)) {
			return;
		}

		// if there's a hover already, hide it (toggle off)
		if (this._lastHover && !this._lastHover.isDisposed) {
			this._lastHover.dispose();
			return;
		}

		// If there is no hover, show it (toggle on)
		this.showHover(focused);
		const store = new DisposableStore();
		store.add(this._tree.onDidChangeFocus(e => {
			if (e.elements[0] instanceof QuickPickItemElement) {
				this.showHover(e.elements[0]);
			}
		}));
		if (this._lastHover) {
			store.add(this._lastHover);
		}
		this._elementDisposable.add(store);
	}

	//#endregion

	//#region private methods

	private _setElementsToTree(elements: IQuickPickElement[]) {
		const treeElements = new Array<IObjectTreeElement<IQuickPickElement>>();
		for (const element of elements) {
			if (element instanceof QuickPickSeparatorElement) {
				treeElements.push({
					element,
					collapsible: false,
					collapsed: false,
					children: element.children.map(e => ({
						element: e,
						collapsible: false,
						collapsed: false,
					})),
				});
			} else {
				treeElements.push({
					element,
					collapsible: false,
					collapsed: false,
				});
			}
		}
		this._tree.setChildren(null, treeElements);
	}

	private _allVisibleChecked(elements: QuickPickItemElement[], whenNoneVisible = true) {
		for (let i = 0, n = elements.length; i < n; i++) {
			const element = elements[i];
			if (!element.hidden && element.item.pickable !== false) {
				if (!element.checked) {
					return false;
				} else {
					whenNoneVisible = true;
				}
			}
		}
		return whenNoneVisible;
	}

	private _updateCheckedObservables() {
		transaction((tx) => {
			this._allVisibleCheckedObservable.set(this._allVisibleChecked(this._itemElements, false), tx);
			const checkedCount = this._itemElements.filter(element => element.checked).length;
			this._checkedCountObservable.set(checkedCount, tx);
			this._checkedElementsObservable.set(this.getCheckedElements(), tx);
		});
	}

	/**
	 * Disposes of the hover and shows a new one for the given index if it has a tooltip.
	 * @param element The element to show the hover for
	 */
	private showHover(element: QuickPickItemElement): void {
		if (this._lastHover && !this._lastHover.isDisposed) {
			this.hoverDelegate.onDidHideHover?.();
			this._lastHover?.dispose();
		}

		if (!element.element || !element.saneTooltip) {
			return;
		}
		this._lastHover = this.hoverDelegate.showHover({
			content: element.saneTooltip,
			target: element.element,
			linkHandler: (url) => {
				this.linkOpenerDelegate(url);
			},
			appearance: {
				showPointer: true,
			},
			container: this._container,
			position: {
				hoverPosition: HoverPosition.RIGHT
			}
		}, false);
	}
}

function matchesContiguousIconAware(query: string, target: IParsedLabelWithIcons): IMatch[] | null {

	const { text, iconOffsets } = target;

	// Return early if there are no icon markers in the word to match against
	if (!iconOffsets || iconOffsets.length === 0) {
		return matchesContiguous(query, text);
	}

	// Trim the word to match against because it could have leading
	// whitespace now if the word started with an icon
	const wordToMatchAgainstWithoutIconsTrimmed = ltrim(text, ' ');
	const leadingWhitespaceOffset = text.length - wordToMatchAgainstWithoutIconsTrimmed.length;

	// match on value without icon
	const matches = matchesContiguous(query, wordToMatchAgainstWithoutIconsTrimmed);

	// Map matches back to offsets with icon and trimming
	if (matches) {
		for (const match of matches) {
			const iconOffset = iconOffsets[match.start + leadingWhitespaceOffset] /* icon offsets at index */ + leadingWhitespaceOffset /* overall leading whitespace offset */;
			match.start += iconOffset;
			match.end += iconOffset;
		}
	}

	return matches;
}

function matchesContiguous(word: string, wordToMatchAgainst: string): IMatch[] | null {
	const matchIndex = wordToMatchAgainst.toLowerCase().indexOf(word.toLowerCase());
	if (matchIndex !== -1) {
		return [{ start: matchIndex, end: matchIndex + word.length }];
	}
	return null;
}

function compareEntries(elementA: IQuickPickElement, elementB: IQuickPickElement, lookFor: string): number {

	const labelHighlightsA = elementA.labelHighlights || [];
	const labelHighlightsB = elementB.labelHighlights || [];
	if (labelHighlightsA.length && !labelHighlightsB.length) {
		return -1;
	}

	if (!labelHighlightsA.length && labelHighlightsB.length) {
		return 1;
	}

	if (labelHighlightsA.length === 0 && labelHighlightsB.length === 0) {
		return 0;
	}

	return compareAnything(elementA.saneSortLabel, elementB.saneSortLabel, lookFor);
}
```

--------------------------------------------------------------------------------

````

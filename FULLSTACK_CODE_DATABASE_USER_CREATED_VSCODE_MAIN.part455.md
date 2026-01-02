---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 455
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 455 of 552)

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

---[FILE: src/vs/workbench/contrib/tasks/common/problemCollectors.ts]---
Location: vscode-main/src/vs/workbench/contrib/tasks/common/problemCollectors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStringDictionary, INumberDictionary } from '../../../../base/common/collections.js';
import { URI } from '../../../../base/common/uri.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { IDisposable, DisposableStore, Disposable } from '../../../../base/common/lifecycle.js';

import { IModelService } from '../../../../editor/common/services/model.js';

import { ILineMatcher, createLineMatcher, ProblemMatcher, IProblemMatch, ApplyToKind, IWatchingPattern, getResource } from './problemMatcher.js';
import { IMarkerService, IMarkerData, MarkerSeverity, IMarker } from '../../../../platform/markers/common/markers.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { isWindows } from '../../../../base/common/platform.js';

export const enum ProblemCollectorEventKind {
	BackgroundProcessingBegins = 'backgroundProcessingBegins',
	BackgroundProcessingEnds = 'backgroundProcessingEnds'
}

export interface IProblemCollectorEvent {
	kind: ProblemCollectorEventKind;
}

namespace IProblemCollectorEvent {
	export function create(kind: ProblemCollectorEventKind) {
		return Object.freeze({ kind });
	}
}

export interface IProblemMatcher {
	processLine(line: string): void;
}

export abstract class AbstractProblemCollector extends Disposable implements IDisposable {

	private matchers: INumberDictionary<ILineMatcher[]>;
	private activeMatcher: ILineMatcher | null;
	protected _numberOfMatches: number;
	private _maxMarkerSeverity?: MarkerSeverity;
	private buffer: string[];
	private bufferLength: number;
	private openModels: IStringDictionary<boolean>;
	protected readonly modelListeners = new DisposableStore();
	private tail: Promise<void> | undefined;

	// [owner] -> ApplyToKind
	protected applyToByOwner: Map<string, ApplyToKind>;
	// [owner] -> [resource] -> URI
	private resourcesToClean: Map<string, Map<string, URI>>;
	// [owner] -> [resource] -> [markerkey] -> markerData
	private markers: Map<string, Map<string, Map<string, IMarkerData>>>;
	// [owner] -> [resource] -> number;
	private deliveredMarkers: Map<string, Map<string, number>>;

	protected _onDidStateChange: Emitter<IProblemCollectorEvent>;

	protected readonly _onDidFindFirstMatch = new Emitter<void>();
	readonly onDidFindFirstMatch = this._onDidFindFirstMatch.event;

	protected readonly _onDidFindErrors = new Emitter<IMarker[]>();
	readonly onDidFindErrors = this._onDidFindErrors.event;

	protected readonly _onDidRequestInvalidateLastMarker = new Emitter<void>();
	readonly onDidRequestInvalidateLastMarker = this._onDidRequestInvalidateLastMarker.event;

	constructor(public readonly problemMatchers: ProblemMatcher[], protected markerService: IMarkerService, protected modelService: IModelService, fileService?: IFileService) {
		super();
		this.matchers = Object.create(null);
		this.bufferLength = 1;
		problemMatchers.map(elem => createLineMatcher(elem, fileService)).forEach((matcher) => {
			const length = matcher.matchLength;
			if (length > this.bufferLength) {
				this.bufferLength = length;
			}
			let value = this.matchers[length];
			if (!value) {
				value = [];
				this.matchers[length] = value;
			}
			value.push(matcher);
		});
		this.buffer = [];
		this.activeMatcher = null;
		this._numberOfMatches = 0;
		this._maxMarkerSeverity = undefined;
		this.openModels = Object.create(null);
		this.applyToByOwner = new Map<string, ApplyToKind>();
		for (const problemMatcher of problemMatchers) {
			const current = this.applyToByOwner.get(problemMatcher.owner);
			if (current === undefined) {
				this.applyToByOwner.set(problemMatcher.owner, problemMatcher.applyTo);
			} else {
				this.applyToByOwner.set(problemMatcher.owner, this.mergeApplyTo(current, problemMatcher.applyTo));
			}
		}
		this.resourcesToClean = new Map<string, Map<string, URI>>();
		this.markers = new Map<string, Map<string, Map<string, IMarkerData>>>();
		this.deliveredMarkers = new Map<string, Map<string, number>>();
		this._register(this.modelService.onModelAdded((model) => {
			this.openModels[model.uri.toString()] = true;
		}, this, this.modelListeners));
		this._register(this.modelService.onModelRemoved((model) => {
			delete this.openModels[model.uri.toString()];
		}, this, this.modelListeners));
		this.modelService.getModels().forEach(model => this.openModels[model.uri.toString()] = true);

		this._onDidStateChange = new Emitter();
	}

	public get onDidStateChange(): Event<IProblemCollectorEvent> {
		return this._onDidStateChange.event;
	}

	public processLine(line: string) {
		if (this.tail) {
			const oldTail = this.tail;
			this.tail = oldTail.then(() => {
				return this.processLineInternal(line);
			});
		} else {
			this.tail = this.processLineInternal(line);
		}
	}

	protected abstract processLineInternal(line: string): Promise<void>;

	public override dispose() {
		super.dispose();
		this.modelListeners.dispose();
	}

	public get numberOfMatches(): number {
		return this._numberOfMatches;
	}

	public get maxMarkerSeverity(): MarkerSeverity | undefined {
		return this._maxMarkerSeverity;
	}

	protected tryFindMarker(line: string): IProblemMatch | null {
		let result: IProblemMatch | null = null;
		if (this.activeMatcher) {
			result = this.activeMatcher.next(line);
			if (result) {
				this.captureMatch(result);
				return result;
			}
			this.clearBuffer();
			this.activeMatcher = null;
		}
		if (this.buffer.length < this.bufferLength) {
			this.buffer.push(line);
		} else {
			const end = this.buffer.length - 1;
			for (let i = 0; i < end; i++) {
				this.buffer[i] = this.buffer[i + 1];
			}
			this.buffer[end] = line;
		}

		result = this.tryMatchers();
		if (result) {
			this.clearBuffer();
		}
		return result;
	}

	protected async shouldApplyMatch(result: IProblemMatch): Promise<boolean> {
		switch (result.description.applyTo) {
			case ApplyToKind.allDocuments:
				return true;
			case ApplyToKind.openDocuments:
				return !!this.openModels[(await result.resource).toString()];
			case ApplyToKind.closedDocuments:
				return !this.openModels[(await result.resource).toString()];
			default:
				return true;
		}
	}

	private mergeApplyTo(current: ApplyToKind, value: ApplyToKind): ApplyToKind {
		if (current === value || current === ApplyToKind.allDocuments) {
			return current;
		}
		return ApplyToKind.allDocuments;
	}

	private tryMatchers(): IProblemMatch | null {
		this.activeMatcher = null;
		const length = this.buffer.length;
		for (let startIndex = 0; startIndex < length; startIndex++) {
			const candidates = this.matchers[length - startIndex];
			if (!candidates) {
				continue;
			}
			for (const matcher of candidates) {
				const result = matcher.handle(this.buffer, startIndex);
				if (result.match) {
					this.captureMatch(result.match);
					if (result.continue) {
						this.activeMatcher = matcher;
					}
					return result.match;
				}
			}
		}
		return null;
	}

	private captureMatch(match: IProblemMatch): void {
		this._numberOfMatches++;
		if (this._maxMarkerSeverity === undefined || match.marker.severity > this._maxMarkerSeverity) {
			this._maxMarkerSeverity = match.marker.severity;
		}
	}

	private clearBuffer(): void {
		if (this.buffer.length > 0) {
			this.buffer = [];
		}
	}

	protected recordResourcesToClean(owner: string): void {
		const resourceSetToClean = this.getResourceSetToClean(owner);
		this.markerService.read({ owner: owner }).forEach(marker => resourceSetToClean.set(marker.resource.toString(), marker.resource));
	}

	protected recordResourceToClean(owner: string, resource: URI): void {
		this.getResourceSetToClean(owner).set(resource.toString(), resource);
	}

	protected removeResourceToClean(owner: string, resource: string): void {
		const resourceSet = this.resourcesToClean.get(owner);
		resourceSet?.delete(resource);
	}

	private getResourceSetToClean(owner: string): Map<string, URI> {
		let result = this.resourcesToClean.get(owner);
		if (!result) {
			result = new Map<string, URI>();
			this.resourcesToClean.set(owner, result);
		}
		return result;
	}

	protected cleanAllMarkers(): void {
		this.resourcesToClean.forEach((value, owner) => {
			this._cleanMarkers(owner, value);
		});
		this.resourcesToClean = new Map<string, Map<string, URI>>();
	}

	protected cleanMarkers(owner: string): void {
		const toClean = this.resourcesToClean.get(owner);
		if (toClean) {
			this._cleanMarkers(owner, toClean);
			this.resourcesToClean.delete(owner);
		}
	}

	private _cleanMarkers(owner: string, toClean: Map<string, URI>): void {
		const uris: URI[] = [];
		const applyTo = this.applyToByOwner.get(owner);
		toClean.forEach((uri, uriAsString) => {
			if (
				applyTo === ApplyToKind.allDocuments ||
				(applyTo === ApplyToKind.openDocuments && this.openModels[uriAsString]) ||
				(applyTo === ApplyToKind.closedDocuments && !this.openModels[uriAsString])
			) {
				uris.push(uri);
			}
		});
		this.markerService.remove(owner, uris);
	}

	protected recordMarker(marker: IMarkerData, owner: string, resourceAsString: string): void {
		let markersPerOwner = this.markers.get(owner);
		if (!markersPerOwner) {
			markersPerOwner = new Map<string, Map<string, IMarkerData>>();
			this.markers.set(owner, markersPerOwner);
		}
		let markersPerResource = markersPerOwner.get(resourceAsString);
		if (!markersPerResource) {
			markersPerResource = new Map<string, IMarkerData>();
			markersPerOwner.set(resourceAsString, markersPerResource);
		}
		const key = IMarkerData.makeKeyOptionalMessage(marker, false);
		let existingMarker;
		if (!markersPerResource.has(key)) {
			markersPerResource.set(key, marker);
		} else if (((existingMarker = markersPerResource.get(key)) !== undefined) && (existingMarker.message.length < marker.message.length) && isWindows) {
			// Most likely https://github.com/microsoft/vscode/issues/77475
			// Heuristic dictates that when the key is the same and message is smaller, we have hit this limitation.
			markersPerResource.set(key, marker);
		}
	}

	protected reportMarkers(): void {
		this.markers.forEach((markersPerOwner, owner) => {
			const deliveredMarkersPerOwner = this.getDeliveredMarkersPerOwner(owner);
			markersPerOwner.forEach((markers, resource) => {
				this.deliverMarkersPerOwnerAndResourceResolved(owner, resource, markers, deliveredMarkersPerOwner);
			});
		});
	}

	protected deliverMarkersPerOwnerAndResource(owner: string, resource: string): void {
		const markersPerOwner = this.markers.get(owner);
		if (!markersPerOwner) {
			return;
		}
		const deliveredMarkersPerOwner = this.getDeliveredMarkersPerOwner(owner);
		const markersPerResource = markersPerOwner.get(resource);
		if (!markersPerResource) {
			return;
		}
		this.deliverMarkersPerOwnerAndResourceResolved(owner, resource, markersPerResource, deliveredMarkersPerOwner);
	}

	private deliverMarkersPerOwnerAndResourceResolved(owner: string, resource: string, markers: Map<string, IMarkerData>, reported: Map<string, number>): void {
		if (markers.size !== reported.get(resource)) {
			const toSet: IMarkerData[] = [];
			markers.forEach(value => toSet.push(value));
			this.markerService.changeOne(owner, URI.parse(resource), toSet);
			reported.set(resource, markers.size);
		}
	}

	private getDeliveredMarkersPerOwner(owner: string): Map<string, number> {
		let result = this.deliveredMarkers.get(owner);
		if (!result) {
			result = new Map<string, number>();
			this.deliveredMarkers.set(owner, result);
		}
		return result;
	}

	protected cleanMarkerCaches(): void {
		this._numberOfMatches = 0;
		this._maxMarkerSeverity = undefined;
		this.markers.clear();
		this.deliveredMarkers.clear();
	}

	public done(): void {
		this.reportMarkers();
		this.cleanAllMarkers();
	}
}

export const enum ProblemHandlingStrategy {
	Clean
}

export class StartStopProblemCollector extends AbstractProblemCollector implements IProblemMatcher {
	private owners: string[];

	private currentOwner: string | undefined;
	private currentResource: string | undefined;

	private _hasStarted: boolean = false;

	constructor(problemMatchers: ProblemMatcher[], markerService: IMarkerService, modelService: IModelService, _strategy: ProblemHandlingStrategy = ProblemHandlingStrategy.Clean, fileService?: IFileService) {
		super(problemMatchers, markerService, modelService, fileService);
		const ownerSet: { [key: string]: boolean } = Object.create(null);
		problemMatchers.forEach(description => ownerSet[description.owner] = true);
		this.owners = Object.keys(ownerSet);
		this.owners.forEach((owner) => {
			this.recordResourcesToClean(owner);
		});
	}

	protected async processLineInternal(line: string): Promise<void> {
		if (!this._hasStarted) {
			this._hasStarted = true;
			this._onDidStateChange.fire(IProblemCollectorEvent.create(ProblemCollectorEventKind.BackgroundProcessingBegins));
		}
		const markerMatch = this.tryFindMarker(line);
		if (!markerMatch) {
			return;
		}

		const owner = markerMatch.description.owner;
		const resource = await markerMatch.resource;
		const resourceAsString = resource.toString();
		this.removeResourceToClean(owner, resourceAsString);
		const shouldApplyMatch = await this.shouldApplyMatch(markerMatch);
		if (shouldApplyMatch) {
			this.recordMarker(markerMatch.marker, owner, resourceAsString);
			if (this.currentOwner !== owner || this.currentResource !== resourceAsString) {
				if (this.currentOwner && this.currentResource) {
					this.deliverMarkersPerOwnerAndResource(this.currentOwner, this.currentResource);
				}
				this.currentOwner = owner;
				this.currentResource = resourceAsString;
			}
		}
	}
}

interface IBackgroundPatterns {
	key: string;
	matcher: ProblemMatcher;
	begin: IWatchingPattern;
	end: IWatchingPattern;
}

export class WatchingProblemCollector extends AbstractProblemCollector implements IProblemMatcher {

	private backgroundPatterns: IBackgroundPatterns[];

	// workaround for https://github.com/microsoft/vscode/issues/44018
	private _activeBackgroundMatchers: Set<string>;

	// Current State
	private currentOwner: string | undefined;
	private currentResource: string | undefined;

	private lines: string[] = [];
	public beginPatterns: RegExp[] = [];
	constructor(problemMatchers: ProblemMatcher[], markerService: IMarkerService, modelService: IModelService, fileService?: IFileService) {
		super(problemMatchers, markerService, modelService, fileService);
		this.resetCurrentResource();
		this.backgroundPatterns = [];
		this._activeBackgroundMatchers = new Set<string>();
		this.problemMatchers.forEach(matcher => {
			if (matcher.watching) {
				const key: string = generateUuid();
				this.backgroundPatterns.push({
					key,
					matcher: matcher,
					begin: matcher.watching.beginsPattern,
					end: matcher.watching.endsPattern
				});
				this.beginPatterns.push(matcher.watching.beginsPattern.regexp);
			}
		});

		this.modelListeners.add(this.modelService.onModelRemoved(modelEvent => {
			let markerChanged: IDisposable | undefined = Event.debounce(
				this.markerService.onMarkerChanged,
				(last: readonly URI[] | undefined, e: readonly URI[]) => (last ?? []).concat(e),
				500,
				false,
				true
			)(async (markerEvent: readonly URI[]) => {
				if (!markerEvent || !markerEvent.includes(modelEvent.uri) || (this.markerService.read({ resource: modelEvent.uri }).length !== 0)) {
					return;
				}
				const oldLines = Array.from(this.lines);
				for (const line of oldLines) {
					await this.processLineInternal(line);
				}
			});

			this._register(markerChanged); // Ensures markerChanged is tracked and disposed of properly

			setTimeout(() => {
				if (markerChanged) {
					const _markerChanged = markerChanged;
					markerChanged = undefined;
					_markerChanged.dispose();
				}
			}, 600);
		}));
	}

	public aboutToStart(): void {
		for (const background of this.backgroundPatterns) {
			if (background.matcher.watching && background.matcher.watching.activeOnStart) {
				this._activeBackgroundMatchers.add(background.key);
				this._onDidStateChange.fire(IProblemCollectorEvent.create(ProblemCollectorEventKind.BackgroundProcessingBegins));
				this.recordResourcesToClean(background.matcher.owner);
			}
		}
	}

	protected async processLineInternal(line: string): Promise<void> {
		if (await this.tryBegin(line) || this.tryFinish(line)) {
			return;
		}
		this.lines.push(line);
		const markerMatch = this.tryFindMarker(line);
		if (!markerMatch) {
			return;
		}
		const resource = await markerMatch.resource;
		const owner = markerMatch.description.owner;
		const resourceAsString = resource.toString();
		this.removeResourceToClean(owner, resourceAsString);
		const shouldApplyMatch = await this.shouldApplyMatch(markerMatch);
		if (shouldApplyMatch) {
			this.recordMarker(markerMatch.marker, owner, resourceAsString);
			if (this.currentOwner !== owner || this.currentResource !== resourceAsString) {
				this.reportMarkersForCurrentResource();
				this.currentOwner = owner;
				this.currentResource = resourceAsString;
			}
		}
	}

	public forceDelivery(): void {
		this.reportMarkersForCurrentResource();
	}

	private async tryBegin(line: string): Promise<boolean> {
		let result = false;
		for (const background of this.backgroundPatterns) {
			const matches = background.begin.regexp.exec(line);
			if (matches) {
				if (this._activeBackgroundMatchers.has(background.key)) {
					continue;
				}
				this._activeBackgroundMatchers.add(background.key);
				result = true;
				this._onDidFindFirstMatch.fire();
				this.lines = [];
				this.lines.push(line);
				this._onDidStateChange.fire(IProblemCollectorEvent.create(ProblemCollectorEventKind.BackgroundProcessingBegins));
				this.cleanMarkerCaches();
				this.resetCurrentResource();
				const owner = background.matcher.owner;
				const file = matches[background.begin.file!];
				if (file) {
					const resource = getResource(file, background.matcher);
					this.recordResourceToClean(owner, await resource);
				} else {
					this.recordResourcesToClean(owner);
				}
			}
		}
		return result;
	}

	private tryFinish(line: string): boolean {
		let result = false;
		for (const background of this.backgroundPatterns) {
			const matches = background.end.regexp.exec(line);
			if (matches) {
				if (this._numberOfMatches > 0) {
					this._onDidFindErrors.fire(this.markerService.read({ owner: background.matcher.owner }));
				} else {
					this._onDidRequestInvalidateLastMarker.fire();
				}
				if (this._activeBackgroundMatchers.delete(background.key)) {
					this.resetCurrentResource();
					this._onDidStateChange.fire(IProblemCollectorEvent.create(ProblemCollectorEventKind.BackgroundProcessingEnds));
					result = true;
					this.lines.push(line);
					const owner = background.matcher.owner;
					this.cleanMarkers(owner);
					this.cleanMarkerCaches();
				}
			}
		}
		return result;
	}

	private resetCurrentResource(): void {
		this.reportMarkersForCurrentResource();
		this.currentOwner = undefined;
		this.currentResource = undefined;
	}

	private reportMarkersForCurrentResource(): void {
		if (this.currentOwner && this.currentResource) {
			this.deliverMarkersPerOwnerAndResource(this.currentOwner, this.currentResource);
		}
	}

	public override done(): void {
		[...this.applyToByOwner.keys()].forEach(owner => {
			this.recordResourcesToClean(owner);
		});
		super.done();
	}

	public isWatching(): boolean {
		return this.backgroundPatterns.length > 0;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tasks/common/problemMatcher.ts]---
Location: vscode-main/src/vs/workbench/contrib/tasks/common/problemMatcher.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';

import * as Objects from '../../../../base/common/objects.js';
import * as Strings from '../../../../base/common/strings.js';
import * as Assert from '../../../../base/common/assert.js';
import { join, normalize } from '../../../../base/common/path.js';
import * as Types from '../../../../base/common/types.js';
import * as UUID from '../../../../base/common/uuid.js';
import * as Platform from '../../../../base/common/platform.js';
import Severity from '../../../../base/common/severity.js';
import { URI } from '../../../../base/common/uri.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';
import { ValidationStatus, ValidationState, IProblemReporter, Parser } from '../../../../base/common/parsers.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { asArray } from '../../../../base/common/arrays.js';
import { Schemas as NetworkSchemas } from '../../../../base/common/network.js';

import { IMarkerData, MarkerSeverity } from '../../../../platform/markers/common/markers.js';
import { ExtensionsRegistry, ExtensionMessageCollector } from '../../../services/extensions/common/extensionsRegistry.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { FileType, IFileService, IFileStatWithPartialMetadata, IFileSystemProvider } from '../../../../platform/files/common/files.js';

export enum FileLocationKind {
	Default,
	Relative,
	Absolute,
	AutoDetect,
	Search
}

export namespace FileLocationKind {
	export function fromString(value: string): FileLocationKind | undefined {
		value = value.toLowerCase();
		if (value === 'absolute') {
			return FileLocationKind.Absolute;
		} else if (value === 'relative') {
			return FileLocationKind.Relative;
		} else if (value === 'autodetect') {
			return FileLocationKind.AutoDetect;
		} else if (value === 'search') {
			return FileLocationKind.Search;
		} else {
			return undefined;
		}
	}
}

export enum ProblemLocationKind {
	File,
	Location
}

export namespace ProblemLocationKind {
	export function fromString(value: string): ProblemLocationKind | undefined {
		value = value.toLowerCase();
		if (value === 'file') {
			return ProblemLocationKind.File;
		} else if (value === 'location') {
			return ProblemLocationKind.Location;
		} else {
			return undefined;
		}
	}
}

export interface IProblemPattern {
	regexp: RegExp;

	kind?: ProblemLocationKind;

	file?: number;

	message?: number;

	location?: number;

	line?: number;

	character?: number;

	endLine?: number;

	endCharacter?: number;

	code?: number;

	severity?: number;

	loop?: boolean;
}

export interface INamedProblemPattern extends IProblemPattern {
	name: string;
}

export type MultiLineProblemPattern = IProblemPattern[];

export interface IWatchingPattern {
	regexp: RegExp;
	file?: number;
}

export interface IWatchingMatcher {
	activeOnStart: boolean;
	beginsPattern: IWatchingPattern;
	endsPattern: IWatchingPattern;
}

export enum ApplyToKind {
	allDocuments,
	openDocuments,
	closedDocuments
}

export namespace ApplyToKind {
	export function fromString(value: string): ApplyToKind | undefined {
		value = value.toLowerCase();
		if (value === 'alldocuments') {
			return ApplyToKind.allDocuments;
		} else if (value === 'opendocuments') {
			return ApplyToKind.openDocuments;
		} else if (value === 'closeddocuments') {
			return ApplyToKind.closedDocuments;
		} else {
			return undefined;
		}
	}
}

export interface ProblemMatcher {
	owner: string;
	source?: string;
	applyTo: ApplyToKind;
	fileLocation: FileLocationKind;
	filePrefix?: string | Config.SearchFileLocationArgs;
	pattern: Types.SingleOrMany<IProblemPattern>;
	severity?: Severity;
	watching?: IWatchingMatcher;
	uriProvider?: (path: string) => URI;
}

export interface INamedProblemMatcher extends ProblemMatcher {
	name: string;
	label: string;
	deprecated?: boolean;
}

export interface INamedMultiLineProblemPattern {
	name: string;
	label: string;
	patterns: MultiLineProblemPattern;
}

export function isNamedProblemMatcher(value: ProblemMatcher | undefined): value is INamedProblemMatcher {
	return value && Types.isString((<INamedProblemMatcher>value).name) ? true : false;
}

interface ILocation {
	startLineNumber: number;
	startCharacter: number;
	endLineNumber: number;
	endCharacter: number;
}

interface IProblemData {
	kind?: ProblemLocationKind;
	file?: string;
	location?: string;
	line?: string;
	character?: string;
	endLine?: string;
	endCharacter?: string;
	message?: string;
	severity?: string;
	code?: string;
}

export interface IProblemMatch {
	resource: Promise<URI>;
	marker: IMarkerData;
	description: ProblemMatcher;
}

export interface IHandleResult {
	match: IProblemMatch | null;
	continue: boolean;
}


export async function getResource(filename: string, matcher: ProblemMatcher, fileService?: IFileService): Promise<URI> {
	const kind = matcher.fileLocation;
	let fullPath: string | undefined;
	if (kind === FileLocationKind.Absolute) {
		fullPath = filename;
	} else if ((kind === FileLocationKind.Relative) && matcher.filePrefix && Types.isString(matcher.filePrefix)) {
		fullPath = join(matcher.filePrefix, filename);
	} else if (kind === FileLocationKind.AutoDetect) {
		const matcherClone = Objects.deepClone(matcher);
		matcherClone.fileLocation = FileLocationKind.Relative;
		if (fileService) {
			const relative = await getResource(filename, matcherClone);
			let stat: IFileStatWithPartialMetadata | undefined = undefined;
			try {
				stat = await fileService.stat(relative);
			} catch (ex) {
				// Do nothing, we just need to catch file resolution errors.
			}
			if (stat) {
				return relative;
			}
		}

		matcherClone.fileLocation = FileLocationKind.Absolute;
		return getResource(filename, matcherClone);
	} else if (kind === FileLocationKind.Search && fileService) {
		const fsProvider = fileService.getProvider(NetworkSchemas.file);
		if (fsProvider) {
			const uri = await searchForFileLocation(filename, fsProvider, matcher.filePrefix as Config.SearchFileLocationArgs);
			fullPath = uri?.path;
		}

		if (!fullPath) {
			const absoluteMatcher = Objects.deepClone(matcher);
			absoluteMatcher.fileLocation = FileLocationKind.Absolute;
			return getResource(filename, absoluteMatcher);
		}
	}
	if (fullPath === undefined) {
		throw new Error('FileLocationKind is not actionable. Does the matcher have a filePrefix? This should never happen.');
	}
	fullPath = normalize(fullPath);
	fullPath = fullPath.replace(/\\/g, '/');
	if (fullPath[0] !== '/') {
		fullPath = '/' + fullPath;
	}
	if (matcher.uriProvider !== undefined) {
		return matcher.uriProvider(fullPath);
	} else {
		return URI.file(fullPath);
	}
}

async function searchForFileLocation(filename: string, fsProvider: IFileSystemProvider, args: Config.SearchFileLocationArgs): Promise<URI | undefined> {
	const exclusions = new Set(asArray(args.exclude || []).map(x => URI.file(x).path));
	async function search(dir: URI): Promise<URI | undefined> {
		if (exclusions.has(dir.path)) {
			return undefined;
		}

		const entries = await fsProvider.readdir(dir);
		const subdirs: URI[] = [];

		for (const [name, fileType] of entries) {
			if (fileType === FileType.Directory) {
				subdirs.push(URI.joinPath(dir, name));
				continue;
			}

			if (fileType === FileType.File) {
				/**
				 * Note that sometimes the given `filename` could be a relative
				 * path (not just the "name.ext" part). For example, the
				 * `filename` can be "/subdir/name.ext". So, just comparing
				 * `name` as `filename` is not sufficient. The workaround here
				 * is to form the URI with `dir` and `name` and check if it ends
				 * with the given `filename`.
				 */
				const fullUri = URI.joinPath(dir, name);
				if (fullUri.path.endsWith(filename)) {
					return fullUri;
				}
			}
		}

		for (const subdir of subdirs) {
			const result = await search(subdir);
			if (result) {
				return result;
			}
		}
		return undefined;
	}

	for (const dir of asArray(args.include || [])) {
		const hit = await search(URI.file(dir));
		if (hit) {
			return hit;
		}
	}
	return undefined;
}

export interface ILineMatcher {
	matchLength: number;
	next(line: string): IProblemMatch | null;
	handle(lines: string[], start?: number): IHandleResult;
}

export function createLineMatcher(matcher: ProblemMatcher, fileService?: IFileService): ILineMatcher {
	const pattern = matcher.pattern;
	if (Array.isArray(pattern)) {
		return new MultiLineMatcher(matcher, fileService);
	} else {
		return new SingleLineMatcher(matcher, fileService);
	}
}

const endOfLine: string = Platform.OS === Platform.OperatingSystem.Windows ? '\r\n' : '\n';

abstract class AbstractLineMatcher implements ILineMatcher {
	private matcher: ProblemMatcher;
	private fileService?: IFileService;

	constructor(matcher: ProblemMatcher, fileService?: IFileService) {
		this.matcher = matcher;
		this.fileService = fileService;
	}

	public handle(lines: string[], start: number = 0): IHandleResult {
		return { match: null, continue: false };
	}

	public next(line: string): IProblemMatch | null {
		return null;
	}

	public abstract get matchLength(): number;

	protected fillProblemData(data: IProblemData | undefined, pattern: IProblemPattern, matches: RegExpExecArray): data is IProblemData {
		if (data) {
			this.fillProperty(data, 'file', pattern, matches, true);
			this.appendProperty(data, 'message', pattern, matches, true);
			this.fillProperty(data, 'code', pattern, matches, true);
			this.fillProperty(data, 'severity', pattern, matches, true);
			this.fillProperty(data, 'location', pattern, matches, true);
			this.fillProperty(data, 'line', pattern, matches);
			this.fillProperty(data, 'character', pattern, matches);
			this.fillProperty(data, 'endLine', pattern, matches);
			this.fillProperty(data, 'endCharacter', pattern, matches);
			return true;
		} else {
			return false;
		}
	}

	private appendProperty(data: IProblemData, property: keyof IProblemData, pattern: IProblemPattern, matches: RegExpExecArray, trim: boolean = false): void {
		const patternProperty = pattern[property];
		if (Types.isUndefined(data[property])) {
			this.fillProperty(data, property, pattern, matches, trim);
		}
		else if (!Types.isUndefined(patternProperty) && patternProperty < matches.length) {
			let value = matches[patternProperty];
			if (trim) {
				value = Strings.trim(value)!;
			}
			// eslint-disable-next-line local/code-no-any-casts
			(data as any)[property] += endOfLine + value;
		}
	}

	private fillProperty(data: IProblemData, property: keyof IProblemData, pattern: IProblemPattern, matches: RegExpExecArray, trim: boolean = false): void {
		const patternAtProperty = pattern[property];
		if (Types.isUndefined(data[property]) && !Types.isUndefined(patternAtProperty) && patternAtProperty < matches.length) {
			let value = matches[patternAtProperty];
			if (value !== undefined) {
				if (trim) {
					value = Strings.trim(value)!;
				}
				// eslint-disable-next-line local/code-no-any-casts
				(data as any)[property] = value;
			}
		}
	}

	protected getMarkerMatch(data: IProblemData): IProblemMatch | undefined {
		try {
			const location = this.getLocation(data);
			if (data.file && location && data.message) {
				const marker: IMarkerData = {
					severity: this.getSeverity(data),
					startLineNumber: location.startLineNumber,
					startColumn: location.startCharacter,
					endLineNumber: location.endLineNumber,
					endColumn: location.endCharacter,
					message: data.message
				};
				if (data.code !== undefined) {
					marker.code = data.code;
				}
				if (this.matcher.source !== undefined) {
					marker.source = this.matcher.source;
				}
				return {
					description: this.matcher,
					resource: this.getResource(data.file),
					marker: marker
				};
			}
		} catch (err) {
			console.error(`Failed to convert problem data into match: ${JSON.stringify(data)}`);
		}
		return undefined;
	}

	protected getResource(filename: string): Promise<URI> {
		return getResource(filename, this.matcher, this.fileService);
	}

	private getLocation(data: IProblemData): ILocation | null {
		if (data.kind === ProblemLocationKind.File) {
			return this.createLocation(0, 0, 0, 0);
		}
		if (data.location) {
			return this.parseLocationInfo(data.location);
		}
		if (!data.line) {
			return null;
		}
		const startLine = parseInt(data.line);
		const startColumn = data.character ? parseInt(data.character) : undefined;
		const endLine = data.endLine ? parseInt(data.endLine) : undefined;
		const endColumn = data.endCharacter ? parseInt(data.endCharacter) : undefined;
		return this.createLocation(startLine, startColumn, endLine, endColumn);
	}

	private parseLocationInfo(value: string): ILocation | null {
		if (!value || !value.match(/(\d+|\d+,\d+|\d+,\d+,\d+,\d+)/)) {
			return null;
		}
		const parts = value.split(',');
		const startLine = parseInt(parts[0]);
		const startColumn = parts.length > 1 ? parseInt(parts[1]) : undefined;
		if (parts.length > 3) {
			return this.createLocation(startLine, startColumn, parseInt(parts[2]), parseInt(parts[3]));
		} else {
			return this.createLocation(startLine, startColumn, undefined, undefined);
		}
	}

	private createLocation(startLine: number, startColumn: number | undefined, endLine: number | undefined, endColumn: number | undefined): ILocation {
		if (startColumn !== undefined && endColumn !== undefined) {
			return { startLineNumber: startLine, startCharacter: startColumn, endLineNumber: endLine || startLine, endCharacter: endColumn };
		}
		if (startColumn !== undefined) {
			return { startLineNumber: startLine, startCharacter: startColumn, endLineNumber: startLine, endCharacter: startColumn };
		}
		return { startLineNumber: startLine, startCharacter: 1, endLineNumber: startLine, endCharacter: 2 ** 31 - 1 }; // See https://github.com/microsoft/vscode/issues/80288#issuecomment-650636442 for discussion
	}

	private getSeverity(data: IProblemData): MarkerSeverity {
		let result: Severity | null = null;
		if (data.severity) {
			const value = data.severity;
			if (value) {
				result = Severity.fromValue(value);
				if (result === Severity.Ignore) {
					if (value === 'E') {
						result = Severity.Error;
					} else if (value === 'W') {
						result = Severity.Warning;
					} else if (value === 'I') {
						result = Severity.Info;
					} else if (Strings.equalsIgnoreCase(value, 'hint')) {
						result = Severity.Info;
					} else if (Strings.equalsIgnoreCase(value, 'note')) {
						result = Severity.Info;
					}
				}
			}
		}
		if (result === null || result === Severity.Ignore) {
			result = this.matcher.severity || Severity.Error;
		}
		return MarkerSeverity.fromSeverity(result);
	}
}

class SingleLineMatcher extends AbstractLineMatcher {

	private pattern: IProblemPattern;

	constructor(matcher: ProblemMatcher, fileService?: IFileService) {
		super(matcher, fileService);
		this.pattern = <IProblemPattern>matcher.pattern;
	}

	public get matchLength(): number {
		return 1;
	}

	public override handle(lines: string[], start: number = 0): IHandleResult {
		Assert.ok(lines.length - start === 1);
		const data: IProblemData = Object.create(null);
		if (this.pattern.kind !== undefined) {
			data.kind = this.pattern.kind;
		}
		const matches = this.pattern.regexp.exec(lines[start]);
		if (matches) {
			this.fillProblemData(data, this.pattern, matches);
			if (data.kind === ProblemLocationKind.Location && !data.location && !data.line && data.file) {
				data.kind = ProblemLocationKind.File;
			}
			const match = this.getMarkerMatch(data);
			if (match) {
				return { match: match, continue: false };
			}
		}
		return { match: null, continue: false };
	}

	public override next(line: string): IProblemMatch | null {
		return null;
	}
}

class MultiLineMatcher extends AbstractLineMatcher {

	private patterns: IProblemPattern[];
	private data: IProblemData | undefined;

	constructor(matcher: ProblemMatcher, fileService?: IFileService) {
		super(matcher, fileService);
		this.patterns = <IProblemPattern[]>matcher.pattern;
	}

	public get matchLength(): number {
		return this.patterns.length;
	}

	public override handle(lines: string[], start: number = 0): IHandleResult {
		Assert.ok(lines.length - start === this.patterns.length);
		this.data = Object.create(null);
		let data = this.data!;
		data.kind = this.patterns[0].kind;
		for (let i = 0; i < this.patterns.length; i++) {
			const pattern = this.patterns[i];
			const matches = pattern.regexp.exec(lines[i + start]);
			if (!matches) {
				return { match: null, continue: false };
			} else {
				// Only the last pattern can loop
				if (pattern.loop && i === this.patterns.length - 1) {
					data = Objects.deepClone(data);
				}
				this.fillProblemData(data, pattern, matches);
			}
		}
		const loop = !!this.patterns[this.patterns.length - 1].loop;
		if (!loop) {
			this.data = undefined;
		}
		const markerMatch = data ? this.getMarkerMatch(data) : null;
		return { match: markerMatch ? markerMatch : null, continue: loop };
	}

	public override next(line: string): IProblemMatch | null {
		const pattern = this.patterns[this.patterns.length - 1];
		Assert.ok(pattern.loop === true && this.data !== null);
		const matches = pattern.regexp.exec(line);
		if (!matches) {
			this.data = undefined;
			return null;
		}
		const data = Objects.deepClone(this.data);
		let problemMatch: IProblemMatch | undefined;
		if (this.fillProblemData(data, pattern, matches)) {
			problemMatch = this.getMarkerMatch(data);
		}
		return problemMatch ? problemMatch : null;
	}
}

export namespace Config {

	export interface IProblemPattern {

		/**
		* The regular expression to find a problem in the console output of an
		* executed task.
		*/
		regexp?: string;

		/**
		* Whether the pattern matches a whole file, or a location (file/line)
		*
		* The default is to match for a location. Only valid on the
		* first problem pattern in a multi line problem matcher.
		*/
		kind?: string;

		/**
		* The match group index of the filename.
		* If omitted 1 is used.
		*/
		file?: number;

		/**
		* The match group index of the problem's location. Valid location
		* patterns are: (line), (line,column) and (startLine,startColumn,endLine,endColumn).
		* If omitted the line and column properties are used.
		*/
		location?: number;

		/**
		* The match group index of the problem's line in the source file.
		*
		* Defaults to 2.
		*/
		line?: number;

		/**
		* The match group index of the problem's column in the source file.
		*
		* Defaults to 3.
		*/
		column?: number;

		/**
		* The match group index of the problem's end line in the source file.
		*
		* Defaults to undefined. No end line is captured.
		*/
		endLine?: number;

		/**
		* The match group index of the problem's end column in the source file.
		*
		* Defaults to undefined. No end column is captured.
		*/
		endColumn?: number;

		/**
		* The match group index of the problem's severity.
		*
		* Defaults to undefined. In this case the problem matcher's severity
		* is used.
		*/
		severity?: number;

		/**
		* The match group index of the problem's code.
		*
		* Defaults to undefined. No code is captured.
		*/
		code?: number;

		/**
		* The match group index of the message. If omitted it defaults
		* to 4 if location is specified. Otherwise it defaults to 5.
		*/
		message?: number;

		/**
		* Specifies if the last pattern in a multi line problem matcher should
		* loop as long as it does match a line consequently. Only valid on the
		* last problem pattern in a multi line problem matcher.
		*/
		loop?: boolean;
	}

	export interface ICheckedProblemPattern extends IProblemPattern {
		/**
		* The regular expression to find a problem in the console output of an
		* executed task.
		*/
		regexp: string;
	}

	export namespace CheckedProblemPattern {
		export function is(value: any): value is ICheckedProblemPattern {
			const candidate: IProblemPattern = value as IProblemPattern;
			return candidate && Types.isString(candidate.regexp);
		}
	}

	export interface INamedProblemPattern extends IProblemPattern {
		/**
		 * The name of the problem pattern.
		 */
		name: string;

		/**
		 * A human readable label
		 */
		label?: string;
	}

	export namespace NamedProblemPattern {
		export function is(value: any): value is INamedProblemPattern {
			const candidate: INamedProblemPattern = value as INamedProblemPattern;
			return candidate && Types.isString(candidate.name);
		}
	}

	export interface INamedCheckedProblemPattern extends INamedProblemPattern {
		/**
		* The regular expression to find a problem in the console output of an
		* executed task.
		*/
		regexp: string;
	}

	export namespace NamedCheckedProblemPattern {
		export function is(value: any): value is INamedCheckedProblemPattern {
			const candidate: INamedProblemPattern = value as INamedProblemPattern;
			return candidate && NamedProblemPattern.is(candidate) && Types.isString(candidate.regexp);
		}
	}

	export type MultiLineProblemPattern = IProblemPattern[];

	export namespace MultiLineProblemPattern {
		export function is(value: any): value is MultiLineProblemPattern {
			return value && Array.isArray(value);
		}
	}

	export type MultiLineCheckedProblemPattern = ICheckedProblemPattern[];

	export namespace MultiLineCheckedProblemPattern {
		export function is(value: any): value is MultiLineCheckedProblemPattern {
			if (!MultiLineProblemPattern.is(value)) {
				return false;
			}
			for (const element of value) {
				if (!Config.CheckedProblemPattern.is(element)) {
					return false;
				}
			}
			return true;
		}
	}

	export interface INamedMultiLineCheckedProblemPattern {
		/**
		 * The name of the problem pattern.
		 */
		name: string;

		/**
		 * A human readable label
		 */
		label?: string;

		/**
		 * The actual patterns
		 */
		patterns: MultiLineCheckedProblemPattern;
	}

	export namespace NamedMultiLineCheckedProblemPattern {
		export function is(value: any): value is INamedMultiLineCheckedProblemPattern {
			const candidate = value as INamedMultiLineCheckedProblemPattern;
			return candidate && Types.isString(candidate.name) && Array.isArray(candidate.patterns) && MultiLineCheckedProblemPattern.is(candidate.patterns);
		}
	}

	export type NamedProblemPatterns = (Config.INamedProblemPattern | Config.INamedMultiLineCheckedProblemPattern)[];

	/**
	* A watching pattern
	*/
	export interface IWatchingPattern {
		/**
		* The actual regular expression
		*/
		regexp?: string;

		/**
		* The match group index of the filename. If provided the expression
		* is matched for that file only.
		*/
		file?: number;
	}

	/**
	* A description to track the start and end of a watching task.
	*/
	export interface IBackgroundMonitor {

		/**
		* If set to true the watcher starts in active mode. This is the
		* same as outputting a line that matches beginsPattern when the
		* task starts.
		*/
		activeOnStart?: boolean;

		/**
		* If matched in the output the start of a watching task is signaled.
		*/
		beginsPattern?: string | IWatchingPattern;

		/**
		* If matched in the output the end of a watching task is signaled.
		*/
		endsPattern?: string | IWatchingPattern;
	}

	/**
	* A description of a problem matcher that detects problems
	* in build output.
	*/
	export interface ProblemMatcher {

		/**
		 * The name of a base problem matcher to use. If specified the
		 * base problem matcher will be used as a template and properties
		 * specified here will replace properties of the base problem
		 * matcher
		 */
		base?: string;

		/**
		 * The owner of the produced VSCode problem. This is typically
		 * the identifier of a VSCode language service if the problems are
		 * to be merged with the one produced by the language service
		 * or a generated internal id. Defaults to the generated internal id.
		 */
		owner?: string;

		/**
		 * A human-readable string describing the source of this problem.
		 * E.g. 'typescript' or 'super lint'.
		 */
		source?: string;

		/**
		* Specifies to which kind of documents the problems found by this
		* matcher are applied. Valid values are:
		*
		*   "allDocuments": problems found in all documents are applied.
		*   "openDocuments": problems found in documents that are open
		*   are applied.
		*   "closedDocuments": problems found in closed documents are
		*   applied.
		*/
		applyTo?: string;

		/**
		* The severity of the VSCode problem produced by this problem matcher.
		*
		* Valid values are:
		*   "error": to produce errors.
		*   "warning": to produce warnings.
		*   "info": to produce infos.
		*
		* The value is used if a pattern doesn't specify a severity match group.
		* Defaults to "error" if omitted.
		*/
		severity?: string;

		/**
		* Defines how filename reported in a problem pattern
		* should be read. Valid values are:
		*  - "absolute": the filename is always treated absolute.
		*  - "relative": the filename is always treated relative to
		*    the current working directory. This is the default.
		*  - ["relative", "path value"]: the filename is always
		*    treated relative to the given path value.
		*  - "autodetect": the filename is treated relative to
		*    the current workspace directory, and if the file
		*    does not exist, it is treated as absolute.
		*  - ["autodetect", "path value"]: the filename is treated
		*    relative to the given path value, and if it does not
		*    exist, it is treated as absolute.
		*  - ["search", { include?: "" | []; exclude?: "" | [] }]: The filename
		*    needs to be searched under the directories named by the "include"
		*    property and their nested subdirectories. With "exclude" property
		*    present, the directories should be removed from the search. When
		*    `include` is not unprovided, the current workspace directory should
		*    be used as the default.
		*/
		fileLocation?: Types.SingleOrMany<string> | ['search', SearchFileLocationArgs];

		/**
		* The name of a predefined problem pattern, the inline definition
		* of a problem pattern or an array of problem patterns to match
		* problems spread over multiple lines.
		*/
		pattern?: string | Types.SingleOrMany<IProblemPattern>;

		/**
		* A regular expression signaling that a watched tasks begins executing
		* triggered through file watching.
		*/
		watchedTaskBeginsRegExp?: string;

		/**
		* A regular expression signaling that a watched tasks ends executing.
		*/
		watchedTaskEndsRegExp?: string;

		/**
		 * @deprecated Use background instead.
		 */
		watching?: IBackgroundMonitor;
		background?: IBackgroundMonitor;
	}

	export type SearchFileLocationArgs = {
		include?: Types.SingleOrMany<string>;
		exclude?: Types.SingleOrMany<string>;
	};

	export type ProblemMatcherType = string | ProblemMatcher | Array<string | ProblemMatcher>;

	export interface INamedProblemMatcher extends ProblemMatcher {
		/**
		* This name can be used to refer to the
		* problem matcher from within a task.
		*/
		name: string;

		/**
		 * A human readable label.
		 */
		label?: string;
	}

	export function isNamedProblemMatcher(value: ProblemMatcher): value is INamedProblemMatcher {
		return Types.isString((<INamedProblemMatcher>value).name);
	}
}

export class ProblemPatternParser extends Parser {

	constructor(logger: IProblemReporter) {
		super(logger);
	}

	public parse(value: Config.IProblemPattern): IProblemPattern;
	public parse(value: Config.MultiLineProblemPattern): MultiLineProblemPattern;
	public parse(value: Config.INamedProblemPattern): INamedProblemPattern;
	public parse(value: Config.INamedMultiLineCheckedProblemPattern): INamedMultiLineProblemPattern;
	public parse(value: Config.IProblemPattern | Config.MultiLineProblemPattern | Config.INamedProblemPattern | Config.INamedMultiLineCheckedProblemPattern): any {
		if (Config.NamedMultiLineCheckedProblemPattern.is(value)) {
			return this.createNamedMultiLineProblemPattern(value);
		} else if (Config.MultiLineCheckedProblemPattern.is(value)) {
			return this.createMultiLineProblemPattern(value);
		} else if (Config.NamedCheckedProblemPattern.is(value)) {
			const result = this.createSingleProblemPattern(value) as INamedProblemPattern;
			result.name = value.name;
			return result;
		} else if (Config.CheckedProblemPattern.is(value)) {
			return this.createSingleProblemPattern(value);
		} else {
			this.error(localize('ProblemPatternParser.problemPattern.missingRegExp', 'The problem pattern is missing a regular expression.'));
			return null;
		}
	}

	private createSingleProblemPattern(value: Config.ICheckedProblemPattern): IProblemPattern | null {
		const result = this.doCreateSingleProblemPattern(value, true);
		if (result === undefined) {
			return null;
		} else if (result.kind === undefined) {
			result.kind = ProblemLocationKind.Location;
		}
		return this.validateProblemPattern([result]) ? result : null;
	}

	private createNamedMultiLineProblemPattern(value: Config.INamedMultiLineCheckedProblemPattern): INamedMultiLineProblemPattern | null {
		const validPatterns = this.createMultiLineProblemPattern(value.patterns);
		if (!validPatterns) {
			return null;
		}
		const result = {
			name: value.name,
			label: value.label ? value.label : value.name,
			patterns: validPatterns
		};
		return result;
	}

	private createMultiLineProblemPattern(values: Config.MultiLineCheckedProblemPattern): MultiLineProblemPattern | null {
		const result: MultiLineProblemPattern = [];
		for (let i = 0; i < values.length; i++) {
			const pattern = this.doCreateSingleProblemPattern(values[i], false);
			if (pattern === undefined) {
				return null;
			}
			if (i < values.length - 1) {
				if (!Types.isUndefined(pattern.loop) && pattern.loop) {
					pattern.loop = false;
					this.error(localize('ProblemPatternParser.loopProperty.notLast', 'The loop property is only supported on the last line matcher.'));
				}
			}
			result.push(pattern);
		}
		if (!result || result.length === 0) {
			this.error(localize('ProblemPatternParser.problemPattern.emptyPattern', 'The problem pattern is invalid. It must contain at least one pattern.'));
			return null;
		}
		if (result[0].kind === undefined) {
			result[0].kind = ProblemLocationKind.Location;
		}
		return this.validateProblemPattern(result) ? result : null;
	}

	private doCreateSingleProblemPattern(value: Config.ICheckedProblemPattern, setDefaults: boolean): IProblemPattern | undefined {
		const regexp = this.createRegularExpression(value.regexp);
		if (regexp === undefined) {
			return undefined;
		}
		let result: IProblemPattern = { regexp };
		if (value.kind) {
			result.kind = ProblemLocationKind.fromString(value.kind);
		}

		function copyProperty(result: IProblemPattern, source: Config.IProblemPattern, resultKey: keyof IProblemPattern, sourceKey: keyof Config.IProblemPattern) {
			const value = source[sourceKey];
			if (typeof value === 'number') {
				// eslint-disable-next-line local/code-no-any-casts
				(result as any)[resultKey] = value;
			}
		}
		copyProperty(result, value, 'file', 'file');
		copyProperty(result, value, 'location', 'location');
		copyProperty(result, value, 'line', 'line');
		copyProperty(result, value, 'character', 'column');
		copyProperty(result, value, 'endLine', 'endLine');
		copyProperty(result, value, 'endCharacter', 'endColumn');
		copyProperty(result, value, 'severity', 'severity');
		copyProperty(result, value, 'code', 'code');
		copyProperty(result, value, 'message', 'message');
		if (value.loop === true || value.loop === false) {
			result.loop = value.loop;
		}
		if (setDefaults) {
			if (result.location || result.kind === ProblemLocationKind.File) {
				const defaultValue: Partial<IProblemPattern> = {
					file: 1,
					message: 0
				};
				result = Objects.mixin(result, defaultValue, false);
			} else {
				const defaultValue: Partial<IProblemPattern> = {
					file: 1,
					line: 2,
					character: 3,
					message: 0
				};
				result = Objects.mixin(result, defaultValue, false);
			}
		}
		return result;
	}

	private validateProblemPattern(values: IProblemPattern[]): boolean {
		if (!values || values.length === 0) {
			this.error(localize('ProblemPatternParser.problemPattern.emptyPattern', 'The problem pattern is invalid. It must contain at least one pattern.'));
			return false;
		}
		let file: boolean = false, message: boolean = false, location: boolean = false, line: boolean = false;
		const locationKind = (values[0].kind === undefined) ? ProblemLocationKind.Location : values[0].kind;

		values.forEach((pattern, i) => {
			if (i !== 0 && pattern.kind) {
				this.error(localize('ProblemPatternParser.problemPattern.kindProperty.notFirst', 'The problem pattern is invalid. The kind property must be provided only in the first element'));
			}
			file = file || !Types.isUndefined(pattern.file);
			message = message || !Types.isUndefined(pattern.message);
			location = location || !Types.isUndefined(pattern.location);
			line = line || !Types.isUndefined(pattern.line);
		});
		if (!(file && message)) {
			this.error(localize('ProblemPatternParser.problemPattern.missingProperty', 'The problem pattern is invalid. It must have at least have a file and a message.'));
			return false;
		}
		if (locationKind === ProblemLocationKind.Location && !(location || line)) {
			this.error(localize('ProblemPatternParser.problemPattern.missingLocation', 'The problem pattern is invalid. It must either have kind: "file" or have a line or location match group.'));
			return false;
		}
		return true;
	}

	private createRegularExpression(value: string): RegExp | undefined {
		let result: RegExp | undefined;
		try {
			result = new RegExp(value);
		} catch (err) {
			this.error(localize('ProblemPatternParser.invalidRegexp', 'Error: The string {0} is not a valid regular expression.\n', value));
		}
		return result;
	}
}

export class ExtensionRegistryReporter implements IProblemReporter {
	constructor(private _collector: ExtensionMessageCollector, private _validationStatus: ValidationStatus = new ValidationStatus()) {
	}

	public info(message: string): void {
		this._validationStatus.state = ValidationState.Info;
		this._collector.info(message);
	}

	public warn(message: string): void {
		this._validationStatus.state = ValidationState.Warning;
		this._collector.warn(message);
	}

	public error(message: string): void {
		this._validationStatus.state = ValidationState.Error;
		this._collector.error(message);
	}

	public fatal(message: string): void {
		this._validationStatus.state = ValidationState.Fatal;
		this._collector.error(message);
	}

	public get status(): ValidationStatus {
		return this._validationStatus;
	}
}

export namespace Schemas {

	export const ProblemPattern: IJSONSchema = {
		default: {
			regexp: '^([^\\\\s].*)\\\\((\\\\d+,\\\\d+)\\\\):\\\\s*(.*)$',
			file: 1,
			location: 2,
			message: 3
		},
		type: 'object',
		additionalProperties: false,
		properties: {
			regexp: {
				type: 'string',
				description: localize('ProblemPatternSchema.regexp', 'The regular expression to find an error, warning or info in the output.')
			},
			kind: {
				type: 'string',
				description: localize('ProblemPatternSchema.kind', 'whether the pattern matches a location (file and line) or only a file.')
			},
			file: {
				type: 'integer',
				description: localize('ProblemPatternSchema.file', 'The match group index of the filename. If omitted 1 is used.')
			},
			location: {
				type: 'integer',
				description: localize('ProblemPatternSchema.location', 'The match group index of the problem\'s location. Valid location patterns are: (line), (line,column) and (startLine,startColumn,endLine,endColumn). If omitted (line,column) is assumed.')
			},
			line: {
				type: 'integer',
				description: localize('ProblemPatternSchema.line', 'The match group index of the problem\'s line. Defaults to 2')
			},
			column: {
				type: 'integer',
				description: localize('ProblemPatternSchema.column', 'The match group index of the problem\'s line character. Defaults to 3')
			},
			endLine: {
				type: 'integer',
				description: localize('ProblemPatternSchema.endLine', 'The match group index of the problem\'s end line. Defaults to undefined')
			},
			endColumn: {
				type: 'integer',
				description: localize('ProblemPatternSchema.endColumn', 'The match group index of the problem\'s end line character. Defaults to undefined')
			},
			severity: {
				type: 'integer',
				description: localize('ProblemPatternSchema.severity', 'The match group index of the problem\'s severity. Defaults to undefined')
			},
			code: {
				type: 'integer',
				description: localize('ProblemPatternSchema.code', 'The match group index of the problem\'s code. Defaults to undefined')
			},
			message: {
				type: 'integer',
				description: localize('ProblemPatternSchema.message', 'The match group index of the message. If omitted it defaults to 4 if location is specified. Otherwise it defaults to 5.')
			},
			loop: {
				type: 'boolean',
				description: localize('ProblemPatternSchema.loop', 'In a multi line matcher loop indicated whether this pattern is executed in a loop as long as it matches. Can only specified on a last pattern in a multi line pattern.')
			}
		}
	};

	export const NamedProblemPattern: IJSONSchema = Objects.deepClone(ProblemPattern);
	NamedProblemPattern.properties = Objects.deepClone(NamedProblemPattern.properties) || {};
	NamedProblemPattern.properties['name'] = {
		type: 'string',
		description: localize('NamedProblemPatternSchema.name', 'The name of the problem pattern.')
	};

	export const MultiLineProblemPattern: IJSONSchema = {
		type: 'array',
		items: ProblemPattern
	};

	export const NamedMultiLineProblemPattern: IJSONSchema = {
		type: 'object',
		additionalProperties: false,
		properties: {
			name: {
				type: 'string',
				description: localize('NamedMultiLineProblemPatternSchema.name', 'The name of the problem multi line problem pattern.')
			},
			patterns: {
				type: 'array',
				description: localize('NamedMultiLineProblemPatternSchema.patterns', 'The actual patterns.'),
				items: ProblemPattern
			}
		}
	};

	export const WatchingPattern: IJSONSchema = {
		type: 'object',
		additionalProperties: false,
		properties: {
			regexp: {
				type: 'string',
				description: localize('WatchingPatternSchema.regexp', 'The regular expression to detect the begin or end of a background task.')
			},
			file: {
				type: 'integer',
				description: localize('WatchingPatternSchema.file', 'The match group index of the filename. Can be omitted.')
			},
		}
	};

	export const PatternType: IJSONSchema = {
		anyOf: [
			{
				type: 'string',
				description: localize('PatternTypeSchema.name', 'The name of a contributed or predefined pattern')
			},
			Schemas.ProblemPattern,
			Schemas.MultiLineProblemPattern
		],
		description: localize('PatternTypeSchema.description', 'A problem pattern or the name of a contributed or predefined problem pattern. Can be omitted if base is specified.')
	};

	export const ProblemMatcher: IJSONSchema = {
		type: 'object',
		additionalProperties: false,
		properties: {
			base: {
				type: 'string',
				description: localize('ProblemMatcherSchema.base', 'The name of a base problem matcher to use.')
			},
			owner: {
				type: 'string',
				description: localize('ProblemMatcherSchema.owner', 'The owner of the problem inside Code. Can be omitted if base is specified. Defaults to \'external\' if omitted and base is not specified.')
			},
			source: {
				type: 'string',
				description: localize('ProblemMatcherSchema.source', 'A human-readable string describing the source of this diagnostic, e.g. \'typescript\' or \'super lint\'.')
			},
			severity: {
				type: 'string',
				enum: ['error', 'warning', 'info'],
				description: localize('ProblemMatcherSchema.severity', 'The default severity for captures problems. Is used if the pattern doesn\'t define a match group for severity.')
			},
			applyTo: {
				type: 'string',
				enum: ['allDocuments', 'openDocuments', 'closedDocuments'],
				description: localize('ProblemMatcherSchema.applyTo', 'Controls if a problem reported on a text document is applied only to open, closed or all documents.')
			},
			pattern: PatternType,
			fileLocation: {
				oneOf: [
					{
						type: 'string',
						enum: ['absolute', 'relative', 'autoDetect', 'search']
					},
					{
						type: 'array',
						prefixItems: [
							{
								type: 'string',
								enum: ['absolute', 'relative', 'autoDetect', 'search']
							},
						],
						minItems: 1,
						maxItems: 1,
						additionalItems: false
					},
					{
						type: 'array',
						prefixItems: [
							{ type: 'string', enum: ['relative', 'autoDetect'] },
							{ type: 'string' },
						],
						minItems: 2,
						maxItems: 2,
						additionalItems: false,
						examples: [
							['relative', '${workspaceFolder}'],
							['autoDetect', '${workspaceFolder}'],
						]
					},
					{
						type: 'array',
						prefixItems: [
							{ type: 'string', enum: ['search'] },
							{
								type: 'object',
								properties: {
									'include': {
										oneOf: [
											{ type: 'string' },
											{ type: 'array', items: { type: 'string' } }
										]
									},
									'exclude': {
										oneOf: [
											{ type: 'string' },
											{ type: 'array', items: { type: 'string' } }
										]
									},
								},
								required: ['include']
							}
						],
						minItems: 2,
						maxItems: 2,
						additionalItems: false,
						examples: [
							['search', { 'include': ['${workspaceFolder}'] }],
							['search', { 'include': ['${workspaceFolder}'], 'exclude': [] }]
						],
					}
				],
				description: localize('ProblemMatcherSchema.fileLocation', 'Defines how file names reported in a problem pattern should be interpreted. A relative fileLocation may be an array, where the second element of the array is the path of the relative file location. The search fileLocation mode, performs a deep (and, possibly, heavy) file system search within the directories specified by the include/exclude properties of the second element (or the current workspace directory if not specified).')
			},
			background: {
				type: 'object',
				additionalProperties: false,
				description: localize('ProblemMatcherSchema.background', 'Patterns to track the begin and end of a matcher active on a background task.'),
				properties: {
					activeOnStart: {
						type: 'boolean',
						description: localize('ProblemMatcherSchema.background.activeOnStart', 'If set to true the background monitor starts in active mode. This is the same as outputting a line that matches beginsPattern when the task starts.')
					},
					beginsPattern: {
						oneOf: [
							{
								type: 'string'
							},
							Schemas.WatchingPattern
						],
						description: localize('ProblemMatcherSchema.background.beginsPattern', 'If matched in the output the start of a background task is signaled.')
					},
					endsPattern: {
						oneOf: [
							{
								type: 'string'
							},
							Schemas.WatchingPattern
						],
						description: localize('ProblemMatcherSchema.background.endsPattern', 'If matched in the output the end of a background task is signaled.')
					}
				}
			},
			watching: {
				type: 'object',
				additionalProperties: false,
				deprecationMessage: localize('ProblemMatcherSchema.watching.deprecated', 'The watching property is deprecated. Use background instead.'),
				description: localize('ProblemMatcherSchema.watching', 'Patterns to track the begin and end of a watching matcher.'),
				properties: {
					activeOnStart: {
						type: 'boolean',
						description: localize('ProblemMatcherSchema.watching.activeOnStart', 'If set to true the watcher starts in active mode. This is the same as outputting a line that matches beginsPattern when the task starts.')
					},
					beginsPattern: {
						oneOf: [
							{
								type: 'string'
							},
							Schemas.WatchingPattern
						],
						description: localize('ProblemMatcherSchema.watching.beginsPattern', 'If matched in the output the start of a watching task is signaled.')
					},
					endsPattern: {
						oneOf: [
							{
								type: 'string'
							},
							Schemas.WatchingPattern
						],
						description: localize('ProblemMatcherSchema.watching.endsPattern', 'If matched in the output the end of a watching task is signaled.')
					}
				}
			}
		}
	};

	export const LegacyProblemMatcher: IJSONSchema = Objects.deepClone(ProblemMatcher);
	LegacyProblemMatcher.properties = Objects.deepClone(LegacyProblemMatcher.properties) || {};
	LegacyProblemMatcher.properties['watchedTaskBeginsRegExp'] = {
		type: 'string',
		deprecationMessage: localize('LegacyProblemMatcherSchema.watchedBegin.deprecated', 'This property is deprecated. Use the watching property instead.'),
		description: localize('LegacyProblemMatcherSchema.watchedBegin', 'A regular expression signaling that a watched tasks begins executing triggered through file watching.')
	};
	LegacyProblemMatcher.properties['watchedTaskEndsRegExp'] = {
		type: 'string',
		deprecationMessage: localize('LegacyProblemMatcherSchema.watchedEnd.deprecated', 'This property is deprecated. Use the watching property instead.'),
		description: localize('LegacyProblemMatcherSchema.watchedEnd', 'A regular expression signaling that a watched tasks ends executing.')
	};

	export const NamedProblemMatcher: IJSONSchema = Objects.deepClone(ProblemMatcher);
	NamedProblemMatcher.properties = Objects.deepClone(NamedProblemMatcher.properties) || {};
	NamedProblemMatcher.properties.name = {
		type: 'string',
		description: localize('NamedProblemMatcherSchema.name', 'The name of the problem matcher used to refer to it.')
	};
	NamedProblemMatcher.properties.label = {
		type: 'string',
		description: localize('NamedProblemMatcherSchema.label', 'A human readable label of the problem matcher.')
	};
}

const problemPatternExtPoint = ExtensionsRegistry.registerExtensionPoint<Config.NamedProblemPatterns>({
	extensionPoint: 'problemPatterns',
	jsonSchema: {
		description: localize('ProblemPatternExtPoint', 'Contributes problem patterns'),
		type: 'array',
		items: {
			anyOf: [
				Schemas.NamedProblemPattern,
				Schemas.NamedMultiLineProblemPattern
			]
		}
	}
});

export interface IProblemPatternRegistry {
	onReady(): Promise<void>;

	get(key: string): IProblemPattern | MultiLineProblemPattern;
}

class ProblemPatternRegistryImpl implements IProblemPatternRegistry {

	private patterns: IStringDictionary<Types.SingleOrMany<IProblemPattern>>;
	private readyPromise: Promise<void>;

	constructor() {
		this.patterns = Object.create(null);
		this.fillDefaults();
		this.readyPromise = new Promise<void>((resolve, reject) => {
			problemPatternExtPoint.setHandler((extensions, delta) => {
				// We get all statically know extension during startup in one batch
				try {
					delta.removed.forEach(extension => {
						const problemPatterns = extension.value as Config.NamedProblemPatterns;
						for (const pattern of problemPatterns) {
							if (this.patterns[pattern.name]) {
								delete this.patterns[pattern.name];
							}
						}
					});
					delta.added.forEach(extension => {
						const problemPatterns = extension.value as Config.NamedProblemPatterns;
						const parser = new ProblemPatternParser(new ExtensionRegistryReporter(extension.collector));
						for (const pattern of problemPatterns) {
							if (Config.NamedMultiLineCheckedProblemPattern.is(pattern)) {
								const result = parser.parse(pattern);
								if (parser.problemReporter.status.state < ValidationState.Error) {
									this.add(result.name, result.patterns);
								} else {
									extension.collector.error(localize('ProblemPatternRegistry.error', 'Invalid problem pattern. The pattern will be ignored.'));
									extension.collector.error(JSON.stringify(pattern, undefined, 4));
								}
							}
							else if (Config.NamedProblemPattern.is(pattern)) {
								const result = parser.parse(pattern);
								if (parser.problemReporter.status.state < ValidationState.Error) {
									this.add(pattern.name, result);
								} else {
									extension.collector.error(localize('ProblemPatternRegistry.error', 'Invalid problem pattern. The pattern will be ignored.'));
									extension.collector.error(JSON.stringify(pattern, undefined, 4));
								}
							}
							parser.reset();
						}
					});
				} catch (error) {
					// Do nothing
				}
				resolve(undefined);
			});
		});
	}

	public onReady(): Promise<void> {
		return this.readyPromise;
	}

	public add(key: string, value: Types.SingleOrMany<IProblemPattern>): void {
		this.patterns[key] = value;
	}

	public get(key: string): Types.SingleOrMany<IProblemPattern> {
		return this.patterns[key];
	}

	private fillDefaults(): void {
		this.add('msCompile', {
			regexp: /^\s*(?:\s*\d+>)?(\S.*?)(?:\((\d+|\d+,\d+|\d+,\d+,\d+,\d+)\))?\s*:\s+(?:(\S+)\s+)?((?:fatal +)?error|warning|info)\s+(\w+\d+)?\s*:\s*(.*)$/,
			kind: ProblemLocationKind.Location,
			file: 1,
			location: 2,
			severity: 4,
			code: 5,
			message: 6
		});
		this.add('gulp-tsc', {
			regexp: /^([^\s].*)\((\d+|\d+,\d+|\d+,\d+,\d+,\d+)\):\s+(\d+)\s+(.*)$/,
			kind: ProblemLocationKind.Location,
			file: 1,
			location: 2,
			code: 3,
			message: 4
		});
		this.add('cpp', {
			regexp: /^(\S.*)\((\d+|\d+,\d+|\d+,\d+,\d+,\d+)\):\s+(error|warning|info)\s+(C\d+)\s*:\s*(.*)$/,
			kind: ProblemLocationKind.Location,
			file: 1,
			location: 2,
			severity: 3,
			code: 4,
			message: 5
		});
		this.add('csc', {
			regexp: /^(\S.*)\((\d+|\d+,\d+|\d+,\d+,\d+,\d+)\):\s+(error|warning|info)\s+(CS\d+)\s*:\s*(.*)$/,
			kind: ProblemLocationKind.Location,
			file: 1,
			location: 2,
			severity: 3,
			code: 4,
			message: 5
		});
		this.add('vb', {
			regexp: /^(\S.*)\((\d+|\d+,\d+|\d+,\d+,\d+,\d+)\):\s+(error|warning|info)\s+(BC\d+)\s*:\s*(.*)$/,
			kind: ProblemLocationKind.Location,
			file: 1,
			location: 2,
			severity: 3,
			code: 4,
			message: 5
		});
		this.add('lessCompile', {
			regexp: /^\s*(.*) in file (.*) line no. (\d+)$/,
			kind: ProblemLocationKind.Location,
			message: 1,
			file: 2,
			line: 3
		});
		this.add('jshint', {
			regexp: /^(.*):\s+line\s+(\d+),\s+col\s+(\d+),\s(.+?)(?:\s+\((\w)(\d+)\))?$/,
			kind: ProblemLocationKind.Location,
			file: 1,
			line: 2,
			character: 3,
			message: 4,
			severity: 5,
			code: 6
		});
		this.add('jshint-stylish', [
			{
				regexp: /^(.+)$/,
				kind: ProblemLocationKind.Location,
				file: 1
			},
			{
				regexp: /^\s+line\s+(\d+)\s+col\s+(\d+)\s+(.+?)(?:\s+\((\w)(\d+)\))?$/,
				line: 1,
				character: 2,
				message: 3,
				severity: 4,
				code: 5,
				loop: true
			}
		]);
		this.add('eslint-compact', {
			regexp: /^(.+):\sline\s(\d+),\scol\s(\d+),\s(Error|Warning|Info)\s-\s(.+)\s\((.+)\)$/,
			file: 1,
			kind: ProblemLocationKind.Location,
			line: 2,
			character: 3,
			severity: 4,
			message: 5,
			code: 6
		});
		this.add('eslint-stylish', [
			{
				regexp: /^((?:[a-zA-Z]:)*[./\\]+.*?)$/,
				kind: ProblemLocationKind.Location,
				file: 1
			},
			{
				regexp: /^\s+(\d+):(\d+)\s+(error|warning|info)\s+(.+?)(?:\s\s+(.*))?$/,
				line: 1,
				character: 2,
				severity: 3,
				message: 4,
				code: 5,
				loop: true
			}
		]);
		this.add('go', {
			regexp: /^([^:]*: )?((.:)?[^:]*):(\d+)(:(\d+))?: (.*)$/,
			kind: ProblemLocationKind.Location,
			file: 2,
			line: 4,
			character: 6,
			message: 7
		});
	}
}

export const ProblemPatternRegistry: IProblemPatternRegistry = new ProblemPatternRegistryImpl();

export class ProblemMatcherParser extends Parser {

	constructor(logger: IProblemReporter) {
		super(logger);
	}

	public parse(json: Config.ProblemMatcher): ProblemMatcher | undefined {
		const result = this.createProblemMatcher(json);
		if (!this.checkProblemMatcherValid(json, result)) {
			return undefined;
		}
		this.addWatchingMatcher(json, result);

		return result;
	}

	private checkProblemMatcherValid(externalProblemMatcher: Config.ProblemMatcher, problemMatcher: ProblemMatcher | null): problemMatcher is ProblemMatcher {
		if (!problemMatcher) {
			this.error(localize('ProblemMatcherParser.noProblemMatcher', 'Error: the description can\'t be converted into a problem matcher:\n{0}\n', JSON.stringify(externalProblemMatcher, null, 4)));
			return false;
		}
		if (!problemMatcher.pattern) {
			this.error(localize('ProblemMatcherParser.noProblemPattern', 'Error: the description doesn\'t define a valid problem pattern:\n{0}\n', JSON.stringify(externalProblemMatcher, null, 4)));
			return false;
		}
		if (!problemMatcher.owner) {
			this.error(localize('ProblemMatcherParser.noOwner', 'Error: the description doesn\'t define an owner:\n{0}\n', JSON.stringify(externalProblemMatcher, null, 4)));
			return false;
		}
		if (Types.isUndefined(problemMatcher.fileLocation)) {
			this.error(localize('ProblemMatcherParser.noFileLocation', 'Error: the description doesn\'t define a file location:\n{0}\n', JSON.stringify(externalProblemMatcher, null, 4)));
			return false;
		}
		return true;
	}

	private createProblemMatcher(description: Config.ProblemMatcher): ProblemMatcher | null {
		let result: ProblemMatcher | null = null;

		const owner = Types.isString(description.owner) ? description.owner : UUID.generateUuid();
		const source = Types.isString(description.source) ? description.source : undefined;
		let applyTo = Types.isString(description.applyTo) ? ApplyToKind.fromString(description.applyTo) : ApplyToKind.allDocuments;
		if (!applyTo) {
			applyTo = ApplyToKind.allDocuments;
		}
		let fileLocation: FileLocationKind | undefined = undefined;
		let filePrefix: string | Config.SearchFileLocationArgs | undefined = undefined;

		let kind: FileLocationKind | undefined;
		if (Types.isUndefined(description.fileLocation)) {
			fileLocation = FileLocationKind.Relative;
			filePrefix = '${workspaceFolder}';
		} else if (Types.isString(description.fileLocation)) {
			kind = FileLocationKind.fromString(<string>description.fileLocation);
			if (kind) {
				fileLocation = kind;
				if ((kind === FileLocationKind.Relative) || (kind === FileLocationKind.AutoDetect)) {
					filePrefix = '${workspaceFolder}';
				} else if (kind === FileLocationKind.Search) {
					filePrefix = { include: ['${workspaceFolder}'] };
				}
			}
		} else if (Types.isStringArray(description.fileLocation)) {
			const values = <string[]>description.fileLocation;
			if (values.length > 0) {
				kind = FileLocationKind.fromString(values[0]);
				if (values.length === 1 && kind === FileLocationKind.Absolute) {
					fileLocation = kind;
				} else if (values.length === 2 && (kind === FileLocationKind.Relative || kind === FileLocationKind.AutoDetect) && values[1]) {
					fileLocation = kind;
					filePrefix = values[1];
				}
			}
		} else if (Array.isArray(description.fileLocation)) {
			const kind = FileLocationKind.fromString(description.fileLocation[0]);
			if (kind === FileLocationKind.Search) {
				fileLocation = FileLocationKind.Search;
				filePrefix = description.fileLocation[1] ?? { include: ['${workspaceFolder}'] };
			}
		}

		const pattern = description.pattern ? this.createProblemPattern(description.pattern) : undefined;

		let severity = description.severity ? Severity.fromValue(description.severity) : undefined;
		if (severity === Severity.Ignore) {
			this.info(localize('ProblemMatcherParser.unknownSeverity', 'Info: unknown severity {0}. Valid values are error, warning and info.\n', description.severity));
			severity = Severity.Error;
		}

		if (Types.isString(description.base)) {
			const variableName = <string>description.base;
			if (variableName.length > 1 && variableName[0] === '$') {
				const base = ProblemMatcherRegistry.get(variableName.substring(1));
				if (base) {
					result = Objects.deepClone(base);
					if (description.owner !== undefined && owner !== undefined) {
						result.owner = owner;
					}
					if (description.source !== undefined && source !== undefined) {
						result.source = source;
					}
					if (description.fileLocation !== undefined && fileLocation !== undefined) {
						result.fileLocation = fileLocation;
						result.filePrefix = filePrefix;
					}
					if (description.pattern !== undefined && pattern !== undefined && pattern !== null) {
						result.pattern = pattern;
					}
					if (description.severity !== undefined && severity !== undefined) {
						result.severity = severity;
					}
					if (description.applyTo !== undefined && applyTo !== undefined) {
						result.applyTo = applyTo;
					}
				}
			}
		} else if (fileLocation && pattern) {
			result = {
				owner: owner,
				applyTo: applyTo,
				fileLocation: fileLocation,
				pattern: pattern,
			};
			if (source) {
				result.source = source;
			}
			if (filePrefix) {
				result.filePrefix = filePrefix;
			}
			if (severity) {
				result.severity = severity;
			}
		}
		if (Config.isNamedProblemMatcher(description)) {
			(result as INamedProblemMatcher).name = description.name;
			(result as INamedProblemMatcher).label = Types.isString(description.label) ? description.label : description.name;
		}
		return result;
	}

	private createProblemPattern(value: string | Config.IProblemPattern | Config.MultiLineProblemPattern): Types.SingleOrMany<IProblemPattern> | null {
		if (Types.isString(value)) {
			const variableName: string = <string>value;
			if (variableName.length > 1 && variableName[0] === '$') {
				const result = ProblemPatternRegistry.get(variableName.substring(1));
				if (!result) {
					this.error(localize('ProblemMatcherParser.noDefinedPatter', 'Error: the pattern with the identifier {0} doesn\'t exist.', variableName));
				}
				return result;
			} else {
				if (variableName.length === 0) {
					this.error(localize('ProblemMatcherParser.noIdentifier', 'Error: the pattern property refers to an empty identifier.'));
				} else {
					this.error(localize('ProblemMatcherParser.noValidIdentifier', 'Error: the pattern property {0} is not a valid pattern variable name.', variableName));
				}
			}
		} else if (value) {
			const problemPatternParser = new ProblemPatternParser(this.problemReporter);
			if (Array.isArray(value)) {
				return problemPatternParser.parse(value);
			} else {
				return problemPatternParser.parse(value);
			}
		}
		return null;
	}

	private addWatchingMatcher(external: Config.ProblemMatcher, internal: ProblemMatcher): void {
		const oldBegins = this.createRegularExpression(external.watchedTaskBeginsRegExp);
		const oldEnds = this.createRegularExpression(external.watchedTaskEndsRegExp);
		if (oldBegins && oldEnds) {
			internal.watching = {
				activeOnStart: false,
				beginsPattern: { regexp: oldBegins },
				endsPattern: { regexp: oldEnds }
			};
			return;
		}
		const backgroundMonitor = external.background || external.watching;
		if (Types.isUndefinedOrNull(backgroundMonitor)) {
			return;
		}
		const begins: IWatchingPattern | null = this.createWatchingPattern(backgroundMonitor.beginsPattern);
		const ends: IWatchingPattern | null = this.createWatchingPattern(backgroundMonitor.endsPattern);
		if (begins && ends) {
			internal.watching = {
				activeOnStart: Types.isBoolean(backgroundMonitor.activeOnStart) ? backgroundMonitor.activeOnStart : false,
				beginsPattern: begins,
				endsPattern: ends
			};
			return;
		}
		if (begins || ends) {
			this.error(localize('ProblemMatcherParser.problemPattern.watchingMatcher', 'A problem matcher must define both a begin pattern and an end pattern for watching.'));
		}
	}

	private createWatchingPattern(external: string | Config.IWatchingPattern | undefined): IWatchingPattern | null {
		if (Types.isUndefinedOrNull(external)) {
			return null;
		}
		let regexp: RegExp | null;
		let file: number | undefined;
		if (Types.isString(external)) {
			regexp = this.createRegularExpression(external);
		} else {
			regexp = this.createRegularExpression(external.regexp);
			if (Types.isNumber(external.file)) {
				file = external.file;
			}
		}
		if (!regexp) {
			return null;
		}
		return file ? { regexp, file } : { regexp, file: 1 };
	}

	private createRegularExpression(value: string | undefined): RegExp | null {
		let result: RegExp | null = null;
		if (!value) {
			return result;
		}
		try {
			result = new RegExp(value);
		} catch (err) {
			this.error(localize('ProblemMatcherParser.invalidRegexp', 'Error: The string {0} is not a valid regular expression.\n', value));
		}
		return result;
	}
}

const problemMatchersExtPoint = ExtensionsRegistry.registerExtensionPoint<Config.INamedProblemMatcher[]>({
	extensionPoint: 'problemMatchers',
	deps: [problemPatternExtPoint],
	jsonSchema: {
		description: localize('ProblemMatcherExtPoint', 'Contributes problem matchers'),
		type: 'array',
		items: Schemas.NamedProblemMatcher
	}
});

export interface IProblemMatcherRegistry {
	onReady(): Promise<void>;
	get(name: string): INamedProblemMatcher;
	keys(): string[];
	readonly onMatcherChanged: Event<void>;
}

class ProblemMatcherRegistryImpl implements IProblemMatcherRegistry {

	private matchers: IStringDictionary<INamedProblemMatcher>;
	private readyPromise: Promise<void>;
	private readonly _onMatchersChanged: Emitter<void> = new Emitter<void>();
	public readonly onMatcherChanged: Event<void> = this._onMatchersChanged.event;


	constructor() {
		this.matchers = Object.create(null);
		this.fillDefaults();
		this.readyPromise = new Promise<void>((resolve, reject) => {
			problemMatchersExtPoint.setHandler((extensions, delta) => {
				try {
					delta.removed.forEach(extension => {
						const problemMatchers = extension.value;
						for (const matcher of problemMatchers) {
							if (this.matchers[matcher.name]) {
								delete this.matchers[matcher.name];
							}
						}
					});
					delta.added.forEach(extension => {
						const problemMatchers = extension.value;
						const parser = new ProblemMatcherParser(new ExtensionRegistryReporter(extension.collector));
						for (const matcher of problemMatchers) {
							const result = parser.parse(matcher);
							if (result && isNamedProblemMatcher(result)) {
								this.add(result);
							}
						}
					});
					if ((delta.removed.length > 0) || (delta.added.length > 0)) {
						this._onMatchersChanged.fire();
					}
				} catch (error) {
				}
				const matcher = this.get('tsc-watch');
				if (matcher) {
					// eslint-disable-next-line local/code-no-any-casts
					(<any>matcher).tscWatch = true;
				}
				resolve(undefined);
			});
		});
	}

	public onReady(): Promise<void> {
		ProblemPatternRegistry.onReady();
		return this.readyPromise;
	}

	public add(matcher: INamedProblemMatcher): void {
		this.matchers[matcher.name] = matcher;
	}

	public get(name: string): INamedProblemMatcher {
		return this.matchers[name];
	}

	public keys(): string[] {
		return Object.keys(this.matchers);
	}

	private fillDefaults(): void {
		this.add({
			name: 'msCompile',
			label: localize('msCompile', 'Microsoft compiler problems'),
			owner: 'msCompile',
			source: 'cpp',
			applyTo: ApplyToKind.allDocuments,
			fileLocation: FileLocationKind.Absolute,
			pattern: ProblemPatternRegistry.get('msCompile')
		});

		this.add({
			name: 'lessCompile',
			label: localize('lessCompile', 'Less problems'),
			deprecated: true,
			owner: 'lessCompile',
			source: 'less',
			applyTo: ApplyToKind.allDocuments,
			fileLocation: FileLocationKind.Absolute,
			pattern: ProblemPatternRegistry.get('lessCompile'),
			severity: Severity.Error
		});

		this.add({
			name: 'gulp-tsc',
			label: localize('gulp-tsc', 'Gulp TSC Problems'),
			owner: 'typescript',
			source: 'ts',
			applyTo: ApplyToKind.closedDocuments,
			fileLocation: FileLocationKind.Relative,
			filePrefix: '${workspaceFolder}',
			pattern: ProblemPatternRegistry.get('gulp-tsc')
		});

		this.add({
			name: 'jshint',
			label: localize('jshint', 'JSHint problems'),
			owner: 'jshint',
			source: 'jshint',
			applyTo: ApplyToKind.allDocuments,
			fileLocation: FileLocationKind.Absolute,
			pattern: ProblemPatternRegistry.get('jshint')
		});

		this.add({
			name: 'jshint-stylish',
			label: localize('jshint-stylish', 'JSHint stylish problems'),
			owner: 'jshint',
			source: 'jshint',
			applyTo: ApplyToKind.allDocuments,
			fileLocation: FileLocationKind.Absolute,
			pattern: ProblemPatternRegistry.get('jshint-stylish')
		});

		this.add({
			name: 'eslint-compact',
			label: localize('eslint-compact', 'ESLint compact problems'),
			owner: 'eslint',
			source: 'eslint',
			applyTo: ApplyToKind.allDocuments,
			fileLocation: FileLocationKind.Absolute,
			filePrefix: '${workspaceFolder}',
			pattern: ProblemPatternRegistry.get('eslint-compact')
		});

		this.add({
			name: 'eslint-stylish',
			label: localize('eslint-stylish', 'ESLint stylish problems'),
			owner: 'eslint',
			source: 'eslint',
			applyTo: ApplyToKind.allDocuments,
			fileLocation: FileLocationKind.Absolute,
			pattern: ProblemPatternRegistry.get('eslint-stylish')
		});

		this.add({
			name: 'go',
			label: localize('go', 'Go problems'),
			owner: 'go',
			source: 'go',
			applyTo: ApplyToKind.allDocuments,
			fileLocation: FileLocationKind.Relative,
			filePrefix: '${workspaceFolder}',
			pattern: ProblemPatternRegistry.get('go')
		});
	}
}

export const ProblemMatcherRegistry: IProblemMatcherRegistry = new ProblemMatcherRegistryImpl();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tasks/common/taskConfiguration.ts]---
Location: vscode-main/src/vs/workbench/contrib/tasks/common/taskConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';

import * as Objects from '../../../../base/common/objects.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { IJSONSchemaMap } from '../../../../base/common/jsonSchema.js';
import { Platform } from '../../../../base/common/platform.js';
import * as Types from '../../../../base/common/types.js';
import * as UUID from '../../../../base/common/uuid.js';

import { ValidationStatus, IProblemReporter as IProblemReporterBase } from '../../../../base/common/parsers.js';
import {
	INamedProblemMatcher, ProblemMatcherParser, Config as ProblemMatcherConfig,
	isNamedProblemMatcher, ProblemMatcherRegistry, ProblemMatcher
} from './problemMatcher.js';

import { IWorkspaceFolder, IWorkspace } from '../../../../platform/workspace/common/workspace.js';
import * as Tasks from './tasks.js';
import { ITaskDefinitionRegistry, TaskDefinitionRegistry } from './taskDefinitionRegistry.js';
import { ConfiguredInput } from '../../../services/configurationResolver/common/configurationResolver.js';
import { URI } from '../../../../base/common/uri.js';
import { ShellExecutionSupportedContext, ProcessExecutionSupportedContext } from './taskService.js';
import { IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';

export const enum ShellQuoting {
	/**
	 * Default is character escaping.
	 */
	escape = 1,

	/**
	 * Default is strong quoting
	 */
	strong = 2,

	/**
	 * Default is weak quoting.
	 */
	weak = 3
}

export interface IShellQuotingOptions {
	/**
	 * The character used to do character escaping.
	 */
	escape?: string | {
		escapeChar: string;
		charsToEscape: string;
	};

	/**
	 * The character used for string quoting.
	 */
	strong?: string;

	/**
	 * The character used for weak quoting.
	 */
	weak?: string;
}

export interface IShellConfiguration {
	executable?: string;
	args?: string[];
	quoting?: IShellQuotingOptions;
}

export interface ICommandOptionsConfig {
	/**
	 * The current working directory of the executed program or shell.
	 * If omitted VSCode's current workspace root is used.
	 */
	cwd?: string;

	/**
	 * The additional environment of the executed program or shell. If omitted
	 * the parent process' environment is used.
	 */
	env?: IStringDictionary<string>;

	/**
	 * The shell configuration;
	 */
	shell?: IShellConfiguration;
}

export interface IPresentationOptionsConfig {
	/**
	 * Controls whether the terminal executing a task is brought to front or not.
	 * Defaults to `RevealKind.Always`.
	 */
	reveal?: string;

	/**
	 * Controls whether the problems panel is revealed when running this task or not.
	 * Defaults to `RevealKind.Never`.
	 */
	revealProblems?: string;

	/**
	 * Controls whether the executed command is printed to the output window or terminal as well.
	 */
	echo?: boolean;

	/**
	 * Controls whether the terminal is focus when this task is executed
	 */
	focus?: boolean;

	/**
	 * Controls whether the task runs in a new terminal
	 */
	panel?: string;

	/**
	 * Controls whether to show the "Terminal will be reused by tasks, press any key to close it" message.
	 */
	showReuseMessage?: boolean;

	/**
	 * Controls whether the terminal should be cleared before running the task.
	 */
	clear?: boolean;

	/**
	 * Controls whether the task is executed in a specific terminal group using split panes.
	 */
	group?: string;

	/**
	 * Controls whether the terminal that the task runs in is closed when the task completes.
	 * Note that if the terminal process exits with a non-zero exit code, it will not close.
	 */
	close?: boolean;

	/**
	 * Controls whether to preserve the task name in the terminal after task completion.
	 */
	preserveTerminalName?: boolean;
}

export interface IRunOptionsConfig {
	reevaluateOnRerun?: boolean;
	runOn?: string;
	instanceLimit?: number;
	instancePolicy?: Tasks.InstancePolicy;
}

export interface ITaskIdentifier {
	type?: string;
	[name: string]: any;
}

export namespace ITaskIdentifier {
	export function is(value: any): value is ITaskIdentifier {
		const candidate: ITaskIdentifier = value;
		return candidate !== undefined && Types.isString(value.type);
	}
}

export interface ILegacyTaskProperties {
	/**
	 * @deprecated Use `isBackground` instead.
	 * Whether the executed command is kept alive and is watching the file system.
	 */
	isWatching?: boolean;

	/**
	 * @deprecated Use `group` instead.
	 * Whether this task maps to the default build command.
	 */
	isBuildCommand?: boolean;

	/**
	 * @deprecated Use `group` instead.
	 * Whether this task maps to the default test command.
	 */
	isTestCommand?: boolean;
}

export interface ILegacyCommandProperties {

	/**
	 * Whether this is a shell or process
	 */
	type?: string;

	/**
	 * @deprecated Use presentation options
	 * Controls whether the output view of the running tasks is brought to front or not.
	 * See BaseTaskRunnerConfiguration#showOutput for details.
	 */
	showOutput?: string;

	/**
	 * @deprecated Use presentation options
	 * Controls whether the executed command is printed to the output windows as well.
	 */
	echoCommand?: boolean;

	/**
	 * @deprecated Use presentation instead
	 */
	terminal?: IPresentationOptionsConfig;

	/**
	 * @deprecated Use inline commands.
	 * See BaseTaskRunnerConfiguration#suppressTaskName for details.
	 */
	suppressTaskName?: boolean;

	/**
	 * Some commands require that the task argument is highlighted with a special
	 * prefix (e.g. /t: for msbuild). This property can be used to control such
	 * a prefix.
	 */
	taskSelector?: string;

	/**
	 * @deprecated use the task type instead.
	 * Specifies whether the command is a shell command and therefore must
	 * be executed in a shell interpreter (e.g. cmd.exe, bash, ...).
	 *
	 * Defaults to false if omitted.
	 */
	isShellCommand?: boolean | IShellConfiguration;
}

export type CommandString = Types.SingleOrMany<string> | { value: Types.SingleOrMany<string>; quoting: 'escape' | 'strong' | 'weak' };

export namespace CommandString {
	export function value(value: CommandString): string {
		if (Types.isString(value)) {
			return value;
		} else if (Types.isStringArray(value)) {
			return value.join(' ');
		} else {
			if (Types.isString(value.value)) {
				return value.value;
			} else {
				return value.value.join(' ');
			}
		}
	}
}

export interface IBaseCommandProperties {

	/**
	 * The command to be executed. Can be an external program or a shell
	 * command.
	 */
	command?: CommandString;

	/**
	 * The command options used when the command is executed. Can be omitted.
	 */
	options?: ICommandOptionsConfig;

	/**
	 * The arguments passed to the command or additional arguments passed to the
	 * command when using a global command.
	 */
	args?: CommandString[];
}


export interface ICommandProperties extends IBaseCommandProperties {

	/**
	 * Windows specific command properties
	 */
	windows?: IBaseCommandProperties;

	/**
	 * OSX specific command properties
	 */
	osx?: IBaseCommandProperties;

	/**
	 * linux specific command properties
	 */
	linux?: IBaseCommandProperties;
}

export interface IGroupKind {
	kind?: string;
	isDefault?: boolean | string;
}

export interface IConfigurationProperties {
	/**
	 * The task's name
	 */
	taskName?: string;

	/**
	 * The UI label used for the task.
	 */
	label?: string;

	/**
	 * An optional identifier which can be used to reference a task
	 * in a dependsOn or other attributes.
	 */
	identifier?: string;

	/**
	 * Whether the executed command is kept alive and runs in the background.
	 */
	isBackground?: boolean;

	/**
	 * Whether the task should prompt on close for confirmation if running.
	 */
	promptOnClose?: boolean;

	/**
	 * Defines the group the task belongs too.
	 */
	group?: string | IGroupKind;

	/**
	 * A description of the task.
	 */
	detail?: string;

	/**
	 * The other tasks the task depend on
	 */
	dependsOn?: string | ITaskIdentifier | Array<string | ITaskIdentifier>;

	/**
	 * The order the dependsOn tasks should be executed in.
	 */
	dependsOrder?: string;

	/**
	 * Controls the behavior of the used terminal
	 */
	presentation?: IPresentationOptionsConfig;

	/**
	 * Controls shell options.
	 */
	options?: ICommandOptionsConfig;

	/**
	 * The problem matcher(s) to use to capture problems in the tasks
	 * output.
	 */
	problemMatcher?: ProblemMatcherConfig.ProblemMatcherType;

	/**
	 * Task run options. Control run related properties.
	 */
	runOptions?: IRunOptionsConfig;

	/**
	 * The icon for this task in the terminal tabs list
	 */
	icon?: { id: string; color?: string };

	/**
	 * The icon's color in the terminal tabs list
	 */
	color?: string;

	/**
	 * Do not show this task in the run task quickpick
	 */
	hide?: boolean;
}

export interface ICustomTask extends ICommandProperties, IConfigurationProperties {
	/**
	 * Custom tasks have the type CUSTOMIZED_TASK_TYPE
	 */
	type?: string;

}

export interface IConfiguringTask extends IConfigurationProperties {
	/**
	 * The contributed type of the task
	 */
	type?: string;
}

/**
 * The base task runner configuration
 */
export interface IBaseTaskRunnerConfiguration {

	/**
	 * The command to be executed. Can be an external program or a shell
	 * command.
	 */
	command?: CommandString;

	/**
	 * @deprecated Use type instead
	 *
	 * Specifies whether the command is a shell command and therefore must
	 * be executed in a shell interpreter (e.g. cmd.exe, bash, ...).
	 *
	 * Defaults to false if omitted.
	 */
	isShellCommand?: boolean;

	/**
	 * The task type
	 */
	type?: string;

	/**
	 * The command options used when the command is executed. Can be omitted.
	 */
	options?: ICommandOptionsConfig;

	/**
	 * The arguments passed to the command. Can be omitted.
	 */
	args?: CommandString[];

	/**
	 * Controls whether the output view of the running tasks is brought to front or not.
	 * Valid values are:
	 *   "always": bring the output window always to front when a task is executed.
	 *   "silent": only bring it to front if no problem matcher is defined for the task executed.
	 *   "never": never bring the output window to front.
	 *
	 * If omitted "always" is used.
	 */
	showOutput?: string;

	/**
	 * Controls whether the executed command is printed to the output windows as well.
	 */
	echoCommand?: boolean;

	/**
	 * The group
	 */
	group?: string | IGroupKind;

	/**
	 * Controls the behavior of the used terminal
	 */
	presentation?: IPresentationOptionsConfig;

	/**
	 * If set to false the task name is added as an additional argument to the
	 * command when executed. If set to true the task name is suppressed. If
	 * omitted false is used.
	 */
	suppressTaskName?: boolean;

	/**
	 * Some commands require that the task argument is highlighted with a special
	 * prefix (e.g. /t: for msbuild). This property can be used to control such
	 * a prefix.
	 */
	taskSelector?: string;

	/**
	 * The problem matcher(s) to used if a global command is executed (e.g. no tasks
	 * are defined). A tasks.json file can either contain a global problemMatcher
	 * property or a tasks property but not both.
	 */
	problemMatcher?: ProblemMatcherConfig.ProblemMatcherType;

	/**
	 * @deprecated Use `isBackground` instead.
	 *
	 * Specifies whether a global command is a watching the filesystem. A task.json
	 * file can either contain a global isWatching property or a tasks property
	 * but not both.
	 */
	isWatching?: boolean;

	/**
	 * Specifies whether a global command is a background task.
	 */
	isBackground?: boolean;

	/**
	 * Whether the task should prompt on close for confirmation if running.
	 */
	promptOnClose?: boolean;

	/**
	 * The configuration of the available tasks. A tasks.json file can either
	 * contain a global problemMatcher property or a tasks property but not both.
	 */
	tasks?: Array<ICustomTask | IConfiguringTask>;

	/**
	 * Problem matcher declarations.
	 */
	declares?: ProblemMatcherConfig.INamedProblemMatcher[];

	/**
	 * Optional user input variables.
	 */
	inputs?: ConfiguredInput[];
}

/**
 * A configuration of an external build system. BuildConfiguration.buildSystem
 * must be set to 'program'
 */
export interface IExternalTaskRunnerConfiguration extends IBaseTaskRunnerConfiguration {

	_runner?: string;

	/**
	 * Determines the runner to use
	 */
	runner?: string;

	/**
	 * The config's version number
	 */
	version: string;

	/**
	 * Windows specific task configuration
	 */
	windows?: IBaseTaskRunnerConfiguration;

	/**
	 * Mac specific task configuration
	 */
	osx?: IBaseTaskRunnerConfiguration;

	/**
	 * Linux specific task configuration
	 */
	linux?: IBaseTaskRunnerConfiguration;
}

enum ProblemMatcherKind {
	Unknown,
	String,
	ProblemMatcher,
	Array
}

type TaskConfigurationValueWithErrors<T> = {
	value?: T;
	errors?: string[];
};

const EMPTY_ARRAY: any[] = [];
Object.freeze(EMPTY_ARRAY);

function assignProperty<T, K extends keyof T>(target: T, source: Partial<T>, key: K) {
	const sourceAtKey = source[key];
	if (sourceAtKey !== undefined) {
		target[key] = sourceAtKey!;
	}
}

function fillProperty<T, K extends keyof T>(target: T, source: Partial<T>, key: K) {
	const sourceAtKey = source[key];
	if (target[key] === undefined && sourceAtKey !== undefined) {
		target[key] = sourceAtKey!;
	}
}


interface IParserType<T> {
	isEmpty(value: T | undefined): boolean;
	assignProperties(target: T | undefined, source: T | undefined): T | undefined;
	fillProperties(target: T | undefined, source: T | undefined): T | undefined;
	fillDefaults(value: T | undefined, context: IParseContext): T | undefined;
	freeze(value: T): Readonly<T> | undefined;
}

interface IMetaData<T, U> {
	property: keyof T;
	type?: IParserType<U>;
}


function _isEmpty<T>(this: void, value: T | undefined, properties: IMetaData<T, any>[] | undefined, allowEmptyArray: boolean = false): boolean {
	if (value === undefined || value === null || properties === undefined) {
		return true;
	}
	for (const meta of properties) {
		const property = value[meta.property];
		if (property !== undefined && property !== null) {
			if (meta.type !== undefined && !meta.type.isEmpty(property)) {
				return false;
			} else if (!Array.isArray(property) || (property.length > 0) || allowEmptyArray) {
				return false;
			}
		}
	}
	return true;
}

function _assignProperties<T>(this: void, target: T | undefined, source: T | undefined, properties: IMetaData<T, any>[]): T | undefined {
	if (!source || _isEmpty(source, properties)) {
		return target;
	}
	if (!target || _isEmpty(target, properties)) {
		return source;
	}
	for (const meta of properties) {
		const property = meta.property;
		let value: any;
		if (meta.type !== undefined) {
			value = meta.type.assignProperties(target[property], source[property]);
		} else {
			value = source[property];
		}
		if (value !== undefined && value !== null) {
			target[property] = value;
		}
	}
	return target;
}

function _fillProperties<T>(this: void, target: T | undefined, source: T | undefined, properties: IMetaData<T, any>[] | undefined, allowEmptyArray: boolean = false): T | undefined {
	if (!source || _isEmpty(source, properties)) {
		return target;
	}
	if (!target || _isEmpty(target, properties, allowEmptyArray)) {
		return source;
	}
	for (const meta of properties!) {
		const property = meta.property;
		let value: any;
		if (meta.type) {
			value = meta.type.fillProperties(target[property], source[property]);
		} else if (target[property] === undefined) {
			value = source[property];
		}
		if (value !== undefined && value !== null) {
			target[property] = value;
		}
	}
	return target;
}

function _fillDefaults<T>(this: void, target: T | undefined, defaults: T | undefined, properties: IMetaData<T, any>[], context: IParseContext): T | undefined {
	if (target && Object.isFrozen(target)) {
		return target;
	}
	if (target === undefined || target === null || defaults === undefined || defaults === null) {
		if (defaults !== undefined && defaults !== null) {
			return Objects.deepClone(defaults);
		} else {
			return undefined;
		}
	}
	for (const meta of properties) {
		const property = meta.property;
		if (target[property] !== undefined) {
			continue;
		}
		let value: any;
		if (meta.type) {
			value = meta.type.fillDefaults(target[property], context);
		} else {
			value = defaults[property];
		}

		if (value !== undefined && value !== null) {
			target[property] = value;
		}
	}
	return target;
}

function _freeze<T>(this: void, target: T, properties: IMetaData<T, any>[]): Readonly<T> | undefined {
	if (target === undefined || target === null) {
		return undefined;
	}
	if (Object.isFrozen(target)) {
		return target;
	}
	for (const meta of properties) {
		if (meta.type) {
			const value = target[meta.property];
			if (value) {
				meta.type.freeze(value);
			}
		}
	}
	Object.freeze(target);
	return target;
}

export namespace RunOnOptions {
	export function fromString(value: string | undefined): Tasks.RunOnOptions {
		if (!value) {
			return Tasks.RunOnOptions.default;
		}
		switch (value.toLowerCase()) {
			case 'folderopen':
				return Tasks.RunOnOptions.folderOpen;
			case 'default':
			default:
				return Tasks.RunOnOptions.default;
		}
	}
}

export namespace RunOptions {
	const properties: IMetaData<Tasks.IRunOptions, void>[] = [{ property: 'reevaluateOnRerun' }, { property: 'runOn' }, { property: 'instanceLimit' }, { property: 'instancePolicy' }];
	export function fromConfiguration(value: IRunOptionsConfig | undefined): Tasks.IRunOptions {
		return {
			reevaluateOnRerun: value ? value.reevaluateOnRerun : true,
			runOn: value ? RunOnOptions.fromString(value.runOn) : Tasks.RunOnOptions.default,
			instanceLimit: value?.instanceLimit ? Math.max(value.instanceLimit, 1) : 1,
			instancePolicy: value ? InstancePolicy.fromString(value.instancePolicy) : Tasks.InstancePolicy.prompt
		};
	}

	export function assignProperties(target: Tasks.IRunOptions, source: Tasks.IRunOptions | undefined): Tasks.IRunOptions {
		return _assignProperties(target, source, properties)!;
	}

	export function fillProperties(target: Tasks.IRunOptions, source: Tasks.IRunOptions | undefined): Tasks.IRunOptions {
		return _fillProperties(target, source, properties)!;
	}
}

export namespace InstancePolicy {
	export function fromString(value: string | undefined): Tasks.InstancePolicy {
		if (!value) {
			return Tasks.InstancePolicy.prompt;
		}
		switch (value.toLowerCase()) {
			case 'terminatenewest':
				return Tasks.InstancePolicy.terminateNewest;
			case 'terminateoldest':
				return Tasks.InstancePolicy.terminateOldest;
			case 'warn':
				return Tasks.InstancePolicy.warn;
			case 'silent':
				return Tasks.InstancePolicy.silent;
			case 'prompt':
			default:
				return Tasks.InstancePolicy.prompt;
		}
	}
}

export interface IParseContext {
	workspaceFolder: IWorkspaceFolder;
	workspace: IWorkspace | undefined;
	problemReporter: IProblemReporter;
	namedProblemMatchers: IStringDictionary<INamedProblemMatcher>;
	uuidMap: UUIDMap;
	engine: Tasks.ExecutionEngine;
	schemaVersion: Tasks.JsonSchemaVersion;
	platform: Platform;
	taskLoadIssues: string[];
	contextKeyService: IContextKeyService;
}


namespace ShellConfiguration {

	const properties: IMetaData<Tasks.IShellConfiguration, void>[] = [{ property: 'executable' }, { property: 'args' }, { property: 'quoting' }];

	export function is(value: any): value is IShellConfiguration {
		const candidate: IShellConfiguration = value;
		return candidate && (Types.isString(candidate.executable) || Types.isStringArray(candidate.args));
	}

	export function from(this: void, config: IShellConfiguration | undefined, context: IParseContext): Tasks.IShellConfiguration | undefined {
		if (!is(config)) {
			return undefined;
		}
		const result: IShellConfiguration = {};
		if (config.executable !== undefined) {
			result.executable = config.executable;
		}
		if (config.args !== undefined) {
			result.args = config.args.slice();
		}
		if (config.quoting !== undefined) {
			result.quoting = Objects.deepClone(config.quoting);
		}

		return result;
	}

	export function isEmpty(this: void, value: Tasks.IShellConfiguration): boolean {
		return _isEmpty(value, properties, true);
	}

	export function assignProperties(this: void, target: Tasks.IShellConfiguration | undefined, source: Tasks.IShellConfiguration | undefined): Tasks.IShellConfiguration | undefined {
		return _assignProperties(target, source, properties);
	}

	export function fillProperties(this: void, target: Tasks.IShellConfiguration, source: Tasks.IShellConfiguration): Tasks.IShellConfiguration | undefined {
		return _fillProperties(target, source, properties, true);
	}

	export function fillDefaults(this: void, value: Tasks.IShellConfiguration, context: IParseContext): Tasks.IShellConfiguration {
		return value;
	}

	export function freeze(this: void, value: Tasks.IShellConfiguration): Readonly<Tasks.IShellConfiguration> | undefined {
		if (!value) {
			return undefined;
		}
		return Object.freeze(value);
	}
}

namespace CommandOptions {

	const properties: IMetaData<Tasks.CommandOptions, Tasks.IShellConfiguration>[] = [{ property: 'cwd' }, { property: 'env' }, { property: 'shell', type: ShellConfiguration }];
	const defaults: ICommandOptionsConfig = { cwd: '${workspaceFolder}' };

	export function from(this: void, options: ICommandOptionsConfig, context: IParseContext): Tasks.CommandOptions | undefined {
		const result: Tasks.CommandOptions = {};
		if (options.cwd !== undefined) {
			if (Types.isString(options.cwd)) {
				result.cwd = options.cwd;
			} else {
				context.taskLoadIssues.push(nls.localize('ConfigurationParser.invalidCWD', 'Warning: options.cwd must be of type string. Ignoring value {0}\n', options.cwd));
			}
		}
		if (options.env !== undefined) {
			result.env = Objects.deepClone(options.env);
		}
		result.shell = ShellConfiguration.from(options.shell, context);
		return isEmpty(result) ? undefined : result;
	}

	export function isEmpty(value: Tasks.CommandOptions | undefined): boolean {
		return _isEmpty(value, properties);
	}

	export function assignProperties(target: Tasks.CommandOptions | undefined, source: Tasks.CommandOptions | undefined): Tasks.CommandOptions | undefined {
		if ((source === undefined) || isEmpty(source)) {
			return target;
		}
		if ((target === undefined) || isEmpty(target)) {
			return source;
		}
		assignProperty(target, source, 'cwd');
		if (target.env === undefined) {
			target.env = source.env;
		} else if (source.env !== undefined) {
			const env: { [key: string]: string } = Object.create(null);
			if (target.env !== undefined) {
				Object.keys(target.env).forEach(key => env[key] = target.env![key]);
			}
			if (source.env !== undefined) {
				Object.keys(source.env).forEach(key => env[key] = source.env![key]);
			}
			target.env = env;
		}
		target.shell = ShellConfiguration.assignProperties(target.shell, source.shell);
		return target;
	}

	export function fillProperties(target: Tasks.CommandOptions | undefined, source: Tasks.CommandOptions | undefined): Tasks.CommandOptions | undefined {
		return _fillProperties(target, source, properties);
	}

	export function fillDefaults(value: Tasks.CommandOptions | undefined, context: IParseContext): Tasks.CommandOptions | undefined {
		return _fillDefaults(value, defaults, properties, context);
	}

	export function freeze(value: Tasks.CommandOptions): Readonly<Tasks.CommandOptions> | undefined {
		return _freeze(value, properties);
	}
}

namespace CommandConfiguration {

	export namespace PresentationOptions {
		const properties: IMetaData<Tasks.IPresentationOptions, void>[] = [{ property: 'echo' }, { property: 'reveal' }, { property: 'revealProblems' }, { property: 'focus' }, { property: 'panel' }, { property: 'showReuseMessage' }, { property: 'clear' }, { property: 'group' }, { property: 'close' }, { property: 'preserveTerminalName' }];

		interface IPresentationOptionsShape extends ILegacyCommandProperties {
			presentation?: IPresentationOptionsConfig;
		}

		export function from(this: void, config: IPresentationOptionsShape, context: IParseContext): Tasks.IPresentationOptions | undefined {
			let echo: boolean;
			let reveal: Tasks.RevealKind;
			let revealProblems: Tasks.RevealProblemKind;
			let focus: boolean;
			let panel: Tasks.PanelKind;
			let showReuseMessage: boolean;
			let clear: boolean;
			let group: string | undefined;
			let close: boolean | undefined;
			let preserveTerminalName: boolean | undefined;
			let hasProps = false;
			if (Types.isBoolean(config.echoCommand)) {
				echo = config.echoCommand;
				hasProps = true;
			}
			if (Types.isString(config.showOutput)) {
				reveal = Tasks.RevealKind.fromString(config.showOutput);
				hasProps = true;
			}
			const presentation = config.presentation || config.terminal;
			if (presentation) {
				if (Types.isBoolean(presentation.echo)) {
					echo = presentation.echo;
				}
				if (Types.isString(presentation.reveal)) {
					reveal = Tasks.RevealKind.fromString(presentation.reveal);
				}
				if (Types.isString(presentation.revealProblems)) {
					revealProblems = Tasks.RevealProblemKind.fromString(presentation.revealProblems);
				}
				if (Types.isBoolean(presentation.focus)) {
					focus = presentation.focus;
				}
				if (Types.isString(presentation.panel)) {
					panel = Tasks.PanelKind.fromString(presentation.panel);
				}
				if (Types.isBoolean(presentation.showReuseMessage)) {
					showReuseMessage = presentation.showReuseMessage;
				}
				if (Types.isBoolean(presentation.clear)) {
					clear = presentation.clear;
				}
				if (Types.isString(presentation.group)) {
					group = presentation.group;
				}
				if (Types.isBoolean(presentation.close)) {
					close = presentation.close;
				}
				if (Types.isBoolean(presentation.preserveTerminalName)) {
					preserveTerminalName = presentation.preserveTerminalName;
				}
				hasProps = true;
			}
			if (!hasProps) {
				return undefined;
			}
			return { echo: echo!, reveal: reveal!, revealProblems: revealProblems!, focus: focus!, panel: panel!, showReuseMessage: showReuseMessage!, clear: clear!, group, close: close, preserveTerminalName };
		}

		export function assignProperties(target: Tasks.IPresentationOptions, source: Tasks.IPresentationOptions | undefined): Tasks.IPresentationOptions | undefined {
			return _assignProperties(target, source, properties);
		}

		export function fillProperties(target: Tasks.IPresentationOptions, source: Tasks.IPresentationOptions | undefined): Tasks.IPresentationOptions | undefined {
			return _fillProperties(target, source, properties);
		}

		export function fillDefaults(value: Tasks.IPresentationOptions, context: IParseContext): Tasks.IPresentationOptions | undefined {
			const defaultEcho = context.engine === Tasks.ExecutionEngine.Terminal ? true : false;
			return _fillDefaults(value, { echo: defaultEcho, reveal: Tasks.RevealKind.Always, revealProblems: Tasks.RevealProblemKind.Never, focus: false, panel: Tasks.PanelKind.Shared, showReuseMessage: true, clear: false, preserveTerminalName: false }, properties, context);
		}

		export function freeze(value: Tasks.IPresentationOptions): Readonly<Tasks.IPresentationOptions> | undefined {
			return _freeze(value, properties);
		}

		export function isEmpty(this: void, value: Tasks.IPresentationOptions): boolean {
			return _isEmpty(value, properties);
		}
	}

	namespace ShellString {
		export function from(this: void, value: CommandString | undefined): Tasks.CommandString | undefined {
			if (value === undefined || value === null) {
				return undefined;
			}
			if (Types.isString(value)) {
				return value;
			} else if (Types.isStringArray(value)) {
				return value.join(' ');
			} else {
				const quoting = Tasks.ShellQuoting.from(value.quoting);
				const result = Types.isString(value.value) ? value.value : Types.isStringArray(value.value) ? value.value.join(' ') : undefined;
				if (result) {
					return {
						value: result,
						quoting: quoting
					};
				} else {
					return undefined;
				}
			}
		}
	}

	interface IBaseCommandConfigurationShape extends IBaseCommandProperties, ILegacyCommandProperties {
	}

	interface ICommandConfigurationShape extends IBaseCommandConfigurationShape {
		windows?: IBaseCommandConfigurationShape;
		osx?: IBaseCommandConfigurationShape;
		linux?: IBaseCommandConfigurationShape;
	}

	const properties: IMetaData<Tasks.ICommandConfiguration, any>[] = [
		{ property: 'runtime' }, { property: 'name' }, { property: 'options', type: CommandOptions },
		{ property: 'args' }, { property: 'taskSelector' }, { property: 'suppressTaskName' },
		{ property: 'presentation', type: PresentationOptions }
	];

	export function from(this: void, config: ICommandConfigurationShape, context: IParseContext): Tasks.ICommandConfiguration | undefined {
		let result: Tasks.ICommandConfiguration = fromBase(config, context)!;

		let osConfig: Tasks.ICommandConfiguration | undefined = undefined;
		if (config.windows && context.platform === Platform.Windows) {
			osConfig = fromBase(config.windows, context);
		} else if (config.osx && context.platform === Platform.Mac) {
			osConfig = fromBase(config.osx, context);
		} else if (config.linux && context.platform === Platform.Linux) {
			osConfig = fromBase(config.linux, context);
		}
		if (osConfig) {
			result = assignProperties(result, osConfig, context.schemaVersion === Tasks.JsonSchemaVersion.V2_0_0);
		}
		return isEmpty(result) ? undefined : result;
	}

	function fromBase(this: void, config: IBaseCommandConfigurationShape, context: IParseContext): Tasks.ICommandConfiguration | undefined {
		const name: Tasks.CommandString | undefined = ShellString.from(config.command);
		let runtime: Tasks.RuntimeType;
		if (Types.isString(config.type)) {
			if (config.type === 'shell' || config.type === 'process') {
				runtime = Tasks.RuntimeType.fromString(config.type);
			}
		}
		if (Types.isBoolean(config.isShellCommand) || ShellConfiguration.is(config.isShellCommand)) {
			runtime = Tasks.RuntimeType.Shell;
		} else if (config.isShellCommand !== undefined) {
			runtime = !!config.isShellCommand ? Tasks.RuntimeType.Shell : Tasks.RuntimeType.Process;
		}

		const result: Tasks.ICommandConfiguration = {
			name: name,
			runtime: runtime!,
			presentation: PresentationOptions.from(config, context)!
		};

		if (config.args !== undefined) {
			result.args = [];
			for (const arg of config.args) {
				const converted = ShellString.from(arg);
				if (converted !== undefined) {
					result.args.push(converted);
				} else {
					context.taskLoadIssues.push(
						nls.localize(
							'ConfigurationParser.inValidArg',
							'Error: command argument must either be a string or a quoted string. Provided value is:\n{0}',
							arg ? JSON.stringify(arg, undefined, 4) : 'undefined'
						));
				}
			}
		}
		if (config.options !== undefined) {
			result.options = CommandOptions.from(config.options, context);
			if (result.options && result.options.shell === undefined && ShellConfiguration.is(config.isShellCommand)) {
				result.options.shell = ShellConfiguration.from(config.isShellCommand, context);
				if (context.engine !== Tasks.ExecutionEngine.Terminal) {
					context.taskLoadIssues.push(nls.localize('ConfigurationParser.noShell', 'Warning: shell configuration is only supported when executing tasks in the terminal.'));
				}
			}
		}

		if (Types.isString(config.taskSelector)) {
			result.taskSelector = config.taskSelector;
		}
		if (Types.isBoolean(config.suppressTaskName)) {
			result.suppressTaskName = config.suppressTaskName;
		}

		return isEmpty(result) ? undefined : result;
	}

	export function hasCommand(value: Tasks.ICommandConfiguration): boolean {
		return value && !!value.name;
	}

	export function isEmpty(value: Tasks.ICommandConfiguration | undefined): boolean {
		return _isEmpty(value, properties);
	}

	export function assignProperties(target: Tasks.ICommandConfiguration, source: Tasks.ICommandConfiguration, overwriteArgs: boolean): Tasks.ICommandConfiguration {
		if (isEmpty(source)) {
			return target;
		}
		if (isEmpty(target)) {
			return source;
		}
		assignProperty(target, source, 'name');
		assignProperty(target, source, 'runtime');
		assignProperty(target, source, 'taskSelector');
		assignProperty(target, source, 'suppressTaskName');
		if (source.args !== undefined) {
			if (target.args === undefined || overwriteArgs) {
				target.args = source.args;
			} else {
				target.args = target.args.concat(source.args);
			}
		}
		target.presentation = PresentationOptions.assignProperties(target.presentation!, source.presentation)!;
		target.options = CommandOptions.assignProperties(target.options, source.options);
		return target;
	}

	export function fillProperties(target: Tasks.ICommandConfiguration, source: Tasks.ICommandConfiguration): Tasks.ICommandConfiguration | undefined {
		return _fillProperties(target, source, properties);
	}

	export function fillGlobals(target: Tasks.ICommandConfiguration, source: Tasks.ICommandConfiguration | undefined, taskName: string | undefined): Tasks.ICommandConfiguration {
		if ((source === undefined) || isEmpty(source)) {
			return target;
		}
		target = target || {
			name: undefined,
			runtime: undefined,
			presentation: undefined
		};
		if (target.name === undefined) {
			fillProperty(target, source, 'name');
			fillProperty(target, source, 'taskSelector');
			fillProperty(target, source, 'suppressTaskName');
			let args: Tasks.CommandString[] = source.args ? source.args.slice() : [];
			if (!target.suppressTaskName && taskName) {
				if (target.taskSelector !== undefined) {
					args.push(target.taskSelector + taskName);
				} else {
					args.push(taskName);
				}
			}
			if (target.args) {
				args = args.concat(target.args);
			}
			target.args = args;
		}
		fillProperty(target, source, 'runtime');

		target.presentation = PresentationOptions.fillProperties(target.presentation!, source.presentation)!;
		target.options = CommandOptions.fillProperties(target.options, source.options);

		return target;
	}

	export function fillDefaults(value: Tasks.ICommandConfiguration | undefined, context: IParseContext): void {
		if (!value || Object.isFrozen(value)) {
			return;
		}
		if (value.name !== undefined && value.runtime === undefined) {
			value.runtime = Tasks.RuntimeType.Process;
		}
		value.presentation = PresentationOptions.fillDefaults(value.presentation!, context)!;
		if (!isEmpty(value)) {
			value.options = CommandOptions.fillDefaults(value.options, context);
		}
		if (value.args === undefined) {
			value.args = EMPTY_ARRAY;
		}
		if (value.suppressTaskName === undefined) {
			value.suppressTaskName = (context.schemaVersion === Tasks.JsonSchemaVersion.V2_0_0);
		}
	}

	export function freeze(value: Tasks.ICommandConfiguration): Readonly<Tasks.ICommandConfiguration> | undefined {
		return _freeze(value, properties);
	}
}

export namespace ProblemMatcherConverter {

	export function namedFrom(this: void, declares: ProblemMatcherConfig.INamedProblemMatcher[] | undefined, context: IParseContext): IStringDictionary<INamedProblemMatcher> {
		const result: IStringDictionary<INamedProblemMatcher> = Object.create(null);

		if (!Array.isArray(declares)) {
			return result;
		}
		(<ProblemMatcherConfig.INamedProblemMatcher[]>declares).forEach((value) => {
			const namedProblemMatcher = (new ProblemMatcherParser(context.problemReporter)).parse(value);
			if (isNamedProblemMatcher(namedProblemMatcher)) {
				result[namedProblemMatcher.name] = namedProblemMatcher;
			} else {
				context.problemReporter.error(nls.localize('ConfigurationParser.noName', 'Error: Problem Matcher in declare scope must have a name:\n{0}\n', JSON.stringify(value, undefined, 4)));
			}
		});
		return result;
	}

	export function fromWithOsConfig(this: void, external: IConfigurationProperties & { [key: string]: any }, context: IParseContext): TaskConfigurationValueWithErrors<ProblemMatcher[]> {
		let result: TaskConfigurationValueWithErrors<ProblemMatcher[]> = {};
		if (external.windows && external.windows.problemMatcher && context.platform === Platform.Windows) {
			result = from(external.windows.problemMatcher, context);
		} else if (external.osx && external.osx.problemMatcher && context.platform === Platform.Mac) {
			result = from(external.osx.problemMatcher, context);
		} else if (external.linux && external.linux.problemMatcher && context.platform === Platform.Linux) {
			result = from(external.linux.problemMatcher, context);
		} else if (external.problemMatcher) {
			result = from(external.problemMatcher, context);
		}
		return result;
	}

	export function from(this: void, config: ProblemMatcherConfig.ProblemMatcherType | undefined, context: IParseContext): TaskConfigurationValueWithErrors<ProblemMatcher[]> {
		const result: ProblemMatcher[] = [];
		if (config === undefined) {
			return { value: result };
		}
		const errors: string[] = [];
		function addResult(matcher: TaskConfigurationValueWithErrors<ProblemMatcher>) {
			if (matcher.value) {
				result.push(matcher.value);
			}
			if (matcher.errors) {
				errors.push(...matcher.errors);
			}
		}
		const kind = getProblemMatcherKind(config);
		if (kind === ProblemMatcherKind.Unknown) {
			const error = nls.localize(
				'ConfigurationParser.unknownMatcherKind',
				'Warning: the defined problem matcher is unknown. Supported types are string | ProblemMatcher | Array<string | ProblemMatcher>.\n{0}\n',
				JSON.stringify(config, null, 4));
			context.problemReporter.warn(error);
		} else if (kind === ProblemMatcherKind.String || kind === ProblemMatcherKind.ProblemMatcher) {
			addResult(resolveProblemMatcher(config as ProblemMatcherConfig.ProblemMatcher, context));
		} else if (kind === ProblemMatcherKind.Array) {
			const problemMatchers = <(string | ProblemMatcherConfig.ProblemMatcher)[]>config;
			problemMatchers.forEach(problemMatcher => {
				addResult(resolveProblemMatcher(problemMatcher, context));
			});
		}
		return { value: result, errors };
	}

	function getProblemMatcherKind(this: void, value: ProblemMatcherConfig.ProblemMatcherType): ProblemMatcherKind {
		if (Types.isString(value)) {
			return ProblemMatcherKind.String;
		} else if (Array.isArray(value)) {
			return ProblemMatcherKind.Array;
		} else if (!Types.isUndefined(value)) {
			return ProblemMatcherKind.ProblemMatcher;
		} else {
			return ProblemMatcherKind.Unknown;
		}
	}

	function resolveProblemMatcher(this: void, value: string | ProblemMatcherConfig.ProblemMatcher, context: IParseContext): TaskConfigurationValueWithErrors<ProblemMatcher> {
		if (Types.isString(value)) {
			let variableName = <string>value;
			if (variableName.length > 1 && variableName[0] === '$') {
				variableName = variableName.substring(1);
				const global = ProblemMatcherRegistry.get(variableName);
				if (global) {
					return { value: Objects.deepClone(global) };
				}
				let localProblemMatcher: ProblemMatcher & Partial<INamedProblemMatcher> = context.namedProblemMatchers[variableName];
				if (localProblemMatcher) {
					localProblemMatcher = Objects.deepClone(localProblemMatcher);
					// remove the name
					delete localProblemMatcher.name;
					return { value: localProblemMatcher };
				}
			}
			return { errors: [nls.localize('ConfigurationParser.invalidVariableReference', 'Error: Invalid problemMatcher reference: {0}\n', value)] };
		} else {
			const json = <ProblemMatcherConfig.ProblemMatcher>value;
			return { value: new ProblemMatcherParser(context.problemReporter).parse(json) };
		}
	}
}

export namespace GroupKind {
	export function from(this: void, external: string | IGroupKind | undefined): Tasks.TaskGroup | undefined {
		if (external === undefined) {
			return undefined;
		} else if (Types.isString(external) && Tasks.TaskGroup.is(external)) {
			return { _id: external, isDefault: false };
		} else if (Types.isString(external.kind) && Tasks.TaskGroup.is(external.kind)) {
			const group: string = external.kind;
			const isDefault: boolean | string = Types.isUndefined(external.isDefault) ? false : external.isDefault;

			return { _id: group, isDefault };
		}
		return undefined;
	}

	export function to(group: Tasks.TaskGroup | string): IGroupKind | string {
		if (Types.isString(group)) {
			return group;
		} else if (!group.isDefault) {
			return group._id;
		}
		return {
			kind: group._id,
			isDefault: group.isDefault,
		};
	}
}

namespace TaskDependency {
	function uriFromSource(context: IParseContext, source: TaskConfigSource): URI | string {
		switch (source) {
			case TaskConfigSource.User: return Tasks.USER_TASKS_GROUP_KEY;
			case TaskConfigSource.TasksJson: return context.workspaceFolder.uri;
			default: return context.workspace && context.workspace.configuration ? context.workspace.configuration : context.workspaceFolder.uri;
		}
	}

	export function from(this: void, external: string | ITaskIdentifier, context: IParseContext, source: TaskConfigSource): Tasks.ITaskDependency | undefined {
		if (Types.isString(external)) {
			return { uri: uriFromSource(context, source), task: external };
		} else if (ITaskIdentifier.is(external)) {
			return {
				uri: uriFromSource(context, source),
				task: Tasks.TaskDefinition.createTaskIdentifier(external as Tasks.ITaskIdentifier, context.problemReporter)
			};
		} else {
			return undefined;
		}
	}
}

namespace DependsOrder {
	export function from(order: string | undefined): Tasks.DependsOrder {
		switch (order) {
			case Tasks.DependsOrder.sequence:
				return Tasks.DependsOrder.sequence;
			case Tasks.DependsOrder.parallel:
			default:
				return Tasks.DependsOrder.parallel;
		}
	}
}

namespace ConfigurationProperties {

	const properties: IMetaData<Tasks.IConfigurationProperties, any>[] = [
		{ property: 'name' },
		{ property: 'identifier' },
		{ property: 'group' },
		{ property: 'isBackground' },
		{ property: 'promptOnClose' },
		{ property: 'dependsOn' },
		{ property: 'presentation', type: CommandConfiguration.PresentationOptions },
		{ property: 'problemMatchers' },
		{ property: 'options' },
		{ property: 'icon' },
		{ property: 'hide' }
	];

	export function from(this: void, external: IConfigurationProperties & { [key: string]: any }, context: IParseContext,
		includeCommandOptions: boolean, source: TaskConfigSource, properties?: IJSONSchemaMap): TaskConfigurationValueWithErrors<Tasks.IConfigurationProperties> {
		if (!external) {
			return {};
		}
		const result: Tasks.IConfigurationProperties & { [key: string]: any } = {};

		if (properties) {
			for (const propertyName of Object.keys(properties)) {
				if (external[propertyName] !== undefined) {
					result[propertyName] = Objects.deepClone(external[propertyName]);
				}
			}
		}

		if (Types.isString(external.taskName)) {
			result.name = external.taskName;
		}
		if (Types.isString(external.label) && context.schemaVersion === Tasks.JsonSchemaVersion.V2_0_0) {
			result.name = external.label;
		}
		if (Types.isString(external.identifier)) {
			result.identifier = external.identifier;
		}
		result.icon = external.icon;
		result.hide = external.hide;
		if (external.isBackground !== undefined) {
			result.isBackground = !!external.isBackground;
		}
		if (external.promptOnClose !== undefined) {
			result.promptOnClose = !!external.promptOnClose;
		}
		result.group = GroupKind.from(external.group);
		if (external.dependsOn !== undefined) {
			if (Array.isArray(external.dependsOn)) {
				result.dependsOn = external.dependsOn.reduce((dependencies: Tasks.ITaskDependency[], item): Tasks.ITaskDependency[] => {
					const dependency = TaskDependency.from(item, context, source);
					if (dependency) {
						dependencies.push(dependency);
					}
					return dependencies;
				}, []);
			} else {
				const dependsOnValue = TaskDependency.from(external.dependsOn, context, source);
				result.dependsOn = dependsOnValue ? [dependsOnValue] : undefined;
			}
		}
		result.dependsOrder = DependsOrder.from(external.dependsOrder);
		if (includeCommandOptions && (external.presentation !== undefined || (external as ILegacyCommandProperties).terminal !== undefined)) {
			result.presentation = CommandConfiguration.PresentationOptions.from(external, context);
		}
		if (includeCommandOptions && (external.options !== undefined)) {
			result.options = CommandOptions.from(external.options, context);
		}
		const configProblemMatcher = ProblemMatcherConverter.fromWithOsConfig(external, context);
		if (configProblemMatcher.value !== undefined) {
			result.problemMatchers = configProblemMatcher.value;
		}
		if (external.detail) {
			result.detail = external.detail;
		}
		return isEmpty(result) ? {} : { value: result, errors: configProblemMatcher.errors };
	}

	export function isEmpty(this: void, value: Tasks.IConfigurationProperties): boolean {
		return _isEmpty(value, properties);
	}
}
const label = 'Workspace';

namespace ConfiguringTask {

	const grunt = 'grunt.';
	const jake = 'jake.';
	const gulp = 'gulp.';
	const npm = 'vscode.npm.';
	const typescript = 'vscode.typescript.';

	interface ICustomizeShape {
		customize: string;
	}

	export function from(this: void, external: IConfiguringTask, context: IParseContext, index: number, source: TaskConfigSource, registry?: Partial<ITaskDefinitionRegistry>): Tasks.ConfiguringTask | undefined {
		if (!external) {
			return undefined;
		}
		const type = external.type;
		const customize = (external as ICustomizeShape).customize;
		if (!type && !customize) {
			context.problemReporter.error(nls.localize('ConfigurationParser.noTaskType', 'Error: tasks configuration must have a type property. The configuration will be ignored.\n{0}\n', JSON.stringify(external, null, 4)));
			return undefined;
		}
		const typeDeclaration = type ? registry?.get?.(type) || TaskDefinitionRegistry.get(type) : undefined;
		if (!typeDeclaration) {
			const message = nls.localize('ConfigurationParser.noTypeDefinition', 'Error: there is no registered task type \'{0}\'. Did you miss installing an extension that provides a corresponding task provider?', type);
			context.problemReporter.error(message);
			return undefined;
		}
		let identifier: Tasks.ITaskIdentifier | undefined;
		if (Types.isString(customize)) {
			if (customize.indexOf(grunt) === 0) {
				identifier = { type: 'grunt', task: customize.substring(grunt.length) };
			} else if (customize.indexOf(jake) === 0) {
				identifier = { type: 'jake', task: customize.substring(jake.length) };
			} else if (customize.indexOf(gulp) === 0) {
				identifier = { type: 'gulp', task: customize.substring(gulp.length) };
			} else if (customize.indexOf(npm) === 0) {
				identifier = { type: 'npm', script: customize.substring(npm.length + 4) };
			} else if (customize.indexOf(typescript) === 0) {
				identifier = { type: 'typescript', tsconfig: customize.substring(typescript.length + 6) };
			}
		} else {
			if (Types.isString(external.type)) {
				identifier = external as Tasks.ITaskIdentifier;
			}
		}
		if (identifier === undefined) {
			context.problemReporter.error(nls.localize(
				'ConfigurationParser.missingType',
				'Error: the task configuration \'{0}\' is missing the required property \'type\'. The task configuration will be ignored.', JSON.stringify(external, undefined, 0)
			));
			return undefined;
		}
		const taskIdentifier: Tasks.KeyedTaskIdentifier | undefined = Tasks.TaskDefinition.createTaskIdentifier(identifier, context.problemReporter);
		if (taskIdentifier === undefined) {
			context.problemReporter.error(nls.localize(
				'ConfigurationParser.incorrectType',
				'Error: the task configuration \'{0}\' is using an unknown type. The task configuration will be ignored.', JSON.stringify(external, undefined, 0)
			));
			return undefined;
		}
		const configElement: Tasks.ITaskSourceConfigElement = {
			workspaceFolder: context.workspaceFolder,
			file: '.vscode/tasks.json',
			index,
			element: external
		};
		let taskSource: Tasks.FileBasedTaskSource;
		switch (source) {
			case TaskConfigSource.User: {
				taskSource = { kind: Tasks.TaskSourceKind.User, config: configElement, label };
				break;
			}
			case TaskConfigSource.WorkspaceFile: {
				taskSource = { kind: Tasks.TaskSourceKind.WorkspaceFile, config: configElement, label };
				break;
			}
			default: {
				taskSource = { kind: Tasks.TaskSourceKind.Workspace, config: configElement, label };
				break;
			}
		}
		const result: Tasks.ConfiguringTask = new Tasks.ConfiguringTask(
			`${typeDeclaration.extensionId}.${taskIdentifier._key}`,
			taskSource,
			undefined,
			type,
			taskIdentifier,
			RunOptions.fromConfiguration(external.runOptions),
			{ hide: external.hide }
		);
		const configuration = ConfigurationProperties.from(external, context, true, source, typeDeclaration.properties);
		result.addTaskLoadMessages(configuration.errors);
		if (configuration.value) {
			result.configurationProperties = Object.assign(result.configurationProperties, configuration.value);
			if (result.configurationProperties.name) {
				result._label = result.configurationProperties.name;
			} else {
				let label = result.configures.type;
				if (typeDeclaration.required && typeDeclaration.required.length > 0) {
					for (const required of typeDeclaration.required) {
						const value = result.configures[required];
						if (value) {
							label = label + ': ' + value;
							break;
						}
					}
				}
				result._label = label;
			}
			if (!result.configurationProperties.identifier) {
				result.configurationProperties.identifier = taskIdentifier._key;
			}
		}
		return result;
	}
}

namespace CustomTask {
	export function from(this: void, external: ICustomTask, context: IParseContext, index: number, source: TaskConfigSource): Tasks.CustomTask | undefined {
		if (!external) {
			return undefined;
		}
		let type = external.type;
		if (type === undefined || type === null) {
			type = Tasks.CUSTOMIZED_TASK_TYPE;
		}
		if (type !== Tasks.CUSTOMIZED_TASK_TYPE && type !== 'shell' && type !== 'process') {
			context.problemReporter.error(nls.localize('ConfigurationParser.notCustom', 'Error: tasks is not declared as a custom task. The configuration will be ignored.\n{0}\n', JSON.stringify(external, null, 4)));
			return undefined;
		}
		let taskName = external.taskName;
		if (Types.isString(external.label) && context.schemaVersion === Tasks.JsonSchemaVersion.V2_0_0) {
			taskName = external.label;
		}
		if (!taskName) {
			context.problemReporter.error(nls.localize('ConfigurationParser.noTaskName', 'Error: a task must provide a label property. The task will be ignored.\n{0}\n', JSON.stringify(external, null, 4)));
			return undefined;
		}

		let taskSource: Tasks.FileBasedTaskSource;
		switch (source) {
			case TaskConfigSource.User: {
				taskSource = { kind: Tasks.TaskSourceKind.User, config: { index, element: external, file: '.vscode/tasks.json', workspaceFolder: context.workspaceFolder }, label };
				break;
			}
			case TaskConfigSource.WorkspaceFile: {
				taskSource = { kind: Tasks.TaskSourceKind.WorkspaceFile, config: { index, element: external, file: '.vscode/tasks.json', workspaceFolder: context.workspaceFolder, workspace: context.workspace }, label };
				break;
			}
			default: {
				taskSource = { kind: Tasks.TaskSourceKind.Workspace, config: { index, element: external, file: '.vscode/tasks.json', workspaceFolder: context.workspaceFolder }, label };
				break;
			}
		}

		const result: Tasks.CustomTask = new Tasks.CustomTask(
			context.uuidMap.getUUID(taskName),
			taskSource,
			taskName,
			Tasks.CUSTOMIZED_TASK_TYPE,
			undefined,
			false,
			RunOptions.fromConfiguration(external.runOptions),
			{
				name: taskName,
				identifier: taskName,
			}
		);
		const configuration = ConfigurationProperties.from(external, context, false, source);
		result.addTaskLoadMessages(configuration.errors);
		if (configuration.value) {
			result.configurationProperties = Object.assign(result.configurationProperties, configuration.value);
		}
		const supportLegacy: boolean = true; //context.schemaVersion === Tasks.JsonSchemaVersion.V2_0_0;
		if (supportLegacy) {
			const legacy: ILegacyTaskProperties = external as ILegacyTaskProperties;
			if (result.configurationProperties.isBackground === undefined && legacy.isWatching !== undefined) {
				result.configurationProperties.isBackground = !!legacy.isWatching;
			}
			if (result.configurationProperties.group === undefined) {
				if (legacy.isBuildCommand === true) {
					result.configurationProperties.group = Tasks.TaskGroup.Build;
				} else if (legacy.isTestCommand === true) {
					result.configurationProperties.group = Tasks.TaskGroup.Test;
				}
			}
		}
		const command: Tasks.ICommandConfiguration = CommandConfiguration.from(external, context)!;
		if (command) {
			result.command = command;
		}
		if (external.command !== undefined) {
			// if the task has its own command then we suppress the
			// task name by default.
			command.suppressTaskName = true;
		}
		return result;
	}

	export function fillGlobals(task: Tasks.CustomTask, globals: IGlobals): void {
		// We only merge a command from a global definition if there is no dependsOn
		// or there is a dependsOn and a defined command.
		if (CommandConfiguration.hasCommand(task.command) || task.configurationProperties.dependsOn === undefined) {
			task.command = CommandConfiguration.fillGlobals(task.command, globals.command, task.configurationProperties.name);
		}
		if (task.configurationProperties.problemMatchers === undefined && globals.problemMatcher !== undefined) {
			task.configurationProperties.problemMatchers = Objects.deepClone(globals.problemMatcher);
			task.hasDefinedMatchers = true;
		}
		// promptOnClose is inferred from isBackground if available
		if (task.configurationProperties.promptOnClose === undefined && task.configurationProperties.isBackground === undefined && globals.promptOnClose !== undefined) {
			task.configurationProperties.promptOnClose = globals.promptOnClose;
		}
	}

	export function fillDefaults(task: Tasks.CustomTask, context: IParseContext): void {
		CommandConfiguration.fillDefaults(task.command, context);
		if (task.configurationProperties.promptOnClose === undefined) {
			task.configurationProperties.promptOnClose = task.configurationProperties.isBackground !== undefined ? !task.configurationProperties.isBackground : true;
		}
		if (task.configurationProperties.isBackground === undefined) {
			task.configurationProperties.isBackground = false;
		}
		if (task.configurationProperties.problemMatchers === undefined) {
			task.configurationProperties.problemMatchers = EMPTY_ARRAY;
		}
	}

	export function createCustomTask(contributedTask: Tasks.ContributedTask, configuredProps: Tasks.ConfiguringTask | Tasks.CustomTask): Tasks.CustomTask {
		const result: Tasks.CustomTask = new Tasks.CustomTask(
			configuredProps._id,
			Object.assign({}, configuredProps._source, { customizes: contributedTask.defines }),
			configuredProps.configurationProperties.name || contributedTask._label,
			Tasks.CUSTOMIZED_TASK_TYPE,
			contributedTask.command,
			false,
			contributedTask.runOptions,
			{
				name: configuredProps.configurationProperties.name || contributedTask.configurationProperties.name,
				identifier: configuredProps.configurationProperties.identifier || contributedTask.configurationProperties.identifier,
				icon: configuredProps.configurationProperties.icon,
				hide: configuredProps.configurationProperties.hide
			},

		);
		result.addTaskLoadMessages(configuredProps.taskLoadMessages);
		const resultConfigProps: Tasks.IConfigurationProperties = result.configurationProperties;

		assignProperty(resultConfigProps, configuredProps.configurationProperties, 'group');
		assignProperty(resultConfigProps, configuredProps.configurationProperties, 'isBackground');
		assignProperty(resultConfigProps, configuredProps.configurationProperties, 'dependsOn');
		assignProperty(resultConfigProps, configuredProps.configurationProperties, 'problemMatchers');
		assignProperty(resultConfigProps, configuredProps.configurationProperties, 'promptOnClose');
		assignProperty(resultConfigProps, configuredProps.configurationProperties, 'detail');
		result.command.presentation = CommandConfiguration.PresentationOptions.assignProperties(
			result.command.presentation!, configuredProps.configurationProperties.presentation)!;
		result.command.options = CommandOptions.assignProperties(result.command.options, configuredProps.configurationProperties.options);
		result.runOptions = RunOptions.assignProperties(result.runOptions, configuredProps.runOptions);

		const contributedConfigProps: Tasks.IConfigurationProperties = contributedTask.configurationProperties;
		fillProperty(resultConfigProps, contributedConfigProps, 'group');
		fillProperty(resultConfigProps, contributedConfigProps, 'isBackground');
		fillProperty(resultConfigProps, contributedConfigProps, 'dependsOn');
		fillProperty(resultConfigProps, contributedConfigProps, 'problemMatchers');
		fillProperty(resultConfigProps, contributedConfigProps, 'promptOnClose');
		fillProperty(resultConfigProps, contributedConfigProps, 'detail');
		result.command.presentation = CommandConfiguration.PresentationOptions.fillProperties(
			result.command.presentation, contributedConfigProps.presentation)!;
		result.command.options = CommandOptions.fillProperties(result.command.options, contributedConfigProps.options);
		result.runOptions = RunOptions.fillProperties(result.runOptions, contributedTask.runOptions);

		if (contributedTask.hasDefinedMatchers === true) {
			result.hasDefinedMatchers = true;
		}

		return result;
	}
}

export interface ITaskParseResult {
	custom: Tasks.CustomTask[];
	configured: Tasks.ConfiguringTask[];
}

export namespace TaskParser {

	function isCustomTask(value: ICustomTask | IConfiguringTask): value is ICustomTask {
		const type = value.type;
		// eslint-disable-next-line local/code-no-any-casts
		const customize = (value as any).customize;
		return customize === undefined && (type === undefined || type === null || type === Tasks.CUSTOMIZED_TASK_TYPE || type === 'shell' || type === 'process');
	}

	const builtinTypeContextMap: IStringDictionary<RawContextKey<boolean>> = {
		shell: ShellExecutionSupportedContext,
		process: ProcessExecutionSupportedContext
	};

	export function from(this: void, externals: Array<ICustomTask | IConfiguringTask> | undefined, globals: IGlobals, context: IParseContext, source: TaskConfigSource, registry?: Partial<ITaskDefinitionRegistry>): ITaskParseResult {
		const result: ITaskParseResult = { custom: [], configured: [] };
		if (!externals) {
			return result;
		}
		const defaultBuildTask: { task: Tasks.Task | undefined; rank: number } = { task: undefined, rank: -1 };
		const defaultTestTask: { task: Tasks.Task | undefined; rank: number } = { task: undefined, rank: -1 };
		const schema2_0_0: boolean = context.schemaVersion === Tasks.JsonSchemaVersion.V2_0_0;
		const baseLoadIssues = Objects.deepClone(context.taskLoadIssues);
		for (let index = 0; index < externals.length; index++) {
			const external = externals[index];
			const definition = external.type ? registry?.get?.(external.type) || TaskDefinitionRegistry.get(external.type) : undefined;
			let typeNotSupported: boolean = false;
			if (definition && definition.when && !context.contextKeyService.contextMatchesRules(definition.when)) {
				typeNotSupported = true;
			} else if (!definition && external.type) {
				for (const key of Object.keys(builtinTypeContextMap)) {
					if (external.type === key) {
						typeNotSupported = !ShellExecutionSupportedContext.evaluate(context.contextKeyService.getContext(null));
						break;
					}
				}
			}

			if (typeNotSupported) {
				context.problemReporter.info(nls.localize(
					'taskConfiguration.providerUnavailable', 'Warning: {0} tasks are unavailable in the current environment.\n',
					external.type
				));
				continue;
			}

			if (isCustomTask(external)) {
				const customTask = CustomTask.from(external, context, index, source);
				if (customTask) {
					CustomTask.fillGlobals(customTask, globals);
					CustomTask.fillDefaults(customTask, context);
					if (schema2_0_0) {
						if ((customTask.command === undefined || customTask.command.name === undefined) && (customTask.configurationProperties.dependsOn === undefined || customTask.configurationProperties.dependsOn.length === 0)) {
							context.problemReporter.error(nls.localize(
								'taskConfiguration.noCommandOrDependsOn', 'Error: the task \'{0}\' neither specifies a command nor a dependsOn property. The task will be ignored. Its definition is:\n{1}',
								customTask.configurationProperties.name, JSON.stringify(external, undefined, 4)
							));
							continue;
						}
					} else {
						if (customTask.command === undefined || customTask.command.name === undefined) {
							context.problemReporter.warn(nls.localize(
								'taskConfiguration.noCommand', 'Error: the task \'{0}\' doesn\'t define a command. The task will be ignored. Its definition is:\n{1}',
								customTask.configurationProperties.name, JSON.stringify(external, undefined, 4)
							));
							continue;
						}
					}
					if (customTask.configurationProperties.group === Tasks.TaskGroup.Build && defaultBuildTask.rank < 2) {
						defaultBuildTask.task = customTask;
						defaultBuildTask.rank = 2;
					} else if (customTask.configurationProperties.group === Tasks.TaskGroup.Test && defaultTestTask.rank < 2) {
						defaultTestTask.task = customTask;
						defaultTestTask.rank = 2;
					} else if (customTask.configurationProperties.name === 'build' && defaultBuildTask.rank < 1) {
						defaultBuildTask.task = customTask;
						defaultBuildTask.rank = 1;
					} else if (customTask.configurationProperties.name === 'test' && defaultTestTask.rank < 1) {
						defaultTestTask.task = customTask;
						defaultTestTask.rank = 1;
					}
					customTask.addTaskLoadMessages(context.taskLoadIssues);
					result.custom.push(customTask);
				}
			} else {
				const configuredTask = ConfiguringTask.from(external, context, index, source, registry);
				if (configuredTask) {
					configuredTask.addTaskLoadMessages(context.taskLoadIssues);
					result.configured.push(configuredTask);
				}
			}
			context.taskLoadIssues = Objects.deepClone(baseLoadIssues);
		}
		// There is some special logic for tasks with the labels "build" and "test".
		// Even if they are not marked as a task group Build or Test, we automagically group them as such.
		// However, if they are already grouped as Build or Test, we don't need to add this grouping.
		const defaultBuildGroupName = Types.isString(defaultBuildTask.task?.configurationProperties.group) ? defaultBuildTask.task?.configurationProperties.group : defaultBuildTask.task?.configurationProperties.group?._id;
		const defaultTestTaskGroupName = Types.isString(defaultTestTask.task?.configurationProperties.group) ? defaultTestTask.task?.configurationProperties.group : defaultTestTask.task?.configurationProperties.group?._id;
		if ((defaultBuildGroupName !== Tasks.TaskGroup.Build._id) && (defaultBuildTask.rank > -1) && (defaultBuildTask.rank < 2) && defaultBuildTask.task) {
			defaultBuildTask.task.configurationProperties.group = Tasks.TaskGroup.Build;
		} else if ((defaultTestTaskGroupName !== Tasks.TaskGroup.Test._id) && (defaultTestTask.rank > -1) && (defaultTestTask.rank < 2) && defaultTestTask.task) {
			defaultTestTask.task.configurationProperties.group = Tasks.TaskGroup.Test;
		}

		return result;
	}

	export function assignTasks(target: Tasks.CustomTask[], source: Tasks.CustomTask[]): Tasks.CustomTask[] {
		if (source === undefined || source.length === 0) {
			return target;
		}
		if (target === undefined || target.length === 0) {
			return source;
		}

		if (source) {
			// Tasks are keyed by ID but we need to merge by name
			const map: IStringDictionary<Tasks.CustomTask> = Object.create(null);
			target.forEach((task) => {
				map[task.configurationProperties.name!] = task;
			});

			source.forEach((task) => {
				map[task.configurationProperties.name!] = task;
			});
			const newTarget: Tasks.CustomTask[] = [];
			target.forEach(task => {
				newTarget.push(map[task.configurationProperties.name!]);
				delete map[task.configurationProperties.name!];
			});
			Object.keys(map).forEach(key => newTarget.push(map[key]));
			target = newTarget;
		}
		return target;
	}
}

export interface IGlobals {
	command?: Tasks.ICommandConfiguration;
	problemMatcher?: ProblemMatcher[];
	promptOnClose?: boolean;
	suppressTaskName?: boolean;
}

namespace Globals {

	export function from(config: IExternalTaskRunnerConfiguration, context: IParseContext): IGlobals {
		let result = fromBase(config, context);
		let osGlobals: IGlobals | undefined = undefined;
		if (config.windows && context.platform === Platform.Windows) {
			osGlobals = fromBase(config.windows, context);
		} else if (config.osx && context.platform === Platform.Mac) {
			osGlobals = fromBase(config.osx, context);
		} else if (config.linux && context.platform === Platform.Linux) {
			osGlobals = fromBase(config.linux, context);
		}
		if (osGlobals) {
			result = Globals.assignProperties(result, osGlobals);
		}
		const command = CommandConfiguration.from(config, context);
		if (command) {
			result.command = command;
		}
		Globals.fillDefaults(result, context);
		Globals.freeze(result);
		return result;
	}

	export function fromBase(this: void, config: IBaseTaskRunnerConfiguration, context: IParseContext): IGlobals {
		const result: IGlobals = {};
		if (config.suppressTaskName !== undefined) {
			result.suppressTaskName = !!config.suppressTaskName;
		}
		if (config.promptOnClose !== undefined) {
			result.promptOnClose = !!config.promptOnClose;
		}
		if (config.problemMatcher) {
			result.problemMatcher = ProblemMatcherConverter.from(config.problemMatcher, context).value;
		}
		return result;
	}

	export function isEmpty(value: IGlobals): boolean {
		return !value || value.command === undefined && value.promptOnClose === undefined && value.suppressTaskName === undefined;
	}

	export function assignProperties(target: IGlobals, source: IGlobals): IGlobals {
		if (isEmpty(source)) {
			return target;
		}
		if (isEmpty(target)) {
			return source;
		}
		assignProperty(target, source, 'promptOnClose');
		assignProperty(target, source, 'suppressTaskName');
		return target;
	}

	export function fillDefaults(value: IGlobals, context: IParseContext): void {
		if (!value) {
			return;
		}
		CommandConfiguration.fillDefaults(value.command, context);
		if (value.suppressTaskName === undefined) {
			value.suppressTaskName = (context.schemaVersion === Tasks.JsonSchemaVersion.V2_0_0);
		}
		if (value.promptOnClose === undefined) {
			value.promptOnClose = true;
		}
	}

	export function freeze(value: IGlobals): void {
		Object.freeze(value);
		if (value.command) {
			CommandConfiguration.freeze(value.command);
		}
	}
}

export namespace ExecutionEngine {

	export function from(config: IExternalTaskRunnerConfiguration): Tasks.ExecutionEngine {
		const runner = config.runner || config._runner;
		let result: Tasks.ExecutionEngine | undefined;
		if (runner) {
			switch (runner) {
				case 'terminal':
					result = Tasks.ExecutionEngine.Terminal;
					break;
				case 'process':
					result = Tasks.ExecutionEngine.Process;
					break;
			}
		}
		const schemaVersion = JsonSchemaVersion.from(config);
		if (schemaVersion === Tasks.JsonSchemaVersion.V0_1_0) {
			return result || Tasks.ExecutionEngine.Process;
		} else if (schemaVersion === Tasks.JsonSchemaVersion.V2_0_0) {
			return Tasks.ExecutionEngine.Terminal;
		} else {
			throw new Error('Shouldn\'t happen.');
		}
	}
}

export namespace JsonSchemaVersion {

	const _default: Tasks.JsonSchemaVersion = Tasks.JsonSchemaVersion.V2_0_0;

	export function from(config: IExternalTaskRunnerConfiguration): Tasks.JsonSchemaVersion {
		const version = config.version;
		if (!version) {
			return _default;
		}
		switch (version) {
			case '0.1.0':
				return Tasks.JsonSchemaVersion.V0_1_0;
			case '2.0.0':
				return Tasks.JsonSchemaVersion.V2_0_0;
			default:
				return _default;
		}
	}
}

export interface IParseResult {
	validationStatus: ValidationStatus;
	custom: Tasks.CustomTask[];
	configured: Tasks.ConfiguringTask[];
	engine: Tasks.ExecutionEngine;
}

export interface IProblemReporter extends IProblemReporterBase {
}

export class UUIDMap {

	private last: IStringDictionary<Types.SingleOrMany<string>> | undefined;
	private current: IStringDictionary<Types.SingleOrMany<string>>;

	constructor(other?: UUIDMap) {
		this.current = Object.create(null);
		if (other) {
			for (const key of Object.keys(other.current)) {
				const value = other.current[key];
				if (Array.isArray(value)) {
					this.current[key] = value.slice();
				} else {
					this.current[key] = value;
				}
			}
		}
	}

	public start(): void {
		this.last = this.current;
		this.current = Object.create(null);
	}

	public getUUID(identifier: string): string {
		const lastValue = this.last ? this.last[identifier] : undefined;
		let result: string | undefined = undefined;
		if (lastValue !== undefined) {
			if (Array.isArray(lastValue)) {
				result = lastValue.shift();
				if (lastValue.length === 0) {
					delete this.last![identifier];
				}
			} else {
				result = lastValue;
				delete this.last![identifier];
			}
		}
		if (result === undefined) {
			result = UUID.generateUuid();
		}
		const currentValue = this.current[identifier];
		if (currentValue === undefined) {
			this.current[identifier] = result;
		} else {
			if (Array.isArray(currentValue)) {
				currentValue.push(result);
			} else {
				const arrayValue: string[] = [currentValue];
				arrayValue.push(result);
				this.current[identifier] = arrayValue;
			}
		}
		return result;
	}

	public finish(): void {
		this.last = undefined;
	}
}

export enum TaskConfigSource {
	TasksJson,
	WorkspaceFile,
	User
}

class ConfigurationParser {

	private workspaceFolder: IWorkspaceFolder;
	private workspace: IWorkspace | undefined;
	private problemReporter: IProblemReporter;
	private uuidMap: UUIDMap;
	private platform: Platform;

	constructor(workspaceFolder: IWorkspaceFolder, workspace: IWorkspace | undefined, platform: Platform, problemReporter: IProblemReporter, uuidMap: UUIDMap) {
		this.workspaceFolder = workspaceFolder;
		this.workspace = workspace;
		this.platform = platform;
		this.problemReporter = problemReporter;
		this.uuidMap = uuidMap;
	}

	public run(fileConfig: IExternalTaskRunnerConfiguration, source: TaskConfigSource, contextKeyService: IContextKeyService): IParseResult {
		const engine = ExecutionEngine.from(fileConfig);
		const schemaVersion = JsonSchemaVersion.from(fileConfig);
		const context: IParseContext = {
			workspaceFolder: this.workspaceFolder,
			workspace: this.workspace,
			problemReporter: this.problemReporter,
			uuidMap: this.uuidMap,
			namedProblemMatchers: {},
			engine,
			schemaVersion,
			platform: this.platform,
			taskLoadIssues: [],
			contextKeyService
		};
		const taskParseResult = this.createTaskRunnerConfiguration(fileConfig, context, source);
		return {
			validationStatus: this.problemReporter.status,
			custom: taskParseResult.custom,
			configured: taskParseResult.configured,
			engine
		};
	}

	private createTaskRunnerConfiguration(fileConfig: IExternalTaskRunnerConfiguration, context: IParseContext, source: TaskConfigSource): ITaskParseResult {
		const globals = Globals.from(fileConfig, context);
		if (this.problemReporter.status.isFatal()) {
			return { custom: [], configured: [] };
		}
		context.namedProblemMatchers = ProblemMatcherConverter.namedFrom(fileConfig.declares, context);
		let globalTasks: Tasks.CustomTask[] | undefined = undefined;
		let externalGlobalTasks: Array<IConfiguringTask | ICustomTask> | undefined = undefined;
		if (fileConfig.windows && context.platform === Platform.Windows) {
			globalTasks = TaskParser.from(fileConfig.windows.tasks, globals, context, source).custom;
			externalGlobalTasks = fileConfig.windows.tasks;
		} else if (fileConfig.osx && context.platform === Platform.Mac) {
			globalTasks = TaskParser.from(fileConfig.osx.tasks, globals, context, source).custom;
			externalGlobalTasks = fileConfig.osx.tasks;
		} else if (fileConfig.linux && context.platform === Platform.Linux) {
			globalTasks = TaskParser.from(fileConfig.linux.tasks, globals, context, source).custom;
			externalGlobalTasks = fileConfig.linux.tasks;
		}
		if (context.schemaVersion === Tasks.JsonSchemaVersion.V2_0_0 && globalTasks && globalTasks.length > 0 && externalGlobalTasks && externalGlobalTasks.length > 0) {
			const taskContent: string[] = [];
			for (const task of externalGlobalTasks) {
				taskContent.push(JSON.stringify(task, null, 4));
			}
			context.problemReporter.error(
				nls.localize(
					{ key: 'TaskParse.noOsSpecificGlobalTasks', comment: ['\"Task version 2.0.0\" refers to the 2.0.0 version of the task system. The \"version 2.0.0\" is not localizable as it is a json key and value.'] },
					'Task version 2.0.0 doesn\'t support global OS specific tasks. Convert them to a task with a OS specific command. Affected tasks are:\n{0}', taskContent.join('\n'))
			);
		}

		let result: ITaskParseResult = { custom: [], configured: [] };
		if (fileConfig.tasks) {
			result = TaskParser.from(fileConfig.tasks, globals, context, source);
		}
		if (globalTasks) {
			result.custom = TaskParser.assignTasks(result.custom, globalTasks);
		}

		if ((!result.custom || result.custom.length === 0) && (globals.command && globals.command.name)) {
			const matchers: ProblemMatcher[] = ProblemMatcherConverter.from(fileConfig.problemMatcher, context).value ?? [];
			const isBackground = fileConfig.isBackground ? !!fileConfig.isBackground : fileConfig.isWatching ? !!fileConfig.isWatching : undefined;
			const name = Tasks.CommandString.value(globals.command.name);
			const task: Tasks.CustomTask = new Tasks.CustomTask(
				context.uuidMap.getUUID(name),
				Object.assign({}, source, 'workspace', { config: { index: -1, element: fileConfig, workspaceFolder: context.workspaceFolder } }) satisfies Tasks.IWorkspaceTaskSource,
				name,
				Tasks.CUSTOMIZED_TASK_TYPE,
				{
					name: undefined,
					runtime: undefined,
					presentation: undefined,
					suppressTaskName: true
				},
				false,
				{ reevaluateOnRerun: true },
				{
					name: name,
					identifier: name,
					group: Tasks.TaskGroup.Build,
					isBackground: isBackground,
					problemMatchers: matchers
				}
			);
			const taskGroupKind = GroupKind.from(fileConfig.group);
			if (taskGroupKind !== undefined) {
				task.configurationProperties.group = taskGroupKind;
			} else if (fileConfig.group === 'none') {
				task.configurationProperties.group = undefined;
			}
			CustomTask.fillGlobals(task, globals);
			CustomTask.fillDefaults(task, context);
			result.custom = [task];
		}
		result.custom = result.custom || [];
		result.configured = result.configured || [];
		return result;
	}
}

const uuidMaps: Map<TaskConfigSource, Map<string, UUIDMap>> = new Map();
const recentUuidMaps: Map<TaskConfigSource, Map<string, UUIDMap>> = new Map();
export function parse(workspaceFolder: IWorkspaceFolder, workspace: IWorkspace | undefined, platform: Platform, configuration: IExternalTaskRunnerConfiguration, logger: IProblemReporter, source: TaskConfigSource, contextKeyService: IContextKeyService, isRecents: boolean = false): IParseResult {
	const recentOrOtherMaps = isRecents ? recentUuidMaps : uuidMaps;
	let selectedUuidMaps = recentOrOtherMaps.get(source);
	if (!selectedUuidMaps) {
		recentOrOtherMaps.set(source, new Map());
		selectedUuidMaps = recentOrOtherMaps.get(source)!;
	}
	let uuidMap = selectedUuidMaps.get(workspaceFolder.uri.toString());
	if (!uuidMap) {
		uuidMap = new UUIDMap();
		selectedUuidMaps.set(workspaceFolder.uri.toString(), uuidMap);
	}
	try {
		uuidMap.start();
		return (new ConfigurationParser(workspaceFolder, workspace, platform, logger, uuidMap)).run(configuration, source, contextKeyService);
	} finally {
		uuidMap.finish();
	}
}



export function createCustomTask(contributedTask: Tasks.ContributedTask, configuredProps: Tasks.ConfiguringTask | Tasks.CustomTask): Tasks.CustomTask {
	return CustomTask.createCustomTask(contributedTask, configuredProps);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tasks/common/taskDefinitionRegistry.ts]---
Location: vscode-main/src/vs/workbench/contrib/tasks/common/taskDefinitionRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { IJSONSchema, IJSONSchemaMap } from '../../../../base/common/jsonSchema.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import * as Types from '../../../../base/common/types.js';
import * as Objects from '../../../../base/common/objects.js';

import { ExtensionsRegistry, ExtensionMessageCollector } from '../../../services/extensions/common/extensionsRegistry.js';

import * as Tasks from './tasks.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { Emitter, Event } from '../../../../base/common/event.js';


const taskDefinitionSchema: IJSONSchema = {
	type: 'object',
	additionalProperties: false,
	properties: {
		type: {
			type: 'string',
			description: nls.localize('TaskDefinition.description', 'The actual task type. Please note that types starting with a \'$\' are reserved for internal usage.')
		},
		required: {
			type: 'array',
			items: {
				type: 'string'
			}
		},
		properties: {
			type: 'object',
			description: nls.localize('TaskDefinition.properties', 'Additional properties of the task type'),
			additionalProperties: {
				$ref: 'http://json-schema.org/draft-07/schema#'
			}
		},
		when: {
			type: 'string',
			markdownDescription: nls.localize('TaskDefinition.when', 'Condition which must be true to enable this type of task. Consider using `shellExecutionSupported`, `processExecutionSupported`, and `customExecutionSupported` as appropriate for this task definition. See the [API documentation](https://code.visualstudio.com/api/extension-guides/task-provider#when-clause) for more information.'),
			default: ''
		}
	}
};

namespace Configuration {
	export interface ITaskDefinition {
		type?: string;
		required?: string[];
		properties?: IJSONSchemaMap;
		when?: string;
	}

	export function from(value: ITaskDefinition, extensionId: ExtensionIdentifier, messageCollector: ExtensionMessageCollector): Tasks.ITaskDefinition | undefined {
		if (!value) {
			return undefined;
		}
		const taskType = Types.isString(value.type) ? value.type : undefined;
		if (!taskType || taskType.length === 0) {
			messageCollector.error(nls.localize('TaskTypeConfiguration.noType', 'The task type configuration is missing the required \'taskType\' property'));
			return undefined;
		}
		const required: string[] = [];
		if (Array.isArray(value.required)) {
			for (const element of value.required) {
				if (Types.isString(element)) {
					required.push(element);
				}
			}
		}
		return {
			extensionId: extensionId.value,
			taskType, required: required,
			properties: value.properties ? Objects.deepClone(value.properties) : {},
			when: value.when ? ContextKeyExpr.deserialize(value.when) : undefined
		};
	}
}


const taskDefinitionsExtPoint = ExtensionsRegistry.registerExtensionPoint<Configuration.ITaskDefinition[]>({
	extensionPoint: 'taskDefinitions',
	activationEventsGenerator: function* (contributions: readonly Configuration.ITaskDefinition[]) {
		for (const task of contributions) {
			if (task.type) {
				yield `onTaskType:${task.type}`;
			}
		}
	},
	jsonSchema: {
		description: nls.localize('TaskDefinitionExtPoint', 'Contributes task kinds'),
		type: 'array',
		items: taskDefinitionSchema
	}
});

export interface ITaskDefinitionRegistry {
	onReady(): Promise<void>;

	get(key: string): Tasks.ITaskDefinition;
	all(): Tasks.ITaskDefinition[];
	getJsonSchema(): IJSONSchema;
	readonly onDefinitionsChanged: Event<void>;
}

class TaskDefinitionRegistryImpl implements ITaskDefinitionRegistry {

	private taskTypes: IStringDictionary<Tasks.ITaskDefinition>;
	private readyPromise: Promise<void>;
	private _schema: IJSONSchema | undefined;
	private _onDefinitionsChanged: Emitter<void> = new Emitter();
	public onDefinitionsChanged: Event<void> = this._onDefinitionsChanged.event;

	constructor() {
		this.taskTypes = Object.create(null);
		this.readyPromise = new Promise<void>((resolve, reject) => {
			taskDefinitionsExtPoint.setHandler((extensions, delta) => {
				this._schema = undefined;
				try {
					for (const extension of delta.removed) {
						const taskTypes = extension.value;
						for (const taskType of taskTypes) {
							if (this.taskTypes && taskType.type && this.taskTypes[taskType.type]) {
								delete this.taskTypes[taskType.type];
							}
						}
					}
					for (const extension of delta.added) {
						const taskTypes = extension.value;
						for (const taskType of taskTypes) {
							const type = Configuration.from(taskType, extension.description.identifier, extension.collector);
							if (type) {
								this.taskTypes[type.taskType] = type;
							}
						}
					}
					if ((delta.removed.length > 0) || (delta.added.length > 0)) {
						this._onDefinitionsChanged.fire();
					}
				} catch (error) {
				}
				resolve(undefined);
			});
		});
	}

	public onReady(): Promise<void> {
		return this.readyPromise;
	}

	public get(key: string): Tasks.ITaskDefinition {
		return this.taskTypes[key];
	}

	public all(): Tasks.ITaskDefinition[] {
		return Object.keys(this.taskTypes).map(key => this.taskTypes[key]);
	}

	public getJsonSchema(): IJSONSchema {
		if (this._schema === undefined) {
			const schemas: IJSONSchema[] = [];
			for (const definition of this.all()) {
				const schema: IJSONSchema = {
					type: 'object',
					additionalProperties: false
				};
				if (definition.required.length > 0) {
					schema.required = definition.required.slice(0);
				}
				if (definition.properties !== undefined) {
					schema.properties = Objects.deepClone(definition.properties);
				} else {
					schema.properties = Object.create(null);
				}
				schema.properties!.type = {
					type: 'string',
					enum: [definition.taskType]
				};
				schemas.push(schema);
			}
			this._schema = { oneOf: schemas };
		}
		return this._schema;
	}
}

export const TaskDefinitionRegistry: ITaskDefinitionRegistry = new TaskDefinitionRegistryImpl();
```

--------------------------------------------------------------------------------

````

---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 174
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 174 of 552)

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

---[FILE: src/vs/base/common/fuzzyScorer.ts]---
Location: vscode-main/src/vs/base/common/fuzzyScorer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from './charCode.js';
import { compareAnything } from './comparers.js';
import { createMatches as createFuzzyMatches, fuzzyScore, IMatch, isUpper, matchesPrefix } from './filters.js';
import { hash } from './hash.js';
import { sep } from './path.js';
import { isLinux, isWindows } from './platform.js';
import { equalsIgnoreCase } from './strings.js';

//#region Fuzzy scorer

export type FuzzyScore = [number /* score */, number[] /* match positions */];
export type FuzzyScorerCache = { [key: string]: IItemScore };

const NO_MATCH = 0;
const NO_SCORE: FuzzyScore = [NO_MATCH, []];

// const DEBUG = true;
// const DEBUG_MATRIX = false;

export function scoreFuzzy(target: string, query: string, queryLower: string, allowNonContiguousMatches: boolean): FuzzyScore {
	if (!target || !query) {
		return NO_SCORE; // return early if target or query are undefined
	}

	const targetLength = target.length;
	const queryLength = query.length;

	if (targetLength < queryLength) {
		return NO_SCORE; // impossible for query to be contained in target
	}

	// if (DEBUG) {
	// 	console.group(`Target: ${target}, Query: ${query}`);
	// }

	const targetLower = target.toLowerCase();
	const res = doScoreFuzzy(query, queryLower, queryLength, target, targetLower, targetLength, allowNonContiguousMatches);

	// if (DEBUG) {
	// 	console.log(`%cFinal Score: ${res[0]}`, 'font-weight: bold');
	// 	console.groupEnd();
	// }

	return res;
}

function doScoreFuzzy(query: string, queryLower: string, queryLength: number, target: string, targetLower: string, targetLength: number, allowNonContiguousMatches: boolean): FuzzyScore {
	const scores: number[] = [];
	const matches: number[] = [];

	//
	// Build Scorer Matrix:
	//
	// The matrix is composed of query q and target t. For each index we score
	// q[i] with t[i] and compare that with the previous score. If the score is
	// equal or larger, we keep the match. In addition to the score, we also keep
	// the length of the consecutive matches to use as boost for the score.
	//
	//      t   a   r   g   e   t
	//  q
	//  u
	//  e
	//  r
	//  y
	//
	for (let queryIndex = 0; queryIndex < queryLength; queryIndex++) {
		const queryIndexOffset = queryIndex * targetLength;
		const queryIndexPreviousOffset = queryIndexOffset - targetLength;

		const queryIndexGtNull = queryIndex > 0;

		const queryCharAtIndex = query[queryIndex];
		const queryLowerCharAtIndex = queryLower[queryIndex];

		for (let targetIndex = 0; targetIndex < targetLength; targetIndex++) {
			const targetIndexGtNull = targetIndex > 0;

			const currentIndex = queryIndexOffset + targetIndex;
			const leftIndex = currentIndex - 1;
			const diagIndex = queryIndexPreviousOffset + targetIndex - 1;

			const leftScore = targetIndexGtNull ? scores[leftIndex] : 0;
			const diagScore = queryIndexGtNull && targetIndexGtNull ? scores[diagIndex] : 0;

			const matchesSequenceLength = queryIndexGtNull && targetIndexGtNull ? matches[diagIndex] : 0;

			// If we are not matching on the first query character any more, we only produce a
			// score if we had a score previously for the last query index (by looking at the diagScore).
			// This makes sure that the query always matches in sequence on the target. For example
			// given a target of "ede" and a query of "de", we would otherwise produce a wrong high score
			// for query[1] ("e") matching on target[0] ("e") because of the "beginning of word" boost.
			let score: number;
			if (!diagScore && queryIndexGtNull) {
				score = 0;
			} else {
				score = computeCharScore(queryCharAtIndex, queryLowerCharAtIndex, target, targetLower, targetIndex, matchesSequenceLength);
			}

			// We have a score and its equal or larger than the left score
			// Match: sequence continues growing from previous diag value
			// Score: increases by diag score value
			const isValidScore = score && diagScore + score >= leftScore;
			if (isValidScore && (
				// We don't need to check if it's contiguous if we allow non-contiguous matches
				allowNonContiguousMatches ||
				// We must be looking for a contiguous match.
				// Looking at an index higher than 0 in the query means we must have already
				// found out this is contiguous otherwise there wouldn't have been a score
				queryIndexGtNull ||
				// lastly check if the query is completely contiguous at this index in the target
				targetLower.startsWith(queryLower, targetIndex)
			)) {
				matches[currentIndex] = matchesSequenceLength + 1;
				scores[currentIndex] = diagScore + score;
			}

			// We either have no score or the score is lower than the left score
			// Match: reset to 0
			// Score: pick up from left hand side
			else {
				matches[currentIndex] = NO_MATCH;
				scores[currentIndex] = leftScore;
			}
		}
	}

	// Restore Positions (starting from bottom right of matrix)
	const positions: number[] = [];
	let queryIndex = queryLength - 1;
	let targetIndex = targetLength - 1;
	while (queryIndex >= 0 && targetIndex >= 0) {
		const currentIndex = queryIndex * targetLength + targetIndex;
		const match = matches[currentIndex];
		if (match === NO_MATCH) {
			targetIndex--; // go left
		} else {
			positions.push(targetIndex);

			// go up and left
			queryIndex--;
			targetIndex--;
		}
	}

	// Print matrix
	// if (DEBUG_MATRIX) {
	// 	printMatrix(query, target, matches, scores);
	// }

	return [scores[queryLength * targetLength - 1], positions.reverse()];
}

function computeCharScore(queryCharAtIndex: string, queryLowerCharAtIndex: string, target: string, targetLower: string, targetIndex: number, matchesSequenceLength: number): number {
	let score = 0;

	if (!considerAsEqual(queryLowerCharAtIndex, targetLower[targetIndex])) {
		return score; // no match of characters
	}

	// if (DEBUG) {
	// 	console.groupCollapsed(`%cFound a match of char: ${queryLowerCharAtIndex} at index ${targetIndex}`, 'font-weight: normal');
	// }

	// Character match bonus
	score += 1;

	// if (DEBUG) {
	// 	console.log(`%cCharacter match bonus: +1`, 'font-weight: normal');
	// }

	// Consecutive match bonus: sequences up to 3 get the full bonus (6)
	// and the remainder gets half the bonus (3). This helps reduce the
	// overall boost for long sequence matches.
	if (matchesSequenceLength > 0) {
		score += (Math.min(matchesSequenceLength, 3) * 6) + (Math.max(0, matchesSequenceLength - 3) * 3);

		// if (DEBUG) {
		// 	console.log(`Consecutive match bonus: +${matchesSequenceLength * 5}`);
		// }
	}

	// Same case bonus
	if (queryCharAtIndex === target[targetIndex]) {
		score += 1;

		// if (DEBUG) {
		// 	console.log('Same case bonus: +1');
		// }
	}

	// Start of word bonus
	if (targetIndex === 0) {
		score += 8;

		// if (DEBUG) {
		// 	console.log('Start of word bonus: +8');
		// }
	}

	else {

		// After separator bonus
		const separatorBonus = scoreSeparatorAtPos(target.charCodeAt(targetIndex - 1));
		if (separatorBonus) {
			score += separatorBonus;

			// if (DEBUG) {
			// 	console.log(`After separator bonus: +${separatorBonus}`);
			// }
		}

		// Inside word upper case bonus (camel case). We only give this bonus if we're not in a contiguous sequence.
		// For example:
		// NPE => NullPointerException = boost
		// HTTP => HTTP = not boost
		else if (isUpper(target.charCodeAt(targetIndex)) && matchesSequenceLength === 0) {
			score += 2;

			// if (DEBUG) {
			// 	console.log('Inside word upper case bonus: +2');
			// }
		}
	}

	// if (DEBUG) {
	// 	console.log(`Total score: ${score}`);
	// 	console.groupEnd();
	// }

	return score;
}

function considerAsEqual(a: string, b: string): boolean {
	if (a === b) {
		return true;
	}

	// Special case path separators: ignore platform differences
	if (a === '/' || a === '\\') {
		return b === '/' || b === '\\';
	}

	return false;
}

function scoreSeparatorAtPos(charCode: number): number {
	switch (charCode) {
		case CharCode.Slash:
		case CharCode.Backslash:
			return 5; // prefer path separators...
		case CharCode.Underline:
		case CharCode.Dash:
		case CharCode.Period:
		case CharCode.Space:
		case CharCode.SingleQuote:
		case CharCode.DoubleQuote:
		case CharCode.Colon:
			return 4; // ...over other separators
		default:
			return 0;
	}
}

// function printMatrix(query: string, target: string, matches: number[], scores: number[]): void {
// 	console.log('\t' + target.split('').join('\t'));
// 	for (let queryIndex = 0; queryIndex < query.length; queryIndex++) {
// 		let line = query[queryIndex] + '\t';
// 		for (let targetIndex = 0; targetIndex < target.length; targetIndex++) {
// 			const currentIndex = queryIndex * target.length + targetIndex;
// 			line = line + 'M' + matches[currentIndex] + '/' + 'S' + scores[currentIndex] + '\t';
// 		}

// 		console.log(line);
// 	}
// }

//#endregion


//#region Alternate fuzzy scorer implementation that is e.g. used for symbols

export type FuzzyScore2 = [number | undefined /* score */, IMatch[]];

const NO_SCORE2: FuzzyScore2 = [undefined, []];

export function scoreFuzzy2(target: string, query: IPreparedQuery | IPreparedQueryPiece, patternStart = 0, wordStart = 0): FuzzyScore2 {

	// Score: multiple inputs
	const preparedQuery = query as IPreparedQuery;
	if (preparedQuery.values && preparedQuery.values.length > 1) {
		return doScoreFuzzy2Multiple(target, preparedQuery.values, patternStart, wordStart);
	}

	// Score: single input
	return doScoreFuzzy2Single(target, query, patternStart, wordStart);
}

function doScoreFuzzy2Multiple(target: string, query: IPreparedQueryPiece[], patternStart: number, wordStart: number): FuzzyScore2 {
	let totalScore = 0;
	const totalMatches: IMatch[] = [];

	for (const queryPiece of query) {
		const [score, matches] = doScoreFuzzy2Single(target, queryPiece, patternStart, wordStart);
		if (typeof score !== 'number') {
			// if a single query value does not match, return with
			// no score entirely, we require all queries to match
			return NO_SCORE2;
		}

		totalScore += score;
		totalMatches.push(...matches);
	}

	// if we have a score, ensure that the positions are
	// sorted in ascending order and distinct
	return [totalScore, normalizeMatches(totalMatches)];
}

function doScoreFuzzy2Single(target: string, query: IPreparedQueryPiece, patternStart: number, wordStart: number): FuzzyScore2 {
	const score = fuzzyScore(query.original, query.originalLowercase, patternStart, target, target.toLowerCase(), wordStart, { firstMatchCanBeWeak: true, boostFullMatch: true });
	if (!score) {
		return NO_SCORE2;
	}

	return [score[0], createFuzzyMatches(score)];
}

//#endregion


//#region Item (label, description, path) scorer

/**
 * Scoring on structural items that have a label and optional description.
 */
export interface IItemScore {

	/**
	 * Overall score.
	 */
	score: number;

	/**
	 * Matches within the label.
	 */
	labelMatch?: IMatch[];

	/**
	 * Matches within the description.
	 */
	descriptionMatch?: IMatch[];
}

const NO_ITEM_SCORE = Object.freeze<IItemScore>({ score: 0 });

export interface IItemAccessor<T> {

	/**
	 * Just the label of the item to score on.
	 */
	getItemLabel(item: T): string | undefined;

	/**
	 * The optional description of the item to score on.
	 */
	getItemDescription(item: T): string | undefined;

	/**
	 * If the item is a file, the path of the file to score on.
	 */
	getItemPath(file: T): string | undefined;
}

const PATH_IDENTITY_SCORE = 1 << 18;
const LABEL_PREFIX_SCORE_THRESHOLD = 1 << 17;
const LABEL_SCORE_THRESHOLD = 1 << 16;

function getCacheHash(label: string, description: string | undefined, allowNonContiguousMatches: boolean, query: IPreparedQuery) {
	const values = query.values ? query.values : [query];
	const cacheHash = hash({
		[query.normalized]: {
			values: values.map(v => ({ value: v.normalized, expectContiguousMatch: v.expectContiguousMatch })),
			label,
			description,
			allowNonContiguousMatches
		}
	});
	return cacheHash;
}

export function scoreItemFuzzy<T>(item: T, query: IPreparedQuery, allowNonContiguousMatches: boolean, accessor: IItemAccessor<T>, cache: FuzzyScorerCache): IItemScore {
	if (!item || !query.normalized) {
		return NO_ITEM_SCORE; // we need an item and query to score on at least
	}

	const label = accessor.getItemLabel(item);
	if (!label) {
		return NO_ITEM_SCORE; // we need a label at least
	}

	const description = accessor.getItemDescription(item);

	// in order to speed up scoring, we cache the score with a unique hash based on:
	// - label
	// - description (if provided)
	// - whether non-contiguous matching is enabled or not
	// - hash of the query (normalized) values
	const cacheHash = getCacheHash(label, description, allowNonContiguousMatches, query);
	const cached = cache[cacheHash];
	if (cached) {
		return cached;
	}

	const itemScore = doScoreItemFuzzy(label, description, accessor.getItemPath(item), query, allowNonContiguousMatches);
	cache[cacheHash] = itemScore;

	return itemScore;
}

function doScoreItemFuzzy(label: string, description: string | undefined, path: string | undefined, query: IPreparedQuery, allowNonContiguousMatches: boolean): IItemScore {
	const preferLabelMatches = !path || !query.containsPathSeparator;

	// Treat identity matches on full path highest
	if (path && (isLinux ? query.pathNormalized === path : equalsIgnoreCase(query.pathNormalized, path))) {
		return { score: PATH_IDENTITY_SCORE, labelMatch: [{ start: 0, end: label.length }], descriptionMatch: description ? [{ start: 0, end: description.length }] : undefined };
	}

	// Score: multiple inputs
	if (query.values && query.values.length > 1) {
		return doScoreItemFuzzyMultiple(label, description, path, query.values, preferLabelMatches, allowNonContiguousMatches);
	}

	// Score: single input
	return doScoreItemFuzzySingle(label, description, path, query, preferLabelMatches, allowNonContiguousMatches);
}

function doScoreItemFuzzyMultiple(label: string, description: string | undefined, path: string | undefined, query: IPreparedQueryPiece[], preferLabelMatches: boolean, allowNonContiguousMatches: boolean): IItemScore {
	let totalScore = 0;
	const totalLabelMatches: IMatch[] = [];
	const totalDescriptionMatches: IMatch[] = [];

	for (const queryPiece of query) {
		const { score, labelMatch, descriptionMatch } = doScoreItemFuzzySingle(label, description, path, queryPiece, preferLabelMatches, allowNonContiguousMatches);
		if (score === NO_MATCH) {
			// if a single query value does not match, return with
			// no score entirely, we require all queries to match
			return NO_ITEM_SCORE;
		}

		totalScore += score;
		if (labelMatch) {
			totalLabelMatches.push(...labelMatch);
		}

		if (descriptionMatch) {
			totalDescriptionMatches.push(...descriptionMatch);
		}
	}

	// if we have a score, ensure that the positions are
	// sorted in ascending order and distinct
	return {
		score: totalScore,
		labelMatch: normalizeMatches(totalLabelMatches),
		descriptionMatch: normalizeMatches(totalDescriptionMatches)
	};
}

function doScoreItemFuzzySingle(label: string, description: string | undefined, path: string | undefined, query: IPreparedQueryPiece, preferLabelMatches: boolean, allowNonContiguousMatches: boolean): IItemScore {

	// Prefer label matches if told so or we have no description
	if (preferLabelMatches || !description) {
		const [labelScore, labelPositions] = scoreFuzzy(
			label,
			query.normalized,
			query.normalizedLowercase,
			allowNonContiguousMatches && !query.expectContiguousMatch);
		if (labelScore) {

			// If we have a prefix match on the label, we give a much
			// higher baseScore to elevate these matches over others
			// This ensures that typing a file name wins over results
			// that are present somewhere in the label, but not the
			// beginning.
			const labelPrefixMatch = matchesPrefix(query.normalized, label);
			let baseScore: number;
			if (labelPrefixMatch) {
				baseScore = LABEL_PREFIX_SCORE_THRESHOLD;

				// We give another boost to labels that are short, e.g. given
				// files "window.ts" and "windowActions.ts" and a query of
				// "window", we want "window.ts" to receive a higher score.
				// As such we compute the percentage the query has within the
				// label and add that to the baseScore.
				const prefixLengthBoost = Math.round((query.normalized.length / label.length) * 100);
				baseScore += prefixLengthBoost;
			} else {
				baseScore = LABEL_SCORE_THRESHOLD;
			}

			return { score: baseScore + labelScore, labelMatch: labelPrefixMatch || createMatches(labelPositions) };
		}
	}

	// Finally compute description + label scores if we have a description
	if (description) {
		let descriptionPrefix = description;
		if (!!path) {
			descriptionPrefix = `${description}${sep}`; // assume this is a file path
		}

		const descriptionPrefixLength = descriptionPrefix.length;
		const descriptionAndLabel = `${descriptionPrefix}${label}`;

		const [labelDescriptionScore, labelDescriptionPositions] = scoreFuzzy(
			descriptionAndLabel,
			query.normalized,
			query.normalizedLowercase,
			allowNonContiguousMatches && !query.expectContiguousMatch);
		if (labelDescriptionScore) {
			const labelDescriptionMatches = createMatches(labelDescriptionPositions);
			const labelMatch: IMatch[] = [];
			const descriptionMatch: IMatch[] = [];

			// We have to split the matches back onto the label and description portions
			labelDescriptionMatches.forEach(h => {

				// Match overlaps label and description part, we need to split it up
				if (h.start < descriptionPrefixLength && h.end > descriptionPrefixLength) {
					labelMatch.push({ start: 0, end: h.end - descriptionPrefixLength });
					descriptionMatch.push({ start: h.start, end: descriptionPrefixLength });
				}

				// Match on label part
				else if (h.start >= descriptionPrefixLength) {
					labelMatch.push({ start: h.start - descriptionPrefixLength, end: h.end - descriptionPrefixLength });
				}

				// Match on description part
				else {
					descriptionMatch.push(h);
				}
			});

			return { score: labelDescriptionScore, labelMatch, descriptionMatch };
		}
	}

	return NO_ITEM_SCORE;
}

function createMatches(offsets: number[] | undefined): IMatch[] {
	const ret: IMatch[] = [];
	if (!offsets) {
		return ret;
	}

	let last: IMatch | undefined;
	for (const pos of offsets) {
		if (last && last.end === pos) {
			last.end += 1;
		} else {
			last = { start: pos, end: pos + 1 };
			ret.push(last);
		}
	}

	return ret;
}

function normalizeMatches(matches: IMatch[]): IMatch[] {

	// sort matches by start to be able to normalize
	const sortedMatches = matches.sort((matchA, matchB) => {
		return matchA.start - matchB.start;
	});

	// merge matches that overlap
	const normalizedMatches: IMatch[] = [];
	let currentMatch: IMatch | undefined = undefined;
	for (const match of sortedMatches) {

		// if we have no current match or the matches
		// do not overlap, we take it as is and remember
		// it for future merging
		if (!currentMatch || !matchOverlaps(currentMatch, match)) {
			currentMatch = match;
			normalizedMatches.push(match);
		}

		// otherwise we merge the matches
		else {
			currentMatch.start = Math.min(currentMatch.start, match.start);
			currentMatch.end = Math.max(currentMatch.end, match.end);
		}
	}

	return normalizedMatches;
}

function matchOverlaps(matchA: IMatch, matchB: IMatch): boolean {
	if (matchA.end < matchB.start) {
		return false;	// A ends before B starts
	}

	if (matchB.end < matchA.start) {
		return false; // B ends before A starts
	}

	return true;
}

//#endregion


//#region Comparers

export function compareItemsByFuzzyScore<T>(itemA: T, itemB: T, query: IPreparedQuery, allowNonContiguousMatches: boolean, accessor: IItemAccessor<T>, cache: FuzzyScorerCache): number {
	const itemScoreA = scoreItemFuzzy(itemA, query, allowNonContiguousMatches, accessor, cache);
	const itemScoreB = scoreItemFuzzy(itemB, query, allowNonContiguousMatches, accessor, cache);

	const scoreA = itemScoreA.score;
	const scoreB = itemScoreB.score;

	// 1.) identity matches have highest score
	if (scoreA === PATH_IDENTITY_SCORE || scoreB === PATH_IDENTITY_SCORE) {
		if (scoreA !== scoreB) {
			return scoreA === PATH_IDENTITY_SCORE ? -1 : 1;
		}
	}

	// 2.) matches on label are considered higher compared to label+description matches
	if (scoreA > LABEL_SCORE_THRESHOLD || scoreB > LABEL_SCORE_THRESHOLD) {
		if (scoreA !== scoreB) {
			return scoreA > scoreB ? -1 : 1;
		}

		// prefer more compact matches over longer in label (unless this is a prefix match where
		// longer prefix matches are actually preferred)
		if (scoreA < LABEL_PREFIX_SCORE_THRESHOLD && scoreB < LABEL_PREFIX_SCORE_THRESHOLD) {
			const comparedByMatchLength = compareByMatchLength(itemScoreA.labelMatch, itemScoreB.labelMatch);
			if (comparedByMatchLength !== 0) {
				return comparedByMatchLength;
			}
		}

		// prefer shorter labels over longer labels
		const labelA = accessor.getItemLabel(itemA) || '';
		const labelB = accessor.getItemLabel(itemB) || '';
		if (labelA.length !== labelB.length) {
			return labelA.length - labelB.length;
		}
	}

	// 3.) compare by score in label+description
	if (scoreA !== scoreB) {
		return scoreA > scoreB ? -1 : 1;
	}

	// 4.) scores are identical: prefer matches in label over non-label matches
	const itemAHasLabelMatches = Array.isArray(itemScoreA.labelMatch) && itemScoreA.labelMatch.length > 0;
	const itemBHasLabelMatches = Array.isArray(itemScoreB.labelMatch) && itemScoreB.labelMatch.length > 0;
	if (itemAHasLabelMatches && !itemBHasLabelMatches) {
		return -1;
	} else if (itemBHasLabelMatches && !itemAHasLabelMatches) {
		return 1;
	}

	// 5.) scores are identical: prefer more compact matches (label and description)
	const itemAMatchDistance = computeLabelAndDescriptionMatchDistance(itemA, itemScoreA, accessor);
	const itemBMatchDistance = computeLabelAndDescriptionMatchDistance(itemB, itemScoreB, accessor);
	if (itemAMatchDistance && itemBMatchDistance && itemAMatchDistance !== itemBMatchDistance) {
		return itemBMatchDistance > itemAMatchDistance ? -1 : 1;
	}

	// 6.) scores are identical: start to use the fallback compare
	return fallbackCompare(itemA, itemB, query, accessor);
}

function computeLabelAndDescriptionMatchDistance<T>(item: T, score: IItemScore, accessor: IItemAccessor<T>): number {
	let matchStart = -1;
	let matchEnd = -1;

	// If we have description matches, the start is first of description match
	if (score.descriptionMatch?.length) {
		matchStart = score.descriptionMatch[0].start;
	}

	// Otherwise, the start is the first label match
	else if (score.labelMatch?.length) {
		matchStart = score.labelMatch[0].start;
	}

	// If we have label match, the end is the last label match
	// If we had a description match, we add the length of the description
	// as offset to the end to indicate this.
	if (score.labelMatch?.length) {
		matchEnd = score.labelMatch[score.labelMatch.length - 1].end;
		if (score.descriptionMatch?.length) {
			const itemDescription = accessor.getItemDescription(item);
			if (itemDescription) {
				matchEnd += itemDescription.length;
			}
		}
	}

	// If we have just a description match, the end is the last description match
	else if (score.descriptionMatch?.length) {
		matchEnd = score.descriptionMatch[score.descriptionMatch.length - 1].end;
	}

	return matchEnd - matchStart;
}

function compareByMatchLength(matchesA?: IMatch[], matchesB?: IMatch[]): number {
	if ((!matchesA && !matchesB) || ((!matchesA?.length) && (!matchesB?.length))) {
		return 0; // make sure to not cause bad comparing when matches are not provided
	}

	if (!matchesB?.length) {
		return -1;
	}

	if (!matchesA?.length) {
		return 1;
	}

	// Compute match length of A (first to last match)
	const matchStartA = matchesA[0].start;
	const matchEndA = matchesA[matchesA.length - 1].end;
	const matchLengthA = matchEndA - matchStartA;

	// Compute match length of B (first to last match)
	const matchStartB = matchesB[0].start;
	const matchEndB = matchesB[matchesB.length - 1].end;
	const matchLengthB = matchEndB - matchStartB;

	// Prefer shorter match length
	return matchLengthA === matchLengthB ? 0 : matchLengthB < matchLengthA ? 1 : -1;
}

function fallbackCompare<T>(itemA: T, itemB: T, query: IPreparedQuery, accessor: IItemAccessor<T>): number {

	// check for label + description length and prefer shorter
	const labelA = accessor.getItemLabel(itemA) || '';
	const labelB = accessor.getItemLabel(itemB) || '';

	const descriptionA = accessor.getItemDescription(itemA);
	const descriptionB = accessor.getItemDescription(itemB);

	const labelDescriptionALength = labelA.length + (descriptionA ? descriptionA.length : 0);
	const labelDescriptionBLength = labelB.length + (descriptionB ? descriptionB.length : 0);

	if (labelDescriptionALength !== labelDescriptionBLength) {
		return labelDescriptionALength - labelDescriptionBLength;
	}

	// check for path length and prefer shorter
	const pathA = accessor.getItemPath(itemA);
	const pathB = accessor.getItemPath(itemB);

	if (pathA && pathB && pathA.length !== pathB.length) {
		return pathA.length - pathB.length;
	}

	// 7.) finally we have equal scores and equal length, we fallback to comparer

	// compare by label
	if (labelA !== labelB) {
		return compareAnything(labelA, labelB, query.normalized);
	}

	// compare by description
	if (descriptionA && descriptionB && descriptionA !== descriptionB) {
		return compareAnything(descriptionA, descriptionB, query.normalized);
	}

	// compare by path
	if (pathA && pathB && pathA !== pathB) {
		return compareAnything(pathA, pathB, query.normalized);
	}

	// equal
	return 0;
}

//#endregion


//#region Query Normalizer

export interface IPreparedQueryPiece {

	/**
	 * The original query as provided as input.
	 */
	original: string;
	originalLowercase: string;

	/**
	 * Original normalized to platform separators:
	 * - Windows: \
	 * - Posix: /
	 */
	pathNormalized: string;

	/**
	 * In addition to the normalized path, will have
	 * whitespace and wildcards removed.
	 */
	normalized: string;
	normalizedLowercase: string;

	/**
	 * The query is wrapped in quotes which means
	 * this query must be a substring of the input.
	 * In other words, no fuzzy matching is used.
	 */
	expectContiguousMatch: boolean;
}

export interface IPreparedQuery extends IPreparedQueryPiece {

	/**
	 * Query split by spaces into pieces.
	 */
	values: IPreparedQueryPiece[] | undefined;

	/**
	 * Whether the query contains path separator(s) or not.
	 */
	containsPathSeparator: boolean;
}

/*
 * If a query is wrapped in quotes, the user does not want to
 * use fuzzy search for this query.
 */
function queryExpectsExactMatch(query: string) {
	return query.startsWith('"') && query.endsWith('"');
}

/**
 * Helper function to prepare a search value for scoring by removing unwanted characters
 * and allowing to score on multiple pieces separated by whitespace character.
 */
const MULTIPLE_QUERY_VALUES_SEPARATOR = ' ';
export function prepareQuery(original: string): IPreparedQuery {
	if (typeof original !== 'string') {
		original = '';
	}

	const originalLowercase = original.toLowerCase();
	const { pathNormalized, normalized, normalizedLowercase } = normalizeQuery(original);
	const containsPathSeparator = pathNormalized.indexOf(sep) >= 0;
	const expectExactMatch = queryExpectsExactMatch(original);

	let values: IPreparedQueryPiece[] | undefined = undefined;

	const originalSplit = original.split(MULTIPLE_QUERY_VALUES_SEPARATOR);
	if (originalSplit.length > 1) {
		for (const originalPiece of originalSplit) {
			const expectExactMatchPiece = queryExpectsExactMatch(originalPiece);
			const {
				pathNormalized: pathNormalizedPiece,
				normalized: normalizedPiece,
				normalizedLowercase: normalizedLowercasePiece
			} = normalizeQuery(originalPiece);

			if (normalizedPiece) {
				if (!values) {
					values = [];
				}

				values.push({
					original: originalPiece,
					originalLowercase: originalPiece.toLowerCase(),
					pathNormalized: pathNormalizedPiece,
					normalized: normalizedPiece,
					normalizedLowercase: normalizedLowercasePiece,
					expectContiguousMatch: expectExactMatchPiece
				});
			}
		}
	}

	return { original, originalLowercase, pathNormalized, normalized, normalizedLowercase, values, containsPathSeparator, expectContiguousMatch: expectExactMatch };
}

function normalizeQuery(original: string): { pathNormalized: string; normalized: string; normalizedLowercase: string } {
	let pathNormalized: string;
	if (isWindows) {
		pathNormalized = original.replace(/\//g, sep); // Help Windows users to search for paths when using slash
	} else {
		pathNormalized = original.replace(/\\/g, sep); // Help macOS/Linux users to search for paths when using backslash
	}

	// remove certain characters that help find better results:
	// - quotes: are used for exact match search
	// - wildcards: are used for fuzzy matching
	// - whitespace: are used to separate queries
	// - ellipsis: sometimes used to indicate any path segments
	const normalized = pathNormalized.replace(/[\*\u2026\s"]/g, '');

	return {
		pathNormalized,
		normalized,
		normalizedLowercase: normalized.toLowerCase()
	};
}

export function pieceToQuery(piece: IPreparedQueryPiece): IPreparedQuery;
export function pieceToQuery(pieces: IPreparedQueryPiece[]): IPreparedQuery;
export function pieceToQuery(arg1: IPreparedQueryPiece | IPreparedQueryPiece[]): IPreparedQuery {
	if (Array.isArray(arg1)) {
		return prepareQuery(arg1.map(piece => piece.original).join(MULTIPLE_QUERY_VALUES_SEPARATOR));
	}

	return prepareQuery(arg1.original);
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/glob.ts]---
Location: vscode-main/src/vs/base/common/glob.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { equals } from './arrays.js';
import { isThenable } from './async.js';
import { CharCode } from './charCode.js';
import { isEqualOrParent } from './extpath.js';
import { LRUCache } from './map.js';
import { basename, extname, posix, sep } from './path.js';
import { isLinux } from './platform.js';
import { endsWithIgnoreCase, equalsIgnoreCase, escapeRegExpCharacters, ltrim } from './strings.js';

export interface IRelativePattern {

	/**
	 * A base file path to which this pattern will be matched against relatively.
	 */
	readonly base: string;

	/**
	 * A file glob pattern like `*.{ts,js}` that will be matched on file paths
	 * relative to the base path.
	 *
	 * Example: Given a base of `/home/work/folder` and a file path of `/home/work/folder/index.js`,
	 * the file glob pattern will match on `index.js`.
	 */
	readonly pattern: string;
}

export interface IExpression {
	[pattern: string]: boolean | SiblingClause;
}

export function getEmptyExpression(): IExpression {
	return Object.create(null);
}

interface SiblingClause {
	when: string;
}

export const GLOBSTAR = '**';
export const GLOB_SPLIT = '/';

const PATH_REGEX = '[/\\\\]';		// any slash or backslash
const NO_PATH_REGEX = '[^/\\\\]';	// any non-slash and non-backslash
const ALL_FORWARD_SLASHES = /\//g;

function starsToRegExp(starCount: number, isLastPattern?: boolean): string {
	switch (starCount) {
		case 0:
			return '';
		case 1:
			return `${NO_PATH_REGEX}*?`; // 1 star matches any number of characters except path separator (/ and \) - non greedy (?)
		default:
			// Matches:  (Path Sep OR Path Val followed by Path Sep) 0-many times except when it's the last pattern
			//           in which case also matches (Path Sep followed by Path Val)
			// Group is non capturing because we don't need to capture at all (?:...)
			// Overall we use non-greedy matching because it could be that we match too much
			return `(?:${PATH_REGEX}|${NO_PATH_REGEX}+${PATH_REGEX}${isLastPattern ? `|${PATH_REGEX}${NO_PATH_REGEX}+` : ''})*?`;
	}
}

export function splitGlobAware(pattern: string, splitChar: string): string[] {
	if (!pattern) {
		return [];
	}

	const segments: string[] = [];

	let inBraces = false;
	let inBrackets = false;

	let curVal = '';
	for (const char of pattern) {
		switch (char) {
			case splitChar:
				if (!inBraces && !inBrackets) {
					segments.push(curVal);
					curVal = '';

					continue;
				}
				break;
			case '{':
				inBraces = true;
				break;
			case '}':
				inBraces = false;
				break;
			case '[':
				inBrackets = true;
				break;
			case ']':
				inBrackets = false;
				break;
		}

		curVal += char;
	}

	// Tail
	if (curVal) {
		segments.push(curVal);
	}

	return segments;
}

function parseRegExp(pattern: string): string {
	if (!pattern) {
		return '';
	}

	let regEx = '';

	// Split up into segments for each slash found
	const segments = splitGlobAware(pattern, GLOB_SPLIT);

	// Special case where we only have globstars
	if (segments.every(segment => segment === GLOBSTAR)) {
		regEx = '.*';
	}

	// Build regex over segments
	else {
		let previousSegmentWasGlobStar = false;
		segments.forEach((segment, index) => {

			// Treat globstar specially
			if (segment === GLOBSTAR) {

				// if we have more than one globstar after another, just ignore it
				if (previousSegmentWasGlobStar) {
					return;
				}

				regEx += starsToRegExp(2, index === segments.length - 1);
			}

			// Anything else, not globstar
			else {

				// States
				let inBraces = false;
				let braceVal = '';

				let inBrackets = false;
				let bracketVal = '';

				for (const char of segment) {

					// Support brace expansion
					if (char !== '}' && inBraces) {
						braceVal += char;
						continue;
					}

					// Support brackets
					if (inBrackets && (char !== ']' || !bracketVal) /* ] is literally only allowed as first character in brackets to match it */) {
						let res: string;

						// range operator
						if (char === '-') {
							res = char;
						}

						// negation operator (only valid on first index in bracket)
						else if ((char === '^' || char === '!') && !bracketVal) {
							res = '^';
						}

						// glob split matching is not allowed within character ranges
						// see http://man7.org/linux/man-pages/man7/glob.7.html
						else if (char === GLOB_SPLIT) {
							res = '';
						}

						// anything else gets escaped
						else {
							res = escapeRegExpCharacters(char);
						}

						bracketVal += res;
						continue;
					}

					switch (char) {
						case '{':
							inBraces = true;
							continue;

						case '[':
							inBrackets = true;
							continue;

						case '}': {
							const choices = splitGlobAware(braceVal, ',');

							// Converts {foo,bar} => [foo|bar]
							const braceRegExp = `(?:${choices.map(choice => parseRegExp(choice)).join('|')})`;

							regEx += braceRegExp;

							inBraces = false;
							braceVal = '';

							break;
						}

						case ']': {
							regEx += ('[' + bracketVal + ']');

							inBrackets = false;
							bracketVal = '';

							break;
						}

						case '?':
							regEx += NO_PATH_REGEX; // 1 ? matches any single character except path separator (/ and \)
							continue;

						case '*':
							regEx += starsToRegExp(1);
							continue;

						default:
							regEx += escapeRegExpCharacters(char);
					}
				}

				// Tail: Add the slash we had split on if there is more to
				// come and the remaining pattern is not a globstar
				// For example if pattern: some/**/*.js we want the "/" after
				// some to be included in the RegEx to prevent a folder called
				// "something" to match as well.
				if (
					index < segments.length - 1 &&			// more segments to come after this
					(
						segments[index + 1] !== GLOBSTAR ||	// next segment is not **, or...
						index + 2 < segments.length			// ...next segment is ** but there is more segments after that
					)
				) {
					regEx += PATH_REGEX;
				}
			}

			// update globstar state
			previousSegmentWasGlobStar = (segment === GLOBSTAR);
		});
	}

	return regEx;
}

// regexes to check for trivial glob patterns that just check for String#endsWith
const T1 = /^\*\*\/\*\.[\w\.-]+$/; 													// **/*.something
const T2 = /^\*\*\/([\w\.-]+)\/?$/; 												// **/something
const T3 = /^{\*\*\/\*?[\w\.-]+\/?(,\*\*\/\*?[\w\.-]+\/?)*}$/; 						// {**/*.something,**/*.else} or {**/package.json,**/project.json}
const T3_2 = /^{\*\*\/\*?[\w\.-]+(\/(\*\*)?)?(,\*\*\/\*?[\w\.-]+(\/(\*\*)?)?)*}$/; 	// Like T3, with optional trailing /**
const T4 = /^\*\*((\/[\w\.-]+)+)\/?$/; 												// **/something/else
const T5 = /^([\w\.-]+(\/[\w\.-]+)*)\/?$/; 											// something/else

export type ParsedPattern = (path: string, basename?: string) => boolean;

// The `ParsedExpression` returns a `Promise`
// iff `hasSibling` returns a `Promise`.
export type ParsedExpression = (path: string, basename?: string, hasSibling?: (name: string) => boolean | Promise<boolean>) => string | null | Promise<string | null> /* the matching pattern */;

export interface IGlobOptions {

	/**
	 * Simplify patterns for use as exclusion filters during
	 * tree traversal to skip entire subtrees. Cannot be used
	 * outside of a tree traversal.
	 */
	trimForExclusions?: boolean;

	/**
	 * Whether glob pattern matching should be case insensitive.
	 */
	ignoreCase?: boolean;
}

interface IGlobOptionsInternal extends IGlobOptions {
	equals: (a: string, b: string) => boolean;
	endsWith: (str: string, candidate: string) => boolean;
	isEqualOrParent: (base: string, candidate: string) => boolean;
}

interface ParsedStringPattern {
	(path: string, basename?: string): string | null | Promise<string | null> /* the matching pattern */;
	basenames?: string[];
	patterns?: string[];
	allBasenames?: string[];
	allPaths?: string[];
}

interface ParsedExpressionPattern {
	(path: string, basename?: string, name?: string, hasSibling?: (name: string) => boolean | Promise<boolean>): string | null | Promise<string | null> /* the matching pattern */;
	requiresSiblings?: boolean;
	allBasenames?: string[];
	allPaths?: string[];
}

const CACHE = new LRUCache<string, ParsedStringPattern>(10000); // bounded to 10000 elements

const FALSE = function () {
	return false;
};

const NULL = function (): string | null {
	return null;
};

/**
 * Check if a provided parsed pattern or expression
 * is empty - hence it won't ever match anything.
 *
 * See {@link FALSE} and {@link NULL}.
 */
export function isEmptyPattern(pattern: ParsedPattern | ParsedExpression): pattern is (typeof FALSE | typeof NULL) {
	if (pattern === FALSE) {
		return true;
	}

	if (pattern === NULL) {
		return true;
	}

	return false;
}

function parsePattern(arg1: string | IRelativePattern, options: IGlobOptions): ParsedStringPattern {
	if (!arg1) {
		return NULL;
	}

	// Handle relative patterns
	let pattern: string;
	if (typeof arg1 !== 'string') {
		pattern = arg1.pattern;
	} else {
		pattern = arg1;
	}

	// Whitespace trimming
	pattern = pattern.trim();

	const ignoreCase = options.ignoreCase ?? false;
	const internalOptions = {
		...options,
		equals: ignoreCase ? equalsIgnoreCase : (a: string, b: string) => a === b,
		endsWith: ignoreCase ? endsWithIgnoreCase : (str: string, candidate: string) => str.endsWith(candidate),
		// TODO: the '!isLinux' part below is to keep current behavior unchanged, but it should probably be removed
		// in favor of passing correct options from the caller.
		isEqualOrParent: (base: string, candidate: string) => isEqualOrParent(base, candidate, !isLinux || ignoreCase)
	};

	// Check cache
	const patternKey = `${ignoreCase ? pattern.toLowerCase() : pattern}_${!!options.trimForExclusions}_${ignoreCase}`;
	let parsedPattern = CACHE.get(patternKey);
	if (parsedPattern) {
		return wrapRelativePattern(parsedPattern, arg1, internalOptions);
	}

	// Check for Trivials
	let match: RegExpExecArray | null;
	if (T1.test(pattern)) {
		parsedPattern = trivia1(pattern.substring(4), pattern, internalOptions); 			// common pattern: **/*.txt just need endsWith check
	} else if (match = T2.exec(trimForExclusions(pattern, internalOptions))) { 	// common pattern: **/some.txt just need basename check
		parsedPattern = trivia2(match[1], pattern, internalOptions);
	} else if ((options.trimForExclusions ? T3_2 : T3).test(pattern)) { // repetition of common patterns (see above) {**/*.txt,**/*.png}
		parsedPattern = trivia3(pattern, internalOptions);
	} else if (match = T4.exec(trimForExclusions(pattern, internalOptions))) { 	// common pattern: **/something/else just need endsWith check
		parsedPattern = trivia4and5(match[1].substring(1), pattern, true, internalOptions);
	} else if (match = T5.exec(trimForExclusions(pattern, internalOptions))) { 	// common pattern: something/else just need equals check
		parsedPattern = trivia4and5(match[1], pattern, false, internalOptions);
	}

	// Otherwise convert to pattern
	else {
		parsedPattern = toRegExp(pattern, internalOptions);
	}

	// Cache
	CACHE.set(patternKey, parsedPattern);

	return wrapRelativePattern(parsedPattern, arg1, internalOptions);
}

function wrapRelativePattern(parsedPattern: ParsedStringPattern, arg2: string | IRelativePattern, options: IGlobOptionsInternal): ParsedStringPattern {
	if (typeof arg2 === 'string') {
		return parsedPattern;
	}

	const wrappedPattern: ParsedStringPattern = function (path, basename) {
		if (!options.isEqualOrParent(path, arg2.base)) {
			// skip glob matching if `base` is not a parent of `path`
			return null;
		}

		// Given we have checked `base` being a parent of `path`,
		// we can now remove the `base` portion of the `path`
		// and only match on the remaining path components
		// For that we try to extract the portion of the `path`
		// that comes after the `base` portion. We have to account
		// for the fact that `base` might end in a path separator
		// (https://github.com/microsoft/vscode/issues/162498)

		return parsedPattern(ltrim(path.substring(arg2.base.length), sep), basename);
	};

	// Make sure to preserve associated metadata
	wrappedPattern.allBasenames = parsedPattern.allBasenames;
	wrappedPattern.allPaths = parsedPattern.allPaths;
	wrappedPattern.basenames = parsedPattern.basenames;
	wrappedPattern.patterns = parsedPattern.patterns;

	return wrappedPattern;
}

function trimForExclusions(pattern: string, options: IGlobOptions): string {
	return options.trimForExclusions && pattern.endsWith('/**') ? pattern.substring(0, pattern.length - 2) : pattern; // dropping **, tailing / is dropped later
}

// common pattern: **/*.txt just need endsWith check
function trivia1(base: string, pattern: string, options: IGlobOptionsInternal): ParsedStringPattern {
	return function (path: string, basename?: string) {
		return typeof path === 'string' && options.endsWith(path, base) ? pattern : null;
	};
}

// common pattern: **/some.txt just need basename check
function trivia2(base: string, pattern: string, options: IGlobOptionsInternal): ParsedStringPattern {
	const slashBase = `/${base}`;
	const backslashBase = `\\${base}`;

	const parsedPattern: ParsedStringPattern = function (path: string, basename?: string) {
		if (typeof path !== 'string') {
			return null;
		}

		if (basename) {
			return options.equals(basename, base) ? pattern : null;
		}

		return options.equals(path, base) || options.endsWith(path, slashBase) || options.endsWith(path, backslashBase) ? pattern : null;
	};

	const basenames = [base];
	parsedPattern.basenames = basenames;
	parsedPattern.patterns = [pattern];
	parsedPattern.allBasenames = basenames;

	return parsedPattern;
}

// repetition of common patterns (see above) {**/*.txt,**/*.png}
function trivia3(pattern: string, options: IGlobOptionsInternal): ParsedStringPattern {
	const parsedPatterns = aggregateBasenameMatches(pattern.slice(1, -1)
		.split(',')
		.map(pattern => parsePattern(pattern, options))
		.filter(pattern => pattern !== NULL), pattern);

	const patternsLength = parsedPatterns.length;
	if (!patternsLength) {
		return NULL;
	}

	if (patternsLength === 1) {
		return parsedPatterns[0];
	}

	const parsedPattern: ParsedStringPattern = function (path: string, basename?: string) {
		for (let i = 0, n = parsedPatterns.length; i < n; i++) {
			if (parsedPatterns[i](path, basename)) {
				return pattern;
			}
		}

		return null;
	};

	const withBasenames = parsedPatterns.find(pattern => !!pattern.allBasenames);
	if (withBasenames) {
		parsedPattern.allBasenames = withBasenames.allBasenames;
	}

	const allPaths = parsedPatterns.reduce((all, current) => current.allPaths ? all.concat(current.allPaths) : all, [] as string[]);
	if (allPaths.length) {
		parsedPattern.allPaths = allPaths;
	}

	return parsedPattern;
}

// common patterns: **/something/else just need endsWith check, something/else just needs and equals check
function trivia4and5(targetPath: string, pattern: string, matchPathEnds: boolean, options: IGlobOptionsInternal): ParsedStringPattern {
	const usingPosixSep = sep === posix.sep;
	const nativePath = usingPosixSep ? targetPath : targetPath.replace(ALL_FORWARD_SLASHES, sep);
	const nativePathEnd = sep + nativePath;
	const targetPathEnd = posix.sep + targetPath;

	let parsedPattern: ParsedStringPattern;
	if (matchPathEnds) {
		parsedPattern = function (path: string, basename?: string) {
			return typeof path === 'string' && (
				(options.equals(path, nativePath) || options.endsWith(path, nativePathEnd)) ||
				!usingPosixSep && (options.equals(path, targetPath) || options.endsWith(path, targetPathEnd))
			) ? pattern : null;
		};
	} else {
		parsedPattern = function (path: string, basename?: string) {
			return typeof path === 'string' && (options.equals(path, nativePath) || (!usingPosixSep && options.equals(path, targetPath))) ? pattern : null;
		};
	}

	parsedPattern.allPaths = [(matchPathEnds ? '*/' : './') + targetPath];

	return parsedPattern;
}

function toRegExp(pattern: string, options: IGlobOptions): ParsedStringPattern {
	try {
		const regExp = new RegExp(`^${parseRegExp(pattern)}$`, options.ignoreCase ? 'i' : undefined);
		return function (path: string) {
			regExp.lastIndex = 0; // reset RegExp to its initial state to reuse it!

			return typeof path === 'string' && regExp.test(path) ? pattern : null;
		};
	} catch {
		return NULL;
	}
}

/**
 * Simplified glob matching. Supports a subset of glob patterns:
 * * `*` to match zero or more characters in a path segment
 * * `?` to match on one character in a path segment
 * * `**` to match any number of path segments, including none
 * * `{}` to group conditions (e.g. *.{ts,js} matches all TypeScript and JavaScript files)
 * * `[]` to declare a range of characters to match in a path segment (e.g., `example.[0-9]` to match on `example.0`, `example.1`, …)
 * * `[!...]` to negate a range of characters to match in a path segment (e.g., `example.[!0-9]` to match on `example.a`, `example.b`, but not `example.0`)
 */
export function match(pattern: string | IRelativePattern, path: string, options?: IGlobOptions): boolean;
export function match(expression: IExpression, path: string, options?: IGlobOptions): boolean;
export function match(arg1: string | IExpression | IRelativePattern, path: string, options?: IGlobOptions): boolean {
	if (!arg1 || typeof path !== 'string') {
		return false;
	}

	return parse(arg1, options)(path) as boolean;
}

/**
 * Simplified glob matching. Supports a subset of glob patterns:
 * * `*` to match zero or more characters in a path segment
 * * `?` to match on one character in a path segment
 * * `**` to match any number of path segments, including none
 * * `{}` to group conditions (e.g. *.{ts,js} matches all TypeScript and JavaScript files)
 * * `[]` to declare a range of characters to match in a path segment (e.g., `example.[0-9]` to match on `example.0`, `example.1`, …)
 * * `[!...]` to negate a range of characters to match in a path segment (e.g., `example.[!0-9]` to match on `example.a`, `example.b`, but not `example.0`)
 */
export function parse(pattern: string | IRelativePattern, options?: IGlobOptions): ParsedPattern;
export function parse(expression: IExpression, options?: IGlobOptions): ParsedExpression;
export function parse(arg1: string | IExpression | IRelativePattern, options?: IGlobOptions): ParsedPattern | ParsedExpression;
export function parse(arg1: string | IExpression | IRelativePattern, options: IGlobOptions = {}): ParsedPattern | ParsedExpression {
	if (!arg1) {
		return FALSE;
	}

	// Glob with String
	if (typeof arg1 === 'string' || isRelativePattern(arg1)) {
		const parsedPattern = parsePattern(arg1, options);
		if (parsedPattern === NULL) {
			return FALSE;
		}

		const resultPattern: ParsedPattern & { allBasenames?: string[]; allPaths?: string[] } = function (path: string, basename?: string) {
			return !!parsedPattern(path, basename);
		};

		if (parsedPattern.allBasenames) {
			resultPattern.allBasenames = parsedPattern.allBasenames;
		}

		if (parsedPattern.allPaths) {
			resultPattern.allPaths = parsedPattern.allPaths;
		}

		return resultPattern;
	}

	// Glob with Expression
	return parsedExpression(arg1, options);
}

export function isRelativePattern(obj: unknown): obj is IRelativePattern {
	const rp = obj as IRelativePattern | undefined | null;
	if (!rp) {
		return false;
	}

	return typeof rp.base === 'string' && typeof rp.pattern === 'string';
}

export function getBasenameTerms(patternOrExpression: ParsedPattern | ParsedExpression): string[] {
	return (<ParsedStringPattern>patternOrExpression).allBasenames || [];
}

export function getPathTerms(patternOrExpression: ParsedPattern | ParsedExpression): string[] {
	return (<ParsedStringPattern>patternOrExpression).allPaths || [];
}

function parsedExpression(expression: IExpression, options: IGlobOptions): ParsedExpression {
	const parsedPatterns = aggregateBasenameMatches(Object.getOwnPropertyNames(expression)
		.map(pattern => parseExpressionPattern(pattern, expression[pattern], options))
		.filter(pattern => pattern !== NULL));

	const patternsLength = parsedPatterns.length;
	if (!patternsLength) {
		return NULL;
	}

	if (!parsedPatterns.some(parsedPattern => !!(<ParsedExpressionPattern>parsedPattern).requiresSiblings)) {
		if (patternsLength === 1) {
			return parsedPatterns[0] as ParsedStringPattern;
		}

		const resultExpression: ParsedStringPattern = function (path: string, basename?: string) {
			let resultPromises: Promise<string | null>[] | undefined = undefined;

			for (let i = 0, n = parsedPatterns.length; i < n; i++) {
				const result = parsedPatterns[i](path, basename);
				if (typeof result === 'string') {
					return result; // immediately return as soon as the first expression matches
				}

				// If the result is a promise, we have to keep it for
				// later processing and await the result properly.
				if (isThenable(result)) {
					if (!resultPromises) {
						resultPromises = [];
					}

					resultPromises.push(result);
				}
			}

			// With result promises, we have to loop over each and
			// await the result before we can return any result.
			if (resultPromises) {
				return (async () => {
					for (const resultPromise of resultPromises) {
						const result = await resultPromise;
						if (typeof result === 'string') {
							return result;
						}
					}

					return null;
				})();
			}

			return null;
		};

		const withBasenames = parsedPatterns.find(pattern => !!pattern.allBasenames);
		if (withBasenames) {
			resultExpression.allBasenames = withBasenames.allBasenames;
		}

		const allPaths = parsedPatterns.reduce((all, current) => current.allPaths ? all.concat(current.allPaths) : all, [] as string[]);
		if (allPaths.length) {
			resultExpression.allPaths = allPaths;
		}

		return resultExpression;
	}

	const resultExpression: ParsedStringPattern = function (path: string, base?: string, hasSibling?: (name: string) => boolean | Promise<boolean>) {
		let name: string | undefined = undefined;
		let resultPromises: Promise<string | null>[] | undefined = undefined;

		for (let i = 0, n = parsedPatterns.length; i < n; i++) {

			// Pattern matches path
			const parsedPattern = (<ParsedExpressionPattern>parsedPatterns[i]);
			if (parsedPattern.requiresSiblings && hasSibling) {
				if (!base) {
					base = basename(path);
				}

				if (!name) {
					name = base.substring(0, base.length - extname(path).length);
				}
			}

			const result = parsedPattern(path, base, name, hasSibling);
			if (typeof result === 'string') {
				return result; // immediately return as soon as the first expression matches
			}

			// If the result is a promise, we have to keep it for
			// later processing and await the result properly.
			if (isThenable(result)) {
				if (!resultPromises) {
					resultPromises = [];
				}

				resultPromises.push(result);
			}
		}

		// With result promises, we have to loop over each and
		// await the result before we can return any result.
		if (resultPromises) {
			return (async () => {
				for (const resultPromise of resultPromises) {
					const result = await resultPromise;
					if (typeof result === 'string') {
						return result;
					}
				}

				return null;
			})();
		}

		return null;
	};

	const withBasenames = parsedPatterns.find(pattern => !!pattern.allBasenames);
	if (withBasenames) {
		resultExpression.allBasenames = withBasenames.allBasenames;
	}

	const allPaths = parsedPatterns.reduce((all, current) => current.allPaths ? all.concat(current.allPaths) : all, [] as string[]);
	if (allPaths.length) {
		resultExpression.allPaths = allPaths;
	}

	return resultExpression;
}

function parseExpressionPattern(pattern: string, value: boolean | SiblingClause, options: IGlobOptions): (ParsedStringPattern | ParsedExpressionPattern) {
	if (value === false) {
		return NULL; // pattern is disabled
	}

	const parsedPattern = parsePattern(pattern, options);
	if (parsedPattern === NULL) {
		return NULL;
	}

	// Expression Pattern is <boolean>
	if (typeof value === 'boolean') {
		return parsedPattern;
	}

	// Expression Pattern is <SiblingClause>
	if (value) {
		const when = value.when;
		if (typeof when === 'string') {
			const result: ParsedExpressionPattern = (path: string, basename?: string, name?: string, hasSibling?: (name: string) => boolean | Promise<boolean>) => {
				if (!hasSibling || !parsedPattern(path, basename)) {
					return null;
				}

				const clausePattern = when.replace('$(basename)', () => name!);
				const matched = hasSibling(clausePattern);
				return isThenable(matched) ?
					matched.then(match => match ? pattern : null) :
					matched ? pattern : null;
			};

			result.requiresSiblings = true;

			return result;
		}
	}

	// Expression is anything
	return parsedPattern;
}

function aggregateBasenameMatches(parsedPatterns: Array<ParsedStringPattern | ParsedExpressionPattern>, result?: string): Array<ParsedStringPattern | ParsedExpressionPattern> {
	const basenamePatterns = parsedPatterns.filter(parsedPattern => !!(<ParsedStringPattern>parsedPattern).basenames);
	if (basenamePatterns.length < 2) {
		return parsedPatterns;
	}

	const basenames = basenamePatterns.reduce<string[]>((all, current) => {
		const basenames = (<ParsedStringPattern>current).basenames;

		return basenames ? all.concat(basenames) : all;
	}, [] as string[]);

	let patterns: string[];
	if (result) {
		patterns = [];

		for (let i = 0, n = basenames.length; i < n; i++) {
			patterns.push(result);
		}
	} else {
		patterns = basenamePatterns.reduce((all, current) => {
			const patterns = (<ParsedStringPattern>current).patterns;

			return patterns ? all.concat(patterns) : all;
		}, [] as string[]);
	}

	const aggregate: ParsedStringPattern = function (path: string, basename?: string) {
		if (typeof path !== 'string') {
			return null;
		}

		if (!basename) {
			let i: number;
			for (i = path.length; i > 0; i--) {
				const ch = path.charCodeAt(i - 1);
				if (ch === CharCode.Slash || ch === CharCode.Backslash) {
					break;
				}
			}

			basename = path.substring(i);
		}

		const index = basenames.indexOf(basename);
		return index !== -1 ? patterns[index] : null;
	};

	aggregate.basenames = basenames;
	aggregate.patterns = patterns;
	aggregate.allBasenames = basenames;

	const aggregatedPatterns = parsedPatterns.filter(parsedPattern => !(<ParsedStringPattern>parsedPattern).basenames);
	aggregatedPatterns.push(aggregate);

	return aggregatedPatterns;
}

// NOTE: This is not used for actual matching, only for resetting watcher when patterns change.
// That is why it's ok to avoid case-insensitive comparison here.
export function patternsEquals(patternsA: Array<string | IRelativePattern> | undefined, patternsB: Array<string | IRelativePattern> | undefined): boolean {
	return equals(patternsA, patternsB, (a, b) => {
		if (typeof a === 'string' && typeof b === 'string') {
			return a === b;
		}

		if (typeof a !== 'string' && typeof b !== 'string') {
			return a.base === b.base && a.pattern === b.pattern;
		}

		return false;
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/hash.ts]---
Location: vscode-main/src/vs/base/common/hash.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { encodeHex, VSBuffer } from './buffer.js';
import * as strings from './strings.js';

type NotSyncHashable = ArrayBufferLike | ArrayBufferView;

/**
 * Return a hash value for an object.
 *
 * Note that this should not be used for binary data types. Instead,
 * prefer {@link hashAsync}.
 */
export function hash<T>(obj: T extends NotSyncHashable ? never : T): number {
	return doHash(obj, 0);
}

export function doHash(obj: unknown, hashVal: number): number {
	switch (typeof obj) {
		case 'object':
			if (obj === null) {
				return numberHash(349, hashVal);
			} else if (Array.isArray(obj)) {
				return arrayHash(obj, hashVal);
			}
			return objectHash(obj, hashVal);
		case 'string':
			return stringHash(obj, hashVal);
		case 'boolean':
			return booleanHash(obj, hashVal);
		case 'number':
			return numberHash(obj, hashVal);
		case 'undefined':
			return numberHash(937, hashVal);
		default:
			return numberHash(617, hashVal);
	}
}

export function numberHash(val: number, initialHashVal: number): number {
	return (((initialHashVal << 5) - initialHashVal) + val) | 0;  // hashVal * 31 + ch, keep as int32
}

function booleanHash(b: boolean, initialHashVal: number): number {
	return numberHash(b ? 433 : 863, initialHashVal);
}

export function stringHash(s: string, hashVal: number) {
	hashVal = numberHash(149417, hashVal);
	for (let i = 0, length = s.length; i < length; i++) {
		hashVal = numberHash(s.charCodeAt(i), hashVal);
	}
	return hashVal;
}

function arrayHash(arr: unknown[], initialHashVal: number): number {
	initialHashVal = numberHash(104579, initialHashVal);
	return arr.reduce<number>((hashVal, item) => doHash(item, hashVal), initialHashVal);
}

function objectHash(obj: object, initialHashVal: number): number {
	initialHashVal = numberHash(181387, initialHashVal);
	return Object.keys(obj).sort().reduce((hashVal, key) => {
		hashVal = stringHash(key, hashVal);
		return doHash((obj as Record<string, unknown>)[key], hashVal);
	}, initialHashVal);
}



/** Hashes the input as SHA-1, returning a hex-encoded string. */
export const hashAsync = (input: string | ArrayBufferView | VSBuffer) => {
	// Note: I would very much like to expose a streaming interface for hashing
	// generally, but this is not available in web crypto yet, see
	// https://github.com/w3c/webcrypto/issues/73

	// StringSHA1 is faster for small string input, use it since we have it:
	if (typeof input === 'string' && input.length < 250) {
		const sha = new StringSHA1();
		sha.update(input);
		return Promise.resolve(sha.digest());
	}

	let buff: ArrayBufferView;
	if (typeof input === 'string') {
		buff = new TextEncoder().encode(input);
	} else if (input instanceof VSBuffer) {
		buff = input.buffer;
	} else {
		buff = input;
	}

	return crypto.subtle.digest('sha-1', buff as ArrayBufferView<ArrayBuffer>).then(toHexString); // CodeQL [SM04514] we use sha1 here for validating old stored client state, not for security
};

const enum SHA1Constant {
	BLOCK_SIZE = 64, // 512 / 8
	UNICODE_REPLACEMENT = 0xFFFD,
}

function leftRotate(value: number, bits: number, totalBits: number = 32): number {
	// delta + bits = totalBits
	const delta = totalBits - bits;

	// All ones, expect `delta` zeros aligned to the right
	const mask = ~((1 << delta) - 1);

	// Join (value left-shifted `bits` bits) with (masked value right-shifted `delta` bits)
	return ((value << bits) | ((mask & value) >>> delta)) >>> 0;
}

function toHexString(buffer: ArrayBuffer): string;
function toHexString(value: number, bitsize?: number): string;
function toHexString(bufferOrValue: ArrayBuffer | number, bitsize: number = 32): string {
	if (bufferOrValue instanceof ArrayBuffer) {
		return encodeHex(VSBuffer.wrap(new Uint8Array(bufferOrValue)));
	}

	return (bufferOrValue >>> 0).toString(16).padStart(bitsize / 4, '0');
}

/**
 * A SHA1 implementation that works with strings and does not allocate.
 *
 * Prefer to use {@link hashAsync} in async contexts
 */
export class StringSHA1 {
	private static _bigBlock32 = new DataView(new ArrayBuffer(320)); // 80 * 4 = 320

	private _h0 = 0x67452301;
	private _h1 = 0xEFCDAB89;
	private _h2 = 0x98BADCFE;
	private _h3 = 0x10325476;
	private _h4 = 0xC3D2E1F0;

	private readonly _buff: Uint8Array;
	private readonly _buffDV: DataView;
	private _buffLen: number;
	private _totalLen: number;
	private _leftoverHighSurrogate: number;
	private _finished: boolean;

	constructor() {
		this._buff = new Uint8Array(SHA1Constant.BLOCK_SIZE + 3 /* to fit any utf-8 */);
		this._buffDV = new DataView(this._buff.buffer);
		this._buffLen = 0;
		this._totalLen = 0;
		this._leftoverHighSurrogate = 0;
		this._finished = false;
	}

	public update(str: string): void {
		const strLen = str.length;
		if (strLen === 0) {
			return;
		}

		const buff = this._buff;
		let buffLen = this._buffLen;
		let leftoverHighSurrogate = this._leftoverHighSurrogate;
		let charCode: number;
		let offset: number;

		if (leftoverHighSurrogate !== 0) {
			charCode = leftoverHighSurrogate;
			offset = -1;
			leftoverHighSurrogate = 0;
		} else {
			charCode = str.charCodeAt(0);
			offset = 0;
		}

		while (true) {
			let codePoint = charCode;
			if (strings.isHighSurrogate(charCode)) {
				if (offset + 1 < strLen) {
					const nextCharCode = str.charCodeAt(offset + 1);
					if (strings.isLowSurrogate(nextCharCode)) {
						offset++;
						codePoint = strings.computeCodePoint(charCode, nextCharCode);
					} else {
						// illegal => unicode replacement character
						codePoint = SHA1Constant.UNICODE_REPLACEMENT;
					}
				} else {
					// last character is a surrogate pair
					leftoverHighSurrogate = charCode;
					break;
				}
			} else if (strings.isLowSurrogate(charCode)) {
				// illegal => unicode replacement character
				codePoint = SHA1Constant.UNICODE_REPLACEMENT;
			}

			buffLen = this._push(buff, buffLen, codePoint);
			offset++;
			if (offset < strLen) {
				charCode = str.charCodeAt(offset);
			} else {
				break;
			}
		}

		this._buffLen = buffLen;
		this._leftoverHighSurrogate = leftoverHighSurrogate;
	}

	private _push(buff: Uint8Array, buffLen: number, codePoint: number): number {
		if (codePoint < 0x0080) {
			buff[buffLen++] = codePoint;
		} else if (codePoint < 0x0800) {
			buff[buffLen++] = 0b11000000 | ((codePoint & 0b00000000000000000000011111000000) >>> 6);
			buff[buffLen++] = 0b10000000 | ((codePoint & 0b00000000000000000000000000111111) >>> 0);
		} else if (codePoint < 0x10000) {
			buff[buffLen++] = 0b11100000 | ((codePoint & 0b00000000000000001111000000000000) >>> 12);
			buff[buffLen++] = 0b10000000 | ((codePoint & 0b00000000000000000000111111000000) >>> 6);
			buff[buffLen++] = 0b10000000 | ((codePoint & 0b00000000000000000000000000111111) >>> 0);
		} else {
			buff[buffLen++] = 0b11110000 | ((codePoint & 0b00000000000111000000000000000000) >>> 18);
			buff[buffLen++] = 0b10000000 | ((codePoint & 0b00000000000000111111000000000000) >>> 12);
			buff[buffLen++] = 0b10000000 | ((codePoint & 0b00000000000000000000111111000000) >>> 6);
			buff[buffLen++] = 0b10000000 | ((codePoint & 0b00000000000000000000000000111111) >>> 0);
		}

		if (buffLen >= SHA1Constant.BLOCK_SIZE) {
			this._step();
			buffLen -= SHA1Constant.BLOCK_SIZE;
			this._totalLen += SHA1Constant.BLOCK_SIZE;
			// take last 3 in case of UTF8 overflow
			buff[0] = buff[SHA1Constant.BLOCK_SIZE + 0];
			buff[1] = buff[SHA1Constant.BLOCK_SIZE + 1];
			buff[2] = buff[SHA1Constant.BLOCK_SIZE + 2];
		}

		return buffLen;
	}

	public digest(): string {
		if (!this._finished) {
			this._finished = true;
			if (this._leftoverHighSurrogate) {
				// illegal => unicode replacement character
				this._leftoverHighSurrogate = 0;
				this._buffLen = this._push(this._buff, this._buffLen, SHA1Constant.UNICODE_REPLACEMENT);
			}
			this._totalLen += this._buffLen;
			this._wrapUp();
		}

		return toHexString(this._h0) + toHexString(this._h1) + toHexString(this._h2) + toHexString(this._h3) + toHexString(this._h4);
	}

	private _wrapUp(): void {
		this._buff[this._buffLen++] = 0x80;
		this._buff.subarray(this._buffLen).fill(0);

		if (this._buffLen > 56) {
			this._step();
			this._buff.fill(0);
		}

		// this will fit because the mantissa can cover up to 52 bits
		const ml = 8 * this._totalLen;

		this._buffDV.setUint32(56, Math.floor(ml / 4294967296), false);
		this._buffDV.setUint32(60, ml % 4294967296, false);

		this._step();
	}

	private _step(): void {
		const bigBlock32 = StringSHA1._bigBlock32;
		const data = this._buffDV;

		for (let j = 0; j < 64 /* 16*4 */; j += 4) {
			bigBlock32.setUint32(j, data.getUint32(j, false), false);
		}

		for (let j = 64; j < 320 /* 80*4 */; j += 4) {
			bigBlock32.setUint32(j, leftRotate((bigBlock32.getUint32(j - 12, false) ^ bigBlock32.getUint32(j - 32, false) ^ bigBlock32.getUint32(j - 56, false) ^ bigBlock32.getUint32(j - 64, false)), 1), false);
		}

		let a = this._h0;
		let b = this._h1;
		let c = this._h2;
		let d = this._h3;
		let e = this._h4;

		let f: number, k: number;
		let temp: number;

		for (let j = 0; j < 80; j++) {
			if (j < 20) {
				f = (b & c) | ((~b) & d);
				k = 0x5A827999;
			} else if (j < 40) {
				f = b ^ c ^ d;
				k = 0x6ED9EBA1;
			} else if (j < 60) {
				f = (b & c) | (b & d) | (c & d);
				k = 0x8F1BBCDC;
			} else {
				f = b ^ c ^ d;
				k = 0xCA62C1D6;
			}

			temp = (leftRotate(a, 5) + f + e + k + bigBlock32.getUint32(j * 4, false)) & 0xffffffff;
			e = d;
			d = c;
			c = leftRotate(b, 30);
			b = a;
			a = temp;
		}

		this._h0 = (this._h0 + a) & 0xffffffff;
		this._h1 = (this._h1 + b) & 0xffffffff;
		this._h2 = (this._h2 + c) & 0xffffffff;
		this._h3 = (this._h3 + d) & 0xffffffff;
		this._h4 = (this._h4 + e) & 0xffffffff;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/hierarchicalKind.ts]---
Location: vscode-main/src/vs/base/common/hierarchicalKind.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export class HierarchicalKind {
	public static readonly sep = '.';

	public static readonly None = new HierarchicalKind('@@none@@'); // Special kind that matches nothing
	public static readonly Empty = new HierarchicalKind('');

	constructor(
		public readonly value: string
	) { }

	public equals(other: HierarchicalKind): boolean {
		return this.value === other.value;
	}

	public contains(other: HierarchicalKind): boolean {
		return this.equals(other) || this.value === '' || other.value.startsWith(this.value + HierarchicalKind.sep);
	}

	public intersects(other: HierarchicalKind): boolean {
		return this.contains(other) || other.contains(this);
	}

	public append(...parts: string[]): HierarchicalKind {
		return new HierarchicalKind((this.value ? [this.value, ...parts] : parts).join(HierarchicalKind.sep));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/history.ts]---
Location: vscode-main/src/vs/base/common/history.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SetWithKey } from './collections.js';
import { Event } from './event.js';
import { IDisposable } from './lifecycle.js';
import { ArrayNavigator, INavigator } from './navigator.js';

export interface IHistory<T> {
	delete(t: T): boolean;
	add(t: T): this;
	has(t: T): boolean;
	clear(): void;
	forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: unknown): void;
	replace?(t: T[]): void;
	readonly onDidChange?: Event<string[]>;
}

export class HistoryNavigator<T> implements INavigator<T> {
	private _limit: number;
	private _navigator!: ArrayNavigator<T>;
	private _disposable: IDisposable | undefined;

	constructor(
		private _history: IHistory<T> = new Set(),
		limit: number = 10,
	) {
		this._limit = limit;
		this._onChange();
		if (this._history.onDidChange) {
			this._disposable = this._history.onDidChange(() => this._onChange());
		}
	}

	public getHistory(): T[] {
		return this._elements;
	}

	public add(t: T) {
		this._history.delete(t);
		this._history.add(t);
		this._onChange();
	}

	public next(): T | null {
		// This will navigate past the end of the last element, and in that case the input should be cleared
		return this._navigator.next();
	}

	public previous(): T | null {
		if (this._currentPosition() !== 0) {
			return this._navigator.previous();
		}
		return null;
	}

	public current(): T | null {
		return this._navigator.current();
	}

	public first(): T | null {
		return this._navigator.first();
	}

	public last(): T | null {
		return this._navigator.last();
	}

	public isFirst(): boolean {
		return this._currentPosition() === 0;
	}

	public isLast(): boolean {
		return this._currentPosition() >= this._elements.length - 1;
	}

	public isNowhere(): boolean {
		return this._navigator.current() === null;
	}

	public has(t: T): boolean {
		return this._history.has(t);
	}

	public clear(): void {
		this._history.clear();
		this._onChange();
	}

	private _onChange() {
		this._reduceToLimit();
		const elements = this._elements;
		this._navigator = new ArrayNavigator(elements, 0, elements.length, elements.length);
	}

	private _reduceToLimit() {
		const data = this._elements;
		if (data.length > this._limit) {
			const replaceValue = data.slice(data.length - this._limit);
			if (this._history.replace) {
				this._history.replace(replaceValue);
			} else {
				this._history = new Set(replaceValue);
			}
		}
	}

	private _currentPosition(): number {
		const currentElement = this._navigator.current();
		if (!currentElement) {
			return -1;
		}

		return this._elements.indexOf(currentElement);
	}

	private get _elements(): T[] {
		const elements: T[] = [];
		this._history.forEach(e => elements.push(e));
		return elements;
	}

	public dispose(): void {
		if (this._disposable) {
			this._disposable.dispose();
			this._disposable = undefined;
		}
	}
}

interface HistoryNode<T> {
	value: T;
	previous: HistoryNode<T> | undefined;
	next: HistoryNode<T> | undefined;
}

/**
 * The right way to use HistoryNavigator2 is for the last item in the list to be the user's uncommitted current text. eg empty string, or whatever has been typed. Then
 * the user can navigate away from the last item through the list, and back to it. When updating the last item, call replaceLast.
 */
export class HistoryNavigator2<T> {

	private valueSet: Set<T>;
	private head: HistoryNode<T>;
	private tail: HistoryNode<T>;
	private cursor: HistoryNode<T>;
	private _size: number;
	get size(): number { return this._size; }

	constructor(history: readonly T[], private capacity: number = 10, private identityFn: (t: T) => unknown = t => t) {
		if (history.length < 1) {
			throw new Error('not supported');
		}

		this._size = 1;
		this.head = this.tail = this.cursor = {
			value: history[0],
			previous: undefined,
			next: undefined
		};

		this.valueSet = new SetWithKey<T>([history[0]], identityFn);
		for (let i = 1; i < history.length; i++) {
			this.add(history[i]);
		}
	}

	add(value: T): void {
		const node: HistoryNode<T> = {
			value,
			previous: this.tail,
			next: undefined
		};

		this.tail.next = node;
		this.tail = node;
		this.cursor = this.tail;
		this._size++;

		if (this.valueSet.has(value)) {
			this._deleteFromList(value);
		} else {
			this.valueSet.add(value);
		}

		while (this._size > this.capacity) {
			this.valueSet.delete(this.head.value);

			this.head = this.head.next!;
			this.head.previous = undefined;
			this._size--;
		}
	}

	/**
	 * @returns old last value
	 */
	replaceLast(value: T): T {
		if (this.identityFn(this.tail.value) === this.identityFn(value)) {
			return value;
		}

		const oldValue = this.tail.value;
		this.valueSet.delete(oldValue);
		this.tail.value = value;

		if (this.valueSet.has(value)) {
			this._deleteFromList(value);
		} else {
			this.valueSet.add(value);
		}

		return oldValue;
	}

	prepend(value: T): void {
		if (this._size === this.capacity || this.valueSet.has(value)) {
			return;
		}

		const node: HistoryNode<T> = {
			value,
			previous: undefined,
			next: this.head
		};

		this.head.previous = node;
		this.head = node;
		this._size++;

		this.valueSet.add(value);
	}

	isAtEnd(): boolean {
		return this.cursor === this.tail;
	}

	current(): T {
		return this.cursor.value;
	}

	previous(): T {
		if (this.cursor.previous) {
			this.cursor = this.cursor.previous;
		}

		return this.cursor.value;
	}

	next(): T {
		if (this.cursor.next) {
			this.cursor = this.cursor.next;
		}

		return this.cursor.value;
	}

	has(t: T): boolean {
		return this.valueSet.has(t);
	}

	resetCursor(): T {
		this.cursor = this.tail;
		return this.cursor.value;
	}

	*[Symbol.iterator](): Iterator<T> {
		let node: HistoryNode<T> | undefined = this.head;

		while (node) {
			yield node.value;
			node = node.next;
		}
	}

	private _deleteFromList(value: T): void {
		let temp = this.head;

		const valueKey = this.identityFn(value);
		while (temp !== this.tail) {
			if (this.identityFn(temp.value) === valueKey) {
				if (temp === this.head) {
					this.head = this.head.next!;
					this.head.previous = undefined;
				} else {
					temp.previous!.next = temp.next;
					temp.next!.previous = temp.previous;
				}

				this._size--;
			}

			temp = temp.next!;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/hotReload.ts]---
Location: vscode-main/src/vs/base/common/hotReload.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from './lifecycle.js';

let _isHotReloadEnabled = false;

export function enableHotReload() {
	_isHotReloadEnabled = true;
}

export function isHotReloadEnabled(): boolean {
	return _isHotReloadEnabled;
}
export function registerHotReloadHandler(handler: HotReloadHandler): IDisposable {
	if (!isHotReloadEnabled()) {
		return { dispose() { } };
	} else {
		const handlers = registerGlobalHotReloadHandler();
		handlers.add(handler);
		return {
			dispose() { handlers.delete(handler); }
		};
	}
}

/**
 * Takes the old exports of the module to reload and returns a function to apply the new exports.
 * If `undefined` is returned, this handler is not able to handle the module.
 *
 * If no handler can apply the new exports, the module will not be reloaded.
 */
export type HotReloadHandler = (args: { oldExports: Record<string, unknown>; newSrc: string; config: IHotReloadConfig }) => AcceptNewExportsHandler | undefined;
export type AcceptNewExportsHandler = (newExports: Record<string, unknown>) => boolean;
export type IHotReloadConfig = HotReloadConfig;

function registerGlobalHotReloadHandler() {
	if (!hotReloadHandlers) {
		hotReloadHandlers = new Set();
	}

	const g = globalThis as unknown as GlobalThisAddition;
	if (!g.$hotReload_applyNewExports) {
		g.$hotReload_applyNewExports = args => {
			const args2 = { config: { mode: undefined }, ...args };

			const results: AcceptNewExportsHandler[] = [];
			for (const h of hotReloadHandlers!) {
				const result = h(args2);
				if (result) {
					results.push(result);
				}
			}
			if (results.length > 0) {
				return newExports => {
					let result = false;
					for (const r of results) {
						if (r(newExports)) {
							result = true;
						}
					}
					return result;
				};
			}
			return undefined;
		};
	}

	return hotReloadHandlers;
}

let hotReloadHandlers: Set<(args: { oldExports: Record<string, unknown>; newSrc: string; config: HotReloadConfig }) => AcceptNewExportsFn | undefined> | undefined = undefined;

interface HotReloadConfig {
	mode?: 'patch-prototype' | undefined;
}

interface GlobalThisAddition {
	$hotReload_applyNewExports?(args: { oldExports: Record<string, unknown>; newSrc: string; config?: HotReloadConfig }): AcceptNewExportsFn | undefined;
}

type AcceptNewExportsFn = (newExports: Record<string, unknown>) => boolean;

if (isHotReloadEnabled()) {
	// This code does not run in production.
	registerHotReloadHandler(({ oldExports, newSrc, config }) => {
		if (config.mode !== 'patch-prototype') {
			return undefined;
		}

		return newExports => {
			for (const key in newExports) {
				const exportedItem = newExports[key];
				console.log(`[hot-reload] Patching prototype methods of '${key}'`, { exportedItem });
				if (typeof exportedItem === 'function' && exportedItem.prototype) {
					const oldExportedItem = oldExports[key];
					if (oldExportedItem) {
						for (const prop of Object.getOwnPropertyNames(exportedItem.prototype)) {
							const descriptor = Object.getOwnPropertyDescriptor(exportedItem.prototype, prop)!;
							// eslint-disable-next-line local/code-no-any-casts
							const oldDescriptor = Object.getOwnPropertyDescriptor((oldExportedItem as any).prototype, prop);

							if (descriptor?.value?.toString() !== oldDescriptor?.value?.toString()) {
								console.log(`[hot-reload] Patching prototype method '${key}.${prop}'`);
							}

							// eslint-disable-next-line local/code-no-any-casts
							Object.defineProperty((oldExportedItem as any).prototype, prop, descriptor);
						}
						newExports[key] = oldExportedItem;
					}
				}
			}
			return true;
		};
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/hotReloadHelpers.ts]---
Location: vscode-main/src/vs/base/common/hotReloadHelpers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isHotReloadEnabled, registerHotReloadHandler } from './hotReload.js';
import { constObservable, IObservable, IReader, ISettableObservable, observableSignalFromEvent, observableValue } from './observable.js';

export function readHotReloadableExport<T>(value: T, reader: IReader | undefined): T {
	observeHotReloadableExports([value], reader);
	return value;
}

export function observeHotReloadableExports(values: any[], reader: IReader | undefined): void {
	if (isHotReloadEnabled()) {
		const o = observableSignalFromEvent(
			'reload',
			event => registerHotReloadHandler(({ oldExports }) => {
				if (![...Object.values(oldExports)].some(v => values.includes(v))) {
					return undefined;
				}
				return (_newExports) => {
					event(undefined);
					return true;
				};
			})
		);
		o.read(reader);
	}
}

const classes = new Map<string, ISettableObservable<unknown>>();

export function createHotClass<T>(clazz: T): IObservable<T> {
	if (!isHotReloadEnabled()) {
		return constObservable(clazz);
	}

	// eslint-disable-next-line local/code-no-any-casts
	const id = (clazz as any).name;

	let existing = classes.get(id);
	if (!existing) {
		existing = observableValue(id, clazz);
		classes.set(id, existing);
	} else {
		setTimeout(() => {
			existing!.set(clazz, undefined);
		}, 0);
	}
	return existing as IObservable<T>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/htmlContent.ts]---
Location: vscode-main/src/vs/base/common/htmlContent.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { illegalArgument } from './errors.js';
import { escapeIcons } from './iconLabels.js';
import { Schemas } from './network.js';
import { isEqual } from './resources.js';
import { escapeRegExpCharacters } from './strings.js';
import { URI, UriComponents } from './uri.js';

export interface MarkdownStringTrustedOptions {
	readonly enabledCommands: readonly string[];
}

export interface IMarkdownString {
	readonly value: string;
	readonly isTrusted?: boolean | MarkdownStringTrustedOptions;
	readonly supportThemeIcons?: boolean;
	readonly supportHtml?: boolean;
	/** @internal */
	readonly supportAlertSyntax?: boolean;
	readonly baseUri?: UriComponents;
	uris?: { [href: string]: UriComponents };
}

export const enum MarkdownStringTextNewlineStyle {
	Paragraph = 0,
	Break = 1,
}

export class MarkdownString implements IMarkdownString {

	public value: string;
	public isTrusted?: boolean | MarkdownStringTrustedOptions;
	public supportThemeIcons?: boolean;
	public supportHtml?: boolean;
	public supportAlertSyntax?: boolean;
	public baseUri?: URI;
	public uris?: { [href: string]: UriComponents } | undefined;

	public static lift(dto: IMarkdownString): MarkdownString {
		const markdownString = new MarkdownString(dto.value, dto);
		markdownString.uris = dto.uris;
		markdownString.baseUri = dto.baseUri ? URI.revive(dto.baseUri) : undefined;
		return markdownString;
	}

	constructor(
		value: string = '',
		isTrustedOrOptions: boolean | { isTrusted?: boolean | MarkdownStringTrustedOptions; supportThemeIcons?: boolean; supportHtml?: boolean; supportAlertSyntax?: boolean } = false,
	) {
		this.value = value;
		if (typeof this.value !== 'string') {
			throw illegalArgument('value');
		}

		if (typeof isTrustedOrOptions === 'boolean') {
			this.isTrusted = isTrustedOrOptions;
			this.supportThemeIcons = false;
			this.supportHtml = false;
			this.supportAlertSyntax = false;
		}
		else {
			this.isTrusted = isTrustedOrOptions.isTrusted ?? undefined;
			this.supportThemeIcons = isTrustedOrOptions.supportThemeIcons ?? false;
			this.supportHtml = isTrustedOrOptions.supportHtml ?? false;
			this.supportAlertSyntax = isTrustedOrOptions.supportAlertSyntax ?? false;
		}
	}

	appendText(value: string, newlineStyle: MarkdownStringTextNewlineStyle = MarkdownStringTextNewlineStyle.Paragraph): MarkdownString {
		this.value += escapeMarkdownSyntaxTokens(this.supportThemeIcons ? escapeIcons(value) : value) // CodeQL [SM02383] The Markdown is fully sanitized after being rendered.
			.replace(/([ \t]+)/g, (_match, g1) => '&nbsp;'.repeat(g1.length)) // CodeQL [SM02383] The Markdown is fully sanitized after being rendered.
			.replace(/\>/gm, '\\>') // CodeQL [SM02383] The Markdown is fully sanitized after being rendered.
			.replace(/\n/g, newlineStyle === MarkdownStringTextNewlineStyle.Break ? '\\\n' : '\n\n'); // CodeQL [SM02383] The Markdown is fully sanitized after being rendered.

		return this;
	}

	appendMarkdown(value: string): MarkdownString {
		this.value += value;
		return this;
	}

	appendCodeblock(langId: string, code: string): MarkdownString {
		this.value += `\n${appendEscapedMarkdownCodeBlockFence(code, langId)}\n`;
		return this;
	}

	appendLink(target: URI | string, label: string, title?: string): MarkdownString {
		this.value += '[';
		this.value += this._escape(label, ']');
		this.value += '](';
		this.value += this._escape(String(target), ')');
		if (title) {
			this.value += ` "${this._escape(this._escape(title, '"'), ')')}"`;
		}
		this.value += ')';
		return this;
	}

	private _escape(value: string, ch: string): string {
		const r = new RegExp(escapeRegExpCharacters(ch), 'g');
		return value.replace(r, (match, offset) => {
			if (value.charAt(offset - 1) !== '\\') {
				return `\\${match}`;
			} else {
				return match;
			}
		});
	}
}

export function isEmptyMarkdownString(oneOrMany: IMarkdownString | IMarkdownString[] | null | undefined): boolean {
	if (isMarkdownString(oneOrMany)) {
		return !oneOrMany.value;
	} else if (Array.isArray(oneOrMany)) {
		return oneOrMany.every(isEmptyMarkdownString);
	} else {
		return true;
	}
}

export function isMarkdownString(thing: unknown): thing is IMarkdownString {
	if (thing instanceof MarkdownString) {
		return true;
	} else if (thing && typeof thing === 'object') {
		return typeof (<IMarkdownString>thing).value === 'string'
			&& (typeof (<IMarkdownString>thing).isTrusted === 'boolean' || typeof (<IMarkdownString>thing).isTrusted === 'object' || (<IMarkdownString>thing).isTrusted === undefined)
			&& (typeof (<IMarkdownString>thing).supportThemeIcons === 'boolean' || (<IMarkdownString>thing).supportThemeIcons === undefined)
			&& (typeof (<IMarkdownString>thing).supportAlertSyntax === 'boolean' || (<IMarkdownString>thing).supportAlertSyntax === undefined);
	}
	return false;
}

export function markdownStringEqual(a: IMarkdownString, b: IMarkdownString): boolean {
	if (a === b) {
		return true;
	} else if (!a || !b) {
		return false;
	} else {
		return a.value === b.value
			&& a.isTrusted === b.isTrusted
			&& a.supportThemeIcons === b.supportThemeIcons
			&& a.supportHtml === b.supportHtml
			&& a.supportAlertSyntax === b.supportAlertSyntax
			&& (a.baseUri === b.baseUri || !!a.baseUri && !!b.baseUri && isEqual(URI.from(a.baseUri), URI.from(b.baseUri)));
	}
}

export function escapeMarkdownSyntaxTokens(text: string): string {
	// escape markdown syntax tokens: http://daringfireball.net/projects/markdown/syntax#backslash
	return text.replace(/[\\`*_{}[\]()#+\-!~]/g, '\\$&'); // CodeQL [SM02383] Backslash is escaped in the character class
}

/**
 * @see https://github.com/microsoft/vscode/issues/193746
 */
export function appendEscapedMarkdownCodeBlockFence(code: string, langId: string) {
	const longestFenceLength =
		code.match(/^`+/gm)?.reduce((a, b) => (a.length > b.length ? a : b)).length ??
		0;
	const desiredFenceLength =
		longestFenceLength >= 3 ? longestFenceLength + 1 : 3;

	// the markdown result
	return [
		`${'`'.repeat(desiredFenceLength)}${langId}`,
		code,
		`${'`'.repeat(desiredFenceLength)}`,
	].join('\n');
}

export function escapeDoubleQuotes(input: string) {
	return input.replace(/"/g, '&quot;');
}

export function removeMarkdownEscapes(text: string): string {
	if (!text) {
		return text;
	}
	return text.replace(/\\([\\`*_{}[\]()#+\-.!~])/g, '$1');
}

export function parseHrefAndDimensions(href: string): { href: string; dimensions: string[] } {
	const dimensions: string[] = [];
	const splitted = href.split('|').map(s => s.trim());
	href = splitted[0];
	const parameters = splitted[1];
	if (parameters) {
		const heightFromParams = /height=(\d+)/.exec(parameters);
		const widthFromParams = /width=(\d+)/.exec(parameters);
		const height = heightFromParams ? heightFromParams[1] : '';
		const width = widthFromParams ? widthFromParams[1] : '';
		const widthIsFinite = isFinite(parseInt(width));
		const heightIsFinite = isFinite(parseInt(height));
		if (widthIsFinite) {
			dimensions.push(`width="${width}"`);
		}
		if (heightIsFinite) {
			dimensions.push(`height="${height}"`);
		}
	}
	return { href, dimensions };
}

export function createMarkdownLink(text: string, href: string, title?: string, escapeTokens = true): string {
	return `[${escapeTokens ? escapeMarkdownSyntaxTokens(text) : text}](${href}${title ? ` "${escapeMarkdownSyntaxTokens(title)}"` : ''})`;
}

export function createMarkdownCommandLink(command: { title: string; id: string; arguments?: unknown[]; tooltip?: string }, escapeTokens = true): string {
	const uri = createCommandUri(command.id, ...(command.arguments || [])).toString();
	return createMarkdownLink(command.title, uri, command.tooltip, escapeTokens);
}

export function createCommandUri(commandId: string, ...commandArgs: unknown[]): URI {
	return URI.from({
		scheme: Schemas.command,
		path: commandId,
		query: commandArgs.length ? encodeURIComponent(JSON.stringify(commandArgs)) : undefined,
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/iconLabels.ts]---
Location: vscode-main/src/vs/base/common/iconLabels.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IMatch, matchesFuzzy } from './filters.js';
import { ltrim } from './strings.js';
import { ThemeIcon } from './themables.js';

const iconStartMarker = '$(';

const iconsRegex = new RegExp(`\\$\\(${ThemeIcon.iconNameExpression}(?:${ThemeIcon.iconModifierExpression})?\\)`, 'g'); // no capturing groups

const escapeIconsRegex = new RegExp(`(\\\\)?${iconsRegex.source}`, 'g');
export function escapeIcons(text: string): string {
	return text.replace(escapeIconsRegex, (match, escaped) => escaped ? match : `\\${match}`);
}

const markdownEscapedIconsRegex = new RegExp(`\\\\${iconsRegex.source}`, 'g');
export function markdownEscapeEscapedIcons(text: string): string {
	// Need to add an extra \ for escaping in markdown
	return text.replace(markdownEscapedIconsRegex, match => `\\${match}`);
}

const stripIconsRegex = new RegExp(`(\\s)?(\\\\)?${iconsRegex.source}(\\s)?`, 'g');

/**
 * Takes a label with icons (`$(iconId)xyz`)  and strips the icons out (`xyz`)
 */
export function stripIcons(text: string): string {
	if (text.indexOf(iconStartMarker) === -1) {
		return text;
	}

	return text.replace(stripIconsRegex, (match, preWhitespace, escaped, postWhitespace) => escaped ? match : preWhitespace || postWhitespace || '');
}


/**
 * Takes a label with icons (`$(iconId)xyz`), removes the icon syntax adds whitespace so that screen readers can read the text better.
 */
export function getCodiconAriaLabel(text: string | undefined) {
	if (!text) {
		return '';
	}

	return text.replace(/\$\((.*?)\)/g, (_match, codiconName) => ` ${codiconName} `).trim();
}


export interface IParsedLabelWithIcons {
	readonly text: string;
	readonly iconOffsets?: readonly number[];
}

const _parseIconsRegex = new RegExp(`\\$\\(${ThemeIcon.iconNameCharacter}+\\)`, 'g');

/**
 * Takes a label with icons (`abc $(iconId)xyz`) and returns the text (`abc xyz`) and the offsets of the icons (`[3]`)
 */
export function parseLabelWithIcons(input: string): IParsedLabelWithIcons {

	_parseIconsRegex.lastIndex = 0;

	let text = '';
	const iconOffsets: number[] = [];
	let iconsOffset = 0;

	while (true) {
		const pos = _parseIconsRegex.lastIndex;
		const match = _parseIconsRegex.exec(input);

		const chars = input.substring(pos, match?.index);
		if (chars.length > 0) {
			text += chars;
			for (let i = 0; i < chars.length; i++) {
				iconOffsets.push(iconsOffset);
			}
		}
		if (!match) {
			break;
		}
		iconsOffset += match[0].length;
	}

	return { text, iconOffsets };
}


export function matchesFuzzyIconAware(query: string, target: IParsedLabelWithIcons, enableSeparateSubstringMatching = false): IMatch[] | null {
	const { text, iconOffsets } = target;

	// Return early if there are no icon markers in the word to match against
	if (!iconOffsets || iconOffsets.length === 0) {
		return matchesFuzzy(query, text, enableSeparateSubstringMatching);
	}

	// Trim the word to match against because it could have leading
	// whitespace now if the word started with an icon
	const wordToMatchAgainstWithoutIconsTrimmed = ltrim(text, ' ');
	const leadingWhitespaceOffset = text.length - wordToMatchAgainstWithoutIconsTrimmed.length;

	// match on value without icon
	const matches = matchesFuzzy(query, wordToMatchAgainstWithoutIconsTrimmed, enableSeparateSubstringMatching);

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
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/idGenerator.ts]---
Location: vscode-main/src/vs/base/common/idGenerator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export class IdGenerator {

	private _prefix: string;
	private _lastId: number;

	constructor(prefix: string) {
		this._prefix = prefix;
		this._lastId = 0;
	}

	public nextId(): string {
		return this._prefix + (++this._lastId);
	}
}

export const defaultGenerator = new IdGenerator('id#');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/ime.ts]---
Location: vscode-main/src/vs/base/common/ime.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from './event.js';

export class IMEImpl {

	private readonly _onDidChange = new Emitter<void>();
	public readonly onDidChange = this._onDidChange.event;

	private _enabled = true;

	public get enabled() {
		return this._enabled;
	}

	/**
	 * Enable IME
	 */
	public enable(): void {
		this._enabled = true;
		this._onDidChange.fire();
	}

	/**
	 * Disable IME
	 */
	public disable(): void {
		this._enabled = false;
		this._onDidChange.fire();
	}
}

export const IME = new IMEImpl();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/iterator.ts]---
Location: vscode-main/src/vs/base/common/iterator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isIterable } from './types.js';

export namespace Iterable {

	export function is<T = unknown>(thing: unknown): thing is Iterable<T> {
		return !!thing && typeof thing === 'object' && typeof (thing as Iterable<T>)[Symbol.iterator] === 'function';
	}

	const _empty: Iterable<never> = Object.freeze([]);
	export function empty<T = never>(): readonly never[] {
		return _empty as readonly never[];
	}

	export function* single<T>(element: T): Iterable<T> {
		yield element;
	}

	export function wrap<T>(iterableOrElement: Iterable<T> | T): Iterable<T> {
		if (is(iterableOrElement)) {
			return iterableOrElement;
		} else {
			return single(iterableOrElement);
		}
	}

	export function from<T>(iterable: Iterable<T> | undefined | null): Iterable<T> {
		return iterable ?? (_empty as Iterable<T>);
	}

	export function* reverse<T>(array: ReadonlyArray<T>): Iterable<T> {
		for (let i = array.length - 1; i >= 0; i--) {
			yield array[i];
		}
	}

	export function isEmpty<T>(iterable: Iterable<T> | undefined | null): boolean {
		return !iterable || iterable[Symbol.iterator]().next().done === true;
	}

	export function first<T>(iterable: Iterable<T>): T | undefined {
		return iterable[Symbol.iterator]().next().value;
	}

	export function some<T>(iterable: Iterable<T>, predicate: (t: T, i: number) => unknown): boolean {
		let i = 0;
		for (const element of iterable) {
			if (predicate(element, i++)) {
				return true;
			}
		}
		return false;
	}

	export function every<T>(iterable: Iterable<T>, predicate: (t: T, i: number) => unknown): boolean {
		let i = 0;
		for (const element of iterable) {
			if (!predicate(element, i++)) {
				return false;
			}
		}
		return true;
	}

	export function find<T, R extends T>(iterable: Iterable<T>, predicate: (t: T) => t is R): R | undefined;
	export function find<T>(iterable: Iterable<T>, predicate: (t: T) => boolean): T | undefined;
	export function find<T>(iterable: Iterable<T>, predicate: (t: T) => boolean): T | undefined {
		for (const element of iterable) {
			if (predicate(element)) {
				return element;
			}
		}

		return undefined;
	}

	export function filter<T, R extends T>(iterable: Iterable<T>, predicate: (t: T) => t is R): Iterable<R>;
	export function filter<T>(iterable: Iterable<T>, predicate: (t: T) => boolean): Iterable<T>;
	export function* filter<T>(iterable: Iterable<T>, predicate: (t: T) => boolean): Iterable<T> {
		for (const element of iterable) {
			if (predicate(element)) {
				yield element;
			}
		}
	}

	export function* map<T, R>(iterable: Iterable<T>, fn: (t: T, index: number) => R): Iterable<R> {
		let index = 0;
		for (const element of iterable) {
			yield fn(element, index++);
		}
	}

	export function* flatMap<T, R>(iterable: Iterable<T>, fn: (t: T, index: number) => Iterable<R>): Iterable<R> {
		let index = 0;
		for (const element of iterable) {
			yield* fn(element, index++);
		}
	}

	export function* concat<T>(...iterables: (Iterable<T> | T)[]): Iterable<T> {
		for (const item of iterables) {
			if (isIterable(item)) {
				yield* item;
			} else {
				yield item;
			}
		}
	}

	export function reduce<T, R>(iterable: Iterable<T>, reducer: (previousValue: R, currentValue: T) => R, initialValue: R): R {
		let value = initialValue;
		for (const element of iterable) {
			value = reducer(value, element);
		}
		return value;
	}

	export function length<T>(iterable: Iterable<T>): number {
		let count = 0;
		for (const _ of iterable) {
			count++;
		}
		return count;
	}

	/**
	 * Returns an iterable slice of the array, with the same semantics as `array.slice()`.
	 */
	export function* slice<T>(arr: ReadonlyArray<T>, from: number, to = arr.length): Iterable<T> {
		if (from < -arr.length) {
			from = 0;
		}
		if (from < 0) {
			from += arr.length;
		}

		if (to < 0) {
			to += arr.length;
		} else if (to > arr.length) {
			to = arr.length;
		}

		for (; from < to; from++) {
			yield arr[from];
		}
	}

	/**
	 * Consumes `atMost` elements from iterable and returns the consumed elements,
	 * and an iterable for the rest of the elements.
	 */
	export function consume<T>(iterable: Iterable<T>, atMost: number = Number.POSITIVE_INFINITY): [T[], Iterable<T>] {
		const consumed: T[] = [];

		if (atMost === 0) {
			return [consumed, iterable];
		}

		const iterator = iterable[Symbol.iterator]();

		for (let i = 0; i < atMost; i++) {
			const next = iterator.next();

			if (next.done) {
				return [consumed, Iterable.empty()];
			}

			consumed.push(next.value);
		}

		return [consumed, { [Symbol.iterator]() { return iterator; } }];
	}

	export async function asyncToArray<T>(iterable: AsyncIterable<T>): Promise<T[]> {
		const result: T[] = [];
		for await (const item of iterable) {
			result.push(item);
		}
		return result;
	}

	export async function asyncToArrayFlat<T>(iterable: AsyncIterable<T[]>): Promise<T[]> {
		let result: T[] = [];
		for await (const item of iterable) {
			result = result.concat(item);
		}
		return result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/json.ts]---
Location: vscode-main/src/vs/base/common/json.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const enum ScanError {
	None = 0,
	UnexpectedEndOfComment = 1,
	UnexpectedEndOfString = 2,
	UnexpectedEndOfNumber = 3,
	InvalidUnicode = 4,
	InvalidEscapeCharacter = 5,
	InvalidCharacter = 6
}

export const enum SyntaxKind {
	OpenBraceToken = 1,
	CloseBraceToken = 2,
	OpenBracketToken = 3,
	CloseBracketToken = 4,
	CommaToken = 5,
	ColonToken = 6,
	NullKeyword = 7,
	TrueKeyword = 8,
	FalseKeyword = 9,
	StringLiteral = 10,
	NumericLiteral = 11,
	LineCommentTrivia = 12,
	BlockCommentTrivia = 13,
	LineBreakTrivia = 14,
	Trivia = 15,
	Unknown = 16,
	EOF = 17
}

/**
 * The scanner object, representing a JSON scanner at a position in the input string.
 */
export interface JSONScanner {
	/**
	 * Sets the scan position to a new offset. A call to 'scan' is needed to get the first token.
	 */
	setPosition(pos: number): void;
	/**
	 * Read the next token. Returns the token code.
	 */
	scan(): SyntaxKind;
	/**
	 * Returns the current scan position, which is after the last read token.
	 */
	getPosition(): number;
	/**
	 * Returns the last read token.
	 */
	getToken(): SyntaxKind;
	/**
	 * Returns the last read token value. The value for strings is the decoded string content. For numbers its of type number, for boolean it's true or false.
	 */
	getTokenValue(): string;
	/**
	 * The start offset of the last read token.
	 */
	getTokenOffset(): number;
	/**
	 * The length of the last read token.
	 */
	getTokenLength(): number;
	/**
	 * An error code of the last scan.
	 */
	getTokenError(): ScanError;
}



export interface ParseError {
	error: ParseErrorCode;
	offset: number;
	length: number;
}

export const enum ParseErrorCode {
	InvalidSymbol = 1,
	InvalidNumberFormat = 2,
	PropertyNameExpected = 3,
	ValueExpected = 4,
	ColonExpected = 5,
	CommaExpected = 6,
	CloseBraceExpected = 7,
	CloseBracketExpected = 8,
	EndOfFileExpected = 9,
	InvalidCommentToken = 10,
	UnexpectedEndOfComment = 11,
	UnexpectedEndOfString = 12,
	UnexpectedEndOfNumber = 13,
	InvalidUnicode = 14,
	InvalidEscapeCharacter = 15,
	InvalidCharacter = 16
}

export type NodeType = 'object' | 'array' | 'property' | 'string' | 'number' | 'boolean' | 'null';

export interface Node {
	readonly type: NodeType;
	readonly value?: any;
	readonly offset: number;
	readonly length: number;
	readonly colonOffset?: number;
	readonly parent?: Node;
	readonly children?: Node[];
}

export type Segment = string | number;
export type JSONPath = Segment[];

export interface Location {
	/**
	 * The previous property key or literal value (string, number, boolean or null) or undefined.
	 */
	previousNode?: Node;
	/**
	 * The path describing the location in the JSON document. The path consists of a sequence strings
	 * representing an object property or numbers for array indices.
	 */
	path: JSONPath;
	/**
	 * Matches the locations path against a pattern consisting of strings (for properties) and numbers (for array indices).
	 * '*' will match a single segment, of any property name or index.
	 * '**' will match a sequence of segments or no segment, of any property name or index.
	 */
	matches: (patterns: JSONPath) => boolean;
	/**
	 * If set, the location's offset is at a property key.
	 */
	isAtPropertyKey: boolean;
}

export interface ParseOptions {
	disallowComments?: boolean;
	allowTrailingComma?: boolean;
	allowEmptyContent?: boolean;
}

export namespace ParseOptions {
	export const DEFAULT = {
		allowTrailingComma: true
	};
}

export interface JSONVisitor {
	/**
	 * Invoked when an open brace is encountered and an object is started. The offset and length represent the location of the open brace.
	 */
	onObjectBegin?: (offset: number, length: number) => void;

	/**
	 * Invoked when a property is encountered. The offset and length represent the location of the property name.
	 */
	onObjectProperty?: (property: string, offset: number, length: number) => void;

	/**
	 * Invoked when a closing brace is encountered and an object is completed. The offset and length represent the location of the closing brace.
	 */
	onObjectEnd?: (offset: number, length: number) => void;

	/**
	 * Invoked when an open bracket is encountered. The offset and length represent the location of the open bracket.
	 */
	onArrayBegin?: (offset: number, length: number) => void;

	/**
	 * Invoked when a closing bracket is encountered. The offset and length represent the location of the closing bracket.
	 */
	onArrayEnd?: (offset: number, length: number) => void;

	/**
	 * Invoked when a literal value is encountered. The offset and length represent the location of the literal value.
	 */
	onLiteralValue?: (value: any, offset: number, length: number) => void;

	/**
	 * Invoked when a comma or colon separator is encountered. The offset and length represent the location of the separator.
	 */
	onSeparator?: (character: string, offset: number, length: number) => void;

	/**
	 * When comments are allowed, invoked when a line or block comment is encountered. The offset and length represent the location of the comment.
	 */
	onComment?: (offset: number, length: number) => void;

	/**
	 * Invoked on an error.
	 */
	onError?: (error: ParseErrorCode, offset: number, length: number) => void;
}

/**
 * Creates a JSON scanner on the given text.
 * If ignoreTrivia is set, whitespaces or comments are ignored.
 */
export function createScanner(text: string, ignoreTrivia: boolean = false): JSONScanner {

	let pos = 0;
	const len = text.length;
	let value: string = '';
	let tokenOffset = 0;
	let token: SyntaxKind = SyntaxKind.Unknown;
	let scanError: ScanError = ScanError.None;

	function scanHexDigits(count: number): number {
		let digits = 0;
		let hexValue = 0;
		while (digits < count) {
			const ch = text.charCodeAt(pos);
			if (ch >= CharacterCodes._0 && ch <= CharacterCodes._9) {
				hexValue = hexValue * 16 + ch - CharacterCodes._0;
			}
			else if (ch >= CharacterCodes.A && ch <= CharacterCodes.F) {
				hexValue = hexValue * 16 + ch - CharacterCodes.A + 10;
			}
			else if (ch >= CharacterCodes.a && ch <= CharacterCodes.f) {
				hexValue = hexValue * 16 + ch - CharacterCodes.a + 10;
			}
			else {
				break;
			}
			pos++;
			digits++;
		}
		if (digits < count) {
			hexValue = -1;
		}
		return hexValue;
	}

	function setPosition(newPosition: number) {
		pos = newPosition;
		value = '';
		tokenOffset = 0;
		token = SyntaxKind.Unknown;
		scanError = ScanError.None;
	}

	function scanNumber(): string {
		const start = pos;
		if (text.charCodeAt(pos) === CharacterCodes._0) {
			pos++;
		} else {
			pos++;
			while (pos < text.length && isDigit(text.charCodeAt(pos))) {
				pos++;
			}
		}
		if (pos < text.length && text.charCodeAt(pos) === CharacterCodes.dot) {
			pos++;
			if (pos < text.length && isDigit(text.charCodeAt(pos))) {
				pos++;
				while (pos < text.length && isDigit(text.charCodeAt(pos))) {
					pos++;
				}
			} else {
				scanError = ScanError.UnexpectedEndOfNumber;
				return text.substring(start, pos);
			}
		}
		let end = pos;
		if (pos < text.length && (text.charCodeAt(pos) === CharacterCodes.E || text.charCodeAt(pos) === CharacterCodes.e)) {
			pos++;
			if (pos < text.length && text.charCodeAt(pos) === CharacterCodes.plus || text.charCodeAt(pos) === CharacterCodes.minus) {
				pos++;
			}
			if (pos < text.length && isDigit(text.charCodeAt(pos))) {
				pos++;
				while (pos < text.length && isDigit(text.charCodeAt(pos))) {
					pos++;
				}
				end = pos;
			} else {
				scanError = ScanError.UnexpectedEndOfNumber;
			}
		}
		return text.substring(start, end);
	}

	function scanString(): string {

		let result = '',
			start = pos;

		while (true) {
			if (pos >= len) {
				result += text.substring(start, pos);
				scanError = ScanError.UnexpectedEndOfString;
				break;
			}
			const ch = text.charCodeAt(pos);
			if (ch === CharacterCodes.doubleQuote) {
				result += text.substring(start, pos);
				pos++;
				break;
			}
			if (ch === CharacterCodes.backslash) {
				result += text.substring(start, pos);
				pos++;
				if (pos >= len) {
					scanError = ScanError.UnexpectedEndOfString;
					break;
				}
				const ch2 = text.charCodeAt(pos++);
				switch (ch2) {
					case CharacterCodes.doubleQuote:
						result += '\"';
						break;
					case CharacterCodes.backslash:
						result += '\\';
						break;
					case CharacterCodes.slash:
						result += '/';
						break;
					case CharacterCodes.b:
						result += '\b';
						break;
					case CharacterCodes.f:
						result += '\f';
						break;
					case CharacterCodes.n:
						result += '\n';
						break;
					case CharacterCodes.r:
						result += '\r';
						break;
					case CharacterCodes.t:
						result += '\t';
						break;
					case CharacterCodes.u: {
						const ch3 = scanHexDigits(4);
						if (ch3 >= 0) {
							result += String.fromCharCode(ch3);
						} else {
							scanError = ScanError.InvalidUnicode;
						}
						break;
					}
					default:
						scanError = ScanError.InvalidEscapeCharacter;
				}
				start = pos;
				continue;
			}
			if (ch >= 0 && ch <= 0x1F) {
				if (isLineBreak(ch)) {
					result += text.substring(start, pos);
					scanError = ScanError.UnexpectedEndOfString;
					break;
				} else {
					scanError = ScanError.InvalidCharacter;
					// mark as error but continue with string
				}
			}
			pos++;
		}
		return result;
	}

	function scanNext(): SyntaxKind {

		value = '';
		scanError = ScanError.None;

		tokenOffset = pos;

		if (pos >= len) {
			// at the end
			tokenOffset = len;
			return token = SyntaxKind.EOF;
		}

		let code = text.charCodeAt(pos);
		// trivia: whitespace
		if (isWhitespace(code)) {
			do {
				pos++;
				value += String.fromCharCode(code);
				code = text.charCodeAt(pos);
			} while (isWhitespace(code));

			return token = SyntaxKind.Trivia;
		}

		// trivia: newlines
		if (isLineBreak(code)) {
			pos++;
			value += String.fromCharCode(code);
			if (code === CharacterCodes.carriageReturn && text.charCodeAt(pos) === CharacterCodes.lineFeed) {
				pos++;
				value += '\n';
			}
			return token = SyntaxKind.LineBreakTrivia;
		}

		switch (code) {
			// tokens: []{}:,
			case CharacterCodes.openBrace:
				pos++;
				return token = SyntaxKind.OpenBraceToken;
			case CharacterCodes.closeBrace:
				pos++;
				return token = SyntaxKind.CloseBraceToken;
			case CharacterCodes.openBracket:
				pos++;
				return token = SyntaxKind.OpenBracketToken;
			case CharacterCodes.closeBracket:
				pos++;
				return token = SyntaxKind.CloseBracketToken;
			case CharacterCodes.colon:
				pos++;
				return token = SyntaxKind.ColonToken;
			case CharacterCodes.comma:
				pos++;
				return token = SyntaxKind.CommaToken;

			// strings
			case CharacterCodes.doubleQuote:
				pos++;
				value = scanString();
				return token = SyntaxKind.StringLiteral;

			// comments
			case CharacterCodes.slash: {
				const start = pos - 1;
				// Single-line comment
				if (text.charCodeAt(pos + 1) === CharacterCodes.slash) {
					pos += 2;

					while (pos < len) {
						if (isLineBreak(text.charCodeAt(pos))) {
							break;
						}
						pos++;

					}
					value = text.substring(start, pos);
					return token = SyntaxKind.LineCommentTrivia;
				}

				// Multi-line comment
				if (text.charCodeAt(pos + 1) === CharacterCodes.asterisk) {
					pos += 2;

					const safeLength = len - 1; // For lookahead.
					let commentClosed = false;
					while (pos < safeLength) {
						const ch = text.charCodeAt(pos);

						if (ch === CharacterCodes.asterisk && text.charCodeAt(pos + 1) === CharacterCodes.slash) {
							pos += 2;
							commentClosed = true;
							break;
						}
						pos++;
					}

					if (!commentClosed) {
						pos++;
						scanError = ScanError.UnexpectedEndOfComment;
					}

					value = text.substring(start, pos);
					return token = SyntaxKind.BlockCommentTrivia;
				}
				// just a single slash
				value += String.fromCharCode(code);
				pos++;
				return token = SyntaxKind.Unknown;
			}
			// numbers
			case CharacterCodes.minus:
				value += String.fromCharCode(code);
				pos++;
				if (pos === len || !isDigit(text.charCodeAt(pos))) {
					return token = SyntaxKind.Unknown;
				}
			// found a minus, followed by a number so
			// we fall through to proceed with scanning
			// numbers
			case CharacterCodes._0:
			case CharacterCodes._1:
			case CharacterCodes._2:
			case CharacterCodes._3:
			case CharacterCodes._4:
			case CharacterCodes._5:
			case CharacterCodes._6:
			case CharacterCodes._7:
			case CharacterCodes._8:
			case CharacterCodes._9:
				value += scanNumber();
				return token = SyntaxKind.NumericLiteral;
			// literals and unknown symbols
			default:
				// is a literal? Read the full word.
				while (pos < len && isUnknownContentCharacter(code)) {
					pos++;
					code = text.charCodeAt(pos);
				}
				if (tokenOffset !== pos) {
					value = text.substring(tokenOffset, pos);
					// keywords: true, false, null
					switch (value) {
						case 'true': return token = SyntaxKind.TrueKeyword;
						case 'false': return token = SyntaxKind.FalseKeyword;
						case 'null': return token = SyntaxKind.NullKeyword;
					}
					return token = SyntaxKind.Unknown;
				}
				// some
				value += String.fromCharCode(code);
				pos++;
				return token = SyntaxKind.Unknown;
		}
	}

	function isUnknownContentCharacter(code: CharacterCodes) {
		if (isWhitespace(code) || isLineBreak(code)) {
			return false;
		}
		switch (code) {
			case CharacterCodes.closeBrace:
			case CharacterCodes.closeBracket:
			case CharacterCodes.openBrace:
			case CharacterCodes.openBracket:
			case CharacterCodes.doubleQuote:
			case CharacterCodes.colon:
			case CharacterCodes.comma:
			case CharacterCodes.slash:
				return false;
		}
		return true;
	}


	function scanNextNonTrivia(): SyntaxKind {
		let result: SyntaxKind;
		do {
			result = scanNext();
		} while (result >= SyntaxKind.LineCommentTrivia && result <= SyntaxKind.Trivia);
		return result;
	}

	return {
		setPosition: setPosition,
		getPosition: () => pos,
		scan: ignoreTrivia ? scanNextNonTrivia : scanNext,
		getToken: () => token,
		getTokenValue: () => value,
		getTokenOffset: () => tokenOffset,
		getTokenLength: () => pos - tokenOffset,
		getTokenError: () => scanError
	};
}

function isWhitespace(ch: number): boolean {
	return ch === CharacterCodes.space || ch === CharacterCodes.tab || ch === CharacterCodes.verticalTab || ch === CharacterCodes.formFeed ||
		ch === CharacterCodes.nonBreakingSpace || ch === CharacterCodes.ogham || ch >= CharacterCodes.enQuad && ch <= CharacterCodes.zeroWidthSpace ||
		ch === CharacterCodes.narrowNoBreakSpace || ch === CharacterCodes.mathematicalSpace || ch === CharacterCodes.ideographicSpace || ch === CharacterCodes.byteOrderMark;
}

function isLineBreak(ch: number): boolean {
	return ch === CharacterCodes.lineFeed || ch === CharacterCodes.carriageReturn || ch === CharacterCodes.lineSeparator || ch === CharacterCodes.paragraphSeparator;
}

function isDigit(ch: number): boolean {
	return ch >= CharacterCodes._0 && ch <= CharacterCodes._9;
}

const enum CharacterCodes {
	nullCharacter = 0,
	maxAsciiCharacter = 0x7F,

	lineFeed = 0x0A,              // \n
	carriageReturn = 0x0D,        // \r
	lineSeparator = 0x2028,
	paragraphSeparator = 0x2029,

	// REVIEW: do we need to support this?  The scanner doesn't, but our IText does.  This seems
	// like an odd disparity?  (Or maybe it's completely fine for them to be different).
	nextLine = 0x0085,

	// Unicode 3.0 space characters
	space = 0x0020,   // " "
	nonBreakingSpace = 0x00A0,   //
	enQuad = 0x2000,
	emQuad = 0x2001,
	enSpace = 0x2002,
	emSpace = 0x2003,
	threePerEmSpace = 0x2004,
	fourPerEmSpace = 0x2005,
	sixPerEmSpace = 0x2006,
	figureSpace = 0x2007,
	punctuationSpace = 0x2008,
	thinSpace = 0x2009,
	hairSpace = 0x200A,
	zeroWidthSpace = 0x200B,
	narrowNoBreakSpace = 0x202F,
	ideographicSpace = 0x3000,
	mathematicalSpace = 0x205F,
	ogham = 0x1680,

	_ = 0x5F,
	$ = 0x24,

	_0 = 0x30,
	_1 = 0x31,
	_2 = 0x32,
	_3 = 0x33,
	_4 = 0x34,
	_5 = 0x35,
	_6 = 0x36,
	_7 = 0x37,
	_8 = 0x38,
	_9 = 0x39,

	a = 0x61,
	b = 0x62,
	c = 0x63,
	d = 0x64,
	e = 0x65,
	f = 0x66,
	g = 0x67,
	h = 0x68,
	i = 0x69,
	j = 0x6A,
	k = 0x6B,
	l = 0x6C,
	m = 0x6D,
	n = 0x6E,
	o = 0x6F,
	p = 0x70,
	q = 0x71,
	r = 0x72,
	s = 0x73,
	t = 0x74,
	u = 0x75,
	v = 0x76,
	w = 0x77,
	x = 0x78,
	y = 0x79,
	z = 0x7A,

	A = 0x41,
	B = 0x42,
	C = 0x43,
	D = 0x44,
	E = 0x45,
	F = 0x46,
	G = 0x47,
	H = 0x48,
	I = 0x49,
	J = 0x4A,
	K = 0x4B,
	L = 0x4C,
	M = 0x4D,
	N = 0x4E,
	O = 0x4F,
	P = 0x50,
	Q = 0x51,
	R = 0x52,
	S = 0x53,
	T = 0x54,
	U = 0x55,
	V = 0x56,
	W = 0x57,
	X = 0x58,
	Y = 0x59,
	Z = 0x5A,

	ampersand = 0x26,             // &
	asterisk = 0x2A,              // *
	at = 0x40,                    // @
	backslash = 0x5C,             // \
	bar = 0x7C,                   // |
	caret = 0x5E,                 // ^
	closeBrace = 0x7D,            // }
	closeBracket = 0x5D,          // ]
	closeParen = 0x29,            // )
	colon = 0x3A,                 // :
	comma = 0x2C,                 // ,
	dot = 0x2E,                   // .
	doubleQuote = 0x22,           // "
	equals = 0x3D,                // =
	exclamation = 0x21,           // !
	greaterThan = 0x3E,           // >
	lessThan = 0x3C,              // <
	minus = 0x2D,                 // -
	openBrace = 0x7B,             // {
	openBracket = 0x5B,           // [
	openParen = 0x28,             // (
	percent = 0x25,               // %
	plus = 0x2B,                  // +
	question = 0x3F,              // ?
	semicolon = 0x3B,             // ;
	singleQuote = 0x27,           // '
	slash = 0x2F,                 // /
	tilde = 0x7E,                 // ~

	backspace = 0x08,             // \b
	formFeed = 0x0C,              // \f
	byteOrderMark = 0xFEFF,
	tab = 0x09,                   // \t
	verticalTab = 0x0B,           // \v
}

interface NodeImpl extends Node {
	type: NodeType;
	value?: any;
	offset: number;
	length: number;
	colonOffset?: number;
	parent?: NodeImpl;
	children?: NodeImpl[];
}

/**
 * For a given offset, evaluate the location in the JSON document. Each segment in the location path is either a property name or an array index.
 */
export function getLocation(text: string, position: number): Location {
	const segments: Segment[] = []; // strings or numbers
	const earlyReturnException = new Object();
	let previousNode: NodeImpl | undefined = undefined;
	const previousNodeInst: NodeImpl = {
		value: {},
		offset: 0,
		length: 0,
		type: 'object',
		parent: undefined
	};
	let isAtPropertyKey = false;
	function setPreviousNode(value: string, offset: number, length: number, type: NodeType) {
		previousNodeInst.value = value;
		previousNodeInst.offset = offset;
		previousNodeInst.length = length;
		previousNodeInst.type = type;
		previousNodeInst.colonOffset = undefined;
		previousNode = previousNodeInst;
	}
	try {

		visit(text, {
			onObjectBegin: (offset: number, length: number) => {
				if (position <= offset) {
					throw earlyReturnException;
				}
				previousNode = undefined;
				isAtPropertyKey = position > offset;
				segments.push(''); // push a placeholder (will be replaced)
			},
			onObjectProperty: (name: string, offset: number, length: number) => {
				if (position < offset) {
					throw earlyReturnException;
				}
				setPreviousNode(name, offset, length, 'property');
				segments[segments.length - 1] = name;
				if (position <= offset + length) {
					throw earlyReturnException;
				}
			},
			onObjectEnd: (offset: number, length: number) => {
				if (position <= offset) {
					throw earlyReturnException;
				}
				previousNode = undefined;
				segments.pop();
			},
			onArrayBegin: (offset: number, length: number) => {
				if (position <= offset) {
					throw earlyReturnException;
				}
				previousNode = undefined;
				segments.push(0);
			},
			onArrayEnd: (offset: number, length: number) => {
				if (position <= offset) {
					throw earlyReturnException;
				}
				previousNode = undefined;
				segments.pop();
			},
			onLiteralValue: (value: any, offset: number, length: number) => {
				if (position < offset) {
					throw earlyReturnException;
				}
				setPreviousNode(value, offset, length, getNodeType(value));

				if (position <= offset + length) {
					throw earlyReturnException;
				}
			},
			onSeparator: (sep: string, offset: number, length: number) => {
				if (position <= offset) {
					throw earlyReturnException;
				}
				if (sep === ':' && previousNode && previousNode.type === 'property') {
					previousNode.colonOffset = offset;
					isAtPropertyKey = false;
					previousNode = undefined;
				} else if (sep === ',') {
					const last = segments[segments.length - 1];
					if (typeof last === 'number') {
						segments[segments.length - 1] = last + 1;
					} else {
						isAtPropertyKey = true;
						segments[segments.length - 1] = '';
					}
					previousNode = undefined;
				}
			}
		});
	} catch (e) {
		if (e !== earlyReturnException) {
			throw e;
		}
	}

	return {
		path: segments,
		previousNode,
		isAtPropertyKey,
		matches: (pattern: Segment[]) => {
			let k = 0;
			for (let i = 0; k < pattern.length && i < segments.length; i++) {
				if (pattern[k] === segments[i] || pattern[k] === '*') {
					k++;
				} else if (pattern[k] !== '**') {
					return false;
				}
			}
			return k === pattern.length;
		}
	};
}


/**
 * Parses the given text and returns the object the JSON content represents. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.
 * Therefore always check the errors list to find out if the input was valid.
 */
export function parse(text: string, errors: ParseError[] = [], options: ParseOptions = ParseOptions.DEFAULT): any {
	let currentProperty: string | null = null;
	let currentParent: any = [];
	const previousParents: any[] = [];

	function onValue(value: unknown) {
		if (Array.isArray(currentParent)) {
			currentParent.push(value);
		} else if (currentProperty !== null) {
			currentParent[currentProperty] = value;
		}
	}

	const visitor: JSONVisitor = {
		onObjectBegin: () => {
			const object = {};
			onValue(object);
			previousParents.push(currentParent);
			currentParent = object;
			currentProperty = null;
		},
		onObjectProperty: (name: string) => {
			currentProperty = name;
		},
		onObjectEnd: () => {
			currentParent = previousParents.pop();
		},
		onArrayBegin: () => {
			const array: any[] = [];
			onValue(array);
			previousParents.push(currentParent);
			currentParent = array;
			currentProperty = null;
		},
		onArrayEnd: () => {
			currentParent = previousParents.pop();
		},
		onLiteralValue: onValue,
		onError: (error: ParseErrorCode, offset: number, length: number) => {
			errors.push({ error, offset, length });
		}
	};
	visit(text, visitor, options);
	return currentParent[0];
}


/**
 * Parses the given text and returns a tree representation the JSON content. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.
 */
export function parseTree(text: string, errors: ParseError[] = [], options: ParseOptions = ParseOptions.DEFAULT): Node {
	let currentParent: NodeImpl = { type: 'array', offset: -1, length: -1, children: [], parent: undefined }; // artificial root

	function ensurePropertyComplete(endOffset: number) {
		if (currentParent.type === 'property') {
			currentParent.length = endOffset - currentParent.offset;
			currentParent = currentParent.parent!;
		}
	}

	function onValue(valueNode: Node): Node {
		currentParent.children!.push(valueNode);
		return valueNode;
	}

	const visitor: JSONVisitor = {
		onObjectBegin: (offset: number) => {
			currentParent = onValue({ type: 'object', offset, length: -1, parent: currentParent, children: [] });
		},
		onObjectProperty: (name: string, offset: number, length: number) => {
			currentParent = onValue({ type: 'property', offset, length: -1, parent: currentParent, children: [] });
			currentParent.children!.push({ type: 'string', value: name, offset, length, parent: currentParent });
		},
		onObjectEnd: (offset: number, length: number) => {
			currentParent.length = offset + length - currentParent.offset;
			currentParent = currentParent.parent!;
			ensurePropertyComplete(offset + length);
		},
		onArrayBegin: (offset: number, length: number) => {
			currentParent = onValue({ type: 'array', offset, length: -1, parent: currentParent, children: [] });
		},
		onArrayEnd: (offset: number, length: number) => {
			currentParent.length = offset + length - currentParent.offset;
			currentParent = currentParent.parent!;
			ensurePropertyComplete(offset + length);
		},
		onLiteralValue: (value: unknown, offset: number, length: number) => {
			onValue({ type: getNodeType(value), offset, length, parent: currentParent, value });
			ensurePropertyComplete(offset + length);
		},
		onSeparator: (sep: string, offset: number, length: number) => {
			if (currentParent.type === 'property') {
				if (sep === ':') {
					currentParent.colonOffset = offset;
				} else if (sep === ',') {
					ensurePropertyComplete(offset);
				}
			}
		},
		onError: (error: ParseErrorCode, offset: number, length: number) => {
			errors.push({ error, offset, length });
		}
	};
	visit(text, visitor, options);

	const result = currentParent.children![0];
	if (result) {
		delete result.parent;
	}
	return result;
}

/**
 * Finds the node at the given path in a JSON DOM.
 */
export function findNodeAtLocation(root: Node, path: JSONPath): Node | undefined {
	if (!root) {
		return undefined;
	}
	let node = root;
	for (const segment of path) {
		if (typeof segment === 'string') {
			if (node.type !== 'object' || !Array.isArray(node.children)) {
				return undefined;
			}
			let found = false;
			for (const propertyNode of node.children) {
				if (Array.isArray(propertyNode.children) && propertyNode.children[0].value === segment) {
					node = propertyNode.children[1];
					found = true;
					break;
				}
			}
			if (!found) {
				return undefined;
			}
		} else {
			const index = segment;
			if (node.type !== 'array' || index < 0 || !Array.isArray(node.children) || index >= node.children.length) {
				return undefined;
			}
			node = node.children[index];
		}
	}
	return node;
}

/**
 * Gets the JSON path of the given JSON DOM node
 */
export function getNodePath(node: Node): JSONPath {
	if (!node.parent || !node.parent.children) {
		return [];
	}
	const path = getNodePath(node.parent);
	if (node.parent.type === 'property') {
		const key = node.parent.children[0].value;
		path.push(key);
	} else if (node.parent.type === 'array') {
		const index = node.parent.children.indexOf(node);
		if (index !== -1) {
			path.push(index);
		}
	}
	return path;
}

/**
 * Evaluates the JavaScript object of the given JSON DOM node
 */
export function getNodeValue(node: Node): any {
	switch (node.type) {
		case 'array':
			return node.children!.map(getNodeValue);
		case 'object': {
			const obj = Object.create(null);
			for (const prop of node.children!) {
				const valueNode = prop.children![1];
				if (valueNode) {
					obj[prop.children![0].value] = getNodeValue(valueNode);
				}
			}
			return obj;
		}
		case 'null':
		case 'string':
		case 'number':
		case 'boolean':
			return node.value;
		default:
			return undefined;
	}

}

export function contains(node: Node, offset: number, includeRightBound = false): boolean {
	return (offset >= node.offset && offset < (node.offset + node.length)) || includeRightBound && (offset === (node.offset + node.length));
}

/**
 * Finds the most inner node at the given offset. If includeRightBound is set, also finds nodes that end at the given offset.
 */
export function findNodeAtOffset(node: Node, offset: number, includeRightBound = false): Node | undefined {
	if (contains(node, offset, includeRightBound)) {
		const children = node.children;
		if (Array.isArray(children)) {
			for (let i = 0; i < children.length && children[i].offset <= offset; i++) {
				const item = findNodeAtOffset(children[i], offset, includeRightBound);
				if (item) {
					return item;
				}
			}

		}
		return node;
	}
	return undefined;
}


/**
 * Parses the given text and invokes the visitor functions for each object, array and literal reached.
 */
export function visit(text: string, visitor: JSONVisitor, options: ParseOptions = ParseOptions.DEFAULT): any {

	const _scanner = createScanner(text, false);

	function toNoArgVisit(visitFunction?: (offset: number, length: number) => void): () => void {
		return visitFunction ? () => visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength()) : () => true;
	}
	function toOneArgVisit<T>(visitFunction?: (arg: T, offset: number, length: number) => void): (arg: T) => void {
		return visitFunction ? (arg: T) => visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength()) : () => true;
	}

	const onObjectBegin = toNoArgVisit(visitor.onObjectBegin),
		onObjectProperty = toOneArgVisit(visitor.onObjectProperty),
		onObjectEnd = toNoArgVisit(visitor.onObjectEnd),
		onArrayBegin = toNoArgVisit(visitor.onArrayBegin),
		onArrayEnd = toNoArgVisit(visitor.onArrayEnd),
		onLiteralValue = toOneArgVisit(visitor.onLiteralValue),
		onSeparator = toOneArgVisit(visitor.onSeparator),
		onComment = toNoArgVisit(visitor.onComment),
		onError = toOneArgVisit(visitor.onError);

	const disallowComments = options && options.disallowComments;
	const allowTrailingComma = options && options.allowTrailingComma;
	function scanNext(): SyntaxKind {
		while (true) {
			const token = _scanner.scan();
			switch (_scanner.getTokenError()) {
				case ScanError.InvalidUnicode:
					handleError(ParseErrorCode.InvalidUnicode);
					break;
				case ScanError.InvalidEscapeCharacter:
					handleError(ParseErrorCode.InvalidEscapeCharacter);
					break;
				case ScanError.UnexpectedEndOfNumber:
					handleError(ParseErrorCode.UnexpectedEndOfNumber);
					break;
				case ScanError.UnexpectedEndOfComment:
					if (!disallowComments) {
						handleError(ParseErrorCode.UnexpectedEndOfComment);
					}
					break;
				case ScanError.UnexpectedEndOfString:
					handleError(ParseErrorCode.UnexpectedEndOfString);
					break;
				case ScanError.InvalidCharacter:
					handleError(ParseErrorCode.InvalidCharacter);
					break;
			}
			switch (token) {
				case SyntaxKind.LineCommentTrivia:
				case SyntaxKind.BlockCommentTrivia:
					if (disallowComments) {
						handleError(ParseErrorCode.InvalidCommentToken);
					} else {
						onComment();
					}
					break;
				case SyntaxKind.Unknown:
					handleError(ParseErrorCode.InvalidSymbol);
					break;
				case SyntaxKind.Trivia:
				case SyntaxKind.LineBreakTrivia:
					break;
				default:
					return token;
			}
		}
	}

	function handleError(error: ParseErrorCode, skipUntilAfter: SyntaxKind[] = [], skipUntil: SyntaxKind[] = []): void {
		onError(error);
		if (skipUntilAfter.length + skipUntil.length > 0) {
			let token = _scanner.getToken();
			while (token !== SyntaxKind.EOF) {
				if (skipUntilAfter.indexOf(token) !== -1) {
					scanNext();
					break;
				} else if (skipUntil.indexOf(token) !== -1) {
					break;
				}
				token = scanNext();
			}
		}
	}

	function parseString(isValue: boolean): boolean {
		const value = _scanner.getTokenValue();
		if (isValue) {
			onLiteralValue(value);
		} else {
			onObjectProperty(value);
		}
		scanNext();
		return true;
	}

	function parseLiteral(): boolean {
		switch (_scanner.getToken()) {
			case SyntaxKind.NumericLiteral: {
				let value = 0;
				try {
					value = JSON.parse(_scanner.getTokenValue());
					if (typeof value !== 'number') {
						handleError(ParseErrorCode.InvalidNumberFormat);
						value = 0;
					}
				} catch (e) {
					handleError(ParseErrorCode.InvalidNumberFormat);
				}
				onLiteralValue(value);
				break;
			}
			case SyntaxKind.NullKeyword:
				onLiteralValue(null);
				break;
			case SyntaxKind.TrueKeyword:
				onLiteralValue(true);
				break;
			case SyntaxKind.FalseKeyword:
				onLiteralValue(false);
				break;
			default:
				return false;
		}
		scanNext();
		return true;
	}

	function parseProperty(): boolean {
		if (_scanner.getToken() !== SyntaxKind.StringLiteral) {
			handleError(ParseErrorCode.PropertyNameExpected, [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
			return false;
		}
		parseString(false);
		if (_scanner.getToken() === SyntaxKind.ColonToken) {
			onSeparator(':');
			scanNext(); // consume colon

			if (!parseValue()) {
				handleError(ParseErrorCode.ValueExpected, [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
			}
		} else {
			handleError(ParseErrorCode.ColonExpected, [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
		}
		return true;
	}

	function parseObject(): boolean {
		onObjectBegin();
		scanNext(); // consume open brace

		let needsComma = false;
		while (_scanner.getToken() !== SyntaxKind.CloseBraceToken && _scanner.getToken() !== SyntaxKind.EOF) {
			if (_scanner.getToken() === SyntaxKind.CommaToken) {
				if (!needsComma) {
					handleError(ParseErrorCode.ValueExpected, [], []);
				}
				onSeparator(',');
				scanNext(); // consume comma
				if (_scanner.getToken() === SyntaxKind.CloseBraceToken && allowTrailingComma) {
					break;
				}
			} else if (needsComma) {
				handleError(ParseErrorCode.CommaExpected, [], []);
			}
			if (!parseProperty()) {
				handleError(ParseErrorCode.ValueExpected, [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
			}
			needsComma = true;
		}
		onObjectEnd();
		if (_scanner.getToken() !== SyntaxKind.CloseBraceToken) {
			handleError(ParseErrorCode.CloseBraceExpected, [SyntaxKind.CloseBraceToken], []);
		} else {
			scanNext(); // consume close brace
		}
		return true;
	}

	function parseArray(): boolean {
		onArrayBegin();
		scanNext(); // consume open bracket

		let needsComma = false;
		while (_scanner.getToken() !== SyntaxKind.CloseBracketToken && _scanner.getToken() !== SyntaxKind.EOF) {
			if (_scanner.getToken() === SyntaxKind.CommaToken) {
				if (!needsComma) {
					handleError(ParseErrorCode.ValueExpected, [], []);
				}
				onSeparator(',');
				scanNext(); // consume comma
				if (_scanner.getToken() === SyntaxKind.CloseBracketToken && allowTrailingComma) {
					break;
				}
			} else if (needsComma) {
				handleError(ParseErrorCode.CommaExpected, [], []);
			}
			if (!parseValue()) {
				handleError(ParseErrorCode.ValueExpected, [], [SyntaxKind.CloseBracketToken, SyntaxKind.CommaToken]);
			}
			needsComma = true;
		}
		onArrayEnd();
		if (_scanner.getToken() !== SyntaxKind.CloseBracketToken) {
			handleError(ParseErrorCode.CloseBracketExpected, [SyntaxKind.CloseBracketToken], []);
		} else {
			scanNext(); // consume close bracket
		}
		return true;
	}

	function parseValue(): boolean {
		switch (_scanner.getToken()) {
			case SyntaxKind.OpenBracketToken:
				return parseArray();
			case SyntaxKind.OpenBraceToken:
				return parseObject();
			case SyntaxKind.StringLiteral:
				return parseString(true);
			default:
				return parseLiteral();
		}
	}

	scanNext();
	if (_scanner.getToken() === SyntaxKind.EOF) {
		if (options.allowEmptyContent) {
			return true;
		}
		handleError(ParseErrorCode.ValueExpected, [], []);
		return false;
	}
	if (!parseValue()) {
		handleError(ParseErrorCode.ValueExpected, [], []);
		return false;
	}
	if (_scanner.getToken() !== SyntaxKind.EOF) {
		handleError(ParseErrorCode.EndOfFileExpected, [], []);
	}
	return true;
}

export function getNodeType(value: unknown): NodeType {
	switch (typeof value) {
		case 'boolean': return 'boolean';
		case 'number': return 'number';
		case 'string': return 'string';
		case 'object': {
			if (!value) {
				return 'null';
			} else if (Array.isArray(value)) {
				return 'array';
			}
			return 'object';
		}
		default: return 'null';
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/jsonc.ts]---
Location: vscode-main/src/vs/base/common/jsonc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// First group matches a double quoted string
// Second group matches a single quoted string
// Third group matches a multi line comment
// Forth group matches a single line comment
// Fifth group matches a trailing comma
const regexp = /("[^"\\]*(?:\\.[^"\\]*)*")|('[^'\\]*(?:\\.[^'\\]*)*')|(\/\*[^\/\*]*(?:(?:\*|\/)[^\/\*]*)*?\*\/)|(\/{2,}.*?(?:(?:\r?\n)|$))|(,\s*[}\]])/g;

/**
 * Strips single and multi line JavaScript comments from JSON
 * content. Ignores characters in strings BUT doesn't support
 * string continuation across multiple lines since it is not
 * supported in JSON.
 *
 * @param content the content to strip comments from
 * @returns the content without comments
*/
export function stripComments(content: string): string {
	return content.replace(regexp, function (match, _m1, _m2, m3, m4, m5) {
		// Only one of m1, m2, m3, m4, m5 matches
		if (m3) {
			// A block comment. Replace with nothing
			return '';
		} else if (m4) {
			// Since m4 is a single line comment is is at least of length 2 (e.g. //)
			// If it ends in \r?\n then keep it.
			const length = m4.length;
			if (m4[length - 1] === '\n') {
				return m4[length - 2] === '\r' ? '\r\n' : '\n';
			}
			else {
				return '';
			}
		} else if (m5) {
			// Remove the trailing comma
			return match.substring(1);
		} else {
			// We match a string
			return match;
		}
	});
}

/**
 * A drop-in replacement for JSON.parse that can parse
 * JSON with comments and trailing commas.
 *
 * @param content the content to strip comments from
 * @returns the parsed content as JSON
*/
export function parse<T>(content: string): T {
	const commentsStripped = stripComments(content);

	try {
		return JSON.parse(commentsStripped);
	} catch (error) {
		const trailingCommasStriped = commentsStripped.replace(/,\s*([}\]])/g, '$1');
		return JSON.parse(trailingCommasStriped);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/jsonEdit.ts]---
Location: vscode-main/src/vs/base/common/jsonEdit.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { findNodeAtLocation, JSONPath, Node, ParseError, parseTree, Segment } from './json.js';
import { Edit, format, FormattingOptions, isEOL } from './jsonFormatter.js';


export function removeProperty(text: string, path: JSONPath, formattingOptions: FormattingOptions): Edit[] {
	return setProperty(text, path, undefined, formattingOptions);
}

export function setProperty(text: string, originalPath: JSONPath, value: unknown, formattingOptions: FormattingOptions, getInsertionIndex?: (properties: string[]) => number): Edit[] {
	const path = originalPath.slice();
	const errors: ParseError[] = [];
	const root = parseTree(text, errors);
	let parent: Node | undefined = undefined;

	let lastSegment: Segment | undefined = undefined;
	while (path.length > 0) {
		lastSegment = path.pop();
		parent = findNodeAtLocation(root, path);
		if (parent === undefined && value !== undefined) {
			if (typeof lastSegment === 'string') {
				value = { [lastSegment]: value };
			} else {
				value = [value];
			}
		} else {
			break;
		}
	}

	if (!parent) {
		// empty document
		if (value === undefined) { // delete
			return []; // property does not exist, nothing to do
		}
		return withFormatting(text, { offset: root ? root.offset : 0, length: root ? root.length : 0, content: JSON.stringify(value) }, formattingOptions);
	} else if (parent.type === 'object' && typeof lastSegment === 'string' && Array.isArray(parent.children)) {
		const existing = findNodeAtLocation(parent, [lastSegment]);
		if (existing !== undefined) {
			if (value === undefined) { // delete
				if (!existing.parent) {
					throw new Error('Malformed AST');
				}
				const propertyIndex = parent.children.indexOf(existing.parent);
				let removeBegin: number;
				let removeEnd = existing.parent.offset + existing.parent.length;
				if (propertyIndex > 0) {
					// remove the comma of the previous node
					const previous = parent.children[propertyIndex - 1];
					removeBegin = previous.offset + previous.length;
				} else {
					removeBegin = parent.offset + 1;
					if (parent.children.length > 1) {
						// remove the comma of the next node
						const next = parent.children[1];
						removeEnd = next.offset;
					}
				}
				return withFormatting(text, { offset: removeBegin, length: removeEnd - removeBegin, content: '' }, formattingOptions);
			} else {
				// set value of existing property
				return withFormatting(text, { offset: existing.offset, length: existing.length, content: JSON.stringify(value) }, formattingOptions);
			}
		} else {
			if (value === undefined) { // delete
				return []; // property does not exist, nothing to do
			}
			const newProperty = `${JSON.stringify(lastSegment)}: ${JSON.stringify(value)}`;
			const index = getInsertionIndex ? getInsertionIndex(parent.children.map(p => p.children![0].value)) : parent.children.length;
			let edit: Edit;
			if (index > 0) {
				const previous = parent.children[index - 1];
				edit = { offset: previous.offset + previous.length, length: 0, content: ',' + newProperty };
			} else if (parent.children.length === 0) {
				edit = { offset: parent.offset + 1, length: 0, content: newProperty };
			} else {
				edit = { offset: parent.offset + 1, length: 0, content: newProperty + ',' };
			}
			return withFormatting(text, edit, formattingOptions);
		}
	} else if (parent.type === 'array' && typeof lastSegment === 'number' && Array.isArray(parent.children)) {
		if (value !== undefined) {
			// Insert
			const newProperty = `${JSON.stringify(value)}`;
			let edit: Edit;
			if (parent.children.length === 0 || lastSegment === 0) {
				edit = { offset: parent.offset + 1, length: 0, content: parent.children.length === 0 ? newProperty : newProperty + ',' };
			} else {
				const index = lastSegment === -1 || lastSegment > parent.children.length ? parent.children.length : lastSegment;
				const previous = parent.children[index - 1];
				edit = { offset: previous.offset + previous.length, length: 0, content: ',' + newProperty };
			}
			return withFormatting(text, edit, formattingOptions);
		} else {
			//Removal
			const removalIndex = lastSegment;
			const toRemove = parent.children[removalIndex];
			let edit: Edit;
			if (parent.children.length === 1) {
				// only item
				edit = { offset: parent.offset + 1, length: parent.length - 2, content: '' };
			} else if (parent.children.length - 1 === removalIndex) {
				// last item
				const previous = parent.children[removalIndex - 1];
				const offset = previous.offset + previous.length;
				const parentEndOffset = parent.offset + parent.length;
				edit = { offset, length: parentEndOffset - 2 - offset, content: '' };
			} else {
				edit = { offset: toRemove.offset, length: parent.children[removalIndex + 1].offset - toRemove.offset, content: '' };
			}
			return withFormatting(text, edit, formattingOptions);
		}
	} else {
		throw new Error(`Can not add ${typeof lastSegment !== 'number' ? 'index' : 'property'} to parent of type ${parent.type}`);
	}
}

export function withFormatting(text: string, edit: Edit, formattingOptions: FormattingOptions): Edit[] {
	// apply the edit
	let newText = applyEdit(text, edit);

	// format the new text
	let begin = edit.offset;
	let end = edit.offset + edit.content.length;
	if (edit.length === 0 || edit.content.length === 0) { // insert or remove
		while (begin > 0 && !isEOL(newText, begin - 1)) {
			begin--;
		}
		while (end < newText.length && !isEOL(newText, end)) {
			end++;
		}
	}

	const edits = format(newText, { offset: begin, length: end - begin }, formattingOptions);

	// apply the formatting edits and track the begin and end offsets of the changes
	for (let i = edits.length - 1; i >= 0; i--) {
		const curr = edits[i];
		newText = applyEdit(newText, curr);
		begin = Math.min(begin, curr.offset);
		end = Math.max(end, curr.offset + curr.length);
		end += curr.content.length - curr.length;
	}
	// create a single edit with all changes
	const editLength = text.length - (newText.length - end) - begin;
	return [{ offset: begin, length: editLength, content: newText.substring(begin, end) }];
}

export function applyEdit(text: string, edit: Edit): string {
	return text.substring(0, edit.offset) + edit.content + text.substring(edit.offset + edit.length);
}

export function applyEdits(text: string, edits: Edit[]): string {
	const sortedEdits = edits.slice(0).sort((a, b) => {
		const diff = a.offset - b.offset;
		if (diff === 0) {
			return a.length - b.length;
		}
		return diff;
	});
	let lastModifiedOffset = text.length;
	for (let i = sortedEdits.length - 1; i >= 0; i--) {
		const e = sortedEdits[i];
		if (e.offset + e.length <= lastModifiedOffset) {
			text = applyEdit(text, e);
		} else {
			throw new Error('Overlapping edit');
		}
		lastModifiedOffset = e.offset;
	}
	return text;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/jsonErrorMessages.ts]---
Location: vscode-main/src/vs/base/common/jsonErrorMessages.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Extracted from json.ts to keep json nls free.
 */
import { localize } from '../../nls.js';
import { ParseErrorCode } from './json.js';

export function getParseErrorMessage(errorCode: ParseErrorCode): string {
	switch (errorCode) {
		case ParseErrorCode.InvalidSymbol: return localize('error.invalidSymbol', 'Invalid symbol');
		case ParseErrorCode.InvalidNumberFormat: return localize('error.invalidNumberFormat', 'Invalid number format');
		case ParseErrorCode.PropertyNameExpected: return localize('error.propertyNameExpected', 'Property name expected');
		case ParseErrorCode.ValueExpected: return localize('error.valueExpected', 'Value expected');
		case ParseErrorCode.ColonExpected: return localize('error.colonExpected', 'Colon expected');
		case ParseErrorCode.CommaExpected: return localize('error.commaExpected', 'Comma expected');
		case ParseErrorCode.CloseBraceExpected: return localize('error.closeBraceExpected', 'Closing brace expected');
		case ParseErrorCode.CloseBracketExpected: return localize('error.closeBracketExpected', 'Closing bracket expected');
		case ParseErrorCode.EndOfFileExpected: return localize('error.endOfFileExpected', 'End of file expected');
		default:
			return '';
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/jsonFormatter.ts]---
Location: vscode-main/src/vs/base/common/jsonFormatter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createScanner, ScanError, SyntaxKind } from './json.js';

export interface FormattingOptions {
	/**
	 * If indentation is based on spaces (`insertSpaces` = true), then what is the number of spaces that make an indent?
	 */
	tabSize?: number;
	/**
	 * Is indentation based on spaces?
	 */
	insertSpaces?: boolean;
	/**
	 * The default 'end of line' character. If not set, '\n' is used as default.
	 */
	eol?: string;
}

/**
 * Represents a text modification
 */
export interface Edit {
	/**
	 * The start offset of the modification.
	 */
	offset: number;
	/**
	 * The length of the modification. Must not be negative. Empty length represents an *insert*.
	 */
	length: number;
	/**
	 * The new content. Empty content represents a *remove*.
	 */
	content: string;
}

/**
 * A text range in the document
*/
export interface Range {
	/**
	 * The start offset of the range.
	 */
	offset: number;
	/**
	 * The length of the range. Must not be negative.
	 */
	length: number;
}


export function format(documentText: string, range: Range | undefined, options: FormattingOptions): Edit[] {
	let initialIndentLevel: number;
	let formatText: string;
	let formatTextStart: number;
	let rangeStart: number;
	let rangeEnd: number;
	if (range) {
		rangeStart = range.offset;
		rangeEnd = rangeStart + range.length;

		formatTextStart = rangeStart;
		while (formatTextStart > 0 && !isEOL(documentText, formatTextStart - 1)) {
			formatTextStart--;
		}
		let endOffset = rangeEnd;
		while (endOffset < documentText.length && !isEOL(documentText, endOffset)) {
			endOffset++;
		}
		formatText = documentText.substring(formatTextStart, endOffset);
		initialIndentLevel = computeIndentLevel(formatText, options);
	} else {
		formatText = documentText;
		initialIndentLevel = 0;
		formatTextStart = 0;
		rangeStart = 0;
		rangeEnd = documentText.length;
	}
	const eol = getEOL(options, documentText);

	let lineBreak = false;
	let indentLevel = 0;
	let indentValue: string;
	if (options.insertSpaces) {
		indentValue = repeat(' ', options.tabSize || 4);
	} else {
		indentValue = '\t';
	}

	const scanner = createScanner(formatText, false);
	let hasError = false;

	function newLineAndIndent(): string {
		return eol + repeat(indentValue, initialIndentLevel + indentLevel);
	}
	function scanNext(): SyntaxKind {
		let token = scanner.scan();
		lineBreak = false;
		while (token === SyntaxKind.Trivia || token === SyntaxKind.LineBreakTrivia) {
			lineBreak = lineBreak || (token === SyntaxKind.LineBreakTrivia);
			token = scanner.scan();
		}
		hasError = token === SyntaxKind.Unknown || scanner.getTokenError() !== ScanError.None;
		return token;
	}
	const editOperations: Edit[] = [];
	function addEdit(text: string, startOffset: number, endOffset: number) {
		if (!hasError && startOffset < rangeEnd && endOffset > rangeStart && documentText.substring(startOffset, endOffset) !== text) {
			editOperations.push({ offset: startOffset, length: endOffset - startOffset, content: text });
		}
	}

	let firstToken = scanNext();

	if (firstToken !== SyntaxKind.EOF) {
		const firstTokenStart = scanner.getTokenOffset() + formatTextStart;
		const initialIndent = repeat(indentValue, initialIndentLevel);
		addEdit(initialIndent, formatTextStart, firstTokenStart);
	}

	while (firstToken !== SyntaxKind.EOF) {
		let firstTokenEnd = scanner.getTokenOffset() + scanner.getTokenLength() + formatTextStart;
		let secondToken = scanNext();

		let replaceContent = '';
		while (!lineBreak && (secondToken === SyntaxKind.LineCommentTrivia || secondToken === SyntaxKind.BlockCommentTrivia)) {
			// comments on the same line: keep them on the same line, but ignore them otherwise
			const commentTokenStart = scanner.getTokenOffset() + formatTextStart;
			addEdit(' ', firstTokenEnd, commentTokenStart);
			firstTokenEnd = scanner.getTokenOffset() + scanner.getTokenLength() + formatTextStart;
			replaceContent = secondToken === SyntaxKind.LineCommentTrivia ? newLineAndIndent() : '';
			secondToken = scanNext();
		}

		if (secondToken === SyntaxKind.CloseBraceToken) {
			if (firstToken !== SyntaxKind.OpenBraceToken) {
				indentLevel--;
				replaceContent = newLineAndIndent();
			}
		} else if (secondToken === SyntaxKind.CloseBracketToken) {
			if (firstToken !== SyntaxKind.OpenBracketToken) {
				indentLevel--;
				replaceContent = newLineAndIndent();
			}
		} else {
			switch (firstToken) {
				case SyntaxKind.OpenBracketToken:
				case SyntaxKind.OpenBraceToken:
					indentLevel++;
					replaceContent = newLineAndIndent();
					break;
				case SyntaxKind.CommaToken:
				case SyntaxKind.LineCommentTrivia:
					replaceContent = newLineAndIndent();
					break;
				case SyntaxKind.BlockCommentTrivia:
					if (lineBreak) {
						replaceContent = newLineAndIndent();
					} else {
						// symbol following comment on the same line: keep on same line, separate with ' '
						replaceContent = ' ';
					}
					break;
				case SyntaxKind.ColonToken:
					replaceContent = ' ';
					break;
				case SyntaxKind.StringLiteral:
					if (secondToken === SyntaxKind.ColonToken) {
						replaceContent = '';
						break;
					}
				// fall through
				case SyntaxKind.NullKeyword:
				case SyntaxKind.TrueKeyword:
				case SyntaxKind.FalseKeyword:
				case SyntaxKind.NumericLiteral:
				case SyntaxKind.CloseBraceToken:
				case SyntaxKind.CloseBracketToken:
					if (secondToken === SyntaxKind.LineCommentTrivia || secondToken === SyntaxKind.BlockCommentTrivia) {
						replaceContent = ' ';
					} else if (secondToken !== SyntaxKind.CommaToken && secondToken !== SyntaxKind.EOF) {
						hasError = true;
					}
					break;
				case SyntaxKind.Unknown:
					hasError = true;
					break;
			}
			if (lineBreak && (secondToken === SyntaxKind.LineCommentTrivia || secondToken === SyntaxKind.BlockCommentTrivia)) {
				replaceContent = newLineAndIndent();
			}

		}
		const secondTokenStart = scanner.getTokenOffset() + formatTextStart;
		addEdit(replaceContent, firstTokenEnd, secondTokenStart);
		firstToken = secondToken;
	}
	return editOperations;
}

/**
 * Creates a formatted string out of the object passed as argument, using the given formatting options
 * @param any The object to stringify and format
 * @param options The formatting options to use
 */
export function toFormattedString(obj: unknown, options: FormattingOptions) {
	const content = JSON.stringify(obj, undefined, options.insertSpaces ? options.tabSize || 4 : '\t');
	if (options.eol !== undefined) {
		return content.replace(/\r\n|\r|\n/g, options.eol);
	}
	return content;
}

function repeat(s: string, count: number): string {
	let result = '';
	for (let i = 0; i < count; i++) {
		result += s;
	}
	return result;
}

function computeIndentLevel(content: string, options: FormattingOptions): number {
	let i = 0;
	let nChars = 0;
	const tabSize = options.tabSize || 4;
	while (i < content.length) {
		const ch = content.charAt(i);
		if (ch === ' ') {
			nChars++;
		} else if (ch === '\t') {
			nChars += tabSize;
		} else {
			break;
		}
		i++;
	}
	return Math.floor(nChars / tabSize);
}

export function getEOL(options: FormattingOptions, text: string): string {
	for (let i = 0; i < text.length; i++) {
		const ch = text.charAt(i);
		if (ch === '\r') {
			if (i + 1 < text.length && text.charAt(i + 1) === '\n') {
				return '\r\n';
			}
			return '\r';
		} else if (ch === '\n') {
			return '\n';
		}
	}
	return (options && options.eol) || '\n';
}

export function isEOL(text: string, offset: number) {
	return '\r\n'.indexOf(text.charAt(offset)) !== -1;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/jsonSchema.ts]---
Location: vscode-main/src/vs/base/common/jsonSchema.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export type JSONSchemaType = 'string' | 'number' | 'integer' | 'boolean' | 'null' | 'array' | 'object';

export interface IJSONSchema {
	id?: string;
	$id?: string;
	$schema?: string;
	type?: JSONSchemaType | JSONSchemaType[];
	title?: string;
	default?: any;
	definitions?: IJSONSchemaMap;
	description?: string;
	properties?: IJSONSchemaMap;
	patternProperties?: IJSONSchemaMap;
	additionalProperties?: boolean | IJSONSchema;
	minProperties?: number;
	maxProperties?: number;
	dependencies?: IJSONSchemaMap | { [prop: string]: string[] };
	items?: IJSONSchema | IJSONSchema[];
	minItems?: number;
	maxItems?: number;
	uniqueItems?: boolean;
	additionalItems?: boolean | IJSONSchema;
	pattern?: string;
	minLength?: number;
	maxLength?: number;
	minimum?: number;
	maximum?: number;
	exclusiveMinimum?: boolean | number;
	exclusiveMaximum?: boolean | number;
	multipleOf?: number;
	required?: string[];
	$ref?: string;
	anyOf?: IJSONSchema[];
	allOf?: IJSONSchema[];
	oneOf?: IJSONSchema[];
	not?: IJSONSchema;
	enum?: any[];
	format?: string;

	// schema draft 06
	const?: any;
	contains?: IJSONSchema;
	propertyNames?: IJSONSchema;
	examples?: any[];

	// schema draft 07
	$comment?: string;
	if?: IJSONSchema;
	then?: IJSONSchema;
	else?: IJSONSchema;

	// schema 2019-09
	unevaluatedProperties?: boolean | IJSONSchema;
	unevaluatedItems?: boolean | IJSONSchema;
	minContains?: number;
	maxContains?: number;
	deprecated?: boolean;
	dependentRequired?: { [prop: string]: string[] };
	dependentSchemas?: IJSONSchemaMap;
	$defs?: { [name: string]: IJSONSchema };
	$anchor?: string;
	$recursiveRef?: string;
	$recursiveAnchor?: string;
	$vocabulary?: any;

	// schema 2020-12
	prefixItems?: IJSONSchema[];
	$dynamicRef?: string;
	$dynamicAnchor?: string;

	// VSCode extensions

	defaultSnippets?: IJSONSchemaSnippet[];
	errorMessage?: string;
	patternErrorMessage?: string;
	deprecationMessage?: string;
	markdownDeprecationMessage?: string;
	enumDescriptions?: string[];
	markdownEnumDescriptions?: string[];
	markdownDescription?: string;
	doNotSuggest?: boolean;
	suggestSortText?: string;
	allowComments?: boolean;
	allowTrailingCommas?: boolean;
}

export interface IJSONSchemaMap {
	[name: string]: IJSONSchema;
}

export interface IJSONSchemaSnippet {
	label?: string;
	description?: string;
	body?: any; // a object that will be JSON stringified
	bodyText?: string; // an already stringified JSON object that can contain new lines (\n) and tabs (\t)
}

/**
 * Converts a basic JSON schema to a TypeScript type.
 */
export type TypeFromJsonSchema<T> =
	// enum
	T extends { enum: infer EnumValues }
	? UnionOf<EnumValues>

	// Object with list of required properties.
	// Values are required or optional based on `required` list.
	: T extends { type: 'object'; properties: infer P; required: infer RequiredList }
	? {
		[K in keyof P]: IsRequired<K, RequiredList> extends true ? TypeFromJsonSchema<P[K]> : TypeFromJsonSchema<P[K]> | undefined;
	} & AdditionalPropertiesType<T>

	// Object with no required properties.
	// All values are optional
	: T extends { type: 'object'; properties: infer P }
	? { [K in keyof P]: TypeFromJsonSchema<P[K]> | undefined } & AdditionalPropertiesType<T>

	// Array
	: T extends { type: 'array'; items: infer Items }
	? Items extends [...infer R]
	// If items is an array, we treat it like a tuple
	? { [K in keyof R]: TypeFromJsonSchema<Items[K]> }
	: Array<TypeFromJsonSchema<Items>>

	// oneOf / anyof
	// These are handled the same way as they both represent a union type.
	// However at the validation level, they have different semantics.
	: T extends { oneOf: infer I }
	? MapSchemaToType<I>
	: T extends { anyOf: infer I }
	? MapSchemaToType<I>

	// Primitive types
	: T extends { type: infer Type }
	// Basic type
	? Type extends 'string' | 'number' | 'integer' | 'boolean' | 'null'
	? SchemaPrimitiveTypeNameToType<Type>
	// Union of primitive types
	: Type extends [...infer R]
	? UnionOf<{ [K in keyof R]: SchemaPrimitiveTypeNameToType<R[K]> }>
	: never

	// Fallthrough
	: never;

type SchemaPrimitiveTypeNameToType<T> =
	T extends 'string' ? string :
	T extends 'number' | 'integer' ? number :
	T extends 'boolean' ? boolean :
	T extends 'null' ? null :
	never;

type UnionOf<T> =
	T extends [infer First, ...infer Rest]
	? First | UnionOf<Rest>
	: never;

type IsRequired<K, RequiredList> =
	RequiredList extends []
	? false

	: RequiredList extends [K, ...infer _]
	? true

	: RequiredList extends [infer _, ...infer R]
	? IsRequired<K, R>

	: false;

type AdditionalPropertiesType<Schema> =
	Schema extends { additionalProperties: infer AP }
	? AP extends false ? {} : { [key: string]: TypeFromJsonSchema<Schema['additionalProperties']> }
	: {};

type MapSchemaToType<T> = T extends [infer First, ...infer Rest]
	? TypeFromJsonSchema<First> | MapSchemaToType<Rest>
	: never;

interface Equals { schemas: IJSONSchema[]; id?: string }

export function getCompressedContent(schema: IJSONSchema): string {
	let hasDups = false;


	// visit all schema nodes and collect the ones that are equal
	const equalsByString = new Map<string, Equals>();
	const nodeToEquals = new Map<IJSONSchema, Equals>();
	const visitSchemas = (next: IJSONSchema) => {
		if (schema === next) {
			return true;
		}
		const val = JSON.stringify(next);
		if (val.length < 30) {
			// the $ref takes around 25 chars, so we don't save anything
			return true;
		}
		const eq = equalsByString.get(val);
		if (!eq) {
			const newEq = { schemas: [next] };
			equalsByString.set(val, newEq);
			nodeToEquals.set(next, newEq);
			return true;
		}
		eq.schemas.push(next);
		nodeToEquals.set(next, eq);
		hasDups = true;
		return false;
	};
	traverseNodes(schema, visitSchemas);
	equalsByString.clear();

	if (!hasDups) {
		return JSON.stringify(schema);
	}

	let defNodeName = '$defs';
	while (schema.hasOwnProperty(defNodeName)) {
		defNodeName += '_';
	}

	// used to collect all schemas that are later put in `$defs`. The index in the array is the id of the schema.
	const definitions: IJSONSchema[] = [];

	function stringify(root: IJSONSchema): string {
		return JSON.stringify(root, (_key: string, value: any) => {
			if (value !== root) {
				const eq = nodeToEquals.get(value);
				if (eq && eq.schemas.length > 1) {
					if (!eq.id) {
						eq.id = `_${definitions.length}`;
						definitions.push(eq.schemas[0]);
					}
					return { $ref: `#/${defNodeName}/${eq.id}` };
				}
			}
			return value;
		});
	}

	// stringify the schema and replace duplicate subtrees with $ref
	// this will add new items to the definitions array
	const str = stringify(schema);

	// now stringify the definitions. Each invication of stringify cann add new items to the definitions array, so the length can grow while we iterate
	const defStrings: string[] = [];
	for (let i = 0; i < definitions.length; i++) {
		defStrings.push(`"_${i}":${stringify(definitions[i])}`);
	}
	if (defStrings.length) {
		return `${str.substring(0, str.length - 1)},"${defNodeName}":{${defStrings.join(',')}}}`;
	}
	return str;
}

type IJSONSchemaRef = IJSONSchema | boolean;

function isObject(thing: unknown): thing is object {
	return typeof thing === 'object' && thing !== null;
}

/*
 * Traverse a JSON schema and visit each schema node
*/
function traverseNodes(root: IJSONSchema, visit: (schema: IJSONSchema) => boolean) {
	if (!root || typeof root !== 'object') {
		return;
	}
	const collectEntries = (...entries: (IJSONSchemaRef | undefined)[]) => {
		for (const entry of entries) {
			if (isObject(entry)) {
				toWalk.push(entry);
			}
		}
	};
	const collectMapEntries = (...maps: (IJSONSchemaMap | undefined)[]) => {
		for (const map of maps) {
			if (isObject(map)) {
				for (const key in map) {
					const entry = map[key];
					if (isObject(entry)) {
						toWalk.push(entry);
					}
				}
			}
		}
	};
	const collectArrayEntries = (...arrays: (IJSONSchemaRef[] | undefined)[]) => {
		for (const array of arrays) {
			if (Array.isArray(array)) {
				for (const entry of array) {
					if (isObject(entry)) {
						toWalk.push(entry);
					}
				}
			}
		}
	};
	const collectEntryOrArrayEntries = (items: (IJSONSchemaRef[] | IJSONSchemaRef | undefined)) => {
		if (Array.isArray(items)) {
			for (const entry of items) {
				if (isObject(entry)) {
					toWalk.push(entry);
				}
			}
		} else if (isObject(items)) {
			toWalk.push(items);
		}
	};

	const toWalk: IJSONSchema[] = [root];

	let next = toWalk.pop();
	while (next) {
		const visitChildern = visit(next);
		if (visitChildern) {
			collectEntries(next.additionalItems, next.additionalProperties, next.not, next.contains, next.propertyNames, next.if, next.then, next.else, next.unevaluatedItems, next.unevaluatedProperties);
			collectMapEntries(next.definitions, next.$defs, next.properties, next.patternProperties, <IJSONSchemaMap>next.dependencies, next.dependentSchemas);
			collectArrayEntries(next.anyOf, next.allOf, next.oneOf, next.prefixItems);
			collectEntryOrArrayEntries(next.items);
		}
		next = toWalk.pop();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/keybindingLabels.ts]---
Location: vscode-main/src/vs/base/common/keybindingLabels.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Modifiers } from './keybindings.js';
import { OperatingSystem } from './platform.js';
import * as nls from '../../nls.js';

export interface ModifierLabels {
	readonly ctrlKey: string;
	readonly shiftKey: string;
	readonly altKey: string;
	readonly metaKey: string;
	readonly separator: string;
}

export interface KeyLabelProvider<T extends Modifiers> {
	(keybinding: T): string | null;
}

export class ModifierLabelProvider {

	public readonly modifierLabels: ModifierLabels[];

	constructor(mac: ModifierLabels, windows: ModifierLabels, linux: ModifierLabels = windows) {
		this.modifierLabels = [null!]; // index 0 will never me accessed.
		this.modifierLabels[OperatingSystem.Macintosh] = mac;
		this.modifierLabels[OperatingSystem.Windows] = windows;
		this.modifierLabels[OperatingSystem.Linux] = linux;
	}

	public toLabel<T extends Modifiers>(OS: OperatingSystem, chords: readonly T[], keyLabelProvider: KeyLabelProvider<T>): string | null {
		if (chords.length === 0) {
			return null;
		}

		const result: string[] = [];
		for (let i = 0, len = chords.length; i < len; i++) {
			const chord = chords[i];
			const keyLabel = keyLabelProvider(chord);
			if (keyLabel === null) {
				// this keybinding cannot be expressed...
				return null;
			}
			result[i] = _simpleAsString(chord, keyLabel, this.modifierLabels[OS]);
		}
		return result.join(' ');
	}
}

/**
 * A label provider that prints modifiers in a suitable format for displaying in the UI.
 */
export const UILabelProvider = new ModifierLabelProvider(
	{
		ctrlKey: '\u2303',
		shiftKey: '⇧',
		altKey: '⌥',
		metaKey: '⌘',
		separator: '',
	},
	{
		ctrlKey: nls.localize({ key: 'ctrlKey', comment: ['This is the short form for the Control key on the keyboard'] }, "Ctrl"),
		shiftKey: nls.localize({ key: 'shiftKey', comment: ['This is the short form for the Shift key on the keyboard'] }, "Shift"),
		altKey: nls.localize({ key: 'altKey', comment: ['This is the short form for the Alt key on the keyboard'] }, "Alt"),
		metaKey: nls.localize({ key: 'windowsKey', comment: ['This is the short form for the Windows key on the keyboard'] }, "Windows"),
		separator: '+',
	},
	{
		ctrlKey: nls.localize({ key: 'ctrlKey', comment: ['This is the short form for the Control key on the keyboard'] }, "Ctrl"),
		shiftKey: nls.localize({ key: 'shiftKey', comment: ['This is the short form for the Shift key on the keyboard'] }, "Shift"),
		altKey: nls.localize({ key: 'altKey', comment: ['This is the short form for the Alt key on the keyboard'] }, "Alt"),
		metaKey: nls.localize({ key: 'superKey', comment: ['This is the short form for the Super key on the keyboard'] }, "Super"),
		separator: '+',
	}
);

/**
 * A label provider that prints modifiers in a suitable format for ARIA.
 */
export const AriaLabelProvider = new ModifierLabelProvider(
	{
		ctrlKey: nls.localize({ key: 'ctrlKey.long', comment: ['This is the long form for the Control key on the keyboard'] }, "Control"),
		shiftKey: nls.localize({ key: 'shiftKey.long', comment: ['This is the long form for the Shift key on the keyboard'] }, "Shift"),
		altKey: nls.localize({ key: 'optKey.long', comment: ['This is the long form for the Alt/Option key on the keyboard'] }, "Option"),
		metaKey: nls.localize({ key: 'cmdKey.long', comment: ['This is the long form for the Command key on the keyboard'] }, "Command"),
		separator: '+',
	},
	{
		ctrlKey: nls.localize({ key: 'ctrlKey.long', comment: ['This is the long form for the Control key on the keyboard'] }, "Control"),
		shiftKey: nls.localize({ key: 'shiftKey.long', comment: ['This is the long form for the Shift key on the keyboard'] }, "Shift"),
		altKey: nls.localize({ key: 'altKey.long', comment: ['This is the long form for the Alt key on the keyboard'] }, "Alt"),
		metaKey: nls.localize({ key: 'windowsKey.long', comment: ['This is the long form for the Windows key on the keyboard'] }, "Windows"),
		separator: '+',
	},
	{
		ctrlKey: nls.localize({ key: 'ctrlKey.long', comment: ['This is the long form for the Control key on the keyboard'] }, "Control"),
		shiftKey: nls.localize({ key: 'shiftKey.long', comment: ['This is the long form for the Shift key on the keyboard'] }, "Shift"),
		altKey: nls.localize({ key: 'altKey.long', comment: ['This is the long form for the Alt key on the keyboard'] }, "Alt"),
		metaKey: nls.localize({ key: 'superKey.long', comment: ['This is the long form for the Super key on the keyboard'] }, "Super"),
		separator: '+',
	}
);

/**
 * A label provider that prints modifiers in a suitable format for Electron Accelerators.
 * See https://github.com/electron/electron/blob/master/docs/api/accelerator.md
 */
export const ElectronAcceleratorLabelProvider = new ModifierLabelProvider(
	{
		ctrlKey: 'Ctrl',
		shiftKey: 'Shift',
		altKey: 'Alt',
		metaKey: 'Cmd',
		separator: '+',
	},
	{
		ctrlKey: 'Ctrl',
		shiftKey: 'Shift',
		altKey: 'Alt',
		metaKey: 'Super',
		separator: '+',
	}
);

/**
 * A label provider that prints modifiers in a suitable format for user settings.
 */
export const UserSettingsLabelProvider = new ModifierLabelProvider(
	{
		ctrlKey: 'ctrl',
		shiftKey: 'shift',
		altKey: 'alt',
		metaKey: 'cmd',
		separator: '+',
	},
	{
		ctrlKey: 'ctrl',
		shiftKey: 'shift',
		altKey: 'alt',
		metaKey: 'win',
		separator: '+',
	},
	{
		ctrlKey: 'ctrl',
		shiftKey: 'shift',
		altKey: 'alt',
		metaKey: 'meta',
		separator: '+',
	}
);

function _simpleAsString(modifiers: Modifiers, key: string, labels: ModifierLabels): string {
	if (key === null) {
		return '';
	}

	const result: string[] = [];

	// translate modifier keys: Ctrl-Shift-Alt-Meta
	if (modifiers.ctrlKey) {
		result.push(labels.ctrlKey);
	}

	if (modifiers.shiftKey) {
		result.push(labels.shiftKey);
	}

	if (modifiers.altKey) {
		result.push(labels.altKey);
	}

	if (modifiers.metaKey) {
		result.push(labels.metaKey);
	}

	// the actual key
	if (key !== '') {
		result.push(key);
	}

	return result.join(labels.separator);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/keybindingParser.ts]---
Location: vscode-main/src/vs/base/common/keybindingParser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCodeUtils, ScanCodeUtils } from './keyCodes.js';
import { KeyCodeChord, ScanCodeChord, Keybinding, Chord } from './keybindings.js';

export class KeybindingParser {

	private static _readModifiers(input: string) {
		input = input.toLowerCase().trim();

		let ctrl = false;
		let shift = false;
		let alt = false;
		let meta = false;

		let matchedModifier: boolean;

		do {
			matchedModifier = false;
			if (/^ctrl(\+|\-)/.test(input)) {
				ctrl = true;
				input = input.substr('ctrl-'.length);
				matchedModifier = true;
			}
			if (/^shift(\+|\-)/.test(input)) {
				shift = true;
				input = input.substr('shift-'.length);
				matchedModifier = true;
			}
			if (/^alt(\+|\-)/.test(input)) {
				alt = true;
				input = input.substr('alt-'.length);
				matchedModifier = true;
			}
			if (/^meta(\+|\-)/.test(input)) {
				meta = true;
				input = input.substr('meta-'.length);
				matchedModifier = true;
			}
			if (/^win(\+|\-)/.test(input)) {
				meta = true;
				input = input.substr('win-'.length);
				matchedModifier = true;
			}
			if (/^cmd(\+|\-)/.test(input)) {
				meta = true;
				input = input.substr('cmd-'.length);
				matchedModifier = true;
			}
		} while (matchedModifier);

		let key: string;

		const firstSpaceIdx = input.indexOf(' ');
		if (firstSpaceIdx > 0) {
			key = input.substring(0, firstSpaceIdx);
			input = input.substring(firstSpaceIdx);
		} else {
			key = input;
			input = '';
		}

		return {
			remains: input,
			ctrl,
			shift,
			alt,
			meta,
			key
		};
	}

	private static parseChord(input: string): [Chord, string] {
		const mods = this._readModifiers(input);
		const scanCodeMatch = mods.key.match(/^\[([^\]]+)\]$/);
		if (scanCodeMatch) {
			const strScanCode = scanCodeMatch[1];
			const scanCode = ScanCodeUtils.lowerCaseToEnum(strScanCode);
			return [new ScanCodeChord(mods.ctrl, mods.shift, mods.alt, mods.meta, scanCode), mods.remains];
		}
		const keyCode = KeyCodeUtils.fromUserSettings(mods.key);
		return [new KeyCodeChord(mods.ctrl, mods.shift, mods.alt, mods.meta, keyCode), mods.remains];
	}

	static parseKeybinding(input: string): Keybinding | null {
		if (!input) {
			return null;
		}

		const chords: Chord[] = [];
		let chord: Chord;

		while (input.length > 0) {
			[chord, input] = this.parseChord(input);
			chords.push(chord);
		}
		return (chords.length > 0 ? new Keybinding(chords) : null);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/keybindings.ts]---
Location: vscode-main/src/vs/base/common/keybindings.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { illegalArgument } from './errors.js';
import { KeyCode, ScanCode } from './keyCodes.js';
import { OperatingSystem } from './platform.js';

/**
 * Binary encoding strategy:
 * ```
 *    1111 11
 *    5432 1098 7654 3210
 *    ---- CSAW KKKK KKKK
 *  C = bit 11 = ctrlCmd flag
 *  S = bit 10 = shift flag
 *  A = bit 9 = alt flag
 *  W = bit 8 = winCtrl flag
 *  K = bits 0-7 = key code
 * ```
 */
const enum BinaryKeybindingsMask {
	CtrlCmd = (1 << 11) >>> 0,
	Shift = (1 << 10) >>> 0,
	Alt = (1 << 9) >>> 0,
	WinCtrl = (1 << 8) >>> 0,
	KeyCode = 0x000000FF
}

export function decodeKeybinding(keybinding: number | number[], OS: OperatingSystem): Keybinding | null {
	if (typeof keybinding === 'number') {
		if (keybinding === 0) {
			return null;
		}
		const firstChord = (keybinding & 0x0000FFFF) >>> 0;
		const secondChord = (keybinding & 0xFFFF0000) >>> 16;
		if (secondChord !== 0) {
			return new Keybinding([
				createSimpleKeybinding(firstChord, OS),
				createSimpleKeybinding(secondChord, OS)
			]);
		}
		return new Keybinding([createSimpleKeybinding(firstChord, OS)]);
	} else {
		const chords = [];
		for (let i = 0; i < keybinding.length; i++) {
			chords.push(createSimpleKeybinding(keybinding[i], OS));
		}
		return new Keybinding(chords);
	}
}

export function createSimpleKeybinding(keybinding: number, OS: OperatingSystem): KeyCodeChord {

	const ctrlCmd = (keybinding & BinaryKeybindingsMask.CtrlCmd ? true : false);
	const winCtrl = (keybinding & BinaryKeybindingsMask.WinCtrl ? true : false);

	const ctrlKey = (OS === OperatingSystem.Macintosh ? winCtrl : ctrlCmd);
	const shiftKey = (keybinding & BinaryKeybindingsMask.Shift ? true : false);
	const altKey = (keybinding & BinaryKeybindingsMask.Alt ? true : false);
	const metaKey = (OS === OperatingSystem.Macintosh ? ctrlCmd : winCtrl);
	const keyCode = (keybinding & BinaryKeybindingsMask.KeyCode);

	return new KeyCodeChord(ctrlKey, shiftKey, altKey, metaKey, keyCode);
}

export interface Modifiers {
	readonly ctrlKey: boolean;
	readonly shiftKey: boolean;
	readonly altKey: boolean;
	readonly metaKey: boolean;
}

/**
 * Represents a chord which uses the `keyCode` field of keyboard events.
 * A chord is a combination of keys pressed simultaneously.
 */
export class KeyCodeChord implements Modifiers {

	constructor(
		public readonly ctrlKey: boolean,
		public readonly shiftKey: boolean,
		public readonly altKey: boolean,
		public readonly metaKey: boolean,
		public readonly keyCode: KeyCode
	) { }

	public equals(other: Chord): boolean {
		return (
			other instanceof KeyCodeChord
			&& this.ctrlKey === other.ctrlKey
			&& this.shiftKey === other.shiftKey
			&& this.altKey === other.altKey
			&& this.metaKey === other.metaKey
			&& this.keyCode === other.keyCode
		);
	}

	public getHashCode(): string {
		const ctrl = this.ctrlKey ? '1' : '0';
		const shift = this.shiftKey ? '1' : '0';
		const alt = this.altKey ? '1' : '0';
		const meta = this.metaKey ? '1' : '0';
		return `K${ctrl}${shift}${alt}${meta}${this.keyCode}`;
	}

	public isModifierKey(): boolean {
		return (
			this.keyCode === KeyCode.Unknown
			|| this.keyCode === KeyCode.Ctrl
			|| this.keyCode === KeyCode.Meta
			|| this.keyCode === KeyCode.Alt
			|| this.keyCode === KeyCode.Shift
		);
	}

	public toKeybinding(): Keybinding {
		return new Keybinding([this]);
	}

	/**
	 * Does this keybinding refer to the key code of a modifier and it also has the modifier flag?
	 */
	public isDuplicateModifierCase(): boolean {
		return (
			(this.ctrlKey && this.keyCode === KeyCode.Ctrl)
			|| (this.shiftKey && this.keyCode === KeyCode.Shift)
			|| (this.altKey && this.keyCode === KeyCode.Alt)
			|| (this.metaKey && this.keyCode === KeyCode.Meta)
		);
	}
}

/**
 * Represents a chord which uses the `code` field of keyboard events.
 * A chord is a combination of keys pressed simultaneously.
 */
export class ScanCodeChord implements Modifiers {

	constructor(
		public readonly ctrlKey: boolean,
		public readonly shiftKey: boolean,
		public readonly altKey: boolean,
		public readonly metaKey: boolean,
		public readonly scanCode: ScanCode
	) { }

	public equals(other: Chord): boolean {
		return (
			other instanceof ScanCodeChord
			&& this.ctrlKey === other.ctrlKey
			&& this.shiftKey === other.shiftKey
			&& this.altKey === other.altKey
			&& this.metaKey === other.metaKey
			&& this.scanCode === other.scanCode
		);
	}

	public getHashCode(): string {
		const ctrl = this.ctrlKey ? '1' : '0';
		const shift = this.shiftKey ? '1' : '0';
		const alt = this.altKey ? '1' : '0';
		const meta = this.metaKey ? '1' : '0';
		return `S${ctrl}${shift}${alt}${meta}${this.scanCode}`;
	}

	/**
	 * Does this keybinding refer to the key code of a modifier and it also has the modifier flag?
	 */
	public isDuplicateModifierCase(): boolean {
		return (
			(this.ctrlKey && (this.scanCode === ScanCode.ControlLeft || this.scanCode === ScanCode.ControlRight))
			|| (this.shiftKey && (this.scanCode === ScanCode.ShiftLeft || this.scanCode === ScanCode.ShiftRight))
			|| (this.altKey && (this.scanCode === ScanCode.AltLeft || this.scanCode === ScanCode.AltRight))
			|| (this.metaKey && (this.scanCode === ScanCode.MetaLeft || this.scanCode === ScanCode.MetaRight))
		);
	}
}

export type Chord = KeyCodeChord | ScanCodeChord;

/**
 * A keybinding is a sequence of chords.
 */
export class Keybinding {

	public readonly chords: Chord[];

	constructor(chords: Chord[]) {
		if (chords.length === 0) {
			throw illegalArgument(`chords`);
		}
		this.chords = chords;
	}

	public getHashCode(): string {
		let result = '';
		for (let i = 0, len = this.chords.length; i < len; i++) {
			if (i !== 0) {
				result += ';';
			}
			result += this.chords[i].getHashCode();
		}
		return result;
	}

	public equals(other: Keybinding | null): boolean {
		if (other === null) {
			return false;
		}
		if (this.chords.length !== other.chords.length) {
			return false;
		}
		for (let i = 0; i < this.chords.length; i++) {
			if (!this.chords[i].equals(other.chords[i])) {
				return false;
			}
		}
		return true;
	}
}

export class ResolvedChord {
	constructor(
		public readonly ctrlKey: boolean,
		public readonly shiftKey: boolean,
		public readonly altKey: boolean,
		public readonly metaKey: boolean,
		public readonly keyLabel: string | null,
		public readonly keyAriaLabel: string | null
	) { }
}

export type SingleModifierChord = 'ctrl' | 'shift' | 'alt' | 'meta';

/**
 * A resolved keybinding. Consists of one or multiple chords.
 */
export abstract class ResolvedKeybinding {
	/**
	 * This prints the binding in a format suitable for displaying in the UI.
	 */
	public abstract getLabel(): string | null;
	/**
	 * This prints the binding in a format suitable for ARIA.
	 */
	public abstract getAriaLabel(): string | null;
	/**
	 * This prints the binding in a format suitable for electron's accelerators.
	 * See https://github.com/electron/electron/blob/master/docs/api/accelerator.md
	 */
	public abstract getElectronAccelerator(): string | null;
	/**
	 * This prints the binding in a format suitable for user settings.
	 */
	public abstract getUserSettingsLabel(): string | null;
	/**
	 * Is the user settings label reflecting the label?
	 */
	public abstract isWYSIWYG(): boolean;
	/**
	 * Does the keybinding consist of more than one chord?
	 */
	public abstract hasMultipleChords(): boolean;
	/**
	 * Returns the chords that comprise of the keybinding.
	 */
	public abstract getChords(): ResolvedChord[];
	/**
	 * Returns the chords as strings useful for dispatching.
	 * Returns null for modifier only chords.
	 * @example keybinding "Shift" -> null
	 * @example keybinding ("D" with shift == true) -> "shift+D"
	 */
	public abstract getDispatchChords(): (string | null)[];
	/**
	 * Returns the modifier only chords as strings useful for dispatching.
	 * Returns null for chords that contain more than one modifier or a regular key.
	 * @example keybinding "Shift" -> "shift"
	 * @example keybinding ("D" with shift == true") -> null
	 */
	public abstract getSingleModifierDispatchChords(): (SingleModifierChord | null)[];
}
```

--------------------------------------------------------------------------------

````

---
source_txt: FULLSTACK_CODE_DATABASE_PART9_UTILITIES_HELPERS.txt
converted_utc: 2025-12-17T23:22:00Z
part: 1
parts_total: 2
---

# FULLSTACK CODE DATABASE PART9 UTILITIES HELPERS

## Verbatim Content (Part 1 of 2)

````text
================================================================================
FULLSTACK CODE DATABASE - PART 9: UTILITY FUNCTIONS & HELPER PATTERNS
================================================================================
Generated: December 16, 2025
Source: omni-tools-main
Tech Stack: TypeScript, React, lodash, Material-UI
================================================================================

TABLE OF CONTENTS:
1. Additional Custom Hooks
2. String Utilities
3. Array Utilities
4. CSV Parsing Utilities
5. Color Utilities
6. File Utilities
7. Context Patterns (SnackBar)

================================================================================
1. ADDITIONAL CUSTOM HOOKS
================================================================================

---[FILE: useTimeout Hook - useTimeout.ts]---
Location: src/hooks/useTimeout.ts
Purpose: Execute callback after delay with automatic cleanup

```typescript
import {useEffect, useRef} from 'react';

/**
 * The useTimeout function is a custom hook that sets a timeout for a given callback function.
 * It takes in a callback function and a delay time in milliseconds as parameters.
 * It returns nothing.
 */
function useTimeout(callback: () => void, delay: number) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (delay !== null && callback && typeof callback === 'function') {
      timer = setTimeout(callbackRef.current, delay);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [callback, delay]);
}

export default useTimeout;
```

USAGE NOTES:
- Auto-cleanup on unmount
- Uses ref to prevent re-registering timeout
- Null delay prevents timeout from starting

USAGE EXAMPLES:
```typescript
import useTimeout from 'hooks/useTimeout';

// 1. AUTO-HIDE NOTIFICATION
function Notification({message}) {
  const [visible, setVisible] = useState(true);

  useTimeout(() => {
    setVisible(false);
  }, 3000);

  if (!visible) return null;
  return <div className="notification">{message}</div>;
}

// 2. DELAYED ACTION
function SearchResults() {
  const [showResults, setShowResults] = useState(false);

  useTimeout(() => {
    setShowResults(true);
  }, 500);

  return showResults ? <ResultsList /> : <Skeleton />;
}

// 3. SESSION TIMEOUT WARNING
function SessionManager() {
  const [showWarning, setShowWarning] = useState(false);
  const SESSION_WARNING_TIME = 25 * 60 * 1000; // 25 minutes

  useTimeout(() => {
    setShowWarning(true);
  }, SESSION_WARNING_TIME);

  return showWarning && <SessionExpireWarning />;
}
```

================================================================================

---[FILE: usePrevious Hook - usePrevious.ts]---
Location: src/hooks/usePrevious.ts
Purpose: Access previous value of a variable

```typescript
import {useEffect, useRef} from 'react';

/**
 * The usePrevious function is a custom hook that returns the previous value of a variable.
 * It takes in a value as a parameter and returns the previous value.
 */
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]);

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export default usePrevious;
```

USAGE NOTES:
- Returns undefined on first render
- Useful for comparing current and previous values
- Great for detecting changes

USAGE EXAMPLES:
```typescript
import usePrevious from 'hooks/usePrevious';

// 1. DETECT VALUE CHANGE
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  useEffect(() => {
    if (prevCount !== undefined && count > prevCount) {
      console.log(`Count increased from ${prevCount} to ${count}`);
    }
  }, [count, prevCount]);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}

// 2. COMPARE PROPS
function UserProfile({userId}) {
  const prevUserId = usePrevious(userId);

  useEffect(() => {
    if (prevUserId && prevUserId !== userId) {
      console.log('User changed, fetching new data');
      fetchUserData(userId);
    }
  }, [userId, prevUserId]);

  return <div>User: {userId}</div>;
}

// 3. UNDO FUNCTIONALITY
function TextEditor() {
  const [text, setText] = useState('');
  const prevText = usePrevious(text);

  const undo = () => {
    if (prevText !== undefined) {
      setText(prevText);
    }
  };

  return (
    <>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={undo} disabled={!prevText}>Undo</button>
    </>
  );
}
```

================================================================================

---[FILE: useUpdateEffect Hook - useUpdateEffect.ts]---
Location: src/hooks/useUpdateEffect.ts
Purpose: useEffect that skips initial mount

```typescript
import {DependencyList, EffectCallback, useEffect, useRef} from 'react';

/**
 * The useUpdateEffect function is a custom hook that behaves like useEffect, 
 * but only runs on updates and not on initial mount.
 * It takes in an effect function and an optional dependency list as parameters.
 * It returns nothing.
 */
const useUpdateEffect = (effect: EffectCallback, deps?: DependencyList) => {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, deps);
};

export default useUpdateEffect;
```

USAGE NOTES:
- Skips running effect on initial component mount
- Only runs when dependencies change after mount
- Perfect for responding to updates only

USAGE EXAMPLES:
```typescript
import useUpdateEffect from 'hooks/useUpdateEffect';

// 1. SAVE ONLY ON UPDATES
function Settings() {
  const [settings, setSettings] = useState(loadSettings());

  useUpdateEffect(() => {
    // Don't save on initial load, only when user changes settings
    saveSettings(settings);
    toast.success('Settings saved!');
  }, [settings]);

  return <SettingsForm value={settings} onChange={setSettings} />;
}

// 2. TRACK PROP CHANGES
function Analytics({pageId}) {
  useUpdateEffect(() => {
    // Don't track initial page view, only navigation
    trackPageChange(pageId);
  }, [pageId]);

  return <Page id={pageId} />;
}

// 3. API CALL ON FILTER CHANGE
function ProductList() {
  const [filters, setFilters] = useState({category: 'all', sort: 'name'});

  useUpdateEffect(() => {
    // Don't fetch on mount (useEffect already does that)
    // Only fetch when filters change
    fetchProducts(filters);
  }, [filters]);

  return <Products filters={filters} onFilterChange={setFilters} />;
}
```

================================================================================

---[FILE: useDebounce Hook (with lodash) - useDebounce.ts]---
Location: src/hooks/useDebounce.ts
Purpose: Debounce function calls with lodash integration

```typescript
import {useCallback, useEffect, useRef} from 'react';
import _ from 'lodash';

/**
 * Debounce hook.
 * @param {T} callback
 * @param {number} delay
 * @returns {T}
 */
function useDebounce<T extends (...args: never[]) => void>(
  callback: T,
  delay: number
): T {
  const callbackRef = useRef<T>(callback);

  // Update the current callback each time it changes.
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedFn = useCallback(
    _.debounce((...args: never[]) => {
      callbackRef.current(...args);
    }, delay),
    [delay]
  );

  useEffect(() => {
    // Cleanup function to cancel any pending debounced calls
    return () => {
      debouncedFn.cancel();
    };
  }, [debouncedFn]);

  return debouncedFn as unknown as T;
}

export default useDebounce;
```

USAGE NOTES:
- Uses lodash debounce with cancel support
- Auto-cancels pending calls on unmount
- Preserves function signature with generics

USAGE EXAMPLE:
```typescript
import useDebounce from 'hooks/useDebounce';

function SearchBox() {
  const debouncedSearch = useDebounce((query: string) => {
    console.log('Searching for:', query);
    fetchResults(query);
  }, 500);

  return (
    <input 
      onChange={(e) => debouncedSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

================================================================================
2. STRING UTILITIES
================================================================================

---[FILE: String Utilities - string.ts]---
Location: src/utils/string.ts
Purpose: String manipulation and validation helpers

```typescript
// Special character visual representations
export const specialCharMap: {[key: string]: string} = {
  '': '␀',
  ' ': '␣',
  '\n': '↲',
  '\t': '⇥',
  '\r': '␍',
  '\f': '␌',
  '\v': '␋'
};

// CAPITALIZE FIRST LETTER
export function capitalizeFirstLetter(string: string | undefined) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// CHECK IF VALUE IS NUMBER
export function isNumber(number: any): boolean {
  return !isNaN(parseFloat(number)) && isFinite(number);
}

// REPLACE ESCAPE SEQUENCES
export const replaceSpecialCharacters = (str: string) => {
  return str
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\r/g, '\r')
    .replace(/\\b/g, '\b')
    .replace(/\\f/g, '\f')
    .replace(/\\v/g, '\v');
};

// REVERSE STRING
export function reverseString(input: string): string {
  return input.split('').reverse().join('');
}

// CHECK IF STRING CONTAINS ONLY DIGITS
export function containsOnlyDigits(input: string): boolean {
  return /^\d+(\.\d+)?$/.test(input.trim());
}

// UNQUOTE STRING IF QUOTED
export function unquoteIfQuoted(value: string, quoteCharacter: string): string {
  if (
    quoteCharacter &&
    value.startsWith(quoteCharacter) &&
    value.endsWith(quoteCharacter)
  ) {
    return value.slice(1, -1); // Remove first and last character
  }
  return value;
}

// COUNT ITEM OCCURRENCES
export function itemCounter(
  array: string[],
  ignoreItemCase: boolean
): {[key: string]: number} {
  const dict: {[key: string]: number} = {};
  
  for (const item of array) {
    let key = ignoreItemCase ? item.toLowerCase() : item;

    if (key in specialCharMap) {
      key = specialCharMap[key];
    }

    dict[key] = (dict[key] || 0) + 1;
  }
  
  return dict;
}
```

USAGE EXAMPLES:
```typescript
import {
  capitalizeFirstLetter,
  isNumber,
  reverseString,
  containsOnlyDigits,
  unquoteIfQuoted,
  itemCounter
} from 'utils/string';

// 1. CAPITALIZE
console.log(capitalizeFirstLetter('hello')); // "Hello"

// 2. NUMBER VALIDATION
console.log(isNumber('123')); // true
console.log(isNumber('123.45')); // true
console.log(isNumber('abc')); // false

// 3. REVERSE STRING
console.log(reverseString('hello')); // "olleh"

// 4. DIGITS ONLY
console.log(containsOnlyDigits('123')); // true
console.log(containsOnlyDigits('12.34')); // true
console.log(containsOnlyDigits('12a')); // false

// 5. UNQUOTE
console.log(unquoteIfQuoted('"hello"', '"')); // "hello"
console.log(unquoteIfQuoted('hello', '"')); // "hello"

// 6. COUNT OCCURRENCES
const items = ['apple', 'banana', 'apple', 'orange', 'Banana'];
console.log(itemCounter(items, false)); 
// {apple: 2, banana: 1, Banana: 1, orange: 1}
console.log(itemCounter(items, true)); 
// {apple: 2, banana: 2, orange: 1}
```

================================================================================
3. ARRAY UTILITIES
================================================================================

---[FILE: Array Utilities - array.ts]---
Location: src/utils/array.ts
Purpose: 2D array manipulation

```typescript
/**
 * Transpose a 2D array (matrix).
 * @param {any[][]} matrix - The 2D array to transpose.
 * @returns {any[][]} - The transposed 2D array.
 **/
export function transpose<T>(matrix: T[][]): any[][] {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

/**
 * Normalize and fill a 2D array to ensure all rows have the same length.
 * @param {any[][]} matrix - The 2D array to normalize and fill.
 * @param {any} fillValue - The value to fill in for missing elements.
 * @param {number} desiredLength - The target length of the array. if given take it as maxLength.
 * @returns {any[][]} - The normalized and filled 2D array.
 * **/
export function normalizeAndFill<T>(
  matrix: T[][],
  fillValue: T,
  desiredLength?: number
): T[][] {
  const maxLength = !desiredLength
    ? Math.max(...matrix.map((row) => row.length))
    : desiredLength;
    
  return matrix.map((row) => {
    const filledRow = [...row];
    while (filledRow.length < maxLength) {
      filledRow.push(fillValue);
    }
    return filledRow;
  });
}
```

USAGE EXAMPLES:
```typescript
import {transpose, normalizeAndFill} from 'utils/array';

// 1. TRANSPOSE MATRIX
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
console.log(transpose(matrix));
// [
//   [1, 4, 7],
//   [2, 5, 8],
//   [3, 6, 9]
// ]

// 2. TRANSPOSE NON-SQUARE MATRIX
const data = [
  ['Name', 'Age', 'City'],
  ['John', '30', 'NYC'],
  ['Jane', '25', 'LA']
];
console.log(transpose(data));
// [
//   ['Name', 'John', 'Jane'],
//   ['Age', '30', '25'],
//   ['City', 'NYC', 'LA']
// ]

// 3. NORMALIZE JAGGED ARRAY
const jagged = [
  [1, 2, 3],
  [4, 5],
  [6]
];
console.log(normalizeAndFill(jagged, 0));
// [
//   [1, 2, 3],
//   [4, 5, 0],
//   [6, 0, 0]
// ]

// 4. NORMALIZE TO SPECIFIC LENGTH
const rows = [
  ['A', 'B'],
  ['C']
];
console.log(normalizeAndFill(rows, '', 5));
// [
//   ['A', 'B', '', '', ''],
//   ['C', '', '', '', '']
// ]
```

================================================================================
4. CSV PARSING UTILITIES
================================================================================

---[FILE: CSV Utilities - csv.ts]---
Location: src/utils/csv.ts
Purpose: Parse and manipulate CSV data

```typescript
/**
 * Splits a CSV line into string[], handling quoted string.
 * @param {string} input - The CSV input string.
 * @param {string} delimiter - The character used to split csvlines.
 * @param {string} quoteChar - The character used to quotes csv values.
 * @returns {string[]} - The CSV line as a 1D array.
 */
function splitCsvLine(
  line: string,
  delimiter: string = ',',
  quoteChar: string = '"'
): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === quoteChar) {
      if (inQuotes && nextChar === quoteChar) {
        current += quoteChar;
        i++; // Skip the escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

/**
 * Splits a CSV string into rows, skipping any blank lines.
 * @param {string} input - The CSV input string.
 * @param {boolean} deleteComment - Whether to delete comment lines.
 * @param {string} commentCharacter - The character used to denote comments.
 * @param {boolean} deleteEmptyLines - Whether to delete empty lines.
 * @param {string} delimiter - The character used to separate values.
 * @param {string} quoteChar - The character used to quote values.
 * @returns {string[][]} - The CSV rows as a 2D array.
 */
export function splitCsv(
  input: string,
  deleteComment: boolean,
  commentCharacter: string,
  deleteEmptyLines: boolean,
  delimiter: string = ',',
  quoteChar: string = '"'
): string[][] {
  let rows = input
    .split('\n')
    .map((row) => splitCsvLine(row, delimiter, quoteChar));

  // Remove comments if deleteComment is true
  if (deleteComment && commentCharacter) {
    rows = rows.filter((row) => !row[0].trim().startsWith(commentCharacter));
  }

  // Remove empty lines if deleteEmptyLines is true
  if (deleteEmptyLines) {
    rows = rows.filter((row) => row.some((cell) => cell.trim() !== ''));
  }

  return rows;
}

/**
 * get the headers from a CSV string.
 * @param {string} csvString - The CSV input string.
 * @param {string} csvSeparator - The character used to separate values in the CSV.
 * @param {string} quoteChar - The character used to quotes csv values.
 * @param {string} commentCharacter - The character used to denote comments.
 * @returns {string[]} - The CSV header as a 1D array.
 */
export function getCsvHeaders(
  csvString: string,
  csvSeparator: string = ',',
  quoteChar: string = '"',
  commentCharacter?: string
): string[] {
  const lines = csvString.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    if (
      trimmed === '' ||
      (commentCharacter && trimmed.startsWith(commentCharacter))
    ) {
      continue; // skip empty or commented lines
    }

    const headerLine = splitCsvLine(trimmed, csvSeparator, quoteChar);
    return headerLine.map((h) => h.replace(/^\uFEFF/, '').trim());
  }

  return [];
}
```

USAGE EXAMPLES:
```typescript
import {splitCsv, getCsvHeaders} from 'utils/csv';

// 1. BASIC CSV PARSING
const csv = `Name,Age,City
John,30,NYC
Jane,25,LA`;

const rows = splitCsv(csv, false, '', false, ',', '"');
console.log(rows);
// [
//   ['Name', 'Age', 'City'],
//   ['John', '30', 'NYC'],
//   ['Jane', '25', 'LA']
// ]

// 2. HANDLE QUOTED VALUES WITH COMMAS
const csvWithQuotes = `"Name","Age","City"
"Doe, John","30","New York, NY"
"Smith, Jane","25","Los Angeles, CA"`;

const quotedRows = splitCsv(csvWithQuotes, false, '', false, ',', '"');
console.log(quotedRows);
// [
//   ['Name', 'Age', 'City'],
//   ['Doe, John', '30', 'New York, NY'],
//   ['Smith, Jane', '25', 'Los Angeles, CA']
// ]

// 3. SKIP COMMENTS AND EMPTY LINES
const csvWithComments = `# This is a comment
Name,Age,City

John,30,NYC
# Another comment
Jane,25,LA

`;

const cleanRows = splitCsv(csvWithComments, true, '#', true, ',', '"');
console.log(cleanRows);
// [
//   ['Name', 'Age', 'City'],
//   ['John', '30', 'NYC'],
//   ['Jane', '25', 'LA']
// ]

// 4. GET CSV HEADERS
const headers = getCsvHeaders(csvWithComments, ',', '"', '#');
console.log(headers); // ['Name', 'Age', 'City']

// 5. CUSTOM DELIMITER
const tsvData = `Name\tAge\tCity
John\t30\tNYC`;

const tsvRows = splitCsv(tsvData, false, '', false, '\t', '"');
console.log(tsvRows);
// [
//   ['Name', 'Age', 'City'],
//   ['John', '30', 'NYC']
// ]
```

================================================================================
5. COLOR UTILITIES
================================================================================

---[FILE: Color Utilities - color.ts]---
Location: src/utils/color.ts
Purpose: Color comparison and conversion

```typescript
// CHECK IF TWO COLORS ARE SIMILAR
export function areColorsSimilar(
  color1: [number, number, number],
  color2: [number, number, number],
  similarity: number
): boolean {
  const colorDistance = (
    c1: [number, number, number],
    c2: [number, number, number]
  ) => {
    return Math.sqrt(
      Math.pow(c1[0] - c2[0], 2) +
        Math.pow(c1[1] - c2[1], 2) +
        Math.pow(c1[2] - c2[2], 2)
    );
  };
  
  const maxColorDistance = Math.sqrt(
    Math.pow(255, 2) + Math.pow(255, 2) + Math.pow(255, 2)
  );
  
  const similarityThreshold = (similarity / 100) * maxColorDistance;

  return colorDistance(color1, color2) <= similarityThreshold;
}

// CONVERT HEX TO RGBA
export function convertHexToRGBA(color: string): number {
  // Remove the leading '#' if present
  if (color.startsWith('#')) {
    color = color.slice(1);
  }

  // Convert the color to a number and add the alpha channel
  const colorValue = parseInt(color, 16);
  const alphaChannel = 0xff;
  return (colorValue << 8) | alphaChannel;
}
```

USAGE EXAMPLES:
```typescript
import {areColorsSimilar, convertHexToRGBA} from 'utils/color';

// 1. CHECK COLOR SIMILARITY
const red = [255, 0, 0];
const lightRed = [255, 50, 50];
const blue = [0, 0, 255];

console.log(areColorsSimilar(red, lightRed, 10)); // true (10% similarity)
console.log(areColorsSimilar(red, blue, 10)); // false

// 2. FIND SIMILAR COLORS IN IMAGE
function findSimilarPixels(imageData, targetColor, threshold) {
  const pixels = [];
  for (let i = 0; i < imageData.length; i += 4) {
    const color = [imageData[i], imageData[i + 1], imageData[i + 2]];
    if (areColorsSimilar(color, targetColor, threshold)) {
      pixels.push(i / 4);
    }
  }
  return pixels;
}

// 3. CONVERT HEX TO RGBA
console.log(convertHexToRGBA('#ff0000')); // RGBA number format
console.log(convertHexToRGBA('00ff00')); // Also works without #
```

================================================================================
6. FILE UTILITIES
================================================================================

---[FILE: File Utilities - file.ts]---
Location: src/utils/file.ts
Purpose: File extension and manipulation helpers

```typescript
/**
 * Returns the file extension
 * @param {string} filename - The filename
 * @return {string} - the file extension
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot <= 0) return ''; // No extension
  return filename.slice(lastDot + 1).toLowerCase();
}

/**
 * Get filename without extension
 * @param {string} filename - The full filename
 * @return {string} - filename without extension
 */
export function getFilenameWithoutExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot <= 0) return filename;
  return filename.slice(0, lastDot);
}

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @return {string} - Formatted file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Check if file type is image
 * @param {string} filename - The filename
 * @return {boolean} - true if image file
 */
export function isImageFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext);
}
```

USAGE EXAMPLES:
```typescript
import {
  getFileExtension,
  getFilenameWithoutExtension,
  formatFileSize,
  isImageFile
} from 'utils/file';

// 1. GET EXTENSION
console.log(getFileExtension('document.pdf')); // "pdf"
console.log(getFileExtension('archive.tar.gz')); // "gz"
console.log(getFileExtension('README')); // ""

// 2. GET FILENAME WITHOUT EXTENSION
console.log(getFilenameWithoutExtension('document.pdf')); // "document"
console.log(getFilenameWithoutExtension('archive.tar.gz')); // "archive.tar"

// 3. FORMAT FILE SIZE
console.log(formatFileSize(1024)); // "1 KB"
console.log(formatFileSize(1536)); // "1.5 KB"
console.log(formatFileSize(1048576)); // "1 MB"
console.log(formatFileSize(5242880)); // "5 MB"

// 4. CHECK IF IMAGE
console.log(isImageFile('photo.jpg')); // true
console.log(isImageFile('document.pdf')); // false

// 5. FILE UPLOAD VALIDATION
function validateUpload(file: File) {
  const ext = getFileExtension(file.name);
  const size = formatFileSize(file.size);
  
  if (!isImageFile(file.name)) {
    alert('Please upload an image file');
    return false;
  }
  
  if (file.size > 5 * 1024 * 1024) {
    alert(`File too large: ${size}. Max size is 5 MB`);
    return false;
  }
  
  return true;
}
```

================================================================================
7. CONTEXT PATTERNS (SNACKBAR)
================================================================================

---[FILE: SnackBar Context - CustomSnackBarContext.tsx]---
Location: src/contexts/CustomSnackBarContext.tsx

````

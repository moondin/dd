---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 435
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 435 of 991)

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

---[FILE: StringUtils.test.ts]---
Location: mlflow-master/mlflow/server/js/src/common/utils/StringUtils.test.ts

```typescript
import { describe, test, expect } from '@jest/globals';
import {
  truncateToFirstLineWithMaxLength,
  capitalizeFirstChar,
  middleTruncateStr,
  btoaUtf8,
  atobUtf8,
  isTextCompressedDeflate,
  textCompressDeflate,
  textDecompressDeflate,
} from './StringUtils';

describe('truncateToFirstLineWithMaxLength', () => {
  test('should truncate to first line if it exists', () => {
    const str = 'Test string\nwith a new line';
    expect(truncateToFirstLineWithMaxLength(str, 32)).toEqual('Test string');
  });

  test('if first line longer than maxLength, should truncate and add ellipses', () => {
    const str = 'This is 24 characters, so this part should be truncated';
    expect(truncateToFirstLineWithMaxLength(str, 24)).toEqual('This is 24 characters...');
  });

  test('should not add ellipses if length is equal to maxLength', () => {
    const str = 'This is 21 characters';
    expect(truncateToFirstLineWithMaxLength(str, 21)).toEqual(str);
  });

  test('should not truncate if only 1 line that is shorter than maxLength', () => {
    const str = 'A short line';
    expect(truncateToFirstLineWithMaxLength(str, 32)).toEqual(str);
  });
});

describe('capitalizeFirstChar', () => {
  test('should capitalize first char and lower case all other chars', () => {
    const str = 'i WaNt THis tO oNlY cAPItaLize FirSt ChaR.';
    expect(capitalizeFirstChar(str)).toEqual('I want this to only capitalize first char.');
  });

  test('should not work for str with length less than 1', () => {
    const str = '';
    expect(capitalizeFirstChar(str)).toEqual(str);
  });

  test('should not work for objects that are not string', () => {
    const number = 2;
    const array = ['not', 'work'];
    const object = { key: 'value' };
    expect(capitalizeFirstChar(null)).toEqual(null);
    expect(capitalizeFirstChar(number)).toEqual(number);
    expect(capitalizeFirstChar(array)).toEqual(array);
    expect(capitalizeFirstChar(object)).toEqual(object);
  });
});

describe('middleTruncateStr', () => {
  test('middleTruncateStr', () => {
    expect(middleTruncateStr('abc', 10)).toEqual('abc');
    expect(middleTruncateStr('abcdefghij', 10)).toEqual('abcdefghij');
    expect(middleTruncateStr('abcdefghijk', 10)).toEqual('abc...hijk');
    expect(middleTruncateStr('abcdefghijkl', 10)).toEqual('abc...ijkl');
  });
});

describe('btoaUtf8 and atobUtf8', () => {
  test('decodes and encodes a simple ascii string', () => {
    const testString = 'abcdefghi[]=__---11123';
    expect(btoaUtf8(testString)).toEqual(btoa(testString));
    expect(atob(btoaUtf8(testString))).toEqual(testString);
    expect(atobUtf8(btoaUtf8(testString))).toEqual(testString);
  });

  test('decodes and encodes a serialized JSON object in a way compatible to stock btoa()', () => {
    const testObject = {
      number: 123,
      text: '123',
      array: [1, 3, { some: 'object', nested: ['array'] }],
    };
    const stringifiedJson = JSON.stringify(testObject);
    expect(btoaUtf8(stringifiedJson)).toEqual(btoa(stringifiedJson));
    expect(atob(btoaUtf8(stringifiedJson))).toEqual(stringifiedJson);
    expect(atobUtf8(btoaUtf8(stringifiedJson))).toEqual(stringifiedJson);
    expect(JSON.parse(atobUtf8(btoaUtf8(stringifiedJson)))).toEqual(testObject);
  });

  test('decodes and encodes an utf-8 ascii string', () => {
    const testString = 'abcdef#ąółźļż👀中文';
    expect(() => btoa(testString)).toThrow();
    expect(() => btoaUtf8(testString)).not.toThrow();
    expect(atobUtf8(btoaUtf8(testString))).toEqual(testString);
  });

  test('decodes and encodes a serialized JSON object with utf-8 characters', () => {
    const testObject = {
      number: 123,
      中文: '123',
      ʎɐɹɹɐ: [1, 3, { some: '👀bject', nested: ['ᴀʀʀᴀʏ'] }],
    };
    const stringifiedJson = JSON.stringify(testObject);
    expect(atobUtf8(btoaUtf8(stringifiedJson))).toEqual(stringifiedJson);
    expect(JSON.parse(atobUtf8(btoaUtf8(stringifiedJson)))).toEqual(testObject);
  });

  test('handles empty values', () => {
    expect(btoaUtf8('')).toEqual('');
    expect(atobUtf8('')).toEqual('');
  });
});

const testCompressedObject = {
  viewable_object_ids: ['7b3e00a6-6459-4ea6-97b9-9fb58f0265bc'],
  viewable_objects: {
    '7b3e00a6-6459-4ea6-97b9-9fb58f0265bc': { id: '7b3e00a6-6459-4ea6-97b9-9fb58f0265bc', name: 'test' },
  },
};

describe('text compression utils', () => {
  test.each([
    { text: 'hello world', name: 'simple' },
    { text: 'ąółźļż👀中文中文👀中文', name: 'some unicode' },
    { text: JSON.stringify(testCompressedObject), name: 'complex' },
    {
      text: '\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff',
      name: 'raw unicode',
    },
  ])('deflate and inflate text ($name)', async ({ text }) => {
    const compressed = await textCompressDeflate(text);
    expect(isTextCompressedDeflate(compressed)).toEqual(true);

    const decompressed = await textDecompressDeflate(compressed);
    expect(decompressed).toEqual(text);
  });

  test('should throw error when decompressing invalid compressed text', async () => {
    const compressed = 'xyz;invalid';
    await expect(textDecompressDeflate(compressed)).rejects.toThrow('Invalid compressed text, payload header invalid');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: StringUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/common/utils/StringUtils.ts

```typescript
import { takeWhile, truncate } from 'lodash';
// Import pako lazily to reduce bundle size
const lazyPako = () => import('pako');

export const truncateToFirstLineWithMaxLength = (str: string, maxLength: number): string => {
  const truncated = truncate(str, {
    length: maxLength,
  });
  return takeWhile(truncated, (char) => char !== '\n').join('');
};

export const capitalizeFirstChar = (str: unknown) => {
  if (!str || typeof str !== 'string' || str.length < 1) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const middleTruncateStr = (str: string, maxLen: number) => {
  if (str.length > maxLen) {
    const firstPartLen = Math.floor((maxLen - 3) / 2);
    const lastPartLen = maxLen - 3 - firstPartLen;
    return str.substring(0, firstPartLen) + '...' + str.substring(str.length - lastPartLen, str.length);
  } else {
    return str;
  }
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

/* eslint-disable no-bitwise */
/**
 * UTF-8 safe version of base64 encoder
 * Source: http://www.webtoolkit.info/javascript_base64.html
 *
 * @param {string} input - Text to encode
 */
export const btoaUtf8 = (input: string) => {
  let output = '';
  let i = 0;

  const result = _utf8_encode(input);

  while (i < result.length) {
    const chr1 = result.charCodeAt(i++);
    const chr2 = result.charCodeAt(i++);
    const chr3 = result.charCodeAt(i++);

    const enc1 = chr1 >> 2;
    const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    let enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    let enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc4 = 64;
      enc3 = enc4;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }

    output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
  }

  return output;
};

/**
 * UTF-8 safe version of base64 decoder
 * Source: http://www.webtoolkit.info/javascript_base64.html
 *
 * @param {string} input - Text to decode
 */
export const atobUtf8 = (input: string) => {
  let output = '';
  let i = 0;

  const result = input?.replace(/[^A-Za-z0-9+/=]/g, '') || '';

  while (i < result.length) {
    const enc1 = _keyStr.indexOf(result.charAt(i++));
    const enc2 = _keyStr.indexOf(result.charAt(i++));
    const enc3 = _keyStr.indexOf(result.charAt(i++));
    const enc4 = _keyStr.indexOf(result.charAt(i++));

    const chr1 = (enc1 << 2) | (enc2 >> 4);
    const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const chr3 = ((enc3 & 3) << 6) | enc4;

    output += String.fromCharCode(chr1);

    if (enc3 !== 64) {
      output += String.fromCharCode(chr2);
    }

    if (enc4 !== 64) {
      output += String.fromCharCode(chr3);
    }
  }

  return _utf8_decode(output);
};

/**
 * (private method) does a UTF-8 encoding
 *
 * @private
 * @param {string} string - Text to encode
 */
const _utf8_encode = (string = '') => {
  const result = string.replace(/\r\n/g, '\n');
  let utftext = '';

  for (let n = 0; n < result.length; n++) {
    const c = result.charCodeAt(n);

    if (c < 128) {
      utftext += String.fromCharCode(c);
    } else if (c > 127 && c < 2048) {
      utftext += String.fromCharCode((c >> 6) | 192) + String.fromCharCode((c & 63) | 128);
    } else {
      utftext +=
        String.fromCharCode((c >> 12) | 224) +
        String.fromCharCode(((c >> 6) & 63) | 128) +
        String.fromCharCode((c & 63) | 128);
    }
  }

  return utftext;
};

/**
 * (private method) does a UTF-8 decoding
 *
 * @private
 * @param {string} utftext - UTF-8 text to dencode
 */
const _utf8_decode = (utftext = '') => {
  let string = '';
  let i = 0;

  while (i < utftext.length) {
    const c = utftext.charCodeAt(i);

    if (c < 128) {
      string += String.fromCharCode(c);
      i++;
    } else if (c > 191 && c < 224) {
      const c2 = utftext.charCodeAt(i + 1);
      string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
      i += 2;
    } else {
      const c2 = utftext.charCodeAt(i + 1);
      const c3 = utftext.charCodeAt(i + 2);
      string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    }
  }
  return string;
};
/* eslint-enable no-bitwise */

/**
 * Returns a SHA256 hash of the input string
 */
export const getStringSHA256 = (input: string) => {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(input)).then((arrayBuffer) => {
    return Array.prototype.map.call(new Uint8Array(arrayBuffer), (x) => ('00' + x.toString(16)).slice(-2)).join('');
  });
};

const COMPRESSED_TEXT_DEFLATE_PREFIX = 'deflate;';

export const textCompressDeflate = async (text: string) => {
  const pako = await lazyPako();
  const binaryData = pako.deflate(text);

  // Buffer-based implementation
  if (typeof Buffer !== 'undefined') {
    const b64encoded = Buffer.from(binaryData).toString('base64');
    return `${COMPRESSED_TEXT_DEFLATE_PREFIX}${b64encoded}`;
  }

  // btoa-based implementation
  const binaryString = Array.from(binaryData, (byte) => String.fromCodePoint(byte)).join('');
  return `${COMPRESSED_TEXT_DEFLATE_PREFIX}${btoa(binaryString)}`;
};

export const textDecompressDeflate = async (compressedText: string) => {
  const pako = await lazyPako();
  if (!compressedText.startsWith(COMPRESSED_TEXT_DEFLATE_PREFIX)) {
    throw new Error('Invalid compressed text, payload header invalid');
  }
  const compressedTextWithoutPrefix = compressedText.slice(COMPRESSED_TEXT_DEFLATE_PREFIX.length);

  // Buffer-based implementation
  if (typeof Buffer !== 'undefined') {
    const binaryString = Buffer.from(compressedTextWithoutPrefix, 'base64');
    return pako.inflate(
      // This doesn't fail in Mlflow-Copybara-Tester-Pr. TODO: check why.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore [FEINF-4084] No overload matches this call.
      binaryString,
      { to: 'string' },
    );
  }

  // atob-based implementation
  const binaryString = atob(compressedTextWithoutPrefix);
  return pako.inflate(
    Uint8Array.from(binaryString, (m) => m.codePointAt(0) ?? 0),
    { to: 'string' },
  );
};

export const isTextCompressedDeflate = (text: string) => text.startsWith(COMPRESSED_TEXT_DEFLATE_PREFIX);

/**
 * Sanitizes a string for use in a regular expression by escaping special characters.
 */
export const sanitizeStringForRegexp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
```

--------------------------------------------------------------------------------

---[FILE: TagUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/common/utils/TagUtils.ts

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { MLFLOW_LOGGED_ARTIFACTS_TAG } from '@mlflow/mlflow/src/experiment-tracking/constants';
import Utils from './Utils';
import { RunLoggedArtifactType } from '@mlflow/mlflow/src/experiment-tracking/types';
import type { KeyValueEntity } from '../types';

export const MLFLOW_INTERNAL_PREFIX = 'mlflow.';
const MLFLOW_INTERNAL_PREFIX_UC = '_mlflow_';

export const isUserFacingTag = (tagKey: string) =>
  !tagKey.startsWith(MLFLOW_INTERNAL_PREFIX) && !tagKey.startsWith(MLFLOW_INTERNAL_PREFIX_UC);

export const diffCurrentAndNewTags = (
  currentTags: KeyValueEntity[],
  newTags: KeyValueEntity[],
): {
  addedOrModifiedTags: KeyValueEntity[];
  deletedTags: KeyValueEntity[];
} => {
  const addedOrModifiedTags = newTags.filter(
    ({ key: newTagKey, value: newTagValue }) =>
      !currentTags.some(
        ({ key: existingTagKey, value: existingTagValue }) =>
          existingTagKey === newTagKey && newTagValue === existingTagValue,
      ),
  );

  const deletedTags = currentTags.filter(
    ({ key: existingTagKey }) => !newTags.some(({ key: newTagKey }) => existingTagKey === newTagKey),
  );

  return { addedOrModifiedTags, deletedTags };
};

export const getLoggedModelPathsFromTags = (runTags: Record<string, KeyValueEntity>) => {
  const models = Utils.getLoggedModelsFromTags(runTags);
  return models ? models.map((model) => (model as any).artifactPath) : [];
};

// Safe JSON.parse that returns undefined instead of throwing an error
export const parseJSONSafe = (json: string) => {
  try {
    return JSON.parse(json);
  } catch (e) {
    return undefined;
  }
};

export const getLoggedTablesFromTags = (runTags: any) => {
  const artifactsTags = runTags[MLFLOW_LOGGED_ARTIFACTS_TAG];
  if (artifactsTags) {
    const artifacts = parseJSONSafe(artifactsTags.value);
    if (artifacts) {
      return artifacts
        .filter((artifact: any) => artifact.type === RunLoggedArtifactType.TABLE)
        .map((artifact: any) => artifact.path);
    }
  }
  return [];
};
```

--------------------------------------------------------------------------------

---[FILE: TestApolloProvider.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/utils/TestApolloProvider.tsx
Signals: React

```typescript
import { ApolloProvider } from '@mlflow/mlflow/src/common/utils/graphQLHooks';
import { createApolloClient } from '../../graphql/client';
import { useMemo } from 'react';

export function TestApolloProvider({
  children,
  disableCache,
}: React.PropsWithChildren<{
  disableCache?: boolean;
}>) {
  const client = useMemo(() => {
    const apolloClient = createApolloClient();
    if (disableCache) {
      apolloClient.defaultOptions = {
        watchQuery: {
          fetchPolicy: 'no-cache',
        },
        query: {
          fetchPolicy: 'no-cache',
        },
      };
    }
    return apolloClient;
  }, [disableCache]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
```

--------------------------------------------------------------------------------

---[FILE: TestUtils.enzyme.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/utils/TestUtils.enzyme.tsx
Signals: React

```typescript
import React from 'react';
import { IntlProvider } from 'react-intl';
import { mount, shallow } from 'enzyme';
import { defaultProviderProps } from './TestUtils';

export function mountWithIntl(node: React.ReactElement, providerProps = {}) {
  return mount(node, {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: {
      ...defaultProviderProps,
      ...providerProps,
    },
  });
}
export function shallowWithIntl(node: React.ReactElement, providerProps = {}) {
  const mergedProviderProps = {
    ...defaultProviderProps,
    ...providerProps,
  };
  return shallow(<IntlProvider {...mergedProviderProps}>{node}</IntlProvider>).dive();
}
export function shallowWithInjectIntl(node: React.ReactElement, providerProps = {}) {
  return shallowWithIntl(node, providerProps).dive().dive().dive();
}
```

--------------------------------------------------------------------------------

---[FILE: TestUtils.react18.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/utils/TestUtils.react18.tsx
Signals: React

```typescript
import { jest, expect } from '@jest/globals';
import { fireEvent, within, render, type RenderResult, screen, act, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import userEvent from '@testing-library/user-event';
import { DEFAULT_LOCALE } from '../../i18n/loadMessages';
import { DesignSystemProvider } from '@databricks/design-system';

const defaultIntlProviderProps = {
  locale: DEFAULT_LOCALE,
  defaultLocale: DEFAULT_LOCALE,
  messages: {},
};

export function renderWithDesignSystem(ui: React.ReactElement, renderOptions = {}, providerProps = {}): RenderResult {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <IntlProvider {...defaultIntlProviderProps}>
      <DesignSystemProvider {...providerProps}>{children}</DesignSystemProvider>
    </IntlProvider>
  );

  return render(ui, { wrapper, ...renderOptions });
}

export function renderWithIntl(ui: React.ReactElement, renderOptions = {}, providerProps = {}): RenderResult {
  const mergedProviderProps = {
    ...defaultIntlProviderProps,
    ...providerProps,
  };
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <IntlProvider {...mergedProviderProps}>{children}</IntlProvider>
  );

  return render(ui, { wrapper, ...renderOptions });
}
/**
 * userEvent.type() can be quite slow, let's use userEvent.paste()
 * to improve testing performance
 *
 * @param user Pass this in when the test is using fake timers and the userEvent
 * instance needs to be setup with `advanceTimers` to work properly.
 */
export async function fastFillInput(
  element: HTMLInputElement,
  text: string,
  user?: ReturnType<typeof userEvent.setup>,
) {
  await (user ?? userEvent).click(element);
  return (user ?? userEvent).paste(text, { clipboardData: { getData: jest.fn() } } as any);
}

export const selectAntdOption = async (container: HTMLElement, optionText: string) => {
  await act(async () => {
    fireEvent.mouseDown(within(container).getByRole('combobox'));
  });
  const optionElement = findAntdOption(optionText);
  act(() => {
    fireEvent.click(optionElement);
  });
};

export const findAntdOption = (optionText: string) => {
  return screen.getByText((content, element) => {
    return (
      Boolean(element) &&
      Boolean(Array.from(element?.classList || []).some((x) => x.endsWith('-select-item-option-content'))) &&
      content === optionText
    );
  });
};

export const findAntdOptionContaining = async (optionText: string) => {
  return await findAntdSelectElement(optionText, '-select-item-option-content');
};

// Function to find the correct antd component based on class name
const findAntdSelectElement = async (optionText: string, endsWith: string) => {
  return await screen.findByText((content, element) => {
    return (
      Boolean(element) &&
      Boolean(Array.from(element?.classList || []).some((x) => x.endsWith(endsWith))) &&
      Boolean(element?.textContent?.includes(optionText))
    );
  });
};

export * from '@testing-library/react';
```

--------------------------------------------------------------------------------

---[FILE: TestUtils.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/utils/TestUtils.tsx
Signals: React, Redux/RTK

```typescript
import type { DeepPartial } from 'redux';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';

import React, { useRef } from 'react';
import { DEFAULT_LOCALE } from '../../i18n/loadMessages';
import type { ReduxState } from '../../redux-types';
import { Provider } from 'react-redux';

export const NOOP = (...args: any[]) => {};

export function deepFreeze(o: any) {
  Object.freeze(o);
  Object.getOwnPropertyNames(o).forEach((prop) => {
    if (
      o.hasOwnProperty(prop) &&
      o[prop] !== null &&
      (typeof o[prop] === 'object' || typeof o[prop] === 'function') &&
      !Object.isFrozen(o[prop])
    ) {
      deepFreeze(o[prop]);
    }
  });
  return o;
}

export const defaultProviderProps = {
  locale: DEFAULT_LOCALE,
  defaultLocale: DEFAULT_LOCALE,
  messages: {},
};

/**
 * A simple seedable PRNG, used e.g. to replace Math.random() for deterministic testing.
 * Taken from https://gist.github.com/blixt/f17b47c62508be59987b
 */
export const createPrng = (seed = 1000) => {
  let _seed = seed % 2147483647;
  if (_seed <= 0) _seed += 2147483646;

  const next = () => {
    return (_seed = (_seed * 16807) % 2147483647);
  };

  return () => (next() - 1) / 2147483646;
};

export const MockedReduxStoreProvider = ({
  state = {},
  children,
}: {
  state?: DeepPartial<ReduxState>;
  children: React.ReactNode;
}) => {
  const store = useRef(configureStore([thunk, promiseMiddleware()])(state));
  return <Provider store={store.current}>{children}</Provider>;
};
```

--------------------------------------------------------------------------------

---[FILE: toRGBA.test.ts]---
Location: mlflow-master/mlflow/server/js/src/common/utils/toRGBA.test.ts

```typescript
import { describe, test, expect, jest } from '@jest/globals';
import { toRGBA } from './toRGBA'; // Adjust this import path as needed

describe('toRGBA', () => {
  // Test RGB input
  test('converts rgb color to rgba', () => {
    expect(toRGBA('rgb(255, 0, 0)', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
  });

  test('converts rgba color to rgba with new alpha', () => {
    expect(toRGBA('rgba(0, 255, 0, 0.8)', 0.3)).toBe('rgba(0, 255, 0, 0.3)');
  });

  // Test Hex input
  test('converts 6-digit hex color to rgba', () => {
    expect(toRGBA('#00ff00', 0.7)).toBe('rgba(0, 255, 0, 0.7)');
  });

  test('converts 3-digit hex color to rgba', () => {
    expect(toRGBA('#f00', 0.2)).toBe('rgba(255, 0, 0, 0.2)');
  });

  // Test named colors
  test('converts named color to rgba', () => {
    // Mock the canvas and context
    const mockContext = {
      fillStyle: '',
    };
    const mockCanvas = {
      getContext: jest.fn(() => mockContext),
    };
    jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

    // Simulate how the canvas context behaves with a named color. A little silly since we're just testing the functionality we've mocked, but named colors are very unlikely to come from the DSL anyways
    Object.defineProperty(mockContext, 'fillStyle', {
      set(value) {
        if (value === 'blue') {
          this._fillStyle = 'rgb(0, 0, 255)';
        } else {
          this._fillStyle = value;
        }
      },
      get() {
        return this._fillStyle;
      },
    });

    expect(toRGBA('blue', 0.9)).toBe('rgba(0, 0, 255, 0.9)');

    // Verify canvas methods were called
    expect(document.createElement).toHaveBeenCalledWith('canvas');
    // @ts-expect-error Expected 0 arguments, but got 1
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
  });

  // Test edge cases
  test('handles invalid rgb input', () => {
    expect(toRGBA('rgb(255)', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
  });

  test('handles invalid hex input', () => {
    expect(toRGBA('#gg0000', 0.5)).toBe('rgba(0, 0, 0, 0.5)');
  });

  test('handles alpha value of 0', () => {
    expect(toRGBA('#ff0000', 0)).toBe('rgba(255, 0, 0, 0)');
  });

  test('handles alpha value of 1', () => {
    expect(toRGBA('#ff0000', 1)).toBe('rgba(255, 0, 0, 1)');
  });

  // New test for handling failure to get context
  test('handles failure to get canvas context', () => {
    const mockCanvas = {
      getContext: jest.fn(() => null),
    };
    jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

    expect(toRGBA('somecolor', 0.5)).toBe('rgba(0, 0, 0, 0.5)');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: toRGBA.ts]---
Location: mlflow-master/mlflow/server/js/src/common/utils/toRGBA.ts

```typescript
export const toRGBA = (color: string, alpha: number): string => {
  // Helper function to parse RGB values
  const parseRGB = (rgb: string): number[] => {
    const matches = rgb.match(/\d+/g);
    return matches ? matches.map(Number).concat([0, 0]).slice(0, 3) : [0, 0, 0];
  };

  // Helper function to convert hex to RGB
  const hexToRGB = (hex: string): number[] => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const normalizedHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalizedHex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0];
  };

  // Helper function to convert named colors to RGB
  const namedColorToRGB = (name: string): number[] => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return [0, 0, 0];
    ctx.fillStyle = name;
    return parseRGB(ctx.fillStyle);
  };

  let rgb: number[];

  if (color.startsWith('rgb')) {
    rgb = parseRGB(color);
  } else if (color.startsWith('#')) {
    rgb = hexToRGB(color);
  } else {
    // For named colors and other formats
    rgb = namedColorToRGB(color);
  }

  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
};
```

--------------------------------------------------------------------------------

---[FILE: useElementHeight.ts]---
Location: mlflow-master/mlflow/server/js/src/common/utils/useElementHeight.ts
Signals: React

```typescript
import { useEffect, useState } from 'react';

/**
 * Hook that returns dynamically updated changing element height. Usage example:
 * ```ts
 * const { elementHeight, observeHeight } = useElementHeight();
 * // ...
 * return <div ref={observeHeight}>Element height: {elementHeight}px</div>
 * ```
 */
export const useElementHeight = (resizeCallback?: (entry: ResizeObserverEntry) => void) => {
  const [hideableElementsContainer, setHideableElementsContainer] = useState<HTMLElement | null>(null);

  const [elementHeight, setElementHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!hideableElementsContainer || !window.ResizeObserver) {
      return undefined;
    }
    const resizeObserver = new ResizeObserver(([entry]) => {
      resizeCallback?.(entry);
      if (entry.target.scrollHeight) {
        setElementHeight(entry.target.scrollHeight);
      }
    });
    resizeObserver.observe(hideableElementsContainer);
    return () => resizeObserver.disconnect();
  }, [hideableElementsContainer, resizeCallback]);

  return { elementHeight, observeHeight: setHideableElementsContainer };
};
```

--------------------------------------------------------------------------------

````

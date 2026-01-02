---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 63
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 63 of 552)

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

---[FILE: extensions/mermaid-chat-features/package-lock.json]---
Location: vscode-main/extensions/mermaid-chat-features/package-lock.json

```json
{
  "name": "mermaid-chat-features",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "mermaid-chat-features",
      "version": "1.0.0",
      "license": "MIT",
      "dependencies": {
        "dompurify": "^3.2.7",
        "mermaid": "^11.11.0"
      },
      "devDependencies": {
        "@types/node": "^22.18.10"
      },
      "engines": {
        "vscode": "^1.104.0"
      }
    },
    "node_modules/@antfu/install-pkg": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@antfu/install-pkg/-/install-pkg-1.1.0.tgz",
      "integrity": "sha512-MGQsmw10ZyI+EJo45CdSER4zEb+p31LpDAFp2Z3gkSd1yqVZGi0Ebx++YTEMonJy4oChEMLsxZ64j8FH6sSqtQ==",
      "license": "MIT",
      "dependencies": {
        "package-manager-detector": "^1.3.0",
        "tinyexec": "^1.0.1"
      },
      "funding": {
        "url": "https://github.com/sponsors/antfu"
      }
    },
    "node_modules/@antfu/utils": {
      "version": "9.2.0",
      "resolved": "https://registry.npmjs.org/@antfu/utils/-/utils-9.2.0.tgz",
      "integrity": "sha512-Oq1d9BGZakE/FyoEtcNeSwM7MpDO2vUBi11RWBZXf75zPsbUVWmUs03EqkRFrcgbXyKTas0BdZWC1wcuSoqSAw==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/antfu"
      }
    },
    "node_modules/@braintree/sanitize-url": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/@braintree/sanitize-url/-/sanitize-url-7.1.1.tgz",
      "integrity": "sha512-i1L7noDNxtFyL5DmZafWy1wRVhGehQmzZaz1HiN5e7iylJMSZR7ekOV7NsIqa5qBldlLrsKv4HbgFUVlQrz8Mw==",
      "license": "MIT"
    },
    "node_modules/@chevrotain/cst-dts-gen": {
      "version": "11.0.3",
      "resolved": "https://registry.npmjs.org/@chevrotain/cst-dts-gen/-/cst-dts-gen-11.0.3.tgz",
      "integrity": "sha512-BvIKpRLeS/8UbfxXxgC33xOumsacaeCKAjAeLyOn7Pcp95HiRbrpl14S+9vaZLolnbssPIUuiUd8IvgkRyt6NQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "@chevrotain/gast": "11.0.3",
        "@chevrotain/types": "11.0.3",
        "lodash-es": "4.17.21"
      }
    },
    "node_modules/@chevrotain/gast": {
      "version": "11.0.3",
      "resolved": "https://registry.npmjs.org/@chevrotain/gast/-/gast-11.0.3.tgz",
      "integrity": "sha512-+qNfcoNk70PyS/uxmj3li5NiECO+2YKZZQMbmjTqRI3Qchu8Hig/Q9vgkHpI3alNjr7M+a2St5pw5w5F6NL5/Q==",
      "license": "Apache-2.0",
      "dependencies": {
        "@chevrotain/types": "11.0.3",
        "lodash-es": "4.17.21"
      }
    },
    "node_modules/@chevrotain/regexp-to-ast": {
      "version": "11.0.3",
      "resolved": "https://registry.npmjs.org/@chevrotain/regexp-to-ast/-/regexp-to-ast-11.0.3.tgz",
      "integrity": "sha512-1fMHaBZxLFvWI067AVbGJav1eRY7N8DDvYCTwGBiE/ytKBgP8azTdgyrKyWZ9Mfh09eHWb5PgTSO8wi7U824RA==",
      "license": "Apache-2.0"
    },
    "node_modules/@chevrotain/types": {
      "version": "11.0.3",
      "resolved": "https://registry.npmjs.org/@chevrotain/types/-/types-11.0.3.tgz",
      "integrity": "sha512-gsiM3G8b58kZC2HaWR50gu6Y1440cHiJ+i3JUvcp/35JchYejb2+5MVeJK0iKThYpAa/P2PYFV4hoi44HD+aHQ==",
      "license": "Apache-2.0"
    },
    "node_modules/@chevrotain/utils": {
      "version": "11.0.3",
      "resolved": "https://registry.npmjs.org/@chevrotain/utils/-/utils-11.0.3.tgz",
      "integrity": "sha512-YslZMgtJUyuMbZ+aKvfF3x1f5liK4mWNxghFRv7jqRR9C3R3fAOGTTKvxXDa2Y1s9zSbcpuO0cAxDYsc9SrXoQ==",
      "license": "Apache-2.0"
    },
    "node_modules/@iconify/types": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/@iconify/types/-/types-2.0.0.tgz",
      "integrity": "sha512-+wluvCrRhXrhyOmRDJ3q8mux9JkKy5SJ/v8ol2tu4FVjyYvtEzkc/3pK15ET6RKg4b4w4BmTk1+gsCUhf21Ykg==",
      "license": "MIT"
    },
    "node_modules/@iconify/utils": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/@iconify/utils/-/utils-3.0.1.tgz",
      "integrity": "sha512-A78CUEnFGX8I/WlILxJCuIJXloL0j/OJ9PSchPAfCargEIKmUBWvvEMmKWB5oONwiUqlNt+5eRufdkLxeHIWYw==",
      "license": "MIT",
      "dependencies": {
        "@antfu/install-pkg": "^1.1.0",
        "@antfu/utils": "^9.2.0",
        "@iconify/types": "^2.0.0",
        "debug": "^4.4.1",
        "globals": "^15.15.0",
        "kolorist": "^1.8.0",
        "local-pkg": "^1.1.1",
        "mlly": "^1.7.4"
      }
    },
    "node_modules/@iconify/utils/node_modules/globals": {
      "version": "15.15.0",
      "resolved": "https://registry.npmjs.org/globals/-/globals-15.15.0.tgz",
      "integrity": "sha512-7ACyT3wmyp3I61S4fG682L0VA2RGD9otkqGJIwNUMF1SWUombIIk+af1unuDYgMm082aHYwD+mzJvv9Iu8dsgg==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/@mermaid-js/parser": {
      "version": "0.6.2",
      "resolved": "https://registry.npmjs.org/@mermaid-js/parser/-/parser-0.6.2.tgz",
      "integrity": "sha512-+PO02uGF6L6Cs0Bw8RpGhikVvMWEysfAyl27qTlroUB8jSWr1lL0Sf6zi78ZxlSnmgSY2AMMKVgghnN9jTtwkQ==",
      "license": "MIT",
      "dependencies": {
        "langium": "3.3.1"
      }
    },
    "node_modules/@types/d3": {
      "version": "7.4.3",
      "resolved": "https://registry.npmjs.org/@types/d3/-/d3-7.4.3.tgz",
      "integrity": "sha512-lZXZ9ckh5R8uiFVt8ogUNf+pIrK4EsWrx2Np75WvF/eTpJ0FMHNhjXk8CKEx/+gpHbNQyJWehbFaTvqmHWB3ww==",
      "license": "MIT",
      "dependencies": {
        "@types/d3-array": "*",
        "@types/d3-axis": "*",
        "@types/d3-brush": "*",
        "@types/d3-chord": "*",
        "@types/d3-color": "*",
        "@types/d3-contour": "*",
        "@types/d3-delaunay": "*",
        "@types/d3-dispatch": "*",
        "@types/d3-drag": "*",
        "@types/d3-dsv": "*",
        "@types/d3-ease": "*",
        "@types/d3-fetch": "*",
        "@types/d3-force": "*",
        "@types/d3-format": "*",
        "@types/d3-geo": "*",
        "@types/d3-hierarchy": "*",
        "@types/d3-interpolate": "*",
        "@types/d3-path": "*",
        "@types/d3-polygon": "*",
        "@types/d3-quadtree": "*",
        "@types/d3-random": "*",
        "@types/d3-scale": "*",
        "@types/d3-scale-chromatic": "*",
        "@types/d3-selection": "*",
        "@types/d3-shape": "*",
        "@types/d3-time": "*",
        "@types/d3-time-format": "*",
        "@types/d3-timer": "*",
        "@types/d3-transition": "*",
        "@types/d3-zoom": "*"
      }
    },
    "node_modules/@types/d3-array": {
      "version": "3.2.1",
      "resolved": "https://registry.npmjs.org/@types/d3-array/-/d3-array-3.2.1.tgz",
      "integrity": "sha512-Y2Jn2idRrLzUfAKV2LyRImR+y4oa2AntrgID95SHJxuMUrkNXmanDSed71sRNZysveJVt1hLLemQZIady0FpEg==",
      "license": "MIT"
    },
    "node_modules/@types/d3-axis": {
      "version": "3.0.6",
      "resolved": "https://registry.npmjs.org/@types/d3-axis/-/d3-axis-3.0.6.tgz",
      "integrity": "sha512-pYeijfZuBd87T0hGn0FO1vQ/cgLk6E1ALJjfkC0oJ8cbwkZl3TpgS8bVBLZN+2jjGgg38epgxb2zmoGtSfvgMw==",
      "license": "MIT",
      "dependencies": {
        "@types/d3-selection": "*"
      }
    },
    "node_modules/@types/d3-brush": {
      "version": "3.0.6",
      "resolved": "https://registry.npmjs.org/@types/d3-brush/-/d3-brush-3.0.6.tgz",
      "integrity": "sha512-nH60IZNNxEcrh6L1ZSMNA28rj27ut/2ZmI3r96Zd+1jrZD++zD3LsMIjWlvg4AYrHn/Pqz4CF3veCxGjtbqt7A==",
      "license": "MIT",
      "dependencies": {
        "@types/d3-selection": "*"
      }
    },
    "node_modules/@types/d3-chord": {
      "version": "3.0.6",
      "resolved": "https://registry.npmjs.org/@types/d3-chord/-/d3-chord-3.0.6.tgz",
      "integrity": "sha512-LFYWWd8nwfwEmTZG9PfQxd17HbNPksHBiJHaKuY1XeqscXacsS2tyoo6OdRsjf+NQYeB6XrNL3a25E3gH69lcg==",
      "license": "MIT"
    },
    "node_modules/@types/d3-color": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/@types/d3-color/-/d3-color-3.1.3.tgz",
      "integrity": "sha512-iO90scth9WAbmgv7ogoq57O9YpKmFBbmoEoCHDB2xMBY0+/KVrqAaCDyCE16dUspeOvIxFFRI+0sEtqDqy2b4A==",
      "license": "MIT"
    },
    "node_modules/@types/d3-contour": {
      "version": "3.0.6",
      "resolved": "https://registry.npmjs.org/@types/d3-contour/-/d3-contour-3.0.6.tgz",
      "integrity": "sha512-BjzLgXGnCWjUSYGfH1cpdo41/hgdWETu4YxpezoztawmqsvCeep+8QGfiY6YbDvfgHz/DkjeIkkZVJavB4a3rg==",
      "license": "MIT",
      "dependencies": {
        "@types/d3-array": "*",
        "@types/geojson": "*"
      }
    },
    "node_modules/@types/d3-delaunay": {
      "version": "6.0.4",
      "resolved": "https://registry.npmjs.org/@types/d3-delaunay/-/d3-delaunay-6.0.4.tgz",
      "integrity": "sha512-ZMaSKu4THYCU6sV64Lhg6qjf1orxBthaC161plr5KuPHo3CNm8DTHiLw/5Eq2b6TsNP0W0iJrUOFscY6Q450Hw==",
      "license": "MIT"
    },
    "node_modules/@types/d3-dispatch": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/@types/d3-dispatch/-/d3-dispatch-3.0.7.tgz",
      "integrity": "sha512-5o9OIAdKkhN1QItV2oqaE5KMIiXAvDWBDPrD85e58Qlz1c1kI/J0NcqbEG88CoTwJrYe7ntUCVfeUl2UJKbWgA==",
      "license": "MIT"
    },
    "node_modules/@types/d3-drag": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/@types/d3-drag/-/d3-drag-3.0.7.tgz",
      "integrity": "sha512-HE3jVKlzU9AaMazNufooRJ5ZpWmLIoc90A37WU2JMmeq28w1FQqCZswHZ3xR+SuxYftzHq6WU6KJHvqxKzTxxQ==",
      "license": "MIT",
      "dependencies": {
        "@types/d3-selection": "*"
      }
    },
    "node_modules/@types/d3-dsv": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/@types/d3-dsv/-/d3-dsv-3.0.7.tgz",
      "integrity": "sha512-n6QBF9/+XASqcKK6waudgL0pf/S5XHPPI8APyMLLUHd8NqouBGLsU8MgtO7NINGtPBtk9Kko/W4ea0oAspwh9g==",
      "license": "MIT"
    },
    "node_modules/@types/d3-ease": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/@types/d3-ease/-/d3-ease-3.0.2.tgz",
      "integrity": "sha512-NcV1JjO5oDzoK26oMzbILE6HW7uVXOHLQvHshBUW4UMdZGfiY6v5BeQwh9a9tCzv+CeefZQHJt5SRgK154RtiA==",
      "license": "MIT"
    },
    "node_modules/@types/d3-fetch": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/@types/d3-fetch/-/d3-fetch-3.0.7.tgz",
      "integrity": "sha512-fTAfNmxSb9SOWNB9IoG5c8Hg6R+AzUHDRlsXsDZsNp6sxAEOP0tkP3gKkNSO/qmHPoBFTxNrjDprVHDQDvo5aA==",
      "license": "MIT",
      "dependencies": {
        "@types/d3-dsv": "*"
      }
    },
    "node_modules/@types/d3-force": {
      "version": "3.0.10",
      "resolved": "https://registry.npmjs.org/@types/d3-force/-/d3-force-3.0.10.tgz",
      "integrity": "sha512-ZYeSaCF3p73RdOKcjj+swRlZfnYpK1EbaDiYICEEp5Q6sUiqFaFQ9qgoshp5CzIyyb/yD09kD9o2zEltCexlgw==",
      "license": "MIT"
    },
    "node_modules/@types/d3-format": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/@types/d3-format/-/d3-format-3.0.4.tgz",
      "integrity": "sha512-fALi2aI6shfg7vM5KiR1wNJnZ7r6UuggVqtDA+xiEdPZQwy/trcQaHnwShLuLdta2rTymCNpxYTiMZX/e09F4g==",
      "license": "MIT"
    },
    "node_modules/@types/d3-geo": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/@types/d3-geo/-/d3-geo-3.1.0.tgz",
      "integrity": "sha512-856sckF0oP/diXtS4jNsiQw/UuK5fQG8l/a9VVLeSouf1/PPbBE1i1W852zVwKwYCBkFJJB7nCFTbk6UMEXBOQ==",
      "license": "MIT",
      "dependencies": {
        "@types/geojson": "*"
      }
    },
    "node_modules/@types/d3-hierarchy": {
      "version": "3.1.7",
      "resolved": "https://registry.npmjs.org/@types/d3-hierarchy/-/d3-hierarchy-3.1.7.tgz",
      "integrity": "sha512-tJFtNoYBtRtkNysX1Xq4sxtjK8YgoWUNpIiUee0/jHGRwqvzYxkq0hGVbbOGSz+JgFxxRu4K8nb3YpG3CMARtg==",
      "license": "MIT"
    },
    "node_modules/@types/d3-interpolate": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/@types/d3-interpolate/-/d3-interpolate-3.0.4.tgz",
      "integrity": "sha512-mgLPETlrpVV1YRJIglr4Ez47g7Yxjl1lj7YKsiMCb27VJH9W8NVM6Bb9d8kkpG/uAQS5AmbA48q2IAolKKo1MA==",
      "license": "MIT",
      "dependencies": {
        "@types/d3-color": "*"
      }
    },
    "node_modules/@types/d3-path": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/@types/d3-path/-/d3-path-3.1.1.tgz",
      "integrity": "sha512-VMZBYyQvbGmWyWVea0EHs/BwLgxc+MKi1zLDCONksozI4YJMcTt8ZEuIR4Sb1MMTE8MMW49v0IwI5+b7RmfWlg==",
      "license": "MIT"
    },
    "node_modules/@types/d3-polygon": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/@types/d3-polygon/-/d3-polygon-3.0.2.tgz",
      "integrity": "sha512-ZuWOtMaHCkN9xoeEMr1ubW2nGWsp4nIql+OPQRstu4ypeZ+zk3YKqQT0CXVe/PYqrKpZAi+J9mTs05TKwjXSRA==",
      "license": "MIT"
    },
    "node_modules/@types/d3-quadtree": {
      "version": "3.0.6",
      "resolved": "https://registry.npmjs.org/@types/d3-quadtree/-/d3-quadtree-3.0.6.tgz",
      "integrity": "sha512-oUzyO1/Zm6rsxKRHA1vH0NEDG58HrT5icx/azi9MF1TWdtttWl0UIUsjEQBBh+SIkrpd21ZjEv7ptxWys1ncsg==",
      "license": "MIT"
    },
    "node_modules/@types/d3-random": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/@types/d3-random/-/d3-random-3.0.3.tgz",
      "integrity": "sha512-Imagg1vJ3y76Y2ea0871wpabqp613+8/r0mCLEBfdtqC7xMSfj9idOnmBYyMoULfHePJyxMAw3nWhJxzc+LFwQ==",
      "license": "MIT"
    },
    "node_modules/@types/d3-scale": {
      "version": "4.0.9",
      "resolved": "https://registry.npmjs.org/@types/d3-scale/-/d3-scale-4.0.9.tgz",
      "integrity": "sha512-dLmtwB8zkAeO/juAMfnV+sItKjlsw2lKdZVVy6LRr0cBmegxSABiLEpGVmSJJ8O08i4+sGR6qQtb6WtuwJdvVw==",
      "license": "MIT",
      "dependencies": {
        "@types/d3-time": "*"
      }
    },
    "node_modules/@types/d3-scale-chromatic": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/@types/d3-scale-chromatic/-/d3-scale-chromatic-3.1.0.tgz",
      "integrity": "sha512-iWMJgwkK7yTRmWqRB5plb1kadXyQ5Sj8V/zYlFGMUBbIPKQScw+Dku9cAAMgJG+z5GYDoMjWGLVOvjghDEFnKQ==",
      "license": "MIT"
    },
    "node_modules/@types/d3-selection": {
      "version": "3.0.11",
      "resolved": "https://registry.npmjs.org/@types/d3-selection/-/d3-selection-3.0.11.tgz",
      "integrity": "sha512-bhAXu23DJWsrI45xafYpkQ4NtcKMwWnAC/vKrd2l+nxMFuvOT3XMYTIj2opv8vq8AO5Yh7Qac/nSeP/3zjTK0w==",
      "license": "MIT"
    },
    "node_modules/@types/d3-shape": {
      "version": "3.1.7",
      "resolved": "https://registry.npmjs.org/@types/d3-shape/-/d3-shape-3.1.7.tgz",
      "integrity": "sha512-VLvUQ33C+3J+8p+Daf+nYSOsjB4GXp19/S/aGo60m9h1v6XaxjiT82lKVWJCfzhtuZ3yD7i/TPeC/fuKLLOSmg==",
      "license": "MIT",
      "dependencies": {
        "@types/d3-path": "*"
      }
    },
    "node_modules/@types/d3-time": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/@types/d3-time/-/d3-time-3.0.4.tgz",
      "integrity": "sha512-yuzZug1nkAAaBlBBikKZTgzCeA+k1uy4ZFwWANOfKw5z5LRhV0gNA7gNkKm7HoK+HRN0wX3EkxGk0fpbWhmB7g==",
      "license": "MIT"
    },
    "node_modules/@types/d3-time-format": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/@types/d3-time-format/-/d3-time-format-4.0.3.tgz",
      "integrity": "sha512-5xg9rC+wWL8kdDj153qZcsJ0FWiFt0J5RB6LYUNZjwSnesfblqrI/bJ1wBdJ8OQfncgbJG5+2F+qfqnqyzYxyg==",
      "license": "MIT"
    },
    "node_modules/@types/d3-timer": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/@types/d3-timer/-/d3-timer-3.0.2.tgz",
      "integrity": "sha512-Ps3T8E8dZDam6fUyNiMkekK3XUsaUEik+idO9/YjPtfj2qruF8tFBXS7XhtE4iIXBLxhmLjP3SXpLhVf21I9Lw==",
      "license": "MIT"
    },
    "node_modules/@types/d3-transition": {
      "version": "3.0.9",
      "resolved": "https://registry.npmjs.org/@types/d3-transition/-/d3-transition-3.0.9.tgz",
      "integrity": "sha512-uZS5shfxzO3rGlu0cC3bjmMFKsXv+SmZZcgp0KD22ts4uGXp5EVYGzu/0YdwZeKmddhcAccYtREJKkPfXkZuCg==",
      "license": "MIT",
      "dependencies": {
        "@types/d3-selection": "*"
      }
    },
    "node_modules/@types/d3-zoom": {
      "version": "3.0.8",
      "resolved": "https://registry.npmjs.org/@types/d3-zoom/-/d3-zoom-3.0.8.tgz",
      "integrity": "sha512-iqMC4/YlFCSlO8+2Ii1GGGliCAY4XdeG748w5vQUbevlbDu0zSjH/+jojorQVBK/se0j6DUFNPBGSqD3YWYnDw==",
      "license": "MIT",
      "dependencies": {
        "@types/d3-interpolate": "*",
        "@types/d3-selection": "*"
      }
    },
    "node_modules/@types/geojson": {
      "version": "7946.0.16",
      "resolved": "https://registry.npmjs.org/@types/geojson/-/geojson-7946.0.16.tgz",
      "integrity": "sha512-6C8nqWur3j98U6+lXDfTUWIfgvZU+EumvpHKcYjujKH7woYyLj2sUmff0tRhrqM7BohUw7Pz3ZB1jj2gW9Fvmg==",
      "license": "MIT"
    },
    "node_modules/@types/node": {
      "version": "22.18.10",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.18.10.tgz",
      "integrity": "sha512-anNG/V/Efn/YZY4pRzbACnKxNKoBng2VTFydVu8RRs5hQjikP8CQfaeAV59VFSCzKNp90mXiVXW2QzV56rwMrg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.21.0"
      }
    },
    "node_modules/@types/trusted-types": {
      "version": "2.0.7",
      "resolved": "https://registry.npmjs.org/@types/trusted-types/-/trusted-types-2.0.7.tgz",
      "integrity": "sha512-ScaPdn1dQczgbl0QFTeTOmVHFULt394XJgOQNoyVhZ6r2vLnMLJfBPd53SB52T/3G36VI1/g2MZaX0cwDuXsfw==",
      "license": "MIT",
      "optional": true
    },
    "node_modules/acorn": {
      "version": "8.15.0",
      "resolved": "https://registry.npmjs.org/acorn/-/acorn-8.15.0.tgz",
      "integrity": "sha512-NZyJarBfL7nWwIq+FDL6Zp/yHEhePMNnnJ0y3qfieCrmNvYct8uvtiV41UvlSe6apAfk0fY1FbWx+NwfmpvtTg==",
      "license": "MIT",
      "bin": {
        "acorn": "bin/acorn"
      },
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/chevrotain": {
      "version": "11.0.3",
      "resolved": "https://registry.npmjs.org/chevrotain/-/chevrotain-11.0.3.tgz",
      "integrity": "sha512-ci2iJH6LeIkvP9eJW6gpueU8cnZhv85ELY8w8WiFtNjMHA5ad6pQLaJo9mEly/9qUyCpvqX8/POVUTf18/HFdw==",
      "license": "Apache-2.0",
      "dependencies": {
        "@chevrotain/cst-dts-gen": "11.0.3",
        "@chevrotain/gast": "11.0.3",
        "@chevrotain/regexp-to-ast": "11.0.3",
        "@chevrotain/types": "11.0.3",
        "@chevrotain/utils": "11.0.3",
        "lodash-es": "4.17.21"
      }
    },
    "node_modules/chevrotain-allstar": {
      "version": "0.3.1",
      "resolved": "https://registry.npmjs.org/chevrotain-allstar/-/chevrotain-allstar-0.3.1.tgz",
      "integrity": "sha512-b7g+y9A0v4mxCW1qUhf3BSVPg+/NvGErk/dOkrDaHA0nQIQGAtrOjlX//9OQtRlSCy+x9rfB5N8yC71lH1nvMw==",
      "license": "MIT",
      "dependencies": {
        "lodash-es": "^4.17.21"
      },
      "peerDependencies": {
        "chevrotain": "^11.0.0"
      }
    },
    "node_modules/commander": {
      "version": "8.3.0",
      "resolved": "https://registry.npmjs.org/commander/-/commander-8.3.0.tgz",
      "integrity": "sha512-OkTL9umf+He2DZkUq8f8J9of7yL6RJKI24dVITBmNfZBmri9zYZQrKkuXiKhyfPSu8tUhnVBB1iKXevvnlR4Ww==",
      "license": "MIT",
      "engines": {
        "node": ">= 12"
      }
    },
    "node_modules/confbox": {
      "version": "0.2.2",
      "resolved": "https://registry.npmjs.org/confbox/-/confbox-0.2.2.tgz",
      "integrity": "sha512-1NB+BKqhtNipMsov4xI/NnhCKp9XG9NamYp5PVm9klAT0fsrNPjaFICsCFhNhwZJKNh7zB/3q8qXz0E9oaMNtQ==",
      "license": "MIT"
    },
    "node_modules/cose-base": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/cose-base/-/cose-base-1.0.3.tgz",
      "integrity": "sha512-s9whTXInMSgAp/NVXVNuVxVKzGH2qck3aQlVHxDCdAEPgtMKwc4Wq6/QKhgdEdgbLSi9rBTAcPoRa6JpiG4ksg==",
      "license": "MIT",
      "dependencies": {
        "layout-base": "^1.0.0"
      }
    },
    "node_modules/cytoscape": {
      "version": "3.33.1",
      "resolved": "https://registry.npmjs.org/cytoscape/-/cytoscape-3.33.1.tgz",
      "integrity": "sha512-iJc4TwyANnOGR1OmWhsS9ayRS3s+XQ185FmuHObThD+5AeJCakAAbWv8KimMTt08xCCLNgneQwFp+JRJOr9qGQ==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10"
      }
    },
    "node_modules/cytoscape-cose-bilkent": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/cytoscape-cose-bilkent/-/cytoscape-cose-bilkent-4.1.0.tgz",
      "integrity": "sha512-wgQlVIUJF13Quxiv5e1gstZ08rnZj2XaLHGoFMYXz7SkNfCDOOteKBE6SYRfA9WxxI/iBc3ajfDoc6hb/MRAHQ==",
      "license": "MIT",
      "dependencies": {
        "cose-base": "^1.0.0"
      },
      "peerDependencies": {
        "cytoscape": "^3.2.0"
      }
    },
    "node_modules/cytoscape-fcose": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/cytoscape-fcose/-/cytoscape-fcose-2.2.0.tgz",
      "integrity": "sha512-ki1/VuRIHFCzxWNrsshHYPs6L7TvLu3DL+TyIGEsRcvVERmxokbf5Gdk7mFxZnTdiGtnA4cfSmjZJMviqSuZrQ==",
      "license": "MIT",
      "dependencies": {
        "cose-base": "^2.2.0"
      },
      "peerDependencies": {
        "cytoscape": "^3.2.0"
      }
    },
    "node_modules/cytoscape-fcose/node_modules/cose-base": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/cose-base/-/cose-base-2.2.0.tgz",
      "integrity": "sha512-AzlgcsCbUMymkADOJtQm3wO9S3ltPfYOFD5033keQn9NJzIbtnZj+UdBJe7DYml/8TdbtHJW3j58SOnKhWY/5g==",
      "license": "MIT",
      "dependencies": {
        "layout-base": "^2.0.0"
      }
    },
    "node_modules/cytoscape-fcose/node_modules/layout-base": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/layout-base/-/layout-base-2.0.1.tgz",
      "integrity": "sha512-dp3s92+uNI1hWIpPGH3jK2kxE2lMjdXdr+DH8ynZHpd6PUlH6x6cbuXnoMmiNumznqaNO31xu9e79F0uuZ0JFg==",
      "license": "MIT"
    },
    "node_modules/d3": {
      "version": "7.9.0",
      "resolved": "https://registry.npmjs.org/d3/-/d3-7.9.0.tgz",
      "integrity": "sha512-e1U46jVP+w7Iut8Jt8ri1YsPOvFpg46k+K8TpCb0P+zjCkjkPnV7WzfDJzMHy1LnA+wj5pLT1wjO901gLXeEhA==",
      "license": "ISC",
      "dependencies": {
        "d3-array": "3",
        "d3-axis": "3",
        "d3-brush": "3",
        "d3-chord": "3",
        "d3-color": "3",
        "d3-contour": "4",
        "d3-delaunay": "6",
        "d3-dispatch": "3",
        "d3-drag": "3",
        "d3-dsv": "3",
        "d3-ease": "3",
        "d3-fetch": "3",
        "d3-force": "3",
        "d3-format": "3",
        "d3-geo": "3",
        "d3-hierarchy": "3",
        "d3-interpolate": "3",
        "d3-path": "3",
        "d3-polygon": "3",
        "d3-quadtree": "3",
        "d3-random": "3",
        "d3-scale": "4",
        "d3-scale-chromatic": "3",
        "d3-selection": "3",
        "d3-shape": "3",
        "d3-time": "3",
        "d3-time-format": "4",
        "d3-timer": "3",
        "d3-transition": "3",
        "d3-zoom": "3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-array": {
      "version": "3.2.4",
      "resolved": "https://registry.npmjs.org/d3-array/-/d3-array-3.2.4.tgz",
      "integrity": "sha512-tdQAmyA18i4J7wprpYq8ClcxZy3SC31QMeByyCFyRt7BVHdREQZ5lpzoe5mFEYZUWe+oq8HBvk9JjpibyEV4Jg==",
      "license": "ISC",
      "dependencies": {
        "internmap": "1 - 2"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-axis": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/d3-axis/-/d3-axis-3.0.0.tgz",
      "integrity": "sha512-IH5tgjV4jE/GhHkRV0HiVYPDtvfjHQlQfJHs0usq7M30XcSBvOotpmH1IgkcXsO/5gEQZD43B//fc7SRT5S+xw==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-brush": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/d3-brush/-/d3-brush-3.0.0.tgz",
      "integrity": "sha512-ALnjWlVYkXsVIGlOsuWH1+3udkYFI48Ljihfnh8FZPF2QS9o+PzGLBslO0PjzVoHLZ2KCVgAM8NVkXPJB2aNnQ==",
      "license": "ISC",
      "dependencies": {
        "d3-dispatch": "1 - 3",
        "d3-drag": "2 - 3",
        "d3-interpolate": "1 - 3",
        "d3-selection": "3",
        "d3-transition": "3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-chord": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-chord/-/d3-chord-3.0.1.tgz",
      "integrity": "sha512-VE5S6TNa+j8msksl7HwjxMHDM2yNK3XCkusIlpX5kwauBfXuyLAtNg9jCp/iHH61tgI4sb6R/EIMWCqEIdjT/g==",
      "license": "ISC",
      "dependencies": {
        "d3-path": "1 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-color": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/d3-color/-/d3-color-3.1.0.tgz",
      "integrity": "sha512-zg/chbXyeBtMQ1LbD/WSoW2DpC3I0mpmPdW+ynRTj/x2DAWYrIY7qeZIHidozwV24m4iavr15lNwIwLxRmOxhA==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-contour": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/d3-contour/-/d3-contour-4.0.2.tgz",
      "integrity": "sha512-4EzFTRIikzs47RGmdxbeUvLWtGedDUNkTcmzoeyg4sP/dvCexO47AaQL7VKy/gul85TOxw+IBgA8US2xwbToNA==",
      "license": "ISC",
      "dependencies": {
        "d3-array": "^3.2.0"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-delaunay": {
      "version": "6.0.4",
      "resolved": "https://registry.npmjs.org/d3-delaunay/-/d3-delaunay-6.0.4.tgz",
      "integrity": "sha512-mdjtIZ1XLAM8bm/hx3WwjfHt6Sggek7qH043O8KEjDXN40xi3vx/6pYSVTwLjEgiXQTbvaouWKynLBiUZ6SK6A==",
      "license": "ISC",
      "dependencies": {
        "delaunator": "5"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-dispatch": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-dispatch/-/d3-dispatch-3.0.1.tgz",
      "integrity": "sha512-rzUyPU/S7rwUflMyLc1ETDeBj0NRuHKKAcvukozwhshr6g6c5d8zh4c2gQjY2bZ0dXeGLWc1PF174P2tVvKhfg==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-drag": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/d3-drag/-/d3-drag-3.0.0.tgz",
      "integrity": "sha512-pWbUJLdETVA8lQNJecMxoXfH6x+mO2UQo8rSmZ+QqxcbyA3hfeprFgIT//HW2nlHChWeIIMwS2Fq+gEARkhTkg==",
      "license": "ISC",
      "dependencies": {
        "d3-dispatch": "1 - 3",
        "d3-selection": "3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-dsv": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-dsv/-/d3-dsv-3.0.1.tgz",
      "integrity": "sha512-UG6OvdI5afDIFP9w4G0mNq50dSOsXHJaRE8arAS5o9ApWnIElp8GZw1Dun8vP8OyHOZ/QJUKUJwxiiCCnUwm+Q==",
      "license": "ISC",
      "dependencies": {
        "commander": "7",
        "iconv-lite": "0.6",
        "rw": "1"
      },
      "bin": {
        "csv2json": "bin/dsv2json.js",
        "csv2tsv": "bin/dsv2dsv.js",
        "dsv2dsv": "bin/dsv2dsv.js",
        "dsv2json": "bin/dsv2json.js",
        "json2csv": "bin/json2dsv.js",
        "json2dsv": "bin/json2dsv.js",
        "json2tsv": "bin/json2dsv.js",
        "tsv2csv": "bin/dsv2dsv.js",
        "tsv2json": "bin/dsv2json.js"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-dsv/node_modules/commander": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/commander/-/commander-7.2.0.tgz",
      "integrity": "sha512-QrWXB+ZQSVPmIWIhtEO9H+gwHaMGYiF5ChvoJ+K9ZGHG/sVsa6yiesAD1GC/x46sET00Xlwo1u49RVVVzvcSkw==",
      "license": "MIT",
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/d3-ease": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-ease/-/d3-ease-3.0.1.tgz",
      "integrity": "sha512-wR/XK3D3XcLIZwpbvQwQ5fK+8Ykds1ip7A2Txe0yxncXSdq1L9skcG7blcedkOX+ZcgxGAmLX1FrRGbADwzi0w==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-fetch": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-fetch/-/d3-fetch-3.0.1.tgz",
      "integrity": "sha512-kpkQIM20n3oLVBKGg6oHrUchHM3xODkTzjMoj7aWQFq5QEM+R6E4WkzT5+tojDY7yjez8KgCBRoj4aEr99Fdqw==",
      "license": "ISC",
      "dependencies": {
        "d3-dsv": "1 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-force": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/d3-force/-/d3-force-3.0.0.tgz",
      "integrity": "sha512-zxV/SsA+U4yte8051P4ECydjD/S+qeYtnaIyAs9tgHCqfguma/aAQDjo85A9Z6EKhBirHRJHXIgJUlffT4wdLg==",
      "license": "ISC",
      "dependencies": {
        "d3-dispatch": "1 - 3",
        "d3-quadtree": "1 - 3",
        "d3-timer": "1 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-format": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/d3-format/-/d3-format-3.1.0.tgz",
      "integrity": "sha512-YyUI6AEuY/Wpt8KWLgZHsIU86atmikuoOmCfommt0LYHiQSPjvX2AcFc38PX0CBpr2RCyZhjex+NS/LPOv6YqA==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-geo": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/d3-geo/-/d3-geo-3.1.1.tgz",
      "integrity": "sha512-637ln3gXKXOwhalDzinUgY83KzNWZRKbYubaG+fGVuc/dxO64RRljtCTnf5ecMyE1RIdtqpkVcq0IbtU2S8j2Q==",
      "license": "ISC",
      "dependencies": {
        "d3-array": "2.5.0 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-hierarchy": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/d3-hierarchy/-/d3-hierarchy-3.1.2.tgz",
      "integrity": "sha512-FX/9frcub54beBdugHjDCdikxThEqjnR93Qt7PvQTOHxyiNCAlvMrHhclk3cD5VeAaq9fxmfRp+CnWw9rEMBuA==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-interpolate": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-interpolate/-/d3-interpolate-3.0.1.tgz",
      "integrity": "sha512-3bYs1rOD33uo8aqJfKP3JWPAibgw8Zm2+L9vBKEHJ2Rg+viTR7o5Mmv5mZcieN+FRYaAOWX5SJATX6k1PWz72g==",
      "license": "ISC",
      "dependencies": {
        "d3-color": "1 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-path": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/d3-path/-/d3-path-3.1.0.tgz",
      "integrity": "sha512-p3KP5HCf/bvjBSSKuXid6Zqijx7wIfNW+J/maPs+iwR35at5JCbLUT0LzF1cnjbCHWhqzQTIN2Jpe8pRebIEFQ==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-polygon": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-polygon/-/d3-polygon-3.0.1.tgz",
      "integrity": "sha512-3vbA7vXYwfe1SYhED++fPUQlWSYTTGmFmQiany/gdbiWgU/iEyQzyymwL9SkJjFFuCS4902BSzewVGsHHmHtXg==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-quadtree": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-quadtree/-/d3-quadtree-3.0.1.tgz",
      "integrity": "sha512-04xDrxQTDTCFwP5H6hRhsRcb9xxv2RzkcsygFzmkSIOJy3PeRJP7sNk3VRIbKXcog561P9oU0/rVH6vDROAgUw==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-random": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-random/-/d3-random-3.0.1.tgz",
      "integrity": "sha512-FXMe9GfxTxqd5D6jFsQ+DJ8BJS4E/fT5mqqdjovykEB2oFbTMDVdg1MGFxfQW+FBOGoB++k8swBrgwSHT1cUXQ==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-sankey": {
      "version": "0.12.3",
      "resolved": "https://registry.npmjs.org/d3-sankey/-/d3-sankey-0.12.3.tgz",
      "integrity": "sha512-nQhsBRmM19Ax5xEIPLMY9ZmJ/cDvd1BG3UVvt5h3WRxKg5zGRbvnteTyWAbzeSvlh3tW7ZEmq4VwR5mB3tutmQ==",
      "license": "BSD-3-Clause",
      "dependencies": {
        "d3-array": "1 - 2",
        "d3-shape": "^1.2.0"
      }
    },
    "node_modules/d3-sankey/node_modules/d3-array": {
      "version": "2.12.1",
      "resolved": "https://registry.npmjs.org/d3-array/-/d3-array-2.12.1.tgz",
      "integrity": "sha512-B0ErZK/66mHtEsR1TkPEEkwdy+WDesimkM5gpZr5Dsg54BiTA5RXtYW5qTLIAcekaS9xfZrzBLF/OAkB3Qn1YQ==",
      "license": "BSD-3-Clause",
      "dependencies": {
        "internmap": "^1.0.0"
      }
    },
    "node_modules/d3-sankey/node_modules/d3-path": {
      "version": "1.0.9",
      "resolved": "https://registry.npmjs.org/d3-path/-/d3-path-1.0.9.tgz",
      "integrity": "sha512-VLaYcn81dtHVTjEHd8B+pbe9yHWpXKZUC87PzoFmsFrJqgFwDe/qxfp5MlfsfM1V5E/iVt0MmEbWQ7FVIXh/bg==",
      "license": "BSD-3-Clause"
    },
    "node_modules/d3-sankey/node_modules/d3-shape": {
      "version": "1.3.7",
      "resolved": "https://registry.npmjs.org/d3-shape/-/d3-shape-1.3.7.tgz",
      "integrity": "sha512-EUkvKjqPFUAZyOlhY5gzCxCeI0Aep04LwIRpsZ/mLFelJiUfnK56jo5JMDSE7yyP2kLSb6LtF+S5chMk7uqPqw==",
      "license": "BSD-3-Clause",
      "dependencies": {
        "d3-path": "1"
      }
    },
    "node_modules/d3-sankey/node_modules/internmap": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/internmap/-/internmap-1.0.1.tgz",
      "integrity": "sha512-lDB5YccMydFBtasVtxnZ3MRBHuaoE8GKsppq+EchKL2U4nK/DmEpPHNH8MZe5HkMtpSiTSOZwfN0tzYjO/lJEw==",
      "license": "ISC"
    },
    "node_modules/d3-scale": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/d3-scale/-/d3-scale-4.0.2.tgz",
      "integrity": "sha512-GZW464g1SH7ag3Y7hXjf8RoUuAFIqklOAq3MRl4OaWabTFJY9PN/E1YklhXLh+OQ3fM9yS2nOkCoS+WLZ6kvxQ==",
      "license": "ISC",
      "dependencies": {
        "d3-array": "2.10.0 - 3",
        "d3-format": "1 - 3",
        "d3-interpolate": "1.2.0 - 3",
        "d3-time": "2.1.1 - 3",
        "d3-time-format": "2 - 4"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-scale-chromatic": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/d3-scale-chromatic/-/d3-scale-chromatic-3.1.0.tgz",
      "integrity": "sha512-A3s5PWiZ9YCXFye1o246KoscMWqf8BsD9eRiJ3He7C9OBaxKhAd5TFCdEx/7VbKtxxTsu//1mMJFrEt572cEyQ==",
      "license": "ISC",
      "dependencies": {
        "d3-color": "1 - 3",
        "d3-interpolate": "1 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-selection": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/d3-selection/-/d3-selection-3.0.0.tgz",
      "integrity": "sha512-fmTRWbNMmsmWq6xJV8D19U/gw/bwrHfNXxrIN+HfZgnzqTHp9jOmKMhsTUjXOJnZOdZY9Q28y4yebKzqDKlxlQ==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-shape": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/d3-shape/-/d3-shape-3.2.0.tgz",
      "integrity": "sha512-SaLBuwGm3MOViRq2ABk3eLoxwZELpH6zhl3FbAoJ7Vm1gofKx6El1Ib5z23NUEhF9AsGl7y+dzLe5Cw2AArGTA==",
      "license": "ISC",
      "dependencies": {
        "d3-path": "^3.1.0"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-time": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/d3-time/-/d3-time-3.1.0.tgz",
      "integrity": "sha512-VqKjzBLejbSMT4IgbmVgDjpkYrNWUYJnbCGo874u7MMKIWsILRX+OpX/gTk8MqjpT1A/c6HY2dCA77ZN0lkQ2Q==",
      "license": "ISC",
      "dependencies": {
        "d3-array": "2 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-time-format": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/d3-time-format/-/d3-time-format-4.1.0.tgz",
      "integrity": "sha512-dJxPBlzC7NugB2PDLwo9Q8JiTR3M3e4/XANkreKSUxF8vvXKqm1Yfq4Q5dl8budlunRVlUUaDUgFt7eA8D6NLg==",
      "license": "ISC",
      "dependencies": {
        "d3-time": "1 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-timer": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-timer/-/d3-timer-3.0.1.tgz",
      "integrity": "sha512-ndfJ/JxxMd3nw31uyKoY2naivF+r29V+Lc0svZxe1JvvIRmi8hUsrMvdOwgS1o6uBHmiz91geQ0ylPP0aj1VUA==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-transition": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-transition/-/d3-transition-3.0.1.tgz",
      "integrity": "sha512-ApKvfjsSR6tg06xrL434C0WydLr7JewBB3V+/39RMHsaXTOG0zmt/OAXeng5M5LBm0ojmxJrpomQVZ1aPvBL4w==",
      "license": "ISC",
      "dependencies": {
        "d3-color": "1 - 3",
        "d3-dispatch": "1 - 3",
        "d3-ease": "1 - 3",
        "d3-interpolate": "1 - 3",
        "d3-timer": "1 - 3"
      },
      "engines": {
        "node": ">=12"
      },
      "peerDependencies": {
        "d3-selection": "2 - 3"
      }
    },
    "node_modules/d3-zoom": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/d3-zoom/-/d3-zoom-3.0.0.tgz",
      "integrity": "sha512-b8AmV3kfQaqWAuacbPuNbL6vahnOJflOhexLzMMNLga62+/nh0JzvJ0aO/5a5MVgUFGS7Hu1P9P03o3fJkDCyw==",
      "license": "ISC",
      "dependencies": {
        "d3-dispatch": "1 - 3",
        "d3-drag": "2 - 3",
        "d3-interpolate": "1 - 3",
        "d3-selection": "2 - 3",
        "d3-transition": "2 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/dagre-d3-es": {
      "version": "7.0.11",
      "resolved": "https://registry.npmjs.org/dagre-d3-es/-/dagre-d3-es-7.0.11.tgz",
      "integrity": "sha512-tvlJLyQf834SylNKax8Wkzco/1ias1OPw8DcUMDE7oUIoSEW25riQVuiu/0OWEFqT0cxHT3Pa9/D82Jr47IONw==",
      "license": "MIT",
      "dependencies": {
        "d3": "^7.9.0",
        "lodash-es": "^4.17.21"
      }
    },
    "node_modules/dayjs": {
      "version": "1.11.18",
      "resolved": "https://registry.npmjs.org/dayjs/-/dayjs-1.11.18.tgz",
      "integrity": "sha512-zFBQ7WFRvVRhKcWoUh+ZA1g2HVgUbsZm9sbddh8EC5iv93sui8DVVz1Npvz+r6meo9VKfa8NyLWBsQK1VvIKPA==",
      "license": "MIT"
    },
    "node_modules/debug": {
      "version": "4.4.1",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.1.tgz",
      "integrity": "sha512-KcKCqiftBJcZr++7ykoDIEwSa3XWowTfNPo92BYxjXiyYEVrUQh2aLyhxBCwww+heortUFxEJYcRzosstTEBYQ==",
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/delaunator": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/delaunator/-/delaunator-5.0.1.tgz",
      "integrity": "sha512-8nvh+XBe96aCESrGOqMp/84b13H9cdKbG5P2ejQCh4d4sK9RL4371qou9drQjMhvnPmhWl5hnmqbEE0fXr9Xnw==",
      "license": "ISC",
      "dependencies": {
        "robust-predicates": "^3.0.2"
      }
    },
    "node_modules/dompurify": {
      "version": "3.2.7",
      "resolved": "https://registry.npmjs.org/dompurify/-/dompurify-3.2.7.tgz",
      "integrity": "sha512-WhL/YuveyGXJaerVlMYGWhvQswa7myDG17P7Vu65EWC05o8vfeNbvNf4d/BOvH99+ZW+LlQsc1GDKMa1vNK6dw==",
      "license": "(MPL-2.0 OR Apache-2.0)",
      "optionalDependencies": {
        "@types/trusted-types": "^2.0.7"
      }
    },
    "node_modules/exsolve": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/exsolve/-/exsolve-1.0.7.tgz",
      "integrity": "sha512-VO5fQUzZtI6C+vx4w/4BWJpg3s/5l+6pRQEHzFRM8WFi4XffSP1Z+4qi7GbjWbvRQEbdIco5mIMq+zX4rPuLrw==",
      "license": "MIT"
    },
    "node_modules/hachure-fill": {
      "version": "0.5.2",
      "resolved": "https://registry.npmjs.org/hachure-fill/-/hachure-fill-0.5.2.tgz",
      "integrity": "sha512-3GKBOn+m2LX9iq+JC1064cSFprJY4jL1jCXTcpnfER5HYE2l/4EfWSGzkPa/ZDBmYI0ZOEj5VHV/eKnPGkHuOg==",
      "license": "MIT"
    },
    "node_modules/iconv-lite": {
      "version": "0.6.3",
      "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.6.3.tgz",
      "integrity": "sha512-4fCk79wshMdzMp2rH06qWrJE4iolqLhCUH+OiuIgU++RB0+94NlDL81atO7GX55uUKueo0txHNtvEyI6D7WdMw==",
      "license": "MIT",
      "dependencies": {
        "safer-buffer": ">= 2.1.2 < 3.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/internmap": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/internmap/-/internmap-2.0.3.tgz",
      "integrity": "sha512-5Hh7Y1wQbvY5ooGgPbDaL5iYLAPzMTUrjMulskHLH6wnv/A+1q5rgEaiuqEjB+oxGXIVZs1FF+R/KPN3ZSQYYg==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/katex": {
      "version": "0.16.22",
      "resolved": "https://registry.npmjs.org/katex/-/katex-0.16.22.tgz",
      "integrity": "sha512-XCHRdUw4lf3SKBaJe4EvgqIuWwkPSo9XoeO8GjQW94Bp7TWv9hNhzZjZ+OH9yf1UmLygb7DIT5GSFQiyt16zYg==",
      "funding": [
        "https://opencollective.com/katex",
        "https://github.com/sponsors/katex"
      ],
      "license": "MIT",
      "dependencies": {
        "commander": "^8.3.0"
      },
      "bin": {
        "katex": "cli.js"
      }
    },
    "node_modules/khroma": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/khroma/-/khroma-2.1.0.tgz",
      "integrity": "sha512-Ls993zuzfayK269Svk9hzpeGUKob/sIgZzyHYdjQoAdQetRKpOLj+k/QQQ/6Qi0Yz65mlROrfd+Ev+1+7dz9Kw=="
    },
    "node_modules/kolorist": {
      "version": "1.8.0",
      "resolved": "https://registry.npmjs.org/kolorist/-/kolorist-1.8.0.tgz",
      "integrity": "sha512-Y+60/zizpJ3HRH8DCss+q95yr6145JXZo46OTpFvDZWLfRCE4qChOyk1b26nMaNpfHHgxagk9dXT5OP0Tfe+dQ==",
      "license": "MIT"
    },
    "node_modules/langium": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/langium/-/langium-3.3.1.tgz",
      "integrity": "sha512-QJv/h939gDpvT+9SiLVlY7tZC3xB2qK57v0J04Sh9wpMb6MP1q8gB21L3WIo8T5P1MSMg3Ep14L7KkDCFG3y4w==",
      "license": "MIT",
      "dependencies": {
        "chevrotain": "~11.0.3",
        "chevrotain-allstar": "~0.3.0",
        "vscode-languageserver": "~9.0.1",
        "vscode-languageserver-textdocument": "~1.0.11",
        "vscode-uri": "~3.0.8"
      },
      "engines": {
        "node": ">=16.0.0"
      }
    },
    "node_modules/layout-base": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/layout-base/-/layout-base-1.0.2.tgz",
      "integrity": "sha512-8h2oVEZNktL4BH2JCOI90iD1yXwL6iNW7KcCKT2QZgQJR2vbqDsldCTPRU9NifTCqHZci57XvQQ15YTu+sTYPg==",
      "license": "MIT"
    },
    "node_modules/local-pkg": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/local-pkg/-/local-pkg-1.1.2.tgz",
      "integrity": "sha512-arhlxbFRmoQHl33a0Zkle/YWlmNwoyt6QNZEIJcqNbdrsix5Lvc4HyyI3EnwxTYlZYc32EbYrQ8SzEZ7dqgg9A==",
      "license": "MIT",
      "dependencies": {
        "mlly": "^1.7.4",
        "pkg-types": "^2.3.0",
        "quansync": "^0.2.11"
      },
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/sponsors/antfu"
      }
    },
    "node_modules/lodash-es": {
      "version": "4.17.21",
      "resolved": "https://registry.npmjs.org/lodash-es/-/lodash-es-4.17.21.tgz",
      "integrity": "sha512-mKnC+QJ9pWVzv+C4/U3rRsHapFfHvQFoFB92e52xeyGMcX6/OlIl78je1u8vePzYZSkkogMPJ2yjxxsb89cxyw==",
      "license": "MIT"
    },
    "node_modules/marked": {
      "version": "15.0.12",
      "resolved": "https://registry.npmjs.org/marked/-/marked-15.0.12.tgz",
      "integrity": "sha512-8dD6FusOQSrpv9Z1rdNMdlSgQOIP880DHqnohobOmYLElGEqAL/JvxvuxZO16r4HtjTlfPRDC1hbvxC9dPN2nA==",
      "license": "MIT",
      "bin": {
        "marked": "bin/marked.js"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/mermaid": {
      "version": "11.11.0",
      "resolved": "https://registry.npmjs.org/mermaid/-/mermaid-11.11.0.tgz",
      "integrity": "sha512-9lb/VNkZqWTRjVgCV+l1N+t4kyi94y+l5xrmBmbbxZYkfRl5hEDaTPMOcaWKCl1McG8nBEaMlWwkcAEEgjhBgg==",
      "license": "MIT",
      "dependencies": {
        "@braintree/sanitize-url": "^7.0.4",
        "@iconify/utils": "^3.0.1",
        "@mermaid-js/parser": "^0.6.2",
        "@types/d3": "^7.4.3",
        "cytoscape": "^3.29.3",
        "cytoscape-cose-bilkent": "^4.1.0",
        "cytoscape-fcose": "^2.2.0",
        "d3": "^7.9.0",
        "d3-sankey": "^0.12.3",
        "dagre-d3-es": "7.0.11",
        "dayjs": "^1.11.13",
        "dompurify": "^3.2.5",
        "katex": "^0.16.22",
        "khroma": "^2.1.0",
        "lodash-es": "^4.17.21",
        "marked": "^15.0.7",
        "roughjs": "^4.6.6",
        "stylis": "^4.3.6",
        "ts-dedent": "^2.2.0",
        "uuid": "^11.1.0"
      }
    },
    "node_modules/mlly": {
      "version": "1.8.0",
      "resolved": "https://registry.npmjs.org/mlly/-/mlly-1.8.0.tgz",
      "integrity": "sha512-l8D9ODSRWLe2KHJSifWGwBqpTZXIXTeo8mlKjY+E2HAakaTeNpqAyBZ8GSqLzHgw4XmHmC8whvpjJNMbFZN7/g==",
      "license": "MIT",
      "dependencies": {
        "acorn": "^8.15.0",
        "pathe": "^2.0.3",
        "pkg-types": "^1.3.1",
        "ufo": "^1.6.1"
      }
    },
    "node_modules/mlly/node_modules/confbox": {
      "version": "0.1.8",
      "resolved": "https://registry.npmjs.org/confbox/-/confbox-0.1.8.tgz",
      "integrity": "sha512-RMtmw0iFkeR4YV+fUOSucriAQNb9g8zFR52MWCtl+cCZOFRNL6zeB395vPzFhEjjn4fMxXudmELnl/KF/WrK6w==",
      "license": "MIT"
    },
    "node_modules/mlly/node_modules/pkg-types": {
      "version": "1.3.1",
      "resolved": "https://registry.npmjs.org/pkg-types/-/pkg-types-1.3.1.tgz",
      "integrity": "sha512-/Jm5M4RvtBFVkKWRu2BLUTNP8/M2a+UwuAX+ae4770q1qVGtfjG+WTCupoZixokjmHiry8uI+dlY8KXYV5HVVQ==",
      "license": "MIT",
      "dependencies": {
        "confbox": "^0.1.8",
        "mlly": "^1.7.4",
        "pathe": "^2.0.1"
      }
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/package-manager-detector": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/package-manager-detector/-/package-manager-detector-1.3.0.tgz",
      "integrity": "sha512-ZsEbbZORsyHuO00lY1kV3/t72yp6Ysay6Pd17ZAlNGuGwmWDLCJxFpRs0IzfXfj1o4icJOkUEioexFHzyPurSQ==",
      "license": "MIT"
    },
    "node_modules/path-data-parser": {
      "version": "0.1.0",
      "resolved": "https://registry.npmjs.org/path-data-parser/-/path-data-parser-0.1.0.tgz",
      "integrity": "sha512-NOnmBpt5Y2RWbuv0LMzsayp3lVylAHLPUTut412ZA3l+C4uw4ZVkQbjShYCQ8TCpUMdPapr4YjUqLYD6v68j+w==",
      "license": "MIT"
    },
    "node_modules/pathe": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/pathe/-/pathe-2.0.3.tgz",
      "integrity": "sha512-WUjGcAqP1gQacoQe+OBJsFA7Ld4DyXuUIjZ5cc75cLHvJ7dtNsTugphxIADwspS+AraAUePCKrSVtPLFj/F88w==",
      "license": "MIT"
    },
    "node_modules/pkg-types": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/pkg-types/-/pkg-types-2.3.0.tgz",
      "integrity": "sha512-SIqCzDRg0s9npO5XQ3tNZioRY1uK06lA41ynBC1YmFTmnY6FjUjVt6s4LoADmwoig1qqD0oK8h1p/8mlMx8Oig==",
      "license": "MIT",
      "dependencies": {
        "confbox": "^0.2.2",
        "exsolve": "^1.0.7",
        "pathe": "^2.0.3"
      }
    },
    "node_modules/points-on-curve": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/points-on-curve/-/points-on-curve-0.2.0.tgz",
      "integrity": "sha512-0mYKnYYe9ZcqMCWhUjItv/oHjvgEsfKvnUTg8sAtnHr3GVy7rGkXCb6d5cSyqrWqL4k81b9CPg3urd+T7aop3A==",
      "license": "MIT"
    },
    "node_modules/points-on-path": {
      "version": "0.2.1",
      "resolved": "https://registry.npmjs.org/points-on-path/-/points-on-path-0.2.1.tgz",
      "integrity": "sha512-25ClnWWuw7JbWZcgqY/gJ4FQWadKxGWk+3kR/7kD0tCaDtPPMj7oHu2ToLaVhfpnHrZzYby2w6tUA0eOIuUg8g==",
      "license": "MIT",
      "dependencies": {
        "path-data-parser": "0.1.0",
        "points-on-curve": "0.2.0"
      }
    },
    "node_modules/quansync": {
      "version": "0.2.11",
      "resolved": "https://registry.npmjs.org/quansync/-/quansync-0.2.11.tgz",
      "integrity": "sha512-AifT7QEbW9Nri4tAwR5M/uzpBuqfZf+zwaEM/QkzEjj7NBuFD2rBuy0K3dE+8wltbezDV7JMA0WfnCPYRSYbXA==",
      "funding": [
        {
          "type": "individual",
          "url": "https://github.com/sponsors/antfu"
        },
        {
          "type": "individual",
          "url": "https://github.com/sponsors/sxzz"
        }
      ],
      "license": "MIT"
    },
    "node_modules/robust-predicates": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/robust-predicates/-/robust-predicates-3.0.2.tgz",
      "integrity": "sha512-IXgzBWvWQwE6PrDI05OvmXUIruQTcoMDzRsOd5CDvHCVLcLHMTSYvOK5Cm46kWqlV3yAbuSpBZdJ5oP5OUoStg==",
      "license": "Unlicense"
    },
    "node_modules/roughjs": {
      "version": "4.6.6",
      "resolved": "https://registry.npmjs.org/roughjs/-/roughjs-4.6.6.tgz",
      "integrity": "sha512-ZUz/69+SYpFN/g/lUlo2FXcIjRkSu3nDarreVdGGndHEBJ6cXPdKguS8JGxwj5HA5xIbVKSmLgr5b3AWxtRfvQ==",
      "license": "MIT",
      "dependencies": {
        "hachure-fill": "^0.5.2",
        "path-data-parser": "^0.1.0",
        "points-on-curve": "^0.2.0",
        "points-on-path": "^0.2.1"
      }
    },
    "node_modules/rw": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/rw/-/rw-1.3.3.tgz",
      "integrity": "sha512-PdhdWy89SiZogBLaw42zdeqtRJ//zFd2PgQavcICDUgJT5oW10QCRKbJ6bg4r0/UY2M6BWd5tkxuGFRvCkgfHQ==",
      "license": "BSD-3-Clause"
    },
    "node_modules/safer-buffer": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz",
      "integrity": "sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==",
      "license": "MIT"
    },
    "node_modules/stylis": {
      "version": "4.3.6",
      "resolved": "https://registry.npmjs.org/stylis/-/stylis-4.3.6.tgz",
      "integrity": "sha512-yQ3rwFWRfwNUY7H5vpU0wfdkNSnvnJinhF9830Swlaxl03zsOjCfmX0ugac+3LtK0lYSgwL/KXc8oYL3mG4YFQ==",
      "license": "MIT"
    },
    "node_modules/tinyexec": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/tinyexec/-/tinyexec-1.0.1.tgz",
      "integrity": "sha512-5uC6DDlmeqiOwCPmK9jMSdOuZTh8bU39Ys6yidB+UTt5hfZUPGAypSgFRiEp+jbi9qH40BLDvy85jIU88wKSqw==",
      "license": "MIT"
    },
    "node_modules/ts-dedent": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/ts-dedent/-/ts-dedent-2.2.0.tgz",
      "integrity": "sha512-q5W7tVM71e2xjHZTlgfTDoPF/SmqKG5hddq9SzR49CH2hayqRKJtQ4mtRlSxKaJlR/+9rEM+mnBHf7I2/BQcpQ==",
      "license": "MIT",
      "engines": {
        "node": ">=6.10"
      }
    },
    "node_modules/ufo": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/ufo/-/ufo-1.6.1.tgz",
      "integrity": "sha512-9a4/uxlTWJ4+a5i0ooc1rU7C7YOw3wT+UGqdeNNHWnOF9qcMBgLRS+4IYUqbczewFx4mLEig6gawh7X6mFlEkA==",
      "license": "MIT"
    },
    "node_modules/undici-types": {
      "version": "6.21.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.21.0.tgz",
      "integrity": "sha512-iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/uuid": {
      "version": "11.1.0",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-11.1.0.tgz",
      "integrity": "sha512-0/A9rDy9P7cJ+8w1c9WD9V//9Wj15Ce2MPz8Ri6032usz+NfePxx5AcN3bN+r6ZL6jEo066/yNYB3tn4pQEx+A==",
      "funding": [
        "https://github.com/sponsors/broofa",
        "https://github.com/sponsors/ctavan"
      ],
      "license": "MIT",
      "bin": {
        "uuid": "dist/esm/bin/uuid"
      }
    },
    "node_modules/vscode-jsonrpc": {
      "version": "8.2.0",
      "resolved": "https://registry.npmjs.org/vscode-jsonrpc/-/vscode-jsonrpc-8.2.0.tgz",
      "integrity": "sha512-C+r0eKJUIfiDIfwJhria30+TYWPtuHJXHtI7J0YlOmKAo7ogxP20T0zxB7HZQIFhIyvoBPwWskjxrvAtfjyZfA==",
      "license": "MIT",
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/vscode-languageserver": {
      "version": "9.0.1",
      "resolved": "https://registry.npmjs.org/vscode-languageserver/-/vscode-languageserver-9.0.1.tgz",
      "integrity": "sha512-woByF3PDpkHFUreUa7Hos7+pUWdeWMXRd26+ZX2A8cFx6v/JPTtd4/uN0/jB6XQHYaOlHbio03NTHCqrgG5n7g==",
      "license": "MIT",
      "dependencies": {
        "vscode-languageserver-protocol": "3.17.5"
      },
      "bin": {
        "installServerIntoExtension": "bin/installServerIntoExtension"
      }
    },
    "node_modules/vscode-languageserver-protocol": {
      "version": "3.17.5",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-protocol/-/vscode-languageserver-protocol-3.17.5.tgz",
      "integrity": "sha512-mb1bvRJN8SVznADSGWM9u/b07H7Ecg0I3OgXDuLdn307rl/J3A9YD6/eYOssqhecL27hK1IPZAsaqh00i/Jljg==",
      "license": "MIT",
      "dependencies": {
        "vscode-jsonrpc": "8.2.0",
        "vscode-languageserver-types": "3.17.5"
      }
    },
    "node_modules/vscode-languageserver-textdocument": {
      "version": "1.0.12",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-textdocument/-/vscode-languageserver-textdocument-1.0.12.tgz",
      "integrity": "sha512-cxWNPesCnQCcMPeenjKKsOCKQZ/L6Tv19DTRIGuLWe32lyzWhihGVJ/rcckZXJxfdKCFvRLS3fpBIsV/ZGX4zA==",
      "license": "MIT"
    },
    "node_modules/vscode-languageserver-types": {
      "version": "3.17.5",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-types/-/vscode-languageserver-types-3.17.5.tgz",
      "integrity": "sha512-Ld1VelNuX9pdF39h2Hgaeb5hEZM2Z3jUrrMgWQAu82jMtZp7p3vJT3BzToKtZI7NgQssZje5o0zryOrhQvzQAg==",
      "license": "MIT"
    },
    "node_modules/vscode-uri": {
      "version": "3.0.8",
      "resolved": "https://registry.npmjs.org/vscode-uri/-/vscode-uri-3.0.8.tgz",
      "integrity": "sha512-AyFQ0EVmsOZOlAnxoFOGOq1SQDWAB7C6aqMGS23svWAllfOaxbuFvcT8D1i8z3Gyn8fraVeZNNmN6e9bxxXkKw==",
      "license": "MIT"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/mermaid-chat-features/package.json]---
Location: vscode-main/extensions/mermaid-chat-features/package.json

```json
{
  "name": "mermaid-chat-features",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  },
  "aiKey": "0c6ae279ed8443289764825290e4f9e2-1a736e7c-1324-4338-be46-fc2a58ae4d14-7255",
  "engines": {
    "vscode": "^1.104.0"
  },
  "enabledApiProposals": [
    "chatOutputRenderer"
  ],
  "capabilities": {
    "virtualWorkspaces": true,
    "untrustedWorkspaces": {
      "supported": true
    }
  },
  "main": "./out/extension",
  "browser": "./dist/browser/extension",
  "activationEvents": [],
  "contributes": {
    "configuration": {
      "title": "Mermaid Chat Features",
      "properties": {
        "mermaid-chat.enabled": {
          "type": "boolean",
          "default": false,
          "description": "%config.enabled.description%",
          "scope": "application",
          "tags": [
            "experimental"
          ]
        }
      }
    },
    "chatOutputRenderers": [
      {
        "viewType": "vscode.chatMermaidDiagram",
        "mimeTypes": [
          "text/vnd.mermaid"
        ]
      }
    ],
    "languageModelTools": [
      {
        "name": "renderMermaidDiagram",
        "displayName": "Mermaid Renderer",
        "toolReferenceName": "renderMermaidDiagram",
        "canBeReferencedInPrompt": true,
        "modelDescription": "Renders a Mermaid diagram from Mermaid.js markup.",
        "userDescription": "Render a Mermaid.js diagrams from markup.",
        "when": "config.mermaid-chat.enabled",
        "inputSchema": {
          "type": "object",
          "properties": {
            "markup": {
              "type": "string",
              "description": "The mermaid diagram markup to render as a Mermaid diagram. This should only be the markup of the diagram. Do not include a wrapping code block."
            }
          }
        }
      }
    ]
  },
  "scripts": {
    "compile": "gulp compile-extension:mermaid-chat-features && npm run build-chat-webview",
    "watch": "npm run build-chat-webview && gulp watch-extension:mermaid-chat-features",
    "vscode:prepublish": "npm run build-ext && npm run build-chat-webview",
    "build-ext": "node ../../node_modules/gulp/bin/gulp.js --gulpfile ../../build/gulpfile.extensions.mjs compile-extension:mermaid-chat-features",
    "build-chat-webview": "node ./esbuild-chat-webview.mjs",
    "compile-web": "npx webpack-cli --config extension-browser.webpack.config --mode none",
    "watch-web": "npx webpack-cli --config extension-browser.webpack.config --mode none --watch --info-verbosity verbose"
  },
  "devDependencies": {
    "@types/node": "^22.18.10"
  },
  "dependencies": {
    "dompurify": "^3.2.7",
    "mermaid": "^11.11.0"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/mermaid-chat-features/package.nls.json]---
Location: vscode-main/extensions/mermaid-chat-features/package.nls.json

```json
{
	"displayName": "Mermaid Chat Features",
	"description": "Adds Mermaid diagram support to built-in chats.",
	"config.enabled.description": "Enable a tool for experimental Mermaid diagram rendering in chat responses."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/mermaid-chat-features/README.md]---
Location: vscode-main/extensions/mermaid-chat-features/README.md

```markdown
# Mermaid Chat Features

**Notice:** This extension is bundled with Visual Studio Code. It can be disabled but not uninstalled.

Adds basic [Mermaid.js](https://mermaid.js.org) diagram rendering to build-in chat.
```

--------------------------------------------------------------------------------

---[FILE: extensions/mermaid-chat-features/tsconfig.json]---
Location: vscode-main/extensions/mermaid-chat-features/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"types": [
			"node"
		],
		"typeRoots": [
			"./node_modules/@types"
		]
	},
	"include": [
		"src/**/*",
		"../../src/vscode-dts/vscode.d.ts",
		"../../src/vscode-dts/vscode.proposed.chatOutputRenderer.d.ts",
		"../../src/vscode-dts/vscode.proposed.chatParticipantAdditions.d.ts",
		"../../src/vscode-dts/vscode.proposed.languageModelThinkingPart.d.ts",
		"../../src/vscode-dts/vscode.proposed.chatParticipantPrivate.d.ts",
		"../../src/vscode-dts/vscode.proposed.languageModelProxy.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/mermaid-chat-features/chat-webview-src/index.ts]---
Location: vscode-main/extensions/mermaid-chat-features/chat-webview-src/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import mermaid, { MermaidConfig } from 'mermaid';

function getMermaidTheme() {
	return document.body.classList.contains('vscode-dark') || document.body.classList.contains('vscode-high-contrast')
		? 'dark'
		: 'default';
}

type State = {
	readonly diagramText: string;
	readonly theme: 'dark' | 'default';
};

let state: State | undefined = undefined;

function init() {
	const diagram = document.querySelector('.mermaid');
	if (!diagram) {
		return;
	}

	const theme = getMermaidTheme();
	state = {
		diagramText: diagram.textContent ?? '',
		theme
	};

	const config: MermaidConfig = {
		startOnLoad: true,
		theme,
	};
	mermaid.initialize(config);
}

function tryUpdate() {
	const newTheme = getMermaidTheme();
	if (state?.theme === newTheme) {
		return;
	}

	const diagramNode = document.querySelector('.mermaid');
	if (!diagramNode || !(diagramNode instanceof HTMLElement)) {
		return;
	}

	state = {
		diagramText: state?.diagramText ?? '',
		theme: newTheme
	};

	// Re-render
	diagramNode.textContent = state?.diagramText ?? '';
	delete diagramNode.dataset.processed;

	mermaid.initialize({
		theme: newTheme,
	});
	mermaid.run({
		nodes: [diagramNode]
	});
}

// Update when theme changes
new MutationObserver(() => {
	tryUpdate();
}).observe(document.body, { attributes: true, attributeFilter: ['class'] });

init();
```

--------------------------------------------------------------------------------

---[FILE: extensions/mermaid-chat-features/chat-webview-src/tsconfig.json]---
Location: vscode-main/extensions/mermaid-chat-features/chat-webview-src/tsconfig.json

```json
{
	"extends": "../../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./dist/",
		"jsx": "react",
		"lib": [
			"ES2024",
			"DOM",
			"DOM.Iterable"
		],
		"types": [
			"node"
		],
		"typeRoots": [
			"../node_modules/@types"
		]
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/mermaid-chat-features/src/extension.ts]---
Location: vscode-main/extensions/mermaid-chat-features/src/extension.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as vscode from 'vscode';
import { generateUuid } from './uuid';

/**
 * View type that uniquely identifies the Mermaid chat output renderer.
 */
const viewType = 'vscode.chatMermaidDiagram';

/**
 * Mime type used to identify Mermaid diagram data in chat output.
 */
const mime = 'text/vnd.mermaid';

export function activate(context: vscode.ExtensionContext) {

	// Register tools
	context.subscriptions.push(
		vscode.lm.registerTool<{ markup: string }>('renderMermaidDiagram', {
			invoke: async (options, _token) => {
				const sourceCode = options.input.markup;
				return writeMermaidToolOutput(sourceCode);
			},
		})
	);

	// Register the chat output renderer for Mermaid diagrams.
	// This will be invoked with the data generated by the tools.
	// It can also be invoked when rendering old Mermaid diagrams in the chat history.
	context.subscriptions.push(
		vscode.chat.registerChatOutputRenderer(viewType, {
			async renderChatOutput({ value }, webview, _ctx, _token) {
				const mermaidSource = new TextDecoder().decode(value);

				// Set the options for the webview
				const mediaRoot = vscode.Uri.joinPath(context.extensionUri, 'chat-webview-out');
				webview.options = {
					enableScripts: true,
					localResourceRoots: [mediaRoot],
				};

				// Set the HTML content for the webview
				const nonce = generateUuid();
				const mermaidScript = vscode.Uri.joinPath(mediaRoot, 'index.js');

				webview.html = `
					<!DOCTYPE html>
					<html lang="en">

					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<title>Mermaid Diagram</title>
						<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src ${webview.cspSource} 'nonce-${nonce}'; style-src 'self' 'unsafe-inline';" />
					</head>

					<body>
						<pre class="mermaid">
							${escapeHtmlText(mermaidSource)}
						</pre>

						<script type="module" nonce="${nonce}" src="${webview.asWebviewUri(mermaidScript)}"></script>
					</body>
					</html>`;
			},
		}));
}


function writeMermaidToolOutput(sourceCode: string): vscode.LanguageModelToolResult {
	// Expose the source code as a tool result for the LM
	const result = new vscode.LanguageModelToolResult([
		new vscode.LanguageModelTextPart(sourceCode)
	]);

	// And store custom data in the tool result details to indicate that a custom renderer should be used for it.
	// In this case we just store the source code as binary data.

	// Add cast to use proposed API
	(result as vscode.ExtendedLanguageModelToolResult2).toolResultDetails2 = {
		mime,
		value: new TextEncoder().encode(sourceCode),
	};

	return result;
}

function escapeHtmlText(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/mermaid-chat-features/src/uuid.ts]---
Location: vscode-main/extensions/mermaid-chat-features/src/uuid.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Copied from src/vs/base/common/uuid.ts
 */
export function generateUuid(): string {
	// use `randomUUID` if possible
	if (typeof crypto.randomUUID === 'function') {
		// see https://developer.mozilla.org/en-US/docs/Web/API/Window/crypto
		// > Although crypto is available on all windows, the returned Crypto object only has one
		// > usable feature in insecure contexts: the getRandomValues() method.
		// > In general, you should use this API only in secure contexts.

		return crypto.randomUUID.bind(crypto)();
	}

	// prep-work
	const _data = new Uint8Array(16);
	const _hex: string[] = [];
	for (let i = 0; i < 256; i++) {
		_hex.push(i.toString(16).padStart(2, '0'));
	}

	// get data
	crypto.getRandomValues(_data);

	// set version bits
	_data[6] = (_data[6] & 0x0f) | 0x40;
	_data[8] = (_data[8] & 0x3f) | 0x80;

	// print as string
	let i = 0;
	let result = '';
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += '-';
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += '-';
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += '-';
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += '-';
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/.npmrc]---
Location: vscode-main/extensions/microsoft-authentication/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/.vscodeignore]---
Location: vscode-main/extensions/microsoft-authentication/.vscodeignore

```text
.vscode/**
.vscode-test/**
out/test/**
out/**
extension.webpack.config.js
package-lock.json
src/**
.gitignore
vsc-extension-quickstart.md
**/tsconfig.json
**/tslint.json
**/*.map
**/*.ts
packageMocks/
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/extension.webpack.config.js]---
Location: vscode-main/extensions/microsoft-authentication/extension.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import withDefaults, { nodePlugins } from '../shared.webpack.config.mjs';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';

const isWindows = process.platform === 'win32';
const isMacOS = process.platform === 'darwin';
const isLinux = !isWindows && !isMacOS;

const windowsArches = ['x64'];
const linuxArches = ['x64'];

let platformFolder;
switch (process.platform) {
	case 'win32':
		platformFolder = 'windows';
		break;
	case 'darwin':
		platformFolder = 'macos';
		break;
	case 'linux':
		platformFolder = 'linux';
		break;
	default:
		throw new Error(`Unsupported platform: ${process.platform}`);
}

const arch = process.env.VSCODE_ARCH || process.arch;
console.log(`Building Microsoft Authentication Extension for ${process.platform} (${arch})`);

const plugins = [...nodePlugins(import.meta.dirname)];
if (
	(isWindows && windowsArches.includes(arch)) ||
	isMacOS ||
	(isLinux && linuxArches.includes(arch))
) {
	plugins.push(new CopyWebpackPlugin({
		patterns: [
			{
				// The native files we need to ship with the extension
				from: `**/dist/${platformFolder}/${arch}/(lib|)msal*.(node|dll|dylib|so)`,
				to: '[name][ext]'
			}
		]
	}));
}

export default withDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/extension.ts'
	},
	externals: {
		// The @azure/msal-node-runtime package requires this native node module (.node).
		// It is currently only included on Windows, but the package handles unsupported platforms
		// gracefully.
		'./msal-node-runtime': 'commonjs ./msal-node-runtime'
	},
	resolve: {
		alias: {
			'keytar': path.resolve(import.meta.dirname, 'packageMocks', 'keytar', 'index.js')
		}
	},
	plugins
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/package-lock.json]---
Location: vscode-main/extensions/microsoft-authentication/package-lock.json

```json
{
  "name": "microsoft-authentication",
  "version": "0.0.1",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "microsoft-authentication",
      "version": "0.0.1",
      "license": "MIT",
      "dependencies": {
        "@azure/ms-rest-azure-env": "^2.0.0",
        "@azure/msal-node": "^3.8.3",
        "@azure/msal-node-extensions": "^1.5.25",
        "@vscode/extension-telemetry": "^0.9.8",
        "keytar": "file:./packageMocks/keytar",
        "vscode-tas-client": "^0.1.84"
      },
      "devDependencies": {
        "@types/node": "22.x",
        "@types/node-fetch": "^2.5.7",
        "@types/randombytes": "^2.0.0",
        "@types/sha.js": "^2.4.0",
        "@types/uuid": "8.0.0"
      },
      "engines": {
        "vscode": "^1.42.0"
      }
    },
    "node_modules/@azure/ms-rest-azure-env": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/@azure/ms-rest-azure-env/-/ms-rest-azure-env-2.0.0.tgz",
      "integrity": "sha512-dG76W7ElfLi+fbTjnZVGj+M9e0BIEJmRxU6fHaUQ12bZBe8EJKYb2GV50YWNaP2uJiVQ5+7nXEVj1VN1UQtaEw=="
    },
    "node_modules/@azure/msal-common": {
      "version": "15.13.2",
      "resolved": "https://registry.npmjs.org/@azure/msal-common/-/msal-common-15.13.2.tgz",
      "integrity": "sha512-cNwUoCk3FF8VQ7Ln/MdcJVIv3sF73/OT86cRH81ECsydh7F4CNfIo2OAx6Cegtg8Yv75x4506wN4q+Emo6erOA==",
      "license": "MIT",
      "engines": {
        "node": ">=0.8.0"
      }
    },
    "node_modules/@azure/msal-node": {
      "version": "3.8.3",
      "resolved": "https://registry.npmjs.org/@azure/msal-node/-/msal-node-3.8.3.tgz",
      "integrity": "sha512-Ul7A4gwmaHzYWj2Z5xBDly/W8JSC1vnKgJ898zPMZr0oSf1ah0tiL15sytjycU/PMhDZAlkWtEL1+MzNMU6uww==",
      "license": "MIT",
      "dependencies": {
        "@azure/msal-common": "15.13.2",
        "jsonwebtoken": "^9.0.0",
        "uuid": "^8.3.0"
      },
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/@azure/msal-node-extensions": {
      "version": "1.5.25",
      "resolved": "https://registry.npmjs.org/@azure/msal-node-extensions/-/msal-node-extensions-1.5.25.tgz",
      "integrity": "sha512-8UtOy6McoHQUbvi75Cx+ftpbTuOB471j4V4yZJmRM3KJ30bMO7forXrVV+/xArvWdgZ9VkBvq26OclFstJUo8Q==",
      "hasInstallScript": true,
      "license": "MIT",
      "dependencies": {
        "@azure/msal-common": "15.13.2",
        "@azure/msal-node-runtime": "^0.20.0",
        "keytar": "^7.8.0"
      },
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/@azure/msal-node-runtime": {
      "version": "0.20.1",
      "resolved": "https://registry.npmjs.org/@azure/msal-node-runtime/-/msal-node-runtime-0.20.1.tgz",
      "integrity": "sha512-WVbMedbJHjt9M+qeZMH/6U1UmjXsKaMB6fN8OZUtGY7UVNYofrowZNx4nVvWN/ajPKBQCEW4Rr/MwcRuA8HGcQ==",
      "hasInstallScript": true,
      "license": "MIT"
    },
    "node_modules/@microsoft/1ds-core-js": {
      "version": "4.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/1ds-core-js/-/1ds-core-js-4.3.4.tgz",
      "integrity": "sha512-3gbDUQgAO8EoyQTNcAEkxpuPnioC0May13P1l1l0NKZ128L9Ts/sj8QsfwCRTjHz0HThlA+4FptcAJXNYUy3rg==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-core-js": "3.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      }
    },
    "node_modules/@microsoft/1ds-post-js": {
      "version": "4.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/1ds-post-js/-/1ds-post-js-4.3.4.tgz",
      "integrity": "sha512-nlKjWricDj0Tn68Dt0P8lX9a+X7LYrqJ6/iSfQwMfDhRIGLqW+wxx8gxS+iGWC/oc8zMQAeiZaemUpCwQcwpRQ==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/1ds-core-js": "4.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      }
    },
    "node_modules/@microsoft/applicationinsights-channel-js": {
      "version": "3.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-channel-js/-/applicationinsights-channel-js-3.3.4.tgz",
      "integrity": "sha512-Z4nrxYwGKP9iyrYtm7iPQXVOFy4FsEsX0nDKkAi96Qpgw+vEh6NH4ORxMMuES0EollBQ3faJyvYCwckuCVIj0g==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-common": "3.3.4",
        "@microsoft/applicationinsights-core-js": "3.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      },
      "peerDependencies": {
        "tslib": ">= 1.0.0"
      }
    },
    "node_modules/@microsoft/applicationinsights-common": {
      "version": "3.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-common/-/applicationinsights-common-3.3.4.tgz",
      "integrity": "sha512-4ms16MlIvcP4WiUPqopifNxcWCcrXQJ2ADAK/75uok2mNQe6ZNRsqb/P+pvhUxc8A5HRlvoXPP1ptDSN5Girgw==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-core-js": "3.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      },
      "peerDependencies": {
        "tslib": ">= 1.0.0"
      }
    },
    "node_modules/@microsoft/applicationinsights-core-js": {
      "version": "3.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-core-js/-/applicationinsights-core-js-3.3.4.tgz",
      "integrity": "sha512-MummANF0mgKIkdvVvfmHQTBliK114IZLRhTL0X0Ep+zjDwWMHqYZgew0nlFKAl6ggu42abPZFK5afpE7qjtYJA==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      },
      "peerDependencies": {
        "tslib": ">= 1.0.0"
      }
    },
    "node_modules/@microsoft/applicationinsights-shims": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-shims/-/applicationinsights-shims-3.0.1.tgz",
      "integrity": "sha512-DKwboF47H1nb33rSUfjqI6ryX29v+2QWcTrRvcQDA32AZr5Ilkr7whOOSsD1aBzwqX0RJEIP1Z81jfE3NBm/Lg==",
      "license": "MIT",
      "dependencies": {
        "@nevware21/ts-utils": ">= 0.9.4 < 2.x"
      }
    },
    "node_modules/@microsoft/applicationinsights-web-basic": {
      "version": "3.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-web-basic/-/applicationinsights-web-basic-3.3.4.tgz",
      "integrity": "sha512-OpEPXr8vU/t/M8T9jvWJzJx/pCyygIiR1nGM/2PTde0wn7anl71Gxl5fWol7K/WwFEORNjkL3CEyWOyDc+28AA==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-channel-js": "3.3.4",
        "@microsoft/applicationinsights-common": "3.3.4",
        "@microsoft/applicationinsights-core-js": "3.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      },
      "peerDependencies": {
        "tslib": ">= 1.0.0"
      }
    },
    "node_modules/@microsoft/dynamicproto-js": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/@microsoft/dynamicproto-js/-/dynamicproto-js-2.0.3.tgz",
      "integrity": "sha512-JTWTU80rMy3mdxOjjpaiDQsTLZ6YSGGqsjURsY6AUQtIj0udlF/jYmhdLZu8693ZIC0T1IwYnFa0+QeiMnziBA==",
      "license": "MIT",
      "dependencies": {
        "@nevware21/ts-utils": ">= 0.10.4 < 2.x"
      }
    },
    "node_modules/@nevware21/ts-async": {
      "version": "0.5.4",
      "resolved": "https://registry.npmjs.org/@nevware21/ts-async/-/ts-async-0.5.4.tgz",
      "integrity": "sha512-IBTyj29GwGlxfzXw2NPnzty+w0Adx61Eze1/lknH/XIVdxtF9UnOpk76tnrHXWa6j84a1RR9hsOcHQPFv9qJjA==",
      "license": "MIT",
      "dependencies": {
        "@nevware21/ts-utils": ">= 0.11.6 < 2.x"
      }
    },
    "node_modules/@nevware21/ts-utils": {
      "version": "0.11.6",
      "resolved": "https://registry.npmjs.org/@nevware21/ts-utils/-/ts-utils-0.11.6.tgz",
      "integrity": "sha512-OUUJTh3fnaUSzg9DEHgv3d7jC+DnPL65mIO7RaR+jWve7+MmcgIvF79gY97DPQ4frH+IpNR78YAYd/dW4gK3kg==",
      "license": "MIT"
    },
    "node_modules/@types/node": {
      "version": "22.13.10",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.13.10.tgz",
      "integrity": "sha512-I6LPUvlRH+O6VRUqYOcMudhaIdUVWfsjnZavnsraHvpBwaEyMN29ry+0UVJhImYL16xsscu0aske3yA+uPOWfw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.20.0"
      }
    },
    "node_modules/@types/node-fetch": {
      "version": "2.5.7",
      "resolved": "https://registry.npmjs.org/@types/node-fetch/-/node-fetch-2.5.7.tgz",
      "integrity": "sha512-o2WVNf5UhWRkxlf6eq+jMZDu7kjgpgJfl4xVNlvryc95O/6F2ld8ztKX+qu+Rjyet93WAWm5LjeX9H5FGkODvw==",
      "dev": true,
      "dependencies": {
        "@types/node": "*",
        "form-data": "^3.0.0"
      }
    },
    "node_modules/@types/randombytes": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/@types/randombytes/-/randombytes-2.0.0.tgz",
      "integrity": "sha512-bz8PhAVlwN72vqefzxa14DKNT8jK/mV66CSjwdVQM/k3Th3EPKfUtdMniwZgMedQTFuywAsfjnZsg+pEnltaMA==",
      "dev": true,
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/sha.js": {
      "version": "2.4.0",
      "resolved": "https://registry.npmjs.org/@types/sha.js/-/sha.js-2.4.0.tgz",
      "integrity": "sha512-amxKgPy6WJTKuw8mpUwjX2BSxuBtBmZfRwIUDIuPJKNwGN8CWDli8JTg5ONTWOtcTkHIstvT7oAhhYXqEjStHQ==",
      "dev": true,
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/uuid": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/@types/uuid/-/uuid-8.0.0.tgz",
      "integrity": "sha512-xSQfNcvOiE5f9dyd4Kzxbof1aTrLobL278pGLKOZI6esGfZ7ts9Ka16CzIN6Y8hFHE1C7jIBZokULhK1bOgjRw==",
      "dev": true
    },
    "node_modules/@vscode/extension-telemetry": {
      "version": "0.9.8",
      "resolved": "https://registry.npmjs.org/@vscode/extension-telemetry/-/extension-telemetry-0.9.8.tgz",
      "integrity": "sha512-7YcKoUvmHlIB8QYCE4FNzt3ErHi9gQPhdCM3ZWtpw1bxPT0I+lMdx52KHlzTNoJzQ2NvMX7HyzyDwBEiMgTrWQ==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/1ds-core-js": "^4.3.4",
        "@microsoft/1ds-post-js": "^4.3.4",
        "@microsoft/applicationinsights-web-basic": "^3.3.4"
      },
      "engines": {
        "vscode": "^1.75.0"
      }
    },
    "node_modules/asynckit": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/asynckit/-/asynckit-0.4.0.tgz",
      "integrity": "sha1-x57Zf380y48robyXkLzDZkdLS3k= sha512-Oei9OH4tRh0YqU3GxhX79dM/mwVgvbZJaSNaRk+bshkj0S5cfHcgYakreBjrHwatXKbz+IoIdYLxrKim2MjW0Q==",
      "dev": true
    },
    "node_modules/buffer-equal-constant-time": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/buffer-equal-constant-time/-/buffer-equal-constant-time-1.0.1.tgz",
      "integrity": "sha512-zRpUiDwd/xk6ADqPMATG8vc9VPrkck7T07OIx0gnjmJAnHnTVXNQG3vfvWNuiZIkwu9KrKdA1iJKfsfTVxE6NA==",
      "license": "BSD-3-Clause"
    },
    "node_modules/call-bind-apply-helpers": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
      "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/combined-stream": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/combined-stream/-/combined-stream-1.0.8.tgz",
      "integrity": "sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==",
      "dev": true,
      "dependencies": {
        "delayed-stream": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/delayed-stream": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/delayed-stream/-/delayed-stream-1.0.0.tgz",
      "integrity": "sha1-3zrhmayt+31ECqrgsp4icrJOxhk= sha512-ZySD7Nf91aLB0RxL4KGrKHBXl7Eds1DAmEdcoVawXnLD7SDhpNgtuII2aAkg7a7QS41jxPSZ17p4VdGnMHk3MQ==",
      "dev": true,
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/dunder-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
      "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.1",
        "es-errors": "^1.3.0",
        "gopd": "^1.2.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/ecdsa-sig-formatter": {
      "version": "1.0.11",
      "resolved": "https://registry.npmjs.org/ecdsa-sig-formatter/-/ecdsa-sig-formatter-1.0.11.tgz",
      "integrity": "sha512-nagl3RYrbNv6kQkeJIpt6NJZy8twLB/2vtz6yN9Z4vRKHN4/QZJIEbqohALSgwKdnksuY3k5Addp5lg8sVoVcQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "safe-buffer": "^5.0.1"
      }
    },
    "node_modules/es-define-property": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
      "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-object-atoms": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.1.tgz",
      "integrity": "sha512-FGgH2h8zKNim9ljj7dankFPcICIK9Cp5bm+c2gQSYePhpaG5+esrLODihIorn+Pe6FGJzWhXQotPv73jTaldXA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-set-tostringtag": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/es-set-tostringtag/-/es-set-tostringtag-2.1.0.tgz",
      "integrity": "sha512-j6vWzfrGVfyXxge+O0x5sh6cvxAog0a/4Rdd2K36zCMV5eJ+/+tOAngRO8cODMNWbVRdVlmGZQL2YS3yR8bIUA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.6",
        "has-tostringtag": "^1.0.2",
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/form-data": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/form-data/-/form-data-3.0.4.tgz",
      "integrity": "sha512-f0cRzm6dkyVYV3nPoooP8XlccPQukegwhAnpoLcXy+X+A8KfpGOoXwDr9FLZd3wzgLaBGQBE3lY93Zm/i1JvIQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "asynckit": "^0.4.0",
        "combined-stream": "^1.0.8",
        "es-set-tostringtag": "^2.1.0",
        "hasown": "^2.0.2",
        "mime-types": "^2.1.35"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-intrinsic": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
      "integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "function-bind": "^1.1.2",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
      "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/gopd": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
      "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-symbols": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
      "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-tostringtag": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/has-tostringtag/-/has-tostringtag-1.0.2.tgz",
      "integrity": "sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-symbols": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.2.tgz",
      "integrity": "sha512-0hJU9SCPvmMzIBdZFqNPXWa6dqh7WdH0cII9y+CyS8rG3nL48Bclra9HmKhVVUHyPWNH5Y7xDwAB7bfgSjkUMQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/jsonwebtoken": {
      "version": "9.0.2",
      "resolved": "https://registry.npmjs.org/jsonwebtoken/-/jsonwebtoken-9.0.2.tgz",
      "integrity": "sha512-PRp66vJ865SSqOlgqS8hujT5U4AOgMfhrwYIuIhfKaoSCZcirrmASQr8CX7cUg+RMih+hgznrjp99o+W4pJLHQ==",
      "dependencies": {
        "jws": "^3.2.2",
        "lodash.includes": "^4.3.0",
        "lodash.isboolean": "^3.0.3",
        "lodash.isinteger": "^4.0.4",
        "lodash.isnumber": "^3.0.3",
        "lodash.isplainobject": "^4.0.6",
        "lodash.isstring": "^4.0.1",
        "lodash.once": "^4.0.0",
        "ms": "^2.1.1",
        "semver": "^7.5.4"
      },
      "engines": {
        "node": ">=12",
        "npm": ">=6"
      }
    },
    "node_modules/jwa": {
      "version": "1.4.2",
      "resolved": "https://registry.npmjs.org/jwa/-/jwa-1.4.2.tgz",
      "integrity": "sha512-eeH5JO+21J78qMvTIDdBXidBd6nG2kZjg5Ohz/1fpa28Z4CcsWUzJ1ZZyFq/3z3N17aZy+ZuBoHljASbL1WfOw==",
      "license": "MIT",
      "dependencies": {
        "buffer-equal-constant-time": "^1.0.1",
        "ecdsa-sig-formatter": "1.0.11",
        "safe-buffer": "^5.0.1"
      }
    },
    "node_modules/jws": {
      "version": "3.2.3",
      "resolved": "https://registry.npmjs.org/jws/-/jws-3.2.3.tgz",
      "integrity": "sha512-byiJ0FLRdLdSVSReO/U4E7RoEyOCKnEnEPMjq3HxWtvzLsV08/i5RQKsFVNkCldrCaPr2vDNAOMsfs8T/Hze7g==",
      "license": "MIT",
      "dependencies": {
        "jwa": "^1.4.2",
        "safe-buffer": "^5.0.1"
      }
    },
    "node_modules/keytar": {
      "resolved": "packageMocks/keytar",
      "link": true
    },
    "node_modules/lodash.includes": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/lodash.includes/-/lodash.includes-4.3.0.tgz",
      "integrity": "sha512-W3Bx6mdkRTGtlJISOvVD/lbqjTlPPUDTMnlXZFnVwi9NKJ6tiAk6LVdlhZMm17VZisqhKcgzpO5Wz91PCt5b0w=="
    },
    "node_modules/lodash.isboolean": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/lodash.isboolean/-/lodash.isboolean-3.0.3.tgz",
      "integrity": "sha512-Bz5mupy2SVbPHURB98VAcw+aHh4vRV5IPNhILUCsOzRmsTmSQ17jIuqopAentWoehktxGd9e/hbIXq980/1QJg=="
    },
    "node_modules/lodash.isinteger": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/lodash.isinteger/-/lodash.isinteger-4.0.4.tgz",
      "integrity": "sha512-DBwtEWN2caHQ9/imiNeEA5ys1JoRtRfY3d7V9wkqtbycnAmTvRRmbHKDV4a0EYc678/dia0jrte4tjYwVBaZUA=="
    },
    "node_modules/lodash.isnumber": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/lodash.isnumber/-/lodash.isnumber-3.0.3.tgz",
      "integrity": "sha512-QYqzpfwO3/CWf3XP+Z+tkQsfaLL/EnUlXWVkIk5FUPc4sBdTehEqZONuyRt2P67PXAk+NXmTBcc97zw9t1FQrw=="
    },
    "node_modules/lodash.isplainobject": {
      "version": "4.0.6",
      "resolved": "https://registry.npmjs.org/lodash.isplainobject/-/lodash.isplainobject-4.0.6.tgz",
      "integrity": "sha512-oSXzaWypCMHkPC3NvBEaPHf0KsA5mvPrOPgQWDsbg8n7orZ290M0BmC/jgRZ4vcJ6DTAhjrsSYgdsW/F+MFOBA=="
    },
    "node_modules/lodash.isstring": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/lodash.isstring/-/lodash.isstring-4.0.1.tgz",
      "integrity": "sha512-0wJxfxH1wgO3GrbuP+dTTk7op+6L41QCXbGINEmD+ny/G/eCqGzxyCsh7159S+mgDDcoarnBw6PC1PS5+wUGgw=="
    },
    "node_modules/lodash.once": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/lodash.once/-/lodash.once-4.1.1.tgz",
      "integrity": "sha512-Sb487aTOCr9drQVL8pIxOzVhafOjZN9UU54hiN8PU3uAiSV7lx1yYNpbNmex2PK6dSJoNTSJUUswT651yww3Mg=="
    },
    "node_modules/math-intrinsics": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
      "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/mime-db": {
      "version": "1.52.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
      "integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime-types": {
      "version": "2.1.35",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
      "integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "mime-db": "1.52.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA=="
    },
    "node_modules/packageMocks/keytar": {
      "extraneous": true
    },
    "node_modules/safe-buffer": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.2.1.tgz",
      "integrity": "sha512-rp3So07KcdmmKbGvgaNxQSJr7bGVSVk5S9Eq1F+ppbRo70+YeaDxkw5Dd8NPN+GD6bjnYm2VuPuCXmpuYvmCXQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/semver": {
      "version": "7.6.2",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.6.2.tgz",
      "integrity": "sha512-FNAIBWCx9qcRhoHcgcJ0gvU7SN1lYU2ZXuSfl04bSC5OpvDHFyJCjdNHomPXxjQlCBU67YW64PzY7/VIEH7F2w==",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/tas-client": {
      "version": "0.2.33",
      "resolved": "https://registry.npmjs.org/tas-client/-/tas-client-0.2.33.tgz",
      "integrity": "sha512-V+uqV66BOQnWxvI6HjDnE4VkInmYZUQ4dgB7gzaDyFyFSK1i1nF/j7DpS9UbQAgV9NaF1XpcyuavnM1qOeiEIg=="
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/uuid": {
      "version": "8.3.2",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-8.3.2.tgz",
      "integrity": "sha512-+NYs2QeMWy+GWFOEm9xnn6HCDp0l7QBD7ml8zLUmJ+93Q5NF0NocErnwkTkXVFNiX3/fpC6afS8Dhb/gz7R7eg==",
      "bin": {
        "uuid": "dist/bin/uuid"
      }
    },
    "node_modules/vscode-tas-client": {
      "version": "0.1.84",
      "resolved": "https://registry.npmjs.org/vscode-tas-client/-/vscode-tas-client-0.1.84.tgz",
      "integrity": "sha512-rUTrUopV+70hvx1hW5ebdw1nd6djxubkLvVxjGdyD/r5v/wcVF41LIfiAtbm5qLZDtQdsMH1IaCuDoluoIa88w==",
      "dependencies": {
        "tas-client": "0.2.33"
      },
      "engines": {
        "vscode": "^1.85.0"
      }
    },
    "packageMocks/keytar": {
      "version": "7.9.0"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/package.json]---
Location: vscode-main/extensions/microsoft-authentication/package.json

```json
{
  "name": "microsoft-authentication",
  "publisher": "vscode",
  "license": "MIT",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "0.0.1",
  "engines": {
    "vscode": "^1.42.0"
  },
  "icon": "media/icon.png",
  "categories": [
    "Other"
  ],
  "activationEvents": [],
  "enabledApiProposals": [
    "nativeWindowHandle",
    "authIssuers",
    "authenticationChallenges"
  ],
  "capabilities": {
    "virtualWorkspaces": true,
    "untrustedWorkspaces": {
      "supported": true
    }
  },
  "extensionKind": [
    "ui",
    "workspace"
  ],
  "contributes": {
    "authentication": [
      {
        "label": "Microsoft",
        "id": "microsoft",
        "authorizationServerGlobs": [
          "https://login.microsoftonline.com/*",
          "https://login.microsoftonline.com/*/v2.0"
        ]
      },
      {
        "label": "Microsoft Sovereign Cloud",
        "id": "microsoft-sovereign-cloud"
      }
    ],
    "configuration": [
      {
        "title": "Microsoft Sovereign Cloud",
        "properties": {
          "microsoft-sovereign-cloud.environment": {
            "type": "string",
            "markdownDescription": "%microsoft-sovereign-cloud.environment.description%",
            "enum": [
              "ChinaCloud",
              "USGovernment",
              "custom"
            ],
            "enumDescriptions": [
              "%microsoft-sovereign-cloud.environment.enumDescriptions.AzureChinaCloud%",
              "%microsoft-sovereign-cloud.environment.enumDescriptions.AzureUSGovernment%",
              "%microsoft-sovereign-cloud.environment.enumDescriptions.custom%"
            ]
          },
          "microsoft-sovereign-cloud.customEnvironment": {
            "type": "object",
            "additionalProperties": true,
            "markdownDescription": "%microsoft-sovereign-cloud.customEnvironment.description%",
            "properties": {
              "name": {
                "type": "string",
                "description": "%microsoft-sovereign-cloud.customEnvironment.name.description%"
              },
              "portalUrl": {
                "type": "string",
                "description": "%microsoft-sovereign-cloud.customEnvironment.portalUrl.description%"
              },
              "managementEndpointUrl": {
                "type": "string",
                "description": "%microsoft-sovereign-cloud.customEnvironment.managementEndpointUrl.description%"
              },
              "resourceManagerEndpointUrl": {
                "type": "string",
                "description": "%microsoft-sovereign-cloud.customEnvironment.resourceManagerEndpointUrl.description%"
              },
              "activeDirectoryEndpointUrl": {
                "type": "string",
                "description": "%microsoft-sovereign-cloud.customEnvironment.activeDirectoryEndpointUrl.description%"
              },
              "activeDirectoryResourceId": {
                "type": "string",
                "description": "%microsoft-sovereign-cloud.customEnvironment.activeDirectoryResourceId.description%"
              }
            },
            "required": [
              "name",
              "portalUrl",
              "managementEndpointUrl",
              "resourceManagerEndpointUrl",
              "activeDirectoryEndpointUrl",
              "activeDirectoryResourceId"
            ]
          }
        }
      },
      {
        "title": "Microsoft",
        "properties": {
          "microsoft-authentication.implementation": {
            "type": "string",
            "default": "msal",
            "enum": [
              "msal",
              "msal-no-broker"
            ],
            "enumDescriptions": [
              "%microsoft-authentication.implementation.enumDescriptions.msal%",
              "%microsoft-authentication.implementation.enumDescriptions.msal-no-broker%"
            ],
            "markdownDescription": "%microsoft-authentication.implementation.description%",
            "tags": [
              "onExP"
            ]
          }
        }
      }
    ]
  },
  "aiKey": "0c6ae279ed8443289764825290e4f9e2-1a736e7c-1324-4338-be46-fc2a58ae4d14-7255",
  "main": "./out/extension.js",
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "gulp compile-extension:microsoft-authentication",
    "watch": "gulp watch-extension:microsoft-authentication"
  },
  "devDependencies": {
    "@types/node": "22.x",
    "@types/node-fetch": "^2.5.7",
    "@types/randombytes": "^2.0.0",
    "@types/sha.js": "^2.4.0",
    "@types/uuid": "8.0.0"
  },
  "dependencies": {
    "@azure/ms-rest-azure-env": "^2.0.0",
    "@azure/msal-node": "^3.8.3",
    "@azure/msal-node-extensions": "^1.5.25",
    "@vscode/extension-telemetry": "^0.9.8",
    "keytar": "file:./packageMocks/keytar",
    "vscode-tas-client": "^0.1.84"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/package.nls.json]---
Location: vscode-main/extensions/microsoft-authentication/package.nls.json

```json
{
	"displayName": "Microsoft Account",
	"description": "Microsoft authentication provider",
	"signIn": "Sign In",
	"signOut": "Sign Out",
	"microsoft-authentication.implementation.description": "The authentication implementation to use for signing in with a Microsoft account.",
	"microsoft-authentication.implementation.enumDescriptions.msal": "Use the Microsoft Authentication Library (MSAL) to sign in with a Microsoft account.",
	"microsoft-authentication.implementation.enumDescriptions.msal-no-broker": "Use the Microsoft Authentication Library (MSAL) to sign in with a Microsoft account using a browser. This is useful if you are having issues with the native broker.",
	"microsoft-sovereign-cloud.environment.description": {
		"message": "The Sovereign Cloud to use for authentication. If you select `custom`, you must also set the `#microsoft-sovereign-cloud.customEnvironment#` setting.",
		"comment": [
			"{Locked='`#microsoft-sovereign-cloud.customEnvironment#`'}",
			"The `#microsoft-sovereign-cloud.customEnvironment#` syntax will turn into a link. Do not translate it."
		]
	},
	"microsoft-sovereign-cloud.environment.enumDescriptions.AzureChinaCloud": "Azure China",
	"microsoft-sovereign-cloud.environment.enumDescriptions.AzureUSGovernment": "Azure US Government",
	"microsoft-sovereign-cloud.environment.enumDescriptions.custom": "A custom Microsoft Sovereign Cloud",
	"microsoft-sovereign-cloud.customEnvironment.description": {
		"message": "The custom configuration for the Sovereign Cloud to use with the Microsoft Sovereign Cloud authentication provider. This along with setting `#microsoft-sovereign-cloud.environment#` to `custom` is required to use this feature.",
		"comment": [
			"{Locked='`#microsoft-sovereign-cloud.environment#`'}",
			"The `#microsoft-sovereign-cloud.environment#` syntax will turn into a link. Do not translate it."
		]
	},
	"microsoft-sovereign-cloud.customEnvironment.name.description": "The name of the custom Sovereign Cloud.",
	"microsoft-sovereign-cloud.customEnvironment.portalUrl.description": "The portal URL for the custom Sovereign Cloud.",
	"microsoft-sovereign-cloud.customEnvironment.managementEndpointUrl.description": "The management endpoint for the custom Sovereign Cloud.",
	"microsoft-sovereign-cloud.customEnvironment.resourceManagerEndpointUrl.description": "The resource manager endpoint for the custom Sovereign Cloud.",
	"microsoft-sovereign-cloud.customEnvironment.activeDirectoryEndpointUrl.description": "The Active Directory endpoint for the custom Sovereign Cloud.",
	"microsoft-sovereign-cloud.customEnvironment.activeDirectoryResourceId.description": "The Active Directory resource ID for the custom Sovereign Cloud."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/README.md]---
Location: vscode-main/extensions/microsoft-authentication/README.md

```markdown
# Microsoft Authentication for Visual Studio Code

**Notice:** This extension is bundled with Visual Studio Code. It can be disabled but not uninstalled.

## Features

This extension provides support for authenticating to Microsoft. It registers the `microsoft` Authentication Provider that can be leveraged by other extensions. This also provides the Microsoft authentication used by Settings Sync.

Additionally, it provides the `microsoft-sovereign-cloud` Authentication Provider that can be used to sign in to other Azure clouds like Azure for US Government or Azure China. Use the setting `microsoft-sovereign-cloud.endpoint` to select the authentication endpoint the provider should use. Please note that different scopes may also be required in different environments.
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/tsconfig.json]---
Location: vscode-main/extensions/microsoft-authentication/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"noFallthroughCasesInSwitch": true,
		"noUnusedLocals": false,
		"skipLibCheck": true
	},
	"include": [
		"src/**/*",
		"../../src/vscode-dts/vscode.d.ts",
		"../../src/vscode-dts/vscode.proposed.nativeWindowHandle.d.ts",
		"../../src/vscode-dts/vscode.proposed.authIssuers.d.ts",
		"../../src/vscode-dts/vscode.proposed.authenticationChallenges.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/media/auth.css]---
Location: vscode-main/extensions/microsoft-authentication/media/auth.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

html {
	height: 100%;
}

body {
	box-sizing: border-box;
	min-height: 100%;
	margin: 0;
	padding: 15px 30px;
	display: flex;
	flex-direction: column;
	color: white;
	font-family: "Segoe UI","Helvetica Neue","Helvetica",Arial,sans-serif;
	background-color: #2C2C32;
}

.branding {
	background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAhGVYSWZNTQAqAAAACAAFARIAAwAAAAEAAQAAARoABQAAAAEAAABKARsABQAAAAEAAABSASgAAwAAAAEAAgAAh2kABAAAAAEAAABaAAAAAAAAAEgAAAABAAAASAAAAAEAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAlqADAAQAAAABAAAAlgAAAADkcSUjAAAACXBIWXMAAAsTAAALEwEAmpwYAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAAxaElEQVR4Ae19CbgdRbXu6j2cecoECTIkICCGzAg+7qeQ9544QFQgiXpVEJTEe59ALsbMwE5AMZCQELgKeSoqDlyiQogCSUAC6FNCQhIwQMALCbNMGc68p37/v7prnz47++yzzzl76OCu851d3dXV1VXVf69atWqtVZaUg397IPJwSCKT46zgx16wh+19XSYnO6PjE7H4MDuZ7BSxXhQJ/On5KTWbTSMm3bYlvHXmJNxj2SatFLFVioeWn5lDDwAgMvOU2NG/3DMo2h691rLtr4bqBtVX1NVJRUOVBIIiyYSI3RkXO9q5NZmU5S98tu7XpmQF2AwAzCoNwMrAMm/CT3HkrgqJTI/KwodOD4ZDa5MVdUPtfe+KxONKiSob6+SIE46XqsYGK5FIBoLVtQEJiSRaWp+xktaNuzpqfirTLcBOZNJtdnjrDCk6wMrA8hOgWJcZoFSrT4nJogfPESu4Dv8AVLTTEqsC9MkSDHB2NIYfkZGnjJOqpiZQrkTCAmWyKqtDgXBAEs0tLyZtWRl7953/u/uiUR0sVgH2xuKERCJJnhc6lIFV6B7OuXyAJrIpqDzVlQ99TUKVt0scAEomQaXskBAONlEFrgpvLdkZk6r6Wjn6IxMx2qVeY0IsSVrhqnCgMiiJA62v4a5Vkmz/4a7PDWtmVXSIfGMSAGYVFGCpGvGh5VCiHohEAiJXi77sKx+eLZU1N0hHCyuTAJCCDqCAKIUCYxv4AcY6YnL0qeOkZuhQSeoo6b5OG+AC4ZJQRThQFQbAWt7Bvf8ZSNg3P3deA8ZUF2AzADCrMAArA4u9XMoQsQMp6nHlH5dKdcMcad+fJGVCCKRAxfMU1XKB1dYpI8acKI0jj5FkDNSti3LpzSgjCQQmrFA4HKiuIMAO2EnrtkBb+8pdXxr2OjOd+bAd2vQ2cro8mXPjwH/LwBp4H/a/hLvuCsr06cpky6KHfiK1jRdJ235M80ClABMtmMMfKJQDNB4j1VCstg4ZcTKANWpkZmCxAJZiABYIhgO1VRwi21HGj63OxI27pje9xGz5BlgZWOzVUgSPjEqufOheqWmcIq37YwBCWKsDDGlQULnAUh6L4CLFAh/fCmCNOSE7sNxi3IilxiUQCAdrayR+oCWBcn4q0eSy56c2PMc80+6yg2t4MEAKVgYWO7HYwcz8Ig9XSTz5kNQ0nC7tB6KoBmZ+bnAZdaVUhIMHVDxWQtQCYI3thWKZ8rrHLICiCwCslmIKFGn/GoPm9S+cW7ddswJgZw4Ta9NkC/n6HsrA6nufDewOV/Ap8x8cggHvMUztTpLO5igkCV2g4hMIJI3dY56mqBdwgXOlWP0DlhbNkhVgtoQDELza7Z1iJ2J3J2P2DX8/r+Evmsm2A2dukkBfAYbZSDkUrQco+IQ0XeY9eKwEraekovYkzP4OBhUrlGLEXYB1q6QnzXPYLUtuJ5SLcei1k62tMYDKDtTWnRusrf5/J9zbcv9xa5snc9aooLJti3xYbsVy1lEOxekBI01f8NBECVnbJVx1hHS2YSrnGf4y1SQTwAyYTJzpvr6lAWA2AWYlW1vidrQjGait/VS4pvaPx9/bvOn43+4/GwCzDcAoC0P+rKNd1ot9q1s5d489YIa/BQ9+Ap/yAxKsgJSJ8gGXUc94I1BD4Og/j91zDodYGFTmvf88VsYnpiWSt7ICNXWcoQoo2uNJ217298/X/8bky7ZcVKZYppcKE0OaDg0FDn9XPfwFCYc3YEYGUEUpTQeFUNTgyZniDBUyfJdecu9hVJjAYS+YbGuJ8z9QXXNaqL5uzQlrm3d88O79X+Ujt860MIu17ExDZJliFealkMJYMn1NQNZATnXlQ9+ScPXNEm3H02zKrZQK9PpoxQ5+PBJ3pVwqbkBJpFhjPiSNx47sWY7V60Nyy4BaQDQhdqCyJgRWX5LNLbuA8xUfaKz7sTtEkkhhMuBoU5QpVm792rdclKbzkyWoFj64WCrrAKo2SNMxhukSjb4CvoZe/pGBebyfP88ZTNx14KQX6BdV4McQSna2JZItLXGrsurEUEPdra8daPnv43934CIy+Qoqth2hDKx8v4hpkKbrAi++3AUbf4AlmqukvTmuiytgWfr3OBdg/bs533cpwMDgJ6BFEQtUVB4dGlz/kxPuab5TH8S2A1z9bGi+6/o+KY/8FKkUw6KH/ktqm/4Ngk8y6UHltvVCH39IrQx1SsXmoI9l5Tc72xS2Y50AWGtnaEjdF46/p3mtPuJqqmOUQ356YMZtYai8xITrfzsGb4Dg8392W6IZ8FOygImXslwe8KOzF0Dti2D8vZbO0KC6z37wdwfm/d2yvu8dvbPfXr7acw8YcULkrw0Sa34EoBovHZCmq3Jez7dlvwKkGMCoqIHn+E8tQtse5n1UwZn37HXVq0nOeO14sj0Ws44tD4U59FjWLEaaPue+IyXWskMqa11QUfCZQgaK6OtxhqeaIkpInjLUyiRBjJKMhRrrqkOh5IXlodB0S3/ilDR9/cngyx+RcOVg6WjtXZqe67OUUqVnJroQsgu+nTzF/oXUlsIUTIk/WaZY/e18A6r5D34MXbkV0vTBEoVKZ1Zpen8flv2+FCHLnq0YV4N2Zwcwb48pU6z+dDfVXiKnRKGh8HksJt+tIp44penZlmj68yBzD6DjRQ8pmQbwWR4u2aSau0oQg2JRT9EaUqZYfep9vEaKFGhFs2DDN6Si8m594Yk4RQyF+0gVMRlgwyTzb9qRIZu51C02+Uzc7WLaSS55eIvJh1WHwnVGWt0O+VM1eFgMg4dIXBY8OF+qar8HlRd0JciHRRutEoXUy/Q836R5kjIemnwmzpjJTcwlD7O6+crAytaZ5ppK013B5/wNy6W6/goIPkmlMBD1V5puCu8h5gs66GV6E7zHPZRRsmSrgOS7ZI3K84O9Bg/zN/wcuulfVYMHZ+3Mw+Hk+bmmuHT8pPgrZki/aG4qfVymWNneAfmp6Y5TDpm34T6s+306v9L0bA/ntSzAMZdK45qht4qXKVaPPeTM/GISWVcjnZV/xPB3mho8WL1ofPZY4AAuGHmWAZMpKv3cpPsgLlOsTC/BLNHMXn+YRAOPglE/ERoK3a1oMt1XrDQdDsne4YEEl/kv1vOzPcetUxlY6Z3kLNFEZdGG42Gk/hh00w9Xg4fedNPTy8n7OdBjgKRl+5RcudUqy7G8ADDS9DkPnApQbYNjjsOlsz1/SzTeZ/V2bKiQiZk/HUvp572VWcTrfaNYVLddvTUkgyYl5Rk2c1NARtRbUkIHX3nrKyNNn/fgp6BCcL8E0DUxuHShNL3ULzBFqVCR1KwwlZi3LshnQbkDizMkS61i2dkmqDa2zMQpr7tuDc3FQyOmNH0TtD4hTZ97/1ckFLxDEniBCbpvUZMofzQjHdzp5/6oZaoWuQHLMLOrXmgQO34hvugzUMJgfMnvIH5I9rXfgRfTJpqv9P4vU63r7cAYPESmx2X+A7NgQLoCtn68q7BLNL3VK3U9DT1pp6lsPjzoBVj8mqFWSzOfW549B7ZwP4W67RB1fgm7ACh24T84DZTsKlm2/WKZOX499Z1l512OdYoPG5yqkho8qBAoIXMf+K5UNiyAch4axbdXwiWaVAU9BwZQqdHPJCAPD82/55aSHbp17BlY/JrXQLVmOoa/VTtnSqjqVuFI2LI3itkJmX6nCLrICVceIRVVD8iNTy2RK6yrtVGGypWshVke7Bg8kCqJzF2/Gk45LoGMynEf5HGPl6WEIl/yAIlPTjstcmWyP86tW+ZZoWvCo65sbvrblVLVcCuGCFtiUb6MCjQshH/oOquAtQJMbgKzp6TUD7lKVjy9Ua57bJAaaUZ2dnd0kb1KxblKXtAYPMxd/zss0VwibTB4sEGlaF7sl8AXZP61TjhxX1qqirYO2alTPx0c3JHetbGbdq6SmqZLpXUfAEUnAo7NWA8NYLNjkFBXQJj4NpxkTpMrJj6ixgXPTLNTXut6uLkoyTR4WD0zpg5kB7+3EbrpZ6g0veQyqh5abyTuRBSP1dsM8iYwnMBTn91ph4afdKw0jDrWtqForq+oh6KKmWyDoegOLO/MbuXOO6V20BekdS9ngRwyu+ftsaZ2DPIfmI8je7Rtvlwx9vuatdRDo/FJNe/3gzDZg8FD3RjH4KE/SzTsinTy0WOH9OFCWrl8hD4GPwZYSSj/wmzBqm2y7Ff23H7cZ856Lzxk6LfjLc30nFw69R1PKwmsrqGQL57iAg6DK3c+CCadoOIyhnoh8dzXy6EVhvvohMQ7bQyN18mNf1sHUURdSYdGCj6pnDd349H4RmDwUD0AULH5hQBVT+WaZwF0YEYkGA5KKGRZrfsWyS++fHGgtvofYEpArArjpLaXl93jZYd5N9SE4oTkM5vAd0yQln1k0vvLI/HLsZXa1TbCX7n1nNyw43z5zujHBZ7iVLhaYHfQqRYbafrcB8ZhDHkEk5BG6YD7oP63LVV04Q8AKhIxGuZjsAOVBZtx4C1JJKYmb/78Y/r8aKLKrsYR1A0NBAtfryxPcIkuPPbajjeUVTuOhBcUfM11E6Aa4iy4sqb9/4fPJVCvNrhADFd+QCqr/irLd8zSCYFjht3zjDRLvft0SakwdniYd/+ZuG+LhMKNKk03fj77VFiJMiuDjnGwuoG860a4ED1RAKojbttSwxrB7zYGHuc1MS55AF4IGUjLIUO46RksuNp/lYpqmC/Bw1x+mVln1mhB07Ju6AoMjf8iL738FTy3UzhrjIzm8/IfyKjTfdCc+6bC1eYa/Z7jMcfggS33BsPamDjTtfQ0c55eFtO95XiPzT0m5jUGU0Z6XhvyQ3g6ViXVtr2LZeWUiOZH2044YVL0dT3x5w8oFhys2rIeqiEwX2rPN6hMqx0n+G37YuDdpsqoY56V67eNV1DphCHSxeuZO/obU/7GMjn7m/PANyFNX6MC3XiCzvgpJjk4mDQTe3P0lMb0TNd4rzfde+wt1+TzXk8d66gWxUYC8P4f2yvtLWfJjQAV9e7JA7NtPg8haTzsPzD7GyUt72GbMqksYH35PWJoxDBbUTUK85ptsvypb8q3x96mz/TOSPtbCTV4wGvlJGTu+kWwSr7GFwYPfWoP51RoA4e+1n2PSqdMlZs/97aKSCKngOJGUvDrXiyTDQnsfqX4Z7bOCqc6DsHwNRcnYGjsgJQbHVE3+FZZ/vQdcC7u7CGDnar6XQUtI+L4aJpz/01gdK8BTwL5Gx9Egwd2vJ//teUY+kIBsCRBgGqpLPvMGXLzZxxQcVbrNCCti5wFBCfRL+2juMGW0QoseAzRd8D30O2fzUlP6+nc5DWxN583jUMSCm2Dw/y6QV+R007aKUu3nqRrkpxMcDjrS6BQ10jT59z/K6luvAyg4syPQ6wLqr4UWIq8Nih5NYe+Vuk48FmAap72Az8YB1Q9VwrdfNA3w9wm3RybOD2d5yakX2N6+nWTZtLNPeYc17lXC10yp93NcxM8uU1Sj7HJa2JvRm+aHjueelsh1qiqOREzx7/Jsh0X6mSC7gY5NOYSyKRz2xC24zv3rccQ8iXsRYOv2/ECnEsRpc2jQ19ch77Ols0ST5woy6as06GPn5f5YLJV0tu1Jp83zRybuKc83uvm2Bt7jzOVwTTmwT9dGu6ERS+TvDSV58UKFViH5EaNAfB6PwXftVofTD6J4oJsQaXpYGRnr6+V79y/GUs0ZykPR9/lbgN9G7NdNjeoDGLoqw2h3jfJDWefJiumvJbaszBX0VTf6Hu2Hs3bNQwT1m+kgiIRiB1KFSxYZFNLghoGdYMvkRuf3iHXbzlOxQUEV6ahcZorTZ/1wAjoiO3AyzkFwx+c8XORHKjiv5+DLRz6sA8h9nZuOzBdbvjMLK1uLkOfn9vl1g3A2r8CM8I9mEFV4qU4MiXvOzHH3th7zIK85+nH5rynfCYdW2ugnJBK/Ctrx0qw6hm5fvsXFFwcGimxN4HS9DUQfH573YfwPTwFg4fjpJM7PKjmhcnlV3Bx1ucOfe07xI6dJDees0Y4pNPFRy5DX1cLfXsUkCtOxxZjyU/Br9M+fEFUiekClwFFeszmpKeZc+8102xeM9dNbPJ5z538FbrkEghWQOZ1pyx7apUmczcqUi/VTQeoZq37H3g9T8J90FDpgMGDoVR8kLdMf1EuZ8ivqgthdWO1LPv0eFn22ZecoY+yKX+syjivYWC/kLxjFjYba3k37RwHbYQ/gU85qgDS977WMgyhZhL1SGJovFSWPf1ReIs7T2aOe1ULunTt2Vgp+L0EQcSiEF1YWDqiSoluDwKGg++HE0vDexhwmfO+1iYv+S0ubVHUksTQ9zVZfvYdWqzK71SU0L+nOFIv517vB9W/0gZ+l9vHkOSCtyIluHz0yxK1x0GV5GmdoeCVDfwpAyqBogJ82Zg1Vtd/RIKBF8B7nSUX/OJf4drz90qVYjHOBimecKgUY90ShOfuMaJU8B6nEgt+gFePpZlqLCBH25/DBzNaQUVAkXfMhwEK21Wath3ceW5d+PIkxSTPH7tXmk+eiOn6I1Dwo2ZDqcHF2nHxNY79jaskWLleRh33S2irQqVQfVIFHSDh3XHWrpQJLdPGeWMee/9ZbFECJkSY7VbVYcWh+eey7AmAaspz+iETUO4uDgOuSUkpcebad8mKuGCrZFlnh2fKsr/9FtP/86TNVfSDWkbmIoqQylljPEaib0lTExaGwra8/lpQosB9GE1QIOEqPxPW0tSUMa9pwEnqnIkmk3s5/1EUCo8V0E0TiBJmyvJzVusj2Mfs6/d5cCiWaSS/IkqxGWaffD70qWBoMIgyIcq4Uq9Irxfzx3myA5t43JKamoCMHClSXw+aSlkoMpihzwyFhKFJ1/vdPE5ZXdfy3Q5oTqFI6E5BRTvW8SK2lx+voNKPNgLWA338TxC6A4sNphRbjSkw/s8+eaa07fsurFhI2dhhfF2lDWTQoaggQVTpA0eJHHY4XiPOwetrDVNgwrnqiBtApRDl5DOtYP78BQ5vAlCFsSxzl7zcClHClB2iyoYAVARrmf8koWso9DZYFfHwdX0Y9oHTRy/CrOxt8AkrIZJALjpcpm51Xl+I9+m9H3MU05UQxEOHiVRXibwO7SRSrwoOjahbgJkQWE0e8oVztmji9Fkj0wcWMPRVVKiKTtuBy+XGsx0xiVKqyYXlVdlG/vshuN2YGVisoH5dnLWoOOImyJPeAc/wC3QcGGa4xnUMLErfFFaltk5k5CiRN94QaW4GuCBrVPGDCyRvLfkC2Hj+6zEO9Nh9MzzOOWhm3hhXteGOlldBTc/HssxmxzrpGbsYQ182omua21OT3FZrFzBPT+e85u0ak8+km3OVxOGkZ2DxDn7iEXQaxREzx/4SDD1M6m3sEAqO2ewQakrU/O6Pvije7p5785hrvGSu89jk8V7PlMdcN/eS0pih8UgMje++LfI2qoklOLXUZkt1wOcDkFfv1x8cI874Vkw+VgCB2RlMHXmsRejegwGIZ8JYjlon1rtfkhUXtOrQNx1C3CIFVstbtfTHZrtm8qbnST9nvkxp6enMw/+DeSzmTA86Y4Qa8eyT16NHT8UMrRVGCWTqM89uTA3MU7zlmWtMM9fT09Lzm3zmHhOn0vGWafJPkAw9TOQoAIygUb8eyJxi6HE9xXchnflT/ywUQctkunPaleY552HStZgJhi3M+uZBNgVVF4CKSzOR4oGKVTG457FfQm7AYm2pm04d9dknPwFqMB4znjexvkjtg6J9mVk7jUBiIPWqw2zxmFGC2SNqh+oRPBnB5QJIQcRjPXDKMYBzzry/zARVH7Q9EXsL1uEfx1rfUkdZ8dBQG/Y2plDHuQOLNTDgumL03/Gmxkln6y61fPYLuFhHMzSGgfkjj3aYezL1pGgMBjA8V+rlUjoDKr3uZE3l7zoFakHLqDbc0bIRVk0nyopzHtO1Pi4eF8ukras+vj3qG7DYDIKLPNd3xr0lweYJ4C0ehx2iX6T0TkcTXAZIFEccBYBxFqgyL2QheMyQmKJkSNc0FpGJenHoCwWx3hfAWl8EVOosWXnuPh36etPwZJH/ZKEX5r2H3lCeC7PFKyzunv1Ruf6pP0BK/xnIvEAaqFvFt1jqgCpw0OLQWN8gMhLKjG+8JtIK/1ecNbKGJGLpNeU9BCbTnWOagsZgMQOFRGiAWPHpECVsVIuZnR+Gh8PpmflM3F6UwDawnvz3S0Bd+k6xTOW5eG10pOaMPRuLxXCuTyl90hkuTL6Sx0AIlxXDIKpHjRQZMsShXPTa56VcqSHQTdcXBbJnQ2BWSWPR1kelDUPfcoBKVXci9vtFd6oQr6j/wGJtqCNFjUeGOWMuxBLQcixekwriO/KRLwHv0Hj4CPBeRzqgov0qAaT8Fqps+C4m2kkYY0BmEa4KghIvlZXnnCG3nveWZ+hT6LHp5XBwD/RvKPSWo0wrZkMMc6zZGBbfgT+t66DRyY6nkagDPM1Qwh+Ci4FDYwMWsisprcfQ2IGhkYw+KRazONloLIq1vvZWiFa+BJP2dchgybQ1MBYt8dCnjfD/z8AolmkfZ0NXA0JcvpgDt0Wdzd/Al45XFODSD4dG/wQCjOCiAcnRI0WaBrtMPb8D12KmAgvIHa2bpS3+IQUVhz6G94nasLalwD8Dp1imgo5ukSulH/NjuQGUywrdA78JQch7yGLmB8TmeQONCS6CbPgRWDSGu5Z/vAF+CkNfTS1mfXtXya1TL9dHqCXQIaLmwm/DBFJe7znT09PMuYl7upfXGdLLc1K7/7p58/+yOWNUccTYtVhS+QgsaPaBcPE5BJd/gndoHDTYlpHHBeB36oC89drZCirObA8VixkltmldmwkE6Wnm3MSmiEzn6Wkmb3rMfPjPP7D4oK3u0/78Z5FX9jhMsVq551o79/5iRDo0gomvAs818liR8ad1PXVa12H5qA89AKqVf2BxrYwCw5lrPieHD31C2jub5OUXk2CCAw7L5UNwcUxMQKHLCjTAKvsPct2Om5Bkq24aqW859LkH8ggsDB1k3uli59/v/jqMYO9Rvj2AmWFHR0BefglMMhza0LKGMzD/hQDUgRyj2fpBl8l12zdL5K9HpuwBVHTvv0r7tUb5AZb6bVoMYEFL8lv3zINu0o/AsBM9CTCMWAbBHCEOATXB1Y7pvU4WcZk5/PXfZTRLy6Cq6ufke09+VsHFehq1bb++TR/Va+CzQjK4EXe/5MvWLoerSeyXDPdBAVCwpOvFlxQqRHBhJrZnt7M4TOU8MzPzUYe4VaG4gS6FatGetfK97ddjaJyLa47RrB+NIQh8PwTOClGXgVEsgsrIdi5f+zOs+l8Bwahj7UuzJz5E//mDgDVcPX9lt8iB/Y7euj+HRdbWMZqNtiakfvAc8F2PSmTHYV1Do7aE+UobONf2C6jYE6gL33b/gUV+KgWqdX+AT6oLoOnARWhnhwcDKM669JhPRSCPxf/XXhHZS01PHPuqZ7SW5of9E3CNZj8mVbJLrtl+loIr4oojTM4Sxn7CFbuB9enfUKhakpNj8h93VUuyGvsl130UVilw323R94MTCCg9YYygp7hI1RQaOpB6vQEDCA6H1PrkOp03v97kgx/HnpL6V1CbqWgCv7hevrttsSy0Ilq7EgtQ2Wump33QW6kq9B1YpiMvvW8YhJ+PqdO0Ds9+yYoj/Ojam56kHqYHmgRwMaZFzVtvOuAaNtzBlR/B5bSAGqPYGAFbi9QPuVq+t+NfJJqcJpEJ+4QuLrlDWjmkeqBvQ6HZ4eGydcdLAO6DKqpPhI4SVZOp6OeARYHhAsekKZjwo8OiJ+Z16kbRAOLNV3nm5NElO5RhyvJLTHea3MiJ/iRq6v+3VFjPy7VPflxBxRmj2mNqK/7pf3IHltnh4fJ7P4IZ3zZoUg6Hdxp+pQ6oTFfqEOieKKBwzDh17AKLwyH/mR/meLJ/L7QN9jhDIvdB9CtTr0qMNneIiKEPhmH7lEfku9vnOoa+WIw3C9amP4oR+/AbzA1Y7Cxanlz++08CCI9DRbcWPgnIqGeWSnvBpR0L8JiYh/qPH+bTf6RREa8FNoFcAqKtoJ/B5bQFewZhO7141IaD3u9DJLFOZu+o1VUHP26np3Uu3k8vwDLSdCzRzFr7ZciiHgAQsPwBuyobfEW2LyVFokxjCCIee8BkQMV02v8RXNSPenk3zOYxwhpBKm/LFkw9TB6eDySY+03MsjIeu3I6qmTXYM+gwfYuWbLlNLULoHZtUYdGVtD8pzc+vfLefOnXvPem5zN5M6V3v9YzsChNp2Ibpemz7p0l4dpfqOeUJFSPnQ0wvTXo4ViR5FxLgYqnBlxpMTuGSnc02SK4OqBST3AZIwfTnvTYeUL3fk3P05dzlsf8DOa+no45a6QzXe4ZFKr6APjOv8o12y4v6p5BWlHvj6m0idMrb/Jma6S5Zu5Nvyc9vft5ZmDpEk3E0em+7N5rIX1eIdFWzGyVq6bgKfdAqmSCF1wpapUJXHgEh8NXXoILoBa/C1JN6+CyqBOUPI7t9AatxKzxLrn0vkp1bPdPODQeDCxdook4QqVZa2/D7GchZDjcL5mwQH7zFfQh5p0KKjc2YPOCy0vF+Koo5+KzXtkNfwz7HHBpAp/r2wALJdSNGyPUNE6DEuGzsuTJcY49JgTKzpYsvq18PivWHVjdpOlrfwvd9RmuM/787Jes4HIB6QUaW6Tgw4+Czb1IqTyZ+NdeFtn3btKR0pMZ85GhxsFvg5V39wyqHgWB6na5ZutMZSnoaIV9XKrQn2+yP/egfV2NNNJ0xjXDN0ql2S8Z0vR8BgLHK0pgxV0cOY/xnDAflU8tGIu+9aYzWRgCt0UJOF9znMH1bVjOZzt6L8vZM4h9zD2Drt3+LxIf97WUz9d8LWSbBYtcAZBrPm/7+noP8jsUS5XzoEc16+4mqR6+RSrqzkjtl8xCc/lnRUw+7zHTTEgde8Bz0LCIzLys/5oPFjPwkxCQDnn+2bPgYO1fwSTjOrh6G4Ya5pn+jDE0grpS5lXb9FUJP7VTIls+5Kw1gnL5wrDXvJz8xpj1oYFUzrt83dGSCMAZf81Y8FQHO+Pv7bkp0CCj95j3mZdujhl7yZSCCyDSYZCXcBzACwnAKLYGxqLxts2QPxwvd39zo8w/+ddQGDxHqR73Rwa3rMX59kc3RjBD44cw690JvusCHRqppVrKobGAfeaIEy5feyImfNg2pOooSNO7lmgK+GAt2lArnihxYkyAYeijAUYl9pjpaF4lt00/TX70lVfVWJSqwgvH/AE5T8eQ2AEzMw7n7jpdOqJxJWPIlC/XtPQCM92XMQ/ccbt7BtU1/QwiidWai+Kc96H6c0C+xh1W7fWQvzTBNVHxQGX6vhu4lGphjxnsLCrJKDZvmp4yw1KLGVBW9RsBd0oLxv4FIJyAOr+NZRXkx7ZsGviie/tnxvQ8uablcl9PecBv2VDj0D2DBl0i127bLpEnjtU26VIQBNLvkxCQ+v1XQJfqGHxNUEjHGthBHZ7eSQU4d7qTbChcLtLbMPaYSdgnyQ/Py7zHjHGntGDscxhaMHS3/re6asy0XYvBi/eFsQnpwdsscy0930DymHsdvha7fWEhu7J2HDZAfxYAm+bsSYih0fjDMHXoT2yeZervPc+WxmeZ6+bYe6+pS7Y0Nw+1PKfiq+dp1wzRFFC8OA5+Co72MfS1H1gtt5w7Xn54/otZ95gx7pTmjH5T4vvGw2nHFvVbZcDFupsO8B6bjjPXTOxtqzfNHDP2BpPONHOcLY+5tysvvdeg3dgzqKr+Llmy/SbNYvYMMvlzibvK7A4M3ptep2xpJq8pL/3ZmdLT09xzzgpH61INfSyYTMWMsYCDWV4Iin5JqDVfAFDN1PbopAJrlNmCDos2BI+TW2Th2FMByg3ujhrZ78tWZlGvweWTs2cQttNrugx81+MQS3xAh0blu3IbGv04ftIqJTOqC93BxtF+pTrafw6mYqNl1bl36CyJ03AytbkE406JM6xF4z8Jge6vAK6wTgDcvWNzKaaEefhxO0NjVd2pON4li7dOUXDx3ZC37CUwmwnmdZrYpDP2ppljE5t86efp96XnY34TzDFjSh//Bv/kvAYd4aIFGFzgj3vMdGCPmSHbR8stU59z/E4BUI4fiNwr43WntHDcl8G/rJJqgIu+rfwtpfe2EbNG1zKouv5eiWxbqv1Au4JeZo0GDObFegvNdC1bPnNvT/eZdJOPsTfNlM09oddgys7ruVEI5hxIsDj0VYKfAwFvb54Jby4XYg3NWeoYiMtFvgCqqZDaLRp/OcB1JZakKOci3YLDD1Ta7/9JWgbBRq6TlkGD5sjiJx+V2X/2n2VQDu8/IC17V2L42A1xA/z64KUXKujQR5eL2F4tFn0RBHI8+KnVOvSpNkWOQ1+2+tGdEgP5s0Xjr8WOW/8GgS9oozqOKCZFzlbL7NccXjfoWAY1fEzqq3fJVds+4YhZImARXF9k3lL89MGwXqhPQH56UQcsts6CuOE93ahR5UF5rimXXshhco+Z9pY1MrTzJLn5vB3gHypSi7PejhrIsUqzAVLKha4afytEF1NVpyug6hLFocoDqT/vdWR7mDU2O5ZBVdUb5KqtEYey4+Pxqj87n9JAn5i/+wkdBGdJZ9WUFyCQxA6rHS/hCyfDxSWd/AwdOuurgHYEFNw7sMfMLZ+frmrOpCrc17lQgcMqeZNF434LmdhkDDHc8zAEgB8iM0b2P3eOhWVQtD0J58FXy5VPbpBZ25oo83r++TfyqxyQ5/fgLOlwEfrm818Vq3U8KNc2LEI74BrYwwBNDH0sK9b5GmZ9p4FKrdJZTr6Gvt7qZ6T0V47ZBHP5SRCr7JMwpfQ+B5f71euXzaGRE522/di0oP4TUpvcJXM3f/z1mUdAhxvB5jDvv+BUiovQpCA3f+WADN1xCuRJD6oEnIx2/4KjdVCFPWY6WtZJdcuJcvO5m3XoUyZbFQn7V3Jf7zJS+oVjnsIEcTx2Z31FKqAtQUGqUmXi32f/rJjWCY1lHeFgCb/caTYGqnsY+OFHAnO3LGJXBMIWWBkeaU498MOPUyVTE4LLyI++dc+vAa4vYvji0EGpfPe85p70mGAM0CoCIR6dJ/953lI99patCUX+4bBICjbvsUFwB/kIpPRj8KL44fhzSCGgGBh3Axn41aQdsGqHWPZbr99+zLgT3gsNGvrtROuBBF5QrzIvLbPQP6jzwWDxOvr41t2rAK5LIWvijIp5s5FdKi9j6KvlUsVbYECnQpTwmA59o6fZUHArPZtJptfwXv8IboT68Bk6xPgRXClg4cALLvZiEjIVKDraiXBo2PB6qR9xmG1z59kMr7PQGMpYPup7MFCcocqRB91y7mUA1VVYLOVyDypuPCBrS1EmYwam47OiFL2zZSPoG4Y+BVWFOg7xA6hYTYKKlJOU66oJZ0rr/rtTS0CHgpReuxs/jmVQCPywI0JxztlC34SDKZapGgWN02H+RaB963ffxHreDzGzwteC3bNtBSTvZZOgkIehjzxkLBqRH5y7WIswWqmmPD/FNIfnFsUMS7bDYKRxBgSqFEVwKOm5T5i/WKELROxl/W7R06RW+g+KJXZnTIYdNVzqh9ONBprjVUEqVj0zPQd1660TIZB7GIaXkAv9+2+mADy3Y2gcgoVTp6E0dCCgOg5g1pe8WH4wbQNkLQHhHjMEpJ8DBY0RvjK8osg27HvduACCYjNcH0zJi90W1Ayd7DyVkbGtzAiswwAsfBeHELCchhnqM+OuRqkIXoD2noEL8LxvvY3GPCTh2B2yYnq7sx3ITH75bo84t/v210uVl2ybBf5wBfhDNAvrpqXeUUN70O1Gwt0w8OnAOhIUa8ShCiwio7dZXW/X/YsuUOVNDlVevA1uBCp+4Qz5HPd1NlyamucCrA53KDykgcXu5Rc+c3VI9g5KymhspE3m//UR2FptBumw+3mV5j0M+KlGHBHZ+ikM7/dj32sMP7EYKBcFqsUP2YCFncu681igWLQcTx8KWUZPzE62awNtLcru6bEDLfrQvJ+m8CpQ3X4q3tzD0PqogXYt5XjFB1cmYPXIvPtvKCw9k+onCBopfWT8ZkjksLzV+aYadqSk9KgsX3gx/k2/pD/LpPs8LgMr/QUZXfprJ2Bh3sK+123P6/JWIVWK0utgzg2ozPkhNL6UgWVemjemAJU8VwT7XjcMHQ8h8eNqqFEIlaKeyB9ngb0FD/ByyN1baXm9fgh9A3ltd26FRWysnVqcHWJW/OR9kNJ/GoLU4vBcBilGzGBil8/iAhkFpEMpIPXhrLBMsbJBzBhqKLAmcjN17HsNXXpHjdu8+mwl9P9apk9eKRR+0p9szvU6HlnK2G1xGVi9vXqvoUZk4oUA140w8KW2B2hGARfWDThYP++x1tckmNjNo9dK/ONWKdN3UeKa+fTxRtecC+pXbZkPcH0PqsPU5GdX5v8DZakMZgg0cZrkXYfC4Yf7bkkn/x3idMf775eAigBEXGFYcgo3U79EQtXQ7cSCKXX6CxIMunoo3KUOPVwtaXIZWH3qfi5Yu4YakQk/go3A51XafUi4U+pTQweWGSpIZWD1pwtVrwtS+iUT1ko8/nFVJaKtZKENNQyFMnF/6l7Ye2wrCIc62GukDKz+drSR0l8z6TG4s5yIPXbew9BIXXqKI7oYbgOCvsbeepl7vWneY/JfDMqH4bhEMRj2hAXjZxCsp8vAcl5J/34NuK4av1OsTpjPte+GQa5jqNG/ErvuUjDhVbmY6bqQ6cgFU6ZLRUyzEdRnbFIeKANroB1vloAiH31VAlEsAbVsd6T0/bZw8tQoJ1Qhvy8m99ysPZxs2d8mVujnZWB5XmO/D7kEREONyEcPyMkTTsEuFX+ERir2boRdZSGDUrVCPqAPZYMFCNbX84Yluy+qe7MMrD70XdasxlCDAtVrJv4vWP+sgadkDIsElzI9uN0gIdfYPNGlXOnFmMsljdFeLNAHmxorE/v33bv7oqalaK4/rWhL2k8DeThFEcaf1ZKJ0+HY4wegXOS5YAuI31zx5OJI8cib9L5UImpojgdS2QHfS0DFrFA4GKxrrEjs3/9fuy8e9DktdbFaQgz4AeUCvD2g5nOuO6VrJv0fDItL4E4JogjVsOUScm7BYMfEB93FC+b/oIuFTEiAcMYx+wsGahvDyVjnq4nmfReDUn1RH6pGKlayPBQW4hUYO0qamV0z8WpYMV0KhUH0tY4Q+ZfSG/AZnBUmTuDTiFsVNcFgbWPIjna8YLfun1H38uvHgVLdnvJN5rbdF9OJQrxbn5RJf1Yw1IDqzZVPfhEbiP5aN1BLUkG9F0MNBQt+UiBxj71rhdCaHno07QoLt1YIgGA7M9BbGC1zM5Bk+4GnwUIt3XNxw69cKixnPmyHNk121Yvcji9TrMIiEEtA6HAqDV4z8U5I6T+hzmyD3GW9Hx5vCDIGAzZzrIn5/eFwhxITVlVdKFBVF7Q7W59IdLSev/viprF7vt74S4JqEtsFlKWDijUpU6z8vo+eS0sZamyBlN7aBEONejXUsGCoYQDjvVvT8GNAZGaEXoqVUvTLH8VS/snCnmvVDQFa/tjR1sdsO3AdwHS/Wz0LgAptnTmJZkGZaq7ZysDyvsxCHxtwLdoxCiPMn2AgewQc2mb2eJMJWAQV0xHzlXZpkA4YWCiNQ5kdCtQ0WuCf4NmscwOmsd/f8/VBD2u3gDKduUmCmahTpm4rAytTrxQyLWW/uGUoKNejMNQ4CTr13cFF8GggenDgpVY89wLr6BHgsQ7DOjidTff5dbI0DnlhAEqSHdjNNh5fiw3Llu75+pC/IB0q2aqoAHcE3XkovZblp881yVJW+VKuPWDcKV36QqU0qJT+dPiN6AIXX7cGHPA4G7COGiF1AFaffDfQsw55KMsCoBok2bqfT7sTz7l+zzcGbdNHc+uVZzZh8jGZwOtzKAOrz12Wpxu8LgkWbr0XUvopEKimGWp4gEUJmAGZl2L1DVgsAYAKhAO19ZJs3o9j+Zkkg8v3XFL/rLaM9frwmbZulj6AppaBNYDOG/CtpApcAmJYuPUnMNS4SNr2gmO2HP/0TDdgMjEBRmDxkjLvOVEs3pWA92hQqDpJtuxrR7k/hl/AFS9f3PQirolAZCBvI9XURxP7/1MGVv/7Lj93upJqLWzh1qWQ0s/pcqdECT6umKGQxwAV05R5j9L8C8A6vMehUAFlBcNhq7oGgNp/wLKTt8bDVatevbDmNT6TIoOtg15MpvyFMTEPoQysPHTigIugTzG5Gowy9OoXPPEdMPTXwykwAUVqxi2KFUwKMgUWKRYYpWhchn/wGGCxAU5BkLWLeQegrATW8cJWVTUB9Q6YqlsqrI4f/P3iEW+zvpNus8Nb3wAVM6sEA25E9wLKwOreHyU8gycf405pwdavwZ3S7ZIAP5+EOyUbUvoUuFxQxeLY76FSjjj+WC+giK6kFa4IWxVVYMr3vQ5ErgzG965+ceZxyqErhXpjUsEAZTqwDCzTE36JzYxx/tZzYFS2DkpzdMHZiRcF7866L5DjFhJE7IhRx8CNfi135COg7EBFdQig4izvJSwdLU80t/7k1SuOamfTCk2h0ruvDKz0HvHDuRGkLtx2OpistXZlw1C7+T2w3xBWwV9yuKpKhh0xApuIYJ+gZDJgVdUGaMQAQD0HfN2w59Wmnxu5kwOoxaBQEfJbRQtlYBWtq/v4IJdyjbx9b1Pzu3uvxXB4QbCmqT4MnqmiBgYL4Mq4aZ7diQleLPokhKM37P5G453mKTrkzcCyi6OuY5KLFpeBVbSu7seDPLKuCffZw5rfjU6OJ2LjIQyFm2S7E2B7MRBI/OmlbwzdbEpXQPWyjmfyFjL+/4JPu45FLkyEAAAAAElFTkSuQmCC');
	background-size: 24px;
	background-repeat: no-repeat;
	background-position: left center;
	padding-left: 36px;
	font-size: 20px;
	letter-spacing: -0.04rem;
	font-weight: 400;
	color: white;
	text-decoration: none;
}

.message-container {
	flex-grow: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 30px;
}

.message {
	font-weight: 300;
	font-size: 1.4rem;
}

body.error .message {
	display: none;
}

body.error .error-message {
	display: block;
}

.error-message {
	display: none;
	font-weight: 300;
	font-size: 1.3rem;
}

.error-text {
	color: red;
	font-size: 1rem;
}

@font-face {
	font-family: 'Segoe UI';
	src: url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.eot"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.eot?#iefix") format("embedded-opentype");
	src: local("Segoe UI Light"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.woff2") format("woff2"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.woff") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.ttf") format("truetype"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.svg#web") format("svg");
	font-weight: 200
}

@font-face {
	font-family: 'Segoe UI';
	src: url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.eot"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.eot?#iefix") format("embedded-opentype");
	src: local("Segoe UI Semilight"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.woff2") format("woff2"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.woff") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.ttf") format("truetype"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.svg#web") format("svg");
	font-weight: 300
}

@font-face {
	font-family: 'Segoe UI';
	src: url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.eot"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.eot?#iefix") format("embedded-opentype");
	src: local("Segoe UI"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.woff2") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.woff") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.ttf") format("truetype"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.svg#web") format("svg");
	font-weight: 400
}

@font-face {
	font-family: 'Segoe UI';
	src: url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.eot"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.eot?#iefix") format("embedded-opentype");
	src: local("Segoe UI Semibold"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.woff2") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.woff") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.ttf") format("truetype"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.svg#web") format("svg");
	font-weight: 600
}

@font-face {
	font-family: 'Segoe UI';
	src: url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.eot"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.eot?#iefix") format("embedded-opentype");
	src: local("Segoe UI Bold"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.woff2") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.woff") format("woff"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.ttf") format("truetype"),url("https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.svg#web") format("svg");
	font-weight: 700
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/media/index.html]---
Location: vscode-main/extensions/microsoft-authentication/media/index.html

```html
<!-- Copyright (C) Microsoft Corporation. All rights reserved. -->
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8" />
	<title>Microsoft Account - Sign In</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" type="text/css" media="screen" href="auth.css" />
</head>

<body>
	<a class="branding" href="https://code.visualstudio.com/">
		Visual Studio Code
	</a>
	<div class="message-container">
		<div class="message">
			You are signed in now and can close this page.
		</div>
		<div class="error-message">
			An error occurred while signing in:
			<div class="error-text"></div>
		</div>
	</div>
	<script>
		var search = window.location.search;
		var error = (/[?&^]error=([^&]+)/.exec(search) || [])[1];
		if (error) {
			document.querySelector('.error-text')
				.textContent = decodeURIComponent(error);
			document.querySelector('body')
				.classList.add('error');
		}
	</script>
</body>

</html>
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/packageMocks/dpapi/dpapi.js]---
Location: vscode-main/extensions/microsoft-authentication/packageMocks/dpapi/dpapi.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

class defaultDpapi {
	protectData() {
		throw new Error('Dpapi bindings unavailable');
	}
	unprotectData() {
		throw new Error('Dpapi bindings unavailable');
	}
}
const Dpapi = new defaultDpapi();
export { Dpapi };
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/packageMocks/keytar/index.js]---
Location: vscode-main/extensions/microsoft-authentication/packageMocks/keytar/index.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

exports.setPassword = () => Promise.resolve();
exports.getPassword = () => Promise.resolve();
exports.deletePassword = () => Promise.resolve();
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/packageMocks/keytar/package.json]---
Location: vscode-main/extensions/microsoft-authentication/packageMocks/keytar/package.json

```json
{
  "name": "keytar",
  "version": "7.9.0",
  "description": "OVERRIDE Keytar since we don't need the feature",
  "homepage": "https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node",
  "main": "index.js"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/betterSecretStorage.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/betterSecretStorage.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Logger from './logger';
import { Event, EventEmitter, ExtensionContext, SecretStorage, SecretStorageChangeEvent } from 'vscode';

export interface IDidChangeInOtherWindowEvent<T> {
	added: string[];
	updated: string[];
	removed: Array<{ key: string; value: T }>;
}

export class BetterTokenStorage<T> {
	// set before and after _tokensPromise is set so getTokens can handle multiple operations.
	private _operationInProgress = false;
	// the current state. Don't use this directly and call getTokens() so that you ensure you
	// have awaited for all operations.
	private _tokensPromise: Promise<Map<string, T>> = Promise.resolve(new Map());

	// The vscode SecretStorage instance for this extension.
	private readonly _secretStorage: SecretStorage;

	private _didChangeInOtherWindow = new EventEmitter<IDidChangeInOtherWindowEvent<T>>();
	public onDidChangeInOtherWindow: Event<IDidChangeInOtherWindowEvent<T>> = this._didChangeInOtherWindow.event;

	/**
	 *
	 * @param keylistKey The key in the secret storage that will hold the list of keys associated with this instance of BetterTokenStorage
	 * @param context the vscode Context used to register disposables and retreive the vscode.SecretStorage for this instance of VS Code
	 */
	constructor(private keylistKey: string, context: ExtensionContext) {
		this._secretStorage = context.secrets;
		context.subscriptions.push(context.secrets.onDidChange((e) => this.handleSecretChange(e)));
		this.initialize();
	}

	private initialize(): void {
		this._operationInProgress = true;
		this._tokensPromise = new Promise((resolve, _) => {
			this._secretStorage.get(this.keylistKey).then(
				keyListStr => {
					if (!keyListStr) {
						resolve(new Map());
						return;
					}

					const keyList: Array<string> = JSON.parse(keyListStr);
					// Gather promises that contain key value pairs our of secret storage
					const promises = keyList.map(key => new Promise<{ key: string; value: string | undefined }>((res, rej) => {
						this._secretStorage.get(key).then((value) => {
							res({ key, value });
						}, rej);
					}));
					Promise.allSettled(promises).then((results => {
						const tokens = new Map<string, T>();
						results.forEach(p => {
							if (p.status === 'fulfilled' && p.value.value) {
								const secret = this.parseSecret(p.value.value);
								tokens.set(p.value.key, secret);
							} else if (p.status === 'rejected') {
								Logger.error(p.reason);
							} else {
								Logger.error('Key was not found in SecretStorage.');
							}
						});
						resolve(tokens);
					}));
				},
				err => {
					Logger.error(err);
					resolve(new Map());
				});
		});
		this._operationInProgress = false;
	}

	async get(key: string): Promise<T | undefined> {
		const tokens = await this.getTokens();
		return tokens.get(key);
	}

	async getAll(predicate?: (item: T) => boolean): Promise<T[]> {
		const tokens = await this.getTokens();
		const values = new Array<T>();
		for (const [_, value] of tokens) {
			if (!predicate || predicate(value)) {
				values.push(value);
			}
		}
		return values;
	}

	async store(key: string, value: T): Promise<void> {
		const tokens = await this.getTokens();

		const isAddition = !tokens.has(key);
		tokens.set(key, value);
		const valueStr = this.serializeSecret(value);
		this._operationInProgress = true;
		this._tokensPromise = new Promise((resolve, _) => {
			const promises = [this._secretStorage.store(key, valueStr)];

			// if we are adding a secret we need to update the keylist too
			if (isAddition) {
				promises.push(this.updateKeyList(tokens));
			}

			Promise.allSettled(promises).then(results => {
				results.forEach(r => {
					if (r.status === 'rejected') {
						Logger.error(r.reason);
					}
				});
				resolve(tokens);
			});
		});
		this._operationInProgress = false;
	}

	async delete(key: string): Promise<void> {
		const tokens = await this.getTokens();
		if (!tokens.has(key)) {
			return;
		}
		tokens.delete(key);

		this._operationInProgress = true;
		this._tokensPromise = new Promise((resolve, _) => {
			Promise.allSettled([
				this._secretStorage.delete(key),
				this.updateKeyList(tokens)
			]).then(results => {
				results.forEach(r => {
					if (r.status === 'rejected') {
						Logger.error(r.reason);
					}
				});
				resolve(tokens);
			});
		});
		this._operationInProgress = false;
	}

	async deleteAll(predicate?: (item: T) => boolean): Promise<void> {
		const tokens = await this.getTokens();
		const promises = [];
		for (const [key, value] of tokens) {
			if (!predicate || predicate(value)) {
				promises.push(this.delete(key));
			}
		}
		await Promise.all(promises);
	}

	private async updateKeyList(tokens: Map<string, T>) {
		const keyList = [];
		for (const [key] of tokens) {
			keyList.push(key);
		}

		const keyListStr = JSON.stringify(keyList);
		await this._secretStorage.store(this.keylistKey, keyListStr);
	}

	protected parseSecret(secret: string): T {
		return JSON.parse(secret);
	}

	protected serializeSecret(secret: T): string {
		return JSON.stringify(secret);
	}

	// This is the one way to get tokens to ensure all other operations that
	// came before you have been processed.
	private async getTokens(): Promise<Map<string, T>> {
		let tokens;
		do {
			tokens = await this._tokensPromise;
		} while (this._operationInProgress);
		return tokens;
	}

	// This is a crucial function that handles whether or not the token has changed in
	// a different window of VS Code and sends the necessary event if it has.
	// Scenarios this should cover:
	// * Added in another window
	// * Updated in another window
	// * Deleted in another window
	// * Added in this window
	// * Updated in this window
	// * Deleted in this window
	private async handleSecretChange(e: SecretStorageChangeEvent) {
		const key = e.key;

		// The KeyList is only a list of keys to aid initial start up of VS Code to know which
		// Keys are associated with this handler.
		if (key === this.keylistKey) {
			return;
		}
		const tokens = await this.getTokens();

		this._operationInProgress = true;
		this._tokensPromise = new Promise((resolve, _) => {
			this._secretStorage.get(key).then(
				storageSecretStr => {
					if (!storageSecretStr) {
						// true -> secret was deleted in another window
						// false -> secret was deleted in this window
						if (tokens.has(key)) {
							const value = tokens.get(key)!;
							tokens.delete(key);
							this._didChangeInOtherWindow.fire({ added: [], updated: [], removed: [{ key, value }] });
						}
						return tokens;
					}

					const storageSecret = this.parseSecret(storageSecretStr);
					const cachedSecret = tokens.get(key);

					if (!cachedSecret) {
						// token was added in another window
						tokens.set(key, storageSecret);
						this._didChangeInOtherWindow.fire({ added: [key], updated: [], removed: [] });
						return tokens;
					}

					const cachedSecretStr = this.serializeSecret(cachedSecret);
					if (storageSecretStr !== cachedSecretStr) {
						// token was updated in another window
						tokens.set(key, storageSecret);
						this._didChangeInOtherWindow.fire({ added: [], updated: [key], removed: [] });
					}

					// what's in our token cache and what's in storage must be the same
					// which means this should cover the last two scenarios of
					// Added in this window & Updated in this window.
					return tokens;
				},
				err => {
					Logger.error(err);
					return tokens;
				}).then(resolve);
		});
		this._operationInProgress = false;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/cryptoUtils.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/cryptoUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { base64Encode } from './node/buffer';

export function randomUUID() {
	return crypto.randomUUID();
}

function dec2hex(dec: number): string {
	return ('0' + dec.toString(16)).slice(-2);
}

export function generateCodeVerifier(): string {
	const array = new Uint32Array(56 / 2);
	crypto.getRandomValues(array);
	return Array.from(array, dec2hex).join('');
}

function sha256(plain: string | undefined) {
	const encoder = new TextEncoder();
	const data = encoder.encode(plain);
	return crypto.subtle.digest('SHA-256', data);
}

function base64urlencode(a: ArrayBuffer) {
	let str = '';
	const bytes = new Uint8Array(a);
	const len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		str += String.fromCharCode(bytes[i]);
	}
	return base64Encode(str)
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}

export async function generateCodeChallenge(v: string) {
	const hashed = await sha256(v);
	const base64encoded = base64urlencode(hashed);
	return base64encoded;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/extension.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/extension.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Environment, EnvironmentParameters } from '@azure/ms-rest-azure-env';
import Logger from './logger';
import { MsalAuthProvider } from './node/authProvider';
import { UriEventHandler } from './UriEventHandler';
import { authentication, commands, ExtensionContext, l10n, window, workspace, Disposable, Uri } from 'vscode';
import { MicrosoftAuthenticationTelemetryReporter, MicrosoftSovereignCloudAuthenticationTelemetryReporter } from './common/telemetryReporter';

let implementation: 'msal' | 'msal-no-broker' = 'msal';
const getImplementation = () => workspace.getConfiguration('microsoft-authentication').get<'msal' | 'msal-no-broker'>('implementation') ?? 'msal';

async function initMicrosoftSovereignCloudAuthProvider(
	context: ExtensionContext,
	uriHandler: UriEventHandler
): Promise<Disposable | undefined> {
	const environment = workspace.getConfiguration('microsoft-sovereign-cloud').get<string | undefined>('environment');
	let authProviderName: string | undefined;
	if (!environment) {
		return undefined;
	}

	if (environment === 'custom') {
		const customEnv = workspace.getConfiguration('microsoft-sovereign-cloud').get<EnvironmentParameters>('customEnvironment');
		if (!customEnv) {
			const res = await window.showErrorMessage(l10n.t('You must also specify a custom environment in order to use the custom environment auth provider.'), l10n.t('Open settings'));
			if (res) {
				await commands.executeCommand('workbench.action.openSettingsJson', 'microsoft-sovereign-cloud.customEnvironment');
			}
			return undefined;
		}
		try {
			Environment.add(customEnv);
		} catch (e) {
			const res = await window.showErrorMessage(l10n.t('Error validating custom environment setting: {0}', e.message), l10n.t('Open settings'));
			if (res) {
				await commands.executeCommand('workbench.action.openSettings', 'microsoft-sovereign-cloud.customEnvironment');
			}
			return undefined;
		}
		authProviderName = customEnv.name;
	} else {
		authProviderName = environment;
	}

	const env = Environment.get(authProviderName);
	if (!env) {
		await window.showErrorMessage(l10n.t('The environment `{0}` is not a valid environment.', authProviderName), l10n.t('Open settings'));
		return undefined;
	}

	const authProvider = await MsalAuthProvider.create(
		context,
		new MicrosoftSovereignCloudAuthenticationTelemetryReporter(context.extension.packageJSON.aiKey),
		window.createOutputChannel(l10n.t('Microsoft Sovereign Cloud Authentication'), { log: true }),
		uriHandler,
		env
	);
	const disposable = authentication.registerAuthenticationProvider(
		'microsoft-sovereign-cloud',
		authProviderName,
		authProvider,
		{ supportsMultipleAccounts: true, supportsChallenges: true }
	);
	context.subscriptions.push(disposable);
	return disposable;
}

export async function activate(context: ExtensionContext) {
	const mainTelemetryReporter = new MicrosoftAuthenticationTelemetryReporter(context.extension.packageJSON.aiKey);
	implementation = getImplementation();
	context.subscriptions.push(workspace.onDidChangeConfiguration(async e => {
		if (!e.affectsConfiguration('microsoft-authentication')) {
			return;
		}
		if (implementation === getImplementation()) {
			return;
		}

		// Allow for the migration to be re-attempted if the user switches back to the MSAL implementation
		context.globalState.update('msalMigration', undefined);

		const reload = l10n.t('Reload');
		const result = await window.showInformationMessage(
			'Reload required',
			{
				modal: true,
				detail: l10n.t('Microsoft Account configuration has been changed.'),
			},
			reload
		);

		if (result === reload) {
			commands.executeCommand('workbench.action.reloadWindow');
		}
	}));

	switch (implementation) {
		case 'msal-no-broker':
			mainTelemetryReporter.sendActivatedWithMsalNoBrokerEvent();
			break;
		case 'msal':
		default:
			break;
	}

	const uriHandler = new UriEventHandler();
	context.subscriptions.push(uriHandler);
	const authProvider = await MsalAuthProvider.create(
		context,
		mainTelemetryReporter,
		Logger,
		uriHandler
	);
	context.subscriptions.push(authentication.registerAuthenticationProvider(
		'microsoft',
		'Microsoft',
		authProvider,
		{
			supportsMultipleAccounts: true,
			supportsChallenges: true,
			supportedAuthorizationServers: [
				Uri.parse('https://login.microsoftonline.com/*'),
				Uri.parse('https://login.microsoftonline.com/*/v2.0')
			]
		}
	));

	let microsoftSovereignCloudAuthProviderDisposable = await initMicrosoftSovereignCloudAuthProvider(context, uriHandler);

	context.subscriptions.push(workspace.onDidChangeConfiguration(async e => {
		if (e.affectsConfiguration('microsoft-sovereign-cloud')) {
			microsoftSovereignCloudAuthProviderDisposable?.dispose();
			microsoftSovereignCloudAuthProviderDisposable = await initMicrosoftSovereignCloudAuthProvider(context, uriHandler);
		}
	}));
}

export function deactivate() {
	Logger.info('Microsoft Authentication is deactivating...');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/logger.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/logger.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

const Logger = vscode.window.createOutputChannel(vscode.l10n.t('Microsoft Authentication'), { log: true });
export default Logger;
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/UriEventHandler.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/UriEventHandler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export class UriEventHandler extends vscode.EventEmitter<vscode.Uri> implements vscode.UriHandler {
	private _disposable = vscode.window.registerUriHandler(this);

	handleUri(uri: vscode.Uri) {
		this.fire(uri);
	}

	override dispose(): void {
		super.dispose();
		this._disposable.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/common/accountAccess.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/common/accountAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, Event, EventEmitter, LogOutputChannel, SecretStorage } from 'vscode';
import { AccountInfo } from '@azure/msal-node';

export interface IAccountAccess {
	onDidAccountAccessChange: Event<void>;
	isAllowedAccess(account: AccountInfo): boolean;
	setAllowedAccess(account: AccountInfo, allowed: boolean): Promise<void>;
}

export class ScopedAccountAccess implements IAccountAccess, Disposable {
	private readonly _onDidAccountAccessChangeEmitter = new EventEmitter<void>();
	readonly onDidAccountAccessChange = this._onDidAccountAccessChangeEmitter.event;

	private value = new Array<string>();

	private readonly _disposable: Disposable;

	private constructor(
		private readonly _accountAccessSecretStorage: IAccountAccessSecretStorage,
		disposables: Disposable[] = []
	) {
		this._disposable = Disposable.from(
			...disposables,
			this._onDidAccountAccessChangeEmitter,
			this._accountAccessSecretStorage.onDidChange(() => this.update())
		);
	}

	static async create(
		secretStorage: SecretStorage,
		cloudName: string,
		logger: LogOutputChannel,
		migrations: { clientId: string; authority: string }[] | undefined,
	): Promise<ScopedAccountAccess> {
		const storage = await AccountAccessSecretStorage.create(secretStorage, cloudName, logger, migrations);
		const access = new ScopedAccountAccess(storage, [storage]);
		await access.initialize();
		return access;
	}

	dispose() {
		this._disposable.dispose();
	}

	private async initialize(): Promise<void> {
		await this.update();
	}

	isAllowedAccess(account: AccountInfo): boolean {
		return this.value.includes(account.homeAccountId);
	}

	async setAllowedAccess(account: AccountInfo, allowed: boolean): Promise<void> {
		if (allowed) {
			if (this.value.includes(account.homeAccountId)) {
				return;
			}
			await this._accountAccessSecretStorage.store([...this.value, account.homeAccountId]);
			return;
		}
		await this._accountAccessSecretStorage.store(this.value.filter(id => id !== account.homeAccountId));
	}

	private async update() {
		const current = new Set(this.value);
		const value = await this._accountAccessSecretStorage.get();

		this.value = value ?? [];
		if (current.size !== this.value.length || !this.value.every(id => current.has(id))) {
			this._onDidAccountAccessChangeEmitter.fire();
		}
	}
}

interface IAccountAccessSecretStorage {
	get(): Promise<string[] | undefined>;
	store(value: string[]): Thenable<void>;
	delete(): Thenable<void>;
	onDidChange: Event<void>;
}

class AccountAccessSecretStorage implements IAccountAccessSecretStorage, Disposable {
	private _disposable: Disposable;

	private readonly _onDidChangeEmitter = new EventEmitter<void>();
	readonly onDidChange: Event<void> = this._onDidChangeEmitter.event;

	private readonly _key: string;

	private constructor(
		private readonly _secretStorage: SecretStorage,
		private readonly _cloudName: string,
		private readonly _logger: LogOutputChannel,
		private readonly _migrations?: { clientId: string; authority: string }[],
	) {
		this._key = `accounts-${this._cloudName}`;

		this._disposable = Disposable.from(
			this._onDidChangeEmitter,
			this._secretStorage.onDidChange(e => {
				if (e.key === this._key) {
					this._onDidChangeEmitter.fire();
				}
			})
		);
	}

	static async create(
		secretStorage: SecretStorage,
		cloudName: string,
		logger: LogOutputChannel,
		migrations?: { clientId: string; authority: string }[],
	): Promise<AccountAccessSecretStorage> {
		const storage = new AccountAccessSecretStorage(secretStorage, cloudName, logger, migrations);
		await storage.initialize();
		return storage;
	}

	/**
	 * TODO: Remove this method after a release with the migration
	 */
	private async initialize(): Promise<void> {
		if (!this._migrations) {
			return;
		}
		const current = await this.get();
		// If the secret storage already has the new key, we have already run the migration
		if (current) {
			return;
		}
		try {
			const allValues = new Set<string>();
			for (const { clientId, authority } of this._migrations) {
				const oldKey = `accounts-${this._cloudName}-${clientId}-${authority}`;
				const value = await this._secretStorage.get(oldKey);
				if (value) {
					const parsed = JSON.parse(value) as string[];
					parsed.forEach(v => allValues.add(v));
				}
			}
			if (allValues.size > 0) {
				await this.store(Array.from(allValues));
			}
		} catch (e) {
			// Migration is best effort
			this._logger.error(`Failed to migrate account access secret storage: ${e}`);
		}
	}

	async get(): Promise<string[] | undefined> {
		const value = await this._secretStorage.get(this._key);
		if (!value) {
			return undefined;
		}
		return JSON.parse(value);
	}

	store(value: string[]): Thenable<void> {
		return this._secretStorage.store(this._key, JSON.stringify(value));
	}

	delete(): Thenable<void> {
		return this._secretStorage.delete(this._key);
	}

	dispose() {
		this._disposable.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/common/async.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/common/async.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationError, CancellationToken, Disposable, Event } from 'vscode';

export class SequencerByKey<TKey> {

	private promiseMap = new Map<TKey, Promise<unknown>>();

	queue<T>(key: TKey, promiseTask: () => Promise<T>): Promise<T> {
		const runningPromise = this.promiseMap.get(key) ?? Promise.resolve();
		const newPromise = runningPromise
			.catch(() => { })
			.then(promiseTask)
			.finally(() => {
				if (this.promiseMap.get(key) === newPromise) {
					this.promiseMap.delete(key);
				}
			});
		this.promiseMap.set(key, newPromise);
		return newPromise;
	}
}

export class IntervalTimer extends Disposable {

	private _token: any;

	constructor() {
		super(() => this.cancel());
		this._token = -1;
	}

	cancel(): void {
		if (this._token !== -1) {
			clearInterval(this._token);
			this._token = -1;
		}
	}

	cancelAndSet(runner: () => void, interval: number): void {
		this.cancel();
		this._token = setInterval(() => {
			runner();
		}, interval);
	}
}

/**
 * Returns a promise that rejects with an {@CancellationError} as soon as the passed token is cancelled.
 * @see {@link raceCancellation}
 */
function raceCancellationError<T>(promise: Promise<T>, token: CancellationToken): Promise<T> {
	return new Promise((resolve, reject) => {
		const ref = token.onCancellationRequested(() => {
			ref.dispose();
			reject(new CancellationError());
		});
		promise.then(resolve, reject).finally(() => ref.dispose());
	});
}

function raceTimeoutError<T>(promise: Promise<T>, timeout: number): Promise<T> {
	return new Promise((resolve, reject) => {
		const ref = setTimeout(() => {
			reject(new CancellationError());
		}, timeout);
		promise.then(resolve, reject).finally(() => clearTimeout(ref));
	});
}

export function raceCancellationAndTimeoutError<T>(promise: Promise<T>, token: CancellationToken, timeout: number): Promise<T> {
	return raceCancellationError(raceTimeoutError(promise, timeout), token);
}

/**
 * Given an event, returns another event which only fires once.
 *
 * @param event The event source for the new event.
 */
function once<T>(event: Event<T>): Event<T> {
	return (listener, thisArgs = null, disposables?) => {
		// we need this, in case the event fires during the listener call
		let didFire = false;
		let result: Disposable | undefined = undefined;
		result = event(e => {
			if (didFire) {
				return;
			} else if (result) {
				result.dispose();
			} else {
				didFire = true;
			}

			return listener.call(thisArgs, e);
		}, null, disposables);

		if (didFire) {
			result.dispose();
		}

		return result;
	};
}

/**
 * Creates a promise out of an event, using the {@link Event.once} helper.
 */
export function toPromise<T>(event: Event<T>): Promise<T> {
	return new Promise(resolve => once(event)(resolve));
}

//#region DeferredPromise

export type ValueCallback<T = unknown> = (value: T | Promise<T>) => void;

const enum DeferredOutcome {
	Resolved,
	Rejected
}

/**
 * Creates a promise whose resolution or rejection can be controlled imperatively.
 */
export class DeferredPromise<T> {

	private completeCallback!: ValueCallback<T>;
	private errorCallback!: (err: unknown) => void;
	private outcome?: { outcome: DeferredOutcome.Rejected; value: any } | { outcome: DeferredOutcome.Resolved; value: T };

	public get isRejected() {
		return this.outcome?.outcome === DeferredOutcome.Rejected;
	}

	public get isResolved() {
		return this.outcome?.outcome === DeferredOutcome.Resolved;
	}

	public get isSettled() {
		return !!this.outcome;
	}

	public get value() {
		return this.outcome?.outcome === DeferredOutcome.Resolved ? this.outcome?.value : undefined;
	}

	public readonly p: Promise<T>;

	constructor() {
		this.p = new Promise<T>((c, e) => {
			this.completeCallback = c;
			this.errorCallback = e;
		});
	}

	public complete(value: T) {
		return new Promise<void>(resolve => {
			this.completeCallback(value);
			this.outcome = { outcome: DeferredOutcome.Resolved, value };
			resolve();
		});
	}

	public error(err: unknown) {
		return new Promise<void>(resolve => {
			this.errorCallback(err);
			this.outcome = { outcome: DeferredOutcome.Rejected, value: err };
			resolve();
		});
	}

	public cancel() {
		return this.error(new CancellationError());
	}
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/common/cachePlugin.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/common/cachePlugin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICachePlugin, TokenCacheContext } from '@azure/msal-node';
import { Disposable, EventEmitter, SecretStorage } from 'vscode';

export class SecretStorageCachePlugin implements ICachePlugin, Disposable {
	private readonly _onDidChange: EventEmitter<void> = new EventEmitter<void>();
	readonly onDidChange = this._onDidChange.event;

	private _disposable: Disposable;

	private _value: string | undefined;

	constructor(
		private readonly _secretStorage: SecretStorage,
		private readonly _key: string
	) {
		this._disposable = Disposable.from(
			this._onDidChange,
			this._registerChangeHandler()
		);
	}

	private _registerChangeHandler() {
		return this._secretStorage.onDidChange(e => {
			if (e.key === this._key) {
				this._onDidChange.fire();
			}
		});
	}

	async beforeCacheAccess(tokenCacheContext: TokenCacheContext): Promise<void> {
		const data = await this._secretStorage.get(this._key);
		this._value = data;
		if (data) {
			tokenCacheContext.tokenCache.deserialize(data);
		}
	}

	async afterCacheAccess(tokenCacheContext: TokenCacheContext): Promise<void> {
		if (tokenCacheContext.cacheHasChanged) {
			const value = tokenCacheContext.tokenCache.serialize();
			if (value !== this._value) {
				await this._secretStorage.store(this._key, value);
			}
		}
	}

	dispose() {
		this._disposable.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/common/config.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/common/config.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


export interface IConfig {
	// The macOS broker redirect URI which is dependent on the bundle identifier of the signed app.
	// Other platforms do not require a redirect URI to be set. For unsigned apps, the unsigned
	// format can be used.
	// Example formats:
	// msauth.com.msauth.unsignedapp://auth or msauth.<bundleId>://auth
	macOSBrokerRedirectUri: string;
}

export const Config: IConfig = {
	// This is replaced in the build with the correct bundle id for that distro.
	macOSBrokerRedirectUri: 'msauth.com.msauth.unsignedapp://auth'
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/common/env.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/common/env.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Uri } from 'vscode';

export const DEFAULT_REDIRECT_URI = 'https://vscode.dev/redirect';

const VALID_DESKTOP_CALLBACK_SCHEMES = [
	'vscode',
	'vscode-insiders',
	// On Windows, some browsers don't seem to redirect back to OSS properly.
	// As a result, you get stuck in the auth flow. We exclude this from the
	// list until we can figure out a way to fix this behavior in browsers.
	// 'code-oss',
	'vscode-wsl',
	'vscode-exploration'
];

export function isSupportedClient(uri: Uri): boolean {
	return (
		VALID_DESKTOP_CALLBACK_SCHEMES.includes(uri.scheme) ||
		// vscode.dev & insiders.vscode.dev
		/(?:^|\.)vscode\.dev$/.test(uri.authority) ||
		// github.dev & codespaces
		/(?:^|\.)github\.dev$/.test(uri.authority) ||
		// localhost
		/^localhost:\d+$/.test(uri.authority) ||
		// 127.0.0.1
		/^127\.0\.0\.1:\d+$/.test(uri.authority)
	);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/common/event.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/common/event.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Event } from 'vscode';

/**
 * The EventBufferer is useful in situations in which you want
 * to delay firing your events during some code.
 * You can wrap that code and be sure that the event will not
 * be fired during that wrap.
 *
 * ```
 * const emitter: Emitter;
 * const delayer = new EventDelayer();
 * const delayedEvent = delayer.wrapEvent(emitter.event);
 *
 * delayedEvent(console.log);
 *
 * delayer.bufferEvents(() => {
 *   emitter.fire(); // event will not be fired yet
 * });
 *
 * // event will only be fired at this point
 * ```
 */
export class EventBufferer {

	private data: { buffers: Function[] }[] = [];

	wrapEvent<T>(event: Event<T>): Event<T>;
	wrapEvent<T>(event: Event<T>, reduce: (last: T | undefined, event: T) => T): Event<T>;
	wrapEvent<T, O>(event: Event<T>, reduce: (last: O | undefined, event: T) => O, initial: O): Event<O>;
	wrapEvent<T, O>(event: Event<T>, reduce?: (last: T | O | undefined, event: T) => T | O, initial?: O): Event<O | T> {
		return (listener, thisArgs?, disposables?) => {
			return event(i => {
				const data = this.data[this.data.length - 1];

				// Non-reduce scenario
				if (!reduce) {
					// Buffering case
					if (data) {
						data.buffers.push(() => listener.call(thisArgs, i));
					} else {
						// Not buffering case
						listener.call(thisArgs, i);
					}
					return;
				}

				// Reduce scenario
				const reduceData = data as typeof data & {
					/**
					 * The accumulated items that will be reduced.
					 */
					items?: T[];
					/**
					 * The reduced result cached to be shared with other listeners.
					 */
					reducedResult?: T | O;
				};

				// Not buffering case
				if (!reduceData) {
					// TODO: Is there a way to cache this reduce call for all listeners?
					listener.call(thisArgs, reduce(initial, i));
					return;
				}

				// Buffering case
				reduceData.items ??= [];
				reduceData.items.push(i);
				if (reduceData.buffers.length === 0) {
					// Include a single buffered function that will reduce all events when we're done buffering events
					data.buffers.push(() => {
						// cache the reduced result so that the value can be shared across all listeners
						reduceData.reducedResult ??= initial
							? reduceData.items!.reduce(reduce as (last: O | undefined, event: T) => O, initial)
							: reduceData.items!.reduce(reduce as (last: T | undefined, event: T) => T);
						listener.call(thisArgs, reduceData.reducedResult);
					});
				}
			}, undefined, disposables);
		};
	}

	bufferEvents<R = void>(fn: () => R): R {
		const data = { buffers: new Array<Function>() };
		this.data.push(data);
		const r = fn();
		this.data.pop();
		data.buffers.forEach(flush => flush());
		return r;
	}

	async bufferEventsAsync<R = void>(fn: () => Promise<R>): Promise<R> {
		const data = { buffers: new Array<Function>() };
		this.data.push(data);
		try {
			const r = await fn();
			return r;
		} finally {
			this.data.pop();
			data.buffers.forEach(flush => flush());
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/common/experimentation.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/common/experimentation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as vscode from 'vscode';
import { getExperimentationService, IExperimentationService, IExperimentationTelemetry, TargetPopulation } from 'vscode-tas-client';

export async function createExperimentationService(
	context: vscode.ExtensionContext,
	experimentationTelemetry: IExperimentationTelemetry,
	isPreRelease: boolean,
): Promise<IExperimentationService> {
	const id = context.extension.id;
	const version = context.extension.packageJSON['version'];

	const service = getExperimentationService(
		id,
		version,
		isPreRelease ? TargetPopulation.Insiders : TargetPopulation.Public,
		experimentationTelemetry,
		context.globalState,
	) as unknown as IExperimentationService;
	await service.initializePromise;
	await service.initialFetch;
	return service;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/common/loggerOptions.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/common/loggerOptions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LogLevel as MsalLogLevel } from '@azure/msal-node';
import { env, LogLevel, LogOutputChannel } from 'vscode';
import { MicrosoftAuthenticationTelemetryReporter } from './telemetryReporter';

export class MsalLoggerOptions {
	piiLoggingEnabled = false;

	constructor(
		private readonly _output: LogOutputChannel,
		private readonly _telemtryReporter: MicrosoftAuthenticationTelemetryReporter
	) { }

	get logLevel(): MsalLogLevel {
		return this._toMsalLogLevel(env.logLevel);
	}

	loggerCallback(level: MsalLogLevel, message: string, _containsPii: boolean): void {

		// Log to output channel one level lower than the MSAL log level
		switch (level) {
			case MsalLogLevel.Error:
				this._output.error(message);
				this._telemtryReporter.sendTelemetryErrorEvent(message);
				return;
			case MsalLogLevel.Warning:
				this._output.warn(message);
				return;
			case MsalLogLevel.Info:
				this._output.debug(message);
				return;
			case MsalLogLevel.Verbose:
				this._output.trace(message);
				return;
			case MsalLogLevel.Trace:
				// Do not log trace messages
				return;
			default:
				this._output.debug(message);
				return;
		}
	}

	private _toMsalLogLevel(logLevel: LogLevel): MsalLogLevel {
		switch (logLevel) {
			case LogLevel.Trace:
				return MsalLogLevel.Trace;
			case LogLevel.Debug:
				return MsalLogLevel.Verbose;
			case LogLevel.Info:
				return MsalLogLevel.Info;
			case LogLevel.Warning:
				return MsalLogLevel.Warning;
			case LogLevel.Error:
				return MsalLogLevel.Error;
			default:
				return MsalLogLevel.Info;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/common/loopbackClientAndOpener.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/common/loopbackClientAndOpener.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { ILoopbackClient, ServerAuthorizationCodeResponse } from '@azure/msal-node';
import type { UriEventHandler } from '../UriEventHandler';
import { env, LogOutputChannel, Uri } from 'vscode';
import { toPromise } from './async';

export interface ILoopbackClientAndOpener extends ILoopbackClient {
	openBrowser(url: string): Promise<void>;
}

export class UriHandlerLoopbackClient implements ILoopbackClientAndOpener {
	constructor(
		private readonly _uriHandler: UriEventHandler,
		private readonly _redirectUri: string,
		private readonly _callbackUri: Uri,
		private readonly _logger: LogOutputChannel
	) { }

	async listenForAuthCode(): Promise<ServerAuthorizationCodeResponse> {
		const url = await toPromise(this._uriHandler.event);
		this._logger.debug(`Received URL event. Authority: ${url.authority}`);
		const result = new URL(url.toString(true));
		return {
			code: result.searchParams.get('code') ?? undefined,
			state: result.searchParams.get('state') ?? undefined,
			error: result.searchParams.get('error') ?? undefined,
			error_description: result.searchParams.get('error_description') ?? undefined,
			error_uri: result.searchParams.get('error_uri') ?? undefined,
		};
	}

	getRedirectUri(): string {
		// We always return the constant redirect URL because
		// it will handle redirecting back to the extension
		return this._redirectUri;
	}

	closeServer(): void {
		// No-op
	}

	async openBrowser(url: string): Promise<void> {
		const uri = Uri.parse(url + `&state=${encodeURI(this._callbackUri.toString(true))}`);
		await env.openExternal(uri);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/common/publicClientCache.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/common/publicClientCache.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import type { AccountInfo, AuthenticationResult, InteractiveRequest, RefreshTokenRequest, SilentFlowRequest, DeviceCodeRequest } from '@azure/msal-node';
import type { Disposable, Event } from 'vscode';

export interface ICachedPublicClientApplication {
	onDidAccountsChange: Event<{ added: AccountInfo[]; changed: AccountInfo[]; deleted: AccountInfo[] }>;
	onDidRemoveLastAccount: Event<void>;
	acquireTokenSilent(request: SilentFlowRequest): Promise<AuthenticationResult>;
	acquireTokenInteractive(request: InteractiveRequest): Promise<AuthenticationResult>;
	acquireTokenByDeviceCode(request: Omit<DeviceCodeRequest, 'deviceCodeCallback'>): Promise<AuthenticationResult | null>;
	acquireTokenByRefreshToken(request: RefreshTokenRequest): Promise<AuthenticationResult | null>;
	removeAccount(account: AccountInfo): Promise<void>;
	accounts: AccountInfo[];
	clientId: string;
	isBrokerAvailable: Readonly<boolean>;
}

export interface ICachedPublicClientApplicationManager {
	onDidAccountsChange: Event<{ added: AccountInfo[]; changed: AccountInfo[]; deleted: AccountInfo[] }>;
	getOrCreate(clientId: string, migrate?: { refreshTokensToMigrate?: string[]; tenant: string }): Promise<ICachedPublicClientApplication>;
	getAll(): ICachedPublicClientApplication[];
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/common/scopeData.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/common/scopeData.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Uri } from 'vscode';

const DEFAULT_CLIENT_ID = 'aebc6443-996d-45c2-90f0-388ff96faa56';
const DEFAULT_TENANT = 'organizations';

const OIDC_SCOPES = ['openid', 'email', 'profile', 'offline_access'];
const GRAPH_TACK_ON_SCOPE = 'User.Read';

export class ScopeData {
	/**
	 * The full list of scopes including:
	 * * the original scopes passed to the constructor
	 * * internal VS Code scopes (e.g. `VSCODE_CLIENT_ID:...`)
	 * * the default scopes (`openid`, `email`, `profile`, `offline_access`)
	 */
	readonly allScopes: string[];

	/**
	 * The full list of scopes as a space-separated string. For logging.
	 */
	readonly scopeStr: string;

	/**
	 * The list of scopes to send to the token endpoint. This is the same as `scopes` but without the internal VS Code scopes.
	 */
	readonly scopesToSend: string[];

	/**
	 * The client ID to use for the token request. This is the value of the `VSCODE_CLIENT_ID:...` scope if present, otherwise the default client ID.
	 */
	readonly clientId: string;

	/**
	 * The tenant ID or `organizations`, `common`, `consumers` to use for the token request. This is the value of the `VSCODE_TENANT:...` scope if present, otherwise it's the default.
	 */
	readonly tenant: string;

	/**
	 * The tenant ID to use for the token request. This will only ever be a GUID if one was specified via the `VSCODE_TENANT:...` scope, otherwise undefined.
	 */
	readonly tenantId: string | undefined;

	/**
	 * The claims to include in the token request.
	 */
	readonly claims?: string;

	constructor(readonly originalScopes: readonly string[] = [], claims?: string, authorizationServer?: Uri) {
		const modifiedScopes = [...originalScopes];
		modifiedScopes.sort();
		this.allScopes = modifiedScopes;
		this.scopeStr = modifiedScopes.join(' ');
		this.claims = claims;
		this.scopesToSend = this.getScopesToSend(modifiedScopes);
		this.clientId = this.getClientId(this.allScopes);
		this.tenant = this.getTenant(this.allScopes, authorizationServer);
		this.tenantId = this.getTenantId(this.tenant);
	}

	private getClientId(scopes: string[]): string {
		return scopes.reduce<string | undefined>((prev, current) => {
			if (current.startsWith('VSCODE_CLIENT_ID:')) {
				return current.split('VSCODE_CLIENT_ID:')[1];
			}
			return prev;
		}, undefined) ?? DEFAULT_CLIENT_ID;
	}

	private getTenant(scopes: string[], authorizationServer?: Uri): string {
		if (authorizationServer?.path) {
			// Get tenant portion of URL
			const tenant = authorizationServer.path.split('/')[1];
			if (tenant) {
				return tenant;
			}
		}
		return scopes.reduce<string | undefined>((prev, current) => {
			if (current.startsWith('VSCODE_TENANT:')) {
				return current.split('VSCODE_TENANT:')[1];
			}
			return prev;
		}, undefined) ?? DEFAULT_TENANT;
	}

	private getTenantId(tenant: string): string | undefined {
		switch (tenant) {
			case 'organizations':
			case 'common':
			case 'consumers':
				// These are not valid tenant IDs, so we return undefined
				return undefined;
			default:
				return this.tenant;
		}
	}

	private getScopesToSend(scopes: string[]): string[] {
		const scopesToSend = scopes.filter(s => !s.startsWith('VSCODE_'));

		const set = new Set(scopesToSend);
		for (const scope of OIDC_SCOPES) {
			set.delete(scope);
		}

		// If we only had OIDC scopes, we need to add a tack-on scope to make the request valid
		// by forcing Identity into treating this as a Graph token request.
		if (!set.size) {
			scopesToSend.push(GRAPH_TACK_ON_SCOPE);
		}
		return scopesToSend;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/common/telemetryReporter.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/common/telemetryReporter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AuthError, ClientAuthError } from '@azure/msal-node';
import TelemetryReporter, { TelemetryEventProperties } from '@vscode/extension-telemetry';
import { IExperimentationTelemetry } from 'vscode-tas-client';

export const enum MicrosoftAccountType {
	AAD = 'aad',
	MSA = 'msa',
	Unknown = 'unknown'
}

export class MicrosoftAuthenticationTelemetryReporter implements IExperimentationTelemetry {
	private sharedProperties: Record<string, string> = {};
	protected _telemetryReporter: TelemetryReporter;
	constructor(aiKey: string) {
		this._telemetryReporter = new TelemetryReporter(aiKey);
	}

	get telemetryReporter(): TelemetryReporter {
		return this._telemetryReporter;
	}

	setSharedProperty(name: string, value: string): void {
		this.sharedProperties[name] = value;
	}

	postEvent(eventName: string, props: Map<string, string>): void {
		const eventProperties: TelemetryEventProperties = { ...this.sharedProperties, ...Object.fromEntries(props) };
		this._telemetryReporter.sendTelemetryEvent(
			eventName,
			eventProperties
		);
	}

	sendActivatedWithMsalNoBrokerEvent(): void {
		/* __GDPR__
			"activatingMsalNoBroker" : { "owner": "TylerLeonhardt", "comment": "Used to determine how often users use the msal-no-broker login flow. This only fires if the user explictly opts in to this." }
		*/
		this._telemetryReporter.sendTelemetryEvent('activatingmsalnobroker');
	}

	sendLoginEvent(scopes: readonly string[]): void {
		/* __GDPR__
			"login" : {
				"owner": "TylerLeonhardt",
				"comment": "Used to determine the usage of the Microsoft Auth Provider.",
				"scopes": { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight", "comment": "Used to determine what scope combinations are being requested." }
			}
		*/
		this._telemetryReporter.sendTelemetryEvent('login', {
			// Get rid of guids from telemetry.
			scopes: JSON.stringify(this._scrubGuids(scopes)),
		});
	}
	sendLoginFailedEvent(): void {
		/* __GDPR__
			"loginFailed" : { "owner": "TylerLeonhardt", "comment": "Used to determine how often users run into issues with the login flow." }
		*/
		this._telemetryReporter.sendTelemetryEvent('loginFailed');
	}
	sendLogoutEvent(): void {
		/* __GDPR__
			"logout" : { "owner": "TylerLeonhardt", "comment": "Used to determine how often users log out." }
		*/
		this._telemetryReporter.sendTelemetryEvent('logout');
	}
	sendLogoutFailedEvent(): void {
		/* __GDPR__
			"logoutFailed" : { "owner": "TylerLeonhardt", "comment": "Used to determine how often fail to log out." }
		*/
		this._telemetryReporter.sendTelemetryEvent('logoutFailed');
	}

	sendTelemetryErrorEvent(error: Error | string): void {
		let errorMessage: string | undefined;
		let errorName: string | undefined;
		let errorCode: string | undefined;
		let errorCorrelationId: string | undefined;
		if (typeof error === 'string') {
			errorMessage = error;
		} else {
			const authError: AuthError = error as AuthError;
			// don't set error message or stack because it contains PII
			errorCode = authError.errorCode;
			errorCorrelationId = authError.correlationId;
			errorName = authError.name;
		}

		/* __GDPR__
			"msalError" : {
				"owner": "TylerLeonhardt",
				"comment": "Used to determine how often users run into issues with the login flow.",
				"errorMessage": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "The error message." },
				"errorName": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "The name of the error." },
				"errorCode": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "The error code." },
				"errorCorrelationId": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "The error correlation id." }
			}
		*/
		this._telemetryReporter.sendTelemetryErrorEvent('msalError', {
			errorMessage,
			errorName,
			errorCode,
			errorCorrelationId,
		});
	}

	sendTelemetryClientAuthErrorEvent(error: AuthError): void {
		const errorCode = error.errorCode;
		const correlationId = error.correlationId;
		const errorName = error.name;
		let brokerErrorCode: string | undefined;
		let brokerStatusCode: string | undefined;
		let brokerTag: string | undefined;

		// Extract platform broker error information if available
		if (error.platformBrokerError) {
			brokerErrorCode = error.platformBrokerError.errorCode;
			brokerStatusCode = `${error.platformBrokerError.statusCode}`;
			brokerTag = error.platformBrokerError.tag;
		}

		/* __GDPR__
			"msalClientAuthError" : {
				"owner": "TylerLeonhardt",
				"comment": "Used to determine how often users run into client auth errors during the login flow.",
				"errorName": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "The name of the client auth error." },
				"errorCode": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "The client auth error code." },
				"correlationId": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "The client auth error correlation id." },
				"brokerErrorCode": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "The broker error code." },
				"brokerStatusCode": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "The broker error status code." },
				"brokerTag": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "The broker error tag." }
			}
		*/
		this._telemetryReporter.sendTelemetryErrorEvent('msalClientAuthError', {
			errorName,
			errorCode,
			correlationId,
			brokerErrorCode,
			brokerStatusCode,
			brokerTag
		});
	}

	/**
	 * Sends an event for an account type available at startup.
	 * @param scopes The scopes for the session
	 * @param accountType The account type for the session
	 * @todo Remove the scopes since we really don't care about them.
	 */
	sendAccountEvent(scopes: string[], accountType: MicrosoftAccountType): void {
		/* __GDPR__
			"account" : {
				"owner": "TylerLeonhardt",
				"comment": "Used to determine the usage of the Microsoft Auth Provider.",
				"scopes": { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight", "comment": "Used to determine what scope combinations are being requested." },
				"accountType": { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight", "comment": "Used to determine what account types are being used." }
			}
		*/
		this._telemetryReporter.sendTelemetryEvent('account', {
			// Get rid of guids from telemetry.
			scopes: JSON.stringify(this._scrubGuids(scopes)),
			accountType
		});
	}

	protected _scrubGuids(scopes: readonly string[]): string[] {
		return scopes.map(s => s.replace(/[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/i, '{guid}'));
	}
}

export class MicrosoftSovereignCloudAuthenticationTelemetryReporter extends MicrosoftAuthenticationTelemetryReporter {
	override sendLoginEvent(scopes: string[]): void {
		/* __GDPR__
			"loginMicrosoftSovereignCloud" : {
				"owner": "TylerLeonhardt",
				"comment": "Used to determine the usage of the Microsoft Auth Provider.",
				"scopes": { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight", "comment": "Used to determine what scope combinations are being requested." }
			}
		*/
		this._telemetryReporter.sendTelemetryEvent('loginMicrosoftSovereignCloud', {
			// Get rid of guids from telemetry.
			scopes: JSON.stringify(this._scrubGuids(scopes)),
		});
	}
	override sendLoginFailedEvent(): void {
		/* __GDPR__
			"loginMicrosoftSovereignCloudFailed" : { "owner": "TylerLeonhardt", "comment": "Used to determine how often users run into issues with the login flow." }
		*/
		this._telemetryReporter.sendTelemetryEvent('loginMicrosoftSovereignCloudFailed');
	}
	override sendLogoutEvent(): void {
		/* __GDPR__
			"logoutMicrosoftSovereignCloud" : { "owner": "TylerLeonhardt", "comment": "Used to determine how often users log out." }
		*/
		this._telemetryReporter.sendTelemetryEvent('logoutMicrosoftSovereignCloud');
	}
	override sendLogoutFailedEvent(): void {
		/* __GDPR__
			"logoutMicrosoftSovereignCloudFailed" : { "owner": "TylerLeonhardt", "comment": "Used to determine how often fail to log out." }
		*/
		this._telemetryReporter.sendTelemetryEvent('logoutMicrosoftSovereignCloudFailed');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/common/uri.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/common/uri.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { env, UIKind, Uri } from 'vscode';

const LOCALHOST_ADDRESSES = ['localhost', '127.0.0.1', '0:0:0:0:0:0:0:1', '::1'];
function isLocalhost(uri: Uri): boolean {
	if (!/^https?$/i.test(uri.scheme)) {
		return false;
	}
	const host = uri.authority.split(':')[0];
	return LOCALHOST_ADDRESSES.indexOf(host) >= 0;
}

export function isSupportedEnvironment(uri: Uri): boolean {
	if (env.uiKind === UIKind.Desktop) {
		return true;
	}
	// local development (localhost:* or 127.0.0.1:*)
	if (isLocalhost(uri)) {
		return true;
	}
	// At this point we should only ever see https
	if (uri.scheme !== 'https') {
		return false;
	}

	return (
		// vscode.dev & insiders.vscode.dev
		/(?:^|\.)vscode\.dev$/.test(uri.authority) ||
		// github.dev & codespaces
		/(?:^|\.)github\.dev$/.test(uri.authority) ||
		// github.dev/codespaces local setup (github.localhost)
		/(?:^|\.)github\.localhost$/.test(uri.authority)
	);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/microsoft-authentication/src/common/test/loopbackClientAndOpener.test.ts]---
Location: vscode-main/extensions/microsoft-authentication/src/common/test/loopbackClientAndOpener.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { env, Uri, window } from 'vscode';
import * as sinon from 'sinon';
import { UriHandlerLoopbackClient } from '../loopbackClientAndOpener';
import { UriEventHandler } from '../../UriEventHandler';

suite('UriHandlerLoopbackClient', () => {
	const redirectUri = 'http://localhost';
	let uriHandler: UriEventHandler;
	let client: UriHandlerLoopbackClient;
	let envStub: sinon.SinonStubbedInstance<typeof env>;
	let callbackUri: Uri;

	setup(async () => {
		callbackUri = await env.asExternalUri(Uri.parse(`${env.uriScheme}://vscode.microsoft-authentication`));
		envStub = sinon.stub(env);
		envStub.openExternal.resolves(true);
		envStub.asExternalUri.callThrough();
		uriHandler = new UriEventHandler();
		client = new UriHandlerLoopbackClient(uriHandler, redirectUri, callbackUri, window.createOutputChannel('test', { log: true }));
	});

	teardown(() => {
		sinon.restore();
		uriHandler.dispose();
	});

	suite('openBrowser', () => {
		test('should open browser with correct URL', async () => {
			const testUrl = 'http://example.com?foo=5';

			await client.openBrowser(testUrl);
			assert.ok(envStub.openExternal.calledOnce);

			const expectedUri = Uri.parse(testUrl + `&state=${encodeURI(callbackUri.toString(true))}`);
			const value = envStub.openExternal.getCalls()[0].args[0];
			assert.strictEqual(value.toString(true), expectedUri.toString(true));
		});
	});

	suite('getRedirectUri', () => {
		test('should return the redirect URI', () => {
			const result = client.getRedirectUri();
			assert.strictEqual(result, redirectUri);
		});
	});

	// Skipped for now until `listenForAuthCode` is refactored to not show quick pick
	suite('listenForAuthCode', () => {
		test('should return auth code from URL', async () => {
			const code = '1234';
			const state = '5678';
			const testUrl = Uri.parse(`http://example.com?code=${code}&state=${state}`);
			const promise = client.listenForAuthCode();
			uriHandler.handleUri(testUrl);
			const result = await promise;

			assert.strictEqual(result.code, code);
			assert.strictEqual(result.state, state);
		});

		test('should return auth error from URL', async () => {
			const error = 'access_denied';
			const errorDescription = 'reason';
			const errorUri = 'uri';
			const testUrl = Uri.parse(`http://example.com?error=${error}&error_description=${errorDescription}&error_uri=${errorUri}`);

			const promise = client.listenForAuthCode();
			uriHandler.handleUri(testUrl);
			const result = await promise;

			assert.strictEqual(result.error, 'access_denied');
			assert.strictEqual(result.error_description, 'reason');
			assert.strictEqual(result.error_uri, 'uri');
		});
	});
});
```

--------------------------------------------------------------------------------

````

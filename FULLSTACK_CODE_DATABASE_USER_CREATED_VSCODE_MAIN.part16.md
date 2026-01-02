---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:25Z
part: 16
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 16 of 552)

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

---[FILE: build/vite/package-lock.json]---
Location: vscode-main/build/vite/package-lock.json

```json
{
  "name": "@vscode/sample-source",
  "version": "0.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "@vscode/sample-source",
      "version": "0.0.0",
      "devDependencies": {
        "vite": "^7.1.11"
      }
    },
    "../lib": {
      "name": "monaco-editor-core",
      "version": "0.0.0",
      "extraneous": true,
      "license": "MIT",
      "dependencies": {
        "postcss-copy": "^7.1.0",
        "postcss-copy-assets": "^0.3.1",
        "rollup": "^4.35.0",
        "rollup-plugin-esbuild": "^6.2.1",
        "rollup-plugin-lib-style": "^2.3.2",
        "rollup-plugin-postcss": "^4.0.2"
      }
    },
    "node_modules/@esbuild/aix-ppc64": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.25.9.tgz",
      "integrity": "sha512-OaGtL73Jck6pBKjNIe24BnFE6agGl+6KxDtTfHhy1HmhthfKouEcOhqpSL64K4/0WCtbKFLOdzD/44cJ4k9opA==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.25.9.tgz",
      "integrity": "sha512-5WNI1DaMtxQ7t7B6xa572XMXpHAaI/9Hnhk8lcxF4zVN4xstUgTlvuGDorBguKEnZO70qwEcLpfifMLoxiPqHQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm64": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.25.9.tgz",
      "integrity": "sha512-IDrddSmpSv51ftWslJMvl3Q2ZT98fUSL2/rlUXuVqRXHCs5EUF1/f+jbjF5+NG9UffUDMCiTyh8iec7u8RlTLg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-x64": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.25.9.tgz",
      "integrity": "sha512-I853iMZ1hWZdNllhVZKm34f4wErd4lMyeV7BLzEExGEIZYsOzqDWDf+y082izYUE8gtJnYHdeDpN/6tUdwvfiw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-arm64": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.25.9.tgz",
      "integrity": "sha512-XIpIDMAjOELi/9PB30vEbVMs3GV1v2zkkPnuyRRURbhqjyzIINwj+nbQATh4H9GxUgH1kFsEyQMxwiLFKUS6Rg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-x64": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.25.9.tgz",
      "integrity": "sha512-jhHfBzjYTA1IQu8VyrjCX4ApJDnH+ez+IYVEoJHeqJm9VhG9Dh2BYaJritkYK3vMaXrf7Ogr/0MQ8/MeIefsPQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-arm64": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.25.9.tgz",
      "integrity": "sha512-z93DmbnY6fX9+KdD4Ue/H6sYs+bhFQJNCPZsi4XWJoYblUqT06MQUdBCpcSfuiN72AbqeBFu5LVQTjfXDE2A6Q==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-x64": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.25.9.tgz",
      "integrity": "sha512-mrKX6H/vOyo5v71YfXWJxLVxgy1kyt1MQaD8wZJgJfG4gq4DpQGpgTB74e5yBeQdyMTbgxp0YtNj7NuHN0PoZg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.25.9.tgz",
      "integrity": "sha512-HBU2Xv78SMgaydBmdor38lg8YDnFKSARg1Q6AT0/y2ezUAKiZvc211RDFHlEZRFNRVhcMamiToo7bDx3VEOYQw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm64": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.25.9.tgz",
      "integrity": "sha512-BlB7bIcLT3G26urh5Dmse7fiLmLXnRlopw4s8DalgZ8ef79Jj4aUcYbk90g8iCa2467HX8SAIidbL7gsqXHdRw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ia32": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.25.9.tgz",
      "integrity": "sha512-e7S3MOJPZGp2QW6AK6+Ly81rC7oOSerQ+P8L0ta4FhVi+/j/v2yZzx5CqqDaWjtPFfYz21Vi1S0auHrap3Ma3A==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-loong64": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.25.9.tgz",
      "integrity": "sha512-Sbe10Bnn0oUAB2AalYztvGcK+o6YFFA/9829PhOCUS9vkJElXGdphz0A3DbMdP8gmKkqPmPcMJmJOrI3VYB1JQ==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-mips64el": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.25.9.tgz",
      "integrity": "sha512-YcM5br0mVyZw2jcQeLIkhWtKPeVfAerES5PvOzaDxVtIyZ2NUBZKNLjC5z3/fUlDgT6w89VsxP2qzNipOaaDyA==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ppc64": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.25.9.tgz",
      "integrity": "sha512-++0HQvasdo20JytyDpFvQtNrEsAgNG2CY1CLMwGXfFTKGBGQT3bOeLSYE2l1fYdvML5KUuwn9Z8L1EWe2tzs1w==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-riscv64": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.25.9.tgz",
      "integrity": "sha512-uNIBa279Y3fkjV+2cUjx36xkx7eSjb8IvnL01eXUKXez/CBHNRw5ekCGMPM0BcmqBxBcdgUWuUXmVWwm4CH9kg==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-s390x": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.25.9.tgz",
      "integrity": "sha512-Mfiphvp3MjC/lctb+7D287Xw1DGzqJPb/J2aHHcHxflUo+8tmN/6d4k6I2yFR7BVo5/g7x2Monq4+Yew0EHRIA==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-x64": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.25.9.tgz",
      "integrity": "sha512-iSwByxzRe48YVkmpbgoxVzn76BXjlYFXC7NvLYq+b+kDjyyk30J0JY47DIn8z1MO3K0oSl9fZoRmZPQI4Hklzg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-arm64": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.25.9.tgz",
      "integrity": "sha512-9jNJl6FqaUG+COdQMjSCGW4QiMHH88xWbvZ+kRVblZsWrkXlABuGdFJ1E9L7HK+T0Yqd4akKNa/lO0+jDxQD4Q==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-x64": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.25.9.tgz",
      "integrity": "sha512-RLLdkflmqRG8KanPGOU7Rpg829ZHu8nFy5Pqdi9U01VYtG9Y0zOG6Vr2z4/S+/3zIyOxiK6cCeYNWOFR9QP87g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-arm64": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.25.9.tgz",
      "integrity": "sha512-YaFBlPGeDasft5IIM+CQAhJAqS3St3nJzDEgsgFixcfZeyGPCd6eJBWzke5piZuZ7CtL656eOSYKk4Ls2C0FRQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-x64": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.25.9.tgz",
      "integrity": "sha512-1MkgTCuvMGWuqVtAvkpkXFmtL8XhWy+j4jaSO2wxfJtilVCi0ZE37b8uOdMItIHz4I6z1bWWtEX4CJwcKYLcuA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openharmony-arm64": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/openharmony-arm64/-/openharmony-arm64-0.25.9.tgz",
      "integrity": "sha512-4Xd0xNiMVXKh6Fa7HEJQbrpP3m3DDn43jKxMjxLLRjWnRsfxjORYJlXPO4JNcXtOyfajXorRKY9NkOpTHptErg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/sunos-x64": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.25.9.tgz",
      "integrity": "sha512-WjH4s6hzo00nNezhp3wFIAfmGZ8U7KtrJNlFMRKxiI9mxEK1scOMAaa9i4crUtu+tBr+0IN6JCuAcSBJZfnphw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-arm64": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.25.9.tgz",
      "integrity": "sha512-mGFrVJHmZiRqmP8xFOc6b84/7xa5y5YvR1x8djzXpJBSv/UsNK6aqec+6JDjConTgvvQefdGhFDAs2DLAds6gQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-ia32": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.25.9.tgz",
      "integrity": "sha512-b33gLVU2k11nVx1OhX3C8QQP6UHQK4ZtN56oFWvVXvz2VkDoe6fbG8TOgHFxEvqeqohmRnIHe5A1+HADk4OQww==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-x64": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.25.9.tgz",
      "integrity": "sha512-PPOl1mi6lpLNQxnGoyAfschAodRFYXJ+9fs6WHXz7CSWKbOqiMZsubC+BQsVKuul+3vKLuwTHsS2c2y9EoKwxQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@rollup/rollup-android-arm-eabi": {
      "version": "4.49.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm-eabi/-/rollup-android-arm-eabi-4.49.0.tgz",
      "integrity": "sha512-rlKIeL854Ed0e09QGYFlmDNbka6I3EQFw7iZuugQjMb11KMpJCLPFL4ZPbMfaEhLADEL1yx0oujGkBQ7+qW3eA==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@rollup/rollup-android-arm64": {
      "version": "4.49.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm64/-/rollup-android-arm64-4.49.0.tgz",
      "integrity": "sha512-cqPpZdKUSQYRtLLr6R4X3sD4jCBO1zUmeo3qrWBCqYIeH8Q3KRL4F3V7XJ2Rm8/RJOQBZuqzQGWPjjvFUcYa/w==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@rollup/rollup-darwin-arm64": {
      "version": "4.49.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-arm64/-/rollup-darwin-arm64-4.49.0.tgz",
      "integrity": "sha512-99kMMSMQT7got6iYX3yyIiJfFndpojBmkHfTc1rIje8VbjhmqBXE+nb7ZZP3A5skLyujvT0eIUCUsxAe6NjWbw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@rollup/rollup-darwin-x64": {
      "version": "4.49.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-x64/-/rollup-darwin-x64-4.49.0.tgz",
      "integrity": "sha512-y8cXoD3wdWUDpjOLMKLx6l+NFz3NlkWKcBCBfttUn+VGSfgsQ5o/yDUGtzE9HvsodkP0+16N0P4Ty1VuhtRUGg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@rollup/rollup-freebsd-arm64": {
      "version": "4.49.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-arm64/-/rollup-freebsd-arm64-4.49.0.tgz",
      "integrity": "sha512-3mY5Pr7qv4GS4ZvWoSP8zha8YoiqrU+e0ViPvB549jvliBbdNLrg2ywPGkgLC3cmvN8ya3za+Q2xVyT6z+vZqA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@rollup/rollup-freebsd-x64": {
      "version": "4.49.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-x64/-/rollup-freebsd-x64-4.49.0.tgz",
      "integrity": "sha512-C9KzzOAQU5gU4kG8DTk+tjdKjpWhVWd5uVkinCwwFub2m7cDYLOdtXoMrExfeBmeRy9kBQMkiyJ+HULyF1yj9w==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm-gnueabihf": {
      "version": "4.49.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-gnueabihf/-/rollup-linux-arm-gnueabihf-4.49.0.tgz",
      "integrity": "sha512-OVSQgEZDVLnTbMq5NBs6xkmz3AADByCWI4RdKSFNlDsYXdFtlxS59J+w+LippJe8KcmeSSM3ba+GlsM9+WwC1w==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm-musleabihf": {
      "version": "4.49.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-musleabihf/-/rollup-linux-arm-musleabihf-4.49.0.tgz",
      "integrity": "sha512-ZnfSFA7fDUHNa4P3VwAcfaBLakCbYaxCk0jUnS3dTou9P95kwoOLAMlT3WmEJDBCSrOEFFV0Y1HXiwfLYJuLlA==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm64-gnu": {
      "version": "4.49.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-gnu/-/rollup-linux-arm64-gnu-4.49.0.tgz",
      "integrity": "sha512-Z81u+gfrobVK2iV7GqZCBfEB1y6+I61AH466lNK+xy1jfqFLiQ9Qv716WUM5fxFrYxwC7ziVdZRU9qvGHkYIJg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm64-musl": {
      "version": "4.49.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-musl/-/rollup-linux-arm64-musl-4.49.0.tgz",
      "integrity": "sha512-zoAwS0KCXSnTp9NH/h9aamBAIve0DXeYpll85shf9NJ0URjSTzzS+Z9evmolN+ICfD3v8skKUPyk2PO0uGdFqg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-loongarch64-gnu": {
      "version": "4.49.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loongarch64-gnu/-/rollup-linux-loongarch64-gnu-4.49.0.tgz",
      "integrity": "sha512-2QyUyQQ1ZtwZGiq0nvODL+vLJBtciItC3/5cYN8ncDQcv5avrt2MbKt1XU/vFAJlLta5KujqyHdYtdag4YEjYQ==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-ppc64-gnu": {
      "version": "4.49.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-gnu/-/rollup-linux-ppc64-gnu-4.49.0.tgz",
      "integrity": "sha512-k9aEmOWt+mrMuD3skjVJSSxHckJp+SiFzFG+v8JLXbc/xi9hv2icSkR3U7uQzqy+/QbbYY7iNB9eDTwrELo14g==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-riscv64-gnu": {
      "version": "4.49.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-gnu/-/rollup-linux-riscv64-gnu-4.49.0.tgz",
      "integrity": "sha512-rDKRFFIWJ/zJn6uk2IdYLc09Z7zkE5IFIOWqpuU0o6ZpHcdniAyWkwSUWE/Z25N/wNDmFHHMzin84qW7Wzkjsw==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-riscv64-musl": {
      "version": "4.49.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-musl/-/rollup-linux-riscv64-musl-4.49.0.tgz",
      "integrity": "sha512-FkkhIY/hYFVnOzz1WeV3S9Bd1h0hda/gRqvZCMpHWDHdiIHn6pqsY3b5eSbvGccWHMQ1uUzgZTKS4oGpykf8Tw==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-s390x-gnu": {
      "version": "4.49.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-s390x-gnu/-/rollup-linux-s390x-gnu-4.49.0.tgz",
      "integrity": "sha512-gRf5c+A7QiOG3UwLyOOtyJMD31JJhMjBvpfhAitPAoqZFcOeK3Kc1Veg1z/trmt+2P6F/biT02fU19GGTS529A==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-x64-gnu": {
      "version": "4.49.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-gnu/-/rollup-linux-x64-gnu-4.49.0.tgz",
      "integrity": "sha512-BR7+blScdLW1h/2hB/2oXM+dhTmpW3rQt1DeSiCP9mc2NMMkqVgjIN3DDsNpKmezffGC9R8XKVOLmBkRUcK/sA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-x64-musl": {
      "version": "4.49.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-musl/-/rollup-linux-x64-musl-4.49.0.tgz",
      "integrity": "sha512-hDMOAe+6nX3V5ei1I7Au3wcr9h3ktKzDvF2ne5ovX8RZiAHEtX1A5SNNk4zt1Qt77CmnbqT+upb/umzoPMWiPg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-win32-arm64-msvc": {
      "version": "4.49.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-arm64-msvc/-/rollup-win32-arm64-msvc-4.49.0.tgz",
      "integrity": "sha512-wkNRzfiIGaElC9kXUT+HLx17z7D0jl+9tGYRKwd8r7cUqTL7GYAvgUY++U2hK6Ar7z5Z6IRRoWC8kQxpmM7TDA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-ia32-msvc": {
      "version": "4.49.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-ia32-msvc/-/rollup-win32-ia32-msvc-4.49.0.tgz",
      "integrity": "sha512-gq5aW/SyNpjp71AAzroH37DtINDcX1Qw2iv9Chyz49ZgdOP3NV8QCyKZUrGsYX9Yyggj5soFiRCgsL3HwD8TdA==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-x64-msvc": {
      "version": "4.49.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-msvc/-/rollup-win32-x64-msvc-4.49.0.tgz",
      "integrity": "sha512-gEtqFbzmZLFk2xKh7g0Rlo8xzho8KrEFEkzvHbfUGkrgXOpZ4XagQ6n+wIZFNh1nTb8UD16J4nFSFKXYgnbdBg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@types/estree": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/@types/estree/-/estree-1.0.8.tgz",
      "integrity": "sha512-dWHzHa2WqEXI/O1E9OjrocMTKJl2mSrEolh1Iomrv6U+JuNwaHXsXx9bLu5gG7BUWFIN0skIQJQ/L1rIex4X6w==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/esbuild": {
      "version": "0.25.9",
      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.25.9.tgz",
      "integrity": "sha512-CRbODhYyQx3qp7ZEwzxOk4JBqmD/seJrzPa/cGjY1VtIn5E09Oi9/dB4JwctnfZ8Q8iT7rioVv5k/FNT/uf54g==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.25.9",
        "@esbuild/android-arm": "0.25.9",
        "@esbuild/android-arm64": "0.25.9",
        "@esbuild/android-x64": "0.25.9",
        "@esbuild/darwin-arm64": "0.25.9",
        "@esbuild/darwin-x64": "0.25.9",
        "@esbuild/freebsd-arm64": "0.25.9",
        "@esbuild/freebsd-x64": "0.25.9",
        "@esbuild/linux-arm": "0.25.9",
        "@esbuild/linux-arm64": "0.25.9",
        "@esbuild/linux-ia32": "0.25.9",
        "@esbuild/linux-loong64": "0.25.9",
        "@esbuild/linux-mips64el": "0.25.9",
        "@esbuild/linux-ppc64": "0.25.9",
        "@esbuild/linux-riscv64": "0.25.9",
        "@esbuild/linux-s390x": "0.25.9",
        "@esbuild/linux-x64": "0.25.9",
        "@esbuild/netbsd-arm64": "0.25.9",
        "@esbuild/netbsd-x64": "0.25.9",
        "@esbuild/openbsd-arm64": "0.25.9",
        "@esbuild/openbsd-x64": "0.25.9",
        "@esbuild/openharmony-arm64": "0.25.9",
        "@esbuild/sunos-x64": "0.25.9",
        "@esbuild/win32-arm64": "0.25.9",
        "@esbuild/win32-ia32": "0.25.9",
        "@esbuild/win32-x64": "0.25.9"
      }
    },
    "node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/nanoid": {
      "version": "3.3.11",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.11.tgz",
      "integrity": "sha512-N8SpfPUnUp1bK+PMYW8qSWdl9U+wwNWI4QKxOYDy9JAro3WMX7p2OeVRF9v+347pnakNevPmiHhNmZ2HbFA76w==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.3.tgz",
      "integrity": "sha512-5gTmgEY/sqK6gFXLIsQNH19lWb4ebPDLA4SdLP7dsWkIXHWlG66oPuVvXSGFPppYZz8ZDZq0dYYrbHfBCVUb1Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.6",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.6.tgz",
      "integrity": "sha512-3Ybi1tAuwAP9s0r1UQ2J4n5Y0G05bJkpUIO0/bI9MhwmD70S5aTWbXGBwxHrelT+XM1k6dM0pk+SwNkpTRN7Pg==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.11",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/rollup": {
      "version": "4.49.0",
      "resolved": "https://registry.npmjs.org/rollup/-/rollup-4.49.0.tgz",
      "integrity": "sha512-3IVq0cGJ6H7fKXXEdVt+RcYvRCt8beYY9K1760wGQwSAHZcS9eot1zDG5axUbcp/kWRi5zKIIDX8MoKv/TzvZA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/estree": "1.0.8"
      },
      "bin": {
        "rollup": "dist/bin/rollup"
      },
      "engines": {
        "node": ">=18.0.0",
        "npm": ">=8.0.0"
      },
      "optionalDependencies": {
        "@rollup/rollup-android-arm-eabi": "4.49.0",
        "@rollup/rollup-android-arm64": "4.49.0",
        "@rollup/rollup-darwin-arm64": "4.49.0",
        "@rollup/rollup-darwin-x64": "4.49.0",
        "@rollup/rollup-freebsd-arm64": "4.49.0",
        "@rollup/rollup-freebsd-x64": "4.49.0",
        "@rollup/rollup-linux-arm-gnueabihf": "4.49.0",
        "@rollup/rollup-linux-arm-musleabihf": "4.49.0",
        "@rollup/rollup-linux-arm64-gnu": "4.49.0",
        "@rollup/rollup-linux-arm64-musl": "4.49.0",
        "@rollup/rollup-linux-loongarch64-gnu": "4.49.0",
        "@rollup/rollup-linux-ppc64-gnu": "4.49.0",
        "@rollup/rollup-linux-riscv64-gnu": "4.49.0",
        "@rollup/rollup-linux-riscv64-musl": "4.49.0",
        "@rollup/rollup-linux-s390x-gnu": "4.49.0",
        "@rollup/rollup-linux-x64-gnu": "4.49.0",
        "@rollup/rollup-linux-x64-musl": "4.49.0",
        "@rollup/rollup-win32-arm64-msvc": "4.49.0",
        "@rollup/rollup-win32-ia32-msvc": "4.49.0",
        "@rollup/rollup-win32-x64-msvc": "4.49.0",
        "fsevents": "~2.3.2"
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
      "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
      "dev": true,
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/tinyglobby": {
      "version": "0.2.15",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.15.tgz",
      "integrity": "sha512-j2Zq4NyQYG5XMST4cbs02Ak8iJUdxRM0XI5QyxXuZOzKOINmWurp3smXu3y5wDcJrptwpSjgXHzIQxR0omXljQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.5.0",
        "picomatch": "^4.0.3"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/vite": {
      "version": "7.1.11",
      "resolved": "https://registry.npmjs.org/vite/-/vite-7.1.11.tgz",
      "integrity": "sha512-uzcxnSDVjAopEUjljkWh8EIrg6tlzrjFUfMcR1EVsRDGwf/ccef0qQPRyOrROwhrTDaApueq+ja+KLPlzR/zdg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "esbuild": "^0.25.0",
        "fdir": "^6.5.0",
        "picomatch": "^4.0.3",
        "postcss": "^8.5.6",
        "rollup": "^4.43.0",
        "tinyglobby": "^0.2.15"
      },
      "bin": {
        "vite": "bin/vite.js"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "funding": {
        "url": "https://github.com/vitejs/vite?sponsor=1"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.3"
      },
      "peerDependencies": {
        "@types/node": "^20.19.0 || >=22.12.0",
        "jiti": ">=1.21.0",
        "less": "^4.0.0",
        "lightningcss": "^1.21.0",
        "sass": "^1.70.0",
        "sass-embedded": "^1.70.0",
        "stylus": ">=0.54.8",
        "sugarss": "^5.0.0",
        "terser": "^5.16.0",
        "tsx": "^4.8.1",
        "yaml": "^2.4.2"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        },
        "jiti": {
          "optional": true
        },
        "less": {
          "optional": true
        },
        "lightningcss": {
          "optional": true
        },
        "sass": {
          "optional": true
        },
        "sass-embedded": {
          "optional": true
        },
        "stylus": {
          "optional": true
        },
        "sugarss": {
          "optional": true
        },
        "terser": {
          "optional": true
        },
        "tsx": {
          "optional": true
        },
        "yaml": {
          "optional": true
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: build/vite/package.json]---
Location: vscode-main/build/vite/package.json

```json
{
  "name": "@vscode/sample-source",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^7.1.11"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: build/vite/setup-dev.ts]---
Location: vscode-main/build/vite/setup-dev.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/// <reference path="../../src/typings/vscode-globals-product.d.ts" />

import { enableHotReload } from '../../src/vs/base/common/hotReload.ts';
import { InstantiationType, registerSingleton } from '../../src/vs/platform/instantiation/common/extensions.ts';
import { IWebWorkerService } from '../../src/vs/platform/webWorker/browser/webWorkerService.ts';
// eslint-disable-next-line local/code-no-standalone-editor
import { StandaloneWebWorkerService } from '../../src/vs/editor/standalone/browser/services/standaloneWebWorkerService.ts';

enableHotReload();
registerSingleton(IWebWorkerService, StandaloneWebWorkerService, InstantiationType.Eager);

globalThis._VSCODE_DISABLE_CSS_IMPORT_MAP = true;
globalThis._VSCODE_USE_RELATIVE_IMPORTS = true;
```

--------------------------------------------------------------------------------

---[FILE: build/vite/style.css]---
Location: vscode-main/build/vite/style.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

#sampleContent {
	height: 400px;
	border: 1px solid black;
}
```

--------------------------------------------------------------------------------

---[FILE: build/vite/tsconfig.json]---
Location: vscode-main/build/vite/tsconfig.json

```json
{
	"compilerOptions": {
		"allowImportingTsExtensions": true,
		"noEmit": true,
		"strict": true,
		"forceConsistentCasingInFileNames": true,
		"experimentalDecorators": true,
	},
	"include": ["**/*.ts"]
}
```

--------------------------------------------------------------------------------

---[FILE: build/vite/vite.config.ts]---
Location: vscode-main/build/vite/vite.config.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createLogger, defineConfig, Plugin } from 'vite';
import path, { join } from 'path';
/// @ts-ignore
import { urlToEsmPlugin } from './rollup-url-to-module-plugin/index.mjs';
import { statSync } from 'fs';
import { pathToFileURL } from 'url';

function injectBuiltinExtensionsPlugin(): Plugin {
	let builtinExtensionsCache: unknown[] | null = null;

	function replaceAllOccurrences(str: string, search: string, replace: string): string {
		return str.split(search).join(replace);
	}

	async function loadBuiltinExtensions() {
		if (!builtinExtensionsCache) {
			builtinExtensionsCache = await getScannedBuiltinExtensions(path.resolve(__dirname, '../../'));
			console.log(`Found ${builtinExtensionsCache!.length} built-in extensions.`);
		}
		return builtinExtensionsCache;
	}

	function asJSON(value: unknown): string {
		return escapeHtmlByReplacingCharacters(JSON.stringify(value));
	}

	function escapeHtmlByReplacingCharacters(str: string) {
		if (typeof str !== 'string') {
			return '';
		}

		const escapeCharacter = (match: string) => {
			switch (match) {
				case '&': return '&amp;';
				case '<': return '&lt;';
				case '>': return '&gt;';
				case '"': return '&quot;';
				case '\'': return '&#039;';
				case '`': return '&#096;';
				default: return match;
			}
		};

		return str.replace(/[&<>"'`]/g, escapeCharacter);
	}

	const prebuiltExtensionsLocation = '.build/builtInExtensions';
	async function getScannedBuiltinExtensions(vsCodeDevLocation: string) {
		// use the build utility as to not duplicate the code
		const extensionsUtil = await import(pathToFileURL(path.join(vsCodeDevLocation, 'build', 'lib', 'extensions.js')).toString());
		const localExtensions = extensionsUtil.scanBuiltinExtensions(path.join(vsCodeDevLocation, 'extensions'));
		const prebuiltExtensions = extensionsUtil.scanBuiltinExtensions(path.join(vsCodeDevLocation, prebuiltExtensionsLocation));
		for (const ext of localExtensions) {
			let browserMain = ext.packageJSON.browser;
			if (browserMain) {
				if (!browserMain.endsWith('.js')) {
					browserMain = browserMain + '.js';
				}
				const browserMainLocation = path.join(vsCodeDevLocation, 'extensions', ext.extensionPath, browserMain);
				if (!fileExists(browserMainLocation)) {
					console.log(`${browserMainLocation} not found. Make sure all extensions are compiled (use 'yarn watch-web').`);
				}
			}
		}
		return localExtensions.concat(prebuiltExtensions);
	}

	function fileExists(path: string): boolean {
		try {
			return statSync(path).isFile();
		} catch (err) {
			return false;
		}
	}

	return {
		name: 'inject-builtin-extensions',
		transformIndexHtml: {
			order: 'pre',
			async handler(html) {
				const search = '{{WORKBENCH_BUILTIN_EXTENSIONS}}';
				if (html.indexOf(search) === -1) {
					return html;
				}

				const extensions = await loadBuiltinExtensions();
				const h = replaceAllOccurrences(html, search, asJSON(extensions));
				return h;
			}
		}
	};
}

function createHotClassSupport(): Plugin {
	return {
		name: 'createHotClassSupport',
		transform: {
			order: 'pre',
			handler: (code, id) => {
				if (id.endsWith('.ts')) {
					let needsHMRAccept = false;
					const hasCreateHotClass = code.includes('createHotClass');
					const hasDomWidget = code.includes('DomWidget');

					if (!hasCreateHotClass && !hasDomWidget) {
						return undefined;
					}

					if (hasCreateHotClass) {
						needsHMRAccept = true;
					}

					if (hasDomWidget) {
						const matches = code.matchAll(/class\s+([a-zA-Z0-9_]+)\s+extends\s+DomWidget/g);
						/// @ts-ignore
						for (const match of matches) {
							const className = match[1];
							code = code + `\n${className}.registerWidgetHotReplacement(${JSON.stringify(id + '#' + className)});`;
							needsHMRAccept = true;
						}
					}

					if (needsHMRAccept) {
						code = code + `\n
if (import.meta.hot) {
	import.meta.hot.accept();
}`;
					}
					return code;
				}
				return undefined;
			},
		}
	};
}

const logger = createLogger();
const loggerWarn = logger.warn;

logger.warn = (msg, options) => {
	// amdX and the baseUrl code cannot be analyzed by vite.
	// However, they are not needed, so it is okay to silence the warning.
	if (msg.indexOf('vs/amdX.ts') !== -1) {
		return;
	}
	if (msg.indexOf('await import(new URL(`vs/workbench/workbench.desktop.main.js`, baseUrl).href)') !== -1) {
		return;
	}
	if (msg.indexOf('const result2 = await import(workbenchUrl);') !== -1) {
		return;
	}

	// See https://github.com/microsoft/vscode/issues/278153
	if (msg.indexOf('marked.esm.js.map') !== -1 || msg.indexOf('purify.es.mjs.map') !== -1) {
		return;
	}

	loggerWarn(msg, options);
};

export default defineConfig({
	plugins: [
		urlToEsmPlugin(),
		injectBuiltinExtensionsPlugin(),
		createHotClassSupport()
	],
	customLogger: logger,
	esbuild: {
		tsconfigRaw: {
			compilerOptions: {
				experimentalDecorators: true,
			}
		}
	},
	root: '../..', // To support /out/... paths
	server: {
		cors: true,
		port: 5199,
		origin: 'http://localhost:5199',
		fs: {
			allow: [
				// To allow loading from sources, not needed when loading monaco-editor from npm package
				/// @ts-ignore
				join(import.meta.dirname, '../../../')
			]
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: build/vite/workbench-electron.ts]---
Location: vscode-main/build/vite/workbench-electron.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './setup-dev';
import '../../src/vs/code/electron-browser/workbench/workbench';
```

--------------------------------------------------------------------------------

---[FILE: build/vite/workbench-vite-electron.html]---
Location: vscode-main/build/vite/workbench-vite-electron.html

```html
<!-- Copyright (C) Microsoft Corporation. All rights reserved. -->
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
	</head>

	<body aria-label="">
	</body>

	<!-- Startup (do not modify order of script tags!) -->
	<script type="module" src="./workbench-electron.ts"></script>
</html>
```

--------------------------------------------------------------------------------

---[FILE: build/vite/workbench-vite.html]---
Location: vscode-main/build/vite/workbench-vite.html

```html
<!-- Copyright (C) Microsoft Corporation. All rights reserved. -->
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta id="vscode-workbench-web-configuration" data-settings="{&quot;workspaceUri&quot;:{&quot;$mid&quot;:1,&quot;path&quot;:&quot;/default.code-workspace&quot;,&quot;scheme&quot;:&quot;tmp&quot;},&quot;productConfiguration&quot;:{&quot;enableTelemetry&quot;:false,&quot;extensionsGallery&quot;:{&quot;nlsBaseUrl&quot;:&quot;https://www.vscode-unpkg.net/_lp/&quot;,&quot;serviceUrl&quot;:&quot;https://marketplace.visualstudio.com/_apis/public/gallery&quot;,&quot;searchUrl&quot;:&quot;https://marketplace.visualstudio.com/_apis/public/gallery/searchrelevancy/extensionquery&quot;,&quot;servicePPEUrl&quot;:&quot;https://marketplace.vsallin.net/_apis/public/gallery&quot;,&quot;cacheUrl&quot;:&quot;https://vscode.blob.core.windows.net/gallery/index&quot;,&quot;itemUrl&quot;:&quot;https://marketplace.visualstudio.com/items&quot;,&quot;publisherUrl&quot;:&quot;https://marketplace.visualstudio.com/publishers&quot;,&quot;resourceUrlTemplate&quot;:&quot;https://{publisher}.vscode-unpkg.net/{publisher}/{name}/{version}/{path}&quot;,&quot;controlUrl&quot;:&quot;https://az764295.vo.msecnd.net/extensions/marketplace.json&quot;},&quot;configurationSync.store&quot;:{&quot;url&quot;:&quot;https://vscode-sync-insiders.trafficmanager.net/&quot;,&quot;stableUrl&quot;:&quot;https://vscode-sync.trafficmanager.net/&quot;,&quot;insidersUrl&quot;:&quot;https://vscode-sync-insiders.trafficmanager.net/&quot;,&quot;canSwitch&quot;:true,&quot;authenticationProviders&quot;:{&quot;github&quot;:{&quot;scopes&quot;:[&quot;user:email&quot;]},&quot;microsoft&quot;:{&quot;scopes&quot;:[&quot;openid&quot;,&quot;profile&quot;,&quot;email&quot;,&quot;offline_access&quot;]}}},&quot;enableSyncingProfiles&quot;:true,&quot;editSessions.store&quot;:{&quot;url&quot;:&quot;https://vscode-sync.trafficmanager.net/&quot;,&quot;authenticationProviders&quot;:{&quot;microsoft&quot;:{&quot;scopes&quot;:[&quot;openid&quot;,&quot;profile&quot;,&quot;email&quot;,&quot;offline_access&quot;]},&quot;github&quot;:{&quot;scopes&quot;:[&quot;user:email&quot;]}}},&quot;linkProtectionTrustedDomains&quot;:[&quot;https://*.visualstudio.com&quot;,&quot;https://*.microsoft.com&quot;,&quot;https://aka.ms&quot;,&quot;https://*.gallerycdn.vsassets.io&quot;,&quot;https://*.github.com&quot;,&quot;https://login.microsoftonline.com&quot;,&quot;https://*.vscode.dev&quot;,&quot;https://*.github.dev&quot;,&quot;https://gh.io&quot;],&quot;trustedExtensionAuthAccess&quot;:[&quot;vscode.git&quot;,&quot;vscode.github&quot;,&quot;ms-vscode.remote-repositories&quot;,&quot;github.remotehub&quot;,&quot;ms-vscode.azure-repos&quot;,&quot;ms-vscode.remote-server&quot;,&quot;github.vscode-pull-request-github&quot;,&quot;github.codespaces&quot;,&quot;ms-vsliveshare.vsliveshare&quot;,&quot;github.copilot&quot;,&quot;github.copilot-chat&quot;],&quot;webEndpointUrlTemplate&quot;:&quot;http://{{uuid}}.localhost:8080/static/sources&quot;,&quot;webviewContentExternalBaseUrlTemplate&quot;:&quot;http://{{uuid}}.localhost:8080/static/sources/out/vs/workbench/contrib/webview/browser/pre/&quot;}}">

		<!-- Builtin Extensions -->
		<meta id="vscode-workbench-builtin-extensions" data-settings="{{WORKBENCH_BUILTIN_EXTENSIONS}}">
	</head>

	<body aria-label="">
	</body>

	<!-- Startup (do not modify order of script tags!) -->
	<script>
		globalThis._VSCODE_FILE_ROOT = 'http://localhost:5199/out/';
	</script>
	<script type="module" src="./index-workbench.ts"></script>
</html>
```

--------------------------------------------------------------------------------

---[FILE: build/vite/rollup-url-to-module-plugin/index.mjs]---
Location: vscode-main/build/vite/rollup-url-to-module-plugin/index.mjs

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @type {() => import('rollup').Plugin}
*/
export function urlToEsmPlugin() {
	return {
		name: 'import-meta-url',
		async transform(code, id) {
			if (this.environment?.mode === 'dev') {
				return;
			}

			// Look for `new URL(..., import.meta.url)` patterns.
			const regex = /new\s+URL\s*\(\s*(['"`])(.*?)\1\s*,\s*import\.meta\.url\s*\)?/g;

			let match;
			let modified = false;
			let result = code;
			let offset = 0;

			while ((match = regex.exec(code)) !== null) {
				let path = match[2];

				if (!path.startsWith('.') && !path.startsWith('/')) {
					path = `./${path}`;
				}
				const resolved = await this.resolve(path, id);

				if (!resolved) {
					continue;
				}

				// Add the file as an entry point
				const refId = this.emitFile({
					type: 'chunk',
					id: resolved.id,
				});

				const start = match.index;
				const end = start + match[0].length;

				const replacement = `import.meta.ROLLUP_FILE_URL_OBJ_${refId}`;

				result = result.slice(0, start + offset) + replacement + result.slice(end + offset);
				offset += replacement.length - (end - start);
				modified = true;
			}

			if (!modified) {
				return null;
			}

			return {
				code: result,
				map: null
			};
		}
	};
}
```

--------------------------------------------------------------------------------

---[FILE: build/win32/.gitignore]---
Location: vscode-main/build/win32/.gitignore

```text
code-processed.iss
```

--------------------------------------------------------------------------------

---[FILE: build/win32/Cargo.lock]---
Location: vscode-main/build/win32/Cargo.lock

```text
# This file is automatically @generated by Cargo.
# It is not intended for manual editing.
version = 4

[[package]]
name = "bitflags"
version = "1.3.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "bef38d45163c2f1dde094a7dfd33ccf595c92905c8f8f4fdc18d06fb1037718a"

[[package]]
name = "bitflags"
version = "2.9.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "1b8e56985ec62d17e9c1001dc89c88ecd7dc08e47eba5ec7c29c7b5eeecde967"

[[package]]
name = "byteorder"
version = "1.4.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "14c189c53d098945499cdfa7ecc63567cf3886b3332b312a5b4585d8d3a6a610"

[[package]]
name = "cfg-if"
version = "1.0.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "baf1de4339761588bc0619e3cbc0120ee582ebb74b53b4efbf79117bd2da40fd"

[[package]]
name = "crc"
version = "3.0.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "86ec7a15cbe22e59248fc7eadb1907dab5ba09372595da4d73dd805ed4417dfe"
dependencies = [
 "crc-catalog",
]

[[package]]
name = "crc-catalog"
version = "2.2.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9cace84e55f07e7301bae1c519df89cdad8cc3cd868413d3fdbdeca9ff3db484"

[[package]]
name = "crossbeam-channel"
version = "0.5.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "4c02a4d71819009c192cf4872265391563fd6a84c81ff2c0f2a7026ca4c1d85c"
dependencies = [
 "cfg-if",
 "crossbeam-utils",
]

[[package]]
name = "crossbeam-utils"
version = "0.8.10"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7d82ee10ce34d7bc12c2122495e7593a9c41347ecdd64185af4ecf72cb1a7f83"
dependencies = [
 "cfg-if",
 "once_cell",
]

[[package]]
name = "dirs-next"
version = "2.0.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "b98cf8ebf19c3d1b223e151f99a4f9f0690dca41414773390fc824184ac833e1"
dependencies = [
 "cfg-if",
 "dirs-sys-next",
]

[[package]]
name = "dirs-sys-next"
version = "0.1.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "4ebda144c4fe02d1f7ea1a7d9641b6fc6b580adcfa024ae48797ecdeb6825b4d"
dependencies = [
 "libc",
 "redox_users",
 "winapi",
]

[[package]]
name = "errno"
version = "0.3.13"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "778e2ac28f6c47af28e4907f13ffd1e1ddbd400980a9abd7c8df189bf578a5ad"
dependencies = [
 "libc",
 "windows-sys 0.52.0",
]

[[package]]
name = "fastrand"
version = "2.3.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "37909eebbb50d72f9059c3b6d82c0463f2ff062c9e95845c43a6c9c0355411be"

[[package]]
name = "getrandom"
version = "0.2.7"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "4eb1a864a501629691edf6c15a593b7a51eebaa1e8468e9ddc623de7c9b58ec6"
dependencies = [
 "cfg-if",
 "libc",
 "wasi 0.11.0+wasi-snapshot-preview1",
]

[[package]]
name = "getrandom"
version = "0.3.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "26145e563e54f2cadc477553f1ec5ee650b00862f0a58bcd12cbdc5f0ea2d2f4"
dependencies = [
 "cfg-if",
 "libc",
 "r-efi",
 "wasi 0.14.2+wasi-0.2.4",
]

[[package]]
name = "hermit-abi"
version = "0.3.9"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "d231dfb89cfffdbc30e7fc41579ed6066ad03abda9e567ccafae602b97ec5024"

[[package]]
name = "inno_updater"
version = "0.18.2"
dependencies = [
 "byteorder",
 "crc",
 "slog",
 "slog-async",
 "slog-term",
 "tempfile",
 "windows-sys 0.42.0",
]

[[package]]
name = "is-terminal"
version = "0.4.12"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "f23ff5ef2b80d608d61efee834934d862cd92461afc0560dedf493e4c033738b"
dependencies = [
 "hermit-abi",
 "libc",
 "windows-sys 0.52.0",
]

[[package]]
name = "itoa"
version = "1.0.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "112c678d4050afce233f4f2852bb2eb519230b3cf12f33585275537d7e41578d"

[[package]]
name = "libc"
version = "0.2.174"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "1171693293099992e19cddea4e8b849964e9846f4acee11b3948bcc337be8776"

[[package]]
name = "linux-raw-sys"
version = "0.9.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "cd945864f07fe9f5371a27ad7b52a172b4b499999f1d97574c9fa68373937e12"

[[package]]
name = "num_threads"
version = "0.1.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "2819ce041d2ee131036f4fc9d6ae7ae125a3a40e97ba64d04fe799ad9dabbb44"
dependencies = [
 "libc",
]

[[package]]
name = "once_cell"
version = "1.21.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "42f5e15c9953c5e4ccceeb2e7382a716482c34515315f7b03532b8b4e8393d2d"

[[package]]
name = "proc-macro2"
version = "1.0.40"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "dd96a1e8ed2596c337f8eae5f24924ec83f5ad5ab21ea8e455d3566c69fbcaf7"
dependencies = [
 "unicode-ident",
]

[[package]]
name = "quote"
version = "1.0.20"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "3bcdf212e9776fbcb2d23ab029360416bb1706b1aea2d1a5ba002727cbcab804"
dependencies = [
 "proc-macro2",
]

[[package]]
name = "r-efi"
version = "5.3.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "69cdb34c158ceb288df11e18b4bd39de994f6657d83847bdffdbd7f346754b0f"

[[package]]
name = "redox_syscall"
version = "0.2.13"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "62f25bc4c7e55e0b0b7a1d43fb893f4fa1361d0abe38b9ce4f323c2adfe6ef42"
dependencies = [
 "bitflags 1.3.2",
]

[[package]]
name = "redox_users"
version = "0.4.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "b033d837a7cf162d7993aded9304e30a83213c648b6e389db233191f891e5c2b"
dependencies = [
 "getrandom 0.2.7",
 "redox_syscall",
 "thiserror",
]

[[package]]
name = "rustix"
version = "1.0.7"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c71e83d6afe7ff64890ec6b71d6a69bb8a610ab78ce364b3352876bb4c801266"
dependencies = [
 "bitflags 2.9.1",
 "errno",
 "libc",
 "linux-raw-sys",
 "windows-sys 0.52.0",
]

[[package]]
name = "rustversion"
version = "1.0.7"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a0a5f7c728f5d284929a1cccb5bc19884422bfe6ef4d6c409da2c41838983fcf"

[[package]]
name = "slog"
version = "2.7.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "8347046d4ebd943127157b94d63abb990fcf729dc4e9978927fdf4ac3c998d06"

[[package]]
name = "slog-async"
version = "2.7.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "766c59b252e62a34651412870ff55d8c4e6d04df19b43eecb2703e417b097ffe"
dependencies = [
 "crossbeam-channel",
 "slog",
 "take_mut",
 "thread_local",
]

[[package]]
name = "slog-term"
version = "2.9.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "b6e022d0b998abfe5c3782c1f03551a596269450ccd677ea51c56f8b214610e8"
dependencies = [
 "is-terminal",
 "slog",
 "term",
 "thread_local",
 "time",
]

[[package]]
name = "syn"
version = "1.0.98"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c50aef8a904de4c23c788f104b7dddc7d6f79c647c7c8ce4cc8f73eb0ca773dd"
dependencies = [
 "proc-macro2",
 "quote",
 "unicode-ident",
]

[[package]]
name = "take_mut"
version = "0.2.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "f764005d11ee5f36500a149ace24e00e3da98b0158b3e2d53a7495660d3f4d60"

[[package]]
name = "tempfile"
version = "3.20.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e8a64e3985349f2441a1a9ef0b853f869006c3855f2cda6862a94d26ebb9d6a1"
dependencies = [
 "fastrand",
 "getrandom 0.3.3",
 "once_cell",
 "rustix",
 "windows-sys 0.52.0",
]

[[package]]
name = "term"
version = "0.7.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c59df8ac95d96ff9bede18eb7300b0fda5e5d8d90960e76f8e14ae765eedbf1f"
dependencies = [
 "dirs-next",
 "rustversion",
 "winapi",
]

[[package]]
name = "thiserror"
version = "1.0.31"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "bd829fe32373d27f76265620b5309d0340cb8550f523c1dda251d6298069069a"
dependencies = [
 "thiserror-impl",
]

[[package]]
name = "thiserror-impl"
version = "1.0.31"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "0396bc89e626244658bef819e22d0cc459e795a5ebe878e6ec336d1674a8d79a"
dependencies = [
 "proc-macro2",
 "quote",
 "syn",
]

[[package]]
name = "thread_local"
version = "1.1.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "5516c27b78311c50bf42c071425c560ac799b11c30b31f87e3081965fe5e0180"
dependencies = [
 "once_cell",
]

[[package]]
name = "time"
version = "0.3.11"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "72c91f41dcb2f096c05f0873d667dceec1087ce5bcf984ec8ffb19acddbb3217"
dependencies = [
 "itoa",
 "libc",
 "num_threads",
 "time-macros",
]

[[package]]
name = "time-macros"
version = "0.2.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "42657b1a6f4d817cda8e7a0ace261fe0cc946cf3a80314390b22cc61ae080792"

[[package]]
name = "unicode-ident"
version = "1.0.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "5bd2fe26506023ed7b5e1e315add59d6f584c621d037f9368fea9cfb988f368c"

[[package]]
name = "wasi"
version = "0.11.0+wasi-snapshot-preview1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9c8d87e72b64a3b4db28d11ce29237c246188f4f51057d65a7eab63b7987e423"

[[package]]
name = "wasi"
version = "0.14.2+wasi-0.2.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9683f9a5a998d873c0d21fcbe3c083009670149a8fab228644b8bd36b2c48cb3"
dependencies = [
 "wit-bindgen-rt",
]

[[package]]
name = "winapi"
version = "0.3.9"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "5c839a674fcd7a98952e593242ea400abe93992746761e38641405d28b00f419"
dependencies = [
 "winapi-i686-pc-windows-gnu",
 "winapi-x86_64-pc-windows-gnu",
]

[[package]]
name = "winapi-i686-pc-windows-gnu"
version = "0.4.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ac3b87c63620426dd9b991e5ce0329eff545bccbbb34f3be09ff6fb6ab51b7b6"

[[package]]
name = "winapi-x86_64-pc-windows-gnu"
version = "0.4.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "712e227841d057c1ee1cd2fb22fa7e5a5461ae8e48fa2ca79ec42cfc1931183f"

[[package]]
name = "windows-sys"
version = "0.42.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "5a3e1820f08b8513f676f7ab6c1f99ff312fb97b553d30ff4dd86f9f15728aa7"
dependencies = [
 "windows_aarch64_gnullvm 0.42.2",
 "windows_aarch64_msvc 0.42.2",
 "windows_i686_gnu 0.42.2",
 "windows_i686_msvc 0.42.2",
 "windows_x86_64_gnu 0.42.2",
 "windows_x86_64_gnullvm 0.42.2",
 "windows_x86_64_msvc 0.42.2",
]

[[package]]
name = "windows-sys"
version = "0.52.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "282be5f36a8ce781fad8c8ae18fa3f9beff57ec1b52cb3de0789201425d9a33d"
dependencies = [
 "windows-targets",
]

[[package]]
name = "windows-targets"
version = "0.52.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "6f0713a46559409d202e70e28227288446bf7841d3211583a4b53e3f6d96e7eb"
dependencies = [
 "windows_aarch64_gnullvm 0.52.5",
 "windows_aarch64_msvc 0.52.5",
 "windows_i686_gnu 0.52.5",
 "windows_i686_gnullvm",
 "windows_i686_msvc 0.52.5",
 "windows_x86_64_gnu 0.52.5",
 "windows_x86_64_gnullvm 0.52.5",
 "windows_x86_64_msvc 0.52.5",
]

[[package]]
name = "windows_aarch64_gnullvm"
version = "0.42.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "597a5118570b68bc08d8d59125332c54f1ba9d9adeedeef5b99b02ba2b0698f8"

[[package]]
name = "windows_aarch64_gnullvm"
version = "0.52.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7088eed71e8b8dda258ecc8bac5fb1153c5cffaf2578fc8ff5d61e23578d3263"

[[package]]
name = "windows_aarch64_msvc"
version = "0.42.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e08e8864a60f06ef0d0ff4ba04124db8b0fb3be5776a5cd47641e942e58c4d43"

[[package]]
name = "windows_aarch64_msvc"
version = "0.52.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9985fd1504e250c615ca5f281c3f7a6da76213ebd5ccc9561496568a2752afb6"

[[package]]
name = "windows_i686_gnu"
version = "0.42.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c61d927d8da41da96a81f029489353e68739737d3beca43145c8afec9a31a84f"

[[package]]
name = "windows_i686_gnu"
version = "0.52.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "88ba073cf16d5372720ec942a8ccbf61626074c6d4dd2e745299726ce8b89670"

[[package]]
name = "windows_i686_gnullvm"
version = "0.52.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "87f4261229030a858f36b459e748ae97545d6f1ec60e5e0d6a3d32e0dc232ee9"

[[package]]
name = "windows_i686_msvc"
version = "0.42.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "44d840b6ec649f480a41c8d80f9c65108b92d89345dd94027bfe06ac444d1060"

[[package]]
name = "windows_i686_msvc"
version = "0.52.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "db3c2bf3d13d5b658be73463284eaf12830ac9a26a90c717b7f771dfe97487bf"

[[package]]
name = "windows_x86_64_gnu"
version = "0.42.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "8de912b8b8feb55c064867cf047dda097f92d51efad5b491dfb98f6bbb70cb36"

[[package]]
name = "windows_x86_64_gnu"
version = "0.52.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "4e4246f76bdeff09eb48875a0fd3e2af6aada79d409d33011886d3e1581517d9"

[[package]]
name = "windows_x86_64_gnullvm"
version = "0.42.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "26d41b46a36d453748aedef1486d5c7a85db22e56aff34643984ea85514e94a3"

[[package]]
name = "windows_x86_64_gnullvm"
version = "0.52.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "852298e482cd67c356ddd9570386e2862b5673c85bd5f88df9ab6802b334c596"

[[package]]
name = "windows_x86_64_msvc"
version = "0.42.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9aec5da331524158c6d1a4ac0ab1541149c0b9505fde06423b02f5ef0106b9f0"

[[package]]
name = "windows_x86_64_msvc"
version = "0.52.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "bec47e5bfd1bff0eeaf6d8b485cc1074891a197ab4225d504cb7a1ab88b02bf0"

[[package]]
name = "wit-bindgen-rt"
version = "0.39.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "6f42320e61fe2cfd34354ecb597f86f413484a798ba44a8ca1165c58d42da6c1"
dependencies = [
 "bitflags 2.9.1",
]
```

--------------------------------------------------------------------------------

---[FILE: build/win32/Cargo.toml]---
Location: vscode-main/build/win32/Cargo.toml

```toml
[package]
name = "inno_updater"
version = "0.18.2"
authors = ["Microsoft <monacotools@microsoft.com>"]
build = "build.rs"

[dependencies]
byteorder = "1.4.3"
crc = "3.0.1"
slog = "2.7.0"
slog-async = "2.7.0"
slog-term = "2.9.1"
tempfile = "3.5.0"

[target.'cfg(windows)'.dependencies.windows-sys]
version = "0.42"
features = [
    "Win32_Foundation",
    "Win32_System_Shutdown",
    "Win32_UI_WindowsAndMessaging",
    "Win32_System_Threading",
    "Win32_System_LibraryLoader",
    "Win32_System_Diagnostics_Debug",
    "Win32_Storage_FileSystem",
    "Win32_Security",
    "Win32_System_ProcessStatus",
    "Win32_System_Diagnostics_ToolHelp"
]

[profile.release]
lto = true
panic = 'abort'
```

--------------------------------------------------------------------------------

````

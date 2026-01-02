---
source_txt: FULLSTACK_CODE_DATABASE_PART21_OPENH264_BUILD_CI_PACKAGING.txt
converted_utc: 2025-12-17T23:22:00Z
---

# FULLSTACK CODE DATABASE PART21 OPENH264 BUILD CI PACKAGING

## Verbatim Content

```text
FULLSTACK CODE DATABASE — PART 21 (OPENH264)
BUILD / CI / PACKAGING PATTERNS (MAKE + MESON + ANDROID + PKGCONFIG)


1) MAKE-BASED BUILD SYSTEM (PRIMARY)
Top-level: openh264-master/openh264-master/Makefile

Key reusable patterns:

A) Platform include strategy
- Detects OS + arch, then includes a platform fragment:
  - `build/platform-${OS}.mk` or `build/platform-android.mk`
- This keeps the root Makefile stable while platform details live in one place.

B) Feature flags via Make variables
- `BUILDTYPE=Release|Debug` toggles optimization, debug symbols, and asm.
- Optional toggles:
  - `USE_ASAN=Yes` adds sanitizer flags.
  - `GCOV=...` adds coverage flags.
  - `DEBUGSYMBOLS=True` creates stripped + debug-symbol variants.

C) Version header generation as a dependency edge
- `generate-version` target creates a generated header.
- Some compilation units depend on this target explicitly.

D) Optional dependency bootstrapping
- `make gmp-bootstrap` clones Mozilla gmp-api.
- `make gtest-bootstrap` clones googletest.
- `make test` runs unit tests when gtest exists.


2) MESON BUILD (SECONDARY, PORTABLE)
Top-level: openh264-master/openh264-master/meson.build

Key reusable patterns:

A) CPU-family branching to configure SIMD / asm
- Uses `host_machine.system()` + `host_machine.cpu_family()` to decide:
  - defines (`HAVE_AVX2`, `HAVE_NEON`, etc.)
  - include dirs for asm sources
  - generator toolchain (nasm vs gas-preprocessor vs armasm)

B) Assembly compilation via Meson generator
- For x86/x64, uses NASM with chosen format (elf/macho/win32/win64).
- For Windows ARM, uses gas-preprocessor conversion to build thumb.

C) Build outputs as a single library with link_whole
- `libopenh264 = library('openh264', link_whole: [libcommon, libprocessing, libencoder, libdecoder])`
- Declares dependency object `openh264_dep` for consumers.


3) ANDROID NDK TOOLCHAIN PATTERN
File: openh264-master/openh264-master/build/platform-android.mk

Key reusable patterns:

A) Toolchain parameterization
- Requires `NDKROOT` and `TARGET=android-XX`.
- Computes `NDKLEVEL` from TARGET if not given.
- Sets `ARCH` → `APP_ABI` mapping (arm/arm64/x86/x86_64).

B) Modern clang toolchain path resolution
- Uses NDK llvm prebuilt toolchain.
- Chooses `TARGET_NAME` like `aarch64-linux-android`.
- Defines CC/CXX/AR to the right clang binaries.

C) Hardening flags baseline
- Adds `-fpic -fstack-protector-all` and linker relro/now.

D) CPU feature plumbing on Android
- Includes Android NDK cpufeatures and maps symbols to “wels_” prefixed functions.


4) CI PATTERN (TRAVIS)
File: openh264-master/openh264-master/.travis.yml

Key reusable patterns:
- Installs nasm + multilib + meson/ninja.
- Builds both make + meson artifacts.
- Runs unit tests and a binary-compare suite across multiple sample bitstreams.
- Uses a matrix to skip expensive binary compares for clang.


5) PACKAGING PATTERNS

A) pkg-config
File: openh264-master/openh264-master/openh264.pc.in
- Template expands prefix/libdir/version.
- Exposes `-lopenh264` and include path.

B) Windows symbol exports
File: openh264-master/openh264-master/openh264.def
- Explicit export list (Create/Destroy encoder/decoder, version getters).
- Useful for stable ABI exports on Windows.


6) REUSABLE TAKEAWAYS
- Keep platform complexity in separate build fragments.
- Use generator tooling for asm to keep “one build description” across OS.
- Provide pkg-config + Windows .def for easy downstream integration.
- Treat tests as first-class build targets and CI matrix entries.

END PART 21

```

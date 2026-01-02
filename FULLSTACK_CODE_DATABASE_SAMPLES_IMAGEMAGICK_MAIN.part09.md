---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 9
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 9 of 851)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - ImageMagick-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/ImageMagick-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: bug-report.yml]---
Location: ImageMagick-main/.github/ISSUE_TEMPLATE/bug-report.yml

```yaml
name: Bug report
description: Create a report to help us improve
body:
- type: input
  attributes:
    label: ImageMagick version
    placeholder: 7.X.X-X
  validations:
    required: true
- type: dropdown
  attributes:
    label: Operating system
    options:
      - Linux
      - Windows
      - MacOS
      - Other (enter below)
  validations:
    required: true
- type: input
  attributes:
    label: Operating system, version and so on
  validations:
    required: true
- type: textarea
  attributes:
    label: Description
    description: A description of the bug or feature.
  validations:
    required: true
- type: textarea
  attributes:
    label: Steps to Reproduce
    description: List of steps, sample code, failing test or link to a project that reproduces the behavior. Make sure you place a stack trace inside a code (```) block to avoid linking unrelated issues.
  validations:
    required: true
- type: textarea
  attributes:
    label: Images
    description: Please upload images that can be used to reproduce issues in the area below. If the file type is not supported the file can be zipped and then uploaded instead. When you cannot provide an image that can be used to reproduce the issue, please provide an explanation why this is not possible.
  validations:
    required: true
```

--------------------------------------------------------------------------------

---[FILE: config.yml]---
Location: ImageMagick-main/.github/ISSUE_TEMPLATE/config.yml

```yaml
blank_issues_enabled: false
contact_links:
  - name: Ask question
    url: https://github.com/ImageMagick/ImageMagick/discussions/category_choices
    about: Ask a question about this project.
  - name: Bug report (ImageMagick 6)
    url: https://github.com/ImageMagick/ImageMagick6/issues/new?assignees=&labels=&template=bug-report.yml
    about: Create a report to help us improve ImagemMagick 6.
  - name: Bug report (Freds-Scripts)
    url: https://github.com/ImageMagick/Freds-Scripts/issues/new
    about: Create a report to help us improve Freds-Scripts.
```

--------------------------------------------------------------------------------

---[FILE: feature-request.yml]---
Location: ImageMagick-main/.github/ISSUE_TEMPLATE/feature-request.yml

```yaml
name: Feature request
description: Suggest an idea for this project
body:
- type: textarea
  attributes:
    label: Is your feature request related to a problem? Please describe.
    description: A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]
- type: textarea
  attributes:
    label: Describe the solution you'd like
    description: A clear and concise description of what you want to happen.
  validations:
    required: true
- type: textarea
  attributes:
    label: Describe alternatives you've considered
    description: A clear and concise description of any alternative solutions or features you've considered.
- type: textarea
  attributes:
    label: Additional context
    description: Add any other context or screenshots about the feature request here.
```

--------------------------------------------------------------------------------

---[FILE: codeql-analysis.yml]---
Location: ImageMagick-main/.github/workflows/codeql-analysis.yml

```yaml
on:
  workflow_dispatch:
  schedule:
  - cron: 0 6 * * *
  push:
    branches:
    - main
    paths:
    - .github/workflows/codeql-analysis.yml

name: Codeql analysis
permissions:
  contents: read
  security-events: write
jobs:
  c_cpp:
    name: Linux Q${{matrix.quantum}}-x64 hdri=${{matrix.hdri}} (${{matrix.modules}})
    runs-on: ubuntu-24.04

    strategy:
      fail-fast: false
      matrix:
        quantum: [ 16 ]
        hdri: [ yes ]
        modules: [ 'with-modules', 'without-modules' ]

    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 2
          persist-credentials: false

      - name: Install dependencies
        run: |
          set -e
          export DEBIAN_FRONTEND=noninteractive
          sudo apt-get update -y
          sudo apt-get install -y libltdl-dev

      - name: Configure ImageMagick
        run: |
          export CFLAGS="-Wno-deprecated-declarations"
          autoreconf -fiv
          ./configure --with-quantum-depth=${{matrix.quantum}} --enable-hdri=${{matrix.hdri}} --${{matrix.modules}}
          echo "" > config.status

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v4
        with:
          languages: c-cpp

      - name: Build ImageMagick
        run: |
          make

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v4

  actions:
    name: CodeQL analysis (GitHub Actions)
    runs-on: ubuntu-24.04

    steps:
      - uses: actions/checkout@v6
        with:
          persist-credentials: false

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v4
        with:
          languages: actions

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v4
```

--------------------------------------------------------------------------------

---[FILE: daily.yml]---
Location: ImageMagick-main/.github/workflows/daily.yml

```yaml
on:
  workflow_dispatch:
  schedule:
  - cron: 0 6 * * *
  push:
    branches:
    - main
    paths:
    - '.github/workflows/daily.yml'
  pull_request:
    branches:
    - main
    paths:
    - '.github/workflows/daily.yml'

name: Daily
permissions:
  contents: read
jobs:
  change_log:
    name: 'Create ChangeLog.md'
    runs-on: ubuntu-24.04

    steps:
      - name: Checkout
        uses: actions/checkout@v6
        with:
          fetch-depth: 0
          persist-credentials: false

      - name: Install dependencies
        run: npm install -g auto-changelog

      - name: Create ChangeLog.md
        run: |
          export NEXT_VERSION=$(grep -oP "PACKAGE_VERSION='\K[0-9\.-]*" configure)
          git tag $NEXT_VERSION
          auto-changelog --sort-commits date
          mkdir artifacts
          mv ChangeLog.md artifacts/ChangeLog.md

      - name: Upload ChangeLog.md
        uses: actions/upload-artifact@v5
        with:
          name: ChangeLog
          path: artifacts

  build_linux:
    name: 'Linux Q${{matrix.quantum}}-x64 hdri=${{matrix.hdri}} (${{matrix.modules}}) (${{ matrix.compiler }})'
    container:
      image: ubuntu:22.04
    runs-on: ubuntu-24.04

    strategy:
      fail-fast: false
      matrix:
        compiler: [ gcc, clang ]
        quantum: [ 8, 16, 32, 64 ]
        hdri: [ yes, no ]
        modules: [ 'with-modules', 'without-modules' ]
        exclude:
          - quantum: 8
            hdri: yes
          - quantum: 32
            hdri: no
          - quantum: 64
            hdri: no
        include:
          - compiler: gcc
            cxx_compiler: g++
            compiler_flags: -Wall -Wextra -Werror -Wno-builtin-declaration-mismatch
            packages: gcc g++
          - compiler: clang
            cxx_compiler: clang++
            compiler_flags: -Wall -Wextra -Werror -Wno-unused-function -Wno-incompatible-library-redeclaration -Wno-compound-token-split-by-macro
            packages: clang

    steps:
      - name: Install dependencies
        run: |
          set -e
          export DEBIAN_FRONTEND=noninteractive
          apt update
          apt-get install -y autoconf libfontconfig1-dev libfreetype6-dev libltdl-dev make pkg-config ${{ matrix.packages }}

      - name: Clone msttcorefonts
        uses: actions/checkout@v6
        with:
          repository: ImageMagick/msttcorefonts
          persist-credentials: false

      - name: Install msttcorefonts
        run: |
          set -e
          ./install.sh

      - uses: actions/checkout@v6
        with:
          persist-credentials: false

      - name: Configure ImageMagick
        env:
          CC: ${{ matrix.compiler }}
          CXX: ${{ matrix.cxx_compiler }}
          CFLAGS: ${{ matrix.compiler_flags }}
          CXXFLAGS: ${{ matrix.compiler_flags }}
        run: |
          ./configure --with-perl --with-quantum-depth=${{matrix.quantum}} --enable-hdri=${{matrix.hdri}} --${{matrix.modules}}

      - name: Build ImageMagick
        run: |
          make install

      - name: Test ImageMagick
        run: |
          make check || exit_code=$?
          if [ "$exit_code" != "0" ] ; then cat ./test-suite.log ; fi
          exit $exit_code

      - name: Test PerlMagick
        run: |
          cd PerlMagick
          make test TEST_VERBOSE=1

  build_windows:
    name: Windows ${{matrix.quantum}}${{matrix.hdri_flag}}-${{matrix.architecture}} (${{matrix.buildType}})
    needs:
      - change_log
    runs-on: windows-2022

    strategy:
      fail-fast: false
      matrix:
        architecture: [ x64, arm64, x86 ]
        buildType: [ dynamic, static ]
        quantum: [ Q8, Q16, Q32 ]
        hdri: [ hdri, noHdri ]
        exclude:
          - quantum: Q8
            hdri: hdri
          - quantum: Q32
            hdri: noHdri
        include:
          - hdri: hdri
            hdri_flag: -HDRI

    steps:
      - name: Clone ImageMagick
        uses: actions/checkout@v6
        with:
          path: ImageMagick
          persist-credentials: false

      - name: Download configure
        shell: cmd
        run: |
          ImageMagick\.github\build\windows\download-configure.cmd

      - name: Download dependencies
        shell: cmd
        run: |
          ImageMagick\.github\build\windows\download-dependencies.cmd windows-${{matrix.architecture}}-${{matrix.buildType}}-openMP.zip

      - name: Download ChangeLog.md
        uses: actions/download-artifact@v6
        with:
          name: ChangeLog
          path: ImageMagick

      - name: Configure ImageMagick
        shell: cmd
        working-directory: Configure
        run: |
          Configure.Release.x64.exe /noWizard /VS2022 /deprecated /${{matrix.architecture}} /${{matrix.buildType}} /${{matrix.quantum}} /${{matrix.hdri}}

      - name: Build ImageMagick
        shell: cmd
        run: |
          call "C:\Program Files\Microsoft Visual Studio\2022\Enterprise\Common7\Tools\VsDevCmd.bat"
          msbuild /m /t:Rebuild /p:Configuration=Release,Platform=${{matrix.architecture}}

  build_windows_zero_configuration:
    name: 'Windows Q16-HDRI-x64 (zero configuration ${{matrix.buildType}})'
    runs-on: windows-2022

    strategy:
      fail-fast: false
      matrix:
        buildType: [ dynamic, static ]

    steps:
      - name: Clone ImageMagick
        uses: actions/checkout@v6
        with:
          path: ImageMagick
          persist-credentials: false

      - name: Download configure
        shell: cmd
        run: |
          ImageMagick\.github\build\windows\download-configure.cmd

      - name: Download dependencies
        shell: cmd
        run: |
          ImageMagick\.github\build\windows\download-dependencies.cmd windows-x64-${{matrix.buildType}}-openMP.zip

      - name: Configure ImageMagick
        shell: cmd
        working-directory: Configure
        run: |
          Configure.Release.x64.exe /noWizard /VS2022 /x64 /${{matrix.buildType}} /zeroConfigurationSupport

      - name: Build ImageMagick
        shell: cmd
        run: |
          call "C:\Program Files\Microsoft Visual Studio\2022\Enterprise\Common7\Tools\VsDevCmd.bat"
          msbuild /m /t:Rebuild /p:Configuration=Release,Platform=x64

  build_msys2:
    name: MSYS2 Q16-${{matrix.toolchain}}
    runs-on: windows-2022

    strategy:
      matrix:
        include: [
          { msystem: clang64, toolchain: clang-x86_64 },
          { msystem: mingw64, toolchain: x86_64 },
          { msystem: ucrt64, toolchain: ucrt-x86_64 },
        ]
      fail-fast: false

    steps:
      - name: Prepare git
        run: git config --global core.autocrlf false

      - uses: actions/checkout@v6
        with:
          persist-credentials: false

      - uses: msys2/setup-msys2@fb197b72ce45fb24f17bf3f807a388985654d1f2 # v2.29.0
        with:
          install: mingw-w64-${{ matrix.toolchain }}-toolchain base-devel binutils
          update: true
          cache: false

      - name: Build ImageMagick
        run: cd .github/build/msys2 && makepkg-mingw --noconfirm --syncdeps
        env:
          MINGW_ARCH: ${{ matrix.msystem }}
          PKGEXT: ".pkg.tar.xz"
        shell: msys2 {0}
```

--------------------------------------------------------------------------------

---[FILE: doc-check.yml]---
Location: ImageMagick-main/.github/workflows/doc-check.yml

```yaml
on:
  push:
    branches:
    - main
    paths:
    - '.github/workflows/doc_check.yml'
  pull_request:
    branches:
    - main
    paths:
    - '.github/workflows/doc_check.yml'
  workflow_dispatch:
  schedule:
    - cron: 0 6 * * 1

name: Documentation check for Magick++
permissions:
  contents: read
jobs:
  doxygen-check:
    name: Documentation check
    runs-on: ubuntu-24.04

    steps:
      - uses: actions/checkout@v6
        with:
          persist-credentials: false

      - uses: actions/setup-python@v6
        with:
          python-version: '3.13'

      - name: Install Python dependencies
        run: python -m pip install --user pyarrow beautifulsoup4 pandas lxml

      - name: Install Doxygen
        run: sudo apt-get update && sudo apt-get install -y doxygen

      - name: Compare documentation
        run: |
          diff=""
          # first generate the Magick++ documentation to be up to date with the current code
          cd config && doxygen Magick++.dox.in &> /dev/null
          cd ..

          # documentation files with function signatures that we can compare with their corresponding doxygen file (currently)
          DOC_HTML=("Blob.html" "CoderInfo.html" "Geometry.html" "Image++.html" "Montage.html" "Pixels.html")
          DOXY_HTML=("Blob.html" "CoderInfo.html" "Geometry.html" "Image.html" "Montage.html" "Pixels.html")  # Image.html is the only one that differs from the doxygen file
          for i in "${!DOC_HTML[@]}"; do
              python3 .github/build/scripts/compare-signatures.py www/Magick++/"${DOC_HTML[$i]}" www/api/Magick++/classMagick_1_1"${DOXY_HTML[$i]}"
              if [ $? -eq -1 ]; then
                  diff="true"
              fi
          done

          if [ -n "$diff" ]; then
              echo "Mismatches detected!" && exit 1
          fi
          exit 0
```

--------------------------------------------------------------------------------

---[FILE: main.yml]---
Location: ImageMagick-main/.github/workflows/main.yml

```yaml
on:
  push:
    branches:
    - main
    tags:
    - '!*'
  pull_request:
    branches:
    - main

name: Main
permissions:
  contents: read
jobs:
  build_linux:
    name: Build Linux
    container:
      image: ubuntu:22.04
    runs-on: ubuntu-24.04

    strategy:
      fail-fast: false
      matrix:
        compiler: [ gcc, clang ]
        include:
          - compiler: gcc
            cxx_compiler: g++
            compiler_flags: -Wall -Wextra -Werror -Wno-builtin-declaration-mismatch
            packages: gcc g++
          - compiler: clang
            cxx_compiler: clang++
            compiler_flags: -Wall -Wextra -Werror -Wno-unused-function -Wno-incompatible-library-redeclaration
            packages: clang

    steps:
      - uses: actions/checkout@v6
        with:
          persist-credentials: false

      - name: Install dependencies
        run: |
          set -e
          export DEBIAN_FRONTEND=noninteractive
          apt-get update -y
          apt-get install -y autoconf git libtool make pkg-config ${{ matrix.packages }}

      - name: Configure ImageMagick
        env:
          CC: ${{ matrix.compiler }}
          CXX: ${{ matrix.cxx_compiler }}
          CFLAGS: ${{ matrix.compiler_flags }}
          CXXFLAGS: ${{ matrix.compiler_flags }}
        run: |
          autoreconf -fiv
          ./configure --with-quantum-depth=16 --enable-hdri=no --without-perl --prefix=/usr

      - name: Build ImageMagick
        run: |
          make

      - name: Test ImageMagick
        run: |
          make check || exit_code=$?
          if [ "$exit_code" != "0" ] ; then cat ./test-suite.log ; fi
          exit $exit_code

      - name: Install ImageMagick
        run: |
          make install

  build_macos:
    name: Build MacOS x64
    runs-on: macos-15-intel

    steps:
      - uses: actions/checkout@v6
        with:
          persist-credentials: false

      - name: Install dependencies
        run: |
          set -e
          export HOMEBREW_NO_AUTO_UPDATE=1
          brew install automake fftw flif jbigkit

      - name: Configure ImageMagick
        run: |
          export CFLAGS="-Wall -Wextra -Wdeclaration-after-statement -Wno-deprecated-declarations -Wno-incompatible-library-redeclaration -Wno-incompatible-pointer-types-discards-qualifiers -Wno-missing-declarations -Wno-unused-function -Wno-unused-parameter"
          autoreconf -fiv
          ./configure --with-quantum-depth=16 --enable-hdri=no --without-perl --with-fftw --with-flif

      - name: Build ImageMagick
        run: |
          set -e
          make install

  build_macos_arm64:
    name: Build MacOS arm64
    runs-on: macos-14

    steps:
      - uses: actions/checkout@v6
        with:
          persist-credentials: false

      - name: Install dependencies
        run: |
          set -e
          export HOMEBREW_NO_AUTO_UPDATE=1
          brew install automake fftw flif jbigkit libraqm librsvg libtool libxml2 pango

      - name: Configure ImageMagick
        run: |
          export CFLAGS="-Wall -Wextra -Werror -Wdeclaration-after-statement -Wno-deprecated-declarations -Wno-incompatible-library-redeclaration -Wno-incompatible-pointer-types-discards-qualifiers -Wno-missing-declarations -Wno-unused-function -Wno-unused-parameter"
          export LDFLAGS=$(pkg-config --libs libjpeg)
          autoreconf -fiv
          ./configure --with-quantum-depth=16 --enable-hdri=no --without-perl --with-fftw --with-flif --with-rsvg

      - name: Build ImageMagick
        run: |
          make

      - name: Test ImageMagick
        run: |
          make check || exit_code=$?
          if [ "$exit_code" != "0" ] ; then cat ./test-suite.log ; fi
          exit $exit_code

      - name: Install ImageMagick
        run: |
          sudo make install

  build_windows:
    name: Build Windows ${{matrix.architecture}}
    runs-on: windows-2022

    strategy:
      fail-fast: false
      matrix:
        architecture: [ x64, arm64, x86 ]

    steps:
      - name: Clone ImageMagick
        uses: actions/checkout@v6
        with:
          path: ImageMagick
          persist-credentials: false

      - name: Download configure
        shell: cmd
        run: |
          ImageMagick\.github\build\windows\download-configure.cmd

      - name: Download dependencies
        shell: cmd
        run: |
          ImageMagick\.github\build\windows\download-dependencies.cmd windows-${{matrix.architecture}}-static-openMP.zip

      - name: Configure ImageMagick
        shell: cmd
        working-directory: Configure
        run: |
          Configure.Release.x64.exe /noWizard /VS2022 /${{matrix.architecture}} /static

      - name: Build ImageMagick
        shell: cmd
        run: |
          call "C:\Program Files\Microsoft Visual Studio\2022\Enterprise\Common7\Tools\VsDevCmd.bat"
          msbuild IM7.Static.${{matrix.architecture}}.sln /m /t:Rebuild /p:Configuration=Release,Platform=${{matrix.architecture}}

  build_msys2:
    name: Build MSYS2
    runs-on: windows-2022

    steps:
      - name: Prepare git
        run: git config --global core.autocrlf false

      - uses: actions/checkout@v6
        with:
          persist-credentials: false

      - uses: msys2/setup-msys2@fb197b72ce45fb24f17bf3f807a388985654d1f2 # v2.29.0
        with:
          install: mingw-w64-x86_64-toolchain base-devel binutils
          update: true
          cache: false

      - name: Build ImageMagick
        run: cd .github/build/msys2 && makepkg-mingw --noconfirm --syncdeps
        env:
          MINGW_ARCH: mingw64
          PKGEXT: ".pkg.tar.xz"
        shell: msys2 {0}
```

--------------------------------------------------------------------------------

---[FILE: release.yml]---
Location: ImageMagick-main/.github/workflows/release.yml

```yaml
on:
  workflow_dispatch:
  schedule:
  - cron: 0 6 * * *
  push:
    branches:
    - main
    paths:
    - configure
    - m4/version.m4
    - .github/build/windows/download-configure.sh
    - .github/build/windows/download-dependencies.sh
    - .github/workflows/release.yml
  pull_request:
    branches:
    - main
    paths:
    - .github/workflows/release.yml

name: Release
permissions:
  contents: read
jobs:
  version:
    name: Set version
    runs-on: ubuntu-24.04
    outputs:
      version: ${{steps.version.outputs.version}}
      semantic_version: ${{steps.version.outputs.semantic_version}}
      publish: ${{steps.version.outputs.publish}}

    steps:
      - name: Clone ImageMagick
        uses: actions/checkout@v6
        with:
          fetch-depth: 0
          persist-credentials: false

      - name: Set version
        id: version
        run: |
          version=$(grep -oP "PACKAGE_VERSION='\K[0-9\.-]*" configure)
          semantic_version="${version/-/.}"
          echo "version=$version" >> $GITHUB_OUTPUT
          echo "version=$version"
          echo "semantic_version=$semantic_version" >> $GITHUB_OUTPUT
          echo "semantic_version=$semantic_version"
          tag=$(git describe --tags HEAD --exact-match || true)
          if [[ "$tag" == "$version" ]]; then
            echo "publish=true" >> $GITHUB_OUTPUT
            echo "publish=true"
          fi

  changelog:
    name: Create ChangeLog.md
    runs-on: ubuntu-24.04
    needs:
      - version

    steps:
      - name: Clone ImageMagick
        uses: actions/checkout@v6
        with:
          fetch-depth: 0
          persist-credentials: false

      - name: Install dependencies
        run: npm install -g auto-changelog

      - name: Create ChangeLog.md
        env:
          VERSION: ${{needs.version.outputs.version}}
        run: |
          if ! git tag -l | grep -q "^$VERSION$"; then
            git tag $VERSION
          fi
          auto-changelog --sort-commits date
          mkdir -p Artifacts
          mv ChangeLog.md Artifacts/ChangeLog.md

      - name: Upload ChangeLog.md
        uses: actions/upload-artifact@v5
        with:
          name: ChangeLog
          path: Artifacts

  windows_installer:
    name: Windows ${{matrix.quantum}}${{matrix.hdri_flag}}-${{matrix.architecture}} (${{matrix.buildType}})
    runs-on: windows-2022
    needs:
      - changelog
      - version

    permissions:
      contents: read
      id-token: write

    strategy:
      fail-fast: false
      matrix:
        architecture: [ x64, arm64, x86 ]
        buildType: [ dynamic, static ]
        quantum: [ Q16, Q8 ]
        hdri: [ hdri, noHdri ]
        exclude:
          - quantum: Q8
            hdri: hdri
        include:
          - architecture: x64
            bit: 64
          - architecture: arm64
            bit: 64
          - architecture: x86
            bit: 32
          - buildType: dynamic
            typeName: dll
          - buildType: static
            typeName: static
          - hdri: hdri
            hdri_flag: -HDRI

    steps:
      - name: Install Strawberry Perl
        if: ${{matrix.buildType == 'dynamic' && matrix.architecture != 'arm64'}}
        shell: cmd
        run: |
          powershell Invoke-WebRequest -Uri https://github.com/ImageMagick/Windows/releases/download/build-binaries-2025-08-30/strawberry-perl-5.30.2.1-${{matrix.bit}}bit.msi -OutFile strawberry-perl-5.30.2.1-${{matrix.bit}}bit.msi
          msiexec /i strawberry-perl-5.30.2.1-${{matrix.bit}}bit.msi /qn INSTALLDIR="C:\Strawberry${{matrix.bit}}"
          mv "C:\Strawberry" "C:\Strawberry64"

      - name: Install Inno Setup
        shell: cmd
        run: |
          powershell Invoke-WebRequest -Uri https://github.com/ImageMagick/Windows/releases/download/build-binaries-2025-08-30/innosetup-6.2.0.exe -OutFile innosetup-6.2.0.exe
          innosetup-6.2.0.exe /SILENT /SUPPRESSMSGBOXES /NORESTART /SP-

      - name: Clone ImageMagick
        uses: actions/checkout@v6
        with:
          path: ImageMagick
          persist-credentials: false

      - name: Download configure
        shell: cmd
        run: |
          ImageMagick\.github\build\windows\download-configure.cmd

      - name: Download dependencies
        shell: cmd
        run: |
          ImageMagick\.github\build\windows\download-dependencies.cmd windows-${{matrix.architecture}}-${{matrix.buildType}}-openMP.zip

      - name: Download ChangeLog.md
        uses: actions/download-artifact@v6
        with:
          name: ChangeLog
          path: ImageMagick

      - name: Configure ImageMagick
        shell: cmd
        working-directory: Configure
        run: |
          Configure.Release.x64.exe /noWizard /VS2022 /installedSupport /deprecated /${{matrix.hdri}} /${{matrix.quantum}} /${{matrix.architecture}} /${{matrix.buildType}}

      - name: Build ImageMagick
        shell: cmd
        run: |
          call "C:\Program Files\Microsoft Visual Studio\2022\Enterprise\Common7\Tools\VsDevCmd.bat"
          msbuild /m /t:Rebuild /p:Configuration=Release,Platform=${{matrix.architecture}}

      - name: Build PerlMagick
        if: ${{matrix.buildType == 'dynamic' && matrix.architecture != 'arm64'}}
        shell: cmd
        run: |
          set PATH=
          call "C:\Program Files\Microsoft Visual Studio\2022\Enterprise\Common7\Tools\VsDevCmd.bat"
          cd ImageMagick\PerlMagick
          set PATH=%PATH%;C:\Strawberry${{matrix.bit}}\c\bin;C:\Strawberry${{matrix.bit}}\perl\site\bin;C:\Strawberry${{matrix.bit}}\perl\bin;C:\WINDOWS\System32\WindowsPowerShell\v1.0
          perl "Makefile.PL" "MAKE=nmake" "CC=g++"
          nmake
          nmake release

      - name: Sign executables and libraries
        uses: ImageMagick/.github/actions/code-signing@757a0d61ad4171546b1056ac46263630037a4fc7
        with:
          client-id: ${{secrets.AZURE_CLIENT_ID}}
          tenant-id: ${{secrets.AZURE_TENANT_ID}}
          subscription-id: ${{secrets.AZURE_SUBSCRIPTION_ID}}
          directory: Artifacts\bin

      - name: Create installer
        shell: cmd
        run: |
          call "C:\Program Files\Microsoft Visual Studio\2022\Enterprise\Common7\Tools\VsDevCmd.bat"
          "C:\Program Files (x86)\Inno Setup 6\iscc.exe" Configure\Installer\Inno\ImageMagick.iss

      - name: Sign installer
        uses: ImageMagick/.github/actions/code-signing@757a0d61ad4171546b1056ac46263630037a4fc7
        with:
          client-id: ${{secrets.AZURE_CLIENT_ID}}
          tenant-id: ${{secrets.AZURE_TENANT_ID}}
          subscription-id: ${{secrets.AZURE_SUBSCRIPTION_ID}}
          directory: Configure\Installer\Inno\Artifacts

      - uses: actions/upload-artifact@v5
        with:
          name: ImageMagick-${{needs.version.outputs.version}}-${{matrix.quantum}}${{matrix.hdri_flag}}-${{matrix.typeName}}-${{matrix.architecture}}.exe
          path: Configure\Installer\Inno\Artifacts

  windows_source:
    name: Windows source
    runs-on: windows-2022
    needs:
      - changelog
      - version

    steps:
      - name: Clone ImageMagick/Windows
        uses: actions/checkout@v6
        with:
          repository: ImageMagick/Windows
          ref: refs/heads/main
          persist-credentials: false

      - name: Clone repositories
        shell: cmd
        run: |
          clone-repositories-im7.cmd

      - name: Download ChangeLog.md
        uses: actions/download-artifact@v6
        with:
          name: ChangeLog
          path: ImageMagick

      - name: Create source archive
        shell: cmd
        env:
          VERSION: ${{needs.version.outputs.version}}
        run: |
          mkdir source
          move Configure source
          move Dependencies source
          move ImageMagick source
          7z a ImageMagick-%VERSION%-Windows.7z .\source\*

      - uses: actions/upload-artifact@v5
        with:
          name: ImageMagick-${{needs.version.outputs.version}}-Windows.7z
          path: ImageMagick-${{needs.version.outputs.version}}-Windows.7z

  windows_portable:
    name: Windows portable ${{matrix.quantum}}${{matrix.hdri_flag}}-${{matrix.architecture}}
    runs-on: windows-2022
    needs:
      - changelog
      - version

    permissions:
      contents: read
      id-token: write

    strategy:
      fail-fast: false
      matrix:
        architecture: [ x64, arm64, x86 ]
        quantum: [ Q16, Q8 ]
        hdri: [ hdri, noHdri ]
        exclude:
          - quantum: Q8
            hdri: hdri
        include:
          - hdri: hdri
            hdri_flag: -HDRI

    steps:
      - name: Clone ImageMagick
        uses: actions/checkout@v6
        with:
          path: ImageMagick
          persist-credentials: false

      - name: Download configure
        shell: cmd
        run: |
          ImageMagick\.github\build\windows\download-configure.cmd

      - name: Download dependencies
        shell: cmd
        run: |
          ImageMagick\.github\build\windows\download-dependencies.cmd windows-${{matrix.architecture}}-static-openMP-linked-runtime.zip

      - name: Download ChangeLog.md
        uses: actions/download-artifact@v6
        with:
          name: ChangeLog
          path: ImageMagick

      - name: Configure ImageMagick
        shell: cmd
        working-directory: Configure
        run: |
          Configure.Release.x64.exe /noWizard /VS2022 /${{matrix.hdri}} /${{matrix.quantum}} /${{matrix.architecture}} /static /linkRuntime

      - name: Build ImageMagick
        shell: cmd
        run: |
          call "C:\Program Files\Microsoft Visual Studio\2022\Enterprise\Common7\Tools\VsDevCmd.bat"
          msbuild /m /t:Rebuild /p:Configuration=Release,Platform=${{matrix.architecture}}

      - name: Sign executables and libraries
        uses: ImageMagick/.github/actions/code-signing@757a0d61ad4171546b1056ac46263630037a4fc7
        with:
          client-id: ${{secrets.AZURE_CLIENT_ID}}
          tenant-id: ${{secrets.AZURE_TENANT_ID}}
          subscription-id: ${{secrets.AZURE_SUBSCRIPTION_ID}}
          directory: Artifacts\bin

      - name: Copy Files
        shell: pwsh
        env:
          VERSION: ${{needs.version.outputs.version}}
        run: |
          [void](New-Item -Name "portable" -ItemType directory)
          Copy-Item "Artifacts\bin\*.exe" "portable"
          Copy-Item "Artifacts\bin\*.xml" "portable"
          Copy-Item "Artifacts\bin\sRGB.icc" "portable"

          Copy-Item "Artifacts\NOTICE.txt" "portable"
          Copy-Item "ImageMagick\ChangeLog.md" "portable"
          Copy-Item "ImageMagick\LICENSE" "portable\LICENSE.txt"
          7z a "ImageMagick-$env:VERSION-portable-${{matrix.quantum}}${{matrix.hdri_flag}}-${{matrix.architecture}}.7z" .\portable\*

      - uses: actions/upload-artifact@v5
        with:
          name: ImageMagick-${{needs.version.outputs.version}}-portable-${{matrix.quantum}}${{matrix.hdri_flag}}-${{matrix.architecture}}.7z
          path: ImageMagick-${{needs.version.outputs.version}}-portable-${{matrix.quantum}}${{matrix.hdri_flag}}-${{matrix.architecture}}.7z

  windows_msix:
    name: Create Msix ${{matrix.quantum}}${{matrix.hdri_flag}}
    if: github.event_name != 'pull_request'
    runs-on: windows-2022
    environment: release
    needs:
      - version
      - windows_portable

    permissions:
      contents: read
      id-token: write

    strategy:
      fail-fast: false
      matrix:
        quantum: [ Q16, Q8 ]
        hdri: [ hdri, noHdri ]
        exclude:
          - quantum: Q8
            hdri: hdri
        include:
          - hdri: hdri
            hdri_flag: -HDRI

    steps:
      - name: Clone ImageMagick-Windows
        uses: actions/checkout@v6
        with:
          repository: ImageMagick/ImageMagick-Windows
          path: ImageMagick-Windows
          persist-credentials: false

      - name: Download x64 artifacts
        uses: actions/download-artifact@v6
        with:
          name: ImageMagick-${{needs.version.outputs.version}}-portable-${{matrix.quantum}}${{matrix.hdri_flag}}-x64.7z
          path: ImageMagick-Windows\Installer\Msix\x64

      - name: Download arm64 artifacts
        uses: actions/download-artifact@v6
        with:
          name: ImageMagick-${{needs.version.outputs.version}}-portable-${{matrix.quantum}}${{matrix.hdri_flag}}-arm64.7z
          path: ImageMagick-Windows\Installer\Msix\arm64

      - name: Unzip artifacts
        shell: pwsh
        env:
          VERSION: ${{needs.version.outputs.version}}
        run: |
          cd ImageMagick-Windows\Installer\Msix\x64
          7z x "ImageMagick-$env:VERSION-portable-${{matrix.quantum}}${{matrix.hdri_flag}}-x64.7z"
          cd ../arm64
          7z x "ImageMagick-$env:VERSION-portable-${{matrix.quantum}}${{matrix.hdri_flag}}-arm64.7z"

      - name: Azure CLI login with federated credential
        uses: azure/login@a457da9ea143d694b1b9c7c869ebb04ebe844ef5 # v2.3.0
        with:
          client-id: ${{secrets.AZURE_CLIENT_ID}}
          tenant-id: ${{secrets.AZURE_TENANT_ID}}
          subscription-id: ${{secrets.AZURE_SUBSCRIPTION_ID}}

      - name: Create msixbundle with Advanced Installer
        uses: caphyon/advinst-github-action@f7e45a75aba48b695fafc344f61adf634d41fe4e # v2.0
        with:
          advinst-license: ${{secrets.ADVINST_LICENSE_KEY}}
          aip-path: ImageMagick-Windows\Installer\Msix\ImageMagick.${{matrix.quantum}}${{matrix.hdri_flag}}.aip
          aip-build-name: Build_MSIX
          aip-commands: |
              SetVersion ${{needs.version.outputs.semantic_version}}

      - uses: actions/upload-artifact@v5
        with:
          name: ImageMagick.${{matrix.quantum}}${{matrix.hdri_flag}}.msixbundle
          path: ImageMagick-Windows\Installer\Msix\Artifacts\ImageMagick.${{matrix.quantum}}${{matrix.hdri_flag}}.msixbundle

  linux_app_image:
    name: Linux AppImage
    container:
      image: ubuntu:22.04
    runs-on: ubuntu-24.04

    strategy:
      matrix:
        compiler: [ gcc, clang ]
        include:
          - compiler: gcc
            cxx_compiler: g++
            packages: gcc g++
          - compiler: clang
            cxx_compiler: clang++
            packages: clang

    steps:
      - name: Install dependencies
        run: |
          set -e
          export DEBIAN_FRONTEND=noninteractive
          apt-get update -y
          apt-get install -y autoconf curl file fuse git kmod squashfs-tools libbz2-dev libdjvulibre-dev libfontconfig-dev libfreetype6-dev libfribidi-dev libharfbuzz-dev libheif-dev liblcms-dev libopenexr-dev libopenjp2-7-dev libturbojpeg0-dev liblqr-dev libraqm-dev libtiff-dev libwebp-dev libx11-dev libxml2-dev liblzma-dev make software-properties-common wget ${{matrix.packages}}

      - name: Checkout
        uses: actions/checkout@v6
        with:
          persist-credentials: false

        # Avoid fatal: detected dubious ownership in repository at '/__w/ImageMagick/ImageMagick'
        # Possible workaround: https://github.com/actions/runner/issues/2033#issuecomment-1598547465
      - name: Flag current workspace as safe for git
        run: git config --global --add safe.directory ${GITHUB_WORKSPACE}

      - name: Download AppImage
        run: |
          mkdir /app-image
          cd /app-image
          wget -c "https://github.com/probonopd/linuxdeployqt/releases/download/continuous/linuxdeployqt-continuous-x86_64.AppImage"
          chmod a+x linuxdeployqt-continuous-x86_64.AppImage
          ./linuxdeployqt-continuous-x86_64.AppImage --appimage-extract

      - name: Build ImageMagick
        env:
          CFLAGS: -Wno-deprecated-declarations -Wdeclaration-after-statement -Wno-error=unused-variable
          CC: ${{matrix.compiler}}
          CXX: ${{matrix.cxx_compiler}}
        run: |
          set -e
          ./configure --with-quantum-depth=16 --without-magick-plus-plus --without-perl --prefix=/usr
          make
          make install DESTDIR=$(readlink -f /appdir)

      - name: Create ImageMagick AppImage
        run: |
          set -e
          mkdir -p /appdir/usr/share/applications/
          cp ./app-image/imagemagick.desktop /appdir/usr/share/applications/
          mkdir -p /appdir/usr/share/icons/hicolor/128x128/apps/
          cp ./app-image/icon.png /appdir/usr/share/icons/hicolor/128x128/apps/imagemagick.png
          unset QTDIR
          unset QT_PLUGIN_PATH
          unset LD_LIBRARY_PATH
          export VERSION=$(git rev-parse --short HEAD)-${{matrix.compiler}}
          /app-image/linuxdeployqt-continuous-x86_64.AppImage --appimage-extract-and-run /appdir/usr/share/applications/imagemagick.desktop -bundle-non-qt-libs
          rm /appdir/AppRun
          cp ./app-image/AppRun /appdir
          chmod a+x /appdir/AppRun
          PATH=/app-image/squashfs-root/usr/bin:$PATH
          /app-image/squashfs-root/usr/bin/appimagetool -g /appdir/
          mkdir artifacts
          cp ImageMagick-$VERSION-x86_64.AppImage artifacts
          find /appdir -executable -type f -exec ldd {} \; | grep " => /usr" | cut -d " " -f 2-3 | sort | uniq

      - name: Upload ImageMagick AppImage
        uses: actions/upload-artifact@v5
        with:
          name: AppImage-${{matrix.compiler}}
          path: artifacts


  release:
    name: Publish Release
    if: ${{ needs.version.outputs.publish == 'true' }}
    runs-on: ubuntu-24.04
    needs:
      - version
      - windows_installer
      - windows_portable
      - windows_source
      - windows_msix
      - linux_app_image

    permissions:
      contents: write

    steps:
      - name: Clone ImageMagick
        uses: actions/checkout@v6
        with:
          persist-credentials: false

      - name: Download artifacts
        uses: actions/download-artifact@v6
        with:
          path: artifacts
          merge-multiple: true

      - name: Publish release
        env:
          GH_TOKEN: ${{github.token}}
          VERSION: ${{needs.version.outputs.version}}
        run: gh release create $VERSION --title "$VERSION" ${{github.workspace}}/artifacts/*.7z ${{github.workspace}}/artifacts/*.exe ${{github.workspace}}/artifacts/*.msixbundle ${{github.workspace}}/artifacts/*.AppImage

  release_msix:
    name: Publish Msix ${{matrix.quantum}}${{matrix.hdri_flag}}
    needs:
      - version
      - release
    runs-on: windows-2025

    strategy:
      fail-fast: false
      matrix:
        quantum: [ Q16, Q8 ]
        hdri: [ hdri, noHdri ]
        exclude:
          - quantum: Q8
            hdri: hdri
        include:
          - hdri: hdri
            hdri_flag: -HDRI

    steps:
      - name: Install wingetcreate
        run: winget install wingetcreate --disable-interactivity --accept-source-agreements

      - name: Update manifest on winget
        env:
          VERSION: ${{needs.version.outputs.version}}
          SEMANTIC_VERSION: ${{needs.version.outputs.semantic_version}}
        run: wingetcreate update --submit --replace --token ${{secrets.WINGET_TOKEN}} --urls "https://github.com/ImageMagick/ImageMagick/releases/download/$env:VERSION/ImageMagick.${{matrix.quantum}}${{matrix.hdri_flag}}.msixbundle" --version $env:SEMANTIC_VERSION "ImageMagick.${{matrix.quantum}}${{matrix.hdri_flag}}"
```

--------------------------------------------------------------------------------

````

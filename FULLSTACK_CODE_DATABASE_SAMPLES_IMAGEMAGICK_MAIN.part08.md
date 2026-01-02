---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 8
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 8 of 851)

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

---[FILE: README.md]---
Location: ImageMagick-main/README.md

```text
# ImageMagick

[![Build Status](https://github.com/ImageMagick/ImageMagick/workflows/main/badge.svg)](https://github.com/ImageMagick/ImageMagick/actions)
[![Fuzzing Status](https://oss-fuzz-build-logs.storage.googleapis.com/badges/imagemagick.svg)](https://issues.oss-fuzz.com/issues?q=%22project%20ImageMagick%22)
[![Donate](https://img.shields.io/badge/%24-donate-ff00ff.svg)](https://github.com/sponsors/ImageMagick)

<p align="center">
<img align="center" src="https://imagemagick.org/image/wizard.png" alt="ImageMagick logo" width="265" height="353"/>
</p>

[ImageMagick®](https://imagemagick.org/) is a free and [open-source](https://imagemagick.org/script/license.php) software suite, used for editing and manipulating digital images. It can be used to create, edit, compose, or convert bitmap images, and supports a wide range of file [formats](https://imagemagick.org/script/formats.php), including JPEG, PNG, GIF, TIFF, and PDF.

## What is ImageMagick?

ImageMagick is widely used in industries such as web development, graphic design, and video editing, as well as in scientific research, medical imaging, and astronomy. Its versatile and customizable nature, along with its robust image processing capabilities, make it a popular choice for a wide range of image-related tasks.

ImageMagick includes a command-line interface for executing complex image processing tasks, as well as APIs for integrating its features into software applications. It is written in C and can be used on a variety of operating systems, including Linux, Windows, and macOS.

The main website for ImageMagick can be found at [https://imagemagick.org](https://imagemagick.org/). The source code for this software can be accessed through a [repository](https://github.com/ImageMagick/ImageMagick). In addition, we maintain a legacy version of ImageMagick [version 6](https://legacy.imagemagick.org/).

Creating a security policy that fits your specific local environment before making use of ImageMagick is highly advised. You can find guidance on setting up this [policy](https://imagemagick.org/script/security-policy.php). Also, it's important to verify your policy using the [validation tool](https://imagemagick.org/script/security-policy.php).

## Features and Capabilities

One of the key features of ImageMagick is its support for scripting and automation. This allows users to create complex image manipulation pipelines that can be run automatically, without the need for manual intervention. This can be especially useful for tasks that require the processing of large numbers of images, or for tasks that need to be performed on a regular basis.

In addition to its core image manipulation capabilities, ImageMagick also includes a number of other features, such as support for animation, color management, and image rendering. These features make it a versatile tool for a wide range of image-related tasks, including graphic design, scientific visualization, and digital art.

Overall, ImageMagick is a powerful and versatile software suite for displaying, converting, and editing image files. Its support for scripting and automation, along with its other features, make it a valuable tool for a wide range of image-related tasks.

Here are just a few [examples](https://imagemagick.org/script/examples.php) of what ImageMagick can do:

* [Animation](https://imagemagick.org/script/command-line-options.php#bilateral-blur): non-linear, edge-preserving, and noise-reducing smoothing filter.
* [Bilateral Blur](https://imagemagick.org/script/command-line-options.php#bilateral-blur): non-linear, edge-preserving, and noise-reducing smoothing filter.
* [Color management](https://imagemagick.org/script/color-management.php): accurate color management with color profiles or in lieu of-- built-in gamma compression or expansion as demanded by the colorspace.
* [Color thresholding](https://imagemagick.org/script/color-management.php) force all pixels in the color range to white otherwise black.
* [Command-line processing](https://imagemagick.org/script/command-line-processing.php) utilize ImageMagick from the command-line.
* [Complex text layout](https://en.wikipedia.org/wiki/Complex_text_layout) bidirectional text support and shaping.
* [Composite](https://imagemagick.org/script/composite.php): overlap one image over another.
* [Connected component labeling](https://imagemagick.org/script/connected-components.php): uniquely label connected regions in an image.
* [Convex hull](https://imagemagick.org/script/convex-hull.php) smallest area convex polygon containing the image foreground objects. In addition, the minimum bounding box and unrotate angle are also generated.
* [Decorate](https://imagemagick.org/Usage/crop/): add a border or frame to an image.
* [Delineate image features](https://imagemagick.org/Usage/transform/#vision): Canny edge detection, mean-shift, Hough lines.
* [Discrete Fourier transform](https://imagemagick.org/Usage/fourier/): implements the forward and inverse [DFT](http://en.wikipedia.org/wiki/Discrete_Fourier_transform).
* [Distributed pixel cache](https://imagemagick.org/script/distribute-pixel-cache.php): offload intermediate pixel storage to one or more remote servers.
* [Draw](https://imagemagick.org/Usage/draw/): add shapes or text to an image.
* [Encipher or decipher an image](https://imagemagick.org/script/cipher.php): convert ordinary images into unintelligible gibberish and back again.
* [Format conversion](https://imagemagick.org/script/convert.php): convert an image from one [format](https://imagemagick.org/script/formats.php) to another (e.g.  PNG to JPEG).
* [Generalized pixel distortion](https://imagemagick.org/Usage/distorts/): correct for, or induce image distortions including perspective.
* [Heterogeneous distributed processing](https://imagemagick.org/script/architecture.php#distributed): certain algorithms are OpenCL-enabled to take advantage of speed-ups offered by executing in concert across heterogeneous platforms consisting of CPUs, GPUs, and other processors.
* [High dynamic-range images](https://imagemagick.org/script/high-dynamic-range.php): accurately represent the wide range of intensity levels found in real scenes ranging from the brightest direct sunlight to the deepest darkest shadows.
* [Histogram equalization](https://imagemagick.org/script/clahe.php) use adaptive histogram equalization to improve contrast in images.
* [Image cache](https://imagemagick.org/script/magick-cache.php): secure methods and tools to cache images, image sequences, video, audio or metadata in a local folder.
* [Image calculator](https://imagemagick.org/script/fx.php): apply a mathematical expression to an image or image channels.
* [Image gradients](https://imagemagick.org/script/gradient.php): create a gradual blend of one color whose shape is horizontal, vertical, circular, or elliptical.
* [Image identification](https://imagemagick.org/script/identify.php): describe the format and attributes of an image.
* [ImageMagick on the iPhone](https://imagemagick.org/script/download.php#iOS): convert, edit, or compose images on your iPhone.
* [Large image support](https://imagemagick.org/script/architecture.php#tera-pixel): read, process, or write mega-, giga-, or tera-pixel image sizes.
* [Montage](https://imagemagick.org/script/montage.php): juxtapose image thumbnails on an image canvas.
* [Morphology of shapes](https://imagemagick.org/Usage/morphology/): extract features, describe shapes and recognize patterns in images.
* [Motion picture support](https://imagemagick.org/script/motion-picture.php): read and write the common image formats used in digital film work.
* [Multispectral imagery](https://imagemagick.org/script/multispectral-imagery.php): support multispectral imagery up to 64 bands.
* [Noise and color reduction](https://imagemagick.org/Usage/transform/#vision) Kuwahara Filter, mean-shift.
* [Perceptual hash](http://www.fmwconcepts.com/misc_tests/perceptual_hash_test_results_510/index.html): maps visually identical images to the same or similar hash-- useful in image retrieval, authentication, indexing, or copy detection as well as digital watermarking.
* [Special effects](https://imagemagick.org/Usage/blur/): blur, sharpen, threshold, or tint an image.
* [Text & comments](https://imagemagick.org/Usage/text/): insert descriptive or artistic text in an image.
* [Threads of execution support](https://imagemagick.org/script/architecture.php#threads): ImageMagick is thread safe and most internal algorithms are OpenMP-enabled to take advantage of speed-ups offered by multicore processor chips.
* [Transform](https://imagemagick.org/Usage/resize/): resize, rotate, deskew, crop, flip or trim an image.
* [Transparency](https://imagemagick.org/Usage/masking/): render portions of an image invisible.
* [Virtual pixel support](https://imagemagick.org/script/architecture.php#virtual-pixels): convenient access to pixels outside the image region.

[Examples of ImageMagick Usage](https://imagemagick.org/Usage/), demonstrates how to use the software from the [command line](https://imagemagick.org/script/command-line-processing.php) to achieve various effects. There are also several scripts available on the website called [Fred's ImageMagick Scripts](http://www.fmwconcepts.com/imagemagick/), which can be used to apply geometric transforms, blur and sharpen images, remove noise, and perform other operations. Additionally, there is a tool called [Magick.NET](https://github.com/dlemstra/Magick.NET) that allows users to access the functionality of ImageMagick without having to install the software on their own systems. Finally, the website also includes a [Cookbook](http://im.snibgo.com/) with tips and examples for using ImageMagick on Windows systems.

## News

Creating a security policy that fits your specific local environment before making use of ImageMagick is highly advised. You can find guidance on setting up this [policy](https://imagemagick.org/script/security-policy.php). Also, it's important to verify your policy using the [validation tool](https://imagemagick-secevaluator.doyensec.com/). As of ImageMagick version 7.1.1-16, you can choose and customize one of these [security policies](https://imagemagick.org/script/security-policy.php): Open, Limited, Secure, and Websafe.

By default, ImageMagick supports up to 32 channels. As of ImageMagick version 7.1.1-16, you can enable up to 64 channels by adding the **--enable-64bit-channel-masks** option to the Linux configure build script. For Windows this will be enabled automatically.


Want more performance from ImageMagick? Try these options:

* add more memory to your system, see the [pixel cache](https://imagemagick.org/script/architecture.php#cache);
* add more cores to your system, see [threads of execution support](https://imagemagick.org/script/architecture.php#threads);
* reduce lock contention with the [tcmalloc](http://goog-perftools.sourceforge.net/doc/tcmalloc.html) memory allocation library;
* push large images to a solid-state drive, see [large image support](https://imagemagick.org/script/architecture.php#tera-pixel).

If these options are prohibitive, you can reduce the quality of the image results. The default build is Q16 HDRI. If you disable [HDRI](https://imagemagick.org/script/high-dynamic-range.php), you use half the memory and instead of predominantly floating point operations, you use the typically more efficient integer operations. The tradeoff is reduced precision and you cannot process out of range pixel values (e.g. negative). If you build the Q8 non-HDRI version of ImageMagick, you again reduce the memory requirements in half-- and once again there is a tradeoff, even less precision and no out of range pixel values. For a Q8 non-HDRI build of ImageMagick, use these configure script options: **--with-quantum-depth=8 --disable-hdri**.
```

--------------------------------------------------------------------------------

---[FILE: winpath.sh]---
Location: ImageMagick-main/winpath.sh

```bash
#!/bin/sh
# Copyright © 1999 ImageMagick Studio LLC
# Copyright (C) 2003 - 2008 GraphicsMagick Group
#
# This program is covered by multiple licenses, which are described in
# LICENSE. You should have received a copy of LICENSE with this
# package; otherwise see https://imagemagick.org/script/license.php.
#
# Convert the specified POSIX path to a Windows path under MinGW and Cygwin
# The optional second parameter specifies the level of backslash escaping
# to apply for each Windows backslash position in order to support varying
# levels of variable substitutions in scripts.
#
# Note that Cygwin includes the 'cygpath' utility, which already provides
# path translation capability.
#
# Written by Bob Friesenhahn, June 2002
#
arg="$1"
escapes=4
if test -n "$2"; then
  escapes="$2"
  if test $escapes -gt 3; then
    printf "$0: escape level must in range 0 - 3\n"
    exit 1
  fi
fi
result=''
length=0
max_length=0
mount | sed -e 's:\\:/:g'  | (
  IFS="\n"
  while read mount_entry
  do
    win_mount_path=`printf "$mount_entry\n" | sed -e 's: .*::g'`
    unix_mount_path=`printf "$mount_entry\n" | sed -e 's:.* on ::;s: type .*::'`
    temp=`printf "$arg" | sed -e "s!^$unix_mount_path!$win_mount_path!"`
    if test "$temp" != "$arg"
    then
      candidate="$temp"
      length=${#unix_mount_path}
      if test $length -gt $max_length
      then
        result=$candidate
        max_length=$length
      fi
    fi
  done
  if test -z "$result"
  then
    printf "$0: path \"$arg\" is not mounted\n"
    exit 1
  fi
  case "$escapes" in
    0)
     printf "${result}" | sed -e 's:/:\\:g'
     ;;
    1)
     printf "${result}" | sed -e 's:/:\\\\:g'
     ;;
    2)
     printf "${result}" | sed -e 's:/:\\\\\\\\:g'
     ;;
    3)
     printf "${result}" | sed -e 's:/:\\\\\\\\\\\\\\\\:g'
     ;;
    *)
     printf "${result}"
     ;;
  esac
  exit 0;
 )
```

--------------------------------------------------------------------------------

---[FILE: devcontainer.json]---
Location: ImageMagick-main/.devcontainer/devcontainer.json
Signals: Docker

```json
{
  "name": "Default",
  "build": {
    "dockerfile": "Dockerfile"
  },
  "customizations": {
    "vscode": {
      "settings": {
        "extensions.ignoreRecommendations": true
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile]---
Location: ImageMagick-main/.devcontainer/Dockerfile

```text
FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y autoconf gcc g++ git libtool locales make pkg-config && \
    locale-gen en_US.UTF-8

ENV CFLAGS='-Wall -Wextra -Werror -Wno-builtin-declaration-mismatch'
ENV CXXFLAGS='-Wall -Wextra -Werror -Wno-builtin-declaration-mismatch'
```

--------------------------------------------------------------------------------

---[FILE: devcontainer.json]---
Location: ImageMagick-main/.devcontainer/clang/devcontainer.json
Signals: Docker

```json
{
  "name": "Clang",
  "build": {
    "dockerfile": "Dockerfile"
  },
  "customizations": {
    "vscode": {
      "settings": {
        "extensions.ignoreRecommendations": true
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile]---
Location: ImageMagick-main/.devcontainer/clang/Dockerfile

```text
FROM ubuntu:18.04

RUN apt-get update && \
    apt-get install -y autoconf clang git libtool locales pkg-config && \
    locale-gen en_US.UTF-8

ENV CXX=clang++
ENV CC=clang
ENV CFLAGS='-Wall -Wextra -Werror -Wno-unused-function -Wno-incompatible-library-redeclaration'
ENV CXXFLAGS='-Wall -Wextra -Werror -Wno-unused-function -Wno-incompatible-library-redeclaration'
```

--------------------------------------------------------------------------------

---[FILE: build_imagemagick.sh]---
Location: ImageMagick-main/.devcontainer/security/build_imagemagick.sh

```bash
#!/bin/bash -eu

./oss-fuzz/build_imagemagick.sh

cat <<EOT >> /ImageMagick/etc/ImageMagick-7/policy.xml
<policymap>
  <policy domain="resource" name="memory" value="256MiB"/>
  <policy domain="resource" name="list-length" value="32"/>
  <policy domain="resource" name="width" value="8KP"/>
  <policy domain="resource" name="height" value="8KP"/>
  <policy domain="resource" name="map" value="512MiB"/>
  <policy domain="resource" name="area" value="16KP"/>
  <policy domain="resource" name="disk" value="1GiB"/>
  <policy domain="resource" name="file" value="768"/>
  <policy domain="resource" name="thread" value="2"/>
  <policy domain="resource" name="time" value="120"/>
</policymap>
EOT
```

--------------------------------------------------------------------------------

---[FILE: devcontainer.json]---
Location: ImageMagick-main/.devcontainer/security/devcontainer.json
Signals: Docker

```json
{
  "name": "Security",
  "build": {
    "dockerfile": "Dockerfile",
    "context": "../.."
  },
  "onCreateCommand": "bash .devcontainer/security/build_imagemagick.sh",
  "customizations": {
    "vscode": {
      "settings": {
        "extensions.ignoreRecommendations": true
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile]---
Location: ImageMagick-main/.devcontainer/security/Dockerfile

```text
FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y autoconf autopoint binutils clang cmake gettext git gperf libc++-dev libc++abi-dev libtool locales make nasm pkg-config po4a && \
    locale-gen en_US.UTF-8

RUN mkdir -p mkdir /ImageMagick/dependencies
WORKDIR /ImageMagick/dependencies

RUN git clone --depth 1 https://gitlab.com/libtiff/libtiff
RUN git clone --depth 1 https://github.com/strukturag/libde265
RUN git clone --depth 1 https://github.com/strukturag/libheif
RUN git clone --depth 1 https://github.com/uclouvain/openjpeg
RUN git clone --depth 1 https://github.com/webmproject/libwebp
RUN git clone --depth 1 https://github.com/madler/zlib
RUN git clone --depth 1 https://github.com/ebiggers/libdeflate
RUN git clone --depth 1 https://github.com/libjpeg-turbo/libjpeg-turbo
RUN git clone --depth 1 https://github.com/tukaani-project/xz
RUN git clone --depth 1 https://github.com/libraw/libraw
RUN git clone --depth 1 https://github.com/pnggroup/libpng
RUN git clone --depth 1 https://github.com/mm2/Little-CMS
RUN git clone --depth 1 https://github.com/freetype/freetype
RUN git clone --depth 1 https://gitlab.com/federicomenaquintero/bzip2.git
RUN git clone --depth 1 --recursive https://github.com/libjxl/libjxl
RUN git clone https://www.cl.cam.ac.uk/~mgk25/git/jbigkit # does not support shallow

ADD oss-fuzz/build_dependencies.sh build_dependencies.sh

ENV SRC=/ImageMagick/dependencies
ENV WORK=/ImageMagick
ENV PATH=$PATH:/ImageMagick/bin
ENV CXX=clang++
ENV CC=clang
ENV CFLAGS="-O1 -fno-omit-frame-pointer -fsanitize=address -fsanitize-address-use-after-scope"
ENV CXXFLAGS="-O1 -fno-omit-frame-pointer -fsanitize=address -fsanitize-address-use-after-scope -stdlib=libc++"
RUN ./build_dependencies.sh
```

--------------------------------------------------------------------------------

---[FILE: CODE_OF_CONDUCT.md]---
Location: ImageMagick-main/.github/CODE_OF_CONDUCT.md

```text
# ImageMagick Code of Conduct

Strive to give back to the ImageMagick community more than you take and be excellent to each other.
```

--------------------------------------------------------------------------------

---[FILE: CONTRIBUTING.md]---
Location: ImageMagick-main/.github/CONTRIBUTING.md

```text
# How to contribute to ImageMagick

#### **Did you find a bug?**

- Please ensure the bug was not already reported by searching our [issues](https://github.com/ImageMagick/ImageMagick/issues).
- If you're unable to find an open issue addressing the problem, please [open a new one](https://github.com/ImageMagick/ImageMagick/issues/new).
  Be sure to follow the instructions in the issue template.

#### **Did you write a patch that fixes a bug?**

- Open a new pull request with the patch and follow the instructions from the pull request template.
- Before submitting, please ensure that your code matches the existing coding patterns and practise as demonstrated in the repository.
- Once the pull request has been accepted, please submit another patch to the [ImageMagick6](https://github.com/ImageMagick/ImageMagick6) legacy repository when applicable.

#### **Do you intend to add a new feature?**

- Join the ImageMagick community [discussions](https://github.com/ImageMagick/ImageMagick/discussions), suggest your change there and start writing code.

#### **Do you want to change something in the `www` folder?**

- Please submit a pull request in our [website repository](https://github.com/ImageMagick/Website) instead.

If you cannot help us by writing code, take a look at the other ways you could [help](https://imagemagick.org/script/support.php) the ImageMagick team.

\- The Wizards
```

--------------------------------------------------------------------------------

---[FILE: dependabot.yml]---
Location: ImageMagick-main/.github/dependabot.yml

```yaml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    cooldown:
      default-days: 7
    schedule:
      interval: "weekly"
```

--------------------------------------------------------------------------------

---[FILE: FUNDING.yml]---
Location: ImageMagick-main/.github/FUNDING.yml

```yaml
github: ImageMagick
custom: https://imagemagick.org/script/support.php
```

--------------------------------------------------------------------------------

---[FILE: PULL_REQUEST_TEMPLATE.md]---
Location: ImageMagick-main/.github/PULL_REQUEST_TEMPLATE.md

```text
### Prerequisites

- [ ] I have written a descriptive pull-request title
- [ ] I have verified that there are no overlapping [pull-requests](https://github.com/ImageMagick/ImageMagick/pulls) open
- [ ] I have verified that I am following the existing coding patterns and practices as demonstrated in the repository.

### Description
<!-- A description of the changes proposed in the pull-request
     If you want to change something in the 'www' or 'ImageMagick' folder please
     open an issue here instead: https://github.com/ImageMagick/Website -->

<!-- Thanks for contributing to ImageMagick! -->
```

--------------------------------------------------------------------------------

---[FILE: funding-manifest-urls]---
Location: ImageMagick-main/.github/.well-known/funding-manifest-urls

```text
https://imagemagick.org/funding.json
```

--------------------------------------------------------------------------------

---[FILE: PKGBUILD]---
Location: ImageMagick-main/.github/build/msys2/PKGBUILD

```text
# Adapted from upstream:
# https://github.com/msys2/MINGW-packages/tree/master/mingw-w64-imagemagick

# Maintainer: Alexey Pavlov <alexpux@gmail.com>

_realname=imagemagick
pkgbase="mingw-w64-${_realname}"
pkgname=("${MINGW_PACKAGE_PREFIX}-${_realname}"
         "${MINGW_PACKAGE_PREFIX}-${_realname}-docs")
_basever=7.1.1
_rc=-47
pkgver=${_basever}${_rc//-/.} # pkgver doesn't have "," "/", "-" and space.
pkgrel=1
pkgdesc="An image viewing/manipulation program (mingw-w64)"
arch=('any')
mingw_arch=('mingw64' 'ucrt64' 'clang64' 'clangarm64')
url="https://www.imagemagick.org/"
msys2_repository_url="https://github.com/ImageMagick/ImageMagick"
msys2_references=(
  'archlinux: imagemagick'
  'aur: imagemagick-full'
  'cygwin: ImageMagick'
  'gentoo: media-gfx/imagemagick'
  'cpe: cpe:/a:imagemagick:imagemagick'
)
license=("spdx:ImageMagick")
makedepends=("${MINGW_PACKAGE_PREFIX}-cc"
             "${MINGW_PACKAGE_PREFIX}-autotools"
             "${MINGW_PACKAGE_PREFIX}-pkgconf"
             "${MINGW_PACKAGE_PREFIX}-cairo"
             "${MINGW_PACKAGE_PREFIX}-ghostscript"
             "${MINGW_PACKAGE_PREFIX}-graphviz"
             "${MINGW_PACKAGE_PREFIX}-libjxl"
             "${MINGW_PACKAGE_PREFIX}-librsvg"
             "${MINGW_PACKAGE_PREFIX}-libultrahdr"
             "${MINGW_PACKAGE_PREFIX}-libxml2"
             "${MINGW_PACKAGE_PREFIX}-openexr"
             "${MINGW_PACKAGE_PREFIX}-pango")
depends=("${MINGW_PACKAGE_PREFIX}-bzip2"
         "${MINGW_PACKAGE_PREFIX}-djvulibre"
         "${MINGW_PACKAGE_PREFIX}-flif"
         "${MINGW_PACKAGE_PREFIX}-fftw"
         "${MINGW_PACKAGE_PREFIX}-fontconfig"
         "${MINGW_PACKAGE_PREFIX}-freetype"
         "${MINGW_PACKAGE_PREFIX}-glib2"
         "${MINGW_PACKAGE_PREFIX}-gsfonts"
         "${MINGW_PACKAGE_PREFIX}-jasper"
         "${MINGW_PACKAGE_PREFIX}-jbigkit"
         "${MINGW_PACKAGE_PREFIX}-lcms2"
         "${MINGW_PACKAGE_PREFIX}-libheif"
         "${MINGW_PACKAGE_PREFIX}-liblqr"
         "${MINGW_PACKAGE_PREFIX}-libpng"
         "${MINGW_PACKAGE_PREFIX}-libraqm"
         "${MINGW_PACKAGE_PREFIX}-libraw"
         "${MINGW_PACKAGE_PREFIX}-libtiff"
         "${MINGW_PACKAGE_PREFIX}-libltdl"
         "${MINGW_PACKAGE_PREFIX}-libwebp"
         "${MINGW_PACKAGE_PREFIX}-libwinpthread"
         "${MINGW_PACKAGE_PREFIX}-libwmf"
         "${MINGW_PACKAGE_PREFIX}-libxml2"
         "${MINGW_PACKAGE_PREFIX}-omp"
         "${MINGW_PACKAGE_PREFIX}-openjpeg2"
         #"${MINGW_PACKAGE_PREFIX}-perl"
         "${MINGW_PACKAGE_PREFIX}-ttf-dejavu"
         "${MINGW_PACKAGE_PREFIX}-xz"
         "${MINGW_PACKAGE_PREFIX}-zlib"
         "${MINGW_PACKAGE_PREFIX}-zstd"
        )
optdepends=("${MINGW_PACKAGE_PREFIX}-ghostscript: for Ghostscript support"
            "${MINGW_PACKAGE_PREFIX}-graphviz: for GVC support"
            "${MINGW_PACKAGE_PREFIX}-libjxl: for JPEG XL support"
            "${MINGW_PACKAGE_PREFIX}-librsvg: for SVG support"
            "${MINGW_PACKAGE_PREFIX}-libultrahdr: for Ultra HDR support"
            "${MINGW_PACKAGE_PREFIX}-openexr: for OpenEXR support"
            #"${MINGW_PACKAGE_PREFIX}-jasper: for JPEG-2000 support"
            #"${MINGW_PACKAGE_PREFIX}-libpng: for PNG support"
            #"${MINGW_PACKAGE_PREFIX}-libtiff: for PNG support"
            #"${MINGW_PACKAGE_PREFIX}-libwebp: for WEBP support"
            )
# libtool files are required in imagemagick to relocate modules path
options=('libtool')
# source=(https://imagemagick.org/archive/releases/ImageMagick-${_basever}${_rc}.tar.xz{,.asc}
#         pathtools.c
#         pathtools.h
#         001-7.1.1.39-relocate.patch)
# sha256sums=('2396cd3c4237cfbc09a89d31d1cee157ee11fbc8ec1e540530e10175cb707160'
#             'SKIP'
#             'ebf471173f5ee9c4416c10a78760cea8afaf1a4a6e653977321e8547ce7bf3c0'
#             '1585ef1b61cf53a2ca27049c11d49e0834683dfda798f03547761375df482a90'
#             'f3454a7938069f91fbe220dc03e444e7454a4a8a286b2408bbfe6f15a9c8a6dc')
#Lexie Parsimoniae (ImageMagick code signing key) <lexie.parsimoniae@imagemagick.org>
validpgpkeys=('D8272EF51DA223E4D05B466989AB63D48277377A')

source_dir="$GITHUB_WORKSPACE"

# Helper macros to help make tasks easier #
# apply_patch_with_msg() {
#   for _patch in "$@"
#   do
#     msg2 "Applying $_patch"
#     patch -Nbp1 -i "${srcdir}/${_patch}"
#   done
# }
# =========================================== #

prepare() {
  #test ! -d "${startdir}/../mingw-w64-pathtools" || {
  #  cmp "${startdir}/../mingw-w64-pathtools/pathtools.c" "${srcdir}/pathtools.c" &&
  #  cmp "${startdir}/../mingw-w64-pathtools/pathtools.h" "${srcdir}/pathtools.h"
  #} || exit 1

  #cd ImageMagick-${_basever}${_rc}
  #cp -fHv "${srcdir}"/pathtools.[ch] MagickCore/

  #apply_patch_with_msg \
  #  001-7.1.1.39-relocate.patch

  cd "${source_dir}"

  autoreconf -fi
}

build() {
  export lt_cv_deplibs_check_method='pass_all'

  mkdir -p "${source_dir}"/build-${MSYSTEM} && cd "${source_dir}"/build-${MSYSTEM}

  # --with-lcms2, --with-opencl, --without-ltdl
  ../configure \
    --prefix=${MINGW_PREFIX} \
    --build=${MINGW_CHOST} \
    --host=${MINGW_CHOST} \
    --disable-deprecated \
    --enable-legacy-support \
    --enable-hdri \
    --with-djvu \
    --with-fftw \
    --with-gslib \
    --with-gvc \
    --with-flif \
    --with-jxl \
    --with-lcms \
    --with-lqr \
    --with-modules \
    --with-openexr \
    --with-openjp2 \
    --with-rsvg \
    --with-uhdr \
    --with-webp \
    --with-wmf \
    --with-xml \
    --without-autotrace \
    --without-dps \
    --without-fpx \
    --with-jbig \
    --without-perl \
    --without-x \
    --with-raqm \
    --with-magick-plus-plus \
    --with-windows-font-dir=c:/Windows/fonts \
    --with-gs-font-dir=${MINGW_PREFIX}/share/fonts/gsfonts \
    --with-dejavu-font-dir=${MINGW_PREFIX}/share/fonts/TTF \
    CFLAGS="${CFLAGS}" CPPFLAGS="${CPPFLAGS}" LDFLAGS="${LDFLAGS}"

  if check_option "debug" "y"; then
    MAKE_VERBOSE="V=1"
  fi
  make ${MAKE_VERBOSE}

    #--enable-opencl \
    #--with-perl-options="INSTALLDIRS=vendor"
}

package_imagemagick() {
  cd "${source_dir}"/build-${MSYSTEM}
  if check_option "debug" "y"; then
    MAKE_VERBOSE="V=1"
  fi
  make -j1 DESTDIR="${pkgdir}" install ${MAKE_VERBOSE}

  #find . -name "*.xml" -exec sed -i "s/${MINGW_PREFIX}/newWord/g" '{}' \;

  install -Dm644 "${source_dir}"/LICENSE "${pkgdir}${MINGW_PREFIX}/share/licenses/${_realname}/LICENSE"
  install -Dm644 "${source_dir}"/NOTICE  "${pkgdir}${MINGW_PREFIX}/share/licenses/${_realname}/NOTICE"

  local PREFIX_WIN=$(cygpath -wm ${MINGW_PREFIX})
  # fix hard-coded pathes in XML files.
  find "${pkgdir}"${MINGW_PREFIX}/lib -name "*.xml" -exec sed -e "s|${PREFIX_WIN}|${MINGW_PREFIX}|g" -i {} \;
  # fix libtool .la files
  find "${pkgdir}"${MINGW_PREFIX}/lib -name "*.la" -exec sed -e "s|${PREFIX_WIN}|${MINGW_PREFIX}|g" -i {} \;
  # fix hard-coded pathes in .pc files
  for _f in "${pkgdir}${MINGW_PREFIX}"\/lib\/pkgconfig\/*.pc; do
    sed -e "s|${PREFIX_WIN}|${MINGW_PREFIX}|g" -i ${_f}
  done

  # Split docs
  mkdir -p dest${MINGW_PREFIX}/share
  mv "${pkgdir}${MINGW_PREFIX}"/share/doc dest${MINGW_PREFIX}/share/doc
}

package_imagemagick-docs() {
  pkgdesc+=" (documentation)"
  depends=()
  optdepends=()

  cd "${source_dir}"/build-${MSYSTEM}
  mv dest/* "${pkgdir}"
}

# template start; name=mingw-w64-splitpkg-wrappers; version=1.0;
# vim: set ft=bash :

# generate wrappers
for _name in "${pkgname[@]}"; do
  _short="package_${_name#${MINGW_PACKAGE_PREFIX}-}"
  _func="$(declare -f "${_short}")"
  eval "${_func/#${_short}/package_${_name}}"
done
# template end;
```

--------------------------------------------------------------------------------

---[FILE: compare-signatures.py]---
Location: ImageMagick-main/.github/build/scripts/compare-signatures.py

```python
import re
from bs4 import BeautifulSoup # it is a python library to parse HTML
import sys
import pandas as pd
from io import StringIO

DIFF_FOUND=False

"""
Extracts the signatures from the html file of the manually written documentation
"""
def extract_signatures(doc_file):
    with open(doc_file, 'r', encoding='utf-8') as file:
        html_content = file.read()

    soup = BeautifulSoup(html_content, 'html.parser')
    tables = soup.find_all('table')

    signatures = {}
    for table in tables:
        header = table.find('tr')
        if header and len(header.find_all('td')) == 4:
            headers = [td.text.strip() for td in header.find_all('td')]
            if headers == ['Method', 'Returns', 'Signature', 'Description'] or headers == ['Method', 'Return Type', 'Signature(s)', 'Description']:
                df = pd.read_html(StringIO(str(table)))[0]      # using pandas to make sure there are no skipped cells
                for index, row in df.iterrows():
                    method = str(row[0]) if not pd.isna(row[0]) else ""
                    returns = normalize(str(row[1])) if not pd.isna(row[1]) else ""
                    signature = normalize(str(row[2])) if not pd.isna(row[2]) else ""
                    if method not in signatures:
                        signatures[method] = {'returns': [], 'signatures': []}
                    signatures[method]['returns'].append(returns)
                    signatures[method]['signatures'].append(f"{method} ({signature})")
            return signatures
    return {}

"""
This function checks if the signatures in the doxygen file match the signatures collected from the html file
"""
def check_signatures(doxygen_file, doc_signatures):
    with open(doxygen_file, 'r', encoding='utf-8') as file:
        doxygen_content = file.read()

    soup = BeautifulSoup(doxygen_content, 'html.parser')

    correct = True
    for table in soup.find_all('table', class_='memberdecls'):
        rows = table.find_all('tr')
        for row in rows:
            cols = row.find_all('td')
            if len(cols) == 2:
                return_type = normalize(cols[0].text.strip())
                method_signature = normalize(cols[1].text.strip())
                match = re.match(r'([^)]+\))', method_signature) # making sure we don't have any extra information after the ) like const
                if match:
                    method_signature = match.group(1)
                method_name_match = re.match(r'(\w+)\s*\(', method_signature)   # extract method name
                if method_name_match:
                    method_name = method_name_match.group(1)

                    # check if signature is in html file
                    if method_name in doc_signatures.keys():
                        if return_type not in doc_signatures[method_name]['returns']:
                            print(f"- Return type mismatch for method \"{method_name}\"")
                            print(f"Doxygen return type   : {return_type}")
                            print(f"Documentation returns : {doc_signatures[method_name]['returns']} \n")
                            correct = False
                        if method_signature not in doc_signatures[method_name]['signatures']:
                            print(f"- Signature mismatch for method \"{method_name}\" ")
                            print(f"Doxygen signature        : {method_signature}")
                            print(f"Documentation signatures : {doc_signatures[method_name]['signatures']} \n")
                            correct = False
    return correct

"""
Used to normalize the text by removing extra spaces, new lines, tabs, etc.
"""
def normalize(text):
    ' '.join(text.replace("\n", "").replace("\t", "").replace("\xa0", " ").split())
    text = re.sub(r'\s*\*\s*', '* ', text)      # make sure * is followed by a space and doesn't have space before it
    text = re.sub(r'\s*&\s*', '& ', text)
    text = re.sub(r'\s*,\s*', ', ', text)
    text = re.sub(r'::', '', text)          # remove ::
    text = re.sub(r'\s+', ' ', text)
    return text

def main(argv):
    if len(argv) != 2:
        print("Usage: python3 compare_signatures.py <doc_file> <doxygen_file>")
        sys.exit(1)

    doc_file = argv[0]
    doxygen_file = argv[1]
    print("Checking function signatures for \n  Doxygen file: ", doxygen_file, "\n  Documentation file: ", doc_file, "\n")

    signatures = extract_signatures(doc_file)
    if not signatures:
        print("No matching table found in the documentation")
        sys.exit(1)

    if not check_signatures(doxygen_file, signatures):
        sys.exit(1)

if __name__ == "__main__":
    main(sys.argv[1:])
```

--------------------------------------------------------------------------------

---[FILE: download-configure.cmd]---
Location: ImageMagick-main/.github/build/windows/download-configure.cmd

```bat
@echo off

set "SCRIPT_DIR=%~dp0"
set "EXECUTION_DIR=%cd%"

call "%SCRIPT_DIR%find-bash.cmd"

call set "PATH=%%SCRIPT_DIR:%EXECUTION_DIR%=%%"
call set "LINUX_PATH=%PATH:\=/%"

%BASH% -c "./%LINUX_PATH%/download-configure.sh"
```

--------------------------------------------------------------------------------

---[FILE: download-configure.sh]---
Location: ImageMagick-main/.github/build/windows/download-configure.sh

```bash
#/bin/bash
set -e

download_release()
{
  local project=$1
  local release=$2
  local file=$3

  echo "Downloading $file from release $release of $project"

  curl -sS -L "https://github.com/ImageMagick/$project/releases/download/$release/$file" -o "$file"
}

download_configure()
{
  local version=$1

  mkdir -p "Configure"
  cd "Configure"

  download_release "Configure" "$version" "Configure.Release.x64.exe"
  download_release "Configure" "$version" "Configure.Release.arm64.exe"
  download_release "Configure" "$version" "Configure.Release.x86.exe"
  download_release "Configure" "$version" "files.zip"
  unzip -o "files.zip" || rm "files.zip"

  cd ..
}

download_configure "2025.12.05.1723"
```

--------------------------------------------------------------------------------

---[FILE: download-dependencies.cmd]---
Location: ImageMagick-main/.github/build/windows/download-dependencies.cmd

```bat
@echo off

set "SCRIPT_DIR=%~dp0"
set "EXECUTION_DIR=%cd%"

call "%SCRIPT_DIR%find-bash.cmd"

call set "PATH=%%SCRIPT_DIR:%EXECUTION_DIR%=%%"
call set "LINUX_PATH=%PATH:\=/%"

%BASH% -c "./%LINUX_PATH%/download-dependencies.sh --dependencies-artifact %1"
```

--------------------------------------------------------------------------------

---[FILE: download-dependencies.sh]---
Location: ImageMagick-main/.github/build/windows/download-dependencies.sh

```bash
#/bin/bash
set -e

download_release()
{
  local project=$1
  local release=$2
  local file=$3

  echo "Downloading $file from release $release of $project"

  curl -sS -L "https://github.com/ImageMagick/$project/releases/download/$release/$file" -o "$file"
}

download_dependencies()
{
  local version=$1
  local artifact=$2

  mkdir -p "Dependencies"
  cd "Dependencies"

  download_release "Dependencies" "$version" "$artifact"
  unzip -o "$artifact" -d "../Artifacts" || {
    exit_code=$?
    if [[ $exit_code -ne 0 && $exit_code -ne 1 ]]; then
      echo "Unzip failed with exit code $exit_code"
      exit $exit_code
    fi
  }

  cd ..
}

dependenciesArtifact=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --dependencies-artifact)
      dependenciesArtifact="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

if [[ -z "$dependenciesArtifact" ]]; then
  echo "Error: The --dependencies-artifact option is required."
  exit 1
fi

download_dependencies "2025.12.05.1915" "$dependenciesArtifact"
```

--------------------------------------------------------------------------------

---[FILE: find-bash.cmd]---
Location: ImageMagick-main/.github/build/windows/find-bash.cmd

```bat
set BASH="%PROGRAMFILES%\Git\bin\bash.exe"
if exist %BASH% goto EXECUTE

set BASH="%PROGRAMFILES(x86)%\Git\bin\bash.exe"
if exist %BASH% goto EXECUTE

set BASH="%ProgramW6432%\Git\bin\bash.exe"
if exist %BASH% goto EXECUTE

set BASH="%USERPROFILE%\scoop\apps\git\current\bin\bash.exe"
if exist %BASH% goto EXECUTE

for /F "tokens=*" %%g in ('where bash') do (SET BASH=%%g)
if exist %BASH% goto EXECUTE

echo Failed to find bash.exe
echo %BASH%
exit /b 1

:EXECUTE
```

--------------------------------------------------------------------------------

---[FILE: development.yml]---
Location: ImageMagick-main/.github/DISCUSSION_TEMPLATE/development.yml

```yaml
body:
- type: input
  attributes:
    label: ImageMagick version
    placeholder: 7.X.X-X
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
  validations:
    required: true
```

--------------------------------------------------------------------------------

---[FILE: help.yml]---
Location: ImageMagick-main/.github/DISCUSSION_TEMPLATE/help.yml

```yaml
body:
- type: input
  attributes:
    label: ImageMagick version
    placeholder: 7.X.X-X
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
  validations:
    required: true
```

--------------------------------------------------------------------------------

````

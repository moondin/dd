---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 371
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 371 of 851)

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

---[FILE: MagickWand-config.1]---
Location: ImageMagick-main/MagickWand/MagickWand-config.1

```text
.ad l
.nh
.TH MagickWand-Config 1 "2 May 2002" "Wand"
.SH NAME
MagickWand-config \- get information about the installed version of the Magick Wand
.SH SYNOPSIS
.B MagickWand-config 
.B [--cflags]
.B [--cppflags]
.B [--exec-prefix]
.B [--ldflags]
.B [--libs]
.B [--prefix]
.B [--version]
.SH DESCRIPTION
.B MagickWand-config
prints the compiler and linker flags required to compile and link programs
that use the
.BR Wand
Application Programmer Interface.
.SH EXAMPLES
To print the version of the installed distribution of
.BR Wand ,
use:

.nf
  MagickWand-config \-\-version
.fi
  
To compile a program that calls the 
.BR Wand
Application Programmer Interface, use:

.nf
  cc `MagickWand-config \-\-cflags \-\-cppflags \-\-ldflags \-\-libs` program.c
.fi

.SH OPTIONS
.TP
.B \-\-cflags
Print the compiler flags that were used to compile 
.BR libWand .
.TP
.B \-\-cppflags
Print the preprocessor flags that are needed to find the
.B Wand
C include files and defines to ensure that the Wand data structures match between
your program and the installed libraries.
.TP
.B \-\-exec-prefix
Print the directory under which target specific binaries and executables are installed.
.TP
.B \-\-ldflags
Print the linker flags that are needed to link with the
.B Wand
library.
.TP
.B \-\-libs
Print the linker flags that are needed to link a program with
.BR libWand .
.TP
.B \-\-version
Print the version of the
.B Wand
distribution to standard output.
.SH COPYRIGHT
See https://imagemagick.org/script/license.php
.SH AUTHORS
Cristy, ImageMagick Studio LLC
```

--------------------------------------------------------------------------------

---[FILE: MagickWand-config.in]---
Location: ImageMagick-main/MagickWand/MagickWand-config.in

```text
#!/bin/sh
#
# Configure options script for re-calling MagickWand compilation options
# required to use the MagickWand library.
#

prefix=@prefix@
exec_prefix=@exec_prefix@
libdir=@libdir@
pkgconfigdir=@pkgconfigdir@
export PKG_CONFIG_LIBDIR="${pkgconfigdir}"

usage="\
Usage: MagickWand-config [--cflags] [--cppflags] [--exec-prefix] [--ldflags] [--libs] [--prefix] [--version]"

if test $# -eq 0; then
      echo "${usage}" 1>&2
      echo "Example: gcc \`MagickWand-config --cflags --cppflags\` -o wand wand.c \`MagickWand-config --ldflags --libs\`" 1>&2
      exit 1
fi

while test $# -gt 0; do
  case "$1" in
    -*=*) optarg=`echo "$1" | sed 's/[-_a-zA-Z0-9]*=//'` ;;
    *) optarg= ;;
  esac
  case $1 in
    --prefix=*)
      prefix=$optarg
      ;;
    --prefix)
      echo $prefix
      ;;
    --exec-prefix=*)
      exec_prefix=$optarg
      ;;
    --exec-prefix)
      echo $exec_prefix
      ;;
    --version)
      echo '@PACKAGE_VERSION@ Q@QUANTUM_DEPTH@ @MAGICK_HDRI@'
      ;;
    --cc)
      echo '@CC@'
      ;;
    --cflags)
      @PKG_CONFIG@ --cflags MagickWand-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@
      ;;
    --cxx)
      echo '@CXX@'
      ;;
    --cxxflags)
      @PKG_CONFIG@ --cflags MagickWand-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@
      ;;
    --cppflags)
      @PKG_CONFIG@ --cflags MagickWand-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@
      ;;
    --ldflags)
      @PKG_CONFIG@ --libs MagickWand-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@
      ;;
    --libs)
      @PKG_CONFIG@ --libs MagickWand-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@
      ;;
    *)
      echo "${usage}" 1>&2
      exit 1
      ;;
  esac
  shift
done
```

--------------------------------------------------------------------------------

---[FILE: MagickWand.h]---
Location: ImageMagick-main/MagickWand/MagickWand.h

```c
/*
  Copyright @ 1999 ImageMagick Studio LLC, a non-profit organization
  dedicated to making software imaging solutions freely available.
  
  You may not use this file except in compliance with the License.  You may
  obtain a copy of the License at
  
    https://imagemagick.org/script/license.php
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

  MagickWand Application Programming Interface declarations.
*/

#ifndef MAGICKWAND_MAGICKWAND_H
#define MAGICKWAND_MAGICKWAND_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#if !defined(MAGICKWAND_CONFIG_H)
# define MAGICKWAND_CONFIG_H
# if !defined(vms)
#  include "MagickCore/magick-config.h"
# else
#  include "magick-config.h"
# endif
#if defined(_magickcore_const) && !defined(const)
# define const _magickcore_const
#endif
#if defined(_magickcore_inline) && !defined(inline)
# define inline _magickcore_inline
#endif
#if !defined(magick_restrict)
# if !defined(_magickcore_restrict)
#  define magick_restrict restrict
# else
#  define magick_restrict _magickcore_restrict
# endif
#endif
# if defined(__cplusplus) || defined(c_plusplus)
#  undef inline
# endif
#endif

#define MAGICKWAND_CHECK_VERSION(major,minor,micro) \
  ((MAGICKWAND_MAJOR_VERSION > (major)) || \
    ((MAGICKWAND_MAJOR_VERSION == (major)) && \
     (MAGICKWAND_MINOR_VERSION > (minor))) || \
    ((MAGICKWAND_MAJOR_VERSION == (major)) && \
     (MAGICKWAND_MINOR_VERSION == (minor)) && \
     (MAGICKWAND_MICRO_VERSION >= (micro))))

#include <stdio.h>
#include <stdarg.h>
#include <stdlib.h>
#include <stdint.h>
#include <math.h>
#include <sys/types.h>
#include <time.h>

#if defined(WIN32) || defined(WIN64) || defined(_WIN32_WINNT)
#  define MAGICKWAND_WINDOWS_SUPPORT
#else
#  define MAGICKWAND_POSIX_SUPPORT
#endif 

typedef struct _MagickWand
  MagickWand;

#include "MagickWand/method-attribute.h"
#include "MagickCore/MagickCore.h"
#include "MagickWand/animate.h"
#include "MagickWand/compare.h"
#include "MagickWand/composite.h"
#include "MagickWand/conjure.h"
#include "MagickWand/deprecate.h"
#include "MagickWand/display.h"
#include "MagickWand/drawing-wand.h"
#include "MagickWand/identify.h"
#include "MagickWand/import.h"
#include "MagickWand/wandcli.h"
#include "MagickWand/operation.h"
#include "MagickWand/magick-cli.h"
#include "MagickWand/magick-property.h"
#include "MagickWand/magick-image.h"
#include "MagickWand/mogrify.h"
#include "MagickWand/montage.h"
#include "MagickWand/pixel-iterator.h"
#include "MagickWand/pixel-wand.h"
#include "MagickWand/stream.h"
#include "MagickWand/wand-view.h"

extern WandExport char
  *MagickGetException(const MagickWand *,ExceptionType *);

extern WandExport ExceptionType
  MagickGetExceptionType(const MagickWand *);

extern WandExport MagickBooleanType
  IsMagickWand(const MagickWand *),
  IsMagickWandInstantiated(void),
  MagickClearException(MagickWand *),
  MagickSetIteratorIndex(MagickWand *,const ssize_t);

extern WandExport MagickWand
  *CloneMagickWand(const MagickWand *),
  *DestroyMagickWand(MagickWand *),
  *NewMagickWand(void),
  *NewMagickWandFromImage(const Image *);

extern WandExport ssize_t
  MagickGetIteratorIndex(MagickWand *);

extern WandExport void
  ClearMagickWand(MagickWand *),
  MagickWandGenesis(void),
  MagickWandTerminus(void),
  *MagickRelinquishMemory(void *),
  MagickResetIterator(MagickWand *),
  MagickSetFirstIterator(MagickWand *),
  MagickSetLastIterator(MagickWand *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: MagickWand.pc.in]---
Location: ImageMagick-main/MagickWand/MagickWand.pc.in

```text
prefix=@prefix@
exec_prefix=@exec_prefix@
libdir=@libdir@
includedir=@includedir@/ImageMagick-@MAGICK_MAJOR_VERSION@
includearchdir=@INCLUDEARCH_DIR@/ImageMagick-@MAGICK_MAJOR_VERSION@
libname=MagickWand-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@
 
Name: MagickWand
Description: MagickWand - C API for ImageMagick (ABI @MAGICK_ABI_SUFFIX@)
URL: https://github.com/ImageMagick
Version: @PACKAGE_BASE_VERSION@
Requires: MagickCore-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@
Cflags: -I${includearchdir} -I${includedir} @MAGICK_PCFLAGS@
Libs: -L${libdir} -l${libname}
Libs.private: -L${libdir} -l${libname} @MAGICK_LIBS@ @MATH_LIBS@
```

--------------------------------------------------------------------------------

---[FILE: Makefile.am]---
Location: ImageMagick-main/MagickWand/Makefile.am

```text
#  Copyright 1999 ImageMagick Studio LLC, a non-profit organization
#  dedicated to making software imaging solutions freely available.
#
#  You may not use this file except in compliance with the License.  You may
#  obtain a copy of the License at
#
#    https://imagemagick.org/script/license.php
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#
#  Makefile for building MagickWand API.
#

MagickWandincdir = $(INCLUDE_PATH)/MagickWand

MAGICKWAND_CPPFLAGS = $(AM_CPPFLAGS)

MAGICKWAND_SOURCES = \
  MagickWand/MagickWand.h \
  MagickWand/animate.c \
  MagickWand/animate.h \
  MagickWand/compare.c \
  MagickWand/compare.h \
  MagickWand/composite.c \
  MagickWand/composite.h \
  MagickWand/conjure.c \
  MagickWand/conjure.h \
  MagickWand/deprecate.h \
  MagickWand/deprecate.c \
  MagickWand/display.c \
  MagickWand/display.h \
  MagickWand/drawing-wand.c \
  MagickWand/drawing-wand.h \
  MagickWand/identify.c \
  MagickWand/identify.h \
  MagickWand/import.c \
  MagickWand/import.h \
  MagickWand/magick-cli.c \
  MagickWand/magick-cli.h \
  MagickWand/magick-image.c \
  MagickWand/magick-image.h \
  MagickWand/magick-property.c \
  MagickWand/magick-property.h \
  MagickWand/magick-wand.c \
  MagickWand/magick-wand-private.h \
  MagickWand/method-attribute.h \
  MagickWand/mogrify.c \
  MagickWand/mogrify.h \
  MagickWand/mogrify-private.h \
  MagickWand/montage.c \
  MagickWand/montage.h \
  MagickWand/operation.c \
  MagickWand/operation.h \
  MagickWand/operation-private.h \
  MagickWand/pixel-iterator.c \
  MagickWand/pixel-iterator.h \
  MagickWand/pixel-wand.c \
  MagickWand/pixel-wand.h \
  MagickWand/pixel-wand-private.h \
  MagickWand/script-token.c \
  MagickWand/script-token.h \
  MagickWand/stream.c \
  MagickWand/stream.h \
  MagickWand/studio.h \
  MagickWand/wand.c \
  MagickWand/wand.h \
  MagickWand/wandcli.c \
  MagickWand/wandcli.h \
  MagickWand/wandcli-private.h \
  MagickWand/wand-view.c \
  MagickWand/wand-view.h

MAGICKWAND_INCLUDE_HDRS = \
  MagickWand/MagickWand.h \
  MagickWand/animate.h \
  MagickWand/compare.h \
  MagickWand/composite.h \
  MagickWand/conjure.h \
  MagickWand/deprecate.h \
  MagickWand/display.h \
  MagickWand/drawing-wand.h \
  MagickWand/identify.h \
  MagickWand/import.h \
  MagickWand/magick-cli.h \
  MagickWand/magick-image.h \
  MagickWand/magick-property.h \
  MagickWand/method-attribute.h \
  MagickWand/mogrify.h \
  MagickWand/montage.h \
  MagickWand/operation.h \
  MagickWand/pixel-iterator.h \
  MagickWand/pixel-wand.h \
  MagickWand/stream.h \
  MagickWand/wandcli.h \
  MagickWand/wand-view.h

MAGICKWAND_NOINST_HDRS = \
  MagickWand/mogrify-private.h \
  MagickWand/magick-wand-private.h \
  MagickWand/operation-private.h \
  MagickWand/pixel-wand-private.h \
  MagickWand/script-token.h \
  MagickWand/studio.h \
  MagickWand/wand.h \
  MagickWand/wandcli-private.h

# Headers which are installed
MagickWandinc_HEADERS = \
  $(MAGICKWAND_INCLUDE_HDRS)

MAGICKWAND_BIN_SCRPTS = \
  MagickWand/MagickWand-config

MAGICKWAND_PKGCONFIG = \
  MagickWand/MagickWand.pc \
  MagickWand/MagickWand-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@.pc

MAGICKWAND_MANS = \
  MagickWand/MagickWand-config.1

MAGICKWAND_BUILT_SRCS =

MAGICKWAND_LIBS = MagickWand/libMagickWand-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@.la

MagickWand_libMagickWand_@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_SOURCES = $(MAGICKWAND_SOURCES)
MagickWand_libMagickWand_@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_CPPFLAGS = $(MAGICKWAND_CPPFLAGS) $(LIBRARY_EXTRA_CPPFLAGS)

if HAVE_LD_VERSION_SCRIPT
MagickWand_libMagickWand_@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_LDFLAGS_VERSION =  -Wl,--version-script=$(top_srcdir)/MagickWand/libMagickWand.map
else
MagickWand_libMagickWand_@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_LDFLAGS_VERSION = -export-symbols-regex ".*"
endif

MagickWand_libMagickWand_@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_LDFLAGS = -no-undefined \
  $(MagickWand_libMagickWand_@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_LDFLAGS_VERSION) $(MAGICK_LT_RELEASE_OPTS) \
  -version-info \
  $(MAGICK_LIBRARY_CURRENT):$(MAGICK_LIBRARY_REVISION):$(MAGICK_LIBRARY_AGE)
MagickWand_libMagickWand_@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_LIBADD = $(MAGICKCORE_LIBS) $(X11_LIBS) $(GOMP_LIBS) $(MATH_LIBS)

MAGICKWAND_EXTRA_DIST = \
  MagickWand/ChangeLog \
  MagickWand/libMagickWand.map \
  MagickWand/MagickWand-config.1 \
  MagickWand/MagickWand.pc.in

MAGICKWAND_CLEANFILES =
```

--------------------------------------------------------------------------------

---[FILE: method-attribute.h]---
Location: ImageMagick-main/MagickWand/method-attribute.h

```c
/*
  Copyright @ 1999 ImageMagick Studio LLC, a non-profit organization
  dedicated to making software imaging solutions freely available.

  You may not use this file except in compliance with the License.  You may
  obtain a copy of the License at

    https://imagemagick.org/script/license.php

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

  MagickWand method attributes.
*/
#ifndef MAGICKWAND_METHOD_ATTRIBUTE_H
#define MAGICKWAND_METHOD_ATTRIBUTE_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#if defined(MAGICKWAND_WINDOWS_SUPPORT) && !defined(__CYGWIN__)
#  define WandPrivate
#  if defined(_MT) && defined(_DLL) && !defined(_MAGICKDLL_) && !defined(_LIB)
#    define _MAGICKDLL_
#  endif
#  if defined(_MAGICKDLL_)
#    if !defined(_MAGICKLIB_)
#      if defined(__clang__) || defined(__GNUC__)
#        define WandExport __attribute__ ((dllimport))
#      else
#        define WandExport __declspec(dllimport)
#      endif
#    else
#      if defined(__clang__) || defined(__GNUC__)
#        define WandExport __attribute__ ((dllexport))
#      else
#        define WandExport __declspec(dllexport)
#      endif
#    endif
#  else
#    define WandExport
#  endif
#  if defined(_VISUALC_)
#    pragma warning(disable : 4018)
#    pragma warning(disable : 4068)
#    pragma warning(disable : 4244)
#    pragma warning(disable : 4142)
#    pragma warning(disable : 4800)
#    pragma warning(disable : 4786)
#    pragma warning(disable : 4996)
#  endif
#else
#  if defined(__clang__) || (__GNUC__ >= 4)
#    define WandExport __attribute__ ((visibility ("default")))
#    define WandPrivate  __attribute__ ((visibility ("hidden")))
#  else
#    define WandExport
#    define WandPrivate
#  endif
#endif

#define MagickWandSignature  0xabacadabUL
#if !defined(MagickPathExtent)
#  define MagickPathExtent  4096
#endif

#if defined(MAGICKCORE_HAVE___ATTRIBUTE__)
#  define wand_aligned(x)  __attribute__((aligned(x)))
#  define wand_attribute  __attribute__
#  define wand_unused(x)  wand_unused_ ## x __attribute__((unused))
#  define wand_unreferenced(x)  /* nothing */
#elif defined(MAGICKWAND_WINDOWS_SUPPORT) && !defined(__CYGWIN__)
#  define wand_aligned(x)  __declspec(align(x))
#  define wand_attribute(x)  /* nothing */
#  define wand_unused(x) x
#  define wand_unreferenced(x) (x)
#else
#  define wand_aligned(x)  /* nothing */
#  define wand_attribute(x)  /* nothing */
#  define wand_unused(x) x
#  define wand_unreferenced(x)  /* nothing */
#endif

#if !defined(__clang__) && (defined(__GNUC__) && (__GNUC__) > 4)
#  define wand_alloc_size(x)  __attribute__((__alloc_size__(x)))
#  define wand_alloc_sizes(x,y)  __attribute__((__alloc_size__(x,y)))
#else
#  define wand_alloc_size(x)  /* nothing */
#  define wand_alloc_sizes(x,y)  /* nothing */
#endif

#if defined(__clang__) || (defined(__GNUC__) && (__GNUC__) > 4)
#  define wand_cold_spot  __attribute__((__cold__))
#  define wand_hot_spot  __attribute__((__hot__))
#else
#  define wand_cold_spot
#  define wand_hot_spot
#endif

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: mogrify-private.h]---
Location: ImageMagick-main/MagickWand/mogrify-private.h

```c
/*
  Copyright @ 1999 ImageMagick Studio LLC, a non-profit organization
  dedicated to making software imaging solutions freely available.

  You may not use this file except in compliance with the License.  You may
  obtain a copy of the License at

    https://imagemagick.org/script/license.php

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

  MagickWand mogrify command-line private methods.
*/
#ifndef MAGICKWAND_MOGRIFY_PRIVATE_H
#define MAGICKWAND_MOGRIFY_PRIVATE_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#define AppendImageStack(images) \
{ \
  (void) SyncImagesSettings(image_info,images,exception); \
  AppendImageToList(&image_stack[k].image,images); \
  image=image_stack[k].image; \
}
#define DestroyImageStack() \
{ \
  while (k > 0) \
    PopImageStack(); \
  image_stack[k].image=DestroyImageList(image_stack[k].image); \
  image_stack[k].image_info=DestroyImageInfo(image_stack[k].image_info); \
  image_info=image_stack[MaxImageStackDepth].image_info; \
}
#define FinalizeImageSettings(image_info,image,advance) \
{ \
  FireImageStack(MagickTrue,advance,MagickTrue); \
  if (image != (Image *) NULL) \
    (void) SyncImagesSettings(image_info,image,exception); \
}
#define FireImageStack(postfix,advance,fire) \
  if ((j <= i) && (i < (ssize_t) argc)) \
    { \
DisableMSCWarning(4127) \
      if (image_stack[k].image == (Image *) NULL) \
        status&=(MagickStatusType) MogrifyImageInfo(image_stack[k].image_info, \
          (int) (i-j+1),(const char **) (argv+j),exception); \
      else \
        if ((fire) != MagickFalse) \
          { \
            status&=(MagickStatusType) MogrifyImages(image_stack[k].image_info,\
              postfix,(int) (i-j+1),(const char **) (argv+j), \
              &image_stack[k].image,exception); \
            image=image_stack[k].image; \
            if ((advance) != MagickFalse) \
              j=i+1; \
            pend=MagickFalse; \
          } \
RestoreMSCWarning \
    }
#define MaxImageStackDepth  128
#define NewImageStack() \
{ \
  image_stack[MaxImageStackDepth].image_info=image_info; \
  image_stack[0].image_info=CloneImageInfo(image_info); \
  image_stack[0].image=NewImageList(); \
  image_info=image_stack[0].image_info; \
  image=image_stack[0].image; \
}
#define PushImageStack() \
{ \
  k++; \
  image_stack[k].image_info=CloneImageInfo(image_stack[k-1].image_info); \
  image_stack[k].image=NewImageList(); \
  image_info=image_stack[k].image_info; \
  image=image_stack[k].image; \
}
#define PopImageStack() \
{ \
  if (respect_parentheses == MagickFalse) \
    { \
      image_stack[k-1].image_info=DestroyImageInfo(image_stack[k-1].image_info); \
      image_stack[k-1].image_info=CloneImageInfo(image_stack[k].image_info); \
    } \
  image_stack[k].image_info=DestroyImageInfo(image_stack[k].image_info); \
  AppendImageToList(&image_stack[k-1].image,image_stack[k].image); \
  k--; \
  image_info=image_stack[k].image_info; \
  image=image_stack[k].image; \
}
#define QuantumTick(i,span) ((MagickBooleanType) ((((i) & ((i)-1)) == 0) || \
   (((i) & 0xfff) == 0) || \
   ((MagickOffsetType) (i) == ((MagickOffsetType) (span)-1))))
#define RemoveImageStack(images) \
{ \
  images=RemoveFirstImageFromList(&image_stack[k].image); \
  image=image_stack[k].image; \
}
#define RemoveAllImageStack() \
{ \
  if (image_stack[k].image != (Image *) NULL) \
    image_stack[k].image=DestroyImageList(image_stack[k].image); \
}
#define SetImageStack(image) \
{ \
  image_stack[k].image=(image); \
}

typedef struct _ImageStack
{
  ImageInfo
    *image_info;

  Image
    *image;
} ImageStack;

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

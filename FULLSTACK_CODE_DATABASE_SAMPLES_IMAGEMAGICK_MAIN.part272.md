---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 272
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 272 of 851)

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

---[FILE: magick.h]---
Location: ImageMagick-main/MagickCore/magick.h

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

  MagickCore magick methods.
*/
#ifndef MAGICKCORE_MAGICK_H
#define MAGICKCORE_MAGICK_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#include <stdarg.h>
#include "MagickCore/semaphore.h"

#if defined(__cplusplus) || defined(c_plusplus)
# define magick_module  _module   /* reserved word in C++(20) */
#else
# define magick_module  module
#endif

typedef enum
{
  UndefinedFormatType,
  ImplicitFormatType,
  ExplicitFormatType
} MagickFormatType;

typedef enum
{
  CoderNoFlag = 0x0000,
  CoderAdjoinFlag = 0x0001,
  CoderBlobSupportFlag = 0x0002,
  CoderDecoderThreadSupportFlag = 0x0004,
  CoderEncoderThreadSupportFlag = 0x0008,
  CoderEndianSupportFlag = 0x0010,
  CoderRawSupportFlag = 0x0020,
  CoderSeekableStreamFlag = 0x0040, /* deprecated */
  CoderStealthFlag = 0x0080,
  CoderUseExtensionFlag = 0x0100,
  CoderDecoderSeekableStreamFlag = 0x0200,
  CoderEncoderSeekableStreamFlag = 0x0400
} MagickInfoFlag;

typedef Image
  *DecodeImageHandler(const ImageInfo *,ExceptionInfo *);

typedef MagickBooleanType
  EncodeImageHandler(const ImageInfo *,Image *,ExceptionInfo *);

typedef MagickBooleanType
  IsImageFormatHandler(const unsigned char *,const size_t);

typedef struct _MagickInfo
{
  char
    *name,
    *description,
    *version,
    *mime_type,
    *note,
    *magick_module;

  DecodeImageHandler
    *decoder;

  EncodeImageHandler
    *encoder;

  ImageInfo
    *image_info;

  IsImageFormatHandler
    *magick;

  MagickFormatType
    format_type;

  MagickStatusType
    flags;

  SemaphoreInfo
    *semaphore;

  size_t
    signature;

  void
    *client_data;
} MagickInfo;

extern MagickExport char
  **GetMagickList(const char *,size_t *,ExceptionInfo *);

extern MagickExport const char
  *GetMagickDescription(const MagickInfo *),
  *GetMagickMimeType(const MagickInfo *),
  *GetMagickModuleName(const MagickInfo *),
  *GetMagickName(const MagickInfo *);

extern MagickExport DecodeImageHandler
  *GetImageDecoder(const MagickInfo *) magick_attribute((__pure__));

extern MagickExport EncodeImageHandler
  *GetImageEncoder(const MagickInfo *) magick_attribute((__pure__));

extern MagickExport int
  GetMagickPrecision(void),
  SetMagickPrecision(const int);

extern MagickExport MagickBooleanType
  GetImageMagick(const unsigned char *,const size_t,char *),
  GetMagickAdjoin(const MagickInfo *) magick_attribute((__pure__)),
  GetMagickBlobSupport(const MagickInfo *) magick_attribute((__pure__)),
  GetMagickDecoderSeekableStream(const MagickInfo *)
    magick_attribute((__pure__)),
  GetMagickDecoderThreadSupport(const MagickInfo *)
    magick_attribute((__pure__)),
  GetMagickEncoderSeekableStream(const MagickInfo *)
     magick_attribute((__pure__)),
  GetMagickEncoderThreadSupport(const MagickInfo *)
    magick_attribute((__pure__)),
  GetMagickEndianSupport(const MagickInfo *) magick_attribute((__pure__)),
  GetMagickRawSupport(const MagickInfo *) magick_attribute((__pure__)),
  GetMagickStealth(const MagickInfo *) magick_attribute((__pure__)),
  GetMagickUseExtension(const MagickInfo *) magick_attribute((__pure__)),
  IsMagickCoreInstantiated(void) magick_attribute((__pure__)),
  RegisterMagickInfo(MagickInfo *),
  UnregisterMagickInfo(const char *);

extern const MagickExport MagickInfo
  *GetMagickInfo(const char *,ExceptionInfo *),
  **GetMagickInfoList(const char *,size_t *,ExceptionInfo *);

extern MagickExport MagickInfo
  *AcquireMagickInfo(const char *, const char *, const char *);

extern MagickExport void
  MagickCoreGenesis(const char *,const MagickBooleanType),
  MagickCoreTerminus(void);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: MagickCore-config.1]---
Location: ImageMagick-main/MagickCore/MagickCore-config.1

```text
.Dd July 13, 2015
.Dt MAGICKCORE-CONFIG 1
.Os
.Sh NAME
.Nm MagickCore-config
.Nd get information about the installed version of ImageMagick
.Sh SYNOPSIS
.Nm MagickCore-config
.Op Fl -cflags
.Op Fl -cppflags
.Op Fl -exec-prefix
.Op Fl -ldflags
.Op Fl -libs
.Op Fl -prefix
.Op Fl -version
.Sh DESCRIPTION
The
.Nm MagickCore-config
utility prints the compiler and linker flags required
to compile and link programs that use the
.Nm ImageMagick "Core"
Application Programmer Interface.
.Pp
The following options are available:
.Bl -tag -width Fl
.It Fl -cppflags , -cflags , -cxxflags
Print the compiler flags that are needed to find the
.Xr ImageMagick 1
C include files and defines to ensure that the ImageMagick data structures match between
your program and the installed libraries.
.It Fl -prefix , -exec-prefix
Print the directory under which target specific binaries and executables are installed.
.It Fl -ldflags , -libs
Print the linker flags that are needed to link with the
.Xr ImageMagick 1
library.
.It Fl -version
Print the version of the
.Xr ImageMagick 1
distribution to standard output.
.It Fl -coder-path
Print the path where the
.Xr ImageMagick 1
coder modules are installed.
.It Fl -filter-path
Print the path where the
.Xr ImageMagick 1
filter modules are installed.
.El
.Sh EXAMPLES
To print the version of the installed distribution of
.Nm ImageMagick
use:

.Dl MagickCore-config --version
.sp
To compile a program that calls the
.Xr ImageMagick 1
Application Programmer Interface, use:

.Dl cc `MagickCore-config --cppflags --ldflags` program.c
.Sh SEE ALSO
.Xr ImageMagick 1
.Sh LICENSE
.Nm ImageMagick
is licensed with a derived Apache license 2.0. See
https://imagemagick.org/script/license.php for more details.
.Sh AUTHORS
.An -nosplit
The
.Nm ImageMagick
suite and this manual page where written by
.An Cristy, ImageMagick Studio LLC <development-team@imagemagick.org>.
```

--------------------------------------------------------------------------------

---[FILE: MagickCore-config.in]---
Location: ImageMagick-main/MagickCore/MagickCore-config.in

```text
#!/bin/sh
#
# Configure options script for re-calling MagickCore compilation options
# required to use the MagickCore library.
#

prefix=@prefix@
exec_prefix=@exec_prefix@
libdir=@libdir@
pkgconfigdir=@pkgconfigdir@
export PKG_CONFIG_LIBDIR="${pkgconfigdir}"

usage="\
Usage: MagickCore-config [--cflags] [--cppflags] [--exec-prefix] [--ldflags] [--libs] [--prefix] [--version]"

if test $# -eq 0; then
      echo "${usage}" 1>&2
      echo "Example: gcc \`MagickCore-config --cflags --cppflags\` -o core core.c \`MagickCore-config --ldflags --libs\`" 1>&2
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
      @PKG_CONFIG@ --cflags MagickCore-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@
      ;;
    --cxx)
      echo '@CXX@'
      ;;
    --cxxflags)
      @PKG_CONFIG@ --cflags MagickCore-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@
      ;;
    --cppflags)
      @PKG_CONFIG@ --cflags MagickCore-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@
      ;;
    --ldflags)
      @PKG_CONFIG@ --libs MagickCore-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@
      ;;
    --libs)
      @PKG_CONFIG@ --libs MagickCore-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@
      ;;
    --coder-path)
      echo "@CODER_PATH@"
      ;;
    --filter-path)
      echo "@FILTER_PATH@"
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

---[FILE: MagickCore.h]---
Location: ImageMagick-main/MagickCore/MagickCore.h

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

  MagickCore Application Programming Interface declarations.
*/

#ifndef MAGICKCORE_CORE_H
#define MAGICKCORE_CORE_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#if !defined(MAGICKCORE_CONFIG_H)
# define MAGICKCORE_CONFIG_H
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

#define MAGICKCORE_CHECK_VERSION(major,minor,micro) \
  ((MAGICKCORE_MAJOR_VERSION > (major)) || \
    ((MAGICKCORE_MAJOR_VERSION == (major)) && \
     (MAGICKCORE_MINOR_VERSION > (minor))) || \
    ((MAGICKCORE_MAJOR_VERSION == (major)) && \
     (MAGICKCORE_MINOR_VERSION == (minor)) && \
     (MAGICKCORE_MICRO_VERSION >= (micro))))

#include <stdio.h>
#include <stdarg.h>
#include <stdlib.h>
#include <stdint.h>
#include <math.h>
#include <sys/types.h>
#include <time.h>

#if defined(WIN32) || defined(WIN64) || defined(_WIN32_WINNT)
#  define MAGICKCORE_WINDOWS_SUPPORT
#else
#  define MAGICKCORE_POSIX_SUPPORT
#endif 

#include "MagickCore/method-attribute.h"

#if defined(MAGICKCORE_NAMESPACE_PREFIX)
# include "MagickCore/methods.h"
#endif
#include "MagickCore/magick-type.h"
#include "MagickCore/animate.h"
#include "MagickCore/annotate.h"
#include "MagickCore/artifact.h"
#include "MagickCore/attribute.h"
#include "MagickCore/blob.h"
#include "MagickCore/cache.h"
#include "MagickCore/cache-view.h"
#include "MagickCore/channel.h"
#include "MagickCore/cipher.h"
#include "MagickCore/client.h"
#include "MagickCore/coder.h"
#include "MagickCore/color.h"
#include "MagickCore/colorspace.h"
#include "MagickCore/colormap.h"
#include "MagickCore/compare.h"
#include "MagickCore/composite.h"
#include "MagickCore/compress.h"
#include "MagickCore/configure.h"
#include "MagickCore/constitute.h"
#include "MagickCore/decorate.h"
#include "MagickCore/delegate.h"
#include "MagickCore/deprecate.h"
#include "MagickCore/display.h"
#include "MagickCore/distort.h"
#include "MagickCore/distribute-cache.h"
#include "MagickCore/draw.h"
#include "MagickCore/effect.h"
#include "MagickCore/enhance.h"
#include "MagickCore/exception.h"
#include "MagickCore/feature.h"
#include "MagickCore/fourier.h"
#include "MagickCore/fx.h"
#include "MagickCore/gem.h"
#include "MagickCore/geometry.h"
#include "MagickCore/histogram.h"
#include "MagickCore/identify.h"
#include "MagickCore/image.h"
#include "MagickCore/image-view.h"
#include "MagickCore/layer.h"
#include "MagickCore/linked-list.h"
#include "MagickCore/list.h"
#include "MagickCore/locale_.h"
#include "MagickCore/log.h"
#include "MagickCore/magic.h"
#include "MagickCore/magick.h"
#include "MagickCore/matrix.h"
#include "MagickCore/memory_.h"
#include "MagickCore/module.h"
#include "MagickCore/mime.h"
#include "MagickCore/monitor.h"
#include "MagickCore/montage.h"
#include "MagickCore/morphology.h"
#include "MagickCore/opencl.h"
#include "MagickCore/option.h"
#include "MagickCore/paint.h"
#include "MagickCore/pixel.h"
#include "MagickCore/pixel-accessor.h"
#include "MagickCore/policy.h"
#include "MagickCore/prepress.h"
#include "MagickCore/profile.h"
#include "MagickCore/property.h"
#include "MagickCore/quantize.h"
#include "MagickCore/quantum.h"
#include "MagickCore/registry.h"
#include "MagickCore/random_.h"
#include "MagickCore/resample.h"
#include "MagickCore/resize.h"
#include "MagickCore/resource_.h"
#include "MagickCore/segment.h"
#include "MagickCore/shear.h"
#include "MagickCore/signature.h"
#include "MagickCore/splay-tree.h"
#include "MagickCore/static.h"
#include "MagickCore/statistic.h"
#include "MagickCore/stream.h"
#include "MagickCore/string_.h"
#include "MagickCore/timer.h"
#include "MagickCore/token.h"
#include "MagickCore/transform.h"
#include "MagickCore/threshold.h"
#include "MagickCore/type.h"
#include "MagickCore/utility.h"
#include "MagickCore/version.h"
#include "MagickCore/vision.h"
#include "MagickCore/visual-effects.h"
#include "MagickCore/xml-tree.h"
#include "MagickCore/xwindow.h"

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: MagickCore.pc.in]---
Location: ImageMagick-main/MagickCore/MagickCore.pc.in

```text
prefix=@prefix@
exec_prefix=@exec_prefix@
libdir=@libdir@
includedir=@includedir@/ImageMagick-@MAGICK_MAJOR_VERSION@
includearchdir=@INCLUDEARCH_DIR@/ImageMagick-@MAGICK_MAJOR_VERSION@
libname=MagickCore-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@
moduledir=@libdir@/ImageMagick-@MAGICK_MAJOR_VERSION@.@MAGICK_MINOR_VERSION@.@MAGICK_MICRO_VERSION@/modules-@MAGICK_ABI_SUFFIX@
 
Name: MagickCore
Description: MagickCore - C API for ImageMagick (ABI @MAGICK_ABI_SUFFIX@)
URL: https://github.com/ImageMagick
Version: @PACKAGE_BASE_VERSION@
Cflags: -I${includearchdir} -I${includedir} @MAGICK_PCFLAGS@
Libs: -L${libdir} -l${libname}
Libs.private: -L${libdir} -l${libname} @MAGICK_LIBS@ @MATH_LIBS@
```

--------------------------------------------------------------------------------

---[FILE: Make.com]---
Location: ImageMagick-main/MagickCore/Make.com

```text
$!
$! Make ImageMagick image utilities for VMS.
$!
$ define/nolog MAGICKCORE [-.magickcore]
$ define/nolog MAGICKWAND [-.magickwand]
$ copy version.h_vms version.h
$ copy config.h_vms magick-baseconfig.h
$ copy xwdfile.h_vms xwdfile.h
$
$if (f$trnlnm("X11") .eqs. "") then define/nolog X11 decw$include:
$compile_options="/nodebug/optimize"
$if (f$search("sys$system:decc$compiler.exe") .nes. "") 
$then     ! VAX with DEC C
$  compile_options="/decc/nodebug/optimize/warning=(disable=rightshiftovr)"
$else     ! VAX with VAX C
$define/nolog lnk$library sys$library:vaxcrtl
$define/nolog sys sys$share
$endif
$if (f$getsyi("HW_MODEL") .gt. 1023)
$then     ! Alpha with DEC C
$  define/nolog sys decc$library_include
$  compile_options="/nodebug/optimize/prefix=all/warning=disable=(rightshiftovr,ptrmismatch,cvtdiftypes,SIZFUNVOIDTYP)/name=(as_is,short)/float=ieee
$endif
$
$write sys$output "Making MagickCore..."
$call Make accelerate.c
$call Make animate.c
$call Make annotate.c
$call Make artifact.c
$call Make attribute.c
$call Make blob.c
$call Make cache.c
$call Make cache-view.c
$call Make channel.c
$call Make cipher.c
$call Make client.c
$call Make coder.c
$call Make color.c
$call Make colormap.c
$call Make colorspace.c
$call Make compare.c
$call Make composite.c
$call Make compress.c
$call Make configure.c
$call Make constitute.c
$call Make decorate.c
$call Make delegate.c
$call Make deprecate.c
$call Make display.c
$call Make distort.c
$call Make distribute-cache.c
$call Make draw.c
$call Make effect.c
$call Make enhance.c
$call Make exception.c
$call Make feature.c
$call Make fourier.c
$call Make fx.c
$call Make gem.c
$call Make geometry.c
$call Make hashmap.c
$call Make histogram.c
$call Make identify.c
$call Make image.c
$call Make image-view.c
$call Make layer.c
$call Make list.c
$call Make locale.c
$call Make log.c
$call Make magic.c
$call Make magick.c
$call Make matrix.c
$call Make memory.c
$call Make mime.c
$call Make module.c
$call Make monitor.c
$call Make montage.c
$call Make morphology.c
$call Make opencl.c
$call Make option.c
$call Make paint.c
$call Make pixel.c
$call Make policy.c
$call Make prepress.c
$call Make property.c
$call Make PreRvIcccm.c
$call Make profile.c
$call Make quantize.c
$call Make quantum.c
$call Make quantum-export.c
$call Make quantum-import.c
$call Make random.c
$call Make registry.c
$call Make resample.c
$call Make resize.c
$call Make resource.c
$call Make segment.c
$call Make semaphore.c
$call Make shear.c
$call Make signature.c
$call Make splay-tree.c
$call Make static.c
$call Make statistic.c
$call Make stream.c
$call Make string.c
$call Make thread.c
$call Make timer.c
$call Make token.c
$call Make transform.c
$call Make threshold.c
$call Make type.c
$call Make utility.c
$call Make version.c
$call Make vision.c
$call Make vms.c
$call Make widget.c
$call Make xml-tree.c
$call Make xwindow.c
$ set default [-.filters]
$ call Make analyze.c
$ set default [-.magickwand]
$ call Make drawing-wand.c
$ call Make pixel-wand.c
$ call Make wand-view.c
$ call Make conjure.c
$ call Make convert.c
$ call Make import.c
$ call Make mogrify.c
$ copy animate.c animate-wand.c
$ call make animate-wand.c
$ copy compare.c compare-wand.c
$ call make compare-wand.c
$ copy composite.c composite-wand.c
$ call make composite-wand.c
$ copy display.c display-wand.c
$ call make display-wand.c
$ copy identify.c identify-wand.c
$ call make identify-wand.c
$ copy montage.c montage-wand.c
$ call make montage-wand.c
$ call Make magick-wand.c
$ call Make wand.c
$ call Make magick-image.c
$ set default [-.magickcore]
$ deass magickcore
$ deass magickwand
$library/create libMagick.olb -
  accelerate, animate, annotate, artifact, attribute, blob, cache, cache-view, -
  channel, cipher, client, coder, color, colormap, colorspace, compare, -
  composite, compress, configure, constitute, decorate, delegate, deprecate, -
  display, distort, draw, effect, enhance, exception, feature, fourier, fx, -
  gem, geometry, hashmap, histogram, identify, image, image-view, layer, list, -
  locale, log, magic, magick, matrix, memory, mime, module, monitor, montage, -
  morphology, opencl, option, paint, pixel, PreRvIcccm, profile, quantize, quantum, -
  quantum-export, quantum-import,random, registry, resample, resize, resource, -
  segment, semaphore, shear, signature, splay-tree, static, stream, string, -
  thread, timer, token, transform, threshold, type, utility, version, vms, -
  widget, xwindow, statistic, policy, prepress, property, xml-tree, -
   distribute-cache, vision,-
	[-.filters]analyze,[-.magickwand]drawing-wand, pixel-wand, wand-view, conjure, -
  convert,import, mogrify, animate-wand, compare-wand, composite-wand, -
  display-wand,identify-wand,montage-wand,magick-wand,wand,magick-image
$exit
$
$Make: subroutine
$!
$! Primitive MMS hack for DCL.
$!
$if (p1 .eqs. "") then exit
$source_file=f$search(f$parse(p1,".c"))
$if (source_file .nes. "")
$then
$  object_file=f$parse(source_file,,,"name")+".obj"
$  object_file=f$search( object_file )
$  if (object_file .nes. "")
$  then
$    object_time=f$file_attribute(object_file,"cdt")
$    source_time=f$file_attribute(source_file,"cdt")
$    if (f$cvtime(object_time) .lts. f$cvtime(source_time)) then -
$      object_file=""
$  endif
$  if (object_file .eqs. "")
$  then
$    write sys$output "Compiling ",p1
$    cc'compile_options'/include_directory=([-],[-.magickcore],[-.jpeg],[-.png], -
       [-.tiff],[-.ttf],[-.zlib]) 'source_file'  
$  endif
$endif
$exit
$endsubroutine
```

--------------------------------------------------------------------------------

---[FILE: Makefile.am]---
Location: ImageMagick-main/MagickCore/Makefile.am

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
#  Makefile for building the MagickCore API.
#

MagickCoreincdir = $(INCLUDE_PATH)/MagickCore
MagickCoreincarchdir = $(INCLUDEARCH_PATH)/MagickCore

# Headers which are installed
MagickCoreinc_HEADERS = \
  $(MAGICKCORE_INCLUDE_HDRS)
MagickCoreincarch_HEADERS = \
  $(MAGICKCORE_INCLUDEARCH_HDRS)

MAGICKCORE_BIN_SCRPTS = \
  MagickCore/MagickCore-config

MAGICKCORE_PKGCONFIG = \
  MagickCore/ImageMagick.pc \
  MagickCore/ImageMagick-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@.pc \
  MagickCore/MagickCore.pc \
  MagickCore/MagickCore-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@.pc

OSX_GCOV_LDFLAG = @OSX_GCOV_LDFLAG@

MAGICKCORE_MANS = \
  MagickCore/MagickCore-config.1

MAGICKCORE_LIBS = MagickCore/libMagickCore-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@.la

if WITH_MODULES
MagickCore_libMagickCore_@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_SOURCES = $(MAGICKCORE_BASE_SRCS) $(MAGICKCORE_PLATFORM_SRCS)
MagickCore_libMagickCore_@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_LIBADD = $(MAGICK_DEP_LIBS)
else
MagickCore_libMagickCore_@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_SOURCES = $(MAGICKCORE_BASE_SRCS) $(MAGICKCORE_PLATFORM_SRCS) $(MAGICKCORE_CODER_SRCS) $(MAGICKCORE_FILTER_SRCS)
MagickCore_libMagickCore_@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_LIBADD = $(MAGICK_DEP_LIBS)
endif # WITH_MODULES

if WIN32_NATIVE_BUILD
MagickCore_libMagickCore_@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_LIBADD += -lws2_32
if WITH_MODULES
else
MagickCore_libMagickCore_@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_LIBADD += -lurlmon
endif
endif

nodist_MagickCore_libMagickCore_@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_SOURCES =
MagickCore_libMagickCore_@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_CPPFLAGS = $(AM_CPPFLAGS) $(LIBRARY_EXTRA_CPPFLAGS)

if HAVE_LD_VERSION_SCRIPT
MagickCore_libMagickCore_@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_LDFLAGS_VERSION =  -Wl,--version-script=$(top_srcdir)/MagickCore/libMagickCore.map
else
MagickCore_libMagickCore_@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_LDFLAGS_VERSION = -export-symbols-regex ".*"
endif

MagickCore_libMagickCore_@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_LDFLAGS = -no-undefined \
  $(MagickCore_libMagickCore_la_LDFLAGS_VERSION) \
  $(OSX_GCOV_LDFLAG) $(MAGICK_LT_RELEASE_OPTS) -version-info \
  $(MAGICK_LIBRARY_CURRENT):$(MAGICK_LIBRARY_REVISION):$(MAGICK_LIBRARY_AGE)
MagickCore_libMagickCore_@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_DEPENDENCIES =

# Library base sources
MAGICKCORE_BASE_SRCS = \
  MagickCore/MagickCore.h \
  MagickCore/accelerate.c \
  MagickCore/accelerate-private.h \
  MagickCore/accelerate-kernels-private.h \
  MagickCore/animate.c \
  MagickCore/animate.h \
  MagickCore/animate-private.h \
  MagickCore/annotate.c \
  MagickCore/annotate.h \
  MagickCore/artifact.c \
  MagickCore/artifact.h \
  MagickCore/attribute.c \
  MagickCore/attribute.h \
  MagickCore/blob.c \
  MagickCore/blob.h \
  MagickCore/blob-private.h \
  MagickCore/cache.c \
  MagickCore/cache.h \
  MagickCore/cache-private.h \
  MagickCore/cache-view.c \
  MagickCore/cache-view.h \
  MagickCore/channel.c \
  MagickCore/channel.h \
  MagickCore/cipher.c \
  MagickCore/cipher.h \
  MagickCore/client.c \
  MagickCore/client.h \
  MagickCore/coder.c \
  MagickCore/coder.h \
  MagickCore/color.c \
  MagickCore/color.h \
  MagickCore/color-private.h \
  MagickCore/colormap.c \
  MagickCore/colormap.h \
  MagickCore/colormap-private.h \
  MagickCore/colorspace.c \
  MagickCore/colorspace.h \
  MagickCore/colorspace-private.h \
  MagickCore/compare.c \
  MagickCore/compare.h \
  MagickCore/compare-private.h \
  MagickCore/composite.c \
  MagickCore/composite.h \
  MagickCore/composite-private.h \
  MagickCore/compress.c \
  MagickCore/compress.h \
  MagickCore/configure.c \
  MagickCore/configure.h \
  MagickCore/constitute.c \
  MagickCore/constitute.h \
  MagickCore/decorate.c \
  MagickCore/decorate.h \
  MagickCore/delegate.c \
  MagickCore/delegate.h \
  MagickCore/delegate-private.h \
  MagickCore/deprecate.c \
  MagickCore/deprecate.h \
  MagickCore/display.c \
  MagickCore/display.h \
  MagickCore/display-private.h \
  MagickCore/distort.c \
  MagickCore/distort.h \
  MagickCore/distribute-cache.c \
  MagickCore/distribute-cache.h \
  MagickCore/distribute-cache-private.h \
  MagickCore/draw.c \
  MagickCore/draw.h \
  MagickCore/draw-private.h \
  MagickCore/effect.c \
  MagickCore/effect.h \
  MagickCore/enhance.c \
  MagickCore/enhance.h \
  MagickCore/exception.c \
  MagickCore/exception.h \
  MagickCore/exception-private.h \
  MagickCore/feature.c \
  MagickCore/feature.h \
  MagickCore/fourier.c \
  MagickCore/fourier.h \
  MagickCore/fx.c \
  MagickCore/fx.h \
  MagickCore/fx-private.h \
  MagickCore/gem.c \
  MagickCore/gem.h \
  MagickCore/gem-private.h \
  MagickCore/geometry.c \
  MagickCore/geometry.h \
  MagickCore/geometry-private.h \
  MagickCore/histogram.c \
  MagickCore/histogram.h \
  MagickCore/identify.c \
  MagickCore/identify.h \
  MagickCore/image.c \
  MagickCore/image.h \
  MagickCore/image-private.h \
  MagickCore/image-view.c \
  MagickCore/image-view.h \
  MagickCore/layer.c \
  MagickCore/layer.h \
  MagickCore/linked-list.c \
  MagickCore/linked-list.h \
  MagickCore/list.c \
  MagickCore/list.h \
  MagickCore/locale.c \
  MagickCore/locale_.h \
  MagickCore/log.c \
  MagickCore/log.h \
  MagickCore/magic.c \
  MagickCore/magic.h \
  MagickCore/magick.c \
  MagickCore/magick-baseconfig.h \
  MagickCore/magick-config.h \
  MagickCore/magick-type.h \
  MagickCore/magick.h \
  MagickCore/matrix.c \
  MagickCore/matrix.h \
  MagickCore/matrix-private.h \
  MagickCore/memory.c \
  MagickCore/memory_.h \
  MagickCore/memory-private.h \
  MagickCore/method-attribute.h \
  MagickCore/methods.h \
  MagickCore/mime.c \
  MagickCore/mime.h \
  MagickCore/module.c \
  MagickCore/module.h \
  MagickCore/monitor.c \
  MagickCore/monitor.h \
  MagickCore/monitor-private.h \
  MagickCore/montage.c \
  MagickCore/montage.h \
  MagickCore/morphology.c \
  MagickCore/morphology.h \
  MagickCore/morphology-private.h \
  MagickCore/mutex.h \
  MagickCore/nt-base.h \
  MagickCore/nt-base-private.h \
  MagickCore/nt-feature.h \
  MagickCore/opencl.c \
  MagickCore/opencl.h \
  MagickCore/opencl-private.h \
  MagickCore/option.c \
  MagickCore/option.h \
  MagickCore/option-private.h \
  MagickCore/paint.c \
  MagickCore/paint.h \
  MagickCore/pixel.c \
  MagickCore/pixel.h \
  MagickCore/pixel-accessor.h \
  MagickCore/pixel-private.h \
  MagickCore/policy.c \
  MagickCore/policy.h \
  MagickCore/policy-private.h \
  MagickCore/prepress.c \
  MagickCore/prepress.h \
  MagickCore/property.c \
  MagickCore/property.h \
  MagickCore/profile.c \
  MagickCore/profile.h \
  MagickCore/profile-private.h \
  MagickCore/quantize.c \
  MagickCore/quantize.h \
  MagickCore/quantum.c \
  MagickCore/quantum.h \
  MagickCore/quantum-export.c \
  MagickCore/quantum-import.c \
  MagickCore/quantum-private.h \
  MagickCore/random.c \
  MagickCore/random_.h \
  MagickCore/random-private.h \
  MagickCore/registry.c \
  MagickCore/registry.h \
  MagickCore/resample.c \
  MagickCore/resample.h \
  MagickCore/resample-private.h \
  MagickCore/resize.c \
  MagickCore/resize.h \
  MagickCore/resize-private.h \
  MagickCore/resource.c \
  MagickCore/resource_.h \
  MagickCore/resource-private.h \
  MagickCore/segment.c \
  MagickCore/segment.h \
  MagickCore/semaphore.c \
  MagickCore/semaphore.h \
  MagickCore/semaphore-private.h \
  MagickCore/shear.c \
  MagickCore/shear.h \
  MagickCore/signature.c \
  MagickCore/signature.h \
  MagickCore/signature-private.h \
  MagickCore/splay-tree.c \
  MagickCore/splay-tree.h \
  MagickCore/static.c \
  MagickCore/static.h \
  MagickCore/statistic.c \
  MagickCore/statistic.h \
  MagickCore/statistic-private.h \
  MagickCore/stream.c \
  MagickCore/stream.h \
  MagickCore/stream-private.h \
  MagickCore/string.c \
  MagickCore/string_.h \
  MagickCore/string-private.h \
  MagickCore/studio.h \
  MagickCore/thread.c \
  MagickCore/thread_.h \
  MagickCore/thread-private.h \
  MagickCore/timer.c \
  MagickCore/timer.h \
  MagickCore/timer-private.h \
  MagickCore/token.c \
  MagickCore/token.h \
  MagickCore/token-private.h \
  MagickCore/transform.c \
  MagickCore/transform.h \
  MagickCore/threshold.c \
  MagickCore/threshold.h \
  MagickCore/type.c \
  MagickCore/type.h \
  MagickCore/utility.c \
  MagickCore/utility.h \
  MagickCore/utility-private.h \
  MagickCore/version.c \
  MagickCore/version.h \
  MagickCore/version-private.h \
  MagickCore/visual-effects.c \
  MagickCore/visual-effects.h \
  MagickCore/vision.c \
  MagickCore/vision.h \
  MagickCore/widget.c \
  MagickCore/widget.h \
  MagickCore/widget-private.h \
  MagickCore/xml-tree.c \
  MagickCore/xml-tree.h \
  MagickCore/xml-tree-private.h \
  MagickCore/xwindow.c \
  MagickCore/xwindow.h

if WIN32_NATIVE_BUILD
MAGICKCORE_PLATFORM_SRCS = \
  MagickCore/nt-base.c \
  MagickCore/nt-base.h \
  MagickCore/nt-base-private.h \
  MagickCore/nt-feature.c \
  MagickCore/nt-feature.h
else
if CYGWIN_BUILD
MAGICKCORE_PLATFORM_SRCS = \
  MagickCore/nt-feature.c \
  MagickCore/nt-feature.h
else
MAGICKCORE_PLATFORM_SRCS =
endif # if CYGWIN_BUILD
endif # if WIN32_NATIVE_BUILD

MAGICKCORE_INCLUDE_HDRS = \
  MagickCore/MagickCore.h \
  MagickCore/animate.h \
  MagickCore/annotate.h \
  MagickCore/artifact.h \
  MagickCore/attribute.h \
  MagickCore/blob.h \
  MagickCore/cache.h \
  MagickCore/cache-view.h \
  MagickCore/channel.h \
  MagickCore/cipher.h \
  MagickCore/client.h \
  MagickCore/coder.h \
  MagickCore/color.h \
  MagickCore/colormap.h \
  MagickCore/colorspace.h \
  MagickCore/compare.h \
  MagickCore/composite.h \
  MagickCore/compress.h \
  MagickCore/configure.h \
  MagickCore/constitute.h \
  MagickCore/decorate.h \
  MagickCore/delegate.h \
  MagickCore/deprecate.h \
  MagickCore/display.h \
  MagickCore/distort.h \
  MagickCore/distribute-cache.h \
  MagickCore/draw.h \
  MagickCore/effect.h \
  MagickCore/enhance.h \
  MagickCore/exception.h \
  MagickCore/feature.h \
  MagickCore/fourier.h \
  MagickCore/fx.h \
  MagickCore/gem.h \
  MagickCore/geometry.h \
  MagickCore/histogram.h \
  MagickCore/identify.h \
  MagickCore/image.h \
  MagickCore/image-view.h \
  MagickCore/layer.h \
  MagickCore/linked-list.h \
  MagickCore/list.h \
  MagickCore/locale_.h \
  MagickCore/log.h \
  MagickCore/magic.h \
  MagickCore/magick.h \
  MagickCore/magick-config.h \
  MagickCore/magick-type.h \
  MagickCore/matrix.h \
  MagickCore/memory_.h \
  MagickCore/method-attribute.h \
  MagickCore/methods.h \
  MagickCore/mime.h \
  MagickCore/module.h \
  MagickCore/monitor.h \
  MagickCore/montage.h \
  MagickCore/morphology.h \
  MagickCore/nt-base.h \
  MagickCore/opencl.h \
  MagickCore/option.h \
  MagickCore/paint.h \
  MagickCore/pixel.h \
  MagickCore/pixel-accessor.h \
  MagickCore/policy.h \
  MagickCore/prepress.h \
  MagickCore/profile.h \
  MagickCore/property.h \
  MagickCore/quantize.h \
  MagickCore/quantum.h \
  MagickCore/random_.h \
  MagickCore/registry.h \
  MagickCore/resample.h \
  MagickCore/resize.h \
  MagickCore/resource_.h \
  MagickCore/segment.h \
  MagickCore/semaphore.h \
  MagickCore/shear.h \
  MagickCore/signature.h \
  MagickCore/splay-tree.h \
  MagickCore/static.h \
  MagickCore/statistic.h \
  MagickCore/stream.h \
  MagickCore/string_.h \
  MagickCore/studio.h \
  MagickCore/timer.h \
  MagickCore/token.h \
  MagickCore/transform.h \
  MagickCore/threshold.h \
  MagickCore/type.h \
  MagickCore/utility.h \
  MagickCore/version.h \
  MagickCore/vision.h \
  MagickCore/visual-effects.h \
  MagickCore/widget.h \
  MagickCore/xml-tree.h \
  MagickCore/xwindow.h

MAGICKCORE_NOINST_HDRS = \
  MagickCore/accelerate-private.h \
  MagickCore/accelerate-kernels-private.h \
  MagickCore/animate-private.h \
  MagickCore/annotate-private.h \
  MagickCore/blob-private.h \
  MagickCore/cache-private.h \
  MagickCore/cache-private.h \
  MagickCore/coder-private.h \
  MagickCore/colormap-private.h \
  MagickCore/color-private.h \
  MagickCore/color-private.h \
  MagickCore/colorspace-private.h \
  MagickCore/compare-private.h \
  MagickCore/composite-private.h \
  MagickCore/configure-private.h \
  MagickCore/constitute-private.h \
  MagickCore/delegate-private.h \
  MagickCore/delegate-private.h \
  MagickCore/display-private.h \
  MagickCore/distribute-cache-private.h \
  MagickCore/draw-private.h \
  MagickCore/exception-private.h \
  MagickCore/fx-private.h \
  MagickCore/gem-private.h \
  MagickCore/geometry-private.h \
  MagickCore/image-private.h \
  MagickCore/linked-list-private.h \
  MagickCore/locale-private.h \
  MagickCore/log-private.h \
  MagickCore/magick-private.h \
  MagickCore/magic-private.h \
  MagickCore/matrix-private.h \
  MagickCore/memory-private.h \
  MagickCore/mime-private.h \
  MagickCore/mime-private.h \
  MagickCore/module-private.h \
  MagickCore/monitor-private.h \
  MagickCore/morphology-private.h \
  MagickCore/mutex.h \
  MagickCore/nt-base.h \
  MagickCore/nt-feature.h \
  MagickCore/opencl-private.h \
  MagickCore/option-private.h \
  MagickCore/pixel-private.h \
  MagickCore/policy-private.h \
  MagickCore/profile-private.h \
  MagickCore/quantum-private.h \
  MagickCore/random-private.h \
  MagickCore/registry-private.h \
  MagickCore/resample-private.h \
  MagickCore/resize-private.h \
  MagickCore/resource-private.h \
  MagickCore/resource-private.h \
  MagickCore/semaphore-private.h \
  MagickCore/semaphore-private.h \
  MagickCore/signature-private.h \
  MagickCore/statistic-private.h \
  MagickCore/stream-private.h \
  MagickCore/string-private.h \
  MagickCore/thread_.h \
  MagickCore/thread-private.h \
  MagickCore/timer-private.h \
  MagickCore/token-private.h \
  MagickCore/transform-private.h \
  MagickCore/type-private.h \
  MagickCore/utility-private.h \
  MagickCore/version-private.h \
  MagickCore/widget-private.h \
  MagickCore/xml-tree-private.h \
  MagickCore/xwindow-private.h

MAGICKCORE_INCLUDEARCH_HDRS = \
  MagickCore/magick-baseconfig.h

MAGICKCORE_EXTRA_DIST = \
  MagickCore/MagickCore-config.in \
  $(MAGICKCORE_MANS) \
  MagickCore/ImageMagick.pc.in \
  MagickCore/MagickCore.pc.in \
  MagickCore/libMagickCore.map \
  MagickCore/nt-base.c \
  MagickCore/nt-feature.c

if MAGICKCORE_ZERO_CONFIGURATION_SUPPORT
libMagickCore_threshold_target = MagickCore/libMagickCore_@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la-threshold.lo
$(libMagickCore_threshold_target): MagickCore/threshold-map.h
nodist_MagickCore_libMagickCore_@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_SOURCES += MagickCore/threshold-map.h
CLEANFILES += MagickCore/threshold-map.h
MagickCore/threshold-map.h: config/thresholds.xml Makefile
	$(AM_V_GEN){ printf '%s\n  %s=\n' 'static const char *const' BuiltinMap; sed -e 's/"/\\"/g; s/^.*$$/    "&\\n"/; $$s/$$/;/' $<; } >$@
endif
```

--------------------------------------------------------------------------------

---[FILE: matrix-private.h]---
Location: ImageMagick-main/MagickCore/matrix-private.h

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

  MagickCore private graphic matrix methods.
*/
#ifndef MAGICKCORE_MATRIX_PRIVATE_H
#define MAGICKCORE_MATRIX_PRIVATE_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

extern MagickPrivate MagickBooleanType
  GaussJordanElimination(double **,double **,const size_t,const size_t);

extern MagickPrivate void
  LeastSquaresAddTerms(double **,double **,const double *,const double *,
    const size_t, const size_t);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

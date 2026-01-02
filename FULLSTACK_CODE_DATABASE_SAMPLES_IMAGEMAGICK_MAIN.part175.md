---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 175
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 175 of 851)

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

---[FILE: version.m4]---
Location: ImageMagick-main/m4/version.m4

```text
#  Copyright @ 1999 ImageMagick Studio LLC, a non-profit organization
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
#  Given a version number MAJOR.MINOR.MICRO-PATCH, increment the:
#
#  1. MAJOR version for incompatible API changes,
#  2. MINOR version when MICRO version exceeds 15 e.g. 0x70F becomes 0x710
#  3. MICRO version for added functionality in backwards compatible
#     manner, and
#  4. PATCH version when you make backwards compatible bug fixes.
#
#  Additional labels for pre-release and build metadata are available as
#  extensions to the MAJOR.MINOR.MICRO-PATCH format. 
#
m4_define([magick_name], [ImageMagick])
m4_define([magick_major_version], [7])
m4_define([magick_minor_version], [1])
m4_define([magick_micro_version], [2])
m4_define([magick_patchlevel_version], [12])
m4_define([magick_is_beta], [y])
m4_define([magick_bugreport],
          [https://github.com/ImageMagick/ImageMagick/issues])
m4_define([magick_url], [https://imagemagick.org])
m4_define([magick_lib_version], [0x712])
m4_define([magick_tarname], [ImageMagick])

#
# If the library source code has changed at all since the last update,
# increment revision (‘c:r:a’ becomes ‘c:r+1:a’).  If any interfaces have been
# added, removed, or changed since the last update, increment current, and set
# revision to 0.  If any interfaces have been added since the last public
# release, then increment age.  If any interfaces have been removed or changed
# since the last public release, then set age to 0.
#
# PLEASE NOTE that doing a SO BUMP aka raising the CURRENT REVISION
# could be avoided using libversioning aka map files.  You MUST change .map
# files if you raise these versions.
#
# Bump the minor release # whenever there is an SOVersion bump.
m4_define([magick_library_current], [10])
m4_define([magick_library_revision], [2])
m4_define([magick_library_age], [0])
 
m4_define([magickpp_library_current], [5])
m4_define([magickpp_library_revision], [0])
m4_define([magickpp_library_age], [0])
```

--------------------------------------------------------------------------------

---[FILE: AUTHORS]---
Location: ImageMagick-main/Magick++/AUTHORS

```text
The author and maintainer of Magick++ is Bob Friesenhahn
<bfriesen@simple.dallas.tx.us>.

Many thanks to Cristy for developing the powerful ImageMagick
package that Magick++ is based on and for enhancing ImageMagick API
features in order to allow a cleaner implementation.

Thanks to Bill Radcliffe <BillR@corbis.com> for his assistance with
getting Magick++ to compile under Visual C++, and for maintaining the
Windows build environment.

Thanks to Albert Chin-A-Young <china@thewrittenword.com> for assisting
with compilation issues related to the SGI C++ compiler, for providing
access to the Sun C++ compiler, and for assistance with the configure
script.

Thanks to Leonard Rosenthol <leonardr@lazerware.com> for ensuring that
Magick++ compiles on the Mac.
```

--------------------------------------------------------------------------------

---[FILE: LICENSE]---
Location: ImageMagick-main/Magick++/LICENSE

```text

Copyright 1999 - 2002 Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
                                                                          
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files ("Magick++"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

--------------------------------------------------------------------------------

---[FILE: Makefile.am]---
Location: ImageMagick-main/Magick++/Makefile.am

```text
#
# Top Makefile for Magick++
#
# Copyright Bob Friesenhahn, 1999, 2000, 2002, 2004, 2008
#

# AM_CPPFLAGS += -I$(top_srcdir)/Magick++/lib

MAGICKPP_CPPFLAGS = $(AM_CPPFLAGS) -I$(top_srcdir)/Magick++/lib

if WITH_MAGICK_PLUS_PLUS
MAGICKPP_LIBS = Magick++/lib/libMagick++-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@.la
MAGICKPP_LDADD = $(MAGICKPP_LIBS) $(top_builddir)/MagickCore/libMagickCore-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@.la $(top_builddir)/MagickWand/libMagickWand-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@.la
MAGICKPP_CHECK_PGRMS = $(MAGICKPP_CHECK_PGRMS_OPT)
MAGICKPP_MANS = $(MAGICKPP_MANS_OPT)
MAGICKPP_PKGCONFIG = $(MAGICKPP_PKGCONFIG_OPT)
MAGICKPP_SCRPTS = $(MAGICKPP_SCRPTS_OPT)
MAGICKPP_TESTS = $(MAGICKPP_TEST_SCRPTS_OPT)
MAGICKPP_TOP_INCHEADERS = $(MAGICKPP_TOP_INCHEADERS_OPT)
MAGICKPP_INCHEADERS = $(MAGICKPP_INCHEADERS_OPT)
else
MAGICKPP_LIBS = 
MAGICKPP_LDADD =
MAGICKPP_CHECK_PGRMS = 
MAGICKPP_MANS = 
MAGICKPP_PKGCONFIG = 
MAGICKPP_SCRPTS =
MAGICKPP_TESTS = 
MAGICKPP_TOP_INCHEADERS =
MAGICKPP_INCHEADERS =
endif

MAGICKPP_SCRPTS_OPT = \
  Magick++/bin/Magick++-config

MAGICKPP_MANS_OPT = \
  Magick++/bin/Magick++-config.1

MAGICKPP_PKGCONFIG_OPT = \
  Magick++/lib/Magick++.pc \
  Magick++/lib/Magick++-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@.pc

MAGICKPP_TEST_SCRPTS_OPT = \
  Magick++/tests/tests.tap \
  Magick++/demo/demos.tap

MAGICKPP_EXTRA_DIST = \
  Magick++/AUTHORS \
  Magick++/LICENSE \
  Magick++/bin/Magick++-config.1 \
  Magick++/bin/Magick++-config.in \
  Magick++/lib/libMagick++.map \
  Magick++/lib/Magick++.pc.in \
  Magick++/demo/model.miff \
  Magick++/demo/smile.miff \
  Magick++/demo/smile_anim.miff \
  Magick++/demo/tile.miff \
  $(MAGICKPP_TEST_SCRPTS_OPT) \
  Magick++/tests/test_image.miff \
  Magick++/tests/test_image_anim.miff

MAGICKPP_CLEANFILES = \
  Magick++/demo/*_out* \
  Magick++/demo/ir.out \
  Magick++/tests/colorHistogram.txt \
  Magick++/tests/testmagick_anim_out.miff \
  Magick++/tests/ir.out

Magick___lib_libMagick___@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_SOURCES = \
  Magick++/lib/Blob.cpp \
  Magick++/lib/BlobRef.cpp \
  Magick++/lib/CoderInfo.cpp \
  Magick++/lib/Color.cpp \
  Magick++/lib/Drawable.cpp \
  Magick++/lib/Exception.cpp \
  Magick++/lib/Functions.cpp \
  Magick++/lib/Geometry.cpp \
  Magick++/lib/Image.cpp \
  Magick++/lib/ImageRef.cpp \
  Magick++/lib/Montage.cpp \
  Magick++/lib/Options.cpp \
  Magick++/lib/Pixels.cpp \
  Magick++/lib/ResourceLimits.cpp \
  Magick++/lib/SecurityPolicy.cpp \
  Magick++/lib/Statistic.cpp \
  Magick++/lib/STL.cpp \
  Magick++/lib/Thread.cpp \
  Magick++/lib/TypeMetric.cpp \
  Magick++/lib/Magick++.h \
  Magick++/lib/Magick++/Blob.h \
  Magick++/lib/Magick++/BlobRef.h \
  Magick++/lib/Magick++/CoderInfo.h \
  Magick++/lib/Magick++/Color.h \
  Magick++/lib/Magick++/Drawable.h \
  Magick++/lib/Magick++/Exception.h \
  Magick++/lib/Magick++/Functions.h \
  Magick++/lib/Magick++/Geometry.h \
  Magick++/lib/Magick++/Image.h \
  Magick++/lib/Magick++/ImageRef.h \
  Magick++/lib/Magick++/Include.h \
  Magick++/lib/Magick++/Montage.h \
  Magick++/lib/Magick++/Options.h \
  Magick++/lib/Magick++/Pixels.h \
  Magick++/lib/Magick++/ResourceLimits.h \
  Magick++/lib/Magick++/SecurityPolicy.h \
  Magick++/lib/Magick++/Statistic.h \
  Magick++/lib/Magick++/STL.h \
  Magick++/lib/Magick++/Thread.h \
  Magick++/lib/Magick++/TypeMetric.h

Magick___lib_libMagick___@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_CPPFLAGS = \
  $(MAGICKPP_CPPFLAGS) $(LIBRARY_EXTRA_CPPFLAGS)

magickpptopincdir = $(INCLUDE_PATH)

magickpptopinc_HEADERS = $(MAGICKPP_TOP_INCHEADERS)

MAGICKPP_TOP_INCHEADERS_OPT = \
  Magick++/lib/Magick++.h

magickppincdir = $(INCLUDE_PATH)/Magick++

magickppinc_HEADERS = $(MAGICKPP_INCHEADERS)

MAGICKPP_INCHEADERS_OPT = \
  Magick++/lib/Magick++/Blob.h \
  Magick++/lib/Magick++/CoderInfo.h \
  Magick++/lib/Magick++/Color.h \
  Magick++/lib/Magick++/Drawable.h \
  Magick++/lib/Magick++/Exception.h \
  Magick++/lib/Magick++/Functions.h \
  Magick++/lib/Magick++/Geometry.h \
  Magick++/lib/Magick++/Image.h \
  Magick++/lib/Magick++/Include.h \
  Magick++/lib/Magick++/Montage.h \
  Magick++/lib/Magick++/Pixels.h \
  Magick++/lib/Magick++/ResourceLimits.h \
  Magick++/lib/Magick++/SecurityPolicy.h \
  Magick++/lib/Magick++/Statistic.h \
  Magick++/lib/Magick++/STL.h \
  Magick++/lib/Magick++/TypeMetric.h

if HAVE_LD_VERSION_SCRIPT
Magick___lib_libMagick___@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_LDFLAGS_VERSION =  -Wl,--version-script=$(top_srcdir)/Magick++/lib/libMagick++.map
else
Magick___lib_libMagick___@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_LDFLAGS_VERSION = -export-symbols-regex ".*"
endif

Magick___lib_libMagick___@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_LDFLAGS = -no-undefined \
  $(Magick___lib_libMagick___la_LDFLAGS_VERSION) $(MAGICK_LT_RELEASE_OPTS) \
  -version-info \
  $(MAGICKPP_LIBRARY_CURRENT):$(MAGICKPP_LIBRARY_REVISION):$(MAGICKPP_LIBRARY_AGE)
Magick___lib_libMagick___@MAGICK_MAJOR_VERSION@_@MAGICK_ABI_SUFFIX@_la_LIBADD = $(MAGICKCORE_LIBS) $(MAGICKWAND_LIBS)

MAGICKPP_CHECK_PGRMS_OPT = \
  Magick++/demo/analyze \
  Magick++/demo/button \
  Magick++/demo/demo \
  Magick++/demo/detrans \
  Magick++/demo/flip \
  Magick++/demo/gravity \
  Magick++/demo/piddle \
  Magick++/demo/shapes \
  Magick++/demo/zoom \
  Magick++/tests/appendImages \
  Magick++/tests/attributes \
  Magick++/tests/averageImages \
  Magick++/tests/coalesceImages \
  Magick++/tests/coderInfo \
  Magick++/tests/color \
  Magick++/tests/colorHistogram \
  Magick++/tests/exceptions \
  Magick++/tests/geometry \
  Magick++/tests/montageImages \
  Magick++/tests/morphImages \
  Magick++/tests/readWriteBlob \
  Magick++/tests/readWriteImages

Magick___demo_analyze_SOURCES   = Magick++/demo/analyze.cpp
Magick___demo_analyze_LDADD     = $(MAGICKPP_LDADD)
Magick___demo_analyze_CPPFLAGS  = $(MAGICKPP_CPPFLAGS)

Magick___demo_button_SOURCES    = Magick++/demo/button.cpp
Magick___demo_button_LDADD      = $(MAGICKPP_LDADD)
Magick___demo_button_CPPFLAGS   = $(MAGICKPP_CPPFLAGS)

Magick___demo_demo_SOURCES      = Magick++/demo/demo.cpp
Magick___demo_demo_LDADD        = $(MAGICKPP_LDADD)
Magick___demo_demo_CPPFLAGS     = $(MAGICKPP_CPPFLAGS)

Magick___demo_detrans_SOURCES   = Magick++/demo/detrans.cpp
Magick___demo_detrans_LDADD     = $(MAGICKPP_LDADD)
Magick___demo_detrans_CPPFLAGS  = $(MAGICKPP_CPPFLAGS)

Magick___demo_flip_SOURCES      = Magick++/demo/flip.cpp
Magick___demo_flip_LDADD        = $(MAGICKPP_LDADD)
Magick___demo_flip_CPPFLAGS     = $(MAGICKPP_CPPFLAGS)

Magick___demo_gravity_SOURCES   = Magick++/demo/gravity.cpp
Magick___demo_gravity_LDADD     = $(MAGICKPP_LDADD)
Magick___demo_gravity_CPPFLAGS  = $(MAGICKPP_CPPFLAGS)

Magick___demo_piddle_SOURCES    = Magick++/demo/piddle.cpp
Magick___demo_piddle_LDADD      = $(MAGICKPP_LDADD)
Magick___demo_piddle_CPPFLAGS   = $(MAGICKPP_CPPFLAGS)

Magick___demo_shapes_SOURCES    = Magick++/demo/shapes.cpp
Magick___demo_shapes_LDADD      = $(MAGICKPP_LDADD)
Magick___demo_shapes_CPPFLAGS   = $(MAGICKPP_CPPFLAGS)

Magick___demo_zoom_SOURCES    = Magick++/demo/zoom.cpp
Magick___demo_zoom_LDADD      = $(MAGICKPP_LDADD)
Magick___demo_zoom_CPPFLAGS   = $(MAGICKPP_CPPFLAGS)

Magick___tests_appendImages_SOURCES   = Magick++/tests/appendImages.cpp
Magick___tests_appendImages_LDADD     = $(MAGICKPP_LDADD)
Magick___tests_appendImages_CPPFLAGS  = $(MAGICKPP_CPPFLAGS)

Magick___tests_attributes_SOURCES     = Magick++/tests/attributes.cpp
Magick___tests_attributes_LDADD       = $(MAGICKPP_LDADD)
Magick___tests_attributes_CPPFLAGS    = $(MAGICKPP_CPPFLAGS)

Magick___tests_averageImages_SOURCES  = Magick++/tests/averageImages.cpp
Magick___tests_averageImages_LDADD    = $(MAGICKPP_LDADD)
Magick___tests_averageImages_CPPFLAGS = $(MAGICKPP_CPPFLAGS)

Magick___tests_coalesceImages_SOURCES = Magick++/tests/coalesceImages.cpp
Magick___tests_coalesceImages_LDADD   = $(MAGICKPP_LDADD)
Magick___tests_coalesceImages_CPPFLAGS= $(MAGICKPP_CPPFLAGS)

Magick___tests_coderInfo_SOURCES      = Magick++/tests/coderInfo.cpp
Magick___tests_coderInfo_LDADD        = $(MAGICKPP_LDADD)
Magick___tests_coderInfo_CPPFLAGS     = $(MAGICKPP_CPPFLAGS)

Magick___tests_color_SOURCES          = Magick++/tests/color.cpp
Magick___tests_color_LDADD            = $(MAGICKPP_LDADD)
Magick___tests_color_CPPFLAGS         = $(MAGICKPP_CPPFLAGS)

Magick___tests_colorHistogram_SOURCES = Magick++/tests/colorHistogram.cpp
Magick___tests_colorHistogram_LDADD   = $(MAGICKPP_LDADD)
Magick___tests_colorHistogram_CPPFLAGS= $(MAGICKPP_CPPFLAGS)

Magick___tests_exceptions_SOURCES     = Magick++/tests/exceptions.cpp
Magick___tests_exceptions_LDADD       = $(MAGICKPP_LDADD)
Magick___tests_exceptions_CPPFLAGS    = $(MAGICKPP_CPPFLAGS)

Magick___tests_geometry_SOURCES     = Magick++/tests/geometry.cpp
Magick___tests_geometry_LDADD       = $(MAGICKPP_LDADD)
Magick___tests_geometry_CPPFLAGS    = $(MAGICKPP_CPPFLAGS)

Magick___tests_montageImages_SOURCES  = Magick++/tests/montageImages.cpp
Magick___tests_montageImages_LDADD    = $(MAGICKPP_LDADD)
Magick___tests_montageImages_CPPFLAGS = $(MAGICKPP_CPPFLAGS)

Magick___tests_morphImages_SOURCES    = Magick++/tests/morphImages.cpp
Magick___tests_morphImages_LDADD      = $(MAGICKPP_LDADD)
Magick___tests_morphImages_CPPFLAGS   = $(MAGICKPP_CPPFLAGS)

Magick___tests_readWriteBlob_SOURCES  = Magick++/tests/readWriteBlob.cpp
Magick___tests_readWriteBlob_LDADD    = $(MAGICKPP_LDADD)
Magick___tests_readWriteBlob_CPPFLAGS = $(MAGICKPP_CPPFLAGS)

Magick___tests_readWriteImages_SOURCES  = Magick++/tests/readWriteImages.cpp
Magick___tests_readWriteImages_LDADD    = $(MAGICKPP_LDADD)
Magick___tests_readWriteImages_CPPFLAGS = $(MAGICKPP_CPPFLAGS)

MAGICKPP_LOCAL_TARGETS = www/Magick++/NEWS.html www/Magick++/ChangeLog.html
```

--------------------------------------------------------------------------------

---[FILE: Magick++-config.1]---
Location: ImageMagick-main/Magick++/bin/Magick++-config.1

```text
.ad l
.nh
.TH Magick++-Config 1 "2 May 2002" "ImageMagick"
.SH NAME
Magick++-config \- get information about the installed version of Magick++
.SH SYNOPSIS
.B Magick++-config 
.B [--cppflags]
.B [--cxxflags]
.B [--exec-prefix]
.B [--ldflags]
.B [--libs]
.B [--prefix]
.B [--version]
.SH DESCRIPTION
.B Magick++-config
prints the compiler and linker flags required to compile and link programs
that use the
.BR ImageMagick
C++ Application Programmer Interface (known as
.BR Magick++
).
.SH EXAMPLES
To print the version of the installed distribution of
.BR Magick++ ,
use:

.nf
  Magick++-config \-\-version
.fi
  
To compile a program that calls the 
.BR ImageMagick
C++ Application Programmer Interface, use:

.nf
  c++ `Magick++-config \-\-cxxflags \-\-cppflags \-\-ldflags \-\-libs` program.cpp
.fi

.SH OPTIONS
.TP
.B \-\-cppflags
Print the preprocessor flags that are needed to find the
.B ImageMagick
C and C++ include files and defines to ensures that the ImageMagick data structures match between
your program and the installed libraries.
.TP
.B \-\-cxxflags
Print the compiler flags that were used to compile 
.BR libMagick++ .
.TP
.B \-\-exec-prefix
Print the directory under which target specific binaries and executables are installed.
.TP
.B \-\-ldflags
Print the linker flags that are needed to link with the
.B libMagick++
library.
.TP
.B \-\-libs
Print the linker flags that are needed to link a program with
.BR libMagick++ .
.TP
.B \-\-prefix
Print the directory under which the package is installed.
.TP
.B \-\-version
Print the version of the
.B ImageMagick
distribution to standard output.
.SH COPYRIGHT
Copyright (C) 2000 ImageMagick Studio LLC, a non-profit organization dedicated
to making software imaging solutions freely available.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files ("ImageMagick"),
to deal in ImageMagick without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of ImageMagick, and to permit persons to whom the
ImageMagick is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of ImageMagick.

The software is provided "as is", without warranty of any kind, express or
implied, including but not limited to the warranties of merchantability,
fitness for a particular purpose and noninfringement.  In no event shall
ImageMagick Studio be liable for any claim, damages or other liability,
whether in an action of contract, tort or otherwise, arising from, out of
or in connection with ImageMagick or the use or other dealings in
ImageMagick.

Except as contained in this notice, the name of the ImageMagick Studio
shall not be used in advertising or otherwise to promote the sale, use or
other dealings in ImageMagick without prior written authorization from the
ImageMagick Studio.
.SH AUTHORS
Bob Friesenhahn, ImageMagick Studio
```

--------------------------------------------------------------------------------

---[FILE: Magick++-config.in]---
Location: ImageMagick-main/Magick++/bin/Magick++-config.in

```text
#!/bin/sh
#
# Configure options script for re-calling Magick+ compilation options
# required to use the Magick++ library.
#
#

prefix=@prefix@
exec_prefix=@exec_prefix@
libdir=@libdir@
pkgconfigdir=@pkgconfigdir@
export PKG_CONFIG_LIBDIR="${pkgconfigdir}"

usage='Usage: Magick++-config [--cppflags] [--cxxflags] [--exec-prefix] [--ldflags] [--libs] [--prefix] [--version]

 For example, "magick.cpp" may be compiled to produce "magick" as follows:

  "c++ -o magick magick.cpp `Magick++-config --cppflags --cxxflags --ldflags --libs`"'

if test $# -eq 0; then
      echo "${usage}" 1>&2
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
      echo '@PACKAGE_BASE_VERSION@ Q@QUANTUM_DEPTH@ @MAGICK_HDRI@'
      ;;
    --cflags)
      @PKG_CONFIG@ --cflags Magick++-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@
      ;;
    --cxxflags)
      @PKG_CONFIG@ --cflags Magick++-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@
      ;;
    --cppflags)
      @PKG_CONFIG@ --cflags Magick++-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@
      ;;
    --ldflags)
      @PKG_CONFIG@ --libs Magick++-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@
      ;;
    --libs)
      @PKG_CONFIG@ --libs Magick++-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@
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

---[FILE: analyze.cpp]---
Location: ImageMagick-main/Magick++/demo/analyze.cpp

```cpp
//
// Demonstrate using the 'analyze' process module to compute
// image statistics.
//
// Copyright Bob Friesenhahn, 2003, 2004
//
// Copyright @ 2013 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Usage: analyze file...
//

#include <Magick++.h>
#include <cstdlib>
#include <iostream>
#include <iomanip>
#include <list>
using namespace std; 
using namespace Magick;

int main(int argc,char **argv) 
{
  if ( argc < 2 )
    {
      cout << "Usage: " << argv[0] << " file..." << endl;
      exit( 1 );
    }

  // Initialize ImageMagick install location for Windows
  MagickPlusPlusGenesis genesis(*argv);

  {
    std::list<std::string> attributes;

    attributes.push_back("TopLeftColor");
    attributes.push_back("TopRightColor");
    attributes.push_back("BottomLeftColor");
    attributes.push_back("BottomRightColor");
    attributes.push_back("filter:brightness:mean");
    attributes.push_back("filter:brightness:standard-deviation");
    attributes.push_back("filter:brightness:kurtosis");
    attributes.push_back("filter:brightness:skewness");
    attributes.push_back("filter:saturation:mean");
    attributes.push_back("filter:saturation:standard-deviation");
    attributes.push_back("filter:saturation:kurtosis");
    attributes.push_back("filter:saturation:skewness");

    char **arg = &argv[1];
    while ( *arg )
      {
        string fname(*arg);
        try {
          cout << "File: " << fname << endl;
          Image image( fname );

          /* Analyze module does not require an argument list */
          image.process("analyze",0,0);

          list<std::string>::iterator pos = attributes.begin();
          while(pos != attributes.end())
            {
              cout << "  " << setw(16) << setfill(' ') << setiosflags(ios::left)
                   << *pos << " = " << image.attribute(*pos) << endl;
              pos++;
            }
        }
        catch( Exception &error_ ) 
          { 
            cout << error_.what() << endl; 
          }
        ++arg;
      }
  }

  return 0; 
}
```

--------------------------------------------------------------------------------

---[FILE: button.cpp]---
Location: ImageMagick-main/Magick++/demo/button.cpp

```cpp
//
// Magick++ demo to generate a simple text button
//
// Copyright Bob Friesenhahn, 1999, 2000, 2001, 2003
//
// Copyright @ 2013 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
// 

#include <Magick++.h>
#include <cstdlib>
#include <string>
#include <iostream>

using namespace std;

using namespace Magick;

int main( int /*argc*/, char ** argv)
{

  // Initialize ImageMagick install location for Windows
  MagickPlusPlusGenesis genesis(*argv);

  try {

    string srcdir("");
    if(getenv("SRCDIR") != 0)
      srcdir = getenv("SRCDIR");

    //
    // Options
    //

    string backGround = "xc:#CCCCCC"; // A solid color

    // Color to use for decorative border
    Color border = "#D4DCF3";

    // Button size
    string buttonSize = "120x20";

    // Button background texture
    string buttonTexture = "granite:";

    // Button text
    string text = "Button Text";

    // Button text color
    string textColor = "red";

#if defined(MAGICKCORE_FREETYPE_DELEGATE)
    // Font point size
    int fontPointSize = 16;
#endif

    //
    // Magick++ operations
    //

    Image button;

    // Set button size
    button.size( buttonSize );

    // Read background image
    button.read( backGround );

    // Set background to buttonTexture
    Image backgroundTexture( buttonTexture );
    button.texture( backgroundTexture );

#if defined(MAGICKCORE_FREETYPE_DELEGATE)
    // Add some text
    button.fillColor( textColor );
    button.fontPointsize( fontPointSize );
    if (getenv("MAGICK_FONT") != 0)
      button.font(string(getenv("MAGICK_FONT")));
    button.annotate( text, CenterGravity );
#endif

    // Add a decorative frame
    button.borderColor( border );
    button.frame( "6x6+3+3" );

    button.depth( 8 );

    // Quantize to desired colors
    // button.quantizeTreeDepth(8);
    button.quantizeDither(false);
    button.quantizeColors(64);
    button.quantize();

    // Save to file
    cout << "Writing to \"button_out.miff\" ..." << endl;
    button.compressType( RLECompression );
    button.write("button_out.miff");

    // Display on screen
    // button.display();

  }
  catch( exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }

  return 0;
}
```

--------------------------------------------------------------------------------

---[FILE: demo.cpp]---
Location: ImageMagick-main/Magick++/demo/demo.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2001, 2002, 2003
//
// Copyright @ 2013 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Simple demo program for Magick++
//
// Concept and algorithms lifted from PerlMagick demo script written
// by Cristy.
//
// Max run-time size 60MB (as compared with 95MB for PerlMagick) under SPARC Solaris
//

#include <Magick++.h>
#include <cstdlib>
#include <string>
#include <iostream>
#include <list>

using namespace std;

using namespace Magick;

#if defined(MAGICKCORE_FREETYPE_DELEGATE)
  #define MakeLabel(image, text) image.label( (text) )
#else
  #define MakeLabel(image, text)
#endif

int main( int /*argc*/, char ** argv)
{

  // Initialize ImageMagick install location for Windows
  MagickPlusPlusGenesis genesis(*argv);

  const char *const p = getenv("MAGICK_FONT");
  const string MAGICK_FONT(p ? p : "");
  
  try {
    
    string srcdir("");
    if(getenv("SRCDIR") != 0)
      srcdir = getenv("SRCDIR");
    
    list<Image> montage;

    {
      //
      // Read model & smile image.
      //
      cout << "Read images ..." << endl;

      Image model( srcdir + "model.miff" );
      MakeLabel(model, "Magick++");
      model.borderColor( "black" );
      model.backgroundColor( "black" );
    
      Image smile( srcdir + "smile.miff" );
      MakeLabel(smile, "Smile");
      smile.borderColor( "black" );
    
      //
      // Create image stack.
      //
      cout << "Creating thumbnails..." << endl;
    
      // Construct initial list containing seven copies of a null image
      Image null;
      null.size( Geometry(70,70) );
      null.read( "NULL:black" );
      list<Image> images( 7, null );
    
      Image example = model;
    
      // Each of the following follow the pattern
      //  1. obtain reference to (own copy of) image
      //  2. apply label to image
      //  3. apply operation to image
      //  4. append image to container

      cout << "  add noise ..." << endl;
      MakeLabel(example, "Add Noise");
      example.addNoise( LaplacianNoise );
      images.push_back( example );

      cout << "  add noise (blue) ..." << endl;
      MakeLabel(example, "Add Noise\n(Blue Channel)");
      example.addNoiseChannel( BlueChannel, PoissonNoise );
      images.push_back( example );

#if defined(MAGICKCORE_FREETYPE_DELEGATE)
      cout << "  annotate ..." << endl;
      example = model;
      MakeLabel(example, "Annotate");
      example.density( "72x72" );
      example.fontPointsize( 18 );
      example.font(MAGICK_FONT);
      example.strokeColor( Color() );
      example.fillColor( "gold" );
      example.annotate( "Magick++", "+0+20", NorthGravity );
      images.push_back( example );
#endif

      cout << "  blur ..." << endl;
      example = model;
      MakeLabel(example, "Blur");
      example.blur( 0, 1.5 );
      images.push_back( example );

      cout << "  blur red channel ..." << endl;
      example = model;
      MakeLabel(example, "Blur Channel\n(Red Channel)");
      example.blurChannel( RedChannel, 0, 3.0 );
      images.push_back( example );

      cout << "  border ..." << endl;
      example = model;
      MakeLabel(example, "Border");
      example.borderColor( "gold" );
      example.border( Geometry(6,6) );
      images.push_back( example );

      cout << "  channel ..." << endl;
      example = model;
      MakeLabel(example, "Channel\n(Red Channel)");
      example.channel( RedChannel );
      images.push_back( example );

      cout << "  charcoal ..." << endl;
      example = model;
      MakeLabel(example, "Charcoal");
      example.charcoal( );
      images.push_back( example );

      cout << "  composite ..." << endl;
      example = model;
      MakeLabel(example, "Composite");
      example.composite( smile, "+35+65", OverCompositeOp);
      images.push_back( example );

      cout << "  contrast ..." << endl;
      example = model;
      MakeLabel(example, "Contrast");
      example.contrast( false );
      images.push_back( example );

      cout << "  convolve ..." << endl;
      example = model;
      MakeLabel(example, "Convolve");
      {
        // 3x3 matrix
        const double kernel[] = { 1, 1, 1, 1, 4, 1, 1, 1, 1 };
        example.convolve( 3, kernel );
      }
      images.push_back( example );

      cout << "  crop ..." << endl;
      example = model;
      MakeLabel(example, "Crop");
      example.crop( "80x80+25+50" );
      images.push_back( example );

      cout << "  despeckle ..." << endl;
      example = model;
      MakeLabel(example, "Despeckle");
      example.despeckle( );
      images.push_back( example );

      cout << "  draw ..." << endl;
      example = model;
      MakeLabel(example, "Draw");
      example.fillColor(Color());
      example.strokeColor( "gold" );
      example.strokeWidth( 2 );
      example.draw( DrawableCircle( 60,90, 60,120 ) );
      images.push_back( example );

      cout << "  edge ..." << endl;
      example = model;
      MakeLabel(example, "Detect Edges");
      example.edge( );
      images.push_back( example );

      cout << "  emboss ..." << endl;
      example = model;
      MakeLabel(example, "Emboss");
      example.emboss( );
      images.push_back( example );

      cout << "  equalize ..." << endl;
      example = model;
      MakeLabel(example, "Equalize");
      example.equalize( );
      images.push_back( example );
    
      cout << "  explode ..." << endl;
      example = model;
      MakeLabel(example, "Explode");
      example.backgroundColor( "#000000FF" );
      example.implode( -1 );
      images.push_back( example );

      cout << "  flip ..." << endl;
      example = model;
      MakeLabel(example, "Flip");
      example.flip( );
      images.push_back( example );

      cout << "  flop ..." << endl;
      example = model;
      MakeLabel(example, "Flop");
      example.flop();
      images.push_back( example );

      cout << "  frame ..." << endl;
      example = model;
      MakeLabel(example, "Frame");
      example.frame( );
      images.push_back( example );

      cout << "  gamma ..." << endl;
      example = model;
      MakeLabel(example, "Gamma");
      example.gamma( 1.6 );
      images.push_back( example );

      cout << "  gaussian blur ..." << endl;
      example = model;
      MakeLabel(example, "Gaussian Blur");
      example.gaussianBlur( 0.0, 1.5 );
      images.push_back( example );

      cout << "  gaussian blur channel ..." << endl;
      example = model;
      MakeLabel(example, "Gaussian Blur\n(Green Channel)");
      example.gaussianBlurChannel( GreenChannel, 0.0, 1.5 );
      images.push_back( example );
    
      cout << "  gradient ..." << endl;
      Image gradient;
      gradient.size( "130x194" );
      gradient.read( "gradient:#20a0ff-#ffff00" );
      MakeLabel(gradient, "Gradient");
      images.push_back( gradient );
    
      cout << "  grayscale ..." << endl;
      example = model;
      MakeLabel(example, "Grayscale");
      example.quantizeColorSpace( GRAYColorspace );
      example.quantize( );
      images.push_back( example );
    
      cout << "  implode ..." << endl;
      example = model;
      MakeLabel(example, "Implode");
      example.implode( 0.5 );
      images.push_back( example );

      cout << "  level ..." << endl;
      example = model;
      MakeLabel(example, "Level");
      example.level( 0.20*QuantumRange, 0.90*QuantumRange, 1.20 );
      images.push_back( example );

      cout << "  level red channel ..." << endl;
      example = model;
      MakeLabel(example, "Level Channel\n(Red Channel)");
      example.levelChannel( RedChannel, 0.20*QuantumRange, 0.90*QuantumRange, 1.20 );
      images.push_back( example );

      cout << "  median filter ..." << endl;
      example = model;
      MakeLabel(example, "Median Filter");
      example.medianFilter( );
      images.push_back( example );

      cout << "  modulate ..." << endl;
      example = model;
      MakeLabel(example, "Modulate");
      example.modulate( 110, 110, 110 );
      images.push_back( example );

      cout << "  monochrome ..." << endl;
      example = model;
      MakeLabel(example, "Monochrome");
      example.quantizeColorSpace( GRAYColorspace );
      example.quantizeColors( 2 );
      example.quantizeDither( false );
      example.quantize( );
      images.push_back( example );

      cout << "  motion blur ..." << endl;
      example = model;
      MakeLabel(example, "Motion Blur");
      example.motionBlur( 0.0, 7.0,45 );
      images.push_back( example );
    
      cout << "  negate ..." << endl;
      example = model;
      MakeLabel(example, "Negate");
      example.negate( );
      images.push_back( example );
    
      cout << "  normalize ..." << endl;
      example = model;
      MakeLabel(example, "Normalize");
      example.normalize( );
      images.push_back( example );
    
      cout << "  oil paint ..." << endl;
      example = model;
      MakeLabel(example, "Oil Paint");
      example.oilPaint( );
      images.push_back( example );

      cout << "  ordered dither 2x2 ..." << endl;
      example = model;
      MakeLabel(example, "Ordered Dither\n(2x2)");
      example.randomThreshold(2,2);
      images.push_back( example );

      cout << "  ordered dither 3x3..." << endl;
      example = model;
      MakeLabel(example, "Ordered Dither\n(3x3)");
      example.randomThreshold(3,3);
      images.push_back( example );

      cout << "  ordered dither 4x4..." << endl;
      example = model;
      MakeLabel(example, "Ordered Dither\n(4x4)");
      example.randomThreshold(4,4);
      images.push_back( example );
    
      cout << "  ordered dither red 4x4..." << endl;
      example = model;
      MakeLabel(example, "Ordered Dither\n(Red 4x4)");
      example.randomThresholdChannel(RedChannel,4,4);
      images.push_back( example );

      cout << "  plasma ..." << endl;
      Image plasma;
      plasma.size( "130x194" );
      plasma.read( "plasma:fractal" );
      MakeLabel(plasma, "Plasma");
      images.push_back( plasma );
    
      cout << "  quantize ..." << endl;
      example = model;
      MakeLabel(example, "Quantize");
      example.quantize( );
      images.push_back( example );

      cout << "  quantum operator ..." << endl;
      example = model;
      MakeLabel(example, "Quantum Operator\nRed * 0.4");
      example.evaluate( RedChannel,MultiplyEvaluateOperator,0.40 );
      images.push_back( example );

      cout << "  raise ..." << endl;
      example = model;
      MakeLabel(example, "Raise");
      example.raise( );
      images.push_back( example );
    
      cout << "  reduce noise ..." << endl;
      example = model;
      MakeLabel(example, "Reduce Noise");
      example.reduceNoise( 1.0 );
      images.push_back( example );
    
      cout << "  resize ..." << endl;
      example = model;
      MakeLabel(example, "Resize");
      example.zoom( "50%" );
      images.push_back( example );
    
      cout << "  roll ..." << endl;
      example = model;
      MakeLabel(example, "Roll");
      example.roll( "+20+10" );
      images.push_back( example );
    
      cout << "  rotate ..." << endl;
      example = model;
      MakeLabel(example, "Rotate");
      example.rotate( 45 );
      example.transparent( "black" );
      images.push_back( example );

      cout << "  scale ..." << endl;
      example = model;
      MakeLabel(example, "Scale");
      example.scale( "60%" );
      images.push_back( example );
    
      cout << "  segment ..." << endl;
      example = model;
      MakeLabel(example, "Segment");
      example.segment( 0.5, 0.25 );
      images.push_back( example );
    
      cout << "  shade ..." << endl;
      example = model;
      MakeLabel(example, "Shade");
      example.shade( 30, 30, false );
      images.push_back( example );
    
      cout << "  sharpen ..." << endl;
      example = model;
      MakeLabel(example, "Sharpen");
      example.sharpen( 0.0, 1.0 );
      images.push_back( example );
    
      cout << "  shave ..." << endl;
      example = model;
      MakeLabel(example, "Shave");
      example.shave( Geometry( 10, 10) );
      images.push_back( example );
    
      cout << "  shear ..." << endl;
      example = model;
      MakeLabel(example, "Shear");
      example.shear( 45, 45 );
      example.transparent( "black" );
      images.push_back( example );
    
      cout << "  spread ..." << endl;
      example = model;
      MakeLabel(example, "Spread");
      example.spread( 3 );
      images.push_back( example );
    
      cout << "  solarize ..." << endl;
      example = model;
      MakeLabel(example, "Solarize");
      example.solarize( );
      images.push_back( example );
    
      cout << "  swirl ..." << endl;
      example = model;
      example.backgroundColor( "#000000FF" );
      MakeLabel(example, "Swirl");
      example.swirl( 90 );
      images.push_back( example );

      cout << "  threshold ..." << endl;
      example = model;
      MakeLabel(example, "Threshold");
      example.threshold( QuantumRange/2.0 );
      images.push_back( example );

      cout << "  threshold random ..." << endl;
      example = model;
      MakeLabel(example, "Random\nThreshold");
      example.randomThreshold( (0.3*QuantumRange),
        (0.85*QuantumRange) );
      images.push_back( example );
    
      cout << "  unsharp mask ..." << endl;
      example = model;
      MakeLabel(example, "Unsharp Mask");
      //           radius_, sigma_, amount_, threshold_
      example.unsharpmask( 0.0, 1.0, 1.0, 0.05);
      images.push_back( example );
    
      cout << "  wave ..." << endl;
      example = model;
      MakeLabel(example, "Wave");
      example.alpha( true );
      example.backgroundColor( "#000000FF" );
      example.wave( 25, 150 );
      images.push_back( example );
    
      //
      // Create image montage.
      //
      cout <<  "Montage images..." << endl;

      for_each( images.begin(), images.end(), strokeColorImage( Color("#600") ) );

      MontageFramed montageOpts;
      montageOpts.geometry( "130x194+10+5>" );
      montageOpts.gravity( CenterGravity );
      montageOpts.borderColor( "green" );
      montageOpts.borderWidth( 1 );
      montageOpts.tile( "7x4" );
      montageOpts.backgroundColor( "#ffffff" );
      montageOpts.pointSize( 18 );
      montageOpts.font(MAGICK_FONT);
      montageOpts.fillColor( "#600" );
      montageOpts.strokeColor( Color() );
      montageOpts.fileName( "Magick++ Demo" );
      montageImages( &montage, images.begin(), images.end(), montageOpts );
    }

    Image& montage_image = montage.front();
    {
      // Create logo image
      cout << "Adding logo image ..." << endl;
      Image logo( "logo:" );
      logo.zoom( "45%" );

      // Composite logo into montage image
      Geometry placement(0,0,((ssize_t) montage_image.columns()/2)-
        ((ssize_t) logo.columns()/2),0);
      montage_image.composite( logo, placement, OverCompositeOp );
    }

    for_each( montage.begin(), montage.end(), depthImage(8) );
    for_each( montage.begin(), montage.end(), alphaImage( false ) );
    for_each( montage.begin(), montage.end(), compressTypeImage( RLECompression) );

    cout << "Writing image \"demo_out.miff\" ..." << endl;
    writeImages(montage.begin(),montage.end(),"demo_out_%d.miff");

    // Uncomment following lines to display image to screen
    //    cout <<  "Display image..." << endl;
    //    montage_image.display();

  }
  catch( exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }

  return 0;
}
```

--------------------------------------------------------------------------------

````

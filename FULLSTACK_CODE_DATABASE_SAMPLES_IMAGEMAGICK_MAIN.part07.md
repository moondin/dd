---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 7
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 7 of 851)

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

---[FILE: Magickshr.opt]---
Location: ImageMagick-main/Magickshr.opt

```text
IDENTIFICATION="Magick V7.3"
GSMATCH=LEQUAL,7,3
case_sensitive=YES
symbol_vector=(AcquireImageInfo=PROCEDURE)
symbol_vector=(AddNoiseImage=PROCEDURE)
symbol_vector=(AnnotateImage=PROCEDURE)
symbol_vector=(AppendImageFormat=PROCEDURE)
symbol_vector=(AppendImages=PROCEDURE)
symbol_vector=(Ascii85Encode=PROCEDURE)
symbol_vector=(Ascii85Flush=PROCEDURE)
symbol_vector=(Ascii85Initialize=PROCEDURE)
symbol_vector=(BlobToImage=PROCEDURE)
symbol_vector=(BlurImage=PROCEDURE)
symbol_vector=(BorderImage=PROCEDURE)
symbol_vector=(CatchImageException=PROCEDURE)
symbol_vector=(ChopImage=PROCEDURE)
symbol_vector=(CloneImage=PROCEDURE)
symbol_vector=(CloneImageInfo=PROCEDURE)
symbol_vector=(CloneMontageInfo=PROCEDURE)
symbol_vector=(CloneString=PROCEDURE)
symbol_vector=(CloseBlob=PROCEDURE)
symbol_vector=(CoalesceImages=PROCEDURE)
symbol_vector=(CompositeImage=PROCEDURE)
symbol_vector=(ContrastImage=PROCEDURE)
symbol_vector=(CropImage=PROCEDURE)
symbol_vector=(CycleColormapImage=PROCEDURE)
symbol_vector=(DespeckleImage=PROCEDURE)
symbol_vector=(DestroyImage=PROCEDURE)
symbol_vector=(DestroyImageInfo=PROCEDURE)
symbol_vector=(DestroyMontageInfo=PROCEDURE)
symbol_vector=(DrawImage=PROCEDURE)
symbol_vector=(EdgeImage=PROCEDURE)
symbol_vector=(EmbossImage=PROCEDURE)
symbol_vector=(EnhanceImage=PROCEDURE)
symbol_vector=(EOFBlob=PROCEDURE)
symbol_vector=(EqualizeImage=PROCEDURE)
symbol_vector=(ExpandFilename=PROCEDURE)
symbol_vector=(ExpandFilenames=PROCEDURE)
symbol_vector=(FlipImage=PROCEDURE)
symbol_vector=(FlopImage=PROCEDURE)
symbol_vector=(FrameImage=PROCEDURE)
symbol_vector=(GammaImage=PROCEDURE)
symbol_vector=(GetBlobInfo=PROCEDURE)
symbol_vector=(GetImageInfo=PROCEDURE)
symbol_vector=(GetMontageInfo=PROCEDURE)
symbol_vector=(GetQuantizeInfo=PROCEDURE)
symbol_vector=(GlobExpression=PROCEDURE)
symbol_vector=(HuffmanDecodeImage=PROCEDURE)
symbol_vector=(HuffmanEncodeImage=PROCEDURE)
symbol_vector=(ImageToBlob=PROCEDURE)
symbol_vector=(ImplodeImage=PROCEDURE)
symbol_vector=(IsGeometry=PROCEDURE)
symbol_vector=(ListDelegateInfo=PROCEDURE)
symbol_vector=(ListFiles=PROCEDURE)
symbol_vector=(ListMagickInfo=PROCEDURE)
symbol_vector=(LocaleCompare=PROCEDURE)
symbol_vector=(LocaleNCompare=PROCEDURE)
symbol_vector=(LZWEncodeImage=PROCEDURE)
symbol_vector=(MagickError=PROCEDURE)
symbol_vector=(MagickWarning=PROCEDURE)
symbol_vector=(MagnifyImage=PROCEDURE)
symbol_vector=(MinifyImage=PROCEDURE)
symbol_vector=(ModulateImage=PROCEDURE)
symbol_vector=(MogrifyImage=PROCEDURE)
symbol_vector=(MogrifyImages=PROCEDURE)
symbol_vector=(MontageImages=PROCEDURE)
symbol_vector=(MorphImages=PROCEDURE)
symbol_vector=(MultilineCensus=PROCEDURE)
symbol_vector=(NegateImage=PROCEDURE)
symbol_vector=(NormalizeImage=PROCEDURE)
symbol_vector=(OilPaintImage=PROCEDURE)
symbol_vector=(OpenBlob=PROCEDURE)
symbol_vector=(PackbitsEncodeImage=PROCEDURE)
symbol_vector=(PingImage=PROCEDURE)
symbol_vector=(QuantizeImage=PROCEDURE)
symbol_vector=(QuantizeImages=PROCEDURE)
symbol_vector=(RaiseImage=PROCEDURE)
symbol_vector=(ReadBlob=PROCEDURE)
symbol_vector=(ReadImage=PROCEDURE)
symbol_vector=(RollImage=PROCEDURE)
symbol_vector=(RotateImage=PROCEDURE)
symbol_vector=(SampleImage=PROCEDURE)
symbol_vector=(ScaleImage=PROCEDURE)
symbol_vector=(SeekBlob=PROCEDURE)
symbol_vector=(SegmentImage=PROCEDURE)
symbol_vector=(SetClientName=PROCEDURE)
symbol_vector=(SetErrorHandler=PROCEDURE)
symbol_vector=(SetImageInfo=PROCEDURE)
symbol_vector=(SetWarningHandler=PROCEDURE)
symbol_vector=(ShadeImage=PROCEDURE)
symbol_vector=(SharpenImage=PROCEDURE)
symbol_vector=(ShearImage=PROCEDURE)
symbol_vector=(SignatureImage=PROCEDURE)
symbol_vector=(SolarizeImage=PROCEDURE)
symbol_vector=(SortColormapByIntensity=PROCEDURE)
symbol_vector=(SpreadImage=PROCEDURE)
symbol_vector=(SteganoImage=PROCEDURE)
symbol_vector=(StereoImage=PROCEDURE)
symbol_vector=(StringToList=PROCEDURE)
symbol_vector=(StripString=PROCEDURE)
symbol_vector=(SwirlImage=PROCEDURE)
symbol_vector=(SyncImage=PROCEDURE)
symbol_vector=(TellBlob=PROCEDURE)
symbol_vector=(TextureImage=PROCEDURE)
symbol_vector=(TransformImage=PROCEDURE)
symbol_vector=(WriteBlob=PROCEDURE)
symbol_vector=(WriteImage=PROCEDURE)
symbol_vector=(XAnnotateImage=PROCEDURE)
symbol_vector=(XBestFont=PROCEDURE)
symbol_vector=(XBestIconSize=PROCEDURE)
symbol_vector=(XBestPixel=PROCEDURE)
symbol_vector=(XBestVisualInfo=PROCEDURE)
symbol_vector=(XCheckRefreshWindows=PROCEDURE)
symbol_vector=(XClientMessage=PROCEDURE)
symbol_vector=(XColorBrowserWidget=PROCEDURE)
symbol_vector=(XCommandWidget=PROCEDURE)
symbol_vector=(XConfirmWidget=PROCEDURE)
symbol_vector=(XConstrainWindowPosition=PROCEDURE)
symbol_vector=(XDelay=PROCEDURE)
symbol_vector=(XDestroyWindowColors=PROCEDURE)
symbol_vector=(XDialogWidget=PROCEDURE)
symbol_vector=(XDisplayImageInfo=PROCEDURE)
symbol_vector=(XDrawImage=PROCEDURE)
symbol_vector=(XError=PROCEDURE)
symbol_vector=(XFileBrowserWidget=PROCEDURE)
symbol_vector=(XFontBrowserWidget=PROCEDURE)
symbol_vector=(XFreeResources=PROCEDURE)
symbol_vector=(XFreeStandardColormap=PROCEDURE)
symbol_vector=(XGetAnnotateInfo=PROCEDURE)
symbol_vector=(XGetImportInfo=PROCEDURE)
symbol_vector=(XGetMapInfo=PROCEDURE)
symbol_vector=(XGetResourceClass=PROCEDURE)
symbol_vector=(XGetResourceDatabase=PROCEDURE)
symbol_vector=(XGetResourceInfo=PROCEDURE)
symbol_vector=(XGetResourceInstance=PROCEDURE)
symbol_vector=(XGetScreenDensity=PROCEDURE)
symbol_vector=(XGetWindowColor=PROCEDURE)
symbol_vector=(XGetWindowInfo=PROCEDURE)
symbol_vector=(XHighlightEllipse=PROCEDURE)
symbol_vector=(XHighlightLine=PROCEDURE)
symbol_vector=(XHighlightRectangle=PROCEDURE)
symbol_vector=(XImportImage=PROCEDURE)
symbol_vector=(XInfoWidget=PROCEDURE)
symbol_vector=(XListBrowserWidget=PROCEDURE)
symbol_vector=(XMakeCursor=PROCEDURE)
symbol_vector=(XMakeImage=PROCEDURE)
symbol_vector=(XMakeMagnifyImage=PROCEDURE)
symbol_vector=(XMakeStandardColormap=PROCEDURE)
symbol_vector=(XMakeWindow=PROCEDURE)
symbol_vector=(XMenuWidget=PROCEDURE)
symbol_vector=(XNoticeWidget=PROCEDURE)
symbol_vector=(XPreferencesWidget=PROCEDURE)
symbol_vector=(XQueryPosition=PROCEDURE)
symbol_vector=(XRefreshWindow=PROCEDURE)
symbol_vector=(XRemoteCommand=PROCEDURE)
symbol_vector=(XRetainWindowColors=PROCEDURE)
symbol_vector=(XSetCursorState=PROCEDURE)
symbol_vector=(XTextViewWidget=PROCEDURE)
symbol_vector=(XUserPreferences=PROCEDURE)
symbol_vector=(XWindowByID=PROCEDURE)
symbol_vector=(XWindowByName=PROCEDURE)
symbol_vector=(XWindowByProperty=PROCEDURE)
symbol_vector=(GetNumberColors=PROCEDURE)
symbol_vector=(ThrowException=PROCEDURE)
symbol_vector=(GetMagickVersion=PROCEDURE)
symbol_vector=(GetExecutionPath=PROCEDURE)
symbol_vector=(ListColorInfo=PROCEDURE)
symbol_vector=(ListMagicInfo=PROCEDURE)
symbol_vector=(ListTypeInfo=PROCEDURE)
symbol_vector=(SetImageType=PROCEDURE)
symbol_vector=(DestroyImageList=PROCEDURE)
symbol_vector=(GetPageGeometry=PROCEDURE)
symbol_vector=(WriteImages=PROCEDURE)
symbol_vector=(GetGeometry=PROCEDURE)
symbol_vector=(CatchException=PROCEDURE)
symbol_vector=(MagickFatalError=PROCEDURE)
symbol_vector=(DestroyExceptionInfo=PROCEDURE)
symbol_vector=(MontageImageCommand=PROCEDURE)
symbol_vector=(MogrifyImageCommand=PROCEDURE)
symbol_vector=(ConvertImageCommand=PROCEDURE)
symbol_vector=(IdentifyImageCommand=PROCEDURE)
symbol_vector=(CompositeImageCommand=PROCEDURE)
symbol_vector=(GetMagickCopyright=PROCEDURE)
symbol_vector=(SetLogEventMask=PROCEDURE)
symbol_vector=(SetMagickResourceLimit=PROCEDURE)
symbol_vector=(AppendImageToList=PROCEDURE)
symbol_vector=(GetImageTotalInkDensity=PROCEDURE)
symbol_vector=(SetLogFormat=PROCEDURE)
symbol_vector=(ListMagickResourceInfo=PROCEDURE)
symbol_vector=(DisplayImageCommand=PROCEDURE)
symbol_vector=(ImportImageCommand=PROCEDURE)
symbol_vector=(AnimateImageCommand=PROCEDURE)
symbol_vector=(RelinquishMagickMemory=PROCEDURE)
symbol_vector=(DestroyString=PROCEDURE)
symbol_vector=(AcquireExceptionInfo=PROCEDURE)
symbol_vector=(MagickCoreGenesis=PROCEDURE)
symbol_vector=(MagickCoreTerminus=PROCEDURE)
symbol_vector=(GetElapsedTime=PROCEDURE)
symbol_vector=(GetTimerInfo=PROCEDURE)
symbol_vector=(GetUserTime=PROCEDURE)
symbol_vector=(AcquireTimerInfo=PROCEDURE)
symbol_vector=(DestroyTimerInfo=PROCEDURE)
symbol_vector=(MagickCommandGenesis=PROCEDURE)
symbol_vector=(CompareImagesCommand=PROCEDURE)
symbol_vector=(GetAuthenticPixels=PROCEDURE)
symbol_vector=(GetVirtualPixels=PROCEDURE)
symbol_vector=(AcquireImage=PROCEDURE)
symbol_vector=(AcquireImageColormap=PROCEDURE)
symbol_vector=(SyncAuthenticPixels=PROCEDURE)
symbol_vector=(GetImageOption=PROCEDURE)
symbol_vector=(IsStringTrue=PROCEDURE)
sys$share:decw$xlibshr.exe/share
```

--------------------------------------------------------------------------------

---[FILE: Make.com]---
Location: ImageMagick-main/Make.com

```text
$!
$! Make ImageMagick X image utilities for VMS.
$!
$ on error then continue
$ deass magick
$ on error then continue
$ deass magickcore
$ on error then continue
$ deass pango
$ set noon
$
$ option := 'p1'
$ if option .eqs. "CLEAN"
$ then
$    deletee/log [.magickcore]libMagick.olb;*
$    deletee/log [.coders]libCoders.olb;*
$    exit
$ endif
$ if option .eqs. "REALCLEAN"
$ then
$    deletee/log [.magickcore]libMagick.olb;*,[...]*.obj;*
$    deletee/log [.coders]libCoders.olb;*,[...]*.obj;*
$    exit
$ endif
$ if option .eqs. "DISTCLEAN"
$ then
$    deletee/log [.magickcore]libMagick.olb;*,[...]*.obj;*,*.exe;*,magickshr.olb;*
$    deletee/log [.coders]libCoders.olb;*,[...]*.obj;*,*.exe;*,magickshr.olb;*
$    exit
$ endif
$ if option .eqs. "NOSHR"
$ then
$    share := n
$    option :=
$ endif
$ if option .nes. ""
$ then
$    write sys$error "Unknown option \", option, "\"
$    exit
$ endif
$ p1 :=
$link_options="/nodebug/notraceback"
$if (f$trnlnm("X11") .eqs. "") then define/nolog X11 decw$include:
$library_options=""
$compile_options="/nodebug/optimize"
$if (f$search("sys$system:decc$compiler.exe") .nes. "")
$then       ! VAX with DEC C compiler
$  compile_options="/decc/nodebug/optimize"
$  library_options="_decc"
$else       ! VAX with VAX C compiler, (GCC library needed for PNG format only)
$  define/nolog lnk$library sys$library:vaxcrtl
$  define/nolog sys sys$share
$  if (f$trnlnm("gnu_cc") .nes. "") then define/nolog lnk$library_1 gnu_cc:[000000]gcclib.olb
$endif
$if (f$getsyi("HW_MODEL") .gt. 1023)
$then       ! Alpha with DEC C compiler
$  define/nolog sys decc$library_include
$  compile_options="/debug/optimize/prefix=all/name=(as_is,short)/float=ieee"
$  library_options="_axp"
$  share := 'share'y
$else
$  share := n
$endif
$
$write sys$output "Making in [.magickcore]"
$set default [.magickcore]
$@make
$set default [-]
$write sys$output "Making in [.coders]"
$set default [.coders]
$@make
$set default [-]
$
$ if share
$ then
$    write sys$output "Making shareable image"
$    link/share/exe=magickshr.exe   [.magickcore]libMagick.olb/lib, -
  [.coders]libCoders.olb/lib,[.magickcore]libMagick.olb/lib, -
  []magickshr.opt/opt, -
  sys$library:freetype.olb/lib, -
  sys$library:libjasper.olb/lib, -
  sys$library:libjpeg.olb/lib, -
  sys$library:libpng.olb/lib, -
  sys$library:tiff.olb/lib, -
  sys$library:libz.olb/lib, -
  sys$library:libbz2.olb/lib, -
  sys$library:libjbig.olb/lib
$ libr/crea/share/log magickshr.olb magickshr.exe
$    set file/trunc magickshr.olb
$    purge magickshr.olb
$    link_libraries := [-]magickshr.olb/lib
$    define/nolog magickshr 'f$environment("default")'magickshr.exe
$    write sys$output "Shareable image logical MAGICKSHR defined:"
$    show logi magickshr
$ else
$    link_libraries := [.magickcore]libMagick.olb/lib, -
  [.coders]libCoders.olb/lib, -
  sys$library:libjasper.olb/lib
  sys$library:libjpeg.olb/lib, -
  sys$library:libpng.olb/lib, -
  sys$library:tiff.olb/lib, -
  sys$library:freetype.olb/l, -
  sys$library:libz.olb/lib,-
  sys$library:libjbig.olb/lib, -
  sys$library:libbz2.olb/lib
$ endif
$ define magickcore [-.magickcore]
$ set default [.utilities]
$ define magickwand [-.magickwand]
$if ((p1 .nes. "") .and. (p1 .nes. "DISPLAY")) then goto SkipDisplay
$write sys$output "Making Display..."
$call Make display.c
$
$link'link_options' display.obj, -
  'link_libraries',sys$input:/opt
  sys$share:decw$xlibshr.exe/share
$
$display:==$'f$environment("default")'display
$write sys$output "..symbol DISPLAY defined."
$
$SkipDisplay:
$if ((p1 .nes. "") .and. (p1 .nes. "IMPORT")) then goto SkipImport
$write sys$output "Making Import..."
$call Make import.c
$
$link'link_options' import.obj, -
  'link_libraries',sys$input:/opt
  sys$share:decw$xlibshr.exe/share
$
$import:==$'f$environment("default")'import
$write sys$output "..symbol IMPORT defined."
$SkipImport:
$
$if ((p1 .nes. "") .and. (p1 .nes. "ANIMATE")) then goto SkipAnimate
$write sys$output "Making Animate..."
$call Make animate.c
$
$link'link_options' animate.obj, -
  'link_libraries',sys$input:/opt
  sys$share:decw$xlibshr.exe/share
$
$animate:==$'f$environment("default")'animate
$write sys$output "..symbol ANIMATE defined."
$
$SkipAnimate:
$if ((p1 .nes. "") .and. (p1 .nes. "MONTAGE")) then goto SkipMontage
$write sys$output "Making Montage..."
$call Make montage.c
$
$link'link_options' montage.obj, -
  'link_libraries',sys$input:/opt
  sys$share:decw$xlibshr.exe/share
$
$montage:==$'f$environment("default")'montage
$write sys$output "..symbol MONTAGE defined."
$
$SkipMontage:
$if ((p1 .nes. "") .and. (p1 .nes. "MOGRIFY")) then goto SkipMogrify
$write sys$output "Making Mogrify..."
$call Make mogrify.c
$
$link'link_options' mogrify.obj, -
  'link_libraries',sys$input:/opt
  sys$share:decw$xlibshr.exe/share
$
$mogrify:==$'f$environment("default")'mogrify
$write sys$output "..symbol MOGRIFY defined."
$
$SkipMogrify:
$if ((p1 .nes. "") .and. (p1 .nes. "CONVERT")) then goto SkipConvert
$write sys$output "Making Convert..."
$call Make convert.c
$
$link'link_options' convert.obj, -
  'link_libraries',sys$input:/opt
  sys$share:decw$xlibshr.exe/share
$
$convert:==$'f$environment("default")'convert
$write sys$output "..symbol CONVERT defined."
$SkipConvert:
$if ((p1 .nes. "") .and. (p1 .nes. "COMPARE")) then goto SkipCompare
$write sys$output "Making Compare..."
$call Make compare.c
$
$link'link_options' compare.obj, -
  'link_libraries',sys$input:/opt
  sys$share:decw$xlibshr.exe/share
$
$compare:==$'f$environment("default")'compare
$write sys$output "..symbol COMPARE defined."
$SkipCompare:
$if ((p1 .nes. "") .and. (p1 .nes. "IDENTIFY")) then goto SkipIdentify
$write sys$output "Making Identify..."
$call Make identify.c
$
$link'link_options' identify.obj, -
  'link_libraries',sys$input:/opt
  sys$share:decw$xlibshr.exe/share
$
$identify:==$'f$environment("default")'identify
$write sys$output "..symbol IDENTIFY defined."
$SkipIdentify:
$if ((p1 .nes. "") .and. (p1 .nes. "COMPOSITE")) then goto SkipComposite
$write sys$output "Making Composite..."
$call Make composite.c
$
$link'link_options' composite.obj, -
  'link_libraries',sys$input:/opt
  sys$share:decw$xlibshr.exe/share
$
$composite:==$'f$environment("default")'composite
$write sys$output "..symbol COMPOSITE defined."
$SkipComposite:
$set def [-]
$copy [.config]colors.xml sys$login:colors.xml
$copy [.config]log.xml sys$login:log.xml
$copy [.www.source]delegates.xml sys$login:delegates.xml
$copy [.www.source]type.xml sys$login:type.xml
$copy [.config]locale.xml sys$login:locale.xml
$copy [.config]english.xml sys$login:english.xml
$copy [.config]francais.xml sys$login:francais.xml
$type sys$input

Use this command to specify which X server to contact:

  $set display/create/node=node_name::

or

  $set display/create/node=nodename/transport=tcpip

This can be done automatically from your LOGIN.COM with the following
command:

  $if (f$trnlmn("sys$rem_node") .nes. "") then -
  $  set display/create/node='f$trnlmn("sys$rem_node")'
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
$    if (f$cvtime(object_time).lts.f$cvtime(source_time)) then -
$      object_file=""
$  endif
$  if (object_file .eqs. "")
$  then
$    write sys$output "Compiling ",p1
$    cc'compile_options'/include_directory=[-.magickcore] 'source_file'
$  endif
$endif
$exit
$endsubroutine
```

--------------------------------------------------------------------------------

---[FILE: Makefile.am]---
Location: ImageMagick-main/Makefile.am

```text
#  Copyright © 1999 ImageMagick Studio LLC, a non-profit organization
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
#  Copyright (C) 2003 - 2008 GraphicsMagick Group
#
#  Top-Level Makefile for building ImageMagick.
#

topincludedir = @includedir@/MagickCore

AM_CPPFLAGS = -I$(top_builddir) -I$(top_srcdir)

ACLOCAL_AMFLAGS = -I m4

MODULECOMMONFLAGS = -no-undefined -export-symbols-regex ".*" -shared -module -avoid-version
MODULECOMMONCPPFLAGS = $(AM_CPPFLAGS)

# Options to pass when running configure in the distcheck target.
#
# We want to preserve user-provided option variables so the same
# compiler, headers, and libraries are used as for a normal build.
DISTCHECK_CONFIGURE_FLAGS=$(DISTCHECK_CONFIG_FLAGS)

DISTCLEANFILES = _configs.sed MagickCore/magick-baseconfig.h

## Make sure these will be cleaned even when they're not built by default.
CLEANFILES = \
  $(MAGICKWAND_CLEANFILES) \
  $(MAGICKPP_CLEANFILES) \
  $(UTILITIES_CLEANFILES) \
  $(TESTS_CLEANFILES)

bin_PROGRAMS = \
  $(UTILITIES_PGMS)

# Binary scripts
bin_SCRIPTS = \
  $(MAGICKCORE_BIN_SCRPTS) \
  $(MAGICKWAND_BIN_SCRPTS) \
  $(MAGICKPP_SCRPTS)

include_HEADERS =

# Headers which are not installed but which are distributed
noinst_HEADERS = \
  $(MAGICKCORE_NOINST_HDRS) \
  $(MAGICKWAND_NOINST_HDRS) \
  $(CODERS_NOINST_HDRS)

if WIN32_NATIVE_BUILD
SRCDIR='$(shell @WinPathScript@ $(srcdir)/)'
else
SRCDIR="$(srcdir)/"
endif

# Tests with .tap extensions use the TAP protocol and TAP driver
LOG_COMPILER = $(SHELL)

SH_LOG_COMPILER = $(LOG_COMPILER)
TAP_LOG_COMPILER = $(LOG_COMPILER)

# Test extensions
TEST_EXTENSIONS = .sh .tap

TAP_LOG_DRIVER = env AM_TAP_AWK='$(AWK)' $(SHELL) \
  $(top_srcdir)/config/tap-driver.sh

# Environment parameters to be used during tests
TESTS_ENVIRONMENT = \
  MAKE="$(MAKE)" \
  MAKEFLAGS="$(MAKEFLAGS)" \
  MEMCHECK="$(MEMCHECK)"

# Tests to run
TESTS = \
  $(TESTS_TESTS) \
  $(MAGICKPP_TESTS) \
  $(MAGICKWAND_TESTS) \
  $(UTILITIES_TESTS)

# Tests which are expected to fail
XFAIL_TESTS = \
  $(TESTS_XFAIL_TESTS) \
  $(UTILITIES_XFAIL_TESTS)

TOP_EXTRA_DIST = \
  AUTHORS.txt \
  LICENSE \
  NOTICE \
  Install-mac.txt \
  Install-unix.txt \
  Install-vms.txt \
  Install-windows.txt \
  magick.sh.in \
  Magickshr.opt \
  index.html \
  winpath.sh

# Additional files to distribute
EXTRA_DIST = \
  $(TOP_EXTRA_DIST) \
  $(CONFIG_EXTRA_DIST) \
  $(MAGICKCORE_EXTRA_DIST) \
  $(MAGICKWAND_EXTRA_DIST) \
  $(MAGICKPP_EXTRA_DIST) \
  $(UTILITIES_EXTRA_DIST) \
  $(TESTS_EXTRA_DIST)

lib_LTLIBRARIES = $(MAGICKCORE_LIBS) $(MAGICKWAND_LIBS) $(MAGICKPP_LIBS)
AM_LDFLAGS =
noinst_LTLIBRARIES =
EXTRA_LTLIBRARIES =
BUILT_SOURCES =
MOSTLYCLEANFILES =

check_PROGRAMS = \
  $(TESTS_CHECK_PGRMS) \
  $(MAGICKPP_CHECK_PGRMS) \
  $(MAGICKWAND_CHECK_PGRMS)

include m4/Makefile.am
include config/Makefile.am
include coders/Makefile.am
include MagickCore/Makefile.am
include MagickWand/Makefile.am
include Magick++/Makefile.am
include filters/Makefile.am
include utilities/Makefile.am
include tests/Makefile.am
include PerlMagick/Makefile.am

# Pkgconfig directory
pkgconfigdir = $(libdir)/pkgconfig

# Files to install in Pkgconfig directory
pkgconfig_DATA = \
  $(MAGICKCORE_PKGCONFIG) \
  $(MAGICKWAND_PKGCONFIG) \
  $(MAGICKPP_PKGCONFIG)

# create a copy for pc file (ideally the non abi should be symlinked)
%-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@.pc: %.pc
	cp -f $^ $@

# Architecture independent data files installed in the package's data directory
docdir = $(DOCUMENTATION_PATH)

# Manual pages to install
if INSTALL_DOC#
man_MANS = \
  $(MAGICKCORE_MANS) \
  $(MAGICKWAND_MANS) \
  $(MAGICKPP_MANS) \
  $(UTILITIES_MANS)

doc_DATA = \
  LICENSE
endif

if MAINTAINER_MODE
MAINTAINER_TARGETS = \
  magick-version \
  ImageMagick.spec \
  $(PERLMAGICK_MAINTAINER_TARGETS)
endif

all-local: $(MAGICKPP_LOCAL_TARGETS) $(PERLMAGICK_ALL_LOCAL_TARGETS) $(MAINTAINER_TARGETS)

install-exec-local: $(PERLMAGICK_INSTALL_EXEC_LOCAL_TARGETS) \
	$(UTILITIES_INSTALL_EXEC_LOCAL_TARGETS)

install-data-local: $(PERLMAGICK_INSTALL_DATA_LOCAL_TARGETS) $(HTML_INSTALL_DATA_TARGETS)

uninstall-local: $(PERLMAGICK_UNINSTALL_LOCAL_TARGETS) $(HTML_UNINSTALL_DATA_TARGETS) $(UTILITIES_UNINSTALL_LOCAL_TARGETS)

clean-local: $(PERLMAGICK_CLEAN_LOCAL_TARGETS)

distclean-local: $(PERLMAGICK_DISTCLEAN_LOCAL_TARGETS)

maintainer-clean-local: $(PERLMAGICK_MAINTAINER_CLEAN_LOCAL_TARGETS)

check-local: $(PERLMAGICK_CHECK_LOCAL_TARGETS)

# drd: valgrind's newer thread error detector
drd:
	$(MAKE) MEMCHECK='valgrind --tool=drd --check-stack-var=yes --var-info=yes \
	  --quiet $(VALGRIND_EXTRA_OPTS)' check

# helgrind: valgrind's older thread error detector
helgrind:
	$(MAKE) MEMCHECK='valgrind --tool=helgrind --error-exitcode=2 --quiet \
	$(VALGRIND_EXTRA_OPTS)' check

# memcheck: valgrind's memory access checker
memcheck:
	$(MAKE) MEMCHECK='valgrind --tool=memcheck --leak-check=full --read-var-info=yes \
	--error-exitcode=2 --track-origins=yes --num-callers=12 \
	--quiet $(VALGRIND_EXTRA_OPTS)' check

# ptrcheck: valgrind's experimental pointer checking tool.
ptrcheck:
	$(MAKE) MEMCHECK='valgrind --tool=exp-ptrcheck --quiet $(VALGRIND_EXTRA_OPTS)' check

# Non-Automake subdirectories to distribute
DISTDIRS = images scripts www PerlMagick
dist-hook:
	( \
	  builddir=`pwd` ; \
	  cd $(srcdir) && \
	  ( \
	    for dir in $(DISTDIRS) ; do \
	      find $$dir -depth -print | grep -E -v '(~$$)|(/.git)|(/\.#)|(/\.deps)|(/\.git)' \
	        | cpio -pdum $$builddir/$(distdir) 2> /dev/null ; \
	    done \
	  ) \
	)

#
# Additional install rules
#

# Install HTML files
pkgdocdir = $(DOCUMENTATION_PATH)
DOCDIRS = images images/patterns www www/assets www/api www/source www/Magick++

if INSTALL_DOC
HTML_INSTALL_DATA_TARGETS = install-data-html
endif

install-data-html:
	$(mkinstalldirs) $(DESTDIR)$(pkgdocdir)
	$(INSTALL_DATA) $(srcdir)/index.html $(DESTDIR)$(pkgdocdir)
	@for dir in $(DOCDIRS) ; do \
	  $(mkinstalldirs) $(DESTDIR)$(pkgdocdir)/$$dir && \
	  if test -d $(builddir)/$$dir ; then \
	    docsrcdir=$(builddir)/$$dir; \
	  else \
	    docsrcdir=$(srcdir)/$$dir; \
	  fi; \
	  for file in $$docsrcdir/*.* ; do \
	    echo "$(INSTALL_DATA) $$file $(DESTDIR)$(pkgdocdir)/$$dir" ; \
	    $(INSTALL_DATA) "$$file" $(DESTDIR)$(pkgdocdir)/$$dir ; \
	  done ; \
	done

# Uninstall HTML files
HTML_UNINSTALL_DATA_TARGETS = uninstall-data-html
uninstall-data-html:
	rm -f $(DESTDIR)$(pkgdocdir)/index.html
	for dir in $(DOCDIRS) ; do \
	  rm -f -r $(DESTDIR)$(pkgdocdir)/$$dir ; \
	done

# Ensure that version.h at $(srcdir)/MagickCore/version.h is kept up to date.
magick-version: MagickCore/version.h
	@if test -n "$(VPATH)" ; then \
	  cmp MagickCore/version.h $(srcdir)/MagickCore/version.h > /dev/null ; \
	        if test $$? -eq 1 ; then \
	    echo "Updating $(srcdir)/MagickCore/version.h ..."; \
	    cp MagickCore/version.h $(srcdir)/MagickCore/version.h ; \
	  fi ; \
	fi ; \
	touch magick-version

MagickCore/version.h:	$(top_srcdir)/m4/version.m4

# Automagically reconfigure libtool
LIBTOOL_DEPS = @LIBTOOL_DEPS@
libtool: $(LIBTOOL_DEPS)
	$(SHELL) ./config.status --recheck

# Format C API documentation
html-local:
# copy static file
	for dir in $(DOCDIRSMANUAL) ; do \
		$(mkinstalldirs) $(top_builddir)/$$dir ;\
		for file in $$dir/*.* ; do \
			if ! test -f $(top_builddir)/$$file; then \
				cp -p -f $(top_srcdir)/$$file $(top_builddir)/$$dir ; \
			fi; \
		done ; \
	done;
# remove old doxygen files
	for dir in $(DOCDIRDOXYGEN) ; do \
	    rm -rf $$dir || true; \
	done;
# make doxygen doc
	$(mkinstalldirs) $(top_builddir)/www/api
	cd config && doxygen MagickCore.dox
	cd config && doxygen MagickWand.dox
	cd config && doxygen Magick++.dox

#
# Build Windows source Zip and 7Zip balls
#
if ZIP_DELEGATE
DIST_WINDOWS_SRC_ZIP=$(PACKAGE_NAME)-$(PACKAGE_VERSION)-windows.zip
else
DIST_WINDOWS_SRC_ZIP=
endif
if P7ZIP_DELEGATE
DIST_WINDOWS_SRC_7ZIP=$(PACKAGE_NAME)-$(PACKAGE_VERSION)-windows.7z
else
DIST_WINDOWS_SRC_7ZIP=
endif
$(DIST_WINDOWS_SRC_ZIP) $(DIST_WINDOWS_SRC_7ZIP) windows-dist:
	if test -d $(PACKAGE_NAME)-$(PACKAGE_VERSION) ; then \
	  chmod -R u+w $(PACKAGE_NAME)-$(PACKAGE_VERSION) ; \
	  rm -rf $(PACKAGE_NAME)-$(PACKAGE_VERSION) ; \
	fi
	git clone -b main https://github.com/ImageMagick/ImageMagick.git $(PACKAGE_NAME)-$(PACKAGE_VERSION)
if ZIP_DELEGATE
	rm -f $(DIST_WINDOWS_SRC_ZIP)
	$(ZIP) -r -9 -q  $(DIST_WINDOWS_SRC_ZIP) $(PACKAGE_NAME)-$(PACKAGE_VERSION)
endif # ZIP_DELEGATE
if P7ZIP_DELEGATE
	rm -f $(DIST_WINDOWS_SRC_7ZIP)
	$(P7ZIP) a -t7z -mx=9 $(DIST_WINDOWS_SRC_7ZIP) $(PACKAGE_NAME)-$(PACKAGE_VERSION)
	chmod 644 $(DIST_WINDOWS_SRC_7ZIP)
endif # P7ZIP_DELEGATE
	rm -rf $(PACKAGE_NAME)-$(PACKAGE_VERSION)

#
# RPM build support
#
if RPM_DELEGATE

DIST_ARCHIVE_SRPM=$(distdir).src.rpm
.PHONY: srpm
$(DIST_ARCHIVE_SRPM) srpm: dist-bzip2
	rm -f $(DIST_ARCHIVE_SRPM)
	$(RPM) --define="_sourcedir `pwd`" --define="_srcrpmdir `pwd`" --nodeps --bs ImageMagick.spec
	@echo ==============================================================
	@echo $(DIST_ARCHIVE_SRPM) is ready for distribution.
	@echo ==============================================================

RPMDIR=rpmbuild
RPMARCH=$(MAGICK_TARGET_CPU)

DIST_ARCHIVE_RPM= \
  $(RPMDIR)/$(RPMARCH)/$(PACKAGE_NAME)-$(PACKAGE_VERSION)-$(PACKAGE_PATCHLEVEL_VERSION).$(RPMARCH).rpm \
  $(RPMDIR)/$(RPMARCH)/$(PACKAGE_NAME)-c++-$(PACKAGE_VERSION)-$(PACKAGE_PATCHLEVEL_VERSION).$(RPMARCH).rpm \
  $(RPMDIR)/$(RPMARCH)/$(PACKAGE_NAME)-c++-devel-$(PACKAGE_VERSION)-$(PACKAGE_PATCHLEVEL_VERSION).$(RPMARCH).rpm \
  $(RPMDIR)/$(RPMARCH)/$(PACKAGE_NAME)-devel-$(PACKAGE_VERSION)-$(PACKAGE_PATCHLEVEL_VERSION).$(RPMARCH).rpm \
  $(RPMDIR)/$(RPMARCH)/$(PACKAGE_NAME)-perl-$(PACKAGE_VERSION)-$(PACKAGE_PATCHLEVEL_VERSION).$(RPMARCH).rpm

.PHONY: rpm
rpm: dist
	rm -rf $(RPMDIR)
	$(mkinstalldirs) $(RPMDIR)
	$(mkinstalldirs) $(RPMDIR)/BUILD
	$(mkinstalldirs) $(RPMDIR)/RPMS
	$(RPM) --define="_sourcedir `pwd`" --define="_rpmdir `pwd`/$(RPMDIR)/RPMS" --define="_builddir `pwd`/$(RPMDIR)/BUILD" --nodeps -bb ImageMagick.spec
	@echo ==============================================================
	@echo $(DIST_ARCHIVE_RPM) is ready for distribution.
	@echo ==============================================================

else
DIST_ARCHIVE_RPM=
endif # RPM_DELEGATE

#
# Build a validated snapshot release and move to the snapshots directory.
#
snapshot: distcheck
	$(MAKE) $(DIST_ARCHIVE_SRPM)
	$(MAKE) $(DIST_WINDOWS_SRC_ZIP)
	$(MAKE) $(DIST_WINDOWS_SRC_7ZIP)
	mv $(DIST_ARCHIVES) $(DIST_WINDOWS_SRC_ZIP) $(DIST_WINDOWS_SRC_7ZIP) $(DIST_ARCHIVE_SRPM) /var/ftp/pub/ImageMagick/beta/
```

--------------------------------------------------------------------------------

---[FILE: NOTICE]---
Location: ImageMagick-main/NOTICE

```text
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

1. ImageMagick copyright:

Copyright @ 1999 ImageMagick Studio LLC, a non-profit organization dedicated
to making software imaging solutions freely available.

You may not use this file except in compliance with the License. You may obtain
a copy of the License at

  https://imagemagick.org/script/license.php

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied.  See the License for the
specific language governing permissions and limitations under the License.

The full text of this license is available in the LICENSE file.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

2. E. I. du Pont de Nemours and Company copyright (ImageMagick was originally
   developed and distributed by E. I. du Pont de Nemours and Company):

Copyright 1999 E. I. du Pont de Nemours and Company

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files ("ImageMagick"), to deal in
ImageMagick without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of ImageMagick, and to permit persons to whom the ImageMagick is furnished to
do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of ImageMagick.

The software is provided "as is", without warranty of any kind, express or
implied, including but not limited to the warranties of merchantability,
fitness for a particular purpose and noninfringement.  In no event shall E. I.
du Pont de Nemours and Company be liable for any claim, damages or other
liability, whether in an action of contract, tort or otherwise, arising from,
out of or in connection with ImageMagick or the use or other dealings in
ImageMagick.

Except as contained in this notice, the name of the E. I. du Pont de Nemours
and Company shall not be used in advertising or otherwise to promote the sale,
use or other dealings in ImageMagick without prior written authorization from
the E. I. du Pont de Nemours and Company.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

3. OpenSSH copyright (this copyright is limited to magick/utility.c/
   Base64Decode() and Base64Encode(),incorporated from the OpenSSH package):

Copyright (c) 2000 Markus Friedl.  All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation
and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE AUTHOR \`\`AS IS\'\' AND ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO
EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

4. Xfig copyright (this copyright is limited to the image patterns in
   magick/nt-base.c, incorporated from the XFig package):

| FIG : Facility for Interactive Generation of figures
| Copyright (c) 1985-1988 by Supoj Sutanthavibul
| Parts Copyright (c) 1989-2000 by Brian V. Smith
| Parts Copyright (c) 1991 by Paul King

Any party obtaining a copy of these files is granted, free of charge, a full
and unrestricted irrevocable, world-wide, paid up, royalty-free, nonexclusive
right and license to deal in this software and documentation files (the
"Software"), including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software, and
to permit persons who receive copies from any such party to do so, with the
only requirement being that this copyright notice remains intact.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

5. ezXML copyright (This copyright is limited to code for reading XML files in
   magick/xml-tree.c, incorporated from the ezxml package):

Copyright 2004-2006 Aaron Voisine <aaron@voisine.org>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

6. GraphicsMagick copyright (this copyright is limited to the Windows installer
   and enhancements to the automake and autoconf configure scripts,
   incorporated from the GraphicsMagick package):

Copyright (C) 2002 - 2009 GraphicsMagick Group

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

7. Magick++ copyright (this copyright is limited to the Magick++ API in the
   Magick++ folder):

Copyright 1999 - 2002 Bob Friesenhahn <bfriesen@simple.dallas.tx.us>

Permission is hereby granted, free of charge, to any person obtaining a copy of
the source files and associated documentation files ("Magick++"), to deal in
Magick++ without restriction, including without limitation of the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of Magick++, and to permit persons to whom the Magick++ is furnished to do so,
subject to the following conditions:

This copyright notice shall be included in all copies or substantial portions
of Magick++. The copyright to Magick++ is retained by its author and shall not
be subsumed or replaced by any other copyright.

The software is provided "as is", without warranty of any kind, express or
implied, including but not limited to the warranties of merchantability,fitness
for a particular purpose and noninfringement. In no event shall Bob Friesenhahn
be liable for any claim, damages or other liability, whether in an action of
contract, tort or otherwise, arising from, out of or in connection with
Magick++ or the use or other dealings in Magick++.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

8. Thatcher Ulrich copyright (ImageMagick includes two fonts,
   PerlMagick/t/ttf/input.ttf and PerlMagick/demo/Generic.ttf under this
   copyright):

  Copyright: 2004-2007, Thatcher Ulrich <tu@tulrich.com>

  I have placed these fonts in the Public Domain. This is all 100% my own work.
  Usage is totally unrestricted. If you want to make derivative works for any
  purpose, please go ahead.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

9. Gsview copyright (ImageMagick incorporated a small portion of code from the
   gsview package to locate Ghostscript under Windows. This source code is
   distributed under the following license):

Copyright (C) 2000-2002, Ghostgum Software Pty Ltd. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this file ("Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish, distribute,
sublicense, and/or sell copies of this Software, and to permit persons to whom
this file is furnished to do so, subject to the following conditions:

This Software is distributed with NO WARRANTY OF ANY KIND.  No author or
distributor accepts any responsibility for the consequences of using it, or
for whether it serves any particular purpose or works at all, unless he or she
says so in writing.

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

10. Libsquish copyright (this copyright is limited to the compression used in
    coder/dds.c, incorporated from the libsquish library):

Copyright (c) 2006 Simon Brown                          si@sjbrown.co.uk

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to  permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY  CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

11. Bootstrap copyright (ImageMagick utilizes CSS for its web pages under this
    copyright):

Bootstrap v3.3.5 (http://getbootstrap.com)
Copyright 2011-2015 Twitter, Inc.
Licensed under the MIT license

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
```

--------------------------------------------------------------------------------

````

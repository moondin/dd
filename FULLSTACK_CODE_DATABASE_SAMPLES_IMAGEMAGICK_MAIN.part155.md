---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 155
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 155 of 851)

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

---[FILE: ImageMagick.rc]---
Location: ImageMagick-main/config/ImageMagick.rc

```text
#include "winver.h"
#define __WINDOWS__
#include "..\\..\\MagickCore\\magick-baseconfig.h"
#include "..\\..\\MagickCore\\version.h"

/////////////////////////////////////////////////////////////////////////////
//
// Version
//
/////////////////////////////////////////////////////////////////////////////

VS_VERSION_INFO VERSIONINFO
 FILEVERSION MagickLibVersionNumber
 PRODUCTVERSION MagickLibVersionNumber
 FILEFLAGSMASK 0x3fL
#ifdef _DEBUG
 FILEFLAGS 0x1L
#else
 FILEFLAGS 0x0L
#endif
 FILEOS 0x40004L
 FILETYPE 0x1L
 FILESUBTYPE 0x0L
BEGIN
    BLOCK "StringFileInfo"
    BEGIN
        BLOCK "040904b0"
        BEGIN
            VALUE "ProductName", "ImageMagick\0"
            VALUE "FileDescription", "ImageMagick Studio library and utility programs\0"
            VALUE "OriginalFilename", "ImageMagick\0"
            VALUE "InternalName", "ImageMagick\0"
            VALUE "FileVersion", MagickLibVersionText "\0"
            VALUE "ProductVersion", MagickLibVersionText "\0"
            VALUE "CompanyName", "ImageMagick Studio\0"
            VALUE "LegalCopyright", MagickCopyright "\0"
            VALUE "Comments", MagickVersion "\0"
        END
    END
    BLOCK "VarFileInfo"
    BEGIN
        VALUE "Translation", 0x409, 1200
    END
END

/////////////////////////////////////////////////////////////////////////////
//
// IMAGEMAGICK
//
/////////////////////////////////////////////////////////////////////////////

COLORS.XML           IMAGEMAGICK DISCARDABLE "..\\bin\\colors.xml"
CONFIGURE.XML        IMAGEMAGICK DISCARDABLE "..\\bin\\configure.xml"
DELEGATES.XML        IMAGEMAGICK DISCARDABLE "..\\bin\\delegates.xml"
ENGLISH.XML          IMAGEMAGICK DISCARDABLE "..\\bin\\english.xml"
LOCALE.XML           IMAGEMAGICK DISCARDABLE "..\\bin\\locale.xml"
LOG.XML              IMAGEMAGICK DISCARDABLE "..\\bin\\log.xml"
THRESHOLDS.XML       IMAGEMAGICK DISCARDABLE "..\\bin\\thresholds.xml"
TYPE.XML             IMAGEMAGICK DISCARDABLE "..\\bin\\type.xml"
TYPE-GHOSTSCRIPT.XML IMAGEMAGICK DISCARDABLE "..\\bin\\type-ghostscript.xml"


/////////////////////////////////////////////////////////////////////////////
//
// Icon
//
/////////////////////////////////////////////////////////////////////////////

IDR_MAGICKICON          ICON    DISCARDABLE     "..\\..\\images\\ImageMagick.ico"
```

--------------------------------------------------------------------------------

---[FILE: ImageMagick.rdf.in]---
Location: ImageMagick-main/config/ImageMagick.rdf.in

```text
<?xml version="1.0" encoding="iso-8859-1"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:foaf="http://xmlns.com/foaf/0.1/" xmlns="http://usefulinc.com/ns/doap#">

  <Project>
    <name>ImageMagick</name>
    <shortdesc xml:lang="en">ImageMagick: convert, edit, or compose images.</shortdesc>
    <homepage rdf:resource="https://imagemagick.org/"/>
    <created>@PACKAGE_RELEASE_DATE@</created>

    <description xml:lang="en">
Introduction to ImageMagick

  ImageMagick� is a software suite to create, edit, compose, or convert
  bitmap images. It can read and write images in a variety of formats (over
  200) including PNG, JPEG, JPEG-2000, GIF, TIFF, DPX, EXR, WebP, Postscript,
  PDF, and SVG. Use ImageMagick to resize, flip, mirror, rotate, distort,
  shear and transform images, adjust image colors, apply various special
  effects, or draw text, lines, polygons, ellipses and B�zier curves.
  
  The functionality of ImageMagick is typically utilized from the command
  line or you can use the features from programs written in your favorite
  language. Choose from these interfaces: G2F (Ada), MagickCore (C),
  MagickWand (C), ChMagick (Ch), ImageMagickObject (COM+), Magick++ (C++),
  JMagick (Java), L-Magick (Lisp), Lua, NMagick (Neko/haXe), Magick.NET
  (.NET), PascalMagick (Pascal), ALImageMagick (Delphi), PerlMagick (Perl),
  MagickWand for PHP (PHP), IMagick (PHP), PythonMagick (Python), RMagick
  (Ruby), or TclMagick (Tcl/TK). With a language interface, use ImageMagick
  to modify or create images dynamically and automagically.

  ImageMagick utilizes multiple computational threads to increase performance
  and can read, process, or write mega-, giga-, or tera-pixel image sizes.
  
  ImageMagick is free software delivered as a ready-to-run binary distribution
  or as source code that you may use, copy, modify, and distribute in both open
  and proprietary applications. It is distributed under the Apache 2.0 license.
  
  The ImageMagick development process ensures a stable API and ABI. Before
  each ImageMagick release, we perform a comprehensive security assessment
  that includes memory error and thread data race detection to prevent
  security vulnerabilities.

  ImageMagick is available from
  https://imagemagick.org/script/download.php.  It runs on Linux, Windows,
  macOS, iOS, Android OS, and others.

  The authoritative ImageMagick web site is
  https://imagemagick.org. The authoritative source code repository is
  https://git.imagemagick.org/repos/ImageMagick/.


Features and Capabilities
  
  Here are just a few examples of what ImageMagick can do:
  
      * Format conversion: convert an image from one format to another (e.g.
        PNG to JPEG).
      * Transform: resize, rotate, deskew, crop, flip or trim an image.
      * Transparency: render portions of an image invisible.
      * Draw: add shapes or text to an image.
      * Decorate: add a border or frame to an image.
      * Special effects: blur, sharpen, threshold, or tint an image.
      * Animation: create a GIF animation sequence from a group of images.
      * Text &amp; comments: insert descriptive or artistic text in an image.
      * Image gradients: create a gradual blend of one color whose shape is 
        horizontal, vertical, circular, or elliptical.
      * Image identification: describe the format and attributes of an image.
      * Composite: overlap one image over another.
      * Montage: juxtapose image thumbnails on an image canvas.
      * Generalized pixel distortion: correct for, or induce image distortions
        including perspective.
      * Computer vision: Canny edge detection.
      * Morphology of shapes: extract features, describe shapes and recognize
        patterns in images.
      * Motion picture support: read and write the common image formats used in
        digital film work.
      * Image calculator: apply a mathematical expression to an image or image
        channels.
      * Connected component labeling: uniquely label connected regions in an
        image.
      * Discrete Fourier transform: implements the forward and inverse DFT.
      * Perceptual hash: maps visually identical images to the same or similar
        hash-- useful in image retrieval, authentication, indexing, or copy
        detection as well as digital watermarking.
      * Complex text layout: bidirectional text support and shaping.
      * Color management: accurate color management with color profiles or in
        lieu of-- built-in gamma compression or expansion as demanded by the
        colorspace.
      * High dynamic-range images: accurately represent the wide range of
        intensity levels found in real scenes ranging from the brightest direct
        sunlight to the deepest darkest shadows.
      * Encipher or decipher an image: convert ordinary images into
        unintelligible gibberish and back again.
      * Virtual pixel support: convenient access to pixels outside the image
        region.
      * Large image support: read, process, or write mega-, giga-, or
        tera-pixel image sizes.
      * Threads of execution support: ImageMagick is thread safe and most
        internal algorithms are OpenMP-enabled to take advantage of speed-ups
        offered by multicore processor chips.
      * Distributed pixel cache: offload intermediate pixel storage to one or
        more remote servers.
      * Heterogeneous distributed processing: certain algorithms are
        OpenCL-enabled to take advantage of speed-ups offered by executing in
        concert across heterogeneous platforms consisting of CPUs, GPUs, and
        other processors.
      * ImageMagick on the iPhone: convert, edit, or compose images on your
        iPhone or iPad.
  
  Examples of ImageMagick Usage shows how to use ImageMagick from the
  command-line to accomplish any of these tasks and much more. Also,
  see Fred's ImageMagick Scripts: a plethora of command-line scripts that
  perform geometric transforms, blurs, sharpens, edging, noise removal,
  and color manipulations. With Magick.NET, use ImageMagick without having
  to install ImageMagick on your server or desktop.
    </description>

    <maintainer>
      <foaf:Person>
        <foaf:name>ImageMagick Studio LLC</foaf:name>
        <foaf:homepage rdf:resource="https://imagemagick.org/"/>
      </foaf:Person>
    </maintainer>

    <release>
      <Version>
          <name>stable</name>
          <created>@PACKAGE_RELEASE_DATE@</created>
          <revision>@PACKAGE_BASE_VERSION@</revision>
          <patch-level>@PACKAGE_RELEASE_DATE@</patch-level>
      </Version>
    </release>

    <download-page rdf:resource="https://imagemagick.org/script/download.php"/>

    <!-- Licensing details -->
    <license rdf:resource="https://imagemagick.org/script/license.php"/>

    <!-- source repository -->
    <repository>
      <GITRepository>
        <repositoryWebView rdf:resource="https://github.com/ImageMagick/ImageMagick"/>
      </GITRepository>
    </repository>
  </Project>


  <!--
       optional administrivia:
       authoring tools can add more here if they'd like.
   -->
  <rdf:Description rdf:about="">
    <foaf:maker>
      <foaf:Person>
        <foaf:name>ImageMagick Studio LLC</foaf:name>
        <foaf:homepage rdf:resource="https://imagemagick.org/"/>
      </foaf:Person>
    </foaf:maker>
  </rdf:Description>

</rdf:RDF>
<!-- 
Local variables:
mode:nxml
End:
-->
```

--------------------------------------------------------------------------------

---[FILE: install-sh]---
Location: ImageMagick-main/config/install-sh

```text
#!/bin/sh
# install - install a program, script, or datafile

scriptversion=2025-06-18.21; # UTC

# This originates from X11R5 (mit/util/scripts/install.sh), which was
# later released in X11R6 (xc/config/util/install.sh) with the
# following copyright and license.
#
# Copyright (C) 1994 X Consortium
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to
# deal in the Software without restriction, including without limitation the
# rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
# sell copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
# X CONSORTIUM BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
# AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNEC-
# TION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
#
# Except as contained in this notice, the name of the X Consortium shall not
# be used in advertising or otherwise to promote the sale, use or other deal-
# ings in this Software without prior written authorization from the X Consor-
# tium.
#
#
# FSF changes to this file are in the public domain.
#
# Calling this script install-sh is preferred over install.sh, to prevent
# 'make' implicit rules from creating a file called install from it
# when there is no Makefile.
#
# This script is compatible with the BSD install script, but was written
# from scratch.

tab='	'
nl='
'
IFS=" $tab$nl"

# Set DOITPROG to "echo" to test this script.

doit=${DOITPROG-}
doit_exec=${doit:-exec}

# Put in absolute file names if you don't have them in your path;
# or use environment vars.

chgrpprog=${CHGRPPROG-chgrp}
chmodprog=${CHMODPROG-chmod}
chownprog=${CHOWNPROG-chown}
cmpprog=${CMPPROG-cmp}
cpprog=${CPPROG-cp}
mkdirprog=${MKDIRPROG-mkdir}
mvprog=${MVPROG-mv}
rmprog=${RMPROG-rm}
stripprog=${STRIPPROG-strip}

posix_mkdir=

# Desired mode of installed file.
mode=0755

# Create dirs (including intermediate dirs) using mode 755.
# This is like GNU 'install' as of coreutils 8.32 (2020).
mkdir_umask=22

backupsuffix=
chgrpcmd=
chmodcmd=$chmodprog
chowncmd=
mvcmd=$mvprog
rmcmd="$rmprog -f"
stripcmd=

src=
dst=
dir_arg=
dst_arg=

copy_on_change=false
is_target_a_directory=possibly

usage="\
Usage: $0 [OPTION]... [-T] SRCFILE DSTFILE
   or: $0 [OPTION]... SRCFILES... DIRECTORY
   or: $0 [OPTION]... -t DIRECTORY SRCFILES...
   or: $0 [OPTION]... -d DIRECTORIES...

In the 1st form, copy SRCFILE to DSTFILE.
In the 2nd and 3rd, copy all SRCFILES to DIRECTORY.
In the 4th, create DIRECTORIES.

Options:
     --help     display this help and exit.
     --version  display version info and exit.

  -c            (ignored)
  -C            install only if different (preserve data modification time)
  -d            create directories instead of installing files.
  -g GROUP      $chgrpprog installed files to GROUP.
  -m MODE       $chmodprog installed files to MODE.
  -o USER       $chownprog installed files to USER.
  -p            pass -p to $cpprog.
  -s            $stripprog installed files.
  -S SUFFIX     attempt to back up existing files, with suffix SUFFIX.
  -t DIRECTORY  install into DIRECTORY.
  -T            report an error if DSTFILE is a directory.

Environment variables override the default commands:
  CHGRPPROG CHMODPROG CHOWNPROG CMPPROG CPPROG MKDIRPROG MVPROG
  RMPROG STRIPPROG

By default, rm is invoked with -f; when overridden with RMPROG,
it's up to you to specify -f if you want it.

If -S is not specified, no backups are attempted.

Report bugs to <bug-automake@gnu.org>.
GNU Automake home page: <https://www.gnu.org/software/automake/>.
General help using GNU software: <https://www.gnu.org/gethelp/>."

while test $# -ne 0; do
  case $1 in
    -c) ;;

    -C) copy_on_change=true;;

    -d) dir_arg=true;;

    -g) chgrpcmd="$chgrpprog $2"
        shift;;

    --help) echo "$usage"; exit $?;;

    -m) mode=$2
        case $mode in
          *' '* | *"$tab"* | *"$nl"* | *'*'* | *'?'* | *'['*)
            echo "$0: invalid mode: $mode" >&2
            exit 1;;
        esac
        shift;;

    -o) chowncmd="$chownprog $2"
        shift;;

    -p) cpprog="$cpprog -p";;

    -s) stripcmd=$stripprog;;

    -S) backupsuffix="$2"
        shift;;

    -t)
        is_target_a_directory=always
        dst_arg=$2
        # Protect names problematic for 'test' and other utilities.
        case $dst_arg in
          -* | [=\(\)!]) dst_arg=./$dst_arg;;
        esac
        shift;;

    -T) is_target_a_directory=never;;

    --version) echo "$0 (GNU Automake) $scriptversion"; exit $?;;

    --) shift
        break;;

    -*) echo "$0: invalid option: $1" >&2
        exit 1;;

    *)  break;;
  esac
  shift
done

# We allow the use of options -d and -T together, by making -d
# take the precedence; this is for compatibility with GNU install.

if test -n "$dir_arg"; then
  if test -n "$dst_arg"; then
    echo "$0: target directory not allowed when installing a directory." >&2
    exit 1
  fi
fi

if test $# -ne 0 && test -z "$dir_arg$dst_arg"; then
  # When -d is used, all remaining arguments are directories to create.
  # When -t is used, the destination is already specified.
  # Otherwise, the last argument is the destination.  Remove it from $@.
  for arg
  do
    if test -n "$dst_arg"; then
      # $@ is not empty: it contains at least $arg.
      set fnord "$@" "$dst_arg"
      shift # fnord
    fi
    shift # arg
    dst_arg=$arg
    # Protect names problematic for 'test' and other utilities.
    case $dst_arg in
      -* | [=\(\)!]) dst_arg=./$dst_arg;;
    esac
  done
fi

if test $# -eq 0; then
  if test -z "$dir_arg"; then
    echo "$0: no input file specified." >&2
    exit 1
  fi
  # It's OK to call 'install-sh -d' without argument.
  # This can happen when creating conditional directories.
  exit 0
fi

if test -z "$dir_arg"; then
  if test $# -gt 1 || test "$is_target_a_directory" = always; then
    if test ! -d "$dst_arg"; then
      echo "$0: $dst_arg: Is not a directory." >&2
      exit 1
    fi
  fi
fi

if test -z "$dir_arg"; then
  do_exit='(exit $ret); exit $ret'
  trap "ret=129; $do_exit" 1
  trap "ret=130; $do_exit" 2
  trap "ret=141; $do_exit" 13
  trap "ret=143; $do_exit" 15

  # Set umask so as not to create temps with too-generous modes.
  # However, 'strip' requires both read and write access to temps.
  case $mode in
    # Optimize common cases.
    *644) cp_umask=133;;
    *755) cp_umask=22;;

    *[0-7])
      if test -z "$stripcmd"; then
        u_plus_rw=
      else
        u_plus_rw='% 200'
      fi
      cp_umask=`expr '(' 777 - $mode % 1000 ')' $u_plus_rw`;;
    *)
      if test -z "$stripcmd"; then
        u_plus_rw=
      else
        u_plus_rw=,u+rw
      fi
      cp_umask=$mode$u_plus_rw;;
  esac
fi

for src
do
  # Protect names problematic for 'test' and other utilities.
  case $src in
    -* | [=\(\)!]) src=./$src;;
  esac

  if test -n "$dir_arg"; then
    dst=$src
    dstdir=$dst
    test -d "$dstdir"
    dstdir_status=$?
    # Don't chown directories that already exist.
    if test $dstdir_status = 0; then
      chowncmd=""
    fi
  else

    # Waiting for this to be detected by the "$cpprog $src $dsttmp" command
    # might cause directories to be created, which would be especially bad
    # if $src (and thus $dsttmp) contains '*'.
    if test ! -f "$src" && test ! -d "$src"; then
      echo "$0: $src does not exist." >&2
      exit 1
    fi

    if test -z "$dst_arg"; then
      echo "$0: no destination specified." >&2
      exit 1
    fi
    dst=$dst_arg

    # If destination is a directory, append the input filename.
    if test -d "$dst"; then
      if test "$is_target_a_directory" = never; then
        echo "$0: $dst_arg: Is a directory" >&2
        exit 1
      fi
      dstdir=$dst
      dstbase=`basename "$src"`
      case $dst in
	*/) dst=$dst$dstbase;;
	*)  dst=$dst/$dstbase;;
      esac
      dstdir_status=0
    else
      dstdir=`dirname "$dst"`
      test -d "$dstdir"
      dstdir_status=$?
    fi
  fi

  case $dstdir in
    */) dstdirslash=$dstdir;;
    *)  dstdirslash=$dstdir/;;
  esac

  obsolete_mkdir_used=false

  if test $dstdir_status != 0; then
    case $posix_mkdir in
      '')
        # With -d, create the new directory with the user-specified mode.
        # Otherwise, rely on $mkdir_umask.
        if test -n "$dir_arg"; then
          mkdir_mode=-m$mode
        else
          mkdir_mode=
        fi

        posix_mkdir=false
	# The $RANDOM variable is not portable (e.g., dash).  Use it
	# here however when possible just to lower collision chance.
	tmpdir=${TMPDIR-/tmp}/ins$RANDOM-$$

	trap '
	  ret=$?
	  rmdir "$tmpdir/a/b" "$tmpdir/a" "$tmpdir" 2>/dev/null
	  exit $ret
	' 0

	# Because "mkdir -p" follows existing symlinks and we likely work
	# directly in world-writable /tmp, make sure that the '$tmpdir'
	# directory is successfully created first before we actually test
	# 'mkdir -p'.
	if (umask $mkdir_umask &&
	    $mkdirprog $mkdir_mode "$tmpdir" &&
	    exec $mkdirprog $mkdir_mode -p -- "$tmpdir/a/b") >/dev/null 2>&1
	then
	  if test -z "$dir_arg" || {
	       # Check for POSIX incompatibility with -m.
	       # HP-UX 11.23 and IRIX 6.5 mkdir -m -p sets group- or
	       # other-writable bit of parent directory when it shouldn't.
	       # FreeBSD 6.1 mkdir -m -p sets mode of existing directory.
	       test_tmpdir="$tmpdir/a"
	       ls_ld_tmpdir=`ls -ld "$test_tmpdir"`
	       case $ls_ld_tmpdir in
		 d????-?r-*) different_mode=700;;
		 d????-?--*) different_mode=755;;
		 *) false;;
	       esac &&
	       $mkdirprog -m$different_mode -p -- "$test_tmpdir" && {
		 ls_ld_tmpdir_1=`ls -ld "$test_tmpdir"`
		 test "$ls_ld_tmpdir" = "$ls_ld_tmpdir_1"
	       }
	     }
	  then posix_mkdir=:
	  fi
	  rmdir "$tmpdir/a/b" "$tmpdir/a" "$tmpdir"
	else
	  # Remove any dirs left behind by ancient mkdir implementations.
	  rmdir ./$mkdir_mode ./-p ./-- "$tmpdir" 2>/dev/null
	fi
	trap '' 0;;
    esac

    if
      $posix_mkdir && (
        umask $mkdir_umask &&
        $doit_exec $mkdirprog $mkdir_mode -p -- "$dstdir"
      )
    then :
    else

      # mkdir does not conform to POSIX,
      # or it failed possibly due to a race condition.  Create the
      # directory the slow way, step by step, checking for races as we go.

      case $dstdir in
        /*) prefix='/';;
        [-=\(\)!]*) prefix='./';;
        *)  prefix='';;
      esac

      oIFS=$IFS
      IFS=/
      set -f
      set fnord $dstdir
      shift
      set +f
      IFS=$oIFS

      prefixes=

      for d
      do
        test X"$d" = X && continue

        prefix=$prefix$d
        if test -d "$prefix"; then
          prefixes=
        else
          if $posix_mkdir; then
            (umask $mkdir_umask &&
             $doit_exec $mkdirprog $mkdir_mode -p -- "$dstdir") && break
            # Don't fail if two instances are running concurrently.
            test -d "$prefix" || exit 1
          else
            case $prefix in
              *\'*) qprefix=`echo "$prefix" | sed "s/'/'\\\\\\\\''/g"`;;
              *) qprefix=$prefix;;
            esac
            prefixes="$prefixes '$qprefix'"
          fi
        fi
        prefix=$prefix/
      done

      if test -n "$prefixes"; then
        # Don't fail if two instances are running concurrently.
        (umask $mkdir_umask &&
         eval "\$doit_exec \$mkdirprog $prefixes") ||
          test -d "$dstdir" || exit 1
        obsolete_mkdir_used=true
      fi
    fi
  fi

  if test -n "$dir_arg"; then
    { test -z "$chowncmd" || $doit $chowncmd "$dst"; } &&
    { test -z "$chgrpcmd" || $doit $chgrpcmd "$dst"; } &&
    { test "$obsolete_mkdir_used$chowncmd$chgrpcmd" = false ||
      test -z "$chmodcmd" || $doit $chmodcmd $mode "$dst"; } || exit 1
  else

    # Make a couple of temp file names in the proper directory.
    dsttmp=${dstdirslash}_inst.$$_
    rmtmp=${dstdirslash}_rm.$$_

    # Trap to clean up those temp files at exit.
    trap 'ret=$?; rm -f "$dsttmp" "$rmtmp" && exit $ret' 0

    # Copy the file name to the temp name.
    (umask $cp_umask &&
     { test -z "$stripcmd" || {
	 # Create $dsttmp read-write so that cp doesn't create it read-only,
	 # which would cause strip to fail.
	 if test -z "$doit"; then
	   : >"$dsttmp" # No need to fork-exec 'touch'.
	 else
	   $doit touch "$dsttmp"
	 fi
       }
     } &&
     $doit_exec $cpprog "$src" "$dsttmp") &&

    # and set any options; do chmod last to preserve setuid bits.
    #
    # If any of these fail, we abort the whole thing.  If we want to
    # ignore errors from any of these, just make sure not to ignore
    # errors from the above "$doit $cpprog $src $dsttmp" command.
    #
    { test -z "$chowncmd" || $doit $chowncmd "$dsttmp"; } &&
    { test -z "$chgrpcmd" || $doit $chgrpcmd "$dsttmp"; } &&
    { test -z "$stripcmd" || $doit $stripcmd "$dsttmp"; } &&
    { test -z "$chmodcmd" || $doit $chmodcmd $mode "$dsttmp"; } &&

    # If -C, don't bother to copy if it wouldn't change the file.
    if $copy_on_change &&
       old=`LC_ALL=C ls -dlL "$dst"     2>/dev/null` &&
       new=`LC_ALL=C ls -dlL "$dsttmp"  2>/dev/null` &&
       set -f &&
       set X $old && old=:$2:$4:$5:$6 &&
       set X $new && new=:$2:$4:$5:$6 &&
       set +f &&
       test "$old" = "$new" &&
       $cmpprog "$dst" "$dsttmp" >/dev/null 2>&1
    then
      rm -f "$dsttmp"
    else
      # If $backupsuffix is set, and the file being installed
      # already exists, attempt a backup.  Don't worry if it fails,
      # e.g., if mv doesn't support -f.
      if test -n "$backupsuffix" && test -f "$dst"; then
        $doit $mvcmd -f "$dst" "$dst$backupsuffix" 2>/dev/null
      fi

      # Rename the file to the real destination.
      $doit $mvcmd -f "$dsttmp" "$dst" 2>/dev/null ||

      # The rename failed, perhaps because mv can't rename something else
      # to itself, or perhaps because mv is so ancient that it does not
      # support -f.
      {
        # Now remove or move aside any old file at destination location.
        # We try this two ways since rm can't unlink itself on some
        # systems and the destination file might be busy for other
        # reasons.  In this case, the final cleanup might fail but the new
        # file should still install successfully.
        {
          test ! -f "$dst" ||
          $doit $rmcmd "$dst" 2>/dev/null ||
          { $doit $mvcmd -f "$dst" "$rmtmp" 2>/dev/null &&
            { $doit $rmcmd "$rmtmp" 2>/dev/null; :; }
          } ||
          { echo "$0: cannot unlink or rename $dst" >&2
            (exit 1); exit 1
          }
        } &&

        # Now rename the file to the real destination.
        $doit $mvcmd "$dsttmp" "$dst"
      }
    fi || exit 1

    trap '' 0
  fi
done

# Local variables:
# eval: (add-hook 'before-save-hook 'time-stamp nil t)
# time-stamp-start: "scriptversion="
# time-stamp-format: "%Y-%02m-%02d.%02H"
# time-stamp-time-zone: "UTC0"
# time-stamp-end: "; # UTC"
# End:
```

--------------------------------------------------------------------------------

---[FILE: lndir.sh]---
Location: ImageMagick-main/config/lndir.sh

```bash
#! /bin/sh

# lndir - create shadow link tree
#
# Time stamp <89/11/28 18:56:54 gildea>
# By Stephen Gildea <gildea@bbn.com> based on
#  XConsortium: lndir.sh,v 1.1 88/10/20 17:37:16 jim Exp
#
# Modified slightly for ImageMagick by Bob Friesenhahn, 1999
#
# Used to create a copy of the a directory tree that has links for all
# non- directories.  If you are building the distribution on more than
# one machine, you should use this script.
#
# If your main sources are located in /usr/local/src/X and you would like
# your link tree to be in /usr/local/src/new-X, do the following:
#
# 	%  mkdir /usr/local/src/new-X
#	%  cd /usr/local/src/new-X
# 	%  lndir ../X
#
# Note: does not link files beginning with "."  Is this a bug or a feature?
#
# Improvements over R3 version:
#   Allows the fromdir to be relative: usually you want to say "../dist"
#   The name is relative to the todir, not the current directory.
#
# Bugs in R3 version fixed:
#   Do "pwd" command *after* "cd $DIRTO".
#   Don't try to link directories, avoiding error message "<dir> exists".
#   Barf with Usage message if either DIRFROM *or* DIRTO is not a directory.

USAGE="Usage: $0 fromdir [todir]"

if [ $# -lt 1 -o $# -gt 2 ]
then
    echo "$USAGE"
    exit 1
fi

DIRFROM=$1

if [ $# -eq 2 ];
then
    DIRTO=$2
else
    DIRTO=.
fi

if [ ! -d $DIRTO ]
then
    echo "$0: $DIRTO is not a directory"
    echo "$USAGE"
    exit 2
fi

cd $DIRTO

if [ ! -d $DIRFROM ]
then
    echo "$0: $DIRFROM is not a directory"
    echo "$USAGE"
    exit 2
fi

pwd=`pwd`

if [ `(cd $DIRFROM; pwd)` = $pwd ]
then
    echo "$pwd: FROM and TO are identical!"
    exit 1
fi

for file in `ls $DIRFROM`
do
    if [ ! -d $DIRFROM/$file ]
    then
	test -r $file || ln -s $DIRFROM/$file .
    else
	#echo $file:
	test -d $file || mkdir $file && chmod 777 $file
	(cd $file
	pwd=`pwd`
	case "$DIRFROM" in
	    /*) ;;
	    *)  DIRFROM=../$DIRFROM ;;
	esac
	if [ `(cd $DIRFROM/$file; pwd)` = $pwd ]
	then
	    echo "$pwd: FROM and TO are identical!"
	    exit 1
	fi
	$0 $DIRFROM/$file
	)
    fi
done
```

--------------------------------------------------------------------------------

---[FILE: locale.md]---
Location: ImageMagick-main/config/locale.md

```text
Translation is fairly straight-forward.  Copy `english.xml` to _locale_.xml.  Change any messages from English to the target language.  As an example:

```
<message name="UnableToOpenBlob">
  unable to open image
</message>
```
becomes
```
<message name="UnableToOpenBlob">
  impossible d'ouvrir l'image
</message>
```
in French.  You then need to copy the _locale_.xml to the same location as `english.xml`, e.g. `/usr/local/ImageMagick-7/_locale_.xml`. Make sure your _locale_.xml file is referenced in the `locale.xml` configuration file.

The final step is to contribute _locale_.xml to ImageMagick so we can include it in a future release of ImageMagick so the community can benefit from the translation.
```

--------------------------------------------------------------------------------

---[FILE: locale.xml]---
Location: ImageMagick-main/config/locale.xml

```text
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE localemap [
  <!ELEMENT localemap (include)+>
  <!ATTLIST localemap xmlns CDATA #FIXED ''>
  <!ELEMENT include EMPTY>
  <!ATTLIST include xmlns CDATA #FIXED '' file NMTOKEN #REQUIRED
    locale NMTOKEN #REQUIRED>
]>
<localemap>
  <include locale="no_NO.ISO-8859-1" file="bokmal.xml"/>
  <include locale="ca_ES.ISO-8859-1" file="catalan.xml"/>
  <include locale="hr_HR.ISO-8859-2" file="croatian.xml"/>
  <include locale="cs_CZ.ISO-8859-2" file="czech.xml"/>
  <include locale="da_DK.ISO-8859-1" file="danish.xml"/>
  <include locale="de_DE.ISO-8859-1" file="deutsch.xml"/>
  <include locale="nl_NL.ISO-8859-1" file="dutch.xml"/>
  <include locale="C" file="english.xml"/>
  <include locale="et_EE.ISO-8859-1" file="estonian.xml"/>
  <include locale="fi_FI.ISO-8859-1" file="finnish.xml"/>
  <include locale="fr_FR.ISO-8859-1" file="francais.xml"/>
  <include locale="fr_FR.ISO-8859-1" file="francais.xml"/>
  <include locale="fr_FR.UTF-8" file="francais.xml"/>
  <include locale="gl_ES.ISO-8859-1" file="galego.xml"/>
  <include locale="gl_ES.ISO-8859-1" file="galician.xml"/>
  <include locale="de_DE.ISO-8859-1" file="german.xml"/>
  <include locale="el_GR.ISO-8859-7" file="greek.xml"/>
  <include locale="en_US.UTF-8" file="english.xml"/>
  <include locale="iw_IL.ISO-8859-8" file="hebrew.xml"/>
  <include locale="hr_HR.ISO-8859-2" file="hrvatski.xml"/>
  <include locale="hu_HU.ISO-8859-2" file="hungarian.xml"/>
  <include locale="is_IS.ISO-8859-1" file="icelandic.xml"/>
  <include locale="it_IT.ISO-8859-1" file="italian.xml"/>
  <include locale="ja_JP.eucJP" file="japanese.xml"/>
  <include locale="ko_KR.eucKR" file="korean.xml"/>
  <include locale="lt_LT.ISO-8859-13" file="lithuanian.xml"/>
  <include locale="no_NO.ISO-8859-1" file="norwegian.xml"/>
  <include locale="nn_NO.ISO-8859-1" file="nynorsk.xml"/>
  <include locale="pl_PL.ISO-8859-2" file="polish.xml"/>
  <include locale="pt_PT.ISO-8859-1" file="portuguese.xml"/>
  <include locale="ro_RO.ISO-8859-2" file="romanian.xml"/>
  <include locale="ru_RU.ISO-8859-5" file="russian.xml"/>
  <include locale="sk_SK.ISO-8859-2" file="slovak.xml"/>
  <include locale="sl_SI.ISO-8859-2" file="slovene.xml"/>
  <include locale="es_ES.ISO-8859-1" file="spanish.xml"/>
  <include locale="sv_SE.ISO-8859-1" file="swedish.xml"/>
  <include locale="th_TH.TIS-620" file="thai.xml"/>
  <include locale="tr_TR.ISO-8859-9" file="turkish.xml"/>
</localemap>
```

--------------------------------------------------------------------------------

---[FILE: log.xml]---
Location: ImageMagick-main/config/log.xml

```text
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE logmap [
<!ELEMENT logmap (log)+>
<!ELEMENT log (#PCDATA)>
<!ATTLIST log events CDATA #IMPLIED>
<!ATTLIST log output CDATA #IMPLIED>
<!ATTLIST log filename CDATA #IMPLIED>
<!ATTLIST log generations CDATA #IMPLIED>
<!ATTLIST log limit CDATA #IMPLIED>
<!ATTLIST log format CDATA #IMPLIED>
]>
<!--
  Configure ImageMagick logger.

  Choose from one or more these events separated by a comma:
    all
    accelerate
    annotate
    blob
    cache
    coder
    command
    configure
    deprecate
    draw
    exception
    locale
    module
    none
    pixel
    policy
    resource
    trace
    transform
    user
    wand
    x11

  Choose one output handler:
    console
    debug
    event
    file
    none
    stderr
    stdout

  When output is to a file, specify the filename.  Embed %g in the filename to
  support log generations.  Generations is the number of log files to retain.
  Limit is the number of logging events before generating a new log generation.

  The format of the log is defined by embedding special format characters:

    %c   client
    %d   domain
    %e   event
    %f   function
    %i   thread id
    %l   line
    %m   module
    %n   log name
    %p   process id
    %r   real CPU time
    %t   wall clock time
    %u   user CPU time
    %v   version
    %%   percent sign
    \n   newline
    \r   carriage return
    xml
-->
<logmap>
  <log events="None"/>
  <log output="console"/>
  <log filename="Magick-%g.log"/>
  <log generations="3"/>
  <log limit="2GiB"/>
  <log format="%t %r %u %v %d %c[%p]: %m/%f/%l/%d\n  %e"/>
</logmap>
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 6
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 6 of 851)

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

---[FILE: Install-unix.txt]---
Location: ImageMagick-main/Install-unix.txt

```text
Download & Unpack
  
  ImageMagick builds on a variety of Unix and Unix-like operating systems
  including Linux, Ubuntu, FreeBSD, WIndows, macOS, and others. A compiler
  is required and fortunately almost all modern Unix systems have one. Download
  https://imagemagick.org/archive/ImageMagick.tar.gz.
  
  Unpack the distribution with this command:
  
    $ tar xvfz ImageMagick.tar.gz
  
  Now that you have the ImageMagick Unix/Linux source distribution unpacked,
  let's configure it.
  
Configure
  
  The configure script looks at your environment and decides what it can cobble
  together to get ImageMagick compiled and installed on your system. This
  includes finding a compiler, where your compiler header files are located
  (e.g. stdlib.h), and if any delegate libraries are available for ImageMagick
  to use (e.g. JPEG, PNG, TIFF, etc.). If you are willing to accept configure's
  default options, and build from within the source directory, you can simply
  type:
  
    $ cd ImageMagick-7.1.1
    $ ./configure
  
  Watch the configure script output to verify that it finds everything that
  you think it should. Pay particular attention to the last lines of the script
  output.
  
  You can influence the choice of compiler, compilation flags, or libraries of
  the configure script by setting initial values for variables in the configure
  command line. These include, among others:
  
    CC
        Name of C compiler (e.g. cc -Xa) to use.

    CXX
        Name of C++ compiler to use (e.g. CC).

    CFLAGS
        Compiler flags (e.g. -g -O2) to compile C code.

    CXXFLAGS
        Compiler flags (e.g. -g -O2) to compile C++ code.

    CPPFLAGS
        Include paths (.e.g. -I/usr/local) to look for header files.

    LDFLAGS
        Library paths (.e.g. -L/usr/local) to look for libraries systems that
        support the notion of a library run-path may require an additional
        argument in order to find shared libraries at run time. For example,
        the Solaris linker requires an argument of the form -R/path. Some
        Linux systems will work with -rpath /usr/local/lib, while some other
        Linux systems who's gcc does not pass -rpath to the linker require
        an argument of the form -Wl,-rpath,/usr/local/lib.

    LIBS
        Extra libraries (.e.g. -l/usr/local/lib) required to link.
  
  Here is an example of setting configure variables from the command line:
  
    $ ./configure CC=c99 CFLAGS=-O2 LIBS=-lposix
  
  Any variable (e.g. CPPFLAGS or LDFLAGS) which requires a directory path must
  specify an absolute path rather than a relative path.
  
  Configure can usually find the X include and library files automagically,
  but if it doesn't, you can use the --x-includes=path and --x-libraries=path
  options to specify their locations.
  
  The configure script provides a number of ImageMagick specific
  options. When disabling an option --disable-something is equivalent to
  specifying --enable-something=no and --without-something is equivalent to
  --with-something=no. The configure options are as follows (execute configure
  --help to see all options).
  
  ImageMagick options represent either features to be enabled, disabled,
  or packages to be included in the build. When a feature is enabled (via
  --enable-something), it enables code already present in ImageMagick. When a
  package is enabled (via --with-something), the configure script will search
  for it, and if is properly installed and ready to use (headers and built
  libraries are found by compiler) it will be included in the build. The
  configure script is delivered with all features disabled and all packages
  enabled. In general, the only reason to disable a package is if a package
  exists but it is unsuitable for the build (perhaps an old version or not
  compiled with the right compilation flags).
  
  Here are the optional features you can configure:
  
    --enable-shared
      build the shared libraries and support for loading coder and process
      modules. Shared libraries are preferred because they allow programs
      to share common code, making the individual programs much smaller. In
      addition shared libraries are required in order for PerlMagick to be
      dynamically loaded by an installed PERL (otherwise an additional PERL
      (PerlMagick) must be installed.
  
      ImageMagick built with delegates (see MAGICK PLUG-INS below) can pose
      additional challenges. If ImageMagick is built using static libraries (the
      default without --enable-shared) then delegate libraries may be built as
      either static libraries or shared libraries. However, if ImageMagick is
      built using shared libraries, then all delegate libraries must also be
      built as shared libraries. Static libraries usually have the extension
      .a, while shared libraries typically have extensions like .so, .sa, or
      .dll. Code in shared libraries normally must compiled using a special
      compiler option to produce Position Independent Code (PIC). The only
      time this not necessary is if the platform compiles code as PIC by
      default.
  
      PIC compilation flags differ from vendor to vendor (gcc's is
      -fPIC). However, you must compile all shared library source with the
      same flag (for gcc use -fPIC rather than -fpic). While static libraries
      are normally created using an archive tool like ar, shared libraries
      are built using special linker or compiler options (e.g. -shared for gcc).
  
      If --enable-shared is not specified, a new PERL interpreter (PerlMagick)
      is built which is statically linked against the PerlMagick extension. This
      new interpreter is installed into the same directory as the ImageMagick
      utilities. If --enable-shared is specified, the PerlMagick extension is
      built as a dynamically loadable object which is loaded into your current
      PERL interpreter at run-time. Use of dynamically-loaded extensions is
      preferable over statically linked extensions so use --enable-shared if
      possible (note that all libraries used with ImageMagick must be shared
      libraries!).
  
    --disable-static
      static archive libraries (with extension .a) are not built. If you
      are building shared libraries, there is little value to building static
      libraries. Reasons to build static libraries include: 1) they can be
      easier to debug; 2) clients do not have external dependencies (i.e.
      libMagick.so); 3) building PIC versions of the delegate libraries may
      take additional expertise and effort; 4) you are unable to build shared
      libraries.
  
    --disable-installed
      disable building an installed ImageMagick (default enabled).
  
      By default the ImageMagick build is configured to formally install
      into a directory tree. This the most secure and reliable way to install
      ImageMagick. Use this option to configure ImageMagick so that it doesn't
      use hard-coded paths and locates support files by computing an offset path
      from the executable (or from the location specified by the MAGICK_HOME
      environment variable. The uninstalled configuration is ideal for binary
      distributions which are expected to extract and run in any location.
  
    --enable-ccmalloc
      enable 'ccmalloc' memory debug support (default disabled).
  
    --enable-prof
      enable 'prof' profiling support (default disabled).
  
    --enable-gprof
      enable 'gprof' profiling support (default disabled).
  
    --enable-gcov
      enable 'gcov' profiling support (default disabled).

    --disable-openmp
      disable OpenMP (default enabled).
  
      Certain ImageMagick algorithms, for example convolution, can achieve
      a significant speed-up with the assistance of the OpenMP API when
      running on modern dual and quad-core processors.
  
    --disable-largefile
      disable support for large (64 bit) file offsets.
  
      By default, ImageMagick is compiled with support for large files (>
      2GB on a 32-bit CPU) if the operating system supports large files. Some
      applications which use the ImageMagick library may also require support
      for large files. By disabling support for large files via
      --disable-largefile, dependent applications do not require special
      compilation options for large files in order to use the library.
  
  Here are the optional packages you can configure:
  
    --with-quantum-depth
      number of bits in a pixel quantum (default 16).
  
      Use this option to specify the number of bits to use per pixel quantum
      (the size of the red, green, blue, and alpha pixel components). For
      example, --with-quantum-depth=8 builds ImageMagick using 8-bit quantums.
      Most computer display adapters use 8-bit quantums. Currently supported
      arguments are 8, 16, or 32. We recommend the default of 16 because
      some image formats support 16 bits-per-pixel. However, this option is
      important in determining the overall run-time performance of ImageMagick.
  
      The number of bits in a quantum determines how many values it may
      contain. Each quantum level supports 256 times as many values as the
      previous level. The following table shows the range available for various
      quantum sizes.
  
        Quantum Depth  Valid Range (Decimal)  Valid Range (Hex)
            8             0-255                  00-FF
           16             0-65535                0000-FFFF
           32             0-4294967295           00000000-FFFFFFFF
        
      Larger pixel quantums can cause ImageMagick to run more slowly and to
      require more memory. For example, using sixteen-bit pixel quantums can
      cause ImageMagick to run 15% to 50% slower (and take twice as much memory)
      than when it is built to support eight-bit pixel quantums.
  
      The amount of virtual memory consumed by an image can be computed by
      the equation (5 * Quantum Depth * Rows * Columns) / 8. This an important
      consideration when resources are limited, particularly since processing
      an image may require several images to be in memory at one time. The
      following table shows memory consumption values for a 1024x768 image:
  
        Quantum Depth   Virtual Memory
             8               3MB
            16               8MB
            32              15MB
  
    --enable-hdri
      accurately represent the wide range of intensity levels (experimental).
  
    --enable-osx-universal-binary
      build a universal binary on OS X.
  
    --without-modules
      disable support for dynamically loadable modules.
  
      Image coders and process modules are built as loadable modules which are
      installed under the directory [prefix]/lib/ImageMagick-X.X.X/modules-QN
      (where 'N' equals 8, 16, or 32 depending on the quantum depth) in the
      subdirectories coders and filters respectively. The modules build option
      is only available in conjunction with --enable-shared. If --enable-shared
      is not also specified, support for building modules is disabled. Note that
      if --enable-shared and --disable-modules are specified, the module loader
      is active (allowing extending an installed ImageMagick by simply copying
      a module into place) but ImageMagick itself is not built using modules.
  
    --with-cache
      set pixel cache threshold (defaults to available memory).
  
      Specify a different image pixel cache threshold with this option. This
      sets the maximum amount of heap memory that ImageMagick is allowed to
      consume before switching to using memory-mapped temporary files to store
      raw pixel data.
  
    --without-threads
      disable threads support.
  
      By default, the ImageMagick library is compiled with multi-thread
      support. If this undesirable, specify --without-threads.
  
    --with-frozenpaths
      enable frozen delegate paths.
  
      Normally, external program names are substituted into the delegates.xml
      configuration file without full paths. Specify this option to enable
      saving full paths to programs using locations determined by configure.
      This useful for environments where programs are stored under multiple
      paths, and users may use different PATH settings than the person who
      builds ImageMagick.
  
    --without-magick-plus-plus
      disable build/install of Magick++.
  
      Disable building Magick++, the C++ application programming interface
      to ImageMagick. A suitable C++ compiler is required in order to build
      Magick++. Specify the CXX configure variable to select the C++ compiler
      to use (default g++), and CXXFLAGS to select the desired compiler
      optimization and debug flags (default -g -O2). Antique C++ compilers
      will normally be rejected by configure tests so specifying this option
      should only be necessary if Magick++ fails to compile.

    --with-package-release-name
      encode this name into the shared library name (see libtools -release
      option).
  
    --without-perl
      disable build/install of PerlMagick, or
  
      By default, PerlMagick is conveniently compiled and installed as part
      of ImageMagick's normal configure, make, sudo make install process. When
      --without-perl is specified, you must first install ImageMagick, change to
      the PerlMagick subdirectory, build, and finally install PerlMagick. Note,
      PerlMagick is configured even if --without-perl is specified. If the
      argument --with-perl=/path/to/perl is supplied, /../path/to/perl is be
      taken as the PERL interpreter to use. This important in case the perl
      executable in your PATH is not PERL5, or is not the PERL you want to use.
  
    --with-perl=PERL
      use specified Perl binary to configure PerlMagick.
  
    --with-perl-options=OPTIONS
      options to pass on command-line when generating PerlMagick's Makefile
      from Makefile.PL.
  
      The PerlMagick module is normally installed using the Perl interpreter's
      installation PREFIX, rather than ImageMagick's. If ImageMagick's
      installation prefix is not the same as PERL's PREFIX, then you
      may find that PerlMagick's sudo make install step tries to install
      into a directory tree that you don't have write permissions to. This
      common when PERL is delivered with the operating system or on Internet
      Service Provider (ISP) web servers. If you want PerlMagick to install
      elsewhere, then provide a PREFIX option to PERL's configuration step
      via "--with-perl-options=PREFIX=/some/place". Other options accepted by
      MakeMaker are 'LIB', 'LIBPERL_A', 'LINKTYPE', and 'OPTIMIZE'. See the
      ExtUtils::MakeMaker(3) manual page for more information on configuring
      PERL extensions.
  
    --without-bzlib
      disable BZLIB support.
  
    --without-dps
      disable Display Postscript support.
  
    --with-fpx
      enable FlashPIX support.
  
    --without-freetype
      disable TrueType support.
  
    --with-gslib
      enable Ghostscript library support.
  
    --without-jbig
      disable JBIG support.
  
    --without-jpeg
      disable JPEG support.
  
    --without-jp2
      disable JPEG v2 support.
  
    --without-lcms
      disable lcms (v1.1X) support

    --without-lcms2
      disable lcms (v2.X) support
  
    --without-lzma
      disable LZMA support.

    --without-png
      disable PNG support.
  
    --without-tiff
      disable TIFF support.
  
    --without-wmf
      disable WMF support.
  
    --with-fontpath
      prepend to default font search path.
  
    --with-gs-font-dir
      directory containing Ghostscript fonts.
  
      Specify the directory containing the Ghostscript Postscript Type 1 font
      files (e.g. n022003l.pfb) so that they can be rendered using the FreeType
      library. If the font files are installed using the default Ghostscript
      installation paths (${prefix}/share/ghostscript/fonts), they should
      be discovered automagically by configure and specifying this option is
      not necessary. Specify this option if the Ghostscript fonts fail to be
      located automagically, or the location needs to be overridden.
  
    --with-windows-font-dir
      directory containing MS-Windows fonts.
  
      Specify the directory containing MS-Windows-compatible fonts. This not
      necessary when ImageMagick is running under MS-Windows.
  
    --without-xml
      disable XML support.
  
    --without-zlib
      disable ZLIB support.
  
    --without-x
      don't use the X Window System.
  
      By default, ImageMagick uses the X11 delegate libraries if they are
      available. When --without-x is specified, use of X11 is disabled. The
      display, animate, and import sub-commands are not included. The remaining
      sub-commands have reduced functionality such as no access to X11 fonts
      (consider using Postscript or TrueType fonts instead).
  
    --with-share-path=DIR
      Alternate path to share directory (default share/ImageMagick).
  
    --with-libstdc=DIR
      use libstdc++ in DIR (for GNU C++).
  
  While configure is designed to ease installation of ImageMagick, it often
  discovers problems that would otherwise be encountered later when compiling
  ImageMagick. The configure script tests for headers and libraries by
  executing the compiler (CC) with the specified compilation flags (CFLAGS),
  pre-processor flags (CPPFLAGS), and linker flags (LDFLAGS). Any errors are
  logged to the file config.log. If configure fails to discover a header or
  library please review this log file to determine why, however, please be
  aware that *errors in the config.log are normal* because configure works by
  trying something and seeing if it fails. An error in config.log is only a
  problem if the test should have passed on your system.
  
  Common causes of configure failures are: 1) a delegate header is not in the
  header include path (CPPFLAGS -I option); 2) a delegate library is not in
  the linker search/run path (LDFLAGS -L/-R option); 3) a delegate library is
  missing a function (old version?); or 4) compilation environment is faulty.
  
  If all reasonable corrective actions have been tried and the problem appears
  be due to a flaw in the configure script, please send a bug report to the
  ImageMagick Defect Support Forum. All bug reports should contain the operating
  system type (as reported by uname -a) and the compiler/compiler-version. A
  copy of the configure script output and/or the relevant portion of config.log
  file may be valuable in order to find the problem. If you post portions
  of config.log, please also send a script of the configure output and a
  description of what you expected to see (and why) so the failure you are
  observing can be identified and resolved.
  
  ImageMagick is now configured and ready to build
  
Build
  
  Once ImageMagick is configured, these standard build targets are available
  from the generated make files:
  
    make
      build ImageMagick.
  
    sudo make install
      install ImageMagick.
  
    make check
      Run tests using the installed ImageMagick (sudo make install must be
      done first). Ghostscript is a prerequisite, otherwise the EPS, PS,
      and PDF tests will fail.
  
    make clean
      Remove everything in the build directory created by make.
  
    make distclean
      remove everything in the build directory created by configure and
      make. This useful if you want to start over from scratch.
  
    make uninstall
      Remove all files from the system which are (or would be) installed by sudo
      make install using the current configuration. Note that this target is
      imperfect for PerlMagick since Perl no longer supports an uninstall
      target.
  
  In most cases you will simply want to compile ImageMagick with this command:
  
    $ make
  
  Once built, you can optionally install ImageMagick on your system as
  discussed below.
  
Install
  
  Now that ImageMagick is configured and built, type:
  
    $ make install
  
  to install it.
  
  By default, ImageMagick is installs binaries in /../usr/local/bin, libraries
  in /../usr/local/lib, header files in /../usr/local/include and documentation
  in /../usr/local/share. You can specify an alternative installation prefix
  other than /../usr/local by giving configure the option --prefix=PATH. This
  valuable in case you don't have privileges to install under the default
  paths or if you want to install in the system directories instead.
  
  To confirm your installation of the ImageMagick distribution was successful,
  ensure that the installation directory is in your executable search path
  and type:
  
    $ display
  
  The ImageMagick logo is displayed on your X11 display.
  
  To verify the ImageMagick build configuration, type:
  
    $ identify -list configure
  
  To list which image formats are supported , type:
  
    $ identify -list format
  
  For a more comprehensive test, you run the ImageMagick test suite by typing:
  
    $ make check
  
  Ghostscript is a prerequisite, otherwise the EPS, PS, and PDF tests will
  fail. Note that due to differences between the developer's environment and
  your own it is possible that a few tests may fail even though the results are
  ok. Differences between the developer's environment and your own
  may include the compiler, the CPU type, and the library versions used. The
  ImageMagick developers use the current release of all dependent libraries.

Linux-specific Build instructions
  
  Download ImageMagick.src.rpm from ftp.imagemagick.org or its mirrors and
  verify the distribution against its message digest.
  
  Build ImageMagick with this command:
  
    $ rpmbuild --rebuild ImageMagick.src.rpm
  
  After the build you, locate the RPMS folder and install the ImageMagick
  binary RPM distribution:
  
    $ rpm -ivh ImageMagick-7.1.1-?.*.rpm
  
MinGW-specific Build instructions
  
  Although you can download and install delegate libraries yourself, many
  are already available in the GnuWin32 distribution. Download and install
  whichever delegate libraries you require such as JPEG, PNG, TIFF, etc. Make
  sure you specify the development headers when you install a package. Next
  type,
  
    $ tar jxvf ImageMagick-7.1.1-?.tar.bz2
    $ cd ImageMagick-7.1.1
    $ export CPPFLAGS="-Ic:/Progra~1/GnuWin32/include"
    $ export LDFLAGS="-Lc:/Progra~1/GnuWin32/lib"
    $ ./configure --without-perl
    $ make
    $ sudo make install
  
Dealing with Unexpected Problems
  
  Chances are the download, configure, build, and install of ImageMagick went
  flawlessly as it is intended, however, certain systems and environments may
  cause one or more steps to fail. We discuss a few problems we've run across
  and how to take corrective action to ensure you have a working release
  of ImageMagick
  
  Build Problems
  
  If the build complains about missing dependencies (e.g. .deps/source.PLO),
  add --disable-dependency-tracking to your configure command line.
  
  Some systems may fail to link at build time due to unresolved symbols. Try
  adding the LDFLAGS to the configure command line:
  
    $ configure LDFLAGS='-L/usr/local/lib -R/usr/local/lib'
  
  Dynamic Linker Run-time Bindings
  
  On some systems, ImageMagick may not find its shared library, libMagick.so. Try
  running the ldconfig with the library path:
  
    $ /sbin/ldconfig /usr/local/lib
  
  Solaris and Linux systems have the ldd command which is useful to track which
  libraries ImageMagick depends on:
  
    $ ldd `which convert`
  
  Delegate Libraries
  
  On occasion you may receive these warnings:
  
    no decode delegate for this image format
    no encode delegate for this image format
  
  This exception indicates that an external delegate library or its headers
  were not available when ImageMagick was built. To add support for the image
  format, download and install the requisite delegate library and its header
  files and reconfigure, rebuild, and reinstall ImageMagick. As an example,
  lets add support for the JPEG image format. First we install the JPEG RPMS:
  
    $ yum install libjpeg libjpeg-devel
  
  Now reconfigure, rebuild, and reinstall ImageMagick. To verify JPEG is now
  properly supported within ImageMagick, use this command:
  
    $ identify -list format
  
  You should see a mode of rw- associated with the JPEG tag. This mode means
  the image can be read or written and can only support one image per image
  file.
  
PerlMagick
  
  If PerlMagick fails to link with a message similar to libperl.a is not found,
  rerun configure with the --enable-shared or --enable-shared --with-modules
  options.
```

--------------------------------------------------------------------------------

---[FILE: Install-vms.txt]---
Location: ImageMagick-main/Install-vms.txt

```text
VMS COMPILATION

  You might want to check the values of certain program definitions
  before compiling.  Verify the definitions in delegates.xml to suit
  your local requirements.  Next, type.

  Type

      unzip ImageMagick-7.0.0-0.zip
			set default [.imagemagick]
			@make
      set display/create/node=node_name::

  where node_name is the DECNET X server to contact.

  Note : the MAKE.COM files compile everything with /name=(as_is,short).  all
  the requested graphical lib's should be compiled with this qualifier (see
  http://nchrem.tnw.tudelft/openvms for details on additional libraries
  needed).  All the .olb files of the libs are expected to be in SYS$LIBRARY.

  Edit the MAKE.COM in the top directory and [.MAGICK]CONFIG.H_VMS to
  add/remove optional graphical support.

  Finally type:

      display

  Thanks to pmoreau@cenaath.cena.dgac.fr for supplying invaluable help
  as well as the VMS versions of the JPEG, PNG, TTF, and TIFF libraries.

  Thanks to Joukj@hrem.stm.tudelft.{nl} for providing a patches to get
  ImageMagick working under OpenVMS.  See
	http://nchrem.tnw.tudelft.nl/openvms/software2.html#Magick.
```

--------------------------------------------------------------------------------

---[FILE: Install-windows.txt]---
Location: ImageMagick-main/Install-windows.txt

```text
Instructions on how to build ImageMagick on Windows can be found here:
https://github.com/ImageMagick/ImageMagick-Windows
```

--------------------------------------------------------------------------------

---[FILE: LICENSE]---
Location: ImageMagick-main/LICENSE

```text
                         ImageMagick License
             https://imagemagick.org/script/license.php

Before we get to the text of the license, lets just review what the license says in simple terms:

It allows you to:

  * freely download and use ImageMagick software, in whole or in part, for personal, company internal, or commercial purposes;
  * use ImageMagick software in packages or distributions that you create;
  * link against a library under a different license;
  * link code under a different license against a library under this license;
  * merge code into a work under a different license;
  * extend patent grants to any code using code under this license;
  * and extend patent protection.

It forbids you to:

  * redistribute any piece of ImageMagick-originated software without proper attribution;
  * use any marks owned by ImageMagick Studio LLC in any way that might state or imply that ImageMagick Studio LLC endorses your distribution;
  * use any marks owned by ImageMagick Studio LLC in any way that might state or imply that you created the ImageMagick software in question.

It requires you to:

  * include a copy of the license in any redistribution you may make that includes ImageMagick software;
  * provide clear attribution to ImageMagick Studio LLC for any distributions that include ImageMagick software.

It does not require you to:

  * include the source of the ImageMagick software itself, or of any modifications you may have made to it, in any redistribution you may assemble that includes it;
  * submit changes that you make to the software back to the ImageMagick Studio LLC (though such feedback is encouraged).

A few other clarifications include:

  * ImageMagick is freely available without charge;
  * you may include ImageMagick on a DVD as long as you comply with the terms of the license;
  * you can give modified code away for free or sell it under the terms of the ImageMagick license or distribute the result under a different license, but you need to acknowledge the use of the ImageMagick software;
  * the license is compatible with the GPL V3.
  * when exporting the ImageMagick software, review its export classification.

Terms and Conditions for Use, Reproduction, and Distribution

The legally binding and authoritative terms and conditions for use, reproduction, and distribution of ImageMagick follow:

Copyright @ 1999 ImageMagick Studio LLC, a non-profit organization dedicated to making software imaging solutions freely available.

1. Definitions.

License shall mean the terms and conditions for use, reproduction, and distribution as defined by Sections 1 through 9 of this document.

Licensor shall mean the copyright owner or entity authorized by the copyright owner that is granting the License.

Legal Entity shall mean the union of the acting entity and all other entities that control, are controlled by, or are under common control with that entity. For the purposes of this definition, control means (i) the power, direct or indirect, to cause the direction or management of such entity, whether by contract or otherwise, or (ii) ownership of fifty percent (50%) or more of the outstanding shares, or (iii) beneficial ownership of such entity.

You (or Your) shall mean an individual or Legal Entity exercising permissions granted by this License.

Source form shall mean the preferred form for making modifications, including but not limited to software source code, documentation source, and configuration files.

Object form shall mean any form resulting from mechanical transformation or translation of a Source form, including but not limited to compiled object code, generated documentation, and conversions to other media types.

Work shall mean the work of authorship, whether in Source or Object form, made available under the License, as indicated by a copyright notice that is included in or attached to the work (an example is provided in the Appendix below).

Derivative Works shall mean any work, whether in Source or Object form, that is based on (or derived from) the Work and for which the editorial revisions, annotations, elaborations, or other modifications represent, as a whole, an original work of authorship. For the purposes of this License, Derivative Works shall not include works that remain separable from, or merely link (or bind by name) to the interfaces of, the Work and Derivative Works thereof.

Contribution shall mean any work of authorship, including the original version of the Work and any modifications or additions to that Work or Derivative Works thereof, that is intentionally submitted to Licensor for inclusion in the Work by the copyright owner or by an individual or Legal Entity authorized to submit on behalf of the copyright owner. For the purposes of this definition, "submitted" means any form of electronic, verbal, or written communication sent to the Licensor or its representatives, including but not limited to communication on electronic mailing lists, source code control systems, and issue tracking systems that are managed by, or on behalf of, the Licensor for the purpose of discussing and improving the Work, but excluding communication that is conspicuously marked or otherwise designated in writing by the copyright owner as Not a Contribution.

Contributor shall mean Licensor and any individual or Legal Entity on behalf of whom a Contribution has been received by Licensor and subsequently incorporated within the Work.

2. Grant of Copyright License. Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license to reproduce, prepare Derivative Works of, publicly display, publicly perform, sublicense, and distribute the Work and such Derivative Works in Source or Object form.

3. Grant of Patent License. Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable (except as stated in this section) patent license to make, have made, use, offer to sell, sell, import, and otherwise transfer the Work, where such license applies only to those patent claims licensable by such Contributor that are necessarily infringed by their Contribution(s) alone or by combination of their Contribution(s) with the Work to which such Contribution(s) was submitted. If You institute patent litigation against any entity (including a cross-claim or counterclaim in a lawsuit) alleging that the Work or a Contribution incorporated within the Work constitutes direct or contributory patent infringement, then any patent licenses granted to You under this License for that Work shall terminate as of the date such litigation is filed.

4. Redistribution. You may reproduce and distribute copies of the Work or Derivative Works thereof in any medium, with or without modifications, and in Source or Object form, provided that You meet the following conditions:

  * You must give any other recipients of the Work or Derivative Works a copy of this License; and
  * You must cause any modified files to carry prominent notices stating that You changed the files; and
  * You must retain, in the Source form of any Derivative Works that You distribute, all copyright, patent, trademark, and attribution notices from the Source form of the Work, excluding those notices that do not pertain to any part of the Derivative Works; and
  * If the Work includes a "NOTICE" text file as part of its distribution, then any Derivative Works that You distribute must include a readable copy of the attribution notices contained within such NOTICE file, excluding those notices that do not pertain to any part of the Derivative Works, in at least one of the following places: within a NOTICE text file distributed as part of the Derivative Works; within the Source form or documentation, if provided along with the Derivative Works; or, within a display generated by the Derivative Works, if and wherever such third-party notices normally appear. The contents of the NOTICE file are for informational purposes only and do not modify the License. You may add Your own attribution notices within Derivative Works that You distribute, alongside or as an addendum to the NOTICE text from the Work, provided that such additional attribution notices cannot be construed as modifying the License.
You may add Your own copyright statement to Your modifications and may provide additional or different license terms and conditions for use, reproduction, or distribution of Your modifications, or for any such Derivative Works as a whole, provided Your use, reproduction, and distribution of the Work otherwise complies with the conditions stated in this License.

5. Submission of Contributions. Unless You explicitly state otherwise, any Contribution intentionally submitted for inclusion in the Work by You to the Licensor shall be under the terms and conditions of this License, without any additional terms or conditions. Notwithstanding the above, nothing herein shall supersede or modify the terms of any separate license agreement you may have executed with Licensor regarding such Contributions.

6. Trademarks. This License does not grant permission to use the trade names, trademarks, service marks, or product names of the Licensor, except as required for reasonable and customary use in describing the origin of the Work and reproducing the content of the NOTICE file.

7. Disclaimer of Warranty. Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an AS IS BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License.

8. Limitation of Liability. In no event and under no legal theory, whether in tort (including negligence), contract, or otherwise, unless required by applicable law (such as deliberate and grossly negligent acts) or agreed to in writing, shall any Contributor be liable to You for damages, including any direct, indirect, special, incidental, or consequential damages of any character arising as a result of this License or out of the use or inability to use the Work (including but not limited to damages for loss of goodwill, work stoppage, computer failure or malfunction, or any and all other commercial damages or losses), even if such Contributor has been advised of the possibility of such damages.

9. Accepting Warranty or Additional Liability. While redistributing the Work or Derivative Works thereof, You may choose to offer, and charge a fee for, acceptance of support, warranty, indemnity, or other liability obligations and/or rights consistent with this License. However, in accepting such obligations, You may act only on Your own behalf and on Your sole responsibility, not on behalf of any other Contributor, and only if You agree to indemnify, defend, and hold each Contributor harmless for any liability incurred by, or claims asserted against, such Contributor by reason of your accepting any such warranty or additional liability.

How to Apply the License to your Work

To apply the ImageMagick License to your work, attach the following boilerplate notice, with the fields enclosed by brackets "[]" replaced with your own identifying information (don't include the brackets). The text should be enclosed in the appropriate comment syntax for the file format. We also recommend that a file or class name and description of purpose be included on the same "printed page" as the copyright notice for easier identification within third-party archives.

   Copyright [yyyy] [name of copyright owner]

   Licensed under the ImageMagick License (the "License"); you may not use
   this file except in compliance with the License.  You may obtain a copy
   of the License at

     https://imagemagick.org/script/license.php

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
   WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
   License for the specific language governing permissions and limitations
   under the License.
```

--------------------------------------------------------------------------------

---[FILE: magick.sh.in]---
Location: ImageMagick-main/magick.sh.in

```text
#!/bin/sh
#
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
#  Convenience script to verify the ImageMagick build before you install.  For
#  example:
#
#    magick.sh magick -size 640x480 gradient:black-yellow gradient.png

top_srcdir='@abs_top_srcdir@'
top_builddir='@abs_top_builddir@'

MAGICK_CODER_MODULE_PATH='@MAGICK_CODER_MODULE_PATH@'
MAGICK_CONFIGURE_SRC_PATH='@MAGICK_CONFIGURE_SRC_PATH@'
MAGICK_CONFIGURE_BUILD_PATH='@MAGICK_CONFIGURE_BUILD_PATH@'
MAGICK_FILTER_MODULE_PATH='@MAGICK_FILTER_MODULE_PATH@'
DIRSEP=':'

PATH="${top_builddir}/utilities:${PATH}"

if test -n "$VERBOSE"
then
  echo "$@"
fi
env \
  LD_LIBRARY_PATH="${top_builddir}/MagickCore/.libs:${top_builddir}/MagickWand/.libs${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}" \
  MAGICK_CODER_MODULE_PATH="${MAGICK_CODER_MODULE_PATH}" \
  MAGICK_CONFIGURE_PATH="${MAGICK_CONFIGURE_BUILD_PATH}${DIRSEP}${MAGICK_CONFIGURE_SRC_PATH}" \
  MAGICK_FILTER_MODULE_PATH="${MAGICK_FILTER_MODULE_PATH}" \
  PATH="${PATH}" \
  "$@"
```

--------------------------------------------------------------------------------

````

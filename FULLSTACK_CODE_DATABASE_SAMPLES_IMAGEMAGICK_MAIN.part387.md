---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 387
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 387 of 851)

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

---[FILE: Makefile.am]---
Location: ImageMagick-main/PerlMagick/Makefile.am

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
#  Copyright (C) 2003 - 2008 GraphicsMagick Group
#
#  Makefile for building PerlMagick.

# If source files missing, see if they can be obtained via VPATH
#
$(PERLMAGICK)/quantum/@MAGICK_ABI_SUFFIX@.xs: $(PERLMAGICK)/quantum/quantum.xs
	$(AM_V_GEN) $(LN_S) quantum.xs $@

$(PERLMAGICK)/quantum/@MAGICK_ABI_SUFFIX@.pm: $(PERLMAGICK)/quantum/quantum.pm
	$(AM_V_GEN) $(LN_S) quantum.pm $@

perl-quantum-sources: $(PERLMAGICK)/quantum/@MAGICK_ABI_SUFFIX@.xs $(PERLMAGICK)/quantum/@MAGICK_ABI_SUFFIX@.pm

perl-sources: perl-quantum-sources
	@if test -n "$(VPATH)" ; then \
	  echo "Linking PerlMagick Sources ..." ; \
	  imagemagick=`(cd $(VPATH) ; pwd)` && \
	  ( cd $(PERLMAGICK) && \
	    sh $$imagemagick/config/lndir.sh $$imagemagick/$(PERLMAGICK) ; ) \
	fi ; \
	touch perl-sources

if WITH_PERL

PERLMAGICK=PerlMagick
PERLMAKEMAKER=$(PERLMAGICK)/Makefile.PL
PERLMAKEFILE=$(PERLMAGICK)/Makefile

PERLMAGICK_ALL_LOCAL_TARGETS = all-perl
PERLMAGICK_INSTALL_EXEC_LOCAL_TARGETS = install-exec-perl
PERLMAGICK_INSTALL_DATA_LOCAL_TARGETS = 
PERLMAGICK_UNINSTALL_LOCAL_TARGETS = uninstall-exec-perl
PERLMAGICK_CLEAN_LOCAL_TARGETS = clean-perl
PERLMAGICK_DISTCLEAN_LOCAL_TARGETS = clean-perl
PERLMAGICK_MAINTAINER_CLEAN_LOCAL_TARGETS = distclean-local
PERLMAGICK_TESTS = PerlMagick/check.sh

if WITH_PERL_DYNAMIC

PERLMAGICK_CHECKSCRPTS =

$(PERLMAKEFILE): perl-sources $(MAGICKCORE_LIBS) $(MAGICKWAND_LIBS) $(PERLMAKEMAKER)
	cd $(PERLMAGICK) && @PERL@ Makefile.PL $(PERL_MAKE_OPTIONS)

install-exec-perl: $(PERLMAKEFILE)
	( cd $(PERLMAGICK) && $(MAKE) CC='@CC@' && \
	$(MAKE) CC='@CC@' install )

all-perl: perl-sources

uninstall-exec-perl: $(PERLMAKEFILE)
	echo "Uninstall not supported for PerlMagick"

check-perl: $(PERLMAKEFILE)
	cd $(PERLMAGICK) && $(abs_top_builddir)/magick.sh $(MAKE) CC='@CC@' test

perl-build: $(PERLMAKEFILE)
	( cd $(PERLMAGICK) && $(MAKE) CC='@CC@' )

else
if WITH_PERL_STATIC

PERLSTATICNAME=PerlMagick

PERLMAGICK_CHECKSCRPTS = perl-build

$(PERLMAKEFILE): perl-sources $(MAGICKCORE_LIBS) $(MAGICKWAND_LIBS) $(PERLMAKEMAKER)
	cd $(PERLMAGICK) && @PERL@ Makefile.PL MAP_TARGET=$(PERLSTATICNAME) $(PERL_MAKE_OPTIONS) && $(MAKE) Makefile ; $(MAKE) Makefile

$(PERLMAGICK)/$(PERLSTATICNAME): $(MAGICKCORE_LIBS) $(MAGICKWAND_LIBS) $(PERLMAKEFILE)
	( rm -f $(PERLMAGICK)/$(PERLSTATICNAME) ; cd $(PERLMAGICK) && $(MAKE) CC='@CC@' $(PERLSTATICNAME) ; $(MAKE) CC='@CC@' $(PERLSTATICNAME) )

all-perl: $(PERLMAGICK)/$(PERLSTATICNAME)

install-exec-perl: $(PERLMAGICK)/$(PERLSTATICNAME)
	rm -f "$(DESTDIR)$(BIN_DIR)/$(PERLSTATICNAME)"
	if test "x$(DESTDIR)" = "x" -o "$(PERL_SUPPORTS_DESTDIR)" = 'yes' ; then \
	  ( cd $(PERLMAGICK) && \
	    $(MAKE) -f Makefile.aperl CC='@CC@' inst_perl MAP_TARGET=$(PERLSTATICNAME) \
	    INSTALLBIN="$(BIN_DIR)" \
	  ) ; \
	else \
	  ( cd $(PERLMAGICK) && \
	    $(MAKE) -f Makefile.aperl CC='@CC@' inst_perl MAP_TARGET=$(PERLSTATICNAME) \
	    INSTALLBIN="$(DESTDIR)$(BIN_DIR)" PREFIX="$(DESTDIR)$(prefix)" \
	  ) ; \
	fi

uninstall-exec-perl:
	rm -f '$(DESTDIR)$(BIN_DIR)/$(PERLSTATICNAME)'

check-perl: $(PERLMAGICK)/$(PERLSTATICNAME)
	cd $(PERLMAGICK) && $(abs_top_builddir)/magick.sh $(MAKE) -f Makefile.aperl CC='@CC@' test

perl-build: $(PERLMAGICK)/$(PERLSTATICNAME)

endif # WITH_PERL_STATIC
endif # WITH_PERL_DYNAMIC


clean-perl:
	(cd $(PERLMAGICK) && \
	( if test -f Makefile.old ; then $(MAKE) -f Makefile.old CC='@CC@' clean ; fi ) ; \
	( if test -f Makefile ; then $(MAKE) CC='@CC@' clean ; fi ) ; \
	( if test -f Makefile ; then $(MAKE) CC='@CC@' clean ; fi ) ; \
	rm -f Makefile.old PerlMagick ; \
	rm -f t/output* t/jng/*_tmp.jng t/*/output* ; \
	rm -f quantum/@MAGICK_ABI_SUFFIX@.xs;\
	rm -f quantum/@MAGICK_ABI_SUFFIX@.pm;\
	rm -f Magick.pm;)
	rm -f perl-sources

distclean-perl: clean-perl

else
# Satisfy makefile requirements if not building PERL
all-perl:
install-exec-perl:
uninstall-exec-perl:
check-perl:
clean-perl:
distclean-perl:
endif # WITH_PERL
```

--------------------------------------------------------------------------------

---[FILE: Makefile.PL.in]---
Location: ImageMagick-main/PerlMagick/Makefile.PL.in

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
#  Exercise all regression tests:
#
#    make test
#
#  Exercise one regression test:
#
#    make TEST_VERBOSE=1 TEST_FILES=t/filter.t test
#

use ExtUtils::MakeMaker;
use Config;
use File::Spec::Functions qw/catfile catdir devnull catpath splitpath/;
use Cwd;

sub AutodetectWin32gcc {
  my $wrkdir = getcwd();
  my $devnull = devnull();

  my @incdir = ();
  my @libdir = ($wrkdir);
  my @bindir = ();

  #try to get configuration info via magick or identify utilities
  my $conf = `magick identify -list Configure 2>$devnull` || `identify -list Configure 2>$devnull`;
  foreach my $line (split '\n', $conf) {
    if ($line =~ /^Path:\s+(.*)/) {
      my ($vol,$dir,$file) = splitpath($1);
      next unless $dir;
      my $dirpath = catpath( $vol, $dir);
      my (@l,@b,@i) = ( (),(),() );

      # try to detect 'lib' dir
      push @l, catfile($dirpath,'lib');
      push @l, catfile($dirpath,'..','lib');
      push @l, catfile($dirpath,'..','..','lib');
      push @l, catfile($dirpath,'..','..','..','lib');
      foreach (@l) { push @libdir, $_ if (-d $_) };

      # try to detect 'bin' dir
      push @b, catfile($dirpath);
      push @b, catfile($dirpath,'bin');
      push @b, catfile($dirpath,'..');
      push @b, catfile($dirpath,'..','bin');
      push @b, catfile($dirpath,'..','..');
      push @b, catfile($dirpath,'..','..','bin');
      push @b, catfile($dirpath,'..','..','..');
      push @b, catfile($dirpath,'..','..','..','bin');
      foreach (@b) { push @bindir, $_ if (-e "$_/magick.exe" || -e "$_/identify.exe") };

      # try to detect 'include' dir
      push @i, catfile($dirpath,'include');
      push @i, catfile($dirpath,'include','ImageMagick');
      push @i, catfile($dirpath,'..','include');
      push @i, catfile($dirpath,'..','include','ImageMagick');
      push @i, catfile($dirpath,'..','..','include');
      push @i, catfile($dirpath,'..','..','include','ImageMagick');
      push @i, catfile($dirpath,'..','..','..','include');
      push @i, catfile($dirpath,'..','..','..','include','ImageMagick');
      foreach (@i) { push @incdir, $_ if (-e "$_/MagickCore/MagickCore.h") };
    }
  };

  foreach my $bin (@bindir) {
    opendir(my $bindir, $bin) or die qq{Cannot opendir $bin: $!};
    my @dlls = map {catfile($bin, $_)} grep /^\S*magick[^\+]\S*?\.dll$/i, readdir $bindir;
    foreach my $d (@dlls) {
      unlink "$wrkdir/libMagickCore.def", "$wrkdir/libMagickCore.a";
      system("pexports \"$d\" >\"$wrkdir/libMagickCore.def\" 2>$devnull");
      open(DEF, "<$wrkdir/libMagickCore.def");
      my @found = grep(/MagickCoreGenesis/, <DEF>); #checking if we have taken the right DLL
      close(DEF);
      next unless(@found);
      print STDERR "Gonna create 'libMagickCore.a' from '$d'\n";
      system("dlltool -D \"$d\" -d \"$wrkdir/libMagickCore.def\" -l \"$wrkdir/libMagickCore.a\" 2>$devnull");
      last if -s "$wrkdir/libMagickCore.a";
    }
    last if -s "$wrkdir/libMagickCore.a";
  }

  unless(@incdir && @libdir && @bindir && (-s "$wrkdir/libMagickCore.a")) {
    print STDERR <<EOF
################################### WARNING! ###################################
# It seems that you are trying to install Perl::Magick on a MS Windows box with
# perl + gcc compiler (e.g. strawberry perl), however we cannot find ImageMagick
# binaries installed on your system.
#
# Please check the following prerequisites:
#
# 1) You need to have installed ImageMagick Windows binaries from
#    https://imagemagick.org/script/binary-releases.php#windows
#
# 2) We only support dynamic (DLL) ImageMagick binaries
#    note: it is not possible to mix 32/64-bit binaries of perl and ImageMagick
#
# 3) During installation select that you want to install ImageMagick's
#    development files (libraries+headers)
#
# 4) You NEED TO have ImageMagick's directory in your PATH.  We are
#    using the 'magick' tool to determine your actual configuration.
#
# 5) You might need Visual C++ Redistributable Package installed on your system
#    see instructions on ImageMagick's Binary Release webpage
#
# We are gonna continue, but chances for successful build are very low!
################################################################################
EOF
  }

  my $inc = join ' ', map "-I\"$_\"", @incdir;
  my $lib = join ' ', map "-L\"$_\"", @libdir;

  return ($inc, $lib);
}

sub AutodetectDelegates {
  #try to get configuration info via magick or identify utilities
  my $devnull = devnull();
  my $conf = `magick identify -list Configure 2>$devnull` || `identify -list Configure 2>$devnull`;
  my @delegates = ();
  foreach my $line (split '\n', $conf) {
    next unless $line =~ /^DELEGATES\s+/;
    (undef, @delegates) = split /\s+/, $line;
    last;
  };
  return @delegates;
}

# Compute test specification
my $delegate_tests='t/*.t';
my @tested_delegates = qw/bzlib djvu fftw fontconfig freetype jpeg jng openjp2 lcms png rsvg tiff x11 xml wmf zlib/;
my @supported_delegates = AutodetectDelegates();
# find the intersection of tested and supported delegates
my %seen_delegates = ();
$seen_delegates{$_}++ for @supported_delegates;
foreach my $delegate (@tested_delegates) {
  if ( $seen_delegates{$delegate} ) {
    if ( -d "t/$delegate" ) {
      if ( defined($ENV{'DISPLAY'}) && ($^O ne 'MSWin32') ) {
        if ( defined $ENV{'DISPLAY'} ) {
          $delegate_tests .= " t/$delegate/*.t";
        }
        next;
      }
      $delegate_tests .= " t/$delegate/*.t";
    }
  }
}

# defaults for LIBS & INC & CCFLAGS params that we later pass to Writemakefile
my $INC_magick = '-I../ -I@top_srcdir@ @CPPFLAGS@ -I"' . $Config{'usrinc'} . '/ImageMagick"';
my $LIBS_magick = '-L../MagickCore/.libs -lMagickCore-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@ @MATH_LIBS@ -L' . $Config{'archlib'} . '/CORE';
my $CCFLAGS_magick = "$Config{'ccflags'} @CFLAGS@";
my $LDFLAGS_magick   = "-L../MagickCore/.libs -lMagickCore-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@ $Config{'ldflags'} @LDFLAGS@";
my $LDDLFLAGS_magick = "-L../MagickCore/.libs -lMagickCore-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@ $Config{'lddlflags'} @LDFLAGS@";

if (($^O eq 'MSWin32') && ($Config{cc} =~ /gcc/)) {
  my($Ipaths, $Lpaths) = AutodetectWin32gcc();

  #
  # Setup for strawberry perl.
  #
  $INC_magick       = "$Ipaths @CPPFLAGS@";
  $LIBS_magick      = "-lMagickCore-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@";
  $CCFLAGS_magick   = "$Config{'ccflags'}";
  $LDFLAGS_magick   = "$Config{'ldflags'} $Lpaths ";
  $LDDLFLAGS_magick = "$Config{'lddlflags'} $Lpaths ";
}

# See lib/ExtUtils/MakeMaker.pm for details of how to influence
# the contents of the Makefile that is written.
WriteMakefile
  (
   # Module description
   'ABSTRACT'	=> 'ImageMagick PERL Extension',

   # Perl module name is Image::Magick
   'NAME'	=> 'Image::Magick',

   # Module author
   'AUTHOR' => 'ImageMagick Studio LLC',

   # Module version
   'VERSION' => '@PACKAGE_BASE_VERSION@',

   # Prerequisite version
   'PREREQ_PM' => {'parent' => '0'},

   # Preprocessor defines
   'DEFINE'	=> '@LFS_CPPFLAGS@ @DEFS@',     # e.g., '-DHAVE_SOMETHING'

   # Header search specification and preprocessor flags
   'INC'	=> $INC_magick,

   # C compiler
   #'CC' => '@CC@',

   # C pre-processor flags (e.g. -I & -D options)
   # 'CPPFLAGS' => "$Config{'cppflags'} @CPPFLAGS@",

   # C compiler flags (e.g. -O -g)
   'CCFLAGS' => $CCFLAGS_magick,

   # Linker
   #'LD' => $Config{'ld'} == $Config{'cc'} ? '@CC@' : $Config{'ld'},

   # Linker flags for building an executable
   'LDFLAGS' =>  $LDFLAGS_magick,

   # Linker flags for building a dynamically loadable module
   'LDDLFLAGS' => $LDDLFLAGS_magick,

   # Install PerlMagick binary into ImageMagick bin directory
   'INSTALLBIN'	=> '@BIN_DIR@',

   # Library specification
   'LIBS' => [ $LIBS_magick ],

   # Perl binary name (if a Perl binary is built)
   'MAP_TARGET'	=> 'PerlMagick',

   # Let CFLAGS drive optimization flags by setting OPTIMIZE to empty
   # 'OPTIMIZE'	=> '',

   # Use same compiler as ImageMagick
   'PERLMAINCC'	=> '@PERLMAINCC@ @OPENMP_CFLAGS@',
   'AR' => '@AR@',
   'LD' => '@PERLMAINCC@',

   # Set Perl installation prefix to ImageMagick installation prefix
#   'PREFIX'	=> '@prefix@',

   # Include delegate directories in tests
   test	=> { TESTS	=>	$delegate_tests},

   ($Config{'archname'} =~ /-object$/i ? ('CAPI' => 'TRUE') : ()),

   # sane version
   depend => { '$(FIRST_MAKEFILE)' => '$(VERSION_FROM)' }
);


#
# Substitutions for "makeaperl" section.
#
sub MY::makeaperl {
     package MY; # so that "SUPER" works right
     my $inherited = shift->SUPER::makeaperl(@_);

     # Stinky ExtUtils::MM_Unix likes to append its own library path to $(CC),
     # prior to any user-specified library path so that an installed library is
     # used rather than the library just built.  This substitution function
     # tries to insert our library path first. Also, use the same compiler used
     # to build perlmain.c to link so that a C++ compiler may be used if
     # necessary.
     $inherited =~ s:MAP_LINKCMD\s.*\s*\$\(CC\):MAP_LINKCMD   = \$(PERLMAINCC) -L@MAGICKCORE_PATH@: ;
     $inherited;
 }
```

--------------------------------------------------------------------------------

---[FILE: MANIFEST]---
Location: ImageMagick-main/PerlMagick/MANIFEST

```text
Changelog
check.sh
check.sh.in
demo/annotate.pl
demo/button.pl
demo/compose-specials.pl
demo/composite.pl
demo/demo.pl
demo/Generic.ttf
demo/lsys.pl
demo/Makefile
demo/model.gif
demo/piddle.pl
demo/pink-flower.gif
demo/pixel-fx.pl
demo/README
demo/red-flower.gif
demo/shadow-text.pl
demo/shapes.pl
demo/single-pixels.pl
demo/smile.gif
demo/steganography.pl
demo/tile.gif
demo/tree.pl
demo/Turtle.pm
demo/yellow-flower.gif
Makefile.am
Makefile.nt
Makefile.PL.in
MANIFEST
MANIFEST.SKIP
README.txt
t/blob.t
t/bzlib/input.miff
t/bzlib/read.t
t/bzlib/write.t
t/cgm/input.cgm
t/cgm/read.t
t/composite.t
t/filter.t
t/fpx/input_256.fpx
t/fpx/input_bw.fpx
t/fpx/input_grayscale.fpx
t/fpx/input_jpeg.fpx
t/fpx/input_truecolor.fpx
t/fpx/read.t
t/fpx/write.t
t/getattribute.t
t/hdf/input_256.hdf
t/hdf/input_truecolor.hdf
t/hdf/read.t
t/hdf/write.t
t/hpgl/input.hpgl
t/hpgl/read.t
t/input_16.miff
t/input_70x46.cmyk
t/input_70x46.gray
t/input_70x46.rgb
t/input_70x46.rgba
t/input_70x46.uyvy
t/input_70x46.yuv
t/input.avs
t/input.bie
t/input.bmp
t/input.bmp24
t/input.dcx
t/input.dib
t/input.fits
t/input.gif
t/input.gif87
t/input_gray_lsb_08bit.mat
t/input_gray_lsb_double.mat
t/input_gray_msb_08bit.mat
t/input.ico
t/input.im1
t/input.im24
t/input.im8
t/input.mat
t/input.miff
t/input.mtv
t/input_p1.pbm
t/input_p2.pgm
t/input_p3.ppm
t/input_p4.pbm
t/input_p5.pgm
t/input_p6.ppm
t/input.p7
t/input_p7.p7
t/input.pcx
t/input.pict
t/input.psd
t/input_rgb_lsb_08bit.mat
t/input.rle
t/input.sgi
t/input.tga
t/input.tim
t/input.viff
t/input.wbmp
t/input.wpg
t/input.xbm
t/input.xpm
t/jbig/input.jbig
t/jbig/read.t
t/jbig/write.t
t/jng/input_gray_idat.jng
t/jng/input_gray_jdaa.jng
t/jng/input_gray.jng
t/jng/input_gray_prog_idat.jng
t/jng/input_gray_prog_jdaa.jng
t/jng/input_gray_prog.jng
t/jng/input_idat.jng
t/jng/input_jdaa.jng
t/jng/input_prog_idat.jng
t/jng/input_prog_jdaa.jng
t/jng/input_prog.jng
t/jng/input_rose.jng
t/jng/read.t
t/jng/write.t
t/jpeg/input.jpg
t/jpeg/input_plane.jpg
t/jpeg/read.t
t/jpeg/write.t
t/MasterImage_70x46.ppm
t/montage.t
t/mpeg/input.m2v
t/mpeg/input.mpg
t/mpeg/read.t
t/openjp2/input.jp2
t/openjp2/input.jpc
t/openjp2/read.t
t/ping.t
t/png/input_16.png
t/png/input_256.png
t/png/input_bw.png
t/png/input.mng
t/png/input_mono.png
t/png/input_truecolor.png
t/png/read-16.t
t/png/read.t
t/png/write-16.t
t/png/write.t
t/ps/input.eps
t/ps/input.miff
t/ps/input.ps
t/ps/read.t
t/ps/write.t
t/rad/input.rad
t/rad/read.t
t/rad/write.t
t/read.t
t/reference/cgm/read.gif
t/reference/composite/Add.miff
t/reference/composite/Atop.miff
t/reference/composite/Bumpmap.miff
t/reference/composite/Clear.miff
t/reference/composite/CopyAlpha.miff
t/reference/composite/CopyBlue.miff
t/reference/composite/CopyGreen.miff
t/reference/composite/Copy.miff
t/reference/composite/CopyRed.miff
t/reference/composite/Difference.miff
t/reference/composite/In.miff
t/reference/composite/Minus.miff
t/reference/composite/Multiply.miff
t/reference/composite/Out.miff
t/reference/composite/Over.miff
t/reference/composite/Plus.miff
t/reference/composite/Rotate.miff
t/reference/composite/Subtract.miff
t/reference/composite/Xor.miff
t/reference/filter/AdaptiveThreshold.miff
t/reference/filter/Annotate.miff
t/reference/filter/Blur.miff
t/reference/filter/Border.miff
t/reference/filter/Channel.miff
t/reference/filter/Charcoal.miff
t/reference/filter/Chop.miff
t/reference/filter/ColorFloodfill.miff
t/reference/filter/Colorize.miff
t/reference/filter/Contrast.miff
t/reference/filter/Convolve.miff
t/reference/filter/Crop.miff
t/reference/filter/Despeckle.miff
t/reference/filter/Draw.miff
t/reference/filter/Edge.miff
t/reference/filter/Emboss.miff
t/reference/filter/Equalize.miff
t/reference/filter/Flip.miff
t/reference/filter/Flop.miff
t/reference/filter/Frame.miff
t/reference/filter/Gamma.miff
t/reference/filter/GaussianBlur.miff
t/reference/filter/Implode.miff
t/reference/filter/Level.miff
t/reference/filter/Magnify.miff
t/reference/filter/MatteFloodfill.miff
t/reference/filter/MedianFilter.miff
t/reference/filter/Minify.miff
t/reference/filter/Modulate.miff
t/reference/filter/MotionBlur.miff
t/reference/filter/Negate.miff
t/reference/filter/Normalize.miff
t/reference/filter/OilPaint.miff
t/reference/filter/Opaque.miff
t/reference/filter/Quantize.miff
t/reference/filter/QuantizeMono.miff
t/reference/filter/RadialBlur.miff
t/reference/filter/Raise.miff
t/reference/filter/ReduceNoise.miff
t/reference/filter/Resize.miff
t/reference/filter/Roll.miff
t/reference/filter/Rotate.miff
t/reference/filter/Sample.miff
t/reference/filter/Scale.miff
t/reference/filter/Segment.miff
t/reference/filter/Set.miff
t/reference/filter/Shade.miff
t/reference/filter/Sharpen.miff
t/reference/filter/Shave.miff
t/reference/filter/Shear.miff
t/reference/filter/SigmoidalContrast.miff
t/reference/filter/Solarize.miff
t/reference/filter/Swirl.miff
t/reference/filter/Threshold.miff
t/reference/filter/Trim.miff
t/reference/filter/UnsharpMask.miff
t/reference/filter/Wave.miff
t/reference/jng/gray_idat_tmp.miff
t/reference/jng/gray_jdaa_tmp.miff
t/reference/jng/gray_prog_idat_tmp.miff
t/reference/jng/gray_prog_jdaa_tmp.miff
t/reference/jng/gray_prog_tmp.miff
t/reference/jng/gray_tmp.miff
t/reference/jng/idat_tmp.miff
t/reference/jng/input_gray_idat.miff
t/reference/jng/input_gray_jdaa.miff
t/reference/jng/input_gray.miff
t/reference/jng/input_gray_prog_idat.miff
t/reference/jng/input_gray_prog_jdaa.miff
t/reference/jng/input_gray_prog.miff
t/reference/jng/input_idat.miff
t/reference/jng/input_jdaa.miff
t/reference/jng/input_prog_idat.miff
t/reference/jng/input_prog_jdaa.miff
t/reference/jng/input_prog.miff
t/reference/jng/input_rose.miff
t/reference/jng/jdaa_tmp.miff
t/reference/jng/prog_idat_tmp.miff
t/reference/jng/prog_jdaa_tmp.miff
t/reference/jng/prog_tmp.miff
t/reference/jng/read_gray_idat.miff
t/reference/jng/read_gray_jdaa.miff
t/reference/jng/read_gray.miff
t/reference/jng/read_gray_prog_idat.miff
t/reference/jng/read_gray_prog_jdaa.miff
t/reference/jng/read_gray_prog.miff
t/reference/jng/read_idat.miff
t/reference/jng/read_jdaa.miff
t/reference/jng/read_prog_idat.miff
t/reference/jng/read_prog_jdaa.miff
t/reference/jng/read_prog.miff
t/reference/jng/write_gray_idat.miff
t/reference/jng/write_gray_jdaa.miff
t/reference/jng/write_gray.miff
t/reference/jng/write_gray_prog_idat.miff
t/reference/jng/write_gray_prog_jdaa.miff
t/reference/jng/write_gray_prog.miff
t/reference/jng/write_idat.miff
t/reference/jng/write_jdaa.miff
t/reference/jng/write_prog_idat.miff
t/reference/jng/write_prog_jdaa.miff
t/reference/jng/write_prog.miff
t/reference/jpeg/read_non_interlaced.miff
t/reference/jpeg/read_plane_interlaced.miff
t/reference/jpeg/write_non_interlaced.miff
t/reference/jpeg/write_plane_interlaced.miff
t/reference/read/gradient.miff
t/reference/read/granite.miff
t/reference/read/input_avs.miff
t/reference/read/input_bmp24.miff
t/reference/read/input_bmp.miff
t/reference/read/input_cmyk.miff
t/reference/read/input_dcx.miff
t/reference/read/input_dib.miff
t/reference/read/input_fits.miff
t/reference/read/input_gif87.miff
t/reference/read/input_gif.miff
t/reference/read/input_gray_lsb_08bit_mat.miff
t/reference/read/input_gray_lsb_double_mat.miff
t/reference/read/input_gray.miff
t/reference/read/input_gray_msb_08bit_mat.miff
t/reference/read/input_ico.miff
t/reference/read/input_im1.miff
t/reference/read/input_im24.miff
t/reference/read/input_im8.miff
t/reference/read/input_mat.miff
t/reference/read/input_miff.miff
t/reference/read/input_mtv.miff
t/reference/read/input_null_black.miff
t/reference/read/input_null_DarkOrange.miff
t/reference/read/input_null_white.miff
t/reference/read/input_p7.miff
t/reference/read/input_pbm_p1.miff
t/reference/read/input_pbm_p4.miff
t/reference/read/input_pcx.miff
t/reference/read/input_pgm_p2.miff
t/reference/read/input_pgm_p5.miff
t/reference/read/input_pict.miff
t/reference/read/input_ppm_p3.miff
t/reference/read/input_ppm_p6.miff
t/reference/read/input_psd.miff
t/reference/read/input_rgba.miff
t/reference/read/input_rgb_lsb_08bit_mat.miff
t/reference/read/input_rgb.miff
t/reference/read/input_rle.miff
t/reference/read/input_sgi.miff
t/reference/read/input_tga.miff
t/reference/read/input_tile.miff
t/reference/read/input_tim.miff
t/reference/read/input_uyvy.miff
t/reference/read/input_viff.miff
t/reference/read/input_wbmp.miff
t/reference/read/input_wpg.miff
t/reference/read/input_xbm.miff
t/reference/read/input_xc_black.miff
t/reference/read/input_xpm.miff
t/reference/read/input_xwd.miff
t/reference/ttf/annotate.miff
t/reference/ttf/label.miff
t/reference/ttf/read.miff
t/reference/wmf/clock.gif
t/reference/wmf/wizard.gif
t/reference/write/cgm/read.miff
t/reference/write/composite/Add.miff
t/reference/write/composite/Atop.miff
t/reference/write/composite/Bumpmap.miff
t/reference/write/composite/Clear.miff
t/reference/write/composite/CopyAlpha.miff
t/reference/write/composite/CopyBlue.miff
t/reference/write/composite/CopyGreen.miff
t/reference/write/composite/Copy.miff
t/reference/write/composite/CopyRed.miff
t/reference/write/composite/Difference.miff
t/reference/write/composite/In.miff
t/reference/write/composite/Minus.miff
t/reference/write/composite/Multiply.miff
t/reference/write/composite/Out.miff
t/reference/write/composite/Over.miff
t/reference/write/composite/Plus.miff
t/reference/write/composite/Rotate.miff
t/reference/write/composite/Subtract.miff
t/reference/write/composite/Xor.miff
t/reference/write/filter/AdaptiveThreshold.miff
t/reference/write/filter/Annotate.miff
t/reference/write/filter/Blur.miff
t/reference/write/filter/Border.miff
t/reference/write/filter/Channel.miff
t/reference/write/filter/Charcoal.miff
t/reference/write/filter/Chop.miff
t/reference/write/filter/ColorFloodfill.miff
t/reference/write/filter/Colorize.miff
t/reference/write/filter/Contrast.miff
t/reference/write/filter/Convolve.miff
t/reference/write/filter/Crop.miff
t/reference/write/filter/Despeckle.miff
t/reference/write/filter/Draw.miff
t/reference/write/filter/Edge.miff
t/reference/write/filter/Emboss.miff
t/reference/write/filter/Equalize.miff
t/reference/write/filter/Flip.miff
t/reference/write/filter/Flop.miff
t/reference/write/filter/Frame.miff
t/reference/write/filter/Gamma.miff
t/reference/write/filter/GaussianBlur.miff
t/reference/write/filter/Implode.miff
t/reference/write/filter/Level.miff
t/reference/write/filter/Magnify.miff
t/reference/write/filter/MatteFloodfill.miff
t/reference/write/filter/MedianFilter.miff
t/reference/write/filter/Minify.miff
t/reference/write/filter/Modulate.miff
t/reference/write/filter/MotionBlur.miff
t/reference/write/filter/Negate.miff
t/reference/write/filter/Normalize.miff
t/reference/write/filter/OilPaint.miff
t/reference/write/filter/Opaque.miff
t/reference/write/filter/Quantize.miff
t/reference/write/filter/RadialBlur.miff
t/reference/write/filter/Raise.miff
t/reference/write/filter/ReduceNoise.miff
t/reference/write/filter/Resize.miff
t/reference/write/filter/Roll.miff
t/reference/write/filter/Rotate.miff
t/reference/write/filter/Sample.miff
t/reference/write/filter/Scale.miff
t/reference/write/filter/Segment.miff
t/reference/write/filter/Set.miff
t/reference/write/filter/Shade.miff
t/reference/write/filter/Sharpen.miff
t/reference/write/filter/Shave.miff
t/reference/write/filter/Shear.miff
t/reference/write/filter/SigmoidalContrast.miff
t/reference/write/filter/Solarize.miff
t/reference/write/filter/Swirl.miff
t/reference/write/filter/Threshold.miff
t/reference/write/filter/Trim.miff
t/reference/write/filter/UnsharpMask.miff
t/reference/write/filter/Wave.miff
t/reference/write/jng/gray_idat_tmp.miff
t/reference/write/jng/gray_jdaa_tmp.miff
t/reference/write/jng/gray_prog_idat_tmp.miff
t/reference/write/jng/gray_prog_jdaa_tmp.miff
t/reference/write/jng/gray_prog_tmp.miff
t/reference/write/jng/gray_tmp.miff
t/reference/write/jng/idat_tmp.miff
t/reference/write/jng/input_gray_idat.miff
t/reference/write/jng/input_gray_jdaa.miff
t/reference/write/jng/input_gray.miff
t/reference/write/jng/input_gray_prog_idat.miff
t/reference/write/jng/input_gray_prog_jdaa.miff
t/reference/write/jng/input_gray_prog.miff
t/reference/write/jng/input_idat.miff
t/reference/write/jng/input_jdaa.miff
t/reference/write/jng/input_prog_idat.miff
t/reference/write/jng/input_prog_jdaa.miff
t/reference/write/jng/input_prog.miff
t/reference/write/jng/input_rose.miff
t/reference/write/jng/jdaa_tmp.miff
t/reference/write/jng/prog_idat_tmp.miff
t/reference/write/jng/prog_jdaa_tmp.miff
t/reference/write/jng/prog_tmp.miff
t/reference/write/jng/read_gray_idat.miff
t/reference/write/jng/read_gray_jdaa.miff
t/reference/write/jng/read_gray.miff
t/reference/write/jng/read_gray_prog_idat.miff
t/reference/write/jng/read_gray_prog_jdaa.miff
t/reference/write/jng/read_gray_prog.miff
t/reference/write/jng/read_idat.miff
t/reference/write/jng/read_jdaa.miff
t/reference/write/jng/read_prog_idat.miff
t/reference/write/jng/read_prog_jdaa.miff
t/reference/write/jng/read_prog.miff
t/reference/write/jng/write_gray_idat.miff
t/reference/write/jng/write_gray_jdaa.miff
t/reference/write/jng/write_gray.miff
t/reference/write/jng/write_gray_prog_idat.miff
t/reference/write/jng/write_gray_prog_jdaa.miff
t/reference/write/jng/write_gray_prog.miff
t/reference/write/jng/write_idat.miff
t/reference/write/jng/write_jdaa.miff
t/reference/write/jng/write_prog_idat.miff
t/reference/write/jng/write_prog_jdaa.miff
t/reference/write/jng/write_prog.miff
t/reference/write/jpeg/read_non_interlaced.miff
t/reference/write/jpeg/read_plane_interlaced.miff
t/reference/write/jpeg/write_non_interlaced.miff
t/reference/write/jpeg/write_plane_interlaced.miff
t/reference/write/read/gradient.miff
t/reference/write/read/granite.miff
t/reference/write/read/input_avs.miff
t/reference/write/read/input_bmp24.miff
t/reference/write/read/input_bmp.miff
t/reference/write/read/input_cmyk.miff
t/reference/write/read/input_dcx.miff
t/reference/write/read/input_dib.miff
t/reference/write/read/input_fits.miff
t/reference/write/read/input_gif87.miff
t/reference/write/read/input_gif.miff
t/reference/write/read/input_gray.miff
t/reference/write/read/input_ico.miff
t/reference/write/read/input_im1.miff
t/reference/write/read/input_im24.miff
t/reference/write/read/input_im8.miff
t/reference/write/read/input_mat.miff
t/reference/write/read/input_miff.miff
t/reference/write/read/input_mtv.miff
t/reference/write/read/input_null_black.miff
t/reference/write/read/input_null_DarkOrange.miff
t/reference/write/read/input_null_white.miff
t/reference/write/read/input_p7.miff
t/reference/write/read/input_pbm_p1.miff
t/reference/write/read/input_pbm_p4.miff
t/reference/write/read/input_pcx.miff
t/reference/write/read/input_pgm_p2.miff
t/reference/write/read/input_pgm_p5.miff
t/reference/write/read/input_pict.miff
t/reference/write/read/input_ppm_p3.miff
t/reference/write/read/input_ppm_p6.miff
t/reference/write/read/input_psd.miff
t/reference/write/read/input_rgba.miff
t/reference/write/read/input_rgb.miff
t/reference/write/read/input_rle.miff
t/reference/write/read/input_sgi.miff
t/reference/write/read/input_tga.miff
t/reference/write/read/input_tile.miff
t/reference/write/read/input_tim.miff
t/reference/write/read/input_uyvy.miff
t/reference/write/read/input_viff.miff
t/reference/write/read/input_wbmp.miff
t/reference/write/read/input_wpg.miff
t/reference/write/read/input_xbm.miff
t/reference/write/read/input_xc_black.miff
t/reference/write/read/input_xpm.miff
t/reference/write/read/input_xwd.miff
t/reference/write/ttf/annotate.miff
t/reference/write/ttf/label.miff
t/reference/write/ttf/read.miff
t/reference/write/wmf/clock.miff
t/reference/write/wmf/wizard.miff
t/setattribute.t
t/subroutines.pl
t/tiff/input_16_matte.tiff
t/tiff/input_16.tiff
t/tiff/input_256_matte.tiff
t/tiff/input_256_planar_contig.tiff
t/tiff/input_256_planar_separate.tiff
t/tiff/input_256.tiff
t/tiff/input_gray_12bit.tiff
t/tiff/input_gray_16bit.tiff
t/tiff/input_gray_4bit_matte.tiff
t/tiff/input_gray_4bit.tiff
t/tiff/input_gray_8bit_matte.tiff
t/tiff/input_gray_8bit.tiff
t/tiff/input_mono.tiff
t/tiff/input_truecolor_16.tiff
t/tiff/input_truecolor_stripped.tiff
t/tiff/input_truecolor.tiff
t/tiff/input_truecolor_tiled32x32.tiff
t/tiff/read.t
t/tiff/write.t
t/ttf/input.ttf
t/ttf/read.t
t/wmf/clock.wmf
t/wmf/read.t
t/wmf/wizard.wmf
t/write.t
t/x11/congrats.fig
t/x11/congrats.gif
t/x11/input.xwd
t/x11/read.t
t/x11/write.t
t/xfig/input.fig
t/xfig/read.t
t/zlib/input.miff
t/zlib/read.t
t/zlib/write.t
```

--------------------------------------------------------------------------------

---[FILE: MANIFEST.SKIP]---
Location: ImageMagick-main/PerlMagick/MANIFEST.SKIP

```text
.*\.gdbinit$
.*core$
/output.*$
/test_.+_out\..+$
Magick\.bs$
Magick\.c$
Magick\.o$
\.bak$
\.svn$
\.old$
^MANIFEST\.
^MakeMaker-\d
^Makefile$
^blib/
^pm_to_blib$
~$
```

--------------------------------------------------------------------------------

---[FILE: README.txt]---
Location: ImageMagick-main/PerlMagick/README.txt

```text
Introduction 

    PerlMagick, is an objected-oriented Perl interface to ImageMagick.
    Use the module to read, manipulate, or write an image or image sequence
    from within a Perl script. This makes it suitable for Web CGI scripts. You
    must have ImageMagick 7.0.0 or above installed on your system for this
    module to work properly.

    See

        https://imagemagick.org/script/perl-magick.php

    for additional information about PerlMagick.  If you have problems, go to

        https://github.com/ImageMagick/ImageMagick/discussions

    for help.  For instructions about installing ImageMagick, see

        https://imagemagick.org/


Installation 

    Get the PerlMagick distribution and type the following: 

        gunzip ImageMagick-7.1.2-0.tar.gz
        tar xvf ImageMagick-7.1.2

    Follow the ImageMagick installation instructions in INSTALL-unix.txt
		then type

      cd PerlMagick

    Next, edit Makefile.PL and change LIBS and INC to include the appropriate
    path information to the required libMagick library. You will also need
    library search paths (-L) to JPEG, PNG, TIFF, etc. libraries if they were
    included with your installed version of ImageMagick. If an extension
    library is built as a shared library but not installed in the system's
    default library search path, you may need to add run-path information
    (often -R or -rpath) corresponding to the equivalent library search
    path option so that the library can be located at run-time.

    To create and install the dynamically-loaded version of PerlMagick
    (the preferred way), execute
        
        perl Makefile.PL
        make
        make install

    To create and install a new 'perl' executable (replacing your existing
    PERL interpreter!) with PerlMagick statically linked (but other libraries
    linked statically or dynamically according to system linker default),
    execute

        perl Makefile.PL
        make perl
        make -f Makefile.aperl inst_perl
	
    or to create and install a new PERL interpreter with a different name
    than 'perl' (e.g. 'PerlMagick') and with PerlMagick statically linked

        perl Makefile.PL MAP_TARGET=PerlMagick
        make PerlMagick
        make -f Makefile.aperl inst_perl

    See the ExtUtils::MakeMaker(3) manual page for more information on
    building PERL extensions (like PerlMagick).

    For Windows systems, type

        perl Makefile.nt
        nmake install

    For Unix, you typically need to be root to install the software.
    There are ways around this.  Consult the Perl manual pages for more
    information. You are now ready to utilize the PerlMagick routines from
    within your Perl scripts.

Installation - Win32 Strawberry perl

   On Win32 Strawberry perl the prefered way of installing PerlMagick is the
   following:

   1) Download and install ImageMagick Windows binaries from
      https://imagemagick.org/script/binary-releases.php#windows

   2) You HAVE TO choose dynamic (DLL) ImageMagick binaries.  Note: it is not
      possible to mix 32/64bit binaries of perl and ImageMagick

   3) During installation select that you want to install ImageMagick's
      development files (libraries+headers)

   4) You also need to have ImageMagick's directory in your PATH. We are
      using the 'magick' tool to determine your actual configuration.

   5) You might need Visual C++ Redistributable Package installed on your
      system.  See instructions on ImageMagick's Binary Release webpage.

   6) If you have all prerequisites 1)...5) you can simply install
      ImageMagick by running: cpan -i Image::Magick


Testing PerlMagick

    Before PerlMagick is installed, you may want to execute
    
        make test

    to verify that PERL can load the PerlMagick extension ok.  Chances are
    some of the tests will fail if you do not have the proper delegates
    installed for formats like JPEG, TIFF, etc.

    Use the 'prove' utility to execute a test from the build folder:

        prove --blib blib -I `pwd` -bv ./t/read.t

    To see a number of PerlMagick demonstration scripts, type
    
        cd demo
        make


Example Perl Magick Script 

    Here is an example script to get you started: 

        #!/usr/bin/perl
        use Image::Magick;

        $q = Image::Magick->new;
        $x = $q->Read("model.gif", "logo.gif", "rose.gif");
        warn "$x" if $x;

        $x = $q->Crop(geom=>'100x100+100+100');
        warn "$x" if $x;

        $x = $q->Write("x.gif");
        warn "$x" if $x;

    The script reads three images, crops them, and writes a single image
    as a GIF animation sequence.
```

--------------------------------------------------------------------------------

---[FILE: typemap]---
Location: ImageMagick-main/PerlMagick/typemap

```text
Image::Magick T_PTROBJ
```

--------------------------------------------------------------------------------

---[FILE: Magick.pm.in]---
Location: ImageMagick-main/PerlMagick/default/Magick.pm.in

```text
package Image::Magick;

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
#  Initial version, written by Kyle Shorter.

use strict;
use Carp;

use parent qw/Image::Magick::@MAGICK_ABI_SUFFIX@/;

1;
__END__

=head1 NAME

Image::Magick - objected-oriented Perl interface to ImageMagick for default quantum (@MAGICK_ABI_SUFFIX@). Use it to read, manipulate, or write an image or image sequence from within a Perl script.

=head1 SYNOPSIS

  use Image::Magick;
  $p = new Image::Magick;
  $p->Read("imagefile");
  $p->Set(attribute => value, ...)
  ($a, ...) = $p->Get("attribute", ...)
  $p->routine(parameter => value, ...)
  $p->Mogrify("Routine", parameter => value, ...)
  $p->Write("filename");

=head1 DESCRIPTION

This Perl extension allows the reading, manipulation and writing of
a large number of image file formats using the ImageMagick library.
It was originally developed to be used by CGI scripts for Web pages.

A web page has been set up for this extension. See:

	 file://@DOCUMENTATION_PATH@/www/perl-magick.html
	 https://imagemagick.org/script/perl-magick.php

If you have problems, go to

   https://imagemagick.org/discourse-server/viewforum.php?f=7

=head1 AUTHOR

Kyle Shorter	magick-users@imagemagick.org

=head1 BUGS

Has all the bugs of ImageMagick and much, much more!

=head1 SEE ALSO

perl(1).

=cut
```

--------------------------------------------------------------------------------

````

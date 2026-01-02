---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 388
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 388 of 851)

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

---[FILE: Makefile.PL.in]---
Location: ImageMagick-main/PerlMagick/default/Makefile.PL.in

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

  #try to get configuration info via identify or convert utilities
  my $conf = `identify -list Configure 2>$devnull` || `convert -list Configure 2>$devnull`;
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
      foreach (@b) { push @bindir, $_ if (-e "$_/convert.exe" || -e "$_/identify.exe") };

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
# 4) You also need to have ImageMagick's directory in your PATH
#    note: we are checking the presence of convert.exe and/or identify.exe tools
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
  #try to get configuration info via identify or convert utilities
  my $devnull = devnull();
  my $conf = `identify -list Configure 2>$devnull` || `convert -list Configure 2>$devnull`;
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
my @tested_delegates = qw/bzlib djvu fftw fontconfig freetype jpeg jng jp2 lcms png rsvg tiff x11 xml wmf zlib/;
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
my $INC_magick = '-I../.. -I@top_srcdir@ @CPPFLAGS@ -I"' . $Config{'usrinc'} . '/ImageMagick"';
my $LIBS_magick = '-L../../MagickCore/.libs -lMagickCore-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@ @MATH_LIBS@ -L' . $Config{'archlib'} . '/CORE';
my $CCFLAGS_magick = "$Config{'ccflags'} @CFLAGS@";
my $LDFLAGS_magick   = "-L../../magick/.libs -lMagickCore-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@ $Config{'ldflags'} @LDFLAGS@";
my $LDDLFLAGS_magick = "-L../../magick/.libs -lMagickCore-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@ $Config{'lddlflags'} @LDFLAGS@";

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

---[FILE: annotate.pl]---
Location: ImageMagick-main/PerlMagick/demo/annotate.pl

```text
#!/usr/bin/perl

use Image::Magick;

$image = Image::Magick->new();
$x = 100;
$y = 100;
for ($angle=0; $angle < 360; $angle+=30)
{
  my ($label);

  print "angle $angle\n";
  $label=Image::Magick->new(size=>"600x600",pointsize=>24);
  $label->Read("xc:white");
  $label->Draw(primitive=>'line',points=>"300,100 300,500",stroke=>'#600');
  $label->Draw(primitive=>'line',points=>"100,300 500,300",stroke=>'#600');
  $label->Draw(primitive=>'rectangle',points=>"100,100 500,500",fill=>'none',
    stroke=>'#600');
  $label->Annotate(font=>'Generic.ttf',text=>"North West",gravity=>"NorthWest",
    x=>$x,y=>$y,undercolor=>'yellow',rotate=>$angle);
  $label->Annotate(font=>'Generic.ttf',text=>"North",gravity=>"North",
    y=>$y,rotate=>$angle);
  $label->Annotate(font=>'Generic.ttf',text=>"North East",gravity=>"NorthEast",
    x=>$x,y=>$y,rotate=>$angle);
  $label->Annotate(font=>'Generic.ttf',text=>"West",gravity=>"West",
    x=>$x,rotate=>$angle);
  $label->Annotate(font=>'Generic.ttf',text=>"Center",gravity=>"Center",
    rotate=>$angle);
  $label->Annotate(font=>'Generic.ttf',text=>"East",gravity=>"East",
    x=>$x,rotate=>$angle);
  $label->Annotate(font=>'Generic.ttf',text=>"South West",gravity=>"SouthWest",
    x=>$x,y=>$y,rotate=>$angle);
  $label->Annotate(font=>'Generic.ttf',text=>"South",gravity=>"South",
    y=>$y,rotate=>$angle);
  $label->Annotate(font=>'Generic.ttf',text=>"South East",gravity=>"SouthEast",
    x=>$x,y=>$y,rotate=>$angle);
  push(@$image,$label);
}
$image->Set(delay=>20);
$image->Write("annotate.pam");
$image->Animate(title=>"Rotating Text");
```

--------------------------------------------------------------------------------

---[FILE: annotate_words.pl]---
Location: ImageMagick-main/PerlMagick/demo/annotate_words.pl

```text
#!/usr/bin/perl
#
# annotate_words.pl
#
# Take the internal string, split it into words and try to annotate each
# individual word correctly, so as to control spacing between the words
# under program control.
#
# A demonstration of using QueryFontMetrics(), by passing it exactly the same
# arguments as you would for Annotate(), to determine the location of the
# text that is/was drawn.
#
# Example script from   Zentara
#    http://zentara.net/Remember_How_Lucky_You_Are.html
#
use warnings;
use strict;
use Image::Magick;

my $image = Image::Magick->new;
$image->Set(size=>'500x200');
my $rc = $image->Read("xc:white");

my $str = 'Just Another Perl Hacker';
my (@words) = split ' ',$str;
#print join "\n",@words,"\n";

my ($x,$y) = (50,50);

foreach my $word (@words){

  $image->Annotate(font=>'Generic.ttf',
         pointsize => 24,
         fill      => '#000000ff', #last 2 digits transparency in hex ff=max
         text      => $word,
         gravity   => 'NorthWest',
         align     => 'left',
         x         => $x,
         y         => $y,
    );

  my ( $character_width,$character_height,$ascender,$descender,$text_width,
      $text_height,$maximum_horizontal_advance, $boundsx1, $boundsy1,
      $boundsx2, $boundsy2,$originx,$originy) =
          $image->QueryFontMetrics(
             pointsize => 24,
             text      => $word,
             gravity   => 'NorthWest',
             align     => 'left',
             x         => $x,
             y         => $y,
           );

  print "$word ( $character_width, $character_height,
         $ascender,$descender,
         $text_width, $text_height,
         $maximum_horizontal_advance,
         $boundsx1, $boundsy1,
         $boundsx2, $boundsy2,
         $originx,$originy)\n";

  my $n = $x + $originx + $character_width/3;  # add a space
  print "Next word at: $x + $originx + $character_width/3 => $n\n";
  $x = $n;

}

$image->Write(magick=>'SHOW',title=>"Annotate Words");
```

--------------------------------------------------------------------------------

---[FILE: button.pl]---
Location: ImageMagick-main/PerlMagick/demo/button.pl

```text
#!/usr/bin/perl
#
# Make simple beveled button.
#
use Image::Magick;

$q=Image::Magick->new;
$q->Set(size=>'30x106');
$q->Read('gradient:#00f685-#0083f8');
$q->Rotate(-90);
$q->Raise('6x6');
$q->Annotate(font=>'Generic.ttf',text=>'Push Me',fill=>'black',
  gravity=>'Center',pointsize=>18);
$q->Write('button.pam');
$q->Write(magick=>'SHOW',title=>"Button");
```

--------------------------------------------------------------------------------

---[FILE: compose-specials.pl]---
Location: ImageMagick-main/PerlMagick/demo/compose-specials.pl

```text
#!/usr/bin/perl
#
# Demonstration of some of the fancier Image Composition Methods
# including the 'rotate' parameter specific to PerlMagick Composite()
#
# NOTE: versions of IM older than IM v6.5.3-4 will need to rename the
# parameter  "args=>"   to  the mis-named "blend=>" parameter.
#
# Also not that "composite -watermark" is actually known as the compose
# method "Modulate".
#
# Essentially each image is equivalent to
#   convert logo: -crop 80x80+140+60 +repage \
#           -size 60x60 gradient:black-white \
#           -alpha set miff:- |\
#    composite -  -geometry +10+10 -virtual-pixel gray \
#              -dissolve 70x30   show:
# for various composition methods.
#
use strict;
use Image::Magick;

# Background or Destination image
my $dest=Image::Magick->new();
$dest->Read('logo:');
$dest->Crop('100x100+400+100');  # wizards hat
$dest->Set(page=>'0x0+0+0');
$dest->Set(alpha=>'Set');

# Source, Composite or Overlay image
my $src=Image::Magick->new();
$src->Set(size=>'80x80');
$src->Read('gradient:black-white');
$src->Set(alpha=>'Set');

my $offset="+10+10";

# Circle Mask Image (same size as Destination)
my $circle=Image::Magick->new();
$circle->Set(size=>'80x80');
$circle->Read('xc:black');
$circle->Draw(fill=>'white',primitive=>'circle',points=>'39.5,39.5 10,39.5');

my $texture=Image::Magick->new();
$texture->Read('pattern:checkerboard');

# List of images generated
my $results=Image::Magick->new();

# Working copy of Destination Image
my $clone;

# ----------------------------------------
# Normal Composition Methods

$clone=$dest->Clone();
$clone->Label('Over\n(normal compose)');
$clone->Composite(
  image=>$src,
  compose=>'over',
  geometry=>$offset,
);
push(@$results, $clone);

$clone=$dest->Clone();
$clone->Label('Multiply\n(add black)');
$clone->Composite(
  image=>$src,
  compose=>'multiply',
  geometry=>$offset,
);
push(@$results, $clone);

$clone=$dest->Clone();
$clone->Label('Screen\n(add white)');
$clone->Composite(
  image=>$src,
  compose=>'screen',
  geometry=>$offset,
);
push(@$results, $clone);

$clone=$dest->Clone();
$clone->Label('HardLight\n(light effects)');
$clone->Composite(
  image=>$src,
  compose=>'hardlight',
  geometry=>$offset,
);
push(@$results, $clone);

# ---------------
# Masked and Blending Demonstration

$clone=$dest->Clone();
$clone->Label('Circle Masked\n(three image)');
$clone->Composite(
  image=>$src,
  mask=>$circle,
  compose=>'over',
  geometry=>$offset,
);
push(@$results, $clone);

$clone=$dest->Clone();
$clone->Label('Blend 50x50\n(50% plus 50%)');
$clone->Composite(
  image=>$src,
  compose=>'blend',
  args=>'50x50',
  geometry=>$offset,
);
push(@$results, $clone);

$clone=$dest->Clone();
$clone->Label('Dissolve 50x50\n(50% over 50%)');
$clone->Composite(
  image=>$src,
  compose=>'dissolve',
  args=>'50x50',
  geometry=>$offset,
);
push(@$results, $clone);

$clone=$dest->Clone();
$clone->Label('Dissolve 50\n(50% over 100%)');
$clone->Composite(
  image=>$src,
  compose=>'dissolve',
  args=>'50',
  geometry=>$offset,
);
push(@$results, $clone);

# ---------------
# Displacement Demonstration

$clone=$dest->Clone();
$clone->Label('Displace 50x0\n(displace horiz)');
$clone->Set('virtual-pixel'=>'gray');
$clone->Composite(
  image=>$src,
  compose=>'displace',
  args=>'50x0',
  geometry=>$offset,
);
push(@$results, $clone);

$clone=$dest->Clone();
$clone->Label('Displace 0x50\n(compress vert)');
$clone->Set('virtual-pixel'=>'gray');
$clone->Composite(
  image=>$src,
  compose=>'displace',
  args=>'0x50',
  geometry=>$offset,
);
push(@$results, $clone);

$clone=$dest->Clone();
$clone->Label('Displace 50x50\n(diagonal)');
$clone->Set('virtual-pixel'=>'gray');
$clone->Composite(
  image=>$src,
  compose=>'displace',
  args=>'50x50',
  geometry=>$offset,
);
push(@$results, $clone);

$clone=$dest->Clone();
$clone->Label('Displace 0,-80\n(displace flip)');
$clone->Set('virtual-pixel'=>'gray');
$clone->Composite(
  image=>$src,
  compose=>'displace',
  args=>'0,-80',
  geometry=>$offset,
);
push(@$results, $clone);

# ---------------
# Demonstrate rotation
# note that offset is automatically adjusted to keep rotated image
# centered relative to its '0' rotation position

$clone=$dest->Clone();
$clone->Label('Rotate 0\n');
$clone->Composite(
  image=>$src,
  compose=>'over',
  rotate=>0,
  background=>'none',
  geometry=>$offset,
);
push(@$results, $clone);

$clone=$dest->Clone();
$clone->Label('Rotate 10\n');
$clone->Composite(
  image=>$src,
  compose=>'over',
  rotate=>10,
  background=>'none',
  geometry=>$offset,
);
push(@$results, $clone);

$clone=$dest->Clone();
$clone->Label('Rotate 45\n');
$clone->Composite(
  image=>$src,
  compose=>'over',
  rotate=>45,
  background=>'none',
  geometry=>$offset,
);
push(@$results, $clone);

$clone=$dest->Clone();
$clone->Label('Rotate 90\n');
$clone->Composite(
  image=>$src,
  compose=>'over',
  rotate=>90,
  background=>'none',
  geometry=>$offset,
);
push(@$results, $clone);

# ----------------------------------------
# Output the changed pixels

# to every image underlay a checkerboard pattern
# so as to show if any transparency is present
for my $image ( @$results ) {
  $image->Composite(
    image=>$texture,
    tile=>'True',
    compose=>'DstOver',
  );
}

my $montage=$results->Montage(font=>'Generic.ttf',
  geometry=>'+10+10',
  tile=>'4x',
  frame=>'6x6+2+2',
  shadow=>'True',
);
$montage->Write('compose-specials.pam');
$montage->Write(magick=>'SHOW',title=>"Compose");
```

--------------------------------------------------------------------------------

---[FILE: composite.pl]---
Location: ImageMagick-main/PerlMagick/demo/composite.pl

```text
#!/usr/bin/perl

use Image::Magick;

$image = Image::Magick->new();
$smile = Image::Magick->new();
$smile->Read('smile.gif');
$smile->Set(background=>'none');
$x = 100;
$y = 100;
for ($angle=0; $angle < 360; $angle+=30)
{
  my ($thumbnail);

  print "angle $angle\n";
  $thumbnail=Image::Magick->new(size=>"600x600",pointsize=>24,fill=>'black');
  $thumbnail->Read("xc:white");
  $thumbnail->Draw(primitive=>'line',points=>"300,100 300,500",stroke=>'#600');
  $thumbnail->Draw(primitive=>'line',points=>"100,300 500,300",stroke=>'#600');
  $thumbnail->Draw(primitive=>'rectangle',points=>"100,100 500,500",
    fill=>'none',stroke=>'#600');
  $thumbnail->Composite(image=>$smile,gravity=>"NorthWest",x=>$x,y=>$y,
    rotate=>$angle);
  $thumbnail->Composite(image=>$smile,gravity=>"North",y=>$y,rotate=>$angle);
  $thumbnail->Composite(image=>$smile,gravity=>"NorthEast",x=>$x,y=>$y,
    rotate=>$angle);
  $thumbnail->Composite(image=>$smile,gravity=>"West",x=>$x,rotate=>$angle);
  $thumbnail->Composite(image=>$smile,gravity=>"Center",rotate=>$angle);
  $thumbnail->Composite(image=>$smile,gravity=>"East",x=>$x,rotate=>$angle);
  $thumbnail->Composite(image=>$smile,gravity=>"SouthWest",x=>$x,y=>$y,
    rotate=>$angle);
  $thumbnail->Composite(image=>$smile,gravity=>"South",y=>$y,rotate=>$angle);
  $thumbnail->Composite(image=>$smile,gravity=>"SouthEast",x=>$x,y=>$y,
    rotate=>$angle);
  push(@$image,$thumbnail);
}
$image->Set(delay=>20);
$image->Write("composite.pam");
$image->Animate(title=>"Rotating Smiles");
```

--------------------------------------------------------------------------------

---[FILE: demo.pl]---
Location: ImageMagick-main/PerlMagick/demo/demo.pl

```text
#!/usr/bin/perl
#
# Overall demo of the major PerlMagick methods.
#
use Image::Magick;

#
# Read model & smile image.
#
print "Read...\n";
$null=Image::Magick->new;
$null->Set(size=>'70x70');
$x=$null->ReadImage('NULL:black');
warn "$x" if "$x";

$model=Image::Magick->new();
$x=$model->ReadImage('model.gif');
warn "$x" if "$x";
$model->Label('Magick');
$model->Set(background=>'white');

$smile=Image::Magick->new;
$x=$smile->ReadImage('smile.gif');
warn "$x" if "$x";
$smile->Label('Smile');
$smile->Set(background=>'white');
#
# Create image stack.
#
print "Transform image...\n";
$images=Image::Magick->new();

print "Adaptive Blur...\n";
$example=$model->Clone();
$example->Label('Adaptive Blur');
$example->AdaptiveBlur('0x1');
push(@$images,$example);

print "Adaptive Resize...\n";
$example=$model->Clone();
$example->Label('Adaptive Resize');
$example->AdaptiveResize('60%');
push(@$images,$example);

print "Adaptive Sharpen...\n";
$example=$model->Clone();
$example->Label('Adaptive Sharpen');
$example->AdaptiveSharpen('0x1');
push(@$images,$example);

print "Adaptive Threshold...\n";
$example=$model->Clone();
$example->Label('Adaptive Threshold');
$example->AdaptiveThreshold('5x5+5%');
push(@$images,$example);

print "Add Noise...\n";
$example=$model->Clone();
$example->Label('Add Noise');
$example->AddNoise("Laplacian");
push(@$images,$example);

print "Annotate...\n";
$example=$model->Clone();
$example->Label('Annotate');
$example->Annotate(font=>'Generic.ttf',text=>'Magick',geometry=>'+0+20',
  fill=>'gold',gravity=>'North',pointsize=>14);
push(@$images,$example);

print "Auto-gamma...\n";
$example=$model->Clone();
$example->Label('Auto Gamma');
$example->AutoGamma();
push(@$images,$example);

print "Auto-level...\n";
$example=$model->Clone();
$example->Label('Auto Level');
$example->AutoLevel();
push(@$images,$example);

print "Auto-threshold...\n";
$example=$model->Clone();
$example->Label('Auto Threshold');
$example->AutoThreshold();
push(@$images,$example);

print "Blur...\n";
$example=$model->Clone();
$example->Label('Blur');
$example->Blur('0.0x1.0');
push(@$images,$example);

print "Border...\n";
$example=$model->Clone();
$example->Label('Border');
$example->Border(geometry=>'6x6',color=>'gold');
push(@$images,$example);

print "Channel...\n";
$example=$model->Clone();
$example->Label('Channel');
$example->Channel(channel=>'red');
push(@$images,$example);

print "Charcoal...\n";
$example=$model->Clone();
$example->Label('Charcoal');
$example->Charcoal('2x1');
push(@$images,$example);

print "ColorMatrix...\n";
$example=$model->Clone();
$example->Label('ColorMatrix');
$example->ColorMatrix([1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0.5, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
push(@$images,$example);

print "Colorspace...\n";
$example=$model->Clone();
$example->Label('Colorspace');
$example->Colorspace('Lab');
push(@$images,$example);

print "Composite...\n";
$example=$model->Clone();
$example->Label('Composite');
$example->Composite(image=>$smile,compose=>'over',geometry=>'+35+65');
$example->Clamp();
push(@$images,$example);

print "Contrast...\n";
$example=$model->Clone();
$example->Label('Contrast');
$example->Contrast();
push(@$images,$example);

print "Contrast Stretch...\n";
$example=$model->Clone();
$example->Label('Contrast Stretch');
$example->ContrastStretch('5%');
push(@$images,$example);

print "Convolve...\n";
$example=$model->Clone();
$example->Label('Convolve');
$example->Convolve([0.125, 0.125, 0.125, 0.125, 0.5, 0.125, 0.125, 0.125, 0.125]);
push(@$images,$example);

print "Crop...\n";
$example=$model->Clone();
$example->Label('Crop');
$example->Crop(geometry=>'80x80+25+50');
$example->Set(page=>'0x0+0+0');
push(@$images,$example);

print "Despeckle...\n";
$example=$model->Clone();
$example->Label('Despeckle');
$example->Despeckle();
push(@$images,$example);

print "Distort...\n";
$example=$model->Clone();
$example->Label('Distort');
$example->Distort(method=>'arc',points=>[60],'virtual-pixel'=>'white');
push(@$images,$example);

print "Draw...\n";
$example=$model->Clone();
$example->Label('Draw');
$example->Draw(fill=>'none',stroke=>'gold',primitive=>'circle',
  points=>'60,90 60,120',strokewidth=>2);
push(@$images,$example);

print "Detect Edges...\n";
$example=$model->Clone();
$example->Label('Detect Edges');
$example->Edge('2x0.5');
$example->Clamp();
push(@$images,$example);

print "Emboss...\n";
$example=$model->Clone();
$example->Label('Emboss');
$example->Emboss('0x1');
push(@$images,$example);

print "Encipher...\n";
$example=$model->Clone();
$example->Label('Encipher');
$example->Encipher('Magick');
push(@$images,$example);

print "Equalize...\n";
$example=$model->Clone();
$example->Label('Equalize');
$example->Equalize();
push(@$images,$example);

print "Explode...\n";
$example=$model->Clone();
$example->Label('Explode');
$example->Implode(-1);
push(@$images,$example);

print "Flip...\n";
$example=$model->Clone();
$example->Label('Flip');
$example->Flip();
push(@$images,$example);

print "Flop...\n";
$example=$model->Clone();
$example->Label('Flop');
$example->Flop();
push(@$images,$example);

print "Frame...\n";
$example=$model->Clone();
$example->Label('Frame');
$example->Frame('15x15+3+3');
push(@$images,$example);

print "Fx...\n";
$example=$model->Clone();
$example->Label('Fx');
push(@$images,$example->Fx(expression=>'0.5*u'));

print "Gamma...\n";
$example=$model->Clone();
$example->Label('Gamma');
$example->Gamma(1.6);
push(@$images,$example);

print "Gaussian Blur...\n";
$example=$model->Clone();
$example->Label('Gaussian Blur');
$example->GaussianBlur('0.0x1.5');
push(@$images,$example);

print "Gradient...\n";
$gradient=Image::Magick->new;
$gradient->Set(size=>'130x194');
$x=$gradient->ReadImage('gradient:#20a0ff-#ffff00');
warn "$x" if "$x";
$gradient->Label('Gradient');
push(@$images,$gradient);

print "Grayscale...\n";
$example=$model->Clone();
$example->Label('Grayscale');
$example->Set(type=>'grayscale');
push(@$images,$example);

print "Implode...\n";
$example=$model->Clone();
$example->Label('Implode');
$example->Implode(0.5);
push(@$images,$example);

print "Kuwahara...\n";
$example=$model->Clone();
$example->Label('Kuwahara');
$example->Kuwahara('0x1');
push(@$images,$example);

print "Level...\n";
$example=$model->Clone();
$example->Label('Level');
$example->Level('20%x');
$example->Clamp();
push(@$images,$example);

print "Linear stretch...\n";
$example=$model->Clone();
$example->Label('Linear Stretch');
$example->LinearStretch('5x5');
push(@$images,$example);

print "Median Filter...\n";
$example=$model->Clone();
$example->Label('Median Filter');
$example->MedianFilter('4x4');
push(@$images,$example);

print "Mode...\n";
$example=$model->Clone();
$example->Label('Mode');
$example->Mode('4x4');
push(@$images,$example);

print "Modulate...\n";
$example=$model->Clone();
$example->Label('Modulate');
$example->Modulate(brightness=>110,saturation=>110,hue=>110);
push(@$images,$example);
$example=$model->Clone();

print "Monochrome...\n";
$example=$model->Clone();
$example->Label('Monochrome');
$example->Quantize(colorspace=>'gray',colors=>2,dither=>'false');
push(@$images,$example);

print "Morphology...\n";
$example=$model->Clone();
$example->Label('Morphology');
$example->Morphology(method=>'Dilate',kernel=>'Diamond',iterations=>2);
push(@$images,$example);

print "Motion Blur...\n";
$example=$model->Clone();
$example->Label('Motion Blur');
$example->MotionBlur('0x13+10-10');
push(@$images,$example);

print "Negate...\n";
$example=$model->Clone();
$example->Label('Negate');
$example->Negate();
push(@$images,$example);

print "Normalize...\n";
$example=$model->Clone();
$example->Label('Normalize');
$example->Normalize();
push(@$images,$example);

print "Oil Paint...\n";
$example=$model->Clone();
$example->Label('Oil Paint');
$example->OilPaint('2x0.5');
push(@$images,$example);

print "Plasma...\n";
$plasma=Image::Magick->new;
$plasma->Set(size=>'130x194');
$x=$plasma->ReadImage('plasma:fractal');
warn "$x" if "$x";
$plasma->Label('Plasma');
push(@$images,$plasma);

print "Polaroid...\n";
$example=$model->Clone();
$example->Label('Polaroid');
$example->Polaroid(caption=>'Magick',angle=>-5.0,gravity=>'center');
push(@$images,$example);

print "Posterize...\n";
$example=$model->Clone();
$example->Label('Posterize');
$example->Posterize(5);
push(@$images,$example);

print "Quantize...\n";
$example=$model->Clone();
$example->Label('Quantize');
$example->Quantize();
push(@$images,$example);

print "Rotational Blur...\n";
$example=$model->Clone();
$example->Label('Rotational Blur');
$example->RotationalBlur(10);
push(@$images,$example);

print "Raise...\n";
$example=$model->Clone();
$example->Label('Raise');
$example->Raise('10x10');
push(@$images,$example);

print "Reduce Noise...\n";
$example=$model->Clone();
$example->Label('Reduce Noise');
$example->ReduceNoise('2x2');
push(@$images,$example);

print "Resize...\n";
$example=$model->Clone();
$example->Label('Resize');
$example->Resize('60%');
push(@$images,$example);

print "Roll...\n";
$example=$model->Clone();
$example->Label('Roll');
$example->Roll(geometry=>'+20+10');
push(@$images,$example);

print "Rotate...\n";
$example=$model->Clone();
$example->Label('Rotate');
$example->Rotate(45);
push(@$images,$example);

print "Sample...\n";
$example=$model->Clone();
$example->Label('Sample');
$example->Sample('60%');
push(@$images,$example);

print "Scale...\n";
$example=$model->Clone();
$example->Label('Scale');
$example->Scale('60%');
push(@$images,$example);

print "Segment...\n";
$example=$model->Clone();
$example->Label('Segment');
$example->Segment();
push(@$images,$example);

print "Shade...\n";
$example=$model->Clone();
$example->Label('Shade');
$example->Shade(geometry=>'30x30',gray=>'true');
push(@$images,$example);

print "Sharpen...\n";
$example=$model->Clone();
$example->Label('Sharpen');
$example->Sharpen('0.0x1.0');
$example->Clamp();
push(@$images,$example);

print "Shave...\n";
$example=$model->Clone();
$example->Label('Shave');
$example->Shave('10x10');
push(@$images,$example);

print "Shear...\n";
$example=$model->Clone();
$example->Label('Shear');
$example->Shear('-20x20');
push(@$images,$example);

print "Sketch...\n";
$example=$model->Clone();
$example->Label('Sketch');
$example->Set(colorspace=>'Gray');
$example->Sketch('0x20+120');
push(@$images,$example);

print "Sigmoidal Contrast...\n";
$example=$model->Clone();
$example->Label('Sigmoidal Contrast');
$example->SigmoidalContrast("3x50%");
push(@$images,$example);

print "Spread...\n";
$example=$model->Clone();
$example->Label('Spread');
$example->Spread();
push(@$images,$example);

print "Solarize...\n";
$example=$model->Clone();
$example->Label('Solarize');
$example->Solarize();
push(@$images,$example);

print "Swirl...\n";
$example=$model->Clone();
$example->Label('Swirl');
$example->Swirl(90);
push(@$images,$example);

print "Tint...\n";
$example=$model->Clone();
$example->Label('Tint');
$example->Tint('wheat');
push(@$images,$example);

print "Unsharp Mask...\n";
$example=$model->Clone();
$example->Label('Unsharp Mask');
$example->UnsharpMask('0.0x1.0');
$example->Clamp();
push(@$images,$example);

print "Vignette...\n";
$example=$model->Clone();
$example->Label('Vignette');
$example->Vignette('0x20');
push(@$images,$example);

print "Wave...\n";
$example=$model->Clone();
$example->Label('Wave');
$example->Wave('25x150');
push(@$images,$example);

print "WaveletDenoise...\n";
$example=$model->Clone();
$example->Label('Wavelet Denoise');
$example->WaveletDenoise('5%');
push(@$images,$example);

#
# Create image montage.
#
print "Montage...\n";
$montage=$images->Montage(font=>'Generic.ttf',geometry=>'140x160+8+4>',
  gravity=>'Center',tile=>'5x+10+200',compose=>'over',background=>'#ffffff',
  pointsize=>18,fill=>'#600',stroke=>'none',shadow=>'true');

$logo=Image::Magick->new();
$logo->Read('logo:');
$logo->Zoom('40%');
$montage->Composite(image=>$logo,gravity=>'North');

print "Write...\n";
$montage->Write('demo.pam');
print "Display...\n";
$montage->Write(magick=>'SHOW',title=>"PerlMagick Demo");
```

--------------------------------------------------------------------------------

---[FILE: lsys.pl]---
Location: ImageMagick-main/PerlMagick/demo/lsys.pl

```text
#!/usr/bin/perl

# Written by jreed@itis.com, adapted by Cristy.

use Image::Magick;
use Turtle;

sub flower
{
  my $flower = shift;
  my ($width, $height) = $flower->Get('width', 'height');
  my ($x, $y) = $turtle->state();
  my ($geometry);

  $geometry = '+' . int($x-$width/2) . '+' . int($y-$height/2);
  $im->Composite(image=>$flower, compose=>'over', geometry=>$geometry);
}

sub lsys_init
{
  my ($imagesize) = @_;
  
  %translate =
  (
    'S' => sub{ # Step forward
                $turtle->forward($changes->{"distance"},
                $changes->{"motionsub"});
              },
    '-' => sub{ $turtle->turn(-$changes->{"dtheta"}); },  # counter-clockwise
    '+' => sub{ $turtle->turn($changes->{"dtheta"}); },  # Turn clockwise
    'M' => sub{ $turtle->mirror(); },  # Mirror
    '[' => sub{ push(@statestack, [$turtle->state()]); },  # Begin branch
    ']' => sub{ $turtle->setstate(@{pop(@statestack)}); },  # End branch
    '{' => sub{ @poly = (); $changes=\%polychanges; },  # Begin polygon
    '}' => sub{ # End polygon
                $im->Draw (primitive=>'Polygon', points=>join(' ',@poly),
                           fill=>'light green');
                $changes = \%stemchanges;
              },
    'f' => sub{ flower($pink_flower); },  # Flower
    'g' => sub{ flower($red_flower); },  # Flower
    'h' => sub{ flower($yellow_flower); }  # Flower
  );

  # Create the main image
  $im = new Image::Magick;
  $im->Set(size=>$imagesize . 'x' . $imagesize);
  $im->Read('xc:white');
  
  # Create the flower images
  $pink_flower = new Image::Magick;
  $pink_flower->Read('pink-flower.gif');
  
  $red_flower = new Image::Magick;
  $red_flower->Read('red-flower.gif');
  
  $yellow_flower = new Image::Magick;
  $yellow_flower->Read('yellow-flower.gif');
  
  # Turtle:  the midpoint of the bottom edge of the image, pointing up.
  $turtle=new Turtle($imagesize/2, $imagesize, 0, 1);
}

sub lsys_execute
{
  my ($string, $repetitions, $filename, %rule) = @_;

  my ($command);

  # Apply the %rule to $string, $repetitions times.
  for (1..$repetitions)
  {
    $string =~ s/./defined ($rule{$&}) ? $rule{$&} : $&/eg;
  }
  foreach $command (split(//, $string))
  {
    if ($translate{$command}) { &{$translate{$command}}(); }
  }
  $im->Write($filename);
  $im->Write(magick=>'SHOW',title=>"L-system");
}

1;
```

--------------------------------------------------------------------------------

---[FILE: Makefile]---
Location: ImageMagick-main/PerlMagick/demo/Makefile

```text
all:
	perl demo.pl
	perl button.pl
	perl shapes.pl
	perl piddle.pl
	perl tree.pl
	perl steganography.pl
	perl shadow-text.pl
	perl compose-specials.pl
	perl pixel-fx.pl
	perl single-pixels.pl
	perl annotate.pl
	perl composite.pl

clean:
	/bin/rm -f demo.pam button.pam model.pam shadow.pam tree.pam \
	    compose-specials.pam  single-pixels.pam  pixel-fx.pam
```

--------------------------------------------------------------------------------

---[FILE: piddle.pl]---
Location: ImageMagick-main/PerlMagick/demo/piddle.pl

```text
#!/usr/bin/perl
# Piddle example using PerlMagick methods.

use Image::Magick;

#
# Create white canvas.
#
$image=Image::Magick->new(size=>'300x300');
$image->Read('xc:white');
#
# Draw blue grid
#
for ($i=0; $i < 300; $i+=10)
{
  $image->Draw(primitive=>'line',points=>"$i,0 $i,300",stroke=>"#ccf");
  $image->Draw(primitive=>'line',points=>"0,$i 300,$i",stroke=>"#ccf");
}
#
# Draw rounded rectangle.
#
$image->Draw(primitive=>'RoundRectangle',fill=>'blue',stroke=>'maroon',
  strokewidth=>4,points=>'30,30 100,100 10,10');
#
# Draw curve.
#
$image->Draw(primitive=>'bezier',points=>'20,20, 100,50, 50,100, 160,160',
  fill=>'none',stroke=>'black',strokewidth=>4);
#
# Draw line.
#
$image->Draw(primitive=>'line',points=>"10,200 20,190",stroke=>red);
#
# Draw arc within a circle.
#
$image->Draw(primitive=>'circle',stroke=>'none',fill=>'yellow',,
  points=>"170,70 200,70");
$image->Draw(primitive=>'Path',stroke=>'none',fill=>'blue',strokewidth=>4,
  points=>'M170,70 v-30 a30,30 0 0,0 -30,30 z');
$image->Draw(primitive=>'circle',stroke=>'black',fill=>'none',strokewidth=>4,
  points=>"170,70 200,70");
#
# Draw pentagram.
#
$image->Draw(primitive=>'polygon',
  points=>"160,120 130,190 210,145 110,145 190,190 160,120",stroke=>red,
  fill=>LimeGreen,strokewidth=>3);
#
# Draw rectangle.
#
$image->Draw(primitive=>'line',points=>'200,260 200,200',stroke=>yellow,
  strokewidth=>5);
$image->Draw(primitive=>'line',points=>'200,200 260,200',stroke=>yellow,
  strokewidth=>5);
$image->Draw(primitive=>'line',points=>'260,200 260,260',stroke=>red,
  strokewidth=>5);
$image->Draw(primitive=>'line',points=>'200,260 260,260',stroke=>green,
  strokewidth=>5);
#
# Draw text.
#
$image->Annotate(font=>'Generic.ttf',text=>'This is a test!',
  geometry=>'+30+140',fill=>'green',pointsize=>24,rotate=>45.0);
$image->Write('piddle.pam');
$image->Write('piddle.mvg');
$image->Write(magick=>'SHOW',title=>"Piddle");
```

--------------------------------------------------------------------------------

````

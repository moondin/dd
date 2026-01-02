---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 389
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 389 of 851)

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

---[FILE: pixel-fx.pl]---
Location: ImageMagick-main/PerlMagick/demo/pixel-fx.pl

```text
#!/usr/bin/perl
#
# Example of modifying all the pixels in an image (like -fx).
#
# Currently this is slow as each pixel is being looked up one pixel at a time.
# The better technique of extracting and modifying a whole row of pixels at
# a time has not been figured out, though perl functions have been provided
# for this.
#
# Also access and controls for Area Re-sampling (EWA), beyond single pixel
# lookup (interpolated unscaled lookup), is also not available at this time.
#
# Anthony Thyssen   5 October 2007
#
use strict;
use Image::Magick;

# read original image
my $orig = Image::Magick->new();
my $w = $orig->Read('rose:');
warn("$w")  if $w;
exit  if $w =~ /^Exception/;


# make a clone of the image (preserve input, modify output)
my $dest = $orig->Clone();

# You could enlarge destination image here if you like.
# And it is possible to modify the existing image directly
# rather than modifying a clone as FX does.

# Iterate over destination image...
my ($width, $height) = $dest->Get('width', 'height');

for( my $j = 0; $j < $height; $j++ ) {
  for( my $i = 0; $i < $width; $i++ ) {

    # read original image color
    my @pixel = $orig->GetPixel( x=>$i, y=>$j );

    # modify the pixel values (as normalized floats)
    $pixel[0] = $pixel[0]/2;      # darken red

    # write pixel to destination
    # (quantization and clipping happens here)
    $dest->SetPixel(x=>$i,y=>$j,color=>\@pixel);
  }
}

# display the result (or you could save it)
$dest->Write('pixel-fx.pam');
$dest->Write(magick=>'SHOW',title=>"Pixel FX");
```

--------------------------------------------------------------------------------

---[FILE: README]---
Location: ImageMagick-main/PerlMagick/demo/README

```text
This directory contains a number of PerlMagick demonstration scripts.  Just
type

  make

to exercise the various examples.
```

--------------------------------------------------------------------------------

---[FILE: settings.pl]---
Location: ImageMagick-main/PerlMagick/demo/settings.pl

```text
#!/usr/bin/perl
#
# An example of applying many settings in preparation for image creation.
#
# Extracted from PerlMagick Discussion forums..
# Gravity center, caption and wrapped text
#   https://imagemagick.org/discourse-server/viewtopic.php?f=7&t=17282
#
use strict;
use warnings;
use Image::Magick;

my $im = new Image::Magick;
my $e = $im->Set(
        background => 'none',
        fill => 'white',
        stroke => 'black',
        strokewidth => 2,
        Gravity => 'East',
        pointsize => 48,
        size => '200x300',
);
die $e if $e;

$e = $im->Read("caption:Lorem ipsum etc etc");
die $e if $e;

$e = $im->Trim();
die $e if $e;

$e = $im->Write('settings.pam');
die $e if $e;
```

--------------------------------------------------------------------------------

---[FILE: shadow-text.pl]---
Location: ImageMagick-main/PerlMagick/demo/shadow-text.pl

```text
#!/usr/bin/perl
#
# Make simple text with a shadow.
#
use Image::Magick;

$image=Image::Magick->new(size=>'525x125');
$image->Read('xc:white');
$image->Annotate(font=>'Generic.ttf',fill=>'rgba(100,100,100,0.8)',
  pointsize=>60,text=>'Works like magick!',geometry=>'+8+90');
$image->Blur('0x1');
$image->Annotate(font=>'Generic.ttf',fill=>'red',stroke=>'blue',pointsize=>60,
  text=>'Works like magick!',geometry=>'+4+86');
$image->Write('shadow.pam');
$image->Write(magick=>'SHOW',title=>"Shadow Text");
```

--------------------------------------------------------------------------------

---[FILE: shapes.pl]---
Location: ImageMagick-main/PerlMagick/demo/shapes.pl

```text
#!/usr/bin/perl
# GD example using PerlMagick methods.

use Image::Magick;

#
# Create a 300x300 white canvas.
#
$image=Image::Magick->new;
$image->Set(size=>'300x300');
$image->Read('xc:white');
#
# Draw shapes.
#
$tile=Image::Magick->new;
$tile->Read('tile.gif');
$image->Draw(primitive=>'Polygon',tile=>$tile,fill=>'none',
  points=>'30,30 100,10 190,290 30,290');
$image->Draw(stroke=>'red',primitive=>'Ellipse',stroke=>'black',fill=>'red',
  strokewidth=>5,points=>'100,100 50,75 0,360');
$image->Draw(primitive=>'Polygon',fill=>'none',stroke=>'black',strokewidth=>5,
  points=>'30,30 100,10 190,290 30,290');
$image->FloodfillPaint(geometry=>'+132+62',fill=>'blue',bordercolor=>'black',
  invert=>'true');
#
# Draw text.
#
$image->Annotate(font=>'Generic.ttf',fill=>'red',geometry=>'+150+20',
  pointsize=>18,text=>'Hello world!');
$image->Annotate(font=>'Generic.ttf',fill=>'blue',geometry=>'+150+38',
  pointsize=>14,text=>'Goodbye cruel world!');
$image->Annotate(font=>'Generic.ttf',fill=>'black',geometry=>'+280+120',
  pointsize=>14,text=>"I'm climbing the wall!",rotate=>90.0);
#
# Write image.
#
print "Write image...\n";
$image->Write('shapes.pam');
print "Display image...\n";
$image->Write(magick=>'SHOW',title=>"Shapes");
```

--------------------------------------------------------------------------------

---[FILE: single-pixels.pl]---
Location: ImageMagick-main/PerlMagick/demo/single-pixels.pl

```text
#!/usr/bin/perl
#
# Methods for to Get and Set single pixels in images using PerlMagick
#
use strict;
use Image::Magick;

# read image
my $im=Image::Magick->new();
$im->Read('logo:');

# ---

# Get/Set a single pixel as a string
my $skin=$im->Get('pixel[400,200]');
print "Get('pixel[x,y]') = ", $skin, "\n";

$im->Set('pixel[1,1]'=>'0,0,0,0');
$im->Set('pixel[2,1]'=>$skin);
$im->Set('pixel[3,1]'=>'green');
$im->Set('pixel[4,1]'=>'rgb(255,0,255)');

# ---

# More direct single pixel access
my @pixel = $im->GetPixel( x=>400, y=>200 );
print "GetPixel() = ", "@pixel", "\n";

# modify the pixel values (as normalized floats)
$pixel[0] = $pixel[0]/2;      # darken red value
$pixel[1] = 0.0;              # junk green value
$pixel[2] = 0.0;              # junk blue value

# write pixel to destination
# (quantization and clipping happens here)
$im->SetPixel(x=>5,y=>1,color=>\@pixel);

# ---

# crop, scale, display the changed pixels
$im->Crop(geometry=>'7x3+0+0');
$im->Set(page=>'0x0+0+0');
$im->Scale('1000%');

# Output the changed pixels
$im->Write('single-pixels.pam');
$im->Write(magick=>'SHOW',title=>"Single Pixel");
```

--------------------------------------------------------------------------------

---[FILE: steganography.pl]---
Location: ImageMagick-main/PerlMagick/demo/steganography.pl

```text
#!/usr/bin/perl

use Image::Magick;

#
# Hide an image within an image
#
$watermark=Image::Magick->new;
$watermark->ReadImage('smile.gif');
($width, $height)=$watermark->Get('width','height');
#
# Hide image in image.
#
$image=Image::Magick->new;
$image->ReadImage('model.gif');
$image->SteganoImage(image=>$watermark,offset=>91);
$image->Write('model.pam');
$image->Write(magick=>'SHOW',title=>"Steganography Model");
#
# Extract image from image.
#
$size="$width" . "x" . "$height" . "+91";
$stegano=Image::Magick->new(size=>$size);
$stegano->ReadImage('stegano:model.pam');
$stegano->Write('stegano.pam');
$stegano->Write(magick=>'SHOW',title=>"Hidden Image");
```

--------------------------------------------------------------------------------

---[FILE: tree.pl]---
Location: ImageMagick-main/PerlMagick/demo/tree.pl

```text
#!/usr/bin/perl
#
# Example of using a lsys fractal,
# which in turm used Turtle Graphics
#
use Cwd;
use lib cwd;
require "lsys.pl";

%rule = (
	  'A' => 'S[---LMA][++++B]',
          'B' => 'S[++LBg][--Cg]',
          'C' => 'S[-----LB]GS[+MC]',
          'g' => '',
          'L' => '[{S+S+S+S+S+S}]'
        );

%stemchanges = (
  distance => 18.5,
  dtheta => 0.1,
  motionsub => sub{
                    $im->Draw ( primitive=>'line', points=>join(' ',@_),
                                stroke=>'dark green', strokewidth=>1 );
                  }
);

%polychanges = (
  distance => 3,
  dtheta => 0.4,
  motionsub => sub{ push( @poly, @_[0..1] ); }
);

$changes = \%stemchanges;
lsys_init(400);
lsys_execute('A', 10, "tree.pam", %rule);
```

--------------------------------------------------------------------------------

---[FILE: Turtle.pm]---
Location: ImageMagick-main/PerlMagick/demo/Turtle.pm

```text
package
  Turtle;

# Written by jreed@itis.com, adapted by Cristy.

sub new
{
  my $class = shift;
  my $self = {};

  @{$self}{qw(x y theta mirror)} = @_;
  bless $self, $class;
}

sub forward
{
  my $self = shift;
  my ($r, $what) = @_;
  my ($newx, $newy)=($self->{x}+$r* sin($self->{theta}),
                     $self->{y}+$r*-cos($self->{theta}));
  if ($what) {
    &$what($self->{x}, $self->{y}, $newx, $newy);  # motion
  }
  # According to the coderef passed in
  ($self->{x}, $self->{y})=($newx, $newy);  # change the old coords
}

sub turn
{
  my $self = shift;
  my $dtheta = shift;

  $self->{theta} += $dtheta*$self->{mirror};
}

sub state
{
  my $self = shift;

  @{$self}{qw(x y theta mirror)};
}

sub setstate
{
  my $self = shift;

  @{$self}{qw(x y theta mirror)} = @_;
}

sub mirror
{
  my $self = shift;

  $self->{mirror} *= -1;
}

"Turtle.pm";
```

--------------------------------------------------------------------------------

---[FILE: Makefile.PL.in]---
Location: ImageMagick-main/PerlMagick/quantum/Makefile.PL.in

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
my $INC_magick = '-I../../ -I@top_srcdir@ @CPPFLAGS@ -I"' . $Config{'usrinc'} . '/ImageMagick"';
my $LIBS_magick = '-L../../MagickCore/.libs -lMagickCore-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@ @MATH_LIBS@ -L' . $Config{'archlib'} . '/CORE';
my $CCFLAGS_magick = "$Config{'ccflags'} @CFLAGS@";
my $LDFLAGS_magick   = "-L../../MagickCore/.libs -lMagickCore-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@ $Config{'ldflags'} @LDFLAGS@";
my $LDDLFLAGS_magick = "-L../../MagickCore/.libs -lMagickCore-@MAGICK_MAJOR_VERSION@.@MAGICK_ABI_SUFFIX@ $Config{'lddlflags'} @LDFLAGS@";

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
   'ABSTRACT'	=> 'ImageMagick PERL Extension (@MAGICK_ABI_SUFFIX@)',

   # Perl module name is Image::Magick
   'NAME'	=> 'Image::Magick::@MAGICK_ABI_SUFFIX@',

   # Module author
   'AUTHOR' => 'ImageMagick Studio LLC',

   # Module version
   'VERSION' => '@PACKAGE_BASE_VERSION@',

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
   'PM' => { '@MAGICK_ABI_SUFFIX@.pm' => '$(INST_LIBDIR)/@MAGICK_ABI_SUFFIX@.pm' },
   'XS' => { '@MAGICK_ABI_SUFFIX@.xs' => '@MAGICK_ABI_SUFFIX@.xs' },
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

---[FILE: quantum.pm]---
Location: ImageMagick-main/PerlMagick/quantum/quantum.pm

```text
package Image::Magick::Q16HDRI;

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
use vars qw($VERSION @ISA @EXPORT $AUTOLOAD);

require 5.002;
require Exporter;
require DynaLoader;
require AutoLoader;

@ISA = qw(Exporter DynaLoader);
# Items to export into callers namespace by default. Note: do not export
# names by default without a very good reason. Use EXPORT_OK instead.
# Do not simply export all your public functions/methods/constants.
@EXPORT =
  qw(
      Success Transparent Opaque QuantumDepth QuantumRange MaxRGB
      WarningException ResourceLimitWarning TypeWarning OptionWarning
      DelegateWarning MissingDelegateWarning CorruptImageWarning
      FileOpenWarning BlobWarning StreamWarning CacheWarning CoderWarning
      ModuleWarning DrawWarning ImageWarning XServerWarning RegistryWarning
      ConfigureWarning ErrorException ResourceLimitError TypeError
      OptionError DelegateError MissingDelegateError CorruptImageError
      FileOpenError BlobError StreamError CacheError CoderError
      ModuleError DrawError ImageError XServerError RegistryError
      ConfigureError FatalErrorException
    );

$VERSION = '7.1.2';

sub AUTOLOAD {
    # This AUTOLOAD is used to 'autoload' constants from the constant()
    # XS function.  If a constant is not found then control is passed
    # to the AUTOLOAD in AutoLoader.
    no warnings;

    my $constname;
    ($constname = $AUTOLOAD) =~ s/.*:://;
    die "&${AUTOLOAD} not defined. The required ImageMagick libraries are not installed or not installed properly.\n" if $constname eq 'constant';
    my $val = constant($constname, @_ ? $_[0] : 0);
    if ($! != 0) {
    	if ($! =~ /Invalid/) {
	        $AutoLoader::AUTOLOAD = $AUTOLOAD;
	        goto &AutoLoader::AUTOLOAD;
    	}
    	else {
	        my($pack,$file,$line) = caller;
	        die "Your vendor has not defined PerlMagick macro $pack\:\:$constname, used at $file line $line.\n";
    	}
    }
    eval "sub $AUTOLOAD { $val }";
    goto &$AUTOLOAD;
}

bootstrap Image::Magick::Q16HDRI $VERSION;

# Preloaded methods go here.

sub new
{
    my $this = shift;
    my $class = ref($this) || $this || "Image::Magick::Q16HDRI";
    my $self = [ ];
    bless $self, $class;
    $self->set(@_) if @_;
    return $self;
}

sub New
{
    my $this = shift;
    my $class = ref($this) || $this || "Image::Magick::Q16HDRI";
    my $self = [ ];
    bless $self, $class;
    $self->set(@_) if @_;
    return $self;
}

# Autoload methods go after =cut, and are processed by the autosplit program.

END { UNLOAD () };

1;
__END__

=head1 NAME

Image::Magick::Q16HDRI - objected-oriented Perl interface to ImageMagick (Q16HDRI). Use it to create, edit, compose, or convert bitmap images from within a Perl script.

=head1 SYNOPSIS

  use Image::Magick::Q16HDRI;
  $p = new Image::Magick::Q16HDRI;
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

	 https://imagemagick.org/script/perl-magick.php

If you have problems, go to

   https://github.com/ImageMagick/ImageMagick/discussions/categories/development

=head1 AUTHOR

Kyle Shorter	magick-users@imagemagick.org

=head1 BUGS

Has all the bugs of ImageMagick and much, much more!

=head1 SEE ALSO

perl(1).

=cut
```

--------------------------------------------------------------------------------

---[FILE: quantum.pm.in]---
Location: ImageMagick-main/PerlMagick/quantum/quantum.pm.in

```text
package Image::Magick::@MAGICK_ABI_SUFFIX@;

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
use vars qw($VERSION @ISA @EXPORT $AUTOLOAD);

require 5.002;
require Exporter;
require DynaLoader;
require AutoLoader;

@ISA = qw(Exporter DynaLoader);
# Items to export into callers namespace by default. Note: do not export
# names by default without a very good reason. Use EXPORT_OK instead.
# Do not simply export all your public functions/methods/constants.
@EXPORT =
  qw(
      Success Transparent Opaque QuantumDepth QuantumRange MaxRGB
      WarningException ResourceLimitWarning TypeWarning OptionWarning
      DelegateWarning MissingDelegateWarning CorruptImageWarning
      FileOpenWarning BlobWarning StreamWarning CacheWarning CoderWarning
      ModuleWarning DrawWarning ImageWarning XServerWarning RegistryWarning
      ConfigureWarning ErrorException ResourceLimitError TypeError
      OptionError DelegateError MissingDelegateError CorruptImageError
      FileOpenError BlobError StreamError CacheError CoderError
      ModuleError DrawError ImageError XServerError RegistryError
      ConfigureError FatalErrorException
    );

$VERSION = '@PACKAGE_BASE_VERSION@';

sub AUTOLOAD {
    # This AUTOLOAD is used to 'autoload' constants from the constant()
    # XS function.  If a constant is not found then control is passed
    # to the AUTOLOAD in AutoLoader.
    no warnings;

    my $constname;
    ($constname = $AUTOLOAD) =~ s/.*:://;
    die "&${AUTOLOAD} not defined. The required ImageMagick libraries are not installed or not installed properly.\n" if $constname eq 'constant';
    my $val = constant($constname, @_ ? $_[0] : 0);
    if ($! != 0) {
    	if ($! =~ /Invalid/) {
	        $AutoLoader::AUTOLOAD = $AUTOLOAD;
	        goto &AutoLoader::AUTOLOAD;
    	}
    	else {
	        my($pack,$file,$line) = caller;
	        die "Your vendor has not defined PerlMagick macro $pack\:\:$constname, used at $file line $line.\n";
    	}
    }
    eval "sub $AUTOLOAD { $val }";
    goto &$AUTOLOAD;
}

bootstrap Image::Magick::@MAGICK_ABI_SUFFIX@ $VERSION;

# Preloaded methods go here.

sub new
{
    my $this = shift;
    my $class = ref($this) || $this || "Image::Magick::@MAGICK_ABI_SUFFIX@";
    my $self = [ ];
    bless $self, $class;
    $self->set(@_) if @_;
    return $self;
}

sub New
{
    my $this = shift;
    my $class = ref($this) || $this || "Image::Magick::@MAGICK_ABI_SUFFIX@";
    my $self = [ ];
    bless $self, $class;
    $self->set(@_) if @_;
    return $self;
}

# Autoload methods go after =cut, and are processed by the autosplit program.

END { UNLOAD () };

1;
__END__

=head1 NAME

Image::Magick::@MAGICK_ABI_SUFFIX@ - objected-oriented Perl interface to ImageMagick (@MAGICK_ABI_SUFFIX@). Use it to create, edit, compose, or convert bitmap images from within a Perl script.

=head1 SYNOPSIS

  use Image::Magick::@MAGICK_ABI_SUFFIX@;
  $p = new Image::Magick::@MAGICK_ABI_SUFFIX@;
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

	 https://imagemagick.org/script/perl-magick.php

If you have problems, go to

   https://github.com/ImageMagick/ImageMagick/discussions/categories/development

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

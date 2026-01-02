---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 510
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 510 of 851)

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

---[FILE: read.t]---
Location: ImageMagick-main/PerlMagick/t/tiff/read.t

```text
#!/usr/bin/perl
#
# Test reading TIFF images
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#
BEGIN { $| = 1; $test=1; print "1..16\n"; }
END {print "not ok $test\n" unless $loaded;}

use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/tiff' || die 'Cd failed';

#
# 1) Test Reading Monochrome
# 
print("Monochrome ...\n");
testRead ( 'input_mono.tiff',
  '71e1a6be223e307b1dbf732860792b15adba662b7a7ef284daf7f982f874ccf1' );

#
# 2) Test reading PseudoColor (16 color)
#
++$test;
print("PseudoColor (16 color)...\n");
testRead( 'input_16.tiff',
  '0de2dcbf667c69ae6735d1a701b4038c1eeea25cc86981a496bb26fc82541835' );

#
# 3) Test reading PseudoColor (16 color + matte channel)
#
++$test;
print("PseudoColor (16 color + matte channel)...\n");
testRead( 'input_16_matte.tiff',
  '0de2dcbf667c69ae6735d1a701b4038c1eeea25cc86981a496bb26fc82541835' );

#
# 4) Test reading PseudoColor (256 color)
#
++$test;
print("PseudoColor (256 color) ...\n");
testRead( 'input_256.tiff',
  'b2644ac928730aa1d28e754aeb17b4731b57daea28c9fb89b1b50623e87215b5' );

#
# 5) Test reading PseudoColor (256 color + matte channel)
#
++$test;
print("PseudoColor (256 color + matte channel) ...\n");
testRead( 'input_256_matte.tiff',
	'c8e5089f89ed3b7d067222e187ccd95da0a586f3a7f669876188fe8bfa04e6d9' );

#
# 6) Test reading PseudoColor using contiguous planar packing
#
++$test;
print("PseudoColor (256 color) contiguous planes ...\n");
testRead( 'input_256_planar_contig.tiff',
  'b2644ac928730aa1d28e754aeb17b4731b57daea28c9fb89b1b50623e87215b5' );

#
# 7) Test reading PseudoColor using separate planes
#
++$test;
print("PseudoColor (256 color) separate planes ...\n");
testRead( 'input_256_planar_separate.tiff',
  'b2644ac928730aa1d28e754aeb17b4731b57daea28c9fb89b1b50623e87215b5' );

#
# 8) Test Reading TrueColor (8-bit)
# 
++$test;
print("TrueColor (8-bit) image ...\n");
testRead( 'input_truecolor.tiff',
  'f72b63be472e5e730ee2635463c6643d11057d251709ffe1f2027f69b57449df' );

#
# 9) Test Reading TrueColor (16-bit)
#
++$test;
print("TrueColor (16-bit) image ...\n");
testRead( 'input_truecolor_16.tiff',
  '7de73152fd38276a12bd4e137854b9dd27ae89dcd597e8789442e4d44df31e61',
  '81def436d1dea0ee118164ff4f017c62ad7a5a37bf97a820244a4e2c86c338ab' );

#
# 10) Test Reading 8-bit TrueColor Tiled (32x32 tiles)
# 
++$test;
print("TrueColor (8-bit) tiled image, 32x32 tiles ...\n");
testRead( 'input_truecolor_tiled32x32.tiff',
  'f72b63be472e5e730ee2635463c6643d11057d251709ffe1f2027f69b57449df' );

#
# 11) Test Reading 8-bit TrueColor Tiled (8 rows per strip)
# 
++$test;
print("TrueColor (8-bit) stripped, image, 8 rows per strip ...\n");
testRead( 'input_truecolor_stripped.tiff',
  'f72b63be472e5e730ee2635463c6643d11057d251709ffe1f2027f69b57449df' );

#
# 12) Test Reading Grayscale 4-bit
#
++$test;
print("Grayscale (4-bit) ...\n");
testRead( 'input_gray_4bit.tiff',
  'e55c01b0d28b0a19431ba27203db7cb6ada189c9519d4466c44a764aad5e185a');

#
# 13) Test Reading Grayscale 8-bit
# 
++$test;
print("Grayscale (8-bit) ...\n");
testRead( 'input_gray_8bit.tiff',
  'b51e862fcc24d439870da413c664dfefc36cea1260d807b3208d6f091566263c');

#
# 14) Test Reading Grayscale 8-bit + matte
# 
++$test;
print("Grayscale (8-bit + matte) ...\n");
testRead( 'input_gray_8bit_matte.tiff',
  '6002e57537cd54733551f8c4269e8104f2b14f8fcc58a07eda61f5911eb11c80' );

#
# 15) Test Reading Grayscale 12-bit
# 
++$test;
print("Grayscale (12-bit) ...\n");
testRead( 'input_gray_12bit.tiff',
  'f343adc420b5fc7353cddecf48e6836d8ab8a91a6c78e316e903aec2d3f7293a',
  '638d5287bb0e6b585525334332ac348ab54903ad0104b789f9335413a8c59276' );

#
# 16) Test Reading Grayscale 16-bit
# 
++$test;
print("Grayscale (16-bit) ...\n");
testRead( 'input_gray_16bit.tiff',
  '5d7d94a836efc6be6dc6a84be6017b19a0a5486cc9311b86462cd5e75abb9398',
  '9acab3f8b02e461149decd6dbb99d4b91be81a129e5f4cafc229e2f393173819' );
```

--------------------------------------------------------------------------------

---[FILE: write.t]---
Location: ImageMagick-main/PerlMagick/t/tiff/write.t

```text
#!/usr/bin/perl
#
# Test writing TIFF images
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#
BEGIN { $| = 1; $test=1; print "1..10\n"; }
END {print "not ok $test\n" unless $loaded;}

use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/tiff' || die 'Cd failed';

#
# 1) Test 4-bit pseudocolor image
#
print("PseudoColor image (4 bits/sample) ...\n");
testReadWrite( 'input_16.tiff',
  'output_16.tiff',
  q//,
  '0de2dcbf667c69ae6735d1a701b4038c1eeea25cc86981a496bb26fc82541835');

#
# 2) Test 8-bit pseudocolor image
#
++$test;
print("PseudoColor image (8 bits/sample) ...\n");
testReadWrite( 'input_256.tiff',
  'output_256.tiff',
  q//,
  'b2644ac928730aa1d28e754aeb17b4731b57daea28c9fb89b1b50623e87215b5');

#
# 3) Test 4-bit pseudocolor + matte channel image
#
++$test;
print("PseudoColor image (4 bits/sample + matte channel) ...\n");
testReadWrite( 'input_16_matte.tiff',
  'output_16_matte.tiff',
  q//,
  '0de2dcbf667c69ae6735d1a701b4038c1eeea25cc86981a496bb26fc82541835' );

#
# 4) Test 8-bit pseudocolor + matte channel image
#
++$test;
print("PseudoColor image (8 bits/sample + matte channel) ...\n");
testReadWrite( 'input_256_matte.tiff',
  'output_256_matte.tiff',
  q//,
  'c8e5089f89ed3b7d067222e187ccd95da0a586f3a7f669876188fe8bfa04e6d9' );

#
# 5) Test truecolor image
#
++$test;
print("TrueColor image (8 bits/sample) ...\n");
testReadWrite( 'input_truecolor.tiff',
  'output_truecolor.tiff',
  q/quality=>55/,
  'f72b63be472e5e730ee2635463c6643d11057d251709ffe1f2027f69b57449df' );

#
# 6) Test monochrome image
#
++$test;
print("Gray image (1 bit per sample) ...\n");
testReadWrite(  'input_mono.tiff',
  'output_mono.tiff',
  q//,
  '71e1a6be223e307b1dbf732860792b15adba662b7a7ef284daf7f982f874ccf1' );

#
# 7) Test gray 4 bit image
#
++$test;
print("Gray image (4 bits per sample) ...\n");
testReadWrite(  'input_gray_4bit.tiff',
  'output_gray_4bit.tiff',
  q//,
  'e55c01b0d28b0a19431ba27203db7cb6ada189c9519d4466c44a764aad5e185a' );

#
# 8) Test gray 8 bit image
#
++$test;
print("Gray image (8 bits per sample) ...\n");
testReadWrite(  'input_gray_8bit.tiff',
  'output_gray_8bit.tiff',
  q//,
  'b51e862fcc24d439870da413c664dfefc36cea1260d807b3208d6f091566263c' );

#
# 9) Test gray 4 bit image (with matte channel)
#
++$test;
print("Gray image (4 bits per sample + matte channel) ...\n");
testReadWrite(  'input_gray_4bit_matte.tiff',
  'output_gray_4bit_matte.tiff',
  q//,
  'aa1ccb94820722df3dbb8a84410b6e8f6d5a3e393e5b2204923a16182e0958b9' );

#
# 10) Test gray 8 bit image (with matte channel)
#
++$test;
print("Gray image (8 bits per sample + matte channel) ...\n");
testReadWrite(  'input_gray_8bit_matte.tiff',
  'output_gray_8bit_matte.tiff',
  q//,
  '6002e57537cd54733551f8c4269e8104f2b14f8fcc58a07eda61f5911eb11c80' );
```

--------------------------------------------------------------------------------

---[FILE: read.t]---
Location: ImageMagick-main/PerlMagick/t/ttf/read.t

```text
#!/usr/bin/perl
#
# Test read image method on TrueType font
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us
#

BEGIN { $| = 1; $test=1; print "1..3\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/ttf' || die 'Cd failed';

#
# 1) Test default ImageMagick read operation on font
#
print("Default ImageMagick read ...\n");
testReadCompare('input.ttf', '../reference/ttf/read.miff',
                q/size=>'512x512', depth=>8/,
                0.14, 1.01);

#
# 2) Test drawing text using font
#
++$test;
print("Draw text using font ...\n");
testReadCompare(q!label:The quick brown fox jumps over the lazy dog.!,
                q!../reference/ttf/label.miff!,
                q!font=>'input.ttf', fill=>'#0000FF', pointsize=>14, size=>'245x16', depth=>8!,
                0.14, 1.01);

#
# 3) Test drawing text using annotate
#
++$test;
print("Draw text using annotate ...\n");
testFilterCompare('xc:#FFFFFF',
                  q!size=>'250x20', depth=>8!,
                  q!../reference/ttf/annotate.miff!,
                  'Annotate',
                  q!text=>'The quick brown fox jumps over the lazy dog.',
                  geometry=>'+6+14',
                  font=>'input.ttf',
                  fill=>'#FF0000',
                  pointsize=>14!,
                  0.14, 1.01);

1;
```

--------------------------------------------------------------------------------

---[FILE: read.t]---
Location: ImageMagick-main/PerlMagick/t/wmf/read.t

```text
#!/usr/bin/perl
#
# Test reading WMF files
#
# Whenever a new test is added/removed, be sure to update the
# 1..n output.
#
BEGIN { $| = 1; $test=1; print "1..2\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/wmf' || die 'Cd failed';

testReadCompare('wizard.wmf', '../reference/wmf/wizard.gif', q//, 0.01, 1.0);
++$test;
testReadCompare('clock.wmf', '../reference/wmf/clock.gif', q//, 0.01, 1.0);
```

--------------------------------------------------------------------------------

---[FILE: congrats.fig]---
Location: ImageMagick-main/PerlMagick/t/x11/congrats.fig

```text
#FIG 3.2
Portrait
Center
Inches
Letter 
100.00
Single
0
1200 2
6 2100 1575 8100 2775
4 1 4 0 0 18 32 0.0000 4 450 6000 5100 2625 You can display an image!\001
4 1 4 0 0 18 32 0.0000 4 345 5010 5100 1950 CONGRATULATIONS!\001
-6
2 4 0 1 0 7 0 0 -1 0.000 0 0 7 0 0 5
	 9150 5850 9150 600 900 600 900 5850 9150 5850
4 1 0 0 0 18 24 0.0000 4 330 3420 5100 3450 Please Stand By . . .\001
4 1 0 0 0 18 24 0.0000 4 330 5775 5100 4125 In eight seconds this window will\001
4 1 0 0 0 18 24 0.0000 4 330 4395 5100 4530 automatically disappear.\001
```

--------------------------------------------------------------------------------

---[FILE: read.t]---
Location: ImageMagick-main/PerlMagick/t/x11/read.t

```text
#!/usr/bin/perl
#
# Test accessing X11 server
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#

BEGIN { $| = 1; $test=1; print "1..2\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/x11' || die 'Cd failed';

#
# 1) Test rendering text using common X11 font
#

$font   = '-*-courier-bold-r-normal-*-14-*-*-*-*-*-iso8859-1';

# Ensure that Ghostscript is out of the picture
$SAVEDPATH=$ENV{'PATH'};
$ENV{'PATH'}='';

$image=Image::Magick->new;
$x=$image->Set(font=>"$font", pen=>'#0000FF', dither=>'False');
if( "$x" ) {
  print "$x\n";
  print "not ok $test\n";
} else {
  $x=$image->ReadImage('label:The quick brown fox jumps over the lazy dog.');
  if( "$x" ) {
    print "ReadImage: $x\n";
    # If server can't be accessed, ImageMagick returns this warning
    # Warning 305: Unable to open X server
    $x =~ /(\d+)/;
    my $errorCode = $1;
    if ( $errorCode > 0 ) {
      print "not ok $test\n";
    } else {
      print "ok $test\n";
    }
  } else {
    #$image->Display();
    print "ok $test\n";
  }
}
undef $image;

$ENV{'PATH'}=$SAVEDPATH;

print("X Windows system window dump file (color) ...\n");
++$test;
testReadCompare('input.xwd', '../reference/read/input_xwd.miff', q//, 0.0, 0.0);
```

--------------------------------------------------------------------------------

---[FILE: write.t]---
Location: ImageMagick-main/PerlMagick/t/x11/write.t

```text
#!/usr/bin/perl
#
# Test accessing X11 server
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#

BEGIN { $| = 1; $test=1; print "1..2\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/x11' || die 'Cd failed';


# 1) Test reading and displaying an image
#
if ( 0 && defined($ENV{'DISPLAY'}) && ($^O ne 'MSWin32') ) {
  $image=Image::Magick->new;
  $x=$image->ReadImage('congrats.gif');
  if( "$x" ) {
    print "not ok $test\n";
  } else {
    $x = $image->Display(delay=>800);
    if( "$x" ) {
      print "not ok $test\n";
    } else {
      print "ok $test\n";
    }
  }
  undef $image;
} else {
  print "ok $test\n";
}

# 2) Test XWD image file
#
print("X Windows system window dump file (color) ...\n");
++$test;
testReadWrite( 'XWD:input.xwd',
  'XWD:output.xwd',
  q//,
  'fb6fc68beb3b1001c5ebaa671c8ac8fddea06995027127765ff508f77723cc52');
```

--------------------------------------------------------------------------------

---[FILE: input.fig]---
Location: ImageMagick-main/PerlMagick/t/xfig/input.fig

```text
#FIG 3.2
Landscape
Center
Inches
Letter 
100.00
Single
0
1200 2
2 2 0 0 7 0 0 0 44 0.000 0 0 -1 0 0 5
	 900 1200 1500 1200 1500 1800 900 1800 900 1200
2 2 0 0 7 1 0 0 45 0.000 0 0 -1 0 0 5
	 1500 1200 2100 1200 2100 1800 1500 1800 1500 1200
2 2 0 0 7 3 0 0 47 0.000 0 0 -1 0 0 5
	 2700 1200 3300 1200 3300 1800 2700 1800 2700 1200
2 2 0 0 7 2 0 0 46 0.000 0 0 -1 0 0 5
	 2100 1200 2700 1200 2700 1800 2100 1800 2100 1200
2 2 0 0 7 4 0 0 49 0.000 0 0 -1 0 0 5
	 3300 1200 3900 1200 3900 1800 3300 1800 3300 1200
2 2 0 0 7 5 0 0 43 0.000 0 0 -1 0 0 5
	 900 1800 1500 1800 1500 2400 900 2400 900 1800
2 2 0 0 7 6 0 0 43 0.000 0 0 -1 0 0 5
	 1500 1800 2100 1800 2100 2400 1500 2400 1500 1800
2 2 0 0 7 7 0 0 14 0.000 0 0 -1 0 0 5
	 2100 1800 2700 1800 2700 2400 2100 2400 2100 1800
2 2 0 0 7 8 0 0 58 0.000 0 0 -1 0 0 5
	 2700 1800 3300 1800 3300 2400 2700 2400 2700 1800
2 2 0 0 7 9 0 0 59 0.000 0 0 -1 0 0 5
	 3300 1800 3900 1800 3900 2400 3300 2400 3300 1800
2 2 0 0 7 10 0 0 57 0.000 0 0 -1 0 0 5
	 900 2400 1500 2400 1500 3000 900 3000 900 2400
2 2 0 0 7 11 0 0 43 0.000 0 0 -1 0 0 5
	 1500 2400 2100 2400 2100 3000 1500 3000 1500 2400
2 2 0 0 7 12 0 0 61 0.000 0 0 -1 0 0 5
	 2100 2400 2700 2400 2700 3000 2100 3000 2100 2400
2 2 0 0 7 13 0 0 62 0.000 0 0 -1 0 0 5
	 2700 2400 3300 2400 3300 3000 2700 3000 2700 2400
2 2 0 0 7 14 0 0 44 0.000 0 0 -1 0 0 5
	 3300 2400 3900 2400 3900 3000 3300 3000 3300 2400
2 2 0 0 7 15 0 0 54 0.000 0 0 -1 0 0 5
	 900 3000 1500 3000 1500 3600 900 3600 900 3000
2 2 0 0 7 16 0 0 43 0.000 0 0 -1 0 0 5
	 1500 3000 2100 3000 2100 3600 1500 3600 1500 3000
2 2 0 0 7 17 0 0 46 0.000 0 0 -1 0 0 5
	 2100 3000 2700 3000 2700 3600 2100 3600 2100 3000
2 2 0 0 7 18 0 0 50 0.000 0 0 -1 0 0 5
	 2700 3000 3300 3000 3300 3600 2700 3600 2700 3000
2 2 0 0 7 19 0 0 44 0.000 0 0 -1 0 0 5
	 3300 3000 3900 3000 3900 3600 3300 3600 3300 3000
2 2 0 0 7 21 0 0 53 0.000 0 0 -1 0 0 5
	 900 3600 1500 3600 1500 4200 900 4200 900 3600
2 2 0 0 7 22 0 0 43 0.000 0 0 -1 0 0 5
	 1500 3600 2100 3600 2100 4200 1500 4200 1500 3600
2 2 0 0 7 24 0 0 56 0.000 0 0 -1 0 0 5
	 2100 3600 2700 3600 2700 4200 2100 4200 2100 3600
2 2 0 0 7 25 0 0 41 0.000 0 0 -1 0 0 5
	 2700 3600 3300 3600 3300 4200 2700 4200 2700 3600
2 2 0 0 7 26 0 0 49 0.000 0 0 -1 0 0 5
	 3300 3600 3900 3600 3900 4200 3300 4200 3300 3600
2 2 0 0 7 27 0 0 50 0.000 0 0 -1 0 0 5
	 900 4200 1500 4200 1500 4800 900 4800 900 4200
2 2 0 0 7 28 0 0 61 0.000 0 0 -1 0 0 5
	 1500 4200 2100 4200 2100 4800 1500 4800 1500 4200
2 2 0 0 7 30 0 0 48 0.000 0 0 -1 0 0 5
	 2100 4200 2700 4200 2700 4800 2100 4800 2100 4200
2 2 0 0 7 31 0 0 62 0.000 0 0 -1 0 0 5
	 2700 4200 3300 4200 3300 4800 2700 4800 2700 4200
2 2 0 0 7 -1 0 0 20 0.000 0 0 -1 0 0 5
	 3300 4200 3900 4200 3900 4800 3300 4800 3300 4200
```

--------------------------------------------------------------------------------

---[FILE: read.t]---
Location: ImageMagick-main/PerlMagick/t/xfig/read.t

```text
#!/usr/bin/perl
#
# Test Reading Xfig files
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#

BEGIN { $| = 1; $test=1; print "1..1\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/xfig' || die 'Cd failed';

#
# 1) Test reading Xfig
#
$image=Image::Magick->new;
$x=$image->ReadImage('input.fig');
if( "$x" ) {
  print "ReadImage: $x\n";
  print "not ok $test\n";
} else {
    print "ok $test\n";
}
undef $image;
```

--------------------------------------------------------------------------------

---[FILE: input.miff]---
Location: ImageMagick-main/PerlMagick/t/zlib/input.miff

```text
id=ImageMagick
class=DirectClass  matte=False
columns=70  rows=46  depth=8
signature=eb4d6e084afe2835a1ad28ad7fc12ced
background-color=gray74  border-color=gray74  matte-color=gray74
{
This is a comment.}

:0/-20.62/83.:3-92-80-91.80-80-7/,5-*4,)5-*5-*1-'1.'41*74-96/?:/F?3JB4LA2NB2UA2tD4�C3�A5�E=�DG�CF�=B�<@�@;�?/�?-�@-�A+�@+�?.�=,�=+�=*�?.�?3�B3�D6�F9R:/:5372172/61.30,//-0/-3,-6+-P78�IG�bn�|�lp�PHnRLauw|���z|lYVS/.,0/-50-71-81,80,6/,81-81-81.7.,4-*4,*6/+6.+3/*30*41+63-750>8-E=2H?1I>.K@/MD3iE4�@.�<-�G<�DG�BE�<A�<@�A;�?-�?+�?,�@+�?+�>.�=,�=*�;*�>-�>3�@4�D8�H;D7,95593162/62.11--1.00.5/.2*,E21xA5�Y\�}�cl�J>kK@\]^g��~lp_YWS,,,,-+0/,1.+2,(2-*0,+2,+2++2,+2,+1,+1,)3-,3-,3/,31,40,52-750:3,>6-@6-C8-H;/EE5UD4m=+�9(�E4�H=�E@�<>�>=�A0�@*�?-�>-�?,�>)�>,�=-�<-�;.�?/�B1�@8�GD�WN<?5;4193.53.14/-4.,40/3/12000.3-+I.!lMN���kq�H==1X54H>FFISIYZO,-/+-/.--/-)/*'-+(,**,**.++.++.++/++/--0,,0-./-*2.,2.+2-,30.82/<4/>4/A5-F91H>7Q<5_70y7-�;/�A3�E9�E@�HA�B/�@,�>-�=/�=-�=+�<+�<,�<.�<2�C7�G:�E@�g_��yWeWCB875+/1*.1+-0,-0//0.02./2./-24*,gcb���~��ip�Y\o`pr���|��_eQ,/2+/2..0-.--+),*++)+('(**+,*+,*+*))*()-+,.-./,+0,+.*)/++0--811<32;21>0.A2/A73B:6K62h7/�=0�>5�A3�D7�G<�?3�?,�=+�;-�<-�;,�9)�9*:.?7�G@�E>�UR��{���r�pSZG<@301(-)'2,+2,+0,*0-+0/+2*10)(eqR�������ʳ�ǰ���������YdJ.0.//-/1.21.30-3/,2-*-*+,+,*)-+(,-',+(),*)--+/-,.+*/+)4,)6/*;3.=40;1-;/.>/.>3,59/93,O,'i:-�A1�@1�;-�B2�>2�</�=.�?/�</�9,{;,v:*};0�G;�KD�QO��p������w�y\{ZN^G=:32'(/')-(+0(,2(/1+00*0+'[f@��v��v�Ɍ�Ó��~���v�pO[D23-34-53.961961:2.80-3.,300-.0/(/1)./*,1.*10*01./004/+;1+A5,C8/A90=5-;0/<1/E1-R).F*.70)R/(j9.�:7�94?5�B6�A1�>-�:+�;*v>)v8,s9-{@4�G>�NE�dVz�q{�����v�|e�gd�ePfP4=0*&#.$&+**)+,'+/''-)$"W\H~�j{�j~�o�o}�t~�{o�lLVD782782994<:5@=8B:8A95=73<75:549009//61.62.63.641973?72B90H=1J>4H=4B80@61?62<94C54A50<6*E5'c6-�=;�BA�C;�>6A5~:/y;/u>.z4)�PL�[VpJ9kS@s`IzX�f`�zr�����~��v��xo�oXiM?;)3)"%+!+/&:&*C))TN:hqRh�Wk�\n�ck�hs�tt�th�dNXC8939:4>>8A?:D?:FA<EA:E@:G?8E=4D;1C:3C:3<8095/94/<70B<0I=0OA2P@5K<4E:1A:1=<3G70�EJ�GI�C:�KH�F9�?3�C5�E1�@2�>B�CEvC9y:4�<H�EG�UPpYC`jH�lS�SZ�(H�)K�@V�M_�Yh�fn�jr�_m�Wk�Pb�FOR.(>3(G@-e^:w�\n�\m�Ys�d~�{������d}_S_G671681==8B@;FA?HC>HC>JD<MB7J=0H<-F=/E;0A91<71:7.>9,E</M?/OA0O>1K;1D:/>=17=0�B@�K]�35�;#�?5�;0�>3�D7�:(�>2�>8�8?�<<�D?�7;�.'�B:�dO�cJ�c^�;E�BC�FO�.E�,H�0T�4\�:h�:o�Ar�Go�Zx�[fa=3HC/vd�����������������Ӱ��g{eWgL330551883=<6DC9GG>JI;MI6IE7MHJH@9E;+C9-?80>83=71>94@=9IA6P@-H?-K81C745=0@?/�I@�4+�4!�A&�:$�6'�=2�A1�@2�@4�8)�1+�++�0)�6%�5!�9,�UI�UQ�AK�?A�;.�E;�AD�>H�AQ�=V�>h�>q�Ew�Jn�Wx�Y�]n�nd�����������������������҅��u�n10-/.,43/892>?5GD;OK8MK4XWW���|x�[ToF?O94462&52):9.B=-K@/P@/C;*:4)040B1-�6<�;/�<'�;%�>,�=1�;1�9*�:+�?2�3*�4,�8.�1+�/(�5 �4!�9,�?6�CA�A>�>3�9(�=-�E@�FK�DK�DX�Bb�Jt�K}�Mz�Tt�Cc�{��_T������������������������������:8163-30+74,<;2IA6VJ9TH:dar��䬲���쏏�nm�LIX@?M<99A=(BC.8A9:EQEUaFSRaG<�F7�=+�A-�;(�6*�80�:4�82�:3�;2�?7�1'�-(�-(�2(�7!�7"�5(�C<�VM�>2�:#�:)�@7�HF�GH�FJ�O\�F`�Jn�Rz�Xz�Uq�Sg�`p�KU᪤���������������������������D@5A=3;6-52(:5/F=7TG6WF7]Uj��ޫ�����������|�f\�RLs7:C:97RJN�s�����]{�KP�<'�9#�:*�;-�<3�;3�61�>9�<7�8/�D9�?4�))�++�2,�2%�<(�:*�7-�LH�C@�9$�9(�>2�QI�E>�NI�QS�Ta�Vn�No�Ux�Wo�Zi�We�OT�tn���������������������������OI;MG:F@5?90=60A=8ME5SD.WLS�����������������틍�oz�ae��N_�OW�L]�HR�;>�>>�>5�>/�?2�>4�9/�3+�7/�8/�3)�3$�9"�>0�8;�05�20�54�53�7+�>/�PJ�EI�=3�8+�<-�C2�=-�H=�NJ�\a�fv�Pm�Zu�rx�bp�{��ueVPA���������������������������WN?VM?PI:KB4F<1E@7LG5SG.VNQ����������������������v��AN�<?�;7�@1�F;�=A�9<�@:�E9�6(�2+�41�;/�7)�4!�6!�7&�5)�5+�8.�42�-5�*0�1)�5$�LA�HI�MK�8.�:(�;'�;*�</�@3�^V�nm�gp�gq�tr�ou�z���|AQ3���������������������������[PA[OAYM?TJ:TG9NG<RJ9WK4XQT����ԕ�䙢씟؈�Ї���i��=P�@:�>C�?F�>;�GF�>A�?;�=1�?0�;+�:.�93�3/�4.�8*�;+�;6�<9�9%�9!�3&�5/�7+�8&�=)�>5�@B�US�G=�9)�:*�<-�<.�:*�VG�mj�ag�bm�nq�dl�Wpu�iXnE���������������������������[N>ZN>[N=XM<ZL<WK?XL<ZL8ULGd_uwx�������{{�fm�|Rb�;F�3?�E>�CN�BG�@5�C;�41�B5�;)�9%�:%�8(�4+�13�,3�-1�.8�(>�(0�0'�8(�;2�=4�D6�6&�5)�75�./�4*�5*�J>�>1�6*�:+�7&�H>�qr�s~�r{�s{�Ve�Da��}}�g�̮��Ưʪ�������ǚ�պ������[L<[L<\L<YI;ZK;[L>^M<^P<[NAYLI^Sdme��ě~��q��@G�>+�@9�<@�BJ�<7�9(�B8�;8�D:�7$�;(�8'�4'�9.�4'�,$�)'�%2�6�'6�<D�1:�0:�+.�85�GG�64�;6�5*�8&�8+�QG�<3�91�:3�8+�8-�kk����z��r�Md�?\��^g�Q|�\a~Qe�Yy�h��t��y�����ŵ�[K:[K:YK:YI9[K:]J<^K<^O;^O;_N:_KHaWw|w���ew�4K�@F�C@�BG�C@�;.�8&�@6�8;�ME�PA�6(�4*�60�1/�19�-<�*<�-H�.W�Qc�\m�8O�05�7&�C6�SN�C@�9.�7$�;%�8)�FB�83�31�00�91�4'�\W����|��k|�Ha�>UYa7e�N��d~�m�p��o��p��o��q���ÿ�\K7\K6\K6]L7]L9]L;^M=]P=]P=aM:cG>g]q������uq�KU�?Q�=G�<=�>4�;*�>/�83�3+�9'�MA�A3�:.�79�2>�"/� -�!+�%7�;V�cp�NS�:5�6$�-�:0�86�IE�;0�8+�8+�8/�J@�3.�.1�-0�2,�4%�ME����{��Yt�?a�@SIY1p�[��o��q|�f~�f�k~�e��n������^M:^M:^M:^M:^M:_L7^N9VNAaXYo`mmdppx���ꙃ͹v|�d\�MU�9A�77�B2�:+�G>�B9�6+�6'�4.�D7�<.�03�DN�CG�/-�,(�23�>C�?C�78�3.�OJ�OQ�IG�UU�EA�B:�<7�2=�7?�>:�1*�20�.2�0.�4%�H<����q��Fh�<d�AGNb<r�Zy�cu�`v�_z�d{�d{�Z��h��vl�g_O=_O?_O>_O=_O=`P7\L9_[a}|��}�qv�|�ƚ�Ǻ��ȶ��pR�LA�HJ�79�:2�7.�I?�fX�@3�2+�1,�=1�7)�-)�55�RX�JQ�QV�V[�@B�9?�-7�JV�oz�fv�RN�53�A<�E<�40�,:�5?�63�4*�2/�.2�/-�5)�<3����bw�>c�Ad\;/L_>u�^{�co�Wr�Xx�^y�[w�V��a��he|V[M=_P@_RB`RC`R@\OBcYaww�w|�cj�zz֯�������諸���yd�lg�WZ�6:�63�:1�OA�XI�1'�><�@7�0%�-'�3*�95�SW�Vb�do�ag�/7�(6�FS�^f�T[�73�64�82�80�:5�;;�65�5+�6*�0-�/4�0/�9.�82�w��Rp�<d�J[=<&AJ0h~St�Xh�Lm�Qs�Zs�Tl�Mb�ENj4Ia4TH8YL<_RBbVD`S?f]b{y�tz�]f�lv�������������·����oje�jd�yu�ge�DA�=5�<1�B2�<-�GF�IF�70�60�9+�:&�=6�:A�[g�W^�73�BI�?F�79�56�51�30�:/�;3�65�78�64�6-�7(�1+�35�0/�4*�DB�hu�;d�@h�MGRP<EB-O_9i�Le�Dg�Kn�Uh�L^�EY}CWoB[sDDB6JE<\M>`S>e_Xzt�sp�]_�ii���ߝ�ޢ�֠�֞�Ε��pg}^VR|SH�YQ�ys��|�^Z�6-�5#�;*�:0�7,�9/�8/�<*�@1�=4�73�PL�KB�6$�/0�(:�'?�:�#8�.6�:5�<5�75�35�40�7)�9&�6&�5-�5)�4'�V\�Pk�8e�@X95#AB378!QZ4dyN_�Ac�Dl�Nh�Gc�Ic�JfIbD47-::4OD;VL=gellj�QQ�[]�y{Ή�݌�ш�͈�ҍ�ȇ��~Zj\[LpWD�SV�fk���z�;-�;#�;)�6+�;+�6(�:-�8(�:-�:/�:0�?5�:.�1'�/7�+=�*>�$:�&9�5=�:6�;4�54�48�6/�7)�8&�6$�9&�;%�=4�Wl�7c�Cjk3=#/%/4^Y2���s�`]�>m�Kp�Qk�Hi�Me�Jf�Hg�G*0&+0+975EC=Z\i\]�[Z�y|օ�낂ځ�ʃ�ҋ�ۍ��~x�sWR`_Hd_C�WP�Zc�nj�K@�7&�<'�8+�1(�>+�:(�G;�9+�:)�7(�7(�</�;0�6;�1?�-;�36�58�7;�65�85�:8�78�6;�84�8*�:)�:'�=!�<&�KM�Bg�6g�CO3648+/DN)��y�՚q�\]�=r�No�Rf�Eg�Me�Kf�Gk�J.2&+.(01+:=0LONXVmnl���ꓐ��ф�Ǎ�Ύ���w�la]^]Gf]Ij\E�YC�RQ�==�0+�7&�7&�5+�5)�=+�<+�D9�8)�:(�9(�4(�2)�;4�8<�/:�EJ�VQ�A=�82�84�88�8<�7<�59�;6�8)�=*�=*�9#�5)�P`�=_�I]K@1-3%J3'��e�Ԍ��|Kc9`=l�Id�Ge�Ck�Oi�Of�Ep�P@>0>=4<=2AE*LM:UTAecg������z�ws�z�yon_WlYGh\Kj^N_O�K<�5.�0+�4*�8$�=$�9,�;)�7&�=5�IB�9'�:)�9-�<4�;7�:8�86�HI�ZX�C=�:7�92�84�68�8>�6=�7;�?7�;+�;'�;(�6#�ID�Uh�MX�]O39"FO)u�_��i��jIT<<H,g~Cj�Fa�Ek�Kl�Po�Qm�Mv�VUM>VM?VN?VP=\RC`WBbYKmckwj|pdm]W[WUR]VGfZFn_HjdO�ZO�RG�:,�4+�7/�7.�6*�9)�:,�<+�5"�9-�<4�H:�B9�>9�<<�68�;8�=2�9*�;-�<5�6:�6:�86�92�96�88�;=�@8�;,�;(�8$�6'�YZ�TV�YR�cK`x;��qv�YO];;=.23+;C1fGo�Jj�Mm�Rj�Gq�Kx�Uq�WcZKe[Ke[Kd[Le[Mg_Jh_Hg^Mg]Lf\I`ZGQN=LH7SP>[ZF__O�aY�JL�40�=)�:*�9+�8*�7*�:+�=/�5�?)�7*�9/�49�6<�6;�5<�64�8&�9&�:)�>4�98�67�85�<3�>9�>>�@;�8+�:(�:(�7"~:*�RJ�TI�\S�n]��sScB'258176/9909C0g�Kw�Qp�Sp�Oo�Ix�Uw�Y`�Jh_Pi`Qi`Qi`Qh_PkbTjbSi`PibLibHhbK`ZFLJ6@E4@H8CJ>UM;�XO�DF�:,�7%�8)�:)�:(�9)�;/�6�9�8*�;5�@E�>;�61�:5�9-�>*�A+�<'�6)�<5�=7�?6�D9�A9�83�8*�8'�<)};(w3"�A3�SG�ZN�YS�YMAM+'2%7><KM@=;(7:/8@-h�Kv�Pq�Pp�Jy�V}�bb�I`�Li`Qi`Qi`QjaRjaQk_Zk__kaVkaTkaXlaRkbNZVDDF8<C55C1?C)�ZF�]Y�JM�;0�9+�<0�=1�>2�@:�>3�C3�HA�IE�EA�=/�F2�C1yA-�:+�<,�=,�8*�:.�;0�?1�<.�6*�7,�<,;*{;,s9*v5(�H;�OB�SN�VW�o_fvIGV4^kQKQ5:;#88/8B/i�Lw�Pp�Nr�P}�`f�Nb�Jb�Mi`Qi`Qh_PlcTkbSmbWlbUldOldPlbVmbUmcThaQVP@EA18A'�K@�>@�NO�im�NJ�C<�E?�HC�IF�GK�LK�IH�AC�BA�@=�=0�A2�<1�:3;2~;1z;/z;+{:+�8,�8,�8(�:*�<,8+{3(y6,p4)v=1�Q@�TG�QM�[SWX@Oe=`vFCW-6@*:<279/8@-_yAx�Qp�Qw�Yj�S\�Gg�Ja�Ii`QjaRlbTjaRjaRkbSkbSkbRlcSlcTpbRpaUf_RfaP_YCA@%rM<�EC�BC�ON�LL�CB�@9�E;�DE�@E�CE�DC�A>�B>�A<�9/�=/�<3�82�;/�;.:-|:.|:/{91{8/|9.z:.x9/u8.r6+o4*l2'v@6�TL�QM�UMyeOZnJUmDM_:9C(89,;=34;089)Vd>t�Tx�\r�\Z�C_�Ie�L\�GhaQibRjdSibRibRjbSkbSkbSlcTlcTmaTfZPspi������}{j7>+3<(<=/?;.^B5�HE�AE�><�DA�DD�DD�FD�F?�F=�D>�=4�=,~>/�9.�:+�:+:,~:/~:0{90y8/w9/v90t:.q6-n3+k4)e1%s=2�RN�YR_R_\HES;2?);E0BJ69A04;.49578,LW3r�S{�^`�IZ~Ca�Ia�KX|GhbRibRkcSibRibRjbSkbSlcTlcTkbRe]S��|�����������ՠ�|CJ25?+:72*0+Z?>��XU�9:�@D�BD�AB�C?�E;�B:�B8�;,=,�<+�:+}9-}9/}:0|:1w:3s8/p6,o8-n7+n6/k4,g3*`.$p8/�UQz\ONO>5@1/5,330.3+4>1;K80>.-2/54+AM/s�Yn�TTu?Z|E_�L_�IWwHhcShcShcShcShcSjcSlcTmdUmdUlbQlje�����������������̝�KO1=6)OHF����������qq�=:�@<�@@�>?�B=�@<�C<�;1�=/~<,:.{9/|90{<3z<4p;1k8-i7-h8-h8.k70i6-a0'Y+m=4vTNG@3.9)1<.7:2686280-9*6D29H616,,-"@J1z�m^�MQo<VsB\yGb�LQjEgdSgdRgdRgdRfdRicRlcUmdUmdSjaQddd���������������������rnWAJ<���������������޲��OA�80�A<�B=�E@�?;�<3�=3~<1~:.|9/|90z92v80j8/h8/f7,e7-e7,i60i70f6.h;2nLB88314,37-56+37)/9+09*.8*/8,8A2;C201$DM:o�jGj=Lk<Li;WuFb�NCV;heVheWheWheWheWieVkdZneWhfQnlh����������������������ٸpsWo{j��������������������ػj^�8+�@6�H9�E6�B7�?6�;2}92x8/u7.s7.o5+j70h70f5/g6/i70l71l</gF4�q_nk[)2(17.07-16*05,/3-/3-/4..1,.5.2?43@3@M:IX@BU8Mg@Gb9XrJ]xT4D5heVheVheVheVheVgeUkd[ndXghP}�~����������������������ҷ������������������������������ǣ��E4�9.�<9�:;@=pB<q@6q?5o?4j<2h:1q62m51j7/g91g>4fF9cJ5_M5iQYF*1(07,17-06,/3,-2-.3--2,,0+,3,)4--8-2>-2>*6C.DV;H]=^qRZlS,8.heVheVheVifWifWjeVlc\ngZhiQlup����������������������������������������������������������Լ�kS�?.�6*8,oA3r=7s?9sA;o?8n=6q94l:3d=2^>2P;+UP9]X=]]?nv\2@+27/28.39/28-/5,.3-.3-,1+*/)+0++3+*4,-5,7@59C43>,>J4\hTQ]O+4-gdUheVifWifWifWjeVnc\lhZflShwo����������������������������������������������������������������ì�u]yH1e6"e3)j90l?4i>4h>2cA7_D5YG5e]GEF/9C'EI+ppR\`G29'7=57=37>48>38<57;66;5271.3-,1+(.(*.*,1,/2/=D==J81?(BP<EPD/90ddSgdUhgWieWhfWkeVnd\lhZdkRdwo����������������Ҷƿ�������������������������������������������������������ѽ�hS;XD,]K2\L4VO:QN7MO8^gK@L0=E*GJ+igJ`YDFF5:?5:>58>49?59@8;A;:>9:@:9=87;6062,1,+/.)-.)3)6J29L38I1;K8/;.\gO_iRgkWihXlfXlgYkf[hgYelY|��������������������ɾ����������������������������������������������������������mgKRK-UO2SO3PN4LO6HO5EN.LS0]e@aeFVV=WT<UR9MI6CB5<?58A58C59A79A6:B7;C8<E<;E:9@55=66D/G`5Gb<:M8@R:H\A4B1
```

--------------------------------------------------------------------------------

---[FILE: read.t]---
Location: ImageMagick-main/PerlMagick/t/zlib/read.t

```text
#!/usr/bin/perl
#
# Test reading an image which uses Zip compression
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#

BEGIN { $| = 1; $test=1; print "1..2\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

use Cwd;
use lib cwd;
require 't/subroutines.pl';

chdir 't/zlib' || die 'Cd failed';

#
# 1) Test reading Zip compressed MIFF
# 
testRead( 'input.miff',
  'fb6fc68beb3b1001c5ebaa671c8ac8fddea06995027127765ff508f77723cc52' );

#
# 3) Test reading Zip stream-compressed MIFF (.gz extension)
#
print("Reading Zip stream-compressed MIFF (.gz extension) ...\n");
++$test;
testRead( 'input.miff.gz',
  'fb6fc68beb3b1001c5ebaa671c8ac8fddea06995027127765ff508f77723cc52' );
```

--------------------------------------------------------------------------------

---[FILE: write.t]---
Location: ImageMagick-main/PerlMagick/t/zlib/write.t

```text
#!/usr/bin/perl
#
# Test writing files using zlib-based compression
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#
BEGIN { $| = 1; $test=1; print "1..1\n"; }
END {print "not ok $test\n" unless $loaded;}

use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/zlib' || die 'Cd failed';

#
# 1) Test writing Zip-compressed MIFF
#

testReadWrite( 'input.miff',
  'output.miff',
  q/compression=>'Zip'/,
  'fb6fc68beb3b1001c5ebaa671c8ac8fddea06995027127765ff508f77723cc52' );

$test = 0;  # Quench PERL complaint
```

--------------------------------------------------------------------------------

````

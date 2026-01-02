---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 402
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 402 of 851)

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
Location: ImageMagick-main/PerlMagick/t/hpgl/read.t

```text
#!/usr/bin/perl
#
# Test Reading HP GL images
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#

BEGIN { $| = 1; $test=1; print "1..1\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/hpgl' || die 'Cd failed';

#
# 1) Test reading HP GL
#
$image=Image::Magick->new;
$x=$image->ReadImage('input.hpgl');
if( "$x" ) {
  print "ReadImage: $x\n";
  print "not ok $test\n";
} else {
    print "ok $test\n";
}

undef $image;
```

--------------------------------------------------------------------------------

---[FILE: read.t]---
Location: ImageMagick-main/PerlMagick/t/jbig/read.t

```text
#!/usr/bin/perl
#
# Test read image method on JBIG image
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#
BEGIN { $| = 1; $test=1; print "1..1\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/jbig' || die 'Cd failed';

testRead( 'input.jbig',
  '214ce53ffd74a5c46a354e53d4512294f6b68c8dc843db61d5de71f53c7ace0c');
```

--------------------------------------------------------------------------------

---[FILE: write.t]---
Location: ImageMagick-main/PerlMagick/t/jbig/write.t

```text
#!/usr/bin/perl
#
# Test write image method on JBIG image
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#
BEGIN { $| = 1; $test=1; print "1..1\n"; }
END {print "not \n" unless $loaded;}

use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/jbig' || die 'Cd failed';

testReadWrite( 'input.jbig',
  'output.jbig',
  '',
  '214ce53ffd74a5c46a354e53d4512294f6b68c8dc843db61d5de71f53c7ace0c' );

$test=0; # Keep perl from complaining
```

--------------------------------------------------------------------------------

---[FILE: read.t]---
Location: ImageMagick-main/PerlMagick/t/jng/read.t

```text
#!/usr/bin/perl
#
# Test read image method on non-interlaced JPEG.
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#
BEGIN { $| = 1; $test=1; print "1..11\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/jng' || die 'Cd failed';

#
# 1) Gray
# 
testReadCompare('input_gray.jng', '../reference/jng/read_gray.miff', q//, 0.5, 1.0);
#
# 2) Gray with IDAT encoding
# 
++$test;
testReadCompare('input_gray_idat.jng', '../reference/jng/read_gray_idat.miff', q//, 0.5, 1.0);
#
# 3) Gray with JDAA encoding
# 
++$test;
testReadCompare('input_gray_jdaa.jng', '../reference/jng/read_gray_jdaa.miff', q//, 0.5, 1.0);
#
# 4) Gray Progressive
# 
++$test;
testReadCompare('input_gray_prog.jng', '../reference/jng/read_gray_prog.miff', q//, 0.5, 1.0);
#
# 5) Gray progressive with IDAT encoding
# 
++$test;
testReadCompare('input_gray_prog_idat.jng', '../reference/jng/read_gray_prog_idat.miff', q//, 0.5, 1.0);
#
# 6) Gray progressive with JDAA encoding
# 
++$test;
testReadCompare('input_gray_prog_jdaa.jng', '../reference/jng/read_gray_prog_jdaa.miff', q//, 0.5, 1.0);
#
# 7) Color with JDAA encoding
# 
++$test;
testReadCompare('input_idat.jng', '../reference/jng/read_idat.miff', q//, 0.5, 1.0);
#
# 8) Color with JDAA encoding
# 
++$test;
testReadCompare('input_jdaa.jng', '../reference/jng/read_jdaa.miff', q//, 0.5, 1.0);
#
# 9) Color progressive
# 
++$test;
testReadCompare('input_prog.jng', '../reference/jng/read_prog.miff', q//, 0.5, 1.0);#
#
# 10) Color progressive with IDAT encoding
# 
++$test;
testReadCompare('input_prog_idat.jng', '../reference/jng/read_prog_idat.miff', q//, 0.5, 1.0);
#
# 11) Color progressive with JDAA encoding
# 
++$test;
testReadCompare('input_prog_jdaa.jng', '../reference/jng/read_prog_jdaa.miff', q//, 0.5, 1.0);
```

--------------------------------------------------------------------------------

---[FILE: write.t]---
Location: ImageMagick-main/PerlMagick/t/jng/write.t

```text
#!/usr/bin/perl
#
# Test reading JPEG images
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#
BEGIN { $| = 1; $test=1; print "1..11\n"; }
END {print "not ok $test\n" unless $loaded;}

use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/jng' || die 'Cd failed';

testReadWriteCompare( 'input_gray_idat.jng', 'gray_idat_tmp.jng', '../reference/jng/write_gray_idat.miff', q//, q//, 0.5, 1.0);
++$test;
testReadWriteCompare( 'input_gray_jdaa.jng', 'gray_jdaa_tmp.jng', '../reference/jng/write_gray_jdaa.miff', q//, q//, 0.5, 1.0);
++$test;
testReadWriteCompare( 'input_gray.jng', 'gray_tmp.jng', '../reference/jng/write_gray.miff', q//, q//, 0.5, 1.0);
++$test;
testReadWriteCompare( 'input_gray_prog_idat.jng', 'gray_prog_idat_tmp.jng', '../reference/jng/write_gray_prog_idat.miff', q//, q//, 0.5, 1.0);
++$test;
testReadWriteCompare( 'input_gray_prog_jdaa.jng', 'gray_prog_jdaa_tmp.jng', '../reference/jng/write_gray_prog_jdaa.miff', q//, q//, 0.5, 1.0);
++$test;
testReadWriteCompare( 'input_gray_prog.jng', 'gray_prog_tmp.jng', '../reference/jng/write_gray_prog.miff', q//, q//, 0.5, 1.0);
++$test;
testReadWriteCompare( 'input_idat.jng', 'idat_tmp.jng', '../reference/jng/write_idat.miff', q//, q//, 0.5, 1.0);
++$test;
testReadWriteCompare( 'input_jdaa.jng', 'jdaa_tmp.jng', '../reference/jng/write_jdaa.miff', q//, q//, 0.5, 1.0);
++$test;
testReadWriteCompare( 'input_prog_idat.jng', 'prog_idat_tmp.jng', '../reference/jng/write_prog_idat.miff', q//, q//, 0.5, 1.0);
++$test;
testReadWriteCompare( 'input_prog_jdaa.jng', 'prog_jdaa_tmp.jng', '../reference/jng/write_prog_jdaa.miff', q//, q//, 0.5, 1.0);
++$test;
testReadWriteCompare( 'input_prog.jng', 'prog_tmp.jng', '../reference/jng/write_prog.miff', q//, q//, 0.5, 1.0);
```

--------------------------------------------------------------------------------

---[FILE: read.t]---
Location: ImageMagick-main/PerlMagick/t/jpeg/read.t

```text
#!/usr/bin/perl
#
# Test read image method on non-interlaced JPEG.
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#
BEGIN { $| = 1; $test=1; print "1..2\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/jpeg' || die 'Cd failed';

#
# 1) Test non-interlaced image read
# 
print( "Non-interlaced JPEG ...\n" );
testReadCompare('input.jpg', '../reference/jpeg/read_non_interlaced.miff', q//, 0.0001, 0.16);

#
# 2) Test plane-interlaced image read
# 
++$test;
print( "Plane-interlaced JPEG ...\n" );
testReadCompare('input_plane.jpg', '../reference/jpeg/read_plane_interlaced.miff', q//, 0.0001, 0.16);
```

--------------------------------------------------------------------------------

---[FILE: write.t]---
Location: ImageMagick-main/PerlMagick/t/jpeg/write.t

```text
#!/usr/bin/perl
#
# Test reading JPEG images
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#
BEGIN { $| = 1; $test=1; print "1..2\n"; }
END {print "not ok $test\n" unless $loaded;}

use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/jpeg' || die 'Cd failed';

#
# 1) Test with non-interlaced image
#
print( "Non-interlaced JPEG ...\n" );
testReadWriteCompare( 'input.jpg', 'output_tmp.jpg',
                      '../reference/jpeg/write_non_interlaced.miff',
                      q//, q//, 0.0001, 0.05);

#
# 2) Test with plane-interlaced image
#
++$test;
print( "Plane-interlaced JPEG ...\n" );
testReadWriteCompare( 'input.jpg', 'output_plane_tmp.jpg',
                      '../reference/jpeg/write_plane_interlaced.miff',
                      q//, q//, 0.0001, 0.05);
```

--------------------------------------------------------------------------------

---[FILE: read.t]---
Location: ImageMagick-main/PerlMagick/t/mpeg/read.t

```text
#!/usr/bin/perl
#
# Test reading MPEG files
#
# Whenever a new test is added/removed, be sure to update the
# 1..n output.
#
BEGIN { $| = 1; $test=1; print "1..2\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/mpeg' || die 'Cd failed';

#
# Motion Picture Experts Group file interchange format (version 2)
#
testRead( 'input.m2v',
  '2e30dd34e6cf2702188059bd8828930f39b1a7746a413f13f6d0dc98b9b0d3a6' );

#
# Motion Picture Experts Group file interchange format
#
++$test;
testRead( 'input.mpg',
  'e873cc6cc6eb5b5d11d5ddaaac92c6b86fec09e9721cbaafb8feca8c5be3c12a' );

1;
```

--------------------------------------------------------------------------------

---[FILE: read.t]---
Location: ImageMagick-main/PerlMagick/t/openjp2/read.t

```text
#!/usr/bin/perl
#
# Test read image method on non-interlaced JPEG.
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#
BEGIN { $| = 1; $test=1; print "1..3\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/openjp2' || die 'Cd failed';

#
# 1) JPEG-2000 JP2 File Format Syntax (ISO/IEC 15444-1)
# 
print( "JPEG-2000 JP2 File Format Syntax ...\n" );
testReadCompare('input.jp2', '../reference/openjp2/read_jp2.miff', q//, 0.0, 0.0);

#
# 2) JPEG-2000 Code Stream Syntax (ISO/IEC 15444-1)
# 
++$test;
print( " ...\n" );
testReadCompare('input.jpc', '../reference/openjp2/read_jpc.miff', q//, 0.0, 0.0);

#
# 3) JPEG-2000 VM Format
# 
++$test;
print( " ...\n" );
testReadCompare('input.j2k', '../reference/openjp2/read_j2k.miff', q//, 0.0, 0.0);
```

--------------------------------------------------------------------------------

---[FILE: read-16.t]---
Location: ImageMagick-main/PerlMagick/t/png/read-16.t

```text
#!/usr/bin/perl
#
# Test reading PNG images when 16bit support is enabled
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#

BEGIN { $| = 1; $test=1; print "1..5\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/png' || die 'Cd failed';

#
# 1) Test Monochrome PNG
# 
testRead( 'input_mono.png',
  'fa43f8c3d45c3efadab6791a6de83b5a303f65e2c1d58e0814803a4846e68593' );

#
# 2) Test 256 color pseudocolor PNG
# 
++$test;
testRead( 'input_256.png',
  '5798b9623e5922d3f6c0e87ae76ccc5a69568258e557613f20934f2de6ee2d35' );

#
# 3) Test TrueColor PNG
# 
++$test;
testRead( 'input_truecolor.png',
  'eb9adaa26f3cda80273f436ddb92805da2cb88dd032d24380cd48cf05432a326' );

#
# 4) Test Multiple-image Network Graphics
# 
++$test;
testRead( 'input.mng',
  '65c0eacf6e060b9fb8467eaa0f74e2dcc3ef72d06577f06a506bd0546b01fb61' );

#
# 5) Test 16-bit Portable Network Graphics
# 
++$test;
testRead( 'input_16.png',
  '6418d8dd1206c3566bac92a883196d448b4d3cc7c19581d95d43bda4f0b7e495',
  '2d30a8bed1ae8bd19c8320e861f3140dfc7497ca8a05d249734ab41c71272f08');
```

--------------------------------------------------------------------------------

---[FILE: read.t]---
Location: ImageMagick-main/PerlMagick/t/png/read.t

```text
#!/usr/bin/perl
#
# Test reading PNG images
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#

BEGIN { $| = 1; $test=1; print "1..6\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/png' || die 'Cd failed';

#
# 1) Test Black-and-white, bit_depth=1 PNG
# 
print( "1-bit grayscale PNG ...\n" );
testRead( 'input_bw.png',
  '7d12eaac6f41d3c2947022f382e158ea715e918ce0cd73649ec04db01239c88f' );

#
# 2) Test Monochrome PNG
# 
++$test;
print( "8-bit grayscale PNG ...\n" );
testRead( 'input_mono.png',
  'fa43f8c3d45c3efadab6791a6de83b5a303f65e2c1d58e0814803a4846e68593' );

#
# 3) Test 16-bit Portable Network Graphics
# 
++$test;
print( "16-bit grayscale PNG ...\n" );
testRead( 'input_16.png',
  '6418d8dd1206c3566bac92a883196d448b4d3cc7c19581d95d43bda4f0b7e495',
  '2d30a8bed1ae8bd19c8320e861f3140dfc7497ca8a05d249734ab41c71272f08' );
#
# 4) Test 256 color pseudocolor PNG
# 
++$test;
print( "8-bit indexed-color PNG ...\n" );
testRead( 'input_256.png',
  '5798b9623e5922d3f6c0e87ae76ccc5a69568258e557613f20934f2de6ee2d35' );

#
# 5) Test TrueColor PNG
# 
++$test;
print( "24-bit Truecolor PNG ...\n" );
testRead( 'input_truecolor.png',
  'eb9adaa26f3cda80273f436ddb92805da2cb88dd032d24380cd48cf05432a326' );

#
# 6) Test Multiple-image Network Graphics
# 
++$test;
print( "MNG with 24-bit Truecolor PNGs...\n" );
testRead( 'input.mng',
  '65c0eacf6e060b9fb8467eaa0f74e2dcc3ef72d06577f06a506bd0546b01fb61' );
```

--------------------------------------------------------------------------------

---[FILE: write-16.t]---
Location: ImageMagick-main/PerlMagick/t/png/write-16.t

```text
#!/usr/bin/perl
#
# Test writing PNG images when 16bit support is enabled
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#
BEGIN { $| = 1; $test=1; print "1..5\n"; }
END {print "not ok $test\n" unless $loaded;}

use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/png' || die 'Cd failed';

#
# 1) Test pseudocolor image
#
testReadWrite( 'input_256.png',
  'output_256.png',
  q/quality=>54/,
  '5798b9623e5922d3f6c0e87ae76ccc5a69568258e557613f20934f2de6ee2d35' );

#
# 2) Test truecolor image
#
++$test;
testReadWrite( 'input_truecolor.png',
  'output_truecolor.png',
  q/quality=>55/,
  'eb9adaa26f3cda80273f436ddb92805da2cb88dd032d24380cd48cf05432a326' );

#
# 3) Test monochrome image
#
++$test;
testReadWrite( 'input_mono.png',
  'output_mono.png', '',
  'fa43f8c3d45c3efadab6791a6de83b5a303f65e2c1d58e0814803a4846e68593' );

#
# 4) Test Multiple-image Network Graphics
#
++$test;
testReadWrite( 'input.mng',
  'output.mng',
  q/quality=>55/,
  '65c0eacf6e060b9fb8467eaa0f74e2dcc3ef72d06577f06a506bd0546b01fb61' );

#
# 5) Test 16-bit Portable Network Graphics
# 
++$test;
testReadWrite( 'input_16.png',
  'output_16.png',
  q/quality=>55/,
  '593d0b64579cbeb07a2f4d5fcc3ab77a320204580442a8b6a95ef141030427de',
  '2d30a8bed1ae8bd19c8320e861f3140dfc7497ca8a05d249734ab41c71272f08');
```

--------------------------------------------------------------------------------

---[FILE: write.t]---
Location: ImageMagick-main/PerlMagick/t/png/write.t

```text
#!/usr/bin/perl
#
# Test writing PNG images
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#
BEGIN { $| = 1; $test=1; print "1..6\n"; }
END {print "not ok $test\n" unless $loaded;}

use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/png' || die 'Cd failed';

#
# 1) Test Black-and-white, bit_depth=1 PNG
# 
print( "1-bit grayscale PNG ...\n" );
testReadWrite( 'input_bw.png', 'output_bw.png', q/quality=>95/,
  '7d12eaac6f41d3c2947022f382e158ea715e918ce0cd73649ec04db01239c88f');

#
# 2) Test monochrome image
#
++$test;
print( "8-bit grayscale PNG ...\n" );
testReadWrite( 'input_mono.png',
  'output_mono.png', '',
  'fa43f8c3d45c3efadab6791a6de83b5a303f65e2c1d58e0814803a4846e68593');
#
# 3) Test 16-bit Portable Network Graphics
# 
++$test;
print( "16-bit grayscale PNG ...\n" );
testReadWrite( 'input_16.png',
  'output_16.png',
  q/quality=>55/,
  '593d0b64579cbeb07a2f4d5fcc3ab77a320204580442a8b6a95ef141030427de',
  '2d30a8bed1ae8bd19c8320e861f3140dfc7497ca8a05d249734ab41c71272f08' );
#
# 4) Test pseudocolor image
#
++$test;
print( "8-bit indexed-color PNG ...\n" );
testReadWrite( 'input_256.png',
  'output_256.png',
  q/quality=>54/,
  '5798b9623e5922d3f6c0e87ae76ccc5a69568258e557613f20934f2de6ee2d35' );
#
# 5) Test truecolor image
#
++$test;
print( "24-bit Truecolor PNG ...\n" );
testReadWrite( 'input_truecolor.png',
  'output_truecolor.png',
  q/quality=>55/,
  'eb9adaa26f3cda80273f436ddb92805da2cb88dd032d24380cd48cf05432a326' );
#
# 6) Test Multiple-image Network Graphics
#
++$test;
print( "MNG with 24-bit Truecolor PNGs ...\n" );
testReadWrite( 'input.mng',
  'output.mng',
  q/quality=>55/,
  '65c0eacf6e060b9fb8467eaa0f74e2dcc3ef72d06577f06a506bd0546b01fb61' );
```

--------------------------------------------------------------------------------

---[FILE: input.eps]---
Location: ImageMagick-main/PerlMagick/t/ps/input.eps

```text
%!PS-Adobe-2.0 EPSF-2.0
%%Title: congrats.eps
%%Creator: fig2dev Version 3.2 Patchlevel 0-beta2
%%CreationDate: Thu Sep  3 18:27:20 1998
%%For: bfriesen@scooby (Bob Friesenhahn)
%%Orientation: Portrait
%%BoundingBox: 0 0 497 317
%%Pages: 0
%%BeginSetup
%%IncludeFeature: *PageSize Letter
%%EndSetup
%%Magnification: 1.00
%%EndComments
/$F2psDict 200 dict def
$F2psDict begin
$F2psDict /mtrx matrix put
/col-1 {0 setgray} bind def
/col0 {0.000 0.000 0.000 srgb} bind def
/col1 {0.000 0.000 1.000 srgb} bind def
/col2 {0.000 1.000 0.000 srgb} bind def
/col3 {0.000 1.000 1.000 srgb} bind def
/col4 {1.000 0.000 0.000 srgb} bind def
/col5 {1.000 0.000 1.000 srgb} bind def
/col6 {1.000 1.000 0.000 srgb} bind def
/col7 {1.000 1.000 1.000 srgb} bind def
/col8 {0.000 0.000 0.560 srgb} bind def
/col9 {0.000 0.000 0.690 srgb} bind def
/col10 {0.000 0.000 0.820 srgb} bind def
/col11 {0.530 0.810 1.000 srgb} bind def
/col12 {0.000 0.560 0.000 srgb} bind def
/col13 {0.000 0.690 0.000 srgb} bind def
/col14 {0.000 0.820 0.000 srgb} bind def
/col15 {0.000 0.560 0.560 srgb} bind def
/col16 {0.000 0.690 0.690 srgb} bind def
/col17 {0.000 0.820 0.820 srgb} bind def
/col18 {0.560 0.000 0.000 srgb} bind def
/col19 {0.690 0.000 0.000 srgb} bind def
/col20 {0.820 0.000 0.000 srgb} bind def
/col21 {0.560 0.000 0.560 srgb} bind def
/col22 {0.690 0.000 0.690 srgb} bind def
/col23 {0.820 0.000 0.820 srgb} bind def
/col24 {0.500 0.190 0.000 srgb} bind def
/col25 {0.630 0.250 0.000 srgb} bind def
/col26 {0.750 0.380 0.000 srgb} bind def
/col27 {1.000 0.500 0.500 srgb} bind def
/col28 {1.000 0.630 0.630 srgb} bind def
/col29 {1.000 0.750 0.750 srgb} bind def
/col30 {1.000 0.880 0.880 srgb} bind def
/col31 {1.000 0.840 0.000 srgb} bind def

end
save
-53.0 352.0 translate
1 -1 scale

/cp {closepath} bind def
/ef {eofill} bind def
/gr {grestore} bind def
/gs {gsave} bind def
/sa {save} bind def
/rs {restore} bind def
/l {lineto} bind def
/m {moveto} bind def
/rm {rmoveto} bind def
/n {newpath} bind def
/s {stroke} bind def
/sh {show} bind def
/slc {setlinecap} bind def
/slj {setlinejoin} bind def
/slw {setlinewidth} bind def
/srgb {setrgbcolor} bind def
/rot {rotate} bind def
/sc {scale} bind def
/sd {setdash} bind def
/ff {findfont} bind def
/sf {setfont} bind def
/scf {scalefont} bind def
/sw {stringwidth} bind def
/tr {translate} bind def
/tnt {dup dup currentrgbcolor
  4 -2 roll dup 1 exch sub 3 -1 roll mul add
  4 -2 roll dup 1 exch sub 3 -1 roll mul add
  4 -2 roll dup 1 exch sub 3 -1 roll mul add srgb}
  bind def
/shd {dup dup currentrgbcolor 4 -2 roll mul 4 -2 roll mul
  4 -2 roll mul srgb} bind def
/$F2psBegin {$F2psDict begin /$F2psEnteredState save def} def
/$F2psEnd {$F2psEnteredState restore end} def
%%EndProlog

$F2psBegin
10 setmiterlimit
n 0 5902 m 0 0 l 9202 0 l 9202 5902 l cp clip
 0.06000 0.06000 sc
% Polyline
7.500 slw
n 1005 600 m 900 600 900 5745 105 arcto 4 {pop} repeat
  900 5850 9045 5850 105 arcto 4 {pop} repeat
  9150 5850 9150 705 105 arcto 4 {pop} repeat
  9150 600 1005 600 105 arcto 4 {pop} repeat
 cp gs col0 s gr 
% Polyline
30.000 slw
n 5415 3735 m 5115 3735 l gs col0 s gr 
% Polyline
n 4335 3720 m 4035 3720 l gs col0 s gr 
/Helvetica-Bold ff 480.00 scf sf
5025 1950 m
gs 1 -1 sc (You can display an image!) dup sw pop 2 div neg 0 rm  col4 sh gr
/Helvetica-Bold ff 480.00 scf sf
5025 1275 m
gs 1 -1 sc (CONGRATULATIONS!) dup sw pop 2 div neg 0 rm  col4 sh gr
/Helvetica-Bold ff 360.00 scf sf
1500 3375 m
gs 1 -1 sc (2\) Use CNTRL-Q key combination) col0 sh gr
/Helvetica-Bold ff 360.00 scf sf
4575 3825 m
gs 1 -1 sc (or) col0 sh gr
/Helvetica-Bold ff 360.00 scf sf
1875 4350 m
gs 1 -1 sc (Depress right mouse button to bring) col0 sh gr
/Helvetica-Bold ff 360.00 scf sf
1875 4875 m
gs 1 -1 sc (up menu and select 'Quit' to continue) col0 sh gr
/Helvetica-Bold ff 360.00 scf sf
1875 5325 m
gs 1 -1 sc (tests.) col0 sh gr
/Helvetica-Bold ff 360.00 scf sf
1500 2775 m
gs 1 -1 sc (1\) Move mouse cursor into this window.) col0 sh gr
$F2psEnd
rs
```

--------------------------------------------------------------------------------

---[FILE: input.miff]---
Location: ImageMagick-main/PerlMagick/t/ps/input.miff

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

---[FILE: input.ps]---
Location: ImageMagick-main/PerlMagick/t/ps/input.ps

```text
%!PS-Adobe-2.0
%%Title: congrats.ps
%%Creator: fig2dev Version 3.2 Patchlevel 0-beta2
%%CreationDate: Thu Sep  3 18:27:58 1998
%%For: bfriesen@scooby (Bob Friesenhahn)
%%Orientation: Portrait
%%BoundingBox: 57 237 554 554
%%Pages: 1
%%BeginSetup
%%IncludeFeature: *PageSize Letter
%%EndSetup
%%Magnification: 1.00
%%EndComments
/$F2psDict 200 dict def
$F2psDict begin
$F2psDict /mtrx matrix put
/col-1 {0 setgray} bind def
/col0 {0.000 0.000 0.000 srgb} bind def
/col1 {0.000 0.000 1.000 srgb} bind def
/col2 {0.000 1.000 0.000 srgb} bind def
/col3 {0.000 1.000 1.000 srgb} bind def
/col4 {1.000 0.000 0.000 srgb} bind def
/col5 {1.000 0.000 1.000 srgb} bind def
/col6 {1.000 1.000 0.000 srgb} bind def
/col7 {1.000 1.000 1.000 srgb} bind def
/col8 {0.000 0.000 0.560 srgb} bind def
/col9 {0.000 0.000 0.690 srgb} bind def
/col10 {0.000 0.000 0.820 srgb} bind def
/col11 {0.530 0.810 1.000 srgb} bind def
/col12 {0.000 0.560 0.000 srgb} bind def
/col13 {0.000 0.690 0.000 srgb} bind def
/col14 {0.000 0.820 0.000 srgb} bind def
/col15 {0.000 0.560 0.560 srgb} bind def
/col16 {0.000 0.690 0.690 srgb} bind def
/col17 {0.000 0.820 0.820 srgb} bind def
/col18 {0.560 0.000 0.000 srgb} bind def
/col19 {0.690 0.000 0.000 srgb} bind def
/col20 {0.820 0.000 0.000 srgb} bind def
/col21 {0.560 0.000 0.560 srgb} bind def
/col22 {0.690 0.000 0.690 srgb} bind def
/col23 {0.820 0.000 0.820 srgb} bind def
/col24 {0.500 0.190 0.000 srgb} bind def
/col25 {0.630 0.250 0.000 srgb} bind def
/col26 {0.750 0.380 0.000 srgb} bind def
/col27 {1.000 0.500 0.500 srgb} bind def
/col28 {1.000 0.630 0.630 srgb} bind def
/col29 {1.000 0.750 0.750 srgb} bind def
/col30 {1.000 0.880 0.880 srgb} bind def
/col31 {1.000 0.840 0.000 srgb} bind def

end
save
4.5 589.5 translate
1 -1 scale

/cp {closepath} bind def
/ef {eofill} bind def
/gr {grestore} bind def
/gs {gsave} bind def
/sa {save} bind def
/rs {restore} bind def
/l {lineto} bind def
/m {moveto} bind def
/rm {rmoveto} bind def
/n {newpath} bind def
/s {stroke} bind def
/sh {show} bind def
/slc {setlinecap} bind def
/slj {setlinejoin} bind def
/slw {setlinewidth} bind def
/srgb {setrgbcolor} bind def
/rot {rotate} bind def
/sc {scale} bind def
/sd {setdash} bind def
/ff {findfont} bind def
/sf {setfont} bind def
/scf {scalefont} bind def
/sw {stringwidth} bind def
/tr {translate} bind def
/tnt {dup dup currentrgbcolor
  4 -2 roll dup 1 exch sub 3 -1 roll mul add
  4 -2 roll dup 1 exch sub 3 -1 roll mul add
  4 -2 roll dup 1 exch sub 3 -1 roll mul add srgb}
  bind def
/shd {dup dup currentrgbcolor 4 -2 roll mul 4 -2 roll mul
  4 -2 roll mul srgb} bind def
/$F2psBegin {$F2psDict begin /$F2psEnteredState save def} def
/$F2psEnd {$F2psEnteredState restore end} def
%%EndProlog

$F2psBegin
10 setmiterlimit
n 0 5902 m 0 0 l 9202 0 l 9202 5902 l cp clip
 0.06000 0.06000 sc
%%Page: 1 1
% Polyline
7.500 slw
n 1005 600 m 900 600 900 5745 105 arcto 4 {pop} repeat
  900 5850 9045 5850 105 arcto 4 {pop} repeat
  9150 5850 9150 705 105 arcto 4 {pop} repeat
  9150 600 1005 600 105 arcto 4 {pop} repeat
 cp gs col0 s gr 
% Polyline
30.000 slw
n 5415 3735 m 5115 3735 l gs col0 s gr 
% Polyline
n 4335 3720 m 4035 3720 l gs col0 s gr 
/Helvetica-Bold ff 480.00 scf sf
5025 1950 m
gs 1 -1 sc (You can display an image!) dup sw pop 2 div neg 0 rm  col4 sh gr
/Helvetica-Bold ff 480.00 scf sf
5025 1275 m
gs 1 -1 sc (CONGRATULATIONS!) dup sw pop 2 div neg 0 rm  col4 sh gr
/Helvetica-Bold ff 360.00 scf sf
1500 3375 m
gs 1 -1 sc (2\) Use CNTRL-Q key combination) col0 sh gr
/Helvetica-Bold ff 360.00 scf sf
4575 3825 m
gs 1 -1 sc (or) col0 sh gr
/Helvetica-Bold ff 360.00 scf sf
1875 4350 m
gs 1 -1 sc (Depress right mouse button to bring) col0 sh gr
/Helvetica-Bold ff 360.00 scf sf
1875 4875 m
gs 1 -1 sc (up menu and select 'Quit' to continue) col0 sh gr
/Helvetica-Bold ff 360.00 scf sf
1875 5325 m
gs 1 -1 sc (tests.) col0 sh gr
/Helvetica-Bold ff 360.00 scf sf
1500 2775 m
gs 1 -1 sc (1\) Move mouse cursor into this window.) col0 sh gr
$F2psEnd
rs
showpage
```

--------------------------------------------------------------------------------

---[FILE: read.t]---
Location: ImageMagick-main/PerlMagick/t/ps/read.t

```text
#!/usr/bin/perl
#
# Test Reading Postscript images
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#

BEGIN { $| = 1; $test=1; print "1..3\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/ps' || die 'Cd failed';

#
# 1) Test reading Postscript
#
$image=Image::Magick->new;
$x=$image->ReadImage('input.ps');
if( "$x" ) {
  print "ReadImage: $x\n";
  print "not ok $test\n";
} else {
    print "ok $test\n";
}
undef $image;


#
# 2) Test reading Encapsulated Postscript
#
++$test;
$image=Image::Magick->new;
$x=$image->ReadImage('input.eps');
if( "$x" ) {
  print "ReadImage: $x\n";
  print "not ok $test\n";
} else {
    print "ok $test\n";
}
undef $image;

#
# 3) Test rendering using a Postscript font
#
++$test;
$font   = 'helvetica';

$image=Image::Magick->new;
$x=$image->Set(font=>"$font", pen=>'#0000FF', dither=>'False');
if( "$x" ) {
  print "$x\n";
  print "not ok $test\n";
} else {
  $x=$image->ReadImage('label:The quick brown fox jumps over the lazy dog.');
  if ( "$x" ) {
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
    print "ok $test\n";
  }
}
undef $image;
```

--------------------------------------------------------------------------------

---[FILE: write.t]---
Location: ImageMagick-main/PerlMagick/t/ps/write.t

```text
#!/usr/bin/perl
#
# Test writing Postscript images
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#
BEGIN { $| = 1; $test=1; print "1..2\n"; }
END {print "not ok $test\n" unless $loaded;}

use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/ps' || die 'Cd failed';

#
# 1) Test Postscript
#
testReadWriteNoVerify( 'input.miff',
		       'output.ps',
		       q// );
#
# 2) Test Encapsulated Postscript
#
++$test;
testReadWriteNoVerify( 'input.miff',
		       'output.eps',
		       q// );
```

--------------------------------------------------------------------------------

---[FILE: read.t]---
Location: ImageMagick-main/PerlMagick/t/rad/read.t

```text
#!/usr/bin/perl
#
# Test reading Radiance file format
#
# Whenever a new test is added/removed, be sure to update the
# 1..n output.
#
BEGIN { $| = 1; $test=1; print "1..1\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/rad' || die 'Cd failed';

testRead( 'RAD:input.rad',
  '5927b5f4dcf084e5f5fd841df8e4dfb40e4fe637419d022fc6a0b52f02600881');
```

--------------------------------------------------------------------------------

---[FILE: write.t]---
Location: ImageMagick-main/PerlMagick/t/rad/write.t

```text
#!/usr/bin/perl
#
# Test writing Radiance file format
#
# Currently supported tests are for formats that ImageMagick
# knows how to both read and write.
#
# Whenever a new test is added/removed, be sure to update the
# 1..n output.

BEGIN { $| = 1; $test=1; print "1..1\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/rad' || die 'Cd failed';

testReadWrite( 'RAD:input.rad',
  'MIFF:output.rad',
  q//,
  '5927b5f4dcf084e5f5fd841df8e4dfb40e4fe637419d022fc6a0b52f02600881');

1;
```

--------------------------------------------------------------------------------

````

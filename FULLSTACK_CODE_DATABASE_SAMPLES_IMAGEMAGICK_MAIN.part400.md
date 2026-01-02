---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 400
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 400 of 851)

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
Location: ImageMagick-main/PerlMagick/t/cgm/read.t

```text
#!/usr/bin/perl
#
# Test reading CGM files
#
# Written by Bob Friesenhahn
#
# Whenever a new test is added/removed, be sure to update the
# 1..n output.
#
BEGIN { $| = 1; $test=1; print "1..1\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/cgm' || die 'Cd failed';

testReadCompare('CGM:input.cgm', '../reference/cgm/read.gif', q//, 0.0 0.0);
```

--------------------------------------------------------------------------------

---[FILE: read.t]---
Location: ImageMagick-main/PerlMagick/t/fpx/read.t

```text
#!/usr/bin/perl
#
# Test reading FPX images
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#

BEGIN { $| = 1; $test=1; print "1..5\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/fpx' || die 'Cd failed';

#
# 1) Test Black-and-white, bit_depth=1 FPX
# 
print( "1-bit grayscale FPX ...\n" );
testRead( 'input_bw.fpx',
  '164b30b0e46fab4b60ea891a0f13c1ec2e3c9558e647c75021f7bd2935fe1e46' );

#
# 2) Test grayscale FPX
# 
++$test;
print( "8-bit grayscale FPX ...\n" );
testRead( 'input_grayscale.fpx',
  '74416d622acf60c213b8dd0a4ba9ab4a46581daa8b7b4a084658fb5ae2ad1e4b' );

#
# 3) Test 256 color pseudocolor FPX
# 
++$test;
print( "8-bit indexed-color FPX ...\n" );
testRead( 'input_256.fpx',
  '772ef079906aa47951a09cd4ce6d62b740a391935710e7076a6716423a92db4f' );

#
# 4) Test TrueColor FPX
# 
++$test;
print( "24-bit Truecolor FPX ...\n" );
testRead( 'input_truecolor.fpx',
  'a698f2fe0c6c31f83d19554a6ec02bac79c961dd9a87e7ed217752e75eb615d7' );

#
# 5) Test JPEG FPX
# 
++$test;
print( "24-bit JPEG FPX ...\n" );
testRead( 'input_jpeg.fpx',
  '8c02bf8e953893cbd65b8a0a1fb574de50ac4cdeb2a88dbf702c8b65d82aa41b' );
```

--------------------------------------------------------------------------------

---[FILE: write.t]---
Location: ImageMagick-main/PerlMagick/t/fpx/write.t

```text
#!/usr/bin/perl
#
# Test writing FPX images
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#
BEGIN { $| = 1; $test=1; print "1..4\n"; }
END {print "not ok $test\n" unless $loaded;}

use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/fpx' || die 'Cd failed';

#
# 1) Test Black-and-white, bit_depth=1 FPX
# 
print( "1-bit grayscale FPX ...\n" );
testReadWrite( 'input_bw.fpx', 'output_bw.fpx', q/quality=>95/,
   '164b30b0e46fab4b60ea891a0f13c1ec2e3c9558e647c75021f7bd2935fe1e46');

#
# 2) Test grayscale image
#
++$test;
print( "8-bit grayscale FPX ...\n" );
testReadWrite( 'input_grayscale.fpx',
   'output_grayscale.fpx', '',
   '74416d622acf60c213b8dd0a4ba9ab4a46581daa8b7b4a084658fb5ae2ad1e4b');
#
# 3) Test pseudocolor image
#
++$test;
print( "8-bit indexed-color FPX ...\n" );
testReadWrite( 'input_256.fpx',
   'output_256.fpx',
   q/quality=>54/,
   '772ef079906aa47951a09cd4ce6d62b740a391935710e7076a6716423a92db4f' );
#
# 4) Test truecolor image
#
++$test;
print( "24-bit Truecolor FPX ...\n" );
testReadWrite( 'input_truecolor.fpx',
   'output_truecolor.fpx',
   q/quality=>55/,
   'a698f2fe0c6c31f83d19554a6ec02bac79c961dd9a87e7ed217752e75eb615d7' );
```

--------------------------------------------------------------------------------

---[FILE: read.t]---
Location: ImageMagick-main/PerlMagick/t/hdf/read.t

```text
#!/usr/bin/perl
#
# Test reading HDF images
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#

BEGIN { $| = 1; $test=1; print "1..2\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/hdf' || die 'Cd failed';

#
# 1) Test 256 color pseudocolor HDF
# 
testRead( 'input_256.hdf',
  '975cdb03f0fa923936f1cecf7b8a49a917493393a0eb098828ab710295195584' );

#
# 2) Test TrueColor HDF
# 
++$test;
testRead( 'input_truecolor.hdf',
  '975cdb03f0fa923936f1cecf7b8a49a917493393a0eb098828ab710295195584' );
```

--------------------------------------------------------------------------------

---[FILE: write.t]---
Location: ImageMagick-main/PerlMagick/t/hdf/write.t

```text
#!/usr/bin/perl
#
# Test writing HDF images
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#
BEGIN { $| = 1; $test=1; print "1..2\n"; }
END {print "not ok $test\n" unless $loaded;}

use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/hdf' || die 'Cd failed';

#
# 1) Test pseudocolor image
#
testReadWrite( 'input_256.hdf',
   'output_256.hdf',
   q/quality=>54/,
   '975cdb03f0fa923936f1cecf7b8a49a917493393a0eb098828ab710295195584' );

#
# 2) Test truecolor image
#
++$test;
testReadWrite( 'input_truecolor.hdf',
   'output_truecolor.hdf',
   q/quality=>55/,
   '975cdb03f0fa923936f1cecf7b8a49a917493393a0eb098828ab710295195584' );
```

--------------------------------------------------------------------------------

````

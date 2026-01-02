---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 391
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 391 of 851)

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

---[FILE: typemap.in]---
Location: ImageMagick-main/PerlMagick/quantum/typemap.in

```text
Image::Magick::@MAGICK_ABI_SUFFIX@ T_PTROBJ
```

--------------------------------------------------------------------------------

---[FILE: blob.t]---
Location: ImageMagick-main/PerlMagick/t/blob.t

```text
#!/usr/bin/perl
#  Copyright 1999 ImageMagick Studio LLC, a non-profit organization
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
# Test image blobs.
#
BEGIN { $| = 1; $test=1, print "1..1\n"; }
END {print "not ok 1\n" unless $loaded;}
use Image::Magick;
$loaded=1;

chdir 't' || die 'Cd failed';

$image = new Image::Magick;
$image->Read( 'input.miff' );
@blob = $image->ImageToBlob();
undef $image;

$image=Image::Magick->new( magick=>'MIFF' );
$image->BlobToImage( @blob );

if ($image->Get('signature') ne 
    'fb6fc68beb3b1001c5ebaa671c8ac8fddea06995027127765ff508f77723cc52')
  { print "not ok $test\n"; }
else
  { print "ok $test\n"; }

1;
```

--------------------------------------------------------------------------------

---[FILE: composite.t]---
Location: ImageMagick-main/PerlMagick/t/composite.t

```text
#!/usr/bin/perl
#  Copyright 1999-20.0 ImageMagick Studio LLC, a non-profit organization
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
BEGIN { $| = 1; $test=1; print "1..18\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't' || die 'Cd failed';

#
# Add
#
testCompositeCompare('gradient:white-black',q/size=>"100x80"/,
  'input.miff', q//, q/, gravity=>'Center', compose=>'ModulusAdd'/,
  'reference/composite/Add.miff', 0.003, 1.0);
#
# Atop
#
++$test;
testCompositeCompare('gradient:white-black',q/size=>"100x80"/,
  'input.miff', q//, q/, gravity=>'Center', compose=>'Atop'/,
  'reference/composite/Atop.miff', 0.00003, 0.009);

#
# Bumpmap
#
++$test;
testCompositeCompare('gradient:white-black',q/size=>"70x46"/,
  'input.miff', q//,q/, gravity=>'Center', compose=>'Bumpmap'/,
  'reference/composite/Bumpmap.miff', 0.03, 0.3);

#
# Clear
#
++$test;
testCompositeCompare('gradient:white-black',q/size=>"100x80"/,
  'input.miff', q//,
  q/, gravity=>'Center', 'clip-to-self'=>True, compose=>'Clear'/,
  'reference/composite/Clear.miff', 0.00003, 0.009);

#
# Copy
#
++$test;
testCompositeCompare('gradient:white-black',q/size=>"100x80"/,
  'input.miff', q//, q/, gravity=>'Center', compose=>'Copy'/,
  'reference/composite/Copy.miff', 0.00003, 0.009);

#
# CopyBlue
#
++$test;
testCompositeCompare('gradient:white-black',q/size=>"100x80"/,
  'input.miff', q//, q/, gravity=>'Center', compose=>'CopyBlue'/,
  'reference/composite/CopyBlue.miff', 0.00003, 0.009);

#
# CopyGreen
#
++$test;
testCompositeCompare('gradient:white-black',q/size=>"100x80"/,
  'input.miff', q//, q/, gravity=>'Center', compose=>'CopyGreen'/,
  'reference/composite/CopyGreen.miff', 0.00003, 0.009);

#
# CopyRed
#
++$test;
testCompositeCompare('gradient:white-black',q/size=>"100x80"/,
  'input.miff', q//, q/, gravity=>'Center', compose=>'CopyRed'/,
  'reference/composite/CopyRed.miff', 0.00003, 0.009);

#
# CopyAlpha
#
++$test;
testCompositeCompare('gradient:white-black',q/size=>"70x46"/,
  'input.miff', q//, q/, gravity=>'Center', compose=>'CopyAlpha'/,
  'reference/composite/CopyAlpha.miff', 0.00003, 0.009);

#
# Difference
#
++$test;
testCompositeCompare('gradient:white-black',q/size=>"100x80"/,
  'input.miff', q//, q/, gravity=>'Center', compose=>'Difference'/,
  'reference/composite/Difference.miff', 0.00003, 0.009);

#
# In
#
++$test;
testCompositeCompare('gradient:white-black',q/size=>"100x80"/,
  'input.miff', q//, q/, gravity=>'Center', compose=>'In'/,
  'reference/composite/In.miff', 0.00003, 0.009);

#
# Minus
#
++$test;
testCompositeCompare('gradient:white-black',q/size=>"100x80"/,
  'input.miff', q//, q/, gravity=>'Center', compose=>'Minus'/,
  'reference/composite/Minus.miff', 0.00003, 0.009);

#
# Multiply
#
++$test;
testCompositeCompare('gradient:white-black',q/size=>"100x80"/,
  'input.miff', q//, q/, gravity=>'Center', compose=>'Multiply'/,
  'reference/composite/Multiply.miff', 0.00003, 0.009);

#
# Out
#
++$test;
testCompositeCompare('gradient:white-black',q/size=>"70x46"/,
  'input.miff', q//, q/, gravity=>'Center', compose=>'Out'/,
  'reference/composite/Out.miff', 0.00003, 0.009);

#
# Over
#
++$test;
testCompositeCompare('gradient:white-black',q/size=>"100x80"/,
  'input.miff', q//, q/, gravity=>'Center', compose=>'Over'/,
  'reference/composite/Over.miff', 0.00003, 0.009);

#
# Plus
#
++$test;
testCompositeCompare('gradient:white-black',q/size=>"100x80"/,
  'input.miff', q//, q/, gravity=>'Center', compose=>'Plus'/,
  'reference/composite/Plus.miff', 0.03, 0.7);

#
# Subtract
#
++$test;
testCompositeCompare('gradient:white-black',q/size=>"100x80"/,
  'input.miff', q//, q/, gravity=>'Center', compose=>'ModulusSubtract'/,
  'reference/composite/Subtract.miff', 0.0026, 1.0);

#
# Xor
#
++$test;
testCompositeCompare('gradient:white-black',q/size=>"70x46"/,
  'input.miff', q//, q/, gravity=>'Center', compose=>'Xor'/,
  'reference/composite/Xor.miff', 0.00003, 0.009);

1;
```

--------------------------------------------------------------------------------

---[FILE: filter.t]---
Location: ImageMagick-main/PerlMagick/t/filter.t

```text
#!/usr/bin/perl
#
#  Copyright 1999 ImageMagick Studio LLC, a non-profit organization
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
#  Test image filters.
#
BEGIN { $| = 1; $test=1, print "1..58\n"; }
END {print "not ok 1\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't' || die 'Cd failed';
use FileHandle;
autoflush STDOUT 1;
autoflush STDERR 1;

$fuzz=int(0.05*(Image::Magick->new()->QuantumRange));

testFilterCompare('input.miff',  q//, 'reference/filter/AdaptiveThreshold.miff', 'AdaptiveThreshold', q/'5x5+5%'/, 0.0, 0.0);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Annotate.miff', 'Annotate', q/text=>'Magick',geometry=>'+0+20',font=>'Generic.ttf',fill=>'gold',gravity=>'North',pointsize=>14/, 0.05, 1.00);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Blur.miff', 'Blur', q/'5x2'/, 0.007, 0.7);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Border.miff', 'Border', q/geometry=>'6x6',color=>'gold'/, 0.0, 0.0);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Channel.miff', 'Channel', q/channel=>'red'/, 0.2, 0.8);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Chop.miff', 'Chop', q/geometry=>'80x80+5+10'/, 0.0, 0.0);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Charcoal.miff', 'Charcoal', q/'0x1'/, 0.3, 1.01);
++$test;

testFilterCompare('input.miff', "fuzz=>$fuzz", 'reference/filter/ColorFloodfill.miff', 'ColorFloodfill', q/geometry=>"+25+45"/, 0.15, 1.0);
++$test;

testFilterCompare('input.miff', "fuzz=>$fuzz", 'reference/filter/Colorize.miff', 'Colorize', q/fill=>"red", blend=>"50%"/, 0.00003, 0.004);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Contrast.miff', 'Contrast', q//, 0.00003, 0.004);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Convolve.miff', 'Convolve', q/[0.0625, 0.0625, 0.0625, 0.0625, 0.5, 0.0625, 0.0625, 0.0625, 0.0625]/, 0.1, 0.7);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Crop.miff', 'Crop', q/geometry=>'80x80+5+10'/, 0.0, 0.0);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Set.miff', 'Set', q/page=>'0x0+0+0'/, 0.0, 0.0);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Despeckle.miff', 'Despeckle', q//, 0.00003, 0.008);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Draw.miff', 'Draw', q/fill=>'none',stroke=>'gold',primitive=>'circle',points=>'60,90 60,120',strokewidth=>2/, 0.0, 0.0);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Edge.miff', 'Edge', q//, 0.31, 1.01);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Emboss.miff', 'Emboss', q/'0x1'/, 0.2, 1.0);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Equalize.miff', 'Equalize', q//, 0.2, 0.5);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Implode.miff', 'Implode', q/0.0/, 0.0, 0.0);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Flip.miff', 'Flip', q//, 0.0, 0.0);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Flop.miff', 'Flop', q//, 0.0, 0.0);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Frame.miff', 'Frame', q/'15x15+3+3'/, 0.02, 0.5);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Gamma.miff', 'Gamma', q/1.6/, 0.00003, 0.004);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/GaussianBlur.miff', 'GaussianBlur', q/'0.0x1.5'/, 0.07, 0.9);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Implode.miff', 'Implode', q/0.0/, 0.0, 0.0);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Level.miff', 'Level', q/'20%x'/, 0.00003, 0.004);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Magnify.miff', 'Magnify', q//, 0.003, 0.3);
++$test;

testFilterCompare('input.miff', "fuzz=>$fuzz", 'reference/filter/MatteFloodfill.miff', 'MatteFloodfill', q/geometry=>"+25+45"/, 0.25, 1.0);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/MedianFilter.miff', 'MedianFilter', q//, 0.0, 0.0);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Minify.miff', 'Minify', q//, 0.00003, 0.004);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Modulate.miff', 'Modulate', q/brightness=>110,saturation=>110,hue=>110/, 0.05, 0.5);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/QuantizeMono.miff', 'Quantize', q/colors=>256/, 0.2, 0.7);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/MotionBlur.miff', 'MotionBlur', q/'0x13+10-10'/, 0.002, 0.04);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Negate.miff', 'Negate', q//, 0.0, 0.0);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Normalize.miff', 'Normalize', q//, 0.02, 0.2);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/OilPaint.miff', 'OilPaint', q//, 0.08, 0.87);
++$test;

testFilterCompare('input.miff', "fuzz=>$fuzz", 'reference/filter/Opaque.miff', 'Opaque', q/color=>"#e23834", fill=>"green"/, 0.09, 0.89);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Quantize.miff', 'Quantize', q//, 0.2, 0.7);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/RadialBlur.miff', 'RadialBlur', q/10/, 0.004, 0.4);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Raise.miff', 'Raise', q/'10x10'/, 0.00003, 0.004);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/ReduceNoise.miff', 'ReduceNoise', q//, 0.0, 0.0);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Resize.miff', 'Resize', q/'60%'/, 0.00007, 0.07);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Roll.miff', 'Roll', q/geometry=>'+20+10'/, 0.0, 0.0);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Rotate.miff', 'Rotate', q/45/, 0.00004, 0.04);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Sample.miff', 'Sample', q/'60%'/, 0.006, 0.6);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Scale.miff', 'Scale', q/'60%'/, 0.00003, 0.004);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Segment.miff', 'Segment', q//, 0.3, 0.9);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Shade.miff', 'Shade', q/geometry=>'30x30',gray=>'true'/, 0.09, 0.9);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Sharpen.miff', 'Sharpen', q/'5x2'/, 0.1, 1.001);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Shave.miff', 'Shave', q/'10x10'/, 0.02, 0.8);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Shear.miff', 'Shear', q/'-20x20'/, 0.09, 0.86);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/SigmoidalContrast.miff', 'SigmoidalContrast', q/"3x50%"/, 0.00003, 0.004);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Solarize.miff', 'Solarize', q//, 0.0, 0.0);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Swirl.miff', 'Swirl', q/90/, 0.00003, 0.004);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Threshold.miff', 'Threshold', q/90%/, 0.0, 0.0);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Trim.miff', 'Trim', q//, 0.0, 0.0);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/UnsharpMask.miff', 'UnsharpMask', q/'5x2+1'/, 0.004, 0.4);
++$test;

testFilterCompare('input.miff',  q//, 'reference/filter/Wave.miff', 'Wave', q/'25x150'/, 0.00003, 0.004);
++$test;

1;
```

--------------------------------------------------------------------------------

---[FILE: getattribute.t]---
Location: ImageMagick-main/PerlMagick/t/getattribute.t

```text
#!/usr/bin/perl
#  Copyright 1999 ImageMagick Studio LLC, a non-profit organization
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
# Test getting attributes.
#
BEGIN { $| = 1; $test=1, print "1..25\n"; }
END {print "not ok 1\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't' || die 'Cd failed';

testGetAttribute('input.miff','base-columns','70');

++$test;
testGetAttribute('input.miff','base-filename','input.miff');

++$test;
testGetAttribute('input.miff','base-rows','46');

++$test;
testGetAttribute('input.miff','class','DirectClass');

++$test;
testGetAttribute('input.miff','colors','3019');

++$test;
testGetAttribute('input.miff','columns','70');

++$test;
testGetAttribute('input.miff','directory',undef);

++$test;
testGetAttribute('input.miff','gamma','1');

++$test;
testGetAttribute('input.miff','geometry',undef);

++$test;
testGetAttribute('input.miff','height','46');

++$test;
# Returns undef
testGetAttribute('input.miff','label',undef);

++$test;
testGetAttribute('input.miff','matte','0');

++$test;
testGetAttribute('input.miff','error','0');

++$test;
testGetAttribute('input.miff','montage',undef);

++$test;
testGetAttribute('input.miff','maximum-error','0');

++$test;
testGetAttribute('input.miff','mean-error','0');

++$test;
testGetAttribute('input.miff','rows','46');

++$test;
testGetAttribute('input.miff','signature',
  'fb6fc68beb3b1001c5ebaa671c8ac8fddea06995027127765ff508f77723cc52');

++$test;
testGetAttribute('input.miff','texture',undef);

++$test;
testGetAttribute('input.miff','type','TrueColor');

++$test;
testGetAttribute('input.miff','units','undefined units');

++$test;
testGetAttribute('input.miff','view',undef);

++$test;
testGetAttribute('input.miff','width','70');

++$test;
testGetAttribute('input.miff','x-resolution','72');

++$test;
testGetAttribute('input.miff','y-resolution','72');

1;
```

--------------------------------------------------------------------------------

---[FILE: input.fits]---
Location: ImageMagick-main/PerlMagick/t/input.fits

```text
SIMPLE  =                    T                                                  BITPIX  =                    8                                                  NAXIS   =                    2                                                  NAXIS1  =                   70                                                  NAXIS2  =                   46                                                  BSCALE  =         1.000000E+00                                                  BZERO   =         0.000000E+00                                                  DATAMAX =         2.550000E+02                                                  DATAMIN =         0.000000E+00                                                  HISTORY /usr/local/share/doc/ImageMagick-7//index.html                          END                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             ceigfgffi���������������������������fJNNMMLJOabTSQHA>>@??@ABB>;@XZGLV>cdfeeefhhr��������������������������VGMNOMMcGAGeYE=<<=>?=><:40.,0DFDF8defffeehis����������������������|Q?=CHFFHIJ]D?Fn]6;;<<;::620,-01BF:LM6eeeffedhgs��������������������yRHFJHJKIGEDDD>OW[r<56763220./113=@:FdY2eeeeedeef�������а����������XTVNMKJIHECBAABFLNO}V/5542121/115::?PVkf5eeeeeeefel��������pw�������zQ[bYPLIGEDCAAA?@ABELsj/554322303;<ISO_Yjp@ccccccdeebd�������mG������bR^_bXMKIHGGFEBB@@@@A@DS835556655>@0J�_a`kwPccccccdeecj������L7I���Y]_^a`^MJIHFGIIFBAAAB@:4G[A699765@D4,F�yeiowbbbdbbccddc^�����G;7.E�q\ccbbbb\KJIHGGHGFDBCBA?=8CcaN=331;F:14H��jqvvmabdbbcccddc\p��z;9<;G\a_deeeddcUKKHIHHHHFEEEEB??;H`de[N;AG>987R��wryyqabcbbcccdddc`aY>TWYgga^adbefcd^NJJIJIHGGFFFGFDB@>K^_bhgeY?8<98^���uz�taa`dcdcddccdaPA=VZk�lacfhikkfe^QOKIIIHGGHJJJIFBD@H[^`eV]nP<;8=o����w�yaaabbabbbbbbVEA?@eznZVZ\]^V[gkbQTPKIKMKOUYULIJHHDBW[beuoPfN97?z�����}|`aaa`ccabbbZICEHMkiWSXYYXUHJS\e]RTNQSQP\bcd^RKIJH@O`efbH/<L:9=y�����~{[\\\\___^]ZMHOY^lgVVXZXXZWHTSY[\]]XPOS^_^^_`_]OLJEGcafu�].768@x������}NNOPSWZfngYUV[adceRS[ZWYZULU\e`^`]_YSV\]\]]^]`]QNIFrjggn��X;2@v�������==<BKSd��w~rb\]_e]WVXXYZTQ]jRTV\^_]mx`\\\\_]^_TQPIbzjd6J���PCu�~�����0-0;NXp������{c\]]aqbTYWYSWXcTVWTU_`Xive\[\^^]]TVVQPvhfA17�š[t�{����./7C]`_�������{]^^iz�hUXYSYUfXWUV\\]]WZ^_ZZ^^_\WXXWWmmdY5.I�ʆw��}}|}�6:FMfmUb�������cZ[n���WTWWYUZUWWX]WS[YXTV]\]\\ZXYXYZ]|em@,1W��v���yy}BEOT`wuco������kW[m��}UQXZW[ZX[YTmgUWVVQSX]^][YYZZ\[Vwwf`5A6Uqw~��zwvuINTWT_|}iy���Ӻ�kt��i^X][hiZZWTZZ|w[id\^\[]]\]\XZY\ZWb�hkWOAY|����zqgkORTTTQ\zn����䳀�y]YUeqRbbUUVYty��ZUm�wZ[[Y^`\WZY[ZZS�yhe;Fv������}`YQQQQQRN\�z����|el]ZR`{ZUW_[V]tmrv`_Vo��qWbdXYa[WZZYVT��jjAY���������tOOOOOOPOZdgz���sa[\Q_]UYYd]YliVRWa`ZSjkdtd`^\`bU[YYS_��phU[���������{MMMNNNOQQPLa���rgb^ZQVXWZm_Z^]QPOQe�qXK?RUgXUQTiXZYZSf��~j`S����������MMMKMMNQQPO[{��acagcSN]^mkST[Y[ZVX\v�`SQ_qbWSPPd[[[]Pv���pf\w���������NNNKMNORPOWk���YZcefWO^]aQWVV_XUTSJSbZ]V[iY]VTUnYXYTQ����ui�|�u�������POPNNMMNNbz��p\^_ghcX^U]UTUXY[YYYVTRW^aaRT[UVUfWNPM`����{m����®�����QQOKIHJLS��������bbbbZeb_YYUX]XYXUXaVTSVVUY_dufVSSSRo�~���{�f���������ONIC=@GHP���������cb_\cc]]`QQX]ZTSTUW\ZVVVTiglVUUTUYy�������K���������IG@:7=FFO�������|g[jph[b\X[]ZVY[VTV^b[VY\Z^oe\TV\Wbiz�w~���zP���������@=626>IIX���¬�cP:9Lz�sfTOSV\^Ya`ZeeVWWRYYXlaSTZl`mqv{u{|~{j}���������8304;BKJc����pK@:<A?DRPLVRWSRYZWZ\`XWXYVVUbrXRT\efjunsy|{x�i����������0.38>DJJW�|WB5228=AB;434HSQOVYUQSZQVZYXUVY]cbZQTckkmltuvzk�g�������뿸358<BFHHEIA<:998:=BB@<9:>\NJUPKSWWZVWWYYVVlrjaS_fgjhjjpr}vs�������ϋ}67=@BDDED?=><:879=ACA>;<;OoSNZRV\OW]__b^R]li}ddl\[_bghmqsDCw�����αub89>?@BAA@><;;8558<?CC?<;<:TYQ_YTWWVVVMGYfl\ersXYiqx�xsjX55@]~�����v[779:=<:88621233478:>@?:8898767?MSPLMHGIBflQWbyw������c;+)-+/Nmz�����}T2336631/1.*++.010037::62352016CIILOOLJJHDDLTZj�����}`:'&*+*'%Y�������S//0100.++*)))*--,,-0463125743CNPLSONLNLHHFHTW_����rY:)))*+-,'a�������W/...+**'***)(+---+,.254359;:ALPRZ_RONMLJHGHLTVh��}W>0*----/,*l�������`----++**,,,,--.-//.03567;@@?DMU]egVRQPNMKKKJPX^w�aA500//011.,d��r]m��b,-/.-.--,----..01125477:=DFFHWaedcYTTSQNNMLKNT[aa>543322220.3T�vD66DPY./122102220..0//01358>@?AEKOQ_efed_VVUSPNMMLNPY_W964331000,6Lf�oDD^�nW/0344312110.-..-.146:@CBCDMTY`egec`XVVTQONNNPQY\V>63320//.-<Uo�sLOw�zV                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
```

--------------------------------------------------------------------------------

---[FILE: input.miff]---
Location: ImageMagick-main/PerlMagick/t/input.miff

```text
id=ImageMagick  version=1.0
class=DirectClass  colors=0  matte=False
columns=70  rows=46  depth=8
colorspace=sRGB
resolution=72x72
page=70x46+0+0
rendering-intent=Perceptual
gamma=1.0
red-primary=0.64,0.33  green-primary=0.3,0.6  blue-primary=0.15,0.06
white-point=0.3127,0.329
date:create=2012-06-16T20:11:10-04:00
date:modify=2009-09-05T17:47:34-04:00

:0/-20.62/83.:3-92-80-91.80-80-7/,5-*4,)5-*5-*1-'1.'41*74-96/?:/F?3JB4LA2NB2UA2tD4�C3�A5�E=�DG�CF�=B�<@�@;�?/�?-�@-�A+�@+�?.�=,�=+�=*�?.�?3�B3�D6�F9R:/:5372172/61.30,//-0/-3,-6+-P78�IG�bn�|�lp�PHnRLauw|���z|lYVS/.,0/-50-71-81,80,6/,81-81-81.7.,4-*4,*6/+6.+3/*30*41+63-750>8-E=2H?1I>.K@/MD3iE4�@.�<-�G<�DG�BE�<A�<@�A;�?-�?+�?,�@+�?+�>.�=,�=*�;*�>-�>3�@4�D8�H;D7,95593162/62.11--1.00.5/.2*,E21xA5�Y\�}�cl�J>kK@\]^g��~lp_YWS,,,,-+0/,1.+2,(2-*0,+2,+2++2,+2,+1,+1,)3-,3-,3/,31,40,52-750:3,>6-@6-C8-H;/EE5UD4m=+�9(�E4�H=�E@�<>�>=�A0�@*�?-�>-�?,�>)�>,�=-�<-�;.�?/�B1�@8�GD�WN<?5;4193.53.14/-4.,40/3/12000.3-+I.!lMN���kq�H==1X54H>FFISIYZO,-/+-/.--/-)/*'-+(,**,**.++.++.++/++/--0,,0-./-*2.,2.+2-,30.82/<4/>4/A5-F91H>7Q<5_70y7-�;/�A3�E9�E@�HA�B/�@,�>-�=/�=-�=+�<+�<,�<.�<2�C7�G:�E@�g_��yWeWCB875+/1*.1+-0,-0//0.02./2./-24*,gcb���~��ip�Y\o`pr���|��_eQ,/2+/2..0-.--+),*++)+('(**+,*+,*+*))*()-+,.-./,+0,+.*)/++0--811<32;21>0.A2/A73B:6K62h7/�=0�>5�A3�D7�G<�?3�?,�=+�;-�<-�;,�9)�9*:.?7�G@�E>�UR��{���r�pSZG<@301(-)'2,+2,+0,*0-+0/+2*10)(eqR�������ʳ�ǰ���������YdJ.0.//-/1.21.30-3/,2-*-*+,+,*)-+(,-',+(),*)--+/-,.+*/+)4,)6/*;3.=40;1-;/.>/.>3,59/93,O,'i:-�A1�@1�;-�B2�>2�</�=.�?/�</�9,{;,v:*};0�G;�KD�QO��p������w�y\{ZN^G=:32'(/')-(+0(,2(/1+00*0+'[f@��v��v�Ɍ�Ó��~���v�pO[D23-34-53.961961:2.80-3.,300-.0/(/1)./*,1.*10*01./004/+;1+A5,C8/A90=5-;0/<1/E1-R).F*.70)R/(j9.�:7�94?5�B6�A1�>-�:+�;*v>)v8,s9-{@4�G>�NE�dVz�q{�����v�|e�gd�ePfP4=0*&#.$&+**)+,'+/''-)$"W\H~�j{�j~�o�o}�t~�{o�lLVD782782994<:5@=8B:8A95=73<75:549009//61.62.63.641973?72B90H=1J>4H=4B80@61?62<94C54A50<6*E5'c6-�=;�BA�C;�>6A5~:/y;/u>.z4)�PL�[VpJ9kS@s`IzX�f`�zr�����~��v��xo�oXiM?;)3)"%+!+/&:&*C))TN:hqRh�Wk�\n�ck�hs�tt�th�dNXC8939:4>>8A?:D?:FA<EA:E@:G?8E=4D;1C:3C:3<8095/94/<70B<0I=0OA2P@5K<4E:1A:1=<3G70�EJ�GI�C:�KH�F9�?3�C5�E1�@2�>B�CEvC9y:4�<H�EG�UPpYC`jH�lS�SZ�(H�)K�@V�M_�Yh�fn�jr�_m�Wk�Pb�FOR.(>3(G@-e^:w�\n�\m�Ys�d~�{������d}_S_G671681==8B@;FA?HC>HC>JD<MB7J=0H<-F=/E;0A91<71:7.>9,E</M?/OA0O>1K;1D:/>=17=0�B@�K]�35�;#�?5�;0�>3�D7�:(�>2�>8�8?�<<�D?�7;�.'�B:�dO�cJ�c^�;E�BC�FO�.E�,H�0T�4\�:h�:o�Ar�Go�Zx�[fa=3HC/vd�����������������Ӱ��g{eWgL330551883=<6DC9GG>JI;MI6IE7MHJH@9E;+C9-?80>83=71>94@=9IA6P@-H?-K81C745=0@?/�I@�4+�4!�A&�:$�6'�=2�A1�@2�@4�8)�1+�++�0)�6%�5!�9,�UI�UQ�AK�?A�;.�E;�AD�>H�AQ�=V�>h�>q�Ew�Jn�Wx�Y�]n�nd�����������������������҅��u�n10-/.,43/892>?5GD;OK8MK4XWW���|x�[ToF?O94462&52):9.B=-K@/P@/C;*:4)040B1-�6<�;/�<'�;%�>,�=1�;1�9*�:+�?2�3*�4,�8.�1+�/(�5 �4!�9,�?6�CA�A>�>3�9(�=-�E@�FK�DK�DX�Bb�Jt�K}�Mz�Tt�Cc�{��_T������������������������������:8163-30+74,<;2IA6VJ9TH:dar��䬲���쏏�nm�LIX@?M<99A=(BC.8A9:EQEUaFSRaG<�F7�=+�A-�;(�6*�80�:4�82�:3�;2�?7�1'�-(�-(�2(�7!�7"�5(�C<�VM�>2�:#�:)�@7�HF�GH�FJ�O\�F`�Jn�Rz�Xz�Uq�Sg�`p�KU᪤���������������������������D@5A=3;6-52(:5/F=7TG6WF7]Uj��ޫ�����������|�f\�RLs7:C:97RJN�s�����]{�KP�<'�9#�:*�;-�<3�;3�61�>9�<7�8/�D9�?4�))�++�2,�2%�<(�:*�7-�LH�C@�9$�9(�>2�QI�E>�NI�QS�Ta�Vn�No�Ux�Wo�Zi�We�OT�tn���������������������������OI;MG:F@5?90=60A=8ME5SD.WLS�����������������틍�oz�ae��N_�OW�L]�HR�;>�>>�>5�>/�?2�>4�9/�3+�7/�8/�3)�3$�9"�>0�8;�05�20�54�53�7+�>/�PJ�EI�=3�8+�<-�C2�=-�H=�NJ�\a�fv�Pm�Zu�rx�bp�{��ueVPA���������������������������WN?VM?PI:KB4F<1E@7LG5SG.VNQ����������������������v��AN�<?�;7�@1�F;�=A�9<�@:�E9�6(�2+�41�;/�7)�4!�6!�7&�5)�5+�8.�42�-5�*0�1)�5$�LA�HI�MK�8.�:(�;'�;*�</�@3�^V�nm�gp�gq�tr�ou�z���|AQ3���������������������������[PA[OAYM?TJ:TG9NG<RJ9WK4XQT����ԕ�䙢씟؈�Ї���i��=P�@:�>C�?F�>;�GF�>A�?;�=1�?0�;+�:.�93�3/�4.�8*�;+�;6�<9�9%�9!�3&�5/�7+�8&�=)�>5�@B�US�G=�9)�:*�<-�<.�:*�VG�mj�ag�bm�nq�dl�Wpu�iXnE���������������������������[N>ZN>[N=XM<ZL<WK?XL<ZL8ULGd_uwx�������{{�fm�|Rb�;F�3?�E>�CN�BG�@5�C;�41�B5�;)�9%�:%�8(�4+�13�,3�-1�.8�(>�(0�0'�8(�;2�=4�D6�6&�5)�75�./�4*�5*�J>�>1�6*�:+�7&�H>�qr�s~�r{�s{�Ve�Da��}}�g�̮��Ưʪ�������ǚ�պ������[L<[L<\L<YI;ZK;[L>^M<^P<[NAYLI^Sdme��ě~��q��@G�>+�@9�<@�BJ�<7�9(�B8�;8�D:�7$�;(�8'�4'�9.�4'�,$�)'�%2�6�'6�<D�1:�0:�+.�85�GG�64�;6�5*�8&�8+�QG�<3�91�:3�8+�8-�kk����z��r�Md�?\��^g�Q|�\a~Qe�Yy�h��t��y�����ŵ�[K:[K:YK:YI9[K:]J<^K<^O;^O;_N:_KHaWw|w���ew�4K�@F�C@�BG�C@�;.�8&�@6�8;�ME�PA�6(�4*�60�1/�19�-<�*<�-H�.W�Qc�\m�8O�05�7&�C6�SN�C@�9.�7$�;%�8)�FB�83�31�00�91�4'�\W����|��k|�Ha�>UYa7e�N��d~�m�p��o��p��o��q���ÿ�\K7\K6\K6]L7]L9]L;^M=]P=]P=aM:cG>g]q������uq�KU�?Q�=G�<=�>4�;*�>/�83�3+�9'�MA�A3�:.�79�2>�"/� -�!+�%7�;V�cp�NS�:5�6$�-�:0�86�IE�;0�8+�8+�8/�J@�3.�.1�-0�2,�4%�ME����{��Yt�?a�@SIY1p�[��o��q|�f~�f�k~�e��n������^M:^M:^M:^M:^M:_L7^N9VNAaXYo`mmdppx���ꙃ͹v|�d\�MU�9A�77�B2�:+�G>�B9�6+�6'�4.�D7�<.�03�DN�CG�/-�,(�23�>C�?C�78�3.�OJ�OQ�IG�UU�EA�B:�<7�2=�7?�>:�1*�20�.2�0.�4%�H<����q��Fh�<d�AGNb<r�Zy�cu�`v�_z�d{�d{�Z��h��vl�g_O=_O?_O>_O=_O=`P7\L9_[a}|��}�qv�|�ƚ�Ǻ��ȶ��pR�LA�HJ�79�:2�7.�I?�fX�@3�2+�1,�=1�7)�-)�55�RX�JQ�QV�V[�@B�9?�-7�JV�oz�fv�RN�53�A<�E<�40�,:�5?�63�4*�2/�.2�/-�5)�<3����bw�>c�Ad\;/L_>u�^{�co�Wr�Xx�^y�[w�V��a��he|V[M=_P@_RB`RC`R@\OBcYaww�w|�cj�zz֯�������諸���yd�lg�WZ�6:�63�:1�OA�XI�1'�><�@7�0%�-'�3*�95�SW�Vb�do�ag�/7�(6�FS�^f�T[�73�64�82�80�:5�;;�65�5+�6*�0-�/4�0/�9.�82�w��Rp�<d�J[=<&AJ0h~St�Xh�Lm�Qs�Zs�Tl�Mb�ENj4Ia4TH8YL<_RBbVD`S?f]b{y�tz�]f�lv�������������·����oje�jd�yu�ge�DA�=5�<1�B2�<-�GF�IF�70�60�9+�:&�=6�:A�[g�W^�73�BI�?F�79�56�51�30�:/�;3�65�78�64�6-�7(�1+�35�0/�4*�DB�hu�;d�@h�MGRP<EB-O_9i�Le�Dg�Kn�Uh�L^�EY}CWoB[sDDB6JE<\M>`S>e_Xzt�sp�]_�ii���ߝ�ޢ�֠�֞�Ε��pg}^VR|SH�YQ�ys��|�^Z�6-�5#�;*�:0�7,�9/�8/�<*�@1�=4�73�PL�KB�6$�/0�(:�'?�:�#8�.6�:5�<5�75�35�40�7)�9&�6&�5-�5)�4'�V\�Pk�8e�@X95#AB378!QZ4dyN_�Ac�Dl�Nh�Gc�Ic�JfIbD47-::4OD;VL=gellj�QQ�[]�y{Ή�݌�ш�͈�ҍ�ȇ��~Zj\[LpWD�SV�fk���z�;-�;#�;)�6+�;+�6(�:-�8(�:-�:/�:0�?5�:.�1'�/7�+=�*>�$:�&9�5=�:6�;4�54�48�6/�7)�8&�6$�9&�;%�=4�Wl�7c�Cjk3=#/%/4^Y2���s�`]�>m�Kp�Qk�Hi�Me�Jf�Hg�G*0&+0+975EC=Z\i\]�[Z�y|օ�낂ځ�ʃ�ҋ�ۍ��~x�sWR`_Hd_C�WP�Zc�nj�K@�7&�<'�8+�1(�>+�:(�G;�9+�:)�7(�7(�</�;0�6;�1?�-;�36�58�7;�65�85�:8�78�6;�84�8*�:)�:'�=!�<&�KM�Bg�6g�CO3648+/DN)��y�՚q�\]�=r�No�Rf�Eg�Me�Kf�Gk�J.2&+.(01+:=0LONXVmnl���ꓐ��ф�Ǎ�Ύ���w�la]^]Gf]Ij\E�YC�RQ�==�0+�7&�7&�5+�5)�=+�<+�D9�8)�:(�9(�4(�2)�;4�8<�/:�EJ�VQ�A=�82�84�88�8<�7<�59�;6�8)�=*�=*�9#�5)�P`�=_�I]K@1-3%J3'��e�Ԍ��|Kc9`=l�Id�Ge�Ck�Oi�Of�Ep�P@>0>=4<=2AE*LM:UTAecg������z�ws�z�yon_WlYGh\Kj^N_O�K<�5.�0+�4*�8$�=$�9,�;)�7&�=5�IB�9'�:)�9-�<4�;7�:8�86�HI�ZX�C=�:7�92�84�68�8>�6=�7;�?7�;+�;'�;(�6#�ID�Uh�MX�]O39"FO)u�_��i��jIT<<H,g~Cj�Fa�Ek�Kl�Po�Qm�Mv�VUM>VM?VN?VP=\RC`WBbYKmckwj|pdm]W[WUR]VGfZFn_HjdO�ZO�RG�:,�4+�7/�7.�6*�9)�:,�<+�5"�9-�<4�H:�B9�>9�<<�68�;8�=2�9*�;-�<5�6:�6:�86�92�96�88�;=�@8�;,�;(�8$�6'�YZ�TV�YR�cK`x;��qv�YO];;=.23+;C1fGo�Jj�Mm�Rj�Gq�Kx�Uq�WcZKe[Ke[Kd[Le[Mg_Jh_Hg^Mg]Lf\I`ZGQN=LH7SP>[ZF__O�aY�JL�40�=)�:*�9+�8*�7*�:+�=/�5�?)�7*�9/�49�6<�6;�5<�64�8&�9&�:)�>4�98�67�85�<3�>9�>>�@;�8+�:(�:(�7"~:*�RJ�TI�\S�n]��sScB'258176/9909C0g�Kw�Qp�Sp�Oo�Ix�Uw�Y`�Jh_Pi`Qi`Qi`Qh_PkbTjbSi`PibLibHhbK`ZFLJ6@E4@H8CJ>UM;�XO�DF�:,�7%�8)�:)�:(�9)�;/�6�9�8*�;5�@E�>;�61�:5�9-�>*�A+�<'�6)�<5�=7�?6�D9�A9�83�8*�8'�<)};(w3"�A3�SG�ZN�YS�YMAM+'2%7><KM@=;(7:/8@-h�Kv�Pq�Pp�Jy�V}�bb�I`�Li`Qi`Qi`QjaRjaQk_Zk__kaVkaTkaXlaRkbNZVDDF8<C55C1?C)�ZF�]Y�JM�;0�9+�<0�=1�>2�@:�>3�C3�HA�IE�EA�=/�F2�C1yA-�:+�<,�=,�8*�:.�;0�?1�<.�6*�7,�<,;*{;,s9*v5(�H;�OB�SN�VW�o_fvIGV4^kQKQ5:;#88/8B/i�Lw�Pp�Nr�P}�`f�Nb�Jb�Mi`Qi`Qh_PlcTkbSmbWlbUldOldPlbVmbUmcThaQVP@EA18A'�K@�>@�NO�im�NJ�C<�E?�HC�IF�GK�LK�IH�AC�BA�@=�=0�A2�<1�:3;2~;1z;/z;+{:+�8,�8,�8(�:*�<,8+{3(y6,p4)v=1�Q@�TG�QM�[SWX@Oe=`vFCW-6@*:<279/8@-_yAx�Qp�Qw�Yj�S\�Gg�Ja�Ii`QjaRlbTjaRjaRkbSkbSkbRlcSlcTpbRpaUf_RfaP_YCA@%rM<�EC�BC�ON�LL�CB�@9�E;�DE�@E�CE�DC�A>�B>�A<�9/�=/�<3�82�;/�;.:-|:.|:/{91{8/|9.z:.x9/u8.r6+o4*l2'v@6�TL�QM�UMyeOZnJUmDM_:9C(89,;=34;089)Vd>t�Tx�\r�\Z�C_�Ie�L\�GhaQibRjdSibRibRjbSkbSkbSlcTlcTmaTfZPspi������}{j7>+3<(<=/?;.^B5�HE�AE�><�DA�DD�DD�FD�F?�F=�D>�=4�=,~>/�9.�:+�:+:,~:/~:0{90y8/w9/v90t:.q6-n3+k4)e1%s=2�RN�YR_R_\HES;2?);E0BJ69A04;.49578,LW3r�S{�^`�IZ~Ca�Ia�KX|GhbRibRkcSibRibRjbSkbSlcTlcTkbRe]S��|�����������ՠ�|CJ25?+:72*0+Z?>��XU�9:�@D�BD�AB�C?�E;�B:�B8�;,=,�<+�:+}9-}9/}:0|:1w:3s8/p6,o8-n7+n6/k4,g3*`.$p8/�UQz\ONO>5@1/5,330.3+4>1;K80>.-2/54+AM/s�Yn�TTu?Z|E_�L_�IWwHhcShcShcShcShcSjcSlcTmdUmdUlbQlje�����������������̝�KO1=6)OHF����������qq�=:�@<�@@�>?�B=�@<�C<�;1�=/~<,:.{9/|90{<3z<4p;1k8-i7-h8-h8.k70i6-a0'Y+m=4vTNG@3.9)1<.7:2686280-9*6D29H616,,-"@J1z�m^�MQo<VsB\yGb�LQjEgdSgdRgdRgdRfdRicRlcUmdUmdSjaQddd���������������������rnWAJ<���������������޲��OA�80�A<�B=�E@�?;�<3�=3~<1~:.|9/|90z92v80j8/h8/f7,e7-e7,i60i70f6.h;2nLB88314,37-56+37)/9+09*.8*/8,8A2;C201$DM:o�jGj=Lk<Li;WuFb�NCV;heVheWheWheWheWieVkdZneWhfQnlh����������������������ٸpsWo{j��������������������ػj^�8+�@6�H9�E6�B7�?6�;2}92x8/u7.s7.o5+j70h70f5/g6/i70l71l</gF4�q_nk[)2(17.07-16*05,/3-/3-/4..1,.5.2?43@3@M:IX@BU8Mg@Gb9XrJ]xT4D5heVheVheVheVheVgeUkd[ndXghP}�~����������������������ҷ������������������������������ǣ��E4�9.�<9�:;@=pB<q@6q?5o?4j<2h:1q62m51j7/g91g>4fF9cJ5_M5iQYF*1(07,17-06,/3,-2-.3--2,,0+,3,)4--8-2>-2>*6C.DV;H]=^qRZlS,8.heVheVheVifWifWjeVlc\ngZhiQlup����������������������������������������������������������Լ�kS�?.�6*8,oA3r=7s?9sA;o?8n=6q94l:3d=2^>2P;+UP9]X=]]?nv\2@+27/28.39/28-/5,.3-.3-,1+*/)+0++3+*4,-5,7@59C43>,>J4\hTQ]O+4-gdUheVifWifWifWjeVnc\lhZflShwo����������������������������������������������������������������ì�u]yH1e6"e3)j90l?4i>4h>2cA7_D5YG5e]GEF/9C'EI+ppR\`G29'7=57=37>48>38<57;66;5271.3-,1+(.(*.*,1,/2/=D==J81?(BP<EPD/90ddSgdUhgWieWhfWkeVnd\lhZdkRdwo����������������Ҷƿ�������������������������������������������������������ѽ�hS;XD,]K2\L4VO:QN7MO8^gK@L0=E*GJ+igJ`YDFF5:?5:>58>49?59@8;A;:>9:@:9=87;6062,1,+/.)-.)3)6J29L38I1;K8/;.\gO_iRgkWihXlfXlgYkf[hgYelY|��������������������ɾ����������������������������������������������������������mgKRK-UO2SO3PN4LO6HO5EN.LS0]e@aeFVV=WT<UR9MI6CB5<?58A58C59A79A6:B7;C8<E<;E:9@55=66D/G`5Gb<:M8@R:H\A4B1
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 398
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 398 of 851)

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

---[FILE: write.t]---
Location: ImageMagick-main/PerlMagick/t/write.t

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
# Test writing formats supported directly by ImageMagick
#

BEGIN { $| = 1; $test=1; print "1..32\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't' || die 'Cd failed';

print("AVS X image file ...\n");
testReadWrite( 'AVS:input.avs',
  'AVS:output.avs',
  q//,
  '74136c90d3e699ea5bcbf4aa733aff0dc822b6af72fce00f0c7647bcb0d49f66');

print("Microsoft Windows bitmap image file ...\n");
++$test;
testReadWrite( 'BMP:input.bmp',
  'BMP:output.bmp',
  q//,
  'd7324c919f04f4c118da68061a5dbb3f07ebab76b471ecfb0ac822453f677983');

print("Microsoft Windows 24-bit bitmap image file ...\n");
++$test;
testReadWrite( 'BMP:input.bmp24',
  'BMP:output.bmp24',
  q//,
  'fb6fc68beb3b1001c5ebaa671c8ac8fddea06995027127765ff508f77723cc52');

print("ZSoft IBM PC multi-page Paintbrush file ...\n");
++$test;
testReadWrite( 'DCX:input.dcx',
  'DCX:output.dcx',
  q//,
  'fb6fc68beb3b1001c5ebaa671c8ac8fddea06995027127765ff508f77723cc52');

print("Microsoft Windows 3.X DIB file ...\n");
++$test;
testReadWrite( 'DIB:input.dib',
  'DIB:output.dib',
  q//,
  'fb6fc68beb3b1001c5ebaa671c8ac8fddea06995027127765ff508f77723cc52');

print("Flexible Image Transport System ...\n");
++$test;
testReadWrite( 'FITS:input.fits',
  'FITS:output.fits',
  q//,
  '1c773aeac90d47c684c5170fcee16e0c8d4b399f76809c97bcd92ea7e47b1ab4' );

print("CompuServe graphics interchange format ...\n");
++$test;
testReadWrite( 'GIF:input.gif',
  'GIF:output.gif',
  q//,
  'd7324c919f04f4c118da68061a5dbb3f07ebab76b471ecfb0ac822453f677983');

print("CompuServe graphics interchange format (1987) ...\n");
++$test;
testReadWrite( 'GIF87:input.gif87',
  'GIF87:output.gif87',
  q//,
  '153b1c806e673a635edc645a92c60d565b58a2aec2417cee1f2e507d8ede27e4');

print("Magick image file format ...\n");
++$test;
testReadWrite( 'MIFF:input.miff',
  'MIFF:output.miff',
  q//,
  'fb6fc68beb3b1001c5ebaa671c8ac8fddea06995027127765ff508f77723cc52');

print("MTV Raytracing image format ...\n");
++$test;
testReadWrite( 'MTV:input.mtv',
  'MTV:output.mtv',
  q//,
  'fb6fc68beb3b1001c5ebaa671c8ac8fddea06995027127765ff508f77723cc52');

print("Portable bitmap format (black and white), ASCII format ...\n");
++$test;
testReadWrite( 'PBM:input_p1.pbm',
  'PBM:output_p1.pbm',
  q/compression=>'None'/,
  '71e1a6be223e307b1dbf732860792b15adba662b7a7ef284daf7f982f874ccf1');

print("Portable bitmap format (black and white), binary format ...\n");
++$test;
testReadWrite( 'PBM:input_p4.pbm',
  'PBM:output_p4.pbm',
  q//,
  '71e1a6be223e307b1dbf732860792b15adba662b7a7ef284daf7f982f874ccf1');

print("ZSoft IBM PC Paintbrush file ...\n");
++$test;
testReadWrite( 'PCX:input.pcx',
  'PCX:output.pcx',
  q//,
  'fb6fc68beb3b1001c5ebaa671c8ac8fddea06995027127765ff508f77723cc52');

print("Portable graymap format (gray scale), ASCII format ...\n");
++$test;
testReadWrite( 'PGM:input_p2.pgm',
  'PGM:output_p2.pgm',
  q/compression=>'None'/,
  'f345fd06540c055028fd51b1d97a2144065dda8036ff23234313ed66f0b87254');

print("Apple Macintosh QuickDraw/PICT file ...\n");
++$test;
testReadWrite( 'PICT:input.pict',
  'PICT:output.pict',
  q//,
  'fb6fc68beb3b1001c5ebaa671c8ac8fddea06995027127765ff508f77723cc52');

print("Portable pixmap format (color), ASCII format ...\n");
++$test;
testReadWrite( 'PPM:input_p3.ppm',
  'PPM:output_p3.ppm',
  q/compression=>'None'/,
  'fb6fc68beb3b1001c5ebaa671c8ac8fddea06995027127765ff508f77723cc52');

print("Portable graymap format (gray scale), binary format ...\n");
++$test;
testReadWrite( 'PGM:input_p5.pgm',
  'PGM:output_p5.pgm',
  q//,
  'f345fd06540c055028fd51b1d97a2144065dda8036ff23234313ed66f0b87254');

print("Portable pixmap format (color), binary format ...\n");
++$test;
testReadWrite( 'PPM:input_p6.ppm',
  'PPM:output_p6.ppm',
  q//,
  'fb6fc68beb3b1001c5ebaa671c8ac8fddea06995027127765ff508f77723cc52');

print("Adobe Photoshop bitmap file ...\n");
++$test;
testReadWrite( 'PSD:input.psd',
  'PSD:output.psd',
  q//,
  'fb6fc68beb3b1001c5ebaa671c8ac8fddea06995027127765ff508f77723cc52' );

print("Irix RGB image file ...\n");
++$test;
testReadWrite( 'SGI:input.sgi',
  'SGI:output.sgi',
  q//,
  'fb6fc68beb3b1001c5ebaa671c8ac8fddea06995027127765ff508f77723cc52');

print("SUN 1-bit Rasterfile ...\n");
++$test;
testReadWrite( 'SUN:input.im1',
  'SUN:output.im1',
  q//,
  '49d4c40abae73a1d6169dc1f0262e89ad5dc8a9f64e7feef3430090768e629c4');

print("SUN 8-bit Rasterfile ...\n");
++$test;
testReadWrite( 'SUN:input.im8',
  'SUN:output.im8',
  q//,
  '8ac3392ac643d8a852a4ac23dbf25f2124cb13627dbc60bf887b76ecb89cbb20');

print("SUN True-Color Rasterfile ...\n");
++$test;
testReadWrite( 'SUN:input.im24',
  'SUN:output.im24',
  q//,
  'fb6fc68beb3b1001c5ebaa671c8ac8fddea06995027127765ff508f77723cc52');

print("Truevision Targa image file ...\n");
++$test;
testReadWrite( 'TGA:input.tga',
  'TGA:output.tga',
  q//,
  'ff78a650ff5f4adfdf6ef34e8cc3369de44e71ed4eef1807dc88372352ddac90');

print("Khoros Visualization image file ...\n");
++$test;
testReadWrite( 'VIFF:input.viff',
  'VIFF:output.viff',
  q//,
  'b9ff3e1dbb1a4cd376e95645c0f0f950e3ae73973780bb1dfbc849b211fc3925');

print("WBMP (Wireless Bitmap (level 0) image) ...\n");
++$test;
testReadWrite( 'WBMP:input.wbmp',
  'WBMP:output.wbmp',
  q//,
  '8833a92cbe11a3b925a1b7edffd6508d7b12dd50e3f4907ca8d77917f6e4e697');

print("X Windows system bitmap (black and white only) ...\n");
++$test;
testReadWrite( 'XBM:input.xbm',
  'XBM:output.xbm',
  q//,
  '49d4c40abae73a1d6169dc1f0262e89ad5dc8a9f64e7feef3430090768e629c4');

print("X Windows system pixmap file (color) ...\n");
++$test;
testReadWrite( 'XPM:input.xpm',
  'XPM:output.xpm',
  q//,
  '8ac3392ac643d8a852a4ac23dbf25f2124cb13627dbc60bf887b76ecb89cbb20');

print("CMYK format ...\n");
++$test;
testReadWriteSized( 'CMYK:input_70x46.cmyk',
  'CMYK:output_70x46.cmyk',
  '70x46',
  8,
  q//,
  '215166c965254211b75dcaadbb587b4c2947d7cb3de1420b13b6539cd815a90d');

print("GRAY format ...\n");
++$test;
testReadWriteSized( 'GRAY:input_70x46.gray',
  'GRAY:output_70x46.gray',
  '70x46',
  8,
  q//,
  '2f3d94bebb0feec1a2f0dcc295cbcf074ceb58e7e59262c3d23f0f26fd5e6267' );

print("RGB format ...\n");
++$test;
testReadWriteSized( 'RGB:input_70x46.rgb',
  'RGB:output_70x46.rgb',
  '70x46',
  8,
  q//,
  'fb6fc68beb3b1001c5ebaa671c8ac8fddea06995027127765ff508f77723cc52' );

print("RGBA format ...\n");
++$test;
testReadWriteSized( 'RGBA:input_70x46.rgba',
  'RGBA:output_70x46.rgba',
  '70x46',
  8,
  q//,
  '74136c90d3e699ea5bcbf4aa733aff0dc822b6af72fce00f0c7647bcb0d49f66' );

1;
```

--------------------------------------------------------------------------------

---[FILE: input.miff]---
Location: ImageMagick-main/PerlMagick/t/bzlib/input.miff

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
Location: ImageMagick-main/PerlMagick/t/bzlib/read.t

```text
#!/usr/bin/perl
#
# Test reading an image which uses BZip compression
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#

BEGIN { $| = 1; $test=1; print "1..2\n"; }
END {print "not ok $test\n" unless $loaded;}
use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/bzlib' || die 'Cd failed';

#
# Test reading BZip compressed MIFF
# 
testRead( 'input.miff',
  'fb6fc68beb3b1001c5ebaa671c8ac8fddea06995027127765ff508f77723cc52' );

#
# 2) Test reading BZip stream-compressed MIFF (.bz2 extension)
#
print("Reading BZip stream-compressed MIFF (.bz2 extension) ...\n");
++$test;
testRead( 'input.miff.bz2',
  'fb6fc68beb3b1001c5ebaa671c8ac8fddea06995027127765ff508f77723cc52' );
```

--------------------------------------------------------------------------------

---[FILE: write.t]---
Location: ImageMagick-main/PerlMagick/t/bzlib/write.t

```text
#!/usr/bin/perl
#
# Test writing files using bzlib-based compression
#
# Contributed by Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#
BEGIN { $| = 1; $test=1; print "1..1\n"; }
END {print "not ok $test\n" unless $loaded;}

use Image::Magick;
$loaded=1;

require 't/subroutines.pl';

chdir 't/bzlib' || die 'Cd failed';

#
# Test writing BZip-compressed MIFF
#

testReadWrite( 'input.miff',
  'output.miff',
  q/compression=>'BZip'/,
  'fb6fc68beb3b1001c5ebaa671c8ac8fddea06995027127765ff508f77723cc52' );

$test = 0;  # Quench PERL complaint
```

--------------------------------------------------------------------------------

````

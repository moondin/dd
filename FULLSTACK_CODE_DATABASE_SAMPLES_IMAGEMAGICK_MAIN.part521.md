---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 521
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 521 of 851)

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

---[FILE: wandtest.tap]---
Location: ImageMagick-main/tests/wandtest.tap

```text
#!/bin/sh
# Copyright (C) 1999-2016 ImageMagick Studio LLC
#
# This program is covered by multiple licenses, which are described in
# LICENSE. You should have received a copy of LICENSE with this
# package; otherwise see https://imagemagick.org/script/license.php.
#
#  Test for '${CONVERT}' utility.
#
. ./common.shi
. ${srcdir}/tests/common.shi
echo "1..1"

${WANDTEST} wandtest_out.miff -validate compare && echo "ok" || echo "not ok"
:
```

--------------------------------------------------------------------------------

---[FILE: animate.1]---
Location: ImageMagick-main/utilities/animate.1

```text
.TH animate 1 "Date: 2009/01/10 01:00:00" "ImageMagick"
.SH NAME
animate \- animates an image or image sequence on any X server.
.SH SYNOPSIS
.TP
\fBmagick animate\fP [\fIoptions\fP] \fIinput-file\fP
.SH OVERVIEW
The \fBanimate\fP program is a member of the ImageMagick(1) suite of tools.  Use it to animate an image or image sequence on any X server.

For more information about the animate command, point your browser to file:///usr/local/share/doc/ImageMagick-7/www/animate.html or https://imagemagick.org/script/animate.php.
.SH DESCRIPTION
Image Settings:
  \-alpha option        on, activate, off, deactivate, set, opaque, copy
                        transparent, extract, background, or shape
  \-authenticate value  decrypt image with this password
  \-backdrop            display image centered on a backdrop
  \-colormap type       Shared or Private
  \-colorspace type     alternate image colorspace
  \-decipher filename   convert cipher pixels to plain pixels
  \-define format:option
                       define one or more image format options
  \-delay centiseconds  display the next image after pausing
  \-density geometry    horizontal and vertical density of the image
  \-depth value         image depth
  \-display server      display image to this X server
  \-dispose method      layer disposal method
  \-dither method       apply error diffusion to image
  \-filter type         use this filter when resizing an image
  \-format "string"     output formatted image characteristics
  \-gamma value         level of gamma correction
  \-geometry geometry   preferred size and location of the Image window
  \-gravity type        horizontal and vertical backdrop placement
  \-identify            identify the format and characteristics of the image
  \-immutable           displayed image cannot be modified
  \-interlace type      type of image interlacing scheme
  \-interpolate method  pixel color interpolation method
  \-limit type value    pixel cache resource limit
  \-loop iterations     loop images then exit
  \-matte               store matte channel if the image has one
  \-map type            display image using this Standard Colormap
  \-monitor             monitor progress
  \-pause               seconds to pause before reanimating
  \-page geometry       size and location of an image canvas (setting)
  \-quantize colorspace reduce colors in this colorspace
  \-quiet               suppress all warning messages
  \-regard-warnings     pay attention to warning messages
  \-remote command      execute a command in an remote display process
  \-repage geometry     size and location of an image canvas (operator)
  \-respect-parentheses settings remain in effect until parenthesis boundary
  \-sampling-factor geometry
                       horizontal and vertical sampling factor
  \-scenes range        image scene range
  \-seed value          seed a new sequence of pseudo-random numbers
  \-set attribute value set an image attribute
  \-size geometry       width and height of image
  \-support factor      resize support: > 1.0 is blurry, < 1.0 is sharp
  \-transparent-color color
                       transparent color
  \-treedepth value     color tree depth
  \-verbose             print detailed information about the image
  \-visual type         display image using this visual type
  \-virtual-pixel method
                       virtual pixel access method
  \-window id           display image to background of this window

Image Operators:
  \-channel mask        set the image channel mask
  \-colors value        preferred number of colors in the image
  \-crop geometry       preferred size and location of the cropped image
  \-extent geometry     set the image size
  \-extract geometry    extract area from image
  \-monochrome          transform image to black and white
  \-resample geometry   change the resolution of an image
  \-resize geometry     resize the image
  \-rotate degrees      apply Paeth rotation to the image
  \-strip               strip image of all profiles and comments
  \-thumbnail geometry  create a thumbnail of the image
  \-trim                trim image edges

Image Sequence Operators:
  \-coalesce            merge a sequence of images
  \-flatten             flatten a sequence of images

Miscellaneous Options:
  \-debug events        display copious debugging information
  \-help                print program options
  \-log format          format of debugging information
  \-list type           print a list of supported option arguments
  \-version             print version information

In addition to those listed above, you can specify these standard X resources as command line options:  \-background, \-bordercolor, \-borderwidth, \-font, \-foreground, \-iconGeometry, \-iconic, \-name, \-mattecolor, \-shared-memory, or \-title.  

By default, the image format of `file' is determined by its magic number.  To specify a particular image format, precede the filename with an image format name and a colon (i.e. ps:image) or specify the image type as the filename suffix (i.e. image.ps).  Specify 'file' as '-' for standard input or output.

Buttons: 
  1    press to map or unmap the Command widget
.SH SEE ALSO
ImageMagick(1)

.SH COPYRIGHT

\fBCopyright (C) 1999 ImageMagick Studio LLC. Additional copyrights and licenses apply to this software, see file:///usr/local/share/doc/ImageMagick-7/www/license.html or https://imagemagick.org/script/license.php\fP
```

--------------------------------------------------------------------------------

---[FILE: animate.1.in]---
Location: ImageMagick-main/utilities/animate.1.in

```text
.TH animate 1 "Date: 2009/01/10 01:00:00" "ImageMagick"
.SH NAME
animate \- animates an image or image sequence on any X server.
.SH SYNOPSIS
.TP
\fBmagick animate\fP [\fIoptions\fP] \fIinput-file\fP
.SH OVERVIEW
The \fBanimate\fP program is a member of the ImageMagick(1) suite of tools.  Use it to animate an image or image sequence on any X server.

For more information about the animate command, point your browser to file://@DOCUMENTATION_PATH@/www/animate.html or https://imagemagick.org/script/animate.php.
.SH DESCRIPTION
Image Settings:
  \-alpha option        on, activate, off, deactivate, set, opaque, copy
                        transparent, extract, background, or shape
  \-authenticate value  decrypt image with this password
  \-backdrop            display image centered on a backdrop
  \-colormap type       Shared or Private
  \-colorspace type     alternate image colorspace
  \-decipher filename   convert cipher pixels to plain pixels
  \-define format:option
                       define one or more image format options
  \-delay centiseconds  display the next image after pausing
  \-density geometry    horizontal and vertical density of the image
  \-depth value         image depth
  \-display server      display image to this X server
  \-dispose method      layer disposal method
  \-dither method       apply error diffusion to image
  \-filter type         use this filter when resizing an image
  \-format "string"     output formatted image characteristics
  \-gamma value         level of gamma correction
  \-geometry geometry   preferred size and location of the Image window
  \-gravity type        horizontal and vertical backdrop placement
  \-identify            identify the format and characteristics of the image
  \-immutable           displayed image cannot be modified
  \-interlace type      type of image interlacing scheme
  \-interpolate method  pixel color interpolation method
  \-limit type value    pixel cache resource limit
  \-loop iterations     loop images then exit
  \-matte               store matte channel if the image has one
  \-map type            display image using this Standard Colormap
  \-monitor             monitor progress
  \-pause               seconds to pause before reanimating
  \-page geometry       size and location of an image canvas (setting)
  \-quantize colorspace reduce colors in this colorspace
  \-quiet               suppress all warning messages
  \-regard-warnings     pay attention to warning messages
  \-remote command      execute a command in an remote display process
  \-repage geometry     size and location of an image canvas (operator)
  \-respect-parentheses settings remain in effect until parenthesis boundary
  \-sampling-factor geometry
                       horizontal and vertical sampling factor
  \-scenes range        image scene range
  \-seed value          seed a new sequence of pseudo-random numbers
  \-set attribute value set an image attribute
  \-size geometry       width and height of image
  \-support factor      resize support: > 1.0 is blurry, < 1.0 is sharp
  \-transparent-color color
                       transparent color
  \-treedepth value     color tree depth
  \-verbose             print detailed information about the image
  \-visual type         display image using this visual type
  \-virtual-pixel method
                       virtual pixel access method
  \-window id           display image to background of this window

Image Operators:
  \-channel mask        set the image channel mask
  \-colors value        preferred number of colors in the image
  \-crop geometry       preferred size and location of the cropped image
  \-extent geometry     set the image size
  \-extract geometry    extract area from image
  \-monochrome          transform image to black and white
  \-resample geometry   change the resolution of an image
  \-resize geometry     resize the image
  \-rotate degrees      apply Paeth rotation to the image
  \-strip               strip image of all profiles and comments
  \-thumbnail geometry  create a thumbnail of the image
  \-trim                trim image edges

Image Sequence Operators:
  \-coalesce            merge a sequence of images
  \-flatten             flatten a sequence of images

Miscellaneous Options:
  \-debug events        display copious debugging information
  \-help                print program options
  \-log format          format of debugging information
  \-list type           print a list of supported option arguments
  \-version             print version information

In addition to those listed above, you can specify these standard X resources as command line options:  \-background, \-bordercolor, \-borderwidth, \-font, \-foreground, \-iconGeometry, \-iconic, \-name, \-mattecolor, \-shared-memory, or \-title.  

By default, the image format of `file' is determined by its magic number.  To specify a particular image format, precede the filename with an image format name and a colon (i.e. ps:image) or specify the image type as the filename suffix (i.e. image.ps).  Specify 'file' as '-' for standard input or output.

Buttons: 
  1    press to map or unmap the Command widget
.SH SEE ALSO
ImageMagick(1)

.SH COPYRIGHT

\fBCopyright (C) 1999 ImageMagick Studio LLC. Additional copyrights and licenses apply to this software, see file://@DOCUMENTATION_PATH@/www/license.html or https://imagemagick.org/script/license.php\fP
```

--------------------------------------------------------------------------------

---[FILE: compare.1]---
Location: ImageMagick-main/utilities/compare.1

```text
.TH compare 1 "Date: 2009/01/10 01:00:00" "ImageMagick"
.SH NAME
compare \- mathematically and visually annotate the difference between an image and its reconstruction.
.SH SYNOPSIS
.TP
\fBmagick compare\fP \fIinput-file\fP \fIinput-file\fP [\fIoptions\fP] \fIoutput-file\fP
.SH OVERVIEW
The \fBcompare\fP program is a member of the ImageMagick(1) suite of tools.  Use it to mathematically and visually annotate the difference between an image and its reconstruction.

For more information about the compare command, point your browser to file:///usr/local/share/doc/ImageMagick-7/www/compare.html or https://imagemagick.org/script/compare.php.
.SH DESCRIPTION
Image Settings:
  \-alpha option        on, activate, off, deactivate, set, opaque, copy
                        transparent, extract, background, or shape
  \-authenticate value  decrypt image with this password
  \-background color    background color
  \-colorspace type     alternate image colorspace
  \-compose operator    set image composite operator
  \-compress type       type of pixel compression when writing the image
  \-decipher filename   convert cipher pixels to plain pixels
  \-define format:option
                       define one or more image format options
  \-density geometry    horizontal and vertical density of the image
  \-depth value         image depth
  \-dissimilarity-threshold value
                        maximum distortion for (sub)image match
  \-encipher filename   convert plain pixels to cipher pixels
  \-extract geometry    extract area from image
  \-format "string"     output formatted image characteristics
  \-fuzz distance       colors within this distance are considered equal
  \-gravity type        horizontal and vertical text placement
  \-identify            identify the format and characteristics of the image
  \-interlace type      type of image interlacing scheme
  \-highlight-color color
                       emphasize pixel differences with this color
  \-limit type value    pixel cache resource limit
  \-lowlight-color color
                       de-emphasize pixel differences with this color
  \-metric type         measure differences between images with this metric
  \-monitor             monitor progress
  \-negate              replace each pixel with its complementary color
  \-profile filename    add, delete, or apply an image profile
  \-quality value       JPEG/MIFF/PNG compression level
  \-quiet               suppress all warning messages
  \-quantize colorspace reduce colors in this colorspace
  \-read-mask filename  associate a read mask with the image
  \-regard-warnings     pay attention to warning messages
  \-repage geometry     size and location of an image canvas
  \-respect-parentheses settings remain in effect until parenthesis boundary
  \-sampling-factor geometry
                       horizontal and vertical sampling factor
  \-seed value          seed a new sequence of pseudo-random numbers
  \-set attribute value set an image attribute
  \-similarity-threshold value
                        minimum distortion for (sub)image match
  \-size geometry       width and height of image
  \-subimage-search     search for subimage
  \-synchronize         synchronize image to storage device
  \-taint               declare the image as modified
  \-transparent-color color
                       transparent color
  \-type type           image type
  \-write-mask filename associate a write mask with the image
  \-verbose             print detailed information about the image
  \-virtual-pixel method
                       virtual pixel access method

Image Operators:
  \-auto-orient         automatically orient image
  \-brightness-contrast geometry
                        improve brightness / contrast of the image
  \-distort method args
                        distort images according to given method and args
  \-level value         adjust the level of image contrast
  \-resize geometry     resize the image
  \-rotate degrees      apply Paeth rotation to the image
  \-sigmoidal-contrast geometry
                       lightness rescaling using sigmoidal contrast enhancement
  \-trim                trim image edges

Image Channel Operators:
  \-separate            separate an image channel into a grayscale image

Image Sequence Operators:
  \-crop geometry       cut out a rectangular region of the image
  \-write filename      write images to this file

Image Stack Operators:
  \-delete indexes      delete the image from the image sequence

Miscellaneous Options:
  \-channel mask        set the image channel mask
  \-debug events        display copious debugging information
  \-help                print program options
  \-log format          format of debugging information
  \-list type           print a list of supported option arguments
  \-version             print version information

By default, the image format of `file' is determined by its magic number.  To specify a particular image format, precede the filename with an image format name and a colon (i.e. ps:image) or specify the image type as the filename suffix (i.e. image.ps).  Specify 'file' as '-' for standard input or output.

Two images are considered similar if their difference according to the specified metric and fuzz value is 0, with the exception of the normalized cross correlation metric (NCC), where two images are considered similar when their normalized cross correlation is 1. The default metric is NCC.

The compare program returns 2 on error, 0 if the images are similar, or a value between 0 and 1 if they are not similar.
.SH SEE ALSO
ImageMagick(1)

.SH COPYRIGHT

\fBCopyright (C) 1999 ImageMagick Studio LLC. Additional copyrights and licenses apply to this software, see file:///usr/local/share/doc/ImageMagick-7/www/license.html or https://imagemagick.org/script/license.php\fP
```

--------------------------------------------------------------------------------

---[FILE: compare.1.in]---
Location: ImageMagick-main/utilities/compare.1.in

```text
.TH compare 1 "Date: 2009/01/10 01:00:00" "ImageMagick"
.SH NAME
compare \- mathematically and visually annotate the difference between an image and its reconstruction.
.SH SYNOPSIS
.TP
\fBmagick compare\fP \fIinput-file\fP \fIinput-file\fP [\fIoptions\fP] \fIoutput-file\fP
.SH OVERVIEW
The \fBcompare\fP program is a member of the ImageMagick(1) suite of tools.  Use it to mathematically and visually annotate the difference between an image and its reconstruction.

For more information about the compare command, point your browser to file://@DOCUMENTATION_PATH@/www/compare.html or https://imagemagick.org/script/compare.php.
.SH DESCRIPTION
Image Settings:
  \-alpha option        on, activate, off, deactivate, set, opaque, copy
                        transparent, extract, background, or shape
  \-authenticate value  decrypt image with this password
  \-background color    background color
  \-colorspace type     alternate image colorspace
  \-compose operator    set image composite operator
  \-compress type       type of pixel compression when writing the image
  \-decipher filename   convert cipher pixels to plain pixels
  \-define format:option
                       define one or more image format options
  \-density geometry    horizontal and vertical density of the image
  \-depth value         image depth
  \-dissimilarity-threshold value
                        maximum distortion for (sub)image match
  \-encipher filename   convert plain pixels to cipher pixels
  \-extract geometry    extract area from image
  \-format "string"     output formatted image characteristics
  \-fuzz distance       colors within this distance are considered equal
  \-gravity type        horizontal and vertical text placement
  \-identify            identify the format and characteristics of the image
  \-interlace type      type of image interlacing scheme
  \-highlight-color color
                       emphasize pixel differences with this color
  \-limit type value    pixel cache resource limit
  \-lowlight-color color
                       de-emphasize pixel differences with this color
  \-metric type         measure differences between images with this metric
  \-monitor             monitor progress
  \-negate              replace each pixel with its complementary color
  \-profile filename    add, delete, or apply an image profile
  \-quality value       JPEG/MIFF/PNG compression level
  \-quiet               suppress all warning messages
  \-quantize colorspace reduce colors in this colorspace
  \-read-mask filename  associate a read mask with the image
  \-regard-warnings     pay attention to warning messages
  \-repage geometry     size and location of an image canvas
  \-respect-parentheses settings remain in effect until parenthesis boundary
  \-sampling-factor geometry
                       horizontal and vertical sampling factor
  \-seed value          seed a new sequence of pseudo-random numbers
  \-set attribute value set an image attribute
  \-similarity-threshold value
                        minimum distortion for (sub)image match
  \-size geometry       width and height of image
  \-subimage-search     search for subimage
  \-synchronize         synchronize image to storage device
  \-taint               declare the image as modified
  \-transparent-color color
                       transparent color
  \-type type           image type
  \-write-mask filename associate a write mask with the image
  \-verbose             print detailed information about the image
  \-virtual-pixel method
                       virtual pixel access method

Image Operators:
  \-auto-orient         automatically orient image
  \-brightness-contrast geometry
                        improve brightness / contrast of the image
  \-distort method args
                        distort images according to given method and args
  \-level value         adjust the level of image contrast
  \-resize geometry     resize the image
  \-rotate degrees      apply Paeth rotation to the image
  \-sigmoidal-contrast geometry
                       lightness rescaling using sigmoidal contrast enhancement
  \-trim                trim image edges

Image Channel Operators:
  \-separate            separate an image channel into a grayscale image

Image Sequence Operators:
  \-crop geometry       cut out a rectangular region of the image
  \-write filename      write images to this file

Image Stack Operators:
  \-delete indexes      delete the image from the image sequence

Miscellaneous Options:
  \-channel mask        set the image channel mask
  \-debug events        display copious debugging information
  \-help                print program options
  \-log format          format of debugging information
  \-list type           print a list of supported option arguments
  \-version             print version information

By default, the image format of `file' is determined by its magic number.  To specify a particular image format, precede the filename with an image format name and a colon (i.e. ps:image) or specify the image type as the filename suffix (i.e. image.ps).  Specify 'file' as '-' for standard input or output.

Two images are considered similar if their difference according to the specified metric and fuzz value is 0, with the exception of the normalized cross correlation metric (NCC), where two images are considered similar when their normalized cross correlation is 1. The default metric is NCC.

The compare program returns 2 on error, 0 if the images are similar, or a value between 0 and 1 if they are not similar.
.SH SEE ALSO
ImageMagick(1)

.SH COPYRIGHT

\fBCopyright (C) 1999 ImageMagick Studio LLC. Additional copyrights and licenses apply to this software, see file://@DOCUMENTATION_PATH@/www/license.html or https://imagemagick.org/script/license.php\fP
```

--------------------------------------------------------------------------------

---[FILE: composite.1]---
Location: ImageMagick-main/utilities/composite.1

```text
.TH composite 1 "Date: 2009/01/10 01:00:00" "ImageMagick"
.SH NAME
composite \-  overlaps one image over another.
.SH SYNOPSIS
.TP
\fBmagick composite\fP \fB[\fP \fIoptions\fP \fB... ]\fP \fIchange-file base-file\fP \fB[\fP \fImask-file\fP \fB]\fP \fIoutput-image\fP
.SH OVERVIEW
The \fBcomposite\fP program is a member of the ImageMagick(1) suite of tools.  Use it to overlap one image over another.

For more information about the composite command, point your browser to file:///usr/local/share/doc/ImageMagick-7/www/composite.html or https://imagemagick.org/script/composite.php.
.SH DESCRIPTION
Image Settings:
  \-affine matrix       affine transform matrix
  \-alpha option        on, activate, off, deactivate, set, opaque, copy
                        transparent, extract, background, or shape
  \-authenticate value  decrypt image with this password
  \-blue-primary point  chromaticity blue primary point
  \-colorspace type     alternate image colorspace
  \-comment string      annotate image with comment
  \-compose operator    composite operator
  \-compress type       type of pixel compression when writing the image
  \-decipher filename   convert cipher pixels to plain pixels
  \-define format:option
                       define one or more image format options
  \-depth value         image depth
  \-density geometry    horizontal and vertical density of the image
  \-display server      get image or font from this X server
  \-dispose method      layer disposal method
  \-dither method       apply error diffusion to image
  \-encipher filename   convert plain pixels to cipher pixels
  \-encoding type       text encoding type
  \-endian type         endianness (MSB or LSB) of the image
  \-filter type         use this filter when resizing an image
  \-font name           render text with this font
  \-format "string"     output formatted image characteristics
  \-gravity type        which direction to gravitate towards
  \-green-primary point chromaticity green primary point
  \-interlace type      type of image interlacing scheme
  \-interpolate method  pixel color interpolation method
  \-label string        assign a label to an image
  \-limit type value    pixel cache resource limit
  \-matte               store matte channel if the image has one
  \-monitor             monitor progress
  \-page geometry       size and location of an image canvas (setting)
  \-pointsize value     font point size
  \-quality value       JPEG/MIFF/PNG compression level
  \-quiet               suppress all warning messages
  \-red-primary point   chromaticity red primary point
  \-regard-warnings     pay attention to warning messages
  \-repage geometry     size and location of an image canvas (operator)
  \-respect-parentheses settings remain in effect until parenthesis boundary
  \-sampling-factor geometry
                       horizontal and vertical sampling factor
  \-scene value         image scene number
  \-seed value          seed a new sequence of pseudo-random numbers
  \-size geometry       width and height of image
  \-support factor      resize support: > 1.0 is blurry, < 1.0 is sharp
  \-synchronize         synchronize image to storage device
  \-taint               declare the image as modified
  \-transparent-color color
                       transparent color
  \-treedepth value     color tree depth
  \-tile                repeat composite operation across and down image
  \-units type          the units of image resolution
  \-verbose             print detailed information about the image
  \-virtual-pixel method
                       virtual pixel access method
  \-white-point point   chromaticity white point

Image Operators:
  \-blend geometry      blend images
  \-border geometry     surround image with a border of color
  \-bordercolor color   border color
  \-channel mask        set the image channel mask
  \-colors value        preferred number of colors in the image
  \-displace geometry   shift image pixels defined by a displacement map
  \-dissolve value      dissolve the two images a given percent
  \-distort geometry    shift lookup according to a absolute distortion map
  \-extract geometry    extract area from image
  \-geometry geometry   location of the composite image
  \-identify            identify the format and characteristics of the image
  \-monochrome          transform image to black and white
  \-negate              replace each pixel with its complementary color 
  \-profile filename    add ICM or IPTC information profile to image
  \-quantize colorspace reduce colors in this colorspace
  \-rotate degrees      apply Paeth rotation to the image
  \-resize geometry     resize the image
  \-sharpen geometry    sharpen the image
  \-shave geometry      shave pixels from the image edges
  \-stegano offset      hide watermark within an image
  \-stereo              combine two image to create a stereo anaglyph
  \-strip               strip image of all profiles and comments
  \-thumbnail geometry  create a thumbnail of the image
  \-transform           affine transform image
  \-type type           image type
  \-unsharp geometry    sharpen the image
  \-watermark geometry  percent brightness and saturation of a watermark
  \-write filename      write images to this file

Image Stack Operators:
  \-swap indexes        swap two images in the image sequence

Miscellaneous Options:
  \-debug events        display copious debugging information
  \-help                print program options
  \-log format          format of debugging information
  \-list type           print a list of supported option arguments
  \-version             print version information

By default, the image format of `file' is determined by its magic number.  To specify a particular image format, precede the filename with an image format name and a colon (i.e. ps:image) or specify the image type as the filename suffix (i.e. image.ps).  Specify 'file' as '-' for standard input or output.
.SH SEE ALSO
ImageMagick(1)

.SH COPYRIGHT

\fBCopyright (C) 1999 ImageMagick Studio LLC. Additional copyrights and licenses apply to this software, see file:///usr/local/share/doc/ImageMagick-7/www/license.html or https://imagemagick.org/script/license.php\fP
```

--------------------------------------------------------------------------------

---[FILE: composite.1.in]---
Location: ImageMagick-main/utilities/composite.1.in

```text
.TH composite 1 "Date: 2009/01/10 01:00:00" "ImageMagick"
.SH NAME
composite \-  overlaps one image over another.
.SH SYNOPSIS
.TP
\fBmagick composite\fP \fB[\fP \fIoptions\fP \fB... ]\fP \fIchange-file base-file\fP \fB[\fP \fImask-file\fP \fB]\fP \fIoutput-image\fP
.SH OVERVIEW
The \fBcomposite\fP program is a member of the ImageMagick(1) suite of tools.  Use it to overlap one image over another.

For more information about the composite command, point your browser to file://@DOCUMENTATION_PATH@/www/composite.html or https://imagemagick.org/script/composite.php.
.SH DESCRIPTION
Image Settings:
  \-affine matrix       affine transform matrix
  \-alpha option        on, activate, off, deactivate, set, opaque, copy
                        transparent, extract, background, or shape
  \-authenticate value  decrypt image with this password
  \-blue-primary point  chromaticity blue primary point
  \-colorspace type     alternate image colorspace
  \-comment string      annotate image with comment
  \-compose operator    composite operator
  \-compress type       type of pixel compression when writing the image
  \-decipher filename   convert cipher pixels to plain pixels
  \-define format:option
                       define one or more image format options
  \-depth value         image depth
  \-density geometry    horizontal and vertical density of the image
  \-display server      get image or font from this X server
  \-dispose method      layer disposal method
  \-dither method       apply error diffusion to image
  \-encipher filename   convert plain pixels to cipher pixels
  \-encoding type       text encoding type
  \-endian type         endianness (MSB or LSB) of the image
  \-filter type         use this filter when resizing an image
  \-font name           render text with this font
  \-format "string"     output formatted image characteristics
  \-gravity type        which direction to gravitate towards
  \-green-primary point chromaticity green primary point
  \-interlace type      type of image interlacing scheme
  \-interpolate method  pixel color interpolation method
  \-label string        assign a label to an image
  \-limit type value    pixel cache resource limit
  \-matte               store matte channel if the image has one
  \-monitor             monitor progress
  \-page geometry       size and location of an image canvas (setting)
  \-pointsize value     font point size
  \-quality value       JPEG/MIFF/PNG compression level
  \-quiet               suppress all warning messages
  \-red-primary point   chromaticity red primary point
  \-regard-warnings     pay attention to warning messages
  \-repage geometry     size and location of an image canvas (operator)
  \-respect-parentheses settings remain in effect until parenthesis boundary
  \-sampling-factor geometry
                       horizontal and vertical sampling factor
  \-scene value         image scene number
  \-seed value          seed a new sequence of pseudo-random numbers
  \-size geometry       width and height of image
  \-support factor      resize support: > 1.0 is blurry, < 1.0 is sharp
  \-synchronize         synchronize image to storage device
  \-taint               declare the image as modified
  \-transparent-color color
                       transparent color
  \-treedepth value     color tree depth
  \-tile                repeat composite operation across and down image
  \-units type          the units of image resolution
  \-verbose             print detailed information about the image
  \-virtual-pixel method
                       virtual pixel access method
  \-white-point point   chromaticity white point

Image Operators:
  \-blend geometry      blend images
  \-border geometry     surround image with a border of color
  \-bordercolor color   border color
  \-channel mask        set the image channel mask
  \-colors value        preferred number of colors in the image
  \-displace geometry   shift image pixels defined by a displacement map
  \-dissolve value      dissolve the two images a given percent
  \-distort geometry    shift lookup according to a absolute distortion map
  \-extract geometry    extract area from image
  \-geometry geometry   location of the composite image
  \-identify            identify the format and characteristics of the image
  \-monochrome          transform image to black and white
  \-negate              replace each pixel with its complementary color 
  \-profile filename    add ICM or IPTC information profile to image
  \-quantize colorspace reduce colors in this colorspace
  \-rotate degrees      apply Paeth rotation to the image
  \-resize geometry     resize the image
  \-sharpen geometry    sharpen the image
  \-shave geometry      shave pixels from the image edges
  \-stegano offset      hide watermark within an image
  \-stereo              combine two image to create a stereo anaglyph
  \-strip               strip image of all profiles and comments
  \-thumbnail geometry  create a thumbnail of the image
  \-transform           affine transform image
  \-type type           image type
  \-unsharp geometry    sharpen the image
  \-watermark geometry  percent brightness and saturation of a watermark
  \-write filename      write images to this file

Image Stack Operators:
  \-swap indexes        swap two images in the image sequence

Miscellaneous Options:
  \-debug events        display copious debugging information
  \-help                print program options
  \-log format          format of debugging information
  \-list type           print a list of supported option arguments
  \-version             print version information

By default, the image format of `file' is determined by its magic number.  To specify a particular image format, precede the filename with an image format name and a colon (i.e. ps:image) or specify the image type as the filename suffix (i.e. image.ps).  Specify 'file' as '-' for standard input or output.
.SH SEE ALSO
ImageMagick(1)

.SH COPYRIGHT

\fBCopyright (C) 1999 ImageMagick Studio LLC. Additional copyrights and licenses apply to this software, see file://@DOCUMENTATION_PATH@/www/license.html or https://imagemagick.org/script/license.php\fP
```

--------------------------------------------------------------------------------

---[FILE: conjure.1]---
Location: ImageMagick-main/utilities/conjure.1

```text
.TH conjure 1 "Date: 2009/01/10 01:00:00" "ImageMagick"
.SH NAME
conjure \- interprets and executes scripts written in the Magick Scripting Language (MSL).
.SH SYNOPSIS
.TP
\fBmagick conjure\fP [\fIoptions\fP] \fIscript.msl\fP
.SH OVERVIEW
The \fBconjure\fP program is a member of the ImageMagick(1) suite of tools.  Use it to process a Magick Scripting Language (MSL) script. The Magick scripting language (MSL) will primarily benefit those that want to accomplish custom image processing tasks but do not wish to program, or those that do not have access to a Perl interpreter or a compiler.

For more information about the conjure command, point your browser to file:///usr/local/share/doc/ImageMagick-7/www/conjure.html or https://imagemagick.org/script/conjure.php.
.SH DESCRIPTION
Image Settings:
  \-monitor             monitor progress
  \-quiet               suppress all warning messages
  \-regard-warnings     pay attention to warning messages
  \-seed value          seed a new sequence of pseudo-random numbers
  \-verbose             print detailed information about the image

Miscellaneous Options:
  \-debug events        display copious debugging information
  \-help                print program options
  \-log format          format of debugging information
  \-list type           print a list of supported option arguments
  \-version             print version information

In addition, define any key value pairs required by your script.  For example,

    conjure \-size 100x100 \-color blue \-foo bar script.msl
.SH SEE ALSO
ImageMagick(1)

.SH COPYRIGHT

\fBCopyright (C) 1999 ImageMagick Studio LLC. Additional copyrights and licenses apply to this software, see file:///usr/local/share/doc/ImageMagick-7/www/license.html or https://imagemagick.org/script/license.php\fP
```

--------------------------------------------------------------------------------

---[FILE: conjure.1.in]---
Location: ImageMagick-main/utilities/conjure.1.in

```text
.TH conjure 1 "Date: 2009/01/10 01:00:00" "ImageMagick"
.SH NAME
conjure \- interprets and executes scripts written in the Magick Scripting Language (MSL).
.SH SYNOPSIS
.TP
\fBmagick conjure\fP [\fIoptions\fP] \fIscript.msl\fP
.SH OVERVIEW
The \fBconjure\fP program is a member of the ImageMagick(1) suite of tools.  Use it to process a Magick Scripting Language (MSL) script. The Magick scripting language (MSL) will primarily benefit those that want to accomplish custom image processing tasks but do not wish to program, or those that do not have access to a Perl interpreter or a compiler.

For more information about the conjure command, point your browser to file://@DOCUMENTATION_PATH@/www/conjure.html or https://imagemagick.org/script/conjure.php.
.SH DESCRIPTION
Image Settings:
  \-monitor             monitor progress
  \-quiet               suppress all warning messages
  \-regard-warnings     pay attention to warning messages
  \-seed value          seed a new sequence of pseudo-random numbers
  \-verbose             print detailed information about the image

Miscellaneous Options:
  \-debug events        display copious debugging information
  \-help                print program options
  \-log format          format of debugging information
  \-list type           print a list of supported option arguments
  \-version             print version information

In addition, define any key value pairs required by your script.  For example,

    conjure \-size 100x100 \-color blue \-foo bar script.msl
.SH SEE ALSO
ImageMagick(1)

.SH COPYRIGHT

\fBCopyright (C) 1999 ImageMagick Studio LLC. Additional copyrights and licenses apply to this software, see file://@DOCUMENTATION_PATH@/www/license.html or https://imagemagick.org/script/license.php\fP
```

--------------------------------------------------------------------------------

````

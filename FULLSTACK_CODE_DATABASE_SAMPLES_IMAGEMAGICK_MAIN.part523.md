---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 523
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 523 of 851)

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

---[FILE: display.1]---
Location: ImageMagick-main/utilities/display.1

```text
.TH display 1 "Date: 2009/01/10 01:00:00" "ImageMagick"
.SH NAME
display \- displays an image or image sequence on any X server.
.SH SYNOPSIS
.TP
\fBmagick display\fP [\fIoptions\fP] \fIinput-file\fP
.SH OVERVIEW
The \fBdisplay\fP program is a member of the ImageMagick(1) suite of tools.  Use it to display an image or image sequence on any X server.

For more information about the display command, point your browser to file:///usr/local/share/doc/ImageMagick-7/www/display.html or https://imagemagick.org/script/display.php.
.SH DESCRIPTION
Image Settings:
  \-alpha option        on, activate, off, deactivate, set, opaque, copy
                        transparent, extract, background, or shape
  \-antialias           remove pixel-aliasing
  \-authenticate value  decrypt image with this password
  \-backdrop            display image centered on a backdrop
  \-colormap type       Shared or Private
  \-colorspace type     alternate image colorspace
  \-comment string      annotate image with comment
  \-compress type       type of pixel compression when writing the image
  \-decipher filename   convert cipher pixels to plain pixels
  \-deskew threshold    straighten an image
  \-define format:option
                       define one or more image format options
  \-delay centiseconds  display the next image after pausing
  \-density geometry    horizontal and vertical density of the image
  \-depth value         image depth
  \-display server      display image to this X server
  \-dispose method      layer disposal method
  \-dither method       apply error diffusion to image
  \-endian type         endianness (MSB or LSB) of the image
  \-equalize            perform histogram equalization to an image
  \-filter type         use this filter when resizing an image
  \-format "string"     output formatted image characteristics
  \-fuzz distance       colors within this distance are considered equal
  \-geometry geometry   preferred size and location of the Image window
  \-gravity type        horizontal and vertical backdrop placement
  \-identify            identify the format and characteristics of the image
  \-immutable           displayed image cannot be modified
  \-interlace type      type of image interlacing scheme
  \-interpolate method  pixel color interpolation method
  \-label string        assign a label to an image
  \-limit type value    pixel cache resource limit
  \-loop iterations     loop images then exit
  \-map type            display image using this Standard Colormap
  \-matte               store matte channel if the image has one
  \-monitor             monitor progress
  \-page geometry       size and location of an image canvas
  \-profile filename    add, delete, or apply an image profile
  \-quality value       JPEG/MIFF/PNG compression level
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
  \-set property value  set an image property
  \-size geometry       width and height of image
  \-support factor      resize support: > 1.0 is blurry, < 1.0 is sharp
  \-texture filename    name of texture to tile onto the image background
  \-transparent-color color
                       transparent color
  \-treedepth value     color tree depth
  \-update seconds      detect when image file is modified and redisplay
  \-verbose             print detailed information about the image
  \-visual type         display image using this visual type
  \-virtual-pixel method
                       virtual pixel access method
  \-window id           display image to background of this window
  \-window-group id     exit program when this window id is destroyed
  \-write filename      write image to a file

Image Operators:
  \-auto-orient         automatically orient image
  \-border geometry     surround image with a border of color
  \-channel mask        set the image channel mask
  \-clip                clip along the first path from the 8BIM profile
  \-clip-path id        clip along a named path from the 8BIM profile
  \-colors value        preferred number of colors in the image
  \-contrast            enhance or reduce the image contrast
  \-crop geometry       preferred size and location of the cropped image
  \-despeckle           reduce the speckles within an image
  \-edge factor         apply a filter to detect edges in the image
  \-enhance             apply a digital filter to enhance a noisy image
  \-extent geometry     set the image size
  \-extract geometry    extract area from image
  \-flip                flip image in the vertical direction
  \-flop                flop image in the horizontal direction
  \-frame geometry      surround image with an ornamental border
  \-gamma value         level of gamma correction
  \-monochrome          transform image to black and white
  \-negate              replace each pixel with its complementary color
  \-normalize           transform image to span the full range of colors
  \-raise value         lighten/darken image edges to create a 3-D effect
  \-resample geometry   change the resolution of an image
  \-resize geometry     resize the image
  \-roll geometry       roll an image vertically or horizontally
  \-rotate degrees      apply Paeth rotation to the image
  \-sample geometry     scale image with pixel sampling
  \-segment value       segment an image
  \-sharpen geometry    sharpen the image
  \-strip               strip image of all profiles and comments
  \-threshold value     threshold the image
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

In addition to those listed above, you can specify these standard X resources as command line options:  \-background, \-bordercolor, \-borderwidth, \-font, \-foreground, \-iconGeometry, \-iconic, \-mattecolor, \-name, \-shared-memory, \-usePixmap, or \-title.

By default, the image format of `file' is determined by its magic number.  To specify a particular image format, precede the filename with an image format name and a colon (i.e. ps:image) or specify the image type as the filename suffix (i.e. image.ps).  Specify 'file' as '-' for standard input or output.

Buttons: 
  1    press to map or unmap the Command widget
  2    press and drag to magnify a region of an image
  3    press to load an image from a visual image directory
.SH NOTE
The display program defaults to the X screen resolution.  To display vector formats at their intended size, override the default resolution:

  display -density 72 drawing.svg
.SH SEE ALSO
ImageMagick(1)

.SH COPYRIGHT

\fBCopyright (C) 1999 ImageMagick Studio LLC. Additional copyrights and licenses apply to this software, see file:///usr/local/share/doc/ImageMagick-7/www/license.html or https://imagemagick.org/script/license.php\fP
```

--------------------------------------------------------------------------------

---[FILE: display.1.in]---
Location: ImageMagick-main/utilities/display.1.in

```text
.TH display 1 "Date: 2009/01/10 01:00:00" "ImageMagick"
.SH NAME
display \- displays an image or image sequence on any X server.
.SH SYNOPSIS
.TP
\fBmagick display\fP [\fIoptions\fP] \fIinput-file\fP
.SH OVERVIEW
The \fBdisplay\fP program is a member of the ImageMagick(1) suite of tools.  Use it to display an image or image sequence on any X server.

For more information about the display command, point your browser to file://@DOCUMENTATION_PATH@/www/display.html or https://imagemagick.org/script/display.php.
.SH DESCRIPTION
Image Settings:
  \-alpha option        on, activate, off, deactivate, set, opaque, copy
                        transparent, extract, background, or shape
  \-antialias           remove pixel-aliasing
  \-authenticate value  decrypt image with this password
  \-backdrop            display image centered on a backdrop
  \-colormap type       Shared or Private
  \-colorspace type     alternate image colorspace
  \-comment string      annotate image with comment
  \-compress type       type of pixel compression when writing the image
  \-decipher filename   convert cipher pixels to plain pixels
  \-deskew threshold    straighten an image
  \-define format:option
                       define one or more image format options
  \-delay centiseconds  display the next image after pausing
  \-density geometry    horizontal and vertical density of the image
  \-depth value         image depth
  \-display server      display image to this X server
  \-dispose method      layer disposal method
  \-dither method       apply error diffusion to image
  \-endian type         endianness (MSB or LSB) of the image
  \-equalize            perform histogram equalization to an image
  \-filter type         use this filter when resizing an image
  \-format "string"     output formatted image characteristics
  \-fuzz distance       colors within this distance are considered equal
  \-geometry geometry   preferred size and location of the Image window
  \-gravity type        horizontal and vertical backdrop placement
  \-identify            identify the format and characteristics of the image
  \-immutable           displayed image cannot be modified
  \-interlace type      type of image interlacing scheme
  \-interpolate method  pixel color interpolation method
  \-label string        assign a label to an image
  \-limit type value    pixel cache resource limit
  \-loop iterations     loop images then exit
  \-map type            display image using this Standard Colormap
  \-matte               store matte channel if the image has one
  \-monitor             monitor progress
  \-page geometry       size and location of an image canvas
  \-profile filename    add, delete, or apply an image profile
  \-quality value       JPEG/MIFF/PNG compression level
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
  \-set property value  set an image property
  \-size geometry       width and height of image
  \-support factor      resize support: > 1.0 is blurry, < 1.0 is sharp
  \-texture filename    name of texture to tile onto the image background
  \-transparent-color color
                       transparent color
  \-treedepth value     color tree depth
  \-update seconds      detect when image file is modified and redisplay
  \-verbose             print detailed information about the image
  \-visual type         display image using this visual type
  \-virtual-pixel method
                       virtual pixel access method
  \-window id           display image to background of this window
  \-window-group id     exit program when this window id is destroyed
  \-write filename      write image to a file

Image Operators:
  \-auto-orient         automatically orient image
  \-border geometry     surround image with a border of color
  \-channel mask        set the image channel mask
  \-clip                clip along the first path from the 8BIM profile
  \-clip-path id        clip along a named path from the 8BIM profile
  \-colors value        preferred number of colors in the image
  \-contrast            enhance or reduce the image contrast
  \-crop geometry       preferred size and location of the cropped image
  \-despeckle           reduce the speckles within an image
  \-edge factor         apply a filter to detect edges in the image
  \-enhance             apply a digital filter to enhance a noisy image
  \-extent geometry     set the image size
  \-extract geometry    extract area from image
  \-flip                flip image in the vertical direction
  \-flop                flop image in the horizontal direction
  \-frame geometry      surround image with an ornamental border
  \-gamma value         level of gamma correction
  \-monochrome          transform image to black and white
  \-negate              replace each pixel with its complementary color
  \-normalize           transform image to span the full range of colors
  \-raise value         lighten/darken image edges to create a 3-D effect
  \-resample geometry   change the resolution of an image
  \-resize geometry     resize the image
  \-roll geometry       roll an image vertically or horizontally
  \-rotate degrees      apply Paeth rotation to the image
  \-sample geometry     scale image with pixel sampling
  \-segment value       segment an image
  \-sharpen geometry    sharpen the image
  \-strip               strip image of all profiles and comments
  \-threshold value     threshold the image
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

In addition to those listed above, you can specify these standard X resources as command line options:  \-background, \-bordercolor, \-borderwidth, \-font, \-foreground, \-iconGeometry, \-iconic, \-mattecolor, \-name, \-shared-memory, \-usePixmap, or \-title.

By default, the image format of `file' is determined by its magic number.  To specify a particular image format, precede the filename with an image format name and a colon (i.e. ps:image) or specify the image type as the filename suffix (i.e. image.ps).  Specify 'file' as '-' for standard input or output.

Buttons: 
  1    press to map or unmap the Command widget
  2    press and drag to magnify a region of an image
  3    press to load an image from a visual image directory
.SH NOTE
The display program defaults to the X screen resolution.  To display vector formats at their intended size, override the default resolution:

  display -density 72 drawing.svg
.SH SEE ALSO
ImageMagick(1)

.SH COPYRIGHT

\fBCopyright (C) 1999 ImageMagick Studio LLC. Additional copyrights and licenses apply to this software, see file://@DOCUMENTATION_PATH@/www/license.html or https://imagemagick.org/script/license.php\fP
```

--------------------------------------------------------------------------------

---[FILE: identify.1]---
Location: ImageMagick-main/utilities/identify.1

```text
.TH identify 1 "Date: 2009/01/10 01:00:00" "ImageMagick"
.SH NAME
identify \- describes the format and characteristics of one or more image files.
.SH SYNOPSIS
.TP
\fBmagick identify\fP [\fIoptions\fP] \fIinput-file\fP
.SH OVERVIEW
The \fBidentify\fP program is a member of the ImageMagick(1) suite of tools.  It describes the format and characteristics of one or more image files. It also reports if an image is incomplete or corrupt. The information returned includes the image number, the file name, the width and height of the image, whether the image is colormapped or not, the number of colors in the image (by default off use \fI-define unique=true\fP option), the number of bytes in the image, the format of the image (JPEG, PNM, etc.), and finally the number of seconds it took to read and process the image. Many more attributes are available with the verbose option.

For more information about the identify command, point your browser to file:///usr/local/share/doc/ImageMagick-7/www/identify.html or https://imagemagick.org/script/identify.php.
.SH DESCRIPTION
Image Settings:
  \-alpha option        on, activate, off, deactivate, set, opaque, copy
                       transparent, extract, background, or shape
  \-antialias           remove pixel-aliasing
  \-authenticate value  decrypt image with this password
  \-clip                clip along the first path from the 8BIM profile
  \-clip-mask filename  associate a clip mask with the image
  \-clip-path id        clip along a named path from the 8BIM profile
  \-colorspace type     alternate image colorspace
  \-crop geometry       cut out a rectangular region of the image
  \-define format:option
                       define one or more image format options
  \-define unique=true  return the number of unique colors in the image
  \-density geometry    horizontal and vertical density of the image
  \-depth value         image depth
  \-endian type         endianness (MSB or LSB) of the image
  \-extract geometry    extract area from image
  \-features distance   analyze image features (e.g. contrast, correlation)
  \-format "string"     output formatted image characteristics
  \-fuzz distance       colors within this distance are considered equal
  \-gamma value         of gamma correction
  \-interlace type      type of image interlacing scheme
  \-interpolate method  pixel color interpolation method
  \-limit type value    pixel cache resource limit
  \-list type           Color, Configure, Delegate, Format, Magic, Module,
                       Resource, or Type
  \-matte               store matte channel if the image has one
  \-moments             report image moments
  \-monitor             monitor progress
  \-ping                efficiently determine image attributes
  \-precision value     maximum number of significant digits to print
  \-quiet               suppress all warning messages
  \-read-mask filename  associate a read mask with the image
  \-regard-warnings     pay attention to warning messages
  \-respect-parentheses settings remain in effect until parenthesis boundary
  \-sampling-factor geometry
                       horizontal and vertical sampling factor
  \-seed value          seed a new sequence of pseudo-random numbers
  \-set attribute value set an image attribute
  \-size geometry       width and height of image
  \-strip               strip image of all profiles and comments
  \-unique              display the number of unique colors in the image
  \-units type          the units of image resolution
  \-verbose             print detailed information about the image
  \-virtual-pixel method
                       virtual pixel access method

Image Operators:
  \-auto-orient         automatically orient image
  \-channel mask        set the image channel mask
  \-grayscale method    convert image to grayscale
  \-negate              replace each pixel with its complementary color 

Miscellaneous Options:
  \-debug events        display copious debugging information
  \-help                print program options
  \-list type           print a list of supported option arguments
  \-log format          format of debugging information
  \-version             print version information

By default, the image format of `file' is determined by its magic number.  To specify a particular image format, precede the filename with an image format name and a colon (i.e. ps:image) or specify the image type as the filename suffix (i.e. image.ps).  Specify 'file' as '-' for standard input or output.
.SH NOTE
Although some options appear to modify the file to be identified, the identify command is strictly \fBread only\fP. For instance, the crop option crops the in-memory image and then describes the result.
.SH SEE ALSO
ImageMagick(1)

.SH COPYRIGHT

\fBCopyright (C) 1999 ImageMagick Studio LLC. Additional copyrights and licenses apply to this software, see file:///usr/local/share/doc/ImageMagick-7/www/license.html or https://imagemagick.org/script/license.php\fP
```

--------------------------------------------------------------------------------

---[FILE: identify.1.in]---
Location: ImageMagick-main/utilities/identify.1.in

```text
.TH identify 1 "Date: 2009/01/10 01:00:00" "ImageMagick"
.SH NAME
identify \- describes the format and characteristics of one or more image files.
.SH SYNOPSIS
.TP
\fBmagick identify\fP [\fIoptions\fP] \fIinput-file\fP
.SH OVERVIEW
The \fBidentify\fP program is a member of the ImageMagick(1) suite of tools.  It describes the format and characteristics of one or more image files. It also reports if an image is incomplete or corrupt. The information returned includes the image number, the file name, the width and height of the image, whether the image is colormapped or not, the number of colors in the image (by default off use \fI-define unique=true\fP option), the number of bytes in the image, the format of the image (JPEG, PNM, etc.), and finally the number of seconds it took to read and process the image. Many more attributes are available with the verbose option.

For more information about the identify command, point your browser to file://@DOCUMENTATION_PATH@/www/identify.html or https://imagemagick.org/script/identify.php.
.SH DESCRIPTION
Image Settings:
  \-alpha option        on, activate, off, deactivate, set, opaque, copy
                       transparent, extract, background, or shape
  \-antialias           remove pixel-aliasing
  \-authenticate value  decrypt image with this password
  \-clip                clip along the first path from the 8BIM profile
  \-clip-mask filename  associate a clip mask with the image
  \-clip-path id        clip along a named path from the 8BIM profile
  \-colorspace type     alternate image colorspace
  \-crop geometry       cut out a rectangular region of the image
  \-define format:option
                       define one or more image format options
  \-define unique=true  return the number of unique colors in the image
  \-density geometry    horizontal and vertical density of the image
  \-depth value         image depth
  \-endian type         endianness (MSB or LSB) of the image
  \-extract geometry    extract area from image
  \-features distance   analyze image features (e.g. contrast, correlation)
  \-format "string"     output formatted image characteristics
  \-fuzz distance       colors within this distance are considered equal
  \-gamma value         of gamma correction
  \-interlace type      type of image interlacing scheme
  \-interpolate method  pixel color interpolation method
  \-limit type value    pixel cache resource limit
  \-list type           Color, Configure, Delegate, Format, Magic, Module,
                       Resource, or Type
  \-matte               store matte channel if the image has one
  \-moments             report image moments
  \-monitor             monitor progress
  \-ping                efficiently determine image attributes
  \-precision value     maximum number of significant digits to print
  \-quiet               suppress all warning messages
  \-read-mask filename  associate a read mask with the image
  \-regard-warnings     pay attention to warning messages
  \-respect-parentheses settings remain in effect until parenthesis boundary
  \-sampling-factor geometry
                       horizontal and vertical sampling factor
  \-seed value          seed a new sequence of pseudo-random numbers
  \-set attribute value set an image attribute
  \-size geometry       width and height of image
  \-strip               strip image of all profiles and comments
  \-unique              display the number of unique colors in the image
  \-units type          the units of image resolution
  \-verbose             print detailed information about the image
  \-virtual-pixel method
                       virtual pixel access method

Image Operators:
  \-auto-orient         automatically orient image
  \-channel mask        set the image channel mask
  \-grayscale method    convert image to grayscale
  \-negate              replace each pixel with its complementary color 

Miscellaneous Options:
  \-debug events        display copious debugging information
  \-help                print program options
  \-list type           print a list of supported option arguments
  \-log format          format of debugging information
  \-version             print version information

By default, the image format of `file' is determined by its magic number.  To specify a particular image format, precede the filename with an image format name and a colon (i.e. ps:image) or specify the image type as the filename suffix (i.e. image.ps).  Specify 'file' as '-' for standard input or output.
.SH NOTE
Although some options appear to modify the file to be identified, the identify command is strictly \fBread only\fP. For instance, the crop option crops the in-memory image and then describes the result.
.SH SEE ALSO
ImageMagick(1)

.SH COPYRIGHT

\fBCopyright (C) 1999 ImageMagick Studio LLC. Additional copyrights and licenses apply to this software, see file://@DOCUMENTATION_PATH@/www/license.html or https://imagemagick.org/script/license.php\fP
```

--------------------------------------------------------------------------------

---[FILE: ImageMagick.1]---
Location: ImageMagick-main/utilities/ImageMagick.1

```text
.TH ImageMagick 1 "2020-04-25" "ImageMagick"

.SH NAME
ImageMagick \- a free software suite for the creation, modification and
display of bitmap images.

.SH SYNOPSIS
\fBmagick\fP [\fIoptions\fP|\fIinput-file\fP]... \fIoutput-file\fP
\fBmagick-script\fP \fIscript-file\fP [\fIscript-arguments\fP]...

.SH OVERVIEW

Use ImageMagick\[rg] to create, edit, compose, or convert bitmap images. It can
read and write images in a variety of formats (over 200) including PNG, JPEG,
GIF, HEIC, TIFF, DPX, EXR, WebP, Postscript, PDF, and SVG. Use ImageMagick to
resize, flip, mirror, rotate, distort, shear and transform images, adjust image
colors, apply various special effects, or draw text, lines, polygons, ellipses
and B\['e]zier curves.

The functionality of ImageMagick is typically utilized from the command-line.
It can also be accessed from programs written in your favorite language using
the corresponding interface: G2F (Ada), MagickCore (C), MagickWand (C),
ChMagick (Ch), ImageMagickObject (COM+), Magick++ (C++), JMagick (Java),
JuliaIO (Julia), L-Magick (Lisp), Lua (LuaJIT), NMagick (Neko/haXe), Magick.NET
(.NET), PascalMagick (Pascal), ALImageMagick (Delphi), PerlMagick (Perl),
MagickWand for PHP (PHP), IMagick (PHP), PythonMagick (Python), magick (R),
RMagick (Ruby), or TclMagick (Tcl/TK). With a language interface, use
ImageMagick to modify or create images dynamically and automagically.

ImageMagick utilizes multiple computational threads to increase performance.
It can read, process, or write mega-, giga-, or tera-pixel image sizes.

ImageMagick is free software delivered as a ready-to-run binary distribution,
or as source code that you may use, copy, modify, and distribute in both open
and proprietary applications. It is distributed under a derived Apache 2.0
license.

The ImageMagick development process ensures a stable API and ABI. Before each
ImageMagick release, we perform a comprehensive security assessment that
includes memory error, thread data race detection, and continuous fuzzing to
help prevent security vulnerabilities.

The current release is ImageMagick 7.0.8-11. It runs on Linux, Windows, macOS,
iOS, Android OS, and others.  We continue to maintain the legacy release of
ImageMagick, version 6, at https://legacy.imagemagick.org.

The authoritative ImageMagick web site is https://imagemagick.org. The
authoritative source code repository is https://github.com/ImageMagick. We
maintain a source code mirror at https://gitlab.com/ImageMagick.

ImageMagick is a suite of command-line utilities for manipulating images.  You
may have edited images at one time or another using programs such as GIMP or
Photoshop, which expose their functionality mainly through a graphical user
interface. However, a GUI program is not always the right tool. Suppose you
want to process an image dynamically from a web script, or you want to apply
the same operations to many images, or repeat a specific operation at different
times to the same or different image. For these types of operations, a
command-line utility is more suitable.

The remaining of this manpage is a list of the available command-line utilities
and their short descriptions.  For further documentation concerning a
particular command and its options, consult the corresponding manpage. If you
are just getting acquainted with ImageMagick, start at the top of that list, the
magick(1) program, and work your way down. Also, make sure to check out Anthony
Thyssen's tutorial on how to use ImageMagick utilities to convert, compose, or
edit images from the command-line.

.TP
.B magick
Read images into memory, perform operations on those images, and write them out
to either the same or some other image file format.  The "-script" option can
be used to switch from processing command line options, to reading options from
a file or pipeline.

.TP
.B magick-script
This command is similar to magick(1) but with an implied "-script" option.  It
is useful in special "#!/usr/bin/env magick-script" scripts that search for the
magick-script(1) command anywhere along the users PATH, rather than in a
hardcoded command location.

.TP
.B convert
Available for Backward compatibility with ImageMagick's version 6 convert(1).
Essentially, it is just an alias to a restrictive form of the magick(1)
command, which should be used instead.

.TP
.B mogrify
Resize an image, blur, crop, despeckle, dither, draw on, flip, join, re-sample,
and much more. This command overwrites the original image file, whereas
convert(1) writes to a different image file.

.TP
.B identify
Describe the format and characteristics of one or more image files.

.TP
.B composite
Overlap one image over another.

.TP
.B montage
Create a composite image by combining several separate ones. The images are
tiled on the composite image, optionally adorned with a border, frame, image
name, and more.

.TP
.B compare
Mathematically and visually annotate the difference between an image and its
reconstruction.

.TP
.B stream
Stream one or more pixel components of the image or portion of the image to
your choice of storage formats. It writes the pixel components as they are read
from the input image, a row at a time, making stream(1) desirable when working
with large images, or when you require raw pixel components.

.TP
.B display
Display an image or image sequence on any X server.

.TP
.B animate
Animate an image sequence on any X server.

.TP
.B import
Save any visible window on any X server and output it as an image file. You can
capture a single window, the entire screen, or any rectangular portion of the
it.

.TP
.B conjure
Interpret and execute scripts written in the Magick Scripting Language (MSL).

.PP
For more information about the ImageMagick, point your browser to
file:///usr/local/share/doc/ImageMagick-7/index.html or
https://imagemagick.org/.

.SH SEE ALSO
convert(1),
compare(1),
composite(1),
conjure(1),
identify(1),
import(1),
magick(1),
magick-script(1),
montage(1),
display(1),
animate(1),
import(1),
Magick++-config(1),
MagickCore-config(1),
MagickWand-config(1)

.SH COPYRIGHT
\fBCopyright (C) 1999 ImageMagick Studio LLC. Additional copyrights and
licenses apply to this software, see
file:///usr/local/share/doc/ImageMagick-7/www/license.html or
https://imagemagick.org/script/license.php\fP
```

--------------------------------------------------------------------------------

---[FILE: ImageMagick.1.in]---
Location: ImageMagick-main/utilities/ImageMagick.1.in

```text
.TH ImageMagick 1 "2020-04-25" "ImageMagick"

.SH NAME
ImageMagick \- a free software suite for the creation, modification and
display of bitmap images.

.SH SYNOPSIS
\fBmagick\fP [\fIoptions\fP|\fIinput-file\fP]... \fIoutput-file\fP
\fBmagick-script\fP \fIscript-file\fP [\fIscript-arguments\fP]...

.SH OVERVIEW

Use ImageMagick\[rg] to create, edit, compose, or convert bitmap images. It can
read and write images in a variety of formats (over 200) including PNG, JPEG,
GIF, HEIC, TIFF, DPX, EXR, WebP, Postscript, PDF, and SVG. Use ImageMagick to
resize, flip, mirror, rotate, distort, shear and transform images, adjust image
colors, apply various special effects, or draw text, lines, polygons, ellipses
and B\['e]zier curves.

The functionality of ImageMagick is typically utilized from the command-line.
It can also be accessed from programs written in your favorite language using
the corresponding interface: G2F (Ada), MagickCore (C), MagickWand (C),
ChMagick (Ch), ImageMagickObject (COM+), Magick++ (C++), JMagick (Java),
JuliaIO (Julia), L-Magick (Lisp), Lua (LuaJIT), NMagick (Neko/haXe), Magick.NET
(.NET), PascalMagick (Pascal), ALImageMagick (Delphi), PerlMagick (Perl),
MagickWand for PHP (PHP), IMagick (PHP), PythonMagick (Python), magick (R),
RMagick (Ruby), or TclMagick (Tcl/TK). With a language interface, use
ImageMagick to modify or create images dynamically and automagically.

ImageMagick utilizes multiple computational threads to increase performance.
It can read, process, or write mega-, giga-, or tera-pixel image sizes.

ImageMagick is free software delivered as a ready-to-run binary distribution,
or as source code that you may use, copy, modify, and distribute in both open
and proprietary applications. It is distributed under a derived Apache 2.0
license.

The ImageMagick development process ensures a stable API and ABI. Before each
ImageMagick release, we perform a comprehensive security assessment that
includes memory error, thread data race detection, and continuous fuzzing to
help prevent security vulnerabilities.

The current release is ImageMagick 7.0.8-11. It runs on Linux, Windows, macOS,
iOS, Android OS, and others.  We continue to maintain the legacy release of
ImageMagick, version 6, at https://legacy.imagemagick.org.

The authoritative ImageMagick web site is https://imagemagick.org. The
authoritative source code repository is https://github.com/ImageMagick. We
maintain a source code mirror at https://gitlab.com/ImageMagick.

ImageMagick is a suite of command-line utilities for manipulating images.  You
may have edited images at one time or another using programs such as GIMP or
Photoshop, which expose their functionality mainly through a graphical user
interface. However, a GUI program is not always the right tool. Suppose you
want to process an image dynamically from a web script, or you want to apply
the same operations to many images, or repeat a specific operation at different
times to the same or different image. For these types of operations, a
command-line utility is more suitable.

The remaining of this manpage is a list of the available command-line utilities
and their short descriptions.  For further documentation concerning a
particular command and its options, consult the corresponding manpage. If you
are just getting acquainted with ImageMagick, start at the top of that list, the
magick(1) program, and work your way down. Also, make sure to check out Anthony
Thyssen's tutorial on how to use ImageMagick utilities to convert, compose, or
edit images from the command-line.

.TP
.B magick
Read images into memory, perform operations on those images, and write them out
to either the same or some other image file format.  The "-script" option can
be used to switch from processing command line options, to reading options from
a file or pipeline.

.TP
.B magick-script
This command is similar to magick(1) but with an implied "-script" option.  It
is useful in special "#!/usr/bin/env magick-script" scripts that search for the
magick-script(1) command anywhere along the users PATH, rather than in a
hardcoded command location.

.TP
.B convert
Available for Backward compatibility with ImageMagick's version 6 convert(1).
Essentially, it is just an alias to a restrictive form of the magick(1)
command, which should be used instead.

.TP
.B mogrify
Resize an image, blur, crop, despeckle, dither, draw on, flip, join, re-sample,
and much more. This command overwrites the original image file, whereas
convert(1) writes to a different image file.

.TP
.B identify
Describe the format and characteristics of one or more image files.

.TP
.B composite
Overlap one image over another.

.TP
.B montage
Create a composite image by combining several separate ones. The images are
tiled on the composite image, optionally adorned with a border, frame, image
name, and more.

.TP
.B compare
Mathematically and visually annotate the difference between an image and its
reconstruction.

.TP
.B stream
Stream one or more pixel components of the image or portion of the image to
your choice of storage formats. It writes the pixel components as they are read
from the input image, a row at a time, making stream(1) desirable when working
with large images, or when you require raw pixel components.

.TP
.B display
Display an image or image sequence on any X server.

.TP
.B animate
Animate an image sequence on any X server.

.TP
.B import
Save any visible window on any X server and output it as an image file. You can
capture a single window, the entire screen, or any rectangular portion of the
it.

.TP
.B conjure
Interpret and execute scripts written in the Magick Scripting Language (MSL).

.PP
For more information about the ImageMagick, point your browser to
file://@DOCUMENTATION_PATH@/index.html or
https://imagemagick.org/.

.SH SEE ALSO
convert(1),
compare(1),
composite(1),
conjure(1),
identify(1),
import(1),
magick(1),
magick-script(1),
montage(1),
display(1),
animate(1),
import(1),
Magick++-config(1),
MagickCore-config(1),
MagickWand-config(1)

.SH COPYRIGHT
\fBCopyright (C) 1999 ImageMagick Studio LLC. Additional copyrights and
licenses apply to this software, see
file://@DOCUMENTATION_PATH@/www/license.html or
https://imagemagick.org/script/license.php\fP
```

--------------------------------------------------------------------------------

````

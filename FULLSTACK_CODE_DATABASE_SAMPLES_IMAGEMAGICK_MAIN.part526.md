---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 526
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 526 of 851)

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

---[FILE: magick.1.in]---
Location: ImageMagick-main/utilities/magick.1.in

```text
.TH magick 1 "Date: 2009/01/10 01:00:00" "ImageMagick"
.SH NAME
magick \- convert between image formats as well as resize an image, blur, crop, despeckle, dither, draw on, flip, join, re-sample, and much more.
.SH SYNOPSIS
.TP
\fBmagick\fP [\fIinput-options\fP] \fIinput-file\fP [\fIoutput-options\fP] \fIoutput-file\fP
.SH OVERVIEW
The \fBmagick\fP program is a member of the ImageMagick(1) suite of tools.  Use it to convert between image formats as well as resize an image, blur, crop, despeckle, dither, draw on, flip, join, re-sample, and much more.  

For more information about the magick command, point your browser to file://@DOCUMENTATION_PATH@/www/magick.html or https://imagemagick.org/script/magick.php.
.SH DESCRIPTION
Image Settings:
  \-adjoin              join images into a single multi-image file
  \-affine matrix       affine transform matrix
  \-antialias           remove pixel-aliasing
  \-authenticate value  decrypt image with this password
  \-background color    background color
  \-bias value          add bias when convolving an image
  \-black-point-compensation
                       use black point compensation
  \-blue-primary point  chromaticity blue primary point
  \-bordercolor color   border color
  \-caption string      assign a caption to an image
  \-cdl filename        color correct with a color decision list
  \-colors value        preferred number of colors in the image
  \-colorspace type     alternate image colorspace
  \-comment string      annotate image with comment
  \-compose operator    set image composite operator
  \-compress type       type of pixel compression when writing the image
  \-decipher filename   magick cipher pixels to plain pixels
  \-define format:option
                       define one or more image format options
  \-delay centiseconds  display the next image after pausing
  \-density geometry    horizontal and vertical density of the image
  \-depth value         image depth
  \-direction type      render text right-to-left or left-to-right
  \-display server      get image or font from this X server
  \-dispose method      layer disposal method
  \-dither method       apply error diffusion to image
  \-encipher filename   magick plain pixels to cipher pixels
  \-encoding type       text encoding type
  \-endian type         endianness (MSB or LSB) of the image
  \-family name         render text with this font family
  \-fill color          color to use when filling a graphic primitive
  \-filter type         use this filter when resizing an image
  \-flatten             flatten a sequence of images
  \-font name           render text with this font
  \-format "string"     output formatted image characteristics
  \-fuzz distance       colors within this distance are considered equal
  \-gravity type        horizontal and vertical text placement
  \-green-primary point chromaticity green primary point
  \-intent type         type of rendering intent when managing the image color
  \-interlace type      type of image interlacing scheme
  \-interpolate method  pixel color interpolation method
  \-kerning value       set the space between two letters
  \-label string        assign a label to an image
  \-limit type value    pixel cache resource limit
  \-loop iterations     add Netscape loop extension to your GIF animation
  \-mask filename       associate a mask with the image
  \-matte               store matte channel if the image has one
  \-mattecolor color    frame color
  \-monitor             monitor progress
  \-orient type         image orientation
  \-origin geometry     image origin
  \-page geometry       size and location of an image canvas (setting)
  \-ping                efficiently determine image attributes
  \-pointsize value     font point size
  \-preview type        image preview type
  \-quality value       JPEG/MIFF/PNG compression level
  \-quiet               suppress all warning messages
  \-red-primary point   chromaticity red primary point
  \-regard-warnings     pay attention to warning messages
  \-repage geometry     size and location of an image canvas
  \-sampling-factor geometry
                       horizontal and vertical sampling factor
  \-scene value         image scene number
  \-seed value          seed a new sequence of pseudo-random numbers
  \-size geometry       width and height of image
  \-statistic type geometry
                       replace each pixel with corresponding statistic from the neighborhood
  \-stretch type        render text with this font stretch
  \-stroke color        graphic primitive stroke color
  \-strokewidth value   graphic primitive stroke width
  \-style type          render text with this font style
  \-support factor      resize support: > 1.0 is blurry, < 1.0 is sharp
  \-synchronize         synchronize image to storage device
  \-taint               declare the image as modified
  \-texture filename    name of texture to tile onto the image background
  \-tile-offset geometry
                       tile offset
  \-treedepth value     color tree depth
  \-transparent-color color
                       transparent color
  \-undercolor color    annotation bounding box color
  \-units type          the units of image resolution
  \-verbose             print detailed information about the image
  \-view                FlashPix viewing transforms
  \-virtual-pixel method
                       virtual pixel access method
  \-weight type         render text with this font weight
  \-white-point point   chromaticity white point

Image Operators:
  \-adaptive-blur geometry
                       adaptively blur pixels; decrease effect near edges
  \-adaptive-resize geometry
                       adaptively resize image with data dependent triangulation
  \-adaptive-sharpen geometry
                       adaptively sharpen pixels; increase effect near edges
  \-annotate geometry text
                       annotate the image with text
  \-auto-orient         automatically orient image
  \-bilateral-blur geometry
                        non-linear, edge-preserving, and noise-reducing smoothing filter
  \-black-threshold value
                       force all pixels below the threshold into black
  \-blur geometry       reduce image noise and reduce detail levels
  \-border geometry     surround image with a border of color
  \-channel mask        set the image channel mask
  \-charcoal radius     simulate a charcoal drawing
  \-chop geometry       remove pixels from the image interior
  \-clip                clip along the first path from the 8BIM profile
  \-clip-mask filename  associate a clip mask with the image
  \-clip-path id        clip along a named path from the 8BIM profile
  \-colorize value      colorize the image with the fill color
  \-color-matrix matrix apply color correction to the image
  \-contrast            enhance or reduce the image contrast
  \-contrast-stretch geometry
                       improve contrast by `stretching' the intensity range
  \-convolve coefficients
                       apply a convolution kernel to the image
  \-cycle amount        cycle the image colormap
  \-despeckle           reduce the speckles within an image
  \-draw string         annotate the image with a graphic primitive
  \-edge radius         apply a filter to detect edges in the image
  \-emboss radius       emboss an image
  \-enhance             apply a digital filter to enhance a noisy image
  \-equalize            perform histogram equalization to an image
  \-evaluate operator value
                       evaluate an arithmetic, relational, or logical expression
  \-extent geometry     set the image size
  \-extract geometry    extract area from image
  \-fft                 implements the discrete Fourier transform (DFT)
  \-flip                flip image vertically
  \-floodfill geometry color
                       floodfill the image with color
  \-flop                flop image horizontally
  \-frame geometry      surround image with an ornamental border
  \-function name       apply a function to the image
  \-gamma value         level of gamma correction
  \-gaussian-blur geometry
                       reduce image noise and reduce detail levels
  \-geometry geometry   preferred size or location of the image
  \-identify            identify the format and characteristics of the image
  \-ift                 implements the inverse discrete Fourier transform (DFT)
  \-implode amount      implode image pixels about the center
  \-integral            calculate the sum of values (pixel values) in the image
  \-lat geometry        local adaptive thresholding
  \-layers method       optimize or compare image layers
  \-level value         adjust the level of image contrast
  \-linear-stretch geometry
                       improve contrast by `stretching with saturation' the intensity range
  \-median geometry     apply a median filter to the image
  \-mode geometry       make each pixel the 'predominant color' of the neighborhood
  \-modulate value      vary the brightness, saturation, and hue
  \-monochrome          transform image to black and white
  \-morphology method kernel
                       apply a morphology method to the image
  \-motion-blur geometry
                       simulate motion blur
  \-negate              replace each pixel with its complementary color 
  \-noise geometry      add or reduce noise in an image
  \-normalize           transform image to span the full range of colors
  \-opaque color        change this color to the fill color
  \-ordered-dither NxN
                       add a noise pattern to the image with specific amplitudes
  \-paint radius        simulate an oil painting
  \-polaroid angle      simulate a Polaroid picture
  \-posterize levels    reduce the image to a limited number of color levels
  \-print string        interpret string and print to console
  \-profile filename    add, delete, or apply an image profile
  \-quantize colorspace reduce colors in this colorspace
  \-radial-blur angle   radial blur the image
  \-raise value         lighten/darken image edges to create a 3-D effect
  \-random-threshold low,high
                       random threshold the image
  \-range-threshold values
                       perform either hard or soft thresholding within some range of values in an image
  \-region geometry     apply options to a portion of the image
  \-render              render vector graphics
  \-resample geometry   change the resolution of an image
  \-resize geometry     resize the image
  \-roll geometry       roll an image vertically or horizontally
  \-rotate degrees      apply Paeth rotation to the image
  \-sample geometry     scale image with pixel sampling
  \-scale geometry      scale the image
  \-segment values      segment an image
  \-selective-blur geometry
                       selectively blur pixels within a contrast threshold
  \-sepia-tone threshold
                       simulate a sepia-toned photo
  \-set property value  set an image property
  \-shade degrees       shade the image using a distant light source
  \-shadow geometry     simulate an image shadow
  \-sharpen geometry    sharpen the image
  \-shave geometry      shave pixels from the image edges
  \-shear geometry      slide one edge of the image along the X or Y axis
  \-sigmoidal-contrast geometry
                       lightness rescaling using sigmoidal contrast enhancement
  \-sketch geometry     simulate a pencil sketch
  \-solarize threshold  negate all pixels above the threshold level
  \-sort-pixels         sort each scanline in ascending order of intensity
  \-splice geometry     splice the background color into the image
  \-spread amount       displace image pixels by a random amount
  \-strip               strip image of all profiles and comments
  \-swirl degrees       swirl image pixels about the center
  \-threshold value     threshold the image
  \-thumbnail geometry  create a thumbnail of the image
  \-tile filename       tile image when filling a graphic primitive
  \-tint value          tint the image with the fill color
  \-transform           affine transform image
  \-transparent color   make this color transparent within the image
  \-transpose           flip image vertically and rotate 90 degrees
  \-transverse          flop image horizontally and rotate 270 degrees
  \-trim                trim image edges
  \-type type           image type
  \-unique-colors       discard all but one of any pixel color
  \-unsharp geometry    sharpen the image
  \-vignette geometry   soften the edges of the image in vignette style
  \-wave geometry       alter an image along a sine wave
  \-white-threshold value
                       force all pixels above the threshold into white


Image Channel Operators:
  \-channel-extract channel-list
                        extract the channels in order
  \-channel-inject channel-list
                        inject the channels in order
  \-channel-swap channel,channel
                        swap the channels

Image Sequence Operators:
  \-affinity filename   transform image colors to match this set of colors
  \-append              append an image sequence top to bottom (use +append for left to right)
  \-clut                apply a color lookup table to the image
  \-coalesce            merge a sequence of images
  \-combine             combine a sequence of images
  \-composite           composite image
  \-crop geometry       cut out a rectangular region of the image
  \-deconstruct         break down an image sequence into constituent parts
  \-evaluate-sequence operator
                       evaluate an arithmetic, relational, or logical expression
  \-flatten             flatten a sequence of images
  \-fx expression       apply mathematical expression to an image channel(s)
  \-hald-clut           apply a Hald color lookup table to the image
  \-morph value         morph an image sequence
  \-mosaic              create a mosaic from an image sequence
  \-process arguments   process the image with a custom image filter
  \-separate            separate an image channel into a grayscale image
  \-smush geometry      smush an image sequence together
  \-write filename      write images to this file

Image Stack Operators:
  \-clone indexes       clone an image
  \-delete indexes      delete the image from the image sequence
  \-duplicate count,indexes
                       duplicate an image one or more times
  \-insert index        insert last image into the image sequence
  \-swap indexes        swap two images in the image sequence

Miscellaneous Options:
  \-debug events        display copious debugging information
  \-help                print program options
  \-log format          format of debugging information
  \-list type           print a list of supported option arguments
  \-version             print version information

Use any setting or operator as an \fIoutput-option\fP.  Only a limited number of setting are  \fIinput-option\fP. They include: \-antialias, \-caption, \-density, \-define, \-encoding, \-font, \-pointsize, \-size, and \-texture as well as any of the miscellaneous options.

By default, the image format of `file' is determined by its magic number.  To specify a particular image format, precede the filename with an image format name and a colon (i.e. ps:image) or specify the image type as the filename suffix (i.e. image.ps).  Specify 'file' as '-' for standard input or output.
.SH SEE ALSO
ImageMagick(1)

.SH COPYRIGHT
\fBCopyright (C) 1999 ImageMagick Studio LLC. Additional copyrights and licenses apply to this software, see file://@DOCUMENTATION_PATH@/www/license.html or https://imagemagick.org/script/license.php\fP
```

--------------------------------------------------------------------------------

---[FILE: magick.c]---
Location: ImageMagick-main/utilities/magick.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                 M   M   AAA    GGGG  IIIII   CCCC  K   K                    %
%                 MM MM  A   A  G        I    C      K  K                     %
%                 M M M  AAAAA  G GGG    I    C      KKK                      %
%                 M   M  A   A  G   G    I    C      K  K                     %
%                 M   M  A   A   GGGG  IIIII   CCCC  K   K                    %
%                                                                             %
%                                                                             %
%       Perform "Magick" on Images via the Command Line Interface             %
%                                                                             %
%                             Dragon Computing                                %
%                             Anthony Thyssen                                 %
%                               January 2012                                  %
%                                                                             %
%                                                                             %
%  Copyright 1999 ImageMagick Studio LLC, a non-profit organization           %
%  dedicated to making software imaging solutions freely available.           %
%                                                                             %
%  You may not use this file except in compliance with the License.  You may  %
%  obtain a copy of the License at                                            %
%                                                                             %
%    https://imagemagick.org/script/license.php                               %
%                                                                             %
%  Unless required by applicable law or agreed to in writing, software        %
%  distributed under the License is distributed on an "AS IS" BASIS,          %
%  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   %
%  See the License for the specific language governing permissions and        %
%  limitations under the License.                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  Read CLI arguments, script files, and pipelines, to provide options that
%  manipulate images from many different formats.
%
*/

/*
  Include declarations.
*/
#include "MagickWand/studio.h"
#include "MagickWand/MagickWand.h"
#include "MagickCore/resource-private.h"

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%  M a i n                                                                    %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%
*/

static int MagickMain(int argc,char **argv)
{
#define MagickCommandSize(name,use_metadata,command) \
  { (name), sizeof(name)-1, (use_metadata), (command) }

  typedef struct _CommandInfo
  {
    const char
      *client_name;

    size_t
      extent;

    MagickBooleanType
      use_metadata;

    MagickCommand
      command;
  } CommandInfo;

  const CommandInfo
    MagickCommands[] =
    {
      MagickCommandSize("magick", MagickFalse, MagickImageCommand),
#if !defined(MAGICKCORE_EXCLUDE_DEPRECATED)
      MagickCommandSize("convert", MagickFalse, ConvertImageCommand),
#endif
      MagickCommandSize("composite", MagickFalse, CompositeImageCommand),
      MagickCommandSize("identify", MagickTrue, IdentifyImageCommand),
      MagickCommandSize("animate", MagickFalse, AnimateImageCommand),
      MagickCommandSize("compare", MagickTrue, CompareImagesCommand),
      MagickCommandSize("conjure", MagickFalse, ConjureImageCommand),
      MagickCommandSize("display", MagickFalse, DisplayImageCommand),
      MagickCommandSize("import", MagickFalse, ImportImageCommand),
      MagickCommandSize("mogrify", MagickFalse, MogrifyImageCommand),
      MagickCommandSize("montage", MagickFalse, MontageImageCommand),
      MagickCommandSize("stream", MagickFalse, StreamImageCommand)
    };

  char
    client_name[MagickPathExtent],
    *metadata;

  ExceptionInfo
    *exception;

  ImageInfo
    *image_info;

  int
    exit_code,
    offset;

  MagickBooleanType
    status;

  size_t
    number_commands;

  ssize_t
    i;
  
#if defined(MAGICKCORE_EXCLUDE_DEPRECATED)
  if ((argc > 1) &&
      (LocaleNCompare("magick",argv[0],sizeof("magick")-1) == 0) &&
      (LocaleNCompare("convert",argv[1],sizeof("convert")-1) == 0))
    {
      (void) fprintf(stderr,"Use \"magick\" instead of the deprecated command \"magick convert\".\n");
      exit(1);
    }
#endif
  MagickCoreGenesis(*argv,MagickTrue);
  MagickWandGenesis();
  exception=AcquireExceptionInfo();
  image_info=AcquireImageInfo();
  GetPathComponent(argv[0],TailPath,client_name);
  number_commands=sizeof(MagickCommands)/sizeof(MagickCommands[0]);
  for (i=0; i < (ssize_t) number_commands; i++)
  {
    offset=LocaleNCompare(MagickCommands[i].client_name,client_name,
      MagickCommands[i].extent);
    if (offset == 0)
      break;
  }
  i%=(ssize_t) number_commands;
  if ((i == 0) && (argc > 1))
    {
      for (i=1; i < (ssize_t) number_commands; i++)
      {
        offset=LocaleCompare(MagickCommands[i].client_name,argv[1]);
        if (offset == 0)
          {
            argc--;
            argv++;
            break;
          }
      }
      i%=(ssize_t) number_commands;
    }
  metadata=(char *) NULL;
  status=MagickCommandGenesis(image_info,MagickCommands[i].command,argc,argv,
    MagickCommands[i].use_metadata ? &metadata : (char **) NULL,exception);
  if (metadata != (char *) NULL)
    {
      (void) fputs(metadata,stdout);
      metadata=DestroyString(metadata);
    }
  if (MagickCommands[i].command != CompareImagesCommand)
    exit_code=status != MagickFalse ? 0 : 1;
  else
    {
      if (status == MagickFalse)
        exit_code=2;
      else
        {
          const char
            *option;

          option=GetImageOption(image_info,"compare:dissimilar");
          exit_code=IsStringTrue(option) ? 1 : 0;
        }
    }
  image_info=DestroyImageInfo(image_info);
  exception=DestroyExceptionInfo(exception);
  MagickWandTerminus();
  return(exit_code);
}

#if !defined(MAGICKCORE_WINDOWS_SUPPORT) || defined(__CYGWIN__)
int main(int argc,char **argv)
{
  return(MagickMain(argc,argv));
}
#else
static LONG WINAPI NTUncaughtException(EXCEPTION_POINTERS *info)
{
  magick_unreferenced(info);
  AsynchronousResourceComponentTerminus();
  return(EXCEPTION_CONTINUE_SEARCH);
}

int wmain(int argc,wchar_t *argv[])
{
  char
    **utf8;

  int
    i,
    status;

  SetUnhandledExceptionFilter(NTUncaughtException);
  SetConsoleOutputCP(CP_UTF8);
  utf8=NTArgvToUTF8(argc,argv);
  status=MagickMain(argc,utf8);
  for (i=0; i < argc; i++)
    utf8[i]=DestroyString(utf8[i]);
  utf8=(char **) RelinquishMagickMemory(utf8);
  return(status);
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: Makefile.am]---
Location: ImageMagick-main/utilities/Makefile.am

```text
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
#  Makefile for building ImageMagick utilities.

if WITH_UTILITIES
UTILITIES_PGMS = \
  utilities/magick

UTILITIES_XFAIL_TESTS = \
  $(UTILITIES_TTF_XFAIL_TESTS) \
  $(UTILITIES_XML_XFAIL_TESTS)

if WIN32_NATIVE_BUILD
UTILITIES_LDFLAGS_EXTRA = -municode
else
UTILITIES_LDFLAGS_EXTRA =
endif

utilities_magick_LDADD    = $(MAGICKCORE_LIBS) $(MAGICKWAND_LIBS)
utilities_magick_LDFLAGS  = $(LDFLAGS) $(UTILITIES_LDFLAGS_EXTRA)
utilities_magick_SOURCES  = utilities/magick.c
nodist_EXTRA_utilities_magick_SOURCES = dummy.cxx

UTILITIES_MANS = \
  utilities/ImageMagick.1 \
  utilities/animate.1 \
  utilities/compare.1 \
  utilities/composite.1 \
  utilities/conjure.1 \
  utilities/convert.1 \
  utilities/display.1 \
  utilities/identify.1 \
  utilities/import.1 \
  utilities/magick.1 \
  utilities/magick-script.1 \
  utilities/mogrify.1 \
  utilities/montage.1 \
  utilities/stream.1

UTILITIES_CONFIGURE = \
  utilities/ImageMagick.1.in \
  utilities/animate.1.in \
  utilities/compare.1.in \
  utilities/composite.1.in \
  utilities/conjure.1.in \
  utilities/convert.1.in \
  utilities/display.1.in \
  utilities/identify.1.in \
  utilities/import.1.in \
  utilities/magick.1.in \
  utilities/magick-script.1.in \
  utilities/mogrify.1.in \
  utilities/montage.1.in \
  utilities/stream.1.in

UTILITIES_EXTRA_DIST = \
  $(UTILITIES_MANS) \
  $(UTILITIES_TESTS)

UTILITIES_CLEANFILES =

# Link these utilities to 'magick'.
MAGICK_UTILITIES=animate compare composite conjure convert display identify import magick-script mogrify montage stream

else
UTILITIES_PGMS =
UTILITIES_MANS =
UTILITIES_CONFIGURE =
UTILITIES_EXTRA_DIST =
UTILITIES_CLEANFILES =
MAGICK_UTILITIES=
endif

UTILITIES_INSTALL_EXEC_LOCAL_TARGETS=install-exec-local-utilities
install-exec-local-utilities:
	$(mkinstalldirs) $(DESTDIR)$(bindir)
	cd $(DESTDIR)$(bindir) ; \
	magick=`echo "magick" | sed 's,^.*/,,;s/$(EXEEXT)$$//;$(transform);s/$$/$(EXEEXT)/'`; \
	for name in $(MAGICK_UTILITIES) ; \
	do \
	  target=`echo "$$name" | sed 's,^.*/,,;s/$(EXEEXT)$$//;$(transform);s/$$/$(EXEEXT)/'`; \
	  rm -f $$target ; \
	  $(LN_S) $$magick $$target ; \
	done

UTILITIES_UNINSTALL_LOCAL_TARGETS=uninstall-local-utilities
uninstall-local-utilities:
	cd $(DESTDIR)$(bindir) ; \
	for name in $(MAGICK_UTILITIES) ; \
	do \
	  target=`echo "$$name" | sed 's,^.*/,,;s/$(EXEEXT)$$//;$(transform);s/$$/$(EXEEXT)/'`; \
	  rm -f $$target ; \
	done
```

--------------------------------------------------------------------------------

````

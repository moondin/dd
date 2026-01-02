---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 10
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 10 of 851)

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

---[FILE: cli_operators.c]---
Location: ImageMagick-main/api_examples/cli_operators.c

```c
/*
   Make direct calls to process the various CLI option handling groups
   as defined in "MagickWand/operators.c" which uses a special
   MagickCLI type of 'wand'.

   This is essentially the calls 'ProcessCommandOptions()' make
   though without as many error and sanity checks.

   Compile with ImageMagick-develop installed...

     gcc -lMagickWand -lMagickCore cli_operators.c -o cli_operators

   Compile and run directly from Source Directory...

     IM_PROG=api_examples/cli_operators
     gcc -I`pwd` -LMagickWand/.libs -LMagickCore/.libs \
       -lMagickWand -lMagickCore  $IM_PROG.c -o $IM_PROG

     sh ./magick.sh    $IM_PROG


*/
#include <stdio.h>
#include "MagickCore/studio.h"
#include "MagickWand/MagickWand.h"
#include "MagickWand/operation.h"

int main(int argc, char **argv)
{
  MagickCLI
    *cli_wand;

  MagickCoreGenesis(argv[0],MagickFalse);

  cli_wand = AcquireMagickCLI((ImageInfo *) NULL,(ExceptionInfo *) NULL);

  CLIOption (cli_wand, "-size", "100x100");
  CLIOption (cli_wand, "-read", "xc:red");
  CLIOption (cli_wand, "(", NULL);
  CLIOption (cli_wand, "-read", "rose:");
  CLIOption (cli_wand, "-rotate", "-90", NULL);
  CLIOption (cli_wand, ")", NULL);
  CLIOption (cli_wand, "+append", NULL, NULL);
  CLIOption (cli_wand, "-write", "show:", NULL);

  /* Note use of 'True' to report all exceptions - including fatals */
  if ( CLICatchException(cli_wand,MagickTrue) != MagickFalse )
    fprintf(stderr, "Major Error Detected\n");

  cli_wand = DestroyMagickCLI(cli_wand);

  MagickCoreTerminus();
}
```

--------------------------------------------------------------------------------

---[FILE: cli_process.c]---
Location: ImageMagick-main/api_examples/cli_process.c

```c
/*
   Direct call to ProcessCommandOptions() to process an array of
   options minus the command argument.  This is the function that
   actually splits up the argument array into separate operation
   group calls.


   Compile with ImageMagick-develop installed...

     gcc -lMagickWand -lMagickCore cli_process.c -o cli_process

   Compile and run directly from Source Directory...

     IM_PROG=api_examples/cli_process
     gcc -I`pwd` -LMagickWand/.libs -LMagickCore/.libs \
       -lMagickWand -lMagickCore  $IM_PROG.c -o $IM_PROG

     sh ./magick.sh    $IM_PROG

*/
#include <stdio.h>
#include "MagickCore/studio.h"
#include "MagickWand/MagickWand.h"

int main(int argc, char **argv)
{
  MagickCLI
    *cli_wand;

  int arg_count;
  char *args[] = { "-size", "100x100", "xc:red",
                   "(", "rose:", "-rotate", "-90", ")",
                   "+append", "show:", NULL };

  for(arg_count = 0; args[arg_count] != (char *) NULL; arg_count++);


  MagickCoreGenesis(argv[0],MagickFalse);
  cli_wand = AcquireMagickCLI((ImageInfo *) NULL,(ExceptionInfo *) NULL);

  ProcessCommandOptions(cli_wand, arg_count, args, 0);

  /* Note use of 'True' to report all exceptions - including non-fatals */
  if ( CLICatchException(cli_wand,MagickTrue) != MagickFalse )
    fprintf(stderr, "Major Error Detected\n");


  cli_wand = DestroyMagickCLI(cli_wand);
  MagickCoreTerminus();
}
```

--------------------------------------------------------------------------------

---[FILE: magick_command.c]---
Location: ImageMagick-main/api_examples/magick_command.c

```c
/*
   Direct call to MagickImageCommand(),
   which is basically what the "magick" command does via
   a wrapper function MagickCommandGenesis()

   Compile with ImageMagick-develop installed...

     gcc -lMagickWand -lMagickCore magick_command.c -o magick_command

   Compile and run directly from Source Directory...

     IM_PROG=api_examples/magick_command
     gcc -I`pwd` -LMagickWand/.libs -LMagickCore/.libs \
       -lMagickWand -lMagickCore  $IM_PROG.c -o $IM_PROG

     sh ./magick.sh $IM_PROG

*/
#include <stdio.h>
#include "MagickCore/studio.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/image.h"
#include "MagickWand/MagickWand.h"
#include "MagickWand/magick-cli.h"

int main(int argc, char **argv)
{
  MagickCoreGenesis(argv[0],MagickFalse);

  {
    
    ImageInfo *image_info = AcquireImageInfo();
    ExceptionInfo *exception = AcquireExceptionInfo();

    int arg_count;
    char *args[] = { "magick", "-size", "100x100", "xc:red",
                     "(", "rose:", "-rotate", "-90", ")",
                     "+append", "show:", NULL };

    for(arg_count = 0; args[arg_count] != (char *) NULL; arg_count++);

    (void) MagickImageCommand(image_info, arg_count, args, NULL, exception);

    if (exception->severity != UndefinedException)
    {
      CatchException(exception);
      fprintf(stderr, "Major Error Detected\n");
    }

    image_info=DestroyImageInfo(image_info);
    exception=DestroyExceptionInfo(exception);
  }
  MagickCoreTerminus();
}
```

--------------------------------------------------------------------------------

---[FILE: magick_script.mgk]---
Location: ImageMagick-main/api_examples/magick_script.mgk

```text
#!/bin/env magick-script
#
# Magick Script
#
# Assumes the "magick-script" symlink to "magick" command has been installed
#
-size 100x100 xc:red
( rose: -rotate -90 )
+append   -write show:

# exit - not really needed here -- more for pipelines and debugging
-exit


-------------------------------------------------------------------------------
This area is completely ignored by the magick script.

If you want you can put uncommented documentation such as Perl POD
which reformat such documentation into many different doc formats.
A bit like what Imagemagick does with Images!

Or you can just put any old rubbish -- much like this :-)

It could even be binary, image data or something else!
Hmmm Image Data may be useful -- perhaps in the future
Remind me sometime!

Anthony Thyssen - Author/Developer for
  Imagemagick Examples
  ImageMagick Shell/Script API
  Morphology Operator
  Distort Operator
  Composite Method Redevelopment
  GIF Animation Methods

-------------------------------------------------------------------------------
    "Mr. Worf, scan that ship."     "Aye, Captain... 300 DPI?"
-------------------------------------------------------------------------------
```

--------------------------------------------------------------------------------

---[FILE: magick_shell.sh]---
Location: ImageMagick-main/api_examples/magick_shell.sh

```bash
#!/bin/sh
#
# Assumes the "magick" command has been installed
#
magick -size 100x100 xc:red \
       \( rose: -rotate -90 \) \
       +append   show:
```

--------------------------------------------------------------------------------

---[FILE: README]---
Location: ImageMagick-main/api_examples/README

```text

Every program in this directory is the equivalent of this Shell API
command...

  magick -size 100x100 xc:red \
        \( rose: -rotate -90 \) \
        +append   show:


Command should be expanded to show a simple image operation on a 
list of images!



Each however does so in its own way using various functions in the
ImageMagick Library.

Shell API...

  magick_shell.sh     A simple "magick" shell command (as above)
  magick_script.mgk   As a "magick" script file

MagickCLI API...

  magick_command.c    As a argument list to the MagickCommand function
  cli_process.c       Using the function that processes a argument list
  cli_operators.c     Using operator groups to process individual options

MagickWand API...

  wand.c              using a MagickWand
```

--------------------------------------------------------------------------------

---[FILE: wand.c]---
Location: ImageMagick-main/api_examples/wand.c

```c
/*
   Implementation of a CLI command using a MagickWand API

     magick -size 100x100 xc:red \
            \( rose: -rotate -90 \) \
            +append   show:


   Compile with ImageMagick-develop installed...

     gcc -lMagickWand -lMagickCore wand.c -o wand

   Compile and run directly from Source Directory...

     IM_PROG=api_examples/wand
     gcc -I`pwd` -LMagickWand/.libs -LMagickCore/.libs \
       -lMagickWand -lMagickCore  $IM_PROG.c -o $IM_PROG

     sh ./magick.sh    $IM_PROG

*/
#include <stdio.h>
#include "MagickWand/MagickWand.h"

/* Simplify the exception handling
 * technically we should abort the program if
 *      severity >= ErrorException
 */
void ThrowWandException(MagickWand *wand)
{ char
  *description;

  ExceptionType
  severity;

  description=MagickGetException(wand,&severity);
  (void) fprintf(stderr,"%s %s %lu %s\n",GetMagickModule(),description);
  description=(char *) MagickRelinquishMemory(description);
}

/* useful function especially after appending two wands together */
#define SwapWands(a,b) { MagickWand *tmp=a; a=b; b=tmp; }

int main(int argc, char *argv[])
{
    MagickWand
      *red,     /* red image wand */
      *rose,    /* rose image wand */
      *output;  /* the appended output image */

    PixelWand
      *color;

    MagickBooleanType
      status;

    MagickWandGenesis();

    /* read in the red image */
    red = NewMagickWand();
    MagickSetSize(red,100,100);
    status = MagickReadImage(red, "xc:red" );
    if (status == MagickFalse)
      ThrowWandException(red);
    /* NOTE ABOUT MagickReadImage()
     * Unless the wand is empty set the first/last iterator to determine
     * if the read image(s) are to be prepend/append into that wand image
     * list.
     *
     * Setting a specific index always 'inserts' before that image.
     */

    /* read in the rose image */
    rose = NewMagickWand();
    status = MagickReadImage(rose, "rose:" );
    if (status == MagickFalse)
      ThrowWandException(rose);

    /* rotate the rose image - one image only */
    color=NewPixelWand();
    PixelSetColor(color, "white");
    status = MagickRotateImage(rose,color,-90.0);
    if (status == MagickFalse)
      ThrowWandException(rose);
    color = DestroyPixelWand(color);

    /* append rose image into the red image wand */
    MagickSetLastIterator(red);
    MagickAddImage(red,rose);
    rose = DestroyMagickWand(rose);  /* finished with 'rose' wand */
    /* NOTE ABOUT MagickAddImage()
     *
     * Always set the first/last image in the destination wand so that
     * IM knows if you want to prepend/append the images into that wands
     * image list.
     *
     * Setting a specific index always 'inserts' before that image.
     */

    /* append all images together to create the output wand */
    MagickSetFirstIterator(red);
    output = MagickAppendImages(red,MagickFalse);
    red = DestroyMagickWand(red);  /* finished with 'red' wand */
    /* NOTE ABOUT MagickAppendImages()
     *
     * It is important to either 'set first' or 'reset' the iterator before
     * appending images, as only images from current image onward are
     * appended together.
     *
     * Also note how a new wand is created by this operation, and that new
     * wand does not inherit any settings from the previous wand (at least not
     * at this time).
     */

    /* Final output */
    status = MagickWriteImage(output,"show:");
    if (status == MagickFalse)
      ThrowWandException(output);

    output = DestroyMagickWand(output);

    MagickWandTerminus();
}

/*
 * The above can be simplified further, though that is not what "magick"
 * command would do which we are simulating.
 *
 * Specifically you can read the 'rose' image directly on the end of of
 * 'red' image wand.  Then process just that rose image, even though it is
 * sharing the same wand as another image.
 *
 * Remember in MagickWand, simple image operators are only applied to the
 * current image in the wand an to no other image!  To apply a simple image
 * operator (like MagickRotateImage()) to all the images in a wand you must
 * iterate over all the images yourself.
 */
```

--------------------------------------------------------------------------------

---[FILE: AppRun]---
Location: ImageMagick-main/app-image/AppRun

```text
#!/bin/bash

# The purpose of this custom AppRun script is
# to allow symlinking the AppImage and invoking
# the corresponding binary depending on which
# symlink was used to invoke the AppImage

HERE="$(dirname "$(readlink -f "${0}")")"

export MAGICK_HOME="$HERE/usr${MAGICK_HOME:+:$MAGICK_HOME}" # https://imagemagick.org/QuickStart.txt
export MAGICK_CONFIGURE_PATH=$(readlink -f "$HERE/usr/lib/ImageMagick-7.1.2/config-Q16"):$(readlink -f "$HERE/usr/lib/ImageMagick-7.1.2/config-Q16HDRI"):$(readlink -f "$HERE/usr/share/ImageMagick-7"):$(readlink -f "$HERE/usr/etc/ImageMagick-7")${MAGICK_CONFIGURE_PATH:+:$MAGICK_CONFIGURE_PATH} # Wildcards don't work

export LD_LIBRARY_PATH=$(readlink -f "$HERE/usr/lib")${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}
export LD_LIBRARY_PATH=${HERE}/usr/lib/ImageMagick-7.1.2/modules-Q16HDRI/coders${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}

if [ "$1" == "man" ] ; then
  export MANPATH="$HERE/usr/share/man${MANPATH:+:$MANPATH}" ; exec "$@" ; exit $?
elif [ "$1" == "info" ] ; then
  export INFOPATH="$HERE/usr/share/info${INFOPATH:+:$INFOPATH}" ; exec "$@" ; exit $?
fi

if [ -n "$APPIMAGE" ] ; then
  BINARY_NAME=$(basename "$ARGV0")
  if [ -e "$HERE/usr/bin/$BINARY_NAME" ] ; then
    exec "$HERE/usr/bin/$BINARY_NAME" "$@"
  else
    exec "$HERE/usr/bin/magick" "$@"
  fi
else
  exec "$HERE/usr/bin/magick" "$@"
fi
```

--------------------------------------------------------------------------------

---[FILE: AppRun.in]---
Location: ImageMagick-main/app-image/AppRun.in

```text
#!/bin/bash

# The purpose of this custom AppRun script is
# to allow symlinking the AppImage and invoking
# the corresponding binary depending on which
# symlink was used to invoke the AppImage

HERE="$(dirname "$(readlink -f "${0}")")"

export MAGICK_HOME="$HERE/usr${MAGICK_HOME:+:$MAGICK_HOME}" # https://imagemagick.org/QuickStart.txt
export MAGICK_CONFIGURE_PATH=$(readlink -f "$HERE/usr/lib/ImageMagick-@PACKAGE_BASE_VERSION@/config-Q16"):$(readlink -f "$HERE/usr/lib/ImageMagick-@PACKAGE_BASE_VERSION@/config-Q16HDRI"):$(readlink -f "$HERE/usr/share/ImageMagick-7"):$(readlink -f "$HERE/usr/etc/ImageMagick-7")${MAGICK_CONFIGURE_PATH:+:$MAGICK_CONFIGURE_PATH} # Wildcards don't work

export LD_LIBRARY_PATH=$(readlink -f "$HERE/usr/lib")${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}
export LD_LIBRARY_PATH=${HERE}/usr/lib/ImageMagick-@PACKAGE_BASE_VERSION@/modules-Q16HDRI/coders${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}

if [ "$1" == "man" ] ; then
  export MANPATH="$HERE/usr/share/man${MANPATH:+:$MANPATH}" ; exec "$@" ; exit $?
elif [ "$1" == "info" ] ; then
  export INFOPATH="$HERE/usr/share/info${INFOPATH:+:$INFOPATH}" ; exec "$@" ; exit $?
fi

if [ -n "$APPIMAGE" ] ; then
  BINARY_NAME=$(basename "$ARGV0")
  if [ -e "$HERE/usr/bin/$BINARY_NAME" ] ; then
    exec "$HERE/usr/bin/$BINARY_NAME" "$@"
  else
    exec "$HERE/usr/bin/magick" "$@"
  fi
else
  exec "$HERE/usr/bin/magick" "$@"
fi
```

--------------------------------------------------------------------------------

---[FILE: imagemagick.desktop]---
Location: ImageMagick-main/app-image/imagemagick.desktop

```text
[Desktop Entry]
Name=ImageMagick
Type=Application
Exec=magick
Icon=imagemagick
Comment=Create, edit, compose, or convert bitmap images
Categories=Graphics;
Terminal=true
```

--------------------------------------------------------------------------------

---[FILE: aai.c]---
Location: ImageMagick-main/coders/aai.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                             AAA    AAA   IIIII                              %
%                            A   A  A   A    I                                %
%                            AAAAA  AAAAA    I                                %
%                            A   A  A   A    I                                %
%                            A   A  A   A  IIIII                              %
%                                                                             %
%                                                                             %
%                        Read/Write AAI X Image Format                        %
%                                                                             %
%                              Software Design                                %
%                                   Cristy                                    %
%                                 July 1992                                   %
%                                                                             %
%                                                                             %
%  Copyright @ 1999 ImageMagick Studio LLC, a non-profit organization         %
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
%
*/

/*
  Include declarations.
*/
#include "MagickCore/studio.h"
#include "MagickCore/blob.h"
#include "MagickCore/blob-private.h"
#include "MagickCore/cache.h"
#include "MagickCore/colorspace.h"
#include "MagickCore/colorspace-private.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/image.h"
#include "MagickCore/image-private.h"
#include "MagickCore/list.h"
#include "MagickCore/magick.h"
#include "MagickCore/memory_.h"
#include "MagickCore/monitor.h"
#include "MagickCore/monitor-private.h"
#include "MagickCore/pixel.h"
#include "MagickCore/pixel-accessor.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/static.h"
#include "MagickCore/string_.h"
#include "MagickCore/module.h"

/*
  Forward declarations.
*/
static MagickBooleanType
  WriteAAIImage(const ImageInfo *,Image *,ExceptionInfo *);

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d A A I I m a g e                                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadAAIImage() reads an AAI Dune image file and returns it.  It
%  allocates the memory necessary for the new Image structure and returns a
%  pointer to the new image.
%
%  The format of the ReadAAIImage method is:
%
%      Image *ReadAAIImage(const ImageInfo *image_info,ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static Image *ReadAAIImage(const ImageInfo *image_info,ExceptionInfo *exception)
{
  Image
    *image;

  MagickBooleanType
    status;

  Quantum
    *q;

  size_t
    height,
    length,
    width;

  ssize_t
    count,
    x,
    y;

  unsigned char
    *p,
    *pixels;

  /*
    Open image file.
  */
  assert(image_info != (const ImageInfo *) NULL);
  assert(image_info->signature == MagickCoreSignature);
  assert(exception != (ExceptionInfo *) NULL);
  assert(exception->signature == MagickCoreSignature);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",
      image_info->filename);
  image=AcquireImage(image_info,exception);
  status=OpenBlob(image_info,image,ReadBinaryBlobMode,exception);
  if (status == MagickFalse)
    {
      image=DestroyImageList(image);
      return((Image *) NULL);
    }
  /*
    Read AAI Dune image.
  */
  width=ReadBlobLSBLong(image);
  height=ReadBlobLSBLong(image);
  if (EOFBlob(image) != MagickFalse)
    ThrowReaderException(CorruptImageError,"ImproperImageHeader");
  if ((width == 0UL) || (height == 0UL))
    ThrowReaderException(CorruptImageError,"ImproperImageHeader");
  do
  {
    /*
      Convert AAI raster image to pixel packets.
    */
    image->columns=width;
    image->rows=height;
    image->depth=8;
    if ((image_info->ping != MagickFalse) && (image_info->number_scenes != 0))
      if (image->scene >= (image_info->scene+image_info->number_scenes-1))
        break;
    status=SetImageExtent(image,image->columns,image->rows,exception);
    if (status == MagickFalse)
      return(DestroyImageList(image));
    pixels=(unsigned char *) AcquireQuantumMemory(image->columns,
      4*sizeof(*pixels));
    if (pixels == (unsigned char *) NULL) 
      ThrowReaderException(ResourceLimitError,"MemoryAllocationFailed");
    length=(size_t) 4*image->columns;
    for (y=0; y < (ssize_t) image->rows; y++)
    {
      count=ReadBlob(image,length,pixels);
      if (count != (ssize_t) length)
        {
          pixels=(unsigned char *) RelinquishMagickMemory(pixels);
          ThrowReaderException(CorruptImageError,"UnableToReadImageData");
        }
      p=pixels;
      q=QueueAuthenticPixels(image,0,y,image->columns,1,exception);
      if (q == (Quantum *) NULL)
        break;
      for (x=0; x < (ssize_t) image->columns; x++)
      {
        SetPixelBlue(image,ScaleCharToQuantum(*p++),q);
        SetPixelGreen(image,ScaleCharToQuantum(*p++),q);
        SetPixelRed(image,ScaleCharToQuantum(*p++),q);
        if (*p == 254)
          *p=255;
        SetPixelAlpha(image,ScaleCharToQuantum(*p++),q);
        if (GetPixelAlpha(image,q) != OpaqueAlpha)
          image->alpha_trait=BlendPixelTrait;
        q+=(ptrdiff_t) GetPixelChannels(image);
      }
      if (SyncAuthenticPixels(image,exception) == MagickFalse)
        break;
      if (image->previous == (Image *) NULL)
        {
          status=SetImageProgress(image,LoadImageTag,(MagickOffsetType) y,
            image->rows);
          if (status == MagickFalse)
            break;
        }
    }
    pixels=(unsigned char *) RelinquishMagickMemory(pixels);
    if (EOFBlob(image) != MagickFalse)
      {
        ThrowFileException(exception,CorruptImageError,"UnexpectedEndOfFile",
          image->filename);
        break;
      }
    /*
      Proceed to next image.
    */
    if (image_info->number_scenes != 0)
      if (image->scene >= (image_info->scene+image_info->number_scenes-1))
        break;
    width=ReadBlobLSBLong(image);
    height=ReadBlobLSBLong(image);
    if ((width != 0UL) && (height != 0UL))
      {
        /*
          Allocate next image structure.
        */
        AcquireNextImage(image_info,image,exception);
        if (GetNextImageInList(image) == (Image *) NULL)
          {
            status=MagickFalse;
            break;
          }
        image=SyncNextImageInList(image);
        status=SetImageProgress(image,LoadImagesTag,TellBlob(image),
          GetBlobSize(image));
        if (status == MagickFalse)
          break;
      }
  } while ((width != 0UL) && (height != 0UL));
  if (CloseBlob(image) == MagickFalse)
    status=MagickFalse;
  if (status == MagickFalse)
    return(DestroyImageList(image));
  return(GetFirstImageInList(image));
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r A A I I m a g e                                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterAAIImage() adds attributes for the AAI Dune image format to the list
%  of supported formats.  The attributes include the image format tag, a
%  method to read and/or write the format, whether the format supports the
%  saving of more than one frame to the same file or blob, whether the format
%  supports native in-memory I/O, and a brief description of the format.
%
%  The format of the RegisterAAIImage method is:
%
%      size_t RegisterAAIImage(void)
%
*/
ModuleExport size_t RegisterAAIImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("AAI","AAI","AAI Dune image");
  entry->decoder=(DecodeImageHandler *) ReadAAIImage;
  entry->encoder=(EncodeImageHandler *) WriteAAIImage;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r A A I I m a g e                                       %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterAAIImage() removes format registrations made by the
%  AAI module from the list of supported formats.
%
%  The format of the UnregisterAAIImage method is:
%
%      UnregisterAAIImage(void)
%
*/
ModuleExport void UnregisterAAIImage(void)
{
  (void) UnregisterMagickInfo("AAI");
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e A A I I m a g e                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  WriteAAIImage() writes an image to a file in AAI Dune image format.
%
%  The format of the WriteAAIImage method is:
%
%      MagickBooleanType WriteAAIImage(const ImageInfo *image_info,
%        Image *image,ExceptionInfo *exception)
%
%  A description of each parameter follows.
%
%    o image_info: the image info.
%
%    o image:  The image.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static MagickBooleanType WriteAAIImage(const ImageInfo *image_info,Image *image,
  ExceptionInfo *exception)
{
  const Quantum
    *magick_restrict p;

  MagickBooleanType
    status;

  MagickOffsetType
    scene;

  size_t
    number_scenes;

  ssize_t
    count,
    x,
    y;

  unsigned char
    *pixels,
    *magick_restrict q;

  /*
    Open output image file.
  */
  assert(image_info != (const ImageInfo *) NULL);
  assert(image_info->signature == MagickCoreSignature);
  assert(image != (Image *) NULL);
  assert(image->signature == MagickCoreSignature);
  assert(exception != (ExceptionInfo *) NULL);
  assert(exception->signature == MagickCoreSignature);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",image->filename);
  status=OpenBlob(image_info,image,WriteBinaryBlobMode,exception);
  if (status == MagickFalse)
    return(status);
  scene=0;
  number_scenes=GetImageListLength(image);
  do
  {
    /*
      Write AAI header.
    */
    if (IssRGBCompatibleColorspace(image->colorspace) == MagickFalse)
      (void) TransformImageColorspace(image,sRGBColorspace,exception);
    (void) WriteBlobLSBLong(image,(unsigned int) image->columns);
    (void) WriteBlobLSBLong(image,(unsigned int) image->rows);
    /*
      Allocate memory for pixels.
    */
    pixels=(unsigned char *) AcquireQuantumMemory(image->columns,
      4*sizeof(*pixels));
    if (pixels == (unsigned char *) NULL)
      ThrowWriterException(ResourceLimitError,"MemoryAllocationFailed");
    /*
      Convert MIFF to AAI raster pixels.
    */
    for (y=0; y < (ssize_t) image->rows; y++)
    {
      p=GetVirtualPixels(image,0,y,image->columns,1,exception);
      if (p == (const Quantum *) NULL)
        break;
      q=pixels;
      for (x=0; x < (ssize_t) image->columns; x++)
      {
        *q++=ScaleQuantumToChar(GetPixelBlue(image,p));
        *q++=ScaleQuantumToChar(GetPixelGreen(image,p));
        *q++=ScaleQuantumToChar(GetPixelRed(image,p));
        *q=ScaleQuantumToChar((Quantum) (image->alpha_trait !=
          UndefinedPixelTrait ? GetPixelAlpha(image,p) : OpaqueAlpha));
        if (*q == 255)
          *q=254;
        p+=(ptrdiff_t) GetPixelChannels(image);
        q++;
      }
      count=WriteBlob(image,(size_t) (q-pixels),pixels);
      if (count != (ssize_t) (q-pixels))
        break;
      if (image->previous == (Image *) NULL)
        {
          status=SetImageProgress(image,SaveImageTag,(MagickOffsetType) y,
            image->rows);
          if (status == MagickFalse)
            break;
        }
    }
    pixels=(unsigned char *) RelinquishMagickMemory(pixels);
    if (GetNextImageInList(image) == (Image *) NULL)
      break;
    image=SyncNextImageInList(image);
    status=SetImageProgress(image,SaveImagesTag,scene++,number_scenes);
    if (status == MagickFalse)
      break;
  } while (image_info->adjoin != MagickFalse);
  if (CloseBlob(image) == MagickFalse)
    status=MagickFalse;
  return(status);
}
```

--------------------------------------------------------------------------------

---[FILE: aai.h]---
Location: ImageMagick-main/coders/aai.h

```c
/*
  Copyright @ 1999 ImageMagick Studio LLC, a non-profit organization
  dedicated to making software imaging solutions freely available.
  
  You may not use this file except in compliance with the License.  You may
  obtain a copy of the License at
  
    https://imagemagick.org/script/license.php
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

#include "coders/coders-private.h"

#define MagickAAIHeaders

#define MagickAAIAliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(AAI)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

````

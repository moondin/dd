---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 49
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 49 of 851)

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

---[FILE: heic.h]---
Location: ImageMagick-main/coders/heic.h

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

#define MagickHEICHeaders \
  MagickCoderHeader("AVCI", 4, "ftypavci") \
  MagickCoderHeader("AVIF", 4, "ftypavif") \
  MagickCoderHeader("AVIF", 4, "ftypavis") \
  MagickCoderHeader("HEIC", 4, "ftypheic") \
  MagickCoderHeader("HEIC", 4, "ftypheix") \
  MagickCoderHeader("HEIC", 4, "ftyphevc") \
  MagickCoderHeader("HEIC", 4, "ftypheim") \
  MagickCoderHeader("HEIC", 4, "ftypheis") \
  MagickCoderHeader("HEIC", 4, "ftyphevm") \
  MagickCoderHeader("HEIC", 4, "ftyphevs") \
  MagickCoderHeader("HEIC", 4, "ftypmif1") \
  MagickCoderHeader("HEIC", 4, "ftypmsf1")

#define MagickHEICAliases \
  MagickCoderAlias("HEIC", "AVCI") \
  MagickCoderAlias("HEIC", "AVIF") \
  MagickCoderAlias("HEIC", "HEIF")

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(HEIC)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: histogram.c]---
Location: ImageMagick-main/coders/histogram.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%       H   H  IIIII  SSSSS  TTTTT   OOO    GGGG  RRRR    AAA   M   M         %
%       H   H    I    SS       T    O   O  G      R   R  A   A  MM MM         %
%       HHHHH    I     SSS     T    O   O  G  GG  RRRR   AAAAA  M M M         %
%       H   H    I       SS    T    O   O  G   G  R R    A   A  M   M         %
%       H   H  IIIII  SSSSS    T     OOO    GGG   R  R   A   A  M   M         %
%                                                                             %
%                                                                             %
%                          Write A Histogram Image.                           %
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
#include "MagickCore/artifact.h"
#include "MagickCore/blob.h"
#include "MagickCore/blob-private.h"
#include "MagickCore/cache.h"
#include "MagickCore/color.h"
#include "MagickCore/color-private.h"
#include "MagickCore/constitute.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/geometry.h"
#include "MagickCore/histogram.h"
#include "MagickCore/image-private.h"
#include "MagickCore/magick.h"
#include "MagickCore/memory_.h"
#include "MagickCore/monitor.h"
#include "MagickCore/monitor-private.h"
#include "MagickCore/nt-base-private.h"
#include "MagickCore/option.h"
#include "MagickCore/pixel-accessor.h"
#include "MagickCore/property.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/resource_.h"
#include "MagickCore/static.h"
#include "MagickCore/statistic.h"
#include "MagickCore/string_.h"
#include "MagickCore/module.h"
#include "MagickCore/token.h"
#include "MagickCore/utility.h"

/*
  Forward declarations.
*/
static MagickBooleanType
  WriteHISTOGRAMImage(const ImageInfo *,Image *,ExceptionInfo *);

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r H I S T O G R A M I m a g e                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterHISTOGRAMImage() adds attributes for the Histogram image format
%  to the list of supported formats.  The attributes include the image format
%  tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterHISTOGRAMImage method is:
%
%      size_t RegisterHISTOGRAMImage(void)
%
*/
ModuleExport size_t RegisterHISTOGRAMImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("HISTOGRAM","HISTOGRAM","Histogram of the image");
  entry->encoder=(EncodeImageHandler *) WriteHISTOGRAMImage;
  entry->flags^=CoderAdjoinFlag;
  entry->format_type=ImplicitFormatType;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r H I S T O G R A M I m a g e                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterHISTOGRAMImage() removes format registrations made by the
%  HISTOGRAM module from the list of supported formats.
%
%  The format of the UnregisterHISTOGRAMImage method is:
%
%      UnregisterHISTOGRAMImage(void)
%
*/
ModuleExport void UnregisterHISTOGRAMImage(void)
{
  (void) UnregisterMagickInfo("HISTOGRAM");
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e H I S T O G R A M I m a g e                                     %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  WriteHISTOGRAMImage() writes an image to a file in Histogram format.
%  The image shows a histogram of the color (or gray) values in the image.  The
%  image consists of three overlaid histograms:  a red one for the red channel,
%  a green one for the green channel, and a blue one for the blue channel.  The
%  image comment contains a list of unique pixel values and the number of times
%  each occurs in the image.
%
%  This method is strongly based on a similar one written by
%  muquit@warm.semcor.com which in turn is based on ppmhistmap of netpbm.
%
%  The format of the WriteHISTOGRAMImage method is:
%
%      MagickBooleanType WriteHISTOGRAMImage(const ImageInfo *image_info,
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
static MagickBooleanType WriteHISTOGRAMImage(const ImageInfo *image_info,
  Image *image,ExceptionInfo *exception)
{
#define HistogramDensity  "256x200"

  char
    filename[MagickPathExtent];

  const char
    *option;

  const MagickInfo
    *magick_info;

  Image
    *histogram_image;

  ImageInfo
    *write_info;

  MagickBooleanType
    status;

  PixelInfo
    *histogram;

  double
    maximum,
    scale;

  RectangleInfo
    geometry;

  const Quantum
    *p;

  Quantum
    *q,
    *r;

  ssize_t
    x;

  size_t
    length;

  ssize_t
    y;

  /*
    Allocate histogram image.
  */
  assert(image_info != (const ImageInfo *) NULL);
  assert(image_info->signature == MagickCoreSignature);
  assert(image != (Image *) NULL);
  assert(image->signature == MagickCoreSignature);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",
      image_info->filename);
  SetGeometry(image,&geometry);
  if (image_info->density == (char *) NULL)
    (void) ParseAbsoluteGeometry(HistogramDensity,&geometry);
  else
    (void) ParseAbsoluteGeometry(image_info->density,&geometry);
  histogram_image=CloneImage(image,geometry.width,geometry.height,MagickTrue,
    exception);
  if (histogram_image == (Image *) NULL)
    ThrowWriterException(ResourceLimitError,"MemoryAllocationFailed");
  (void) SetImageStorageClass(histogram_image,DirectClass,exception);
  /*
    Allocate histogram count arrays.
  */
  length=MagickMax((size_t) ScaleQuantumToChar(QuantumRange)+1UL,
    histogram_image->columns);
  histogram=(PixelInfo *) AcquireQuantumMemory(length,sizeof(*histogram));
  if (histogram == (PixelInfo *) NULL)
    {
      histogram_image=DestroyImage(histogram_image);
      ThrowWriterException(ResourceLimitError,"MemoryAllocationFailed");
    }
  /*
    Initialize histogram count arrays.
  */
  (void) memset(histogram,0,length*sizeof(*histogram));
  for (y=0; y < (ssize_t) image->rows; y++)
  {
    p=GetVirtualPixels(image,0,y,image->columns,1,exception);
    if (p == (const Quantum *) NULL)
      break;
    for (x=0; x < (ssize_t) image->columns; x++)
    {
      if ((GetPixelRedTraits(image) & UpdatePixelTrait) != 0)
        histogram[ScaleQuantumToChar(GetPixelRed(image,p))].red++;
      if ((GetPixelGreenTraits(image) & UpdatePixelTrait) != 0)
        histogram[ScaleQuantumToChar(GetPixelGreen(image,p))].green++;
      if ((GetPixelBlueTraits(image) & UpdatePixelTrait) != 0)
        histogram[ScaleQuantumToChar(GetPixelBlue(image,p))].blue++;
      p+=(ptrdiff_t) GetPixelChannels(image);
    }
  }
  maximum=histogram[0].red;
  for (x=0; x < (ssize_t) histogram_image->columns; x++)
  {
    if (((GetPixelRedTraits(image) & UpdatePixelTrait) != 0) &&
        (maximum < histogram[x].red))
      maximum=histogram[x].red;
    if (((GetPixelGreenTraits(image) & UpdatePixelTrait) != 0) &&
        (maximum < histogram[x].green))
      maximum=histogram[x].green;
    if (((GetPixelBlueTraits(image) & UpdatePixelTrait) != 0) &&
        (maximum < histogram[x].blue))
      maximum=histogram[x].blue;
  }
  scale=0.0;
  if (fabs((double) maximum) >= MagickEpsilon)
    scale=(double) histogram_image->rows/maximum;
  /*
    Initialize histogram image.
  */
  (void) QueryColorCompliance("#000000",AllCompliance,
    &histogram_image->background_color,exception);
  (void) SetImageBackgroundColor(histogram_image,exception);
  for (x=0; x < (ssize_t) histogram_image->columns; x++)
  {
    q=GetAuthenticPixels(histogram_image,x,0,1,histogram_image->rows,exception);
    if (q == (Quantum *) NULL)
      break;
    if ((GetPixelRedTraits(image) & UpdatePixelTrait) != 0)
      {
        y=CastDoubleToSsizeT(ceil((double) histogram_image->rows-scale*
          histogram[x].red-0.5));
        r=q+y*(ssize_t) GetPixelChannels(histogram_image);
        for ( ; y < (ssize_t) histogram_image->rows; y++)
        {
          SetPixelRed(histogram_image,QuantumRange,r);
          r+=(ptrdiff_t) GetPixelChannels(histogram_image);
        }
      }
    if ((GetPixelGreenTraits(image) & UpdatePixelTrait) != 0)
      {
        y=CastDoubleToSsizeT(ceil((double) histogram_image->rows-scale*
          histogram[x].green-0.5));
        r=q+y*(ssize_t) GetPixelChannels(histogram_image);
        for ( ; y < (ssize_t) histogram_image->rows; y++)
        {
          SetPixelGreen(histogram_image,QuantumRange,r);
          r+=(ptrdiff_t) GetPixelChannels(histogram_image);
        }
      }
    if ((GetPixelBlueTraits(image) & UpdatePixelTrait) != 0)
      {
        y=CastDoubleToSsizeT(ceil((double) histogram_image->rows-scale*
          histogram[x].blue-0.5));
        r=q+y*(ssize_t) GetPixelChannels(histogram_image);
        for ( ; y < (ssize_t) histogram_image->rows; y++)
        {
          SetPixelBlue(histogram_image,QuantumRange,r);
          r+=(ptrdiff_t) GetPixelChannels(histogram_image);
        }
      }
    if (SyncAuthenticPixels(histogram_image,exception) == MagickFalse)
      break;
    status=SetImageProgress(image,SaveImageTag,(MagickOffsetType) y,
      histogram_image->rows);
    if (status == MagickFalse)
      break;
  }
  histogram=(PixelInfo *) RelinquishMagickMemory(histogram);
  option=GetImageOption(image_info,"histogram:unique-colors");
  if ((IsHistogramImage(image,exception) != MagickFalse) || 
      (IsStringTrue(option) != MagickFalse) ||
      (GetImageOption(image_info,"format") != (const char *) NULL))
    {
      FILE
        *file;

      int
        unique_file;

      /*
        Add a unique colors as an image comment.
      */
      file=(FILE *) NULL;
      unique_file=AcquireUniqueFileResource(filename);
      if (unique_file != -1)
        file=fdopen(unique_file,"wb");
      if ((unique_file != -1) && (file != (FILE *) NULL))
        {
          char
            *property;

          (void) GetNumberColors(image,file,exception);
          (void) fclose(file);
          property=FileToString(filename,~0UL,exception);
          if (property != (char *) NULL)
            {
              (void) SetImageProperty(histogram_image,"comment",property,
                exception);
              property=DestroyString(property);
            }
        }
      (void) RelinquishUniqueFileResource(filename);
    }
  /*
    Write Histogram image.
  */
  (void) CopyMagickString(histogram_image->filename,image_info->filename,
    MagickPathExtent);
  (void) ResetImagePage(histogram_image,"0x0+0+0");
  write_info=CloneImageInfo(image_info);
  *write_info->magick='\0';
  (void) SetImageInfo(write_info,1,exception);
  magick_info=GetMagickInfo(write_info->magick,exception);
  if ((magick_info == (const MagickInfo*) NULL) ||
      (LocaleCompare(magick_info->magick_module,"HISTOGRAM") == 0))
    (void) FormatLocaleString(histogram_image->filename,MagickPathExtent,
      "miff:%s",write_info->filename);
  status=WriteImage(write_info,histogram_image,exception);
  histogram_image=DestroyImage(histogram_image);
  write_info=DestroyImageInfo(write_info);
  return(status);
}
```

--------------------------------------------------------------------------------

---[FILE: histogram.h]---
Location: ImageMagick-main/coders/histogram.h

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

#define MagickHISTOGRAMHeaders

#define MagickHISTOGRAMAliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(HISTOGRAM)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: hrz.c]---
Location: ImageMagick-main/coders/hrz.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                            H   H  RRRR   ZZZZZ                              %
%                            H   H  R   R     ZZ                              %
%                            HHHHH  RRRR     Z                                %
%                            H   H  R R    ZZ                                 %
%                            H   H  R  R   ZZZZZ                              %
%                                                                             %
%                                                                             %
%                Read/Write Slow Scan TeleVision Image Format                 %
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
#include "MagickCore/pixel-accessor.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/static.h"
#include "MagickCore/string_.h"
#include "MagickCore/module.h"

/*
  Forward declarations.
*/
static MagickBooleanType
  WriteHRZImage(const ImageInfo *,Image *,ExceptionInfo *);

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d H R Z I m a g e                                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadHRZImage() reads a Slow Scan TeleVision image file and returns it.  It
%  allocates the memory necessary for the new Image structure and returns a
%  pointer to the new image.
%
%  The format of the ReadHRZImage method is:
%
%      Image *ReadHRZImage(const ImageInfo *image_info,ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static Image *ReadHRZImage(const ImageInfo *image_info,ExceptionInfo *exception)
{
  Image
    *image;

  MagickBooleanType
    status;

  Quantum
    *q;

  size_t
    length;

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
    Convert HRZ raster image to pixel packets.
  */
  image->columns=256;
  image->rows=240;
  image->depth=8;
  if (image_info->ping != MagickFalse)
    {
      (void) CloseBlob(image);
      return(GetFirstImageInList(image));
    }
  status=SetImageExtent(image,image->columns,image->rows,exception);
  if (status == MagickFalse)
    return(DestroyImageList(image));
  pixels=(unsigned char *) AcquireQuantumMemory(image->columns,3*
    sizeof(*pixels));
  if (pixels == (unsigned char *) NULL) 
    ThrowReaderException(ResourceLimitError,"MemoryAllocationFailed");
  length=(size_t) (3*image->columns);
  for (y=0; y < (ssize_t) image->rows; y++)
  {
    count=ReadBlob(image,length,pixels);
    if ((size_t) count != length)
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
      SetPixelRed(image,ScaleCharToQuantum(4**p++),q);
      SetPixelGreen(image,ScaleCharToQuantum(4**p++),q);
      SetPixelBlue(image,ScaleCharToQuantum(4**p++),q);
      SetPixelAlpha(image,OpaqueAlpha,q);
      q+=(ptrdiff_t) GetPixelChannels(image);
    }
    if (SyncAuthenticPixels(image,exception) == MagickFalse)
      break;
    if (SetImageProgress(image,LoadImageTag,y,image->rows) == MagickFalse)
      break;
  }
  pixels=(unsigned char *) RelinquishMagickMemory(pixels);
  if (EOFBlob(image) != MagickFalse)
    ThrowFileException(exception,CorruptImageError,"UnexpectedEndOfFile",
      image->filename);
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
%   R e g i s t e r H R Z I m a g e                                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterHRZImage() adds attributes for the HRZ X image format to the list
%  of supported formats.  The attributes include the image format tag, a
%  method to read and/or write the format, whether the format supports the
%  saving of more than one frame to the same file or blob, whether the format
%  supports native in-memory I/O, and a brief description of the format.
%
%  The format of the RegisterHRZImage method is:
%
%      size_t RegisterHRZImage(void)
%
*/
ModuleExport size_t RegisterHRZImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("HRZ","HRZ","Slow Scan TeleVision");
  entry->decoder=(DecodeImageHandler *) ReadHRZImage;
  entry->encoder=(EncodeImageHandler *) WriteHRZImage;
  entry->flags^=CoderAdjoinFlag;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r H R Z I m a g e                                       %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterHRZImage() removes format registrations made by the
%  HRZ module from the list of supported formats.
%
%  The format of the UnregisterHRZImage method is:
%
%      UnregisterHRZImage(void)
%
*/
ModuleExport void UnregisterHRZImage(void)
{
  (void) UnregisterMagickInfo("HRZ");
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e H R Z I m a g e                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  WriteHRZImage() writes an image to a file in HRZ X image format.
%
%  The format of the WriteHRZImage method is:
%
%      MagickBooleanType WriteHRZImage(const ImageInfo *image_info,
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
static MagickBooleanType WriteHRZImage(const ImageInfo *image_info,Image *image,
  ExceptionInfo *exception)
{
  const Quantum
    *p;

  Image
    *hrz_image;

  MagickBooleanType
    status;

  ssize_t
    count,
    x,
    y;

  unsigned char
    *pixels,
    *q;

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
  hrz_image=ResizeImage(image,256,240,image->filter,exception);
  if (hrz_image == (Image *) NULL)
    return(MagickFalse);
  (void) TransformImageColorspace(hrz_image,sRGBColorspace,exception);
  /*
    Allocate memory for pixels.
  */
  pixels=(unsigned char *) AcquireQuantumMemory((size_t) hrz_image->columns,
    3*sizeof(*pixels));
  if (pixels == (unsigned char *) NULL)
    {
      hrz_image=DestroyImage(hrz_image);
      ThrowWriterException(ResourceLimitError,"MemoryAllocationFailed");
    }
  /*
    Convert MIFF to HRZ raster pixels.
  */
  for (y=0; y < (ssize_t) hrz_image->rows; y++)
  {
    p=GetVirtualPixels(hrz_image,0,y,hrz_image->columns,1,exception);
    if (p == (const Quantum *) NULL)
      break;
    q=pixels;
    for (x=0; x < (ssize_t) hrz_image->columns; x++)
    {
      *q++=ScaleQuantumToChar(GetPixelRed(hrz_image,p))/4;
      *q++=ScaleQuantumToChar(GetPixelGreen(hrz_image,p))/4;
      *q++=ScaleQuantumToChar(GetPixelBlue(hrz_image,p))/4;
      p+=(ptrdiff_t) GetPixelChannels(hrz_image);
    }
    count=WriteBlob(image,(size_t) (q-pixels),pixels);
    if (count != (ssize_t) (q-pixels))
      break;
    status=SetImageProgress(image,SaveImageTag,y,hrz_image->rows);
    if (status == MagickFalse)
      break;
  }
  pixels=(unsigned char *) RelinquishMagickMemory(pixels);
  hrz_image=DestroyImage(hrz_image);
  if (CloseBlob(image) == MagickFalse)
    status=MagickFalse;
  return(status);
}
```

--------------------------------------------------------------------------------

---[FILE: hrz.h]---
Location: ImageMagick-main/coders/hrz.h

```c
/*
%  Copyright @ 1999 ImageMagick Studio LLC, a non-profit organization         %
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

#define MagickHRZHeaders

#define MagickHRZAliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(HRZ)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

````

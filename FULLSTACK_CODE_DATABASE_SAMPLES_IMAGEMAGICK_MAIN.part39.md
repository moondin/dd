---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 39
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 39 of 851)

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

---[FILE: fl32.c]---
Location: ImageMagick-main/coders/fl32.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                                                                             %
%                         FFFFF  L      IIIII  FFFFF                          %
%                         F      L        I    F                              %
%                         FFF    L        I    FFF                            %
%                         F      L        I    F                              %
%                         F      LLLLL  IIIII  F                              %
%                                                                             %
%                                                                             %
%                       Support FilmLight Image Format                        %
%                                                                             %
%                              Software Design                                %
%                                   Cristy                                    %
%                               November 2020                                 %
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
#include "MagickCore/attribute.h"
#include "MagickCore/blob.h"
#include "MagickCore/blob-private.h"
#include "MagickCore/cache.h"
#include "MagickCore/color-private.h"
#include "MagickCore/colormap.h"
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
#include "MagickCore/quantum-private.h"
#include "MagickCore/static.h"
#include "MagickCore/string_.h"
#include "MagickCore/module.h"

/*
  Forward declarations.
*/
static MagickBooleanType
  WriteFL32Image(const ImageInfo *,Image *,ExceptionInfo *);

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   I s F L 3 2                                                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  IsFL32() returns MagickTrue if the image format type, identified by the
%  magick string, is FL32.
%
%  The format of the IsFL32 method is:
%
%      MagickBooleanType IsFL32(const unsigned char *magick,const size_t extent)
%
%  A description of each parameter follows:
%
%    o magick: compare image format pattern against these bytes.
%
%    o extent: Specifies the extent of the magick string.
%
*/
static MagickBooleanType IsFL32(const unsigned char *magick,const size_t extent)
{
  if (extent < 4)
    return(MagickFalse);
  if (LocaleNCompare((char *) magick,"FL32",4) == 0)
    return(MagickTrue);
  return(MagickFalse);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d F L 3 2 I m a g e                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadFL32Image() reads an image of raw bits in LSB order and returns it.
%  It allocates the memory necessary for the new Image structure and returns
%  a pointer to the new image.
%
%  The format of the ReadFL32Image method is:
%
%      Image *ReadFL32Image(const ImageInfo *image_info,
%        ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static Image *ReadFL32Image(const ImageInfo *image_info,
  ExceptionInfo *exception)
{
  Image
    *image;

  MagickBooleanType
    status;

  QuantumInfo
    *quantum_info;

  QuantumType
    quantum_type;

  size_t
    extent;

  ssize_t
    count,
    y;

  unsigned char
    *pixels;

  unsigned int
    magic;

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
  magic=ReadBlobLSBLong(image);
  if (magic != 842222662)
    ThrowReaderException(CorruptImageError,"ImproperImageHeader");
  image->depth=32;
  image->endian=LSBEndian;
  image->rows=(size_t) ReadBlobLSBLong(image);
  image->columns=(size_t) ReadBlobLSBLong(image);
  image->number_channels=(size_t) ReadBlobLSBLong(image);
  if ((image->columns == 0) || (image->rows == 0) ||
      (image->number_channels == 0) ||
      (image->number_channels >= MaxPixelChannels))
    ThrowReaderException(CorruptImageError,"ImproperImageHeader");
  switch (image->number_channels)
  {
    case 1:
    {
      quantum_type=GrayQuantum;
      image->colorspace=GRAYColorspace;
      break;
    }
    case 2:
    {
      image->alpha_trait=BlendPixelTrait;
      image->colorspace=GRAYColorspace;
      quantum_type=GrayAlphaQuantum;
      break;
    }
    case 3:
    {
      image->colorspace=sRGBColorspace;
      quantum_type=RGBQuantum;
      break;
    }
    case 4:
    {
      image->colorspace=sRGBColorspace;
      image->alpha_trait=BlendPixelTrait;
      quantum_type=RGBAQuantum;
      break;
    }
    default:
    {
      image->number_meta_channels=image->number_channels-3;
      quantum_type=RGBQuantum;
      break;
    }
  }
  if (image_info->ping != MagickFalse)
    {
      (void) CloseBlob(image);
      return(GetFirstImageInList(image));
    }
  status=SetImageExtent(image,image->columns,image->rows,exception);
  if (status == MagickFalse)
    return(DestroyImageList(image));
  /*
    Convert FL32 image to pixel packets.
  */
  quantum_info=AcquireQuantumInfo(image_info,image);
  if (quantum_info == (QuantumInfo *) NULL)
    ThrowReaderException(ResourceLimitError,"MemoryAllocationFailed");
  status=SetQuantumFormat(image,quantum_info,FloatingPointQuantumFormat);
  extent=GetQuantumExtent(image,quantum_info,quantum_type);
  pixels=GetQuantumPixels(quantum_info);
  for (y=0; y < (ssize_t) image->rows; y++)
  {
    const void
      *stream;

    Quantum
      *magick_restrict q;

    q=QueueAuthenticPixels(image,0,y,image->columns,1,exception);
    if (q == (Quantum *) NULL)
      break;
    stream=ReadBlobStream(image,extent,pixels,&count);
    if (count != (ssize_t) extent)
      break;
    (void) ImportQuantumPixels(image,(CacheView *) NULL,quantum_info,
      quantum_type,(unsigned char *) stream,exception);
    if (SyncAuthenticPixels(image,exception) == MagickFalse)
      break;
    if (SetImageProgress(image,LoadImageTag,y,image->rows) == MagickFalse)
      break;
  }
  SetQuantumImageType(image,quantum_type);
  quantum_info=DestroyQuantumInfo(quantum_info);
  if (y < (ssize_t) image->rows)
    ThrowReaderException(CorruptImageError,"UnableToReadImageData");
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
%   R e g i s t e r F L 3 2 I m a g e                                         %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterFL32Image() adds attributes for the FL32 image format to
%  the list of supported formats.  The attributes include the image format
%  tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterFL32Image method is:
%
%      size_t RegisterFL32Image(void)
%
*/
ModuleExport size_t RegisterFL32Image(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("FL32","FL32","FilmLight");
  entry->decoder=(DecodeImageHandler *) ReadFL32Image;
  entry->encoder=(EncodeImageHandler *) WriteFL32Image;
  entry->magick=(IsImageFormatHandler *) IsFL32;
  entry->flags|=CoderRawSupportFlag;
  entry->flags^=CoderAdjoinFlag;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r F L 3 2 I m a g e                                     %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterFL32Image() removes format registrations made by the
%  FL32 module from the list of supported formats.
%
%  The format of the UnregisterFL32Image method is:
%
%      UnregisterFL32Image(void)
%
*/
ModuleExport void UnregisterFL32Image(void)
{
  (void) UnregisterMagickInfo("FL32");
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e F L 3 2 I m a g e                                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  WriteFL32Image() writes an image of raw bits in LSB order to a file.
%
%  The format of the WriteFL32Image method is:
%
%      MagickBooleanType WriteFL32Image(const ImageInfo *image_info,
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
static MagickBooleanType WriteFL32Image(const ImageInfo *image_info,
  Image *image,ExceptionInfo *exception)
{
  const Quantum
    *p;

  MagickBooleanType
    status;

  QuantumInfo
    *quantum_info;

  QuantumType
    quantum_type;

  size_t
    channels,
    extent;

  ssize_t
    count,
    y;

  unsigned char
    *pixels;

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
  if (IssRGBCompatibleColorspace(image->colorspace) == MagickFalse)
    (void) TransformImageColorspace(image,sRGBColorspace,exception);
  (void) WriteBlobLSBLong(image,842222662U);
  (void) WriteBlobLSBLong(image,(unsigned int) image->rows);
  (void) WriteBlobLSBLong(image,(unsigned int) image->columns);
  image->endian=LSBEndian;
  image->depth=32;
  channels=GetImageChannels(image);
  switch (channels)
  {
    case 1:
    {
      quantum_type=GrayQuantum;
      break;
    }
    case 2:
    {
      if (image->alpha_trait != UndefinedPixelTrait)
        {
          quantum_type=GrayAlphaQuantum;
          break;
        }
      quantum_type=GrayQuantum;
      channels=1;
      break;
    }
    case 4:
    {
      if (image->alpha_trait != UndefinedPixelTrait)
        {
          quantum_type=RGBAQuantum;
          break;
        }
      quantum_type=RGBQuantum;
      channels=3;
      break;
    }
    default:
    {
      quantum_type=RGBQuantum;
      channels=3;
      break;
    }
  }
  (void) WriteBlobLSBLong(image,(unsigned int) channels);
  quantum_info=AcquireQuantumInfo(image_info,image);
  if (quantum_info == (QuantumInfo *) NULL)
    ThrowWriterException(ImageError,"MemoryAllocationFailed");
  status=SetQuantumFormat(image,quantum_info,FloatingPointQuantumFormat);
  pixels=(unsigned char *) GetQuantumPixels(quantum_info);
  for (y=0; y < (ssize_t) image->rows; y++)
  {
    p=GetVirtualPixels(image,0,y,image->columns,1,exception);
    if (p == (const Quantum *) NULL)
      break;
    extent=ExportQuantumPixels(image,(CacheView *) NULL,quantum_info,
      quantum_type,pixels,exception);
    count=WriteBlob(image,extent,pixels);
    if (count != (ssize_t) extent)
      break;
    status=SetImageProgress(image,SaveImageTag,(MagickOffsetType) y,
      image->rows);
    if (status == MagickFalse)
      break;
  }
  quantum_info=DestroyQuantumInfo(quantum_info);
  if (y < (ssize_t) image->rows)
    ThrowWriterException(CorruptImageError,"UnableToWriteImageData");
  if (CloseBlob(image) == MagickFalse)
    status=MagickFalse;
  return(status);
}
```

--------------------------------------------------------------------------------

---[FILE: fl32.h]---
Location: ImageMagick-main/coders/fl32.h

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

#define MagickFL32Headers \
  MagickCoderHeader("FL32", 0, "FL32")

#define MagickFL32Aliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(FL32)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: flif.c]---
Location: ImageMagick-main/coders/flif.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                         FFFFF  L      IIIII  FFFFF                          %
%                         F      L        I    F                              %
%                         FFF    L        I    FFF                            %
%                         F      L        I    F                              %
%                         F      LLLLL  IIIII  F                              %
%                                                                             %
%                                                                             %
%                    Read/Write Free Lossless Image Format                    %
%                                                                             %
%                              Software Design                                %
%                                Jon Sneyers                                  %
%                                April 2016                                   %
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
#include "MagickCore/client.h"
#include "MagickCore/colorspace-private.h"
#include "MagickCore/display.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/image.h"
#include "MagickCore/image-private.h"
#include "MagickCore/list.h"
#include "MagickCore/magick.h"
#include "MagickCore/monitor.h"
#include "MagickCore/monitor-private.h"
#include "MagickCore/memory_.h"
#include "MagickCore/option.h"
#include "MagickCore/pixel-accessor.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/static.h"
#include "MagickCore/string_.h"
#include "MagickCore/string-private.h"
#include "MagickCore/module.h"
#include "MagickCore/utility.h"
#include "MagickCore/xwindow.h"
#include "MagickCore/xwindow-private.h"
#if defined(MAGICKCORE_FLIF_DELEGATE)
#include <flif.h>
#endif

/*
  Forward declarations.
*/
#if defined(MAGICKCORE_FLIF_DELEGATE)
static MagickBooleanType
  WriteFLIFImage(const ImageInfo *,Image *,ExceptionInfo *);
#endif

#if defined(MAGICKCORE_FLIF_DELEGATE)
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d F L I F I m a g e                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadFLIFImage() reads an image in the FLIF image format.
%
%  The format of the ReadFLIFImage method is:
%
%      Image *ReadFLIFImage(const ImageInfo *image_info,
%        ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static Image *ReadFLIFImage(const ImageInfo *image_info,
  ExceptionInfo *exception)
{
  FLIF_DECODER
    *flifdec;

  FLIF_IMAGE
    *flifimage;

  Image
    *image;

  MagickBooleanType
    status;

  Quantum
    *q;

  ssize_t
    x;

  unsigned short
    *p;

  size_t
    count,
    image_count,
    length;

  ssize_t
    y;

  unsigned char
    *stream;

  unsigned short
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
  length=(size_t) GetBlobSize(image);
  stream=(unsigned char *) AcquireQuantumMemory(length,sizeof(*stream));
  if (stream == (unsigned char *) NULL)
    ThrowReaderException(ResourceLimitError,"MemoryAllocationFailed");
  count=ReadBlob(image,length,stream);
  if (count != length)
    {
      stream=(unsigned char *) RelinquishMagickMemory(stream);
      ThrowReaderException(CorruptImageError,"InsufficientImageDataInFile");
    }
  flifdec=flif_create_decoder();
  if (image_info->quality != UndefinedCompressionQuality)
    flif_decoder_set_quality(flifdec,(int32_t) image_info->quality);
  if (!flif_decoder_decode_memory(flifdec,stream,length))
    {
      flif_destroy_decoder(flifdec);
      ThrowReaderException(CorruptImageError,"CorruptImage");
    }
  image_count=flif_decoder_num_images(flifdec);
  flifimage=flif_decoder_get_image(flifdec,0);
  length=sizeof(unsigned short)*4*flif_image_get_width(flifimage);
  pixels=(unsigned short *) AcquireQuantumMemory(1,length);
  if (pixels == (unsigned short *) NULL)
    {
      flif_destroy_decoder(flifdec);
      ThrowReaderException(ResourceLimitError,"MemoryAllocationFailed");
    }

  for (count=0; count < image_count; count++)
  {
    if (count > 0)
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
      }
    flifimage=flif_decoder_get_image(flifdec,count);
    image->columns=(size_t) flif_image_get_width(flifimage);
    image->rows=(size_t) flif_image_get_height(flifimage);
    image->depth=flif_image_get_depth(flifimage);
    image->alpha_trait=(flif_image_get_nb_channels(flifimage) > 3 ?
      BlendPixelTrait : UndefinedPixelTrait);
    image->delay=flif_image_get_frame_delay(flifimage);
    image->ticks_per_second=1000;
    image->scene=count;
    image->dispose=BackgroundDispose;
    for (y=0; y < (ssize_t) image->rows; y++)
    {
      flif_image_read_row_RGBA16(flifimage,(uint32_t) y,pixels,length);
      p=pixels;
      q=QueueAuthenticPixels(image,0,y,image->columns,1,exception);
      if (q == (Quantum *) NULL)
        break;
      for (x=0; x < (ssize_t) image->columns; x++)
      {
        SetPixelRed(image,ScaleShortToQuantum(*p++),q);
        SetPixelGreen(image,ScaleShortToQuantum(*p++),q);
        SetPixelBlue(image,ScaleShortToQuantum(*p++),q);
        SetPixelAlpha(image,ScaleShortToQuantum(*p++),q);
        q+=(ptrdiff_t) GetPixelChannels(image);
      }
      if (SyncAuthenticPixels(image,exception) == MagickFalse)
        break;
      status=SetImageProgress(image,LoadImageTag,(MagickOffsetType) y,
        image->rows);
      if (status == MagickFalse)
        break;
    }
  }
  flif_destroy_decoder(flifdec);
  pixels=(unsigned short *) RelinquishMagickMemory(pixels);
  if (status == MagickFalse)
    return(DestroyImageList(image));
  return(image);
}
#endif

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   I s F L I F                                                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  IsFLIF() returns MagickTrue if the image format type, identified by the
%  magick string, is FLIF.
%
%  The format of the IsFLIF method is:
%
%      MagickBooleanType IsFLIF(const unsigned char *magick,
%        const size_t length)
%
%  A description of each parameter follows:
%
%    o magick: compare image format pattern against these bytes.
%
%    o length: Specifies the length of the magick string.
%
*/
static MagickBooleanType IsFLIF(const unsigned char *magick,
  const size_t length)
{
  if (length < 4)
    return(MagickFalse);
  if (LocaleNCompare((char *) magick,"FLIF",4) == 0)
    return(MagickTrue);
  return(MagickFalse);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r F L I F I m a g e                                         %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterFLIFImage() adds attributes for the FLIF image format to
%  the list of supported formats.  The attributes include the image format
%  tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterFLIFImage method is:
%
%      size_t RegisterFLIFImage(void)
%
*/
ModuleExport size_t RegisterFLIFImage(void)
{
  char
    version[MagickPathExtent];

  MagickInfo
    *entry;

  *version='\0';
  entry=AcquireMagickInfo("FLIF","FLIF","Free Lossless Image Format");
#if defined(MAGICKCORE_FLIF_DELEGATE)
  entry->decoder=(DecodeImageHandler *) ReadFLIFImage;
  entry->encoder=(EncodeImageHandler *) WriteFLIFImage;
  (void) FormatLocaleString(version,MagickPathExtent,"libflif %d.%d.%d [%04X]",
    (FLIF_VERSION >> 16) & 0xff,
    (FLIF_VERSION  >> 8) & 0xff,
    (FLIF_VERSION  >> 0) & 0xff,FLIF_ABI_VERSION);
#endif
  entry->mime_type=ConstantString("image/flif");
  entry->magick=(IsImageFormatHandler *) IsFLIF;
  if (*version != '\0')
    entry->version=ConstantString(version);
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r F L I F I m a g e                                     %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterFLIFImage() removes format registrations made by the FLIF module
%  from the list of supported formats.
%
%  The format of the UnregisterFLIFImage method is:
%
%      UnregisterFLIFImage(void)
%
*/
ModuleExport void UnregisterFLIFImage(void)
{
  (void) UnregisterMagickInfo("FLIF");
}

#if defined(MAGICKCORE_FLIF_DELEGATE)
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e F L I F I m a g e                                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  WriteFLIFImage() writes an image in the FLIF image format.
%
%  The format of the WriteFLIFImage method is:
%
%      MagickBooleanType WriteFLIFImage(const ImageInfo *image_info,
%        Image *image)
%
%  A description of each parameter follows.
%
%    o image_info: the image info.
%
%    o image:  The image.
%
*/
static MagickBooleanType WriteFLIFImage(const ImageInfo *image_info,
  Image *image, ExceptionInfo *exception)
{
  const Quantum
    *magick_restrict p;

  FLIF_ENCODER
    *flifenc;

  FLIF_IMAGE
    *flifimage;

  int
    flif_status;

  MagickBooleanType
    status;

  MagickOffsetType
    scene;

  unsigned char
    *magick_restrict qc;

  unsigned short
    *magick_restrict qs;

  size_t
    columns,
    length,
    number_scenes,
    rows;

  ssize_t
    x,
    y;

  void
    *buffer,
    *pixels;

  assert(image_info != (const ImageInfo *) NULL);
  assert(image_info->signature == MagickCoreSignature);
  assert(image != (Image *) NULL);
  assert(image->signature == MagickCoreSignature);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",image->filename);
  if ((image->columns > 0xFFFF) || (image->rows > 0xFFFF))
    ThrowWriterException(ImageError,"WidthOrHeightExceedsLimit");
  status=OpenBlob(image_info,image,WriteBinaryBlobMode,exception);
  if (status == MagickFalse)
    return(status);
  flifenc=flif_create_encoder();
  if (image_info->quality != UndefinedCompressionQuality)
    flif_encoder_set_lossy(flifenc,3*(100-(int32_t) image_info->quality));

  /* relatively fast encoding */
  flif_encoder_set_learn_repeat(flifenc,1);
  flif_encoder_set_split_threshold(flifenc,5461*8*5);

  columns=image->columns;
  rows=image->rows;

  /* Convert image to FLIFIMAGE */
  if (image->depth > 8)
    {
      flifimage=flif_create_image_HDR((uint32_t) image->columns,
        (uint32_t) image->rows);
      length=sizeof(unsigned short)*4*image->columns;
    }
  else
    {
      flifimage=flif_create_image((uint32_t) image->columns,
        (uint32_t) image->rows);
      length=sizeof(unsigned char)*4*image->columns;
    }
  if (flifimage == (FLIF_IMAGE *) NULL)
    {
      flif_destroy_encoder(flifenc);
      ThrowWriterException(ResourceLimitError,"MemoryAllocationFailed");
    }
  pixels=AcquireMagickMemory(length);
  if (pixels == (void *) NULL)
    {
      flif_destroy_image(flifimage);
      flif_destroy_encoder(flifenc);
      ThrowWriterException(ResourceLimitError,"MemoryAllocationFailed");
    }
  scene=0;
  number_scenes=GetImageListLength(image);
  do
  {
    for (y=0; y < (ssize_t) image->rows; y++)
    {
      p=GetVirtualPixels(image,0,y,image->columns,1,exception);
      if (p == (Quantum *) NULL)
        break;

      if (image->depth > 8)
        {
          qs=(unsigned short *) pixels;
          for (x=0; x < (ssize_t) image->columns; x++)
          {
            *qs++=ScaleQuantumToShort(GetPixelRed(image,p));
            *qs++=ScaleQuantumToShort(GetPixelGreen(image,p));
            *qs++=ScaleQuantumToShort(GetPixelBlue(image,p));
            if (image->alpha_trait != UndefinedPixelTrait)
              *qs++=ScaleQuantumToShort(GetPixelAlpha(image,p));
            else
              *qs++=0xFFFF;
            p+=(ptrdiff_t) GetPixelChannels(image);
          }
          flif_image_write_row_RGBA16(flifimage,(uint32_t) y,pixels,length);
        }
      else
        {
          qc=(unsigned char *) pixels;
          for (x=0; x < (ssize_t) image->columns; x++)
          {
            *qc++=ScaleQuantumToChar(GetPixelRed(image,p));
            *qc++=ScaleQuantumToChar(GetPixelGreen(image,p));
            *qc++=ScaleQuantumToChar(GetPixelBlue(image,p));
            if (image->alpha_trait != UndefinedPixelTrait)
              *qc++=ScaleQuantumToChar(GetPixelAlpha(image,p));
            else
              *qc++=0xFF;
            p+=(ptrdiff_t) GetPixelChannels(image);
          }
          flif_image_write_row_RGBA8(flifimage,(uint32_t) y,pixels,length);
        }
    }
    flif_image_set_frame_delay(flifimage,(uint32_t) (image->delay*100/
      image->ticks_per_second));
    flif_encoder_add_image(flifenc,flifimage);
    if (GetNextImageInList(image) == (Image *) NULL)
      break;
    image=SyncNextImageInList(image);
    if ((columns != image->columns) || (rows != image->rows))
      {
        flif_destroy_image(flifimage);
        flif_destroy_encoder(flifenc);
        pixels=RelinquishMagickMemory(pixels);
        ThrowWriterException(ImageError,"FramesNotSameDimensions");
      }
    scene++;
    status=SetImageProgress(image,SaveImagesTag,scene,number_scenes);
    if (status == MagickFalse)
       break;
  } while (image_info->adjoin != MagickFalse);
  flif_destroy_image(flifimage);
  pixels=RelinquishMagickMemory(pixels);
  flif_status=flif_encoder_encode_memory(flifenc,&buffer,&length);
  if (flif_status)
    WriteBlob(image,length,buffer);
  CloseBlob(image);
  flif_destroy_encoder(flifenc);
  buffer=RelinquishMagickMemory(buffer);
  return(flif_status == 0 ? MagickFalse : MagickTrue);
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: flif.h]---
Location: ImageMagick-main/coders/flif.h

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

#define MagickFLIFHeaders \
  MagickCoderHeader("FLIF", 0, "FLIF")

#define MagickFLIFAliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(FLIF)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

````

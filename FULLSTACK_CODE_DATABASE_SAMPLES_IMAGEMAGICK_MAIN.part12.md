---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 12
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 12 of 851)

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

---[FILE: avs.c]---
Location: ImageMagick-main/coders/avs.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                             AAA   V   V  SSSSS                              %
%                            A   A  V   V  SS                                 %
%                            AAAAA  V   V   SSS                               %
%                            A   A   V V      SS                              %
%                            A   A    V    SSSSS                              %
%                                                                             %
%                                                                             %
%                        Read/Write AVS X Image Format                        %
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
  WriteAVSImage(const ImageInfo *,Image *,ExceptionInfo *);

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d A V S I m a g e                                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadAVSImage() reads an AVS X image file and returns it.  It
%  allocates the memory necessary for the new Image structure and returns a
%  pointer to the new image.
%
%  The format of the ReadAVSImage method is:
%
%      Image *ReadAVSImage(const ImageInfo *image_info,ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static Image *ReadAVSImage(const ImageInfo *image_info,ExceptionInfo *exception)
{
  Image
    *image;

  MagickBooleanType
    status;

  MemoryInfo
    *pixel_info;

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
    Read AVS X image.
  */
  width=ReadBlobMSBLong(image);
  height=ReadBlobMSBLong(image);
  if (EOFBlob(image) != MagickFalse)
    ThrowReaderException(CorruptImageError,"ImproperImageHeader");
  if ((width == 0UL) || (height == 0UL))
    ThrowReaderException(CorruptImageError,"ImproperImageHeader");
  do
  {
    /*
      Convert AVS raster image to pixel packets.
    */
    image->columns=width;
    image->rows=height;
    image->depth=8;
    image->alpha_trait=BlendPixelTrait;
    if ((image_info->ping != MagickFalse) && (image_info->number_scenes != 0))
      if (image->scene >= (image_info->scene+image_info->number_scenes-1))
        break;
    status=SetImageExtent(image,image->columns,image->rows,exception);
    if (status == MagickFalse)
      return(DestroyImageList(image));
    pixel_info=AcquireVirtualMemory(image->columns,4*sizeof(*pixels));
    if (pixel_info == (MemoryInfo *) NULL)
      ThrowReaderException(ResourceLimitError,"MemoryAllocationFailed");
    pixels=(unsigned char *) GetVirtualMemoryBlob(pixel_info);
    length=(size_t) 4*image->columns;
    for (y=0; y < (ssize_t) image->rows; y++)
    {
      count=ReadBlob(image,length,pixels);
      if ((size_t) count != length)
        {
          pixel_info=RelinquishVirtualMemory(pixel_info);
          ThrowReaderException(CorruptImageError,"UnableToReadImageData");
        }
      p=pixels;
      q=QueueAuthenticPixels(image,0,y,image->columns,1,exception);
      if (q == (Quantum *) NULL)
        break;
      for (x=0; x < (ssize_t) image->columns; x++)
      {
        SetPixelAlpha(image,ScaleCharToQuantum(*p++),q);
        SetPixelRed(image,ScaleCharToQuantum(*p++),q);
        SetPixelGreen(image,ScaleCharToQuantum(*p++),q);
        SetPixelBlue(image,ScaleCharToQuantum(*p++),q);
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
    pixel_info=RelinquishVirtualMemory(pixel_info);
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
    width=ReadBlobMSBLong(image);
    height=ReadBlobMSBLong(image);
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
%   R e g i s t e r A V S I m a g e                                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterAVSImage() adds attributes for the AVS X image format to the list
%  of supported formats.  The attributes include the image format tag, a
%  method to read and/or write the format, whether the format supports the
%  saving of more than one frame to the same file or blob, whether the format
%  supports native in-memory I/O, and a brief description of the format.
%
%  The format of the RegisterAVSImage method is:
%
%      size_t RegisterAVSImage(void)
%
*/
ModuleExport size_t RegisterAVSImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("AVS","AVS","AVS X image");
  entry->decoder=(DecodeImageHandler *) ReadAVSImage;
  entry->encoder=(EncodeImageHandler *) WriteAVSImage;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r A V S I m a g e                                       %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterAVSImage() removes format registrations made by the
%  AVS module from the list of supported formats.
%
%  The format of the UnregisterAVSImage method is:
%
%      UnregisterAVSImage(void)
%
*/
ModuleExport void UnregisterAVSImage(void)
{
  (void) UnregisterMagickInfo("AVS");
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e A V S I m a g e                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  WriteAVSImage() writes an image to a file in AVS X image format.
%
%  The format of the WriteAVSImage method is:
%
%      MagickBooleanType WriteAVSImage(const ImageInfo *image_info,
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
static MagickBooleanType WriteAVSImage(const ImageInfo *image_info,Image *image,
  ExceptionInfo *exception)
{
  const Quantum
    *magick_restrict p;

  MagickBooleanType
    status;

  MagickOffsetType
    scene;

  MemoryInfo
    *pixel_info;

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
      Write AVS header.
    */
    if (IssRGBCompatibleColorspace(image->colorspace) == MagickFalse)
      (void) TransformImageColorspace(image,sRGBColorspace,exception);
    (void) WriteBlobMSBLong(image,(unsigned int) image->columns);
    (void) WriteBlobMSBLong(image,(unsigned int) image->rows);
    /*
      Allocate memory for pixels.
    */
    pixel_info=AcquireVirtualMemory(image->columns,4*sizeof(*pixels));
    if (pixel_info == (MemoryInfo *) NULL)
      ThrowWriterException(ResourceLimitError,"MemoryAllocationFailed");
    pixels=(unsigned char *) GetVirtualMemoryBlob(pixel_info);
    /*
      Convert MIFF to AVS raster pixels.
    */
    for (y=0; y < (ssize_t) image->rows; y++)
    {
      p=GetVirtualPixels(image,0,y,image->columns,1,exception);
      if (p == (const Quantum *) NULL)
        break;
      q=pixels;
      for (x=0; x < (ssize_t) image->columns; x++)
      {
        *q++=ScaleQuantumToChar((Quantum) (image->alpha_trait ==
          BlendPixelTrait ? GetPixelAlpha(image,p) : OpaqueAlpha));
        *q++=ScaleQuantumToChar(GetPixelRed(image,p));
        *q++=ScaleQuantumToChar(GetPixelGreen(image,p));
        *q++=ScaleQuantumToChar(GetPixelBlue(image,p));
        p+=(ptrdiff_t) GetPixelChannels(image);
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
    pixel_info=RelinquishVirtualMemory(pixel_info);
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

---[FILE: avs.h]---
Location: ImageMagick-main/coders/avs.h

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

#define MagickAVSHeaders

#define MagickAVSAliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(AVS)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: bayer.c]---
Location: ImageMagick-main/coders/bayer.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                     BBBB    AAA   Y   Y  EEEEE  RRRR                        %
%                     B   B  A   A   Y Y   E      R   R                       %
%                     BBBB   AAAAA    Y    EEE    RRRR                        %
%                     B   B  A   A    Y    E      R  R                        %
%                     BBBB   A   A    Y    EEEEE  R   R                       %
%                                                                             %
%                                                                             %
%                     Read/Write Raw Bayer Image Format                       %
%                                                                             %
%                              Software Design                                %
%                            Cristy, Dirk Lemstra                             %
%                                 July 2022                                   %
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
#include "MagickCore/channel.h"
#include "MagickCore/colorspace.h"
#include "MagickCore/colorspace-private.h"
#include "MagickCore/constitute.h"
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
#include "MagickCore/registry.h"
#include "MagickCore/static.h"
#include "MagickCore/statistic.h"
#include "MagickCore/string_.h"
#include "MagickCore/transform.h"
#include "MagickCore/module.h"
#include "MagickCore/utility.h"


/*
  Forward declarations.
*/
static MagickBooleanType
  WriteBAYERImage(const ImageInfo *,Image *,ExceptionInfo *);

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d B A Y E R I m a g e                                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadBAYERImage() reconstructs a full color image from the incomplete color
%  samples output from an image sensor overlaid with a color filter array
%  (CFA).  It allocates the memory necessary for the new Image structure and
%  returns a pointer to the new image.
%
%  Reference: http://im.snibgo.com/demosaic.htm.
%
%  The format of the ReadBAYERImage method is:
%
%      Image *ReadBAYERImage(const ImageInfo *image_info,
%        ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/

static Image *BayerSample(const Image *image, const char *offset,
  RectangleInfo geometry, ExceptionInfo *exception)
{
  Image
    *clone,
    *sample;

  clone=CloneImage(image,0,0,MagickTrue,exception);
  if (clone == (Image *) NULL)
    return(clone);
  (void) SetImageArtifact(clone,"sample:offset",offset);
  sample=SampleImage(clone,geometry.width,geometry.height,exception);
  clone=DestroyImage(clone);
  return(sample);
}

static Image *ReadBAYERImage(const ImageInfo *image_info,
  ExceptionInfo *exception)
{
  Image
    *image,
    *image_a,
    *image_b;

  ImageInfo
    *read_info;

  RectangleInfo
    geometry;

  /*
    Reconstruct a full color image from the incomplete camera sensor.
  */
  assert(image_info != (const ImageInfo *) NULL);
  assert(image_info->signature == MagickCoreSignature);
  assert(exception != (ExceptionInfo *) NULL);
  assert(exception->signature == MagickCoreSignature);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",
      image_info->filename);
  read_info=CloneImageInfo(image_info);
  (void) FormatLocaleString(read_info->filename,MagickPathExtent,"gray:%.1024s",
    image_info->filename);
  (void) CopyMagickString(read_info->magick,"GRAY",MagickPathExtent);
  read_info->verbose=MagickFalse;
  image=ReadImage(read_info,exception);
  read_info=DestroyImageInfo(read_info);
  if (image == (Image *) NULL)
    return((Image *) NULL);
  (void) ParseRegionGeometry(image,"50%",&geometry,exception);
  image_a=BayerSample(image,"75x25",geometry,exception);
  if (image_a == (Image *) NULL)
    return(DestroyImage(image));
  image_b=BayerSample(image,"25x75",geometry,exception);
  if (image_b == (Image *) NULL)
    {
      image_a=DestroyImage(image_a);
      return(DestroyImage(image));
    }
  AppendImageToList(&image_a,image_b);
  image_b=EvaluateImages(image_a,MeanEvaluateOperator,exception);
  image_a=DestroyImageList(image_a);
  image_a=BayerSample(image,"25",geometry,exception);
  if (image_a == (Image *) NULL)
    {
      image_b=DestroyImage(image_b);
      return(DestroyImage(image));
    }
  AppendImageToList(&image_a,image_b);
  image_b=BayerSample(image,"75",geometry,exception);
  if (image_b == (Image *) NULL)
    {
      image_a=DestroyImageList(image_a);
      return(DestroyImage(image));
    }
  AppendImageToList(&image_a,image_b);
  image_b=CombineImages(image_a,sRGBColorspace,exception);
  image_a=DestroyImageList(image_a);
  if (image_b == (Image *) NULL)
    return(DestroyImage(image));
  (void) ParseRegionGeometry(image_b,"200%",&geometry,exception);
  image_a=ResizeImage(image_b,geometry.width,geometry.height,image->filter,
    exception);
  image_b=DestroyImageList(image_b);
  if (image_a == (Image *) NULL)
    return(DestroyImage(image));
  (void) CopyMagickString(image_a->magick,image_info->magick,
    MagickPathExtent);
  (void) CopyMagickString(image_a->filename,image_info->filename,
    MagickPathExtent);
  image=DestroyImageList(image);
  return(image_a);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r B A Y E R I m a g e                                       %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterBAYERImage() adds attributes for the BAYER image format to
%  the list of supported formats.  The attributes include the image format
%  tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterBAYERImage method is:
%
%      size_t RegisterBAYERImage(void)
%
*/
ModuleExport size_t RegisterBAYERImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("BAYER","BAYER","Raw mosaiced samples");
  entry->decoder=(DecodeImageHandler *) ReadBAYERImage;
  entry->encoder=(EncodeImageHandler *) WriteBAYERImage;
  entry->flags|=CoderRawSupportFlag | CoderEndianSupportFlag;
  (void) RegisterMagickInfo(entry);
  entry=AcquireMagickInfo("BAYER","BAYERA","Raw mosaiced and alpha samples");
  entry->decoder=(DecodeImageHandler *) ReadBAYERImage;
  entry->encoder=(EncodeImageHandler *) WriteBAYERImage;
  entry->flags|=CoderRawSupportFlag | CoderEndianSupportFlag;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r B A Y E R I m a g e                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterBAYERImage() removes format registrations made by the BAYER module
%  from the list of supported formats.
%
%  The format of the UnregisterBAYERImage method is:
%
%      UnregisterBAYERImage(void)
%
*/
ModuleExport void UnregisterBAYERImage(void)
{
  (void) UnregisterMagickInfo("BAYERA");
  (void) UnregisterMagickInfo("BAYER");
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e B A Y E R I m a g e                                             %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  WriteBAYERImage() deconstructs a full color image into a single channel
%  RGGB raw image format.
%
%  Reference: http://im.snibgo.com/mosaic.htm.
%
%  The format of the WriteBAYERImage method is:
%
%      MagickBooleanType WriteBAYERImage(const ImageInfo *image_info,
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
static Image* BayerApplyMask(Image *images,size_t index_a,size_t index_b,
  size_t fill_x,size_t fill_y,ExceptionInfo *exception)
{
  DrawInfo
    *draw_info;

  Image
    *canvas,
    *mask_image,
    *result;

  PixelInfo
    pixel;

  Quantum
    *q;

  draw_info=AcquireDrawInfo();
  if (draw_info == (DrawInfo *) NULL)
    return((Image *) NULL);
  draw_info->fill_pattern=AcquireImage((ImageInfo *) NULL,exception);
  if (draw_info->fill_pattern == (Image *) NULL)
    {
      draw_info=DestroyDrawInfo(draw_info);
      return((Image *) NULL);
    }
  (void) SetImageExtent(draw_info->fill_pattern,2,2,exception);
  (void) QueryColorCompliance("#000",AllCompliance,
    &draw_info->fill_pattern->background_color,exception);
  (void) SetImageBackgroundColor(draw_info->fill_pattern,exception);
  q=GetAuthenticPixels(draw_info->fill_pattern,(ssize_t) fill_x,(ssize_t)
    fill_y,1,1,exception);
  if (q == (Quantum *) NULL)
    {
      draw_info=DestroyDrawInfo(draw_info);
      return((Image *) NULL);
    }
  (void) QueryColorCompliance("#fff",AllCompliance,&pixel,exception);
  SetPixelViaPixelInfo(draw_info->fill_pattern,&pixel,q);
  mask_image=CloneImage(GetImageFromList(images,(ssize_t) index_a),0,0,
    MagickTrue,exception);
  if (mask_image == (Image *) NULL)
    {
      draw_info=DestroyDrawInfo(draw_info);
      return((Image *) NULL);
    }
  draw_info->primitive=ConstantString("color 0,0 reset");
  (void) DrawImage(mask_image,draw_info,exception);
  (void) SetImageAlphaChannel(mask_image,OffAlphaChannel,exception);
  draw_info=DestroyDrawInfo(draw_info);
  canvas=CloneImage(GetImageFromList(images,(ssize_t) index_b),0,0,MagickTrue,
    exception);
  if (canvas == (Image *) NULL)
    {
      mask_image=DestroyImage(mask_image);
      return((Image *) NULL);
    }
  (void) CompositeImage(canvas,mask_image,CopyAlphaCompositeOp,MagickTrue,0,0,
    exception);
  mask_image=DestroyImage(mask_image);
  result=CloneImage(GetImageFromList(images,(ssize_t) index_a),0,0,MagickTrue,
    exception);
  if (result != (Image *) NULL)
    {
      (void) CompositeImage(result,canvas,OverCompositeOp,MagickTrue,0,0,
        exception);
      (void) SetImageAlphaChannel(result,OffAlphaChannel,exception);
    }
  canvas=DestroyImage(canvas);
  return(result);
}

static MagickBooleanType WriteBAYERImage(const ImageInfo *image_info,
  Image *image,ExceptionInfo *exception)
{
  Image
    *bayer_image=(Image *) NULL,
    *images=(Image *) NULL;

  MagickBooleanType
    status;

  /*
    Deconstruct RGB image into a single channel RGGB raw image.
  */
  assert(image_info != (const ImageInfo *) NULL);
  assert(image_info->signature == MagickCoreSignature);
  assert(image != (Image *) NULL);
  assert(image->signature == MagickCoreSignature);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",image->filename);
  bayer_image=CloneImage(image,0,0,MagickTrue,exception);
  status=MagickFalse;
  if (bayer_image == (Image *) NULL)
    return(MagickFalse);
  (void) SetImageColorspace(bayer_image,sRGBColorspace,exception);
  (void) SetPixelChannelMask(bayer_image,(ChannelType) (RedChannel |
    GreenChannel | BlueChannel));
  images=SeparateImages(bayer_image,exception);
  bayer_image=DestroyImage(bayer_image);
  if (images == (Image *) NULL)
    return(MagickFalse);
  bayer_image=BayerApplyMask(images,0,1,1,0,exception);
  if (bayer_image == (Image *) NULL)
    {
      images=DestroyImageList(images);
      return(MagickFalse);
    }
  AppendImageToList(&images,bayer_image);
  bayer_image=BayerApplyMask(images,3,1,0,1,exception);
  if (bayer_image == (Image *) NULL)
    {
      images=DestroyImageList(images);
      return(MagickFalse);
    }
  AppendImageToList(&images,bayer_image);
  status=MagickFalse;
  bayer_image=BayerApplyMask(images,4,2,1,1,exception);
  if (bayer_image != (Image *) NULL)
    status=MagickTrue;
  images=DestroyImageList(images);
  if (bayer_image != (Image *) NULL)
    {
      ImageInfo
        *write_info;

      write_info=CloneImageInfo(image_info);
      write_info->verbose=MagickFalse;
      (void) CopyMagickString(write_info->magick,"GRAY",MagickPathExtent);
      (void) CopyMagickString(bayer_image->filename,image->filename,
        MagickPathExtent);
      status=WriteImage(write_info,bayer_image,exception);
      bayer_image=DestroyImage(bayer_image);
      write_info=DestroyImageInfo(write_info);
    }
  return(status);
}
```

--------------------------------------------------------------------------------

---[FILE: bayer.h]---
Location: ImageMagick-main/coders/bayer.h

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

#define MagickBAYERHeaders

#define MagickBAYERAliases \
  MagickCoderAlias("BAYER", "BAYERA")

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(BAYER)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

````

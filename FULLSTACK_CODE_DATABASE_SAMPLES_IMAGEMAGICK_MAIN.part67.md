---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 67
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 67 of 851)

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

---[FILE: map.c]---
Location: ImageMagick-main/coders/map.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                            M   M   AAA   PPPP                               %
%                            MM MM  A   A  P   P                              %
%                            M M M  AAAAA  PPPP                               %
%                            M   M  A   A  P                                  %
%                            M   M  A   A  P                                  %
%                                                                             %
%                                                                             %
%                  Read/Write Image Colormaps as an Image File.               %
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
#include "MagickCore/attribute.h"
#include "MagickCore/blob.h"
#include "MagickCore/blob-private.h"
#include "MagickCore/cache.h"
#include "MagickCore/color.h"
#include "MagickCore/color-private.h"
#include "MagickCore/colormap.h"
#include "MagickCore/colormap-private.h"
#include "MagickCore/colorspace.h"
#include "MagickCore/colorspace-private.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/histogram.h"
#include "MagickCore/image.h"
#include "MagickCore/image-private.h"
#include "MagickCore/list.h"
#include "MagickCore/magick.h"
#include "MagickCore/memory_.h"
#include "MagickCore/pixel-accessor.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/static.h"
#include "MagickCore/statistic.h"
#include "MagickCore/string_.h"
#include "MagickCore/module.h"

/*
  Forward declarations.
*/
static MagickBooleanType
  WriteMAPImage(const ImageInfo *,Image *,ExceptionInfo *);

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d M A P I m a g e                                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadMAPImage() reads an image of raw RGB colormap and colormap index
%  bytes and returns it.  It allocates the memory necessary for the new Image
%  structure and returns a pointer to the new image.
%
%  The format of the ReadMAPImage method is:
%
%      Image *ReadMAPImage(const ImageInfo *image_info,ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static Image *ReadMAPImage(const ImageInfo *image_info,ExceptionInfo *exception)
{
  Image
    *image;

  MagickBooleanType
    status;

  Quantum
    index;

  Quantum
    *q;

  size_t
    depth,
    packet_size,
    quantum;

  ssize_t
    count,
    i,
    x,
    y;

  unsigned char
    *colormap,
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
  if ((image->columns == 0) || (image->rows == 0))
    ThrowReaderException(OptionError,"MustSpecifyImageSize");
  if (image_info->depth == 0)
    ThrowReaderException(OptionError,"MustSpecifyImageDepth");
  status=SetImageExtent(image,image->columns,image->rows,exception);
  if (status == MagickFalse)
    return(DestroyImageList(image));
  status=OpenBlob(image_info,image,ReadBinaryBlobMode,exception);
  if (status == MagickFalse)
    {
      image=DestroyImageList(image);
      return((Image *) NULL);
    }
  /*
    Initialize image structure.
  */
  image->storage_class=PseudoClass;
  status=AcquireImageColormap(image,(size_t)
    (image->offset != 0 ? image->offset : 256),exception);
  if (status == MagickFalse)
    ThrowReaderException(ResourceLimitError,"MemoryAllocationFailed");
  depth=GetImageQuantumDepth(image,MagickTrue);
  packet_size=(size_t) (depth/8);
  pixels=(unsigned char *) AcquireQuantumMemory(image->columns,packet_size*
    sizeof(*pixels));
  packet_size=(size_t) (depth > 8 ? 6UL : 3UL);
  colormap=(unsigned char *) AcquireQuantumMemory(image->colors,packet_size*
    sizeof(*colormap));
  if ((pixels == (unsigned char *) NULL) ||
      (colormap == (unsigned char *) NULL))
    {
      pixels=(unsigned char *) RelinquishMagickMemory(pixels);
      colormap=(unsigned char *) RelinquishMagickMemory(colormap);
      ThrowReaderException(ResourceLimitError,"MemoryAllocationFailed");
    }
  /*
    Read image colormap.
  */
  count=ReadBlob(image,packet_size*image->colors,colormap);
  if (count != (ssize_t) (packet_size*image->colors))
    {
      pixels=(unsigned char *) RelinquishMagickMemory(pixels);
      colormap=(unsigned char *) RelinquishMagickMemory(colormap);
      ThrowReaderException(CorruptImageError,"InsufficientImageDataInFile");
    }
  p=colormap;
  if (image->depth <= 8)
    for (i=0; i < (ssize_t) image->colors; i++)
    {
      image->colormap[i].red=ScaleCharToQuantum(*p++);
      image->colormap[i].green=ScaleCharToQuantum(*p++);
      image->colormap[i].blue=ScaleCharToQuantum(*p++);
    }
  else
    for (i=0; i < (ssize_t) image->colors; i++)
    {
      quantum=(size_t) (*p++ << 8);
      quantum|=(*p++);
      image->colormap[i].red=(Quantum) quantum;
      quantum=(size_t) (*p++ << 8);
      quantum|=(size_t) (*p++);
      image->colormap[i].green=(Quantum) quantum;
      quantum=(size_t) (*p++ << 8);
      quantum|=(*p++);
      image->colormap[i].blue=(Quantum) quantum;
    }
  colormap=(unsigned char *) RelinquishMagickMemory(colormap);
  if (image_info->ping != MagickFalse)
    {
      (void) CloseBlob(image);
      pixels=(unsigned char *) RelinquishMagickMemory(pixels);
      return(GetFirstImageInList(image));
    }
  status=SetImageExtent(image,image->columns,image->rows,exception);
  if (status == MagickFalse)
    {
      pixels=(unsigned char *) RelinquishMagickMemory(pixels);
      return(DestroyImageList(image));
    }
  /*
    Read image pixels.
  */
  packet_size=(size_t) (depth/8);
  for (y=0; y < (ssize_t) image->rows; y++)
  {
    p=pixels;
    q=QueueAuthenticPixels(image,0,y,image->columns,1,exception);
    if (q == (Quantum *) NULL)
      break;
    count=ReadBlob(image,(size_t) packet_size*image->columns,pixels);
    if (count != (ssize_t) (packet_size*image->columns))
      break;
    for (x=0; x < (ssize_t) image->columns; x++)
    {
      index=(Quantum) ConstrainColormapIndex(image,*p,exception);
      p++;
      if (image->colors > 256)
        {
          index=(Quantum) ConstrainColormapIndex(image,(ssize_t) (((size_t) index << 8)+
            (size_t) (*p)),exception);
          p++;
        }
      SetPixelIndex(image,index,q);
      SetPixelViaPixelInfo(image,image->colormap+(ssize_t) index,q);
      q+=(ptrdiff_t) GetPixelChannels(image);
    }
    if (SyncAuthenticPixels(image,exception) == MagickFalse)
      break;
  }
  pixels=(unsigned char *) RelinquishMagickMemory(pixels);
  if (y < (ssize_t) image->rows)
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
%   R e g i s t e r M A P I m a g e                                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterMAPImage() adds attributes for the MAP image format to
%  the list of supported formats.  The attributes include the image format
%  tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterMAPImage method is:
%
%      size_t RegisterMAPImage(void)
%
*/
ModuleExport size_t RegisterMAPImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("MAP","MAP","Colormap intensities and indices");
  entry->decoder=(DecodeImageHandler *) ReadMAPImage;
  entry->encoder=(EncodeImageHandler *) WriteMAPImage;
  entry->flags^=CoderAdjoinFlag;
  entry->format_type=ExplicitFormatType;
  entry->flags|=CoderRawSupportFlag;
  entry->flags|=CoderEndianSupportFlag;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r M A P I m a g e                                       %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterMAPImage() removes format registrations made by the
%  MAP module from the list of supported formats.
%
%  The format of the UnregisterMAPImage method is:
%
%      UnregisterMAPImage(void)
%
*/
ModuleExport void UnregisterMAPImage(void)
{
  (void) UnregisterMagickInfo("MAP");
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e M A P I m a g e                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  WriteMAPImage() writes an image to a file as red, green, and blue
%  colormap bytes followed by the colormap indexes.
%
%  The format of the WriteMAPImage method is:
%
%      MagickBooleanType WriteMAPImage(const ImageInfo *image_info,
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
static MagickBooleanType WriteMAPImage(const ImageInfo *image_info,Image *image,
  ExceptionInfo *exception)
{
  MagickBooleanType
    status;

  const Quantum
    *p;

  ssize_t
    i,
    x;

  unsigned char
    *q;

  size_t
    depth,
    packet_size;

  ssize_t
    y;

  unsigned char
    *colormap,
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
  /*
    Allocate colormap.
  */
  if (SetImageType(image,PaletteType,exception) == MagickFalse)
    ThrowWriterException(ResourceLimitError,"MemoryAllocationFailed");
  depth=GetImageQuantumDepth(image,MagickTrue);
  packet_size=(size_t) (depth/8);
  pixels=(unsigned char *) AcquireQuantumMemory(image->columns,packet_size*
    sizeof(*pixels));
  packet_size=(size_t) (image->colors > 256 ? 6UL : 3UL);
  colormap=(unsigned char *) AcquireQuantumMemory(image->colors,packet_size*
    sizeof(*colormap));
  if ((pixels == (unsigned char *) NULL) ||
      (colormap == (unsigned char *) NULL))
    {
      if (colormap != (unsigned char *) NULL)
        colormap=(unsigned char *) RelinquishMagickMemory(colormap);
      if (pixels != (unsigned char *) NULL)
        pixels=(unsigned char *) RelinquishMagickMemory(pixels);
      ThrowWriterException(ResourceLimitError,"MemoryAllocationFailed");
    }
  /*
    Write colormap to file.
  */
  q=colormap;
  if (image->colors <= 256)
    for (i=0; i < (ssize_t) image->colors; i++)
    {
      *q++=(unsigned char) ScaleQuantumToChar((Quantum) image->colormap[i].red);
      *q++=(unsigned char) ScaleQuantumToChar((Quantum) image->colormap[i].green);
      *q++=(unsigned char) ScaleQuantumToChar((Quantum) image->colormap[i].blue);
    }
  else
    for (i=0; i < (ssize_t) image->colors; i++)
    {
      *q++=(unsigned char) (ScaleQuantumToShort((Quantum) image->colormap[i].red) >> 8);
      *q++=(unsigned char) (ScaleQuantumToShort((Quantum) image->colormap[i].red) & 0xff);
      *q++=(unsigned char) (ScaleQuantumToShort((Quantum) image->colormap[i].green) >> 8);
      *q++=(unsigned char) (ScaleQuantumToShort((Quantum) image->colormap[i].green) &
        0xff);
      *q++=(unsigned char) (ScaleQuantumToShort((Quantum) image->colormap[i].blue) >> 8);
      *q++=(unsigned char) (ScaleQuantumToShort((Quantum) image->colormap[i].blue) &
        0xff);
    }
  (void) WriteBlob(image,packet_size*image->colors,colormap);
  colormap=(unsigned char *) RelinquishMagickMemory(colormap);
  /*
    Write image pixels to file.
  */
  for (y=0; y < (ssize_t) image->rows; y++)
  {
    p=GetVirtualPixels(image,0,y,image->columns,1,exception);
    if (p == (const Quantum *) NULL)
      break;
    q=pixels;
    for (x=0; x < (ssize_t) image->columns; x++)
    {
      if (image->colors > 256)
        *q++=(unsigned char) ((size_t) GetPixelIndex(image,p) >> 8);
      *q++=(unsigned char) ((ssize_t) GetPixelIndex(image,p));
      p+=(ptrdiff_t) GetPixelChannels(image);
    }
    (void) WriteBlob(image,(size_t) (q-pixels),pixels);
  }
  pixels=(unsigned char *) RelinquishMagickMemory(pixels);
  if (CloseBlob(image) == MagickFalse)
    status=MagickFalse;
  return(status);
}
```

--------------------------------------------------------------------------------

---[FILE: map.h]---
Location: ImageMagick-main/coders/map.h

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

#define MagickMAPHeaders

#define MagickMAPAliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(MAP)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: mask.c]---
Location: ImageMagick-main/coders/mask.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                         M   M   AAA   SSSSS  K   K                          %
%                         MM MM  A   A  SS     K  K                           %
%                         M M M  AAAAA   SSS   KKK                            %
%                         M   M  A   A     SS  K  K                           %
%                         M   M  A   A  SSSSS  K   K                          %
%                                                                             %
%                                                                             %
%                              Write Mask File.                               %
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
#include "MagickCore/attribute.h"
#include "MagickCore/blob.h"
#include "MagickCore/blob-private.h"
#include "MagickCore/constitute.h"
#include "MagickCore/enhance.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/list.h"
#include "MagickCore/magick.h"
#include "MagickCore/memory_.h"
#include "MagickCore/monitor.h"
#include "MagickCore/monitor-private.h"
#include "MagickCore/pixel-accessor.h"
#include "MagickCore/property.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/static.h"
#include "MagickCore/string_.h"
#include "MagickCore/module.h"

/*
  Forward declarations.
*/
static MagickBooleanType
  WriteMASKImage(const ImageInfo *,Image *,ExceptionInfo *);

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d M A S K I m a g e                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadMASKImage returns the image mask associated with the image.
%
%  The format of the ReadMASKImage method is:
%
%      Image *ReadMASKImage(const ImageInfo *image_info,
%        ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static Image *ReadMASKImage(const ImageInfo *image_info,
  ExceptionInfo *exception)
{
  Image
    *image;

  ImageInfo
    *read_info;

  /*
    Initialize Image structure.
  */
  assert(image_info != (const ImageInfo *) NULL);
  assert(image_info->signature == MagickCoreSignature);
  assert(exception != (ExceptionInfo *) NULL);
  assert(exception->signature == MagickCoreSignature);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",
      image_info->filename);
  read_info=CloneImageInfo(image_info);
  SetImageInfoBlob(read_info,(void *) NULL,0);
  (void) FormatLocaleString(read_info->filename,MagickPathExtent,
    "miff:%s",image_info->filename);
  image=ReadImage(read_info,exception);
  read_info=DestroyImageInfo(read_info);
  if (image != (Image *) NULL)
    {
      MagickBooleanType
        status;

      status=GrayscaleImage(image,image->intensity,exception);
      if (status == MagickFalse)
        image=DestroyImage(image);
    }
  return(GetFirstImageInList(image));
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r M A S K I m a g e                                         %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterMASKImage() adds attributes for the MASK image format to
%  the list of supported formats.  The attributes include the image format
%  tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterMASKImage method is:
%
%      size_t RegisterMASKImage(void)
%
*/
ModuleExport size_t RegisterMASKImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("MASK","MASK","Image Clip Mask");
  entry->decoder=(DecodeImageHandler *) ReadMASKImage;
  entry->encoder=(EncodeImageHandler *) WriteMASKImage;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r M A S K I m a g e                                     %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterMASKImage() removes format registrations made by the
%  MASK module from the list of supported formats.
%
%  The format of the UnregisterMASKImage method is:
%
%      UnregisterMASKImage(void)
%
*/
ModuleExport void UnregisterMASKImage(void)
{
  (void) UnregisterMagickInfo("MASK");
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e M A S K I m a g e                                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  WriteMASKImage() writes an image mask to a file.
%
%  The format of the WriteMASKImage method is:
%
%      MagickBooleanType WriteMASKImage(const ImageInfo *image_info,
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

static Image *MaskImage(const Image *image,const PixelChannel mask_channel,
  ExceptionInfo *exception)
{
  CacheView
    *image_view,
    *mask_view;

  Image
    *mask_image;

  MagickBooleanType
    status;

  ssize_t
    y;

  mask_image=CloneImage(image,0,0,MagickTrue,exception);
  if (mask_image == (Image *) NULL)
    return((Image *) NULL);
  if (SetImageStorageClass(mask_image,DirectClass,exception) == MagickFalse)
    {
      mask_image=DestroyImage(mask_image);
      return((Image *) NULL);
    }
  mask_image->alpha_trait=UndefinedPixelTrait;
  (void) SetImageColorspace(mask_image,GRAYColorspace,exception);
  /*
    Mask image.
  */
  status=MagickTrue;
  image_view=AcquireVirtualCacheView(image,exception);
  mask_view=AcquireAuthenticCacheView(mask_image,exception);
  for (y=0; y < (ssize_t) image->rows; y++)
  {
    const Quantum
      *magick_restrict p;

    Quantum
      *magick_restrict q;

    ssize_t
      x;

    if (status == MagickFalse)
      continue;
    p=GetCacheViewVirtualPixels(image_view,0,y,image->columns,1,exception);
    q=QueueCacheViewAuthenticPixels(mask_view,0,y,mask_image->columns,1,
      exception);
    if ((p == (const Quantum *) NULL) || (q == (Quantum *) NULL))
      {
        status=MagickFalse;
        continue;
      }
    for (x=0; x < (ssize_t) image->columns; x++)
    {
      switch (mask_channel)
      {
        case CompositeMaskPixelChannel:
        {
          SetPixelChannel(mask_image,GrayPixelChannel,
            GetPixelCompositeMask(image,p),q);
          break;
        }
        case ReadMaskPixelChannel:
        {
          SetPixelChannel(mask_image,GrayPixelChannel,
            GetPixelReadMask(image,p),q);
          break;
        }
        case WriteMaskPixelChannel:
        {
          SetPixelChannel(mask_image,GrayPixelChannel,
            GetPixelWriteMask(image,p),q);
          break;
        }
        default:
        {
          SetPixelChannel(mask_image,GrayPixelChannel,0,q);
          break;
        }
      }
      p+=(ptrdiff_t) GetPixelChannels(image);
      q+=(ptrdiff_t) GetPixelChannels(mask_image);
    }
    if (SyncCacheViewAuthenticPixels(mask_view,exception) == MagickFalse)
      status=MagickFalse;
  }
  mask_view=DestroyCacheView(mask_view);
  image_view=DestroyCacheView(image_view);
  if (status == MagickFalse)
    mask_image=DestroyImage(mask_image);
  return(mask_image);
}

static MagickBooleanType WriteMASKImage(const ImageInfo *image_info,
  Image *image,ExceptionInfo *exception)
{
  Image
    *mask_image,
    *write_image;

  ImageInfo
    *write_info;

  MagickBooleanType
    status;

  write_image=NewImageList();
  if (GetPixelWriteMaskTraits(image) != UndefinedPixelTrait)
    {
      mask_image=MaskImage(image,WriteMaskPixelChannel,exception);
      if (mask_image != (Image *) NULL)
        {
          (void) SetImageProperty(image,"mask","write",exception);
          AppendImageToList(&write_image,mask_image);
        }
    }
  if (GetPixelReadMaskTraits(image) != UndefinedPixelTrait)
    {
      mask_image=MaskImage(image,ReadMaskPixelChannel,exception);
      if (mask_image != (Image *) NULL)
        {
          (void) SetImageProperty(image,"mask","read",exception);
          AppendImageToList(&write_image,mask_image);
        }
    }
  if (GetPixelCompositeMaskTraits(image) != UndefinedPixelTrait)
    {
      mask_image=MaskImage(image,CompositeMaskPixelChannel,exception);
      if (mask_image != (Image *) NULL)
        {
          (void) SetImageProperty(image,"mask","composite",exception);
          AppendImageToList(&write_image,mask_image);
        }
    }
  if (write_image == (Image *) NULL)
    ThrowWriterException(CoderError,"ImageDoesNotHaveAMaskChannel");
  (void) CopyMagickString(write_image->filename,image->filename,
    MagickPathExtent);
  write_info=CloneImageInfo(image_info);
  *write_info->magick='\0';
  (void) SetImageInfo(write_info,1,exception);
  if ((*write_info->magick == '\0') ||
      (LocaleCompare(write_info->magick,"MASK") == 0))
    (void) FormatLocaleString(write_image->filename,MagickPathExtent,"miff:%s",
      write_info->filename);
  status=WriteImage(write_info,write_image,exception);
  write_image=DestroyImage(write_image);
  write_info=DestroyImageInfo(write_info);
  return(status);
}
```

--------------------------------------------------------------------------------

---[FILE: mask.h]---
Location: ImageMagick-main/coders/mask.h

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

#define MagickMASKHeaders

#define MagickMASKAliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(MASK)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

````

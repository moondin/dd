---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 54
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 54 of 851)

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

---[FILE: jbig.c]---
Location: ImageMagick-main/coders/jbig.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                        JJJJJ  BBBB   IIIII   GGGG                           %
%                          J    B   B    I    G                               %
%                          J    BBBB     I    G  GG                           %
%                        J J    B   B    I    G   G                           %
%                        JJJ    BBBB   IIIII   GGG                            %
%                                                                             %
%                                                                             %
%                       Read/Write JBIG Image Format                          %
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
#include "MagickCore/color-private.h"
#include "MagickCore/colormap.h"
#include "MagickCore/colorspace.h"
#include "MagickCore/colorspace-private.h"
#include "MagickCore/constitute.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/geometry.h"
#include "MagickCore/image.h"
#include "MagickCore/image-private.h"
#include "MagickCore/list.h"
#include "MagickCore/magick.h"
#include "MagickCore/memory_.h"
#include "MagickCore/monitor.h"
#include "MagickCore/monitor-private.h"
#include "MagickCore/nt-base-private.h"
#include "MagickCore/pixel-accessor.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/static.h"
#include "MagickCore/string_.h"
#include "MagickCore/string-private.h"
#include "MagickCore/module.h"
#if defined(MAGICKCORE_JBIG_DELEGATE)
#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif
#include <jbig.h>
#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
#endif

/*
  Forward declarations.
*/
#if defined(MAGICKCORE_JBIG_DELEGATE)
static MagickBooleanType
  WriteJBIGImage(const ImageInfo *,Image *,ExceptionInfo *);
#endif

#if defined(MAGICKCORE_JBIG_DELEGATE)
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d J B I G I m a g e                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadJBIGImage() reads a JBIG image file and returns it.  It
%  allocates the memory necessary for the new Image structure and returns a
%  pointer to the new image.
%
%  The format of the ReadJBIGImage method is:
%
%      Image *ReadJBIGImage(const ImageInfo *image_info,
%        ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static Image *ReadJBIGImage(const ImageInfo *image_info,
  ExceptionInfo *exception)
{
  Image
    *image;

  MagickStatusType
    status;

  Quantum
    index,
    *q;

  ssize_t
    length,
    x,
    y;

  struct jbg_dec_state
    jbig_info;

  unsigned char
    bit,
    *buffer,
    byte,
    *p;

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
    Initialize JBIG toolkit.
  */
  if ((image->columns != (unsigned long) image->columns) ||
      (image->rows != (unsigned long) image->rows))
    ThrowReaderException(ImageError,"WidthOrHeightExceedsLimit");
  jbg_dec_init(&jbig_info);
  jbg_dec_maxsize(&jbig_info,(unsigned long) image->columns,(unsigned long)
    image->rows);
  image->columns=jbg_dec_getwidth(&jbig_info);
  image->rows=jbg_dec_getheight(&jbig_info);
  image->depth=8;
  image->storage_class=PseudoClass;
  image->colors=2;
  /*
    Read JBIG file.
  */
  buffer=(unsigned char *) AcquireQuantumMemory(MagickMaxBufferExtent,
    sizeof(*buffer));
  if (buffer == (unsigned char *) NULL)
    {
      jbg_dec_free(&jbig_info);
      ThrowReaderException(ResourceLimitError,"MemoryAllocationFailed");
    }
  status=JBG_EAGAIN;
  do
  {
    length=(ssize_t) ReadBlob(image,MagickMaxBufferExtent,buffer);
    if (length == 0)
      break;
    p=buffer;
    while ((length > 0) && ((status == JBG_EAGAIN) || (status == JBG_EOK)))
    {
      size_t
        count;

      status=(MagickStatusType) jbg_dec_in(&jbig_info,p,(size_t) length,&count);
      p+=(ptrdiff_t) count;
      length-=(ssize_t) count;
    }
  } while ((status == JBG_EAGAIN) || (status == JBG_EOK));
  /*
    Create colormap.
  */
  image->columns=jbg_dec_getwidth(&jbig_info);
  image->rows=jbg_dec_getheight(&jbig_info);
  image->compression=JBIG2Compression;
  if (AcquireImageColormap(image,2,exception) == MagickFalse)
    {
      jbg_dec_free(&jbig_info);
      buffer=(unsigned char *) RelinquishMagickMemory(buffer);
      ThrowReaderException(ResourceLimitError,"MemoryAllocationFailed");
    }
  image->colormap[0].red=0;
  image->colormap[0].green=0;
  image->colormap[0].blue=0;
  image->colormap[1].red=QuantumRange;
  image->colormap[1].green=QuantumRange;
  image->colormap[1].blue=QuantumRange;
  image->resolution.x=300;
  image->resolution.y=300;
  if (image_info->ping != MagickFalse)
    {
      jbg_dec_free(&jbig_info);
      buffer=(unsigned char *) RelinquishMagickMemory(buffer);
      (void) CloseBlob(image);
      return(GetFirstImageInList(image));
    }
  status=SetImageExtent(image,image->columns,image->rows,exception);
  if (status == MagickFalse)
    {
      jbg_dec_free(&jbig_info);
      buffer=(unsigned char *) RelinquishMagickMemory(buffer);
      return(DestroyImageList(image));
    }
  /*
    Convert X bitmap image to pixel packets.
  */
  p=jbg_dec_getimage(&jbig_info,0);
  for (y=0; y < (ssize_t) image->rows; y++)
  {
    q=QueueAuthenticPixels(image,0,y,image->columns,1,exception);
    if (q == (Quantum *) NULL)
      break;
    bit=0;
    byte=0;
    for (x=0; x < (ssize_t) image->columns; x++)
    {
      if (bit == 0)
        byte=(*p++);
      index=(Quantum) ((byte & 0x80) ? 0 : 1);
      bit++;
      byte<<=1;
      if (bit == 8)
        bit=0;
      SetPixelIndex(image,index,q);
      SetPixelViaPixelInfo(image,image->colormap+(ssize_t) index,q);
      q+=(ptrdiff_t) GetPixelChannels(image);
    }
    if (SyncAuthenticPixels(image,exception) == MagickFalse)
      break;
    status=SetImageProgress(image,LoadImageTag,(MagickOffsetType) y,
      image->rows);
    if (status == MagickFalse)
      break;
  }
  /*
    Free scale resource.
  */
  jbg_dec_free(&jbig_info);
  buffer=(unsigned char *) RelinquishMagickMemory(buffer);
  if (CloseBlob(image) == MagickFalse)
    status=MagickFalse;
  if (status == MagickFalse)
    return(DestroyImageList(image));
  return(GetFirstImageInList(image));
}
#endif

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r J B I G I m a g e                                         %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterJBIGImage() adds attributes for the JBIG image format to
%  the list of supported formats.  The attributes include the image format
%  tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterJBIGImage method is:
%
%      size_t RegisterJBIGImage(void)
%
*/
ModuleExport size_t RegisterJBIGImage(void)
{
#define JBIGDescription  "Joint Bi-level Image experts Group interchange format"

  char
    version[MagickPathExtent];

  MagickInfo
    *entry;

  *version='\0';
#if defined(JBG_VERSION)
  (void) CopyMagickString(version,JBG_VERSION,MagickPathExtent);
#endif
  entry=AcquireMagickInfo("JBIG","BIE",JBIGDescription);
#if defined(MAGICKCORE_JBIG_DELEGATE)
  entry->decoder=(DecodeImageHandler *) ReadJBIGImage;
  entry->encoder=(EncodeImageHandler *) WriteJBIGImage;
#endif
  entry->flags^=CoderAdjoinFlag;
  if (*version != '\0')
    entry->version=ConstantString(version);
  (void) RegisterMagickInfo(entry);
  entry=AcquireMagickInfo("JBIG","JBG",JBIGDescription);
#if defined(MAGICKCORE_JBIG_DELEGATE)
  entry->decoder=(DecodeImageHandler *) ReadJBIGImage;
  entry->encoder=(EncodeImageHandler *) WriteJBIGImage;
#endif
  if (*version != '\0')
    entry->version=ConstantString(version);
  (void) RegisterMagickInfo(entry);
  entry=AcquireMagickInfo("JBIG","JBIG",JBIGDescription);
#if defined(MAGICKCORE_JBIG_DELEGATE)
  entry->decoder=(DecodeImageHandler *) ReadJBIGImage;
  entry->encoder=(EncodeImageHandler *) WriteJBIGImage;
#endif
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
%   U n r e g i s t e r J B I G I m a g e                                     %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterJBIGImage() removes format registrations made by the
%  JBIG module from the list of supported formats.
%
%  The format of the UnregisterJBIGImage method is:
%
%      UnregisterJBIGImage(void)
%
*/
ModuleExport void UnregisterJBIGImage(void)
{
  (void) UnregisterMagickInfo("BIE");
  (void) UnregisterMagickInfo("JBG");
  (void) UnregisterMagickInfo("JBIG");
}

#if defined(MAGICKCORE_JBIG_DELEGATE)
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e J B I G I m a g e                                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  WriteJBIGImage() writes an image in the JBIG encoded image format.
%
%  The format of the WriteJBIGImage method is:
%
%      MagickBooleanType WriteJBIGImage(const ImageInfo *image_info,
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

static void JBIGEncode(unsigned char *pixels,size_t length,void *data)
{
  Image
    *image;

  image=(Image *) data;
  (void) WriteBlob(image,length,pixels);
}

static MagickBooleanType WriteJBIGImage(const ImageInfo *image_info,
  Image *image,ExceptionInfo *exception)
{
  const Quantum
    *p;

  double
    version;

  MagickBooleanType
    status;

  MagickOffsetType
    scene;

  MemoryInfo
    *pixel_info;

  size_t
    number_images,
    number_packets;

  ssize_t
    x,
    y;

  struct jbg_enc_state
    jbig_info;

  unsigned char
    bit,
    byte,
    *pixels,
    *q;

  /*
    Open image file.
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
  version=StringToDouble(JBG_VERSION,(char **) NULL);
  scene=0;
  number_images=GetImageListLength(image);
  do
  {
    /*
      Allocate pixel data.
    */
    if (IssRGBCompatibleColorspace(image->colorspace) == MagickFalse)
      (void) TransformImageColorspace(image,sRGBColorspace,exception);
    number_packets=(image->columns+7)/8;
    pixel_info=AcquireVirtualMemory(number_packets,image->rows*sizeof(*pixels));
    if (pixel_info == (MemoryInfo *) NULL)
      ThrowWriterException(ResourceLimitError,"MemoryAllocationFailed");
    pixels=(unsigned char *) GetVirtualMemoryBlob(pixel_info);
    /*
      Convert pixels to a bitmap.
    */
    (void) SetImageType(image,BilevelType,exception);
    q=pixels;
    for (y=0; y < (ssize_t) image->rows; y++)
    {
      p=GetVirtualPixels(image,0,y,image->columns,1,exception);
      if (p == (const Quantum *) NULL)
        break;
      bit=0;
      byte=0;
      for (x=0; x < (ssize_t) image->columns; x++)
      {
        byte<<=1;
        if (GetPixelLuma(image,p) < ((double) QuantumRange/2.0))
          byte|=0x01;
        bit++;
        if (bit == 8)
          {
            *q++=byte;
            bit=0;
            byte=0;
          }
        p+=(ptrdiff_t) GetPixelChannels(image);
      }
      if (bit != 0)
        *q++=byte << (8-bit);
      if (image->previous == (Image *) NULL)
        {
          status=SetImageProgress(image,SaveImageTag,(MagickOffsetType) y,
            image->rows);
          if (status == MagickFalse)
            break;
        }
    }
    /*
      Initialize JBIG info structure.
    */
    jbg_enc_init(&jbig_info,(unsigned long) image->columns,(unsigned long)
      image->rows,1,&pixels,(void (*)(unsigned char *,size_t,void *))
      JBIGEncode,image);
    if (image_info->scene != 0)
      jbg_enc_layers(&jbig_info,(int) image_info->scene);
    else
      {
        size_t
          x_resolution,
          y_resolution;

        x_resolution=640;
        y_resolution=480;
        if (image_info->density != (char *) NULL)
          {
            GeometryInfo
              geometry_info;

            MagickStatusType
              flags;

            flags=ParseGeometry(image_info->density,&geometry_info);
            x_resolution=(size_t) geometry_info.rho;
            y_resolution=(size_t) geometry_info.sigma;
            if ((flags & SigmaValue) == 0)
              y_resolution=x_resolution;
          }
        if (image->units == PixelsPerCentimeterResolution)
          {
            x_resolution=(size_t) ((100.0*2.54*x_resolution+0.5)/100.0);
            y_resolution=(size_t) ((100.0*2.54*y_resolution+0.5)/100.0);
          }
        (void) jbg_enc_lrlmax(&jbig_info,(unsigned long) x_resolution,
          (unsigned long) y_resolution);
      }
    (void) jbg_enc_lrange(&jbig_info,-1,-1);
    jbg_enc_options(&jbig_info,JBG_ILEAVE | JBG_SMID,JBG_TPDON | JBG_TPBON |
      JBG_DPON,version < 1.6 ? ~0UL : 0UL,-1,-1);
    /*
      Write JBIG image.
    */
    jbg_enc_out(&jbig_info);
    jbg_enc_free(&jbig_info);
    pixel_info=RelinquishVirtualMemory(pixel_info);
    if (GetNextImageInList(image) == (Image *) NULL)
      break;
    image=SyncNextImageInList(image);
    status=SetImageProgress(image,SaveImagesTag,scene++,number_images);
    if (status == MagickFalse)
      break;
  } while (image_info->adjoin != MagickFalse);
  if (CloseBlob(image) == MagickFalse)
    status=MagickFalse;
  return(status);
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: jbig.h]---
Location: ImageMagick-main/coders/jbig.h

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

#define MagickJBIGHeaders

#define MagickJBIGAliases \
  MagickCoderAlias("JBIG", "BIE") \
  MagickCoderAlias("JBIG", "JBG")

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(JBIG)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: jnx.c]---
Location: ImageMagick-main/coders/jnx.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                              JJJ  N   N  X   X                              %
%                               J   NN  N   X X                               %
%                               J   N N N    X                                %
%                            J  J   N  NN   X X                               %
%                             JJ    N   N  X   X                              %
%                                                                             %
%                                                                             %
%                       Read/Write Garmin Image Format                        %
%                                                                             %
%                                   Cristy                                    %
%                                 July 2012                                   %
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
#include "MagickCore/draw.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/image.h"
#include "MagickCore/image-private.h"
#include "MagickCore/list.h"
#include "MagickCore/magick.h"
#include "MagickCore/memory_.h"
#include "MagickCore/module.h"
#include "MagickCore/monitor.h"
#include "MagickCore/monitor-private.h"
#include "MagickCore/property.h"
#include "MagickCore/pixel-accessor.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/resource_.h"
#include "MagickCore/static.h"
#include "MagickCore/string_.h"

typedef struct _JNXInfo
{
  int
    version,
    serial;

  PointInfo
    northeast,
    southwest;

  int
    levels,
    expire,
    id,
    crc,
    signature;

  unsigned int
    offset;

  int
    order;
} JNXInfo;

typedef struct _JNXLevelInfo
{
  int
    count,
    offset;
} JNXLevelInfo;

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d J N X I m a g e                                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadJNXImage() reads an image in the Garmin tile storage format and returns
%  it.  It allocates the memory necessary for the new Image structure and
%  returns a pointer to the new image.
%
%  The format of the ReadJNXImage method is:
%
%      Image *ReadJNXImage(const ImageInfo *image_info,ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static Image *ReadJNXImage(const ImageInfo *image_info,ExceptionInfo *exception)
{
#define JNXMaxLevels  20

  Image
    *image,
    *images;

  JNXInfo
    jnx_info;

  JNXLevelInfo
    jnx_level_info[JNXMaxLevels];

  MagickBooleanType
    status;

  MagickSizeType
    num_images;

  ssize_t
    i;

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
  image->columns=0;
  image->rows=0;
  status=OpenBlob(image_info,image,ReadBinaryBlobMode,exception);
  if (status == MagickFalse)
    {
      image=DestroyImageList(image);
      return((Image *) NULL);
    }
  /*
    Read JNX header.
  */
  (void) memset(&jnx_info,0,sizeof(jnx_info));
  jnx_info.version=ReadBlobLSBSignedLong(image);
  if ((jnx_info.version != 3) && (jnx_info.version != 4))
    ThrowReaderException(CorruptImageError,"ImproperImageHeader");
  jnx_info.serial=ReadBlobLSBSignedLong(image);
  jnx_info.northeast.x=180.0*ReadBlobLSBSignedLong(image)/0x7fffffff;
  jnx_info.northeast.y=180.0*ReadBlobLSBSignedLong(image)/0x7fffffff;
  jnx_info.southwest.x=180.0*ReadBlobLSBSignedLong(image)/0x7fffffff;
  jnx_info.southwest.y=180.0*ReadBlobLSBSignedLong(image)/0x7fffffff;
  jnx_info.levels=ReadBlobLSBSignedLong(image);
  if (jnx_info.levels > JNXMaxLevels)
    ThrowReaderException(CorruptImageError,"ImproperImageHeader");
  jnx_info.expire=ReadBlobLSBSignedLong(image);
  jnx_info.id=ReadBlobLSBSignedLong(image);
  jnx_info.crc=ReadBlobLSBSignedLong(image);
  jnx_info.signature=ReadBlobLSBSignedLong(image);
  jnx_info.offset=ReadBlobLSBLong(image);
  if (jnx_info.version > 3)
    jnx_info.order=ReadBlobLSBSignedLong(image);
  else
    if (jnx_info.version == 3)
      jnx_info.order=30;
  if (EOFBlob(image) != MagickFalse)
    ThrowReaderException(CorruptImageError,"ImproperImageHeader");
  /*
    Read JNX levels.
  */
  num_images=0;
  (void) memset(&jnx_level_info,0,sizeof(jnx_level_info));
  for (i=0; i < (ssize_t) jnx_info.levels; i++)
  {
    jnx_level_info[i].count=ReadBlobLSBSignedLong(image);
    if (jnx_level_info[i].count > 50000)
      ThrowReaderException(CorruptImageError,"ImproperImageHeader");
    jnx_level_info[i].offset=ReadBlobLSBSignedLong(image);
    /* scale */
    (void) ReadBlobLSBLong(image);
    if (jnx_info.version > 3)
      {
        /* copyright */
        (void) ReadBlobLSBLong(image);
        while (ReadBlobLSBShort(image) != 0);
      }
    if (EOFBlob(image) != MagickFalse)
      ThrowReaderException(CorruptImageError,"UnexpectedEndOfFile");
    num_images+=(MagickSizeType) jnx_level_info[i].count;
  }
  if (AcquireMagickResource(ListLengthResource,num_images) == MagickFalse)
    ThrowReaderException(ResourceLimitError,"ListLengthExceedsLimit");
  /*
    Read JNX tiles.
  */
  images=NewImageList();
  for (i=0; i < (ssize_t) jnx_info.levels; i++)
  {
    MagickOffsetType
      offset;

    ssize_t
      j;

    offset=SeekBlob(image,(MagickOffsetType) jnx_level_info[i].offset,SEEK_SET);
    if (offset != (MagickOffsetType) jnx_level_info[i].offset)
      continue;
    for (j=0; j < (ssize_t) jnx_level_info[i].count; j++)
    {
      Image
        *tile_image;

      ImageInfo
        *read_info;

      int
        tile_offset;

      MagickOffsetType
        restore_offset;

      PointInfo
        northeast,
        southwest;

      ssize_t
        count;

      unsigned char
        *blob;

      unsigned int
        tile_length;

      northeast.x=180.0*ReadBlobLSBSignedLong(image)/0x7fffffff;
      northeast.y=180.0*ReadBlobLSBSignedLong(image)/0x7fffffff;
      southwest.x=180.0*ReadBlobLSBSignedLong(image)/0x7fffffff;
      southwest.y=180.0*ReadBlobLSBSignedLong(image)/0x7fffffff;
      (void) ReadBlobLSBShort(image); /* width */
      (void) ReadBlobLSBShort(image); /* height */
      if (EOFBlob(image) != MagickFalse)
        {
          images=DestroyImageList(images);
          ThrowReaderException(CorruptImageError,"UnexpectedEndOfFile");
        }
      tile_length=ReadBlobLSBLong(image);
      tile_offset=ReadBlobLSBSignedLong(image);
      if (tile_offset == -1)
        continue;
      restore_offset=TellBlob(image);
      if (restore_offset < 0)
        continue;
      offset=SeekBlob(image,(MagickOffsetType) tile_offset,SEEK_SET);
      if (offset != (MagickOffsetType) tile_offset)
        continue;
      /*
        Read a tile.
      */
      if (((MagickSizeType) tile_length) > GetBlobSize(image))
        {
          images=DestroyImageList(images);
          ThrowReaderException(CorruptImageError,"InsufficientImageDataInFile");
        }
      blob=(unsigned char *) AcquireQuantumMemory((size_t) tile_length+2,
        sizeof(*blob));
      if (blob == (unsigned char *) NULL)
        {
          images=DestroyImageList(images);
          ThrowReaderException(ResourceLimitError,"MemoryAllocationFailed");
        }
      blob[0]=0xFF;
      blob[1]=0xD8;
      count=ReadBlob(image,tile_length,blob+2);
      if (count != (ssize_t) tile_length)
        {
          images=DestroyImageList(images);
          blob=(unsigned char *) RelinquishMagickMemory(blob);
          ThrowReaderException(CorruptImageError,"UnexpectedEndOfFile");
        }
      read_info=CloneImageInfo(image_info);
      (void) CopyMagickString(read_info->magick,"JPEG",MagickPathExtent);
      tile_image=BlobToImage(read_info,blob,tile_length+2,exception);
      read_info=DestroyImageInfo(read_info);
      blob=(unsigned char *) RelinquishMagickMemory(blob);
      offset=SeekBlob(image,restore_offset,SEEK_SET);
      if (tile_image == (Image *) NULL)
        continue;
      tile_image->depth=8;
      (void) CopyMagickString(tile_image->magick,image->magick,
        MagickPathExtent);
      (void) FormatImageProperty(tile_image,"jnx:northeast","%.20g,%.20g",
        northeast.x,northeast.y);
      (void) FormatImageProperty(tile_image,"jnx:southwest","%.20g,%.20g",
        southwest.x,southwest.y);
      AppendImageToList(&images,tile_image);
    }
    if (image->progress_monitor != (MagickProgressMonitor) NULL)
      {
        MagickBooleanType
          proceed;

        proceed=SetImageProgress(image,LoadImageTag,(MagickOffsetType) i,
          (MagickSizeType) jnx_info.levels);
        if (proceed == MagickFalse)
          status=MagickFalse;
      }
  }
  (void) CloseBlob(image);
  image=DestroyImage(image);
  return(GetFirstImageInList(images));
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r J N X I m a g e                                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterJNXImage() adds attributes for the JNX image format to the list
%  of supported formats.  The attributes include the image format tag, a
%  method to read and/or write the format, whether the format supports the
%  saving of more than one frame to the same file or blob, whether the format
%  supports native in-memory I/O, and a brief description of the format.
%
%  The format of the RegisterJNXImage method is:
%
%      size_t RegisterJNXImage(void)
%
*/
ModuleExport size_t RegisterJNXImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("JNX","JNX","Garmin tile format");
  entry->decoder=(DecodeImageHandler *) ReadJNXImage;
  entry->flags|=CoderDecoderSeekableStreamFlag;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r J N X I m a g e                                       %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterJNXImage() removes format registrations made by the
%  JNX module from the list of supported formats.
%
%  The format of the UnregisterJNXImage method is:
%
%      UnregisterJNXImage(void)
%
*/
ModuleExport void UnregisterJNXImage(void)
{
  (void) UnregisterMagickInfo("JNX");
}
```

--------------------------------------------------------------------------------

---[FILE: jnx.h]---
Location: ImageMagick-main/coders/jnx.h

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

#define MagickJNXHeaders

#define MagickJNXAliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(JNX)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

````

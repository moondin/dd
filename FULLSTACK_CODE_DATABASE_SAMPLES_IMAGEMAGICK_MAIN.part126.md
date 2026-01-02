---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 126
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 126 of 851)

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

---[FILE: uyvy.c]---
Location: ImageMagick-main/coders/uyvy.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                        U   U  Y   Y  V   V  Y   Y                           %
%                        U   U   Y Y   V   V   Y Y                            %
%                        U   U    Y    V   V    Y                             %
%                        U   U    Y     V V     Y                             %
%                         UUU     Y      V      Y                             %
%                                                                             %
%                                                                             %
%            Read/Write 16bit/pixel Interleaved YUV Image Format              %
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
#include "MagickCore/color.h"
#include "MagickCore/colorspace.h"
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
  WriteUYVYImage(const ImageInfo *,Image *,ExceptionInfo *);

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d U Y V Y I m a g e                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadUYVYImage() reads an image in the UYVY format and returns it.  It
%  allocates the memory necessary for the new Image structure and returns a
%  pointer to the new image.
%
%  The format of the ReadUYVYImage method is:
%
%      Image *ReadUYVYImage(const ImageInfo *image_info,
%        ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static Image *ReadUYVYImage(const ImageInfo *image_info,
  ExceptionInfo *exception)
{
  Image
    *image;

  MagickBooleanType
    status;

  ssize_t
    x;

  Quantum
    *q;

  ssize_t
    y;

  unsigned char
    u,
    v,
    y1,
    y2;

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
  if ((image->columns % 2) != 0)
    image->columns++;
  (void) CopyMagickString(image->filename,image_info->filename,
    MagickPathExtent);
  status=OpenBlob(image_info,image,ReadBinaryBlobMode,exception);
  if (status == MagickFalse)
    return(DestroyImage(image));
  if (DiscardBlobBytes(image,(MagickSizeType) image->offset) == MagickFalse)
    ThrowFileException(exception,CorruptImageError,"UnexpectedEndOfFile",
      image->filename);
  image->depth=8;
  if (image_info->ping != MagickFalse)
    {
      (void) CloseBlob(image);
      return(GetFirstImageInList(image));
    }
  status=SetImageExtent(image,image->columns,image->rows,exception);
  if (status == MagickFalse)
    return(DestroyImageList(image));
  /*
    Accumulate UYVY, then unpack into two pixels.
  */
  for (y=0; y < (ssize_t) image->rows; y++)
  {
    q=QueueAuthenticPixels(image,0,y,image->columns,1,exception);
    if (q == (Quantum *) NULL)
      break;
    for (x=0; x < (ssize_t) (image->columns >> 1); x++)
    {
      u=(unsigned char) ReadBlobByte(image);
      y1=(unsigned char) ReadBlobByte(image);
      v=(unsigned char) ReadBlobByte(image);
      y2=(unsigned char) ReadBlobByte(image);
      SetPixelRed(image,ScaleCharToQuantum(y1),q);
      SetPixelGreen(image,ScaleCharToQuantum(u),q);
      SetPixelBlue(image,ScaleCharToQuantum(v),q);
      q+=(ptrdiff_t) GetPixelChannels(image);
      SetPixelRed(image,ScaleCharToQuantum(y2),q);
      SetPixelGreen(image,ScaleCharToQuantum(u),q);
      SetPixelBlue(image,ScaleCharToQuantum(v),q);
      q+=(ptrdiff_t) GetPixelChannels(image);
    }
    if (SyncAuthenticPixels(image,exception) == MagickFalse)
      break;
    status=SetImageProgress(image,LoadImageTag,(MagickOffsetType) y,
      image->rows);
    if (status == MagickFalse)
      break;
  }
  SetImageColorspace(image,YCbCrColorspace,exception);
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
%   R e g i s t e r U Y V Y I m a g e                                         %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterUYVYImage() adds attributes for the UYVY image format to
%  the list of supported formats.  The attributes include the image format
%  tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterUYVYImage method is:
%
%      size_t RegisterUYVYImage(void)
%
*/
ModuleExport size_t RegisterUYVYImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("UYVY","PAL","16bit/pixel interleaved YUV");
  entry->decoder=(DecodeImageHandler *) ReadUYVYImage;
  entry->encoder=(EncodeImageHandler *) WriteUYVYImage;
  entry->flags^=CoderAdjoinFlag;
  entry->flags|=CoderRawSupportFlag;
  entry->flags|=CoderEndianSupportFlag;
  (void) RegisterMagickInfo(entry);
  entry=AcquireMagickInfo("UYVY","UYVY","16bit/pixel interleaved YUV");
  entry->decoder=(DecodeImageHandler *) ReadUYVYImage;
  entry->encoder=(EncodeImageHandler *) WriteUYVYImage;
  entry->flags^=CoderAdjoinFlag;
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
%   U n r e g i s t e r U Y V Y I m a g e                                     %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterUYVYImage() removes format registrations made by the
%  UYVY module from the list of supported formats.
%
%  The format of the UnregisterUYVYImage method is:
%
%      UnregisterUYVYImage(void)
%
*/
ModuleExport void UnregisterUYVYImage(void)
{
  (void) UnregisterMagickInfo("PAL");
  (void) UnregisterMagickInfo("UYVY");
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e U Y V Y I m a g e                                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  WriteUYVYImage() writes an image to a file in the digital UYVY
%  format.  This format, used by AccomWSD, is not dramatically higher quality
%  than the 12bit/pixel YUV format, but has better locality.
%
%  The format of the WriteUYVYImage method is:
%
%      MagickBooleanType WriteUYVYImage(const ImageInfo *image_info,
%        Image *image,ExceptionInfo *exception)
%
%  A description of each parameter follows.
%
%    o image_info: the image info.
%
%    o image:  The image.  Implicit assumption: number of columns is even.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static MagickBooleanType WriteUYVYImage(const ImageInfo *image_info,
  Image *image,ExceptionInfo *exception)
{
  PixelInfo
    pixel;

  Image
    *uyvy_image;

  MagickBooleanType
    full,
    status;

  const Quantum
    *p;

  ssize_t
    x;

  ssize_t
    y;

  /*
    Open output image file.
  */
  assert(image_info != (const ImageInfo *) NULL);
  assert(image_info->signature == MagickCoreSignature);
  assert(image != (Image *) NULL);
  assert(image->signature == MagickCoreSignature);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",image->filename);
  if ((image->columns % 2) != 0)
    image->columns++;
  assert(exception != (ExceptionInfo *) NULL);
  assert(exception->signature == MagickCoreSignature);
  status=OpenBlob(image_info,image,WriteBinaryBlobMode,exception);
  if (status == MagickFalse)
    return(status);
  /*
    Accumulate two pixels, then output.
  */
  uyvy_image=CloneImage(image,0,0,MagickTrue,exception);
  if (uyvy_image == (Image *) NULL)
    return(MagickFalse);
  (void) TransformImageColorspace(uyvy_image,YCbCrColorspace,exception);
  full=MagickFalse;
  (void) memset(&pixel,0,sizeof(PixelInfo));
  for (y=0; y < (ssize_t) image->rows; y++)
  {
    p=GetVirtualPixels(uyvy_image,0,y,image->columns,1,exception);
    if (p == (const Quantum *) NULL)
      break;
    for (x=0; x < (ssize_t) image->columns; x++)
    {
      if (full != MagickFalse)
        {
          pixel.green=(pixel.green+(double) GetPixelGreen(uyvy_image,p))/2;
          pixel.blue=(pixel.blue+(double) GetPixelBlue(uyvy_image,p))/2;
          (void) WriteBlobByte(image,ScaleQuantumToChar((Quantum) pixel.green));
          (void) WriteBlobByte(image,ScaleQuantumToChar((Quantum) pixel.red));
          (void) WriteBlobByte(image,ScaleQuantumToChar((Quantum) pixel.blue));
          (void) WriteBlobByte(image,ScaleQuantumToChar(
            GetPixelRed(uyvy_image,p)));
        }
      pixel.red=(double) GetPixelRed(uyvy_image,p);
      pixel.green=(double) GetPixelGreen(uyvy_image,p);
      pixel.blue=(double) GetPixelBlue(uyvy_image,p);
      full=full == MagickFalse ? MagickTrue : MagickFalse;
      p+=(ptrdiff_t) GetPixelChannels(uyvy_image);
    }
    status=SetImageProgress(image,LoadImageTag,(MagickOffsetType) y,
      image->rows);
    if (status == MagickFalse)
      break;
  }
  uyvy_image=DestroyImage(uyvy_image);
  if (CloseBlob(image) == MagickFalse)
    status=MagickFalse;
  return(status);
}
```

--------------------------------------------------------------------------------

---[FILE: uyvy.h]---
Location: ImageMagick-main/coders/uyvy.h

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

#define MagickUYVYHeaders

#define MagickUYVYAliases \
  MagickCoderAlias("UYVY", "PAL")

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(UYVY)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: vicar.c]---
Location: ImageMagick-main/coders/vicar.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                     V   V  IIIII   CCCC   AAA   RRRR                        %
%                     V   V    I    C      A   A  R   R                       %
%                     V   V    I    C      AAAAA  RRRR                        %
%                      V V     I    C      A   A  R R                         %
%                       V    IIIII   CCCC  A   A  R  R                        %
%                                                                             %
%                                                                             %
%                    Read/Write VICAR Rasterfile Format                       %
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
#include "MagickCore/colormap.h"
#include "MagickCore/colorspace.h"
#include "MagickCore/colorspace-private.h"
#include "MagickCore/constitute.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/image.h"
#include "MagickCore/image-private.h"
#include "MagickCore/list.h"
#include "MagickCore/locale_.h"
#include "MagickCore/magick.h"
#include "MagickCore/memory_.h"
#include "MagickCore/module.h"
#include "MagickCore/monitor.h"
#include "MagickCore/monitor-private.h"
#include "MagickCore/property.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/static.h"
#include "MagickCore/string_.h"
#include "MagickCore/string-private.h"

/*
  Forward declarations.
*/
static MagickBooleanType
  WriteVICARImage(const ImageInfo *,Image *,ExceptionInfo *);

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   I s V I C A R                                                             %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  IsVICAR() returns MagickTrue if the image format type, identified by the
%  magick string, is VICAR.
%
%  The format of the IsVICAR method is:
%
%      MagickBooleanType IsVICAR(const unsigned char *magick,
%        const size_t length)
%
%  A description of each parameter follows:
%
%    o magick: compare image format pattern against these bytes.
%
%    o length: Specifies the length of the magick string.
%
*/
static MagickBooleanType IsVICAR(const unsigned char *magick,
  const size_t length)
{
  if (length < 14)
    return(MagickFalse);
  if (LocaleNCompare((const char *) magick,"LBLSIZE",7) == 0)
    return(MagickTrue);
  if (LocaleNCompare((const char *) magick,"NJPL1I",6) == 0)
    return(MagickTrue);
  if (LocaleNCompare((const char *) magick,"PDS_VERSION_ID",14) == 0)
    return(MagickTrue);
  return(MagickFalse);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d V I C A R I m a g e                                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadVICARImage() reads a VICAR image file and returns it.  It
%  allocates the memory necessary for the new Image structure and returns a
%  pointer to the new image.
%
%  The format of the ReadVICARImage method is:
%
%      Image *ReadVICARImage(const ImageInfo *image_info,
%        ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image: Method ReadVICARImage returns a pointer to the image after
%      reading.  A null image is returned if there is a memory shortage or if
%      the image cannot be read.
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
%
*/
static Image *ReadVICARImage(const ImageInfo *image_info,
  ExceptionInfo *exception)
{
  char
    format[MagickPathExtent] = "byte",
    keyword[MagickPathExtent],
    value[MagickPathExtent];

  Image
    *image;

  int
    c;

  MagickBooleanType
    status,
    value_expected;

  QuantumInfo
    *quantum_info;

  QuantumType
    quantum_type;

  Quantum
    *q;

  size_t
    length;

  ssize_t
    count,
    y;

  unsigned char
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
    Decode image header.
  */
  c=ReadBlobByte(image);
  count=1;
  if (c == EOF)
    {
      image=DestroyImage(image);
      return((Image *) NULL);
    }
  length=0;
  image->columns=0;
  image->rows=0;
  while ((isgraph((int) ((unsigned char) c)) != 0) &&
         ((image->columns == 0) || (image->rows == 0)))
  {
    if (isalnum((int) ((unsigned char) c)) == 0)
      {
        c=ReadBlobByte(image);
        count++;
      }
    else
      {
        MagickOffsetType
          offset;

        char
          *p,
          property[MagickPathExtent];

        /*
          Determine a keyword and its value.
        */
        offset=TellBlob(image)-1;
        p=keyword;
        do
        {
          if ((size_t) (p-keyword) < (MagickPathExtent-1))
            *p++=(char) c;
          c=ReadBlobByte(image);
          if (c == EOF)
            break;
          count++;
        } while (isalnum((int) ((unsigned char) c)) || (c == '_'));
        *p='\0';
        value_expected=MagickFalse;
        while ((isspace((int) ((unsigned char) c)) != 0) || (c == '='))
        {
          if (c == '=')
            value_expected=MagickTrue;
          c=ReadBlobByte(image);
          if (c == EOF)
            break;
          count++;
        }
        if (value_expected == MagickFalse)
          continue;
        p=value;
        switch (c)
        {
          case '\'':
          {
            c=ReadBlobByte(image);
            count++;
            while (c != '\'')
            {
              if ((size_t) (p-value) < (MagickPathExtent-1))
                *p++=(char) c;
              c=ReadBlobByte(image);
              if (c == EOF)
                break;
              count++;
            }
            break;
          }
          case '"':
          {
            c=ReadBlobByte(image);
            count++;
            while (c != '"')
            {
              if ((size_t) (p-value) < (MagickPathExtent-1))
                *p++=(char) c;
              c=ReadBlobByte(image);
              if (c == EOF)
                break;
              count++;
            }
            break;
          }
          case '(':
          {
            c=ReadBlobByte(image);
            count++;
            while (c != ')')
            {
              if ((size_t) (p-value) < (MagickPathExtent-1))
                *p++=(char) c;
              c=ReadBlobByte(image);
              if (c == EOF)
                break;
              count++;
            }
            break;
          }
          default:
          {
            while (isalnum((int) ((unsigned char) c)))
            {
              if ((size_t) (p-value) < (MagickPathExtent-1))
                *p++=(char) c;
              c=ReadBlobByte(image);
              if (c == EOF)
                break;
              count++;
            }
            break;
          }
        }
        *p='\0';
        /*
          Assign a value to the specified keyword.
        */
        (void) FormatLocaleString(property,MagickPathExtent,"vicar:%s",keyword);
        LocaleLower(property);
        (void) SetImageProperty(image,property,value,exception);
        if (LocaleCompare(keyword,"END") == 0)
          break;
        if (LocaleCompare(keyword,"FORMAT") == 0)
          (void) CopyMagickString(format,value,MagickPathExtent);
        if (LocaleCompare(keyword,"LABEL_RECORDS") == 0)
          length*=(size_t) StringToLong(value);
        if (LocaleCompare(keyword,"LBLSIZE") == 0)
          length=(size_t) (StringToLong(value)+offset);
        if (LocaleCompare(keyword,"LINES") == 0)
          image->rows=StringToUnsignedLong(value);
        if (LocaleCompare(keyword,"NL") == 0)
          image->rows=StringToUnsignedLong(value);
        if (LocaleCompare(keyword,"NS") == 0)
          image->columns=StringToUnsignedLong(value);
      }
    if (c == EOF)
      break;
    while (isspace((int) ((unsigned char) c)) != 0)
    {
      c=ReadBlobByte(image);
      if (c == EOF)
        break;
      count++;
    }
  }
  while (count < (ssize_t) length)
  {
    c=ReadBlobByte(image);
    if (c == EOF)
      break;
    count++;
  }
  if ((image->columns == 0) || (image->rows == 0))
    ThrowReaderException(CorruptImageError,"NegativeOrZeroImageSize");
  image->depth=8;
  if (LocaleCompare(format,"byte") == 0)
    ;
  else
    if (LocaleCompare(format,"half") == 0)
      image->depth=16;
    else
      if ((LocaleCompare(format,"full") == 0) ||
          (LocaleCompare(format,"real") == 0))
        image->depth=32;
      else
        image->depth=64;
  if (image_info->ping != MagickFalse)
    {
      (void) CloseBlob(image);
      return(GetFirstImageInList(image));
    }
  status=SetImageExtent(image,image->columns,image->rows,exception);
  if (status == MagickFalse)
    return(DestroyImageList(image));
  /*
    Read VICAR pixels.
  */
  (void) SetImageColorspace(image,GRAYColorspace,exception);
  quantum_type=GrayQuantum;
  quantum_info=AcquireQuantumInfo(image_info,image);
  if (quantum_info == (QuantumInfo *) NULL)
    ThrowReaderException(ResourceLimitError,"MemoryAllocationFailed");
  length=GetQuantumExtent(image,quantum_info,quantum_type);
  pixels=GetQuantumPixels(quantum_info);
  if (LocaleCompare(format,"byte") == 0)
    ;  
  else
    if (LocaleCompare(format,"half") == 0)
      SetQuantumFormat(image,quantum_info,SignedQuantumFormat);
    else
      SetQuantumFormat(image,quantum_info,FloatingPointQuantumFormat);
  for (y=0; y < (ssize_t) image->rows; y++)
  {
    const void
      *stream;

    q=QueueAuthenticPixels(image,0,y,image->columns,1,exception);
    if (q == (Quantum *) NULL)
      break;
    stream=ReadBlobStream(image,length,pixels,&count);
    if (count != (ssize_t) length)
      break;
    (void) ImportQuantumPixels(image,(CacheView *) NULL,quantum_info,
      quantum_type,(unsigned char *) stream,exception);
    if (SyncAuthenticPixels(image,exception) == MagickFalse)
      break;
    status=SetImageProgress(image,LoadImageTag,(MagickOffsetType) y,
      image->rows);
    if (status == MagickFalse)
      break;
  }
  SetQuantumImageType(image,quantum_type);
  quantum_info=DestroyQuantumInfo(quantum_info);
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
%   R e g i s t e r V I C A R I m a g e                                       %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterVICARImage() adds attributes for the VICAR image format to
%  the list of supported formats.  The attributes include the image format
%  tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterVICARImage method is:
%
%      size_t RegisterVICARImage(void)
%
*/
ModuleExport size_t RegisterVICARImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("VICAR","VICAR",
    "Video Image Communication And Retrieval");
  entry->decoder=(DecodeImageHandler *) ReadVICARImage;
  entry->encoder=(EncodeImageHandler *) WriteVICARImage;
  entry->magick=(IsImageFormatHandler *) IsVICAR;
  entry->flags^=CoderAdjoinFlag;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r V I C A R I m a g e                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterVICARImage() removes format registrations made by the
%  VICAR module from the list of supported formats.
%
%  The format of the UnregisterVICARImage method is:
%
%      UnregisterVICARImage(void)
%
*/
ModuleExport void UnregisterVICARImage(void)
{
  (void) UnregisterMagickInfo("VICAR");
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e V I C A R I m a g e                                             %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  WriteVICARImage() writes an image in the VICAR rasterfile format.
%  Vicar files contain a text header, followed by one or more planes of binary
%  grayscale image data.  Vicar files are designed to allow many planes to be
%  stacked together to form image cubes.  This method only writes a single
%  grayscale plane.
%
%  WriteVICARImage was written contributed by gorelick@esther.la.asu.edu.
%
%  The format of the WriteVICARImage method is:
%
%      MagickBooleanType WriteVICARImage(const ImageInfo *image_info,
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
static MagickBooleanType WriteVICARImage(const ImageInfo *image_info,
  Image *image,ExceptionInfo *exception)
{
  char
    header[MagickPathExtent];

  int
    y;

  MagickBooleanType
    status;

  QuantumInfo
    *quantum_info;

  const Quantum
    *p;

  size_t
    length;

  ssize_t
    count;

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
  /*
    Write header.
  */
  (void) memset(header,' ',MagickPathExtent);
  (void) FormatLocaleString(header,MagickPathExtent,
    "LBLSIZE=%.20g FORMAT='BYTE' TYPE='IMAGE' BUFSIZE=20000 DIM=2 EOL=0 "
    "RECSIZE=%.20g ORG='BSQ' NL=%.20g NS=%.20g NB=1 N1=0 N2=0 N3=0 N4=0 NBB=0 "
    "NLB=0 TASK='ImageMagick'",(double) MagickPathExtent,(double)
    image->columns,(double) image->rows,(double) image->columns);
  (void) WriteBlob(image,MagickPathExtent,(unsigned char *) header);
  /*
    Write VICAR pixels.
  */
  image->depth=8;
  quantum_info=AcquireQuantumInfo(image_info,image);
  if (quantum_info == (QuantumInfo *) NULL)
    ThrowWriterException(ResourceLimitError,"MemoryAllocationFailed");
  pixels=(unsigned char *) GetQuantumPixels(quantum_info);
  for (y=0; y < (ssize_t) image->rows; y++)
  {
    p=GetVirtualPixels(image,0,y,image->columns,1,exception);
    if (p == (const Quantum *) NULL)
      break;
    length=ExportQuantumPixels(image,(CacheView *) NULL,quantum_info,
      GrayQuantum,pixels,exception);
    count=WriteBlob(image,length,pixels);
    if (count != (ssize_t) length)
      break;
    status=SetImageProgress(image,SaveImageTag,(MagickOffsetType) y,
      image->rows);
    if (status == MagickFalse)
      break;
  }
  quantum_info=DestroyQuantumInfo(quantum_info);
  if (CloseBlob(image) == MagickFalse)
    status=MagickFalse;
  return(status);
}
```

--------------------------------------------------------------------------------

---[FILE: vicar.h]---
Location: ImageMagick-main/coders/vicar.h

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

#define MagickVICARHeaders \
  MagickCoderHeader("VICAR", 0, "LBLSIZE") \
  MagickCoderHeader("VICAR", 0, "NJPL1I") \
  MagickCoderHeader("VICAR", 0, "PDS_VERSION_ID")

#define MagickVICARAliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(VICAR)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

````

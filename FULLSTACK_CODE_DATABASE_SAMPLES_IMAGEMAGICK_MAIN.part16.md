---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 16
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 16 of 851)

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

---[FILE: bmp.h]---
Location: ImageMagick-main/coders/bmp.h

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

#define MagickBMPHeaders \
  MagickCoderHeader("BMP", 0, "BA") \
  MagickCoderHeader("BMP", 0, "BM") \
  MagickCoderHeader("BMP", 0, "CI") \
  MagickCoderHeader("BMP", 0, "CP") \
  MagickCoderHeader("BMP", 0, "IC") \
  MagickCoderHeader("BMP", 0, "PT")

#define MagickBMPAliases \
  MagickCoderAlias("BMP", "BMP2") \
  MagickCoderAlias("BMP", "BMP3")

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(BMP)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: braille.c]---
Location: ImageMagick-main/coders/braille.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%               BBBB   RRRR    AAA   IIIII  L      L      EEEEE               %
%               B   B  R   R  A   A    I    L      L      E                   %
%               BBBB   RRRR   AAAAA    I    L      L      EEE                 %
%               B   B  R R    A   A    I    L      L      E                   %
%               BBBB   R  R   A   A  IIIII  LLLLL  LLLLL  EEEEE               %
%                                                                             %
%                                                                             %
%                          Read/Write Braille Format                          %
%                                                                             %
%                               Samuel Thibault                               %
%                                February 2008                                %
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
#include "MagickCore/colorspace.h"
#include "MagickCore/constitute.h"
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
#include "MagickCore/pixel-accessor.h"
#include "MagickCore/property.h"
#include "MagickCore/quantize.h"
#include "MagickCore/static.h"
#include "MagickCore/string_.h"
#include "MagickCore/utility.h"

/*
  Forward declarations.
*/
static MagickBooleanType
  WriteBRAILLEImage(const ImageInfo *,Image *,ExceptionInfo *);

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r B R A I L L E I m a g e                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterBRAILLEImage() adds values for the Braille format to
%  the list of supported formats.  The values include the image format
%  tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterBRAILLEImage method is:
%
%      size_t RegisterBRAILLEImage(void)
%
*/
ModuleExport size_t RegisterBRAILLEImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("BRAILLE","BRF","BRF ASCII Braille format");
  entry->encoder=(EncodeImageHandler *) WriteBRAILLEImage;
  entry->flags^=CoderAdjoinFlag;
  (void) RegisterMagickInfo(entry);
  entry=AcquireMagickInfo("BRAILLE","UBRL","Unicode Text format");
  entry->encoder=(EncodeImageHandler *) WriteBRAILLEImage;
  entry->flags^=CoderAdjoinFlag;
  (void) RegisterMagickInfo(entry);
  entry=AcquireMagickInfo("BRAILLE","UBRL6","Unicode Text format 6dot");
  entry->encoder=(EncodeImageHandler *) WriteBRAILLEImage;
  entry->flags^=CoderAdjoinFlag;
  (void) RegisterMagickInfo(entry);
  entry=AcquireMagickInfo("BRAILLE","ISOBRL","ISO/TR 11548-1 format");
  entry->encoder=(EncodeImageHandler *) WriteBRAILLEImage;
  entry->flags^=CoderAdjoinFlag;
  (void) RegisterMagickInfo(entry);
  entry=AcquireMagickInfo("BRAILLE","ISOBRL6","ISO/TR 11548-1 format 6dot");
  entry->encoder=(EncodeImageHandler *) WriteBRAILLEImage;
  entry->flags^=CoderAdjoinFlag;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r B R A I L L E I m a g e                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterBRAILLEImage() removes format registrations made by the
%  BRAILLE module from the list of supported formats.
%
%  The format of the UnregisterBRAILLEImage method is:
%
%      UnregisterBRAILLEImage(void)
%
*/
ModuleExport void UnregisterBRAILLEImage(void)
{
  (void) UnregisterMagickInfo("BRF");
  (void) UnregisterMagickInfo("UBRL");
  (void) UnregisterMagickInfo("UBRL6");
  (void) UnregisterMagickInfo("ISOBRL");
  (void) UnregisterMagickInfo("ISOBRL6");
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e B R A I L L E I m a g e                                         %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  WriteBRAILLEImage() writes an image to a file in the Braille format.
%
%  The format of the WriteBRAILLEImage method is:
%
%      MagickBooleanType WriteBRAILLEImage(const ImageInfo *image_info,
%        Image *image,ExceptionInfo *exception)
%
%  A description of each parameter follows.
%
%    o image_info: The image info.
%
%    o image:  The image.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static MagickBooleanType WriteBRAILLEImage(const ImageInfo *image_info,
  Image *image,ExceptionInfo *exception)
{
#define do_cell(dx,dy,bit) \
{ \
  if (image->storage_class == PseudoClass) \
    cell|=(GetPixelIndex(image,p+(x+(ssize_t) (dx))*(ssize_t) \
      GetImageChannels(image)+(dy)*(ssize_t) (image->columns* \
      GetImageChannels(image))) == polarity) << bit; \
  else \
    cell|=(GetPixelGreen(image,p+(x+(ssize_t) (dx))*(ssize_t) \
      GetImageChannels(image)+(dy)*((ssize_t) image->columns*(ssize_t) \
      GetImageChannels(image))) == 0) << bit; \
}

  char
    buffer[MagickPathExtent];

  const char
    *value;

  const Quantum
    *p;

  int
    unicode = 0,
    iso_11548_1 = 0;

  MagickBooleanType
    status;

  Quantum
    polarity;

  size_t
    cell_height = 4;

  ssize_t
    x,
    y;

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
  if (LocaleCompare(image_info->magick,"UBRL") == 0)
    unicode=1;
  else
    if (LocaleCompare(image_info->magick,"UBRL6") == 0)
      {
        unicode=1;
        cell_height=3;
      }
    else
      if (LocaleCompare(image_info->magick,"ISOBRL") == 0)
        iso_11548_1=1;
      else
        if (LocaleCompare(image_info->magick,"ISOBRL6") == 0)
          {
            iso_11548_1=1;
            cell_height=3;
          }
        else
          cell_height=3;
  status=OpenBlob(image_info,image,WriteBinaryBlobMode,exception);
  if (status == MagickFalse)
    return(status);
  if (iso_11548_1 == 0)
    {
      value=GetImageProperty(image,"label",exception);
      if (value != (const char *) NULL)
        {
          (void) FormatLocaleString(buffer,MagickPathExtent,"Title: %s\n",
            value);
          (void) WriteBlobString(image,buffer);
        }
      if (image->page.x != 0)
        {
          (void) FormatLocaleString(buffer,MagickPathExtent,"X: %.20g\n",
            (double) image->page.x);
          (void) WriteBlobString(image,buffer);
        }
      if (image->page.y != 0)
        {
          (void) FormatLocaleString(buffer,MagickPathExtent,"Y: %.20g\n",
            (double) image->page.y);
          (void) WriteBlobString(image,buffer);
        }
      (void) FormatLocaleString(buffer,MagickPathExtent,"Width: %.20g\n",
        (double) (image->columns+(image->columns % 2)));
      (void) WriteBlobString(image,buffer);
      (void) FormatLocaleString(buffer,MagickPathExtent,"Height: %.20g\n",
        (double) image->rows);
      (void) WriteBlobString(image,buffer);
      (void) WriteBlobString(image,"\n");
    }
  (void) SetImageType(image,BilevelType,exception);
  polarity=0;
  if (image->storage_class == PseudoClass)
    {
      polarity=(Quantum) (GetPixelInfoIntensity(image,&image->colormap[0]) >=
        ((double) QuantumRange/2.0));
      if (image->colors == 2)
        polarity=(Quantum) (GetPixelInfoIntensity(image,&image->colormap[0]) >=
          GetPixelInfoIntensity(image,&image->colormap[1]));
    }
  for (y=0; y < (ssize_t) image->rows; y+=(ssize_t) cell_height)
  {
    if ((size_t) (y+(ssize_t) cell_height) > image->rows)
      cell_height=(size_t) ((ssize_t) image->rows-y);
    p=GetVirtualPixels(image,0,y,image->columns,cell_height,exception);
    if (p == (const Quantum *) NULL)
      break;
    for (x=0; x < (ssize_t) image->columns; x+=2)
    {
      MagickBooleanType
        two_columns;

      unsigned char
        cell = 0;

      two_columns=(x+1) < (ssize_t) image->columns ? MagickTrue : MagickFalse;
      do_cell(0,0,0)
      if (two_columns != MagickFalse)
        do_cell(1,0,3)
      if (cell_height > 1)
        {
          do_cell(0,1,1)
          if (two_columns != MagickFalse)
            do_cell(1,1,4)
          if (cell_height > 2)
            {
              do_cell(0,2,2)
              if (two_columns != MagickFalse)
                do_cell(1,2,5)
              if (cell_height > 3)
                {
                  do_cell(0,3,6)
                  if (two_columns != MagickFalse)
                    do_cell(1,3,7)
                }
            }
        }
      if (unicode != 0)
        {
          unsigned char
            utf8[3];

          /*
            Unicode text.
          */
          utf8[0]=(unsigned char) (0xe0 | ((0x28 >> 4) & 0x0f));
          utf8[1]=0x80| ((0x28 << 2) & 0x3f) | (cell >> 6);
          utf8[2]=0x80| (cell & 0x3f);
          (void) WriteBlob(image,3,utf8);
        }
      else
        if (iso_11548_1 != 0)
          {
            /*
              ISO/TR 11548-1 binary.
            */
            (void) WriteBlobByte(image,cell);
          }
        else
          {
            static const unsigned char
              iso_to_brf[64] =
              {
                ' ', 'A', '1', 'B', '\'', 'K', '2', 'L',
                '@', 'C', 'I', 'F', '/', 'M', 'S', 'P',
                '"', 'E', '3', 'H', '9', 'O', '6', 'R',
                '^', 'D', 'J', 'G', '>', 'N', 'T', 'Q',
                ',', '*', '5', '<', '-', 'U', '8', 'V',
                '.', '%', '[', '$', '+', 'X', '!', '&',
                ';', ':', '4', '\\', '0', 'Z', '7', '(',
                '_', '?', 'W', ']', '#', 'Y', ')', '='
              };

            /*
              BRF.
            */
            (void) WriteBlobByte(image,iso_to_brf[cell]);
          }
    }
    if (iso_11548_1 == 0)
      (void) WriteBlobByte(image,'\n');
    status=SetImageProgress(image,SaveImageTag,(MagickOffsetType) y,
      image->rows);
    if (status == MagickFalse)
      break;
  }
  if (CloseBlob(image) == MagickFalse)
    status=MagickFalse;
  return(status);
}
```

--------------------------------------------------------------------------------

---[FILE: braille.h]---
Location: ImageMagick-main/coders/braille.h

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

#define MagickBRAILLEHeaders

#define MagickBRAILLEAliases \
  MagickCoderAlias("BRAILLE", "BRF") \
  MagickCoderAlias("BRAILLE", "UBRL") \
  MagickCoderAlias("BRAILLE", "UBRL6") \
  MagickCoderAlias("BRAILLE", "ISOBRL") \
  MagickCoderAlias("BRAILLE", "ISOBRL6")

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(BRAILLE)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: bytebuffer-private.h]---
Location: ImageMagick-main/coders/bytebuffer-private.h

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
#ifndef MAGICK_BYTE_BUFFER_PRIVATE_H
#define MAGICK_BYTE_BUFFER_PRIVATE_H

#include "MagickCore/blob.h"
#include "MagickCore/blob-private.h"

typedef struct _MagickByteBuffer
{
  Image
    *image;

  ssize_t
    offset,
    count;

  unsigned char
    data[MagickMinBufferExtent];
} MagickByteBuffer;

static inline int PeekMagickByteBuffer(MagickByteBuffer *buffer)
{
  if ((buffer->offset == buffer->count) && (buffer->offset > 0))
    {
      if (buffer->count != (ssize_t) sizeof(buffer->data)-1)
        return(EOF);
      buffer->offset=0;
      buffer->count=0;
    }
  if ((buffer->offset == 0) && (buffer->count == 0))
    {
      buffer->count=ReadBlob(buffer->image,sizeof(buffer->data)-1,
        buffer->data);
      if (buffer->count < 1)
        return(EOF);
    }
  return((int) buffer->data[buffer->offset]);
}

static inline int ReadMagickByteBuffer(MagickByteBuffer *buffer)
{
  int
    result;

  result=PeekMagickByteBuffer(buffer);
  if (result != EOF)
    buffer->offset++;
  return(result);
}

static inline char *GetMagickByteBufferDatum(MagickByteBuffer *buffer)
{
  ssize_t
    count,
    i;

  if (buffer->offset != 0)
    {
      i=0;
      while (buffer->offset < buffer->count)
        buffer->data[i++]=buffer->data[buffer->offset++];
      count=ReadBlob(buffer->image,(size_t) ((ssize_t) sizeof(buffer->data)-1-
        i),buffer->data+i);
      buffer->count=i;
      if (count > 0)
        buffer->count+=count;
      buffer->offset=0;
    }
  return((char *) buffer->data);
}

static void CheckMagickByteBuffer(MagickByteBuffer *buffer,
  const size_t length)
{
  if ((buffer->offset+(ssize_t) length) > (ssize_t) sizeof(buffer->data))
    (void) GetMagickByteBufferDatum(buffer);
}

static MagickBooleanType CompareMagickByteBuffer(MagickByteBuffer *buffer,
  const char *p,const size_t length)
{
  const char
    *q;

  CheckMagickByteBuffer(buffer,length);
  q=(const char *) buffer->data+buffer->offset;
  if (LocaleNCompare(p,q,length) != 0)
    return(MagickFalse);
  return(MagickTrue);
}

static inline void SkipMagickByteBuffer(MagickByteBuffer *buffer,
  const size_t length)
{
  CheckMagickByteBuffer(buffer,length);
  if ((buffer->offset+(ssize_t) length) < buffer->count)
    buffer->offset+=(ssize_t) length;
}

static inline MagickBooleanType SkipMagickByteBufferUntilNewline(
  MagickByteBuffer *buffer)
{
  int
    c;

  c=ReadMagickByteBuffer(buffer);
  while ((c != '\n') && (c != '\r'))
  {
    c=ReadMagickByteBuffer(buffer);
    if (c == EOF)
      return(MagickFalse);
  }
  return(MagickTrue);
}

#endif
```

--------------------------------------------------------------------------------

---[FILE: cals.c]---
Location: ImageMagick-main/coders/cals.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                         CCCC   AAA   L      SSSSS                           %
%                        C      A   A  L      SS                              %
%                        C      AAAAA  L       SSS                            %
%                        C      A   A  L         SS                           %
%                         CCCC  A   A  LLLLL  SSSSS                           %
%                                                                             %
%                                                                             %
%                 Read/Write CALS Raster Group 1 Image Format                 %
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
% The CALS raster format is a standard developed by the Computer Aided
% Acquisition and Logistics Support (CALS) office of the United States
% Department of Defense to standardize graphics data interchange for
% electronic publishing, especially in the areas of technical graphics,
% CAD/CAM, and image processing applications.
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
#include "MagickCore/option.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/resource_.h"
#include "MagickCore/static.h"
#include "MagickCore/string_.h"
#include "MagickCore/string-private.h"
#include "MagickCore/module.h"

#if defined(MAGICKCORE_TIFF_DELEGATE)
/*
 Forward declarations.
*/
static MagickBooleanType
  WriteCALSImage(const ImageInfo *,Image *,ExceptionInfo *);
#endif

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   I s C A L S                                                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  IsCALS() returns MagickTrue if the image format type, identified by the
%  magick string, is CALS Raster Group 1.
%
%  The format of the IsCALS method is:
%
%      MagickBooleanType IsCALS(const unsigned char *magick,const size_t length)
%
%  A description of each parameter follows:
%
%    o magick: compare image format pattern against these bytes.
%
%    o length: Specifies the length of the magick string.
%
*/
static MagickBooleanType IsCALS(const unsigned char *magick,const size_t length)
{
  if (length < 128)
    return(MagickFalse);
  if (LocaleNCompare((const char *) magick,"version: MIL-STD-1840",21) == 0)
    return(MagickTrue);
  if (LocaleNCompare((const char *) magick,"srcdocid:",9) == 0)
    return(MagickTrue);
  if (LocaleNCompare((const char *) magick,"rorient:",8) == 0)
    return(MagickTrue);
  return(MagickFalse);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d C A L S I m a g e                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadCALSImage() reads an CALS Raster Group 1 image format image file and
%  returns it.  It allocates the memory necessary for the new Image structure
%  and returns a pointer to the new image.
%
%  The format of the ReadCALSImage method is:
%
%      Image *ReadCALSImage(const ImageInfo *image_info,
%        ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static Image *ReadCALSImage(const ImageInfo *image_info,
  ExceptionInfo *exception)
{
  char
    filename[MagickPathExtent],
    header[MagickPathExtent],
    message[MagickPathExtent];

  FILE
    *file;

  Image
    *image;

  ImageInfo
    *read_info;

  int
    c,
    unique_file;

  MagickBooleanType
    status;

  ssize_t
    i;

  unsigned long
    density,
    direction,
    height,
    orientation,
    pel_path,
    type,
    width;

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
    Read CALS header.
  */
  (void) memset(header,0,sizeof(header));
  density=0;
  direction=0;
  orientation=1;
  pel_path=0;
  type=1;
  width=0;
  height=0;
  for (i=0; i < 16; i++)
  {
    if (ReadBlob(image,128,(unsigned char *) header) != 128)
      break;
    switch (*header)
    {
      case 'R':
      case 'r':
      {
        if (LocaleNCompare(header,"rdensty:",8) == 0)
          {
            (void) MagickSscanf(header+8,"%lu",&density);
            break;
          }
        if (LocaleNCompare(header,"rpelcnt:",8) == 0)
          {
            (void) MagickSscanf(header+8,"%lu,%lu",&width,&height);
            break;
          }
        if (LocaleNCompare(header,"rorient:",8) == 0)
          {
            (void) MagickSscanf(header+8,"%lu,%lu",&pel_path,&direction);
            if (pel_path == 90)
              orientation=5;
            else
              if (pel_path == 180)
                orientation=3;
              else
                if (pel_path == 270)
                  orientation=7;
            if (direction == 90)
              orientation++;
            break;
          }
        if (LocaleNCompare(header,"rtype:",6) == 0)
          {
            (void) MagickSscanf(header+6,"%lu",&type);
            break;
          }
        break;
      }
    }
  }
  /*
    Read CALS pixels.
  */
  file=(FILE *) NULL;
  unique_file=AcquireUniqueFileResource(filename);
  if (unique_file != -1)
    file=fdopen(unique_file,"wb");
  if ((unique_file == -1) || (file == (FILE *) NULL))
    ThrowImageException(FileOpenError,"UnableToCreateTemporaryFile");
  while ((c=ReadBlobByte(image)) != EOF)
    if (fputc(c,file) != c)
      break;
  (void) fclose(file);
  (void) CloseBlob(image);
  image=DestroyImage(image);
  read_info=CloneImageInfo(image_info);
  SetImageInfoBlob(read_info,(void *) NULL,0);
  (void) FormatLocaleString(read_info->filename,MagickPathExtent,"group4:%s",
    filename);
  (void) FormatLocaleString(message,MagickPathExtent,"%lux%lu",width,height);
  (void) CloneString(&read_info->size,message);
  (void) FormatLocaleString(message,MagickPathExtent,"%lu",density);
  (void) CloneString(&read_info->density,message);
  read_info->orientation=(OrientationType) orientation;
  image=ReadImage(read_info,exception);
  if (image != (Image *) NULL)
    {
      (void) CopyMagickString(image->filename,image_info->filename,
        MagickPathExtent);
      (void) CopyMagickString(image->magick_filename,image_info->filename,
        MagickPathExtent);
      (void) CopyMagickString(image->magick,"CALS",MagickPathExtent);
    }
  read_info=DestroyImageInfo(read_info);
  (void) RelinquishUniqueFileResource(filename);
  return(image);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r C A L S I m a g e                                         %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterCALSImage() adds attributes for the CALS Raster Group 1 image file
%  image format to the list of supported formats.  The attributes include the
%  image format tag, a method to read and/or write the format, whether the
%  format supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief description
%  of the format.
%
%  The format of the RegisterCALSImage method is:
%
%      size_t RegisterCALSImage(void)
%
*/
ModuleExport size_t RegisterCALSImage(void)
{
#define CALSDescription  "Continuous Acquisition and Life-cycle Support Type 1"
#define CALSNote  "Specified in MIL-R-28002 and MIL-PRF-28002"

  MagickInfo
    *entry;

  entry=AcquireMagickInfo("CALS","CAL",CALSDescription);
  entry->decoder=(DecodeImageHandler *) ReadCALSImage;
#if defined(MAGICKCORE_TIFF_DELEGATE)
  entry->encoder=(EncodeImageHandler *) WriteCALSImage;
#endif
  entry->flags^=CoderAdjoinFlag;
  entry->magick=(IsImageFormatHandler *) IsCALS;
  entry->note=ConstantString(CALSNote);
  (void) RegisterMagickInfo(entry);
  entry=AcquireMagickInfo("CALS","CALS",CALSDescription);
  entry->decoder=(DecodeImageHandler *) ReadCALSImage;
#if defined(MAGICKCORE_TIFF_DELEGATE)
  entry->encoder=(EncodeImageHandler *) WriteCALSImage;
#endif
  entry->flags^=CoderAdjoinFlag;
  entry->magick=(IsImageFormatHandler *) IsCALS;
  entry->note=ConstantString(CALSNote);
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r C A L S I m a g e                                     %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterCALSImage() removes format registrations made by the
%  CALS module from the list of supported formats.
%
%  The format of the UnregisterCALSImage method is:
%
%      UnregisterCALSImage(void)
%
*/
ModuleExport void UnregisterCALSImage(void)
{
  (void) UnregisterMagickInfo("CAL");
  (void) UnregisterMagickInfo("CALS");
}

#if defined(MAGICKCORE_TIFF_DELEGATE)
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e C A L S I m a g e                                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  WriteCALSImage() writes an image to a file in CALS Raster Group 1 image
%  format.
%
%  The format of the WriteCALSImage method is:
%
%      MagickBooleanType WriteCALSImage(const ImageInfo *image_info,
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

static ssize_t WriteCALSRecord(Image *image,const char *data)
{
  char
    pad[128];

  const char
    *p;

  ssize_t
    i;

  ssize_t
    count;

  i=0;
  count=0;
  if (data != (const char *) NULL)
    {
      p=data;
      for (i=0; (i < 128) && (p[i] != '\0'); i++);
      count=WriteBlob(image,(size_t) i,(const unsigned char *) data);
    }
  if (i < 128)
    {
      i=128-i;
      (void) memset(pad,' ',(size_t) i);
      count=WriteBlob(image,(size_t) i,(const unsigned char *) pad);
    }
  return(count);
}

static MagickBooleanType WriteCALSImage(const ImageInfo *image_info,
  Image *image,ExceptionInfo *exception)
{
  char
    header[129];

  Image
    *group4_image;

  ImageInfo
    *write_info;

  MagickBooleanType
    status;

  ssize_t
    i;

  size_t
    density,
    length,
    orient_x,
    orient_y;

  ssize_t
    count;

  unsigned char
    *group4;

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
  /*
    Create standard CALS header.
  */
  count=WriteCALSRecord(image,"srcdocid: NONE");
  (void) count;
  count=WriteCALSRecord(image,"dstdocid: NONE");
  count=WriteCALSRecord(image,"txtfilid: NONE");
  count=WriteCALSRecord(image,"figid: NONE");
  count=WriteCALSRecord(image,"srcgph: NONE");
  count=WriteCALSRecord(image,"doccls: NONE");
  count=WriteCALSRecord(image,"rtype: 1");
  orient_x=0;
  orient_y=0;
  switch (image->orientation)
  {
    case TopRightOrientation:
    {
      orient_x=180;
      orient_y=270;
      break;
    }
    case BottomRightOrientation:
    {
      orient_x=180;
      orient_y=90;
      break;
    }
    case BottomLeftOrientation:
    {
      orient_y=90;
      break;
    }
    case LeftTopOrientation:
    {
      orient_x=270;
      break;
    }
    case RightTopOrientation:
    {
      orient_x=270;
      orient_y=180;
      break;
    }
    case RightBottomOrientation:
    {
      orient_x=90;
      orient_y=180;
      break;
    }
    case LeftBottomOrientation:
    {
      orient_x=90;
      break;
    }
    default:
    {
      orient_y=270;
      break;
    }
  }
  (void) FormatLocaleString(header,sizeof(header),"rorient: %03ld,%03ld",
    (long) orient_x,(long) orient_y);
  count=WriteCALSRecord(image,header);
  (void) FormatLocaleString(header,sizeof(header),"rpelcnt: %06lu,%06lu",
    (unsigned long) image->columns,(unsigned long) image->rows);
  count=WriteCALSRecord(image,header);  
  density=200;
  if (image_info->density != (char *) NULL)
    {
      GeometryInfo
        geometry_info;

      (void) ParseGeometry(image_info->density,&geometry_info);
      density=(size_t) floor(geometry_info.rho+0.5);
    }
  (void) FormatLocaleString(header,sizeof(header),"rdensty: %04lu",
    (unsigned long) density);
  count=WriteCALSRecord(image,header);
  count=WriteCALSRecord(image,"notes: NONE");
  (void) memset(header,' ',128);
  for (i=0; i < 5; i++)
    (void) WriteBlob(image,128,(unsigned char *) header);
  /*
    Write CALS pixels.
  */
  write_info=CloneImageInfo(image_info);
  (void) CopyMagickString(write_info->filename,"GROUP4:",MagickPathExtent);
  (void) CopyMagickString(write_info->magick,"GROUP4",MagickPathExtent);
  group4_image=CloneImage(image,0,0,MagickTrue,exception);
  if (group4_image == (Image *) NULL)
    {
      write_info=DestroyImageInfo(write_info);
      (void) CloseBlob(image);
      return(MagickFalse);
    }
  group4=(unsigned char *) ImageToBlob(write_info,group4_image,&length,
    exception);
  group4_image=DestroyImage(group4_image);
  if (group4 == (unsigned char *) NULL)
    {
      write_info=DestroyImageInfo(write_info);
      (void) CloseBlob(image);
      return(MagickFalse);
    }
  write_info=DestroyImageInfo(write_info);
  if (WriteBlob(image,length,group4) != (ssize_t) length)
    status=MagickFalse;
  group4=(unsigned char *) RelinquishMagickMemory(group4);
  if (CloseBlob(image) == MagickFalse)
    status=MagickFalse;
  return(status);
}
#endif
```

--------------------------------------------------------------------------------

````

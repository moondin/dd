---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 19
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 19 of 851)

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

---[FILE: cin.h]---
Location: ImageMagick-main/coders/cin.h

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

#define MagickCINHeaders \
  MagickCoderHeader("CIN", 0, "\200\052\137\327")

#define MagickCINAliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(CIN)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: cip.c]---
Location: ImageMagick-main/coders/cip.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                             CCCC  IIIII  PPPP                               %
%                            C        I    P   P                              %
%                            C        I    PPPP                               %
%                            C        I    P                                  %
%                             CCCC  IIIII  P                                  %
%                                                                             %
%                                                                             %
%                  Read/Write Cisco IP Phone Image Format                     %
%                                                                             %
%                              Software Design                                %
%                                   Cristy                                    %
%                                April 2004                                   %
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
#include "MagickCore/color-private.h"
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
#include "MagickCore/property.h"
#include "MagickCore/quantize.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/static.h"
#include "MagickCore/string_.h"
#include "MagickCore/module.h"
#include "MagickCore/utility.h"

/*
  Forward declarations.
*/
static MagickBooleanType
  WriteCIPImage(const ImageInfo *,Image *,ExceptionInfo *);

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r C I P I m a g e                                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterCIPImage() adds properties for the CIP IP phone image format to
%  the list of supported formats.  The properties include the image format
%  tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterCIPImage method is:
%
%      size_t RegisterCIPImage(void)
%
*/
ModuleExport size_t RegisterCIPImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("CIP","CIP","Cisco IP phone image format");
  entry->encoder=(EncodeImageHandler *) WriteCIPImage;
  entry->flags^=CoderAdjoinFlag;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r C I P I m a g e                                       %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterCIPImage() removes format registrations made by the
%  CIP module from the list of supported formats.
%
%  The format of the UnregisterCIPImage method is:
%
%      UnregisterCIPImage(void)
%
*/
ModuleExport void UnregisterCIPImage(void)
{
  (void) UnregisterMagickInfo("CIP");
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e C I P I m a g e                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  Procedure WriteCIPImage() writes an image to a file in the Cisco IP phone
%  image format.
%
%  The format of the WriteCIPImage method is:
%
%      MagickBooleanType WriteCIPImage(const ImageInfo *image_info,
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
static MagickBooleanType WriteCIPImage(const ImageInfo *image_info,Image *image,
  ExceptionInfo *exception)
{
  char
    buffer[MagickPathExtent];

  const char
    *value;

  MagickBooleanType
    status;

  const Quantum
    *p;

  ssize_t
    i,
    x;

  ssize_t
    y;

  unsigned char
    byte;

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
  (void) WriteBlobString(image,"<CiscoIPPhoneImage>\n");
  value=GetImageProperty(image,"label",exception);
  if (value != (const char *) NULL)
    (void) FormatLocaleString(buffer,MagickPathExtent,"<Title>%s</Title>\n",
      value);
  else
    {
      char
        basename[MagickPathExtent];

      GetPathComponent(image->filename,BasePath,basename);
      (void) FormatLocaleString(buffer,MagickPathExtent,"<Title>%s</Title>\n",
        basename);
    }
  (void) WriteBlobString(image,buffer);
  (void) FormatLocaleString(buffer,MagickPathExtent,
    "<LocationX>%.20g</LocationX>\n",(double) image->page.x);
  (void) WriteBlobString(image,buffer);
  (void) FormatLocaleString(buffer,MagickPathExtent,
    "<LocationY>%.20g</LocationY>\n",(double) image->page.y);
  (void) WriteBlobString(image,buffer);
  (void) FormatLocaleString(buffer,MagickPathExtent,"<Width>%.20g</Width>\n",
    (double) (image->columns+(image->columns % 2)));
  (void) WriteBlobString(image,buffer);
  (void) FormatLocaleString(buffer,MagickPathExtent,"<Height>%.20g</Height>\n",
    (double) image->rows);
  (void) WriteBlobString(image,buffer);
  (void) FormatLocaleString(buffer,MagickPathExtent,"<Depth>2</Depth>\n");
  (void) WriteBlobString(image,buffer);
  (void) WriteBlobString(image,"<Data>");
  if (IssRGBCompatibleColorspace(image->colorspace) == MagickFalse)
    (void) TransformImageColorspace(image,sRGBColorspace,exception);
  for (y=0; y < (ssize_t) image->rows; y++)
  {
    p=GetVirtualPixels(image,0,y,image->columns,1,exception);
    if (p == (const Quantum *) NULL)
      break;
    for (x=0; x < ((ssize_t) image->columns-3); x+=4)
    {
      byte=(unsigned char)
        ((((size_t) (3*ClampToQuantum(GetPixelLuma(image,p+3*GetPixelChannels(image)))/QuantumRange) & 0x03) << 6) |
         (((size_t) (3*ClampToQuantum(GetPixelLuma(image,p+2*GetPixelChannels(image)))/QuantumRange) & 0x03) << 4) |
         (((size_t) (3*ClampToQuantum(GetPixelLuma(image,p+1*GetPixelChannels(image)))/QuantumRange) & 0x03) << 2) |
         (((size_t) (3*ClampToQuantum(GetPixelLuma(image,p+0*GetPixelChannels(image)))/QuantumRange) & 0x03) << 0));
      (void) FormatLocaleString(buffer,MagickPathExtent,"%02x",byte);
      (void) WriteBlobString(image,buffer);
      p+=(ptrdiff_t) GetPixelChannels(image);
    }
    if ((image->columns % 4) != 0)
      {
        byte=0;
        for ( ; x < (ssize_t) image->columns; x++)
        {
          i=x % 4;
          switch (i)
          {
            case 0:
            {
              byte|=(unsigned char) (((size_t) (3*ClampToQuantum(GetPixelLuma(
                image,p+MagickMin(i,3)*(ssize_t) GetPixelChannels(image)))/
                QuantumRange) & 0x03) << 6);
              break;
            }
            case 1:
            {
              byte|=(unsigned char) (((size_t) (3*ClampToQuantum(GetPixelLuma(
                image,p+MagickMin(i,2)*(ssize_t) GetPixelChannels(image)))/
                QuantumRange) & 0x03) << 4);
              break;
            }
            case 2:
            {
              byte|=(unsigned char) (((size_t) (3*ClampToQuantum(GetPixelLuma(
                image,p+MagickMin(i,1)*(ssize_t) GetPixelChannels(image)))/
                QuantumRange) & 0x03) << 2);
              break;
            }
            case 3:
            {
              byte|=(unsigned char) (((size_t) (3*ClampToQuantum(GetPixelLuma(
                image,p+MagickMin(i,0)*(ssize_t) GetPixelChannels(image)))/
                QuantumRange) & 0x03) << 0);
              break;
            }
          }
        }
        (void) FormatLocaleString(buffer,MagickPathExtent,"%02x",~byte);
        (void) WriteBlobString(image,buffer);
      }
    status=SetImageProgress(image,SaveImageTag,(MagickOffsetType) y,
      image->rows);
    if (status == MagickFalse)
      break;
  }
  (void) WriteBlobString(image,"</Data>\n");
  (void) WriteBlobString(image,"</CiscoIPPhoneImage>\n");
  if (CloseBlob(image) == MagickFalse)
    status=MagickFalse;
  return(status);
}
```

--------------------------------------------------------------------------------

---[FILE: cip.h]---
Location: ImageMagick-main/coders/cip.h

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

#define MagickCIPHeaders

#define MagickCIPAliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(CIP)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: clip.c]---
Location: ImageMagick-main/coders/clip.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                          CCCC  L      IIIII  PPPP                           %
%                         C      L        I    P   P                          %
%                         C      L        I    PPPP                           %
%                         C      L        I    P                              %
%                          CCCC  LLLLL  IIIII  P                              %
%                                                                             %
%                                                                             %
%                        Write Clip Mask To MIFF File.                        %
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
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
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
  WriteCLIPImage(const ImageInfo *,Image *,ExceptionInfo *);

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d C L I P I m a g e                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadCLIPImage returns the rendered clip path associated with the image.
%
%  The format of the ReadCLIPImage method is:
%
%      Image *ReadCLIPImage(const ImageInfo *image_info,
%        ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static Image *ReadCLIPImage(const ImageInfo *image_info,
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
  (void) CopyMagickString(read_info->magick,"MIFF",MagickPathExtent);
  image=ReadImage(read_info,exception);
  read_info=DestroyImageInfo(read_info);
  if (image != (Image *) NULL)
    {
      Image
        *clip_image;

      (void) ClipImage(image,exception);
      clip_image=GetImageMask(image,WritePixelMask,exception);
      if (clip_image == (Image *) NULL)
        ThrowReaderException(CoderError,"ImageDoesNotHaveAClipMask");
      image=DestroyImage(image);
      image=clip_image;
    }
  return(GetFirstImageInList(image));
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r C L I P I m a g e                                         %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterCLIPImage() adds attributes for the CLIP image format to
%  the list of supported formats.  The attributes include the image format
%  tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterCLIPImage method is:
%
%      size_t RegisterCLIPImage(void)
%
*/
ModuleExport size_t RegisterCLIPImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("CLIP","CLIP","Image Clip Mask");
  entry->decoder=(DecodeImageHandler *) ReadCLIPImage;
  entry->encoder=(EncodeImageHandler *) WriteCLIPImage;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r C L I P I m a g e                                     %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterCLIPImage() removes format registrations made by the
%  CLIP module from the list of supported formats.
%
%  The format of the UnregisterCLIPImage method is:
%
%      UnregisterCLIPImage(void)
%
*/
ModuleExport void UnregisterCLIPImage(void)
{
  (void) UnregisterMagickInfo("CLIP");
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e C L I P I m a g e                                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  WriteCLIPImage() writes an image of clip bytes to a file.  It consists of
%  data from the clip mask of the image.
%
%  The format of the WriteCLIPImage method is:
%
%      MagickBooleanType WriteCLIPImage(const ImageInfo *image_info,
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
static MagickBooleanType WriteCLIPImage(const ImageInfo *image_info,
  Image *image,ExceptionInfo *exception)
{
  const MagickInfo
    *magick_info;

  Image
    *clip_image;

  ImageInfo
    *write_info;

  MagickBooleanType
    status;

  if ((image->channels & WriteMaskChannel) == 0)
    status=ClipImage(image,exception);
  if ((image->channels & WriteMaskChannel) == 0)
    ThrowWriterException(CoderError,"ImageDoesNotHaveAClipMask");
  clip_image=GetImageMask(image,WritePixelMask,exception);
  if (clip_image == (Image *) NULL)
    return(MagickFalse);
  (void) CopyMagickString(clip_image->filename,image->filename,
    MagickPathExtent);
  write_info=CloneImageInfo(image_info);
  *write_info->magick='\0';
  (void) SetImageInfo(write_info,1,exception);
  magick_info=GetMagickInfo(write_info->magick,exception);
  if ((magick_info == (const MagickInfo*) NULL) ||
      (LocaleCompare(magick_info->magick_module,"CLIP") == 0))
    (void) FormatLocaleString(clip_image->filename,MagickPathExtent,"miff:%s",
      write_info->filename);
  status=WriteImage(write_info,clip_image,exception);
  clip_image=DestroyImage(clip_image);
  write_info=DestroyImageInfo(write_info);
  return(status);
}
```

--------------------------------------------------------------------------------

---[FILE: clip.h]---
Location: ImageMagick-main/coders/clip.h

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

#define MagickCLIPHeaders

#define MagickCLIPAliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(CLIP)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: clipboard.c]---
Location: ImageMagick-main/coders/clipboard.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%        CCCC  L      IIIII  PPPP   BBBB    OOO    AAA   RRRR   DDDD          %
%       C      L        I    P   P  B   B  O   O  A   A  R   R  D   D         %
%       C      L        I    PPP    BBBB   O   O  AAAAA  RRRR   D   D         %
%       C      L        I    P      B   B  O   O  A   A  R R    D   D         %
%        CCCC  LLLLL  IIIII  P      BBBB    OOO   A   A  R  R   DDDD          %
%                                                                             %
%                                                                             %
%                        Read/Write Windows Clipboard.                        %
%                                                                             %
%                              Software Design                                %
%                             Leonard Rosenthol                               %
%                                 May 2002                                    %
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
#if defined(MAGICKCORE_WINGDI32_DELEGATE)
#  if defined(__CYGWIN__)
#    include <windows.h>
#  else
     /* All MinGW needs ... */
#    include "MagickCore/nt-base-private.h"
#    include <wingdi.h>
#  endif
#endif
#include "MagickCore/blob.h"
#include "MagickCore/blob-private.h"
#include "MagickCore/cache.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/image.h"
#include "MagickCore/image-private.h"
#include "MagickCore/list.h"
#include "MagickCore/magick.h"
#include "MagickCore/memory_.h"
#include "MagickCore/nt-feature.h"
#include "MagickCore/pixel-accessor.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/static.h"
#include "MagickCore/string_.h"
#include "MagickCore/module.h"

#define BMP_HEADER_SIZE 14

/*
  Forward declarations.
*/
#if defined(MAGICKCORE_WINGDI32_DELEGATE)
static MagickBooleanType
  WriteCLIPBOARDImage(const ImageInfo *,Image *,ExceptionInfo *);
#endif

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d C L I P B O A R D I m a g e                                       %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadCLIPBOARDImage() reads an image from the system clipboard and returns
%  it.  It allocates the memory necessary for the new Image structure and
%  returns a pointer to the new image.
%
%  The format of the ReadCLIPBOARDImage method is:
%
%      Image *ReadCLIPBOARDImage(const ImageInfo *image_info,
%        ExceptionInfo exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/
#if defined(MAGICKCORE_WINGDI32_DELEGATE)
static Image *ReadCLIPBOARDImage(const ImageInfo *image_info,
  ExceptionInfo *exception)
{
  unsigned char
    *p;

  HANDLE
    clip_handle;

  Image
    *image;

  ImageInfo
    *read_info;

  LPVOID
    clip_mem;

  size_t
    clip_size,
    total_size;

  unsigned char
    offset;

  void
    *clip_data;

  assert(image_info != (const ImageInfo *) NULL);
  assert(image_info->signature == MagickCoreSignature);
  assert(exception != (ExceptionInfo *) NULL);
  assert(exception->signature == MagickCoreSignature);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",
      image_info->filename);
  image=AcquireImage(image_info,exception);
  if (!IsClipboardFormatAvailable(CF_DIB) &&
      !IsClipboardFormatAvailable(CF_DIBV5))
    ThrowReaderException(CoderError,"NoBitmapOnClipboard");
  if (!OpenClipboard(NULL))
    ThrowReaderException(CoderError,"UnableToReadImageData");
  clip_handle=GetClipboardData(CF_DIBV5);
  if (!clip_handle)
    clip_handle=GetClipboardData(CF_DIB);
  if ((clip_handle == NULL) || (clip_handle == INVALID_HANDLE_VALUE))
    {
      CloseClipboard();
      ThrowReaderException(CoderError,"UnableToReadImageData");
    }
  clip_size=(size_t) GlobalSize(clip_handle);
  total_size=clip_size+BMP_HEADER_SIZE;
  clip_data=AcquireMagickMemory(total_size);
  if (clip_data == (void *) NULL)
    {
      CloseClipboard();
      ThrowReaderException(ResourceLimitError,"MemoryAllocationFailed");
    }
  clip_mem=GlobalLock(clip_handle);
  if (clip_mem == (LPVOID) NULL)
    {
      CloseClipboard();
      clip_data=RelinquishMagickMemory(clip_data);
      ThrowReaderException(CoderError,"UnableToReadImageData");
    }
  p=(unsigned char *) clip_data;
  p+=(ptrdiff_t) BMP_HEADER_SIZE;
  (void) memcpy(p,clip_mem,clip_size);
  (void) GlobalUnlock(clip_mem);
  (void) CloseClipboard();
  memset(clip_data,0,BMP_HEADER_SIZE);
  offset=p[0];
  if ((p[0] == 40) && (p[16] == BI_BITFIELDS))
    offset+=12;
  else
    {
      unsigned int
        image_size;

      image_size=(unsigned int) p[20];
      image_size|=(unsigned int) p[21] << 8;
      image_size|=(unsigned int) p[22] << 16;
      image_size|=(unsigned int) p[23] << 24;
      /* Hack for chrome where the offset seems to be incorrect */
      if (clip_size - offset - image_size == 12)
        offset+=12;
    }
  offset+=BMP_HEADER_SIZE;
  p-=(ptrdiff_t)BMP_HEADER_SIZE;
  p[0]='B';
  p[1]='M';
  p[2]=(unsigned char) total_size;
  p[3]=(unsigned char) (total_size >> 8);
  p[4]=(unsigned char) (total_size >> 16);
  p[5]=(unsigned char) (total_size >> 24);
  p[10]=offset;
  read_info=CloneImageInfo(image_info);
  (void) CopyMagickString(read_info->magick,"BMP",MagickPathExtent);
  image=BlobToImage(read_info,clip_data,total_size,exception);
  read_info=DestroyImageInfo(read_info);
  clip_data=RelinquishMagickMemory(clip_data);
  return(image);
}
#endif /* MAGICKCORE_WINGDI32_DELEGATE */

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r C L I P B O A R D I m a g e                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterCLIPBOARDImage() adds attributes for the clipboard "image format" to
%  the list of supported formats.  The attributes include the image format
%  tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterCLIPBOARDImage method is:
%
%      size_t RegisterCLIPBOARDImage(void)
%
*/
ModuleExport size_t RegisterCLIPBOARDImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("CLIPBOARD","CLIPBOARD","The system clipboard");
#if defined(MAGICKCORE_WINGDI32_DELEGATE)
  entry->decoder=(DecodeImageHandler *) ReadCLIPBOARDImage;
  entry->encoder=(EncodeImageHandler *) WriteCLIPBOARDImage;
#endif
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
%   U n r e g i s t e r C L I P B O A R D I m a g e                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterCLIPBOARDImage() removes format registrations made by the
%  RGB module from the list of supported formats.
%
%  The format of the UnregisterCLIPBOARDImage method is:
%
%      UnregisterCLIPBOARDImage(void)
%
*/
ModuleExport void UnregisterCLIPBOARDImage(void)
{
  (void) UnregisterMagickInfo("CLIPBOARD");
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e C L I P B O A R D I m a g e                                     %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  WriteCLIPBOARDImage() writes an image to the system clipboard.
%
%  The format of the WriteCLIPBOARDImage method is:
%
%      MagickBooleanType WriteCLIPBOARDImage(const ImageInfo *image_info,
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
#if defined(MAGICKCORE_WINGDI32_DELEGATE)
static MagickBooleanType WriteCLIPBOARDImage(const ImageInfo *image_info,
  Image *image,ExceptionInfo *exception)
{
  HANDLE
    clip_handle;

  ImageInfo
    *write_info;

  LPVOID
    clip_mem;

  size_t
    length;

  unsigned char
    *p;

  void
    *clip_data;

  assert(image_info != (const ImageInfo *) NULL);
  assert(image_info->signature == MagickCoreSignature);
  assert(image != (Image *) NULL);
  assert(image->signature == MagickCoreSignature);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",image->filename);
  if (SetImageStorageClass(image,DirectClass,exception) == MagickFalse)
    ThrowWriterException(CoderError,"UnableToWriteImageData");
  write_info=CloneImageInfo(image_info);
  if ((image->alpha_trait & BlendPixelTrait) == 0)
    (void) CopyMagickString(write_info->magick,"BMP3",MagickPathExtent);
  else
    (void) CopyMagickString(write_info->magick,"BMP",MagickPathExtent);
  clip_data=ImageToBlob(write_info,image,&length,exception);
  write_info=DestroyImageInfo(write_info);
  if (clip_data == (void *) NULL)
    ThrowWriterException(CoderError,"UnableToWriteImageData");
  clip_handle=(HANDLE) GlobalAlloc(GMEM_MOVEABLE,length-BMP_HEADER_SIZE);
  if (clip_handle == (HANDLE) NULL)
    {
      clip_data=RelinquishMagickMemory(clip_data);
      ThrowWriterException(CoderError,"UnableToWriteImageData");
    }
  clip_mem=GlobalLock(clip_handle);
  if (clip_mem == (LPVOID) NULL)
    {
      (void) GlobalFree((HGLOBAL) clip_handle);
      clip_data=RelinquishMagickMemory(clip_data);
      ThrowWriterException(CoderError,"UnableToWriteImageData");
    }
  p=(unsigned char *) clip_data;
  p+=(ptrdiff_t) BMP_HEADER_SIZE;
  (void) memcpy(clip_mem,p,length-BMP_HEADER_SIZE);
  (void) GlobalUnlock(clip_mem);
  clip_data=RelinquishMagickMemory(clip_data);
  if (!OpenClipboard(NULL))
    {
      (void) GlobalFree((HGLOBAL) clip_handle);
      ThrowWriterException(CoderError,"UnableToWriteImageData");
    }
  (void) EmptyClipboard();
  if ((image->alpha_trait & BlendPixelTrait) == 0)
    SetClipboardData(CF_DIB,clip_handle);
  else
    SetClipboardData(CF_DIBV5,clip_handle);
  (void) CloseClipboard();
  return(MagickTrue);
}
#endif /* MAGICKCORE_WINGDI32_DELEGATE */
```

--------------------------------------------------------------------------------

````

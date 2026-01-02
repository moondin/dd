---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 52
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 52 of 851)

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

---[FILE: icon.h]---
Location: ImageMagick-main/coders/icon.h

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

#define MagickICONHeaders

#define MagickICONAliases \
  MagickCoderAlias("ICON", "CUR") \
  MagickCoderAlias("ICON", "ICO") \
  MagickCoderAlias("ICON", "ICN")

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(ICON)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: info.c]---
Location: ImageMagick-main/coders/info.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                        IIIII  N   N  FFFFF   OOO                            %
%                          I    NN  N  F      O   O                           %
%                          I    N N N  FFF    O   O                           %
%                          I    N  NN  F      O   O                           %
%                        IIIII  N   N  F       OOO                            %
%                                                                             %
%                                                                             %
%                         Write Info About the Image.                         %
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
#include "MagickCore/colorspace.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/identify.h"
#include "MagickCore/image.h"
#include "MagickCore/image-private.h"
#include "MagickCore/list.h"
#include "MagickCore/magick.h"
#include "MagickCore/memory_.h"
#include "MagickCore/monitor.h"
#include "MagickCore/monitor-private.h"
#include "MagickCore/option.h"
#include "MagickCore/property.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/static.h"
#include "MagickCore/string_.h"
#include "MagickCore/module.h"
#include "MagickCore/utility.h"

/*
  Forward declarations.
*/
static MagickBooleanType
  WriteINFOImage(const ImageInfo *,Image *,ExceptionInfo *);

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r I N F O I m a g e                                         %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterINFOImage() adds attributes for the INFO image format to
%  the list of supported formats.  The attributes include the image format
%  tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterINFOImage method is:
%
%      size_t RegisterINFOImage(void)
%
*/
ModuleExport size_t RegisterINFOImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("INFO","INFO","The image format and characteristics");
  entry->encoder=(EncodeImageHandler *) WriteINFOImage;
  entry->flags^=CoderBlobSupportFlag;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r I N F O I m a g e                                     %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterINFOImage() removes format registrations made by the
%  INFO module from the list of supported formats.
%
%  The format of the UnregisterINFOImage method is:
%
%      UnregisterINFOImage(void)
%
*/
ModuleExport void UnregisterINFOImage(void)
{
  (void) UnregisterMagickInfo("INFO");
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e I N F O I m a g e                                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  WriteINFOImage writes the pixel values as text numbers.
%
%  The format of the WriteINFOImage method is:
%
%      MagickBooleanType WriteINFOImage(const ImageInfo *image_info,
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
static MagickBooleanType WriteINFOImage(const ImageInfo *image_info,
  Image *image,ExceptionInfo *exception)
{
  const char
    *format;

  MagickBooleanType
    status;

  MagickOffsetType
    scene;

  size_t
    number_scenes;

  /*
    Open output image file.
  */
  assert(image_info != (const ImageInfo *) NULL);
  assert(image_info->signature == MagickCoreSignature);
  assert(image != (Image *) NULL);
  assert(image->signature == MagickCoreSignature);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",image->filename);
  status=OpenBlob(image_info,image,WriteBlobMode,exception);
  if (status == MagickFalse)
    return(status);
  scene=0;
  number_scenes=GetImageListLength(image);
  do
  {
    format=GetImageOption(image_info,"format");
    if (format == (char *) NULL)
      {
        (void) CopyMagickString(image->filename,image->magick_filename,
          MagickPathExtent);
        image->magick_columns=image->columns;
        image->magick_rows=image->rows;
        (void) IdentifyImage(image,GetBlobFileHandle(image),
          image_info->verbose,exception);
      }
    else
      {
        char
          *text;

        text=InterpretImageProperties((ImageInfo *) image_info,image,format,
          exception);
        if (text != (char *) NULL)
          {
            (void) WriteBlobString(image,text);
            text=DestroyString(text);
          }
      }
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

---[FILE: info.h]---
Location: ImageMagick-main/coders/info.h

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

#define MagickINFOHeaders

#define MagickINFOAliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(INFO)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: inline.c]---
Location: ImageMagick-main/coders/inline.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                  IIIII  N   N  L      IIIII  N   N  EEEEE                   %
%                    I    NN  N  L        I    NN  N  E                       %
%                    I    N N N  L        I    N N N  EEE                     %
%                    I    N  NN  L        I    N  NN  E                       %
%                  IIIII  N   N  LLLLL  IIIII  N   N  EEEEE                   %
%                                                                             %
%                                                                             %
%                            Read Inline Images                               %
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
#include "MagickCore/client.h"
#include "MagickCore/constitute.h"
#include "MagickCore/display.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/image.h"
#include "MagickCore/image-private.h"
#include "MagickCore/list.h"
#include "MagickCore/magick.h"
#include "MagickCore/memory_.h"
#include "MagickCore/option.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/static.h"
#include "MagickCore/string_.h"
#include "MagickCore/module.h"
#include "MagickCore/utility.h"
#include "MagickCore/xwindow.h"
#include "MagickCore/xwindow-private.h"

/*
  Forward declarations.
*/
static MagickBooleanType
  WriteINLINEImage(const ImageInfo *,Image *,ExceptionInfo *);

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d I N L I N E I m a g e                                             %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadINLINEImage() reads base64-encoded inlines images.
%
%  The format of the ReadINLINEImage method is:
%
%      Image *ReadINLINEImage(const ImageInfo *image_info,
%        ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static Image *ReadINLINEImage(const ImageInfo *image_info,
  ExceptionInfo *exception)
{
  Image
    *image;

  MagickBooleanType
    status;

  size_t
    quantum;

  ssize_t
    count,
    i;

  unsigned char
    *inline_image;

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
  if (LocaleNCompare(image_info->filename,"data:",5) == 0)
    {
      char
        *filename;

      Image
        *data_image;

      filename=AcquireString("data:");
      (void) ConcatenateMagickString(filename,image_info->filename,
        MagickPathExtent);
      data_image=ReadInlineImage(image_info,filename,exception);
      filename=DestroyString(filename);
      return(data_image);
    }
  image=AcquireImage(image_info,exception);
  status=OpenBlob(image_info,image,ReadBinaryBlobMode,exception);
  if (status == MagickFalse)
    {
      image=DestroyImageList(image);
      return((Image *) NULL);
    }
  quantum=MagickMin((size_t) GetBlobSize(image),MagickMaxBufferExtent);
  if (quantum == 0)
    quantum=MagickMaxBufferExtent;
  inline_image=(unsigned char *) AcquireQuantumMemory(quantum,
    sizeof(*inline_image));
  count=0;
  for (i=0; inline_image != (unsigned char *) NULL; i+=count)
  {
    count=(ssize_t) ReadBlob(image,quantum,inline_image+i);
    if (count <= 0)
      {
        count=0;
        if (errno != EINTR)
          break;
      }
    if (~((size_t) i) < (quantum+1))
      {
        inline_image=(unsigned char *) RelinquishMagickMemory(inline_image);
        break;
      }
    inline_image=(unsigned char *) ResizeQuantumMemory(inline_image,(size_t)
      (i+count+(ssize_t) quantum+1),sizeof(*inline_image));
  }
  if (inline_image == (unsigned char *) NULL)
    {
      (void) ThrowMagickException(exception,GetMagickModule(),
        ResourceLimitError,"MemoryAllocationFailed","`%s'",image->filename);
      return((Image *) NULL);
    }
  inline_image[i+count]='\0';
  image=DestroyImageList(image);
  image=ReadInlineImage(image_info,(char *) inline_image,exception);
  inline_image=(unsigned char *) RelinquishMagickMemory(inline_image);
  return(image);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r I N L I N E I m a g e                                     %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterINLINEImage() adds attributes for the INLINE image format to
%  the list of supported formats.  The attributes include the image format
%  tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterINLINEImage method is:
%
%      size_t RegisterINLINEImage(void)
%
*/
ModuleExport size_t RegisterINLINEImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("INLINE","DATA","Base64-encoded inline images");
  entry->decoder=(DecodeImageHandler *) ReadINLINEImage;
  entry->encoder=(EncodeImageHandler *) WriteINLINEImage;
  entry->format_type=ImplicitFormatType;
  (void) RegisterMagickInfo(entry);
  entry=AcquireMagickInfo("INLINE","INLINE","Base64-encoded inline images");
  entry->decoder=(DecodeImageHandler *) ReadINLINEImage;
  entry->encoder=(EncodeImageHandler *) WriteINLINEImage;
  entry->format_type=ImplicitFormatType;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r I N L I N E I m a g e                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterINLINEImage() removes format registrations made by the
%  INLINE module from the list of supported formats.
%
%  The format of the UnregisterINLINEImage method is:
%
%      UnregisterINLINEImage(void)
%
*/
ModuleExport void UnregisterINLINEImage(void)
{
  (void) UnregisterMagickInfo("INLINE");
  (void) UnregisterMagickInfo("DATA");
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e I N L I N E I m a g e                                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  WriteINLINEImage() writes an image to a file in INLINE format (Base64).
%
%  The format of the WriteINLINEImage method is:
%
%      MagickBooleanType WriteINLINEImage(const ImageInfo *image_info,
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
static MagickBooleanType WriteINLINEImage(const ImageInfo *image_info,
  Image *image,ExceptionInfo *exception)
{
  char
    *base64,
    message[MagickPathExtent];

  const MagickInfo
    *magick_info;

  Image
    *write_image;

  ImageInfo
    *write_info;

  MagickBooleanType
    status;

  size_t
    blob_length,
    encode_length;

  unsigned char
    *blob;

  /*
    Convert image to base64-encoding.
  */
  assert(image_info != (const ImageInfo *) NULL);
  assert(image_info->signature == MagickCoreSignature);
  assert(image != (Image *) NULL);
  assert(image->signature == MagickCoreSignature);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",image->filename);
  write_info=CloneImageInfo(image_info);
  (void) SetImageInfo(write_info,1,exception);
  if (LocaleCompare(write_info->magick,"INLINE") == 0)
    (void) CopyMagickString(write_info->magick,image->magick,MagickPathExtent);
  magick_info=GetMagickInfo(write_info->magick,exception);
  if ((magick_info == (const MagickInfo *) NULL) ||
      (GetMagickMimeType(magick_info) == (const char *) NULL))
    {
      write_info=DestroyImageInfo(write_info);
      ThrowWriterException(CorruptImageError,"ImageTypeNotSupported");
    }
  (void) CopyMagickString(image->filename,write_info->filename,
    MagickPathExtent);
  status=OpenBlob(image_info,image,WriteBinaryBlobMode,exception);
  if (status == MagickFalse)
    {
      write_info=DestroyImageInfo(write_info);
      return(status);
    }
  blob_length=2048;
  write_image=CloneImage(image,0,0,MagickTrue,exception);
  if (write_image == (Image *) NULL)
    {
      write_info=DestroyImageInfo(write_info);
      (void) CloseBlob(image);
      return(MagickTrue);
    }
  blob=(unsigned char *) ImageToBlob(write_info,write_image,&blob_length,
    exception);
  write_image=DestroyImage(write_image);
  write_info=DestroyImageInfo(write_info);
  if (blob == (unsigned char *) NULL)
    return(MagickFalse);
  encode_length=0;
  base64=Base64Encode(blob,blob_length,&encode_length);
  blob=(unsigned char *) RelinquishMagickMemory(blob);
  if (base64 == (char *) NULL)
    ThrowWriterException(ResourceLimitError,"MemoryAllocationFailed");
  /*
    Write base64-encoded image.
  */
  (void) FormatLocaleString(message,MagickPathExtent,"data:%s;base64,",
    GetMagickMimeType(magick_info));
  (void) WriteBlobString(image,message);
  (void) WriteBlobString(image,base64);
  base64=DestroyString(base64);
  if (CloseBlob(image) == MagickFalse)
    status=MagickFalse;
  return(status);
}
```

--------------------------------------------------------------------------------

---[FILE: inline.h]---
Location: ImageMagick-main/coders/inline.h

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

#define MagickINLINEHeaders

#define MagickINLINEAliases \
  MagickCoderAlias("INLINE", "DATA")

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(INLINE)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

````

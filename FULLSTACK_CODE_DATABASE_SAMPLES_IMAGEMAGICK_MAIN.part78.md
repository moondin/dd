---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 78
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 78 of 851)

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

---[FILE: null.c]---
Location: ImageMagick-main/coders/null.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                        N   N  U   U  L      L                               %
%                        NN  N  U   U  L      L                               %
%                        N N N  U   U  L      L                               %
%                        N  NN  U   U  L      L                               %
%                        N   N   UUU   LLLLL  LLLLL                           %
%                                                                             %
%                                                                             %
%                    Read/Write Image Of Uniform Color.                       %
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
#include "MagickCore/color-private.h"
#include "MagickCore/colorspace-private.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/image.h"
#include "MagickCore/image-private.h"
#include "MagickCore/list.h"
#include "MagickCore/magick.h"
#include "MagickCore/memory_.h"
#include "MagickCore/pixel-accessor.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/static.h"
#include "MagickCore/string_.h"
#include "MagickCore/module.h"

/*
  Forward declarations.
*/
static MagickBooleanType
  WriteNULLImage(const ImageInfo *,Image *,ExceptionInfo *)
    magick_attribute((__pure__));

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d N U L L I m a g e                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadNULLImage creates a constant image and initializes it to the
%  X server color as specified by the filename.  It allocates the memory
%  necessary for the new Image structure and returns a pointer to the new
%  image.
%
%  The format of the ReadNULLImage method is:
%
%      Image *ReadNULLImage(const ImageInfo *image_info,
%        ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static Image *ReadNULLImage(const ImageInfo *image_info,
  ExceptionInfo *exception)
{
  Image
    *image;

  MagickBooleanType
    status;

  PixelInfo
    background;

  ssize_t
    x;

  Quantum
    *q;

  ssize_t
    y;

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
  image=AcquireImage(image_info,exception);
  if (image->columns == 0)
    image->columns=1;
  if (image->rows == 0)
    image->rows=1;
  image->alpha_trait=BlendPixelTrait;
  status=SetImageExtent(image,image->columns,image->rows,exception);
  if (status == MagickFalse)
    return(DestroyImageList(image));
  ConformPixelInfo(image,&image->background_color,&background,exception);
  background.alpha=(double) TransparentAlpha;
  for (y=0; y < (ssize_t) image->rows; y++)
  {
    q=QueueAuthenticPixels(image,0,y,image->columns,1,exception);
    if (q == (Quantum *) NULL)
      break;
    for (x=0; x < (ssize_t) image->columns; x++)
    {
      SetPixelViaPixelInfo(image,&background,q);
      q+=(ptrdiff_t) GetPixelChannels(image);
    }
    if (SyncAuthenticPixels(image,exception) == MagickFalse)
      break;
  }
  return(GetFirstImageInList(image));
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r N U L L I m a g e                                         %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterNULLImage() adds attributes for the NULL image format to
%  the list of supported formats.  The attributes include the image format
%  tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterNULLImage method is:
%
%      size_t RegisterNULLImage(void)
%
*/
ModuleExport size_t RegisterNULLImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("NULL","NULL","Constant image of uniform color");
  entry->decoder=(DecodeImageHandler *) ReadNULLImage;
  entry->encoder=(EncodeImageHandler *) WriteNULLImage;
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
%   U n r e g i s t e r N U L L I m a g e                                     %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterNULLImage() removes format registrations made by the
%  NULL module from the list of supported formats.
%
%  The format of the UnregisterNULLImage method is:
%
%      UnregisterNULLImage(void)
%
*/
ModuleExport void UnregisterNULLImage(void)
{
  (void) UnregisterMagickInfo("NULL");
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e N U L L I m a g e                                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  WriteNULLImage writes no output at all. It is useful when specified
%  as an output format when profiling.
%
%  The format of the WriteNULLImage method is:
%
%      MagickBooleanType WriteNULLImage(const ImageInfo *image_info,
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
static MagickBooleanType WriteNULLImage(const ImageInfo *image_info,
  Image *image,ExceptionInfo *exception)
{
  assert(image_info != (const ImageInfo *) NULL);
  assert(image_info->signature == MagickCoreSignature);
  assert(image != (Image *) NULL);
  assert(image->signature == MagickCoreSignature);
  assert(exception != (ExceptionInfo *) NULL);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",image->filename);
  (void) image_info;
  (void) exception;
  return(MagickTrue);
}
```

--------------------------------------------------------------------------------

---[FILE: null.h]---
Location: ImageMagick-main/coders/null.h

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

#define MagickNULLHeaders

#define MagickNULLAliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(NULL)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: ora.c]---
Location: ImageMagick-main/coders/ora.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                              OOO   RRRR    AAA                              %
%                             O   O  R   R  A   A                             %
%                             O   O  RRRR   AAAAA                             %
%                             O   O  R  R   A   A                             %
%                              OOO   R   R  A   A                             %
%                                                                             %
%                                                                             %
%                       Read OpenRaster (.ora) files                          %
%                                                                             %
%                             OpenRaster spec:                                %
%         https://www.freedesktop.org/wiki/Specifications/OpenRaster/         %
%                                                                             %
%                                Implementer                                  %
%                           Christopher Chianelli                             %
%                                August 2020                                  %
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
#include "MagickCore/constitute.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/image.h"
#include "MagickCore/image-private.h"
#include "MagickCore/list.h"
#include "MagickCore/magick.h"
#include "MagickCore/memory_.h"
#include "MagickCore/module.h"
#include "MagickCore/nt-base-private.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/static.h"
#include "MagickCore/resource_.h"
#include "MagickCore/string_.h"
#include "MagickCore/utility.h"

#if defined(MAGICKCORE_ZIP_DELEGATE)
#include <zip.h>
#endif

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d O R A I m a g e                                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadORAImage reads an ORA file in the most basic way possible: by
%  reading it as a ZIP File and extracting the mergedimage.png file from it,
%  which is then passed to ReadPNGImage.
%
%  https://www.freedesktop.org/wiki/Specifications/OpenRaster/Draft/FileLayout/
%
%  The format of the ReadORAImage method is:
%
%      Image *ReadORAImage(const ImageInfo *image_info,ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#if defined(MAGICKCORE_PNG_DELEGATE) && defined(MAGICKCORE_ZIP_DELEGATE)
static Image *ReadORAImage(const ImageInfo *image_info,
  ExceptionInfo *exception)
{
  char
    image_data_buffer[8192];

  const char
    *MERGED_IMAGE_PATH = "mergedimage.png";

  FILE
    *file;

  Image
    *image_metadata,
    *out_image;

  ImageInfo
    *read_info;

  int
    unique_file,
    zip_error;

  MagickBooleanType
    status;

  struct stat
    stat_info;

  zip_t
    *zip_archive;

  zip_file_t
    *merged_image_file;

  zip_int64_t
    read_bytes;

  zip_uint64_t
    offset;

  image_metadata=AcquireImage(image_info,exception);
  read_info=CloneImageInfo(image_info);
  SetImageInfoBlob(read_info,(void *) NULL,0);
  (void) stat(image_info->filename,&stat_info);
  zip_archive=zip_open(image_info->filename,ZIP_RDONLY,&zip_error);
  if (zip_archive == NULL)
    {
      ThrowFileException(exception,FileOpenError,"UnableToOpenFile",
        image_info->filename);
      read_info=DestroyImageInfo(read_info);
      image_metadata=DestroyImage(image_metadata);
      return((Image *) NULL);
    }
  merged_image_file=zip_fopen(zip_archive,MERGED_IMAGE_PATH,ZIP_FL_UNCHANGED);
  if (merged_image_file == NULL)
    {
      ThrowFileException(exception,FileOpenError,"UnableToOpenFile",
        image_info->filename);
      read_info=DestroyImageInfo(read_info);
      image_metadata=DestroyImage(image_metadata);
      zip_discard(zip_archive);
      return((Image *) NULL);
    }
  /* Get a temporary file to write the mergedimage.png of the ZIP to */
  (void) CopyMagickString(read_info->magick,"PNG",MagickPathExtent);
  unique_file=AcquireUniqueFileResource(read_info->unique);
  (void) CopyMagickString(read_info->filename,read_info->unique,
    MagickPathExtent);
  file=(FILE *) NULL;
  if (unique_file != -1)
    file=fdopen(unique_file,"wb");
  if ((unique_file == -1) || (file == (FILE *) NULL))
    {
      ThrowFileException(exception,FileOpenError,"UnableToCreateTemporaryFile",
        read_info->filename);
      if (unique_file != -1)
        (void) RelinquishUniqueFileResource(read_info->filename);
      read_info=DestroyImageInfo(read_info);
      image_metadata=DestroyImage(image_metadata);
      zip_fclose(merged_image_file);
      zip_discard(zip_archive);
      return((Image *) NULL);
    }
  /* Write the uncompressed mergedimage.png to the temporary file */
  status=MagickTrue;
  offset=0;
  while (status != MagickFalse)
  {
    read_bytes=zip_fread(merged_image_file,image_data_buffer+offset,
      sizeof(image_data_buffer)-offset);
    if (read_bytes == -1)
      status=MagickFalse;
    else if (read_bytes == 0)
      {
        /* Write up to offset of image_data_buffer to temp file */
        if (!fwrite(image_data_buffer,1,(size_t) offset,file))
          status=MagickFalse;
        break;
      }
    else if (read_bytes == (ssize_t) (sizeof(image_data_buffer)-offset))
      {
        /* Write the entirely of image_data_buffer to temp file */
        if (!fwrite(image_data_buffer,1,sizeof(image_data_buffer),file))
          status=MagickFalse;
        else
          offset=0;
      }
    else
      offset+=(zip_uint64_t) read_bytes;
  }
  (void) fclose(file);
  (void) zip_fclose(merged_image_file);
  (void) zip_discard(zip_archive);
  if (status == MagickFalse)
    {
      ThrowFileException(exception,CoderError,"UnableToReadImageData",
          read_info->filename);
      (void) RelinquishUniqueFileResource(read_info->filename);
      read_info=DestroyImageInfo(read_info);
      image_metadata=DestroyImage(image_metadata);
      return((Image *) NULL);
    }
  /* Delegate to ReadImage to read mergedimage.png */
  out_image=ReadImage(read_info,exception);
  (void) RelinquishUniqueFileResource(read_info->filename);
  read_info=DestroyImageInfo(read_info);
  /* Update fields of image from fields of png_image */
  if (out_image != NULL)
    {
      (void) CopyMagickString(out_image->filename,image_metadata->filename,
        MagickPathExtent);
      (void) CopyMagickString(out_image->magick_filename,
        image_metadata->magick_filename,MagickPathExtent);
      out_image->timestamp=time(&stat_info.st_mtime);
      (void) CopyMagickString(out_image->magick,image_metadata->magick,
        MagickPathExtent);
      out_image->extent=(MagickSizeType) stat_info.st_size;
    }
  image_metadata=DestroyImage(image_metadata);
  return(out_image);
}
#endif /* MAGICKCORE_ZIP_DELEGATE && MAGICKCORE_PNG_DELEGATE */

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r O R A I m a g e                                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterORAImage() adds attributes for the ORA image format to
%  the list of supported formats.  The attributes include the image format
%  tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterORAImage method is:
%
%      size_t RegisterORAImage(void)
%
*/
ModuleExport size_t RegisterORAImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("ORA","ORA","OpenRaster format");

#if defined(MAGICKCORE_ZIP_DELEGATE) && defined(MAGICKCORE_PNG_DELEGATE)
  entry->decoder=(DecodeImageHandler *) ReadORAImage;
#endif
  entry->flags^=CoderBlobSupportFlag;
  entry->flags|=CoderDecoderSeekableStreamFlag;
  entry->format_type=ExplicitFormatType;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r O R A I m a g e                                       %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterORAImage() removes format registrations made by the
%  ORA module from the list of supported formats.
%
%  The format of the UnregisterORAImage method is:
%
%      UnregisterORAImage(void)
%
*/
ModuleExport void UnregisterORAImage(void)
{
  (void) UnregisterMagickInfo("ORA");
}
```

--------------------------------------------------------------------------------

---[FILE: ora.h]---
Location: ImageMagick-main/coders/ora.h

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
#define MagickORAHeaders

#define MagickORAAliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(ORA)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: otb.c]---
Location: ImageMagick-main/coders/otb.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                              OOO   TTTTT  BBBB                              %
%                             O   O    T    B   B                             %
%                             O   O    T    BBBB                              %
%                             O   O    T    B   B                             %
%                              OOO     T    BBBB                              %
%                                                                             %
%                                                                             %
%                      Read/Write On-The-Air Image Format                     %
%                                                                             %
%                              Software Design                                %
%                                   Cristy                                    %
%                               January 2000                                  %
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
#include "MagickCore/pixel-accessor.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/static.h"
#include "MagickCore/string_.h"
#include "MagickCore/module.h"

/*
  Forward declarations.
*/
static MagickBooleanType
  WriteOTBImage(const ImageInfo *,Image *,ExceptionInfo *);

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d O T B I m a g e                                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadOTBImage() reads a on-the-air (level 0) bitmap and returns it.  It
%  allocates the memory necessary for the new Image structure and returns a
%  pointer to the new image.
%
%  The format of the ReadOTBImage method is:
%
%      Image *ReadOTBImage(const ImageInfo *image_info,ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
%
*/
static Image *ReadOTBImage(const ImageInfo *image_info,ExceptionInfo *exception)
{
#define GetBit(a,i) (((a) >> (i)) & 1L)

  Image
    *image;

  int
    byte;

  MagickBooleanType
    status;

  ssize_t
    x;

  Quantum
    *q;

  ssize_t
    y;

  unsigned char
    bit,
    info,
    depth;

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
    Initialize image structure.
  */
  info=(unsigned char) ReadBlobByte(image);
  if (GetBit(info,4) == 0)
    {
      image->columns=(size_t) ReadBlobByte(image);
      image->rows=(size_t) ReadBlobByte(image);
    }
  else
    {
      image->columns=(size_t) ReadBlobMSBShort(image);
      image->rows=(size_t) ReadBlobMSBShort(image);
    }
  if ((image->columns == 0) || (image->rows == 0))
    ThrowReaderException(CorruptImageError,"ImproperImageHeader");
  depth=(unsigned char) ReadBlobByte(image);
  if (depth != 1)
    ThrowReaderException(CoderError,"OnlyLevelZerofilesSupported");
  if (AcquireImageColormap(image,2,exception) == MagickFalse)
    ThrowReaderException(ResourceLimitError,"MemoryAllocationFailed");
  if (image_info->ping != MagickFalse)
    {
      (void) CloseBlob(image);
      return(GetFirstImageInList(image));
    }
  status=SetImageExtent(image,image->columns,image->rows,exception);
  if (status == MagickFalse)
    return(DestroyImageList(image));
  /*
    Convert bi-level image to pixel packets.
  */
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
        {
          byte=ReadBlobByte(image);
          if (byte == EOF)
            ThrowReaderException(CorruptImageError,"CorruptImage");
        }
      SetPixelIndex(image,(Quantum) ((byte & (0x01 << (7-bit))) ? 0x00 : 0x01),q);
      bit++;
      if (bit == 8)
        bit=0;
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
  (void) SyncImage(image,exception);
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
%   R e g i s t e r O T B I m a g e                                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterOTBImage() adds attributes for the OTB image format to
%  the list of supported formats.  The attributes include the image format
%  tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterOTBImage method is:
%
%      size_t RegisterOTBImage(void)
%
*/
ModuleExport size_t RegisterOTBImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("OTB","OTB","On-the-air bitmap");
  entry->decoder=(DecodeImageHandler *) ReadOTBImage;
  entry->encoder=(EncodeImageHandler *) WriteOTBImage;
  entry->flags^=CoderAdjoinFlag;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r O T B I m a g e                                       %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterOTBImage() removes format registrations made by the
%  OTB module from the list of supported formats.
%
%  The format of the UnregisterOTBImage method is:
%
%      UnregisterOTBImage(void)
%
*/
ModuleExport void UnregisterOTBImage(void)
{
  (void) UnregisterMagickInfo("OTB");
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e O T B I m a g e                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  WriteOTBImage() writes an image to a file in the On-the-air Bitmap
%  (level 0) image format.
%
%  The format of the WriteOTBImage method is:
%
%      MagickBooleanType WriteOTBImage(const ImageInfo *image_info,
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
static MagickBooleanType WriteOTBImage(const ImageInfo *image_info,Image *image,
  ExceptionInfo *exception)
{
#define SetBit(a,i,set) \
  a=(unsigned char) ((set) ? (a) | (1L << (i)) : (a) & ~(1L << (i)))

  MagickBooleanType
    status;

  const Quantum
    *p;

  ssize_t
    x;

  ssize_t
    y;

  unsigned char
    bit,
    byte,
    info;

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
    Convert image to a bi-level image.
  */
  (void) SetImageType(image,BilevelType,exception);
  info=0;
  if ((image->columns >= 256) || (image->rows >= 256))
    SetBit(info,4,1);
  (void) WriteBlobByte(image,info);
  if ((image->columns >= 256) || (image->rows >= 256))
    {
      (void) WriteBlobMSBShort(image,(unsigned short) image->columns);
      (void) WriteBlobMSBShort(image,(unsigned short) image->rows);
    }
  else
    {
      (void) WriteBlobByte(image,(unsigned char) image->columns);
      (void) WriteBlobByte(image,(unsigned char) image->rows);
    }
  (void) WriteBlobByte(image,1);  /* depth */
  for (y=0; y < (ssize_t) image->rows; y++)
  {
    p=GetVirtualPixels(image,0,y,image->columns,1,exception);
    if (p == (const Quantum *) NULL)
      break;
    bit=0;
    byte=0;
    for (x=0; x < (ssize_t) image->columns; x++)
    {
      if (GetPixelLuma(image,p) < ((double) QuantumRange/2.0))
        byte|=0x1 << (7-bit);
      bit++;
      if (bit == 8)
        {
          (void) WriteBlobByte(image,byte);
          bit=0;
          byte=0;
        }
      p+=(ptrdiff_t) GetPixelChannels(image);
    }
    if (bit != 0)
      (void) WriteBlobByte(image,byte);
    if (image->previous == (Image *) NULL)
      {
        status=SetImageProgress(image,SaveImageTag,(MagickOffsetType) y,
          image->rows);
        if (status == MagickFalse)
          break;
      }
  }
  if (CloseBlob(image) == MagickFalse)
    status=MagickFalse;
  return(status);
}
```

--------------------------------------------------------------------------------

---[FILE: otb.h]---
Location: ImageMagick-main/coders/otb.h

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

#define MagickOTBHeaders

#define MagickOTBAliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(OTB)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

````

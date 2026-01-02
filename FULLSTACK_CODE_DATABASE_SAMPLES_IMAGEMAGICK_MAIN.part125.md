---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 125
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 125 of 851)

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

---[FILE: uil.c]---
Location: ImageMagick-main/coders/uil.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                            U   U  IIIII  L                                  %
%                            U   U    I    L                                  %
%                            U   U    I    L                                  %
%                            U   U    I    L                                  %
%                             UUU   IIIII  LLLLL                              %
%                                                                             %
%                                                                             %
%                          Write X-Motif UIL Table.                           %
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
#include "MagickCore/colorspace.h"
#include "MagickCore/colorspace-private.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/image-private.h"
#include "MagickCore/magick.h"
#include "MagickCore/memory_.h"
#include "MagickCore/monitor.h"
#include "MagickCore/monitor-private.h"
#include "MagickCore/pixel-accessor.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/static.h"
#include "MagickCore/string_.h"
#include "MagickCore/module.h"
#include "MagickCore/utility.h"

/*
  Forward declarations.
*/
static MagickBooleanType
  WriteUILImage(const ImageInfo *,Image *,ExceptionInfo *);

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r U I L I m a g e                                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterUILImage() adds attributes for the UIL image format to
%  the list of supported formats.  The attributes include the image format
%  tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterUILImage method is:
%
%      size_t RegisterUILImage(void)
%
*/
ModuleExport size_t RegisterUILImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("UIL","UIL","X-Motif UIL table");
  entry->encoder=(EncodeImageHandler *) WriteUILImage;
  entry->flags^=CoderAdjoinFlag;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r U I L I m a g e                                       %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterUILImage() removes format registrations made by the
%  UIL module from the list of supported formats.
%
%  The format of the UnregisterUILImage method is:
%
%      UnregisterUILImage(void)
%
*/
ModuleExport void UnregisterUILImage(void)
{
  (void) UnregisterMagickInfo("UIL");
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e U I L I m a g e                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  Procedure WriteUILImage() writes an image to a file in the X-Motif UIL table
%  format.
%
%  The format of the WriteUILImage method is:
%
%      MagickBooleanType WriteUILImage(const ImageInfo *image_info,
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
static MagickBooleanType WriteUILImage(const ImageInfo *image_info,Image *image,
  ExceptionInfo *exception)
{
#define MaxCixels  92

  char
    basename[MagickPathExtent],
    buffer[MagickPathExtent],
    name[MagickPathExtent],
    *symbol;

  int
    j;

  MagickBooleanType
    status,
    transparent;

  MagickSizeType
    number_pixels;

  PixelInfo
    pixel;

  const Quantum
    *p;

  ssize_t
    i,
    x;

  size_t
    characters_per_pixel,
    colors;

  ssize_t
    k,
    y;

  static const char
    Cixel[MaxCixels+1] = " .XoO+@#$%&*=-;:>,<1234567890qwertyuipasdfghjk"
                         "lzxcvbnmMNBVCZASDFGHJKLPIUYTREWQ!~^/()_`'][{}|";

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
  transparent=MagickFalse;
  i=0;
  p=(const Quantum *) NULL;
  if (image->storage_class == PseudoClass)
    colors=image->colors;
  else
    {
      unsigned char
        *matte_image;

      /*
        Convert DirectClass to PseudoClass image.
      */
      matte_image=(unsigned char *) NULL;
      if (image->alpha_trait != UndefinedPixelTrait)
        {
          /*
            Map all the transparent pixels.
          */
          number_pixels=(MagickSizeType) image->columns*image->rows;
          if (number_pixels != ((MagickSizeType) (size_t) number_pixels))
            ThrowWriterException(ResourceLimitError,"MemoryAllocationFailed");
          matte_image=(unsigned char *) AcquireQuantumMemory(image->columns,
            image->rows*sizeof(*matte_image));
          if (matte_image == (unsigned char *) NULL)
            ThrowWriterException(ResourceLimitError,"MemoryAllocationFailed");
          for (y=0; y < (ssize_t) image->rows; y++)
          {
            p=GetVirtualPixels(image,0,y,image->columns,1,exception);
            if (p == (const Quantum *) NULL)
              break;
            for (x=0; x < (ssize_t) image->columns; x++)
            {
              matte_image[i]=(unsigned char) (GetPixelAlpha(image,p) ==
                (Quantum) TransparentAlpha ? 1 : 0);
              if (matte_image[i] != 0)
                transparent=MagickTrue;
              i++;
              p+=(ptrdiff_t) GetPixelChannels(image);
            }
          }
        }
      (void) SetImageType(image,PaletteType,exception);
      colors=image->colors;
      if (transparent != MagickFalse)
        {
          Quantum
            *q;

          i=0;
          colors++;
          for (y=0; y < (ssize_t) image->rows; y++)
          {
            q=GetAuthenticPixels(image,0,y,image->columns,1,exception);
            if (q == (Quantum *) NULL)
              break;
            for (x=0; x < (ssize_t) image->columns; x++)
            {
              if (matte_image[i] != 0)
                SetPixelIndex(image,(Quantum) image->colors,q);
              i++;
              q+=(ptrdiff_t) GetPixelChannels(image);
            }
          }
        }
      if (matte_image != (unsigned char *) NULL)
        matte_image=(unsigned char *) RelinquishMagickMemory(matte_image);
    }
  /*
    Compute the character per pixel.
  */
  characters_per_pixel=1;
  for (k=MaxCixels; (ssize_t) colors > k; k*=MaxCixels)
    characters_per_pixel++;
  /*
    UIL header.
  */
  symbol=AcquireString("");
  (void) WriteBlobString(image,"/* UIL */\n");
  GetPathComponent(image->filename,BasePath,basename);
  (void) FormatLocaleString(buffer,MagickPathExtent,
    "value\n  %s_ct : color_table(\n",basename);
  (void) WriteBlobString(image,buffer);
  GetPixelInfo(image,&pixel);
  for (i=0; i < (ssize_t) colors; i++)
  {
    /*
      Define UIL color.
    */
    pixel=image->colormap[i];
    pixel.colorspace=sRGBColorspace;
    pixel.depth=8;
    pixel.alpha=(double) OpaqueAlpha;
    GetColorTuple(&pixel,MagickTrue,name);
    if (transparent != MagickFalse)
      if (i == (ssize_t) (colors-1))
        (void) CopyMagickString(name,"None",MagickPathExtent);
    /*
      Write UIL color.
    */
    k=i % MaxCixels;
    symbol[0]=Cixel[k];
    for (j=1; j < (int) characters_per_pixel; j++)
    {
      k=((i-k)/MaxCixels) % MaxCixels;
      symbol[j]=Cixel[k];
    }
    symbol[j]='\0';
    (void) SubstituteString(&symbol,"'","''");
    if (LocaleCompare(name,"None") == 0)
      (void) FormatLocaleString(buffer,MagickPathExtent,
        "    background color = '%s'",symbol);
    else
      (void) FormatLocaleString(buffer,MagickPathExtent,
        "    color('%s',%s) = '%s'",name,
        GetPixelInfoIntensity(image,image->colormap+i) <
        ((double) QuantumRange/2.0) ? "background" : "foreground",symbol);
    (void) WriteBlobString(image,buffer);
    (void) FormatLocaleString(buffer,MagickPathExtent,"%s",
      (i == (ssize_t) (colors-1) ? ");\n" : ",\n"));
    (void) WriteBlobString(image,buffer);
  }
  /*
    Define UIL pixels.
  */
  GetPathComponent(image->filename,BasePath,basename);
  (void) FormatLocaleString(buffer,MagickPathExtent,
    "  %s_icon : icon(color_table = %s_ct,\n",basename,basename);
  (void) WriteBlobString(image,buffer);
  for (y=0; y < (ssize_t) image->rows; y++)
  {
    p=GetVirtualPixels(image,0,y,image->columns,1,exception);
    if (p == (const Quantum *) NULL)
      break;
    (void) WriteBlobString(image,"    \"");
    for (x=0; x < (ssize_t) image->columns; x++)
    {
      k=((ssize_t) GetPixelIndex(image,p) % MaxCixels);
      symbol[0]=Cixel[k];
      for (j=1; j < (int) characters_per_pixel; j++)
      {
        k=(((int) GetPixelIndex(image,p)-k)/MaxCixels) %
          MaxCixels;
        symbol[j]=Cixel[k];
      }
      symbol[j]='\0';
      (void) CopyMagickString(buffer,symbol,MagickPathExtent);
      (void) WriteBlobString(image,buffer);
      p+=(ptrdiff_t) GetPixelChannels(image);
    }
    (void) FormatLocaleString(buffer,MagickPathExtent,"\"%s\n",
      (y == (ssize_t) (image->rows-1) ? ");" : ","));
    (void) WriteBlobString(image,buffer);
    status=SetImageProgress(image,SaveImageTag,(MagickOffsetType) y,
      image->rows);
    if (status == MagickFalse)
      break;
  }
  symbol=DestroyString(symbol);
  if (CloseBlob(image) == MagickFalse)
    status=MagickFalse;
  return(status);
}
```

--------------------------------------------------------------------------------

---[FILE: uil.h]---
Location: ImageMagick-main/coders/uil.h

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

#define MagickUILHeaders

#define MagickUILAliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(UIL)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: url.c]---
Location: ImageMagick-main/coders/url.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                            U   U  RRRR   L                                  %
%                            U   U  R   R  L                                  %
%                            U   U  RRRR   L                                  %
%                            U   U  R R    L                                  %
%                             UUU   R  R   LLLLL                              %
%                                                                             %
%                                                                             %
%                        Retrieve An Image Via URL.                           %
%                                                                             %
%                              Software Design                                %
%                                   Cristy                                    %
%                              Bill Radcliffe                                 %
%                                March 2000                                   %
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
#include "MagickCore/delegate.h"
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
#if defined(MAGICKCORE_WINDOWS_SUPPORT)
#  include <urlmon.h>
#  if !defined(__MINGW32__)
#    pragma comment(lib, "urlmon.lib")
#  endif
#endif

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d U R L I m a g e                                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadURLImage retrieves an image via URL, decodes the image, and returns
%  it.  It allocates the memory necessary for the new Image structure and
%  returns a pointer to the new image.
%
%  The format of the ReadURLImage method is:
%
%      Image *ReadURLImage(const ImageInfo *image_info,ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/

#if !defined(MAGICKCORE_WINDOWS_SUPPORT)
static Image* InvokeURLDelegate(ImageInfo* read_info,Image* image,
  const char *delegate,ExceptionInfo* exception)
{
  Image
    *images,
    *next;

  MagickBooleanType
    status;

  images=(Image *) NULL;
  status=InvokeDelegate(read_info,image,delegate,(char *) NULL,
    exception);
  if (status != MagickFalse)
    {
      (void) FormatLocaleString(read_info->filename,MagickPathExtent,
        "%s.dat",read_info->unique);
      *read_info->magick='\0';
      images=ReadImage(read_info,exception);
      (void) RelinquishUniqueFileResource(read_info->filename);
      if (images != (Image *) NULL)
        for (next=images; next != (Image *) NULL; next=next->next)
          (void) CopyMagickString(next->filename,image->filename,
            MagickPathExtent);
    }
  return(images);
}
#endif

static Image *ReadURLImage(const ImageInfo *image_info,ExceptionInfo *exception)
{
  char
    filename[MagickPathExtent];

  FILE
    *file;

  Image
    *image,
    *images,
    *next;

  ImageInfo
    *read_info;

  int
    unique_file;

  images=(Image *) NULL;
  image=AcquireImage(image_info,exception);
  read_info=CloneImageInfo(image_info);
  SetImageInfoBlob(read_info,(void *) NULL,0);
#if !defined(MAGICKCORE_WINDOWS_SUPPORT)
  if (LocaleCompare(read_info->magick,"http") == 0)
    {
      images=InvokeURLDelegate(read_info,image,"http:decode",exception);
      read_info=DestroyImageInfo(read_info);
      image=DestroyImage(image);
      return(images);
    }
  if (LocaleCompare(read_info->magick,"https") == 0)
    {
      images=InvokeURLDelegate(read_info,image,"https:decode",exception);
      read_info=DestroyImageInfo(read_info);
      image=DestroyImage(image);
      return(images);
    }
#endif
  if (LocaleCompare(read_info->magick,"file") == 0)
    {
      (void) CopyMagickString(read_info->filename,image_info->filename+2,
        MagickPathExtent);
      *read_info->magick='\0';
      images=ReadImage(read_info,exception);
      read_info=DestroyImageInfo(read_info);
      image=DestroyImage(image);
      return(GetFirstImageInList(images));
    }
  file=(FILE *) NULL;
  unique_file=AcquireUniqueFileResource(read_info->filename);
  if (unique_file != -1)
    file=fdopen(unique_file,"wb");
  if ((unique_file == -1) || (file == (FILE *) NULL))
    {
      ThrowFileException(exception,FileOpenError,"UnableToCreateTemporaryFile",
        read_info->filename);
      read_info=DestroyImageInfo(read_info);
      image=DestroyImage(image);
      return((Image *) NULL);
    }
  (void) CopyMagickString(filename,image_info->magick,MagickPathExtent);
  (void) ConcatenateMagickString(filename,":",MagickPathExtent);
  LocaleLower(filename);
  (void) ConcatenateMagickString(filename,image_info->filename,
    MagickPathExtent);
#if defined(MAGICKCORE_WINDOWS_SUPPORT)
  (void) fclose(file);
  if (URLDownloadToFile(NULL,filename,read_info->filename,0,NULL) != S_OK)
    {
      ThrowFileException(exception,FileOpenError,"UnableToOpenFile",
        filename);
      (void) RelinquishUniqueFileResource(read_info->filename);
      read_info=DestroyImageInfo(read_info);
      image=DestroyImage(image);
      return((Image *) NULL);
    }
#else
  (void) fclose(file);
#endif
  *read_info->magick='\0';
  images=ReadImage(read_info,exception);
  (void) RelinquishUniqueFileResource(read_info->filename);
  if (images != (Image *) NULL)
    for (next=images; next != (Image *) NULL; next=next->next)
      (void) CopyMagickString(next->filename,image->filename,MagickPathExtent);
  read_info=DestroyImageInfo(read_info);
  image=DestroyImage(image);
  if (images != (Image *) NULL)
    GetPathComponent(image_info->filename,TailPath,images->filename);
  else
    {
      (void) ThrowMagickException(exception,GetMagickModule(),CoderError,
        "NoDataReturned","`%s'",filename);
      return((Image *) NULL);
    }
  return(GetFirstImageInList(images));
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r U R L I m a g e                                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterURLImage() adds attributes for the URL image format to
%  the list of supported formats.  The attributes include the image format
%  tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterURLImage method is:
%
%      size_t RegisterURLImage(void)
%
*/
ModuleExport size_t RegisterURLImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("URL","HTTP","Uniform Resource Locator (http://)");
  entry->decoder=(DecodeImageHandler *) ReadURLImage;
  entry->format_type=ImplicitFormatType;
  (void) RegisterMagickInfo(entry);
  entry=AcquireMagickInfo("URL","HTTPS","Uniform Resource Locator (https://)");
  entry->decoder=(DecodeImageHandler *) ReadURLImage;
  entry->format_type=ImplicitFormatType;
  (void) RegisterMagickInfo(entry);
  entry=AcquireMagickInfo("URL","FTP","Uniform Resource Locator (ftp://)");
#if defined(MAGICKCORE_WINDOWS_SUPPORT)
  entry->decoder=(DecodeImageHandler *) ReadURLImage;
#endif
  entry->format_type=ImplicitFormatType;
  (void) RegisterMagickInfo(entry);
  entry=AcquireMagickInfo("URL","FILE","Uniform Resource Locator (file://)");
  entry->decoder=(DecodeImageHandler *) ReadURLImage;
  entry->format_type=ImplicitFormatType;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r U R L I m a g e                                       %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterURLImage() removes format registrations made by the
%  URL module from the list of supported formats.
%
%  The format of the UnregisterURLImage method is:
%
%      UnregisterURLImage(void)
%
*/
ModuleExport void UnregisterURLImage(void)
{
  (void) UnregisterMagickInfo("HTTP");
  (void) UnregisterMagickInfo("FTP");
  (void) UnregisterMagickInfo("FILE");
}
```

--------------------------------------------------------------------------------

---[FILE: url.h]---
Location: ImageMagick-main/coders/url.h

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

#define MagickURLHeaders

#define MagickURLAliases \
  MagickCoderAlias("URL", "HTTP") \
  MagickCoderAlias("URL", "HTTPS") \
  MagickCoderAlias("URL", "FTP") \
  MagickCoderAlias("URL", "FILE")

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(URL)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

````

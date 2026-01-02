---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 62
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 62 of 851)

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

---[FILE: jxl.h]---
Location: ImageMagick-main/coders/jxl.h

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

#define MagickJXLHeaders \
  MagickCoderHeader("JXL", 0, "\xff\x0a") \
  MagickCoderHeader("JXL", 0, "\x00\x00\x00\x0c\x4a\x58\x4c\x20\x0d\x0a\x87\x0a")

#define MagickJXLAliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(JXL)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: kernel.c]---
Location: ImageMagick-main/coders/kernel.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                  K   K  EEEEE  RRRR   N   N  EEEEE  L                       %
%                  K  K   E      R   R  NN  N  E      L                       %
%                  KKK    EEE    RRRR   N N N  EEE    L                       %
%                  K  K   E      R R    N  NN  E      L                       %
%                  K   K  EEEEE  R  R   N   N  EEEEE  LLLLL                   %
%                                                                             %
%                                                                             %
%                     Write the Morphology Kernel Format                      %
%                                                                             %
%                              Software Design                                %
%                                   Cristy                                    %
%                                October 2020                                 %
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
%  Adapted from http://im.snibgo.com/customim.htm#img2knl.c.
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
  WriteKERNELImage(const ImageInfo *,Image *,ExceptionInfo *);

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r K E R N E L I m a g e                                     %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterKERNELImage() adds attributes for the KERNEL image format to the
%  list of supported formats.  The attributes include the image format tag, a
%  method to read and/or write the format, whether the format supports the
%  saving of more than one frame to the same file or blob, whether the format
%  supports native in-memory I/O, and a brief description of the format.
%
%  The format of the RegisterKERNELImage method is:
%
%      size_t RegisterKERNELImage(void)
%
*/
ModuleExport size_t RegisterKERNELImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("KERNEL","KERNEL","Morphology Kernel");
  entry->encoder=(EncodeImageHandler *) WriteKERNELImage;
  entry->flags^=CoderAdjoinFlag;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r K E R N E L I m a g e                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterKERNELImage() removes format registrations made by the
%  KERNEL module from the list of supported formats.
%
%  The format of the UnregisterKERNELImage method is:
%
%      UnregisterKERNELImage(void)
%
*/
ModuleExport void UnregisterKERNELImage(void)
{
  (void) UnregisterMagickInfo("KERNEL");
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   W r i t e K E R N E L I m a g e                                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  WriteKERNELImage() writes an image to a file in KERNEL image format.
%
%  The format of the WriteKERNELImage method is:
%
%      MagickBooleanType WriteKERNELImage(const ImageInfo *image_info,
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
static MagickBooleanType WriteKERNELImage(const ImageInfo *image_info,
  Image *image,ExceptionInfo *exception)
{
  char
    buffer[MagickPathExtent];

  MagickBooleanType
    status;

  ssize_t
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
  status=OpenBlob(image_info,image,WriteBinaryBlobMode,exception);
  if (status == MagickFalse)
    return(status);
  /*
    Write KERNEL header.
  */
  if (IssRGBCompatibleColorspace(image->colorspace) == MagickFalse)
    (void) TransformImageColorspace(image,sRGBColorspace,exception);
  (void) FormatLocaleString(buffer,MagickPathExtent,"%gx%g:",(double)
    image->columns,(double) image->rows);
  (void) WriteBlobString(image,buffer);
  /*
    Convert MIFF to KERNEL raster pixels.
  */
  for (y=0; y < (ssize_t) image->rows; y++)
  {
    const Quantum
      *magick_restrict p;

    ssize_t
      x;

    p=GetVirtualPixels(image,0,y,image->columns,1,exception);
    if (p == (const Quantum *) NULL)
      break;
    for (x=0; x < (ssize_t) image->columns; x++)
    {
      if ((x != 0) || (y != 0))
        (void) WriteBlobString(image,",");
      if (((image->alpha_trait != BlendPixelTrait) != 0) &&
          (GetPixelAlpha(image,p) < OpaqueAlpha/2))
        (void) WriteBlobString(image,"-");
      else
        {
          (void) FormatLocaleString(buffer,MagickPathExtent,"%.*g",
            GetMagickPrecision(),QuantumScale*GetPixelIntensity(image,p));
          (void) WriteBlobString(image,buffer);
        }
      p+=(ptrdiff_t) GetPixelChannels(image);
    }
    if (image->previous == (Image *) NULL)
      {
        status=SetImageProgress(image,SaveImageTag,(MagickOffsetType) y,
          image->rows);
        if (status == MagickFalse)
          break;
      }
  }
  (void) WriteBlobString(image,"\n");
  if (CloseBlob(image) == MagickFalse)
    status=MagickFalse;
  return(status);
}
```

--------------------------------------------------------------------------------

---[FILE: kernel.h]---
Location: ImageMagick-main/coders/kernel.h

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

#define MagickKERNELHeaders

#define MagickKERNELAliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(KERNEL)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: label.c]---
Location: ImageMagick-main/coders/label.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                     L       AAA   BBBB   EEEEE  L                           %
%                     L      A   A  B   B  E      L                           %
%                     L      AAAAA  BBBB   EEE    L                           %
%                     L      A   A  B   B  E      L                           %
%                     LLLLL  A   A  BBBB   EEEEE  LLLLL                       %
%                                                                             %
%                                                                             %
%                      Read ASCII String As An Image.                         %
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
#include "MagickCore/annotate.h"
#include "MagickCore/artifact.h"
#include "MagickCore/blob.h"
#include "MagickCore/blob-private.h"
#include "MagickCore/draw.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/image.h"
#include "MagickCore/image-private.h"
#include "MagickCore/list.h"
#include "MagickCore/magick.h"
#include "MagickCore/memory_.h"
#include "MagickCore/option.h"
#include "MagickCore/property.h"
#include "MagickCore/quantum-private.h"
#include "MagickCore/resource_.h"
#include "MagickCore/static.h"
#include "MagickCore/string_.h"
#include "MagickCore/string-private.h"
#include "MagickCore/module.h"
#include "MagickCore/utility.h"

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d L A B E L I m a g e                                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadLABELImage() reads a LABEL image file and returns it.  It
%  allocates the memory necessary for the new Image structure and returns a
%  pointer to the new image.
%
%  The format of the ReadLABELImage method is:
%
%      Image *ReadLABELImage(const ImageInfo *image_info,
%        ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/

static inline void AdjustTypeMetricBounds(TypeMetric *metrics)
{
  if (metrics->bounds.x1 >= 0.0)
    metrics->bounds.x1=0.0;
  else
    {
      double x1 = ceil(-metrics->bounds.x1+0.5);
      metrics->width+=x1+x1;
      metrics->bounds.x1=x1;
    }
}

static Image *ReadLABELImage(const ImageInfo *image_info,
  ExceptionInfo *exception)
{
  char
    geometry[MagickPathExtent],
    *label;

  DrawInfo
    *draw_info;

  Image
    *image;

  MagickBooleanType
    left_bearing,
    status;

  TypeMetric
    metrics;

  size_t
    height,
    width;

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
  (void) ResetImagePage(image,"0x0+0+0");
  if ((image->columns != 0) && (image->rows != 0))
    {
      status=SetImageExtent(image,image->columns,image->rows,exception);
      if (status == MagickFalse)
        return(DestroyImageList(image));
      (void) SetImageBackgroundColor(image,exception);
    }
  label=InterpretImageProperties((ImageInfo *) image_info,image,
    image_info->filename,exception);
  if (label == (char *) NULL)
    return(DestroyImageList(image));
  (void) SetImageProperty(image,"label",label,exception);
  draw_info=CloneDrawInfo(image_info,(DrawInfo *) NULL);
  width=CastDoubleToSizeT(0.5*draw_info->pointsize*strlen(label)+0.5);
  if (AcquireMagickResource(WidthResource,width) == MagickFalse)
    {
      label=DestroyString(label);
      draw_info=DestroyDrawInfo(draw_info);
      ThrowReaderException(ImageError,"WidthOrHeightExceedsLimit");
    }
  draw_info->text=ConstantString(label);
  (void) memset(&metrics,0,sizeof(metrics));
  status=GetMultilineTypeMetrics(image,draw_info,&metrics,exception);
  AdjustTypeMetricBounds(&metrics);
  if ((image->columns == 0) && (image->rows == 0))
    {
      image->columns=CastDoubleToSizeT(floor(metrics.width+
        draw_info->stroke_width+0.5));
      image->rows=CastDoubleToSizeT(floor(metrics.height+
        draw_info->stroke_width+0.5));
    }
  else
    if ((status != MagickFalse) && (strlen(label) > 0) &&
        (((image->columns == 0) || (image->rows == 0)) ||
         (fabs(image_info->pointsize) < MagickEpsilon)))
      {
        const char
          *option;

        double
          high,
          low;

        ssize_t
          n;

        /*
          Auto fit text into bounding box.
        */
        low=1.0;
        option=GetImageOption(image_info,"label:max-pointsize");
        if (option != (const char*) NULL)
          {
            high=StringToDouble(option,(char**) NULL);
            if (high < 1.0)
              high=1.0;
            high+=1.0;
          }
        else
          {
            option=GetImageOption(image_info,"label:start-pointsize");
            if (option != (const char *) NULL)
              {
                draw_info->pointsize=StringToDouble(option,(char**) NULL);
                if (draw_info->pointsize < 1.0)
                  draw_info->pointsize=1.0;
              }
            for (n=0; n < 32; n++, draw_info->pointsize*=2.0)
            {
              (void) FormatLocaleString(geometry,MagickPathExtent,"%+g%+g",
                metrics.bounds.x1,metrics.ascent);
              if (draw_info->gravity == UndefinedGravity)
                (void) CloneString(&draw_info->geometry,geometry);
              status=GetMultilineTypeMetrics(image,draw_info,&metrics,
                exception);
              if (status == MagickFalse)
                break;
              AdjustTypeMetricBounds(&metrics);
              width=CastDoubleToSizeT(metrics.width+draw_info->stroke_width+
                0.5);
              height=CastDoubleToSizeT(metrics.height-
                metrics.underline_position+draw_info->stroke_width+0.5);
              if ((image->columns != 0) && (image->rows != 0))
                {
                  if ((width > image->columns) && (height > image->rows))
                    break;
                  if ((width <= image->columns) && (height <= image->rows))
                    low=draw_info->pointsize;
                }
              else
                if (((image->columns != 0) && (width > image->columns)) ||
                    ((image->rows != 0) && (height > image->rows)))
                  break;
            }
            if (status == MagickFalse)
              {
                label=DestroyString(label);
                draw_info=DestroyDrawInfo(draw_info);
                image=DestroyImageList(image);
                return((Image *) NULL);
              }
            high=draw_info->pointsize;
          }
        while ((high-low) > 0.5)
        {
          draw_info->pointsize=(low+high)/2.0;
          (void) FormatLocaleString(geometry,MagickPathExtent,"%+g%+g",
            metrics.bounds.x1,metrics.ascent);
          if (draw_info->gravity == UndefinedGravity)
            (void) CloneString(&draw_info->geometry,geometry);
          status=GetMultilineTypeMetrics(image,draw_info,&metrics,exception);
          if (status == MagickFalse)
            break;
          AdjustTypeMetricBounds(&metrics);
          width=CastDoubleToSizeT(metrics.width+draw_info->stroke_width+0.5);
          height=CastDoubleToSizeT(metrics.height-metrics.underline_position+
            draw_info->stroke_width+0.5);
          if ((image->columns != 0) && (image->rows != 0))
            {
              if ((width < image->columns) && (height < image->rows))
                low=draw_info->pointsize+0.5;
              else
                high=draw_info->pointsize-0.5;
            }
          else
            if (((image->columns != 0) && (width < image->columns)) ||
                ((image->rows != 0) && (height < image->rows)))
              low=draw_info->pointsize+0.5;
            else
              high=draw_info->pointsize-0.5;
        }
        if (status != MagickFalse)
          draw_info->pointsize=floor(low-0.5);
      }
   label=DestroyString(label);
   if (status == MagickFalse)
     {
       draw_info=DestroyDrawInfo(draw_info);
       image=DestroyImageList(image);
       return((Image *) NULL);
     }
  /*
    Draw label.
  */
  status=GetMultilineTypeMetrics(image,draw_info,&metrics,exception);
  AdjustTypeMetricBounds(&metrics);
  if (image->columns == 0)
    image->columns=CastDoubleToSizeT(floor(metrics.width+
      draw_info->stroke_width+0.5));
  if (image->columns == 0)
    image->columns=CastDoubleToSizeT(floor(draw_info->pointsize+
      draw_info->stroke_width+0.5));
  if (image->rows == 0)
    image->rows=CastDoubleToSizeT(floor(metrics.height+
      draw_info->stroke_width+0.5));
  if (image->rows == 0)
    image->rows=CastDoubleToSizeT(floor(draw_info->pointsize+
      draw_info->stroke_width+0.5));
  status=SetImageExtent(image,image->columns,image->rows,exception);
  if (status == MagickFalse)
    {
      draw_info=DestroyDrawInfo(draw_info);
      return(DestroyImageList(image));
    }
  if (SetImageBackgroundColor(image,exception) == MagickFalse)
    {
      draw_info=DestroyDrawInfo(draw_info);
      image=DestroyImageList(image);
      return((Image *) NULL);
    }
  /*
    Draw label.
  */
  left_bearing=((draw_info->gravity == UndefinedGravity) ||
     (draw_info->gravity == NorthWestGravity) ||
     (draw_info->gravity == WestGravity) ||
     (draw_info->gravity == SouthWestGravity)) ? MagickTrue : MagickFalse;
  (void) FormatLocaleString(geometry,MagickPathExtent,"%+g%+g",
    (draw_info->direction == RightToLeftDirection ? (double) image->columns-
    (draw_info->gravity == UndefinedGravity ? metrics.bounds.x2 : 0.0) : 
    (left_bearing != MagickFalse ? metrics.bounds.x1 : 0.0)),
    (draw_info->gravity == UndefinedGravity ? 
    MagickMax(metrics.ascent,metrics.bounds.y2) : 0.0));
  (void) CloneString(&draw_info->geometry,geometry);
  status=AnnotateImage(image,draw_info,exception);
  if (image_info->pointsize == 0.0)
    (void) FormatImageProperty(image,"label:pointsize","%.20g",
      draw_info->pointsize);
  draw_info=DestroyDrawInfo(draw_info);
  if (status == MagickFalse)
    {
      image=DestroyImageList(image);
      return((Image *) NULL);
    }
  return(GetFirstImageInList(image));
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e g i s t e r L A B E L I m a g e                                       %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterLABELImage() adds properties for the LABEL image format to
%  the list of supported formats.  The properties include the image format
%  tag, a method to read and/or write the format, whether the format
%  supports the saving of more than one frame to the same file or blob,
%  whether the format supports native in-memory I/O, and a brief
%  description of the format.
%
%  The format of the RegisterLABELImage method is:
%
%      size_t RegisterLABELImage(void)
%
*/
ModuleExport size_t RegisterLABELImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("LABEL","LABEL","Image label");
  entry->decoder=(DecodeImageHandler *) ReadLABELImage;
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
%   U n r e g i s t e r L A B E L I m a g e                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterLABELImage() removes format registrations made by the
%  LABEL module from the list of supported formats.
%
%  The format of the UnregisterLABELImage method is:
%
%      UnregisterLABELImage(void)
%
*/
ModuleExport void UnregisterLABELImage(void)
{
  (void) UnregisterMagickInfo("LABEL");
}
```

--------------------------------------------------------------------------------

---[FILE: label.h]---
Location: ImageMagick-main/coders/label.h

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

#define MagickLABELHeaders

#define MagickLABELAliases

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

MagickCoderExports(LABEL)

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif
```

--------------------------------------------------------------------------------

---[FILE: mac.c]---
Location: ImageMagick-main/coders/mac.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                            M   M   AAA    CCCC                              %
%                            MM MM  A   A  C                                  %
%                            M M M  AAAAA  C                                  %
%                            M   M  A   A  C                                  %
%                            M   M  A   A   CCCC                              %
%                                                                             %
%                                                                             %
%                         Read MacPaint Image Format                          %
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
#include "MagickCore/colormap.h"
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
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e a d M A C I m a g e                                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ReadMACImage() reads an MacPaint image file and returns it.  It
%  allocates the memory necessary for the new Image structure and returns a
%  pointer to the new image.
%
%  The format of the ReadMACImage method is:
%
%      Image *ReadMACImage(const ImageInfo *image_info,ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image_info: the image info.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static Image *ReadMACImage(const ImageInfo *image_info,ExceptionInfo *exception)
{
  Image
    *image;

  MagickBooleanType
    status;

  Quantum
    *q;

  ssize_t
    x;

  unsigned char
    *p;

  size_t
    length;

  ssize_t
    offset,
    y;

  unsigned char
    count,
    bit,
    byte,
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
    Read MAC X image.
  */
  length=ReadBlobLSBShort(image);
  if ((length & 0xff) != 0)
    ThrowReaderException(CorruptImageError,"CorruptImage");
  if (length == 0)
    {
      for (x=0; x < (ssize_t) 510; x++)
        if (ReadBlobByte(image) == EOF)
          ThrowReaderException(CorruptImageError,"CorruptImage");
    }
  else
    for (x=0; x < (ssize_t) 638; x++)
      if (ReadBlobByte(image) == EOF)
        ThrowReaderException(CorruptImageError,"CorruptImage");
  image->columns=576;
  image->rows=720;
  image->depth=1;
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
  status=ResetImagePixels(image,exception);
  if (status == MagickFalse)
    return(DestroyImageList(image));
  /*
    Convert MAC raster image to pixel packets.
  */
  length=(image->columns+7)/8;
  pixels=(unsigned char *) AcquireQuantumMemory(length+257,sizeof(*pixels));
  if (pixels == (unsigned char *) NULL) 
    ThrowReaderException(ResourceLimitError,"MemoryAllocationFailed");
  (void) memset(pixels,0,(length+257)*sizeof(*pixels));
  p=pixels;
  offset=0;
  for (y=0; y < (ssize_t) image->rows; )
  {
    count=(unsigned char) ReadBlobByte(image);
    if (EOFBlob(image) != MagickFalse)
      break;
    if ((count <= 0) || (count >= 128))
      {
        byte=(unsigned char) (~ReadBlobByte(image));
        count=(~count)+2;
        while (count != 0)
        {
          *p++=byte;
          offset++;
          count--;
          if (offset >= (ssize_t) length)
            {
              q=QueueAuthenticPixels(image,0,y,image->columns,1,exception);
              if (q == (Quantum *) NULL)
                break;
              p=pixels;
              bit=0;
              byte=0;
              for (x=0; x < (ssize_t) image->columns; x++)
              {
                if (bit == 0)
                  byte=(*p++);
                SetPixelIndex(image,(Quantum) ((byte & 0x80) != 0 ? 0x01 : 0x00),q);
                bit++;
                byte<<=1;
                if (bit == 8)
                  bit=0;
                q+=(ptrdiff_t) GetPixelChannels(image);
              }
              if (SyncAuthenticPixels(image,exception) == MagickFalse)
                break;
              offset=0;
              p=pixels;
              y++;
            }
        }
        continue;
      }
    count++;
    while (count != 0)
    {
      byte=(unsigned char) (~ReadBlobByte(image));
      *p++=byte;
      offset++;
      count--;
      if (offset >= (ssize_t) length)
        {
          q=QueueAuthenticPixels(image,0,y,image->columns,1,exception);
          if (q == (Quantum *) NULL)
            break;
          p=pixels;
          bit=0;
          byte=0;
          for (x=0; x < (ssize_t) image->columns; x++)
          {
            if (bit == 0)
              byte=(*p++);
            SetPixelIndex(image,(Quantum) ((byte & 0x80) != 0 ? 0x01 : 0x00),q);
            bit++;
            byte<<=1;
            if (bit == 8)
              bit=0;
            q+=(ptrdiff_t) GetPixelChannels(image);
          }
          if (SyncAuthenticPixels(image,exception) == MagickFalse)
            break;
          offset=0;
          p=pixels;
          y++;
        }
    }
  }
  pixels=(unsigned char *) RelinquishMagickMemory(pixels);
  (void) SyncImage(image,exception);
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
%   R e g i s t e r M A C I m a g e                                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  RegisterMACImage() adds attributes for the MAC X image format to the list
%  of supported formats.  The attributes include the image format tag, a
%  method to read and/or write the format, whether the format supports the
%  saving of more than one frame to the same file or blob, whether the format
%  supports native in-memory I/O, and a brief description of the format.
%
%  The format of the RegisterMACImage method is:
%
%      size_t RegisterMACImage(void)
%
*/
ModuleExport size_t RegisterMACImage(void)
{
  MagickInfo
    *entry;

  entry=AcquireMagickInfo("MAC","MAC","MAC Paint");
  entry->decoder=(DecodeImageHandler *) ReadMACImage;
  (void) RegisterMagickInfo(entry);
  return(MagickImageCoderSignature);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   U n r e g i s t e r M A C I m a g e                                       %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UnregisterMACImage() removes format registrations made by the
%  MAC module from the list of supported formats.
%
%  The format of the UnregisterMACImage method is:
%
%      UnregisterMACImage(void)
%
*/
ModuleExport void UnregisterMACImage(void)
{
  (void) UnregisterMagickInfo("MAC");
}
```

--------------------------------------------------------------------------------

````

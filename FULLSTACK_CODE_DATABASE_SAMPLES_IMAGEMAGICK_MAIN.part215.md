---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 215
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 215 of 851)

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

---[FILE: color.h]---
Location: ImageMagick-main/MagickCore/color.h

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

  MagickCore image color methods.
*/
#ifndef MAGICKCORE_COLOR_H
#define MAGICKCORE_COLOR_H

#include "MagickCore/pixel.h"
#include "MagickCore/exception.h"

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

typedef enum
{
  UndefinedCompliance,
  NoCompliance = 0x0000,
  CSSCompliance = 0x0001,
  SVGCompliance = 0x0001,
  X11Compliance = 0x0002,
  XPMCompliance = 0x0004,
  MVGCompliance = 0x0008,
  AllCompliance = 0x7fffffff
} ComplianceType;

typedef enum
{
  UndefinedIlluminant = 5,
  AIlluminant = 0,
  BIlluminant = 1,
  CIlluminant = 2,
  D50Illuminant = 3,
  D55Illuminant = 4,
  D65Illuminant = 5,
  D75Illuminant = 6,
  EIlluminant = 7,
  F2Illuminant = 8,
  F7Illuminant = 9,
  F11Illuminant = 10
} IlluminantType;

typedef struct _ColorInfo
{
  char
    *path,
    *name;

  ComplianceType
    compliance;

  PixelInfo
    color;

  MagickBooleanType
    exempt,
    stealth;

  size_t
    signature;
} ColorInfo;

typedef struct _ErrorInfo
{
  double
    mean_error_per_pixel,
    normalized_mean_error,
    normalized_maximum_error;
} ErrorInfo;

extern MagickExport char
  **GetColorList(const char *,size_t *,ExceptionInfo *);

extern MagickExport const ColorInfo
  *GetColorInfo(const char *,ExceptionInfo *),
  **GetColorInfoList(const char *,size_t *,ExceptionInfo *);

extern MagickExport MagickBooleanType
  IsEquivalentImage(const Image *,const Image *,ssize_t *x,ssize_t *y,
    ExceptionInfo *),
  ListColorInfo(FILE *,ExceptionInfo *),
  QueryColorCompliance(const char *,const ComplianceType,PixelInfo *,
    ExceptionInfo *),
  QueryColorname(const Image *,const PixelInfo *,const ComplianceType,
    char *,ExceptionInfo *);

extern MagickExport void
  ConcatenateColorComponent(const PixelInfo *,const PixelChannel,
    const ComplianceType,char *),
  GetColorTuple(const PixelInfo *,const MagickBooleanType,char *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: colormap-private.h]---
Location: ImageMagick-main/MagickCore/colormap-private.h

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

  MagickCore image colormap methods.
*/
#ifndef MAGICKCORE_COLORMAP_PRIVATE_H
#define MAGICKCORE_COLORMAP_PRIVATE_H

#include "MagickCore/image.h"
#include "MagickCore/color.h"
#include "MagickCore/exception-private.h"

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

static inline ssize_t ConstrainColormapIndex(Image *image,const ssize_t index,
  ExceptionInfo *exception)
{
  if ((index < 0) || (index >= (ssize_t) image->colors))
    {
      if (exception->severity != CorruptImageError)
        (void) ThrowMagickException(exception,GetMagickModule(),
          CorruptImageError,"InvalidColormapIndex","`%s'",image->filename);
      return(0);
    }
  return((ssize_t) index);
}

static inline void ValidateColormapValue(Image *image,const ssize_t index,
  Quantum *target,ExceptionInfo *exception)
{ 
  if ((index < 0) || (index >= (ssize_t) image->colors))
    {
      if (exception->severity != CorruptImageError)
        (void) ThrowMagickException(exception,GetMagickModule(),
          CorruptImageError,"InvalidColormapIndex","`%s'",image->filename);
      *target=(Quantum) 0;
    }
  else
    *target=(Quantum) index;
}

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: colormap.c]---
Location: ImageMagick-main/MagickCore/colormap.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%            CCCC   OOO   L       OOO   RRRR   M   M   AAA   PPPP             %
%           C      O   O  L      O   O  R   R  MM MM  A   A  P   P            %
%           C      O   O  L      O   O  RRRR   M M M  AAAAA  PPPP             %
%           C      O   O  L      O   O  R R    M   M  A   A  P                %
%            CCCC   OOO   LLLLL   OOO   R  R   M   M  A   A  P                %
%                                                                             %
%                                                                             %
%                        MagickCore Colormap Methods                          %
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
%  We use linked-lists because splay-trees do not currently support duplicate
%  key / value pairs (.e.g X11 green compliance and SVG green compliance).
%
*/

/*
  Include declarations.
*/
#include "MagickCore/studio.h"
#include "MagickCore/attribute.h"
#include "MagickCore/blob.h"
#include "MagickCore/cache-view.h"
#include "MagickCore/cache.h"
#include "MagickCore/color.h"
#include "MagickCore/color-private.h"
#include "MagickCore/colormap.h"
#include "MagickCore/colormap-private.h"
#include "MagickCore/client.h"
#include "MagickCore/configure.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/gem.h"
#include "MagickCore/geometry.h"
#include "MagickCore/image-private.h"
#include "MagickCore/memory_.h"
#include "MagickCore/monitor.h"
#include "MagickCore/monitor-private.h"
#include "MagickCore/option.h"
#include "MagickCore/pixel-accessor.h"
#include "MagickCore/quantize.h"
#include "MagickCore/quantum.h"
#include "MagickCore/resource_.h"
#include "MagickCore/semaphore.h"
#include "MagickCore/string_.h"
#include "MagickCore/thread-private.h"
#include "MagickCore/token.h"
#include "MagickCore/utility.h"
#include "MagickCore/xml-tree.h"

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   A c q u i r e I m a g e C o l o r m a p                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  AcquireImageColormap() allocates an image colormap and initializes
%  it to a linear gray colorspace.  If the image already has a colormap,
%  it is replaced.  AcquireImageColormap() returns MagickTrue if successful,
%  otherwise MagickFalse if there is not enough memory.
%
%  The format of the AcquireImageColormap method is:
%
%      MagickBooleanType AcquireImageColormap(Image *image,const size_t colors,
%        ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image: the image.
%
%    o colors: the number of colors in the image colormap.
%
%    o exception: return any errors or warnings in this structure.
%
*/
MagickExport MagickBooleanType AcquireImageColormap(Image *image,
  const size_t colors,ExceptionInfo *exception)
{
  ssize_t
    i;

  /*
    Allocate image colormap.
  */
  assert(image != (Image *) NULL);
  assert(image->signature == MagickCoreSignature);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",image->filename);
  if (colors > MaxColormapSize)
    {
      image->colors=0;
      image->storage_class=DirectClass;
      ThrowBinaryException(ResourceLimitError,"UnableToCreateColormap",
        image->filename);
    }
  image->colors=MagickMax(colors,1);
  if (image->colormap == (PixelInfo *) NULL)
    image->colormap=(PixelInfo *) AcquireQuantumMemory(image->colors+1,
      sizeof(*image->colormap));
  else
    image->colormap=(PixelInfo *) ResizeQuantumMemory(image->colormap,
      image->colors+1,sizeof(*image->colormap));
  if (image->colormap == (PixelInfo *) NULL)
    {
      image->colors=0;
      image->storage_class=DirectClass;
      ThrowBinaryException(ResourceLimitError,"MemoryAllocationFailed",
        image->filename);
    }
  for (i=0; i < (ssize_t) image->colors; i++)
  {
    double
      pixel;

    GetPixelInfo(image,image->colormap+i);
    pixel=((double) i*(QuantumRange/MagickMax(colors-1,1)));
    image->colormap[i].red=pixel;
    image->colormap[i].green=pixel;
    image->colormap[i].blue=pixel;
    image->colormap[i].alpha=(MagickRealType) OpaqueAlpha;
    image->colormap[i].alpha_trait=BlendPixelTrait;
  }
  image->storage_class=PseudoClass;
  return(MagickTrue);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%     C y c l e C o l o r m a p I m a g e                                     %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  CycleColormap() displaces an image's colormap by a given number of
%  positions.  If you cycle the colormap a number of times you can produce
%  a psychodelic effect.
%
%  WARNING: this assumes an images colormap is in a well know and defined
%  order. Currently Imagemagick has no way of setting that order.
%
%  The format of the CycleColormapImage method is:
%
%      MagickBooleanType CycleColormapImage(Image *image,const ssize_t displace,
%        ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image: the image.
%
%    o displace:  displace the colormap this amount.
%
%    o exception: return any errors or warnings in this structure.
%
*/
MagickExport MagickBooleanType CycleColormapImage(Image *image,
  const ssize_t displace,ExceptionInfo *exception)
{
  CacheView
    *image_view;

  MagickBooleanType
    status;

  ssize_t
    y;

  assert(image != (Image *) NULL);
  assert(image->signature == MagickCoreSignature);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",image->filename);
  if (image->storage_class == DirectClass)
    (void) SetImageType(image,PaletteType,exception);
  status=MagickTrue;
  image_view=AcquireAuthenticCacheView(image,exception);
#if defined(MAGICKCORE_OPENMP_SUPPORT)
  #pragma omp parallel for schedule(static) \
    magick_number_threads(image,image,image->rows,2)
#endif
  for (y=0; y < (ssize_t) image->rows; y++)
  {
    ssize_t
      x;

    Quantum
      *magick_restrict q;

    ssize_t
      index;

    if (status == MagickFalse)
      continue;
    q=GetCacheViewAuthenticPixels(image_view,0,y,image->columns,1,exception);
    if (q == (Quantum *) NULL)
      {
        status=MagickFalse;
        continue;
      }
    for (x=0; x < (ssize_t) image->columns; x++)
    {
      index=(ssize_t) (GetPixelIndex(image,q)+displace) % (ssize_t)
        image->colors;
      if (index < 0)
        index+=(ssize_t) image->colors;
      SetPixelIndex(image,(Quantum) index,q);
      SetPixelViaPixelInfo(image,image->colormap+(ssize_t) index,q);
      q+=(ptrdiff_t) GetPixelChannels(image);
    }
    if (SyncCacheViewAuthenticPixels(image_view,exception) == MagickFalse)
      status=MagickFalse;
  }
  image_view=DestroyCacheView(image_view);
  return(status);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
+   S o r t C o l o r m a p B y I n t e n s i t y                             %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  SortColormapByIntensity() sorts the colormap of a PseudoClass image by
%  decreasing color intensity.
%
%  The format of the SortColormapByIntensity method is:
%
%      MagickBooleanType SortColormapByIntensity(Image *image,
%        ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image: A pointer to an Image structure.
%
%    o exception: return any errors or warnings in this structure.
%
*/

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

static int IntensityCompare(const void *x,const void *y)
{
  const PixelInfo
    *color_1,
    *color_2;

  int
    intensity;

  color_1=(const PixelInfo *) x;
  color_2=(const PixelInfo *) y;
  intensity=(int) GetPixelInfoIntensity((const Image *) NULL,color_2)-(int)
    GetPixelInfoIntensity((const Image *) NULL,color_1);
  return(intensity);
}

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

MagickExport MagickBooleanType SortColormapByIntensity(Image *image,
  ExceptionInfo *exception)
{
  CacheView
    *image_view;

  MagickBooleanType
    status;

  ssize_t
    j;

  ssize_t
    y;

  unsigned short
    *pixels;

  assert(image != (Image *) NULL);
  assert(image->signature == MagickCoreSignature);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"...");
  if (image->storage_class != PseudoClass)
    return(MagickTrue);
  /*
    Allocate memory for pixel indexes.
  */
  pixels=(unsigned short *) AcquireQuantumMemory((size_t) image->colors,
    sizeof(*pixels));
  if (pixels == (unsigned short *) NULL)
    ThrowBinaryException(ResourceLimitError,"MemoryAllocationFailed",
      image->filename);
  /*
    Assign index values to colormap entries.
  */
  for (j=0; j < (ssize_t) image->colors; j++)
    image->colormap[j].alpha=(double) j;
  /*
    Sort image colormap by decreasing color popularity.
  */
  qsort((void *) image->colormap,(size_t) image->colors,
    sizeof(*image->colormap),IntensityCompare);
  /*
    Update image colormap indexes to sorted colormap order.
  */
  for (j=0; j < (ssize_t) image->colors; j++)
    pixels[(ssize_t) image->colormap[j].alpha]=(unsigned short) j;
  status=MagickTrue;
  image_view=AcquireAuthenticCacheView(image,exception);
#if defined(MAGICKCORE_OPENMP_SUPPORT)
  #pragma omp parallel for schedule(static) \
    magick_number_threads(image,image,image->rows,2)
#endif
  for (y=0; y < (ssize_t) image->rows; y++)
  {
    Quantum
      *magick_restrict q;

    ssize_t
      x;

    if (status == MagickFalse)
      continue;
    q=GetCacheViewAuthenticPixels(image_view,0,y,image->columns,1,exception);
    if (q == (Quantum *) NULL)
      {
        status=MagickFalse;
        continue;
      }
    for (x=0; x < (ssize_t) image->columns; x++)
    {
      Quantum
        index;

      ssize_t
        i;

      i=ConstrainColormapIndex(image,(ssize_t) GetPixelIndex(image,q),exception);
      index=(Quantum) pixels[i];
      SetPixelIndex(image,index,q);
      SetPixelViaPixelInfo(image,image->colormap+(ssize_t) index,q);
      q+=(ptrdiff_t) GetPixelChannels(image);
    }
    if (SyncCacheViewAuthenticPixels(image_view,exception) == MagickFalse)
      status=MagickFalse;
  }
  image_view=DestroyCacheView(image_view);
  pixels=(unsigned short *) RelinquishMagickMemory(pixels);
  return(status);
}
```

--------------------------------------------------------------------------------

---[FILE: colormap.h]---
Location: ImageMagick-main/MagickCore/colormap.h

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

  MagickCore image colormap methods.
*/
#ifndef MAGICKCORE_COLORMAP_H
#define MAGICKCORE_COLORMAP_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

extern MagickExport MagickBooleanType
  AcquireImageColormap(Image *,const size_t,ExceptionInfo *),
  CycleColormapImage(Image *,const ssize_t,ExceptionInfo *),
  SortColormapByIntensity(Image *,ExceptionInfo *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

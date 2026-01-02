---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 311
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 311 of 851)

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

---[FILE: resample.h]---
Location: ImageMagick-main/MagickCore/resample.h

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

  MagickCore graphic resample methods.
*/
#ifndef MAGICKCORE_RESAMPLE_H
#define MAGICKCORE_RESAMPLE_H

#include "MagickCore/cache-view.h"

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

/*
  WARNING:  The order of this table must also match the order of a table
  located in AcquireResizeFilter() in "resize.c" otherwise the users filter
  will not match the actual filter that is setup.
*/
typedef enum
{
  UndefinedFilter,
  PointFilter,
  BoxFilter,
  TriangleFilter,
  HermiteFilter,
  HannFilter,
  HammingFilter,
  BlackmanFilter,
  GaussianFilter,
  QuadraticFilter,
  CubicFilter,
  CatromFilter,
  MitchellFilter,
  JincFilter,
  SincFilter,
  SincFastFilter,
  KaiserFilter,
  WelchFilter,
  ParzenFilter,
  BohmanFilter,
  BartlettFilter,
  LagrangeFilter,
  LanczosFilter,
  LanczosSharpFilter,
  Lanczos2Filter,
  Lanczos2SharpFilter,
  RobidouxFilter,
  RobidouxSharpFilter,
  CosineFilter,
  SplineFilter,
  LanczosRadiusFilter,
  CubicSplineFilter,
  MagicKernelSharp2013Filter,
  MagicKernelSharp2021Filter,
  SentinelFilter  /* a count of all the filters, not a real filter */
} FilterType;

/*
  Backward compatibility for the more correctly named Jinc Filter.  Original
  source of this filter is from "zoom" but it refers to a reference by Pratt,
  who does not actually name the filter.

  also miss-spellings of common filters
*/
#define BesselFilter  JincFilter
#define WelshFilter   WelchFilter
#define HanningFilter HannFilter

typedef struct _ResampleFilter
  ResampleFilter;

extern MagickExport MagickBooleanType
  ResamplePixelColor(ResampleFilter *,const double,const double,
    PixelInfo *,ExceptionInfo *),
  SetResampleFilterInterpolateMethod(ResampleFilter *,
    const PixelInterpolateMethod),
  SetResampleFilterVirtualPixelMethod(ResampleFilter *,
    const VirtualPixelMethod);

extern MagickExport ResampleFilter
  *AcquireResampleFilter(const Image *,ExceptionInfo *),
  *DestroyResampleFilter(ResampleFilter *);

extern MagickExport void
  ScaleResampleFilter(ResampleFilter *,const double,const double,const double,
    const double),
  SetResampleFilter(ResampleFilter *,const FilterType);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: resize-private.h]---
Location: ImageMagick-main/MagickCore/resize-private.h

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

  MagickCore image resize private methods.
*/
#ifndef MAGICKCORE_RESIZE_PRIVATE_H
#define MAGICKCORE_RESIZE_PRIVATE_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

typedef enum
{
  BoxWeightingFunction = 0,
  TriangleWeightingFunction,
  CubicBCWeightingFunction,
  HannWeightingFunction,
  HammingWeightingFunction,
  BlackmanWeightingFunction,
  GaussianWeightingFunction,
  QuadraticWeightingFunction,
  JincWeightingFunction,
  SincWeightingFunction,
  SincFastWeightingFunction,
  KaiserWeightingFunction,
  WelchWeightingFunction,
  BohmanWeightingFunction,
  LagrangeWeightingFunction,
  CosineWeightingFunction,
  MagicKernelSharpWeightingFunction,
  LastWeightingFunction
} ResizeWeightingFunctionType;

extern MagickPrivate double
  *GetResizeFilterCoefficient(const ResizeFilter*),
  GetResizeFilterBlur(const ResizeFilter *),
  GetResizeFilterScale(const ResizeFilter *),
  GetResizeFilterWindowSupport(const ResizeFilter *),
  GetResizeFilterSupport(const ResizeFilter *),
  GetResizeFilterWeight(const ResizeFilter *,const double);

extern MagickPrivate ResizeFilter
  *AcquireResizeFilter(const Image *,const FilterType,const MagickBooleanType,
    ExceptionInfo *),
  *DestroyResizeFilter(ResizeFilter *);

extern MagickPrivate ResizeWeightingFunctionType
  GetResizeFilterWeightingType(const ResizeFilter *),
  GetResizeFilterWindowWeightingType(const ResizeFilter *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 218
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 218 of 851)

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

---[FILE: colorspace.h]---
Location: ImageMagick-main/MagickCore/colorspace.h

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

  MagickCore image colorspace methods.
*/
#ifndef MAGICKCORE_COLORSPACE_H
#define MAGICKCORE_COLORSPACE_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

typedef enum
{
  UndefinedColorspace,
  CMYColorspace,           /* negated linear RGB colorspace */
  CMYKColorspace,          /* CMY with Black separation */
  GRAYColorspace,          /* Single Channel greyscale (non-linear) image */
  HCLColorspace,
  HCLpColorspace,
  HSBColorspace,
  HSIColorspace,
  HSLColorspace,
  HSVColorspace,           /* alias for HSB */
  HWBColorspace,
  LabColorspace,
  LCHColorspace,           /* alias for LCHuv */
  LCHabColorspace,         /* Cylindrical (Polar) Lab */
  LCHuvColorspace,         /* Cylindrical (Polar) Luv */
  LogColorspace,
  LMSColorspace,
  LuvColorspace,
  OHTAColorspace,
  Rec601YCbCrColorspace,
  Rec709YCbCrColorspace,
  RGBColorspace,           /* Linear RGB colorspace */
  scRGBColorspace,         /* ??? */
  sRGBColorspace,          /* Default: non-linear sRGB colorspace */
  TransparentColorspace,
  xyYColorspace,
  XYZColorspace,           /* IEEE Color Reference colorspace */
  YCbCrColorspace,
  YCCColorspace,
  YDbDrColorspace,
  YIQColorspace,
  YPbPrColorspace,
  YUVColorspace,
  LinearGRAYColorspace,     /* Single Channel greyscale (linear) image */
  JzazbzColorspace,
  DisplayP3Colorspace,
  Adobe98Colorspace,
  ProPhotoColorspace,
  OklabColorspace,
  OklchColorspace,
  CAT02LMSColorspace
} ColorspaceType;

extern MagickExport ColorspaceType
  GetImageColorspaceType(const Image *,ExceptionInfo *);

extern MagickExport MagickBooleanType
  SetImageColorspace(Image *,const ColorspaceType,ExceptionInfo *),
  SetImageGray(Image *,ExceptionInfo *),
  SetImageMonochrome(Image *,ExceptionInfo *),
  TransformImageColorspace(Image *,const ColorspaceType,ExceptionInfo *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: compare-private.h]---
Location: ImageMagick-main/MagickCore/compare-private.h

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

  MagickCore compare private methods.
*/
#ifndef MAGICKCORE_COMPARE_PRIVATE_H
#define MAGICKCORE_COMPARE_PRIVATE_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#include "MagickCore/image-private.h"

#define DefaultSimilarityThreshold  (-1.0)
#define MagickSafePSNRRecipicol(x)  ((x)*log10(1.0/MagickEpsilon))

static inline void SetImageCompareBounds(const Image *image,
  const Image *reconstruct_image,size_t *columns,size_t *rows)
{
  const char
    *artifact;

  *columns=MagickMax(image->columns,reconstruct_image->columns);
  *rows=MagickMax(image->rows,reconstruct_image->rows);
  artifact=GetImageArtifact(image,"compare:virtual-pixels");
  if ((artifact != (const char *) NULL) &&
      (IsStringTrue(artifact) == MagickFalse))
    {
      *columns=MagickMin(image->columns,reconstruct_image->columns);
      *rows=MagickMin(image->rows,reconstruct_image->rows);
    }
}

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

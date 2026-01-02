---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 338
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 338 of 851)

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

---[FILE: vision.h]---
Location: ImageMagick-main/MagickCore/vision.h

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

  MagickCore computer vision methods.
*/
#ifndef MAGICKCORE_VISION_H
#define MAGICKCORE_VISION_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#define CCMaxMetrics  16

typedef struct _CCObjectInfo
{
  ssize_t
    id;

  RectangleInfo
    bounding_box;

  PixelInfo
    color;

  PointInfo
    centroid;

  double
    area,
    census;

  MagickBooleanType
    merge;

  double
    metric[CCMaxMetrics];

  ssize_t
    key;
} CCObjectInfo;

extern MagickExport Image
  *ConnectedComponentsImage(const Image *,const size_t,CCObjectInfo **,
    ExceptionInfo *),
  *IntegralImage(const Image *,ExceptionInfo *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

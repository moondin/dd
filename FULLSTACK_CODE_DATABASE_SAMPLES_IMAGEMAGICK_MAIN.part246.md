---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 246
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 246 of 851)

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

---[FILE: feature.h]---
Location: ImageMagick-main/MagickCore/feature.h

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

  MagickCore feature methods.
*/
#ifndef MAGICKCORE_FEATURE_H
#define MAGICKCORE_FEATURE_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

/*
  Haralick texture features.
*/
typedef struct _ChannelFeatures
{
  double
    angular_second_moment[4],
    contrast[4],
    correlation[4],
    variance_sum_of_squares[4],
    inverse_difference_moment[4],
    sum_average[4],
    sum_variance[4],
    sum_entropy[4],
    entropy[4],
    difference_variance[4],
    difference_entropy[4],
    measure_of_correlation_1[4],
    measure_of_correlation_2[4],
    maximum_correlation_coefficient[4];
} ChannelFeatures;

extern MagickExport ChannelFeatures
  *GetImageFeatures(const Image *,const size_t,ExceptionInfo *);

extern MagickExport Image
  *CannyEdgeImage(const Image *,const double,const double,const double,
    const double,ExceptionInfo *),
  *HoughLineImage(const Image *,const size_t,const size_t,const size_t,
    ExceptionInfo *),
  *MeanShiftImage(const Image *,const size_t,const size_t,const double,
    ExceptionInfo *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

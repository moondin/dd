---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 248
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 248 of 851)

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

---[FILE: fourier.h]---
Location: ImageMagick-main/MagickCore/fourier.h

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

  MagickCore discrete Fourier transform (DFT) methods.
*/
#ifndef MAGICKCORE_FFT_H
#define MAGICKCORE_FFT_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

typedef enum
{
  UndefinedComplexOperator,
  AddComplexOperator,
  ConjugateComplexOperator,
  DivideComplexOperator,
  MagnitudePhaseComplexOperator,
  MultiplyComplexOperator,
  RealImaginaryComplexOperator,
  SubtractComplexOperator
} ComplexOperator;

extern MagickExport Image
 *ComplexImages(const Image *,const ComplexOperator,ExceptionInfo *),
 *ForwardFourierTransformImage(const Image *,const MagickBooleanType,
   ExceptionInfo *),
 *InverseFourierTransformImage(const Image *,const Image *,
   const MagickBooleanType,ExceptionInfo *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: fx-private.h]---
Location: ImageMagick-main/MagickCore/fx-private.h

```c
/*
  Copyright @ 2022 ImageMagick Studio LLC, a non-profit organization
  dedicated to making software imaging solutions freely available.
  
  You may not use this file except in compliance with the License.  You may
  obtain a copy of the License at
  
    https://imagemagick.org/script/license.php
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

  MagickCore private image f/x methods.
*/
#ifndef MAGICKCORE_FX_PRIVATE_H
#define MAGICKCORE_FX_PRIVATE_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

typedef struct _FxInfo
  FxInfo;

extern MagickPrivate FxInfo
  *AcquireFxInfo(const Image *,const char *,ExceptionInfo *),
  *DestroyFxInfo(FxInfo *);

extern MagickPrivate MagickBooleanType
  FxEvaluateChannelExpression(FxInfo *,const PixelChannel,const ssize_t,
   const ssize_t,double *,ExceptionInfo *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 222
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 222 of 851)

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

---[FILE: composite.h]---
Location: ImageMagick-main/MagickCore/composite.h

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

  MagickCore image composite methods.
*/
#ifndef MAGICKCORE_COMPOSITE_H
#define MAGICKCORE_COMPOSITE_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

typedef enum
{
  UndefinedCompositeOp,
  AlphaCompositeOp,
  AtopCompositeOp,
  BlendCompositeOp,
  BlurCompositeOp,
  BumpmapCompositeOp,
  ChangeMaskCompositeOp,
  ClearCompositeOp,
  ColorBurnCompositeOp,
  ColorDodgeCompositeOp,
  ColorizeCompositeOp,
  CopyBlackCompositeOp,
  CopyBlueCompositeOp,
  CopyCompositeOp,
  CopyCyanCompositeOp,
  CopyGreenCompositeOp,
  CopyMagentaCompositeOp,
  CopyAlphaCompositeOp,
  CopyRedCompositeOp,
  CopyYellowCompositeOp,
  DarkenCompositeOp,
  DarkenIntensityCompositeOp,
  DifferenceCompositeOp,
  DisplaceCompositeOp,
  DissolveCompositeOp,
  DistortCompositeOp,
  DivideDstCompositeOp,
  DivideSrcCompositeOp,
  DstAtopCompositeOp,
  DstCompositeOp,
  DstInCompositeOp,
  DstOutCompositeOp,
  DstOverCompositeOp,
  ExclusionCompositeOp,
  HardLightCompositeOp,
  HardMixCompositeOp,
  HueCompositeOp,
  InCompositeOp,
  IntensityCompositeOp,
  LightenCompositeOp,
  LightenIntensityCompositeOp,
  LinearBurnCompositeOp,
  LinearDodgeCompositeOp,
  LinearLightCompositeOp,
  LuminizeCompositeOp,
  MathematicsCompositeOp,
  MinusDstCompositeOp,
  MinusSrcCompositeOp,
  ModulateCompositeOp,
  ModulusAddCompositeOp,
  ModulusSubtractCompositeOp,
  MultiplyCompositeOp,
  NoCompositeOp,
  OutCompositeOp,
  OverCompositeOp,
  OverlayCompositeOp,
  PegtopLightCompositeOp,
  PinLightCompositeOp,
  PlusCompositeOp,
  ReplaceCompositeOp,
  SaturateCompositeOp,
  ScreenCompositeOp,
  SoftLightCompositeOp,
  SrcAtopCompositeOp,
  SrcCompositeOp,
  SrcInCompositeOp,
  SrcOutCompositeOp,
  SrcOverCompositeOp,
  ThresholdCompositeOp,
  VividLightCompositeOp,
  XorCompositeOp,
  StereoCompositeOp,
  FreezeCompositeOp,
  InterpolateCompositeOp,
  NegateCompositeOp,
  ReflectCompositeOp,
  SoftBurnCompositeOp,
  SoftDodgeCompositeOp,
  StampCompositeOp,
  RMSECompositeOp,
  SaliencyBlendCompositeOp,
  SeamlessBlendCompositeOp
} CompositeOperator;

extern MagickExport MagickBooleanType
  CompositeImage(Image *,const Image *,const CompositeOperator,
    const MagickBooleanType,const ssize_t,const ssize_t,ExceptionInfo *),
  TextureImage(Image *,const Image *,ExceptionInfo *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

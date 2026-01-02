---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 211
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 211 of 851)

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

---[FILE: channel.h]---
Location: ImageMagick-main/MagickCore/channel.h

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

  MagickCore image channel methods.
*/
#ifndef MAGICKCORE_CHANNEL_H
#define MAGICKCORE_CHANNEL_H

#include <MagickCore/image.h>

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

typedef enum
{
  UndefinedAlphaChannel,
  ActivateAlphaChannel,
  AssociateAlphaChannel,
  BackgroundAlphaChannel,
  CopyAlphaChannel,
  DeactivateAlphaChannel,
  DiscreteAlphaChannel,
  DisassociateAlphaChannel,
  ExtractAlphaChannel,
  OffAlphaChannel,
  OnAlphaChannel,
  OpaqueAlphaChannel,
  RemoveAlphaChannel,
  SetAlphaChannel,
  ShapeAlphaChannel,
  TransparentAlphaChannel,
  OffIfOpaqueAlphaChannel
} AlphaChannelOption;

extern MagickExport Image
  *ChannelFxImage(const Image *,const char *,ExceptionInfo *),
  *CombineImages(const Image *,const ColorspaceType,ExceptionInfo *),
  *SeparateImage(const Image *,const ChannelType,ExceptionInfo *),
  *SeparateImages(const Image *,ExceptionInfo *);

extern MagickExport MagickBooleanType
  GetImageAlphaChannel(const Image *),
  SetImageAlphaChannel(Image *,const AlphaChannelOption,ExceptionInfo *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 262
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 262 of 851)

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

---[FILE: layer.h]---
Location: ImageMagick-main/MagickCore/layer.h

```c
/*
  Copyright @ 2006 ImageMagick Studio LLC, a non-profit organization
  dedicated to making software imaging solutions freely available.
  
  You may not use this file except in compliance with the License.  You may
  obtain a copy of the License at
  
    https://imagemagick.org/script/license.php
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

  MagickCore image layer methods.
*/
#ifndef MAGICKCORE_LAYER_H
#define MAGICKCORE_LAYER_H

#include "MagickCore/composite.h"

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

typedef enum
{
  UnrecognizedDispose,
  UndefinedDispose = 0,
  NoneDispose = 1,
  BackgroundDispose = 2,
  PreviousDispose = 3
} DisposeType;

typedef enum
{
  UndefinedLayer,
  CoalesceLayer,
  CompareAnyLayer,
  CompareClearLayer,
  CompareOverlayLayer,
  DisposeLayer,
  OptimizeLayer,
  OptimizeImageLayer,
  OptimizePlusLayer,
  OptimizeTransLayer,
  RemoveDupsLayer,
  RemoveZeroLayer,
  CompositeLayer,
  MergeLayer,
  FlattenLayer,
  MosaicLayer,
  TrimBoundsLayer
} LayerMethod;

extern MagickExport Image
  *CoalesceImages(const Image *,ExceptionInfo *),
  *DisposeImages(const Image *,ExceptionInfo *),
  *CompareImagesLayers(const Image *,const LayerMethod,ExceptionInfo *),
  *MergeImageLayers(Image *,const LayerMethod,ExceptionInfo *),
  *OptimizeImageLayers(const Image *,ExceptionInfo *),
  *OptimizePlusImageLayers(const Image *,ExceptionInfo *);

extern MagickExport void
  CompositeLayers(Image *,const CompositeOperator,Image *,const ssize_t,
    const ssize_t,ExceptionInfo *),
  OptimizeImageTransparency(const Image *,ExceptionInfo *),
  RemoveDuplicateLayers(Image **,ExceptionInfo *),
  RemoveZeroDelayLayers(Image **,ExceptionInfo *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: libMagickCore.map]---
Location: ImageMagick-main/MagickCore/libMagickCore.map

```text
 VERS_10.0 {
     	 global:
     		 *;
     };
```

--------------------------------------------------------------------------------

---[FILE: linked-list-private.h]---
Location: ImageMagick-main/MagickCore/linked-list-private.h

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

  MagickCore linked list private methods.
*/
#ifndef MAGICKCORE_LINKED_LIST_PRIVATE_H
#define MAGICKCORE_LINKED_LIST_PRIVATE_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

typedef struct _ElementInfo
{
  void
    *value;

  struct _ElementInfo
    *next;
} ElementInfo;

extern MagickPrivate ElementInfo
  *GetHeadElementInLinkedList(LinkedListInfo *);

extern MagickPrivate void
  SetHeadElementInLinkedList(LinkedListInfo *,ElementInfo *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

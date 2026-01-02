---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 209
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 209 of 851)

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

---[FILE: cache.h]---
Location: ImageMagick-main/MagickCore/cache.h

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

  MagickCore cache methods.
*/
#ifndef MAGICKCORE_CACHE_H
#define MAGICKCORE_CACHE_H

#include "MagickCore/blob.h"

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

typedef enum
{
  UndefinedCache,
  DiskCache,
  DistributedCache,
  MapCache,
  MemoryCache,
  PingCache
} CacheType;

extern MagickExport CacheType
  GetImagePixelCacheType(const Image *);

extern MagickExport const char
  *GetPixelCacheFilename(const Image *);

extern MagickExport const Quantum
  *GetVirtualPixels(const Image *,const ssize_t,const ssize_t,const size_t,
    const size_t,ExceptionInfo *) magick_hot_spot,
  *GetVirtualPixelQueue(const Image *) magick_hot_spot;

extern MagickExport const void
  *GetVirtualMetacontent(const Image *);

extern MagickExport MagickBooleanType
  GetOneAuthenticPixel(Image *,const ssize_t,const ssize_t,Quantum *,
    ExceptionInfo *),
  GetOneVirtualPixel(const Image *,const ssize_t,const ssize_t,Quantum *,
    ExceptionInfo *),
  GetOneVirtualPixelInfo(const Image *,const VirtualPixelMethod,
    const ssize_t,const ssize_t,PixelInfo *,ExceptionInfo *),
  PersistPixelCache(Image *,const char *,const MagickBooleanType,
    MagickOffsetType *,ExceptionInfo *),
  ReshapePixelCache(Image *,const size_t,const size_t,ExceptionInfo *),
  SyncAuthenticPixels(Image *,ExceptionInfo *) magick_hot_spot;

extern MagickExport MagickSizeType
  GetImageExtent(const Image *);

extern MagickExport Quantum
  *GetAuthenticPixels(Image *,const ssize_t,const ssize_t,const size_t,
    const size_t,ExceptionInfo *) magick_hot_spot,
  *GetAuthenticPixelQueue(const Image *) magick_hot_spot,
  *QueueAuthenticPixels(Image *,const ssize_t,const ssize_t,const size_t,
    const size_t,ExceptionInfo *) magick_hot_spot;

extern MagickExport void
  *AcquirePixelCachePixels(const Image *,size_t *,ExceptionInfo *),
  *GetAuthenticMetacontent(const Image *),
  *GetPixelCachePixels(Image *,MagickSizeType *,ExceptionInfo *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

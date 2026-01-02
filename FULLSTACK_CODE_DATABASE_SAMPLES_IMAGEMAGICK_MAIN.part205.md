---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 205
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 205 of 851)

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

---[FILE: blob.h]---
Location: ImageMagick-main/MagickCore/blob.h

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

  MagickCore Binary Large OBjects methods.
*/
#ifndef MAGICKCORE_BLOB_H
#define MAGICKCORE_BLOB_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#define MagickMaxBufferExtent  524288
#define MagickMinBufferExtent  16384

typedef enum
{
  ReadMode,
  WriteMode,
  IOMode,
  PersistMode
} MapMode;

typedef ssize_t
  (*CustomStreamHandler)(unsigned char *,const size_t,void *);

typedef MagickOffsetType
  (*CustomStreamSeeker)(const MagickOffsetType,const int,void *);

typedef MagickOffsetType
  (*CustomStreamTeller)(void *);

typedef struct _CustomStreamInfo
  CustomStreamInfo;

#include "MagickCore/image.h"
#include "MagickCore/stream.h"

extern MagickExport CustomStreamInfo
  *AcquireCustomStreamInfo(ExceptionInfo *),
  *DestroyCustomStreamInfo(CustomStreamInfo *);

extern MagickExport FILE
  *GetBlobFileHandle(const Image *) magick_attribute((__pure__));

extern MagickExport Image
  *BlobToImage(const ImageInfo *,const void *,const size_t,ExceptionInfo *),
  *PingBlob(const ImageInfo *,const void *,const size_t,ExceptionInfo *),
  *CustomStreamToImage(const ImageInfo *,ExceptionInfo *);

extern MagickExport MagickBooleanType
  BlobToFile(char *,const void *,const size_t,ExceptionInfo *),
  FileToImage(Image *,const char *,ExceptionInfo *),
  GetBlobError(const Image *) magick_attribute((__pure__)),
  ImageToFile(Image *,char *,ExceptionInfo *),
  InjectImageBlob(const ImageInfo *,Image *,Image *,const char *,
    ExceptionInfo *),
  IsBlobExempt(const Image *) magick_attribute((__pure__)),
  IsBlobSeekable(const Image *) magick_attribute((__pure__)),
  IsBlobTemporary(const Image *) magick_attribute((__pure__));

extern MagickExport MagickSizeType
  GetBlobSize(const Image *);

extern MagickExport StreamHandler
  GetBlobStreamHandler(const Image *) magick_attribute((__pure__));

extern MagickExport void
  *GetBlobStreamData(const Image *) magick_attribute((__pure__)),
  DestroyBlob(Image *),
  DuplicateBlob(Image *,const Image *),
  *FileToBlob(const char *,const size_t,size_t *,ExceptionInfo *),
  *ImageToBlob(const ImageInfo *,Image *,size_t *,ExceptionInfo *),
  ImageToCustomStream(const ImageInfo *,Image *,ExceptionInfo *),
  *ImagesToBlob(const ImageInfo *,Image *,size_t *,ExceptionInfo *),
  ImagesToCustomStream(const ImageInfo *,Image *,ExceptionInfo *),
  SetBlobExempt(Image *,const MagickBooleanType),
  SetCustomStreamData(CustomStreamInfo *,void *),
  SetCustomStreamReader(CustomStreamInfo *,CustomStreamHandler),
  SetCustomStreamSeeker(CustomStreamInfo *,CustomStreamSeeker),
  SetCustomStreamTeller(CustomStreamInfo *,CustomStreamTeller),
  SetCustomStreamWriter(CustomStreamInfo *,CustomStreamHandler);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: cache-private.h]---
Location: ImageMagick-main/MagickCore/cache-private.h

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

  MagickCore cache private methods.
*/
#ifndef MAGICKCORE_CACHE_PRIVATE_H
#define MAGICKCORE_CACHE_PRIVATE_H

#include "MagickCore/cache.h"
#include "MagickCore/distribute-cache.h"
#include "MagickCore/opencl-private.h"
#include "MagickCore/pixel.h"
#include "MagickCore/random_.h"
#include "MagickCore/thread-private.h"
#include "MagickCore/semaphore.h"

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

typedef void
  *Cache;

typedef MagickBooleanType
  (*GetOneAuthenticPixelFromHandler)(Image *,const ssize_t,const ssize_t,
    Quantum *,ExceptionInfo *),
  (*GetOneVirtualPixelFromHandler)(const Image *,const VirtualPixelMethod,
    const ssize_t,const ssize_t,Quantum *,ExceptionInfo *),
  (*SyncAuthenticPixelsHandler)(Image *,ExceptionInfo *);

typedef const Quantum
  *(*GetVirtualPixelHandler)(const Image *,const VirtualPixelMethod,
    const ssize_t,const ssize_t,const size_t,const size_t,ExceptionInfo *),
  *(*GetVirtualPixelsHandler)(const Image *);

typedef const void
  *(*GetVirtualMetacontentFromHandler)(const Image *);

typedef Quantum
  *(*GetAuthenticPixelsHandler)(Image *,const ssize_t,const ssize_t,
    const size_t,const size_t,ExceptionInfo *);

typedef Quantum
  *(*GetAuthenticPixelsFromHandler)(const Image *);

typedef Quantum
  *(*QueueAuthenticPixelsHandler)(Image *,const ssize_t,const ssize_t,
    const size_t,const size_t,ExceptionInfo *);

typedef void
  (*DestroyPixelHandler)(Image *);

typedef void
  *(*GetAuthenticMetacontentFromHandler)(const Image *);

typedef struct _CacheMethods
{
  GetVirtualPixelHandler
    get_virtual_pixel_handler;

  GetVirtualPixelsHandler
    get_virtual_pixels_handler;

  GetVirtualMetacontentFromHandler
    get_virtual_metacontent_from_handler;

  GetOneVirtualPixelFromHandler
    get_one_virtual_pixel_from_handler;

  GetAuthenticPixelsHandler
    get_authentic_pixels_handler;

  GetAuthenticMetacontentFromHandler
    get_authentic_metacontent_from_handler;

  GetOneAuthenticPixelFromHandler
    get_one_authentic_pixel_from_handler;

  GetAuthenticPixelsFromHandler
    get_authentic_pixels_from_handler;

  QueueAuthenticPixelsHandler
    queue_authentic_pixels_handler;

  SyncAuthenticPixelsHandler
    sync_authentic_pixels_handler;

  DestroyPixelHandler
    destroy_pixel_handler;
} CacheMethods;

typedef struct _NexusInfo
{
  MagickBooleanType
    mapped;

  RectangleInfo
    region;

  MagickSizeType
    length;

  Quantum
    *cache,
    *pixels;

  MagickBooleanType
    authentic_pixel_cache;

  void
    *metacontent;

  size_t
    signature;

  struct _NexusInfo
    *virtual_nexus;
} NexusInfo;

typedef struct _CacheInfo
{
  ClassType
    storage_class;

  ColorspaceType
    colorspace;

  PixelTrait
    alpha_trait;

  ChannelType
    channels;

  size_t
    columns,
    rows;

  size_t
    metacontent_extent,
    number_channels;

  PixelChannelMap
    channel_map[MaxPixelChannels];

  CacheType
    type;

  MapMode
    mode,
    disk_mode;

  MagickBooleanType
    mapped;

  MagickOffsetType
    offset;

  MagickSizeType
    length;

  VirtualPixelMethod
    virtual_pixel_method;

  PixelInfo
    virtual_pixel_color;

  size_t
    number_threads;

  NexusInfo
    **nexus_info;

  Quantum
    *pixels;

  void
    *metacontent;

  int
    file;

  char
    filename[MagickPathExtent],
    cache_filename[MagickPathExtent];

  CacheMethods
    methods;

  RandomInfo
    *random_info;

  void
    *server_info;

  MagickBooleanType
    synchronize,
    debug;

  MagickThreadType
    id;

  ssize_t
    reference_count;

  SemaphoreInfo
    *semaphore,
    *file_semaphore;

  time_t
    timestamp;

  size_t
    signature;

  MagickCLCacheInfo
    opencl;

  MagickBooleanType
    composite_mask;

  MagickSizeType
    width_limit,
    height_limit;
} CacheInfo;

static inline MagickBooleanType IsValidPixelOffset(const ssize_t x,
  const size_t extent)
{
  if (extent == 0)
    return(MagickTrue);
  if ((x >= (ssize_t) (MAGICK_SSIZE_MAX/(ssize_t) extent)) ||
      (x <= (ssize_t) (MAGICK_SSIZE_MIN/(ssize_t) extent)))
    return(MagickFalse);
  return(MagickTrue);
}

extern MagickPrivate Cache
  AcquirePixelCache(const size_t),
  ClonePixelCache(const Cache),
  DestroyPixelCache(Cache),
  ReferencePixelCache(Cache);

extern MagickPrivate ClassType
  GetPixelCacheStorageClass(const Cache);

extern MagickPrivate ColorspaceType
  GetPixelCacheColorspace(const Cache);

extern MagickPrivate const Quantum
  *GetVirtualPixelCacheNexus(const Image *,const VirtualPixelMethod,
    const ssize_t,const ssize_t,const size_t,const size_t,NexusInfo *,
    ExceptionInfo *) magick_hot_spot,
  *GetVirtualPixelsNexus(const Cache,NexusInfo *magick_restrict);

extern MagickPrivate const void
  *GetVirtualMetacontentFromNexus(const Cache,NexusInfo *magick_restrict);

extern MagickPrivate MagickBooleanType
  CacheComponentGenesis(void),
  SyncAuthenticPixelCacheNexus(Image *,NexusInfo *magick_restrict,
    ExceptionInfo *) magick_hot_spot,
  SyncImagePixelCache(Image *,ExceptionInfo *);

extern MagickPrivate MagickSizeType
  GetPixelCacheNexusExtent(const Cache,NexusInfo *magick_restrict);

extern MagickPrivate NexusInfo
  **AcquirePixelCacheNexus(const size_t),
  **DestroyPixelCacheNexus(NexusInfo **,const size_t);

extern MagickPrivate Quantum
  *GetAuthenticPixelCacheNexus(Image *,const ssize_t,const ssize_t,
    const size_t,const size_t,NexusInfo *,ExceptionInfo *) magick_hot_spot,
  *QueueAuthenticPixelCacheNexus(Image *,const ssize_t,const ssize_t,
    const size_t,const size_t,const MagickBooleanType,NexusInfo *,
    ExceptionInfo *) magick_hot_spot;

extern MagickPrivate size_t
  GetPixelCacheChannels(const Cache);

extern MagickPrivate VirtualPixelMethod
  GetPixelCacheVirtualMethod(const Image *),
  SetPixelCacheVirtualMethod(Image *,const VirtualPixelMethod,ExceptionInfo *);

extern MagickPrivate void
  CacheComponentTerminus(void),
  ClonePixelCacheMethods(Cache,const Cache),
  GetPixelCacheTileSize(const Image *,size_t *,size_t *),
  GetPixelCacheMethods(CacheMethods *),
  ResetCacheAnonymousMemory(void),
  ResetPixelCacheChannels(Image *),
  SetPixelCacheMethods(Cache,CacheMethods *);

#if defined(MAGICKCORE_OPENCL_SUPPORT)
extern MagickPrivate cl_mem
  GetAuthenticOpenCLBuffer(const Image *,MagickCLDevice,ExceptionInfo *);

extern MagickPrivate void
  SyncAuthenticOpenCLBuffer(const Image *);
#endif

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

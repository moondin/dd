---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 258
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 258 of 851)

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

---[FILE: image-view.h]---
Location: ImageMagick-main/MagickCore/image-view.h

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

  MagickCore image view methods.
*/
#ifndef MAGICKCORE_IMAGE_VIEW_H
#define MAGICKCORE_IMAGE_VIEW_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

typedef struct _ImageView
  ImageView;

typedef MagickBooleanType
  (*DuplexTransferImageViewMethod)(const ImageView *,const ImageView *,
    ImageView *,const ssize_t,const int,void *),
  (*GetImageViewMethod)(const ImageView *,const ssize_t,const int,void *),
  (*SetImageViewMethod)(ImageView *,const ssize_t,const int,void *),
  (*TransferImageViewMethod)(const ImageView *,ImageView *,const ssize_t,
    const int,void *),
  (*UpdateImageViewMethod)(ImageView *,const ssize_t,const int,void *);

extern MagickExport char
  *GetImageViewException(const ImageView *,ExceptionType *);

extern MagickExport const Quantum
  *GetImageViewVirtualPixels(const ImageView *);

extern MagickExport const void
  *GetImageViewVirtualMetacontent(const ImageView *);

extern MagickExport Image
  *GetImageViewImage(const ImageView *);

extern MagickExport ImageView
  *CloneImageView(const ImageView *),
  *DestroyImageView(ImageView *),
  *NewImageView(Image *,ExceptionInfo *),
  *NewImageViewRegion(Image *,const ssize_t,const ssize_t,const size_t,
    const size_t,ExceptionInfo *);

extern MagickExport MagickBooleanType
  DuplexTransferImageViewIterator(ImageView *,ImageView *,ImageView *,
    DuplexTransferImageViewMethod,void *),
  GetImageViewIterator(ImageView *,GetImageViewMethod,void *),
  IsImageView(const ImageView *),
  SetImageViewIterator(ImageView *,SetImageViewMethod,void *),
  TransferImageViewIterator(ImageView *,ImageView *,TransferImageViewMethod,
    void *),
  UpdateImageViewIterator(ImageView *,UpdateImageViewMethod,void *);

extern MagickExport Quantum
  *GetImageViewAuthenticPixels(const ImageView *);

extern MagickExport RectangleInfo
  GetImageViewExtent(const ImageView *);

extern MagickExport void
  SetImageViewDescription(ImageView *,const char *),
  SetImageViewThreads(ImageView *,const size_t);

extern MagickExport void
  *GetImageViewAuthenticMetacontent(const ImageView *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

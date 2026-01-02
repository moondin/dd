---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 300
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 300 of 851)

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

---[FILE: property.h]---
Location: ImageMagick-main/MagickCore/property.h

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

  MagickCore property methods.
*/
#ifndef MAGICKCORE_PROPERTY_H
#define MAGICKCORE_PROPERTY_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

extern MagickExport char
  *InterpretImageProperties(ImageInfo *,Image *,const char *,
    ExceptionInfo *),
  *RemoveImageProperty(Image *,const char *);

extern MagickExport const char
  *GetNextImageProperty(const Image *),
  *GetImageProperty(const Image *,const char *,ExceptionInfo *),
  *GetMagickProperty(ImageInfo *,Image *,const char *,ExceptionInfo *);

extern MagickExport MagickBooleanType
  CloneImageProperties(Image *,const Image *),
  DefineImageProperty(Image *,const char *,ExceptionInfo *),
  DeleteImageProperty(Image *,const char *),
  FormatImageProperty(Image *,const char *,const char *,...)
    magick_attribute((__format__ (__printf__,3,4))),
  SetImageProperty(Image *,const char *,const char *,ExceptionInfo *);

extern MagickExport void
  DestroyImageProperties(Image *),
  ResetImagePropertyIterator(const Image *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

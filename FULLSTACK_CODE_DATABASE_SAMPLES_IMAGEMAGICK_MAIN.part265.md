---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 265
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 265 of 851)

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

---[FILE: list.h]---
Location: ImageMagick-main/MagickCore/list.h

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

  MagickCore image list methods.
*/
#ifndef MAGICKCORE_LIST_H
#define MAGICKCORE_LIST_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

extern MagickExport Image
  *CloneImageList(const Image *,ExceptionInfo *),
  *CloneImages(const Image *,const char *,ExceptionInfo *),
  *DestroyImageList(Image *),
  *DuplicateImages(Image *,const size_t,const char *,ExceptionInfo *),
  *GetFirstImageInList(const Image *) magick_attribute((__pure__)),
  *GetImageFromList(const Image *,const ssize_t) magick_attribute((__pure__)),
  *GetLastImageInList(const Image *) magick_attribute((__pure__)),
  *GetNextImageInList(const Image *) magick_attribute((__pure__)),
  *GetPreviousImageInList(const Image *) magick_attribute((__pure__)),
  **ImageListToArray(const Image *,ExceptionInfo *),
  *NewImageList(void) magick_attribute((__const__)),
  *RemoveImageFromList(Image **),
  *RemoveLastImageFromList(Image **),
  *RemoveFirstImageFromList(Image **),
  *SpliceImageIntoList(Image **,const size_t,const Image *),
  *SplitImageList(Image *),
  *SyncNextImageInList(const Image *);

extern MagickExport size_t
  GetImageListLength(const Image *) magick_attribute((__pure__));

extern MagickExport ssize_t
  GetImageIndexInList(const Image *) magick_attribute((__pure__));

extern MagickExport void
  AppendImageToList(Image **,const Image *),
  DeleteImageFromList(Image **),
  DeleteImages(Image **,const char *,ExceptionInfo *),
  InsertImageInList(Image **,Image *),
  PrependImageToList(Image **,Image *),
  ReplaceImageInList(Image **,Image *),
  ReplaceImageInListReturnLast(Image **,Image *),
  ReverseImageList(Image **),
  SyncImageList(Image *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: locale-private.h]---
Location: ImageMagick-main/MagickCore/locale-private.h

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

  MagickCore private locale methods.
*/
#ifndef MAGICKCORE_LOCALE_PRIVATE_H
#define MAGICKCORE_LOCALE_PRIVATE_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#if !defined(MagickLocaleExtent)
# define MagickLocaleExtent  256
#endif

extern MagickPrivate MagickBooleanType
  LocaleComponentGenesis(void);

extern MagickPrivate void
  LocaleComponentTerminus(void);

extern MagickPrivate ssize_t
  FormatLocaleFileList(FILE *,const char *magick_restrict,va_list)
    magick_attribute((__format__ (__printf__,2,0))),
  FormatLocaleStringList(char *magick_restrict,const size_t,
    const char *magick_restrict,va_list)
    magick_attribute((__format__ (__printf__,3,0)));

static inline int LocaleToLowercase(const int c)
{
  if ((c == EOF) || (c != (unsigned char) c))
    return(c);
#if defined(MAGICKCORE_LOCALE_SUPPORT)
  if (c_locale != (locale_t) NULL)
    return(tolower_l((int) ((unsigned char) c),c_locale));
#endif
  return(tolower((int) ((unsigned char) c)));
}

static inline int LocaleToUppercase(const int c)
{
  if ((c == EOF) || (c != (unsigned char) c))
    return(c);
#if defined(MAGICKCORE_LOCALE_SUPPORT)
  if (c_locale != (locale_t) NULL)
    return(toupper_l((int) ((unsigned char) c),c_locale));
#endif
  return(toupper((int) ((unsigned char) c)));
}

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

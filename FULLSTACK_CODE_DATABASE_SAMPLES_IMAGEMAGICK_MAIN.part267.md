---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 267
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 267 of 851)

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

---[FILE: locale_.h]---
Location: ImageMagick-main/MagickCore/locale_.h

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

  MagickCore locale methods.
*/
#ifndef MAGICKCORE_LOCALE_H
#define MAGICKCORE_LOCALE_H

#include "MagickCore/linked-list.h"

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

typedef struct _LocaleInfo
{
  char
    *path,
    *tag,
    *message;

  MagickBooleanType
    stealth;

  size_t
    signature;
} LocaleInfo;

extern MagickExport char
  **GetLocaleList(const char *,size_t *,ExceptionInfo *);

extern MagickExport const char
  *GetLocaleMessage(const char *);

extern MagickExport const LocaleInfo
  *GetLocaleInfo_(const char *,ExceptionInfo *),
  **GetLocaleInfoList(const char *,size_t *,ExceptionInfo *);

extern MagickExport double
  InterpretLocaleValue(const char *magick_restrict,char *magick_restrict *);

extern MagickExport int
  LocaleCompare(const char *,const char *) magick_attribute((__pure__)),
  LocaleLowercase(const int),
  LocaleNCompare(const char *,const char *,const size_t)
    magick_attribute((__pure__)),
  LocaleUppercase(const int);

extern MagickExport LinkedListInfo
  *DestroyLocaleOptions(LinkedListInfo *),
  *GetLocaleOptions(const char *,ExceptionInfo *);

extern MagickExport MagickBooleanType
  ListLocaleInfo(FILE *,ExceptionInfo *);

extern MagickExport ssize_t
  FormatLocaleFile(FILE *,const char *magick_restrict,...)
    magick_attribute((__format__ (__printf__,2,3))),
  FormatLocaleString(char *magick_restrict,const size_t,
    const char *magick_restrict,...)
    magick_attribute((__format__ (__printf__,3,4)));

extern MagickExport void
  LocaleLower(char *),
  LocaleUpper(char *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: log-private.h]---
Location: ImageMagick-main/MagickCore/log-private.h

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

  MagickCore private log methods.
*/
#ifndef MAGICKCORE_LOG_PRIVATE_H
#define MAGICKCORE_LOG_PRIVATE_H

#include "MagickCore/exception.h"

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

extern MagickPrivate MagickBooleanType
  LogComponentGenesis(void);

extern MagickPrivate void
  LogComponentTerminus(void);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

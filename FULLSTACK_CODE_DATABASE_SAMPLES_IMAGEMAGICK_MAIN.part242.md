---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 242
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 242 of 851)

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

---[FILE: enhance.h]---
Location: ImageMagick-main/MagickCore/enhance.h

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

  MagickCore image enhance methods.
*/
#ifndef MAGICKCORE_ENHANCE_H
#define MAGICKCORE_ENHANCE_H

#include "MagickCore/pixel.h"

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

extern MagickExport MagickBooleanType
  AutoGammaImage(Image *,ExceptionInfo *),
  AutoLevelImage(Image *,ExceptionInfo *),
  BrightnessContrastImage(Image *,const double,const double,ExceptionInfo *),
  CLAHEImage(Image *,const size_t,const size_t,const size_t,const double,
    ExceptionInfo *),
  ClutImage(Image *,const Image *,const PixelInterpolateMethod,ExceptionInfo *),
  ColorDecisionListImage(Image *,const char *,ExceptionInfo *),
  ContrastImage(Image *,const MagickBooleanType,ExceptionInfo *),
  ContrastStretchImage(Image *,const double,const double,ExceptionInfo *),
  EqualizeImage(Image *image,ExceptionInfo *),
  GammaImage(Image *,const double,ExceptionInfo *),
  GrayscaleImage(Image *,const PixelIntensityMethod,ExceptionInfo *),
  HaldClutImage(Image *,const Image *,ExceptionInfo *),
  LevelImage(Image *,const double,const double,const double,ExceptionInfo *),
  LevelizeImage(Image *,const double,const double,const double,ExceptionInfo *),
  LevelImageColors(Image *,const PixelInfo *,const PixelInfo *,
    const MagickBooleanType,ExceptionInfo *),
  LinearStretchImage(Image *,const double,const double,ExceptionInfo *),
  ModulateImage(Image *,const char *,ExceptionInfo *),
  NegateImage(Image *,const MagickBooleanType,ExceptionInfo *),
  NormalizeImage(Image *,ExceptionInfo *),
  SigmoidalContrastImage(Image *,const MagickBooleanType,const double,
    const double,ExceptionInfo *),
  WhiteBalanceImage(Image *,ExceptionInfo *);

extern MagickExport Image
  *EnhanceImage(const Image *,ExceptionInfo *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: exception-private.h]---
Location: ImageMagick-main/MagickCore/exception-private.h

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

  MagickCore exception private methods.
*/
#ifndef MAGICKCORE_EXCEPTION_PRIVATE_H
#define MAGICKCORE_EXCEPTION_PRIVATE_H

#include "MagickCore/log.h"
#include "MagickCore/magick.h"
#include "MagickCore/string_.h"

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#define ThrowBinaryException(severity,tag,context) \
{ \
  (void) ThrowMagickException(exception,GetMagickModule(),severity,tag, \
    "`%s'",context); \
  return(MagickFalse); \
}
#define ThrowFatalException(severity,tag) \
{ \
  char \
    *fatal_message; \
 \
  ExceptionInfo \
    *fatal_exception; \
 \
  fatal_exception=AcquireExceptionInfo(); \
  fatal_message=GetExceptionMessage(errno); \
  (void) ThrowMagickException(fatal_exception,GetMagickModule(),severity,tag, \
    "`%s'",fatal_message); \
  fatal_message=DestroyString(fatal_message); \
  CatchException(fatal_exception); \
  (void) DestroyExceptionInfo(fatal_exception); \
  MagickCoreTerminus(); \
  _exit((int) (severity-FatalErrorException)+1); \
}
#define ThrowFileException(exception,severity,tag,context) \
{ \
  char \
    *file_message; \
 \
  file_message=GetExceptionMessage(errno); \
  (void) ThrowMagickException(exception,GetMagickModule(),severity,tag, \
    "'%s': %s",context,file_message); \
  file_message=DestroyString(file_message); \
}
#define ThrowImageException(severity,tag) \
{ \
  (void) ThrowMagickException(exception,GetMagickModule(),severity,tag, \
    "`%s'",image->filename); \
  return((Image *) NULL); \
}
#define ThrowReaderException(severity,tag) \
{ \
  (void) ThrowMagickException(exception,GetMagickModule(),severity,tag, \
    "`%s'",image_info->filename); \
  if ((image) != (Image *) NULL) \
    { \
      (void) CloseBlob(image); \
      image=DestroyImageList(image); \
    } \
  return((Image *) NULL); \
}
#define ThrowWriterException(severity,tag) \
{ \
  (void) ThrowMagickException(exception,GetMagickModule(),severity,tag, \
    "`%s'",image->filename); \
  if (image_info->adjoin != MagickFalse) \
    while (image->previous != (Image *) NULL) \
      image=image->previous; \
  (void) CloseBlob(image); \
  return(MagickFalse); \
}

extern MagickPrivate void
  ExceptionComponentTerminus(void),
  InitializeExceptionInfo(ExceptionInfo *);

extern MagickPrivate MagickBooleanType
  ExceptionComponentGenesis(void);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

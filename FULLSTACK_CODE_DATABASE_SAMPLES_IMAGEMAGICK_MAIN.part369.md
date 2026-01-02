---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 369
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 369 of 851)

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

---[FILE: magick-property.h]---
Location: ImageMagick-main/MagickWand/magick-property.h

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

  MagickWand property, options, and profile  methods.
*/

#ifndef MAGICKWAND_MAGICK_PROPERTY_H
#define MAGICKWAND_MAGICK_PROPERTY_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

extern WandExport char
  *MagickGetFilename(const MagickWand *),
  *MagickGetFormat(MagickWand *),
  *MagickGetFont(MagickWand *),
  *MagickGetHomeURL(void),
  *MagickGetImageArtifact(MagickWand *,const char *),
  **MagickGetImageArtifacts(MagickWand *,const char *,size_t *),
  **MagickGetImageProfiles(MagickWand *,const char *,size_t *),
  *MagickGetImageProperty(MagickWand *,const char *),
  **MagickGetImageProperties(MagickWand *,const char *,size_t *),
  *MagickGetOption(MagickWand *,const char *),
  **MagickGetOptions(MagickWand *,const char *,size_t *),
  *MagickQueryConfigureOption(const char *),
  **MagickQueryConfigureOptions(const char *,size_t *),
  **MagickQueryFonts(const char *,size_t *),
  **MagickQueryFormats(const char *,size_t *);

extern WandExport ColorspaceType
  MagickGetColorspace(MagickWand *);

extern WandExport CompressionType
  MagickGetCompression(MagickWand *);

extern WandExport const char
  *MagickGetCopyright(void),
  *MagickGetPackageName(void),
  *MagickGetQuantumDepth(size_t *),
  *MagickGetQuantumRange(size_t *),
  *MagickGetReleaseDate(void),
  *MagickGetVersion(size_t *);

extern WandExport double
  MagickGetPointsize(MagickWand *),
  *MagickGetSamplingFactors(MagickWand *,size_t *),
  *MagickQueryFontMetrics(MagickWand *,const DrawingWand *,const char *),
  *MagickQueryMultilineFontMetrics(MagickWand *,const DrawingWand *,
    const char *);

extern WandExport FilterType
  MagickGetFilter(MagickWand *);

extern WandExport GravityType
  MagickGetGravity(MagickWand *);

extern WandExport ImageType
  MagickGetType(MagickWand *);

extern WandExport InterlaceType
  MagickGetInterlaceScheme(MagickWand *);

extern WandExport PixelInterpolateMethod
  MagickGetInterpolateMethod(MagickWand *);

extern WandExport OrientationType
  MagickGetOrientation(MagickWand *);

extern WandExport MagickBooleanType
  MagickDeleteImageArtifact(MagickWand *,const char *),
  MagickDeleteImageProperty(MagickWand *,const char *),
  MagickDeleteOption(MagickWand *,const char *),
  MagickGetAntialias(const MagickWand *),
  MagickGetPage(const MagickWand *,size_t *,size_t *,ssize_t *,ssize_t *),
  MagickGetResolution(const MagickWand *,double *,double *),
  MagickGetSize(const MagickWand *,size_t *,size_t *),
  MagickGetSizeOffset(const MagickWand *,ssize_t *),
  MagickProfileImage(MagickWand *,const char *,const void *,const size_t),
  MagickSetAntialias(MagickWand *,const MagickBooleanType),
  MagickSetBackgroundColor(MagickWand *,const PixelWand *),
  MagickSetColorspace(MagickWand *,const ColorspaceType),
  MagickSetCompression(MagickWand *,const CompressionType),
  MagickSetCompressionQuality(MagickWand *,const size_t),
  MagickSetDepth(MagickWand *,const size_t),
  MagickSetExtract(MagickWand *,const char *),
  MagickSetFilename(MagickWand *,const char *),
  MagickSetFilter(MagickWand *,const FilterType),
  MagickSetFormat(MagickWand *,const char *),
  MagickSetFont(MagickWand *,const char *),
  MagickSetGravity(MagickWand *,const GravityType),
  MagickSetImageArtifact(MagickWand *,const char *,const char *),
  MagickSetImageProfile(MagickWand *,const char *,const void *,const size_t),
  MagickSetImageProperty(MagickWand *,const char *,const char *),
  MagickSetInterlaceScheme(MagickWand *,const InterlaceType),
  MagickSetInterpolateMethod(MagickWand *,const PixelInterpolateMethod),
  MagickSetOption(MagickWand *,const char *,const char *),
  MagickSetOrientation(MagickWand *,const OrientationType),
  MagickSetPage(MagickWand *,const size_t,const size_t,const ssize_t,
    const ssize_t),
  MagickSetPassphrase(MagickWand *,const char *),
  MagickSetPointsize(MagickWand *,const double),
  MagickSetResolution(MagickWand *,const double,const double),
  MagickSetResourceLimit(const ResourceType type,const MagickSizeType limit),
  MagickSetSamplingFactors(MagickWand *,const size_t,const double *),
  MagickSetSecurityPolicy(MagickWand *,const char *),
  MagickSetSize(MagickWand *,const size_t,const size_t),
  MagickSetSizeOffset(MagickWand *,const size_t,const size_t,const ssize_t),
  MagickSetType(MagickWand *,const ImageType);

extern WandExport MagickProgressMonitor
  MagickSetProgressMonitor(MagickWand *,const MagickProgressMonitor,void *);

extern WandExport MagickSizeType
  MagickGetResource(const ResourceType),
  MagickGetResourceLimit(const ResourceType);

extern WandExport PixelWand
  *MagickGetBackgroundColor(MagickWand *);

extern WandExport OrientationType
  MagickGetOrientationType(MagickWand *);

extern WandExport size_t
  MagickGetCompressionQuality(MagickWand *);

extern WandExport unsigned char
  *MagickGetImageProfile(MagickWand *,const char *,size_t *),
  *MagickRemoveImageProfile(MagickWand *,const char *,size_t *);

extern WandExport void
  MagickSetSeed(const unsigned long);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: magick-wand-private.h]---
Location: ImageMagick-main/MagickWand/magick-wand-private.h

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

  ImageMagick pixel wand API.
*/
#ifndef MAGICKWAND_MAGICK_WAND_PRIVATE_H
#define MAGICKWAND_MAGICK_WAND_PRIVATE_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#define MagickWandId  "MagickWand"
#define QuantumTick(i,span) ((MagickBooleanType) ((((i) & ((i)-1)) == 0) || \
   (((i) & 0xfff) == 0) || \
   ((MagickOffsetType) (i) == ((MagickOffsetType) (span)-1))))
#define ThrowWandException(severity,tag,context) \
{ \
  (void) ThrowMagickException(wand->exception,GetMagickModule(),severity, \
    tag,"`%s'",context); \
  return(MagickFalse); \
}
#define ThrowWandFatalException(severity,tag,context) \
{ \
  ExceptionInfo \
    *fatal_exception; \
 \
  fatal_exception=AcquireExceptionInfo(); \
  (void) ThrowMagickException(fatal_exception,GetMagickModule(),severity,tag, \
    "`%s'",context); \
  CatchException(fatal_exception); \
  (void) DestroyExceptionInfo(fatal_exception); \
  MagickWandTerminus(); \
  _exit((int) (severity-FatalErrorException)+1); \
}

static inline void CheckMagickCoreCompatibility(void)
{
  const char
    *quantum;

  size_t
    depth;

  quantum=GetMagickQuantumDepth(&depth);
  if (depth != MAGICKCORE_QUANTUM_DEPTH)
    ThrowWandFatalException(WandError,"QuantumDepthMismatch",quantum);
}

struct _MagickWand
{
  size_t
    id;

  char
    name[MagickPathExtent];  /* Wand name to use for MagickWand Logs */

  Image
    *images;          /* The images in this wand - also the current image */

  ImageInfo
    *image_info;      /* Global settings used for images in Wand */

  ExceptionInfo
    *exception;

  MagickBooleanType
    insert_before,    /* wand set to first image, prepend new images */
    image_pending,    /* this image is pending Next/Previous Iteration */
    debug;            /* Log calls to MagickWand library */

  size_t
    signature;
};

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

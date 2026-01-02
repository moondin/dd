---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 296
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 296 of 851)

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

---[FILE: policy.h]---
Location: ImageMagick-main/MagickCore/policy.h

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

  MagickCore security policy methods.
*/
#ifndef MAGICKCORE_POLICY_H
#define MAGICKCORE_POLICY_H

#include "MagickCore/pixel.h"
#include "MagickCore/exception.h"

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

typedef enum
{
  UndefinedPolicyDomain,
  CoderPolicyDomain,
  DelegatePolicyDomain,
  FilterPolicyDomain,
  PathPolicyDomain,
  ResourcePolicyDomain,
  SystemPolicyDomain,
  CachePolicyDomain,
  ModulePolicyDomain
} PolicyDomain;

typedef enum
{
  UndefinedPolicyRights = 0x00,
  NoPolicyRights = 0x00,
  ReadPolicyRights = 0x01,
  WritePolicyRights = 0x02,
  ExecutePolicyRights = 0x04,
  AllPolicyRights = 0xff
} PolicyRights;

typedef struct _PolicyInfo
  PolicyInfo;

extern MagickExport char
  *GetPolicyValue(const char *),
  **GetPolicyList(const char *,size_t *,ExceptionInfo *);

extern MagickExport const PolicyInfo
  **GetPolicyInfoList(const char *,size_t *,ExceptionInfo *);

extern MagickExport MagickBooleanType
  IsRightsAuthorized(const PolicyDomain,const PolicyRights,const char *),
  ListPolicyInfo(FILE *,ExceptionInfo *),
  SetMagickSecurityPolicy(const char *,ExceptionInfo *),
  SetMagickSecurityPolicyValue(const PolicyDomain,const char *,const char *,
    ExceptionInfo *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: prepress.c]---
Location: ImageMagick-main/MagickCore/prepress.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%           PPPP    RRRR    EEEEE  PPPP   RRRR   EEEEE  SSSSS  SSSSS          %
%           P   P   R   R   E      P   P  R   R  E      SS     SS             %
%           PPPP    RRRR    EEE    PPPP   RRRR   EEE     SSS    SSS           %
%           P       R R     E      P      R R    E         SS     SS          %
%           P       R  R    EEEEE  P      R  R   EEEEE  SSSSS  SSSSS          %
%                                                                             %
%                                                                             %
%                         MagickCore Prepress Methods                         %
%                                                                             %
%                              Software Design                                %
%                                   Cristy                                    %
%                                October 2001                                 %
%                                                                             %
%                                                                             %
%  Copyright @ 1999 ImageMagick Studio LLC, a non-profit organization         %
%  dedicated to making software imaging solutions freely available.           %
%                                                                             %
%  You may not use this file except in compliance with the License.  You may  %
%  obtain a copy of the License at                                            %
%                                                                             %
%    https://imagemagick.org/script/license.php                               %
%                                                                             %
%  Unless required by applicable law or agreed to in writing, software        %
%  distributed under the License is distributed on an "AS IS" BASIS,          %
%  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   %
%  See the License for the specific language governing permissions and        %
%  limitations under the License.                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%
*/

/*
  Include declarations.
*/
#include "MagickCore/studio.h"
#include "MagickCore/cache-view.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/image.h"
#include "MagickCore/linked-list.h"
#include "MagickCore/list.h"
#include "MagickCore/memory_.h"
#include "MagickCore/pixel-accessor.h"
#include "MagickCore/prepress.h"
#include "MagickCore/resource_.h"
#include "MagickCore/registry.h"
#include "MagickCore/semaphore.h"
#include "MagickCore/splay-tree.h"
#include "MagickCore/string_.h"
#include "MagickCore/thread-private.h"

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   G e t I m a g e T o t a l I n k D e n s i t y                             %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  GetImageTotalInkDensity() returns the total ink density for a CMYK image.
%  Total Ink Density (TID) is determined by adding the CMYK values in the
%  darkest shadow area in an image.
%
%  The format of the GetImageTotalInkDensity method is:
%
%      double GetImageTotalInkDensity(const Image *image,
%        ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image: the image.
%
%    o exception: return any errors or warnings in this structure.
%
*/
MagickExport double GetImageTotalInkDensity(Image *image,
  ExceptionInfo *exception)
{
  CacheView
    *image_view;

  double
    total_ink_density;

  MagickBooleanType
    status;

  ssize_t
    y;

  assert(image != (Image *) NULL);
  assert(image->signature == MagickCoreSignature);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"...");
  if (image->colorspace != CMYKColorspace)
    {
      (void) ThrowMagickException(exception,GetMagickModule(),ImageError,
        "ColorSeparatedImageRequired","`%s'",image->filename);
      return(0.0);
    }
  status=MagickTrue;
  total_ink_density=0.0;
  image_view=AcquireVirtualCacheView(image,exception);
#if defined(MAGICKCORE_OPENMP_SUPPORT)
  #pragma omp parallel for schedule(static) shared(status) \
    magick_number_threads(image,image,image->rows,1)
#endif
  for (y=0; y < (ssize_t) image->rows; y++)
  {
    double
      density;

    const Quantum
      *p;

    ssize_t
      x;

    p=GetCacheViewVirtualPixels(image_view,0,y,image->columns,1,exception);
    if (p == (const Quantum *) NULL)
      {
        status=MagickFalse;
        continue;
      }
    for (x=0; x < (ssize_t) image->columns; x++)
    {
      density=(double) GetPixelRed(image,p)+(double) GetPixelGreen(image,p)+
        (double) GetPixelBlue(image,p)+(double) GetPixelBlack(image,p);
      if (density > total_ink_density)
#if defined(MAGICKCORE_OPENMP_SUPPORT)
        #pragma omp critical (MagickCore_GetImageTotalInkDensity)
#endif
        {
          if (density > total_ink_density)
            total_ink_density=density;
        }
      p+=(ptrdiff_t) GetPixelChannels(image);
    }
  }
  image_view=DestroyCacheView(image_view);
  if (status == MagickFalse)
    total_ink_density=0.0;
  return(total_ink_density);
}
```

--------------------------------------------------------------------------------

---[FILE: prepress.h]---
Location: ImageMagick-main/MagickCore/prepress.h

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

  MagickCore prepress methods.
*/
#ifndef MAGICKCORE_PREPRESS_H
#define MAGICKCORE_PREPRESS_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

extern MagickExport double
  GetImageTotalInkDensity(Image *image,ExceptionInfo *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: profile-private.h]---
Location: ImageMagick-main/MagickCore/profile-private.h

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

  MagickCore private image profile methods.
*/
#ifndef MAGICKCORE_PROFILE_PRIVATE_H
#define MAGICKCORE_PROFILE_PRIVATE_H

#include "MagickCore/string_.h"

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

extern MagickExport MagickBooleanType
  SetImageProfilePrivate(Image *,StringInfo *,ExceptionInfo *);

extern MagickExport StringInfo
  *AcquireProfileStringInfo(const char *,const size_t length,ExceptionInfo *),
  *BlobToProfileStringInfo(const char *,const void *blob,const size_t length,
    ExceptionInfo *exception);

extern MagickPrivate void
  Update8BIMClipPath(const Image *,const size_t,const size_t,
    const RectangleInfo *),
  SyncImageProfiles(Image *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif 
#endif
```

--------------------------------------------------------------------------------

````

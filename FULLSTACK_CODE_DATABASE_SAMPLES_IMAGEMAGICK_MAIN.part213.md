---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 213
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 213 of 851)

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

---[FILE: cipher.h]---
Location: ImageMagick-main/MagickCore/cipher.h

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

  MagickCore cipher methods.
*/
#ifndef MAGICKCORE_CIPHER_H
#define MAGICKCORE_CIPHER_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

extern MagickExport MagickBooleanType
  DecipherImage(Image *,const char *,ExceptionInfo *),
  EncipherImage(Image *,const char *,ExceptionInfo *),
  PasskeyDecipherImage(Image *,const StringInfo *,ExceptionInfo *),
  PasskeyEncipherImage(Image *,const StringInfo *,ExceptionInfo *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: client.c]---
Location: ImageMagick-main/MagickCore/client.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                  CCCC  L      IIIII  EEEEE  N   N  TTTTT                    %
%                 C      L        I    E      NN  N    T                      %
%                 C      L        I    EEE    N N N    T                      %
%                 C      L        I    E      N  NN    T                      %
%                  CCCC  LLLLL  IIIII  EEEEE  N   N    T                      %
%                                                                             %
%                                                                             %
%                         MagickCore Client Methods                           %
%                                                                             %
%                             Software Design                                 %
%                                  Cristy                                     %
%                               March 2003                                    %
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
#include "MagickCore/client.h"
#include "MagickCore/log.h"
#include "MagickCore/string_.h"

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   G e t C l i e n t N a m e                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  GetClientName returns the current client name.
%
%  The format of the GetClientName method is:
%
%      const char *GetClientName(void)
%
*/
MagickExport const char *GetClientName(void)
{
  return(SetClientName((const char *) NULL));
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   G e t C l i e n t P a t h                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  GetClientPath returns the current client name.
%
%  The format of the GetClientPath method is:
%
%      const char *GetClientPath(void)
%
*/
MagickExport const char *GetClientPath(void)
{
  return(SetClientPath((const char *) NULL));
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   S e t C l i e n t N a m e                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  SetClientName sets the client name and returns it.
%
%  The format of the SetClientName method is:
%
%      const char *SetClientName(const char *name)
%
%  A description of each parameter follows:
%
%    o name: Specifies the new client name.
%
*/
MagickExport const char *SetClientName(const char *name)
{
  static char
    client_name[256] = "";

  if ((name != (char *) NULL) && (*name != '\0'))
    {
      (void) CopyMagickString(client_name,name,sizeof(client_name));
      (void) LogMagickEvent(ConfigureEvent,GetMagickModule(),"%s",client_name);
    }
  return(*client_name == '\0' ? "Magick" : client_name);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   S e t C l i e n t P a t h                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  SetClientPath() sets the client path if the name is specified.  Otherwise
%  the current client path is returned. A zero-length string is returned if
%  the client path has never been set.
%
%  The format of the SetClientPath method is:
%
%      const char *SetClientPath(const char *path)
%
%  A description of each parameter follows:
%
%    o path: Specifies the new client path.
%
*/
MagickExport const char *SetClientPath(const char *path)
{
  static char
    client_path[MagickPathExtent] = "";

  if ((path != (char *) NULL) && (*path != '\0'))
    {
      (void) CopyMagickString(client_path,path,MagickPathExtent);
      (void) LogMagickEvent(ConfigureEvent,GetMagickModule(),"%s",path);
    }
  return(client_path);
}
```

--------------------------------------------------------------------------------

---[FILE: client.h]---
Location: ImageMagick-main/MagickCore/client.h

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

  MagickCore client methods.
*/
#ifndef MAGICKCORE_CLIENT_H
#define MAGICKCORE_CLIENT_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

extern MagickExport const char
  *GetClientPath(void) magick_attribute((__const__)),
  *GetClientName(void) magick_attribute((__const__)),
  *SetClientName(const char *),
  *SetClientPath(const char *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: coder-private.h]---
Location: ImageMagick-main/MagickCore/coder-private.h

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

  MagickCore private image coder methods.
*/
#ifndef MAGICKCORE_CODER_PRIVATE_H
#define MAGICKCORE_CODER_PRIVATE_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

extern MagickPrivate MagickBooleanType
  CoderComponentGenesis(void);

extern MagickPrivate void
  CoderComponentTerminus(void);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: coder.c]---
Location: ImageMagick-main/MagickCore/coder.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                   CCCC   OOO   DDDD    EEEEE  RRRR                          %
%                  C      O   O  D   D   E      R   R                         %
%                  C      O   O  D   D   EEE    RRRR                          %
%                  C      O   O  D   D   E      R R                           %
%                   CCCC   OOO   DDDD    EEEEE  R  R                          %
%                                                                             %
%                                                                             %
%                     MagickCore Image Coder Methods                          %
%                                                                             %
%                              Software Design                                %
%                                   Cristy                                    %
%                                 May 2001                                    %
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
#include "MagickCore/blob.h"
#include "MagickCore/client.h"
#include "MagickCore/coder.h"
#include "MagickCore/coder-private.h"
#include "MagickCore/configure.h"
#include "MagickCore/draw.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/log.h"
#include "MagickCore/memory_.h"
#include "MagickCore/memory-private.h"
#include "MagickCore/option.h"
#include "MagickCore/semaphore.h"
#include "MagickCore/string_.h"
#include "MagickCore/splay-tree.h"
#include "MagickCore/token.h"
#include "MagickCore/utility.h"
#include "MagickCore/utility-private.h"
#include "coders/coders.h"

/*
  Define declarations.
*/
#define AddMagickCoder(coder) Magick ## coder ## Aliases

/*
  Typedef declarations.
*/
typedef struct _CoderMapInfo
{
  const char
    *magick,
    *name;
} CoderMapInfo;

/*
  Static declarations.
*/
static const CoderMapInfo
  CoderMap[] =
  {
    #include "coders/coders-list.h"
  };

static SemaphoreInfo
  *coder_semaphore = (SemaphoreInfo *) NULL;

static SplayTreeInfo
  *coder_cache = (SplayTreeInfo *) NULL;

/*
  Forward declarations.
*/
static MagickBooleanType
  IsCoderTreeInstantiated(ExceptionInfo *);

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
+  A c q u i r e C o d e r C a c h e                                          %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  AcquireCoderCache() caches one or more coder configurations which provides a
%  mapping between coder attributes and a coder name.
%
%  The format of the AcquireCoderCache coder is:
%
%      SplayTreeInfo *AcquireCoderCache(ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o exception: return any errors or warnings in this structure.
%
*/

static void *DestroyCoderNode(void *coder_info)
{
  CoderInfo
    *p;

  p=(CoderInfo *) coder_info;
  if (p->exempt == MagickFalse)
    {
      if (p->path != (char *) NULL)
        p->path=DestroyString(p->path);
      if (p->name != (char *) NULL)
        p->name=DestroyString(p->name);
      if (p->magick != (char *) NULL)
        p->magick=DestroyString(p->magick);
    }
  return(RelinquishMagickMemory(p));
}

static SplayTreeInfo *AcquireCoderCache(ExceptionInfo *exception)
{
  MagickStatusType
    status;

  ssize_t
    i;

  SplayTreeInfo
    *cache;

  /*
    Load built-in coder map.
  */
  cache=NewSplayTree(CompareSplayTreeString,RelinquishMagickMemory,
    DestroyCoderNode);
  status=MagickTrue;
  for (i=0; i < (ssize_t) (sizeof(CoderMap)/sizeof(*CoderMap)); i++)
  {
    CoderInfo
      *coder_info;

    const CoderMapInfo
      *p;

    p=CoderMap+i;
    coder_info=(CoderInfo *) AcquireMagickMemory(sizeof(*coder_info));
    if (coder_info == (CoderInfo *) NULL)
      {
        (void) ThrowMagickException(exception,GetMagickModule(),
          ResourceLimitError,"MemoryAllocationFailed","`%s'",p->name);
        continue;
      }
    (void) memset(coder_info,0,sizeof(*coder_info));
    coder_info->path=(char *) "[built-in]";
    coder_info->magick=(char *) p->magick;
    coder_info->name=(char *) p->name;
    coder_info->exempt=MagickTrue;
    coder_info->signature=MagickCoreSignature;
    status&=(MagickStatusType) AddValueToSplayTree(cache,
      ConstantString(coder_info->magick),coder_info);
    if (status == MagickFalse)
      (void) ThrowMagickException(exception,GetMagickModule(),
        ResourceLimitError,"MemoryAllocationFailed","`%s'",coder_info->name);
  }
  return(cache);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
+   C o d e r C o m p o n e n t G e n e s i s                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  CoderComponentGenesis() instantiates the coder component.
%
%  The format of the CoderComponentGenesis method is:
%
%      MagickBooleanType CoderComponentGenesis(void)
%
*/
MagickPrivate MagickBooleanType CoderComponentGenesis(void)
{
  if (coder_semaphore == (SemaphoreInfo *) NULL)
    coder_semaphore=AcquireSemaphoreInfo();
  return(MagickTrue);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
+   C o d e r C o m p o n e n t T e r m i n u s                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  CoderComponentTerminus() destroys the coder component.
%
%  The format of the CoderComponentTerminus method is:
%
%      CoderComponentTerminus(void)
%
*/
MagickPrivate void CoderComponentTerminus(void)
{
  if (coder_semaphore == (SemaphoreInfo *) NULL)
    ActivateSemaphoreInfo(&coder_semaphore);
  LockSemaphoreInfo(coder_semaphore);
  if (coder_cache != (SplayTreeInfo *) NULL)
    coder_cache=DestroySplayTree(coder_cache);
  UnlockSemaphoreInfo(coder_semaphore);
  RelinquishSemaphoreInfo(&coder_semaphore);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
+   G e t C o d e r I n f o                                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  GetCoderInfo searches the coder list for the specified name and if found
%  returns attributes for that coder.
%
%  The format of the GetCoderInfo method is:
%
%      const CoderInfo *GetCoderInfo(const char *name,ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o name: the coder name.
%
%    o exception: return any errors or warnings in this structure.
%
*/
MagickExport const CoderInfo *GetCoderInfo(const char *name,
  ExceptionInfo *exception)
{
  assert(exception != (ExceptionInfo *) NULL);
  if (IsCoderTreeInstantiated(exception) == MagickFalse)
    return((const CoderInfo *) NULL);
  if ((name == (const char *) NULL) || (LocaleCompare(name,"*") == 0))
    return((const CoderInfo *) GetRootValueFromSplayTree(coder_cache));
  return((const CoderInfo *) GetValueFromSplayTree(coder_cache,name));
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   G e t C o d e r I n f o L i s t                                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  GetCoderInfoList() returns any coder_map that match the specified pattern.
%  The format of the GetCoderInfoList function is:
%
%      const CoderInfo **GetCoderInfoList(const char *pattern,
%        size_t *number_coders,ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o pattern: Specifies a pointer to a text string containing a pattern.
%
%    o number_coders:  This integer returns the number of coders in the list.
%
%    o exception: return any errors or warnings in this structure.
%
*/

static int CoderInfoCompare(const void *x,const void *y)
{
  const CoderInfo
    **p,
    **q;

  p=(const CoderInfo **) x,
  q=(const CoderInfo **) y;
  if (LocaleCompare((*p)->path,(*q)->path) == 0)
    return(LocaleCompare((*p)->name,(*q)->name));
  return(LocaleCompare((*p)->path,(*q)->path));
}

MagickExport const CoderInfo **GetCoderInfoList(const char *pattern,
  size_t *number_coders,ExceptionInfo *exception)
{
  const CoderInfo
    **coder_map;

  const CoderInfo
    *p;

  ssize_t
    i;

  /*
    Allocate coder list.
  */
  assert(pattern != (char *) NULL);
  assert(number_coders != (size_t *) NULL);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",pattern);
  *number_coders=0;
  p=GetCoderInfo("*",exception);
  if (p == (const CoderInfo *) NULL)
    return((const CoderInfo **) NULL);
  coder_map=(const CoderInfo **) AcquireQuantumMemory((size_t)
    GetNumberOfNodesInSplayTree(coder_cache)+1UL,sizeof(*coder_map));
  if (coder_map == (const CoderInfo **) NULL)
    return((const CoderInfo **) NULL);
  /*
    Generate coder list.
  */
  LockSemaphoreInfo(coder_semaphore);
  ResetSplayTreeIterator(coder_cache);
  p=(const CoderInfo *) GetNextValueInSplayTree(coder_cache);
  for (i=0; p != (const CoderInfo *) NULL; )
  {
    if ((p->stealth == MagickFalse) &&
        (GlobExpression(p->name,pattern,MagickFalse) != MagickFalse))
      coder_map[i++]=p;
    p=(const CoderInfo *) GetNextValueInSplayTree(coder_cache);
  }
  UnlockSemaphoreInfo(coder_semaphore);
  qsort((void *) coder_map,(size_t) i,sizeof(*coder_map),CoderInfoCompare);
  coder_map[i]=(CoderInfo *) NULL;
  *number_coders=(size_t) i;
  return(coder_map);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   G e t C o d e r L i s t                                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  GetCoderList() returns any coder_map that match the specified pattern.
%
%  The format of the GetCoderList function is:
%
%      char **GetCoderList(const char *pattern,size_t *number_coders,
%        ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o pattern: Specifies a pointer to a text string containing a pattern.
%
%    o number_coders:  This integer returns the number of coders in the list.
%
%    o exception: return any errors or warnings in this structure.
%
*/

static int CoderCompare(const void *x,const void *y)
{
  const char
    **p,
    **q;

  p=(const char **) x;
  q=(const char **) y;
  return(LocaleCompare(*p,*q));
}

MagickExport char **GetCoderList(const char *pattern,
  size_t *number_coders,ExceptionInfo *exception)
{
  char
    **coder_map;

  const CoderInfo
    *p;

  ssize_t
    i;

  /*
    Allocate coder list.
  */
  assert(pattern != (char *) NULL);
  assert(number_coders != (size_t *) NULL);
  if (IsEventLogging() != MagickFalse)
    (void) LogMagickEvent(TraceEvent,GetMagickModule(),"%s",pattern);
  *number_coders=0;
  p=GetCoderInfo("*",exception);
  if (p == (const CoderInfo *) NULL)
    return((char **) NULL);
  coder_map=(char **) AcquireQuantumMemory((size_t)
    GetNumberOfNodesInSplayTree(coder_cache)+1UL,sizeof(*coder_map));
  if (coder_map == (char **) NULL)
    return((char **) NULL);
  /*
    Generate coder list.
  */
  LockSemaphoreInfo(coder_semaphore);
  ResetSplayTreeIterator(coder_cache);
  p=(const CoderInfo *) GetNextValueInSplayTree(coder_cache);
  for (i=0; p != (const CoderInfo *) NULL; )
  {
    if ((p->stealth == MagickFalse) &&
        (GlobExpression(p->name,pattern,MagickFalse) != MagickFalse))
      coder_map[i++]=ConstantString(p->name);
    p=(const CoderInfo *) GetNextValueInSplayTree(coder_cache);
  }
  UnlockSemaphoreInfo(coder_semaphore);
  qsort((void *) coder_map,(size_t) i,sizeof(*coder_map),CoderCompare);
  coder_map[i]=(char *) NULL;
  *number_coders=(size_t) i;
  return(coder_map);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
+   I s C o d e r T r e e I n s t a n t i a t e d                             %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  IsCoderTreeInstantiated() determines if the coder tree is instantiated.  If
%  not, it instantiates the tree and returns it.
%
%  The format of the IsCoderInstantiated method is:
%
%      MagickBooleanType IsCoderTreeInstantiated(ExceptionInfo *exception)
%
%  A description of each parameter follows.
%
%    o exception: return any errors or warnings in this structure.
%
*/
static MagickBooleanType IsCoderTreeInstantiated(ExceptionInfo *exception)
{
  if (coder_cache == (SplayTreeInfo *) NULL)
    {
      if (coder_semaphore == (SemaphoreInfo *) NULL)
        ActivateSemaphoreInfo(&coder_semaphore);
      LockSemaphoreInfo(coder_semaphore);
      if (coder_cache == (SplayTreeInfo *) NULL)
        coder_cache=AcquireCoderCache(exception);
      UnlockSemaphoreInfo(coder_semaphore);
    }
  return(coder_cache != (SplayTreeInfo *) NULL ? MagickTrue : MagickFalse);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%  L i s t C o d e r I n f o                                                  %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ListCoderInfo() lists the coder info to a file.
%
%  The format of the ListCoderInfo coder is:
%
%      MagickBooleanType ListCoderInfo(FILE *file,ExceptionInfo *exception)
%
%  A description of each parameter follows.
%
%    o file:  An pointer to a FILE.
%
%    o exception: return any errors or warnings in this structure.
%
*/
MagickExport MagickBooleanType ListCoderInfo(FILE *file,
  ExceptionInfo *exception)
{
  const char
    *path;

  const CoderInfo
    **coder_info;

  ssize_t
    i;

  size_t
    number_coders;

  ssize_t
    j;

  if (file == (const FILE *) NULL)
    file=stdout;
  coder_info=GetCoderInfoList("*",&number_coders,exception);
  if (coder_info == (const CoderInfo **) NULL)
    return(MagickFalse);
  path=(const char *) NULL;
  for (i=0; i < (ssize_t) number_coders; i++)
  {
    if (coder_info[i]->stealth != MagickFalse)
      continue;
    if ((path == (const char *) NULL) ||
        (LocaleCompare(path,coder_info[i]->path) != 0))
      {
        if (coder_info[i]->path != (char *) NULL)
          (void) FormatLocaleFile(file,"\nPath: %s\n\n",coder_info[i]->path);
        (void) FormatLocaleFile(file,"Magick          Coder\n");
        (void) FormatLocaleFile(file,
          "-------------------------------------------------"
          "------------------------------\n");
      }
    path=coder_info[i]->path;
    (void) FormatLocaleFile(file,"%s",coder_info[i]->magick);
    for (j=(ssize_t) strlen(coder_info[i]->magick); j <= 15; j++)
      (void) FormatLocaleFile(file," ");
    if (coder_info[i]->name != (char *) NULL)
      (void) FormatLocaleFile(file,"%s",coder_info[i]->name);
    (void) FormatLocaleFile(file,"\n");
  }
  coder_info=(const CoderInfo **) RelinquishMagickMemory((void *) coder_info);
  (void) fflush(file);
  return(MagickTrue);
}
```

--------------------------------------------------------------------------------

---[FILE: coder.h]---
Location: ImageMagick-main/MagickCore/coder.h

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

  MagickCore image coder methods.
*/
#ifndef MAGICKCORE_CODER_H
#define MAGICKCORE_CODER_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

typedef struct _CoderInfo
{
  char
    *path,
    *magick,
    *name;

  MagickBooleanType
    exempt,
    stealth;

  size_t
    signature;
} CoderInfo;

extern MagickExport char
  **GetCoderList(const char *,size_t *,ExceptionInfo *);

extern MagickExport const CoderInfo
  *GetCoderInfo(const char *,ExceptionInfo *),
  **GetCoderInfoList(const char *,size_t *,ExceptionInfo *);

extern MagickExport MagickBooleanType
  ListCoderInfo(FILE *,ExceptionInfo *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: color-private.h]---
Location: ImageMagick-main/MagickCore/color-private.h

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

  MagickCore private image color methods.
*/
#ifndef MAGICKCORE_COLOR_PRIVATE_H
#define MAGICKCORE_COLOR_PRIVATE_H

#include "MagickCore/image.h"
#include "MagickCore/image-private.h"

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

extern MagickPrivate MagickBooleanType
  ColorComponentGenesis(void),
  IsEquivalentAlpha(const Image *,const PixelInfo *,const PixelInfo *),
  IsEquivalentIntensity(const Image *,const PixelInfo *,const PixelInfo *);

extern MagickPrivate void
  ColorComponentTerminus(void);

static inline MagickBooleanType GetColorRange(const char *color,
  PixelInfo *start,PixelInfo *stop,ExceptionInfo *exception)
{
  char
    start_color[MagickPathExtent] = "white",
    stop_color[MagickPathExtent] = "black";

  MagickBooleanType
    status;

  if (color == (const char *) NULL)
    return(MagickFalse);
  if (*color != '\0')
    {
      char
        *p;

      (void) CopyMagickString(start_color,color,MagickPathExtent);
      for (p=start_color; (*p != '-') && (*p != '\0'); p++)
        if (*p == '(')
          {
            for (p++; (*p != ')') && (*p != '\0'); p++);
            if (*p == '\0')
              break;
          }
      if (*p == '-')
        (void) CopyMagickString(stop_color,p+1,MagickPathExtent);
      *p='\0';
    }
  status=QueryColorCompliance(start_color,AllCompliance,start,exception);
  if (status == MagickFalse)
    return(status);
  return(QueryColorCompliance(stop_color,AllCompliance,stop,exception));
}

static inline double GetFuzzyColorDistance(const Image *p,const Image *q)
{
  /*
    Variance-style combined fuzz.
  */
  if (q == (const Image *) NULL)
    return(p->fuzz*p->fuzz);
  return(p->fuzz*p->fuzz+q->fuzz*q->fuzz);
}

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

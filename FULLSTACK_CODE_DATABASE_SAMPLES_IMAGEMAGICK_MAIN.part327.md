---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 327
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 327 of 851)

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

---[FILE: string_.h]---
Location: ImageMagick-main/MagickCore/string_.h

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

  MagickCore string methods.
*/
#ifndef MAGICKCORE_STRING_H_
#define MAGICKCORE_STRING_H_

#include "MagickCore/exception.h"

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

typedef struct _StringInfo
{
  char
    *path;

  unsigned char
    *datum;

  size_t
    length,
    signature;

  char
    *name;
} StringInfo;

extern MagickExport char
  *AcquireString(const char *),
  *CloneString(char **,const char *),
  *ConstantString(const char *),
  *DestroyString(char *),
  **DestroyStringList(char **),
  *EscapeString(const char *,const char),
  *FileToString(const char *,const size_t,ExceptionInfo *),
  *GetEnvironmentValue(const char *),
  *SanitizeString(const char *),
  *StringInfoToDigest(const StringInfo *),
  *StringInfoToHexString(const StringInfo *),
  *StringInfoToString(const StringInfo *),
  **StringToArgv(const char *,int *),
  *StringToken(const char *,char **),
  **StringToList(const char *),
  **StringToStrings(const char *,size_t *);

extern MagickExport const char
  *GetStringInfoName(const StringInfo *),
  *GetStringInfoPath(const StringInfo *);

extern MagickExport double
  InterpretSiPrefixValue(const char *magick_restrict,char **magick_restrict),
  *StringToArrayOfDoubles(const char *,ssize_t *,ExceptionInfo *);

extern MagickExport int
  CompareStringInfo(const StringInfo *,const StringInfo *);

extern MagickExport MagickBooleanType
  ConcatenateString(char **magick_restrict,const char *magick_restrict),
  IsStringTrue(const char *) magick_attribute((__pure__)),
  IsStringFalse(const char *) magick_attribute((__pure__)),
  SubstituteString(char **,const char *,const char *);

extern MagickExport size_t
  ConcatenateMagickString(char *magick_restrict,const char *magick_restrict,
    const size_t) magick_attribute((__nonnull__)),
  CopyMagickString(char *magick_restrict,const char *magick_restrict,
    const size_t) magick_attribute((__nonnull__)),
  GetStringInfoLength(const StringInfo *),
  StripMagickString(char *);

extern MagickExport ssize_t
  FormatMagickSize(const MagickSizeType,const MagickBooleanType,const char *,
    const size_t,char *);

extern MagickExport StringInfo
  *AcquireStringInfo(const size_t),
  *BlobToStringInfo(const void *,const size_t),
  *CloneStringInfo(const StringInfo *),
  *ConfigureFileToStringInfo(const char *),
  *DestroyStringInfo(StringInfo *),
  *FileToStringInfo(const char *,const size_t,ExceptionInfo *),
  *SplitStringInfo(StringInfo *,const size_t),
  *StringToStringInfo(const char *);

extern MagickExport unsigned char
  *GetStringInfoDatum(const StringInfo *);

extern MagickExport void
  ConcatenateStringInfo(StringInfo *,const StringInfo *)
    magick_attribute((__nonnull__)),
  PrintStringInfo(FILE *file,const char *,const StringInfo *),
  ResetStringInfo(StringInfo *),
  SetStringInfo(StringInfo *,const StringInfo *),
  SetStringInfoDatum(StringInfo *,const unsigned char *),
  SetStringInfoLength(StringInfo *,const size_t),
  SetStringInfoName(StringInfo *,const char *),
  SetStringInfoPath(StringInfo *,const char *),
  StripString(char *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: studio.h]---
Location: ImageMagick-main/MagickCore/studio.h

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

  MagickCore private application programming interface declarations.
*/
#ifndef MAGICKCORE_STUDIO_H
#define MAGICKCORE_STUDIO_H

#if defined(WIN32) || defined(WIN64) || defined(_WIN32_WINNT)
#  define MAGICKCORE_WINDOWS_SUPPORT
#else
#  define MAGICKCORE_POSIX_SUPPORT
#endif

#define MAGICKCORE_IMPLEMENTATION  1

#if !defined(MAGICKCORE_CONFIG_H)
# define MAGICKCORE_CONFIG_H
#include "MagickCore/magick-config.h"
# if defined(MAGICKCORE__FILE_OFFSET_BITS) && !defined(_FILE_OFFSET_BITS)
# define _FILE_OFFSET_BITS MAGICKCORE__FILE_OFFSET_BITS
#endif
#if defined(_magickcore_const) && !defined(const)
# define const  _magickcore_const
#endif
#if defined(_magickcore_inline) && !defined(inline)
# define inline  _magickcore_inline
#endif
# if defined(__cplusplus) || defined(c_plusplus)
#  undef inline
# endif
#endif

#if defined(_OPENMP) && ((_OPENMP >= 200203) || defined(__OPENCC__))
#  include <omp.h>
#  define MAGICKCORE_OPENMP_SUPPORT  1
#endif

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#if defined(MAGICKCORE_NAMESPACE_PREFIX)
# include "MagickCore/methods.h"
#endif

#if !defined(const)
#  define STDC
#endif

/* Define to 1 if assertions should be disabled. */
#if defined(MAGICKCORE_NDEBUG)
#define NDEBUG 1
#endif

#include <stdarg.h>
#include <stdio.h>
#if defined(MAGICKCORE_HAVE_SYS_STAT_H)
# include <sys/stat.h>
#endif
#if defined(MAGICKCORE_STDC_HEADERS)
# include <stdlib.h>
# include <stddef.h>
#else
# if defined(MAGICKCORE_HAVE_STDLIB_H)
#  include <stdlib.h>
# endif
#endif
#if !defined(magick_restrict)
# if !defined(_magickcore_restrict)
#  define magick_restrict restrict
# else
#  define magick_restrict _magickcore_restrict
# endif
#endif
#if defined(MAGICKCORE_HAVE_STRING_H)
# if !defined(STDC_HEADERS) && defined(MAGICKCORE_HAVE_MEMORY_H)
#  include <memory.h>
# endif
# include <string.h>
#endif
#if defined(MAGICKCORE_HAVE_STRINGS_H)
# include <strings.h>
#endif
#if defined(MAGICKCORE_HAVE_INTTYPES_H)
# include <inttypes.h>
#endif
#if defined(MAGICKCORE_HAVE_STDINT_H)
# include <stdint.h>
#endif
#if defined(MAGICKCORE_HAVE_UNISTD_H)
# include <unistd.h>
#endif
#if defined(MAGICKCORE_WINDOWS_SUPPORT) && defined(_DEBUG)
#define _CRTDBG_MAP_ALLOC
#endif
#if defined(MAGICKCORE_WINDOWS_SUPPORT)
# define NOMINMAX
# include <io.h>
#if !defined(__CYGWIN__)
# include <direct.h>
#endif
# if !defined(MAGICKCORE_HAVE_STRERROR)
#  define HAVE_STRERROR
# endif
#endif

#include <ctype.h>
#include <locale.h>
#include <errno.h>
#include <fcntl.h>
#include <math.h>
#include <time.h>
#include <limits.h>
#include <signal.h>
#include <assert.h>

#if defined(MAGICKCORE_HAVE_XLOCALE_H)
# include <xlocale.h>
#endif
#if defined(MAGICKCORE_THREAD_SUPPORT)
# include <pthread.h>
#endif
#if defined(MAGICKCORE_WINDOWS_SUPPORT)
#  if !defined(__CYGWIN__)
#    if defined(MAGICKCORE_DPC_SUPPORT)
#      include <winsock2.h>
#      ifdef _MSC_VER
#        pragma comment (lib, "ws2_32.lib")
#      endif
#    endif
#    include <ws2tcpip.h>
#  endif
#endif
#if defined(MAGICKCORE_HAVE_SYS_SYSLIMITS_H)
# include <sys/syslimits.h>
#endif
#if defined(MAGICKCORE_HAVE_ARM_LIMITS_H)
# include <arm/limits.h>
#endif

#if defined(MAGICKCORE_HAVE_CL_CL_H)
#  define MAGICKCORE_OPENCL_SUPPORT  1
#endif
#if defined(MAGICKCORE_HAVE_OPENCL_CL_H)
#  define MAGICKCORE_OPENCL_SUPPORT  1
#endif

#if defined(MAGICKCORE_HAVE_PREAD) && defined(MAGICKCORE_HAVE_DECL_PREAD) && !MAGICKCORE_HAVE_DECL_PREAD
ssize_t pread(int,void *,size_t,off_t);
#endif

#if defined(MAGICKCORE_HAVE_PWRITE) && defined(MAGICKCORE_HAVE_DECL_PWRITE) && !MAGICKCORE_HAVE_DECL_PWRITE
ssize_t pwrite(int,const void *,size_t,off_t);
#endif

#if defined(MAGICKCORE_HAVE_STRLCPY) && defined(MAGICKCORE_HAVE_DECL_STRLCPY) && !MAGICKCORE_HAVE_DECL_STRLCPY
extern size_t strlcpy(char *,const char *,size_t);
#endif

#if defined(MAGICKCORE_HAVE_VSNPRINTF) && defined(MAGICKCORE_HAVE_DECL_VSNPRINTF) && !MAGICKCORE_HAVE_DECL_VSNPRINTF
extern int vsnprintf(char *,size_t,const char *,va_list);
#endif

#include "MagickCore/method-attribute.h"

#if defined(MAGICKCORE_WINDOWS_SUPPORT) || defined(MAGICKCORE_POSIX_SUPPORT)
# include <sys/types.h>
# include <sys/stat.h>
# if defined(MAGICKCORE_POSIX_SUPPORT)
#  if defined(MAGICKCORE_HAVE_SYS_NDIR_H) || defined(MAGICKCORE_HAVE_SYS_DIR_H) || defined(MAGICKCORE_HAVE_NDIR_H)
#   define dirent direct
#   define NAMLEN(dirent) (dirent)->d_namlen
#   if defined(MAGICKCORE_HAVE_SYS_NDIR_H)
#    include <sys/ndir.h>
#   endif
#   if defined(MAGICKCORE_HAVE_SYS_DIR_H)
#    include <sys/dir.h>
#   endif
#   if defined(MAGICKCORE_HAVE_NDIR_H)
#    include <ndir.h>
#   endif
#  else
#   include <dirent.h>
#   define NAMLEN(dirent) strlen((dirent)->d_name)
#  endif
#  include <sys/wait.h>
#  include <pwd.h>
# endif
# if !defined(S_ISDIR)
#  define S_ISDIR(mode) (((mode) & S_IFMT) == S_IFDIR)
# endif
# if !defined(S_ISREG)
#  define S_ISREG(mode) (((mode) & S_IFMT) == S_IFREG)
# endif
# include "MagickCore/magick-type.h"
# if !defined(MAGICKCORE_WINDOWS_SUPPORT)
#  include <sys/time.h>
# if defined(MAGICKCORE_HAVE_SYS_TIMES_H)
#  include <sys/times.h>
# endif
# if defined(MAGICKCORE_HAVE_SYS_RESOURCE_H)
#  include <sys/resource.h>
# endif
# if defined(MAGICKCORE_HAVE_SYS_MMAN_H)
#  include <sys/mman.h>
# endif
# if defined(MAGICKCORE_HAVE_SYS_SENDFILE_H)
#  include <sys/sendfile.h>
# endif
# if defined(MAGICKCORE_HAVE_SYS_SOCKET_H)
#  include <sys/socket.h>
# endif
# if defined(MAGICKCORE_HAVE_SYS_UIO_H)
#  include <sys/uio.h>
# endif
#endif
#else
# include <types.h>
# include <stat.h>
# include "MagickCore/magick-type.h"
#endif

#if defined(S_IRUSR) && defined(S_IWUSR)
# define S_MODE (S_IRUSR | S_IWUSR)
#elif defined (MAGICKCORE_WINDOWS_SUPPORT)
# define S_MODE (_S_IREAD | _S_IWRITE)
#else
# define S_MODE  0600
#endif

#if defined(MAGICKCORE_WINDOWS_SUPPORT)
# include "MagickCore/nt-base.h"
#endif
#ifdef __VMS
# include "MagickCore/vms.h"
#endif

#undef HAVE_CONFIG_H
#undef gamma
#undef index
#undef pipe
#undef y1

/*
  Review these platform specific definitions.
*/
#if defined(MAGICKCORE_POSIX_SUPPORT) &&  !( defined(__OS2__) || defined( vms ) )
# define DirectorySeparator  "/"
# define DirectoryListSeparator  ':'
# define EditorOptions  " -title \"Edit Image Comment\" -e vi"
# define Exit  exit
# define IsBasenameSeparator(c)  ((c) == '/' ? MagickTrue : MagickFalse)
# define X11_PREFERENCES_PATH  "~/."
# define ProcessPendingEvents(text)
# define ReadCommandlLine(argc,argv)
# define SetNotifyHandlers
#else
# ifdef __VMS
#  define X11_APPLICATION_PATH  "decw$system_defaults:"
#  define DirectorySeparator  ""
#  define DirectoryListSeparator  ';'
#  define EditorOptions  ""
#  define Exit  exit
#  define IsBasenameSeparator(c) \
  (((c) == ']') || ((c) == ':') || ((c) == '/') ? MagickTrue : MagickFalse)
#  define MAGICKCORE_LIBRARY_ABSOLUTE_PATH  "sys$login:"
#  define MAGICKCORE_SHARE_PATH  "sys$login:"
#  define X11_PREFERENCES_PATH  "decw$user_defaults:"
#  define ProcessPendingEvents(text)
#  define ReadCommandlLine(argc,argv)
#  define SetNotifyHandlers
# endif
# if defined(__OS2__)
#   define DirectorySeparator  "\\"
#   define DirectoryListSeparator  ';'
# define EditorOptions  " -title \"Edit Image Comment\" -e vi"
# define Exit  exit
#  define IsBasenameSeparator(c) \
  (((c) == '/') || ((c) == '\\') ? MagickTrue : MagickFalse)
# define PreferencesDefaults  "~\."
# define ProcessPendingEvents(text)
# define ReadCommandlLine(argc,argv)
# define SetNotifyHandlers
#endif
# if defined(MAGICKCORE_WINDOWS_SUPPORT)
#  define DirectorySeparator  "\\"
#  define DirectoryListSeparator  ';'
#  define EditorOptions ""
#  define IsBasenameSeparator(c) \
  (((c) == '/') || ((c) == '\\') ? MagickTrue : MagickFalse)
#  define ProcessPendingEvents(text)
#  if !defined(X11_PREFERENCES_PATH)
#    define X11_PREFERENCES_PATH  "~\\."
#  endif
#  define ReadCommandlLine(argc,argv)
#  define SetNotifyHandlers \
    SetErrorHandler(NTErrorHandler); \
    SetWarningHandler(NTWarningHandler)
# endif

#endif

/*
  Define system symbols if not already defined.
*/
#if !defined(STDIN_FILENO)
#define STDIN_FILENO  0x00
#endif

#if !defined(O_BINARY)
#define O_BINARY  0x00
#endif

#if !defined(PATH_MAX)
#define PATH_MAX  4096
#endif

#if defined(MAGICKCORE_LTDL_DELEGATE) || (defined(MAGICKCORE_WINDOWS_SUPPORT) && defined(_DLL) && !defined(_LIB))
#  define MAGICKCORE_MODULES_SUPPORT
#endif

#if defined(_MAGICKMOD_)
# undef MAGICKCORE_BUILD_MODULES
# define MAGICKCORE_BUILD_MODULES
#endif

/*
  Magick defines.
*/
#define MagickMaxRecursionDepth  600
#define Swap(x,y) ((x)^=(y), (y)^=(x), (x)^=(y))
#if defined(_MSC_VER)
# define DisableMSCWarning(nr) __pragma(warning(push)) \
  __pragma(warning(disable:nr))
# define RestoreMSCWarning __pragma(warning(pop))
#else
# define DisableMSCWarning(nr)
# define RestoreMSCWarning
#endif

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: thread-private.h]---
Location: ImageMagick-main/MagickCore/thread-private.h

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

  MagickCore private methods for internal threading.
*/
#ifndef MAGICKCORE_THREAD_PRIVATE_H
#define MAGICKCORE_THREAD_PRIVATE_H

#include "MagickCore/cache.h"
#include "MagickCore/image-private.h"
#include "MagickCore/resource_.h"
#include "MagickCore/thread_.h"

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#define magick_number_threads(source,destination,chunk,factor) \
  num_threads(GetMagickNumberThreads((source),(destination),(chunk),(factor)))
#if defined(__clang__) || (__GNUC__ > 3) || ((__GNUC__ == 3) && (__GNUC_MINOR__ > 10))
#define MagickCachePrefetch(address,mode,locality) \
  __builtin_prefetch(address,mode,locality)
#else
#define MagickCachePrefetch(address,mode,locality) \
  magick_unreferenced(address); \
  magick_unreferenced(mode); \
  magick_unreferenced(locality);
#endif

#if defined(MAGICKCORE_THREAD_SUPPORT)
  typedef pthread_mutex_t MagickMutexType;
#elif defined(MAGICKCORE_WINDOWS_SUPPORT)
  typedef CRITICAL_SECTION MagickMutexType;
#else
  typedef size_t MagickMutexType;
#endif

static inline int GetMagickNumberThreads(const Image *source,
  const Image *destination,const size_t chunk,const int factor)
{
  const CacheType
    destination_type = (CacheType) GetImagePixelCacheType(destination),
    source_type = (CacheType) GetImagePixelCacheType(source);

  size_t
    max_threads = (size_t) GetMagickResourceLimit(ThreadResource),
    number_threads = 1UL,
    workload_factor = 64UL << factor;

  /*
    Determine number of threads based on workload.
  */
  number_threads=(chunk <= workload_factor) ? 1UL : 
    (chunk >= (workload_factor << 6)) ? max_threads :
    1UL+(chunk-workload_factor)*(max_threads-1L)/(((workload_factor << 6))-1L);
  /*
    Limit threads for non-memory or non-map cache sources/destinations.
  */
  if (((source_type != MemoryCache) && (source_type != MapCache)) ||
      ((destination_type != MemoryCache) && (destination_type != MapCache)))
    number_threads=MagickMin(number_threads,4);
  return((int) number_threads);
}

static inline MagickThreadType GetMagickThreadId(void)
{
#if defined(MAGICKCORE_THREAD_SUPPORT)
  return(pthread_self());
#elif defined(MAGICKCORE_WINDOWS_SUPPORT)
  return(GetCurrentThreadId());
#else
  return(getpid());
#endif
}

static inline size_t GetMagickThreadSignature(void)
{
#if defined(MAGICKCORE_THREAD_SUPPORT)
  {
    union
    {
      pthread_t
        id;

      size_t
        signature;
    } magick_thread;

    magick_thread.signature=0UL;
    magick_thread.id=pthread_self();
    return(magick_thread.signature);
  }
#elif defined(MAGICKCORE_WINDOWS_SUPPORT)
  return((size_t) GetCurrentThreadId());
#else
  return((size_t) getpid());
#endif
}

static inline MagickBooleanType IsMagickThreadEqual(const MagickThreadType id)
{
#if defined(MAGICKCORE_THREAD_SUPPORT)
  if (pthread_equal(id,pthread_self()) != 0)
    return(MagickTrue);
#elif defined(MAGICKCORE_WINDOWS_SUPPORT)
  if (id == GetCurrentThreadId())
    return(MagickTrue);
#else
  if (id == getpid())
    return(MagickTrue);
#endif
  return(MagickFalse);
}

/*
  Lightweight OpenMP methods.
*/
static inline size_t GetOpenMPMaximumThreads(void)
{
#if defined(MAGICKCORE_OPENMP_SUPPORT)
  return((size_t) omp_get_max_threads());
#else
  return(1);
#endif
}

static inline int GetOpenMPThreadId(void)
{
#if defined(MAGICKCORE_OPENMP_SUPPORT)
  return(omp_get_thread_num());
#else
  return(0);
#endif
}

#if defined(MAGICKCORE_OPENMP_SUPPORT)
static inline void SetOpenMPMaximumThreads(const int threads)
{
  omp_set_num_threads(threads);
#else
static inline void SetOpenMPMaximumThreads(const int magick_unused(threads))
{
  magick_unreferenced(threads);
#endif
}

#if defined(MAGICKCORE_OPENMP_SUPPORT)
static inline void SetOpenMPNested(const int value)
{
  omp_set_nested(value);
#else
static inline void SetOpenMPNested(const int magick_unused(value))
{
  magick_unreferenced(value);
#endif
}

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: thread.c]---
Location: ImageMagick-main/MagickCore/thread.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                  TTTTT  H   H  RRRR   EEEEE   AAA   DDDD                    %
%                    T    H   H  R   R  E      A   A  D   D                   %
%                    T    HHHHH  RRRR   EEE    AAAAA  D   D                   %
%                    T    H   H  R R    E      A   A  D   D                   %
%                    T    H   H  R  R   EEEEE  A   A  DDDD                    %
%                                                                             %
%                                                                             %
%                         MagickCore Thread Methods                           %
%                                                                             %
%                             Software Design                                 %
%                                  Cristy                                     %
%                               March  2003                                   %
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
#include "MagickCore/memory_.h"
#include "MagickCore/thread_.h"
#include "MagickCore/thread-private.h"

/*
  Typedef declarations.
*/
typedef struct _MagickThreadValue
{
  size_t
    number_threads;

  void
    **values,
    (*destructor)(void *);
} MagickThreadValue;

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   C r e a t e M a g i c k T h r e a d K e y                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  CreateMagickThreadKey() creates a thread-specific data key visible to all
%  threads in the process.
%
%  The format of the CreateMagickThreadKey method is:
%
%      MagickThreadKey CreateMagickThreadKey(MagickThreadKey *key)
%
%  A description of each parameter follows:
%
%    o key: opaque objects used to locate thread-specific data.
%
%    o destructor: associate an optional destructor with each key value.
%
*/
MagickExport MagickBooleanType CreateMagickThreadKey(MagickThreadKey *key,
  void (*destructor)(void *))
{
#if defined(MAGICKCORE_THREAD_SUPPORT)
  return(pthread_key_create(key,destructor) == 0 ? MagickTrue : MagickFalse);
#elif defined(MAGICKCORE_WINDOWS_SUPPORT)
  magick_unreferenced(destructor);
  *key=TlsAlloc();
  return(*key != TLS_OUT_OF_INDEXES ? MagickTrue : MagickFalse);
#else
  {
    MagickThreadValue
      **keys;

    keys=(MagickThreadValue **) key;
    *keys=(MagickThreadValue *) AcquireMagickMemory(sizeof(**keys));
    if (*keys != (MagickThreadValue *) NULL)
      {
        (*keys)->number_threads=GetOpenMPMaximumThreads();
        (*keys)->values=(void **) AcquireQuantumMemory((*keys)->number_threads,
          sizeof(void *));
        if ((*keys)->values == (void **) NULL)
          *keys=(MagickThreadValue *) RelinquishMagickMemory(*keys);
        else
          (void) memset((*keys)->values,0,(*keys)->number_threads*
            sizeof(void *));
        (*keys)->destructor=destructor;
      }
    return((*keys != (MagickThreadValue *) NULL) ? MagickTrue : MagickFalse);
  }
#endif
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   D e l e t e M a g i c k T h r e a d K e y                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  DeleteMagickThreadKey() deletes a thread-specific data key.
%
%  The format of the DeleteMagickThreadKey method is:
%
%      MagickBooleanType DeleteMagickThreadKey(MagickThreadKey key)
%
%  A description of each parameter follows:
%
%    o key: the thread key.
%
*/
MagickExport MagickBooleanType DeleteMagickThreadKey(MagickThreadKey key)
{
#if defined(MAGICKCORE_THREAD_SUPPORT)
  return(pthread_key_delete(key) == 0 ? MagickTrue : MagickFalse);
#elif defined(MAGICKCORE_WINDOWS_SUPPORT)
  return(TlsFree(key) != 0 ? MagickTrue : MagickFalse);
#else
  {
    MagickThreadValue
      *keys;

    ssize_t
      i;

    keys=(MagickThreadValue *) key;
    for (i=0; i < (ssize_t) keys->number_threads; i++)
      if ((keys->destructor != (void *) NULL) &&
          (keys->values[i] != (void *) NULL))
        {
          keys->destructor(keys->values[i]);
          keys->values[i]=(void *) NULL;
        }
    keys=(MagickThreadValue *) RelinquishMagickMemory(keys);
  }
  return(MagickTrue);
#endif
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   G e t M a g i c k T h r e a d V a l u e                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  GetMagickThreadValue() returns the value currently bound to the specified
%  key on behalf of the calling thread.
%
%  The format of the GetMagickThreadValue method is:
%
%      void *GetMagickThreadValue(MagickThreadKey key)
%
%  A description of each parameter follows:
%
%    o key: the thread key.
%
*/
MagickExport void *GetMagickThreadValue(MagickThreadKey key)
{
#if defined(MAGICKCORE_THREAD_SUPPORT)
  return(pthread_getspecific(key));
#elif defined(MAGICKCORE_WINDOWS_SUPPORT)
  return(TlsGetValue(key));
#else
  {
    MagickThreadValue
      *keys;

    keys=(MagickThreadValue *) key;
    return(keys->values[GetOpenMPThreadId()]);
  }
#endif
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   S e t M a g i c k T h r e a d V a l u e                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  SetMagickThreadValue() binds a value to the specified key on behalf of the
%  calling thread.
%
%  The format of the SetMagickThreadValue method is:
%
%      MagickBooleanType SetMagickThreadValue(MagickThreadKey key,
%        const void *value)
%
%  A description of each parameter follows:
%
%    o key: the thread key.
%
%    o value: the value.
%
*/
MagickExport MagickBooleanType SetMagickThreadValue(MagickThreadKey key,
  const void *value)
{
#if defined(MAGICKCORE_THREAD_SUPPORT)
  return(pthread_setspecific(key,value) == 0 ? MagickTrue : MagickFalse);
#elif defined(MAGICKCORE_WINDOWS_SUPPORT)
  return(TlsSetValue(key,(void *) value) != 0 ? MagickTrue : MagickFalse);
#else
  {
    MagickThreadValue
      *keys;

    keys=(MagickThreadValue *) key;
    keys->values[GetOpenMPThreadId()]=(void *) value;
  }
  return(MagickTrue);
#endif
}
```

--------------------------------------------------------------------------------

---[FILE: thread_.h]---
Location: ImageMagick-main/MagickCore/thread_.h

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

  MagickCore private methods for internal threading.
*/
#ifndef MAGICKCORE_THREAD_H
#define MAGICKCORE_THREAD_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#if defined(MAGICKCORE_WINDOWS_SUPPORT) && !defined(__MINGW32__)
#include <intsafe.h>
#endif

#if defined(MAGICKCORE_THREAD_SUPPORT)
typedef pthread_t MagickThreadType;
#elif defined(MAGICKCORE_WINDOWS_SUPPORT)
typedef DWORD MagickThreadType;
#else
typedef pid_t MagickThreadType;
#endif

#if defined(MAGICKCORE_THREAD_SUPPORT)
typedef pthread_key_t MagickThreadKey;
#elif defined(MAGICKCORE_WINDOWS_SUPPORT)
typedef DWORD MagickThreadKey;
#else
typedef void *MagickThreadKey;
#endif

extern MagickExport MagickBooleanType
  CreateMagickThreadKey(MagickThreadKey *,void (*destructor)(void *)),
  DeleteMagickThreadKey(MagickThreadKey),
  SetMagickThreadValue(MagickThreadKey,const void *);

extern MagickExport void
  *GetMagickThreadValue(MagickThreadKey);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

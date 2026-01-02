---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 284
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 284 of 851)

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

---[FILE: morphology.h]---
Location: ImageMagick-main/MagickCore/morphology.h

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

  MagickCore morphology methods.
*/
#ifndef MAGICKCORE_MORPHOLOGY_H
#define MAGICKCORE_MORPHOLOGY_H

#include "MagickCore/geometry.h"

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

typedef enum
{
  UndefinedKernel,    /* equivalent to UnityKernel */
  UnityKernel,        /* The no-op or 'original image' kernel */
  GaussianKernel,     /* Convolution Kernels, Gaussian Based */
  DoGKernel,
  LoGKernel,
  BlurKernel,
  CometKernel,
  BinomialKernel,
  LaplacianKernel,    /* Convolution Kernels, by Name */
  SobelKernel,
  FreiChenKernel,
  RobertsKernel,
  PrewittKernel,
  CompassKernel,
  KirschKernel,
  DiamondKernel,      /* Shape Kernels */
  SquareKernel,
  RectangleKernel,
  OctagonKernel,
  DiskKernel,
  PlusKernel,
  CrossKernel,
  RingKernel,
  PeaksKernel,         /* Hit And Miss Kernels */
  EdgesKernel,
  CornersKernel,
  DiagonalsKernel,
  LineEndsKernel,
  LineJunctionsKernel,
  RidgesKernel,
  ConvexHullKernel,
  ThinSEKernel,
  SkeletonKernel,
  ChebyshevKernel,    /* Distance Measuring Kernels */
  ManhattanKernel,
  OctagonalKernel,
  EuclideanKernel,
  UserDefinedKernel   /* User Specified Kernel Array */
} KernelInfoType;

typedef enum
{
  UndefinedMorphology,
/* Convolve / Correlate weighted sums */
  ConvolveMorphology,           /* Weighted Sum with reflected kernel */
  CorrelateMorphology,          /* Weighted Sum using a sliding window */
/* Low-level Morphology methods */
  ErodeMorphology,              /* Minimum Value in Neighbourhood */
  DilateMorphology,             /* Maximum Value in Neighbourhood */
  ErodeIntensityMorphology,     /* Pixel Pick using GreyScale Erode */
  DilateIntensityMorphology,    /* Pixel Pick using GreyScale Dilate */
  IterativeDistanceMorphology,  /* Add Kernel Value, take Minimum */
/* Second-level Morphology methods */
  OpenMorphology,               /* Dilate then Erode */
  CloseMorphology,              /* Erode then Dilate */
  OpenIntensityMorphology,      /* Pixel Pick using GreyScale Open */
  CloseIntensityMorphology,     /* Pixel Pick using GreyScale Close */
  SmoothMorphology,             /* Open then Close */
/* Difference Morphology methods */
  EdgeInMorphology,             /* Dilate difference from Original */
  EdgeOutMorphology,            /* Erode difference from Original */
  EdgeMorphology,               /* Dilate difference with Erode */
  TopHatMorphology,             /* Close difference from Original */
  BottomHatMorphology,          /* Open difference from Original */
/* Recursive Morphology methods */
  HitAndMissMorphology,         /* Foreground/Background pattern matching */
  ThinningMorphology,           /* Remove matching pixels from image */
  ThickenMorphology,            /* Add matching pixels from image */
/* Directly Applied Morphology methods */
  DistanceMorphology,           /* Add Kernel Value, take Minimum */
  VoronoiMorphology             /* Distance matte channel copy nearest color */
} MorphologyMethod;

typedef struct _KernelInfo
{
  KernelInfoType
    type;

  size_t
    width,
    height;

  ssize_t
    x,
    y;

  MagickRealType
    *values;

  double
    minimum,
    maximum,
    negative_range,
    positive_range,
    angle;

  struct _KernelInfo
    *next;

  size_t
    signature;
} KernelInfo;

extern MagickExport KernelInfo
  *AcquireKernelInfo(const char *,ExceptionInfo *),
  *AcquireKernelBuiltIn(const KernelInfoType,const GeometryInfo *,
    ExceptionInfo *),
  *CloneKernelInfo(const KernelInfo *),
  *DestroyKernelInfo(KernelInfo *);

extern MagickExport Image
  *MorphologyImage(const Image *,const MorphologyMethod,const ssize_t,
    const KernelInfo *,ExceptionInfo *);

extern MagickExport void
  ScaleGeometryKernelInfo(KernelInfo *,const char *),
  ScaleKernelInfo(KernelInfo *,const double,const GeometryFlags),
  UnityAddKernelInfo(KernelInfo *,const double);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: mutex.h]---
Location: ImageMagick-main/MagickCore/mutex.h

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

  MagickCore methods to synchronize code within a translation unit.
*/
#ifndef MAGICKCORE_MUTEX_H
#define MAGICKCORE_MUTEX_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

/*
  When included in a translation unit, the following code provides the
  translation unit a means by which to synchronize multiple threads that might
  try to enter the same critical section or to access a shared resource; it can
  be included in multiple translation units, and thereby provide a separate,
  independent means of synchronization to each such translation unit.
*/

#if defined(MAGICKCORE_OPENMP_SUPPORT)
static MagickBooleanType
  translation_unit_initialized = MagickFalse;

static omp_lock_t
  translation_unit_mutex;
#elif defined(MAGICKCORE_THREAD_SUPPORT)
static pthread_mutex_t
  translation_unit_mutex = PTHREAD_MUTEX_INITIALIZER;
#elif defined(MAGICKCORE_WINDOWS_SUPPORT)
static LONG
  translation_unit_mutex = 0;
#endif

static inline void DestroyMagickMutex(void)
{
#if defined(MAGICKCORE_OPENMP_SUPPORT)
  if (translation_unit_initialized != MagickFalse)
    omp_destroy_lock(&translation_unit_mutex);
  translation_unit_initialized=MagickFalse;
#endif
}

static inline void InitializeMagickMutex(void)
{
#if defined(MAGICKCORE_OPENMP_SUPPORT)
  if (translation_unit_initialized == MagickFalse)
    omp_init_lock(&translation_unit_mutex);
  translation_unit_initialized=MagickTrue;
#endif
}

static inline void LockMagickMutex(void)
{
#if defined(MAGICKCORE_OPENMP_SUPPORT)
  if (translation_unit_initialized == MagickFalse)
    InitializeMagickMutex();
  omp_set_lock(&translation_unit_mutex);
#elif defined(MAGICKCORE_THREAD_SUPPORT)
  {
    int
      status;

    status=pthread_mutex_lock(&translation_unit_mutex);
    if (status != 0)
      {
        errno=status;
        ThrowFatalException(ResourceLimitFatalError,"UnableToLockSemaphore");
      }
  }
#elif defined(MAGICKCORE_WINDOWS_SUPPORT)
  while (InterlockedCompareExchange(&translation_unit_mutex,1L,0L) != 0)
    Sleep(10);
#endif
}

static inline void UnlockMagickMutex(void)
{
#if defined(MAGICKCORE_OPENMP_SUPPORT)
  if (translation_unit_initialized == MagickFalse)
    InitializeMagickMutex();
  omp_unset_lock(&translation_unit_mutex);
#elif defined(MAGICKCORE_THREAD_SUPPORT)
  {
    int
      status;

    status=pthread_mutex_unlock(&translation_unit_mutex);
    if (status != 0)
      {
        errno=status;
        ThrowFatalException(ResourceLimitFatalError,"UnableToUnlockSemaphore");
      }
  }
#elif defined(MAGICKCORE_WINDOWS_SUPPORT)
  InterlockedExchange(&translation_unit_mutex,0L);
#endif
}

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: nt-base-private.h]---
Location: ImageMagick-main/MagickCore/nt-base-private.h

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

  MagickCore Windows NT private methods.
*/
#ifndef MAGICKCORE_NT_BASE_PRIVATE_H
#define MAGICKCORE_NT_BASE_PRIVATE_H

#include "MagickCore/delegate.h"
#include "MagickCore/delegate-private.h"
#include "MagickCore/exception.h"
#include "MagickCore/memory_.h"
#include "MagickCore/splay-tree.h"

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#if defined(MAGICKCORE_WINDOWS_SUPPORT)

#if !defined(closedir)
#  define closedir(directory)  NTCloseDirectory(directory)
#endif
#if !defined(MAGICKCORE_LTDL_DELEGATE)
#if !defined(lt_dlclose)
#  define lt_dlclose(handle)  NTCloseLibrary(handle)
#endif
#if !defined(lt_dlerror)
#  define lt_dlerror()  NTGetLibraryError()
#endif
#if !defined(lt_dlopen)
#  define lt_dlopen(filename)  NTOpenLibrary(filename)
#endif
#if !defined(lt_dlsym)
#  define lt_dlsym(handle,name)  NTGetLibrarySymbol(handle,name)
#endif
#endif
#if !defined(opendir)
#  define opendir(directory)  NTOpenDirectory(directory)
#endif
#if !defined(read)
#  define read(fd,buffer,count)  _read(fd,buffer,(unsigned int) count)
#endif
#if !defined(readdir)
#  define readdir(directory)  NTReadDirectory(directory)
#endif
#if !defined(sysconf)
#  define sysconf(name)  NTSystemConfiguration(name)
#  define MAGICKCORE_HAVE_SYSCONF 1
#endif
#if !defined(write)
#  define write(fd,buffer,count)  _write(fd,buffer,(unsigned int) count)
#endif
#if !defined(__MINGW32__)
#  define fdopen  _fdopen
#  define fileno  _fileno
#  define fseek   _fseeki64
#  define ftell   _ftelli64
#  define getpid  _getpid
#if !defined(getcwd)
#  define getcwd  _getcwd
#endif
#  define lseek   _lseeki64
#  define fstat   _fstat64
#  define setmode _setmode
#  define stat    _stat64
#  define tell    _telli64
#  define wstat   _wstat64
#endif

#if !defined(XS_VERSION)
struct dirent
{
  char
    d_name[2048];

  int
    d_namlen;
};

typedef struct _DIR
{
  HANDLE
    hSearch;

  WIN32_FIND_DATAW
    Win32FindData;

  BOOL
    firsttime;

  struct dirent
    file_info;
} DIR;

#if !defined(__MINGW32__)
struct timeval;

struct timezone
{
  int
    tz_minuteswest,
    tz_dsttime;
};
#endif

#endif

static inline void *NTAcquireQuantumMemory(const size_t count,
  const size_t quantum)
{
  size_t
    size;

  if (HeapOverflowSanityCheckGetSize(count,quantum,&size) != MagickFalse)
    {
      errno=ENOMEM;
      return(NULL);
    }
  return(AcquireMagickMemory(size));
}

extern MagickPrivate char
  *NTGetEnvironmentValue(const char *);

#if !defined(MAGICKCORE_LTDL_DELEGATE)
extern MagickPrivate const char
  *NTGetLibraryError(void);
#endif

#if !defined(XS_VERSION)
extern MagickPrivate const char
  *NTGetLibraryError(void);

extern MagickPrivate DIR
  *NTOpenDirectory(const char *);

extern MagickPrivate double
  NTElapsedTime(void),
  NTErf(double);

extern MagickPrivate int
#if !defined(__MINGW32__)
  gettimeofday(struct timeval *,struct timezone *),
#endif
  NTCloseDirectory(DIR *),
  NTCloseLibrary(void *),
  NTTruncateFile(int,off_t),
  NTUnmapMemory(void *,size_t),
  NTSystemCommand(const char *,char *);

extern MagickPrivate ssize_t
  NTSystemConfiguration(int);

extern MagickPrivate MagickBooleanType
  NTGatherRandomData(const size_t,unsigned char *),
  NTGetExecutionPath(char *,const size_t),
  NTGetModulePath(const char *,char *),
  NTGhostscriptFonts(char *,int),
  NTReportEvent(const char *,const MagickBooleanType);

extern MagickExport MagickBooleanType
  NTLongPathsEnabled(void);

extern MagickPrivate struct dirent
  *NTReadDirectory(DIR *);

extern MagickPrivate unsigned char
  *NTRegistryKeyLookup(const char *),
  *NTResourceToBlob(const char *);

extern MagickPrivate void
  *NTGetLibrarySymbol(void *,const char *),
  NTGhostscriptEXE(char *,int),
  *NTMapMemory(char *,size_t,int,int,int,MagickOffsetType),
  *NTOpenLibrary(const char *),
  NTWindowsGenesis(void),
  NTWindowsTerminus(void);

#endif /* !XS_VERSION */

#endif /* MAGICKCORE_WINDOWS_SUPPORT */

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif /* !C++ */

#endif /* !MAGICKCORE_NT_BASE_H */
```

--------------------------------------------------------------------------------

````

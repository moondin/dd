---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 286
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 286 of 851)

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

---[FILE: nt-base.h]---
Location: ImageMagick-main/MagickCore/nt-base.h

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

  MagickCore Windows NT utility methods.
*/
#ifndef MAGICKCORE_NT_BASE_H
#define MAGICKCORE_NT_BASE_H

#include "MagickCore/exception.h"
#include "MagickCore/geometry.h"

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#if defined(MAGICKCORE_WINDOWS_SUPPORT)

#define WIN32_LEAN_AND_MEAN
#define VC_EXTRALEAN
#if !defined(_CRT_SECURE_NO_DEPRECATE)
#  define _CRT_SECURE_NO_DEPRECATE  1
#endif
#include <windows.h>
#include <wchar.h>
#include <winuser.h>
#include <wingdi.h>
#include <io.h>
#include <process.h>
#include <errno.h>
#include <malloc.h>
#include <sys/utime.h>
#if defined(_DEBUG) && !defined(__MINGW32__)
#include <crtdbg.h>
#endif

#define PROT_READ  0x01
#define PROT_WRITE  0x02
#define MAP_SHARED  0x01
#define MAP_PRIVATE  0x02
#define MAP_ANONYMOUS  0x20
#define F_OK 0
#define R_OK 4
#define W_OK 2
#define RW_OK 6
#define _SC_PAGE_SIZE 1
#define _SC_PHYS_PAGES 2
#define _SC_OPEN_MAX 3
#ifdef _WIN64
#  if !defined(SSIZE_MAX)
#    define SSIZE_MAX LLONG_MAX
#  endif
#else
#  if !defined(SSIZE_MAX)
#    define SSIZE_MAX LONG_MAX
#  endif
#endif
#ifndef S_ISCHR
#  define S_ISCHR(m) (((m) & S_IFMT) == S_IFCHR)
#endif

#if defined(_MSC_VER)
# if !defined(MAGICKCORE_MSC_VER)
#   if (_MSC_VER >= 1950)
#     define MAGICKCORE_MSC_VER 2026
#   elif (_MSC_VER >= 1930)
#     define MAGICKCORE_MSC_VER 2022
#   elif (_MSC_VER >= 1920)
#     define MAGICKCORE_MSC_VER 2019
#   elif (_MSC_VER >= 1910)
#     define MAGICKCORE_MSC_VER 2017
#   endif
# endif
#endif

typedef struct _GhostInfo
  GhostInfo_;

extern MagickExport char
  **NTArgvToUTF8(const int argc,wchar_t **);

extern MagickExport const GhostInfo_
  *NTGhostscriptDLLVectors(void);

extern MagickExport void
  NTErrorHandler(const ExceptionType,const char *,const char *),
  NTGhostscriptUnLoadDLL(void),
  NTWarningHandler(const ExceptionType,const char *,const char *);

#endif

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: nt-feature.c]---
Location: ImageMagick-main/MagickCore/nt-feature.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                                                                             %
%                                 N   N  TTTTT                                %
%                                 NN  N    T                                  %
%                                 N N N    T                                  %
%                                 N  NN    T                                  %
%                                 N   N    T                                  %
%                                                                             %
%                                                                             %
%                   Windows NT Feature Methods for MagickCore                 %
%                                                                             %
%                               Software Design                               %
%                                    Cristy                                   %
%                                December 1996                                %
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
#if defined(MAGICKCORE_WINDOWS_SUPPORT) || defined(__CYGWIN__)
#include "MagickCore/cache.h"
#include "MagickCore/colorspace.h"
#include "MagickCore/colorspace-private.h"
#include "MagickCore/draw.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/image-private.h"
#include "MagickCore/locale-private.h"
#include "MagickCore/memory_.h"
#include "MagickCore/memory-private.h"
#include "MagickCore/monitor.h"
#include "MagickCore/monitor-private.h"
#include "MagickCore/nt-base.h"
#include "MagickCore/nt-base-private.h"
#include "MagickCore/nt-feature.h"
#include "MagickCore/pixel-accessor.h"
#include "MagickCore/quantum.h"
#include "MagickCore/string_.h"
#include "MagickCore/token.h"
#include "MagickCore/splay-tree.h"
#include "MagickCore/utility.h"
#if defined(__CYGWIN__)
#define WIN32_LEAN_AND_MEAN
#define VC_EXTRALEAN
#include <windows.h>
#endif

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   I s M a g i c k C o n f l i c t                                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  IsMagickConflict() returns true if the image format conflicts with a logical
%  drive (.e.g. X:).
%
%  The format of the IsMagickConflict method is:
%
%      MagickBooleanType IsMagickConflict(const char *magick)
%
%  A description of each parameter follows:
%
%    o magick: Specifies the image format.
%
*/
MagickExport MagickBooleanType NTIsMagickConflict(const char *magick)
{
  MagickBooleanType
    status;

  assert(magick != (char *) NULL);
  if (strlen(magick) > 1)
    return(MagickFalse);
  status=(GetLogicalDrives() & (1 << ((LocaleToUppercase((int)
    (*magick)))-'A'))) != 0 ? MagickTrue : MagickFalse;
  return(status);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   N T A c q u i r e T y p e C a c h e                                       %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  NTAcquireTypeCache() loads a Windows TrueType fonts.
%
%  The format of the NTAcquireTypeCache method is:
%
%      MagickBooleanType NTAcquireTypeCache(SplayTreeInfo *type_cache)
%
%  A description of each parameter follows:
%
%    o type_cache: A linked list of fonts.
%
*/
MagickExport MagickBooleanType NTAcquireTypeCache(SplayTreeInfo *type_cache,
  ExceptionInfo *exception)
{
  HKEY
    reg_key;

  LONG
    res;

  char
    buffer[MagickPathExtent],
    font_root[MagickPathExtent];

  DWORD
    type,
    length;

  MagickBooleanType
    status;

  /*
    Try to find the right Windows*\CurrentVersion key, the SystemRoot and
    then the Fonts key
  */
  reg_key=(HKEY) INVALID_HANDLE_VALUE;
  res=RegOpenKeyExA(HKEY_LOCAL_MACHINE,
    "SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion",0,KEY_READ,&reg_key);
  length=sizeof(font_root)-1;
  if (res == ERROR_SUCCESS)
    res=RegQueryValueExA(reg_key,"SystemRoot",NULL,&type,(BYTE*) font_root,
      &length);
  if (res != ERROR_SUCCESS)
    {
      res=RegOpenKeyExA(HKEY_LOCAL_MACHINE,
        "SOFTWARE\\Microsoft\\Windows\\CurrentVersion",0,KEY_READ,&reg_key);
      if (res == ERROR_SUCCESS)
        res=RegQueryValueExA(reg_key,"SystemRoot",NULL,&type,(BYTE*) font_root,
          &length);
    }
  if (res == ERROR_SUCCESS)
    res=RegOpenKeyExA(reg_key,"Fonts",0,KEY_READ,&reg_key);
  if (res != ERROR_SUCCESS)
    return(MagickFalse);
  (void) ConcatenateMagickString(font_root,"\\fonts\\arial.ttf",
    MagickPathExtent);
  if (IsPathAccessible(font_root) != MagickFalse)
    {
      font_root[length-1]=0;
      (void) ConcatenateMagickString(font_root,"\\fonts\\",MagickPathExtent);
    }
  else
    {
      font_root[length-1]=0;
      (void) ConcatenateMagickString(font_root,"\\",MagickPathExtent);
    }

  {
    TypeInfo
      *type_info;

    DWORD
      registry_index;

    char
      utf8[MagickPathExtent];

    wchar_t
      wide_name[MagickPathExtent],
      wide_value[MagickPathExtent];

    registry_index=0;
    res=ERROR_SUCCESS;
    while (res != ERROR_NO_MORE_ITEMS)
      {
        char
          *family_extent,
          *pos,
          *q;

        DWORD
          name_length,
          value_length;

        name_length=MagickPathExtent-1;
        value_length=MagickPathExtent-1;
        res=RegEnumValueW(reg_key,registry_index,(wchar_t *) wide_name,
          &name_length,0,&type,(BYTE *) wide_value,&value_length);
        registry_index++;
        if (res != ERROR_SUCCESS)
          continue;
        WideCharToMultiByte(CP_UTF8,0,wide_name,-1,utf8,sizeof(utf8),NULL,
          NULL);
        if ((pos=strstr(utf8," (TrueType)")) == (char*) NULL)
          continue;
        *pos='\0'; /* Remove (TrueType) from string */
        type_info=(TypeInfo *) AcquireCriticalMemory(sizeof(*type_info));
        (void) memset(type_info,0,sizeof(TypeInfo));
        type_info->path=ConstantString("Windows Fonts");
        type_info->signature=MagickCoreSignature;
        (void) CopyMagickString(buffer,utf8,MagickPathExtent);
        for (pos=buffer; *pos != 0; pos++)
          if (*pos == ' ')
            *pos = '-';
        type_info->name=ConstantString(buffer);
        type_info->description=ConstantString(utf8);
        type_info->format=ConstantString("truetype");
        type_info->stretch=NormalStretch;
        type_info->style=NormalStyle;
        type_info->weight=400;
        /* Some fonts are known to require special encodings */
        if ((LocaleCompare(type_info->name, "Symbol") == 0) ||
            (LocaleCompare(type_info->name, "Wingdings") == 0) ||
            (LocaleCompare(type_info->name, "Wingdings-2") == 0) ||
            (LocaleCompare(type_info->name, "Wingdings-3") == 0))
          type_info->encoding=ConstantString("AppleRoman");
        family_extent=utf8;
        for (q=utf8; *q != '\0'; )
          {
            char
              token[MagickPathExtent];

            (void) GetNextToken(q,(const char **) &q,MagickPathExtent,token);
            if (*token == '\0')
              break;
            if (LocaleCompare(token,"Italic") == 0)
              type_info->style=ItalicStyle;
            else if (LocaleCompare(token,"Oblique") == 0)
              type_info->style=ObliqueStyle;
            else if (LocaleCompare(token,"Bold") == 0)
              type_info->weight=700;
            else if (LocaleCompare(token,"Thin") == 0)
              type_info->weight=100;
            else if ((LocaleCompare(token,"ExtraLight") == 0) ||
                      (LocaleCompare(token,"UltraLight") == 0))
              type_info->weight=200;
            else if (LocaleCompare(token,"Light") == 0)
              type_info->weight=300;
            else if ((LocaleCompare(token,"Normal") == 0) ||
                     (LocaleCompare(token,"Regular") == 0))
              type_info->weight=400;
            else if (LocaleCompare(token,"Medium") == 0)
              type_info->weight=500;
            else if ((LocaleCompare(token,"SemiBold") == 0) ||
                     (LocaleCompare(token,"DemiBold") == 0))
              type_info->weight=600;
            else if ((LocaleCompare(token,"ExtraBold") == 0) ||
                     (LocaleCompare(token,"UltraBold") == 0))
              type_info->weight=800;
            else if ((LocaleCompare(token,"Heavy") == 0) ||
                     (LocaleCompare(token,"Black") == 0))
              type_info->weight=900;
            else if (LocaleCompare(token,"Condensed") == 0)
              type_info->stretch = CondensedStretch;
            else if (LocaleCompare(token,"Expanded") == 0)
              type_info->stretch = ExpandedStretch;
            else if (LocaleCompare(token,"ExtraCondensed") == 0)
              type_info->stretch = ExtraCondensedStretch;
            else if (LocaleCompare(token,"ExtraExpanded") == 0)
              type_info->stretch = ExtraExpandedStretch;
            else if (LocaleCompare(token,"SemiCondensed") == 0)
              type_info->stretch = SemiCondensedStretch;
            else if (LocaleCompare(token,"SemiExpanded") == 0)
              type_info->stretch = SemiExpandedStretch;
            else if (LocaleCompare(token,"UltraCondensed") == 0)
              type_info->stretch = UltraCondensedStretch;
            else if (LocaleCompare(token,"UltraExpanded") == 0)
              type_info->stretch = UltraExpandedStretch;
            else
              family_extent=q;
          }
        (void) CopyMagickString(buffer,utf8,family_extent-utf8+1);
        (void) StripMagickString(buffer);
        type_info->family=ConstantString(buffer);
        WideCharToMultiByte(CP_UTF8,0,wide_value,-1,utf8,sizeof(utf8),NULL,
          NULL);
        if (strchr(utf8,'\\') != (char *) NULL)
          (void) CopyMagickString(buffer,utf8,MagickPathExtent);
        else
          {
            (void) CopyMagickString(buffer,font_root,MagickPathExtent);
            (void) ConcatenateMagickString(buffer,utf8,MagickPathExtent);
          }
        LocaleLower(buffer);
        type_info->glyphs=ConstantString(buffer);
        status=AddValueToSplayTree(type_cache,type_info->name,type_info);
        if (status == MagickFalse)
          (void) ThrowMagickException(exception,GetMagickModule(),
            ResourceLimitError,"MemoryAllocationFailed","`%s'",type_info->name);
      }
  }
  RegCloseKey(reg_key);
  return(MagickTrue);
}

#endif
```

--------------------------------------------------------------------------------

---[FILE: nt-feature.h]---
Location: ImageMagick-main/MagickCore/nt-feature.h

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

  MagickCore Windows NT utility methods.
*/
#ifndef MAGICKCORE_NT_FEATURE_H
#define MAGICKCORE_NT_FEATURE_H

#include "MagickCore/exception.h"
#include "MagickCore/geometry.h"
#include "MagickCore/splay-tree.h"

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#if !defined(XS_VERSION)

extern MagickExport MagickBooleanType
  NTIsMagickConflict(const char *),
  NTAcquireTypeCache(SplayTreeInfo *,ExceptionInfo *);

#endif

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: opencl-private.h]---
Location: ImageMagick-main/MagickCore/opencl-private.h

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

  MagickCore OpenCL private methods.
*/
#ifndef MAGICKCORE_OPENCL_PRIVATE_H
#define MAGICKCORE_OPENCL_PRIVATE_H

/*
Include declarations.
*/
#include "MagickCore/studio.h"
#include "MagickCore/opencl.h"
#include "MagickCore/thread_.h"

#if defined(MAGICKCORE_HAVE_CL_CL_H)
#  include <CL/cl.h>
#endif
#if defined(MAGICKCORE_HAVE_OPENCL_CL_H)
#  include <OpenCL/cl.h>
#endif

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#if !defined(MAGICKCORE_OPENCL_SUPPORT)
typedef void* MagickCLCacheInfo;
#else
typedef struct _MagickCLCacheInfo
{
  cl_event
    *events;

  cl_mem
    buffer;

  cl_uint
    event_count;

  MagickCLDevice
    device;

  MagickSizeType
    length;

  Quantum
    *pixels;

  SemaphoreInfo
    *events_semaphore;
}* MagickCLCacheInfo;

/*
  Define declarations.
*/
#define MAGICKCORE_OPENCL_UNDEFINED_SCORE -1.0
#define MAGICKCORE_OPENCL_COMMAND_QUEUES 16

/* Platform APIs */
typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clGetPlatformIDs)(cl_uint num_entries,
    cl_platform_id *platforms,cl_uint *num_platforms) CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clGetPlatformInfo)(cl_platform_id platform,
    cl_platform_info param_name,size_t param_value_size,void *param_value,
    size_t *param_value_size_ret) CL_API_SUFFIX__VERSION_1_0;


/* Device APIs */
typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clGetDeviceIDs)(cl_platform_id platform,
    cl_device_type device_type,cl_uint num_entries,cl_device_id *devices,
    cl_uint *num_devices) CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clGetDeviceInfo)(cl_device_id device,
    cl_device_info param_name,size_t param_value_size,void *param_value,
    size_t *param_value_size_ret) CL_API_SUFFIX__VERSION_1_0;


/* Context APIs */
typedef CL_API_ENTRY cl_context
  (CL_API_CALL *MAGICKpfn_clCreateContext)(
    const cl_context_properties *properties,cl_uint num_devices,
    const cl_device_id *devices,void (CL_CALLBACK *pfn_notify)(const char *,
    const void *,size_t,void *),void *user_data,cl_int *errcode_ret)
    CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clReleaseContext)(cl_context context)
    CL_API_SUFFIX__VERSION_1_0;


/* Command Queue APIs */
typedef CL_API_ENTRY cl_command_queue
  (CL_API_CALL *MAGICKpfn_clCreateCommandQueue)(cl_context context,
    cl_device_id device,cl_command_queue_properties properties,
    cl_int *errcode_ret) CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clReleaseCommandQueue)(
    cl_command_queue command_queue) CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clFlush)(cl_command_queue command_queue)
    CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clFinish)(cl_command_queue command_queue)
    CL_API_SUFFIX__VERSION_1_0;


/* Memory Object APIs */
typedef CL_API_ENTRY cl_mem
  (CL_API_CALL *MAGICKpfn_clCreateBuffer)(cl_context context,
    cl_mem_flags flags,size_t size,void *host_ptr,cl_int *errcode_ret)
    CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clRetainMemObject)(cl_mem memobj)
    CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clReleaseMemObject)(cl_mem memobj)
    CL_API_SUFFIX__VERSION_1_0;


/* Program Object APIs */
typedef CL_API_ENTRY cl_program
  (CL_API_CALL *MAGICKpfn_clCreateProgramWithSource)(cl_context context,
    cl_uint count,const char **strings,const size_t *lengths,
    cl_int *errcode_ret) CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY cl_program
  (CL_API_CALL *MAGICKpfn_clCreateProgramWithBinary)(cl_context context,
    cl_uint num_devices,const cl_device_id *device_list,const size_t *lengths,
    const unsigned char **binaries,cl_int *binary_status,cl_int *errcode_ret)
    CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clReleaseProgram)(cl_program program)
    CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clBuildProgram)(cl_program program,
    cl_uint num_devices,const cl_device_id *device_list,const char *options,
    void (CL_CALLBACK *pfn_notify)(cl_program program,void * user_data),
    void *user_data) CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clGetProgramBuildInfo)(cl_program program,
    cl_device_id device,cl_program_build_info param_name,size_t param_value_size,
    void *param_value,size_t *param_value_size_ret) CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clGetProgramInfo)(cl_program program,
    cl_program_info param_name,size_t param_value_size,void *param_value,
    size_t *param_value_size_ret) CL_API_SUFFIX__VERSION_1_0;


/* Kernel Object APIs */
typedef CL_API_ENTRY cl_kernel
  (CL_API_CALL *MAGICKpfn_clCreateKernel)(cl_program program,
    const char *kernel_name,cl_int *errcode_ret) CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clReleaseKernel)(cl_kernel kernel)
    CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clSetKernelArg)(cl_kernel kernel,cl_uint arg_index,
  size_t arg_size,const void * arg_value) CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clGetKernelInfo)(cl_kernel kernel,
    cl_kernel_info param_name,size_t param_value_size,void *param_value,
    size_t *param_value_size_ret) CL_API_SUFFIX__VERSION_1_0;


/* Enqueued Commands APIs */
typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clEnqueueReadBuffer)(cl_command_queue command_queue,
    cl_mem buffer,cl_bool blocking_read,size_t offset,size_t cb,void *ptr,
    cl_uint num_events_in_wait_list,const cl_event *event_wait_list,
    cl_event *event) CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY void
  *(CL_API_CALL *MAGICKpfn_clEnqueueMapBuffer)(cl_command_queue command_queue,
    cl_mem buffer,cl_bool blocking_map,cl_map_flags map_flags,size_t offset,
    size_t cb,cl_uint num_events_in_wait_list,const cl_event *event_wait_list,
    cl_event *event,cl_int *errcode_ret) CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clEnqueueUnmapMemObject)(
    cl_command_queue command_queue,cl_mem memobj,void *mapped_ptr,
    cl_uint num_events_in_wait_list,const cl_event *event_wait_list,
    cl_event *event) CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clEnqueueNDRangeKernel)(
    cl_command_queue command_queue,cl_kernel kernel,cl_uint work_dim,
    const size_t *global_work_offset,const size_t *global_work_size,
    const size_t *local_work_size,cl_uint num_events_in_wait_list,
    const cl_event * event_wait_list,cl_event *event)
    CL_API_SUFFIX__VERSION_1_0;


/* Events APIs */
typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clGetEventInfo)(cl_event event,
    cl_profiling_info param_name,size_t param_value_size,void *param_value,
    size_t *param_value_size_ret) CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clWaitForEvents)(cl_uint num_events,
    const cl_event *event_list) CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clReleaseEvent)(cl_event event)
    CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clRetainEvent)(cl_event event)
    CL_API_SUFFIX__VERSION_1_0;

typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clSetEventCallback)(cl_event event,
    cl_int command_exec_callback_type,void (CL_CALLBACK *MAGICKpfn_notify)(
      cl_event,cl_int,void *),void *user_data) CL_API_SUFFIX__VERSION_1_1;


/* Profiling APIs */
typedef CL_API_ENTRY cl_int
  (CL_API_CALL *MAGICKpfn_clGetEventProfilingInfo)(cl_event event,
    cl_profiling_info param_name,size_t param_value_size,void *param_value,
    size_t *param_value_size_ret) CL_API_SUFFIX__VERSION_1_0;

typedef struct MagickLibraryRec MagickLibrary;

struct MagickLibraryRec
{
  void *library;

  MAGICKpfn_clGetPlatformIDs          clGetPlatformIDs;
  MAGICKpfn_clGetPlatformInfo         clGetPlatformInfo;

  MAGICKpfn_clGetDeviceIDs            clGetDeviceIDs;
  MAGICKpfn_clGetDeviceInfo           clGetDeviceInfo;

  MAGICKpfn_clCreateContext           clCreateContext;
  MAGICKpfn_clReleaseContext          clReleaseContext;

  MAGICKpfn_clCreateCommandQueue      clCreateCommandQueue;
  MAGICKpfn_clReleaseCommandQueue     clReleaseCommandQueue;
  MAGICKpfn_clFlush                   clFlush;
  MAGICKpfn_clFinish                  clFinish;

  MAGICKpfn_clCreateBuffer            clCreateBuffer;
  MAGICKpfn_clRetainMemObject         clRetainMemObject;
  MAGICKpfn_clReleaseMemObject        clReleaseMemObject;

  MAGICKpfn_clCreateProgramWithSource clCreateProgramWithSource;
  MAGICKpfn_clCreateProgramWithBinary clCreateProgramWithBinary;
  MAGICKpfn_clReleaseProgram          clReleaseProgram;
  MAGICKpfn_clBuildProgram            clBuildProgram;
  MAGICKpfn_clGetProgramBuildInfo     clGetProgramBuildInfo;
  MAGICKpfn_clGetProgramInfo          clGetProgramInfo;

  MAGICKpfn_clCreateKernel            clCreateKernel;
  MAGICKpfn_clReleaseKernel           clReleaseKernel;
  MAGICKpfn_clSetKernelArg            clSetKernelArg;
  MAGICKpfn_clGetKernelInfo           clGetKernelInfo;

  MAGICKpfn_clEnqueueReadBuffer       clEnqueueReadBuffer;
  MAGICKpfn_clEnqueueMapBuffer        clEnqueueMapBuffer;
  MAGICKpfn_clEnqueueUnmapMemObject   clEnqueueUnmapMemObject;
  MAGICKpfn_clEnqueueNDRangeKernel    clEnqueueNDRangeKernel;

  MAGICKpfn_clGetEventInfo            clGetEventInfo;
  MAGICKpfn_clWaitForEvents           clWaitForEvents;
  MAGICKpfn_clReleaseEvent            clReleaseEvent;
  MAGICKpfn_clRetainEvent             clRetainEvent;
  MAGICKpfn_clSetEventCallback        clSetEventCallback;

  MAGICKpfn_clGetEventProfilingInfo   clGetEventProfilingInfo;
};

struct _MagickCLDevice
{
  char
    *name,
    *platform_name,
    *version;

  cl_command_queue
    command_queues[MAGICKCORE_OPENCL_COMMAND_QUEUES];

  cl_context
    context;

  cl_device_id
    deviceID;

  cl_device_type
    type;

  cl_program
    program;

  cl_uint
    max_clock_frequency,
    max_compute_units;

  cl_ulong
    local_memory_size;

  double
    score;

  KernelProfileRecord
    *profile_records;

  MagickBooleanType
    enabled,
    profile_kernels;

  SemaphoreInfo
    *lock;

  size_t
    requested;

  ssize_t
    command_queues_index;

  char
    *vendor_name;
};

typedef struct _MagickCLEnv
{
  cl_context
    *contexts;

  double
    cpu_score;

  MagickBooleanType
    enabled,
    initialized;

  MagickCLDevice
    *devices;

  MagickLibrary
    *library;

  MagickThreadType
    benchmark_thread_id;

  SemaphoreInfo
    *lock;

  size_t
    number_contexts,
    number_devices;
} *MagickCLEnv;

#if defined(MAGICKCORE_HDRI_SUPPORT)
#define CLOptions "-cl-single-precision-constant -cl-mad-enable -DMAGICKCORE_HDRI_SUPPORT=1 "\
  "-DCLQuantum=float -DCLSignedQuantum=float -DCLPixelType=float4 -DQuantumRange=%ff " \
  "-DCharQuantumScale=%f -DMagickEpsilon=%f -DMagickPI=%f -DMaxMap=%u -DMAGICKCORE_QUANTUM_DEPTH=%u"
#define CLQuantum  cl_float
#define CLPixelPacket  cl_float4
#define CLCharQuantumScale 1.0f
#elif (MAGICKCORE_QUANTUM_DEPTH == 8)
#define CLOptions "-cl-single-precision-constant -cl-mad-enable " \
  "-DCLQuantum=uchar -DCLSignedQuantum=char -DCLPixelType=uchar4 -DQuantumRange=%ff " \
  "-DCharQuantumScale=%ff -DMagickEpsilon=%ff -DMagickPI=%ff -DMaxMap=%u -DMAGICKCORE_QUANTUM_DEPTH=%u"
#define CLQuantum  cl_uchar
#define CLPixelPacket  cl_uchar4
#define CLCharQuantumScale 1.0f
#elif (MAGICKCORE_QUANTUM_DEPTH == 16)
#define CLOptions "-cl-single-precision-constant -cl-mad-enable " \
  "-DCLQuantum=ushort -DCLSignedQuantum=short -DCLPixelType=ushort4 -DQuantumRange=%ff "\
  "-DCharQuantumScale=%f -DMagickEpsilon=%f -DMagickPI=%f -DMaxMap=%u -DMAGICKCORE_QUANTUM_DEPTH=%u"
#define CLQuantum  cl_ushort
#define CLPixelPacket  cl_ushort4
#define CLCharQuantumScale 257.0f
#elif (MAGICKCORE_QUANTUM_DEPTH == 32)
#define CLOptions "-cl-single-precision-constant -cl-mad-enable " \
  "-DCLQuantum=uint -DCLSignedQuantum=int -DCLPixelType=uint4 -DQuantumRange=%ff "\
  "-DCharQuantumScale=%f -DMagickEpsilon=%f -DMagickPI=%f -DMaxMap=%u -DMAGICKCORE_QUANTUM_DEPTH=%u"
#define CLQuantum  cl_uint
#define CLPixelPacket  cl_uint4
#define CLCharQuantumScale 16843009.0f
#elif (MAGICKCORE_QUANTUM_DEPTH == 64)
#define CLOptions "-cl-single-precision-constant -cl-mad-enable " \
  "-DCLQuantum=ulong -DCLSignedQuantum=long -DCLPixelType=ulong4 -DQuantumRange=%ff "\
  "-DCharQuantumScale=%f -DMagickEpsilon=%f -DMagickPI=%f -DMaxMap=%u -DMAGICKCORE_QUANTUM_DEPTH=%u"
#define CLQuantum  cl_ulong
#define CLPixelPacket  cl_ulong4
#define CLCharQuantumScale 72340172838076673.0f
#endif

extern MagickPrivate cl_command_queue
  AcquireOpenCLCommandQueue(MagickCLDevice);

extern MagickPrivate cl_int
  SetOpenCLKernelArg(cl_kernel,size_t,size_t,const void *);

extern MagickPrivate cl_kernel
  AcquireOpenCLKernel(MagickCLDevice,const char *);

extern MagickPrivate cl_mem
  CreateOpenCLBuffer(MagickCLDevice,cl_mem_flags,size_t,void *);

extern MagickPrivate MagickBooleanType
  EnqueueOpenCLKernel(cl_command_queue,cl_kernel,cl_uint,const size_t *,
    const size_t *,const size_t *,const Image *,const Image *,
    MagickBooleanType,ExceptionInfo *),
  InitializeOpenCL(MagickCLEnv,ExceptionInfo *),
  OpenCLThrowMagickException(MagickCLDevice,ExceptionInfo *,
    const char *,const char *,const size_t,const ExceptionType,const char *,
    const char *,...),
  RecordProfileData(MagickCLDevice,cl_kernel,cl_event);

extern MagickPrivate MagickCLCacheInfo
  AcquireMagickCLCacheInfo(MagickCLDevice,Quantum *,const MagickSizeType),
  CopyMagickCLCacheInfo(MagickCLCacheInfo),
  RelinquishMagickCLCacheInfo(MagickCLCacheInfo,const MagickBooleanType);

extern MagickPrivate MagickCLDevice
  RequestOpenCLDevice(MagickCLEnv);

extern MagickPrivate MagickCLEnv
  GetCurrentOpenCLEnv(void);

extern MagickPrivate unsigned long
  GetOpenCLDeviceLocalMemorySize(const MagickCLDevice);

extern MagickPrivate void
  DumpOpenCLProfileData(),
  OpenCLTerminus(),
  ReleaseOpenCLCommandQueue(MagickCLDevice,cl_command_queue),
  ReleaseOpenCLDevice(MagickCLDevice),
  ReleaseOpenCLKernel(cl_kernel),
  ReleaseOpenCLMemObject(cl_mem),
  RetainOpenCLEvent(cl_event),
  RetainOpenCLMemObject(cl_mem);

#endif

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

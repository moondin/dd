---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 329
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 329 of 851)

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

---[FILE: threshold.h]---
Location: ImageMagick-main/MagickCore/threshold.h

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

  MagickCore image threshold methods.
*/
#ifndef MAGICKCORE_THRESHOLD_H
#define MAGICKCORE_THRESHOLD_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

typedef enum
{
  UndefinedThresholdMethod,
  KapurThresholdMethod,
  OTSUThresholdMethod,
  TriangleThresholdMethod
} AutoThresholdMethod;

typedef struct _ThresholdMap
  ThresholdMap;

extern MagickExport Image
  *AdaptiveThresholdImage(const Image *,const size_t,const size_t,const double,
    ExceptionInfo *);

extern MagickExport ThresholdMap
  *DestroyThresholdMap(ThresholdMap *),
  *GetThresholdMap(const char *,ExceptionInfo *);

extern MagickExport MagickBooleanType
  AutoThresholdImage(Image *,const AutoThresholdMethod,ExceptionInfo *),
  BilevelImage(Image *,const double,ExceptionInfo *),
  BlackThresholdImage(Image *,const char *,ExceptionInfo *),
  ClampImage(Image *,ExceptionInfo *),
  ColorThresholdImage(Image *,const PixelInfo *,const PixelInfo *,
    ExceptionInfo *),
  ListThresholdMaps(FILE *,ExceptionInfo *),
  OrderedDitherImage(Image *,const char *,ExceptionInfo *),
  PerceptibleImage(Image *,const double,ExceptionInfo *),
  RandomThresholdImage(Image *,const double,const double,ExceptionInfo *),
  RangeThresholdImage(Image *,const double,const double,const double,
    const double,ExceptionInfo *),
  WhiteThresholdImage(Image *,const char *,ExceptionInfo *);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: timer-private.h]---
Location: ImageMagick-main/MagickCore/timer-private.h

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

  MagickCore private timer methods.
*/
#ifndef MAGICKCORE_TIMER_PRIVATE_H
#define MAGICKCORE_TIMER_PRIVATE_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#include "MagickCore/locale_.h"

static inline void GetMagickUTCTime(const time_t *timep,struct tm *result)
{
#if defined(MAGICKCORE_HAVE_GMTIME_R)
  (void) gmtime_r(timep,result);
#elif defined(_MSC_VER)
  (void) gmtime_s(result,timep);
#else
  {
    struct tm
      *my_time;

    my_time=gmtime(timep);
    if (my_time != (struct tm *) NULL)
      (void) memcpy(result,my_time,sizeof(*my_time));
  }
#endif
}

static inline void GetMagickLocaltime(const time_t *timep,struct tm *result)
{
#if defined(MAGICKCORE_HAVE_GMTIME_R)
  (void) localtime_r(timep,result);
#elif defined(_MSC_VER)
  (void) localtime_s(result,timep);
#else
  {
    struct tm
      *my_time;

    my_time=localtime(timep);
    if (my_time != (struct tm *) NULL)
      (void) memcpy(result,my_time,sizeof(*my_time));
  }
#endif
}

extern MagickExport MagickBooleanType
  IsSourceDataEpochSet(void);

extern MagickExport time_t
  GetMagickTime(void);

static inline MagickBooleanType IsImageTTLExpired(const Image* image)
{
  if (image->ttl == (time_t) 0)
    return(MagickFalse);
  return(image->ttl < time((time_t *) NULL) ? MagickTrue : MagickFalse);
}

static inline time_t ParseMagickTimeToLive(const char *time_to_live)
{
  char
    *q;

  time_t
    ttl;

  /*
    Time to live, absolute or relative, e.g. 1440, 2 hours, 3 days, ...
  */
  ttl=(time_t) InterpretLocaleValue(time_to_live,&q);
  if (q != time_to_live)
    {
      while (isspace((int) ((unsigned char) *q)) != 0)
        q++;
      if (LocaleNCompare(q,"second",6) == 0)
        ttl*=1;
      if (LocaleNCompare(q,"minute",6) == 0)
        ttl*=60;
      if (LocaleNCompare(q,"hour",4) == 0)
        ttl*=3600;
      if (LocaleNCompare(q,"day",3) == 0)
        ttl*=86400;
      if (LocaleNCompare(q,"week",4) == 0)
        ttl*=604800;
      if (LocaleNCompare(q,"month",5) == 0)
        ttl*=2628000;
      if (LocaleNCompare(q,"year",4) == 0)
        ttl*=31536000;
   }
  return(ttl);
}

extern MagickPrivate void
  SetMagickDatePrecision(const unsigned long);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: timer.c]---
Location: ImageMagick-main/MagickCore/timer.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%                    TTTTT  IIIII  M   M  EEEEE  RRRR                         %
%                      T      I    MM MM  E      R   R                        %
%                      T      I    M M M  EEE    RRRR                         %
%                      T      I    M   M  E      R R                          %
%                      T    IIIII  M   M  EEEEE  R  R                         %
%                                                                             %
%                                                                             %
%                         MagickCore Timing Methods                           %
%                                                                             %
%                             Software Design                                 %
%                                  Cristy                                     %
%                              January 1993                                   %
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
%  Contributed by Bill Radcliffe and Bob Friesenhahn.
%
*/

/*
  Include declarations.
*/
#include "MagickCore/studio.h"
#include "MagickCore/exception.h"
#include "MagickCore/exception-private.h"
#include "MagickCore/image-private.h"
#include "MagickCore/locale_.h"
#include "MagickCore/log.h"
#include "MagickCore/memory_.h"
#include "MagickCore/memory-private.h"
#include "MagickCore/nt-base-private.h"
#include "MagickCore/registry.h"
#include "MagickCore/resource_.h"
#include "MagickCore/string-private.h"
#include "MagickCore/timer.h"
#include "MagickCore/timer-private.h"

/*
  Define declarations.
*/
#if !defined(CLOCKS_PER_SEC)
#define CLOCKS_PER_SEC  100
#endif

/*
  Forward declarations.
*/
static double
  UserTime(void);

static void
  StopTimer(TimerInfo *);

/*
  Static declarations.
*/
static ssize_t
  date_precision = -1;

static time_t
  magick_epoch = (time_t) 0;

static MagickBooleanType
  epoch_initialized = MagickFalse;

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   A c q u i r e T i m e r I n f o                                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  AcquireTimerInfo() initializes the TimerInfo structure.  It effectively
%  creates a stopwatch and starts it.
%
%  The format of the AcquireTimerInfo method is:
%
%      TimerInfo *AcquireTimerInfo(void)
%
*/
MagickExport TimerInfo *AcquireTimerInfo(void)
{
  TimerInfo
    *timer_info;

  timer_info=(TimerInfo *) AcquireCriticalMemory(sizeof(*timer_info));
  (void) memset(timer_info,0,sizeof(*timer_info));
  timer_info->signature=MagickCoreSignature;
  GetTimerInfo(timer_info);
  return(timer_info);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   C o n t i n u e T i m e r                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ContinueTimer() resumes a stopped stopwatch. The stopwatch continues
%  counting from the last StartTimer() onwards.
%
%  The format of the ContinueTimer method is:
%
%      MagickBooleanType ContinueTimer(TimerInfo *time_info)
%
%  A description of each parameter follows.
%
%    o  time_info: Time statistics structure.
%
*/
MagickExport MagickBooleanType ContinueTimer(TimerInfo *time_info)
{
  assert(time_info != (TimerInfo *) NULL);
  assert(time_info->signature == MagickCoreSignature);
  if (time_info->state == UndefinedTimerState)
    return(MagickFalse);
  if (time_info->state == StoppedTimerState)
    {
      time_info->user.total-=time_info->user.stop-time_info->user.start;
      time_info->elapsed.total-=time_info->elapsed.stop-
        time_info->elapsed.start;
    }
  time_info->state=RunningTimerState;
  return(MagickTrue);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   D e s t r o y T i m e r I n f o                                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  DestroyTimerInfo() zeros memory associated with the TimerInfo structure.
%
%  The format of the DestroyTimerInfo method is:
%
%      TimerInfo *DestroyTimerInfo(TimerInfo *timer_info)
%
%  A description of each parameter follows:
%
%    o timer_info: The cipher context.
%
*/
MagickExport TimerInfo *DestroyTimerInfo(TimerInfo *timer_info)
{
  assert(timer_info != (TimerInfo *) NULL);
  assert(timer_info->signature == MagickCoreSignature);
  timer_info->signature=(~MagickCoreSignature);
  timer_info=(TimerInfo *) RelinquishMagickMemory(timer_info);
  return(timer_info);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
+   E l a p s e d T i m e                                                     %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ElapsedTime() returns the elapsed time (in seconds) since the last call to
%  StartTimer().
%
%  The format of the ElapsedTime method is:
%
%      double ElapsedTime()
%
*/
static double ElapsedTime(void)
{
#if defined(MAGICKCORE_HAVE_CLOCK_GETTIME)
#define NANOSECONDS_PER_SECOND  1000000000.0
#if defined(CLOCK_HIGHRES)
#  define CLOCK_ID CLOCK_HIGHRES
#elif defined(CLOCK_MONOTONIC_RAW)
#  define CLOCK_ID CLOCK_MONOTONIC_RAW
#elif defined(CLOCK_MONOTONIC_PRECISE)
#  define CLOCK_ID CLOCK_MONOTONIC_PRECISE
#elif defined(CLOCK_MONOTONIC)
#  define CLOCK_ID CLOCK_MONOTONIC
#else
#  define CLOCK_ID CLOCK_REALTIME
#endif

  struct timespec 
    timer;

  (void) clock_gettime(CLOCK_ID,&timer);
  return((double) timer.tv_sec+timer.tv_nsec/NANOSECONDS_PER_SECOND);
#elif defined(MAGICKCORE_HAVE_TIMES) && defined(MAGICKCORE_HAVE_SYSCONF)
  struct tms
    timer;

  return((double) times(&timer)/sysconf(_SC_CLK_TCK));
#else
#if defined(MAGICKCORE_WINDOWS_SUPPORT)
  return(NTElapsedTime());
#else
  return((double) clock()/CLOCKS_PER_SEC);
#endif
#endif
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%  F o r m a t M a g i c k T i m e                                            %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  FormatMagickTime() returns the specified time in the Internet date/time
%  format and the length of the timestamp.
%
%  The format of the FormatMagickTime method is:
%
%      ssize_t FormatMagickTime(const time_t time,const size_t length,
%        char *timestamp)
%
%  A description of each parameter follows.
%
%    o time:  the time since the Epoch (00:00:00 UTC, January 1, 1970),
%      measured in seconds.
%
%    o length: the maximum length of the string.
%
%    o timestamp:  Return the Internet date/time here.
%
*/
MagickExport ssize_t FormatMagickTime(const time_t time,const size_t length,
  char *timestamp)
{
  ssize_t
    count;

  struct tm
    utc_time;

  assert(timestamp != (char *) NULL);
  if (date_precision == -1)
    {
      char
        *limit;

      date_precision=0;
      limit=GetEnvironmentValue("MAGICK_DATE_PRECISION");
      if (limit != (char *) NULL)
        {
          date_precision=StringToInteger(limit);
          limit=DestroyString(limit);
        }
    }
  GetMagickUTCTime(&time,&utc_time);
  count=FormatLocaleString(timestamp,length,
    "%04d-%02d-%02dT%02d:%02d:%02d%+03d:00",utc_time.tm_year+1900,
    utc_time.tm_mon+1,utc_time.tm_mday,utc_time.tm_hour,utc_time.tm_min,
    utc_time.tm_sec,0);
  if ((date_precision > 0) && (date_precision < (ssize_t) strlen(timestamp)))
    timestamp[date_precision]='\0';
  return(count);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   G e t E l a p s e d T i m e                                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  GetElapsedTime() returns the elapsed time (in seconds) passed between the
%  start and stop events. If the stopwatch is still running, it is stopped
%  first.
%
%  The format of the GetElapsedTime method is:
%
%      double GetElapsedTime(TimerInfo *time_info)
%
%  A description of each parameter follows.
%
%    o  time_info: Timer statistics structure.
%
*/
MagickExport double GetElapsedTime(TimerInfo *time_info)
{
  assert(time_info != (TimerInfo *) NULL);
  assert(time_info->signature == MagickCoreSignature);
  if (time_info->state == UndefinedTimerState)
    return(0.0);
  if (time_info->state == RunningTimerState)
    StopTimer(time_info);
  return(time_info->elapsed.total);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
+   G e t M a g i c k T i m e                                                 %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  GetMagickTime() returns the time as the number of seconds since the Epoch.
%
%  The format of the GetMagickTime method is:
%
%      time_t GetElapsedTime(void)
%
*/
static void InitializeEpoch(void)
{
  if (epoch_initialized == MagickFalse)
    {
      char
        *source_date_epoch;

      source_date_epoch=GetEnvironmentValue("SOURCE_DATE_EPOCH");
      if (source_date_epoch != (const char *) NULL)
        {
          time_t
            epoch;

          epoch=(time_t) StringToMagickOffsetType(source_date_epoch,100.0);
          if ((epoch > 0) && (epoch <= time((time_t *) NULL)))
            magick_epoch=epoch;
          source_date_epoch=DestroyString(source_date_epoch);
        }
      epoch_initialized=MagickTrue;
    }
}

MagickExport time_t GetMagickTime(void)
{
  InitializeEpoch();
  if (magick_epoch != 0)
    return(magick_epoch);
  return(time((time_t *) NULL));
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
+   G e t T i m e r I n f o                                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  GetTimerInfo() initializes the TimerInfo structure.
%
%  The format of the GetTimerInfo method is:
%
%      void GetTimerInfo(TimerInfo *time_info)
%
%  A description of each parameter follows.
%
%    o  time_info: Timer statistics structure.
%
*/
MagickExport void GetTimerInfo(TimerInfo *time_info)
{
  /*
    Create a stopwatch and start it.
  */
  assert(time_info != (TimerInfo *) NULL);
  (void) memset(time_info,0,sizeof(*time_info));
  time_info->state=UndefinedTimerState;
  time_info->signature=MagickCoreSignature;
  StartTimer(time_info,MagickTrue);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   G e t U s e r T i m e                                                     %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  GetUserTime() returns the User time (user and system) by the operating
%  system (in seconds) between the start and stop events. If the stopwatch is
%  still running, it is stopped first.
%
%  The format of the GetUserTime method is:
%
%      double GetUserTime(TimerInfo *time_info)
%
%  A description of each parameter follows.
%
%    o  time_info: Timer statistics structure.
%
*/
MagickExport double GetUserTime(TimerInfo *time_info)
{
  assert(time_info != (TimerInfo *) NULL);
  assert(time_info->signature == MagickCoreSignature);
  if (time_info->state == UndefinedTimerState)
    return(0.0);
  if (time_info->state == RunningTimerState)
    StopTimer(time_info);
  return(time_info->user.total);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
+   I s S o u r c e D a t a E p o c h S e t                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  IsSourceDataEpochSet() returns true when the SOURCE_DATE_EPOCH environment
%  variable is set. This variable is used to set the epoch time for the
%  GetMagickTime() method. If the variable is not set, then the current time is
%  returned.
%
%  The format of the IsSourceDataEpochSet method is:
%
%      MagickBooleanType IsSourceDataEpochSet(void)
%
*/
MagickExport MagickBooleanType IsSourceDataEpochSet(void)
{
  InitializeEpoch();
  return(magick_epoch != 0 ? MagickTrue : MagickFalse);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   R e s e t T i m e r                                                       %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  ResetTimer() resets the stopwatch.
%
%  The format of the ResetTimer method is:
%
%      void ResetTimer(TimerInfo *time_info)
%
%  A description of each parameter follows.
%
%    o  time_info: Timer statistics structure.
%
*/
MagickExport void ResetTimer(TimerInfo *time_info)
{
  assert(time_info != (TimerInfo *) NULL);
  assert(time_info->signature == MagickCoreSignature);
  StopTimer(time_info);
  time_info->elapsed.stop=0.0;
  time_info->user.stop=0.0;
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   S e t M a g i c k D a t e P r e c i s i o n                               %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  SetMagickDatePrecision() sets the pseudo-random number generator secret key.
%
%  The format of the SetMagickDatePrecision method is:
%
%      void SetMagickDatePrecision(const unsigned long precision)
%
%  A description of each parameter follows:
%
%    o key: the date precision.
%
*/
MagickPrivate void SetMagickDatePrecision(const unsigned long precision)
{
  date_precision=(ssize_t) precision;
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
+   S t a r t T i m e r                                                       %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  StartTimer() starts the stopwatch.
%
%  The format of the StartTimer method is:
%
%      void StartTimer(TimerInfo *time_info,const MagickBooleanType reset)
%
%  A description of each parameter follows.
%
%    o  time_info: Timer statistics structure.
%
%    o  reset: If reset is MagickTrue, then the stopwatch is reset prior to
%       starting.  If reset is MagickFalse, then timing is continued without
%       resetting the stopwatch.
%
*/
MagickExport void StartTimer(TimerInfo *time_info,const MagickBooleanType reset)
{
  assert(time_info != (TimerInfo *) NULL);
  assert(time_info->signature == MagickCoreSignature);
  if (reset != MagickFalse)
    {
      /*
        Reset the stopwatch before starting it.
      */
      time_info->user.total=0.0;
      time_info->elapsed.total=0.0;
    }
  if (time_info->state != RunningTimerState)
    {
      time_info->elapsed.start=ElapsedTime();
      time_info->user.start=UserTime();
    }
  time_info->state=RunningTimerState;
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
+   S t o p T i m e r                                                         %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  StopTimer() stops the stopwatch.
%
%  The format of the StopTimer method is:
%
%      void StopTimer(TimerInfo *time_info)
%
%  A description of each parameter follows.
%
%    o  time_info: Timer statistics structure.
%
*/
static void StopTimer(TimerInfo *time_info)
{
  assert(time_info != (TimerInfo *) NULL);
  assert(time_info->signature == MagickCoreSignature);
  time_info->elapsed.stop=ElapsedTime();
  time_info->user.stop=UserTime();
  if (time_info->state == RunningTimerState)
    {
      time_info->user.total+=time_info->user.stop-
        time_info->user.start+MagickEpsilon;
      time_info->elapsed.total+=time_info->elapsed.stop-
        time_info->elapsed.start+MagickEpsilon;
    }
  time_info->state=StoppedTimerState;
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
+   U s e r T i m e                                                           %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  UserTime() returns the total time the process has been scheduled (in
%  seconds) since the last call to StartTimer().
%
%  The format of the UserTime method is:
%
%      double UserTime()
%
*/
static double UserTime(void)
{
#if defined(MAGICKCORE_HAVE_TIMES) && defined(MAGICKCORE_HAVE_SYSCONF)
  struct tms
    timer;

  (void) times(&timer);
  return((double) (timer.tms_utime+timer.tms_stime)/sysconf(_SC_CLK_TCK));
#else
#if defined(MAGICKCORE_WINDOWS_SUPPORT)
  return(NTElapsedTime());
#else
  return((double) clock()/CLOCKS_PER_SEC);
#endif
#endif
}
```

--------------------------------------------------------------------------------

---[FILE: timer.h]---
Location: ImageMagick-main/MagickCore/timer.h

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

  MagickCore timer methods.
*/
#ifndef MAGICKCORE_TIMER_H
#define MAGICKCORE_TIMER_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

typedef enum
{
  UndefinedTimerState,
  StoppedTimerState,
  RunningTimerState
} TimerState;

typedef struct _Timer
{
  double
    start,
    stop,
    total;
} Timer;

typedef struct _TimerInfo
{ 
  Timer
    user,
    elapsed;
  
  TimerState
    state;
  
  size_t
    signature;
} TimerInfo;

extern MagickExport double
  GetElapsedTime(TimerInfo *),
  GetUserTime(TimerInfo *);

extern MagickExport MagickBooleanType
  ContinueTimer(TimerInfo *);

extern MagickExport ssize_t
  FormatMagickTime(const time_t,const size_t,char *);

extern MagickExport TimerInfo
  *AcquireTimerInfo(void),
  *DestroyTimerInfo(TimerInfo *);

extern MagickExport void
  GetTimerInfo(TimerInfo *),
  ResetTimer(TimerInfo *),
  StartTimer(TimerInfo *,const MagickBooleanType);

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

---[FILE: token-private.h]---
Location: ImageMagick-main/MagickCore/token-private.h

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

  MagickCore private token methods.
*/
#ifndef MAGICKCORE_TOKEN_PRIVATE_H
#define MAGICKCORE_TOKEN_PRIVATE_H

#if defined(__cplusplus) || defined(c_plusplus)
extern "C" {
#endif

#ifndef EILSEQ
  #define EILSEQ  ENOENT
#endif

#define MaxMultibyteCodes  6

extern MagickPrivate MagickBooleanType
  IsGlob(const char *) magick_attribute((__pure__));

typedef struct
{
  int
    code_mask,
    code_value,
    utf_mask,
    utf_value;
} UTFInfo;

static UTFInfo
  utf_info[MaxMultibyteCodes] =
  {
    { 0x80, 0x00, 0x000007f, 0x0000000 },  /* 1 byte sequence */
    { 0xE0, 0xC0, 0x00007ff, 0x0000080 },  /* 2 byte sequence */
    { 0xF0, 0xE0, 0x000ffff, 0x0000800 },  /* 3 byte sequence */
    { 0xF8, 0xF0, 0x01fffff, 0x0010000 },  /* 4 byte sequence */
    { 0xFC, 0xF8, 0x03fffff, 0x0200000 },  /* 5 byte sequence */
    { 0xFE, 0xFC, 0x7ffffff, 0x4000000 },  /* 6 byte sequence */
  };

static inline unsigned char *ConvertLatin1ToUTF8(
  const unsigned char *magick_restrict content)
{
  int
    c;

  const unsigned char
    *magick_restrict p;

  unsigned char
    *magick_restrict q;

  size_t
    length;

  unsigned char
    *utf8;

  length=0;
  for (p=content; *p != '\0'; p++)
    length+=(*p & 0x80) != 0 ? 2 : 1;
  utf8=(unsigned char *) NULL;
  if (~length >= 1)
    utf8=(unsigned char *) AcquireQuantumMemory(length+1UL,sizeof(*utf8));
  if (utf8 == (unsigned char *) NULL)
    return((unsigned char *) NULL);
  q=utf8;
  for (p=content; *p != '\0'; p++)
  {
    c=(*p);
    if ((c & 0x80) == 0)
      *q++=(unsigned char) c;
    else
      {
        *q++=(unsigned char) (0xc0 | ((c >> 6) & 0x3f));
        *q++=(unsigned char) (0x80 | (c & 0x3f));
      }
  }
  *q='\0';
  return(utf8);
}

static inline int GetNextUTFCode(const char *magick_restrict text,
  unsigned int *magick_restrict octets)
{
  int
    code;

  ssize_t
    i;

  int
    c,
    unicode;

  *octets=1;
  if (text == (const char *) NULL)
    {
      errno=EINVAL;
      return(-1);
    }
  code=(int) (*text++) & 0xff;
  unicode=code;
  for (i=0; i < MaxMultibyteCodes; i++)
  {
    if ((code & utf_info[i].code_mask) == utf_info[i].code_value)
      {
        unicode&=utf_info[i].utf_mask;
        if (unicode < utf_info[i].utf_value)
          break;
        *octets=(unsigned int) (i+1);
        return(unicode);
      }
    c=(int) (*text++ ^ 0x80) & 0xff;
    if ((c & 0xc0) != 0)
      break;
    if (unicode > 0x10FFFF)
      break;
    unicode=(unicode << 6) | c;
  }
  errno=EILSEQ;
  return(-1);
}

static inline int GetUTFCode(const char *magick_restrict text)
{
  unsigned int
    octets;

  return(GetNextUTFCode(text,&octets));
}

static inline unsigned int GetUTFOctets(const char *magick_restrict text)
{
  unsigned int
    octets;

  (void) GetNextUTFCode(text,&octets);
  return(octets);
}

static inline MagickBooleanType IsNonBreakingUTFSpace(const int code)
{
  if (code == 0x00a0)
    return(MagickTrue);
  return(MagickFalse);
}

static inline MagickBooleanType IsUTFSpace(const int code)
{
  if (((code >= 0x0009) && (code <= 0x000d)) || (code == 0x0020) ||
      (code == 0x0085) || (code == 0x00a0) || (code == 0x1680) ||
      (code == 0x180e) || ((code >= 0x2000) && (code <= 0x200a)) ||
      (code == 0x2028) || (code == 0x2029) || (code == 0x202f) ||
      (code == 0x205f) || (code == 0x3000))
    return(MagickTrue);
  return(MagickFalse);
}

static inline MagickBooleanType IsUTFValid(int code)
{
  int
    mask;

  mask=(int) 0x7fffffff;
  if (((code & ~mask) != 0) && ((code < 0xd800) || (code > 0xdfff)) &&
      (code != 0xfffe) && (code != 0xffff))
    return(MagickFalse);
  return(MagickTrue);
}

static inline MagickBooleanType IsUTFAscii(int code)
{
  int
    mask;

  mask=(int) 0x7f;
  if ((code & ~mask) != 0)
    return(MagickFalse);
  return(MagickTrue);
}

#if defined(__cplusplus) || defined(c_plusplus)
}
#endif

#endif
```

--------------------------------------------------------------------------------

````

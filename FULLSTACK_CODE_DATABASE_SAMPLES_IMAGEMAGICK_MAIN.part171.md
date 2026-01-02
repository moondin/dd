---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 171
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 171 of 851)

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

---[FILE: ax_gcc_archflag.m4]---
Location: ImageMagick-main/m4/ax_gcc_archflag.m4

```text
# ===========================================================================
#     https://www.gnu.org/software/autoconf-archive/ax_gcc_archflag.html
# ===========================================================================
#
# SYNOPSIS
#
#   AX_GCC_ARCHFLAG([PORTABLE?], [ACTION-SUCCESS], [ACTION-FAILURE])
#
# DESCRIPTION
#
#   This macro tries to guess the "native" arch corresponding to the target
#   architecture for use with gcc's -march=arch or -mtune=arch flags. If
#   found, the cache variable $ax_cv_gcc_archflag is set to this flag and
#   ACTION-SUCCESS is executed; otherwise $ax_cv_gcc_archflag is set to
#   "unknown" and ACTION-FAILURE is executed. The default ACTION-SUCCESS is
#   to add $ax_cv_gcc_archflag to the end of $CFLAGS.
#
#   PORTABLE? should be either [yes] (default) or [no]. In the former case,
#   the flag is set to -mtune (or equivalent) so that the architecture is
#   only used for tuning, but the instruction set used is still portable. In
#   the latter case, the flag is set to -march (or equivalent) so that
#   architecture-specific instructions are enabled.
#
#   The user can specify --with-gcc-arch=<arch> in order to override the
#   macro's choice of architecture, or --without-gcc-arch to disable this.
#
#   When cross-compiling, or if $CC is not gcc, then ACTION-FAILURE is
#   called unless the user specified --with-gcc-arch manually.
#
#   Requires macros: AX_CHECK_COMPILE_FLAG, AX_GCC_X86_CPUID
#
#   (The main emphasis here is on recent CPUs, on the principle that doing
#   high-performance computing on old hardware is uncommon.)
#
# LICENSE
#
#   Copyright (c) 2008 Steven G. Johnson <stevenj@alum.mit.edu>
#   Copyright (c) 2008 Matteo Frigo
#   Copyright (c) 2014 Tsukasa Oi
#   Copyright (c) 2017-2018 Alexey Kopytov
#
#   This program is free software: you can redistribute it and/or modify it
#   under the terms of the GNU General Public License as published by the
#   Free Software Foundation, either version 3 of the License, or (at your
#   option) any later version.
#
#   This program is distributed in the hope that it will be useful, but
#   WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
#   Public License for more details.
#
#   You should have received a copy of the GNU General Public License along
#   with this program. If not, see <https://www.gnu.org/licenses/>.
#
#   As a special exception, the respective Autoconf Macro's copyright owner
#   gives unlimited permission to copy, distribute and modify the configure
#   scripts that are the output of Autoconf when processing the Macro. You
#   need not follow the terms of the GNU General Public License when using
#   or distributing such scripts, even though portions of the text of the
#   Macro appear in them. The GNU General Public License (GPL) does govern
#   all other use of the material that constitutes the Autoconf Macro.
#
#   This special exception to the GPL applies to versions of the Autoconf
#   Macro released by the Autoconf Archive. When you make and distribute a
#   modified version of the Autoconf Macro, you may extend this special
#   exception to the GPL to apply to your modified version as well.

#serial 22

AC_DEFUN([AX_GCC_ARCHFLAG],
[AC_REQUIRE([AC_PROG_CC])
AC_REQUIRE([AC_CANONICAL_HOST])
AC_REQUIRE([AC_PROG_SED])
AC_REQUIRE([AX_COMPILER_VENDOR])

AC_ARG_WITH(gcc-arch, [AS_HELP_STRING([--with-gcc-arch=<arch>], [use architecture <arch> for gcc -march/-mtune, instead of guessing])],
	ax_gcc_arch=$withval, ax_gcc_arch=yes)

AC_MSG_CHECKING([for gcc architecture flag])
AC_MSG_RESULT([])
AC_CACHE_VAL(ax_cv_gcc_archflag,
[
ax_cv_gcc_archflag="unknown"

if test "$GCC" = yes; then

if test "x$ax_gcc_arch" = xyes; then
ax_gcc_arch=""
if test "$cross_compiling" = no; then
case $host_cpu in
  i[[3456]]86*|x86_64*|amd64*) # use cpuid codes
     AX_GCC_X86_CPUID(0)
     AX_GCC_X86_CPUID(1)
     case $ax_cv_gcc_x86_cpuid_0 in
       *:756e6547:6c65746e:49656e69) # Intel
          case $ax_cv_gcc_x86_cpuid_1 in
	    *5[[4578]]?:*:*:*) ax_gcc_arch="pentium-mmx pentium" ;;
	    *5[[123]]?:*:*:*) ax_gcc_arch=pentium ;;
	    *0?61?:*:*:*|?61?:*:*:*|61?:*:*:*) ax_gcc_arch=pentiumpro ;;
	    *0?6[[356]]?:*:*:*|?6[[356]]?:*:*:*|6[[356]]?:*:*:*) ax_gcc_arch="pentium2 pentiumpro" ;;
	    *0?6[[78ab]]?:*:*:*|?6[[78ab]]?:*:*:*|6[[78ab]]?:*:*:*) ax_gcc_arch="pentium3 pentiumpro" ;;
	    *0?6[[9d]]?:*:*:*|?6[[9d]]?:*:*:*|6[[9d]]?:*:*:*|*1?65?:*:*:*) ax_gcc_arch="pentium-m pentium3 pentiumpro" ;;
	    *0?6e?:*:*:*|?6e?:*:*:*|6e?:*:*:*) ax_gcc_arch="yonah pentium-m pentium3 pentiumpro" ;;
	    *0?6f?:*:*:*|?6f?:*:*:*|6f?:*:*:*|*1?66?:*:*:*) ax_gcc_arch="core2 pentium-m pentium3 pentiumpro" ;;
	    *1?6[[7d]]?:*:*:*) ax_gcc_arch="penryn core2 pentium-m pentium3 pentiumpro" ;;
	    *1?6[[aef]]?:*:*:*|*2?6e?:*:*:*) ax_gcc_arch="nehalem corei7 core2 pentium-m pentium3 pentiumpro" ;;
	    *2?6[[5cf]]?:*:*:*) ax_gcc_arch="westmere corei7 core2 pentium-m pentium3 pentiumpro" ;;
	    *2?6[[ad]]?:*:*:*) ax_gcc_arch="sandybridge corei7-avx corei7 core2 pentium-m pentium3 pentiumpro" ;;
	    *3?6[[ae]]?:*:*:*) ax_gcc_arch="ivybridge core-avx-i corei7-avx corei7 core2 pentium-m pentium3 pentiumpro" ;;
	    *3?6[[cf]]?:*:*:*|*4?6[[56]]?:*:*:*) ax_gcc_arch="haswell core-avx2 core-avx-i corei7-avx corei7 core2 pentium-m pentium3 pentiumpro" ;;
	    *3?6d?:*:*:*|*4?6[[7f]]?:*:*:*|*5?66?:*:*:*) ax_gcc_arch="broadwell core-avx2 core-avx-i corei7-avx corei7 core2 pentium-m pentium3 pentiumpro" ;;
	    *1?6c?:*:*:*|*2?6[[67]]?:*:*:*|*3?6[[56]]?:*:*:*) ax_gcc_arch="bonnell atom core2 pentium-m pentium3 pentiumpro" ;;
	    *3?67?:*:*:*|*[[45]]?6[[ad]]?:*:*:*) ax_gcc_arch="silvermont atom core2 pentium-m pentium3 pentiumpro" ;;
	    *000?f[[012]]?:*:*:*|?f[[012]]?:*:*:*|f[[012]]?:*:*:*) ax_gcc_arch="pentium4 pentiumpro" ;;
	    *000?f[[346]]?:*:*:*|?f[[346]]?:*:*:*|f[[346]]?:*:*:*) ax_gcc_arch="nocona prescott pentium4 pentiumpro" ;;
	    # fallback
	    *5??:*:*:*) ax_gcc_arch=pentium ;;
	    *??6??:*:*:*) ax_gcc_arch="core2 pentiumpro" ;;
	    *6??:*:*:*) ax_gcc_arch=pentiumpro ;;
	    *00??f??:*:*:*|??f??:*:*:*|?f??:*:*:*|f??:*:*:*) ax_gcc_arch="pentium4 pentiumpro" ;;
          esac ;;
       *:68747541:444d4163:69746e65) # AMD
          case $ax_cv_gcc_x86_cpuid_1 in
	    *5[[67]]?:*:*:*) ax_gcc_arch=k6 ;;
	    *5[[8]]?:*:*:*) ax_gcc_arch="k6-2 k6" ;;
	    *5[[9d]]?:*:*:*) ax_gcc_arch="k6-3 k6" ;;
	    *6[[12]]?:*:*:*) ax_gcc_arch="athlon k7" ;;
	    *6[[34]]?:*:*:*) ax_gcc_arch="athlon-tbird k7" ;;
	    *6[[678a]]?:*:*:*) ax_gcc_arch="athlon-xp athlon-4 athlon k7" ;;
	    *000?f[[4578bcef]]?:*:*:*|?f[[4578bcef]]?:*:*:*|f[[4578bcef]]?:*:*:*|*001?f[[4578bcf]]?:*:*:*|1?f[[4578bcf]]?:*:*:*) ax_gcc_arch="athlon64 k8" ;;
	    *002?f[[13457bcf]]?:*:*:*|2?f[[13457bcf]]?:*:*:*|*004?f[[138bcf]]?:*:*:*|4?f[[138bcf]]?:*:*:*|*005?f[[df]]?:*:*:*|5?f[[df]]?:*:*:*|*006?f[[8bcf]]?:*:*:*|6?f[[8bcf]]?:*:*:*|*007?f[[cf]]?:*:*:*|7?f[[cf]]?:*:*:*|*00c?f1?:*:*:*|c?f1?:*:*:*|*020?f3?:*:*:*|20?f3?:*:*:*) ax_gcc_arch="athlon64-sse3 k8-sse3 athlon64 k8" ;;
	    *010?f[[245689a]]?:*:*:*|10?f[[245689a]]?:*:*:*|*030?f1?:*:*:*|30?f1?:*:*:*) ax_gcc_arch="barcelona amdfam10 k8" ;;
	    *050?f[[12]]?:*:*:*|50?f[[12]]?:*:*:*) ax_gcc_arch="btver1 amdfam10 k8" ;;
	    *060?f1?:*:*:*|60?f1?:*:*:*) ax_gcc_arch="bdver1 amdfam10 k8" ;;
	    *060?f2?:*:*:*|60?f2?:*:*:*|*061?f[[03]]?:*:*:*|61?f[[03]]?:*:*:*) ax_gcc_arch="bdver2 bdver1 amdfam10 k8" ;;
	    *063?f0?:*:*:*|63?f0?:*:*:*) ax_gcc_arch="bdver3 bdver2 bdver1 amdfam10 k8" ;;
	    *07[[03]]?f0?:*:*:*|7[[03]]?f0?:*:*:*) ax_gcc_arch="btver2 btver1 amdfam10 k8" ;;
	    # fallback
	    *0[[13]]??f??:*:*:*|[[13]]??f??:*:*:*) ax_gcc_arch="barcelona amdfam10 k8" ;;
	    *020?f??:*:*:*|20?f??:*:*:*) ax_gcc_arch="athlon64-sse3 k8-sse3 athlon64 k8" ;;
	    *05??f??:*:*:*|5??f??:*:*:*) ax_gcc_arch="btver1 amdfam10 k8" ;;
	    *060?f??:*:*:*|60?f??:*:*:*) ax_gcc_arch="bdver1 amdfam10 k8" ;;
	    *061?f??:*:*:*|61?f??:*:*:*) ax_gcc_arch="bdver2 bdver1 amdfam10 k8" ;;
	    *06??f??:*:*:*|6??f??:*:*:*) ax_gcc_arch="bdver3 bdver2 bdver1 amdfam10 k8" ;;
	    *070?f??:*:*:*|70?f??:*:*:*) ax_gcc_arch="btver2 btver1 amdfam10 k8" ;;
	    *???f??:*:*:*) ax_gcc_arch="amdfam10 k8" ;;
          esac ;;
	*:746e6543:736c7561:48727561) # IDT / VIA (Centaur)
	   case $ax_cv_gcc_x86_cpuid_1 in
	     *54?:*:*:*) ax_gcc_arch=winchip-c6 ;;
	     *5[[89]]?:*:*:*) ax_gcc_arch=winchip2 ;;
	     *66?:*:*:*) ax_gcc_arch=winchip2 ;;
	     *6[[78]]?:*:*:*) ax_gcc_arch=c3 ;;
	     *6[[9adf]]?:*:*:*) ax_gcc_arch="c3-2 c3" ;;
	   esac ;;
     esac
     if test x"$ax_gcc_arch" = x; then # fallback
	case $host_cpu in
	  i586*) ax_gcc_arch=pentium ;;
	  i686*) ax_gcc_arch=pentiumpro ;;
        esac
     fi
     ;;

  sparc*)
     AC_PATH_PROG([PRTDIAG], [prtdiag], [prtdiag], [$PATH:/usr/platform/`uname -i`/sbin/:/usr/platform/`uname -m`/sbin/])
     cputype=`(((grep cpu /proc/cpuinfo | cut -d: -f2) ; ($PRTDIAG -v |grep -i sparc) ; grep -i cpu /var/run/dmesg.boot ) | head -n 1) 2> /dev/null`
     cputype=`echo "$cputype" | tr -d ' -' | $SED 's/SPARCIIi/SPARCII/' |tr $as_cr_LETTERS $as_cr_letters`
     case $cputype in
         *ultrasparciv*) ax_gcc_arch="ultrasparc4 ultrasparc3 ultrasparc v9" ;;
         *ultrasparciii*) ax_gcc_arch="ultrasparc3 ultrasparc v9" ;;
         *ultrasparc*) ax_gcc_arch="ultrasparc v9" ;;
         *supersparc*|*tms390z5[[05]]*) ax_gcc_arch="supersparc v8" ;;
         *hypersparc*|*rt62[[056]]*) ax_gcc_arch="hypersparc v8" ;;
         *cypress*) ax_gcc_arch=cypress ;;
     esac ;;

  alphaev5) ax_gcc_arch=ev5 ;;
  alphaev56) ax_gcc_arch=ev56 ;;
  alphapca56) ax_gcc_arch="pca56 ev56" ;;
  alphapca57) ax_gcc_arch="pca57 pca56 ev56" ;;
  alphaev6) ax_gcc_arch=ev6 ;;
  alphaev67) ax_gcc_arch=ev67 ;;
  alphaev68) ax_gcc_arch="ev68 ev67" ;;
  alphaev69) ax_gcc_arch="ev69 ev68 ev67" ;;
  alphaev7) ax_gcc_arch="ev7 ev69 ev68 ev67" ;;
  alphaev79) ax_gcc_arch="ev79 ev7 ev69 ev68 ev67" ;;

  powerpc*)
     cputype=`((grep cpu /proc/cpuinfo | head -n 1 | cut -d: -f2 | cut -d, -f1 | $SED 's/ //g') ; /usr/bin/machine ; /bin/machine; grep CPU /var/run/dmesg.boot | head -n 1 | cut -d" " -f2) 2> /dev/null`
     cputype=`echo $cputype | $SED -e 's/ppc//g;s/ *//g'`
     case $cputype in
       *750*) ax_gcc_arch="750 G3" ;;
       *740[[0-9]]*) ax_gcc_arch="$cputype 7400 G4" ;;
       *74[[4-5]][[0-9]]*) ax_gcc_arch="$cputype 7450 G4" ;;
       *74[[0-9]][[0-9]]*) ax_gcc_arch="$cputype G4" ;;
       *970*) ax_gcc_arch="970 G5 power4";;
       *POWER4*|*power4*|*gq*) ax_gcc_arch="power4 970";;
       *POWER5*|*power5*|*gr*|*gs*) ax_gcc_arch="power5 power4 970";;
       603ev|8240) ax_gcc_arch="$cputype 603e 603";;
       *POWER7*) ax_gcc_arch="power7";;
       *POWER8*) ax_gcc_arch="power8";;
       *POWER9*) ax_gcc_arch="power9";;
       *POWER10*) ax_gcc_arch="power10";;
       *) ax_gcc_arch=$cputype ;;
     esac
     ax_gcc_arch="$ax_gcc_arch powerpc"
     ;;
  aarch64)
     cpuimpl=`grep 'CPU implementer' /proc/cpuinfo 2> /dev/null | cut -d: -f2 | tr -d " " | head -n 1`
     cpuarch=`grep 'CPU architecture' /proc/cpuinfo 2> /dev/null | cut -d: -f2 | tr -d " " | head -n 1`
     cpuvar=`grep 'CPU variant' /proc/cpuinfo 2> /dev/null | cut -d: -f2 | tr -d " " | head -n 1`
     case $cpuimpl in
       0x42) case $cpuarch in
               8) case $cpuvar in
                    0x0) ax_gcc_arch="thunderx2t99 vulcan armv8.1-a armv8-a+lse armv8-a native" ;;
                  esac
                  ;;
             esac
             ;;
       0x43) case $cpuarch in
               8) case $cpuvar in
                    0x0) ax_gcc_arch="thunderx armv8-a native" ;;
                    0x1) ax_gcc_arch="thunderx+lse armv8.1-a armv8-a+lse armv8-a native" ;;
                  esac
                  ;;
             esac
             ;;
      esac
      ;;
esac
fi # not cross-compiling
fi # guess arch

if test "x$ax_gcc_arch" != x -a "x$ax_gcc_arch" != xno; then
if test "x[]m4_default([$1],yes)" = xyes; then # if we require portable code
  flag_prefixes="-mtune="
  if test "x$ax_cv_[]_AC_LANG_ABBREV[]_compiler_vendor" = xclang; then flag_prefixes="-march="; fi
  # -mcpu=$arch and m$arch generate nonportable code on every arch except
  # x86.  And some other arches (e.g. Alpha) don't accept -mtune.  Grrr.
  case $host_cpu in i*86|x86_64*|amd64*) flag_prefixes="$flag_prefixes -mcpu= -m";; esac
else
  flag_prefixes="-march= -mcpu= -m"
fi
for flag_prefix in $flag_prefixes; do
  for arch in $ax_gcc_arch; do
    flag="$flag_prefix$arch"
    AX_CHECK_COMPILE_FLAG($flag, [if test "x$ax_cv_[]_AC_LANG_ABBREV[]_compiler_vendor" = xclang; then
      if test "x[]m4_default([$1],yes)" = xyes; then
	if test "x$flag" = "x-march=$arch"; then flag=-mtune=$arch; fi
      fi
    fi; ax_cv_gcc_archflag=$flag; break])
  done
  test "x$ax_cv_gcc_archflag" = xunknown || break
done
fi

fi # $GCC=yes
])
AC_MSG_CHECKING([for gcc architecture flag])
AC_MSG_RESULT($ax_cv_gcc_archflag)
if test "x$ax_cv_gcc_archflag" = xunknown; then
  m4_default([$3],:)
else
  m4_default([$2], [CFLAGS="$CFLAGS $ax_cv_gcc_archflag"])
fi
])
```

--------------------------------------------------------------------------------

---[FILE: ax_gcc_x86_cpuid.m4]---
Location: ImageMagick-main/m4/ax_gcc_x86_cpuid.m4

```text
# ===========================================================================
#     https://www.gnu.org/software/autoconf-archive/ax_gcc_x86_cpuid.html
# ===========================================================================
#
# SYNOPSIS
#
#   AX_GCC_X86_CPUID(OP)
#   AX_GCC_X86_CPUID_COUNT(OP, COUNT)
#
# DESCRIPTION
#
#   On Pentium and later x86 processors, with gcc or a compiler that has a
#   compatible syntax for inline assembly instructions, run a small program
#   that executes the cpuid instruction with input OP. This can be used to
#   detect the CPU type. AX_GCC_X86_CPUID_COUNT takes an additional COUNT
#   parameter that gets passed into register ECX before calling cpuid.
#
#   On output, the values of the eax, ebx, ecx, and edx registers are stored
#   as hexadecimal strings as "eax:ebx:ecx:edx" in the cache variable
#   ax_cv_gcc_x86_cpuid_OP.
#
#   If the cpuid instruction fails (because you are running a
#   cross-compiler, or because you are not using gcc, or because you are on
#   a processor that doesn't have this instruction), ax_cv_gcc_x86_cpuid_OP
#   is set to the string "unknown".
#
#   This macro mainly exists to be used in AX_GCC_ARCHFLAG.
#
# LICENSE
#
#   Copyright (c) 2008 Steven G. Johnson <stevenj@alum.mit.edu>
#   Copyright (c) 2008 Matteo Frigo
#   Copyright (c) 2015 Michael Petch <mpetch@capp-sysware.com>
#
#   This program is free software: you can redistribute it and/or modify it
#   under the terms of the GNU General Public License as published by the
#   Free Software Foundation, either version 3 of the License, or (at your
#   option) any later version.
#
#   This program is distributed in the hope that it will be useful, but
#   WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
#   Public License for more details.
#
#   You should have received a copy of the GNU General Public License along
#   with this program. If not, see <https://www.gnu.org/licenses/>.
#
#   As a special exception, the respective Autoconf Macro's copyright owner
#   gives unlimited permission to copy, distribute and modify the configure
#   scripts that are the output of Autoconf when processing the Macro. You
#   need not follow the terms of the GNU General Public License when using
#   or distributing such scripts, even though portions of the text of the
#   Macro appear in them. The GNU General Public License (GPL) does govern
#   all other use of the material that constitutes the Autoconf Macro.
#
#   This special exception to the GPL applies to versions of the Autoconf
#   Macro released by the Autoconf Archive. When you make and distribute a
#   modified version of the Autoconf Macro, you may extend this special
#   exception to the GPL to apply to your modified version as well.

#serial 10

AC_DEFUN([AX_GCC_X86_CPUID],
[AX_GCC_X86_CPUID_COUNT($1, 0)
])

AC_DEFUN([AX_GCC_X86_CPUID_COUNT],
[AC_REQUIRE([AC_PROG_CC])
AC_LANG_PUSH([C])
AC_CACHE_CHECK(for x86 cpuid $1 output, ax_cv_gcc_x86_cpuid_$1,
 [AC_RUN_IFELSE([AC_LANG_PROGRAM([#include <stdio.h>], [
     int op = $1, level = $2, eax, ebx, ecx, edx;
     FILE *f;
      __asm__ __volatile__ ("xchg %%ebx, %1\n"
        "cpuid\n"
        "xchg %%ebx, %1\n"
        : "=a" (eax), "=r" (ebx), "=c" (ecx), "=d" (edx)
        : "a" (op), "2" (level));

     f = fopen("conftest_cpuid", "w"); if (!f) return 1;
     fprintf(f, "%x:%x:%x:%x\n", eax, ebx, ecx, edx);
     fclose(f);
     return 0;
])],
     [ax_cv_gcc_x86_cpuid_$1=`cat conftest_cpuid`; rm -f conftest_cpuid],
     [ax_cv_gcc_x86_cpuid_$1=unknown; rm -f conftest_cpuid],
     [ax_cv_gcc_x86_cpuid_$1=unknown])])
AC_LANG_POP([C])
])
```

--------------------------------------------------------------------------------

---[FILE: ax_have_opencl.m4]---
Location: ImageMagick-main/m4/ax_have_opencl.m4

```text
# -*- mode: autoconf -*-
#
# AX_HAVE_OPENCL
#
# Check for an OpenCL implementation.  If CL is found, HAVE_OPENCL is defined
# and the required CPP and linker flags are included in the output variables
# "CL_CPPFLAGS" and "CL_LIBS", respectively.  If no usable CL implementation is
# found then "no_cl" is set to "yes" (otherwise it is set to "no").
#
# If the header <CL/cl.h> is found, "HAVE_CL_CL_H" is defined.  If the header 
# <OpenCL/cl.h> is found, HAVE_OPENCL_CL_H is defined.  These preprocessor
# definitions may not be mutually exclusive.
#
# This macro first checks /usr/include and /usr/lib for OpenCL support; if it is not
# found in those locations, then it checks in the standard installation locations
# for AMD's (/opt/AMDAPP) and NVIDIA's (/usr/local/cuda) SDKs.
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2, or (at your option)
# any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
# 02110-1301, USA.
#
# As a special exception, the you may copy, distribute and modify the
# configure scripts that are the output of Autoconf when processing
# the Macro.  You need not follow the terms of the GNU General Public
# License when using or distributing such scripts.
#
AC_DEFUN([AX_HAVE_OPENCL],
[dnl
  AC_REQUIRE([AC_CANONICAL_HOST])dnl
  AC_ARG_ENABLE([opencl],
  [AS_HELP_STRING([--enable-opencl],
                  [use OpenCL])],
  [enable_opencl=$enableval],
  [enable_opencl='no'])
  if test x"$enable_opencl" != xno ; then
    CL_CPPFLAGS=""
    AC_CHECK_HEADERS([CL/cl.h OpenCL/cl.h], [HAVE_CL_H="yes"; break], [HAVE_CL_H="no"])
    if test x"$HAVE_CL_H" = xno ; then
      # check for AMD's SDK
      AC_MSG_CHECKING([for AMD's SDK cl.h])
      if test -d /opt/AMDAPP/include/CL ; then
        HAVE_CL_H="yes"
        AC_DEFINE([HAVE_CL_CL_H])
        CL_CPPFLAGS="-I/opt/AMDAPP/include"
      fi
      AC_MSG_RESULT([$HAVE_CL_H])
    fi
    if test x"$HAVE_CL_H" = xno ; then
      # check for NVIDIA's SDK
      AC_MSG_CHECKING([for NVIDIA's SDK cl.h])
      if test -d /usr/local/cuda/include/CL ; then
        HAVE_CL_H="yes"
        AC_DEFINE([HAVE_CL_CL_H])
        CL_CPPFLAGS="-I/usr/local/cuda/include"
      elif test -d /usr/local/cuda-6.5/include/CL ; then
        HAVE_CL_H="yes"
        AC_DEFINE([HAVE_CL_CL_H])
        CL_CPPFLAGS="-I/usr/local/cuda-6.5/include"
      elif test -d /usr/local/cuda-6.0/include/CL ; then
        HAVE_CL_H="yes"
        AC_DEFINE([HAVE_CL_CL_H])
        CL_CPPFLAGS="-I/usr/local/cuda-6.0/include"
      elif test -d /usr/local/cuda-5.5/include/CL ; then
        HAVE_CL_H="yes"
        AC_DEFINE([HAVE_CL_CL_H])
        CL_CPPFLAGS="-I/usr/local/cuda-5.5/include"
      fi
      AC_MSG_RESULT([$HAVE_CL_H])
    fi
    if test x"$HAVE_CL_H" = xno ; then
      no_cl=yes
      AC_MSG_WARN([no OpenCL headers found])
      CL_ENABLED=false
      CL_VERSION=0
    else
      #
      # First we check for macOS, since OpenCL is standard there
      #
      CL_LIBS=""
      AC_MSG_CHECKING([for OpenCL library])
      case "$host_os" in
        darwin*) # On macOS we check for installed frameworks
        AX_CHECK_FRAMEWORK([OpenCL], [
          CL_LIBS="-framework OpenCL"
          no_cl=no
          AC_MSG_RESULT(yes)
          CL_ENABLED=true
          CL_VERSION=1
        ]
        ,
        [
          no_cl=yes
          AC_MSG_RESULT(no)
          CL_ENABLED=false
          CL_VERSION=0
        ])
      ;;
      *)
        save_LIBS=$LIBS
        save_CFLAGS=$CFLAGS
        CFLAGS=$CL_CPPFLAGS
        LIBS="$save_LIBS -L/usr/lib64/nvidia -L/usr/lib/nvidia -lOpenCL"
        AC_LINK_IFELSE(
        [AC_LANG_PROGRAM([
          #ifdef HAVE_OPENCL_CL_H
            #include <OpenCL/cl.h>
          #elif defined(HAVE_CL_CL_H)
            #include <CL/cl.h>
          #endif
          #include <stddef.h>
        ],[
          clGetPlatformIDs(0, NULL, NULL);
        ])],[
          no_cl=no
          AC_MSG_RESULT(yes)
          CL_ENABLED=true
          CL_VERSION=1
          CL_LIBS="-L/usr/lib64/nvidia -L/usr/lib/nvidia -lOpenCL"
        ],[
          no_cl=yes
          AC_MSG_RESULT(no)
          CL_ENABLED=false
          CL_VERSION=0
        ])
    
        LIBS=$save_LIBS
        CFLAGS=$save_CFLAGS
      ;;
      esac
    fi
  else
    no_cl=yes
    AC_MSG_CHECKING([for OpenCL library])
    AC_MSG_RESULT(disabled)
    CL_ENABLED=false
    CL_VERSION=0
  fi
])
```

--------------------------------------------------------------------------------

---[FILE: ax_lang_compiler_ms.m4]---
Location: ImageMagick-main/m4/ax_lang_compiler_ms.m4

```text
# ===========================================================================
#    http://www.gnu.org/software/autoconf-archive/ax_lang_compiler_ms.html
# ===========================================================================
#
# OBSOLETE MACRO
#
#   Deprecated in favor of AX_COMPILER_VENDOR. A call to this macro can be
#   replaced by:
#
#     AX_COMPILER_VENDOR
#     AS_IF([test $ax_cv_c_compiler_vendor = microsoft],
#         [ax_compiler_ms=yes],[ax_compiler_ms=no])
#
# SYNOPSIS
#
#   AX_LANG_COMPILER_MS
#
# DESCRIPTION
#
#   Check whether the compiler for the current language is Microsoft.
#
#   This macro is modeled after _AC_LANG_COMPILER_GNU in the GNU Autoconf
#   implementation.
#
# LICENSE
#
#   Copyright (c) 2009 Braden McDaniel <braden@endoframe.com>
#
#   Copying and distribution of this file, with or without modification, are
#   permitted in any medium without royalty provided the copyright notice
#   and this notice are preserved. This file is offered as-is, without any
#   warranty.

#serial 11

AC_DEFUN([AX_LANG_COMPILER_MS],
[AC_CACHE_CHECK([whether we are using the Microsoft _AC_LANG compiler],
                [ax_cv_[]_AC_LANG_ABBREV[]_compiler_ms],
[AC_COMPILE_IFELSE([AC_LANG_PROGRAM([], [[#ifndef _MSC_VER
       choke me
#endif
]])],
                   [ax_compiler_ms=yes],
                   [ax_compiler_ms=no])
ax_cv_[]_AC_LANG_ABBREV[]_compiler_ms=$ax_compiler_ms
])])
```

--------------------------------------------------------------------------------

---[FILE: ax_prefix_config_h.m4]---
Location: ImageMagick-main/m4/ax_prefix_config_h.m4

```text
# ===========================================================================
#    https://www.gnu.org/software/autoconf-archive/ax_prefix_config_h.html
# ===========================================================================
#
# SYNOPSIS
#
#   AX_PREFIX_CONFIG_H [(OUTPUT-HEADER [,PREFIX [,ORIG-HEADER]])]
#
# DESCRIPTION
#
#   Generate an installable config.h.
#
#   A package should not normally install its config.h as a system header,
#   but if it must, this macro can be used to avoid namespace pollution by
#   making a copy of config.h with a prefix added to all the macro names.
#
#   Each "#define SOMEDEF" line of the configuration header has the given
#   prefix added, in the same case as the first character of the macro name.
#
#   Defaults:
#
#     OUTPUT-HEADER = $PACKAGE-config.h
#     PREFIX = $PACKAGE
#     ORIG-HEADER, from AM_CONFIG_HEADER(config.h)
#
#   Your configure.ac script should contain both macros in this order.
#
#   Example:
#
#     AC_INIT(config.h.in)        # config.h.in as created by "autoheader"
#     AM_INIT_AUTOMAKE(testpkg, 0.1.1)    # makes #undef VERSION and PACKAGE
#     AM_CONFIG_HEADER(config.h)          # prep config.h from config.h.in
#     AX_PREFIX_CONFIG_H(mylib/_config.h) # prep mylib/_config.h from it..
#     AC_MEMORY_H                         # makes "#undef NEED_MEMORY_H"
#     AC_C_CONST_H                        # makes "#undef const"
#     AC_OUTPUT(Makefile)                 # creates the "config.h" now
#                                         # and also mylib/_config.h
#
#   If the argument to AX_PREFIX_CONFIG_H would have been omitted then the
#   default output file would have been called simply "testpkg-config.h",
#   but even under the name "mylib/_config.h" it contains prefix-defines
#   like
#
#     #ifndef TESTPKG_VERSION
#     #define TESTPKG_VERSION "0.1.1"
#     #endif
#     #ifndef TESTPKG_NEED_MEMORY_H
#     #define TESTPKG_NEED_MEMORY_H 1
#     #endif
#     #ifndef _testpkg_const
#     #define _testpkg_const _const
#     #endif
#
#   and this "mylib/_config.h" can be installed along with other header
#   files, which is most convenient when creating a shared library (that has
#   some headers) whose functionality depends on features detected at
#   compile-time. No need to invent some "mylib-confdefs.h.in" manually.
#
#   Note that some AC_DEFINEs that end up in the config.h file are actually
#   self-referential - e.g. AC_C_INLINE, AC_C_CONST, and the AC_TYPE_OFF_T
#   say that they "will define inline|const|off_t if the system does not do
#   it by itself". You might want to clean up about these - consider an
#   extra mylib/conf.h that reads something like:
#
#     #include <mylib/_config.h>
#     #ifndef _testpkg_const
#     #define _testpkg_const const
#     #endif
#
#   and then start using _testpkg_const in the header files. That is also a
#   good thing to differentiate whether some library-user has starting to
#   take up with a different compiler, so perhaps it could read something
#   like this:
#
#     #ifdef _MSC_VER
#     #include <mylib/_msvc.h>
#     #else
#     #include <mylib/_config.h>
#     #endif
#     #ifndef _testpkg_const
#     #define _testpkg_const const
#     #endif
#
# LICENSE
#
#   Copyright (c) 2014 Reuben Thomas <rrt@sc3d.org>
#   Copyright (c) 2008 Guido U. Draheim <guidod@gmx.de>
#   Copyright (c) 2008 Marten Svantesson
#   Copyright (c) 2008 Gerald Point <Gerald.Point@labri.fr>
#
#   This program is free software; you can redistribute it and/or modify it
#   under the terms of the GNU General Public License as published by the
#   Free Software Foundation; either version 3 of the License, or (at your
#   option) any later version.
#
#   This program is distributed in the hope that it will be useful, but
#   WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
#   Public License for more details.
#
#   You should have received a copy of the GNU General Public License along
#   with this program. If not, see <https://www.gnu.org/licenses/>.
#
#   As a special exception, the respective Autoconf Macro's copyright owner
#   gives unlimited permission to copy, distribute and modify the configure
#   scripts that are the output of Autoconf when processing the Macro. You
#   need not follow the terms of the GNU General Public License when using
#   or distributing such scripts, even though portions of the text of the
#   Macro appear in them. The GNU General Public License (GPL) does govern
#   all other use of the material that constitutes the Autoconf Macro.
#
#   This special exception to the GPL applies to versions of the Autoconf
#   Macro released by the Autoconf Archive. When you make and distribute a
#   modified version of the Autoconf Macro, you may extend this special
#   exception to the GPL to apply to your modified version as well.

#serial 16

AC_DEFUN([AX_PREFIX_CONFIG_H],[dnl
AC_PREREQ([2.62])
AC_BEFORE([AC_CONFIG_HEADERS],[$0])dnl
AC_CONFIG_COMMANDS(m4_default([$1], [$PACKAGE-config.h]),[dnl
AS_VAR_PUSHDEF([_OUT],[ac_prefix_conf_OUT])dnl
AS_VAR_PUSHDEF([_DEF],[ac_prefix_conf_DEF])dnl
AS_VAR_PUSHDEF([_PKG],[ac_prefix_conf_PKG])dnl
AS_VAR_PUSHDEF([_LOW],[ac_prefix_conf_LOW])dnl
AS_VAR_PUSHDEF([_UPP],[ac_prefix_conf_UPP])dnl
AS_VAR_PUSHDEF([_INP],[ac_prefix_conf_INP])dnl
m4_pushdef([_script],[conftest.prefix])dnl
m4_pushdef([_symbol],[m4_cr_Letters[]m4_cr_digits[]_])dnl
_OUT=`echo m4_default([$1], [$PACKAGE-config.h])`
_DEF=`echo _$_OUT | sed -e "y:m4_cr_letters:m4_cr_LETTERS[]:" -e "s/@<:@^m4_cr_Letters@:>@/_/g"`
_PKG=`echo m4_default([$2], [$PACKAGE])`
_LOW=`echo _$_PKG | sed -e "y:m4_cr_LETTERS-:m4_cr_letters[]_:"`
_UPP=`echo $_PKG | sed -e "y:m4_cr_letters-:m4_cr_LETTERS[]_:"  -e "/^@<:@m4_cr_digits@:>@/s/^/_/"`
_INP=`echo "$3" | sed -e 's/ *//'`
if test ".$_INP" = "."; then
   for ac_file in : $CONFIG_HEADERS; do test "_$ac_file" = _: && continue
     case "$ac_file" in
        *.h) _INP=$ac_file ;;
        *)
     esac
     test ".$_INP" != "." && break
   done
fi
if test ".$_INP" = "."; then
   case "$_OUT" in
      */*) _INP=`basename "$_OUT"`
      ;;
      *-*) _INP=`echo "$_OUT" | sed -e "s/@<:@_symbol@:>@*-//"`
      ;;
      *) _INP=config.h
      ;;
   esac
fi
if test -z "$_PKG" ; then
   AC_MSG_ERROR([no prefix for _PREFIX_PKG_CONFIG_H])
else
  if test ! -f "$_INP" ; then if test -f "$srcdir/$_INP" ; then
     _INP="$srcdir/$_INP"
  fi fi
  AC_MSG_NOTICE(creating $_OUT - prefix $_UPP for $_INP defines)
  if test -f $_INP ; then
    AS_ECHO(["s/^@%:@undef  *\\(@<:@m4_cr_LETTERS[]_@:>@\\)/@%:@undef $_UPP""_\\1/"]) > _script
    AS_ECHO(["s/^@%:@undef  *\\(@<:@m4_cr_letters@:>@\\)/@%:@undef $_LOW""_\\1/"]) >> _script
    AS_ECHO(["s/^@%:@def[]ine  *\\(@<:@m4_cr_LETTERS[]_@:>@@<:@_symbol@:>@*\\)\\(.*\\)/@%:@ifndef $_UPP""_\\1\\"]) >> _script
    AS_ECHO(["@%:@def[]ine $_UPP""_\\1\\2\\"]) >> _script
    AS_ECHO(["@%:@endif/"]) >> _script
    AS_ECHO(["s/^@%:@def[]ine  *\\(@<:@m4_cr_letters@:>@@<:@_symbol@:>@*\\)\\(.*\\)/@%:@ifndef $_LOW""_\\1\\"]) >> _script
    AS_ECHO(["@%:@define $_LOW""_\\1\\2\\"]) >> _script
    AS_ECHO(["@%:@endif/"]) >> _script
    # now executing _script on _DEF input to create _OUT output file
    echo "@%:@ifndef $_DEF"      >$tmp/pconfig.h
    echo "@%:@def[]ine $_DEF 1" >>$tmp/pconfig.h
    echo ' ' >>$tmp/pconfig.h
    echo /'*' $_OUT. Generated automatically at end of configure. '*'/ >>$tmp/pconfig.h

    sed -f _script $_INP >>$tmp/pconfig.h
    echo ' ' >>$tmp/pconfig.h
    echo '/* once:' $_DEF '*/' >>$tmp/pconfig.h
    echo "@%:@endif" >>$tmp/pconfig.h
    if cmp -s $_OUT $tmp/pconfig.h 2>/dev/null; then
      AC_MSG_NOTICE([$_OUT is unchanged])
    else
      ac_dir=`AS_DIRNAME(["$_OUT"])`
      AS_MKDIR_P(["$ac_dir"])
      rm -f "$_OUT"
      mv $tmp/pconfig.h "$_OUT"
    fi
  else
    AC_MSG_ERROR([input file $_INP does not exist - skip generating $_OUT])
  fi
  rm -f conftest.*
fi
m4_popdef([_symbol])dnl
m4_popdef([_script])dnl
AS_VAR_POPDEF([_INP])dnl
AS_VAR_POPDEF([_UPP])dnl
AS_VAR_POPDEF([_LOW])dnl
AS_VAR_POPDEF([_PKG])dnl
AS_VAR_POPDEF([_DEF])dnl
AS_VAR_POPDEF([_OUT])dnl
],[PACKAGE="$PACKAGE"])])
```

--------------------------------------------------------------------------------

---[FILE: ax_prepend_flag.m4]---
Location: ImageMagick-main/m4/ax_prepend_flag.m4

```text
# ===========================================================================
#     https://www.gnu.org/software/autoconf-archive/ax_prepend_flag.html
# ===========================================================================
#
# SYNOPSIS
#
#   AX_PREPEND_FLAG(FLAG, [FLAGS-VARIABLE])
#
# DESCRIPTION
#
#   FLAG is added to the front of the FLAGS-VARIABLE shell variable, with a
#   space added in between.
#
#   If FLAGS-VARIABLE is not specified, the current language's flags (e.g.
#   CFLAGS) is used.  FLAGS-VARIABLE is not changed if it already contains
#   FLAG.  If FLAGS-VARIABLE is unset in the shell, it is set to exactly
#   FLAG.
#
#   NOTE: Implementation based on AX_APPEND_FLAG.
#
# LICENSE
#
#   Copyright (c) 2008 Guido U. Draheim <guidod@gmx.de>
#   Copyright (c) 2011 Maarten Bosmans <mkbosmans@gmail.com>
#   Copyright (c) 2018 John Zaitseff <J.Zaitseff@zap.org.au>
#
#   Copying and distribution of this file, with or without modification, are
#   permitted in any medium without royalty provided the copyright notice
#   and this notice are preserved.  This file is offered as-is, without any
#   warranty.

#serial 2

AC_DEFUN([AX_PREPEND_FLAG],
[dnl
AC_PREREQ(2.64)dnl for _AC_LANG_PREFIX and AS_VAR_SET_IF
AS_VAR_PUSHDEF([FLAGS], [m4_default($2,_AC_LANG_PREFIX[FLAGS])])
AS_VAR_SET_IF(FLAGS,[
  AS_CASE([" AS_VAR_GET(FLAGS) "],
    [*" $1 "*], [AC_RUN_LOG([: FLAGS already contains $1])],
    [
     FLAGS="$1 $FLAGS"
     AC_RUN_LOG([: FLAGS="$FLAGS"])
    ])
  ],
  [
  AS_VAR_SET(FLAGS,[$1])
  AC_RUN_LOG([: FLAGS="$FLAGS"])
  ])
AS_VAR_POPDEF([FLAGS])dnl
])dnl AX_PREPEND_FLAG
```

--------------------------------------------------------------------------------

---[FILE: ax_prog_perl_version.m4]---
Location: ImageMagick-main/m4/ax_prog_perl_version.m4

```text
# ===========================================================================
#   https://www.gnu.org/software/autoconf-archive/ax_prog_perl_version.html
# ===========================================================================
#
# SYNOPSIS
#
#   AX_PROG_PERL_VERSION([VERSION],[ACTION-IF-TRUE],[ACTION-IF-FALSE])
#
# DESCRIPTION
#
#   Makes sure that perl supports the version indicated. If true the shell
#   commands in ACTION-IF-TRUE are executed. If not the shell commands in
#   ACTION-IF-FALSE are run. Note if $PERL is not set (for example by
#   running AC_CHECK_PROG or AC_PATH_PROG) the macro will fail.
#
#   Example:
#
#     AC_PATH_PROG([PERL],[perl])
#     AX_PROG_PERL_VERSION([5.8.0],[ ... ],[ ... ])
#
#   This will check to make sure that the perl you have supports at least
#   version 5.8.0.
#
#   NOTE: This macro uses the $PERL variable to perform the check.
#   AX_WITH_PERL can be used to set that variable prior to running this
#   macro. The $PERL_VERSION variable will be valorized with the detected
#   version.
#
# LICENSE
#
#   Copyright (c) 2009 Francesco Salvestrini <salvestrini@users.sourceforge.net>
#
#   Copying and distribution of this file, with or without modification, are
#   permitted in any medium without royalty provided the copyright notice
#   and this notice are preserved. This file is offered as-is, without any
#   warranty.

#serial 13

AC_DEFUN([AX_PROG_PERL_VERSION],[
    AC_REQUIRE([AC_PROG_SED])
    AC_REQUIRE([AC_PROG_GREP])

    AS_IF([test -n "$PERL"],[
        ax_perl_version="$1"

        AC_MSG_CHECKING([for perl version])
        changequote(<<,>>)
        perl_version=`$PERL --version 2>&1 \
          | $SED -n -e '/This is perl/b inspect
b
: inspect
s/.* (\{0,1\}v\([0-9]*\.[0-9]*\.[0-9]*\))\{0,1\} .*/\1/;p'`
        changequote([,])
        AC_MSG_RESULT($perl_version)

	AC_SUBST([PERL_VERSION],[$perl_version])

        AX_COMPARE_VERSION([$ax_perl_version],[le],[$perl_version],[
	    :
            $2
        ],[
	    :
            $3
        ])
    ],[
        AC_MSG_WARN([could not find the perl interpreter])
        $3
    ])
])
```

--------------------------------------------------------------------------------

````

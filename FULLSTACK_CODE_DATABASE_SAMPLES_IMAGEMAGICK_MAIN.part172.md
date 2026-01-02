---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 172
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 172 of 851)

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

---[FILE: ax_pthread.m4]---
Location: ImageMagick-main/m4/ax_pthread.m4

```text
# ===========================================================================
#        https://www.gnu.org/software/autoconf-archive/ax_pthread.html
# ===========================================================================
#
# SYNOPSIS
#
#   AX_PTHREAD([ACTION-IF-FOUND[, ACTION-IF-NOT-FOUND]])
#
# DESCRIPTION
#
#   This macro figures out how to build C programs using POSIX threads. It
#   sets the PTHREAD_LIBS output variable to the threads library and linker
#   flags, and the PTHREAD_CFLAGS output variable to any special C compiler
#   flags that are needed. (The user can also force certain compiler
#   flags/libs to be tested by setting these environment variables.)
#
#   Also sets PTHREAD_CC and PTHREAD_CXX to any special C compiler that is
#   needed for multi-threaded programs (defaults to the value of CC
#   respectively CXX otherwise). (This is necessary on e.g. AIX to use the
#   special cc_r/CC_r compiler alias.)
#
#   NOTE: You are assumed to not only compile your program with these flags,
#   but also to link with them as well. For example, you might link with
#   $PTHREAD_CC $CFLAGS $PTHREAD_CFLAGS $LDFLAGS ... $PTHREAD_LIBS $LIBS
#   $PTHREAD_CXX $CXXFLAGS $PTHREAD_CFLAGS $LDFLAGS ... $PTHREAD_LIBS $LIBS
#
#   If you are only building threaded programs, you may wish to use these
#   variables in your default LIBS, CFLAGS, and CC:
#
#     LIBS="$PTHREAD_LIBS $LIBS"
#     CFLAGS="$CFLAGS $PTHREAD_CFLAGS"
#     CXXFLAGS="$CXXFLAGS $PTHREAD_CFLAGS"
#     CC="$PTHREAD_CC"
#     CXX="$PTHREAD_CXX"
#
#   In addition, if the PTHREAD_CREATE_JOINABLE thread-attribute constant
#   has a nonstandard name, this macro defines PTHREAD_CREATE_JOINABLE to
#   that name (e.g. PTHREAD_CREATE_UNDETACHED on AIX).
#
#   Also HAVE_PTHREAD_PRIO_INHERIT is defined if pthread is found and the
#   PTHREAD_PRIO_INHERIT symbol is defined when compiling with
#   PTHREAD_CFLAGS.
#
#   ACTION-IF-FOUND is a list of shell commands to run if a threads library
#   is found, and ACTION-IF-NOT-FOUND is a list of commands to run it if it
#   is not found. If ACTION-IF-FOUND is not specified, the default action
#   will define HAVE_PTHREAD.
#
#   Please let the authors know if this macro fails on any platform, or if
#   you have any other suggestions or comments. This macro was based on work
#   by SGJ on autoconf scripts for FFTW (http://www.fftw.org/) (with help
#   from M. Frigo), as well as ac_pthread and hb_pthread macros posted by
#   Alejandro Forero Cuervo to the autoconf macro repository. We are also
#   grateful for the helpful feedback of numerous users.
#
#   Updated for Autoconf 2.68 by Daniel Richard G.
#
# LICENSE
#
#   Copyright (c) 2008 Steven G. Johnson <stevenj@alum.mit.edu>
#   Copyright (c) 2011 Daniel Richard G. <skunk@iSKUNK.ORG>
#   Copyright (c) 2019 Marc Stevens <marc.stevens@cwi.nl>
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

#serial 31

AU_ALIAS([ACX_PTHREAD], [AX_PTHREAD])
AC_DEFUN([AX_PTHREAD], [
AC_REQUIRE([AC_CANONICAL_HOST])
AC_REQUIRE([AC_PROG_CC])
AC_REQUIRE([AC_PROG_SED])
AC_LANG_PUSH([C])
ax_pthread_ok=no

# We used to check for pthread.h first, but this fails if pthread.h
# requires special compiler flags (e.g. on Tru64 or Sequent).
# It gets checked for in the link test anyway.

# First of all, check if the user has set any of the PTHREAD_LIBS,
# etcetera environment variables, and if threads linking works using
# them:
if test "x$PTHREAD_CFLAGS$PTHREAD_LIBS" != "x"; then
        ax_pthread_save_CC="$CC"
        ax_pthread_save_CFLAGS="$CFLAGS"
        ax_pthread_save_LIBS="$LIBS"
        AS_IF([test "x$PTHREAD_CC" != "x"], [CC="$PTHREAD_CC"])
        AS_IF([test "x$PTHREAD_CXX" != "x"], [CXX="$PTHREAD_CXX"])
        CFLAGS="$CFLAGS $PTHREAD_CFLAGS"
        LIBS="$PTHREAD_LIBS $LIBS"
        AC_MSG_CHECKING([for pthread_join using $CC $PTHREAD_CFLAGS $PTHREAD_LIBS])
        AC_LINK_IFELSE([AC_LANG_CALL([], [pthread_join])], [ax_pthread_ok=yes])
        AC_MSG_RESULT([$ax_pthread_ok])
        if test "x$ax_pthread_ok" = "xno"; then
                PTHREAD_LIBS=""
                PTHREAD_CFLAGS=""
        fi
        CC="$ax_pthread_save_CC"
        CFLAGS="$ax_pthread_save_CFLAGS"
        LIBS="$ax_pthread_save_LIBS"
fi

# We must check for the threads library under a number of different
# names; the ordering is very important because some systems
# (e.g. DEC) have both -lpthread and -lpthreads, where one of the
# libraries is broken (non-POSIX).

# Create a list of thread flags to try. Items with a "," contain both
# C compiler flags (before ",") and linker flags (after ","). Other items
# starting with a "-" are C compiler flags, and remaining items are
# library names, except for "none" which indicates that we try without
# any flags at all, and "pthread-config" which is a program returning
# the flags for the Pth emulation library.

ax_pthread_flags="pthreads none -Kthread -pthread -pthreads -mthreads pthread --thread-safe -mt pthread-config"

# The ordering *is* (sometimes) important.  Some notes on the
# individual items follow:

# pthreads: AIX (must check this before -lpthread)
# none: in case threads are in libc; should be tried before -Kthread and
#       other compiler flags to prevent continual compiler warnings
# -Kthread: Sequent (threads in libc, but -Kthread needed for pthread.h)
# -pthread: Linux/gcc (kernel threads), BSD/gcc (userland threads), Tru64
#           (Note: HP C rejects this with "bad form for `-t' option")
# -pthreads: Solaris/gcc (Note: HP C also rejects)
# -mt: Sun Workshop C (may only link SunOS threads [-lthread], but it
#      doesn't hurt to check since this sometimes defines pthreads and
#      -D_REENTRANT too), HP C (must be checked before -lpthread, which
#      is present but should not be used directly; and before -mthreads,
#      because the compiler interprets this as "-mt" + "-hreads")
# -mthreads: Mingw32/gcc, Lynx/gcc
# pthread: Linux, etcetera
# --thread-safe: KAI C++
# pthread-config: use pthread-config program (for GNU Pth library)

case $host_os in

        freebsd*)

        # -kthread: FreeBSD kernel threads (preferred to -pthread since SMP-able)
        # lthread: LinuxThreads port on FreeBSD (also preferred to -pthread)

        ax_pthread_flags="-kthread lthread $ax_pthread_flags"
        ;;

        hpux*)

        # From the cc(1) man page: "[-mt] Sets various -D flags to enable
        # multi-threading and also sets -lpthread."

        ax_pthread_flags="-mt -pthread pthread $ax_pthread_flags"
        ;;

        openedition*)

        # IBM z/OS requires a feature-test macro to be defined in order to
        # enable POSIX threads at all, so give the user a hint if this is
        # not set. (We don't define these ourselves, as they can affect
        # other portions of the system API in unpredictable ways.)

        AC_EGREP_CPP([AX_PTHREAD_ZOS_MISSING],
            [
#            if !defined(_OPEN_THREADS) && !defined(_UNIX03_THREADS)
             AX_PTHREAD_ZOS_MISSING
#            endif
            ],
            [AC_MSG_WARN([IBM z/OS requires -D_OPEN_THREADS or -D_UNIX03_THREADS to enable pthreads support.])])
        ;;

        solaris*)

        # On Solaris (at least, for some versions), libc contains stubbed
        # (non-functional) versions of the pthreads routines, so link-based
        # tests will erroneously succeed. (N.B.: The stubs are missing
        # pthread_cleanup_push, or rather a function called by this macro,
        # so we could check for that, but who knows whether they'll stub
        # that too in a future libc.)  So we'll check first for the
        # standard Solaris way of linking pthreads (-mt -lpthread).

        ax_pthread_flags="-mt,-lpthread pthread $ax_pthread_flags"
        ;;
esac

# Are we compiling with Clang?

AC_CACHE_CHECK([whether $CC is Clang],
    [ax_cv_PTHREAD_CLANG],
    [ax_cv_PTHREAD_CLANG=no
     # Note that Autoconf sets GCC=yes for Clang as well as GCC
     if test "x$GCC" = "xyes"; then
        AC_EGREP_CPP([AX_PTHREAD_CC_IS_CLANG],
            [/* Note: Clang 2.7 lacks __clang_[a-z]+__ */
#            if defined(__clang__) && defined(__llvm__)
             AX_PTHREAD_CC_IS_CLANG
#            endif
            ],
            [ax_cv_PTHREAD_CLANG=yes])
     fi
    ])
ax_pthread_clang="$ax_cv_PTHREAD_CLANG"


# GCC generally uses -pthread, or -pthreads on some platforms (e.g. SPARC)

# Note that for GCC and Clang -pthread generally implies -lpthread,
# except when -nostdlib is passed.
# This is problematic using libtool to build C++ shared libraries with pthread:
# [1] https://gcc.gnu.org/bugzilla/show_bug.cgi?id=25460
# [2] https://bugzilla.redhat.com/show_bug.cgi?id=661333
# [3] https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=468555
# To solve this, first try -pthread together with -lpthread for GCC

AS_IF([test "x$GCC" = "xyes"],
      [ax_pthread_flags="-pthread,-lpthread -pthread -pthreads $ax_pthread_flags"])

# Clang takes -pthread (never supported any other flag), but we'll try with -lpthread first

AS_IF([test "x$ax_pthread_clang" = "xyes"],
      [ax_pthread_flags="-pthread,-lpthread -pthread"])


# The presence of a feature test macro requesting re-entrant function
# definitions is, on some systems, a strong hint that pthreads support is
# correctly enabled

case $host_os in
        darwin* | hpux* | linux* | osf* | solaris*)
        ax_pthread_check_macro="_REENTRANT"
        ;;

        aix*)
        ax_pthread_check_macro="_THREAD_SAFE"
        ;;

        *)
        ax_pthread_check_macro="--"
        ;;
esac
AS_IF([test "x$ax_pthread_check_macro" = "x--"],
      [ax_pthread_check_cond=0],
      [ax_pthread_check_cond="!defined($ax_pthread_check_macro)"])


if test "x$ax_pthread_ok" = "xno"; then
for ax_pthread_try_flag in $ax_pthread_flags; do

        case $ax_pthread_try_flag in
                none)
                AC_MSG_CHECKING([whether pthreads work without any flags])
                ;;

                *,*)
                PTHREAD_CFLAGS=`echo $ax_pthread_try_flag | sed "s/^\(.*\),\(.*\)$/\1/"`
                PTHREAD_LIBS=`echo $ax_pthread_try_flag | sed "s/^\(.*\),\(.*\)$/\2/"`
                AC_MSG_CHECKING([whether pthreads work with "$PTHREAD_CFLAGS" and "$PTHREAD_LIBS"])
                ;;

                -*)
                AC_MSG_CHECKING([whether pthreads work with $ax_pthread_try_flag])
                PTHREAD_CFLAGS="$ax_pthread_try_flag"
                ;;

                pthread-config)
                AC_CHECK_PROG([ax_pthread_config], [pthread-config], [yes], [no])
                AS_IF([test "x$ax_pthread_config" = "xno"], [continue])
                PTHREAD_CFLAGS="`pthread-config --cflags`"
                PTHREAD_LIBS="`pthread-config --ldflags` `pthread-config --libs`"
                ;;

                *)
                AC_MSG_CHECKING([for the pthreads library -l$ax_pthread_try_flag])
                PTHREAD_LIBS="-l$ax_pthread_try_flag"
                ;;
        esac

        ax_pthread_save_CFLAGS="$CFLAGS"
        ax_pthread_save_LIBS="$LIBS"
        CFLAGS="$CFLAGS $PTHREAD_CFLAGS"
        LIBS="$PTHREAD_LIBS $LIBS"

        # Check for various functions.  We must include pthread.h,
        # since some functions may be macros.  (On the Sequent, we
        # need a special flag -Kthread to make this header compile.)
        # We check for pthread_join because it is in -lpthread on IRIX
        # while pthread_create is in libc.  We check for pthread_attr_init
        # due to DEC craziness with -lpthreads.  We check for
        # pthread_cleanup_push because it is one of the few pthread
        # functions on Solaris that doesn't have a non-functional libc stub.
        # We try pthread_create on general principles.

        AC_LINK_IFELSE([AC_LANG_PROGRAM([#include <pthread.h>
#                       if $ax_pthread_check_cond
#                        error "$ax_pthread_check_macro must be defined"
#                       endif
                        static void *some_global = NULL;
                        static void routine(void *a)
                          {
                             /* To avoid any unused-parameter or
                                unused-but-set-parameter warning.  */
                             some_global = a;
                          }
                        static void *start_routine(void *a) { return a; }],
                       [pthread_t th; pthread_attr_t attr;
                        pthread_create(&th, 0, start_routine, 0);
                        pthread_join(th, 0);
                        pthread_attr_init(&attr);
                        pthread_cleanup_push(routine, 0);
                        pthread_cleanup_pop(0) /* ; */])],
            [ax_pthread_ok=yes],
            [])

        CFLAGS="$ax_pthread_save_CFLAGS"
        LIBS="$ax_pthread_save_LIBS"

        AC_MSG_RESULT([$ax_pthread_ok])
        AS_IF([test "x$ax_pthread_ok" = "xyes"], [break])

        PTHREAD_LIBS=""
        PTHREAD_CFLAGS=""
done
fi


# Clang needs special handling, because older versions handle the -pthread
# option in a rather... idiosyncratic way

if test "x$ax_pthread_clang" = "xyes"; then

        # Clang takes -pthread; it has never supported any other flag

        # (Note 1: This will need to be revisited if a system that Clang
        # supports has POSIX threads in a separate library.  This tends not
        # to be the way of modern systems, but it's conceivable.)

        # (Note 2: On some systems, notably Darwin, -pthread is not needed
        # to get POSIX threads support; the API is always present and
        # active.  We could reasonably leave PTHREAD_CFLAGS empty.  But
        # -pthread does define _REENTRANT, and while the Darwin headers
        # ignore this macro, third-party headers might not.)

        # However, older versions of Clang make a point of warning the user
        # that, in an invocation where only linking and no compilation is
        # taking place, the -pthread option has no effect ("argument unused
        # during compilation").  They expect -pthread to be passed in only
        # when source code is being compiled.
        #
        # Problem is, this is at odds with the way Automake and most other
        # C build frameworks function, which is that the same flags used in
        # compilation (CFLAGS) are also used in linking.  Many systems
        # supported by AX_PTHREAD require exactly this for POSIX threads
        # support, and in fact it is often not straightforward to specify a
        # flag that is used only in the compilation phase and not in
        # linking.  Such a scenario is extremely rare in practice.
        #
        # Even though use of the -pthread flag in linking would only print
        # a warning, this can be a nuisance for well-run software projects
        # that build with -Werror.  So if the active version of Clang has
        # this misfeature, we search for an option to squash it.

        AC_CACHE_CHECK([whether Clang needs flag to prevent "argument unused" warning when linking with -pthread],
            [ax_cv_PTHREAD_CLANG_NO_WARN_FLAG],
            [ax_cv_PTHREAD_CLANG_NO_WARN_FLAG=unknown
             # Create an alternate version of $ac_link that compiles and
             # links in two steps (.c -> .o, .o -> exe) instead of one
             # (.c -> exe), because the warning occurs only in the second
             # step
             ax_pthread_save_ac_link="$ac_link"
             ax_pthread_sed='s/conftest\.\$ac_ext/conftest.$ac_objext/g'
             ax_pthread_link_step=`AS_ECHO(["$ac_link"]) | sed "$ax_pthread_sed"`
             ax_pthread_2step_ac_link="($ac_compile) && (echo ==== >&5) && ($ax_pthread_link_step)"
             ax_pthread_save_CFLAGS="$CFLAGS"
             for ax_pthread_try in '' -Qunused-arguments -Wno-unused-command-line-argument unknown; do
                AS_IF([test "x$ax_pthread_try" = "xunknown"], [break])
                CFLAGS="-Werror -Wunknown-warning-option $ax_pthread_try -pthread $ax_pthread_save_CFLAGS"
                ac_link="$ax_pthread_save_ac_link"
                AC_LINK_IFELSE([AC_LANG_SOURCE([[int main(void){return 0;}]])],
                    [ac_link="$ax_pthread_2step_ac_link"
                     AC_LINK_IFELSE([AC_LANG_SOURCE([[int main(void){return 0;}]])],
                         [break])
                    ])
             done
             ac_link="$ax_pthread_save_ac_link"
             CFLAGS="$ax_pthread_save_CFLAGS"
             AS_IF([test "x$ax_pthread_try" = "x"], [ax_pthread_try=no])
             ax_cv_PTHREAD_CLANG_NO_WARN_FLAG="$ax_pthread_try"
            ])

        case "$ax_cv_PTHREAD_CLANG_NO_WARN_FLAG" in
                no | unknown) ;;
                *) PTHREAD_CFLAGS="$ax_cv_PTHREAD_CLANG_NO_WARN_FLAG $PTHREAD_CFLAGS" ;;
        esac

fi # $ax_pthread_clang = yes



# Various other checks:
if test "x$ax_pthread_ok" = "xyes"; then
        ax_pthread_save_CFLAGS="$CFLAGS"
        ax_pthread_save_LIBS="$LIBS"
        CFLAGS="$CFLAGS $PTHREAD_CFLAGS"
        LIBS="$PTHREAD_LIBS $LIBS"

        # Detect AIX lossage: JOINABLE attribute is called UNDETACHED.
        AC_CACHE_CHECK([for joinable pthread attribute],
            [ax_cv_PTHREAD_JOINABLE_ATTR],
            [ax_cv_PTHREAD_JOINABLE_ATTR=unknown
             for ax_pthread_attr in PTHREAD_CREATE_JOINABLE PTHREAD_CREATE_UNDETACHED; do
                 AC_LINK_IFELSE([AC_LANG_PROGRAM([#include <pthread.h>],
                                                 [int attr = $ax_pthread_attr; return attr /* ; */])],
                                [ax_cv_PTHREAD_JOINABLE_ATTR=$ax_pthread_attr; break],
                                [])
             done
            ])
        AS_IF([test "x$ax_cv_PTHREAD_JOINABLE_ATTR" != "xunknown" && \
               test "x$ax_cv_PTHREAD_JOINABLE_ATTR" != "xPTHREAD_CREATE_JOINABLE" && \
               test "x$ax_pthread_joinable_attr_defined" != "xyes"],
              [AC_DEFINE_UNQUOTED([PTHREAD_CREATE_JOINABLE],
                                  [$ax_cv_PTHREAD_JOINABLE_ATTR],
                                  [Define to necessary symbol if this constant
                                   uses a non-standard name on your system.])
               ax_pthread_joinable_attr_defined=yes
              ])

        AC_CACHE_CHECK([whether more special flags are required for pthreads],
            [ax_cv_PTHREAD_SPECIAL_FLAGS],
            [ax_cv_PTHREAD_SPECIAL_FLAGS=no
             case $host_os in
             solaris*)
             ax_cv_PTHREAD_SPECIAL_FLAGS="-D_POSIX_PTHREAD_SEMANTICS"
             ;;
             esac
            ])
        AS_IF([test "x$ax_cv_PTHREAD_SPECIAL_FLAGS" != "xno" && \
               test "x$ax_pthread_special_flags_added" != "xyes"],
              [PTHREAD_CFLAGS="$ax_cv_PTHREAD_SPECIAL_FLAGS $PTHREAD_CFLAGS"
               ax_pthread_special_flags_added=yes])

        AC_CACHE_CHECK([for PTHREAD_PRIO_INHERIT],
            [ax_cv_PTHREAD_PRIO_INHERIT],
            [AC_LINK_IFELSE([AC_LANG_PROGRAM([[#include <pthread.h>]],
                                             [[int i = PTHREAD_PRIO_INHERIT;
                                               return i;]])],
                            [ax_cv_PTHREAD_PRIO_INHERIT=yes],
                            [ax_cv_PTHREAD_PRIO_INHERIT=no])
            ])
        AS_IF([test "x$ax_cv_PTHREAD_PRIO_INHERIT" = "xyes" && \
               test "x$ax_pthread_prio_inherit_defined" != "xyes"],
              [AC_DEFINE([HAVE_PTHREAD_PRIO_INHERIT], [1], [Have PTHREAD_PRIO_INHERIT.])
               ax_pthread_prio_inherit_defined=yes
              ])

        CFLAGS="$ax_pthread_save_CFLAGS"
        LIBS="$ax_pthread_save_LIBS"

        # More AIX lossage: compile with *_r variant
        if test "x$GCC" != "xyes"; then
            case $host_os in
                aix*)
                AS_CASE(["x/$CC"],
                    [x*/c89|x*/c89_128|x*/c99|x*/c99_128|x*/cc|x*/cc128|x*/xlc|x*/xlc_v6|x*/xlc128|x*/xlc128_v6],
                    [#handle absolute path differently from PATH based program lookup
                     AS_CASE(["x$CC"],
                         [x/*],
                         [
			   AS_IF([AS_EXECUTABLE_P([${CC}_r])],[PTHREAD_CC="${CC}_r"])
			   AS_IF([test "x${CXX}" != "x"], [AS_IF([AS_EXECUTABLE_P([${CXX}_r])],[PTHREAD_CXX="${CXX}_r"])])
			 ],
                         [
			   AC_CHECK_PROGS([PTHREAD_CC],[${CC}_r],[$CC])
			   AS_IF([test "x${CXX}" != "x"], [AC_CHECK_PROGS([PTHREAD_CXX],[${CXX}_r],[$CXX])])
			 ]
                     )
                    ])
                ;;
            esac
        fi
fi

test -n "$PTHREAD_CC" || PTHREAD_CC="$CC"
test -n "$PTHREAD_CXX" || PTHREAD_CXX="$CXX"

AC_SUBST([PTHREAD_LIBS])
AC_SUBST([PTHREAD_CFLAGS])
AC_SUBST([PTHREAD_CC])
AC_SUBST([PTHREAD_CXX])

# Finally, execute ACTION-IF-FOUND/ACTION-IF-NOT-FOUND:
if test "x$ax_pthread_ok" = "xyes"; then
        ifelse([$1],,[AC_DEFINE([HAVE_PTHREAD],[1],[Define if you have POSIX threads libraries and header files.])],[$1])
        :
else
        ax_pthread_ok=no
        $2
fi
AC_LANG_POP
])dnl AX_PTHREAD
```

--------------------------------------------------------------------------------

---[FILE: ax_require_defined.m4]---
Location: ImageMagick-main/m4/ax_require_defined.m4

```text
# ===========================================================================
#    https://www.gnu.org/software/autoconf-archive/ax_require_defined.html
# ===========================================================================
#
# SYNOPSIS
#
#   AX_REQUIRE_DEFINED(MACRO)
#
# DESCRIPTION
#
#   AX_REQUIRE_DEFINED is a simple helper for making sure other macros have
#   been defined and thus are available for use.  This avoids random issues
#   where a macro isn't expanded.  Instead the configure script emits a
#   non-fatal:
#
#     ./configure: line 1673: AX_CFLAGS_WARN_ALL: command not found
#
#   It's like AC_REQUIRE except it doesn't expand the required macro.
#
#   Here's an example:
#
#     AX_REQUIRE_DEFINED([AX_CHECK_LINK_FLAG])
#
# LICENSE
#
#   Copyright (c) 2014 Mike Frysinger <vapier@gentoo.org>
#
#   Copying and distribution of this file, with or without modification, are
#   permitted in any medium without royalty provided the copyright notice
#   and this notice are preserved. This file is offered as-is, without any
#   warranty.

#serial 2

AC_DEFUN([AX_REQUIRE_DEFINED], [dnl
  m4_ifndef([$1], [m4_fatal([macro ]$1[ is not defined; is a m4 file missing?])])
])dnl AX_REQUIRE_DEFINED
```

--------------------------------------------------------------------------------

---[FILE: cxx_have_std_libs.m4]---
Location: ImageMagick-main/m4/cxx_have_std_libs.m4

```text
dnl @synopsis AC_CXX_HAVE_STD_LIBS
dnl
dnl If the compiler supports ISO C++ standard library (i.e., can
dnl include the files iostream, map, iomanip and cmath}), define
dnl HAVE_STD_LIBS.
dnl
dnl @category Cxx
dnl @author Todd Veldhuizen
dnl @author Luc Maisonobe <luc@spaceroots.org>
dnl @version 2004-02-04
dnl @license AllPermissive

AC_DEFUN([AC_CXX_HAVE_STD_LIBS],
[AC_CACHE_CHECK(whether the compiler supports ISO C++ standard library,
ac_cv_cxx_have_std_libs,
[AC_REQUIRE([AX_CXX_NAMESPACES])
 AC_LANG_SAVE
 AC_LANG_CPLUSPLUS
 AC_TRY_COMPILE([#include <iostream>
#include <map>
#include <iomanip>
#include <cmath>
#ifdef HAVE_NAMESPACES
using namespace std;
#endif],[return 0;],
 ac_cv_cxx_have_std_libs=yes, ac_cv_cxx_have_std_libs=no)
 AC_LANG_RESTORE
])
if test "$ac_cv_cxx_have_std_libs" = yes; then
  AC_DEFINE(HAVE_STD_LIBS,,[define if the compiler supports ISO C++ standard library])
fi
])
```

--------------------------------------------------------------------------------

---[FILE: framework.m4]---
Location: ImageMagick-main/m4/framework.m4

```text
#  http://svn.saurik.com/repos/cycript/trunk/framework.m4
#
#                    GNU LESSER GENERAL PUBLIC LICENSE
#                        Version 3, 29 June 2007
# 
#  Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
#  Everyone is permitted to copy and distribute verbatim copies
#  of this license document, but changing it is not allowed.
# 
# 
#   This version of the GNU Lesser General Public License incorporates
# the terms and conditions of version 3 of the GNU General Public
# License, supplemented by the additional permissions listed below.
# 
#   0. Additional Definitions.
# 
#   As used herein, "this License" refers to version 3 of the GNU Lesser
# General Public License, and the "GNU GPL" refers to version 3 of the GNU
# General Public License.
# 
#   "The Library" refers to a covered work governed by this License,
# other than an Application or a Combined Work as defined below.
# 
#   An "Application" is any work that makes use of an interface provided
# by the Library, but which is not otherwise based on the Library.
# Defining a subclass of a class defined by the Library is deemed a mode
# of using an interface provided by the Library.
# 
#   A "Combined Work" is a work produced by combining or linking an
# Application with the Library.  The particular version of the Library
# with which the Combined Work was made is also called the "Linked
# Version".
# 
#   The "Minimal Corresponding Source" for a Combined Work means the
# Corresponding Source for the Combined Work, excluding any source code
# for portions of the Combined Work that, considered in isolation, are
# based on the Application, and not on the Linked Version.
# 
#   The "Corresponding Application Code" for a Combined Work means the
# object code and/or source code for the Application, including any data
# and utility programs needed for reproducing the Combined Work from the
# Application, but excluding the System Libraries of the Combined Work.
# 
#   1. Exception to Section 3 of the GNU GPL.
# 
#   You may convey a covered work under sections 3 and 4 of this License
# without being bound by section 3 of the GNU GPL.
# 
#   2. Conveying Modified Versions.
# 
#   If you modify a copy of the Library, and, in your modifications, a
# facility refers to a function or data to be supplied by an Application
# that uses the facility (other than as an argument passed when the
# facility is invoked), then you may convey a copy of the modified
# version:
# 
#    a) under this License, provided that you make a good faith effort to
#    ensure that, in the event an Application does not supply the
#    function or data, the facility still operates, and performs
#    whatever part of its purpose remains meaningful, or
# 
#    b) under the GNU GPL, with none of the additional permissions of
#    this License applicable to that copy.
# 
#   3. Object Code Incorporating Material from Library Header Files.
# 
#   The object code form of an Application may incorporate material from
# a header file that is part of the Library.  You may convey such object
# code under terms of your choice, provided that, if the incorporated
# material is not limited to numerical parameters, data structure
# layouts and accessors, or small macros, inline functions and templates
# (ten or fewer lines in length), you do both of the following:
# 
#    a) Give prominent notice with each copy of the object code that the
#    Library is used in it and that the Library and its use are
#    covered by this License.
# 
#    b) Accompany the object code with a copy of the GNU GPL and this license
#    document.
# 
#   4. Combined Works.
# 
#   You may convey a Combined Work under terms of your choice that,
# taken together, effectively do not restrict modification of the
# portions of the Library contained in the Combined Work and reverse
# engineering for debugging such modifications, if you also do each of
# the following:
# 
#    a) Give prominent notice with each copy of the Combined Work that
#    the Library is used in it and that the Library and its use are
#    covered by this License.
# 
#    b) Accompany the Combined Work with a copy of the GNU GPL and this license
#    document.
# 
#    c) For a Combined Work that displays copyright notices during
#    execution, include the copyright notice for the Library among
#    these notices, as well as a reference directing the user to the
#    copies of the GNU GPL and this license document.
# 
#    d) Do one of the following:
# 
#        0) Convey the Minimal Corresponding Source under the terms of this
#        License, and the Corresponding Application Code in a form
#        suitable for, and under terms that permit, the user to
#        recombine or relink the Application with a modified version of
#        the Linked Version to produce a modified Combined Work, in the
#        manner specified by section 6 of the GNU GPL for conveying
#        Corresponding Source.
# 
#        1) Use a suitable shared library mechanism for linking with the
#        Library.  A suitable mechanism is one that (a) uses at run time
#        a copy of the Library already present on the user's computer
#        system, and (b) will operate properly with a modified version
#        of the Library that is interface-compatible with the Linked
#        Version.
# 
#    e) Provide Installation Information, but only if you would otherwise
#    be required to provide such information under section 6 of the
#    GNU GPL, and only to the extent that such information is
#    necessary to install and execute a modified version of the
#    Combined Work produced by recombining or relinking the
#    Application with a modified version of the Linked Version. (If
#    you use option 4d0, the Installation Information must accompany
#    the Minimal Corresponding Source and Corresponding Application
#    Code. If you use option 4d1, you must provide the Installation
#    Information in the manner specified by section 6 of the GNU GPL
#    for conveying Corresponding Source.)
# 
#   5. Combined Libraries.
# 
#   You may place library facilities that are a work based on the
# Library side by side in a single library together with other library
# facilities that are not Applications and are not covered by this
# License, and convey such a combined library under terms of your
# choice, if you do both of the following:
# 
#    a) Accompany the combined library with a copy of the same work based
#    on the Library, uncombined with any other library facilities,
#    conveyed under the terms of this License.
# 
#    b) Give prominent notice with the combined library that part of it
#    is a work based on the Library, and explaining where to find the
#    accompanying uncombined form of the same work.
# 
#   6. Revised Versions of the GNU Lesser General Public License.
# 
#   The Free Software Foundation may publish revised and/or new versions
# of the GNU Lesser General Public License from time to time. Such new
# versions will be similar in spirit to the present version, but may
# differ in detail to address new problems or concerns.
# 
#   Each version is given a distinguishing version number. If the
# Library as you received it specifies that a certain numbered version
# of the GNU Lesser General Public License "or any later version"
# applies to it, you have the option of following the terms and
# conditions either of that published version or of any later version
# published by the Free Software Foundation. If the Library as you
# received it does not specify a version number of the GNU Lesser
# General Public License, you may choose any version of the GNU Lesser
# General Public License ever published by the Free Software Foundation.
# 
#   If the Library as you received it specifies that a proxy can decide
# whether future versions of the GNU Lesser General Public License shall
# apply, that proxy's public statement of acceptance of any version is
# permanent authorization for you to choose that version for the
# Library.

# AC_CHECK_FRAMEWORK(FRAMEWORK, FUNCTION,
#              [ACTION-IF-FOUND], [ACTION-IF-NOT-FOUND],
#              [OTHER-LIBRARIES])
# ------------------------------------------------------
#
# Use a cache variable name containing both the framework and function name,
# because the test really is for framework $1 defining function $2, not
# just for framework $1.  Separate tests with the same $1 and different $2s
# may have different results.
#
# Note that using directly AS_VAR_PUSHDEF([ac_Framework], [ac_cv_framework_$1_$2])
# is asking for troubles, since AC_CHECK_FRAMEWORK($framework, fun) would give
# ac_cv_framework_$framework_fun, which is definitely not what was meant.  Hence
# the AS_LITERAL_IF indirection.
#
# FIXME: This macro is extremely suspicious.  It DEFINEs unconditionally,
# whatever the FUNCTION, in addition to not being a *S macro.  Note
# that the cache does depend upon the function we are looking for.
#
# It is on purpose we used `ac_check_framework_save_LIBS' and not just
# `ac_save_LIBS': there are many macros which don't want to see `LIBS'
# changed but still want to use AC_CHECK_FRAMEWORK, so they save `LIBS'.
# And ``ac_save_LIBS' is too tempting a name, so let's leave them some
# freedom.
AC_DEFUN([AC_CHECK_FRAMEWORK],
[m4_ifval([$3], , [AH_CHECK_FRAMEWORK([$1])])dnl
AS_LITERAL_IF([$1],
         [AS_VAR_PUSHDEF([ac_Framework], [ac_cv_framework_$1_$2])],
         [AS_VAR_PUSHDEF([ac_Framework], [ac_cv_framework_$1''_$2])])dnl
AC_CACHE_CHECK([for $2 in $1 framework], ac_Framework,
[ac_check_framework_save_LIBS=$LIBS
LIBS="-framework $1 $5 $LIBS"
AC_LINK_IFELSE([AC_LANG_CALL([], [$2])],
          [AS_VAR_SET(ac_Framework, yes)],
          [AS_VAR_SET(ac_Framework, no)])
LIBS=$ac_check_framework_save_LIBS])
AS_IF([test AS_VAR_GET(ac_Framework) = yes],
      [m4_default([$3], [AC_DEFINE_UNQUOTED(AS_TR_CPP(HAVE_FRAMEWORK_$1))
  LIBS="-framework $1 $LIBS"
])],
      [$4])dnl
AS_VAR_POPDEF([ac_Framework])dnl
])# AC_CHECK_FRAMEWORK

# AH_CHECK_FRAMEWORK(FRAMEWORK)
# ---------------------
m4_define([AH_CHECK_FRAMEWORK],
[AH_TEMPLATE(AS_TR_CPP(HAVE_FRAMEWORK_$1),
        [Define to 1 if you have the `]$1[' framework (-framework ]$1[).])])
```

--------------------------------------------------------------------------------

---[FILE: ld-version-script.m4]---
Location: ImageMagick-main/m4/ld-version-script.m4

```text
# ld-version-script.m4 serial 4
dnl Copyright (C) 2008-2015 Free Software Foundation, Inc.
dnl This file is free software; the Free Software Foundation
dnl gives unlimited permission to copy and/or distribute it,
dnl with or without modifications, as long as this notice is preserved.

dnl From Simon Josefsson

# FIXME: The test below returns a false positive for mingw
# cross-compiles, 'local:' statements does not reduce number of
# exported symbols in a DLL.  Use --disable-ld-version-script to work
# around the problem.

# gl_LD_VERSION_SCRIPT
# --------------------
# Check if LD supports linker scripts, and define automake conditional
# HAVE_LD_VERSION_SCRIPT if so.
AC_DEFUN([gl_LD_VERSION_SCRIPT],
[
  AC_ARG_ENABLE([ld-version-script],
    [AS_HELP_STRING([--enable-ld-version-script],
       [enable linker version script (default is enabled when possible)])],
    [have_ld_version_script=$enableval],
    [AC_CACHE_CHECK([if LD -Wl,--version-script works],
       [gl_cv_sys_ld_version_script],
       [gl_cv_sys_ld_version_script=no
        save_LDFLAGS=$LDFLAGS
        LDFLAGS="$LDFLAGS -Wl,--version-script=conftest.map"
        echo foo >conftest.map
        AC_LINK_IFELSE([AC_LANG_PROGRAM([], [])],
          [],
          [cat > conftest.map <<EOF
VERS_1 {
        global: sym;
};

VERS_2 {
        global: sym;
} VERS_1;
EOF
           AC_LINK_IFELSE([AC_LANG_PROGRAM([], [])],
             [gl_cv_sys_ld_version_script=yes])])
        rm -f conftest.map
        LDFLAGS=$save_LDFLAGS])
     have_ld_version_script=$gl_cv_sys_ld_version_script])
  AM_CONDITIONAL([HAVE_LD_VERSION_SCRIPT],
    [test "$have_ld_version_script" = yes])
])
```

--------------------------------------------------------------------------------

````

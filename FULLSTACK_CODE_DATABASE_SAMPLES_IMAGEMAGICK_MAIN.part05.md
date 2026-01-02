---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 5
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 5 of 851)

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

---[FILE: ImageMagick.spec.in]---
Location: ImageMagick-main/ImageMagick.spec.in

```text
%bcond_without tests

%bcond_without libheif

%if 0%{?flatpak}
%bcond_with perl
%else
%bcond_without perl
%endif

# Disable automatic .la file removal
%global __brp_remove_la_files %nil
%global Version @PACKAGE_BASE_VERSION@
%global Patchlevel @MAGICK_PATCHLEVEL_VERSION@
%global libsover 10
%global libcxxsover 5

Name:           ImageMagick
Epoch:          1
Version:        %{Version}
Release:        %{Patchlevel}
Summary:        Use ImageMagick to create, edit, convert, and display raster image files.

License:        ImageMagick
URL:            https://imagemagick.org/
Source0:        https://imagemagick.org/archive/releases/%{name}-%{Version}-%{Patchlevel}.tar.xz

BuildRequires:  pkgconfig(bzip2)
BuildRequires:  pkgconfig(freetype2)
BuildRequires:  pkgconfig(libjpeg)
BuildRequires:  pkgconfig(libpng)
BuildRequires:  pkgconfig(libtiff-4)
BuildRequires:  giflib-devel
BuildRequires:  pkgconfig(zlib)
%if %{with perl}
BuildRequires:  perl-devel >= 5.8.1
BuildRequires:  perl-generators
%endif
%if 0%{?rhel} && 0%{?rhel} < 8
BuildRequires:  ghostscript-devel
%else
BuildRequires:  libgs-devel
%endif
BuildRequires:  pkgconfig(ddjvuapi)
BuildRequires:  pkgconfig(libwmf)
BuildRequires:  pkgconfig(jasper)
BuildRequires:  libtool-ltdl-devel
BuildRequires:  pkgconfig(x11)
BuildRequires:  pkgconfig(xext)
BuildRequires:  pkgconfig(xt)
BuildRequires:  pkgconfig(lcms2)
BuildRequires:  pkgconfig(libxml-2.0)
BuildRequires:  pkgconfig(librsvg-2.0)
%if 0%{?rhel} && 0%{?rhel} < 9
BuildRequires:  pkgconfig(IlmBase), pkgconfig(OpenEXR) < 2.5.6
%else
BuildRequires:  pkgconfig(OpenEXR)
%endif
BuildRequires:  pkgconfig(fftw3)
BuildRequires:  pkgconfig(libwebp)
BuildRequires:  jbigkit-devel
BuildRequires:  pkgconfig(libjxl)
BuildRequires:  pkgconfig(libopenjp2) >= 2.1.0
BuildRequires:  pkgconfig(libcgraph) >= 2.9.0
BuildRequires:  pkgconfig(raqm)
%if 0%{?fedora} || 0%{?rhel} > 8
BuildRequires:  pkgconfig(lqr-1)
%endif
BuildRequires:  pkgconfig(libraw) >= 0.14.8
BuildRequires:  pkgconfig(libzstd)
BuildRequires:  pkgconfig(libzip) >= 1.0.0
BuildRequires:  pkgconfig(pango) >= 1.28.1
BuildRequires:  pkgconfig(pangocairo) >= 1.28.1
BuildRequires:  urw-base35-fonts-devel
BuildRequires:  autoconf automake gcc gcc-c++
BuildRequires:  make
BuildRequires:  gnupg2
# for doc
BuildRequires:  doxygen

Requires:       %{name}-libs%{?_isa} = %{epoch}:%{version}-%{release}
# allow smooth upgrade for 3rd party repository
# providing latest version/soname as ImageMagick7
Obsoletes:      %{name}7            < %{epoch}:%{version}-%{release}
Provides:       %{name}7            = %{epoch}:%{version}-%{release}

%description
ImageMagick® is a free, open-source software suite, used for editing and manipulating digital images. It can be used to create, edit, compose, or convert bitmap images, and supports a wide range of file formats, including JPEG, PNG, GIF, TIFF, and Ultra HDR.

ImageMagick is widely used in industries such as web development, graphic design, and video editing, as well as in scientific research, medical imaging, and astronomy. Its versatile and customizable nature, along with its robust image processing capabilities, make it a popular choice for a wide range of image-related tasks.

ImageMagick includes a command-line interface for executing complex image processing tasks, as well as APIs for integrating its features into software applications. It is written in C and can be used on a variety of operating systems, including Linux, Windows, and macOS.


%package devel
Summary:        Library links and header files for ImageMagick app development
Requires:       %{name}%{?_isa} = %{epoch}:%{version}-%{release}
Requires:       %{name}-libs%{?_isa} = %{epoch}:%{version}-%{release}
Obsoletes:      %{name}7-devel       < %{epoch}:%{version}-%{release}
Provides:       %{name}7-devel       = %{epoch}:%{version}-%{release}

%description devel
ImageMagick-devel contains the library links and header files you'll need to
develop ImageMagick applications. ImageMagick is an image manipulation program.

If you want to create applications that will use ImageMagick code or APIs,
you need to install ImageMagick-devel as well as ImageMagick.  You do not
need to install it if you just want to use ImageMagick, however.


%package libs
Summary: ImageMagick libraries to link with
Obsoletes: %{name}7-libs < %{epoch}:%{version}-%{release}
Provides:  %{name}7-libs = %{epoch}:%{version}-%{release}
# These may be used for some functions
Recommends: urw-base35-fonts
# default font is OpenSans-Regular
Recommends: open-sans-fonts

%description libs
This packages contains a shared libraries to use within other applications.


%package djvu
Summary: DjVu plugin for ImageMagick
Requires: %{name}-libs%{?_isa} = %{epoch}:%{version}-%{release}
Obsoletes: %{name}7-djvu       < %{epoch}:%{version}-%{release}
Provides:  %{name}7-djvu       = %{epoch}:%{version}-%{release}

%description djvu
This packages contains a plugin for ImageMagick which makes it possible to
save and load DjvU files from ImageMagick and libMagickCore using applications.


%if %{with libheif}
%package heic
Summary: HEIC plugin for ImageMagick
BuildRequires:  pkgconfig(libheif) >= 1.4.0
%if 0%{?rhel} == 7
# ensure we use our on EL-7
Requires:       libheif%{?_isa} >= 1.4.0
%endif
Requires:       %{name}-libs%{?_isa} = %{epoch}:%{version}-%{release}

%description heic
This packages contains a plugin for ImageMagick which makes it possible to
save and load HEIC files from ImageMagick and libMagickCore using applications.
%endif


%package doc
Summary: ImageMagick html documentation
Obsoletes: %{name}7-doc < %{epoch}:%{version}-%{release}
Provides:  %{name}7-doc = %{epoch}:%{version}-%{release}

%description doc
ImageMagick documentation, this package contains usage (for the commandline
tools) and API (for the libraries) documentation in HTML format.
Note this documentation can also be found on the ImageMagick website:
https://imagemagick.org/


%if %{with perl}
%package perl
Summary:        ImageMagick perl bindings
Requires:       %{name}-libs%{?_isa} = %{epoch}:%{version}-%{release}
Obsoletes:      %{name}7-perl        < %{epoch}:%{version}-%{release}
Provides:       %{name}7-perl        = %{epoch}:%{version}-%{release}

%description perl
Perl bindings to ImageMagick.

Install ImageMagick-perl if you want to use any perl scripts that use
ImageMagick.
%endif


%package c++
Summary:        ImageMagick Magick++ library (C++ bindings)
Requires:       %{name}-libs%{?_isa} = %{epoch}:%{version}-%{release}
Obsoletes:      %{name}7-c++         < %{epoch}:%{version}-%{release}
Provides:       %{name}7-c++         = %{epoch}:%{version}-%{release}

%description c++
This package contains the Magick++ library, a C++ binding to the ImageMagick
graphics manipulation library.

Install ImageMagick-c++ if you want to use any applications that use Magick++.


%package c++-devel
Summary:        C++ bindings for the ImageMagick library
Requires:       %{name}-c++%{?_isa} = %{epoch}:%{version}-%{release}
Requires:       %{name}-devel%{?_isa} = %{epoch}:%{version}-%{release}
Obsoletes:      %{name}7-c++-devel    < %{epoch}:%{version}-%{release}
Provides:       %{name}7-c++-devel    = %{epoch}:%{version}-%{release}

%description c++-devel
ImageMagick-devel contains the static libraries and header files you'll
need to develop ImageMagick applications using the Magick++ C++ bindings.
ImageMagick is an image manipulation program.

If you want to create applications that will use Magick++ code or APIs, you'll
need to install ImageMagick-c++-devel, ImageMagick-devel and ImageMagick.
You don't need to install it if you just want to use ImageMagick, or if you
want to develop/compile applications using the ImageMagick C interface,
however.


%prep
%autosetup -p1 -n %{name}-%{Version}-%{Patchlevel}


%build
autoconf -f -i -v
# Reduce thread contention, upstream sets this flag for Linux hosts
export CFLAGS="%{optflags} -DIMPNG_SETJMP_IS_THREAD_SAFE"
%configure \
        --enable-shared \
        --disable-static \
        --with-modules \
%if %{with perl}
        --with-perl \
        --with-perl-options="INSTALLDIRS=vendor %{?perl_prefix} CC='%__cc -L$PWD/MagickCore/.libs' LDDLFLAGS='-shared -L$PWD/MagickCore/.libs'" \
%endif
        --with-x \
        --with-threads \
        --with-magick_plus_plus \
        --with-gslib \
        --with-pango \
        --with-fftw \
        --with-wmf \
        --with-webp \
        --with-openexr \
        --with-rsvg \
        --with-xml \
        --with-urw-base35-font-dir="%{urw_base35_fontpath}" \
        --without-dps \
        --enable-openmp \
        --without-gcc-arch \
        --with-jbig \
        --with-jxl \
        --with-openjp2 \
        --with-raw \
%if 0%{?fedora} || 0%{?rhel} > 8
        --with-lqr \
%endif
        --with-gvc \
        --with-raqm \
%if %{with libheif}
        --with-heic \
%endif

# Do *NOT* use %%{?_smp_mflags}, this causes PerlMagick to be silently misbuild
make
# Generate API docs
make html-local


%install
%make_install

# Compatibility symlinks for headers for IM6->IM7 transition
ln -sr %{buildroot}%{_includedir}/%{name}-7/MagickCore %{buildroot}%{_includedir}/%{name}-7/magick
ln -sr %{buildroot}%{_includedir}/%{name}-7/MagickWand %{buildroot}%{_includedir}/%{name}-7/wand

# Do NOT remove .la files for codecs
rm %{buildroot}%{_libdir}/*.la

%if %{with perl}
chmod 755 %{buildroot}%{perl_vendorarch}/auto/Image/Magick/Q16HDRI/Q16HDRI.so

# perlmagick: fix perl path of demo files
%{__perl} -MExtUtils::MakeMaker -e 'MY->fixin(@ARGV)' PerlMagick/demo/*.pl

# perlmagick: cleanup various perl tempfiles from the build which get installed
find %{buildroot} -name "*.bs" |xargs rm -f
find %{buildroot} -name ".packlist" |xargs rm -f
find %{buildroot} -name "perllocal.pod" |xargs rm -f

# perlmagick: build files list
find %{buildroot}/%{_libdir}/perl* -type f -print \
        | sed "s@^%{buildroot}@@g" > perl-pkg-files
find %{buildroot}%{perl_vendorarch} -type d -print \
        | sed "s@^%{buildroot}@%dir @g" \
        | grep -v '^%dir %{perl_vendorarch}$' \
        | grep -v '/auto$' >> perl-pkg-files
if [ -z perl-pkg-files ] ; then
        echo "ERROR: EMPTY FILE LIST"
        exit -1
fi
%endif

# fix multilib issues: Rename provided file with platform-bits in name.
# Create platform independant file inplace of provided and conditionally include required.
# $1 - filename.h to process.
function multilibFileVersions(){
mv $1 ${1%%.h}-%{__isa_bits}.h

local basename=$(basename $1)

cat >$1 <<EOF
#include <bits/wordsize.h>

#if __WORDSIZE == 32
# include "${basename%%.h}-32.h"
#elif __WORDSIZE == 64
# include "${basename%%.h}-64.h"
#else
# error "unexpected value for __WORDSIZE macro"
#endif
EOF
}

multilibFileVersions %{buildroot}%{_includedir}/%{name}-7/MagickCore/magick-config.h
multilibFileVersions %{buildroot}%{_includedir}/%{name}-7/MagickCore/magick-baseconfig.h
multilibFileVersions %{buildroot}%{_includedir}/%{name}-7/MagickCore/version.h


%check
%if %{with tests}
export LD_LIBRARY_PATH=%{buildroot}/%{_libdir}
%make_build check
%endif
rm PerlMagick/demo/Generic.ttf

%files
%doc NOTICE AUTHORS.txt
%license LICENSE
%{_bindir}/[a-z]*
%{_mandir}/man[145]/[a-z]*
%{_mandir}/man1/%{name}.*

%files libs
%doc NOTICE AUTHORS.txt
%license LICENSE
%{_libdir}/libMagickCore-7.Q16HDRI.so.%{libsover}{,.*}
%{_libdir}/libMagickWand-7.Q16HDRI.so.%{libsover}{,.*}
%{_libdir}/%{name}-%{Version}
%{_datadir}/%{name}-7
%exclude %{_libdir}/%{name}-%{Version}/modules-Q16HDRI/coders/djvu.*
%dir %{_sysconfdir}/%{name}-7
%config(noreplace) %{_sysconfdir}/%{name}-7/*.xml

%files devel
%{_bindir}/MagickCore-config
%{_bindir}/MagickWand-config
%{_libdir}/libMagickCore-7.Q16HDRI.so
%{_libdir}/libMagickWand-7.Q16HDRI.so
%{_libdir}/pkgconfig/MagickCore.pc
%{_libdir}/pkgconfig/MagickCore-7.Q16HDRI.pc
%{_libdir}/pkgconfig/ImageMagick.pc
%{_libdir}/pkgconfig/ImageMagick-7.Q16HDRI.pc
%{_libdir}/pkgconfig/MagickWand.pc
%{_libdir}/pkgconfig/MagickWand-7.Q16HDRI.pc
%dir %{_includedir}/%{name}-7
%{_includedir}/%{name}-7/MagickCore/
%{_includedir}/%{name}-7/MagickWand/
%{_includedir}/%{name}-7/magick
%{_includedir}/%{name}-7/wand
%{_mandir}/man1/MagickCore-config.*
%{_mandir}/man1/MagickWand-config.*

%files djvu
%{_libdir}/%{name}-%{Version}/modules-Q16HDRI/coders/djvu.*

%if %{with libheif}
%files heic
%{_libdir}/%{name}-%{Version}/modules-Q16HDRI/coders/heic.*
%endif

%files doc
%doc %{_datadir}/doc/%{name}-7

%files c++
%doc Magick++/AUTHORS
%license Magick++/LICENSE
%{_libdir}/libMagick++-7.Q16HDRI.so.%{libcxxsover}{,.*}

%files c++-devel
%doc Magick++/demo
%{_bindir}/Magick++-config
%{_includedir}/%{name}-7/Magick++/
%{_includedir}/%{name}-7/Magick++.h
%{_libdir}/libMagick++-7.Q16HDRI.so
%{_libdir}/pkgconfig/Magick++.pc
%{_libdir}/pkgconfig/Magick++-7.Q16HDRI.pc
%{_mandir}/man1/Magick++-config.*

%if %{with perl}
%files perl -f perl-pkg-files
%{_mandir}/man3/*
%doc PerlMagick/demo/ PerlMagick/Changelog PerlMagick/README.txt
%endif

%changelog
* Sat Jan 27 2024 Cristy <cristy@devel.imagemagick.org> - 7.1.1-28
-  Port of RedHat's script to create ImageMagick's RPM distribution.
```

--------------------------------------------------------------------------------

---[FILE: index.html]---
Location: ImageMagick-main/index.html

```text



<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

  <!-- Title and Description -->
  <title>ImageMagick | Mastering Digital Image Alchemy</title>
  <meta name="description" content="ImageMagick is a powerful open-source software suite for creating, editing, converting, and manipulating images in over 200 formats. Ideal for developers, designers, and researchers." />

  <!-- Canonical URL -->
  <link rel="canonical" href="www/index.html" />

  <!-- Robots -->
  <meta name="robots" content="index, follow" />

  <!-- Theme Color -->
  <meta name="theme-color" content="#000000" />

  <!-- Verification Tags -->
  <meta name="google-site-verification" content="_bMOCDpkx9ZAzBwb2kF3PRHbfUUdFj2uO8Jd1AXArz4" />

  <!-- Favicon and Apple Icon -->
  <link rel="shortcut icon" href="images/wand.png" type="images/png" />
  <link rel="apple-touch-icon" href="images/wand.png" type="images/png" />

  <!-- Preconnect for External Resources -->
  <link rel="preconnect" href="index.html" />

  <!-- Stylesheets -->
  <link rel="preload" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" as="style" crossorigin="anonymous" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" />

  <!-- Accessibility Enhancement -->
  <style>
    html {
      scroll-padding-top: 70px;
    }
    a.nav-link:hover,
    a.dropdown-item:hover {
      color: #ffc107 !important;
      text-shadow: 0px 2px 4px rgba(255, 193, 7, 0.8);
    }
    .btn-outline-warning {
      color: #cd7f32;
      border-color: #cd7f32;
    }
    .navbar-brand {
      color: #d4af37;
      transition: color 0.3s ease, text-shadow 0.3s ease;
    }
    .navbar-brand:hover {
      color: #e9c03d;
      text-shadow: 0px 2px 4px rgba(203, 163, 120, 0.6);
    }
  </style>

  <!-- Open Graph Meta Tags -->
  <meta property="og:title" content="ImageMagick | Mastering Digital Image Alchemy" />
  <meta property="og:description" content="ImageMagick is a powerful open-source software suite for creating, editing, converting, and manipulating images in over 200 formats. Ideal for developers, designers, and researchers." />
  <meta property="og:image" content="./images/logo.png" />
  <meta property="og:logo" content="./images/logo.png" />
  <meta property="og:url" content="./www/index.html" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="ImageMagick" />
  <meta property="og:locale" content="en_us" />

  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@imagemagick" />
  <meta name="twitter:creator" content="@imagemagick" />
  <meta name="twitter:title" content="ImageMagick | Mastering Digital Image Alchemy" />
  <meta name="twitter:description" content="ImageMagick is a powerful open-source software suite for creating, editing, converting, and manipulating images in over 200 formats. Ideal for developers, designers, and researchers." />
  <meta name="twitter:image" content="./images/logo.png" />
  <meta name="twitter:image:alt" content="ImageMagick logo and tag line" />

  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ImageMagick",
    "url": "./www/index.html",
    "image": "./images/logo.png",
    "description": "ImageMagick is a powerful open-source software suite for creating, editing, converting, and manipulating images in over 200 formats. Ideal for developers, designers, and researchers.",
    "applicationCategory": "Multimedia",
    "operatingSystem": "Windows, macOS, Linux, Unix",
    "softwareVersion": "7.1.2-3",
    "license": "./www/license.html",
    "creator": {
      "@type": "Organization",
      "name": "ImageMagick Studio LLC",
      "url": "https://imagemagick.org"
    },
    "keywords": [
      "Mastering Digital Image Alchemy",
      "image processing software",
      "image conversion tool",
      "batch image editing",
      "open-source image editor",
      "ImageMagick command-line",
      "resize images ImageMagick",
      "crop and rotate images",
      "ImageMagick tutorial",
      "ImageMagick automation",
      "ImageMagick for developers",
      "ImageMagick CLI",
      "ImageMagick filters and effects",
      "ImageMagick scripting",
      "ImageMagick API integration"
    ],
    "sameAs": [
      "https://github.com/ImageMagick",
      "https://x.com/imagemagick"
    ],
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  }
  </script>
  <!-- Google Custom Search -->
</head>
<body>
  <script>
    function setTheme(theme) {
      localStorage.setItem('theme', theme);
      updateThemeIcon(theme);
      document.documentElement.setAttribute('data-bs-theme', theme === 'auto' ? getSystemTheme() : theme);
    }
    function getSystemTheme() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    function updateThemeIcon(theme) {
      const iconMap = {
        light: '☀️',
        dark: '🌙',
        auto: '🌓'
      };
      document.getElementById('currentThemeIcon').textContent = iconMap[theme] || '🌓';
    }
    document.addEventListener('DOMContentLoaded', () => {
      const savedTheme = localStorage.getItem('theme') || 'auto';
      setTheme(savedTheme);
    });
  </script>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
  <div class="container-fluid">
    <a class="navbar-brand fw-bold" href="index.html" title="$meta->sitename;">
      ImageMagick    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#magick-navbars" aria-controls="magick-navbars" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="magick-navbars">
      <ul class="navbar-nav me-auto">
        <li class="nav-item">
          <a class="nav-link " href="www/download.html">Download</a>
        </li>
        <li class="nav-item">
          <a class="nav-link " href="www/command-line-tools.html">Tools</a>
        </li>
        <li class="nav-item">
          <a class="nav-link " href="www/command-line-processing.html">CLI</a>
        </li>
        <li class="nav-item">
          <a class="nav-link " href="www/develop.html">Develop</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" rel="noopener noreferrer" target="_blank" href="https://github.com/ImageMagick/ImageMagick/discussions">Community</a>
        </li>
        <li class="nav-item ms-4">
          <iframe src="https://github.com/sponsors/ImageMagick/button" title="Sponsor ImageMagick" height="35" width="107" style="border: 0;"></iframe>
        </li>
      </ul>
      <ul class="navbar-nav ms-auto">
        <li class="nav-item ms-3">
          <form class="d-flex form-inline" action="./www/search.html">
            <input class="form-control me-2" type="text" name="q" placeholder="Search site..." aria-label="Search">
            <button class="btn btn-outline-warning" type="submit" name="sa">Search</button>
          </form>
        </li>
        <li class="nav-item dropdown ms-3">
          <a class="nav-link dropdown-toggle" href="#" id="themeDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <span id="currentThemeIcon">🌓</span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="themeDropdown">
            <li><a class="dropdown-item" href="#" onclick="setTheme('light')">☀️ Light</a></li>
            <li><a class="dropdown-item" href="#" onclick="setTheme('dark')">🌙 Dark</a></li>
            <li><a class="dropdown-item" href="#" onclick="setTheme('auto')">🌓 Auto</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
  </nav>

<div class="col-lg-8 mx-auto text-body-secondary pt-5 pt-lg-5">
  <header class="d-flex align-items-center pb-3 mb-5 border-bottom">
    <div class="mt-3 ms-3">
      <a href="index.html" class="text-decoration-none">
        <h1 class="fs-2 mb-1">ImageMagick</h1>
      </a>
      <h2 class="fs-5 text-muted">Mastering Digital Image Alchemy</h2>
    </div>
  </header>

  <main role="main" class="container">
<p class="lead"><a href="images/wizard.png" title="And Now a Touch of Magick"><img class="img-fluid img-thumbnail" style="float: left; margin-right: 10px;" id="logo" alt="And Now a Touch of Magick" width="265" height="352" src="images/wizard.jpg" /></a> ImageMagick<sup><a href="http://tarr.uspto.gov/servlet/tarr?regser=serial&amp;entry=78333969" rel="noopener noreferrer" target="_blank">&#174;</a></sup> is a free, <a href="www/license.html">open-source</a> software suite, used for editing and manipulating digital images. It can be used to create, edit, compose, or convert bitmap images, and supports a wide range of file <a href="www/formats.html">formats</a>, including JPEG, PNG, GIF, TIFF, and Ultra HDR.</p>

<p>ImageMagick is widely used in industries such as web development, graphic design, and video editing, as well as in scientific research, medical imaging, and astronomy. Its versatile and customizable nature, along with its robust image processing capabilities, make it a popular choice for a wide range of image-related tasks.</p>

<p>ImageMagick includes a command-line interface for executing complex image processing tasks, as well as APIs for integrating its features into software applications. It is written in C and can be used on a variety of operating systems, including Linux, Windows, and macOS.</p>

<p>The main website for ImageMagick can be found at <a href="index.html">https://imagemagick.org</a>. The most recent version available is <a href="www/download.html">ImageMagick 7.1.2-3</a>. The source code for this software can be accessed through a <a href="https://github.com/ImageMagick/ImageMagick" rel="noopener noreferrer" target="_blank">repository</a>. In addition, we maintain a legacy version of ImageMagick, <a href="index.html" rel="noopener noreferrer" target="_blank">version 6</a>. Read our <a href="www/porting.html">porting</a> guide for comprehensive details on transitioning from version 6 to version 7.</p>

<p>Creating a security policy that fits your specific local environment before making use of ImageMagick is highly advised. You can find guidance on setting up this <a href="www/security-policy.html">policy</a>. Also, it's important to verify your policy using the <a href="index.html">validation tool</a>.</p>

<h3><a class="anchor" id="features"></a>Features and Capabilities</h3>

<p>One of the key features of ImageMagick is its support for scripting and automation. This allows users to create complex image manipulation pipelines that can be run automatically, without the need for manual intervention. This can be especially useful for tasks that require the processing of large numbers of images, or for tasks that need to be performed on a regular basis.</p>

<p>In addition to its core image manipulation capabilities, ImageMagick also includes a number of other features, such as support for animation, color management, and image rendering. These features make it a versatile tool for a wide range of image-related tasks, including graphic design, scientific visualization, and digital art.</p>

<p>Overall, ImageMagick is a powerful and versatile software suite for displaying, converting, and editing image files. Its support for scripting and automation, along with its other features, make it a valuable tool for a wide range of image-related tasks.</p>

<p>Here are just a few <a href="www/examples.html">examples</a> of what ImageMagick can do for you:</p>
<div class="pre-scrollable">
<table class="table table-sm table-hover table-striped table-responsive">
  <tr>
    <td><a href="https://usage.imagemagick.org/anim_basics/">Animation</a></td>
    <td>create a GIF animation sequence from a group of images.</td>
  </tr>
  <tr>
    <td><a href="www/command-line-options.html#bilateral-blur">Bilateral blur</a></td>
    <td>non-linear, edge-preserving, and noise-reducing smoothing filter.</td>
  </tr>
  <tr>
    <td><a href="www/color-management.html">Color management</a></td>
    <td>accurate color management with color profiles or in lieu of-- built-in gamma compression or expansion as demanded by the colorspace.</td>
  </tr>
  <tr>
    <td><a href="www/color-thresholding.html">Color thresholding</a></td>
    <td>force all pixels in the color range to white otherwise black.</td>
  </tr>
  <tr>
    <td><a href="www/command-line-processing.html">Command-line processing</a></td>
    <td>utilize ImageMagick from the command-line.</td>
  </tr>
  <tr>
    <td><a href="https://en.wikipedia.org/wiki/Complex_text_layout">Complex text layout</a></td>
    <td>bidirectional text support and shaping.</td>
  </tr>
  <tr>
    <td><a href="www/composite.html">Composite</a></td>
    <td>overlap one image over another.</td>
  </tr>
  <tr>
    <td><a href="./www/connected-components.html">Connected component labeling</a></td>
    <td>uniquely label connected regions in an image.</td>
  </tr>
  <tr>
    <td><a href="www/convex-hull.html">Convex hull</a></td>
    <td>smallest area convex polygon containing the image foreground objects.  In addition, the minimum bounding box and unrotate angle are also generated.</td>
  </tr>
  <tr>
    <td><a href="https://usage.imagemagick.org/crop/">Decorate</a></td>
    <td>add a border or frame to an image.</td>
  </tr>
  <tr>
    <td><a href="https://usage.imagemagick.org/transform/#vision#vision">Delineate image features</a></td>
    <td><a href="http://usage.imagemagick.org/transform/#canny#canny">Canny edge detection</a>, <a href="www/command-line-options.html#hough-line">Hough lines</a>.</td>
  </tr>
  <tr>
    <td><a href="https://usage.imagemagick.org/fourier/">Discrete Fourier transform</a></td>
    <td>implements the forward and inverse <a href="https://en.wikipedia.org/wiki/Discrete_Fourier_transform">DFT</a>.</td>
  </tr>
  <tr>
    <td><a href="./www/distribute-pixel-cache.html">Distributed pixel cache</a></td>
    <td>offload intermediate pixel storage to one or more remote servers.</td>
  </tr>
  <tr>
    <td><a href="https://usage.imagemagick.org/draw/">Draw</a></td>
    <td>add shapes or text to an image.</td>
  </tr>
  <tr>
    <td><a href="./www/cipher.html">Encipher or decipher an image</a></td>
    <td>convert ordinary images into unintelligible gibberish and back again.</td>
  </tr>
  <tr>
    <td><a href="./www/convert.html">Format conversion</a></td>
    <td>convert an image from one <a href="www/formats.html">format </a> to another (e.g. PNG to JPEG).</td>
  </tr>
  <tr>
    <td><a href="https://usage.imagemagick.org/distorts/">Generalized pixel distortion</a></td>
    <td>correct for, or induce image distortions including perspective.</td>
  </tr>
  <tr>
    <td><a href="./www/architecture.html#distributed#distributed">Heterogeneous distributed processing</a></td>
    <td>certain algorithms are <a href="./www/opencl.html">OpenCL</a>-enabled to take advantage of speed-ups offered by executing in concert across heterogeneous platforms consisting of CPUs, GPUs, and other processors.</td>
  </tr>
  <tr>
    <td><a href="./www/high-dynamic-range.html">High dynamic-range images</a></td>
    <td>accurately represent the wide range of intensity levels found in real scenes ranging from the brightest direct sunlight to the deepest darkest shadows.</td>
  </tr>
  <tr>
    <td><a href="./www/clahe.html">Histogram equalization</a></td>
    <td>use adaptive histogram equalization to improve contrast in images.</td>
  </tr>
  <tr>
    <td><a href="./www/magick-cache.html">Image cache</a></td>
    <td>secure methods and tools to cache images, image sequences, video, audio or metadata in a local folder..</td>
  </tr>
  <tr>
    <td><a href="./www/fx.html">Image calculator</a></td>
    <td>apply a mathematical expression to an image, image sequence, or image channels.</td>
  </tr>
  <tr>
    <td><a href="./www/gradient.html">Image gradients</a></td>
    <td>create a gradual blend of two colors whose shape is horizontal, vertical, circular, or elliptical.</td>
  </tr>
  <tr>
    <td><a href="./www/identify.html">Image identification</a></td>
    <td>describe the format and attributes of an image.</td>
  </tr>
  <tr>
    <td><a href="www/download.html#iOS">ImageMagick on the iPhone</a></td>
    <td>convert, edit, or compose images on your <a href="https://www.apple.com/ios/">iOS</a> device such as the iPhone or iPad.</td>
  </tr>
  <tr>
    <td><a href="./www/architecture.html#tera-pixel#tera-pixel">Large image support</a></td>
    <td>read, process, or write mega-, giga-, or tera-pixel image sizes.</td>
  </tr>
  <tr>
    <td><a href="./www/montage.html">Montage</a></td>
    <td>juxtapose image thumbnails on an image canvas.</td>
  </tr>
  <tr>
    <td><a href="https://usage.imagemagick.org/morphology/">Morphology of shapes</a></td>
    <td>extract features, describe shapes, and recognize patterns in images.</td>
  </tr>
  <tr>
    <td><a href="./www/motion-picture.html">Motion picture support</a></td>
    <td>read and write the common image formats used in digital film work.</td>
  </tr>
  <tr>
    <td><a href="./www/multispectral-imagery.html">Multispectral imagery</a></td>
    <td>support multispectral imagery up to 32 bands, 22 of them meta channels.</td>
  </tr>
  <tr>
    <td><a href="https://usage.imagemagick.org/transform/#vision#vision">Noise and color reduction</a></td>
    <td><a href="https://legacy.imagemagick.org/https://imagemagick.org/discourse-server//viewtopic.html?t=26480">Kuwahara Filter</a>, <a href="https://legacy.imagemagick.org/https://imagemagick.org/discourse-server//viewtopic.html?t=25504">mean-shift</a>.</td>
  </tr>
  <tr>
    <td><a href="http://www.fmwconcepts.com/misc_tests/perceptual_hash_test_results_510/index.html">Perceptual hash</a></td>
    <td>map visually identical images to the same or similar hash-- useful in image retrieval, authentication, indexing, or copy detection as well as digital watermarking.</td>
  </tr>
  <tr>
    <td><a href="https://usage.imagemagick.org/blur/">Special effects</a></td>
    <td>blur, sharpen, threshold, or tint an image.</td>
  </tr>
  <tr>
    <td><a href="https://usage.imagemagick.org/text/">Text &amp; comments</a></td>
    <td>insert descriptive or artistic text in an image.</td>
  </tr>
  <tr>
    <td><a href="./www/architecture.html#threads#threads">Threads of execution support</a></td>
    <td>ImageMagick is thread safe and most internal algorithms execute in <a href="www/openmp.html">parallel</a> to take advantage of speed-ups offered by multicore processor chips.</td>
  </tr>
  <tr>
    <td><a href="https://usage.imagemagick.org/resize/">Transform</a></td>
    <td>resize, rotate, deskew, crop, flip or trim an image.</td>
  </tr>
  <tr>
    <td><a href="https://usage.imagemagick.org/masking/">Transparency</a></td>
    <td>render portions of an image invisible.</td>
  </tr>
  <tr>
    <td><a href="./www/architecture.html#virtual-pixels#virtual-pixels">Virtual pixel support</a></td>
    <td>convenient access to pixels outside the image boundaries.</td>
  </tr>
</table>
</div>
<p> </p>
<p><a href="index.html" rel="noopener noreferrer" target="_blank">Examples of ImageMagick Usage</a> demonstrates how to use the software from the <a href="www/command-line-processing.html">command line</a> to achieve various effects. There are also several scripts available on the <a href="http://www.fmwconcepts.com/imagemagick/" rel="noopener noreferrer" target="_blank">Fred's ImageMagick Scripts</a> and <a href="index.html" rel="noopener noreferrer" target="_blank">Snibgo's ImageMagick Scripts</a> websites, which can be used to apply geometric transforms, blur and sharpen images, remove noise, and perform other operations. Additionally, there is a tool called <a href="https://github.com/dlemstra/Magick.NET" rel="noopener noreferrer" target="_blank">Magick.NET</a> that allows users to access the functionality of ImageMagick without having to install the software on their own systems. Finally, the website also includes a <a href="index.html" rel="noopener noreferrer" target="_blank">Cookbook</a> with tips and examples for using ImageMagick on Windows systems.</p>

<h3><a class="anchor" id="community"></a>Community</h3>
<p>Join the ImageMagick community by participating in the <a href="https://github.com/ImageMagick/ImageMagick/discussions" rel="noopener noreferrer" target="_blank">discussion</a> service. Here, you can find answers to questions asked by other ImageMagick users or ask your own questions. If you have a technical question, a suggestion for an improvement, or a fix for a bug, you can also open an <a href="https://github.com/ImageMagick/ImageMagick/issues" rel="noopener noreferrer" target="_blank">issue</a> to get help from the community.</p>
    <a aria-label="About ImageMagick" class="btn btn-outline-warning mt-3" href="index.html">About ImageMagick</a>
  </main><!-- /.container -->
  <footer class="text-center pt-5 my-5 text-body-secondary border-top">
    <div class="container-fluid">
      <a href="www/security-policy.html">Security</a> •
      <a href="./www/news.html">News</a>
     
      <a href="#"><img class="d-inline" id="wand" alt="And Now a Touch of Magick" width="16" height="16" src="./images/wand.ico" /></a>
     
      <a href="./www/links.html">Related</a> •
      <a href="./www/sitemap.html">Sitemap</a>
   <br>
     <a href="./www/support.html">Sponsor</a> •
     <a href="./www/cite.html">Cite</a> •
     <a href="http://pgp.mit.edu/pks/lookup?op=get&amp;search=0x89AB63D48277377A">Public Key</a> •
     <a href="./www/https://imagemagick.org/script/contact.php">Contact Us</a>
   <br>
     <a href="https://github.com/imagemagick/imagemagick" rel="noopener noreferrer" target="_blank" aria-label="GitHub"><svg xmlns="http://www.w3.org/2000/svg" class="navbar-nav-svg" viewBox="0 0 512 499.36" width="2%" height="2%" role="img" focusable="false"><title>GitHub</title><path fill="currentColor" fill-rule="evenodd" d="M256 0C114.64 0 0 114.61 0 256c0 113.09 73.34 209 175.08 242.9 12.8 2.35 17.47-5.56 17.47-12.34 0-6.08-.22-22.18-.35-43.54-71.2 15.49-86.2-34.34-86.2-34.34-11.64-29.57-28.42-37.45-28.42-37.45-23.27-15.84 1.73-15.55 1.73-15.55 25.69 1.81 39.21 26.38 39.21 26.38 22.84 39.12 59.92 27.82 74.5 21.27 2.33-16.54 8.94-27.82 16.25-34.22-56.84-6.43-116.6-28.43-116.6-126.49 0-27.95 10-50.8 26.35-68.69-2.63-6.48-11.42-32.5 2.51-67.75 0 0 21.49-6.88 70.4 26.24a242.65 242.65 0 0 1 128.18 0c48.87-33.13 70.33-26.24 70.33-26.24 14 35.25 5.18 61.27 2.55 67.75 16.41 17.9 26.31 40.75 26.31 68.69 0 98.35-59.85 120-116.88 126.32 9.19 7.9 17.38 23.53 17.38 47.41 0 34.22-.31 61.83-.31 70.23 0 6.85 4.61 14.81 17.6 12.31C438.72 464.97 512 369.08 512 256.02 512 114.62 397.37 0 256 0z"/></svg></a> •
     <a href="https://twitter.com/imagemagick" rel="noopener noreferrer" target="_blank" aria-label="Twitter"><svg xmlns="http://www.w3.org/2000/svg" class="navbar-nav-svg" viewBox="0 0 300 300" width="2%" height="2%" role="img" focusable="false"><title>Twitter</title><path d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66"/></svg></a>
    <br>
    <small>Copyright © 1999 ImageMagick Studio LLC</small>
    </div>
  </footer>
</div>

  <!-- Javascript assets -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
~                                                         
  </body>
</html>
<!-- Magick Cache 3rd October 2025 23:03 -->
```

--------------------------------------------------------------------------------

---[FILE: Install-mac.txt]---
Location: ImageMagick-main/Install-mac.txt

```text
macOS-specific Build instructions

In order to install ImageMagick on macOS, you will first need Apple's "Xcode", 
which you can get by going to the AppStore and searching for "Xcode" and 
installing it.

Next, you will need to install the "Xcode Command Line Tools" which includes 
the compiler. You can install those by running the following command in the
Terminal:

    xcode-select --install

Now that you have the necessary tools, you have a choice of how to install 
ImageMagick. The simplest method is to use "homebrew", and that method is shown 
first below. The alternative method is to install from source, which is shown
afterwards.

################################################################################
Method 1: Using "homebrew"
################################################################################

Go to http://brew.sh and copy the one-liner that installs "homebrew".

Paste that into the Terminal and run it.

For the very simplest, fastest, most basic ImageMagick installation, run:

    brew install imagemagick

Test your installation by running:

    identify -version

If you want to add support for extra features, such as HDRI, Perl, JPEG2000, 
pango,fftw, TIFF or rsvg etc. you can configure the necessary switches by running:

    brew edit imagemagick

then find the options you need and apply them like this:

    brew reinstall -s imagemagick
 
If you have any problems with "homebrew", simply run:

    brew doctor

and follow the doctor's advice.


################################################################################
Method 2: Compile from source - not necessary if you used "homebrew" method
################################################################################


Perform these steps as an administrator or with the sudo command:
  
Install MacPorts. Download and install http://www.macports.org/ and type the
following commands:
  
    $magick> sudo port -v install freetype +bytecode
    $magick> sudo port -v install librsvg
    $magick> sudo port -v install graphviz +gs +wmf +jbig +jpeg2 +lcms
  
This installs many of the delegate libraries ImageMagick will utilize such as
JPEG and FreeType.
  
Use the port command to install any delegate libraries you require, for example:
  
    $magick> sudo port install jpeg
  
Now let's build ImageMagick:
  
Download the ImageMagick source distribution and verify the distribution
against its message digest.
  
Unpack and change into the top-level ImageMagick directory:
  
    $magick> tar xvfz ImageMagick-7.0.7-0.tar.gz 
    $magick> cd ImageMagick-7.0.7
  
Configure ImageMagick:
  
    $magick> ./configure --prefix=/opt --with-quantum-depth=16 \
      --disable-dependency-tracking --without-perl
  
Build ImageMagick:
  
    $magick> make
  
Install ImageMagick:
  
    $magick> sudo make install
  
To verify your install, type
  
    $magick> /opt/local/bin/identify -list font
  
to list all the fonts ImageMagick knows about.
```

--------------------------------------------------------------------------------

````

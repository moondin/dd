---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 182
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 182 of 851)

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

---[FILE: Pixels.cpp]---
Location: ImageMagick-main/Magick++/lib/Pixels.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2001, 2002, 2003
//
// Copyright @ 2013 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Pixels Implementation
//

#define MAGICKCORE_IMPLEMENTATION  1
#define MAGICK_PLUSPLUS_IMPLEMENTATION 1

#include <cstring>
#include "Magick++/Include.h"
#include <string> // This is here to compile with Visual C++
#include "Magick++/Thread.h"
#include "Magick++/Exception.h"
#include "Magick++/Pixels.h"

Magick::Pixels::Pixels(Magick::Image &image_)
  : _image(image_),
    _x(0),
    _y(0),
    _columns(0),
    _rows(0)
{
  GetPPException;
    _view=AcquireVirtualCacheView(image_.image(),exceptionInfo),
  ThrowPPException(image_.quiet());
}

Magick::Pixels::~Pixels(void)
{
  if (_view)
    _view=DestroyCacheView(_view);
}

Magick::Quantum* Magick::Pixels::get(const ssize_t x_,const ssize_t y_,
  const size_t columns_,const size_t rows_)
{
  _x=x_;
  _y=y_;
  _columns=columns_;
  _rows=rows_;

  GetPPException;
  Quantum* pixels=GetCacheViewAuthenticPixels(_view,x_,y_,columns_,rows_,
    exceptionInfo);
  ThrowPPException(_image.quiet());

  return pixels;
}

const Magick::Quantum* Magick::Pixels::getConst(const ssize_t x_,
  const ssize_t y_,const size_t columns_,const size_t rows_)
{
  _x=x_;
  _y=y_;
  _columns=columns_;
  _rows=rows_;

  GetPPException;
  const Quantum* pixels=GetCacheViewVirtualPixels(_view,x_,y_,columns_,rows_,
    exceptionInfo);
  ThrowPPException(_image.quiet());

  return pixels;
}

ssize_t Magick::Pixels::offset(PixelChannel channel) const
{
  if (_image.constImage()->channel_map[channel].traits == UndefinedPixelTrait)
    return -1;
  return _image.constImage()->channel_map[channel].offset;
}

Magick::Quantum* Magick::Pixels::set(const ssize_t x_,const ssize_t y_,
  const size_t columns_,const size_t rows_)
{
  _x=x_;
  _y=y_;
  _columns=columns_;
  _rows=rows_;

  GetPPException;
  Quantum* pixels=QueueCacheViewAuthenticPixels(_view,x_,y_,columns_,rows_,
    exceptionInfo);
  ThrowPPException(_image.quiet());

  return pixels;
}

void Magick::Pixels::sync(void)
{
  GetPPException;
  (void) SyncCacheViewAuthenticPixels(_view,exceptionInfo);
  ThrowPPException(_image.quiet());
}

// Return pixel meta content
void* Magick::Pixels::metacontent(void)
{
  void* pixel_metacontent=GetCacheViewAuthenticMetacontent(_view);

  return pixel_metacontent;
}

Magick::PixelData::PixelData(Magick::Image &image_,std::string map_,
  const StorageType type_)
{
  init(image_,0,0,image_.columns(),image_.rows(),map_,type_);
}

Magick::PixelData::PixelData(Magick::Image &image_,const ::ssize_t x_,
  const ::ssize_t y_,const size_t width_,const size_t height_,std::string map_,
  const StorageType type_)
{
  init(image_,x_,y_,width_,height_,map_,type_);
}

Magick::PixelData::~PixelData(void)
{
  relinquish();
}

const void *Magick::PixelData::data(void) const
{
  return(_data);
}

::ssize_t Magick::PixelData::length(void) const
{
  return(_length);
}

::ssize_t Magick::PixelData::size(void) const
{
  return(_size);
}

void Magick::PixelData::init(Magick::Image &image_,const ::ssize_t x_,
  const ::ssize_t y_,const size_t width_,const size_t height_,
  std::string map_,const StorageType type_)
{
  size_t
    size;

  _data=(void *) NULL;
  _length=0;
  _size=0;
  if ((x_ < 0) || (width_ == 0) || (y_ < 0) || (height_ == 0) ||
      (x_ > (ssize_t) image_.columns()) || (((ssize_t) width_ + x_) > (ssize_t) image_.columns())
      || (y_ > (ssize_t) image_.rows()) || (((ssize_t) height_ + y_) > (ssize_t) image_.rows())
      || (map_.length() == 0))
    return;

  switch(type_)
  {
    case CharPixel:
      size=sizeof(unsigned char);
      break;
    case DoublePixel:
      size=sizeof(double);
      break;
    case FloatPixel:
      size=sizeof(float);
      break;
    case LongPixel:
      size=sizeof(unsigned int);
      break;
    case LongLongPixel:
      size=sizeof(MagickSizeType);
      break;
    case QuantumPixel:
      size=sizeof(Quantum);
      break;
    case ShortPixel:
      size=sizeof(unsigned short);
      break;
    default:
      throwExceptionExplicit(MagickCore::OptionError,"Invalid type");
      return;
  }

  _length=(ssize_t) (width_*height_*map_.length());
  _size=_length*(ssize_t) size;
  _data=AcquireMagickMemory((size_t) _size);

  GetPPException;
  MagickCore::ExportImagePixels(image_.image(),x_,y_,width_,height_,
    map_.c_str(),type_,_data,exceptionInfo);
  if (exceptionInfo->severity != MagickCore::UndefinedException)
    relinquish();
  ThrowPPException(image_.quiet());
}

void Magick::PixelData::relinquish(void) throw()
{
  if (_data != (void *)NULL)
    _data=RelinquishMagickMemory(_data);
  _length=0;
  _size=0;
}
```

--------------------------------------------------------------------------------

---[FILE: ResourceLimits.cpp]---
Location: ImageMagick-main/Magick++/lib/ResourceLimits.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright @ 2014 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Implementation of ResourceLimits
//

#define MAGICKCORE_IMPLEMENTATION  1
#define MAGICK_PLUSPLUS_IMPLEMENTATION 1

#include "Magick++/ResourceLimits.h"

void Magick::ResourceLimits::area(const MagickSizeType limit_)
{
  (void) SetMagickResourceLimit(AreaResource,limit_);
}

MagickCore::MagickSizeType Magick::ResourceLimits::area(void)
{
  return(GetMagickResourceLimit(AreaResource));
}

void Magick::ResourceLimits::disk(const MagickSizeType limit_)
{
  (void) SetMagickResourceLimit(DiskResource,limit_);
}

MagickCore::MagickSizeType Magick::ResourceLimits::disk(void)
{
  return(GetMagickResourceLimit(DiskResource));
}

void Magick::ResourceLimits::file(const MagickSizeType limit_)
{
  (void) SetMagickResourceLimit(FileResource,limit_);
}

MagickCore::MagickSizeType Magick::ResourceLimits::file(void)
{
  return(GetMagickResourceLimit(FileResource));
}

void Magick::ResourceLimits::height(const MagickSizeType limit_)
{
  (void) SetMagickResourceLimit(HeightResource,limit_);
}

MagickCore::MagickSizeType Magick::ResourceLimits::height(void)
{
  return(GetMagickResourceLimit(HeightResource));
}

void Magick::ResourceLimits::listLength(const MagickSizeType limit_)
{
  (void) SetMagickResourceLimit(ListLengthResource,limit_);
}

MagickCore::MagickSizeType Magick::ResourceLimits::listLength(void)
{
  return(GetMagickResourceLimit(ListLengthResource));
}

void Magick::ResourceLimits::map(const MagickSizeType limit_)
{
  (void) SetMagickResourceLimit(MapResource,limit_);
}

MagickCore::MagickSizeType Magick::ResourceLimits::map(void)
{
  return(GetMagickResourceLimit(MapResource));
}

void Magick::ResourceLimits::memory(const MagickSizeType limit_)
{
  (void) SetMagickResourceLimit(MemoryResource,limit_);
}

MagickCore::MagickSizeType Magick::ResourceLimits::memory(void)
{
  return(GetMagickResourceLimit(MemoryResource));
}

void Magick::ResourceLimits::thread(const MagickSizeType limit_)
{
  (void) SetMagickResourceLimit(ThreadResource,limit_);
}

MagickCore::MagickSizeType Magick::ResourceLimits::thread(void)
{
  return(GetMagickResourceLimit(ThreadResource));
}

void Magick::ResourceLimits::throttle(const MagickSizeType limit_)
{
  (void) SetMagickResourceLimit(ThrottleResource,limit_);
}

MagickCore::MagickSizeType Magick::ResourceLimits::throttle(void)
{
  return(GetMagickResourceLimit(ThrottleResource));
}

void Magick::ResourceLimits::width(const MagickSizeType limit_)
{
  (void) SetMagickResourceLimit(WidthResource,limit_);
}

MagickCore::MagickSizeType Magick::ResourceLimits::width(void)
{
  return(GetMagickResourceLimit(WidthResource));
}

Magick::ResourceLimits::ResourceLimits()
{
}
```

--------------------------------------------------------------------------------

---[FILE: SecurityPolicy.cpp]---
Location: ImageMagick-main/Magick++/lib/SecurityPolicy.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright @ 2018 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Implementation of the security policy.
//

#define MAGICKCORE_IMPLEMENTATION  1
#define MAGICK_PLUSPLUS_IMPLEMENTATION 1

#include "Magick++/SecurityPolicy.h"
#include "Magick++/Exception.h"
#include <string>
#include <sstream>


using namespace std;

bool Magick::SecurityPolicy::anonymousCacheMemoryMap()
{
  return(setValue(CachePolicyDomain,"memory-map","anonymous"));
}

bool Magick::SecurityPolicy::anonymousSystemMemoryMap()
{
  return(setValue(SystemPolicyDomain,"memory-map","anonymous"));
}

bool Magick::SecurityPolicy::precision(const int precision_)
{
  string
    value;

  value=toString(precision_);
  return(setValue(SystemPolicyDomain,"precision",value));
}

bool Magick::SecurityPolicy::maxMemoryRequest(const MagickSizeType limit_)
{
  string
    value;

  value=toString(limit_);
  return(setValue(SystemPolicyDomain,"max-memory-request",value));
}

bool Magick::SecurityPolicy::maxProfileSize(const MagickSizeType limit_)
{
  string
    value;

  value=toString(limit_);
  return(setValue(SystemPolicyDomain,"max-profile-size",value));
}

bool Magick::SecurityPolicy::shred(const int passes_)
{
  string
    value;

  value=toString(passes_);
  return(setValue(SystemPolicyDomain,"shred",value));
}

Magick::SecurityPolicy::SecurityPolicy()
{
}

bool Magick::SecurityPolicy::setValue(const PolicyDomain domain_,
  const std::string name_,const std::string value_)
{
  MagickBooleanType
    status;

  GetPPException;
  status=MagickCore::SetMagickSecurityPolicyValue(domain_,name_.c_str(),
    value_.c_str(),exceptionInfo);
  ThrowPPException(false);
  return(status != MagickFalse);
}

template <typename T>
std::string Magick::SecurityPolicy::toString(const T& value)
{
  stringstream ss;
  ss << value;
  return ss.str();
}
```

--------------------------------------------------------------------------------

---[FILE: Statistic.cpp]---
Location: ImageMagick-main/Magick++/lib/Statistic.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright @ 2014 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Implementation of channel moments.
//

#define MAGICKCORE_IMPLEMENTATION  1
#define MAGICK_PLUSPLUS_IMPLEMENTATION  1

#include "Magick++/Include.h"
#include "Magick++/Exception.h"
#include "Magick++/Statistic.h"
#include "Magick++/Image.h"

using namespace std;

Magick::ChannelMoments::ChannelMoments(void)
  : _channel(SyncPixelChannel),
    _huInvariants(8),
    _centroidX(0.0),
    _centroidY(0.0),
    _ellipseAxisX(0.0),
    _ellipseAxisY(0.0),
    _ellipseAngle(0.0),
    _ellipseEccentricity(0.0),
    _ellipseIntensity(0.0)
{
}

Magick::ChannelMoments::ChannelMoments(const ChannelMoments &channelMoments_)
  : _channel(channelMoments_._channel),
    _huInvariants(channelMoments_._huInvariants),
    _centroidX(channelMoments_._centroidX),
    _centroidY(channelMoments_._centroidY),
    _ellipseAxisX(channelMoments_._ellipseAxisX),
    _ellipseAxisY(channelMoments_._ellipseAxisY),
    _ellipseAngle(channelMoments_._ellipseAngle),
    _ellipseEccentricity(channelMoments_._ellipseEccentricity),
    _ellipseIntensity(channelMoments_._ellipseIntensity)
{
}

Magick::ChannelMoments::~ChannelMoments(void)
{
}

double Magick::ChannelMoments::centroidX(void) const
{
  return(_centroidX);
}

double Magick::ChannelMoments::centroidY(void) const
{
  return(_centroidY);
}

Magick::PixelChannel Magick::ChannelMoments::channel(void) const
{
  return(_channel);
}

double Magick::ChannelMoments::ellipseAxisX(void) const
{
  return(_ellipseAxisX);
}

double Magick::ChannelMoments::ellipseAxisY(void) const
{
  return(_ellipseAxisY);
}

double Magick::ChannelMoments::ellipseAngle(void) const
{
  return(_ellipseAngle);
}

double Magick::ChannelMoments::ellipseEccentricity(void) const
{
  return(_ellipseEccentricity);
}

double Magick::ChannelMoments::ellipseIntensity(void) const
{
  return(_ellipseIntensity);
}

double Magick::ChannelMoments::huInvariants(const size_t index_) const
{
  if (index_ > 7)
    throw ErrorOption("Valid range for index is 0-7");

  return(_huInvariants.at(index_));
}

bool Magick::ChannelMoments::isValid() const
{
  return(_channel != SyncPixelChannel);
}

Magick::ChannelMoments::ChannelMoments(const PixelChannel channel_,
  const MagickCore::ChannelMoments *channelMoments_)
  : _channel(channel_),
    _huInvariants(),
    _centroidX(channelMoments_->centroid.x),
    _centroidY(channelMoments_->centroid.y),
    _ellipseAxisX(channelMoments_->ellipse_axis.x),
    _ellipseAxisY(channelMoments_->ellipse_axis.y),
    _ellipseAngle(channelMoments_->ellipse_angle),
    _ellipseEccentricity(channelMoments_->ellipse_eccentricity),
    _ellipseIntensity(channelMoments_->ellipse_intensity)
{
  ssize_t
    i;

  for (i=0; i<8; i++)
    _huInvariants.push_back(channelMoments_->invariant[i]);
}

Magick::ChannelPerceptualHash::ChannelPerceptualHash(void)
  : _channel(SyncPixelChannel),
    _srgbHuPhash(7),
    _hclpHuPhash(7)
{
}

Magick::ChannelPerceptualHash::ChannelPerceptualHash(
  const ChannelPerceptualHash &channelPerceptualHash_)
  : _channel(channelPerceptualHash_._channel),
    _srgbHuPhash(channelPerceptualHash_._srgbHuPhash),
    _hclpHuPhash(channelPerceptualHash_._hclpHuPhash)
{
}

Magick::ChannelPerceptualHash::ChannelPerceptualHash(
  const PixelChannel channel_,const std::string &hash_)
  : _channel(channel_),
    _srgbHuPhash(7),
    _hclpHuPhash(7)
{
  size_t
    i;

  if (hash_.length() != 70)
    throw ErrorOption("Invalid hash length");

  for (i=0; i<14; i++)
  {
    unsigned int
      hex;

    double
      value;

#if defined(MAGICKCORE_WINDOWS_SUPPORT) && !defined(__MINGW32__)
    if (sscanf_s(hash_.substr(i*5,5).c_str(),"%05x",&hex) != 1)
#else
    if (sscanf(hash_.substr(i*5,5).c_str(),"%05x",&hex) != 1)
#endif
      throw ErrorOption("Invalid hash value");

    value=((unsigned short)hex) / pow(10.0, (double)(hex >> 17));
    if (hex & (1 << 16))
      value=-value;
    if (i < 7)
      _srgbHuPhash[i]=value;
    else
      _hclpHuPhash[i-7]=value;
  }
}

Magick::ChannelPerceptualHash::~ChannelPerceptualHash(void)
{
}

Magick::ChannelPerceptualHash::operator std::string() const
{
  std::string
    hash;

  size_t
    i;

  if (!isValid())
    return(std::string());

  for (i=0; i<14; i++)
  {
    char
      buffer[6];

    double
      value;

    unsigned int
      hex;

    if (i < 7)
      value=_srgbHuPhash[i];
    else
      value=_hclpHuPhash[i-7];

    hex=0;
    while(hex < 7 && fabs(value*10) < 65536)
    {
      value=value*10;
      hex++;
    }

    hex=(hex<<1);
    if (value < 0.0)
      hex|=1;
    hex=(hex<<16)+(unsigned int)(value < 0.0 ? -(value - 0.5) : value + 0.5);
    (void) FormatLocaleString(buffer,6,"%05x",hex);
    hash+=std::string(buffer);
  }
  return(hash);
}

Magick::PixelChannel Magick::ChannelPerceptualHash::channel() const
{
  return(_channel);
}

bool Magick::ChannelPerceptualHash::isValid() const
{
  return(_channel != SyncPixelChannel);
}

double Magick::ChannelPerceptualHash::sumSquaredDifferences(
  const ChannelPerceptualHash &channelPerceptualHash_)
{
  double
    ssd;

  size_t
    i;

  ssd=0.0;
  for (i=0; i<7; i++)
  {
    ssd+=((_srgbHuPhash[i]-channelPerceptualHash_._srgbHuPhash[i])*
      (_srgbHuPhash[i]-channelPerceptualHash_._srgbHuPhash[i]));
    ssd+=((_hclpHuPhash[i]-channelPerceptualHash_._hclpHuPhash[i])*
      (_hclpHuPhash[i]-channelPerceptualHash_._hclpHuPhash[i]));
  }
  return(ssd);
}

double Magick::ChannelPerceptualHash::srgbHuPhash(const size_t index_) const
{
  if (index_ > 6)
    throw ErrorOption("Valid range for index is 0-6");

  return(_srgbHuPhash.at(index_));
}

double Magick::ChannelPerceptualHash::hclpHuPhash(const size_t index_) const
{
  if (index_ > 6)
    throw ErrorOption("Valid range for index is 0-6");

  return(_hclpHuPhash.at(index_));
}

Magick::ChannelPerceptualHash::ChannelPerceptualHash(
  const PixelChannel channel_,
  const MagickCore::ChannelPerceptualHash *channelPerceptualHash_)
  : _channel(channel_),
    _srgbHuPhash(7),
    _hclpHuPhash(7)
{
  size_t
    i;

  for (i=0; i<7; i++)
  {
    _srgbHuPhash[i]=channelPerceptualHash_->phash[0][i];
    _hclpHuPhash[i]=channelPerceptualHash_->phash[1][i];
  }
}

Magick::ChannelStatistics::ChannelStatistics(void)
  : _channel(SyncPixelChannel),
    _area(0.0),
    _depth(0),
    _entropy(0.0),
    _kurtosis(0.0),
    _maxima(0.0),
    _mean(0.0),
    _minima(0.0),
    _skewness(0.0),
    _standardDeviation(0.0),
    _sum(0.0),
    _sumCubed(0.0),
    _sumFourthPower(0.0),
    _sumSquared(0.0),
    _variance(0.0)
{
}

Magick::ChannelStatistics::ChannelStatistics(
  const ChannelStatistics &channelStatistics_)
  : _channel(channelStatistics_._channel),
    _area(channelStatistics_._area),
    _depth(channelStatistics_._depth),
    _entropy(channelStatistics_._entropy),
    _kurtosis(channelStatistics_._kurtosis),
    _maxima(channelStatistics_._maxima),
    _mean(channelStatistics_._mean),
    _minima(channelStatistics_._minima),
    _skewness(channelStatistics_._skewness),
    _standardDeviation(channelStatistics_._standardDeviation),
    _sum(channelStatistics_._sum),
    _sumCubed(channelStatistics_._sumCubed),
    _sumFourthPower(channelStatistics_._sumFourthPower),
    _sumSquared(channelStatistics_._sumSquared),
    _variance(channelStatistics_._variance)
{
}

Magick::ChannelStatistics::~ChannelStatistics(void)
{
}

double Magick::ChannelStatistics::area() const
{
  return(_area);
}

Magick::PixelChannel Magick::ChannelStatistics::channel() const
{
  return(_channel);
}

size_t Magick::ChannelStatistics::depth() const
{
  return(_depth);
}

double Magick::ChannelStatistics::entropy() const
{
  return(_entropy);
}

bool Magick::ChannelStatistics::isValid() const
{
  return(_channel != SyncPixelChannel);
}

double Magick::ChannelStatistics::kurtosis() const
{
  return(_kurtosis);
}

double Magick::ChannelStatistics::maxima() const
{
  return(_maxima);
}

double Magick::ChannelStatistics::mean() const
{
  return(_mean);
}

double Magick::ChannelStatistics::minima() const
{
  return(_minima);
}

double Magick::ChannelStatistics::skewness() const
{
  return(_skewness);
}

double Magick::ChannelStatistics::standardDeviation() const
{
  return(_standardDeviation);
}

double Magick::ChannelStatistics::sum() const
{
  return(_sum);
}

double Magick::ChannelStatistics::sumCubed() const
{
  return(_sumCubed);
}

double Magick::ChannelStatistics::sumFourthPower() const
{
  return(_sumFourthPower);
}

double Magick::ChannelStatistics::sumSquared() const
{
  return(_sumSquared);
}

double Magick::ChannelStatistics::variance() const
{
  return(_variance);
}

Magick::ChannelStatistics::ChannelStatistics(const PixelChannel channel_,
  const MagickCore::ChannelStatistics *channelStatistics_)
  : _channel(channel_),
    _area(channelStatistics_->area),
    _depth(channelStatistics_->depth),
    _entropy(channelStatistics_->entropy),
    _kurtosis(channelStatistics_->kurtosis),
    _maxima(channelStatistics_->maxima),
    _mean(channelStatistics_->mean),
    _minima(channelStatistics_->minima),
    _skewness(channelStatistics_->skewness),
    _standardDeviation(channelStatistics_->standard_deviation),
    _sum(channelStatistics_->sum),
    _sumCubed(channelStatistics_->sum_cubed),
    _sumFourthPower(channelStatistics_->sum_fourth_power),
    _sumSquared(channelStatistics_->sum_squared),
    _variance(channelStatistics_->variance)
{
}

Magick::ImageMoments::ImageMoments(void)
  : _channels()
{
}

Magick::ImageMoments::ImageMoments(const ImageMoments &imageMoments_)
  : _channels(imageMoments_._channels)
{
}

Magick::ImageMoments::~ImageMoments(void)
{
}

Magick::ChannelMoments Magick::ImageMoments::channel(
  const PixelChannel channel_) const
{
  for (std::vector<ChannelMoments>::const_iterator it = _channels.begin();
       it != _channels.end(); ++it)
  {
    if (it->channel() == channel_)
      return(*it);
  }
  return(ChannelMoments());
}

Magick::ImageMoments::ImageMoments(const Image &image_)
  : _channels()
{
  MagickCore::ChannelMoments*
    channel_moments;

  GetPPException;
  channel_moments=GetImageMoments(image_.constImage(),exceptionInfo);
  if (channel_moments != (MagickCore::ChannelMoments *) NULL)
    {
      ssize_t
        i;

      for (i=0; i < (ssize_t) GetPixelChannels(image_.constImage()); i++)
      {
        PixelChannel channel=GetPixelChannelChannel(image_.constImage(),i);
        PixelTrait traits=GetPixelChannelTraits(image_.constImage(),channel);
        if (traits == UndefinedPixelTrait)
          continue;
        if ((traits & UpdatePixelTrait) == 0)
          continue;
        _channels.push_back(Magick::ChannelMoments(channel,
          &channel_moments[channel]));
      }
      _channels.push_back(Magick::ChannelMoments(CompositePixelChannel,
        &channel_moments[CompositePixelChannel]));
      channel_moments=(MagickCore::ChannelMoments *) RelinquishMagickMemory(
        channel_moments);
    }
  ThrowPPException(image_.quiet());
}

Magick::ImagePerceptualHash::ImagePerceptualHash(void)
  : _channels()
{
}

Magick::ImagePerceptualHash::ImagePerceptualHash(
  const ImagePerceptualHash &imagePerceptualHash_)
  : _channels(imagePerceptualHash_._channels)
{
}

Magick::ImagePerceptualHash::ImagePerceptualHash(const std::string &hash_)
  : _channels()
{
  if (hash_.length() != 210)
    throw ErrorOption("Invalid hash length");

  _channels.push_back(Magick::ChannelPerceptualHash(RedPixelChannel,
    hash_.substr(0, 70)));
  _channels.push_back(Magick::ChannelPerceptualHash(GreenPixelChannel,
    hash_.substr(70, 70)));
  _channels.push_back(Magick::ChannelPerceptualHash(BluePixelChannel,
    hash_.substr(140, 70)));
}

Magick::ImagePerceptualHash::~ImagePerceptualHash(void)
{
}

Magick::ImagePerceptualHash::operator std::string() const
{
  if (!isValid())
    return(std::string());

  return static_cast<std::string>(_channels[0]) +
    static_cast<std::string>(_channels[1]) + 
    static_cast<std::string>(_channels[2]);
}

Magick::ChannelPerceptualHash Magick::ImagePerceptualHash::channel(
  const PixelChannel channel_) const
{
  for (std::vector<ChannelPerceptualHash>::const_iterator it =
       _channels.begin(); it != _channels.end(); ++it)
  {
    if (it->channel() == channel_)
      return(*it);
  }
  return(ChannelPerceptualHash());
}

bool Magick::ImagePerceptualHash::isValid() const
{
  if (_channels.size() != 3)
    return(false);

  if (_channels[0].channel() != RedPixelChannel)
    return(false);

  if (_channels[1].channel() != GreenPixelChannel)
    return(false);

  if (_channels[2].channel() != BluePixelChannel)
    return(false);

  return(true);
}

double Magick::ImagePerceptualHash::sumSquaredDifferences(
      const ImagePerceptualHash &channelPerceptualHash_)
{
  double
    ssd;

  size_t
    i;

  if (!isValid())
    throw ErrorOption("instance is not valid");
  if (!channelPerceptualHash_.isValid())
    throw ErrorOption("channelPerceptualHash_ is not valid");

  ssd=0.0;
  for (i=0; i<3; i++)
  {
    ssd+=_channels[i].sumSquaredDifferences(_channels[i]);
  }
  return(ssd);
}

Magick::ImagePerceptualHash::ImagePerceptualHash(
  const Image &image_)
  : _channels()
{
  MagickCore::ChannelPerceptualHash*
    channel_perceptual_hash;

  PixelTrait
    traits;

  GetPPException;
  channel_perceptual_hash=GetImagePerceptualHash(image_.constImage(),
    exceptionInfo);
  if (channel_perceptual_hash != (MagickCore::ChannelPerceptualHash *) NULL)
    {
      traits=GetPixelChannelTraits(image_.constImage(),RedPixelChannel);
      if ((traits & UpdatePixelTrait) != 0)
        _channels.push_back(Magick::ChannelPerceptualHash(RedPixelChannel,
          &channel_perceptual_hash[RedPixelChannel]));
      traits=GetPixelChannelTraits(image_.constImage(),GreenPixelChannel);
      if ((traits & UpdatePixelTrait) != 0)
        _channels.push_back(Magick::ChannelPerceptualHash(GreenPixelChannel,
          &channel_perceptual_hash[GreenPixelChannel]));
      traits=GetPixelChannelTraits(image_.constImage(),BluePixelChannel);
      if ((traits & UpdatePixelTrait) != 0)
        _channels.push_back(Magick::ChannelPerceptualHash(BluePixelChannel,
          &channel_perceptual_hash[BluePixelChannel]));
      channel_perceptual_hash=(MagickCore::ChannelPerceptualHash *)
        RelinquishMagickMemory(channel_perceptual_hash);
    }
  ThrowPPException(image_.quiet());
}

Magick::ImageStatistics::ImageStatistics(void)
  : _channels()
{
}

Magick::ImageStatistics::ImageStatistics(
  const ImageStatistics &imageStatistics_)
  : _channels(imageStatistics_._channels)
{
}

Magick::ImageStatistics::~ImageStatistics(void)
{
}

Magick::ChannelStatistics Magick::ImageStatistics::channel(
  const PixelChannel channel_) const
{
  for (std::vector<ChannelStatistics>::const_iterator it = _channels.begin();
       it != _channels.end(); ++it)
  {
    if (it->channel() == channel_)
      return(*it);
  }
  return(ChannelStatistics());
}

Magick::ImageStatistics::ImageStatistics(const Image &image_)
  : _channels()
{
  MagickCore::ChannelStatistics*
    channel_statistics;

  GetPPException;
  channel_statistics=GetImageStatistics(image_.constImage(),exceptionInfo);
  if (channel_statistics != (MagickCore::ChannelStatistics *) NULL)
    {
      ssize_t
        i;

      for (i=0; i < (ssize_t) GetPixelChannels(image_.constImage()); i++)
      {
        PixelChannel channel=GetPixelChannelChannel(image_.constImage(),i);
        PixelTrait traits=GetPixelChannelTraits(image_.constImage(),channel);
        if (traits == UndefinedPixelTrait)
          continue;
        if ((traits & UpdatePixelTrait) == 0)
          continue;
        _channels.push_back(Magick::ChannelStatistics(channel,
          &channel_statistics[channel]));
      }
      _channels.push_back(Magick::ChannelStatistics(CompositePixelChannel,
        &channel_statistics[CompositePixelChannel]));
      channel_statistics=(MagickCore::ChannelStatistics *) RelinquishMagickMemory(
        channel_statistics);
    }
  ThrowPPException(image_.quiet());
}
```

--------------------------------------------------------------------------------

````

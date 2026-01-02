---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 179
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 179 of 851)

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

---[FILE: Exception.cpp]---
Location: ImageMagick-main/Magick++/lib/Exception.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2001, 2002, 2003
//
// Copyright @ 2014 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Implementation of Exception and derived classes
//

#define MAGICKCORE_IMPLEMENTATION  1
#define MAGICK_PLUSPLUS_IMPLEMENTATION 1

#include "Magick++/Include.h"
#include <string>
#include <errno.h>
#include <string.h>

using namespace std;

#include "Magick++/Exception.h"

Magick::Exception::Exception(const std::string& what_)
  : std::exception(),
    _what(what_),
    _nested((Exception *) NULL)
{
}

Magick::Exception::Exception(const std::string& what_,
  Exception* nested_)
    : std::exception(),
    _what(what_),
    _nested(nested_)
{
}

Magick::Exception::Exception(const Magick::Exception& original_)
  : exception(original_),
    _what(original_._what),
    _nested((Exception *) NULL)
{
}

Magick::Exception::~Exception() throw()
{
  delete _nested;
}

Magick::Exception& Magick::Exception::operator=(
  const Magick::Exception& original_)
{
  if (this != &original_)
    this->_what=original_._what;
  return(*this);
}

const char* Magick::Exception::what() const throw()
{
  return(_what.c_str());
}

const Magick::Exception* Magick::Exception::nested() const throw()
{
  return(_nested);
}

void Magick::Exception::nested(Exception* nested_) throw()
{
  _nested=nested_;
}

Magick::Error::Error(const std::string& what_)
  : Exception(what_)
{
}

Magick::Error::Error(const std::string& what_,Exception *nested_)
  : Exception(what_,nested_)
{
}

Magick::Error::~Error() throw()
{
}

Magick::ErrorBlob::ErrorBlob(const std::string& what_)
  : Error(what_)
{
}

Magick::ErrorBlob::ErrorBlob(const std::string& what_,Exception *nested_)
  : Error(what_,nested_)
{
}

Magick::ErrorBlob::~ErrorBlob() throw()
{
}

Magick::ErrorCache::ErrorCache(const std::string& what_)
  : Error(what_)
{
}

Magick::ErrorCache::ErrorCache(const std::string& what_,Exception *nested_)
  : Error(what_,nested_)
{
}

Magick::ErrorCache::~ErrorCache() throw()
{
}

Magick::ErrorCoder::ErrorCoder(const std::string& what_)
  : Error(what_)
{
}

Magick::ErrorCoder::ErrorCoder(const std::string& what_,Exception *nested_)
  : Error(what_,nested_)
{
}

Magick::ErrorCoder::~ErrorCoder() throw()
{
}

Magick::ErrorConfigure::ErrorConfigure(const std::string& what_)
  : Error(what_)
{
}

Magick::ErrorConfigure::ErrorConfigure(const std::string& what_,
  Exception *nested_)
  : Error(what_,nested_)
{
}

Magick::ErrorConfigure::~ErrorConfigure() throw()
{
}

Magick::ErrorCorruptImage::ErrorCorruptImage(const std::string& what_)
  : Error(what_)
{
}

Magick::ErrorCorruptImage::ErrorCorruptImage(const std::string& what_,
  Exception *nested_)
  : Error(what_,nested_)
{
}

Magick::ErrorCorruptImage::~ErrorCorruptImage() throw()
{
}

Magick::ErrorDelegate::ErrorDelegate(const std::string& what_)
  : Error(what_)
{
}

Magick::ErrorDelegate::ErrorDelegate(const std::string& what_,
  Exception *nested_)
  : Error(what_,nested_)
{
}

Magick::ErrorDelegate::~ErrorDelegate()throw()
{
}

Magick::ErrorDraw::ErrorDraw(const std::string& what_)
  : Error(what_)
{
}

Magick::ErrorDraw::ErrorDraw(const std::string& what_,Exception *nested_)
  : Error(what_,nested_)
{
}

Magick::ErrorDraw::~ErrorDraw() throw()
{
}

Magick::ErrorFileOpen::ErrorFileOpen(const std::string& what_)
  : Error(what_)
{
}

Magick::ErrorFileOpen::~ErrorFileOpen() throw()
{
}

Magick::ErrorFileOpen::ErrorFileOpen(const std::string& what_,
  Exception *nested_)
  : Error(what_,nested_)
{
}


Magick::ErrorImage::ErrorImage(const std::string& what_)
  : Error(what_)
{
}

Magick::ErrorImage::ErrorImage(const std::string& what_,Exception *nested_)
  : Error(what_,nested_)
{
}

Magick::ErrorImage::~ErrorImage() throw()
{
}

Magick::ErrorMissingDelegate::ErrorMissingDelegate(const std::string& what_)
  : Error(what_)
{
}

Magick::ErrorMissingDelegate::ErrorMissingDelegate(const std::string& what_,
  Exception *nested_)
  : Error(what_,nested_)
{
}

Magick::ErrorMissingDelegate::~ErrorMissingDelegate() throw ()
{
}

Magick::ErrorModule::ErrorModule(const std::string& what_)
  : Error(what_)
{
}

Magick::ErrorModule::ErrorModule(const std::string& what_,Exception *nested_)
  : Error(what_,nested_)
{
}

Magick::ErrorModule::~ErrorModule() throw()
{
}

Magick::ErrorMonitor::ErrorMonitor(const std::string& what_)
  : Error(what_)
{
}

Magick::ErrorMonitor::ErrorMonitor(const std::string& what_,Exception *nested_)
  : Error(what_,nested_)
{
}

Magick::ErrorMonitor::~ErrorMonitor() throw()
{
}

Magick::ErrorOption::ErrorOption(const std::string& what_)
  : Error(what_)
{
}

Magick::ErrorOption::ErrorOption(const std::string& what_,Exception *nested_)
  : Error(what_,nested_)
{
}

Magick::ErrorOption::~ErrorOption() throw()
{
}

Magick::ErrorPolicy::ErrorPolicy(const std::string& what_)
  : Error(what_)
{
}

Magick::ErrorPolicy::ErrorPolicy(const std::string& what_,Exception *nested_)
  : Error(what_,nested_)
{
}

Magick::ErrorPolicy::~ErrorPolicy() throw()
{
}


Magick::ErrorRegistry::ErrorRegistry(const std::string& what_)
  : Error(what_)
{
}

Magick::ErrorRegistry::ErrorRegistry(const std::string& what_,
  Exception *nested_)
  : Error(what_,nested_)
{
}

Magick::ErrorRegistry::~ErrorRegistry() throw()
{
}

Magick::ErrorResourceLimit::ErrorResourceLimit(const std::string& what_)
  : Error(what_)
{
}

Magick::ErrorResourceLimit::ErrorResourceLimit(const std::string& what_,
  Exception *nested_)
  : Error(what_,nested_)
{
}

Magick::ErrorResourceLimit::~ErrorResourceLimit() throw()
{
}

Magick::ErrorStream::ErrorStream(const std::string& what_)
  : Error(what_)
{
}

Magick::ErrorStream::ErrorStream(const std::string& what_,Exception *nested_)
  : Error(what_,nested_)
{
}

Magick::ErrorStream::~ErrorStream() throw()
{
}

Magick::ErrorType::ErrorType(const std::string& what_)
  : Error(what_)
{
}

Magick::ErrorType::ErrorType(const std::string& what_,Exception *nested_)
  : Error(what_,nested_)
{
}

Magick::ErrorType::~ErrorType() throw()
{
}

Magick::ErrorUndefined::ErrorUndefined(const std::string& what_)
  : Error(what_)
{
}

Magick::ErrorUndefined::ErrorUndefined(const std::string& what_,
  Exception *nested_)
  : Error(what_,nested_)
{
}

Magick::ErrorUndefined::~ErrorUndefined() throw()
{
}

Magick::ErrorXServer::ErrorXServer(const std::string& what_)
  : Error(what_)
{
}

Magick::ErrorXServer::ErrorXServer(const std::string& what_,Exception *nested_)
  : Error(what_,nested_)
{
}

Magick::ErrorXServer::~ErrorXServer() throw ()
{
}

Magick::Warning::Warning(const std::string& what_)
  : Exception(what_)
{
}

Magick::Warning::Warning(const std::string& what_,Exception *nested_)
  : Exception(what_,nested_)
{
}

Magick::Warning::~Warning() throw()
{
}

Magick::WarningBlob::WarningBlob(const std::string& what_)
  : Warning(what_)
{
}

Magick::WarningBlob::WarningBlob(const std::string& what_,Exception *nested_)
  : Warning(what_,nested_)
{
}

Magick::WarningBlob::~WarningBlob() throw()
{
}

Magick::WarningCache::WarningCache(const std::string& what_)
  : Warning(what_)
{
}

Magick::WarningCache::WarningCache(const std::string& what_,Exception *nested_)
  : Warning(what_,nested_)
{
}

Magick::WarningCache::~WarningCache() throw()
{
}

Magick::WarningCoder::WarningCoder(const std::string& what_)
  : Warning(what_)
{
}

Magick::WarningCoder::WarningCoder(const std::string& what_,Exception *nested_)
  : Warning(what_,nested_)
{
}

Magick::WarningCoder::~WarningCoder() throw()
{
}

Magick::WarningConfigure::WarningConfigure(const std::string& what_)
  : Warning(what_)
{
}

Magick::WarningConfigure::WarningConfigure(const std::string& what_,
  Exception *nested_)
  : Warning(what_,nested_)
{
}

Magick::WarningConfigure::~WarningConfigure() throw()
{
}

Magick::WarningCorruptImage::WarningCorruptImage(const std::string& what_)
  : Warning(what_)
{
}

Magick::WarningCorruptImage::WarningCorruptImage(const std::string& what_,
  Exception *nested_)
  : Warning(what_,nested_)
{
}

Magick::WarningCorruptImage::~WarningCorruptImage() throw()
{
}

Magick::WarningDelegate::WarningDelegate(const std::string& what_)
  : Warning(what_)
{
}

Magick::WarningDelegate::WarningDelegate(const std::string& what_,
  Exception *nested_)
  : Warning(what_,nested_)
{
}

Magick::WarningDelegate::~WarningDelegate() throw()
{
}

Magick::WarningDraw::WarningDraw(const std::string& what_)
  : Warning(what_)
{
}

Magick::WarningDraw::WarningDraw(const std::string& what_,Exception *nested_)
  : Warning(what_,nested_)
{
}

Magick::WarningDraw::~WarningDraw() throw()
{
}

Magick::WarningFileOpen::WarningFileOpen(const std::string& what_)
  : Warning(what_)
{
}

Magick::WarningFileOpen::WarningFileOpen(const std::string& what_,
  Exception *nested_)
  : Warning(what_,nested_)
{
}

Magick::WarningFileOpen::~WarningFileOpen() throw()
{
}

Magick::WarningImage::WarningImage(const std::string& what_)
  : Warning(what_)
{
}

Magick::WarningImage::WarningImage(const std::string& what_,Exception *nested_)
  : Warning(what_,nested_)
{
}

Magick::WarningImage::~WarningImage() throw()
{
}

Magick::WarningMissingDelegate::WarningMissingDelegate(
  const std::string& what_)
  : Warning(what_)
{
}

Magick::WarningMissingDelegate::WarningMissingDelegate(
  const std::string& what_,Exception *nested_)
  : Warning(what_,nested_)
{
}

Magick::WarningMissingDelegate::~WarningMissingDelegate() throw()
{
}

Magick::WarningModule::WarningModule(const std::string& what_)
  : Warning(what_)
{
}

Magick::WarningModule::WarningModule(const std::string& what_,
  Exception *nested_)
  : Warning(what_,nested_)
{
}


Magick::WarningModule::~WarningModule() throw()
{
}

Magick::WarningMonitor::WarningMonitor(const std::string& what_)
  : Warning(what_)
{
}

Magick::WarningMonitor::WarningMonitor(const std::string& what_,
  Exception *nested_)
  : Warning(what_,nested_)
{
}

Magick::WarningMonitor::~WarningMonitor() throw()
{
}

Magick::WarningOption::WarningOption(const std::string& what_)
  : Warning(what_)
{
}

Magick::WarningOption::WarningOption(const std::string& what_,
  Exception *nested_)
  : Warning(what_,nested_)
{
}

Magick::WarningOption::~WarningOption() throw()
{
}

Magick::WarningRegistry::WarningRegistry(const std::string& what_)
  : Warning(what_)
{
}

Magick::WarningRegistry::WarningRegistry(const std::string& what_,
  Exception *nested_)
  : Warning(what_,nested_)
{
}

Magick::WarningRegistry::~WarningRegistry() throw()
{
}

Magick::WarningPolicy::WarningPolicy(const std::string& what_)
  : Warning(what_)
{
}

Magick::WarningPolicy::WarningPolicy(const std::string& what_,
  Exception *nested_)
  : Warning(what_,nested_)
{
}

Magick::WarningPolicy::~WarningPolicy() throw()
{
}

Magick::WarningResourceLimit::WarningResourceLimit(const std::string& what_)
  : Warning(what_)
{
}

Magick::WarningResourceLimit::WarningResourceLimit(const std::string& what_,
  Exception *nested_)
  : Warning(what_,nested_)
{
}

Magick::WarningResourceLimit::~WarningResourceLimit() throw()
{
}

Magick::WarningStream::WarningStream(const std::string& what_)
  : Warning(what_)
{
}

Magick::WarningStream::WarningStream(const std::string& what_,
  Exception *nested_)
  : Warning(what_,nested_)
{
}

Magick::WarningStream::~WarningStream() throw()
{
}

Magick::WarningType::WarningType(const std::string& what_)
  : Warning(what_)
{
}

Magick::WarningType::WarningType(const std::string& what_,Exception *nested_)
  : Warning(what_,nested_)
{
}

Magick::WarningType::~WarningType() throw()
{
}

Magick::WarningUndefined::WarningUndefined(const std::string& what_)
  : Warning(what_)
{
}

Magick::WarningUndefined::WarningUndefined(const std::string& what_,
  Exception *nested_)
  : Warning(what_,nested_)
{
}

Magick::WarningUndefined::~WarningUndefined() throw()
{
}

Magick::WarningXServer::WarningXServer(const std::string& what_)
  : Warning(what_)
{
}

Magick::WarningXServer::WarningXServer(const std::string& what_,
  Exception *nested_)
  : Warning(what_,nested_)
{
}

Magick::WarningXServer::~WarningXServer() throw()
{
}

std::string Magick::formatExceptionMessage(const MagickCore::ExceptionInfo *exception_)
{
  // Format error message ImageMagick-style
  std::string message=GetClientName();
  if (exception_->reason != (char *) NULL)
    {
      message+=std::string(": ");
      message+=std::string(exception_->reason);
    }

  if (exception_->description != (char *) NULL)
    message += " (" + std::string(exception_->description) + ")";
  return(message);
}

Magick::Exception* Magick::createException(const MagickCore::ExceptionInfo *exception_)
{
  std::string message=formatExceptionMessage(exception_);
  switch (exception_->severity)
  {
    case MagickCore::BlobError:
    case MagickCore::BlobFatalError:
      return new ErrorBlob(message);
    case MagickCore::BlobWarning:
      return new WarningBlob(message);
    case MagickCore::CacheError:
    case MagickCore::CacheFatalError:
      return new ErrorCache(message);
    case MagickCore::CacheWarning:
      return new WarningCache(message);
    case MagickCore::CoderError:
    case MagickCore::CoderFatalError:
      return new ErrorCoder(message);
    case MagickCore::CoderWarning:
      return new WarningCoder(message);
    case MagickCore::ConfigureError:
    case MagickCore::ConfigureFatalError:
      return new ErrorConfigure(message);
    case MagickCore::ConfigureWarning:
      return new WarningConfigure(message);
    case MagickCore::CorruptImageError:
    case MagickCore::CorruptImageFatalError:
      return new ErrorCorruptImage(message);
    case MagickCore::CorruptImageWarning:
      return new WarningCorruptImage(message);
    case MagickCore::DelegateError:
    case MagickCore::DelegateFatalError:
      return new ErrorDelegate(message);
    case MagickCore::DelegateWarning:
      return new WarningDelegate(message);
    case MagickCore::DrawError:
    case MagickCore::DrawFatalError:
      return new ErrorDraw(message);
    case MagickCore::DrawWarning:
      return new WarningDraw(message);
    case MagickCore::FileOpenError:
    case MagickCore::FileOpenFatalError:
      return new ErrorFileOpen(message);
    case MagickCore::FileOpenWarning:
      return new WarningFileOpen(message);
    case MagickCore::ImageError:
    case MagickCore::ImageFatalError:
      return new ErrorImage(message);
    case MagickCore::ImageWarning:
      return new WarningImage(message);
    case MagickCore::MissingDelegateError:
    case MagickCore::MissingDelegateFatalError:
      return new ErrorMissingDelegate(message);
    case MagickCore::MissingDelegateWarning:
      return new WarningMissingDelegate(message);
    case MagickCore::ModuleError:
    case MagickCore::ModuleFatalError:
      return new ErrorModule(message);
    case MagickCore::ModuleWarning:
      return new WarningModule(message);
    case MagickCore::MonitorError:
    case MagickCore::MonitorFatalError:
      return new ErrorMonitor(message);
    case MagickCore::MonitorWarning:
      return new WarningMonitor(message);
    case MagickCore::OptionError:
    case MagickCore::OptionFatalError:
      return new ErrorOption(message);
    case MagickCore::OptionWarning:
      return new WarningOption(message);
    case MagickCore::PolicyWarning:
      return new WarningPolicy(message);
    case MagickCore::PolicyError:
    case MagickCore::PolicyFatalError:
      return new ErrorPolicy(message);
    case MagickCore::RegistryError:
    case MagickCore::RegistryFatalError:
      return new ErrorRegistry(message);
    case MagickCore::RegistryWarning:
      return new WarningRegistry(message);
    case MagickCore::ResourceLimitError:
    case MagickCore::ResourceLimitFatalError:
      return new ErrorResourceLimit(message);
    case MagickCore::ResourceLimitWarning:
      return new WarningResourceLimit(message);
    case MagickCore::StreamError:
    case MagickCore::StreamFatalError:
      return new ErrorStream(message);
    case MagickCore::StreamWarning:
      return new WarningStream(message);
    case MagickCore::TypeError:
    case MagickCore::TypeFatalError:
      return new ErrorType(message);
    case MagickCore::TypeWarning:
      return new WarningType(message);
    case MagickCore::UndefinedException:
    default:
      return new ErrorUndefined(message);
    case MagickCore::XServerError:
    case MagickCore::XServerFatalError:
      return new ErrorXServer(message);
    case MagickCore::XServerWarning:
      return new WarningXServer(message);
    }
}

MagickPPExport void Magick::throwExceptionExplicit(
  const MagickCore::ExceptionType severity_,const char* reason_,
  const char* description_)
{
  // Just return if there is no reported error
  if (severity_ == MagickCore::UndefinedException)
    return;

  GetPPException;
  ThrowException(exceptionInfo,severity_,reason_,description_);
  ThrowPPException(false);
}

MagickPPExport void Magick::throwException(ExceptionInfo *exception_,
  const bool quiet_)
{
  const ExceptionInfo
    *p;

  Exception
    *nestedException,
    *q;

  MagickCore::ExceptionType
    severity;

  size_t
    index;

  std::string
    message;

  // Just return if there is no reported error
  if (exception_->severity == MagickCore::UndefinedException)
    return;

  message=formatExceptionMessage(exception_);
  nestedException=(Exception *) NULL;
  q=(Exception *) NULL;
  LockSemaphoreInfo(exception_->semaphore);
  if (exception_->exceptions != (void *) NULL)
    {
      index=GetNumberOfElementsInLinkedList((LinkedListInfo *)
        exception_->exceptions);
      while(index > 0)
      {
        p=(const ExceptionInfo *) GetValueFromLinkedList((LinkedListInfo *)
          exception_->exceptions,--index);
        if ((p->severity != exception_->severity) || (LocaleCompare(p->reason,
            exception_->reason) != 0) || (LocaleCompare(p->description,
            exception_->description) != 0))
          {
            if (nestedException == (Exception *) NULL)
              {
                nestedException=createException(p);
                q=nestedException;
              }
            else
              {
                Exception
                  *r;

                r=createException(p);
                q->nested(r);
                q=r;
              }
          }
      }
    }
  severity=exception_->severity;
  UnlockSemaphoreInfo(exception_->semaphore);

  if ((quiet_) && (severity < MagickCore::ErrorException))
    {
      delete nestedException;
      return;
    }

  DestroyExceptionInfo(exception_);

  switch (severity)
  {
    case MagickCore::BlobError:
    case MagickCore::BlobFatalError:
      throw ErrorBlob(message,nestedException);
    case MagickCore::BlobWarning:
      throw WarningBlob(message,nestedException);
    case MagickCore::CacheError:
    case MagickCore::CacheFatalError:
      throw ErrorCache(message,nestedException);
    case MagickCore::CacheWarning:
      throw WarningCache(message,nestedException);
    case MagickCore::CoderError:
    case MagickCore::CoderFatalError:
      throw ErrorCoder(message,nestedException);
    case MagickCore::CoderWarning:
      throw WarningCoder(message,nestedException);
    case MagickCore::ConfigureError:
    case MagickCore::ConfigureFatalError:
      throw ErrorConfigure(message,nestedException);
    case MagickCore::ConfigureWarning:
      throw WarningConfigure(message,nestedException);
    case MagickCore::CorruptImageError:
    case MagickCore::CorruptImageFatalError:
      throw ErrorCorruptImage(message,nestedException);
    case MagickCore::CorruptImageWarning:
      throw WarningCorruptImage(message,nestedException);
    case MagickCore::DelegateError:
    case MagickCore::DelegateFatalError:
      throw ErrorDelegate(message,nestedException);
    case MagickCore::DelegateWarning:
      throw WarningDelegate(message,nestedException);
    case MagickCore::DrawError:
    case MagickCore::DrawFatalError:
      throw ErrorDraw(message,nestedException);
    case MagickCore::DrawWarning:
      throw WarningDraw(message,nestedException);
    case MagickCore::FileOpenError:
    case MagickCore::FileOpenFatalError:
      throw ErrorFileOpen(message,nestedException);
    case MagickCore::FileOpenWarning:
      throw WarningFileOpen(message,nestedException);
    case MagickCore::ImageError:
    case MagickCore::ImageFatalError:
      throw ErrorImage(message,nestedException);
    case MagickCore::ImageWarning:
      throw WarningImage(message,nestedException);
    case MagickCore::MissingDelegateError:
    case MagickCore::MissingDelegateFatalError:
      throw ErrorMissingDelegate(message,nestedException);
    case MagickCore::MissingDelegateWarning:
      throw WarningMissingDelegate(message,nestedException);
    case MagickCore::ModuleError:
    case MagickCore::ModuleFatalError:
      throw ErrorModule(message,nestedException);
    case MagickCore::ModuleWarning:
      throw WarningModule(message,nestedException);
    case MagickCore::MonitorError:
    case MagickCore::MonitorFatalError:
      throw ErrorMonitor(message,nestedException);
    case MagickCore::MonitorWarning:
      throw WarningMonitor(message,nestedException);
    case MagickCore::OptionError:
    case MagickCore::OptionFatalError:
      throw ErrorOption(message,nestedException);
    case MagickCore::OptionWarning:
      throw WarningOption(message,nestedException);
    case MagickCore::PolicyWarning:
      throw WarningPolicy(message,nestedException);
    case MagickCore::PolicyError:
    case MagickCore::PolicyFatalError:
      throw ErrorPolicy(message,nestedException);
    case MagickCore::RegistryError:
    case MagickCore::RegistryFatalError:
      throw ErrorRegistry(message,nestedException);
    case MagickCore::RegistryWarning:
      throw WarningRegistry(message,nestedException);
    case MagickCore::ResourceLimitError:
    case MagickCore::ResourceLimitFatalError:
      throw ErrorResourceLimit(message,nestedException);
    case MagickCore::ResourceLimitWarning:
      throw WarningResourceLimit(message,nestedException);
    case MagickCore::StreamError:
    case MagickCore::StreamFatalError:
      throw ErrorStream(message,nestedException);
    case MagickCore::StreamWarning:
      throw WarningStream(message,nestedException);
    case MagickCore::TypeError:
    case MagickCore::TypeFatalError:
      throw ErrorType(message,nestedException);
    case MagickCore::TypeWarning:
      throw WarningType(message,nestedException);
    case MagickCore::UndefinedException:
    default:
      throw ErrorUndefined(message,nestedException);
    case MagickCore::XServerError:
    case MagickCore::XServerFatalError:
      throw ErrorXServer(message,nestedException);
    case MagickCore::XServerWarning:
      throw WarningXServer(message,nestedException);
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Functions.cpp]---
Location: ImageMagick-main/Magick++/lib/Functions.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2002, 2003
//
// Copyright @ 2014 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Simple C++ function wrappers for ImageMagick equivalents
//

#define MAGICKCORE_IMPLEMENTATION  1
#define MAGICK_PLUSPLUS_IMPLEMENTATION 1

#include "Magick++/Include.h"
#include <string>

#include "Magick++/Functions.h"
#include "Magick++/Exception.h"

using namespace std;

static bool magick_initialized=false;

// Clone C++ string as allocated C string, de-allocating any existing string
MagickPPExport void Magick::CloneString(char **destination_,
  const std::string &source_)
{
  MagickCore::CloneString(destination_,source_.c_str());
}

MagickPPExport void Magick::DisableOpenCL(void)
{
  MagickCore::SetOpenCLEnabled(MagickFalse);
}

MagickPPExport bool Magick::EnableOpenCL(void)
{
  bool
    status;

 status=MagickCore::SetOpenCLEnabled(MagickTrue) != MagickFalse;
 return(status);
}

MagickPPExport void Magick::InitializeMagick(const char *path_)
{
  MagickCore::MagickCoreGenesis(path_,MagickFalse);
  if (!magick_initialized)
    magick_initialized=true;
}

MagickPPExport void Magick::SetRandomSeed(const unsigned long seed)
{
  MagickCore::SetRandomSecretKey(seed);
}

MagickPPExport bool Magick::SetSecurityPolicy(const std::string &policy_)
{
  bool
    status;

  GetPPException;
  status=MagickCore::SetMagickSecurityPolicy(policy_.c_str(),
    exceptionInfo) != MagickFalse;
  ThrowPPException(false);
  return(status);
}

MagickPPExport void Magick::TerminateMagick(void)
{
  if (magick_initialized)
    {
      magick_initialized=false;
      MagickCore::MagickWandTerminus();
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Geometry.cpp]---
Location: ImageMagick-main/Magick++/lib/Geometry.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2001, 2002, 2003
//
// Copyright @ 2014 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Geometry implementation
//

#define MAGICKCORE_IMPLEMENTATION  1
#define MAGICK_PLUSPLUS_IMPLEMENTATION 1

#include "Magick++/Include.h"
#include <string>
#include <ctype.h> // for isdigit
#if !defined(MAGICKCORE_WINDOWS_SUPPORT)
#include <strings.h>
#endif

#include "Magick++/Geometry.h"
#include "Magick++/Exception.h"

using namespace std;

MagickPPExport int Magick::operator == (const Magick::Geometry& left_,
  const Magick::Geometry& right_)
{
  return((left_.aspect() == right_.aspect()) &&
    (left_.fillArea() == right_.fillArea()) &&
    (left_.greater() == right_.greater()) &&
    (left_.height() == right_.height()) &&
    (left_.isValid() == right_.isValid()) &&
    (left_.less() == right_.less()) &&
    (left_.limitPixels() == right_.limitPixels()) &&
    (left_.percent() == right_.percent()) &&
    (left_.width() == right_.width()) &&
    (left_.xOff() == right_.xOff()) &&
    (left_.yOff() == right_.yOff()));
}

MagickPPExport int Magick::operator != (const Magick::Geometry& left_,
  const Magick::Geometry& right_)
{
  return(!(left_ == right_));
}

MagickPPExport int Magick::operator > (const Magick::Geometry& left_,
  const Magick::Geometry& right_)
{
  return(!(left_ < right_) && (left_ != right_));
}

MagickPPExport int Magick::operator < (const Magick::Geometry& left_,
  const Magick::Geometry& right_)
{
  return((left_.width()*left_.height()) < (right_.width()*right_.height()));
}

MagickPPExport int Magick::operator >= (const Magick::Geometry& left_,
  const Magick::Geometry& right_)
{
  return((left_ > right_) || (left_ == right_));
}

MagickPPExport int Magick::operator <= (const Magick::Geometry& left_,
  const Magick::Geometry& right_ )
{
  return((left_ < right_) || (left_ == right_));
}

Magick::Geometry::Geometry(void)
  : _width(0),
    _height(0),
    _xOff(0),
    _yOff(0),
    _isValid(false),
    _percent(false),
    _aspect(false),
    _greater(false),
    _less(false),
    _fillArea(false),
    _limitPixels(false)
{
}

Magick::Geometry::Geometry(const char *geometry_)
  : _width(0),
    _height(0),
    _xOff(0),
    _yOff(0),
    _isValid(false),
    _percent(false),
    _aspect(false),
    _greater(false),
    _less(false),
    _fillArea(false),
    _limitPixels(false)
{
  *this=geometry_; // Use assignment operator
}

Magick::Geometry::Geometry(const Geometry &geometry_)
  : _width(geometry_._width),
    _height(geometry_._height),
    _xOff(geometry_._xOff),
    _yOff(geometry_._yOff),
    _isValid(geometry_._isValid),
    _percent(geometry_._percent),
    _aspect(geometry_._aspect),
    _greater(geometry_._greater),
    _less(geometry_._less),
    _fillArea(geometry_._fillArea),
    _limitPixels(geometry_._limitPixels)
{
}

Magick::Geometry::Geometry(const std::string &geometry_)
  : _width(0),
    _height(0),
    _xOff(0),
    _yOff(0),
    _isValid(false),
    _percent(false),
    _aspect(false),
    _greater(false),
    _less(false),
    _fillArea(false),
    _limitPixels(false)
{
  *this=geometry_; // Use assignment operator
}

Magick::Geometry::Geometry(size_t width_,size_t height_,ssize_t xOff_,
  ssize_t yOff_)
  : _width(width_),
    _height(height_),
    _xOff(xOff_),
    _yOff(yOff_),
    _isValid(true),
    _percent(false),
    _aspect(false),
    _greater(false),
    _less(false),
    _fillArea(false),
    _limitPixels(false)
{
}

Magick::Geometry::~Geometry(void)
{
}

const Magick::Geometry& Magick::Geometry::operator=(const char *geometry_)
{
  *this=std::string(geometry_);
  return(*this);
}

Magick::Geometry& Magick::Geometry::operator=(const Geometry &geometry_)
{
  // If not being set to ourself
  if (this != &geometry_)
    {
      _width=geometry_._width;
      _height=geometry_._height;
      _xOff=geometry_._xOff;
      _yOff=geometry_._yOff;
      _isValid=geometry_._isValid;
      _percent=geometry_._percent;
      _aspect=geometry_._aspect;
      _greater=geometry_._greater;
      _less=geometry_._less;
      _fillArea=geometry_._fillArea;
      _limitPixels=geometry_._limitPixels;
    }
  return(*this);
}

const Magick::Geometry& Magick::Geometry::operator=(
  const std::string &geometry_)
{
  char
    geom[MagickPathExtent];

  char
    *pageptr;

  ssize_t
    flags,
    x = 0,
    y = 0;

  size_t
    height_val=0,
    width_val=0;

  // If argument does not start with digit, presume that it is a
  // page-size specification that needs to be converted to an
  // equivalent geometry specification using PostscriptGeometry()
  (void) CopyMagickString(geom,geometry_.c_str(),MagickPathExtent);
  if (geom[0] != '-' && geom[0] != '+' && geom[0] != 'x' &&
      !isdigit(static_cast<int>(geom[0])))
    {
      pageptr=GetPageGeometry(geom);
      if (pageptr != 0)
        {
          (void) CopyMagickString(geom,pageptr,MagickPathExtent);
          pageptr=(char *) RelinquishMagickMemory(pageptr);
        }
    }

  flags=GetGeometry(geom,&x,&y,&width_val,&height_val);

  if (flags == NoValue)
    {
      // Total failure!
      *this=Geometry();
      isValid(false);
      return(*this);
    }

  if ((flags & WidthValue) != 0)
    {
      _width=width_val;
      isValid(true);
    }

  if ((flags & HeightValue) != 0)
    {
      _height=height_val;
      isValid(true);
    }

  if ((flags & XValue) != 0)
    {
      _xOff=static_cast<ssize_t>(x);
      isValid(true);
    }

  if ((flags & YValue) != 0)
    {
      _yOff=static_cast<ssize_t>(y);
      isValid(true);
    }

  if ((flags & PercentValue) != 0)
    _percent=true;

  if ((flags & AspectValue) != 0)
    _aspect=true;

  if ((flags & LessValue) != 0)
    _less=true;

  if ((flags & GreaterValue) != 0)
    _greater=true;

  if ((flags & MinimumValue) != 0)
    _fillArea=true;

  if ((flags & AreaValue) != 0)
    _limitPixels=true;

  return(*this);
}

Magick::Geometry::operator std::string() const
{
  char
    buffer[MagickPathExtent];

  std::string
    geometry;

  if (!isValid())
    throwExceptionExplicit(MagickCore::OptionError,
      "Invalid geometry argument");

  if (_width)
    {
      FormatLocaleString(buffer,MagickPathExtent,"%.20g",(double) _width);
      geometry+=buffer;
    }

  if (_height)
    {
      FormatLocaleString(buffer,MagickPathExtent,"%.20g",(double) _height);
      geometry+='x';
      geometry+=buffer;
    }

  if (_xOff || _yOff)
    {
      if (_xOff >= 0)
        geometry+='+';

      FormatLocaleString(buffer,MagickPathExtent,"%.20g",(double) _xOff);
      geometry+=buffer;

      if (_yOff >= 0)
        geometry+='+';

      FormatLocaleString(buffer,MagickPathExtent,"%.20g",(double) _yOff);
      geometry+=buffer;
    }

  if (_percent)
    geometry+='%';

  if (_aspect)
    geometry+='!';

  if (_greater)
    geometry+='>';

  if (_less)
    geometry+='<';

  if (_fillArea)
    geometry+='^';

  if (_limitPixels)
    geometry+='@';

  return(geometry);
}

void Magick::Geometry::aspect(bool aspect_)
{
  _aspect=aspect_;
}

bool Magick::Geometry::aspect(void) const
{
  return(_aspect);
}

void Magick::Geometry::fillArea(bool fillArea_)
{
  _fillArea=fillArea_;
}

bool Magick::Geometry::fillArea(void) const
{
  return(_fillArea);
}

void Magick::Geometry::greater(bool greater_)
{
  _greater=greater_;
}

bool Magick::Geometry::greater(void) const
{
  return(_greater);
}

void Magick::Geometry::height(size_t height_)
{
  _height=height_;
}

size_t Magick::Geometry::height(void) const
{
  return(_height);
}

void Magick::Geometry::isValid(bool isValid_)
{
  _isValid=isValid_;
}

bool Magick::Geometry::isValid(void) const
{
  return(_isValid);
}

void Magick::Geometry::less(bool less_)
{
  _less=less_;
}

bool Magick::Geometry::less(void) const
{
  return(_less);
}

void Magick::Geometry::limitPixels(bool limitPixels_)
{
  _limitPixels=limitPixels_;
}

bool Magick::Geometry::limitPixels(void) const
{
  return(_limitPixels);
}

void Magick::Geometry::width(size_t width_)
{
  _width=width_;
  isValid(true);
}

void Magick::Geometry::percent(bool percent_)
{
  _percent = percent_;
}

bool Magick::Geometry::percent(void) const
{
  return(_percent);
}

size_t Magick::Geometry::width(void) const
{
  return(_width);
}

void Magick::Geometry::xOff(::ssize_t xOff_)
{
  _xOff=xOff_;
}

::ssize_t Magick::Geometry::xOff(void) const
{
  return(_xOff);
}

void Magick::Geometry::yOff(::ssize_t yOff_)
{
  _yOff=yOff_;
}

::ssize_t Magick::Geometry::yOff(void) const
{
  return(_yOff);
}

Magick::Geometry::Geometry(const MagickCore::RectangleInfo &rectangle_)
  : _width(static_cast<size_t>(rectangle_.width)),
    _height(static_cast<size_t>(rectangle_.height)),
    _xOff(static_cast<ssize_t>(rectangle_.x)),
    _yOff(static_cast<ssize_t>(rectangle_.y)),
    _isValid(true),
    _percent(false),
    _aspect(false),
    _greater(false),
    _less(false),
    _fillArea(false),
    _limitPixels(false)
{
}

const Magick::Geometry& Magick::Geometry::operator=(
  const MagickCore::RectangleInfo &rectangle_)
{
  _width=static_cast<size_t>(rectangle_.width),
  _height=static_cast<size_t>(rectangle_.height),
  _xOff=static_cast<ssize_t>(rectangle_.x),
  _yOff=static_cast<ssize_t>(rectangle_.y),
  _isValid=true;
  return(*this);
}

Magick::Geometry::operator MagickCore::RectangleInfo() const
{
  RectangleInfo rectangle;
  rectangle.width=_width;
  rectangle.height=_height;
  rectangle.x=_xOff;
  rectangle.y=_yOff;
  return(rectangle);
}

MagickPPExport int Magick::operator == (const Magick::Offset& left_,
  const Magick::Offset& right_)
{
  return((left_.x() == right_.x()) &&
    (left_.y() == right_.y()));
}

MagickPPExport int Magick::operator != (const Magick::Offset& left_,
  const Magick::Offset& right_)
{
  return(!(left_ == right_));
}

Magick::Offset::Offset(void)
  : _x(0),
    _y(0)
{
}

Magick::Offset::Offset(const char *offset_)
  : _x(0),
    _y(0)
{
  *this=offset_; // Use assignment operator
}

Magick::Offset::Offset(const Offset &offset_)
  : _x(offset_._x),
    _y(offset_._y)
{
}

Magick::Offset::Offset(const std::string &offset_)
  : _x(0),
    _y(0)
{
  *this=offset_; // Use assignment operator
}

Magick::Offset::Offset(ssize_t x_,ssize_t y_)
  : _x(x_),
    _y(y_)
{
}

Magick::Offset::~Offset(void)
{
}

const Magick::Offset& Magick::Offset::operator=(const char *offset_)
{
  MagickCore::GeometryInfo
    geometry_info;

  MagickCore::MagickStatusType
    flags;

  flags=ParseGeometry(offset_,&geometry_info);
  _x=(ssize_t) geometry_info.rho;
  _y=(ssize_t) geometry_info.sigma;
  if ((flags & MagickCore::SigmaValue) == 0)
    _y=_x;
  return(*this);
}

Magick::Offset& Magick::Offset::operator=(const Offset &offset_)
{
  // If not being set to ourself
  if (this != &offset_)
    {
      _x=offset_._x;
      _y=offset_._y;
    }
  return(*this);
}

const Magick::Offset& Magick::Offset::operator=(const std::string &offset_)
{
  *this=offset_.c_str();
  return(*this);
}

ssize_t Magick::Offset::x(void) const
{
  return(_x);
}

ssize_t Magick::Offset::y(void) const
{
  return(_y);
}

Magick::Offset::operator MagickCore::OffsetInfo() const
{
  OffsetInfo offset;
  offset.x=_x;
  offset.y=_y;
  return(offset);
}

MagickPPExport int Magick::operator == (const Magick::Point& left_,
  const Magick::Point& right_)
{
  return((left_.x() == right_.x()) &&
    (left_.y() == right_.y()));
}

MagickPPExport int Magick::operator != (const Magick::Point& left_,
  const Magick::Point& right_)
{
  return(!(left_ == right_));
}

Magick::Point::Point(void)
  : _x(0.0),
    _y(0.0)
{
}

Magick::Point::Point(const char *point_)
  : _x(0.0),
    _y(0.0)
{
  *this=point_; // Use assignment operator
}

Magick::Point::Point(const Point &point_)
  : _x(point_._x),
    _y(point_._y)
{
}

Magick::Point::Point(const std::string &point_)
  : _x(0.0),
    _y(0.0)
{
  *this=point_; // Use assignment operator
}

Magick::Point::Point(double x_,double y_)
  : _x(x_),
    _y(y_)
{
}

Magick::Point::Point(double xy_)
  : _x(xy_),
    _y(xy_)
{
}

Magick::Point::~Point(void)
{
}

const Magick::Point& Magick::Point::operator=(const char *point_)
{
  MagickCore::GeometryInfo
    geometry_info;

  MagickCore::MagickStatusType
    flags;

  flags=ParseGeometry(point_,&geometry_info);
  _x=geometry_info.rho;
  _y=geometry_info.sigma;
  if ((flags & MagickCore::SigmaValue) == 0)
    _y=_x;
  return(*this);
}

const Magick::Point& Magick::Point::operator=(const double xy_)
{
  _x=xy_;
  _y=xy_;
  return(*this);
}

Magick::Point& Magick::Point::operator=(const Point &point_)
{
  // If not being set to ourself
  if (this != &point_)
    {
      _x=point_._x;
      _y=point_._y;
    }
  return(*this);
}

const Magick::Point& Magick::Point::operator=(const std::string &point_)
{
  *this=point_.c_str();
  return(*this);
}

Magick::Point::operator std::string() const
{
  char
    buffer[MagickPathExtent];

  string
    point;

  if (_x < 0.0)
    point+="-";
  else
    point+="+";

  FormatLocaleString(buffer,MagickPathExtent,"%.20g",_x);
  point+=buffer;

  if (_y < 0.0)
    point+="x-";
  else
    point+="x+";

  FormatLocaleString(buffer,MagickPathExtent,"%.20g",(double) _y);
  point+=buffer;

  return(point);
}

bool Magick::Point::isValid(void) const
{
  return(_x > 0.0);
}

double Magick::Point::x(void) const
{
  return(_x);
}

double Magick::Point::y(void) const
{
  return(_y);
}
```

--------------------------------------------------------------------------------

````

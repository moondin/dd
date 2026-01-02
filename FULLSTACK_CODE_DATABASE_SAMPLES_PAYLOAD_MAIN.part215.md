---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 215
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 215 of 695)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - payload-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/payload-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: getFileTypeFallback.ts]---
Location: payload-main/packages/payload/src/uploads/getFileTypeFallback.ts

```typescript
type ReturnType = {
  ext: string
  mime: string
}

const extensionMap: {
  [ext: string]: string
} = {
  css: 'text/css',
  csv: 'text/csv',
  htm: 'text/html',
  html: 'text/html',
  js: 'application/javascript',
  json: 'application/json',
  md: 'text/markdown',
  svg: 'image/svg+xml',
  xml: 'application/xml',
  yml: 'application/x-yaml',
}

export const getFileTypeFallback = (path: string): ReturnType => {
  const ext = path.split('.').pop() || 'txt'

  return {
    ext,
    mime: extensionMap[ext] || 'text/plain',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getImageSize.ts]---
Location: payload-main/packages/payload/src/uploads/getImageSize.ts

```typescript
import fs from 'fs/promises'
import { imageSize } from 'image-size'
import { imageSizeFromFile } from 'image-size/fromFile'

import type { PayloadRequest } from '../types/index.js'
import type { ProbedImageSize } from './types.js'

import { temporaryFileTask } from './tempFile.js'

export async function getImageSize(file: PayloadRequest['file']): Promise<ProbedImageSize> {
  if (file?.tempFilePath) {
    return imageSizeFromFile(file.tempFilePath)
  }

  // Tiff file do not support buffers or streams, so we must write to file first
  // then retrieve dimensions. https://github.com/image-size/image-size/issues/103
  if (file?.mimetype === 'image/tiff') {
    const dimensions = await temporaryFileTask(
      async (filepath: string) => {
        await fs.writeFile(filepath, file.data)
        return imageSizeFromFile(filepath)
      },
      { extension: 'tiff' },
    )
    return dimensions
  }

  return imageSize(file!.data)
}
```

--------------------------------------------------------------------------------

---[FILE: getSafeFilename.ts]---
Location: payload-main/packages/payload/src/uploads/getSafeFilename.ts

```typescript
import sanitize from 'sanitize-filename'

import type { PayloadRequest } from '../types/index.js'

import { docWithFilenameExists } from './docWithFilenameExists.js'
import { fileExists } from './fileExists.js'

const incrementName = (name: string) => {
  const extension = name.split('.').pop()
  const baseFilename = sanitize(name.substring(0, name.lastIndexOf('.')) || name)
  let incrementedName = baseFilename
  const regex = /(.*)-(\d+)$/
  const found = baseFilename.match(regex)
  if (found === null) {
    incrementedName += '-1'
  } else {
    const matchedName = found[1]
    const matchedNumber = found[2]
    const incremented = Number(matchedNumber) + 1
    incrementedName = `${matchedName}-${incremented}`
  }
  return `${incrementedName}.${extension}`
}

type Args = {
  collectionSlug: string
  desiredFilename: string
  prefix?: string
  req: PayloadRequest
  staticPath: string
}

export async function getSafeFileName({
  collectionSlug,
  desiredFilename,
  prefix,
  req,
  staticPath,
}: Args): Promise<string> {
  let modifiedFilename = desiredFilename

  while (
    (await docWithFilenameExists({
      collectionSlug,
      filename: modifiedFilename,
      path: staticPath,
      prefix,
      req,
    })) ||
    (await fileExists(`${staticPath}/${modifiedFilename}`))
  ) {
    modifiedFilename = incrementName(modifiedFilename)
  }
  return modifiedFilename
}
```

--------------------------------------------------------------------------------

---[FILE: imageResizer.ts]---
Location: payload-main/packages/payload/src/uploads/imageResizer.ts

```typescript
import type { Sharp, Metadata as SharpMetadata, SharpOptions } from 'sharp'

import { fileTypeFromBuffer } from 'file-type'
import fs from 'fs/promises'
import sanitize from 'sanitize-filename'

import type { SanitizedCollectionConfig } from '../collections/config/types.js'
import type { SharpDependency } from '../config/types.js'
import type { PayloadRequest } from '../types/index.js'
import type { WithMetadata } from './optionallyAppendMetadata.js'
import type {
  FileSize,
  FileSizes,
  FileToSave,
  ImageSize,
  ProbedImageSize,
  UploadEdits,
} from './types.js'

import { isNumber } from '../utilities/isNumber.js'
import { fileExists } from './fileExists.js'
import { optionallyAppendMetadata } from './optionallyAppendMetadata.js'

type ResizeArgs = {
  config: SanitizedCollectionConfig
  dimensions: ProbedImageSize
  file: PayloadRequest['file']
  mimeType: string
  req: PayloadRequest
  savedFilename: string
  sharp?: SharpDependency
  staticPath: string
  uploadEdits?: UploadEdits
  withMetadata?: WithMetadata
}

/** Result from resizing and transforming the requested image sizes */
type ImageSizesResult = {
  focalPoint?: UploadEdits['focalPoint']
  sizeData: FileSizes
  sizesToSave: FileToSave[]
}

type SanitizedImageData = {
  ext: string
  name: string
}

/**
 * Sanitize the image name and extract the extension from the source image
 *
 * @param sourceImage - the source image
 * @returns the sanitized name and extension
 */
const getSanitizedImageData = (sourceImage: string): SanitizedImageData => {
  const extension = sourceImage.split('.').pop()
  const name = sanitize(sourceImage.substring(0, sourceImage.lastIndexOf('.')) || sourceImage)
  return { name, ext: extension! }
}

/**
 * Create a new image name based on the output image name, the dimensions and
 * the extension.
 *
 * Ignore the fact that duplicate names could happen if the there is one
 * size with `width AND height` and one with only `height OR width`. Because
 * space is expensive, we will reuse the same image for both sizes.
 *
 * @param outputImageName - the sanitized image name
 * @param bufferInfo - the buffer info
 * @param extension - the extension to use
 * @returns the new image name that is not taken
 */
type CreateImageNameArgs = {
  extension: string
  height: number
  outputImageName: string
  width: number
}
const createImageName = ({
  extension,
  height,
  outputImageName,
  width,
}: CreateImageNameArgs): string => {
  return `${outputImageName}-${width}x${height}.${extension}`
}

type CreateResultArgs = {
  filename?: FileSize['filename']
  filesize?: FileSize['filesize']
  height?: FileSize['height']
  mimeType?: FileSize['mimeType']
  name: string
  sizesToSave?: FileToSave[]
  width?: FileSize['width']
}

/**
 * Create the result object for the image resize operation based on the
 * provided parameters. If the name is not provided, an empty result object
 * is returned.
 *
 * @param name - the name of the image
 * @param filename - the filename of the image
 * @param width - the width of the image
 * @param height - the height of the image
 * @param filesize - the filesize of the image
 * @param mimeType - the mime type of the image
 * @param sizesToSave - the sizes to save
 * @returns the result object
 */
const createResult = ({
  name,
  filename = null,
  filesize = null,
  height = null,
  mimeType = null,
  sizesToSave = [],
  width = null,
}: CreateResultArgs): ImageSizesResult => {
  return {
    sizeData: {
      [name]: {
        filename,
        filesize,
        height,
        mimeType,
        width,
      },
    },
    sizesToSave,
  }
}

/**
 * Determine whether or not to resize the image.
 * - resize using image config
 * - resize using image config with focal adjustments
 * - do not resize at all
 *
 * `imageResizeConfig.withoutEnlargement`:
 * - undefined [default]: uploading images with smaller width AND height than the image size will return null
 * - false: always enlarge images to the image size
 * - true: if the image is smaller than the image size, return the original image
 *
 * `imageResizeConfig.withoutReduction`:
 * - false [default]: always enlarge images to the image size
 * - true: if the image is smaller than the image size, return the original image
 *
 * @return 'omit' | 'resize' | 'resizeWithFocalPoint'
 */
const getImageResizeAction = ({
  dimensions: originalImage,
  hasFocalPoint,
  imageResizeConfig,
}: {
  dimensions: ProbedImageSize
  hasFocalPoint?: boolean
  imageResizeConfig: ImageSize
}): 'omit' | 'resize' | 'resizeWithFocalPoint' => {
  const { fit, withoutEnlargement, withoutReduction } = imageResizeConfig
  const targetWidth = imageResizeConfig.width!
  const targetHeight = imageResizeConfig.height!

  // prevent upscaling by default when x and y are both smaller than target image size
  if (targetHeight && targetWidth) {
    const originalImageIsSmallerXAndY =
      originalImage.width < targetWidth && originalImage.height < targetHeight
    if (withoutEnlargement === undefined && originalImageIsSmallerXAndY) {
      return 'omit' // prevent image size from being enlarged
    }
  }

  if (withoutEnlargement === undefined && (!targetWidth || !targetHeight)) {
    if (
      (targetWidth && originalImage.width < targetWidth) ||
      (targetHeight && originalImage.height < targetHeight)
    ) {
      return 'omit'
    }
  }

  const originalImageIsSmallerXOrY =
    originalImage.width < targetWidth || originalImage.height < targetHeight
  if (fit === 'contain' || fit === 'inside') {
    return 'resize'
  }
  if (!isNumber(targetHeight) && !isNumber(targetWidth)) {
    return 'resize'
  }

  const targetAspectRatio = targetWidth / targetHeight
  const originalAspectRatio = originalImage.width / originalImage.height
  if (originalAspectRatio === targetAspectRatio) {
    return 'resize'
  }

  if (withoutEnlargement && originalImageIsSmallerXOrY) {
    return 'resize'
  }
  if (withoutReduction && !originalImageIsSmallerXOrY) {
    return 'resize'
  }

  return hasFocalPoint ? 'resizeWithFocalPoint' : 'resize'
}

/**
 * Sanitize the resize config. If the resize config has the `withoutReduction`
 * property set to true, the `fit` and `position` properties will be set to `contain`
 * and `top left` respectively.
 *
 * @param resizeConfig - the resize config
 * @returns a sanitized resize config
 */
const sanitizeResizeConfig = (resizeConfig: ImageSize): ImageSize => {
  if (resizeConfig.withoutReduction) {
    return {
      ...resizeConfig,
      // Why fit `contain` should also be set to https://github.com/lovell/sharp/issues/3595
      fit: resizeConfig?.fit || 'contain',
      position: resizeConfig?.position || 'left top',
    }
  }
  return resizeConfig
}

/**
 * Used to extract height from images, animated or not.
 *
 * @param sharpMetadata - the sharp metadata
 * @returns the height of the image
 */
function extractHeightFromImage(sharpMetadata: SharpMetadata): number {
  if (sharpMetadata?.pages) {
    return sharpMetadata.height! / sharpMetadata.pages
  }
  return sharpMetadata.height!
}

/**
 * For the provided image sizes, handle the resizing and the transforms
 * (format, trim, etc.) of each requested image size and return the result object.
 * This only handles the image sizes. The transforms of the original image
 * are handled in {@link ./generateFileData.ts}.
 *
 * The image will be resized according to the provided
 * resize config. If no image sizes are requested, the resolved data will be empty.
 * For every image that does not need to be resized, a result object with `null`
 * parameters will be returned.
 *
 * @param resizeConfig - the resize config
 * @returns the result of the resize operation(s)
 */
export async function resizeAndTransformImageSizes({
  config,
  dimensions,
  file,
  mimeType,
  req,
  savedFilename,
  sharp,
  staticPath,
  uploadEdits,
  withMetadata,
}: ResizeArgs): Promise<ImageSizesResult> {
  const { focalPoint: focalPointEnabled = true, imageSizes } = config.upload

  // Focal point adjustments
  const incomingFocalPoint = uploadEdits?.focalPoint
    ? {
        x: isNumber(uploadEdits.focalPoint.x) ? Math.round(uploadEdits.focalPoint.x) : 50,
        y: isNumber(uploadEdits.focalPoint.y) ? Math.round(uploadEdits.focalPoint.y) : 50,
      }
    : undefined

  const defaultResult: ImageSizesResult = {
    ...(focalPointEnabled && incomingFocalPoint && { focalPoint: incomingFocalPoint }),
    sizeData: {},
    sizesToSave: [],
  }

  if (!imageSizes || !sharp) {
    return defaultResult
  }

  // Determine if the file is animated
  const fileIsAnimatedType = ['image/avif', 'image/gif', 'image/webp'].includes(file!.mimetype)
  const sharpOptions: SharpOptions = {}

  if (fileIsAnimatedType) {
    sharpOptions.animated = true
  }

  const sharpBase: Sharp | undefined = sharp(
    file!.tempFilePath || file!.data,
    sharpOptions,
  ).rotate() // pass rotate() to auto-rotate based on EXIF data. https://github.com/payloadcms/payload/pull/3081
  const originalImageMeta = await sharpBase.metadata()

  let adjustedDimensions = { ...dimensions }

  // Images with an exif orientation of 5, 6, 7, or 8 are auto-rotated by sharp
  // Need to adjust the dimensions to match the original image
  if ([5, 6, 7, 8].includes(originalImageMeta.orientation!)) {
    adjustedDimensions = {
      ...dimensions,
      height: dimensions.width,
      width: dimensions.height,
    }
  }

  const resizeImageMeta = {
    height: extractHeightFromImage(originalImageMeta),
    width: originalImageMeta.width,
  }

  const results: ImageSizesResult[] = await Promise.all(
    imageSizes.map(async (imageResizeConfig): Promise<ImageSizesResult> => {
      imageResizeConfig = sanitizeResizeConfig(imageResizeConfig)

      const resizeAction = getImageResizeAction({
        dimensions,
        hasFocalPoint: Boolean(incomingFocalPoint),
        imageResizeConfig,
      })
      if (resizeAction === 'omit') {
        return createResult({ name: imageResizeConfig.name })
      }

      const imageToResize = sharpBase.clone()
      let resized = imageToResize

      if (resizeAction === 'resizeWithFocalPoint') {
        let { height: resizeHeight, width: resizeWidth } = imageResizeConfig

        const originalAspectRatio = adjustedDimensions.width / adjustedDimensions.height

        // Calculate resizeWidth based on original aspect ratio if it's undefined
        if (resizeHeight && !resizeWidth) {
          resizeWidth = Math.round(resizeHeight * originalAspectRatio)
        }

        // Calculate resizeHeight based on original aspect ratio if it's undefined
        if (resizeWidth && !resizeHeight) {
          resizeHeight = Math.round(resizeWidth / originalAspectRatio)
        }

        if (!resizeHeight) {
          resizeHeight = resizeImageMeta.height
        }
        if (!resizeWidth) {
          resizeWidth = resizeImageMeta.width
        }

        const resizeAspectRatio = resizeWidth! / resizeHeight
        const prioritizeHeight = resizeAspectRatio < originalAspectRatio
        // Scales the image before extracting from it
        resized = imageToResize.resize({
          fastShrinkOnLoad: false,
          height: prioritizeHeight ? resizeHeight : undefined,
          width: prioritizeHeight ? undefined : resizeWidth,
        })

        const metadataAppendedFile = await optionallyAppendMetadata({
          req,
          sharpFile: resized,
          withMetadata: withMetadata!,
        })

        // Must read from buffer, resized.metadata will return the original image metadata
        const { info } = await metadataAppendedFile.toBuffer({ resolveWithObject: true })

        resizeImageMeta.height = extractHeightFromImage({
          ...originalImageMeta,
          height: info.height,
        })
        resizeImageMeta.width = info.width

        const halfResizeX = resizeWidth! / 2
        const xFocalCenter = resizeImageMeta.width * (incomingFocalPoint!.x / 100)
        const calculatedRightPixelBound = xFocalCenter + halfResizeX
        let leftBound = xFocalCenter - halfResizeX

        // if the right bound is greater than the image width, adjust the left bound
        // keeping focus on the right
        if (calculatedRightPixelBound > resizeImageMeta.width) {
          leftBound = resizeImageMeta.width - resizeWidth!
        }

        // if the left bound is less than 0, adjust the left bound to 0
        // keeping the focus on the left
        if (leftBound < 0) {
          leftBound = 0
        }

        const halfResizeY = resizeHeight / 2
        const yFocalCenter = resizeImageMeta.height * (incomingFocalPoint!.y / 100)
        const calculatedBottomPixelBound = yFocalCenter + halfResizeY
        let topBound = yFocalCenter - halfResizeY

        // if the bottom bound is greater than the image height, adjust the top bound
        // keeping the image as far right as possible
        if (calculatedBottomPixelBound > resizeImageMeta.height) {
          topBound = resizeImageMeta.height - resizeHeight
        }

        // if the top bound is less than 0, adjust the top bound to 0
        // keeping the image focus near the top
        if (topBound < 0) {
          topBound = 0
        }

        resized = resized.extract({
          height: resizeHeight,
          left: Math.floor(leftBound),
          top: Math.floor(topBound),
          width: resizeWidth!,
        })
      } else {
        resized = imageToResize.resize(imageResizeConfig)
      }

      if (imageResizeConfig.formatOptions) {
        resized = resized.toFormat(
          imageResizeConfig.formatOptions.format,
          imageResizeConfig.formatOptions.options,
        )
      }

      if (imageResizeConfig.trimOptions) {
        resized = resized.trim(imageResizeConfig.trimOptions)
      }

      const metadataAppendedFile = await optionallyAppendMetadata({
        req,
        sharpFile: resized,
        withMetadata: withMetadata!,
      })

      const { data: bufferData, info: bufferInfo } = await metadataAppendedFile.toBuffer({
        resolveWithObject: true,
      })

      const sanitizedImage = getSanitizedImageData(savedFilename)

      if (req.payloadUploadSizes) {
        req.payloadUploadSizes[imageResizeConfig.name] = bufferData
      }

      const mimeInfo = await fileTypeFromBuffer(bufferData)

      const imageNameWithDimensions = imageResizeConfig.generateImageName
        ? imageResizeConfig.generateImageName({
            extension: mimeInfo?.ext || sanitizedImage.ext,
            height: extractHeightFromImage({
              ...originalImageMeta,
              height: bufferInfo.height,
            }),
            originalName: sanitizedImage.name,
            sizeName: imageResizeConfig.name,
            width: bufferInfo.width,
          })
        : createImageName({
            extension: mimeInfo?.ext || sanitizedImage.ext,
            height: extractHeightFromImage({
              ...originalImageMeta,
              height: bufferInfo.height,
            }),
            outputImageName: sanitizedImage.name,
            width: bufferInfo.width,
          })

      const imagePath = `${staticPath}/${imageNameWithDimensions}`

      if (await fileExists(imagePath)) {
        try {
          await fs.unlink(imagePath)
        } catch {
          // Ignore unlink errors
        }
      }

      const { height, size, width } = bufferInfo
      return createResult({
        name: imageResizeConfig.name,
        filename: imageNameWithDimensions,
        filesize: size,
        height:
          fileIsAnimatedType && originalImageMeta.pages ? height / originalImageMeta.pages : height,
        mimeType: mimeInfo?.mime || mimeType,
        sizesToSave: [{ buffer: bufferData, path: imagePath }],
        width,
      })
    }),
  )

  return results.reduce(
    (acc, result) => {
      Object.assign(acc.sizeData, result.sizeData)
      acc.sizesToSave.push(...result.sizesToSave)
      return acc
    },
    { ...defaultResult },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: isImage.ts]---
Location: payload-main/packages/payload/src/uploads/isImage.ts

```typescript
export function isImage(mimeType: string): boolean {
  return (
    [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml',
      'image/webp',
      'image/avif',
      'image/jxl',
    ].indexOf(mimeType) > -1
  )
}
```

--------------------------------------------------------------------------------

---[FILE: mimeTypeValidator.spec.ts]---
Location: payload-main/packages/payload/src/uploads/mimeTypeValidator.spec.ts

```typescript
import type { ValidateOptions } from '../fields/config/types'

import { mimeTypeValidator } from './mimeTypeValidator'

const options = { siblingData: { filename: 'file.xyz' } } as ValidateOptions<
  undefined,
  undefined,
  undefined
>

describe('mimeTypeValidator', () => {
  it('should validate single mimeType', () => {
    const mimeTypes = ['image/png']
    const validate = mimeTypeValidator(mimeTypes)
    expect(validate('image/png', options)).toBe(true)
  })

  it('should validate multiple mimeTypes', () => {
    const mimeTypes = ['image/png', 'application/pdf']
    const validate = mimeTypeValidator(mimeTypes)
    expect(validate('image/png', options)).toBe(true)
    expect(validate('application/pdf', options)).toBe(true)
  })

  it('should validate using wildcard', () => {
    const mimeTypes = ['image/*']
    const validate = mimeTypeValidator(mimeTypes)
    expect(validate('image/png', options)).toBe(true)
    expect(validate('image/gif', options)).toBe(true)
  })

  it('should validate multiple wildcards', () => {
    const mimeTypes = ['image/*', 'audio/*']
    const validate = mimeTypeValidator(mimeTypes)
    expect(validate('image/png', options)).toBe(true)
    expect(validate('audio/mpeg', options)).toBe(true)
  })

  it('should not validate when unmatched', () => {
    const mimeTypes = ['image/png']
    const validate = mimeTypeValidator(mimeTypes)
    expect(validate('audio/mpeg', options)).toBe("Invalid file type: 'audio/mpeg'")
  })

  it('should not validate when unmatched - multiple mimeTypes', () => {
    const mimeTypes = ['image/png', 'application/pdf']
    const validate = mimeTypeValidator(mimeTypes)
    expect(validate('audio/mpeg', options)).toBe("Invalid file type: 'audio/mpeg'")
  })

  it('should not validate using wildcard - unmatched', () => {
    const mimeTypes = ['image/*']
    const validate = mimeTypeValidator(mimeTypes)
    expect(validate('audio/mpeg', options)).toBe("Invalid file type: 'audio/mpeg'")
  })

  it('should not validate multiple wildcards - unmatched', () => {
    const mimeTypes = ['image/*', 'audio/*']
    const validate = mimeTypeValidator(mimeTypes)
    expect(validate('video/mp4', options)).toBe("Invalid file type: 'video/mp4'")
    expect(validate('application/pdf', options)).toBe("Invalid file type: 'application/pdf'")
  })

  it('should not error when mimeType is missing', () => {
    const mimeTypes = ['image/*', 'application/pdf']
    const validate = mimeTypeValidator(mimeTypes)
    let value
    expect(validate(value, options)).toBe('Invalid file type')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: mimeTypeValidator.ts]---
Location: payload-main/packages/payload/src/uploads/mimeTypeValidator.ts

```typescript
import type { Validate } from '../fields/config/types.js'

import { validateMimeType } from '../utilities/validateMimeType.js'

export const mimeTypeValidator =
  (mimeTypes: string[]): Validate =>
  (val: string, { siblingData }) => {
    if (!siblingData.filename) {
      return true
    }

    if (!val) {
      return 'Invalid file type'
    }

    const isValidMimeType = validateMimeType(val, mimeTypes)
    return isValidMimeType ? true : `Invalid file type: '${val}'`
  }
```

--------------------------------------------------------------------------------

---[FILE: optionallyAppendMetadata.ts]---
Location: payload-main/packages/payload/src/uploads/optionallyAppendMetadata.ts

```typescript
import type { Sharp, Metadata as SharpMetadata } from 'sharp'

import type { PayloadRequest } from '../types/index.js'

export type WithMetadata =
  | ((options: { metadata: SharpMetadata; req: PayloadRequest }) => Promise<boolean>)
  | boolean

export async function optionallyAppendMetadata({
  req,
  sharpFile,
  withMetadata,
}: {
  req: PayloadRequest
  sharpFile: Sharp
  withMetadata: WithMetadata
}): Promise<Sharp> {
  const metadata = await sharpFile.metadata()

  if (withMetadata === true) {
    return sharpFile.withMetadata()
  } else if (typeof withMetadata === 'function') {
    const useMetadata = await withMetadata({ metadata, req })

    if (useMetadata) {
      return sharpFile.withMetadata()
    }
  }

  return sharpFile
}
```

--------------------------------------------------------------------------------

---[FILE: parseRangeHeader.ts]---
Location: payload-main/packages/payload/src/uploads/parseRangeHeader.ts

```typescript
import parseRange from 'range-parser'

export type ByteRange = {
  end: number
  start: number
}

export type ParseRangeResult =
  | { range: ByteRange; type: 'partial' }
  | { range: null; type: 'full' }
  | { range: null; type: 'invalid' }

/**
 * Parses HTTP Range header according to RFC 7233
 *
 * @returns Result object indicating whether to serve full file, partial content, or invalid range
 */
export function parseRangeHeader({
  fileSize,
  rangeHeader,
}: {
  fileSize: number
  rangeHeader: null | string
}): ParseRangeResult {
  // No Range header - serve full file
  if (!rangeHeader) {
    return { type: 'full', range: null }
  }

  const result = parseRange(fileSize, rangeHeader)

  // Invalid range syntax or unsatisfiable range
  if (result === -1 || result === -2) {
    return { type: 'invalid', range: null }
  }

  // Must be bytes range type
  if (result.type !== 'bytes') {
    return { type: 'invalid', range: null }
  }

  // Multi-range requests: use first range only (standard simplification)
  if (result.length === 0) {
    return { type: 'invalid', range: null }
  }

  const range = result[0]

  if (range) {
    return {
      type: 'partial',
      range: {
        end: range.end,
        start: range.start,
      },
    }
  }

  return { type: 'invalid', range: null }
}
```

--------------------------------------------------------------------------------

---[FILE: safeFetch.ts]---
Location: payload-main/packages/payload/src/uploads/safeFetch.ts

```typescript
import type { LookupFunction } from 'net'

import { lookup } from 'dns'
import ipaddr from 'ipaddr.js'
import { Agent, fetch as undiciFetch } from 'undici'

/**
 * @internal this is used to mock the IP `lookup` function in integration tests
 */
export const _internal_safeFetchGlobal = {
  lookup,
}

const isSafeIp = (ip: string) => {
  try {
    if (!ip) {
      return false
    }

    if (!ipaddr.isValid(ip)) {
      return false
    }

    const parsedIpAddress = ipaddr.parse(ip)
    const range = parsedIpAddress.range()
    if (range !== 'unicast') {
      return false // Private IP Range
    }
  } catch (ignore) {
    return false
  }
  return true
}

const ssrfFilterInterceptor: LookupFunction = (hostname, options, callback) => {
  _internal_safeFetchGlobal.lookup(hostname, options, (err, address, family) => {
    if (err) {
      callback(err, address, family)
    } else {
      let ips = [] as string[]
      if (Array.isArray(address)) {
        ips = address.map((a) => a.address)
      } else {
        ips = [address]
      }

      if (ips.some((ip) => !isSafeIp(ip))) {
        callback(new Error(`Blocked unsafe attempt to ${hostname}`), address, family)
        return
      }

      callback(null, address, family)
    }
  })
}

const safeDispatcher = new Agent({
  connect: { lookup: ssrfFilterInterceptor },
})
/**
 * A "safe" version of undici's fetch that prevents SSRF attacks.
 *
 * - Utilizes a custom dispatcher that filters out requests to unsafe IP addresses.
 * - Validates domain names by resolving them to IP addresses and checking if they're safe.
 * - Undici was used because it supported interceptors as well as "credentials: include". Native fetch
 */
export const safeFetch = async (...args: Parameters<typeof undiciFetch>) => {
  const [unverifiedUrl, options] = args

  try {
    const url = new URL(unverifiedUrl)

    let hostname = url.hostname

    // Strip brackets from IPv6 addresses (e.g., "[::1]" => "::1")
    if (hostname.startsWith('[') && hostname.endsWith(']')) {
      hostname = hostname.slice(1, -1)
    }

    if (ipaddr.isValid(hostname)) {
      if (!isSafeIp(hostname)) {
        throw new Error(`Blocked unsafe attempt to ${hostname}`)
      }
    }
    return await undiciFetch(url, {
      ...options,
      dispatcher: safeDispatcher,
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.cause instanceof Error && error.cause.message.includes('unsafe')) {
        // Errors thrown from within interceptors always have 'fetch error' as the message
        // The desired message we want to bubble up is in the cause
        throw new Error(error.cause.message)
      } else {
        let stringifiedUrl: string | undefined = undefined
        if (typeof unverifiedUrl === 'string') {
          stringifiedUrl = unverifiedUrl
        } else if (unverifiedUrl instanceof URL) {
          stringifiedUrl = unverifiedUrl.toString()
        } else if (unverifiedUrl instanceof Request) {
          stringifiedUrl = unverifiedUrl.url
        }

        throw new Error(`Failed to fetch from ${stringifiedUrl}, ${error.message}`)
      }
    }
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: saveBufferToFile.ts]---
Location: payload-main/packages/payload/src/uploads/saveBufferToFile.ts

```typescript
import fs from 'fs/promises'
import { Readable } from 'stream'

/**
 * Save buffer data to a file.
 * @param {Buffer} buffer - buffer to save to a file.
 * @param {string} filePath - path to a file.
 */
export const saveBufferToFile = async (buffer: Buffer, filePath: string): Promise<void> => {
  // Setup readable stream from buffer.
  let streamData = buffer
  const readStream = new Readable()
  readStream._read = () => {
    readStream.push(streamData)
    streamData = null!
  }
  // Setup file system writable stream.
  return await fs.writeFile(filePath, buffer)
}
```

--------------------------------------------------------------------------------

---[FILE: tempFile.ts]---
Location: payload-main/packages/payload/src/uploads/tempFile.ts

```typescript
import fs from 'fs/promises'
import os from 'node:os'
import path from 'node:path'
import { v4 as uuid } from 'uuid'

async function runTask(temporaryPath: string, callback: (temporaryPath: string) => Promise<any>) {
  try {
    return await callback(temporaryPath)
  } finally {
    await fs.rm(temporaryPath, { force: true, maxRetries: 2, recursive: true })
  }
}

type Options = {
  extension?: string
  name?: string
}

export const temporaryFileTask = async (
  callback: (temporaryPath: string) => Promise<any>,
  options: Options = {},
) => {
  const filePath = await temporaryFile(options)
  return runTask(filePath, callback)
}

async function temporaryFile(options: Options) {
  if (options.name) {
    if (options.extension !== undefined && options.extension !== null) {
      throw new Error('The `name` and `extension` options are mutually exclusive')
    }

    return path.join(await temporaryDirectory(), options.name)
  }

  return (
    (await getPath()) +
    (options.extension === undefined || options.extension === null
      ? ''
      : '.' + options.extension.replace(/^\./, ''))
  )
}

async function temporaryDirectory({ prefix = '' } = {}) {
  const directory = await getPath(prefix)
  await fs.mkdir(directory)
  return directory
}

async function getPath(prefix = ''): Promise<string> {
  const temporaryDirectory = await fs.realpath(os.tmpdir())
  return path.join(temporaryDirectory, prefix + uuid())
}
```

--------------------------------------------------------------------------------

````

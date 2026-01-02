---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 214
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 214 of 695)

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

---[FILE: checkFileRestrictions.ts]---
Location: payload-main/packages/payload/src/uploads/checkFileRestrictions.ts

```typescript
import { fileTypeFromBuffer } from 'file-type'

import type { checkFileRestrictionsParams, FileAllowList } from './types.js'

import { ValidationError } from '../errors/index.js'
import { validateMimeType } from '../utilities/validateMimeType.js'
import { validatePDF } from '../utilities/validatePDF.js'
import { detectSvgFromXml } from './detectSvgFromXml.js'

/**
 * Restricted file types and their extensions.
 */
export const RESTRICTED_FILE_EXT_AND_TYPES: FileAllowList = [
  { extensions: ['exe', 'dll'], mimeType: 'application/x-msdownload' },
  { extensions: ['exe', 'com', 'app', 'action'], mimeType: 'application/x-executable' },
  { extensions: ['bat', 'cmd'], mimeType: 'application/x-msdos-program' },
  { extensions: ['exe', 'com'], mimeType: 'application/x-ms-dos-executable' },
  { extensions: ['dmg'], mimeType: 'application/x-apple-diskimage' },
  { extensions: ['deb'], mimeType: 'application/x-debian-package' },
  { extensions: ['rpm'], mimeType: 'application/x-redhat-package-manager' },
  { extensions: ['exe', 'dll'], mimeType: 'application/vnd.microsoft.portable-executable' },
  { extensions: ['msi'], mimeType: 'application/x-msi' },
  { extensions: ['jar', 'ear', 'war'], mimeType: 'application/java-archive' },
  { extensions: ['desktop'], mimeType: 'application/x-desktop' },
  { extensions: ['cpl'], mimeType: 'application/x-cpl' },
  { extensions: ['lnk'], mimeType: 'application/x-ms-shortcut' },
  { extensions: ['pkg'], mimeType: 'application/x-apple-installer' },
  { extensions: ['htm', 'html', 'shtml', 'xhtml'], mimeType: 'text/html' },
  { extensions: ['php', 'phtml'], mimeType: 'application/x-httpd-php' },
  { extensions: ['js', 'jse'], mimeType: 'text/javascript' },
  { extensions: ['jsp'], mimeType: 'application/x-jsp' },
  { extensions: ['py'], mimeType: 'text/x-python' },
  { extensions: ['rb'], mimeType: 'text/x-ruby' },
  { extensions: ['pl'], mimeType: 'text/x-perl' },
  { extensions: ['ps1', 'psc1', 'psd1', 'psh', 'psm1'], mimeType: 'application/x-powershell' },
  { extensions: ['vbe', 'vbs'], mimeType: 'application/x-vbscript' },
  { extensions: ['ws', 'wsc', 'wsf', 'wsh'], mimeType: 'application/x-ms-wsh' },
  { extensions: ['scr'], mimeType: 'application/x-msdownload' },
  { extensions: ['asp', 'aspx'], mimeType: 'application/x-asp' },
  { extensions: ['hta'], mimeType: 'application/x-hta' },
  { extensions: ['reg'], mimeType: 'application/x-registry' },
  { extensions: ['url'], mimeType: 'application/x-url' },
  { extensions: ['workflow'], mimeType: 'application/x-workflow' },
  { extensions: ['command'], mimeType: 'application/x-command' },
]

export const checkFileRestrictions = async ({
  collection,
  file,
  req,
}: checkFileRestrictionsParams): Promise<void> => {
  const errors: string[] = []
  const { upload: uploadConfig } = collection
  const useTempFiles = req?.payload?.config?.upload?.useTempFiles ?? false
  const configMimeTypes =
    uploadConfig &&
    typeof uploadConfig === 'object' &&
    'mimeTypes' in uploadConfig &&
    Array.isArray(uploadConfig.mimeTypes)
      ? uploadConfig.mimeTypes
      : []

  const allowRestrictedFileTypes =
    uploadConfig && typeof uploadConfig === 'object' && 'allowRestrictedFileTypes' in uploadConfig
      ? (uploadConfig as { allowRestrictedFileTypes?: boolean }).allowRestrictedFileTypes
      : false

  const expectsDetectableType = (mimeType: string): boolean => {
    const textBasedTypes = ['/svg', 'image/svg+xml', 'image/x-xbitmap', 'image/x-xpixmap']

    if (textBasedTypes.includes(mimeType)) {
      return false
    }

    return (
      mimeType.startsWith('image/') ||
      mimeType.startsWith('video/') ||
      mimeType.startsWith('audio/') ||
      mimeType === 'application/pdf'
    )
  }

  // Skip validation if `allowRestrictedFileTypes` is true
  if (allowRestrictedFileTypes) {
    return
  }

  // Secondary mimetype check to assess file type from buffer
  if (configMimeTypes.length > 0) {
    let detected = await fileTypeFromBuffer(file.data)
    const typeFromExtension = file.name.split('.').pop() || ''

    // Handle SVG files that are detected as XML due to <?xml declarations
    if (
      detected?.mime === 'application/xml' &&
      configMimeTypes.some(
        (type) => type.includes('image/') && (type.includes('svg') || type === 'image/*'),
      )
    ) {
      const isSvg = detectSvgFromXml(file.data)
      if (isSvg) {
        detected = { ext: 'svg' as any, mime: 'image/svg+xml' as any }
      }
    }

    if (!detected && expectsDetectableType(typeFromExtension) && !useTempFiles) {
      errors.push(`File buffer returned no detectable MIME type.`)
    }

    const passesMimeTypeCheck = detected?.mime && validateMimeType(detected.mime, configMimeTypes)

    if (passesMimeTypeCheck && detected?.mime === 'application/pdf') {
      const isValidPDF = validatePDF(file?.data)
      if (!isValidPDF) {
        errors.push('Invalid PDF file.')
      }
    }

    if (detected && !passesMimeTypeCheck) {
      errors.push(`Invalid MIME type: ${detected.mime}.`)
    }
  } else {
    const isRestricted = RESTRICTED_FILE_EXT_AND_TYPES.some((type) => {
      const hasRestrictedExt = type.extensions.some((ext) => file.name.toLowerCase().endsWith(ext))
      const hasRestrictedMime = type.mimeType === file.mimetype
      return hasRestrictedExt || hasRestrictedMime
    })
    if (isRestricted) {
      errors.push(
        `File type '${file.mimetype}' not allowed ${file.name}: Restricted file type detected -- set 'allowRestrictedFileTypes' to true to skip this check for this Collection.`,
      )
    }
  }

  if (errors.length > 0) {
    req.payload.logger.error(errors.join(', '))
    throw new ValidationError({
      errors: [{ message: errors.join(', '), path: 'file' }],
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: cropImage.ts]---
Location: payload-main/packages/payload/src/uploads/cropImage.ts

```typescript
import type { SharpOptions } from 'sharp'

import type { SanitizedConfig } from '../config/types.js'
import type { PayloadRequest } from '../types/index.js'
import type { WithMetadata } from './optionallyAppendMetadata.js'
import type { UploadEdits } from './types.js'

import { optionallyAppendMetadata } from './optionallyAppendMetadata.js'

const percentToPixel = (value: number, dimension: number) => {
  return Math.floor((value / 100) * dimension)
}

type CropImageArgs = {
  cropData: UploadEdits['crop']
  dimensions: { height: number; width: number }
  file: PayloadRequest['file']
  heightInPixels: number
  req?: PayloadRequest
  sharp: SanitizedConfig['sharp']
  widthInPixels: number
  withMetadata?: WithMetadata
}
export async function cropImage({
  cropData,
  dimensions,
  file: fileArg,
  heightInPixels,
  req,
  sharp,
  widthInPixels,
  withMetadata,
}: CropImageArgs) {
  try {
    const { x, y } = cropData!
    const file = fileArg!

    const fileIsAnimatedType = ['image/avif', 'image/gif', 'image/webp'].includes(file.mimetype)

    const sharpOptions: SharpOptions = {}

    if (fileIsAnimatedType) {
      sharpOptions.animated = true
    }

    const { height: originalHeight, width: originalWidth } = dimensions
    const newWidth = Number(widthInPixels)
    const newHeight = Number(heightInPixels)

    const dimensionsChanged = originalWidth !== newWidth || originalHeight !== newHeight

    if (!dimensionsChanged) {
      let adjustedHeight = originalHeight

      if (fileIsAnimatedType) {
        const animatedMetadata = await sharp(
          file.tempFilePath || file.data,
          sharpOptions,
        ).metadata()
        adjustedHeight = animatedMetadata.pages ? animatedMetadata.height! : originalHeight
      }

      return {
        data: file.data,
        info: {
          height: adjustedHeight,
          size: file.size,
          width: originalWidth,
        },
      }
    }

    const formattedCropData = {
      height: Number(heightInPixels),
      left: percentToPixel(x, dimensions.width),
      top: percentToPixel(y, dimensions.height),
      width: Number(widthInPixels),
    }

    let cropped = sharp(file.tempFilePath || file.data, sharpOptions).extract(formattedCropData)

    cropped = await optionallyAppendMetadata({
      req: req!,
      sharpFile: cropped,
      withMetadata: withMetadata!,
    })

    return await cropped.toBuffer({
      resolveWithObject: true,
    })
  } catch (error) {
    console.error(`Error cropping image:`, error)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: deleteAssociatedFiles.ts]---
Location: payload-main/packages/payload/src/uploads/deleteAssociatedFiles.ts

```typescript
import fs from 'fs/promises'

import type { SanitizedCollectionConfig } from '../collections/config/types.js'
import type { SanitizedConfig } from '../config/types.js'
import type { PayloadRequest } from '../types/index.js'
import type { FileData, FileToSave } from './types.js'

import { ErrorDeletingFile } from '../errors/index.js'
import { fileExists } from './fileExists.js'

type Args = {
  collectionConfig: SanitizedCollectionConfig
  config: SanitizedConfig
  doc: Record<string, unknown>
  files?: FileToSave[]
  overrideDelete: boolean
  req: PayloadRequest
}

export const deleteAssociatedFiles: (args: Args) => Promise<void> = async ({
  collectionConfig,
  doc,
  files = [],
  overrideDelete,
  req,
}) => {
  if (!collectionConfig.upload) {
    return
  }
  if (overrideDelete || files.length > 0) {
    const { staticDir: staticPath } = collectionConfig.upload

    const fileToDelete = `${staticPath}/${doc.filename as string}`

    try {
      if (await fileExists(fileToDelete)) {
        await fs.unlink(fileToDelete)
      }
    } catch (ignore) {
      throw new ErrorDeletingFile(req.t)
    }

    if (doc.sizes) {
      const sizes: FileData[] = Object.values(doc.sizes)
      // Since forEach will not wait until unlink is finished it could
      // happen that two operations will try to delete the same file.
      // To avoid this it is recommended to use "sync" instead

      for (const size of sizes) {
        const sizeToDelete = `${staticPath}/${size.filename}`
        try {
          if (await fileExists(sizeToDelete)) {
            await fs.unlink(sizeToDelete)
          }
        } catch (ignore) {
          throw new ErrorDeletingFile(req.t)
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: detectSvgFromXml.ts]---
Location: payload-main/packages/payload/src/uploads/detectSvgFromXml.ts

```typescript
/**
 * Securely detect if an XML buffer contains a valid SVG document
 */
export function detectSvgFromXml(buffer: Buffer): boolean {
  try {
    // Limit buffer size to prevent processing large malicious files
    const maxSize = 2048
    const content = buffer.toString('utf8', 0, Math.min(buffer.length, maxSize))

    // Check for XML declaration and extract encoding if present
    const xmlDeclMatch = content.match(/^<\?xml[^>]*encoding=["']([^"']+)["']/i)
    const declaredEncoding = xmlDeclMatch?.[1]?.toLowerCase()

    // Only support safe encodings
    if (declaredEncoding && !['ascii', 'utf-8', 'utf8'].includes(declaredEncoding)) {
      return false
    }

    // Remove XML declarations, comments, and processing instructions
    const cleanContent = content
      .replace(/<\?xml[^>]*\?>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<\?[^>]*\?>/g, '')
      .trim()

    // Find the first actual element (root element)
    const rootElementMatch = cleanContent.match(/^<(\w+)(?:\s|>)/)
    if (!rootElementMatch || rootElementMatch[1] !== 'svg') {
      return false
    }

    // Validate SVG namespace - must be present for valid SVG
    const svgNamespaceRegex = /xmlns=["']http:\/\/www\.w3\.org\/2000\/svg["']/
    if (!svgNamespaceRegex.test(content)) {
      return false
    }

    // Additional validation: ensure it's not malformed
    const svgOpenTag = content.match(/<svg[\s>]/)
    if (!svgOpenTag) {
      return false
    }

    return true
  } catch (_error) {
    // If any error occurs during parsing, treat as not SVG
    return false
  }
}
```

--------------------------------------------------------------------------------

---[FILE: docWithFilenameExists.ts]---
Location: payload-main/packages/payload/src/uploads/docWithFilenameExists.ts

```typescript
import type { PayloadRequest, Where } from '../types/index.js'

type Args = {
  collectionSlug: string
  filename: string
  path: string
  prefix?: string
  req: PayloadRequest
}

export const docWithFilenameExists = async ({
  collectionSlug,
  filename,
  prefix,
  req,
}: Args): Promise<boolean> => {
  const where: Where = {
    filename: {
      equals: filename,
    },
  }

  if (prefix) {
    where.prefix = { equals: prefix }
  }

  const doc = await req.payload.db.findOne({
    collection: collectionSlug,
    req,
    where,
  })

  return !!doc
}
```

--------------------------------------------------------------------------------

---[FILE: fileExists.ts]---
Location: payload-main/packages/payload/src/uploads/fileExists.ts

```typescript
import fs from 'fs/promises'

export const fileExists = async (filename: string): Promise<boolean> => {
  try {
    await fs.stat(filename)

    return true
  } catch (ignore) {
    return false
  }
}
```

--------------------------------------------------------------------------------

---[FILE: formatFilesize.ts]---
Location: payload-main/packages/payload/src/uploads/formatFilesize.ts

```typescript
export function formatFilesize(bytes: number, decimals = 0): string {
  if (bytes === 0) {
    return '0 bytes'
  }

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = [' bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / k ** i).toFixed(dm))}${sizes[i]}`
}
```

--------------------------------------------------------------------------------

---[FILE: generateFileData.ts]---
Location: payload-main/packages/payload/src/uploads/generateFileData.ts

```typescript
import type { OutputInfo, Sharp, SharpOptions } from 'sharp'

import { fileTypeFromBuffer } from 'file-type'
import fs from 'fs/promises'
import sanitize from 'sanitize-filename'

import type { Collection } from '../collections/config/types.js'
import type { SanitizedConfig } from '../config/types.js'
import type { PayloadRequest } from '../types/index.js'
import type { FileData, FileToSave, ProbedImageSize, UploadEdits } from './types.js'

import { FileRetrievalError, FileUploadError, Forbidden, MissingFile } from '../errors/index.js'
import { canResizeImage } from './canResizeImage.js'
import { checkFileRestrictions } from './checkFileRestrictions.js'
import { cropImage } from './cropImage.js'
import { getExternalFile } from './getExternalFile.js'
import { getFileByPath } from './getFileByPath.js'
import { getImageSize } from './getImageSize.js'
import { getSafeFileName } from './getSafeFilename.js'
import { resizeAndTransformImageSizes } from './imageResizer.js'
import { isImage } from './isImage.js'
import { optionallyAppendMetadata } from './optionallyAppendMetadata.js'
type Args<T> = {
  collection: Collection
  config: SanitizedConfig
  data: T
  isDuplicating?: boolean
  operation: 'create' | 'update'
  originalDoc?: T
  overwriteExistingFiles?: boolean
  req: PayloadRequest
  throwOnMissingFile?: boolean
}

type Result<T> = Promise<{
  data: T
  files: FileToSave[]
}>

const shouldReupload = (
  uploadEdits: UploadEdits,
  fileData: Record<string, unknown> | undefined,
) => {
  if (!fileData) {
    return false
  }

  if (uploadEdits.crop || uploadEdits.heightInPixels || uploadEdits.widthInPixels) {
    return true
  }

  // Since uploadEdits always has focalPoint, compare to the value in the data if it was changed
  if (uploadEdits.focalPoint) {
    const incomingFocalX = uploadEdits.focalPoint.x
    const incomingFocalY = uploadEdits.focalPoint.y

    const currentFocalX = 'focalX' in fileData && fileData.focalX
    const currentFocalY = 'focalY' in fileData && fileData.focalY

    const isEqual = incomingFocalX === currentFocalX && incomingFocalY === currentFocalY
    return !isEqual
  }

  return false
}

export const generateFileData = async <T>({
  collection: { config: collectionConfig },
  data,
  isDuplicating,
  operation,
  originalDoc,
  overwriteExistingFiles,
  req,
  throwOnMissingFile,
}: Args<T>): Result<T> => {
  if (!collectionConfig.upload) {
    return {
      data,
      files: [],
    }
  }

  const { sharp } = req.payload.config

  let file = req.file

  const uploadEdits = parseUploadEditsFromReqOrIncomingData({
    data,
    isDuplicating,
    operation,
    originalDoc,
    req,
  })

  const {
    constructorOptions,
    disableLocalStorage,
    focalPoint: focalPointEnabled = true,
    formatOptions,
    imageSizes,
    resizeOptions,
    staticDir,
    trimOptions,
    withMetadata,
  } = collectionConfig.upload

  const staticPath = staticDir

  const incomingFileData = isDuplicating ? originalDoc : data

  if (
    !file &&
    (isDuplicating || shouldReupload(uploadEdits, incomingFileData as Record<string, unknown>))
  ) {
    const { filename, url } = incomingFileData as unknown as FileData

    if (filename && (filename.includes('../') || filename.includes('..\\'))) {
      throw new Forbidden(req.t)
    }

    try {
      if (url && url.startsWith('/') && !disableLocalStorage) {
        const filePath = `${staticPath}/${filename}`
        const response = await getFileByPath(filePath)
        file = response
        overwriteExistingFiles = true
      } else if (filename && url) {
        file = await getExternalFile({
          data: incomingFileData as unknown as FileData,
          req,
          uploadConfig: collectionConfig.upload,
        })
        overwriteExistingFiles = true
      }
    } catch (err: unknown) {
      throw new FileRetrievalError(req.t, err instanceof Error ? err.message : undefined)
    }
  }

  if (isDuplicating) {
    overwriteExistingFiles = false
  }

  if (!file) {
    if (throwOnMissingFile) {
      throw new MissingFile(req.t)
    }

    return {
      data,
      files: [],
    }
  }

  await checkFileRestrictions({
    collection: collectionConfig,
    file,
    req,
  })

  if (!disableLocalStorage) {
    await fs.mkdir(staticPath!, { recursive: true })
  }

  let newData = data
  const filesToSave: FileToSave[] = []
  const fileData: Partial<FileData> = {}
  const fileIsAnimatedType = ['image/avif', 'image/gif', 'image/webp'].includes(file.mimetype)
  const cropData =
    typeof uploadEdits === 'object' && 'crop' in uploadEdits ? uploadEdits.crop : undefined

  try {
    const fileSupportsResize = canResizeImage(file.mimetype)
    let fsSafeName: string
    let sharpFile: Sharp | undefined
    let dimensions: ProbedImageSize | undefined
    let fileBuffer!: { data: Buffer; info: OutputInfo }
    let ext
    let mime: string
    const fileHasAdjustments =
      fileSupportsResize &&
      Boolean(
        resizeOptions || formatOptions || trimOptions || constructorOptions || file.tempFilePath,
      )

    const sharpOptions: SharpOptions = { ...constructorOptions }

    if (fileIsAnimatedType) {
      sharpOptions.animated = true
    }

    if (sharp && (fileIsAnimatedType || fileHasAdjustments)) {
      if (file.tempFilePath) {
        sharpFile = sharp(file.tempFilePath, sharpOptions).rotate() // pass rotate() to auto-rotate based on EXIF data. https://github.com/payloadcms/payload/pull/3081
      } else {
        sharpFile = sharp(file.data, sharpOptions).rotate() // pass rotate() to auto-rotate based on EXIF data. https://github.com/payloadcms/payload/pull/3081
      }

      if (fileHasAdjustments) {
        if (resizeOptions) {
          sharpFile = sharpFile.resize(resizeOptions)
        }
        if (formatOptions) {
          sharpFile = sharpFile.toFormat(formatOptions.format, formatOptions.options)
        }
        if (trimOptions) {
          sharpFile = sharpFile.trim(trimOptions)
        }
      }
    }

    if (fileSupportsResize || isImage(file.mimetype)) {
      dimensions = await getImageSize(file)
      fileData.width = dimensions.width
      fileData.height = dimensions.height
    }

    if (sharpFile) {
      const metadata = await sharpFile.metadata()
      sharpFile = await optionallyAppendMetadata({
        req,
        sharpFile,
        withMetadata: withMetadata!,
      })
      fileBuffer = await sharpFile.toBuffer({ resolveWithObject: true })
      ;({ ext, mime } = (await fileTypeFromBuffer(fileBuffer.data))!) // This is getting an incorrect gif height back.
      fileData.width = fileBuffer.info.width
      fileData.height = fileBuffer.info.height
      fileData.filesize = fileBuffer.info.size

      // Animated GIFs + WebP aggregate the height from every frame, so we need to use divide by number of pages
      if (metadata.pages) {
        fileData.height = fileBuffer.info.height / metadata.pages
        fileData.filesize = fileBuffer.data.length
      }
    } else {
      mime = file.mimetype
      fileData.filesize = file.size

      if (file.name.includes('.')) {
        ext = file.name.split('.').pop()?.split('?')[0]
      } else {
        ext = ''
      }
    }

    // Adjust SVG mime type. fromBuffer modifies it.
    if (mime === 'application/xml' && ext === 'svg') {
      mime = 'image/svg+xml'
    }
    fileData.mimeType = mime

    const baseFilename = sanitize(file.name.substring(0, file.name.lastIndexOf('.')) || file.name)
    fsSafeName = `${baseFilename}${ext ? `.${ext}` : ''}`

    if (!overwriteExistingFiles) {
      // Extract prefix if present (added by plugin-cloud-storage)
      const prefix = (data as Record<string, unknown>)?.prefix as string | undefined
      fsSafeName = await getSafeFileName({
        collectionSlug: collectionConfig.slug,
        desiredFilename: fsSafeName,
        prefix,
        req,
        staticPath: staticPath!,
      })
    }

    fileData.filename = fsSafeName
    let fileForResize = file

    if (cropData && sharp) {
      const { data: croppedImage, info } = await cropImage({
        cropData,
        dimensions: dimensions!,
        file,
        heightInPixels: uploadEdits.heightInPixels!,
        req,
        sharp,
        widthInPixels: uploadEdits.widthInPixels!,
        withMetadata,
      })

      // Apply resize after cropping to ensure it conforms to resizeOptions
      if (resizeOptions && !resizeOptions.withoutEnlargement) {
        const resizedAfterCrop = await sharp(croppedImage)
          .resize({
            fit: resizeOptions?.fit || 'cover',
            height: resizeOptions?.height,
            position: resizeOptions?.position || 'center',
            width: resizeOptions?.width,
          })
          .toBuffer({ resolveWithObject: true })

        filesToSave.push({
          buffer: resizedAfterCrop.data,
          path: `${staticPath}/${fsSafeName}`,
        })

        fileForResize = {
          ...fileForResize,
          data: resizedAfterCrop.data,
          size: resizedAfterCrop.info.size,
        }

        fileData.width = resizedAfterCrop.info.width
        fileData.height = resizedAfterCrop.info.height
        if (fileIsAnimatedType) {
          const metadata = await sharpFile!.metadata()
          fileData.height = metadata.pages
            ? resizedAfterCrop.info.height / metadata.pages
            : resizedAfterCrop.info.height
        }
        fileData.filesize = resizedAfterCrop.info.size
      } else {
        // If resizeOptions is not present, just save the cropped image
        filesToSave.push({
          buffer: croppedImage,
          path: `${staticPath}/${fsSafeName}`,
        })

        fileForResize = {
          ...file,
          data: croppedImage,
          size: info.size,
        }

        fileData.width = info.width
        fileData.height = info.height
        if (fileIsAnimatedType) {
          const metadata = await sharpFile!.metadata()
          fileData.height = metadata.pages ? info.height / metadata.pages : info.height
        }
        fileData.filesize = info.size
      }

      if (file.tempFilePath) {
        await fs.writeFile(file.tempFilePath, croppedImage) // write fileBuffer to the temp path
      } else {
        req.file = fileForResize
      }
    } else {
      filesToSave.push({
        buffer: fileBuffer?.data || file.data,
        path: `${staticPath}/${fsSafeName}`,
      })

      // If using temp files and the image is being resized, write the file to the temp path
      if (fileBuffer?.data || file.data.length > 0) {
        if (file.tempFilePath) {
          await fs.writeFile(file.tempFilePath, fileBuffer?.data || file.data) // write fileBuffer to the temp path
        } else {
          // Assign the _possibly modified_ file to the request object
          req.file = {
            ...file,
            data: fileBuffer?.data || file.data,
            size: fileBuffer?.info.size,
          }
        }
      }
    }

    if (fileSupportsResize && (Array.isArray(imageSizes) || focalPointEnabled !== false)) {
      req.payloadUploadSizes = {}
      const { focalPoint, sizeData, sizesToSave } = await resizeAndTransformImageSizes({
        config: collectionConfig,
        dimensions: !cropData
          ? dimensions!
          : {
              ...dimensions,
              height: fileData.height!,
              width: fileData.width!,
            },
        file: fileForResize,
        mimeType: fileData.mimeType,
        req,
        savedFilename: fsSafeName || file.name,
        sharp,
        staticPath: staticPath!,
        uploadEdits,
        withMetadata,
      })

      fileData.sizes = sizeData
      fileData.focalX = focalPoint?.x
      fileData.focalY = focalPoint?.y
      filesToSave.push(...sizesToSave)
    }
  } catch (err) {
    req.payload.logger.error(err)
    throw new FileUploadError(req.t)
  }

  newData = {
    ...newData,
    ...fileData,
  }

  return {
    data: newData,
    files: filesToSave,
  }
}

/**
 * Parse upload edits from req or incoming data
 */
function parseUploadEditsFromReqOrIncomingData(args: {
  data: unknown
  isDuplicating?: boolean
  operation: 'create' | 'update'
  originalDoc: unknown
  req: PayloadRequest
}): UploadEdits {
  const { data, isDuplicating, operation, originalDoc, req } = args

  // Get intended focal point change from query string or incoming data
  const uploadEdits =
    req.query?.uploadEdits && typeof req.query.uploadEdits === 'object'
      ? (req.query.uploadEdits as UploadEdits)
      : {}

  if (uploadEdits.focalPoint) {
    return uploadEdits
  }

  const incomingData = data as FileData
  const origDoc = originalDoc as FileData

  if (origDoc && 'focalX' in origDoc && 'focalY' in origDoc) {
    // If no change in focal point, return undefined.
    // This prevents a refocal operation triggered from admin, because it always sends the focal point.
    if (incomingData.focalX === origDoc.focalX && incomingData.focalY === origDoc.focalY) {
      return undefined!
    }

    if (isDuplicating) {
      uploadEdits.focalPoint = {
        x: incomingData?.focalX || origDoc.focalX!,
        y: incomingData?.focalY || origDoc.focalX!,
      }
    }
  }

  if (incomingData?.focalX && incomingData?.focalY) {
    uploadEdits.focalPoint = {
      x: incomingData.focalX,
      y: incomingData.focalY,
    }
    return uploadEdits
  }

  // If no focal point is set, default to center
  if (operation === 'create') {
    uploadEdits.focalPoint = {
      x: 50,
      y: 50,
    }
  }

  return uploadEdits
}
```

--------------------------------------------------------------------------------

---[FILE: getBaseFields.ts]---
Location: payload-main/packages/payload/src/uploads/getBaseFields.ts

```typescript
import type { CollectionConfig } from '../collections/config/types.js'
import type { Config } from '../config/types.js'
import type { Field } from '../fields/config/types.js'
import type { UploadConfig } from './types.js'

import { mimeTypeValidator } from './mimeTypeValidator.js'

type GenerateURLArgs = {
  collectionSlug: string
  config: Config
  filename?: string
}
const generateURL = ({ collectionSlug, config, filename }: GenerateURLArgs) => {
  if (filename) {
    return `${config.serverURL || ''}${config.routes?.api || ''}/${collectionSlug}/file/${encodeURIComponent(filename)}`
  }
  return undefined
}

type Options = {
  collection: CollectionConfig
  config: Config
}

export const getBaseUploadFields = ({ collection, config }: Options): Field[] => {
  const uploadOptions: UploadConfig = typeof collection.upload === 'object' ? collection.upload : {}

  const mimeType: Field = {
    name: 'mimeType',
    type: 'text',
    admin: {
      hidden: true,
      readOnly: true,
    },
    label: 'MIME Type',
  }

  const thumbnailURL: Field = {
    name: 'thumbnailURL',
    type: 'text',
    admin: {
      hidden: true,
      readOnly: true,
    },
    hooks: {
      afterRead: [
        ({ originalDoc }) => {
          const adminThumbnail =
            typeof collection.upload !== 'boolean' ? collection.upload?.adminThumbnail : undefined

          if (typeof adminThumbnail === 'function') {
            return adminThumbnail({ doc: originalDoc })
          }

          if (
            typeof adminThumbnail === 'string' &&
            'sizes' in originalDoc &&
            originalDoc.sizes?.[adminThumbnail]?.filename
          ) {
            return generateURL({
              collectionSlug: collection.slug,
              config,
              filename: originalDoc.sizes?.[adminThumbnail].filename as string,
            })
          }

          return null
        },
      ],
    },
    label: 'Thumbnail URL',
  }

  const width: Field = {
    name: 'width',
    type: 'number',
    admin: {
      hidden: true,
      readOnly: true,
    },
    label: ({ t }) => t('upload:width'),
  }

  const height: Field = {
    name: 'height',
    type: 'number',
    admin: {
      hidden: true,
      readOnly: true,
    },
    label: ({ t }) => t('upload:height'),
  }

  const filesize: Field = {
    name: 'filesize',
    type: 'number',
    admin: {
      hidden: true,
      readOnly: true,
    },
    label: ({ t }) => t('upload:fileSize'),
  }

  const filename: Field = {
    name: 'filename',
    type: 'text',
    admin: {
      disableBulkEdit: true,
      hidden: true,
      readOnly: true,
    },
    index: true,
    label: ({ t }) => t('upload:fileName'),
  }

  // Only set unique: true if the collection does not have a compound index
  if (
    collection.upload === true ||
    (typeof collection.upload === 'object' && !collection.upload.filenameCompoundIndex)
  ) {
    filename.unique = true
  }

  const url: Field = {
    name: 'url',
    type: 'text',
    admin: {
      hidden: true,
      readOnly: true,
    },
    label: 'URL',
  }

  let uploadFields: Field[] = [
    {
      ...url,
      hooks: {
        afterRead: [
          ({ data, value }) => {
            if (value && !data?.filename) {
              return value
            }

            return generateURL({
              collectionSlug: collection.slug,
              config,
              filename: data?.filename,
            })
          },
        ],
      },
    },
    thumbnailURL,
    filename,
    mimeType,
    filesize,
    width,
    height,
  ]

  // Add focal point fields if not disabled
  if (
    uploadOptions.focalPoint !== false ||
    uploadOptions.imageSizes ||
    uploadOptions.resizeOptions
  ) {
    uploadFields = uploadFields.concat(
      ['focalX', 'focalY'].map((name) => {
        return {
          name,
          type: 'number',
          admin: {
            disableGroupBy: true,
            disableListColumn: true,
            disableListFilter: true,
            hidden: true,
          },
        }
      }),
    )
  }

  if (uploadOptions.mimeTypes) {
    mimeType.validate = mimeTypeValidator(uploadOptions.mimeTypes)
  }

  // In Payload v4, image size subfields (`url`, `width`, `height`, etc.) should
  // default to `disableGroupBy: true`, `disableListColumn: true` and `disableListFilter: true`
  // to avoid cluttering the collection list view and filters by default.
  if (uploadOptions.imageSizes) {
    uploadFields = uploadFields.concat([
      {
        name: 'sizes',
        type: 'group',
        admin: {
          hidden: true,
        },
        fields: uploadOptions.imageSizes.map((size) => ({
          name: size.name,
          type: 'group',
          admin: {
            hidden: true,
            ...(size.admin?.disableGroupBy && { disableGroupBy: true }),
            ...(size.admin?.disableListColumn && { disableListColumn: true }),
            ...(size.admin?.disableListFilter && { disableListFilter: true }),
          },
          fields: [
            {
              ...url,
              admin: {
                ...url.admin,
                ...(size.admin?.disableGroupBy && { disableGroupBy: true }),
                ...(size.admin?.disableListColumn && { disableListColumn: true }),
                ...(size.admin?.disableListFilter && { disableListFilter: true }),
              },
              hooks: {
                afterRead: [
                  ({ data, value }) => {
                    if (value && size.height && size.width && !data?.filename) {
                      return value
                    }

                    const sizeFilename = data?.sizes?.[size.name]?.filename

                    if (sizeFilename) {
                      return `${config.serverURL}${config.routes?.api}/${collection.slug}/file/${encodeURIComponent(sizeFilename)}`
                    }

                    return null
                  },
                ],
              },
            },
            {
              ...width,
              admin: {
                ...width.admin,
                ...(size.admin?.disableGroupBy && { disableGroupBy: true }),
                ...(size.admin?.disableListColumn && { disableListColumn: true }),
                ...(size.admin?.disableListFilter && { disableListFilter: true }),
              },
            },
            {
              ...height,
              admin: {
                ...height.admin,
                ...(size.admin?.disableGroupBy && { disableGroupBy: true }),
                ...(size.admin?.disableListColumn && { disableListColumn: true }),
                ...(size.admin?.disableListFilter && { disableListFilter: true }),
              },
            },
            {
              ...mimeType,
              admin: {
                ...mimeType.admin,
                ...(size.admin?.disableGroupBy && { disableGroupBy: true }),
                ...(size.admin?.disableListColumn && { disableListColumn: true }),
                ...(size.admin?.disableListFilter && { disableListFilter: true }),
              },
            },
            {
              ...filesize,
              admin: {
                ...filesize.admin,
                ...(size.admin?.disableGroupBy && { disableGroupBy: true }),
                ...(size.admin?.disableListColumn && { disableListColumn: true }),
                ...(size.admin?.disableListFilter && { disableListFilter: true }),
              },
            },
            {
              ...filename,
              admin: {
                ...filename.admin,
                ...(size.admin?.disableGroupBy && { disableGroupBy: true }),
                ...(size.admin?.disableListColumn && { disableListColumn: true }),
                ...(size.admin?.disableListFilter && { disableListFilter: true }),
              },
              unique: false,
            },
          ],
          label: size.name,
        })),
        label: ({ t }) => t('upload:sizes'),
      },
    ])
  }
  return uploadFields
}
```

--------------------------------------------------------------------------------

---[FILE: getExternalFile.ts]---
Location: payload-main/packages/payload/src/uploads/getExternalFile.ts

```typescript
import type { PayloadRequest } from '../types/index.js'
import type { File, FileData, UploadConfig } from './types.js'

import { APIError } from '../errors/index.js'
import { isURLAllowed } from '../utilities/isURLAllowed.js'
import { safeFetch } from './safeFetch.js'

type Args = {
  data: FileData
  req: PayloadRequest
  uploadConfig: UploadConfig
}
export const getExternalFile = async ({ data, req, uploadConfig }: Args): Promise<File> => {
  const { filename, url } = data

  let trimAuthCookies = true
  if (typeof url === 'string') {
    let fileURL = url
    if (!url.startsWith('http')) {
      // URL points to the same server - we can send any cookies safely to our server.
      trimAuthCookies = false
      const baseUrl = req.headers.get('origin') || `${req.protocol}://${req.headers.get('host')}`
      fileURL = `${baseUrl}${url}`
    }

    let cookies = (req.headers.get('cookie') ?? '').split(';')

    if (trimAuthCookies) {
      cookies = cookies.filter(
        (cookie) => !cookie.trim().startsWith(req.payload.config.cookiePrefix),
      )
    }

    const headers = uploadConfig.externalFileHeaderFilter
      ? uploadConfig.externalFileHeaderFilter(Object.fromEntries(new Headers(req.headers)))
      : {
          cookie: cookies.join(';'),
        }

    // Check if URL is allowed because of skipSafeFetch allowList
    const skipSafeFetch: boolean =
      uploadConfig.skipSafeFetch === true
        ? uploadConfig.skipSafeFetch
        : Array.isArray(uploadConfig.skipSafeFetch) &&
          isURLAllowed(fileURL, uploadConfig.skipSafeFetch)

    // Check if URL is allowed because of pasteURL allowList
    const isAllowedPasteUrl: boolean | undefined =
      uploadConfig.pasteURL &&
      uploadConfig.pasteURL.allowList &&
      isURLAllowed(fileURL, uploadConfig.pasteURL.allowList)

    let res
    if (skipSafeFetch || isAllowedPasteUrl) {
      // Allowed
      res = await fetch(fileURL, {
        credentials: 'include',
        headers,
        method: 'GET',
      })
    } else {
      // Default
      res = await safeFetch(fileURL, {
        credentials: 'include',
        headers,
        method: 'GET',
      })
    }

    if (!res.ok) {
      throw new APIError(`Failed to fetch file from ${fileURL}`, res.status)
    }

    const data = await res.arrayBuffer()

    return {
      name: filename,
      data: Buffer.from(data),
      mimetype: res.headers.get('content-type') || undefined!,
      size: Number(res.headers.get('content-length')) || 0,
    }
  }

  throw new APIError('Invalid file url', 400)
}
```

--------------------------------------------------------------------------------

---[FILE: getFileByPath.ts]---
Location: payload-main/packages/payload/src/uploads/getFileByPath.ts

```typescript
import { fileTypeFromFile } from 'file-type'
import fs from 'fs/promises'
import path from 'path'

import type { PayloadRequest } from '../types/index.js'

const mimeTypeEstimate: Record<string, string> = {
  svg: 'image/svg+xml',
}

export const getFileByPath = async (filePath: string): Promise<PayloadRequest['file']> => {
  if (typeof filePath !== 'string') {
    return undefined
  }

  const name = path.basename(filePath)
  const ext = path.extname(filePath).slice(1)

  const [data, stat, type] = await Promise.all([
    fs.readFile(filePath),
    fs.stat(filePath),
    fileTypeFromFile(filePath),
  ])

  return {
    name,
    data,
    mimetype: type?.mime || mimeTypeEstimate[ext]!,
    size: stat.size,
  }
}
```

--------------------------------------------------------------------------------

````

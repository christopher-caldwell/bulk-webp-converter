import path from 'path'
import asyncPool from 'tiny-async-pool'
import webp from 'webp-converter'

import { getAllFilePaths, changeOutputPath, conversionProgress } from './helpers'

export const bulkWebPConvert = async ({
  pathToSource,
  pathToOutput,
  quality = 100,
  parallelLimit = 1,
  logLevel = '-quiet',
  filter,
}: BulkConvertArgs) => {
  if (quality < 1 || quality > 100) throw new Error(`Quality is out of range. Must be between [1-100]. Got ${quality}`)

  const pathToImagesDir = path.resolve(process.cwd(), pathToSource)
  const pathToOutputDir = path.resolve(process.cwd(), pathToOutput)
  const allImages = getAllFilePaths(pathToImagesDir, [])

  const convertImage = async (imagePath: string) => {
    const outputPath = changeOutputPath(imagePath, pathToOutputDir)
    if (filter) {
      const shouldContinue = filter(imagePath)
      if (!shouldContinue) return
    }
    if (imagePath.includes('.DS_Store')) return
    return webp.cwebp(imagePath, outputPath, `-q ${quality}`, logLevel)
  }

  conversionProgress.start(allImages.length, 0)

  for await (const _ of asyncPool(parallelLimit, allImages, convertImage)) {
    conversionProgress.increment()
  }
  return 'done'
}

export interface BulkConvertArgs {
  pathToSource: string
  pathToOutput: string
  quality?: number
  parallelLimit?: number
  logLevel?: '-v' | '-quiet'
  /** Optional filter that will determine whether or not a path should be converted */
  filter?: (path: string) => boolean
}

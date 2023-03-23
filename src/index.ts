import fs from 'fs'
import path from 'path'
import asyncPool from 'tiny-async-pool'
import webp from 'webp-converter'
import cliProgress from 'cli-progress'

const conversionProgress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)

const getAllFilePaths = (dirPath: string, arrayOfFilePaths: string[]) => {
  const filesPaths = fs.readdirSync(dirPath)

  arrayOfFilePaths = arrayOfFilePaths || []

  filesPaths.forEach(filesPath => {
    if (fs.statSync(dirPath + '/' + filesPath).isDirectory()) {
      arrayOfFilePaths = getAllFilePaths(dirPath + '/' + filesPath, arrayOfFilePaths)
    } else {
      arrayOfFilePaths.push(path.join(dirPath, '/', filesPath))
    }
  })

  return arrayOfFilePaths
}

const changeExtensionToWebp = (filePath: string): string => {
  return filePath.substring(0, filePath.lastIndexOf('.')) + '.webp'
}

export const bulkWebPConvert = async (
  pathToSource: string,
  pathToOutput: string,
  quality: number,
  parallelLimit: number
) => {
  const pathToImagesDir = path.resolve(process.cwd(), pathToSource)
  const pathToOutputDir = path.resolve(process.cwd(), pathToOutput)
  const allImages = getAllFilePaths(pathToImagesDir, [])

  console.log({ pathToOutputDir, pathToSource })

  const convertImage = (imagePath: string) => {
    const outputPath = changeExtensionToWebp(imagePath)
    // options for logging are -v and -quiet I think
    return webp.cwebp(imagePath, outputPath, `-q ${quality}`, '-v')
  }

  conversionProgress.start(allImages.length, 0)

  for await (const _ of asyncPool(parallelLimit, allImages, convertImage)) {
    conversionProgress.increment()
  }
}

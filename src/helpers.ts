import fs from 'fs'
import path from 'path'
import cliProgress from 'cli-progress'

export const conversionProgress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)

export const getAllFilePaths = (dirPath: string, arrayOfFilePaths: string[]) => {
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
export const changeOutputPath = (sourcePath: string, pathToOutputDir: string) => {
  const indexOfLastFolder = sourcePath.lastIndexOf('/')
  const originalFileName = sourcePath.substring(indexOfLastFolder + 1)
  const fileNameWithWebP = changeExtensionToWebp(originalFileName)
  return path.resolve(pathToOutputDir, fileNameWithWebP)
}

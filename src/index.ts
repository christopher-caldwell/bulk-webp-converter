import fs from 'fs'
import path from 'path'
import webp from 'webp-converter'

const pathToImages = path.resolve(process.cwd(), 'src/images')

console.log('pathToImages', pathToImages)

const getAllFiles = function (dirPath: string, arrayOfFiles: string[]) {
  const files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function (file) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, '/', file))
    }
  })

  return arrayOfFiles
}

const allImages = getAllFiles(pathToImages, [])

const changeExtensionToWebp = (filePath: string): string => {
  return filePath.substr(0, filePath.lastIndexOf('.')) + '.webp'
}

for (const image of allImages) {
  webp.cwebp(image, changeExtensionToWebp(image), '-q 80', '-v').then(() => {})
}

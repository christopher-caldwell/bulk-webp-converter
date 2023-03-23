import { bulkWebPConvert } from '@caldwell619/bulk-webp-converter'

// relative from execution - this is called from the root
const pathToSource = 'example/source-images'
const pathToOut = 'example/out'

bulkWebPConvert(pathToSource, pathToOut, 100, 1)
  .then(() => {
    process.exit()
  })
  .catch(() => {
    process.exit(1)
  })

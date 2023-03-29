import { bulkWebPConvert } from '@caldwell619/bulk-webp-converter'

// relative from execution - this is called from the root
const pathToSource = 'example/source-images'
const pathToOutput = 'example/out'

bulkWebPConvert({
  pathToSource,
  pathToOutput,
  quality: 100,
  parallelLimit: 1,
  filter(path) {
    return !path.includes('Forest')
  },
})
  .then(() => {
    process.exit()
  })
  .catch(() => {
    process.exit(1)
  })

import esbuild from 'esbuild'

const build = async () => {
  try {
    await esbuild.build({
      entryPoints: ['src/index.ts', 'src/cli.ts'],
      outdir: 'dist',
      bundle: true,
      minify: true,
      platform: 'node',
      target: 'node16',
      external: ['./node_modules/*'],
    })
    process.exit()
  } catch (e) {
    process.exit(1)
  }
}

build()

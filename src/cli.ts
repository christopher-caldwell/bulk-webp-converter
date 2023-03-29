import { Builtins, Command, Option, runExit } from 'clipanion'
import { Cli } from 'clipanion'
import * as t from 'typanion'

import { version } from '../package.json'
import { BulkConvertArgs, bulkWebPConvert } from './index'

const isQuality = t.cascade(t.isNumber(), [t.isInteger(), t.isInInclusiveRange(1, 100)])
class ConvertCommand extends Command {
  parallelLimit = Option.String(`-pl,--parallelLimit`, '1', {
    description: 'Limit for images processes in parallel instead of sequentially',
    validator: t.isNumber(),
    arity: 1,
  })
  pathToSource = Option.String('-ps,--pathToOutput', {
    required: true,
    arity: 1,
    tolerateBoolean: false,
    description: 'Relative path to the images directory to convert',
  })
  pathToOutput = Option.String('-po,--pathToSource', {
    required: true,
    arity: 1,
    tolerateBoolean: false,
    description: 'Relative path to the output directory that will store converted images',
  })
  quality = Option.String(`-q,--quality`, '100', {
    description: 'The quality of the output WebP image [1-100]',
    arity: 1,
    validator: isQuality,
  })
  logLevel = Option.String(`-ll,--logLevel`, '-quiet', {
    description: 'The log level of the conversion',
    arity: 1,
  })

  async execute() {
    if (this.logLevel !== '-v' && this.logLevel !== '-quiet') {
      throw new Error('Log Level must be one of "-v" or "-quiet"')
    }

    try {
      await bulkWebPConvert({
        pathToSource: this.pathToSource,
        pathToOutput: this.pathToOutput,
        quality: this.quality,
        parallelLimit: this.parallelLimit,
        logLevel: this.logLevel as BulkConvertArgs['logLevel'],
      })
      process.exit(0)
    } catch (e) {
      process.exit(1)
    }
  }
}

const [node, app, ...args] = process.argv

const cli = new Cli({
  binaryLabel: `Bulk WebP Convert`,
  binaryName: `${node} ${app}`,
  binaryVersion: version,
})

cli.register(ConvertCommand)
cli.register(Builtins.HelpCommand)
cli.runExit(args)

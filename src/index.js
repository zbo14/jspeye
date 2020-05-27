'use strict'

const commander = require('commander')
const jspeye = require('./jspeye')

const program = new commander.Command()

program
  .version('1.0.0')
  .option('-m, --margin <int>', 'number of characters to show before/after match', 30)
  .option('-o, --output <file>', 'write prettified JS to file for further inspection')
  .option('-q, --quiet', 'don\'t print banner or info')

program
  .command('file <filename>')
  .description('examine JS in filesystem')
  .action((file, opts) => jspeye.file(file, opts.parent))

program
  .command('url <url>')
  .description('examine JS at URL endpoint')
  .option('-H, --headers <headers/@file>', 'comma-separated list or file with request headers to send')
  .option('-k, --insecure', 'allow insecure TLS connections')
  .action((url, opts) => jspeye.url(url, { ...opts.parent, headers: opts.headers }))

module.exports = program

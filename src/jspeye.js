'use strict'

const fs = require('fs')
const path = require('path')
const request = require('./request')
const report = require('./report')
const util = require('./util')

const banner = fs.readFileSync(path.join(__dirname, '..', 'banner'), 'utf8')

exports.file = async (filename, opts) => {
  if (!util.isJS(filename)) {
    util.error('[!] Expected filename with .js extension')
  }

  const margin = +opts.margin

  if (!util.isPositiveInteger(margin)) {
    util.error('[!] Margin must be positive integer')
  }

  let js

  try {
    js = await fs.promises.readFile(filename, 'utf8')
  } catch {
    util.error('[!] Couldn\'t read file: ' + filename)
  }

  util.error(banner, { exit: false })
  util.warn('[-] FILE: ' + filename, opts)

  js = report(js, margin)

  if (opts.output) {
    try {
      await fs.promises.writeFile(opts.output, js)
    } catch {
      util.error('[!] Couldn\'t write to file: ' + opts.output)
    }

    util.warn('[-] Wrote JS to ' + opts.output, opts)
  }

  util.warn('[-] Done!', opts)
}

exports.url = async (url, opts) => {
  try {
    url = new URL(url)
  } catch {
    util.error('[!] Invalid url: ' + url)
  }

  let delim = ','
  let headers = opts.headers || ''

  if (headers[0] === '@' && headers.length > 1) {
    try {
      headers = await fs.promises.readFile(headers.slice(1), 'utf8')
      delim = '\n'
    } catch {
      util.error('[!] Couldn\'t read headers file: ' + headers)
    }
  }

  const margin = +opts.margin

  if (!util.isPositiveInteger(margin)) {
    util.error('[!] Margin must be positive integer')
  }

  headers = util.parseHeaders(headers, delim)

  util.error(banner, { exit: false })
  util.warn('[-] URL: ' + url.href, opts)

  Object.entries(headers).forEach(([key, value]) => {
    if (value.length > 80) {
      value = value.slice(0, 80) + '...'
    }

    util.warn(`[-] Header > ${key}: ${value}`, opts)
  })

  let js

  try {
    ({ data: js } = await request(url, { ...opts, headers }))
  } catch (err) {
    util.error('[!] ' + err.message)
  }

  js = report(js, margin)

  if (opts.output) {
    try {
      await fs.promises.writeFile(opts.output, js)
    } catch {
      util.error('[!] Couldn\'t write to file: ' + opts.output)
    }

    util.warn('[-] Wrote JS to ' + opts.output, opts)
  }

  util.warn('[-] Done!', opts)
}

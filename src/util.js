'use strict'

const path = require('path')

const error = (x, opts = { exit: true }) => {
  console.error('\x1b[31m%s\x1b[0m', x)
  opts.exit && process.exit(1)
}

const isJS = pathname => path.parse(pathname).ext === '.js'
const isPositiveInteger = x => Number.isInteger(x) && x > 0

const matchAll = (regex, string) => {
  const matches = []

  let match

  while ((match = regex.exec(string))) {
    matches.push(match)
  }

  return matches
}

const parseHeaders = (str, delim) => {
  const headers = {}

  str.split(delim).forEach(kv => {
    let [key, value] = kv.split(':', 2)
    key = key && key.trim()
    value = value && value.trim()

    if (key && value) {
      headers[key] = value
    }
  })

  return headers
}

const warn = (x, opts = {}) => opts.quiet || console.warn('\x1b[33m%s\x1b[0m', x)

module.exports = {
  error,
  isJS,
  isPositiveInteger,
  matchAll,
  parseHeaders,
  warn
}

'use strict'

const http = require('http')
const https = require('https')
const zlib = require('zlib')
const util = require('./util')

const request = (url, opts) => new Promise((resolve, reject) => {
  const isHTTPS = url.protocol === 'https:'
  const rejectUnauthorized = isHTTPS && !opts.insecure
  const { get } = isHTTPS ? https : http
  const headers = {}

  Object.entries(opts.headers || {}).forEach(([key, value]) => {
    headers[key.toLowerCase()] = value
  })

  get(url, { headers, rejectUnauthorized }, resp => {
    const { headers, statusCode } = resp

    if ([301, 302, 303, 307, 308].includes(statusCode)) {
      try {
        url = new URL(headers.location)
      } catch {
        url.pathname = headers.location
      }

      util.warn('[-] Redirecting to ' + url.href, opts)

      return request(url, opts)
        .then(resolve)
        .catch(reject)
    }

    if (statusCode !== 200) {
      return reject(new Error('Status code: ' + statusCode))
    }

    let data = ''
    let decompress

    const encoding = headers['content-encoding']

    if (encoding === 'br') {
      decompress = zlib.createBrotliDecompress()
    } else if (encoding === 'gzip') {
      decompress = zlib.createGunzip()
    } else if (encoding === 'deflate') {
      decompress = zlib.createInflate()
    }

    resp
      .once('end', () => resolve({ statusCode, headers, data }))
      .once('error', reject)

    const stream = decompress ? resp.pipe(decompress) : resp

    stream
      .once('error', reject)
      .on('data', chunk => {
        data += chunk
      })
  }).once('error', reject)
})

module.exports = request

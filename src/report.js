'use strict'

const beautify = require('js-beautify').js
const patterns = require('./patterns')
const util = require('./util')

const report = (js, margin, object, keys = []) => {
  const lines = beautify(js, { indent_size: 2, preserve_newlines: false }).split('\n')

  Object.entries(object).forEach(([key, value]) => {
    if (value.constructor.name === 'Object') {
      return report(js, margin, value, keys.concat(key))
    }

    const matches = lines.flatMap((line, i) => {
      return util.matchAll(value, line).map(match => ({ match, line, num: i + 1 }))
    })

    if (!matches.length) return

    const name = [...keys, key].join('.')

    console.log('[' + name + ']')

    matches.forEach(({ match, line, num }) => {
      const before = line.slice(match.index - margin, match.index).trim()
      const middle = line.slice(match.index, match.index + match[0].length).trim()
      const after = line.slice(match.index + match[0].length, match.index + match[0].length + margin).trim()

      console.log([
        '  ', num, '. ', before,
        '>>>', middle,
        after
      ].join(''))
    })
  })

  return lines.join('\n')
}

module.exports = (js, margin) => report(js, margin, patterns)

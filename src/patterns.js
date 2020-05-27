'use strict'

const urlRegex = require('url-regex')

module.exports = {
  addEventListener: {
    message: /window\.addEventListener\((['"])message\1,/g
  },

  document: {
    write: /document\.write\(/g
  },

  eval:          /[^$0-9A-Za-z]eval\(/g,
  'innerHTML =': /\.innerHTML\s*=/g,

  JSON: {
    parse: /JSON\.parse\(/g
  },

  localStorage: {
    getItem: /localStorage\.getItem\(/g,
    setItem: /localStorage\.setItem\(/g,
    'x =':   /localStorage(?:\.[^(\s]+|\[[^\]]+\])\s*=/g
  },

  location: {
    assign:   /location\.assign\(/g,
    hash:     /location\.hash/g,
    replace:  /location\.replace\(/g,
    search:   /location\.search/g,
    'href =': /location\.href\s*=/g
  },

  path:        /("|')(\/[\w\d?&=#.!:_-][\w\d?/&=#.!:_-]*?)\1/g,
  postMessage: /postMessage\(/g,

  sessionStorage: {
    getItem: /sessionStorage\.getItem/g,
    setItem: /sessionStorage\.setItem/g,
    'x =':   /sessionStorage(?:\.[^(\s]+|\[[^\]]+\])\s*=/g
  },

  url: urlRegex()
}

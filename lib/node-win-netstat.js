'use strict'

const os = require('os')
const activator = require('./activator')
const parser = require('./parser.js')
const pkg = require('../package')

// into the wild with you, beauty
module.exports = (cb) => {
  if(os.platform() != 'win32'){
    return cb('Error: Platform not supported')
  }
  return activator(result => cb(result))
}

module.exports.version = pkg.version

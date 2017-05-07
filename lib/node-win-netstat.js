const activator = require('./activator')
const parser = require('./parser.js')
const pkg = require('../package');

// into the wild with you, beauty
module.exports = (options,cb) => {
  options = options || {}
  options.platform = options.platform || os.platform();

  if(options.platform != 'win32'){
    return cb('Error: Platform not supported')
  }
  let syncType = options.sync ? 'sync':'async'
  return activator[syncType](result => cb(result))
}

module.exports.version = pkg.version

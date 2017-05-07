'use strict'

const os = require('os')
const c_proc = require('child_process')
const winston = require('winston')
const parser = require('./parser.js')

// functions for setting up and returning netstat commands.
module.exports = {
  async : cb => {
    // create childprocess
    var proc = c_proc.spawn('netstat', ['-aon']);
    var rawOutput =  ''
    // prepare for process closing.
    proc.on('error', err => winston.error('Error when executing  netstat -aon: ', err))
    proc.on('close', (exitCode, signal) => {
      // if exitcode is 0 or not available, all is good, send rawOutput from stream to
      if(!exitCode) {
        cb(parser(rawOutput))
      }
      else {
        winston.error('netstat -aon exited with: ', {code:exitCode, signal:signal})
        return
      }
    })

    // when receiving data from stdout, place it into the rawOutput variable
    proc.stdout.on('data', data => {
      // data is a buffer stream
      rawOutput +=  data.toString()
    })
  }
}

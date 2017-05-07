'use strict'

// parses output of windows netstat command.
module.exports = rawOutput => {
  rawOutput = rawOutput.split(/\n/g)

  let output = {}
  rawOutput.forEach(function(line,i) {
    // for each line in the output.
    if (i < 4) return // preventing headers from being parsed.

    // split line into collums
    line = line.split(/\s/g).filter(String)
    if(line.length < 2) return
    // first collumn is always protocol.
    let protocol  = line.shift()
    if(!output[protocol]) output[protocol] = []

    // last : always denotes port.
    var localPort = line[0].split(':').pop()
    // last : always denotes port.
    var remotePort = line[1].split(':').pop()

    let process = {
      local : {
        adress: line[0],
        port: localPort
      },
      remote : {
        adress : line[1],
        port: remotePort
      },
      pid : line.pop(),            // popping off the last collumn as the PID
      state : line[2] || null      // now the last column the 3rd column is either state, or empty.
    }

    output[protocol].push(process)
  })
  // TODO:
  return output
}

const os = require('os');
const c_proc = require('child_process');
const winston = require('winston'); //logging utility

//functions for setting up and returning netstat commands.
const getPorts = {
  async : cb =>{
    //create childprocess
    var proc = c_proc.spawn('netstat',['-aon']);
    var rawOutput =  '';
    ///prepare for process closing.
    proc.on('error', err => winston.error('error when executing  netstat -aon: ',err));
    proc.on('close', (exitCode,signal)=>{
      if(!exitCode){ //if exitcode is 0 or not available, all is good, send rawOutput from stream to
        cb(parseOutput(rawOutput));
      }
      else{
        winston.error('netstat -aon exited with: ',{code:exitCode, signal:signal});
        return;
      }
    });

    //when receiving data from stdout, place it into a raw Output variable
    proc.stdout.on('data', data=> {
      rawOutput +=  data.toString();
    }); //data is a buffer stream,
  }
};


//parses output of windows netstat command.
function parseOutput(rawOutput){
  rawOutput = rawOutput.split(/\n/g);

  let output = {};
  rawOutput.forEach(function(line,i){//for each line in the output.
    if(i < 4 ) return; //preventing headers from being parsed.

    line = line.split(/\s/g).filter(String);               //split line into collums
    if(line.length < 2) return;
    let protocol  = line.shift();                   //first collumn is always protocol.
    if(!output[protocol]) output[protocol] = [];

    var localPort = line[0].split(':').pop();   //last : always denotes port.
    var remotePort = line[1].split(':').pop();   //last : always denotes port.

    let process = {
      local : {
        adress: line[0],
        port: localPort
      },
      remote : {
        adress : line[1],
        port: remotePort
      },
      pid : line.pop(),            //popping off the last collumn as the PID
      state : line[2] || null      //now the last column the 3rd column is either state, or empty.
    };

    output[protocol].push(process);
  });
  return {output}; //TODO:
}

//into the wild with you, beauty
module.exports = function(options,cb){
  options = options || {};
  options.platform = options.platform || os.platform();

  if(options.platform != 'win32'){
    cb('platform not supported');
    return 'platform not supported';
  }
  let syncType = options.sync ? 'sync':'async';
  getPorts[syncType](result => cb(result));

};

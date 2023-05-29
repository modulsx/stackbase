
const fs = require('fs');
const config = require('../config')

const readLogsReverse = async (params) => {
  let { filePath, nextKey: endBytes = null, linesPerRequest = config.APP_DEFAULTS.LINES_PER_REQUEST } = params
  endBytes = parseInt(endBytes)
  linesPerRequest = parseInt(linesPerRequest)
  return new Promise((resolve) => {
    if(!filePath || linesPerRequest < 1 || linesPerRequest === NaN || endBytes === 0){
      console.error('Input params error : ', {filePath, linesPerRequest, endBytes})
      return resolve({lines: [], nextKey: -1, linesPerRequest: config.APP_DEFAULTS.LINES_PER_REQUEST})
    }
    const fileSize = fs.statSync(filePath).size - 1
    const end = endBytes && endBytes !== NaN && endBytes > 0? endBytes : fileSize
    const dataSize = (linesPerRequest * 200)
    const start = Math.max(0, end - dataSize + 1 );
    // console.log('Poles : ', start, end)
    // console.log('Diff : ',end - start)
    let data = '';
    const logFile = fs.createReadStream(filePath, {start, end });
    logFile.on('data', function(chunk) {
      data += chunk.toString(); 
    });
    logFile.on('end', function() {
      // console.log(JSON.stringify(data))
      // console.log('Return : ',Buffer.byteLength(data, 'utf-8'))
      const noLines = data.indexOf("\n") === -1
      data = data.trim().split('\n')
      data = data.slice(-(linesPerRequest+1));
      if(data.length > linesPerRequest){
        data.shift()
      }
      const sentDateSize = Buffer.byteLength(data.join('\n'), 'utf-8')
      const nextKey = (end - sentDateSize)
      return resolve({lines: data, nextKey : nextKey, linesPerRequest, isSameLine: noLines });
    });
  })
}

module.exports = { readLogsReverse }
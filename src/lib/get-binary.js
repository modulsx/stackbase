function fetch(url) {
    return new Promise((resolve, reject) => {
      https.get(url, res => {
        if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location)
          return fetch(res.headers.location).then(resolve, reject);
        if (res.statusCode !== 200)
          return reject(new Error(`Server responded with ${res.statusCode}`));
        let chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      }).on('error', reject);
    });
}

function extractFileFromTarGzip(buffer, subpath){
    try {
      buffer = zlib.unzipSync(buffer);
    } catch (err) {
      throw new Error(`Invalid gzip data in archive: ${err && err.message || err}`);
    }
    let str = (i, n) => String.fromCharCode(...buffer.subarray(i, i + n)).replace(/\0.*$/, '');
    let offset = 0;
    subpath = `package/${subpath}`;
    while (offset < buffer.length) {
      let name = str(offset, 100);
      let size = parseInt(str(offset + 124, 12), 8);
      offset += 512;
      if (!isNaN(size)) {
        if (name === subpath) return buffer.subarray(offset, offset + size);
        offset += (size + 511) & ~511;
      }
    }
    throw new Error(`Could not find ${JSON.stringify(subpath)} in archive`);
}
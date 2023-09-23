

exports.recieveArgs = async (request) => {
  const requestBuffers = [];

  return new Promise((resolve, reject) => {
    request.on('data', chunk => {
      requestBuffers.push(chunk)
    })

    request.on('end', () => {
      const body = Buffer.concat(requestBuffers).toString();
      resolve(body)
    })

    request.on('error', err => {
      reject(err)
    })
  })
};


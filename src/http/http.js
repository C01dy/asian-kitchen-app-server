const http = require('http')
const { recieveArgs } = require('@util/recieveArgs')
const { CustomHttpError } = require('@error')

module.exports = (routing, port) => {
  http.createServer(async (req, res) => {
    const { url, socket } = req
    const [name, method, id] = url.substring(1).split('/')

    const entity = routing[name]

    if (!entity) {
      throw new CustomHttpError(400, `Entity '${name}' not found`)
    }

    const handler = entity[method]

    if (!handler) {
      throw new CustomHttpError(400, `Service '${name}' has not '${method}' method`)
    }

    const src = handler.toString()
    const signature = src.substring(0, src.indexOf(')'));
    const args = []
    if (signature.includes('(id')) args.push(id);
    const bodyJson = await recieveArgs(req)

    if (bodyJson.trim()) {
      const body = JSON.parse(bodyJson)
      if (signature.includes('{')) args.push(body);
    }

    const result = handler(...args)

    res.end(JSON.stringify(result.rows))
  }).listen(port)

}

const { randomUUID, createHmac } = require('crypto')

/**
  Creates a JSON Web Token (JWT) with the given secret key;
  @param {string} secret - The secret key used to sign the JWT.
  @returns {string} The JWT token.
*/
exports.createJWT = (secret) => {
  const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' })
  const payload = JSON.stringify({ userId: randomUUID() })

  const base64UrlHeader = Buffer.from(header).toString('base64url')
  const base64UrlPayload = Buffer.from(payload).toString('base64url')

  const unsignedToken = `${base64UrlHeader}.${base64UrlPayload}`

  const hmac = createHmac('sha256', secret)
  hmac.update(unsignedToken)
  const base64UrlSignature = Buffer.from(hmac.digest()).toString('base64url')

  const token = `${base64UrlHeader}.${base64UrlPayload}.${base64UrlSignature}`

  return token
}

/**

  Verifies the given JWT token with the given secret key and returns a boolean indicating whether the token is valid.
  @param {string} token - The JWT token to verify.
  @param {string} secret - The secret key used to sign the JWT.
  @returns {boolean} A boolean indicating whether the token is valid.
*/
exports.verifyJWT = (token, secret) => {
  const [base64UrlHeader, base64UrlPayload, base64UrlSignature] = token.split('.')

  // const header = JSON.parse(Buffer.from(base64UrlHeader, 'base64url'))
  // const payload = JSON.parse(Buffer.from(base64UrlPayload, 'base64url'))
  const signature = Buffer.from(base64UrlSignature, 'base64url')

  const hmac = createHmac('sha256', secret)
  hmac.update(`${base64UrlHeader}.${base64UrlPayload}`)
  const recreatedSignature = hmac.digest()

  return signature.equals(recreatedSignature)
}




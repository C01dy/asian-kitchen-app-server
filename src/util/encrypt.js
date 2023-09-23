'use struct'
const { createHash } = require('crypto')

exports.createPasswordHash = (password) => createHash('sha256').update(password).digest('hex')
exports.compareHashPassword = (password, hashedPassword) => createPasswordHash(password) === hashedPassword
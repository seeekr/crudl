require('babel-polyfill')
const Bluebird = require('bluebird')

global.Promise = Bluebird

Promise.config({ warnings: false })

const crudl = require('./Crudl')

module.exports = crudl
module.exports.default = crudl

require('babel-polyfill')
const Bluebird = require('bluebird')

global.Promise = Bluebird

Promise.config({ warnings: false })

const Crudl = require('./src/Crudl')
const license = require('./package.json').license

if (typeof window.console !== 'undefined') {
    window.console.log(`CRUDL LICENSE: ${license}`)
}

module.exports = Crudl

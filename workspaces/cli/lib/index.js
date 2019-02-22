const messages = require('./messages')

module.exports = function hushHushApp(opts) {
  console.log(messages.welcomeMessage(opts.recipient))
}


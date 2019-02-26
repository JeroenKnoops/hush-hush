#! /usr/bin/env node

const chalk = require('chalk')
const program = require('commander')
const HushHush = require('../lib/hush-hush').default
const pkg = require('../package.json')

const messages = require('../lib/messages')

let recipient
let secret

program
  .version(pkg.version)
  .arguments('<recipient> <secret>')
  .usage(`${chalk.green('<recipient> <secret>')} [options]`)
  .action(function (recipientAction, secretAction) {
    recipient = recipientAction
    secret = secretAction
  })
  .allowUnknownOption()
  .on('--help', messages.help)
  .parse(process.argv)

const hushHush = new HushHush({
  recipient,
  secret
})

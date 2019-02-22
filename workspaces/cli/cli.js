#! /usr/bin/env node

const chalk = require('chalk')
const program = require('commander')
const lib = require('.')
const pkg = require('./package.json')

const messages = lib.messages
const hushHushApp = lib.hushHushApp

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

hushHushApp({
  recipient,
  secret
})

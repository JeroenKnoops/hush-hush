const chalk = require('chalk')

exports.help = function() {
  return `
    Both ${chalk.green('<recipient>')} and ${chalk.green('<secret>')} are required.
    If you have any problems, do not hesitate to file an issue:
      ${chalk.cyan('https://github.com/charterhouse/hush-hush/issues/new')}
  `
}

exports.welcomeMessage = function (recipient) {
  return `
  welcome ${chalk.bold(chalk.green(recipient))}...
`
}

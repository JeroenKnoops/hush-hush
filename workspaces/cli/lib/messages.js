"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _chalk = _interopRequireDefault(require("chalk"));

exports.help = function () {
  return "\n    Both ".concat(_chalk.default.green('<recipient>'), " and ").concat(_chalk.default.green('<secret>'), " are required.\n    If you have any problems, do not hesitate to file an issue:\n      ").concat(_chalk.default.cyan('https://github.com/charterhouse/hush-hush/issues/new'), "\n  ");
};

exports.welcomeMessage = function (recipient) {
  return "\n  welcome ".concat(_chalk.default.bold(_chalk.default.green(recipient)), "...\n");
};
//# sourceMappingURL=messages.js.map
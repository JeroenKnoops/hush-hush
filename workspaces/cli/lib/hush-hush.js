"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _qrcode = _interopRequireDefault(require("qrcode"));

var _messages = _interopRequireDefault(require("./messages"));

var _telepathJs = require("@cogitojs/telepath-js");

var HushHush =
/*#__PURE__*/
function () {
  function HushHush(opts) {
    (0, _classCallCheck2.default)(this, HushHush);
    this.opts = opts;
    this.welcome();
    this.setupTelepath();
  }

  (0, _createClass2.default)(HushHush, [{
    key: "welcome",
    value: function welcome() {
      console.log(_messages.default.welcomeMessage(this.opts.recipient));
    }
  }, {
    key: "telepathChannel",
    value: function () {
      var _telepathChannel = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        var telepathChannel;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.telepath.createChannel({
                  appName: 'Hush Hush'
                });

              case 2:
                telepathChannel = _context.sent;
                return _context.abrupt("return", telepathChannel);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function telepathChannel() {
        return _telepathChannel.apply(this, arguments);
      }

      return telepathChannel;
    }()
  }, {
    key: "setupTelepath",
    value: function () {
      var _setupTelepath = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2() {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.telepath = new _telepathJs.Telepath('https://telepath.cogito.mobi');
                _context2.next = 3;
                return this.telepathChannel();

              case 3:
                this.telepathChannel = _context2.sent;
                console.log(this.qrcode(this.telepathChannel.createConnectUrl('https://cogito.mobi')));

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function setupTelepath() {
        return _setupTelepath.apply(this, arguments);
      }

      return setupTelepath;
    }()
  }, {
    key: "qrcode",
    value: function qrcode(connectUrl) {
      console.log(connectUrl);
      return _qrcode.default.toString(connectUrl, {
        type: 'terminal'
      }, function (err, output) {
        if (err) throw err;
        return output;
      });
    }
  }]);
  return HushHush;
}();

exports.default = HushHush;
//# sourceMappingURL=hush-hush.js.map
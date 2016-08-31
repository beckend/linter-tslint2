'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

exports.spawnWorker = spawnWorker;
exports.showError = showError;

var _atom = require('atom');

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _processCommunication = require('process-communication');

var _path = require('path');

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function spawnWorker() {
  var env = (0, _create2.default)(process.env);

  delete env.NODE_PATH;
  delete env.NODE_ENV;
  delete env.OS;

  var child = _child_process2.default.fork((0, _path.join)(__dirname, 'worker.js'), [], { env: env, silent: true });
  var worker = (0, _processCommunication.createFromProcess)(child);

  child.stdout.on('data', function (chunk) {
    console.log('[' + _constants.CONSOLE_PLUGIN_NAME + '] STDOUT', chunk.toString());
  });
  child.stderr.on('data', function (chunk) {
    console.log('[' + _constants.CONSOLE_PLUGIN_NAME + '] STDERR', chunk.toString());
  });

  return {
    worker: worker,
    subscription: new _atom.Disposable(function () {
      worker.kill();
    })
  };
} /* eslint no-console: 0 */
// eslint-disable-next-line
function showError(givenMessage) {
  var givenDetail = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

  var detail = void 0;
  var message = void 0;
  if (message instanceof Error) {
    detail = message.stack;
    message = message.message;
  } else {
    detail = givenDetail;
    message = givenMessage;
  }
  atom.notifications.addError('[' + _constants.CONSOLE_PLUGIN_NAME + '] ' + message, {
    detail: detail,
    dismissable: true
  });
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _atom = require('atom');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _helpers = require('./helpers');

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LinterTslint = function () {
  function LinterTslint() {
    (0, _classCallCheck3.default)(this, LinterTslint);
    this.config = {
      rulesDirectory: {
        type: 'string',
        title: 'Custom rules directory (absolute path)',
        default: ''
      },
      useLocalTslint: {
        type: 'boolean',
        title: 'Try using the local tslint package (if exist)',
        default: true
      }
    };
    this.workerActive = true;
    this.worker = null;
    this.userConfig = {
      rulesDirectory: '',
      useLocalTslint: true
    };
  }

  // Worker


  // User settings, observed and updated


  (0, _createClass3.default)(LinterTslint, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      require('atom-package-deps').install(_constants.PACKAGE_NAME);

      this.subscriptions = new _atom.CompositeDisposable();
      this.scopes = ['source.ts', 'source.tsx'];
      this.subscriptions.add(atom.config.observe(_constants.PACKAGE_NAME + '.rulesDirectory', function (dir) {
        if (dir && _path2.default.isAbsolute(dir)) {
          if (_this.__TEST__) {
            try {
              var stats = _fs2.default.statSync(dir);
              if (stats && stats.isDirectory()) {
                _this.userConfig.rulesDirectory = dir;
              }
            } catch (er) {
              console.log('[' + _constants.CONSOLE_PLUGIN_NAME + '] -', er);
            }
          } else {
            _fs2.default.stat(dir, function (er, stats) {
              if (er) {
                console.log('[' + _constants.CONSOLE_PLUGIN_NAME + '] -', er);
              } else if (stats && stats.isDirectory()) {
                _this.userConfig.rulesDirectory = dir;
              }
            });
          }
        }
      }));

      this.subscriptions.add(atom.config.observe(_constants.PACKAGE_NAME + '.useLocalTslint', function (use) {
        _this.userConfig.useLocalTslint = use;
      }));

      var initializeWorker = function initializeWorker() {
        var _spawnWorker = (0, _helpers.spawnWorker)();

        var worker = _spawnWorker.worker;
        var subscription = _spawnWorker.subscription;

        _this.worker = worker;
        _this.subscriptions.add(subscription);
        worker.onDidExit(function () {
          if (_this.workerActive) {
            (0, _helpers.showError)('Worker died unexpectedly', 'Check your console for more ' + 'info. A new worker will be spawned.');
            setTimeout(initializeWorker, 1000);
          }
        });
      };
      initializeWorker();
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.workerActive = false;
      this.subscriptions.dispose();
    }
  }, {
    key: 'provideLinter',
    value: function provideLinter() {
      var _this2 = this;

      return {
        name: _constants.PACKAGE_NAME,
        grammarScopes: this.scopes,
        scope: 'file',
        lintOnFly: true,
        lint: function () {
          var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(textEditor) {
            var text, filePath, projectPaths;
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    text = textEditor.getText();

                    if (!(text.length === 0)) {
                      _context.next = 3;
                      break;
                    }

                    return _context.abrupt('return', []);

                  case 3:
                    filePath = textEditor.getPath();
                    projectPaths = atom.project.getPaths();
                    _context.next = 7;
                    return _this2.worker.request('job', {
                      contents: text,
                      type: 'lint',
                      config: _this2.userConfig,
                      filePath: filePath,
                      projectPaths: projectPaths
                    });

                  case 7:
                    return _context.abrupt('return', _context.sent);

                  case 8:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, _this2);
          }));

          return function lint(_x) {
            return _ref.apply(this, arguments);
          };
        }()
      };
    }
  }]);
  return LinterTslint;
}(); /* eslint no-console: 0 */
// eslint-disable-next-line


LinterTslint.__TEST__ = false;
exports.default = new LinterTslint();
module.exports = exports['default'];
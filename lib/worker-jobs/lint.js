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

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _workerHelper = require('../worker-helper');

var _workerHelper2 = _interopRequireDefault(_workerHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LintJob = function () {
  function LintJob() {
    var _this = this;

    (0, _classCallCheck3.default)(this, LintJob);
    this.tslintProgram = null;
    this.lastConfigurationPath = null;
    this.lastProjectPath = null;

    this.lint = function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref2) {
        var contents = _ref2.contents;
        var config = _ref2.config;
        var filePath = _ref2.filePath;
        var projectPaths = _ref2.projectPaths;
        var Linter, configurationPath, configuration, program, rulesDirectory, linter, lintResult;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _workerHelper2.default.getLinter({ config: config, filePath: filePath });

              case 2:
                Linter = _context.sent;
                configurationPath = Linter.findConfigurationPath(null, filePath);
                configuration = Linter.loadConfigurationFromPath(configurationPath);
                program = _this.getTslintProgram({
                  Linter: Linter,
                  configurationPath: configurationPath,
                  projectPath: projectPaths[0]
                });

                // Apply user rulesDirectory

                rulesDirectory = configuration.rulesDirectory;

                if (rulesDirectory) {
                  (function () {
                    var configurationDir = _path2.default.dirname(configurationPath);
                    if (!Array.isArray(rulesDirectory)) {
                      rulesDirectory = [rulesDirectory];
                    }
                    rulesDirectory = rulesDirectory.map(function (dir) {
                      if (_path2.default.isAbsolute(dir)) {
                        return dir;
                      }
                      return _path2.default.join(configurationDir, dir);
                    });

                    if (config.rulesDirectory) {
                      rulesDirectory.push(config.rulesDirectory);
                    }
                  })();
                }

                // Create and lint
                linter = new Linter(filePath, contents, {
                  formatter: 'json',
                  configuration: configuration,
                  rulesDirectory: rulesDirectory
                }, program);
                lintResult = linter.lint();

                if (lintResult.failureCount) {
                  _context.next = 12;
                  break;
                }

                return _context.abrupt('return', []);

              case 12:
                return _context.abrupt('return', lintResult.failures.map(function (failure) {
                  var startPosition = failure.getStartPosition().getLineAndCharacter();
                  var endPosition = failure.getEndPosition().getLineAndCharacter();
                  return {
                    type: 'Warning',
                    text: failure.getRuleName() + ' - ' + failure.getFailure(),
                    filePath: _path2.default.normalize(failure.getFileName()),
                    range: [[startPosition.line, startPosition.character], [endPosition.line, endPosition.character]]
                  };
                }));

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();
  }

  // No need to create same program over and over


  (0, _createClass3.default)(LintJob, [{
    key: 'getTslintProgram',
    value: function getTslintProgram(_ref3) {
      var Linter = _ref3.Linter;
      var configurationPath = _ref3.configurationPath;
      var projectPath = _ref3.projectPath;

      if (configurationPath === this.lastConfigurationPath && projectPath === this.lastProjectPath && this.tslintProgram !== null) {
        return this.tslintProgram;
      }

      this.tslintProgram = Linter.createProgram(configurationPath, projectPath);
      return this.tslintProgram;
    }
  }]);
  return LintJob;
}();

exports.default = new LintJob();
module.exports = exports['default'];
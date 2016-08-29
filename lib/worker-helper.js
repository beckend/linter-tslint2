'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _resolve = require('resolve');

var _resolve2 = _interopRequireDefault(_resolve);

var _loophole = require('loophole');

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WorkerHelper = function () {
  function WorkerHelper() {
    (0, _classCallCheck3.default)(this, WorkerHelper);
    this.tslintCache = new _map2.default();
    this.tslintDef = (0, _loophole.allowUnsafeNewFunction)(function () {
      return require(_constants.TSLINT_MODULE_NAME);
    });
  }

  (0, _createClass3.default)(WorkerHelper, [{
    key: 'getLinter',
    value: function getLinter(_ref) {
      var filePath = _ref.filePath;
      var config = _ref.config;

      var basedir = _path2.default.dirname(filePath);
      var linter = this.tslintCache.get(basedir);
      if (linter) {
        return _promise2.default.resolve(linter);
      }

      if (config.useLocalTslint) {
        return this.getLocalLinter({ basedir: basedir });
      }

      this.tslintCache.set(basedir, this.tslintDef);
      return _promise2.default.resolve(this.tslintDef);
    }
  }, {
    key: 'getLocalLinter',
    value: function getLocalLinter(_ref2) {
      var _this = this;

      var basedir = _ref2.basedir;

      return new _promise2.default(function (resolve) {
        (0, _resolve2.default)(_constants.TSLINT_MODULE_NAME, {
          basedir: basedir
        }, function (err, linterPath, pkg) {
          var linter = void 0;
          if (!err && pkg && pkg.version.startsWith('3.')) {
            linter = (0, _loophole.allowUnsafeNewFunction)(function () {
              return require(linterPath);
            });
          } else {
            linter = _this.tslintDef;
          }
          _this.tslintCache.set(basedir, linter);
          return resolve(linter);
        });
      });
    }
  }]);
  return WorkerHelper;
}();

exports.default = new WorkerHelper();
module.exports = exports['default'];
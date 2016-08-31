'use strict';

var _processCommunication = require('process-communication');

var _atomLinter = require('atom-linter');

var _lint = require('./worker-jobs/lint');

var _lint2 = _interopRequireDefault(_lint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.title = 'linter-eslint helper';

(0, _processCommunication.create)().onRequest('job', function (_ref, job) {
  var contents = _ref.contents;
  var type = _ref.type;
  var config = _ref.config;
  var filePath = _ref.filePath;
  var projectPaths = _ref.projectPaths;

  if (config.disableFSCache) {
    _atomLinter.FindCache.clear();
  }
  if (type === 'lint') {
    job.response = _lint2.default.lint({ contents: contents, config: config, filePath: filePath, projectPaths: projectPaths });
  }
});

process.exit = function () {/* Dunno if needed */};
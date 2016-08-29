// import * as Helpers from './worker-helpers';
import { create } from 'process-communication';
import { FindCache } from 'atom-linter';
import lintJob from './worker-jobs/lint';

process.title = 'linter-eslint helper';

create().onRequest('job', ({ contents, type, config, filePath, projectPaths }, job) => {
  if (config.disableFSCache) {
    FindCache.clear();
  }
  //
  if (type === 'lint') {
    job.response = lintJob.lint({ contents, config, filePath, projectPaths });
  }
});

process.exit = function () { /* Dunno if needed */ };

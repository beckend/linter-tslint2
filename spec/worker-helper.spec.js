'use babel';

import workerHelper from '../lib/worker-helper';
import {
  PATH_FILE_GOOD
} from './spec-helpers/paths';

describe('Worker Helpers', () => {
  it('tries to find a non local linter', () => {
    waitsForPromise(() =>
      workerHelper.getLinter({
        filePath: PATH_FILE_GOOD,
        config: {
          useLocalTslint: false
        }
      })
        .then(linter => {
          expect(typeof linter).toBe('function');
        })
    );
  });

  it('tries to find a local linter', () => {
    waitsForPromise(() =>
      workerHelper.getLinter({
        filePath: PATH_FILE_GOOD,
        config: {
          useLocalTslint: true
        }
      })
        .then(linter => {
          expect(typeof linter).toBe('function');
        })
    );
  });
});

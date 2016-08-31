'use babel';

import fs from 'fs';
import lintJob from '../lib/worker-jobs/lint';
import { PATH_ROOT, PATH_FILE_WARNING } from './spec-helpers/paths';

describe('Worker jobs - lint', () => {
  it('Lints successfully', () => {
    const fileContent = fs.readFileSync(PATH_FILE_WARNING, { encoding: 'utf8' });
    waitsForPromise(() => lintJob.lint({
      contents: fileContent,
      config: {
        rulesDirectory: ''
      },
      filePath: PATH_FILE_WARNING,
      projectPaths: [ PATH_ROOT ]
    }).then(result => {
      expect(result[0].type).toBe('Warning');
      expect(result[0].text.indexOf('no-unused-variable')).toEqual(0);
      expect(result[0].filePath).toBe(PATH_FILE_WARNING);
      expect(result[0].range).toEqual([ [ 0, 6 ], [ 0, 7 ] ]);
    }));
  });
});

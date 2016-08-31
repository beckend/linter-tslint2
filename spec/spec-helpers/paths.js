'use babel';

import * as path from 'path';

export const PATH_ROOT = path.join(__dirname, '../..');
export const PATH_SPEC = path.join(PATH_ROOT, 'spec');

export const PATH_FIXTURES = path.join(PATH_SPEC, 'fixtures');
export const PATH_FILE_WARNING = path.join(PATH_FIXTURES, 'syntax', 'warning.ts');
export const PATH_FILE_EMPTY = path.join(PATH_FIXTURES, 'empty.ts');
export const PATH_FILE_GOOD = path.join(PATH_FIXTURES, 'good.ts');

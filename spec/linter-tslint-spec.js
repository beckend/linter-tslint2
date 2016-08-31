'use babel';

import linter from '../lib/main';
import { PACKAGE_NAME } from '../lib/constants';
import {
  PATH_FILE_GOOD,
  PATH_FILE_WARNING,
  PATH_FILE_EMPTY
} from './spec-helpers/paths';

describe('The Tslint provider for Linter', () => {
  const lint = linter.provideLinter().lint;

  beforeEach(() => {
    waitsForPromise(() =>
      atom.packages.activatePackage(PACKAGE_NAME)
    );
    waitsForPromise(() =>
      atom.packages.activatePackage('language-javascript')
    );
    waitsForPromise(() =>
      atom.workspace.open(PATH_FILE_GOOD)
    );
  });

  afterEach(() => {
    linter.__TEST__ = false;
  });

  it('should be in the packages list', () =>
    expect(atom.packages.isPackageLoaded(PACKAGE_NAME)).toBe(true)
  );

  it('should be an active package', () =>
    expect(atom.packages.isPackageActive(PACKAGE_NAME)).toBe(true)
  );

  describe('shows errors in a file with issues', () => {
    let editor = null;
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(PATH_FILE_WARNING).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('verifies the first message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages[0].type).toBe('Warning');
          expect(messages[0].text).toBe("no-unused-variable - Unused variable: 'a'");
          expect(messages[0].filePath).toBe(PATH_FILE_WARNING);
          expect(messages[0].range).toEqual([ [ 0, 6 ], [ 0, 7 ] ]);
        })
      );
    });
  });

  it('finds nothing wrong with an empty file', () => {
    waitsForPromise(() =>
      atom.workspace.open(PATH_FILE_EMPTY).then(editor =>
        lint(editor).then(messages => {
          expect(messages.length).toBe(0);
        })
      )
    );
  });

  it('finds nothing wrong with a valid file', () => {
    waitsForPromise(() =>
      atom.workspace.open(PATH_FILE_GOOD).then(editor =>
        lint(editor).then(messages => {
          expect(messages.length).toBe(0);
        })
      )
    );
  });

  it('Updates user config - useLocalTslint', () => {
    expect(linter.userConfig.useLocalTslint)
      .toBe(true);
    atom.config.set(`${PACKAGE_NAME}.useLocalTslint`, false);
    expect(linter.userConfig.useLocalTslint)
      .toBe(false);
  });

  it('Updates user config - rulesDirectory', () => {
    // Fallback to sync test
    linter.__TEST__ = true;
    // Fail on invalid dir
    expect(linter.userConfig.rulesDirectory)
      .toBe('');
    atom.config.set(`${PACKAGE_NAME}.rulesDirectory`, 'Invalid dir');
    expect(linter.userConfig.rulesDirectory)
      .toBe('');
    // Success
    atom.config.set(`${PACKAGE_NAME}.rulesDirectory`, PATH_FILE_GOOD);
    expect(linter.userConfig.rulesDirectory)
      .toBe(PATH_FILE_GOOD);
  });
});

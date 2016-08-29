'use babel';

import * as path from 'path';
import linter from '../lib/main';

const packageName = 'linter-tslint2';

const fixturesPath = path.join(__dirname, 'fixtures');
const warningPath = path.join(fixturesPath, 'syntax', 'warning.ts');
// const badSyntaxPath = path.join(fixturesPath, 'syntax', 'bad.ts');
const emptyPath = path.join(fixturesPath, 'empty.ts');
const goodPath = path.join(fixturesPath, 'good.ts');

describe('The Tslint provider for Linter', () => {
  const lint = linter.provideLinter().lint;

  beforeEach(() => {
    waitsForPromise(() =>
      atom.packages.activatePackage(packageName)
    );
    waitsForPromise(() =>
      atom.packages.activatePackage('language-javascript')
    );
    waitsForPromise(() =>
      atom.workspace.open(fixturesPath)
    );
  });

  it('should be in the packages list', () =>
    expect(atom.packages.isPackageLoaded(packageName)).toBe(true)
  );

  it('should be an active package', () =>
    expect(atom.packages.isPackageActive(packageName)).toBe(true)
  );

  describe('shows errors in a file with issues', () => {
    let editor = null;
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(warningPath).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('verifies the first message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages[0].type).toBe('Warning');
          expect(messages[0].text).toBe("no-unused-variable - Unused variable: 'a'");
          expect(messages[0].filePath).toBe(warningPath);
          expect(messages[0].range).toEqual([ [ 0, 6 ], [ 0, 7 ] ]);
        })
      );
    });
  });

  it('finds nothing wrong with an empty file', () => {
    waitsForPromise(() =>
      atom.workspace.open(emptyPath).then(editor =>
        lint(editor).then(messages => {
          expect(messages.length).toBe(0);
        })
      )
    );
  });

  it('finds nothing wrong with a valid file', () => {
    waitsForPromise(() =>
      atom.workspace.open(goodPath).then(editor =>
        lint(editor).then(messages => {
          expect(messages.length).toBe(0);
        })
      )
    );
  });

  // describe('shows syntax errors', () => {
  //   let editor = null;
  //   beforeEach(() => {
  //     waitsForPromise(() =>
  //       atom.workspace.open(badSyntaxPath).then(openEditor => {
  //         editor = openEditor;
  //       })
  //     );
  //   });
  //
  //   it('verifies the first message', () => {
  //     waitsForPromise(() =>
  //       lint(editor).then(messages => {
  //         expect(JSON.stringify(messages)).toBe('ok');
  //         expect(messages[0].type).toBe('Error');
  //         expect(messages[0].text).not.toBeDefined();
  //         expect(messages[0].filePath).toBe(badSyntaxPath);
  //         expect(messages[0].range).toEqual([ [ 0, 10 ], [ 0, 11 ] ]);
  //       })
  //     );
  //   });
  // });
});

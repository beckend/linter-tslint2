'use babel';

import * as helpers from '../lib/helpers';

describe('Helpers', () => {
  let spawnResult;
  afterEach(() => {
    if (spawnResult) {
      spawnResult
        .subscription
        .dispose();
      spawnResult.worker.kill();
    }
  });
  it('spawnWorker', () => {
    spawnResult = helpers.spawnWorker();
    expect(typeof spawnResult.worker.request).toBe('function');
    expect(typeof spawnResult.worker.onDidExit).toBe('function');
    expect(spawnResult.subscription).not.toEqual(undefined);
  });
});

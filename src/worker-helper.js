import path from 'path';
import requireResolve from 'resolve';
import { allowUnsafeNewFunction } from 'loophole';
import { TSLINT_MODULE_NAME } from './constants';

class WorkerHelper {

  tslintCache = new Map()
  tslintDef = allowUnsafeNewFunction(() => require(TSLINT_MODULE_NAME))

  getLinter({ filePath, config }) {
    const basedir = path.dirname(filePath);
    const linter = this
      .tslintCache
      .get(basedir);
    if (linter) {
      return Promise.resolve(linter);
    }

    if (config.useLocalTslint) {
      return this.getLocalLinter({ basedir });
    }

    this
      .tslintCache
      .set(basedir, this.tslintDef);
    return Promise.resolve(this.tslintDef);
  }

  getLocalLinter({ basedir }) {
    return new Promise(resolve => {
      requireResolve(TSLINT_MODULE_NAME, {
        basedir
      }, (err, linterPath, pkg) => {
        let linter;
        if (!err && pkg && pkg.version.startsWith('3.')) {
          linter = allowUnsafeNewFunction(() => require(linterPath));
        } else {
          linter = this.tslintDef;
        }
        this
          .tslintCache
          .set(basedir, linter);
        return resolve(linter);
      });
    });
  }

}

export default new WorkerHelper();
